// Bundles src/ (CommonJS, as the mini-game runtimes load it) into dev/index.html so the game runs in a browser for testing.
// Usage: node minigame/tools/build-web.mjs, then serve minigame/ and open dev/index.html.
import fs from 'node:fs';
import path from 'node:path';
const root = new URL('..', import.meta.url).pathname, src = path.join(root, 'src');
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.js')) files.push(p); } })(src);
const mods = files.map(p => `${JSON.stringify(path.relative(root, p).replace(/\\/g, '/'))}: function (module, exports, require) {\n${fs.readFileSync(p, 'utf8')}\n}`).join(',\n');
const loader = `(function () {
const defs = {${mods}};
const cache = {};
function resolve(from, name) { const parts = (from.split('/').slice(0, -1).join('/') + '/' + name).split('/'), out = [];
  for (const s of parts) { if (s === '..') out.pop(); else if (s !== '.' && s) out.push(s); } let p = out.join('/'); if (!p.endsWith('.js')) p += '.js'; return p; }
function load(p) { if (cache[p]) return cache[p].exports; const m = cache[p] = {exports: {}}; defs[p](m, m.exports, n => load(resolve(p, n))); return m.exports; }
load('src/main.js');
})();`;
fs.mkdirSync(path.join(root, 'dev'), {recursive: true});
fs.writeFileSync(path.join(root, 'dev', 'index.html'), `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>御守花札 · 小游戏开发预览</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Sans+SC:wght@400;700&display=swap">
<base href="../">
<style>html,body{margin:0;height:100%;overflow:hidden;background:#000;touch-action:manipulation}canvas{display:block}</style></head>
<body><canvas id="stage"></canvas><script>${loader}</script></body></html>`);
console.log('dev/index.html', files.length, 'modules');
