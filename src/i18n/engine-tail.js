(function () {
  'use strict';
  var IDX = {en: 0, ja: 1}, exact = null, patterns = null;
  // Latin faces per look for English (the look's Japanese face stays behind them for Japanese words), Japanese faces for Japanese.
  var EN_FACES = {
    ukiyo: ['"Cormorant Garamond"', '"Source Serif 4"'], washi: ['"Cormorant Garamond"', '"Source Serif 4"'], kare: ['"Cormorant Garamond"', '"Source Serif 4"'],
    tsuki: ['"Cormorant Garamond"', '"Source Serif 4"'], rinpa: ['"Cormorant Garamond"', '"Source Serif 4"'], giga: ['"IM Fell English"', '"Source Serif 4"'],
    matsuri: ['"Fraunces"', '"Inter"'], techo: ['"Caveat"', '"Inter"'], taisho: ['"Poiret One"', '"Source Serif 4"'],
    manga: ['"Bangers"', '"Inter"'], youth: ['"Baloo 2"', '"Inter"'], pixel: ['"Silkscreen"', '"Inter"']
  };
  var JP_STACK = {
    ukiyo: '"Shippori Mincho B1"', washi: '"Zen Old Mincho"', kare: '"Shippori Mincho"', tsuki: '"Hina Mincho"', rinpa: '"Kaisei Tokumin"', giga: '"Yuji Boku"',
    matsuri: '"Kaisei Decol"', techo: '"Klee One"', taisho: '"Shippori Antique B1"', manga: '"Zen Antique"', youth: '"Yusei Magic"', pixel: '"DotGothic16","Fusion Pixel"'
  };
  var SANS = {matsuri: 1, techo: 1, youth: 1, pixel: 1, manga: 0};
  var FONT_URL = {
    en: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Inter:wght@400;600;700&family=IM+Fell+English&family=Fraunces:opsz,wght@9..144,600&family=Caveat:wght@600&family=Poiret+One&family=Bangers&family=Baloo+2:wght@600;800&family=Silkscreen&display=swap',
    ja: 'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;700&family=Shippori+Mincho:wght@500;700&display=swap'
  };
  function compile() {
    exact = {}; patterns = [];
    Object.keys(I18N.dict).forEach(function (k) {
      if (k.indexOf('{}') < 0) { exact[k] = I18N.dict[k]; return; }
      var parts = k.split('{}').map(function (p) { return p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
      patterns.push({re: new RegExp('^' + parts.join('([\\s\\S]*?)') + '$'), v: I18N.dict[k], weight: k.replace(/\{\}/g, '').length});
    });
    patterns.sort(function (a, b) { return b.weight - a.weight; });
  }
  // Cards: names, meanings, charms and descriptions come keyed by id; turn them into Chinese-keyed entries.
  I18N.registerCards = function (motifs) {
    motifs.forEach(function (m) {
      var en = I18N.cards.en[m.id], ja = I18N.cards.ja[m.id]; if (!en || !ja) return;
      var add = function (zh, e, j) { if (!zh || I18N.dict[zh]) return; I18N.dict[zh] = [e, j]; };
      add(m.cn, en[0], '');   // Japanese shows the card's own name, so its Chinese gloss is dropped
      add(m.mean, en[1], ja[0]); add(m.om, en[2], ja[1]); add(m.desc, en[3], ja[2]);
    });
    exact = null;
  };
  var CJK = /[぀-ヿ㐀-鿿]/;
  function tr(s, lang, depth) {
    if (!s || !CJK.test(s) || depth > 4) return s;
    if (!exact) compile();
    var i = IDX[lang], lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0], core = s.trim();
    var hit = exact[core];
    if (hit && hit[i] != null) return lead + hit[i] + trail;
    for (var k = 0; k < patterns.length; k++) {
      var m = patterns[k].re.exec(core); if (!m) continue;
      var out = patterns[k].v[i]; if (out == null) break;
      var caps = m.slice(1).map(function (c) { return tr(c, lang, depth + 1); });
      return lead + out.replace(/\{(\d)\}/g, function (_, n) { return caps[+n] != null ? caps[+n] : ''; }) + trail;
    }
    if (/^· /.test(core)) { var rest = tr(core.slice(2), lang, depth + 1); return rest ? lead + '· ' + rest + trail : ''; }
    if (/ ·$/.test(core)) return lead + tr(core.slice(0, -2), lang, depth + 1) + ' ·' + trail;
    // pieces joined by " · ", full-width spaces or the Chinese list comma
    var seps = [' · ', '　', '、', ' '];
    for (var q = 0; q < seps.length; q++) if (core.indexOf(seps[q]) >= 0) {
      var bits = core.split(seps[q]), changed = false;
      bits = bits.map(function (b) { var t = b ? tr(b, lang, depth + 1) : b; if (t !== b) changed = true; return t; }).filter(function (b, j) { return b !== '' || core.split(seps[q])[j] === ''; });
      if (changed) return lead + bits.join(lang === 'en' && seps[q] !== ' · ' ? (seps[q] === '、' ? ', ' : '  ') : seps[q]) + trail;
    }
    return s;
  }
  I18N.t = function (s, lang) { return lang && lang !== 'zh' ? tr(String(s), lang, 0) : s; };

  // ---- the page: translate what is on screen now and whatever appears later ----
  var LANG = 'zh', src = new WeakMap(), attrDone = new WeakMap(), ATTRS = ['aria-label', 'alt', 'title', 'placeholder'];
  function skip(el) { return !el || el.closest('[translate="no"],svg,script,style,textarea,canvas'); }
  function doText(n) {
    if (skip(n.parentElement)) return;
    var cur = n.data, done = src.get(n);
    if (done && done.out === cur) return;
    if (!CJK.test(cur)) return;
    var out = tr(cur, LANG, 0);
    src.set(n, {out: out});
    if (out !== cur) n.data = out;
  }
  function doAttrs(el) {
    if (skip(el)) return;
    // remember what each attribute was turned into: a Japanese result still contains kanji and must not be translated again
    var done = attrDone.get(el) || {};
    ATTRS.forEach(function (a) {
      var v = el.getAttribute(a); if (!v || !CJK.test(v) || done[a] === v) return;
      var o = tr(v, LANG, 0); done[a] = o; if (o !== v) el.setAttribute(a, o);
    });
    attrDone.set(el, done);
  }
  function walk(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1 || skip(root)) return;
    doAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT), n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
  }
  I18N.start = function (lang, look) {
    LANG = lang;
    var root = document.documentElement;
    root.lang = lang === 'ja' ? 'ja' : 'en'; root.dataset.lang = lang;
    var link = document.createElement('link'); link.rel = 'stylesheet'; link.href = FONT_URL[lang]; document.head.appendChild(link);
    var css = '';
    Object.keys(JP_STACK).forEach(function (k) {
      if (lang === 'en') {
        var f = EN_FACES[k];
        css += ':root[data-lang="en"][data-look="' + k + '"]{--f-head:' + f[0] + ',' + f[1] + ',serif;--f-body:' + f[1] + ',' + (SANS[k] ? 'system-ui,sans-serif' : 'Georgia,serif') + ';--f-jp:' + f[0] + ',' + JP_STACK[k] + ',serif}\n';
      } else {
        var body = SANS[k] ? '"Zen Kaku Gothic New","Hiragino Sans",sans-serif' : '"Shippori Mincho","Hiragino Mincho ProN","Yu Mincho",serif';
        css += ':root[data-lang="ja"][data-look="' + k + '"]{--f-head:' + body + ';--f-body:' + body + '}\n';
      }
    });
    if (lang === 'en') css += ':root[data-lang="en"] .jp{font-feature-settings:normal}\n'
      + ':root[data-lang="en"] [class^="hv-"] h1::after{content:"Hana Awase";display:block;margin-top:.35em;font:600 .3em/1.1 var(--f-head);letter-spacing:.24em;text-transform:uppercase;writing-mode:horizontal-tb;-webkit-text-stroke:0;text-shadow:none}\n';
    else css += ':root[data-lang="ja"] [class^="hv-"] h1::after{content:"花合わせ帖";display:block;margin-top:.35em;font-size:.3em;letter-spacing:.3em;writing-mode:horizontal-tb;-webkit-text-stroke:0;text-shadow:none}\n';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    walk(document.body);
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        if (m.type === 'characterData') doText(m.target);
        else if (m.type === 'attributes') doAttrs(m.target);
        else m.addedNodes.forEach(walk);
      });
    }).observe(document.body, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS});
  };
})();
