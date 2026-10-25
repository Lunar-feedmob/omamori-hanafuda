// Builds the 小红书小工具 package of 花合帖 from the web page (src/page.html) — the web build stays the single source.
// Usage:  python3 xhs/assets.py   (once; fonts + images into xhs/.cache)
//         cd xhs && npm install && node build.mjs     -> xhs/dist/ and xhs/omamori-hanafuda-xhs.zip
// What changes on the way, following the container rules (offline, CSP, Chrome 61 baseline):
//  - the inline script moves to app.js and starts once the host bridge (shim.js) has loaded storage;
//  - Tone.js and canvas-confetti are replaced by tone-lite.js / confetti-lite.js; card foley is synthesised;
//  - /*web-only*/ blocks are dropped and /*xhs-only*/ blocks switched on; external links become plain text;
//  - Google Fonts become subset .woff2 files; art becomes WebP; only the shipped card decks are copied;
//  - JS is transpiled to Chrome 61; CSS gets fallbacks for inset, gap, aspect-ratio, max()/min()/env(), display:contents.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {transform} from 'esbuild';

const HERE = path.dirname(new URL(import.meta.url).pathname), ROOT = path.resolve(HERE, '..');
const CACHE = path.join(HERE, '.cache'), DIST = path.join(HERE, 'dist'), ZIP = path.join(HERE, 'hana-awase-xhs.zip');
const SHIPPED_SKINS = ['classic', 'ink', 'kirie', 'tone'];
const page = fs.readFileSync(path.join(ROOT, 'src', 'page.html'), 'utf8');
const must = (cond, msg) => { if (!cond) throw new Error(msg); };

// ---- split the page ----
const styles = [...page.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]);
const scripts = [...page.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
must(scripts.length === 1, 'expected one inline script');
const bodyStart = page.indexOf('<div id="scene"'), bodyEnd = page.indexOf('<script src=');
must(bodyStart > 0 && bodyEnd > bodyStart, 'body markers not found');
let markup = page.slice(bodyStart, bodyEnd).trim();
const title = (page.match(/<title>(.*?)<\/title>/) || [])[1] || '花合帖';

// ---- JS ----
let js = scripts[0];
js = js.replace(/\/\*web-only\*\/[\s\S]*?\/\*end-web-only\*\//g, '');
js = js.replace(/\/\*xhs-only ([\s\S]*?) xhs-only\*\//g, '$1');
js = js.replace(/<a href="https?:[^"]*" target="_blank" rel="noopener">([\s\S]*?)<\/a>/g, '$1');
js = js.replace(/art\/([^"'`)\s]*?)\.jpg/g, 'art/$1.webp');
js = `window.OMA_HOST.ready.then(function () {\n${js}\n});`;
const leftovers = ['https://', 'http://fonts', 'navigator.clipboard', 'sfx/', '.mp3', 'download =', 'new Worker', 'eval(', 'new Function'].filter(s => js.includes(s));
// SVG namespaces (http://www.w3.org/...) are identifiers, not requests; anything else must be gone.
const urls = [...js.matchAll(/https?:\/\/[^\s"'`)<]+/g)].map(m => m[0]).filter(u => !u.startsWith('http://www.w3.org/'));
must(!urls.length, 'external URLs left in app.js: ' + urls.slice(0, 5).join(' '));
must(!leftovers.filter(s => s !== 'https://').length, 'forbidden leftovers in app.js: ' + leftovers.join(', '));

// ---- CSS ----
let css = styles.join('\n');
const resolveFns = v => {   // a static value for old engines: env(x, y) -> y, max(a, ...) -> a, min(..., z) -> z, clamp(a, b, c) -> b
  for (let guard = 0; guard < 50; guard++) {
    const m = /\b(max|min|clamp|env)\(/.exec(v); if (!m) return v;
    let depth = 0, i = m.index + m[0].length - 1, end = -1;
    for (; i < v.length; i++) { if (v[i] === '(') depth++; else if (v[i] === ')') { depth--; if (!depth) { end = i; break; } } }
    if (end < 0) return v;
    const inner = v.slice(m.index + m[0].length, end), args = []; let d = 0, s = 0;
    for (let j = 0; j < inner.length; j++) { const ch = inner[j]; if (ch === '(') d++; else if (ch === ')') d--; else if (ch === ',' && !d) { args.push(inner.slice(s, j).trim()); s = j + 1; } }
    args.push(inner.slice(s).trim());
    const pick = m[1] === 'env' ? (args[1] || '0px') : m[1] === 'max' ? args[0] : m[1] === 'min' ? args[args.length - 1] : args[1] || args[0];
    v = v.slice(0, m.index) + pick + v.slice(end + 1);
  }
  return v;
};
css = css.replace(/([{;]\s*)([a-z-]+)\s*:\s*([^;{}]*\b(?:max|min|clamp|env)\([^;{}]*?)(?=\s*[;}])/g, (all, pre, prop, val) => `${pre}${prop}:${resolveFns(val)};${prop}:${val}`);
css = css.replace(/([{;]\s*)inset\s*:\s*([^;{}]+?)(?=\s*[;}])/g, (all, pre, val) => {
  const p = val.trim().split(/\s+/), [t, r = t, b = t, l = r] = p;
  return `${pre}top:${t};right:${r};bottom:${b};left:${l}`;
});
css = css.replace(/([{;]\s*)(row-gap|column-gap|gap)\s*:\s*([^;{}]+?)(?=\s*[;}])/g, (all, pre, prop, val) => `${pre}grid-${prop}:${val};${prop}:${val}`);
css = css.replace(/url\(art\/([^)]*?)\.jpg\)/g, 'url(art/$1.webp)');
css += `
/* ---- 小工具: Chrome 61 fallbacks ---- */
@supports not (aspect-ratio:1/1){
  .card{height:calc(var(--cw) * 100 / 61)}
  .om-badge{height:72px}
  .np-art,.hv-ukiyo .uk-print .uk-scene,.hv-ukiyo .uk-thumb .uk-mini{height:0;padding-top:240%}
  .hv-ukiyo .uk-print .uk-scene{padding-top:125%} .hv-ukiyo .uk-thumb .uk-mini{padding-top:133%}
  .np-art>img,.hv-ukiyo .uk-print .uk-scene>*,.hv-ukiyo .uk-thumb .uk-mini>*{position:absolute;top:0;left:0;width:100%;height:100%}
  .hv-washi .wa-cover{width:250px;height:352px}
  .hv-kare .ka-stone{width:300px;height:300px}
  .hv-rinpa .rp-tile{min-height:76px}
}
@supports not (display:contents){ .hv-a>*+*,.hv-b>*,.hv-b>*+*{margin-top:16px} }
/* ---- 小工具: room for the container's own buttons (shim.js sets --xhs-top when it knows where they are) ---- */
:root[style*="--xhs-top"] #app{padding-top:var(--xhs-top)}
:root[style*="--xhs-top"] .sheet,:root[style*="--xhs-top"] .modal{padding-top:var(--xhs-top)}
/* ---- 小工具: long-press menus are off in the container, so don't promise them ---- */
`;
const fontsCss = fs.readFileSync(path.join(CACHE, 'fonts.css'), 'utf8') +
  '@font-face{font-family:"Fusion Pixel";src:url(./fonts/fusion-pixel-12.woff2) format("woff2");font-display:swap}\n';
css = css.replace(/@font-face\{font-family:"Fusion Pixel";src:url\(fonts\/fusion-pixel-12\.woff2\) format\("woff2"\);font-display:swap\}\n?/, '');
css = fontsCss + css;

// ---- markup ----
markup = markup.replace(/<a href="https?:[^"]*"[^>]*>([\s\S]*?)<\/a>/g, '$1');
must(!/https?:\/\//.test(markup.replace(/http:\/\/www\.w3\.org\/[^\s"]*/g, '')), 'external URL in markup');
must(!/\son[a-z]+="/.test(markup), 'inline event handler in markup');

// ---- write dist ----
fs.rmSync(DIST, {recursive: true, force: true});
const put = (rel, data) => { const p = path.join(DIST, rel); fs.mkdirSync(path.dirname(p), {recursive: true}); fs.writeFileSync(p, data); };
const copy = (from, rel) => put(rel, fs.readFileSync(from));
const tjs = async (code, name) => (await transform(code, {loader: 'js', target: 'chrome61', minify: true, legalComments: 'none', sourcefile: name})).code;
put('index.html', `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
<title>${title}</title>
<link rel="stylesheet" href="./style.css" />
</head>
<body>
${markup}
<script src="./shim.js"></script>
<script src="./tone-lite.js"></script>
<script src="./confetti-lite.js"></script>
<script src="./app.js"></script>
</body>
</html>
`);
put('style.css', css);
put('app.js', await tjs(js, 'app.js'));
for (const f of ['shim.js', 'tone-lite.js', 'confetti-lite.js']) put(f, await tjs(fs.readFileSync(path.join(HERE, f), 'utf8'), f));
// the shim lists what ships; keep it in step with SHIPPED_SKINS
put('shim.js', fs.readFileSync(path.join(DIST, 'shim.js'), 'utf8').replace(/cardExt:\{[^}]*\}/, m => m + `,skins:${JSON.stringify(SHIPPED_SKINS)}`));
for (const f of fs.readdirSync(path.join(CACHE, 'fonts'))) copy(path.join(CACHE, 'fonts', f), 'fonts/' + f);
copy(path.join(ROOT, 'fonts', 'fusion-pixel-12.woff2'), 'fonts/fusion-pixel-12.woff2');
for (const skin of SHIPPED_SKINS) {
  const raster = fs.existsSync(path.join(CACHE, 'cards', skin)), dir = raster ? path.join(CACHE, 'cards', skin) : path.join(ROOT, 'cards', skin);
  for (const f of fs.readdirSync(dir)) copy(path.join(dir, f), `cards/${skin}/${f}`);
}
for (const f of fs.readdirSync(path.join(CACHE, 'art'))) copy(path.join(CACHE, 'art', f), 'art/' + f);
for (const d of ['backs', 'niwa']) for (const f of fs.readdirSync(path.join(ROOT, d))) if (f.endsWith('.webp')) copy(path.join(ROOT, d, f), `${d}/${f}`);
put('licenses.json', JSON.stringify({
  fonts: 'Display fonts (Shippori Mincho B1, Zen Old Mincho, Shippori Mincho, Kaisei Decol, Klee One, Yusei Magic, Zen Antique, Hina Mincho, Kaisei Tokumin, Yuji Boku, Shippori Antique B1, DotGothic16, Yuji Syuku; via Google Fonts) and Fusion Pixel Font (TakWolf) are licensed under the SIL Open Font License 1.1. Subset to the characters used here.',
  'OFL-1.1': fs.readFileSync(path.join(ROOT, 'fonts', 'fusion-pixel-OFL.txt'), 'utf8'),
  cards: 'Card faces 彩绘: Louie Mantia, CC BY-SA 4.0 (Wikimedia Commons), rasterised to WebP, not otherwise modified. 墨绘 / 剪纸 / 网点 and the omamori: original to this project.',
  art: 'Home art and card-back stencils: public domain works (Art Institute of Chicago, The Metropolitan Museum of Art open access CC0, Wikimedia Commons). See the in-game credits.'
}, null, 1));

// every file the page asks for must be in the package
const asked = new Set();
for (const m of (js + css + markup).matchAll(/(?:cards|art|backs|niwa|fonts)\/[A-Za-z0-9_.${}\[\]()-]+\.(?:webp|svg|woff2|png|jpg)/g)) if (!m[0].includes('${')) asked.add(m[0]);
const missing = [...asked].filter(p => !fs.existsSync(path.join(DIST, p)));
must(!missing.length, 'referenced but not packaged: ' + missing.join(', '));
const allowed = /\.(html|css|js|png|jpe?g|gif|webp|svg|woff2?|json)$/;
const files = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else files.push(path.relative(DIST, p)); } })(DIST);
must(files.every(f => allowed.test(f)), 'file types outside the whitelist: ' + files.filter(f => !allowed.test(f)).join(', '));

// ---- zip (index.html at the root, no wrapping folder) ----
fs.rmSync(ZIP, {force: true});
execFileSync('python3', ['-I', '-c', `import os, sys, zipfile
d, out = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for root, _, fs_ in os.walk(d):
        for f in sorted(fs_):
            p = os.path.join(root, f); z.write(p, os.path.relpath(p, d))`, DIST, ZIP]);
const kb = n => (n / 1024).toFixed(0) + ' KB';
const bySize = files.reduce((a, f) => { const k = f.split('/')[0]; a[k] = (a[k] || 0) + fs.statSync(path.join(DIST, f)).size; return a; }, {});
console.log('files', files.length, '| zip', kb(fs.statSync(ZIP).size));
console.log(Object.entries(bySize).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${kb(v)}`).join(' · '));
