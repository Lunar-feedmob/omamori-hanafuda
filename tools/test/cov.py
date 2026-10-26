import os, sys, threading, http.server, functools, socketserver, json, re
from playwright.sync_api import sync_playwright
import fontcache; fontcache.patch()
site, lang = sys.argv[1], sys.argv[2]
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{port}/_preview.html'; KEY = 'omamori-hanafuda-v1'
ids = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ids.json')))
coll = {k: (6 if i % 9 == 0 else (3 if i % 5 == 0 else 1)) for i, k in enumerate(ids) if i % 4 != 3}
SCAN = r"""() => { const out = new Set(), cjk = /[㐀-鿿぀-ヿ]/;
  const skip = el => !el || el.closest('[translate="no"],svg,script,style,textarea,canvas,[hidden]');
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { if (!skip(n.parentElement) && cjk.test(n.data)) out.add(n.data.trim()); }
  document.querySelectorAll('[aria-label],[alt],[title]').forEach(el => { if (skip(el)) return; ['aria-label','alt','title'].forEach(a => { const v = el.getAttribute(a); if (v && cjk.test(v)) out.add('@' + v); }); });
  return [...out]; }"""
found = {}; errs = []
def grab(pg, where):
    for t in pg.evaluate(SCAN): found.setdefault(t, where)
with sync_playwright() as p:
    b = p.chromium.launch()
    for look in ['ukiyo', 'washi', 'kare', 'tsuki', 'rinpa', 'giga', 'honjo', 'matsuri', 'techo', 'taisho', 'manga', 'youth', 'pixel']:
        pg = b.new_context(viewport={'width': 390, 'height': 844}, locale='en-US').new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(url); pg.evaluate(f"localStorage.setItem('{KEY}', JSON.stringify({{unlocked: 8, demoDone: true, look: '{look}', lang: '{lang}', best: {{std: {{1: 3, 2: 2, 3: 1, 4: 3, 5: 2, 6: 1, 7: 3, 8: 2}}}}, collected: {json.dumps(coll)}, seals: {{san: 1, muku: 1, hakkei: 1}}}}))"); pg.reload(); pg.wait_for_timeout(1300)
        grab(pg, look + ':home')
        if look == 'ukiyo':
            for sh in ['dex', 'omamori', 'settings']:
                pg.click(f'.tabs [data-sheet="{sh}"]'); pg.wait_for_timeout(500); grab(pg, sh)
                if sh == 'omamori': pg.click('.om-cell[data-om]'); pg.wait_for_timeout(300); grab(pg, 'om-detail'); pg.click('#modalCard [data-act="close"]')
                if sh == 'settings':
                    pg.click('#btnStats'); pg.wait_for_timeout(300); grab(pg, 'stats'); pg.click('#modalCard [data-act="close"]')
                    pg.click('#btnCredits'); pg.wait_for_timeout(300); grab(pg, 'credits'); pg.click('#modalCard [data-act="close"]')
                    pg.click('#btnReset'); pg.wait_for_timeout(300); grab(pg, 'reset'); pg.click('#modalCard [data-act="close"]')
                pg.click(f'#{sh} .back-btn'); pg.wait_for_timeout(300)
            pg.click('.np[data-month="1"]'); pg.wait_for_timeout(200); grab(pg, 'plant-toast')
            pg.click('[data-wipe]'); pg.wait_for_timeout(300); grab(pg, 'wipe'); pg.click('#modalCard [data-act="close"]')
        if look in ('ukiyo', 'pixel', 'giga'):
            pg.click('#homeView [data-go="2"]', force=True); pg.wait_for_timeout(600); grab(pg, look + ':deal')
            pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=20000); grab(pg, look + ':play')
            srcs = pg.evaluate("[...document.querySelectorAll('#deck .card .front img')].map(i=>i.getAttribute('src'))"); d = {}
            for i, s2 in enumerate(srcs): d.setdefault(s2, []).append(i)
            pv = list(d.values())
            pg.click(f'#deck .card[data-i="{pv[0][0]}"]'); pg.click(f'#deck .card[data-i="{pv[1][0]}"]'); pg.wait_for_timeout(300); grab(pg, 'miss')
            pg.wait_for_timeout(1000)
            for a, c in pv:
                pg.click(f'#deck .card[data-i="{a}"]'); pg.click(f'#deck .card[data-i="{c}"]'); pg.wait_for_timeout(450); grab(pg, 'match')
            pg.wait_for_timeout(2500); grab(pg, 'win')
            if look == 'ukiyo':
                pg.click('[data-act="home"]'); pg.wait_for_timeout(500)
                pg.click('#homeView [data-go="101"]', force=True); pg.wait_for_function("!document.querySelector('#btnPeek').disabled", timeout=20000); grab(pg, 'variant')
        pg.close()
    b.close()
srv.shutdown()
allowed = re.compile(r'^(花|合|帖|花合帖|花 合 帖|名所江戸|.*[ぁ-ゟ゠-ヿ].*|.*(睦月|如月|弥生|卯月|皐月|水無月|文月|葉月|長月|神無月|霜月|師走|錦絵|和紙|枯山水|月夜|琳派|戯画|浪漫|漫画|四畳半|光|金龍山).*)$')
miss = {t: w for t, w in found.items() if not allowed.match(t.lstrip('@'))}
print('errors', errs[:5]); print('untranslated', len(miss))
for t, w in sorted(miss.items(), key=lambda x: x[1]): print(f'{w:14s} {t[:110]}')
