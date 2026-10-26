import sys, threading, http.server, functools, socketserver, json, base64
from playwright.sync_api import sync_playwright
import fontcache; fontcache.patch()
site, out = sys.argv[1], sys.argv[2]
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{port}/_dbg.html'; KEY = 'omamori-hanafuda-v1'
ids = json.load(open(site + '/../ids.json'))
# month m gets (m % 5) cards, clipped to 4: a mix of bare, rising and full panels
coll = {}
for i, k in enumerate(ids):
    mo, idx = i // 4 + 1, i % 4
    if idx < min(4, mo % 5): coll[k] = 6 if idx == 0 and mo % 3 == 0 else 1
SAVE = {'unlocked': 5, 'demoDone': True, 'best': {'std': {'1': 3, '2': 2, '3': 3, '4': 1}}, 'collected': coll, 'seals': {'san': 1, 'muku': 1}}
errs = []
with sync_playwright() as p:
    b = p.chromium.launch()
    def page(w, h, m):
        pg = b.new_context(locale='zh-CN', viewport={'width': w, 'height': h}, device_scale_factor=2 if m else 1, is_mobile=m, has_touch=m).new_page()
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda x: x.type == 'error' and errs.append(x.text)); return pg
    for look in ['ukiyo', 'washi', 'kare', 'matsuri', 'techo', 'youth', 'manga']:
        pg = page(1440, 900, False); pg.goto(url); pg.evaluate(f"localStorage.setItem('{KEY}', {json.dumps(json.dumps(dict(SAVE, look=look)))})"); pg.reload(); pg.wait_for_timeout(1500)
        m = pg.evaluate("(()=>{const a=document.querySelector('.hv-a').getBoundingClientRect(), b=document.querySelector('.hv-b').getBoundingClientRect(); return [Math.round(a.height), Math.round(b.height), document.querySelector('.niwa').closest('.hv-a') ? 'A' : 'B']})()")
        pg.screenshot(path=f'{out}/d-{look}.png'); pg.evaluate("document.querySelector('#homeView').scrollTop = 99999"); pg.wait_for_timeout(300); pg.screenshot(path=f'{out}/d-{look}-2.png')
        pg.click("#homeView [data-go=\"2\"]", force=True); pg.wait_for_function("document.querySelector(\"#hintText\").textContent.includes(\"翻开两张\")", timeout=20000); pg.wait_for_timeout(600); pg.screenshot(path=f'{out}/back-{look}.png')
        print(look, 'cols', m); pg.close()
    pg = page(390, 844, True); pg.goto(url); pg.evaluate(f"localStorage.setItem('{KEY}', {json.dumps(json.dumps(dict(SAVE, look='washi')))})"); pg.reload(); pg.wait_for_timeout(1200)
    pg.evaluate("document.querySelector('.niwa').scrollIntoView({block:'start'})"); pg.wait_for_timeout(400); pg.screenshot(path=f'{out}/m-niwa.png')
    pg.click('.np[data-month="3"]'); pg.wait_for_timeout(300); print('toast', pg.evaluate("document.querySelector('#toast').textContent.trim().slice(0,50)"), 'overflow', pg.evaluate("document.documentElement.scrollWidth > innerWidth"))
    print('no share', pg.evaluate("!document.querySelector('[data-poster], [data-act^=\"poster\"]')"))
    print('errors', errs[:8]); b.close()
srv.shutdown()
