import sys, threading, http.server, functools, socketserver, json
from playwright.sync_api import sync_playwright
import fontcache
site, out = sys.argv[1], sys.argv[2]
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{port}/_preview.html'
def pairs(pg):
    srcs = pg.evaluate("[...document.querySelectorAll('#deck .card .front img')].map(i=>i.getAttribute('src'))"); d = {}
    for i, s2 in enumerate(srcs): d.setdefault(s2, []).append(i)
    return list(d.values())
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    def page(w, h, lang='zh', unlocked=5, best=None):
        ctx = b.new_context(locale='zh-CN', viewport={'width': w, 'height': h}); fontcache.attach(ctx); pg = ctx.new_page()
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
        pg.goto(url, wait_until='domcontentloaded')
        sv = {'unlocked': unlocked, 'demoDone': True, 'seenRules': True, 'look': 'honjo', 'lang': lang, 'best': {'std': best or {str(i): 2 for i in range(1, unlocked)}}}
        pg.evaluate(f"localStorage.setItem('omamori-hanafuda-v1', {json.dumps(json.dumps(sv))})"); pg.reload(wait_until='domcontentloaded'); pg.wait_for_timeout(2200)
        return pg
    pg = page(390, 844); pg.screenshot(path=f'{out}/hj-home.png')
    pg.evaluate("document.querySelector('.hj-hundred').scrollIntoView({block:'start'})"); pg.wait_for_timeout(300); pg.screenshot(path=f'{out}/hj-lamps.png')
    pg.evaluate("document.querySelector('#homeView').scrollTop = 0"); pg.click('#homeView [data-go="5"]', force=True)
    pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=20000); pg.wait_for_timeout(300); pg.screenshot(path=f'{out}/hj-game.png')
    for x, y in pairs(pg): pg.click(f'#deck .card[data-i="{x}"]'); pg.click(f'#deck .card[data-i="{y}"]'); pg.wait_for_timeout(520)
    pg.wait_for_function("!document.querySelector('#modal').hidden", timeout=8000); pg.wait_for_timeout(2600); pg.screenshot(path=f'{out}/hj-win.png')
    pg.context.close()
    pg = page(390, 844, unlocked=8); pg.screenshot(path=f'{out}/hj-dawn.png'); pg.context.close()
    pg = page(1280, 800); pg.screenshot(path=f'{out}/hj-desk.png'); pg.context.close()
    pg = page(390, 844, lang='en'); pg.screenshot(path=f'{out}/hj-en.png'); pg.context.close()
    print('errors', errs); b.close()
srv.shutdown()
