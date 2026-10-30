# Phone screenshots for the 小红书 note (iPhone 14 size at 3x): 本所怪谈 home, a game in progress, the win card, the
# dex and charm sheets, and every look's home page. Saved as WebP (quality .9) to keep the repo light.
import sys, os, threading, http.server, functools, socketserver, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'tools', 'test'))
from playwright.sync_api import sync_playwright
import fontcache
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')); OUT = os.path.join(os.path.dirname(__file__), 'shots')
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
LOOKS = ['honjo', 'ukiyo', 'washi', 'kare', 'tsuki', 'rinpa', 'giga', 'matsuri', 'techo', 'taisho', 'manga', 'youth', 'pixel']
ids = json.load(open(os.path.join(ROOT, 'tools', 'test', 'ids.json')))
COLL = {k: 1 for k in ids[:30]}
def pairs(pg):
    srcs = pg.evaluate("[...document.querySelectorAll('#deck .card .front img')].map(i=>i.getAttribute('src'))"); d = {}
    for i, s2 in enumerate(srcs): d.setdefault(s2, []).append(i)
    return list(d.values())
import base64
WEBP = "async src => { const im = new Image(); im.src = src; await im.decode(); const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0); return c.toDataURL('image/webp', .9); }"
def shot(pg, path):
    png = pg.screenshot()
    data = conv.evaluate(WEBP, 'data:image/png;base64,' + base64.b64encode(png).decode())
    open(path, 'wb').write(base64.b64decode(data.split(',')[1]))
with sync_playwright() as p:
    b = p.chromium.launch(); conv = b.new_page()
    ctx = b.new_context(locale='zh-CN', viewport={'width': 390, 'height': 844}, device_scale_factor=3, is_mobile=True, has_touch=True); fontcache.attach(ctx)
    pg = ctx.new_page(); pg.goto(f'http://127.0.0.1:{port}/index.html')
    def load(look, **extra):
        sv = {'unlocked': 6, 'demoDone': True, 'seenRules': True, 'look': look, 'collected': COLL, 'best': {'std': {'1': 3, '2': 3, '3': 2, '4': 2}}, 'seals': {'san': 1, 'muku': 1}}
        sv.update(extra)
        pg.evaluate(f"localStorage.setItem('omamori-hanafuda-v1', {json.dumps(json.dumps(sv))})"); pg.reload(); pg.wait_for_timeout(2600)
    for look in LOOKS:
        load(look); shot(pg, f'{OUT}/home-{look}.webp')
    load('honjo')
    pg.tap('.tabs [data-sheet="dex"]'); pg.wait_for_timeout(900); shot(pg, f'{OUT}/dex-honjo.webp'); pg.tap('#dex .back-btn'); pg.wait_for_timeout(400)
    pg.tap('.tabs [data-sheet="omamori"]'); pg.wait_for_timeout(900); shot(pg, f'{OUT}/omamori-honjo.webp'); pg.tap('#omamori .back-btn'); pg.wait_for_timeout(400)
    pg.tap('#homeView [data-go="5"]', force=True)
    pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=30000); pg.wait_for_timeout(300)
    pr = pairs(pg)
    for x, y in pr[:3]: pg.tap(f'#deck .card[data-i="{x}"]'); pg.tap(f'#deck .card[data-i="{y}"]'); pg.wait_for_timeout(700)
    pg.wait_for_timeout(1800); pg.tap(f'#deck .card[data-i="{pr[3][0]}"]'); pg.wait_for_timeout(700)
    shot(pg, f'{OUT}/game-honjo.webp')
    pg.tap(f'#deck .card[data-i="{pr[3][1]}"]'); pg.wait_for_timeout(700)
    for x, y in pr[4:]: pg.tap(f'#deck .card[data-i="{x}"]'); pg.tap(f'#deck .card[data-i="{y}"]'); pg.wait_for_timeout(600)
    pg.wait_for_function("!document.querySelector('#modal').hidden", timeout=10000); pg.wait_for_timeout(3200)
    shot(pg, f'{OUT}/win-honjo.webp')
    b.close()
srv.shutdown()
print('shots:', len(os.listdir(OUT)))
