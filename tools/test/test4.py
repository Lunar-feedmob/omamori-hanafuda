import os, sys, threading, http.server, functools, socketserver, json
from playwright.sync_api import sync_playwright
import fontcache; fontcache.patch()
site, out = sys.argv[1], sys.argv[2]
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{port}/_dbg.html'; KEY = 'omamori-hanafuda-v1'
SAVE = {'unlocked': 6, 'seenRules': True, 'demoDone': True, 'best': {'std': {'1': 3, '2': 2, '3': 3}}, 'collected': {'matsu': 1, 'matsu-tsuru': 3, 'ume-uguisu': 6, 'sakura-maku': 2, 'fuji': 7}, 'seals': {'san': 1}}
LOOKS = ['ukiyo', 'youth', 'manga', 'washi', 'kare', 'matsuri', 'techo']
errs = []
def pairs_of(pg):
    srcs = pg.evaluate("[...document.querySelectorAll('.card .front img')].map(i=>i.getAttribute('src'))")
    d = {}
    for i, s in enumerate(srcs): d.setdefault(s, []).append(i)
    return list(d.values())
with sync_playwright() as p:
    b = p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    def page(w, h, mobile):
        ctx = b.new_context(locale='zh-CN', viewport={'width': w, 'height': h}, device_scale_factor=1 if not mobile else 2, is_mobile=mobile, has_touch=mobile)
        pg = ctx.new_page()
        pg.on('pageerror', lambda e: errs.append(f'{w} PAGEERROR ' + str(e)))
        pg.on('console', lambda m: m.type == 'error' and errs.append(f'{w} ' + m.text))
        return pg
    def load(pg, sv):
        pg.goto(url); pg.evaluate(f"localStorage.setItem('{KEY}', {json.dumps(json.dumps(sv))})"); pg.reload(); pg.wait_for_timeout(1200)
    ov = lambda pg: pg.evaluate('document.documentElement.scrollWidth > innerWidth || [...document.querySelectorAll("#homeView, .sheet-body")].some(e=>e.scrollWidth>e.clientWidth+1)')
    fit = lambda pg: pg.evaluate("(()=>{const b=document.querySelector('#board').getBoundingClientRect(), d=document.querySelector('#deck').getBoundingClientRect(); return [Math.round(d.width), Math.round(d.height), Math.round(b.width), Math.round(b.height), d.bottom<=b.bottom+1 && d.right<=b.right+1, getComputedStyle(document.querySelector('.card')).width]})()")
    # desktop, every look: layout + a full level of play (sound for every band)
    for look in LOOKS:
        pg = page(1440, 900, False); load(pg, dict(SAVE, look=look))
        pg.mouse.click(5, 5)
        pg.screenshot(path=f'{out}/d-home-{look}.png')
        cols = pg.evaluate("(()=>{const a=document.querySelector('.hv-a').getBoundingClientRect(), b=document.querySelector('.hv-b').getBoundingClientRect(), t=document.querySelector('.tabs').getBoundingClientRect(); return [Math.round(a.left), Math.round(a.width), Math.round(b.left), Math.round(b.width), Math.round(t.width), Math.round(t.height)]})()")
        pg.click('#homeView [data-go="1"]', force=True); pg.wait_for_timeout(300)
        entering = pg.evaluate("document.querySelector('#game').classList.contains('enter')")
        pg.wait_for_timeout(5500)
        f = fit(pg); pg.screenshot(path=f'{out}/d-game-{look}.png')
        # keyboard: arrows + space flip, R peeks
        pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight')
        foc = pg.evaluate("document.activeElement.dataset.i")
        pg.keyboard.press('ArrowDown'); foc2 = pg.evaluate("document.activeElement.dataset.i")
        pg.keyboard.press('Space'); pg.wait_for_timeout(200)
        up = pg.evaluate("document.activeElement.classList.contains('up')")
        pg.keyboard.press('Space'); pg.wait_for_timeout(100)
        # finish the round by clicking pairs
        pg.wait_for_timeout(1500)
        for a, c in pairs_of(pg) * 2:
            if pg.evaluate(f"document.querySelector('.card[data-i=\"{a}\"]').classList.contains('done')"): continue
            pg.click(f'.card[data-i="{a}"]'); pg.click(f'.card[data-i="{c}"]'); pg.wait_for_timeout(450)
        pg.wait_for_timeout(2500)
        won = pg.evaluate("!document.querySelector('#modal').hidden && document.querySelector('#modalCard h2').textContent")
        eng = pg.evaluate("document.querySelector('#bgmNote') && document.querySelector('#bgmNote').textContent")
        print(look, 'cols', cols, 'enter', entering, 'fit', f, 'focus', foc, foc2, 'flipped', up, 'won', won, '|', eng)
        pg.close()
    # desktop R key peek
    pg = page(1280, 800, False); load(pg, dict(SAVE, look='ukiyo')); pg.click('#homeView [data-go="3"]', force=True); pg.wait_for_function("document.querySelector('#hintText').textContent.includes('翻开两张')", timeout=20000)
    before = pg.evaluate("document.querySelector('#peekLeft').textContent"); pg.keyboard.press('r'); pg.wait_for_timeout(300)
    print('R peek', before, '->', pg.evaluate("document.querySelector('#peekLeft').textContent"), 'peeking', pg.evaluate("document.querySelectorAll('.card.up').length"))
    pg.wait_for_timeout(3000)
    
    pg.close()
    # mobile: every look fits, no overflow
    for look in LOOKS:
        pg = page(375, 720, True); load(pg, dict(SAVE, look=look))
        hov = ov(pg); pg.screenshot(path=f'{out}/m-home-{look}.png')
        pg.click('#homeView [data-go="6"]', force=True); pg.wait_for_timeout(3000)
        print('mobile', look, 'home overflow', hov, 'game overflow', ov(pg), 'fit', fit(pg))
        pg.close()
    # omamori tiers + upgrade toast + settings
    pg = page(390, 800, True)
    allTwo = {k: 2 for k in json.loads(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ids.json')).read())}
    load(pg, dict(SAVE, look='washi', collected=dict(allTwo, **{'ume-uguisu': 6, 'fuji': 7, 'matsu-tsuru': 3})))
    pg.click('.tabs [data-sheet="omamori"]'); pg.wait_for_timeout(600); pg.screenshot(path=f'{out}/m-om.png')
    print('om count', pg.evaluate("document.querySelector('#omCount').textContent"), 'tiers', pg.evaluate("[document.querySelectorAll('.om-cell.t1').length, document.querySelectorAll('.om-cell.t2').length]"), 'overflow', ov(pg))
    pg.click('[data-om="ume-uguisu"]'); pg.wait_for_timeout(500); pg.screenshot(path=f'{out}/m-om-detail.png')
    pg.click('[data-act="close"]'); pg.click('[data-close="omamori"]')
    pg.click('#homeView [data-go="1"]', force=True); pg.wait_for_timeout(5500)
    a, c = pairs_of(pg)[0]; pg.click(f'.card[data-i="{a}"]'); pg.click(f'.card[data-i="{c}"]'); pg.wait_for_timeout(700)
    print('upgrade toast', pg.evaluate("document.querySelector('#toast').textContent.trim().slice(0,40)"))
    pg.screenshot(path=f'{out}/m-upgrade.png')
    pg.click('#btnHome'); pg.wait_for_timeout(400)
    pg.click('.tabs [data-sheet="settings"]'); pg.wait_for_timeout(500)
    pg.evaluate("document.querySelector('#tgSound').scrollIntoView()"); pg.screenshot(path=f'{out}/m-settings.png')
    pg.fill('#volMusic', '30'); pg.dispatch_event('#volMusic', 'change')
    pg.click('#btnTestSound'); pg.wait_for_timeout(900)
    print('diag', pg.evaluate("document.querySelector('#audioDiag').textContent.slice(0,60)"), 'vol', pg.evaluate(f"JSON.parse(localStorage.getItem('{KEY}')).musicVol"), 'haptic shown', pg.evaluate("!document.querySelector('#tgHaptic').hidden"))
    pg.close()
    print('errors', len(errs), json.dumps(errs[:12], ensure_ascii=False))
    b.close()
srv.shutdown()
