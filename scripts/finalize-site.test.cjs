const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const script = path.join(__dirname, 'finalize-site.cjs');
function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'site-build-test-'));
  function put(file, text) { fs.mkdirSync(path.dirname(path.join(dir,file)), {recursive:true}); fs.writeFileSync(path.join(dir,file), text); }
  put('Portfolio/_posts/personal-projects/test.md', 'test');
  put('_site/Portfolio/build-manifest.json', JSON.stringify([{ source:'_posts/personal-projects/test.md', url:'/Portfolio/test/', title:'A "test"', summary:'A & B', image:'' }]));
  put('_site/Portfolio/test/index.html', '<html><head><title>Old</title></head><body><p>Summary</p><a href="/">Home</a></body></html>');
  put('_site/index.html', '<html><head></head><body><img src="/image.png"></body></html>');
  put('_site/image.png', 'image');
  put('_site/assets/css/site-overlays.css', 'body{}');
  put('_site/assets/js/site-overlays.js', 'void 0;');
  return {dir, put, run:()=>spawnSync(process.execPath,[script,'_site'],{cwd:dir,encoding:'utf8'})};
}
const fixtures=[];
try {
  const good=fixture(); fixtures.push(good); assert.equal(good.run().status,0);
  const html=fs.readFileSync(path.join(good.dir,'_site/Portfolio/test/index.html'),'utf8');
  assert.match(html,/og:title" content="A &quot;test&quot;"/);
  assert.match(html,/og:description" content="A &amp; B"/);
  assert.match(html,/site-overlays\.js\?v=[a-f0-9]{12}/);
  assert.equal((html.match(/site-overlays\.js/g)||[]).length,1);
  const changed=fixture(); fixtures.push(changed); changed.put('_site/assets/js/site-overlays.js','void 1;'); assert.equal(changed.run().status,0);
  assert.notEqual(fs.readFileSync(path.join(changed.dir,'_site/Portfolio/test/index.html'),'utf8').match(/site-overlays.js\?v=([a-f0-9]+)/)[1],html.match(/site-overlays.js\?v=([a-f0-9]+)/)[1]);
  const broken=fixture(); fixtures.push(broken); broken.put('_site/index.html','<head></head><body><img src="/missing.png"></body>'); assert.match(broken.run().stderr,/Broken internal paths/);
  const missing=fixture(); fixtures.push(missing); missing.put('Portfolio/_posts/personal-projects/missing.md','test'); assert.match(missing.run().stderr,/Post missing from build/);
  const absent=fixture(); fixtures.push(absent); fs.unlinkSync(path.join(absent.dir,'_site/Portfolio/test/index.html')); assert.match(absent.run().stderr,/Post HTML missing/);
  console.log('PASS: UI injection, escaped metadata, content-based cache versions, broken asset rejection, missing source/output rejection');
} finally {
  for (const {dir} of fixtures) {
    if (path.dirname(dir)!==os.tmpdir() || !path.basename(dir).startsWith('site-build-test-')) throw Error('Unexpected test directory');
    fs.rmSync(dir,{recursive:true,force:true});
  }
}
