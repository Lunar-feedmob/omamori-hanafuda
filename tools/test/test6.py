import sys, threading, http.server, functools, socketserver, json, base64
from playwright.sync_api import sync_playwright
import fontcache; fontcache.patch()
site, out = sys.argv[1], sys.argv[2]
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{port}/_dbg.html'; KEY = 'omamori-hanafuda-v1'
ids = json.load(open(site + '/../ids.json'))
coll = {k: (6 if i % 7 == 0 else 1) for i, k in enumerate(ids) if i % 3 != 2}
ALL = {'unlocked': 8, 'demoDone': True, 'seenRules': True, 'best': {'std': {str(i): 2 for i in range(1, 9)}}, 'collected': coll, 'seals': {'san': 1, 'muku': 1, 'hakkei': 1}}
LOOKS = ['ukiyo', 'youth', 'manga', 'washi', 'kare', 'matsuri', 'techo']
errs = []
def pairs_awase(pg):
    ms = pg.evaluate("[...document.querySelectorAll('.card .front img')].map(i=>i.getAttribute('src').split('/').pop().slice(0,2))")
    d = {}
    for i, m in enumerate(ms): d.setdefault(m, []).append(i)
    out = []
    for v in d.values(): out += [v[0:2], v[2:4]]
    return out
def pairs_same(pg):
    srcs = pg.evaluate("[...document.querySelectorAll('.card .front img')].map(i=>i.getAttribute('src'))"); d = {}
    for i, s in enumerate(srcs): d.setdefault(s, []).append(i)
    return list(d.values())
def ready(pg): pg.wait_for_function("document.querySelector('#game').hidden===false && !document.querySelector('#btnPeek').disabled", timeout=20000)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    def page(w, h, mobile):
        pg = b.new_context(locale='zh-CN', viewport={'width': w, 'height': h}, device_scale_factor=2 if mobile else 1, is_mobile=mobile, has_touch=mobile, accept_downloads=True).new_page()
        pg.on('pageerror', lambda e: errs.append(f'PAGEERROR {e}')); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
        return pg
    def load(pg, sv): pg.goto(url); pg.evaluate(f"localStorage.setItem('{KEY}', {json.dumps(json.dumps(sv))})"); pg.reload(); pg.wait_for_timeout(1000)
    # home garden + variants in every look (mobile), and a garden poster per look
    for look in LOOKS:
        pg = page(390, 844, True); load(pg, dict(ALL, look=look))
        pg.evaluate("document.querySelector('.niwa').scrollIntoView({block:'center'})"); pg.wait_for_timeout(300)
        pg.screenshot(path=f'{out}/garden-{look}.png')
        info = pg.evaluate("[document.querySelectorAll('.np').length, document.querySelector('.niwa-cap').textContent, [...document.querySelectorAll('.gaien-go')].map(b=>b.disabled), document.documentElement.scrollWidth > innerWidth]")
        pg.click('.np[data-month="1"]'); pg.wait_for_timeout(200); t = pg.evaluate("document.querySelector('#toast').textContent.trim().slice(0,30)")
        noshare = pg.evaluate("!document.querySelector('[data-poster], [data-act^=\"poster\"]')")
        print(look, info, '| toast', t, '| no share', noshare)
        pg.close()
    # play each variant on desktop, win, make a win poster
    for v, look in [(101, 'washi'), (102, 'matsuri'), (103, 'manga')]:
        pg = page(1280, 860, False); load(pg, dict(ALL, look=look)); pg.mouse.click(3, 3)
        pg.click(f'#homeView [data-go="{v}"]', force=True); ready(pg)
        hud = pg.evaluate("[document.querySelector('#gNum').textContent, document.querySelector('#pairsLab').textContent, document.querySelector('#pairsTotal').textContent, document.querySelector('#hintText').textContent, document.querySelectorAll('.card').length, document.querySelector('#peekLeft').textContent, document.querySelector('#game').classList.contains('night')]")
        pg.screenshot(path=f'{out}/v{v}-play.png')
        if v == 102: pg.click('#btnPeek'); pg.wait_for_timeout(200); fl = pg.evaluate("document.querySelector('#board').classList.contains('flash')"); pg.wait_for_timeout(1800); hud.append(f'flash={fl}')
        prs = pairs_awase(pg) if v == 101 else pairs_same(pg)
        if v == 103:
            tgt = pg.evaluate("document.querySelector('#hintText').textContent")
        for a, c in prs:
            if pg.evaluate("!document.querySelector('#modal').hidden || !document.querySelector('#deck .card:not(.done)')"): break
            pg.click(f'.card[data-i="{a}"]'); pg.click(f'.card[data-i="{c}"]'); pg.wait_for_timeout(500)
        pg.wait_for_timeout(2500)
        won = pg.evaluate("!document.querySelector('#modal').hidden && document.querySelector('#modalCard h2').textContent")
        seal = pg.evaluate(f"Object.keys(JSON.parse(localStorage.getItem('{KEY}')).seals)")
        pg.screenshot(path=f'{out}/v{v}-win.png')
        acts = pg.evaluate("[...document.querySelectorAll('#modalCard .modal-actions .btn')].map(b => b.dataset.act)")
        print(v, hud, '| won', won, '| seals', seal, '| actions', acts)
        pg.close()
    # the omamori detail has no share button any more
    for look in ['ukiyo', 'techo']:
        pg = page(390, 844, True); load(pg, dict(ALL, look=look))
        pg.click('.tabs [data-sheet="omamori"]'); pg.wait_for_timeout(400)
        pg.click(f'[data-om="{ids[0]}"]'); pg.wait_for_timeout(300)
        print('omamori', look, pg.evaluate("[...document.querySelectorAll('#modalCard .modal-actions .btn')].map(b => b.textContent)"))
        pg.close()
    # locked variants for a newer player, plus a normal L1 win still works and shows "next"
    pg = page(375, 720, True); load(pg, {'unlocked': 2, 'demoDone': True, 'look': 'ukiyo'})
    print('locked', pg.evaluate("[...document.querySelectorAll('.gaien-go')].map(b=>b.disabled)"))
    pg.click('#homeView [data-go="1"]', force=True); ready(pg)
    for a, c in pairs_same(pg): pg.click(f'.card[data-i="{a}"]'); pg.click(f'.card[data-i="{c}"]'); pg.wait_for_timeout(450)
    pg.wait_for_timeout(2500); print('L1', pg.evaluate("[document.querySelector('#modalCard h2').textContent, [...document.querySelectorAll('#modalCard [data-act]')].map(b=>b.dataset.act)]"))
    pg.close()
    print('errors', len(errs), json.dumps(errs[:12], ensure_ascii=False))
    b.close()
srv.shutdown()
