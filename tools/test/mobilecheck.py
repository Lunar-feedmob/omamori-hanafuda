# Phone-sized pass over every look: home layout, the biggest garden's board, a played-through win card, the sheets.
import sys, threading, http.server, functools, socketserver, json
from playwright.sync_api import sync_playwright
import fontcache
site, out = sys.argv[1], sys.argv[2]
only = sys.argv[3].split(',') if len(sys.argv) > 3 else None
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{port}/_preview.html'
LOOKS = ['ukiyo', 'washi', 'kare', 'tsuki', 'rinpa', 'giga', 'honjo', 'matsuri', 'techo', 'taisho', 'manga', 'youth', 'pixel']
DEVICES = [('se1', 320, 568, 2), ('android-s', 360, 640, 3), ('se2', 375, 667, 2), ('ip14', 390, 844, 3), ('pixel7', 412, 915, 2.6), ('promax', 430, 932, 3), ('land', 844, 390, 3), ('ipad', 768, 1024, 2)]
if only: DEVICES = [d for d in DEVICES if d[0] in only]
SAVE = {'unlocked': 8, 'demoDone': True, 'seenRules': True, 'best': {'std': {str(i): 2 for i in range(1, 8)}}}
HOME_JS = """(() => { const v = document.querySelector('#homeView'), tabs = document.querySelector('.tabs'), tr = tabs.getBoundingClientRect();
  const cta = [...v.querySelectorAll('.go:not(:disabled)')][0], cr = cta && cta.getBoundingClientRect();
  const small = [...tabs.querySelectorAll('button')].filter(b => b.getBoundingClientRect().height < 44).length;
  const clipped = [...v.querySelectorAll('button, h1, h2, b, small, span')].filter(e => { const s = getComputedStyle(e); return e.scrollWidth > e.clientWidth + 2 && s.overflow === 'hidden' && s.textOverflow !== 'ellipsis' && e.clientWidth > 0; }).map(e => e.className || e.tagName).slice(0, 4);
  return {hov: document.documentElement.scrollWidth > innerWidth || v.scrollWidth > v.clientWidth + 1, ctaTop: cr ? Math.round(cr.top) : -1, ctaVisible: cr ? cr.top < tr.top - 20 && cr.bottom > 0 : false,
    tabsBottom: Math.round(tr.bottom), smallTabs: small, clipped}; })()"""
GAME_JS = """(() => { const b = document.querySelector('#board').getBoundingClientRect(), cards = [...document.querySelectorAll('#deck .card')].map(c => c.getBoundingClientRect());
  const act = document.querySelector('.g-actions').getBoundingClientRect(), hud = document.querySelector('.hud').getBoundingClientRect(), hint = document.querySelector('#hint').getBoundingClientRect();
  const minW = Math.min(...cards.map(r => r.width)), out = cards.filter(r => r.bottom > b.bottom + 1 || r.top < b.top - 1 || r.right > innerWidth || r.left < 0).length;
  return {cards: cards.length, minW: Math.round(minW), cardsOut: out, boardScroll: document.querySelector('#board').scrollHeight > document.querySelector('#board').clientHeight + 2,
    actionsVisible: act.bottom <= innerHeight + 1 && act.height > 0, hudTop: Math.round(hud.top), hintH: Math.round(hint.height), gov: document.documentElement.scrollWidth > innerWidth}; })()"""
WIN_JS = """(() => { const m = document.querySelector('#modalCard'), r = m.getBoundingClientRect(), p = m.querySelector('.btn.primary'), pr = p && p.getBoundingClientRect();
  return {fits: r.top >= 0 && r.bottom <= innerHeight, scrolls: m.scrollHeight > m.clientHeight + 2, primaryVisible: !!pr && pr.bottom <= r.bottom && pr.top >= r.top, h: Math.round(r.height)}; })()"""
def pairs(pg):
    srcs = pg.evaluate("[...document.querySelectorAll('#deck .card .front img')].map(i=>i.getAttribute('src'))"); d = {}
    for i, s2 in enumerate(srcs): d.setdefault(s2, []).append(i)
    return list(d.values())
problems = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, w, h, dsf in DEVICES:
        ctx = b.new_context(locale='zh-CN', viewport={'width': w, 'height': h}, device_scale_factor=dsf, is_mobile=name != 'ipad' or True, has_touch=True); fontcache.attach(ctx)
        pg = ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
        pg.goto(url, wait_until='domcontentloaded')
        for look in LOOKS:
            pg.evaluate(f"localStorage.setItem('omamori-hanafuda-v1', {json.dumps(json.dumps(dict(SAVE, look=look)))})"); pg.reload(wait_until='domcontentloaded'); pg.wait_for_timeout(1300)
            hm = pg.evaluate(HOME_JS)
            pg.screenshot(path=f'{out}/{name}-{look}-home.png')
            pg.tap('#homeView [data-go="8"]', force=True)
            pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=25000); pg.wait_for_timeout(200)
            gm = pg.evaluate(GAME_JS)
            pg.screenshot(path=f'{out}/{name}-{look}-game.png')
            line = f"{name:9s} {look:8s} home ov={hm['hov']} cta={hm['ctaTop']}{'' if hm['ctaVisible'] else '(below fold)'} tabsBottom={hm['tabsBottom']} smallTabs={hm['smallTabs']} clipped={hm['clipped']} | game cards={gm['cards']} minW={gm['minW']} out={gm['cardsOut']} scroll={gm['boardScroll']} actions={gm['actionsVisible']} gov={gm['gov']}"
            print(line, flush=True)
            if hm['hov'] or gm['cardsOut'] or gm['boardScroll'] or not gm['actionsVisible'] or gm['gov'] or gm['minW'] < 40 or hm['smallTabs'] or not hm['ctaVisible']: problems.append(line)
            pg.tap('#btnHome'); pg.wait_for_timeout(400)
        # a played garden and its win card, on this device, in two looks
        for look in ['ukiyo', 'honjo']:
            pg.evaluate(f"localStorage.setItem('omamori-hanafuda-v1', {json.dumps(json.dumps(dict(SAVE, look=look)))})"); pg.reload(wait_until='domcontentloaded'); pg.wait_for_timeout(1200)
            pg.tap('#homeView [data-go="3"]', force=True)
            pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=25000); pg.wait_for_timeout(200)
            for x, y in pairs(pg): pg.tap(f'#deck .card[data-i="{x}"]'); pg.tap(f'#deck .card[data-i="{y}"]'); pg.wait_for_timeout(480)
            pg.wait_for_function("!document.querySelector('#modal').hidden", timeout=9000); pg.wait_for_timeout(2600)
            wm = pg.evaluate(WIN_JS); pg.screenshot(path=f'{out}/{name}-{look}-win.png')
            line = f"{name:9s} {look:8s} WIN fits={wm['fits']} scrolls={wm['scrolls']} primaryVisible={wm['primaryVisible']} h={wm['h']}"
            print(line, flush=True)
            if not wm['fits'] or not wm['primaryVisible']: problems.append(line)
            pg.tap('[data-act="home"]'); pg.wait_for_timeout(500)
        # the sheets
        for sheet in ['dex', 'omamori', 'settings']:
            pg.tap(f'.tabs [data-sheet="{sheet}"]'); pg.wait_for_timeout(700)
            sm = pg.evaluate(f"(() => {{ const s = document.querySelector('#{sheet}') || document.querySelector('[data-sheet-id=\"{sheet}\"]'), bk = document.querySelector('.sheet:not([hidden]) .back-btn'), r = bk && bk.getBoundingClientRect(); return {{ov: document.documentElement.scrollWidth > innerWidth || [...document.querySelectorAll('.sheet:not([hidden]) .sheet-body')].some(e => e.scrollWidth > e.clientWidth + 1), back: r ? [Math.round(r.left), Math.round(r.top), Math.round(r.width)] : null}}; }})()")
            pg.screenshot(path=f'{out}/{name}-sheet-{sheet}.png')
            line = f"{name:9s} sheet {sheet:8s} ov={sm['ov']} back={sm['back']}"
            print(line, flush=True)
            if sm['ov'] or not sm['back']: problems.append(line)
            pg.tap('.sheet:not([hidden]) .back-btn'); pg.wait_for_timeout(400)
        if errs: problems.append(f'{name} errors {errs[:4]}')
        print(name, 'errors', errs[:4], flush=True)
        ctx.close()
    b.close()
srv.shutdown()
print('\nPROBLEMS'); [print(x) for x in problems]
