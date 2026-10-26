# The packaged mini tool at several phone sizes, inside a mocked 小红书 container with every outside request blocked.
import sys, threading, http.server, functools, socketserver, json
from playwright.sync_api import sync_playwright
dist, out = sys.argv[1], sys.argv[2]
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=dist); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{port}/'
MOCK = """(() => {
  const calls = window.__calls = [], store = JSON.parse(sessionStorage.getItem('__xhsStore') || '{}');
  const ok = (name, extra) => (o) => { calls.push([name, o]); return Promise.resolve(Object.assign({errMsg: name + ':ok'}, extra && extra(o))); };
  window.xhs = {launchOptions: {miniToolEnv: {buildVersion: 9512004, userDataPath: 'usr'}}, miniTool: {
    getLaunchOptions: ok('getLaunchOptions', () => ({miniToolEnv: {buildVersion: 9512004}})),
    setStorage: o => { store[o.key] = o.data; sessionStorage.setItem('__xhsStore', JSON.stringify(store)); calls.push(['setStorage', o.key]); return Promise.resolve({errMsg: 'setStorage:ok'}); },
    getStorage: o => Promise.resolve({errMsg: 'getStorage:ok', data: o.key in store ? store[o.key] : null}),
    removeStorage: o => { delete store[o.key]; return Promise.resolve({errMsg: 'removeStorage:ok'}); },
    writeTempFile: ok('writeTempFile', () => ({filePath: 'tmp/poster.png'})),
    saveImageToPhotosAlbum: ok('saveImageToPhotosAlbum'), postNote: ok('postNote'), vibrateShort: ok('vibrateShort'),
    getWindowInfo: ok('getWindowInfo', () => ({windowWidth: 390, windowHeight: 844, menuButtons: {back: null, me: null, share: {left: 330, top: 50, right: 374, bottom: 82, width: 44, height: 32}}}))
  }};
})();"""
SIZES = [(320, 568), (375, 667), (390, 844), (430, 932)]
LOOKS = ['ukiyo', 'honjo', 'techo', 'pixel', 'tsuki']
def pairs(pg):
    srcs = pg.evaluate("[...document.querySelectorAll('#deck .card .front img')].map(i=>i.getAttribute('src'))"); d = {}
    for i, s2 in enumerate(srcs): d.setdefault(s2, []).append(i)
    return list(d.values())
with sync_playwright() as p:
    b = p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']); problems = []
    for w, h in SIZES:
        errs, external = [], []
        ctx = b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2, is_mobile=True, has_touch=True)
        ctx.add_init_script(MOCK.replace('windowWidth: 390, windowHeight: 844', f'windowWidth: {w}, windowHeight: {h}').replace('left: 330', f'left: {w - 60}').replace('right: 374', f'right: {w - 16}'))
        ctx.route('**/*', lambda r: (external.append(r.request.url), r.abort()) if not r.request.url.startswith(base) else r.continue_())
        pg = ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
        pg.goto(base + 'index.html'); pg.wait_for_timeout(2000)
        for look in LOOKS:
            pg.evaluate("s => { const st = JSON.parse(sessionStorage.getItem('__xhsStore') || '{}'); st['omamori-hanafuda-v1'] = JSON.stringify(s); sessionStorage.setItem('__xhsStore', JSON.stringify(st)); }",
                        {'unlocked': 8, 'demoDone': True, 'seenRules': True, 'look': look, 'best': {'std': {str(i): 2 for i in range(1, 8)}}})
            pg.reload(); pg.wait_for_timeout(2200)
            home = pg.evaluate("[document.documentElement.scrollWidth > innerWidth, getComputedStyle(document.querySelector('#app')).paddingTop, document.documentElement.dataset.look]")
            pg.screenshot(path=f'{out}/{w}-{look}-home.png')
            pg.tap('#homeView [data-go="8"]', force=True)
            pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=25000); pg.wait_for_timeout(200)
            g = pg.evaluate("""(() => { const b = document.querySelector('#board').getBoundingClientRect(), cs = [...document.querySelectorAll('#deck .card')].map(c => c.getBoundingClientRect()), a = document.querySelector('.g-actions').getBoundingClientRect(), top = document.querySelector('.g-top').getBoundingClientRect();
              return {n: cs.length, minW: Math.round(Math.min(...cs.map(r => r.width))), out: cs.filter(r => r.bottom > b.bottom + 1 || r.right > innerWidth).length, actions: a.bottom <= innerHeight + 1, topY: Math.round(top.top), ov: document.documentElement.scrollWidth > innerWidth}; })()""")
            pg.screenshot(path=f'{out}/{w}-{look}-game.png')
            line = f'{w}x{h} {look:6s} home ov={home[0]} padTop={home[1]} look={home[2]} | game {g}'
            print(line, flush=True)
            if home[0] or g['out'] or not g['actions'] or g['ov'] or g['minW'] < 40 or home[2] != look: problems.append(line)
            pg.tap('#btnHome'); pg.wait_for_timeout(400)
        print(f'{w}x{h} external {external[:3]} errors {errs[:3]}', flush=True)
        if external or errs: problems.append(f'{w} external {external[:3]} errors {errs[:3]}')
        ctx.close()
    print('PROBLEMS', problems)
    b.close()
srv.shutdown()
