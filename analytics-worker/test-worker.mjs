import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('./src/worker.js', import.meta.url), 'utf8');
const worker = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));

class MemoryStorage {
  constructor() { this.values = new Map(); }
  async get(key) { return this.values.get(key); }
  async put(key, value) { this.values.set(key, structuredClone(value)); }
  async list({ prefix = '', limit = Infinity } = {}) {
    return new Map([...this.values].filter(([key]) => key.startsWith(prefix)).sort(([a], [b]) => a.localeCompare(b)).slice(0, limit));
  }
}

const storage = new MemoryStorage();
const reportStore = new worker.CrawlerReportStore({ storage });
const env = {
  CRAWLER_REPORTS: {
    idFromName: name => name,
    get: () => ({ fetch: (url, options) => reportStore.fetch(new Request(url, options)) })
  }
};

const page = await worker.default.fetch(new Request('https://worker.example/crawler-report'), env);
assert.equal(page.status, 200);
assert.match(await page.text(), /소속 기관명/);
const dashboard = await worker.default.fetch(new Request('https://worker.example/'), env);
assert.match(await dashboard.text(), /크롤링 제출 기록/);

const payload = { organization:'테스트 기관', purpose:'포트폴리오 검토', crawler:'테스트 크롤러', reportedUrl:'https://mdj0126.github.io/Portfolio/' };
const submit = () => worker.default.fetch(new Request('https://worker.example/api/crawler-report', { method:'POST', headers:{ 'content-type':'application/json', 'user-agent':'CrawlerTest/1.0' }, body:JSON.stringify(payload) }), env);
assert.equal((await submit()).status, 201);
assert.equal((await submit()).status, 429);

const records = await (await reportStore.fetch(new Request('https://internal/records'))).json();
assert.equal(records.length, 1);
assert.equal(records[0].organization, payload.organization);
assert.equal(records[0].requesterHash, undefined);
assert.equal((await worker.default.fetch(new Request('https://worker.example/api/crawler-reports'), env)).status, 401);
assert.equal((await worker.default.fetch(new Request('https://worker.example/api/crawler-report', { method:'POST', body:'{}' }), env)).status, 415);

const automaticPayload = { pageUrl:'https://mdj0126.github.io/Resume/', signal:'navigator.webdriver' };
const automaticAccess = userAgent => worker.default.fetch(new Request('https://worker.example/api/crawler-access', { method:'POST', headers:{ origin:'https://mdj0126.github.io', 'content-type':'text/plain;charset=UTF-8', 'user-agent':userAgent }, body:JSON.stringify(automaticPayload) }), env);
const automatic = await automaticAccess('HeadlessTest/1.0');
assert.equal(automatic.status, 200);
assert.equal(automatic.headers.get('access-control-allow-origin'), 'https://mdj0126.github.io');
assert.equal((await automatic.json()).recorded, true);
assert.equal((await (await automaticAccess('HeadlessTest/1.0')).json()).reason, 'duplicate');
assert.equal((await worker.default.fetch(new Request('https://worker.example/api/crawler-access', { method:'POST', headers:{ origin:'https://example.com', 'content-type':'text/plain' }, body:JSON.stringify(automaticPayload) }), env)).status, 403);

const reportedSubmit = await worker.default.fetch(new Request('https://worker.example/api/crawler-report', { method:'POST', headers:{ 'content-type':'application/json', 'user-agent':'ReportedBot/1.0' }, body:JSON.stringify({ ...payload, crawler:'ReportedBot/1.0' }) }), env);
assert.equal(reportedSubmit.status, 201);
assert.equal((await (await automaticAccess('ReportedBot/1.0')).json()).reason, 'reported');
const finalRecords = await (await reportStore.fetch(new Request('https://internal/records'))).json();
assert.equal(finalRecords.length, 3);
assert.equal(finalRecords.filter(record => record.recordType === 'automatic').length, 1);

console.log('PASS: voluntary reports, automatic access records, deduplication, reported-user suppression, CORS, private records API');
