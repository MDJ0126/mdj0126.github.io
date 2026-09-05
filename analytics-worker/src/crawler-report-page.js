import crawlerReportMarkdown from "./crawler-report.md";

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderMarkdown(markdown) {
  return markdown.trim().split(/\r?\n\r?\n/).map(block => {
    const text = block.replace(/\r?\n/g, " ").trim();
    if (text.startsWith("# ")) return `<h1>${escapeHtml(text.slice(2))}</h1>`;
    if (text.startsWith("> ")) return `<p class="warning">${escapeHtml(text.slice(2))}</p>`;
    return `<p>${escapeHtml(text)}</p>`;
  }).join("");
}

export function crawlerReportHtml() {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>자동 수집 및 AI 열람 안내</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f5f7;color:#22252a;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif}.wrap{width:680px;max-width:calc(100% - 32px);margin:60px auto;padding:38px;background:#fff;border:1px solid #e7e9ed;border-radius:18px;box-shadow:0 8px 28px rgba(36,39,44,.07)}small{color:#f5821f;font-weight:700;letter-spacing:.1em}h1{margin:8px 0 18px;font-size:25px}p{color:#555;line-height:1.8}.warning{padding:14px 16px;border-left:3px solid #f5821f;background:#fff7ef;color:#333}label{display:block;margin:18px 0 6px;font-size:13px;font-weight:700}input,textarea{width:100%;padding:12px;border:1px solid #ccd0d5;border-radius:8px;background:#fff;color:#222;font:inherit}textarea{min-height:110px;resize:vertical}button{margin-top:20px;padding:12px 18px;border:0;border-radius:8px;background:#222;color:#fff;font-weight:700;cursor:pointer}.result{min-height:24px;margin-top:14px;font-size:13px}.api{margin-top:30px;padding-top:22px;border-top:1px solid #e7e9ed}pre{overflow:auto;padding:15px;background:#202124;color:#f5f5f5;border-radius:8px;font:12px/1.6 Consolas,monospace;white-space:pre-wrap}@media(max-width:600px){.wrap{margin:20px auto;padding:24px}}</style></head><body><main class="wrap"><small>CRAWLER REPORT</small>${renderMarkdown(crawlerReportMarkdown)}<form id="report"><label for="organization">소속 기관명</label><input id="organization" name="organization" maxlength="120" required><label for="purpose">방문 목적</label><textarea id="purpose" name="purpose" maxlength="1000" required></textarea><label for="crawler">사용 중인 AI 또는 자동화 도구</label><input id="crawler" name="crawler" maxlength="120" required><label for="reportedUrl">열람하려는 페이지</label><input id="reportedUrl" name="reportedUrl" type="url" maxlength="500" placeholder="https://mdj0126.github.io/"><button type="submit">방문 정보 제출</button><div id="result" class="result" role="status"></div></form><section class="api"><h2>JSON 제출</h2><pre>POST /api/crawler-report\nContent-Type: application/json\n\n{\n  "organization": "소속 기관명",\n  "purpose": "방문 목적",\n  "crawler": "사용 중인 AI 또는 자동화 도구",\n  "reportedUrl": "열람하려는 페이지 URL"\n}</pre></section></main><script>report.addEventListener('submit',async function(event){event.preventDefault();result.textContent='제출 중입니다.';const data=Object.fromEntries(new FormData(report));try{const response=await fetch('/api/crawler-report',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});const body=await response.json();if(!response.ok)throw new Error(body.error||'제출 실패');result.textContent='방문 정보가 제출되었습니다.';report.reset()}catch(error){result.textContent=error.message}});</script></body></html>`;
}
