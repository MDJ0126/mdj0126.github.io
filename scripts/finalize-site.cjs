const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(process.argv[2] || '_site');
const origin = 'https://mdj0126.github.io';
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const escape = text => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const decode = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const local = url => {
  const target = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  if (target !== root && !target.startsWith(root + path.sep)) throw Error('Path outside site: ' + url);
  return fs.existsSync(target) && fs.statSync(target).isDirectory() ? path.join(target, 'index.html') : target;
};
const manifestPath = path.join(root, 'Portfolio/build-manifest.json');
const posts = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const sources = walk('Portfolio/_posts').filter(p => /\.md$/i.test(p) && !p.split(path.sep).includes('technical-notes'));
for (const source of sources) {
  const relative = path.relative('Portfolio', source).split(path.sep).join('/');
  if (!posts.some(p => p.source === relative)) throw Error('Post missing from build: ' + source);
}
for (const post of posts) {
  if (!fs.existsSync(local(new URL(post.url, origin)))) throw Error('Post HTML missing: ' + post.url);
}
console.log('Verified ' + sources.length + ' portfolio source posts and their generated HTML');
const allHtml = walk(root).filter(p => /\.html?$/i.test(p));
const files = allHtml.filter(p => /<head\b/i.test(fs.readFileSync(p, 'utf8')));
let versioned = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const pageUrl = new URL('/' + path.relative(root, file).split(path.sep).join('/').replace(/index\.html$/, ''), origin);
  if (!/<head\b/i.test(html) || !/<\/body>/i.test(html)) throw Error('Incomplete HTML document: ' + file);
  if (/site-overlays\.(css|js)/.test(html)) throw Error('Remove manual common UI include: ' + file);
  html = html.replace(/<\/head>/i, '<link rel="stylesheet" href="/assets/css/site-overlays.css">\n</head>');
  html = html.replace(/<\/body>/i, '<script src="/assets/js/site-overlays.js"></script>\n</body>');
  const post = posts.find(p => new URL(p.url, origin).pathname === pageUrl.pathname);
  if (post) {
    const image = new URL(post.image ? '/Portfolio/assets/img/post/' + post.image : '/Resume/assets/img/picture/profile-og.png', origin).href;
    html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>' + escape(post.title) + ' | 문동준 포트폴리오</title>');
    html = html.replace(/<meta\b[^>]*(?:name|property)=["'](?:description|og:[^"']+|twitter:[^"']+)["'][^>]*>\s*/gi, '');
    const tags = { description: post.summary, 'og:type': 'article', 'og:title': post.title, 'og:description': post.summary, 'og:url': pageUrl.href, 'og:image': image, 'twitter:card': 'summary_large_image', 'twitter:title': post.title, 'twitter:description': post.summary, 'twitter:image': image };
    html = html.replace(/<\/head>/i, Object.entries(tags).map(([key, value]) => '<meta ' + (key.startsWith('og:') ? 'property' : 'name') + '="' + key + '" content="' + escape(value) + '">').join('\n') + '\n</head>');
  }
  if (!/property=["']og:title["']/i.test(html)) {
    const title = decode((html.match(/<title>(.*?)<\/title>/i) || [,'문동준'])[1]);
    const summary = decode((html.match(/<p>([^<]+)<\/p>/i) || [,title])[1]);
    const tags = { 'og:type': 'website', 'og:title': title, 'og:description': summary, 'og:url': pageUrl.href, 'og:image': origin + '/Resume/assets/img/picture/profile-og.png', 'twitter:card': 'summary_large_image', 'twitter:title': title, 'twitter:description': summary, 'twitter:image': origin + '/Resume/assets/img/picture/profile-og.png' };
    html = html.replace(/<\/head>/i, Object.entries(tags).map(([key, value]) => '<meta ' + (key.startsWith('og:') ? 'property' : 'name') + '="' + key + '" content="' + escape(value) + '">').join('\n') + '\n</head>');
  }
  html = html.replace(/\b(src|href)=(['"])([^'"]+)\2/gi, (match, attr, quote, value) => {
    const url = new URL(decode(value), pageUrl);
    if (url.origin !== origin || !/\.(css|js)$/i.test(url.pathname)) return match;
    const target = local(url);
    if (!fs.existsSync(target)) throw Error('Missing asset: ' + file + ' -> ' + value);
    url.searchParams.set('v', crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex').slice(0, 12));
    versioned++;
    return attr + '=' + quote + escape(url.pathname + url.search + url.hash) + quote;
  });
  fs.writeFileSync(file, html);
}
const errors = [];
for (const file of allHtml) {
  const html = fs.readFileSync(file, 'utf8');
  const pageUrl = new URL('/' + path.relative(root, file).split(path.sep).join('/'), origin);
  for (const match of html.matchAll(/<(?:a|img|script|link|source|video)\b[^>]*>/gi)) {
    for (const attr of match[0].matchAll(/\b(?:src|href|poster)=(['"])([^'"]+)\1/gi)) {
      const value = decode(attr[2]);
      if (value.startsWith('#')) continue;
      const url = new URL(value, pageUrl);
      if (url.origin === origin && !fs.existsSync(local(url))) errors.push(path.relative(root, file) + ' -> ' + value);
    }
  }
}
if (errors.length) throw Error('Broken internal paths:\n' + [...new Set(errors)].join('\n'));
fs.unlinkSync(manifestPath);
console.log('Common UI: ' + files.length + ' pages; metadata: ' + posts.length + ' posts; versioned assets: ' + versioned + '; internal paths: PASS');
