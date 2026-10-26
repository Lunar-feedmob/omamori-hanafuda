# First visit on a mid-range phone: slow 4G and a 4x slower CPU. When does the home page show, when does a tap respond,
# and what was downloaded before that?
import sys, threading, http.server, functools, socketserver, json, time
from playwright.sync_api import sync_playwright
site = sys.argv[1]; url = sys.argv[2] if len(sys.argv) > 2 else None
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = url or f'http://127.0.0.1:{port}/index.html'
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(locale='zh-CN', viewport={'width': 390, 'height': 844}, device_scale_factor=3, is_mobile=True, has_touch=True)
    ctx.add_init_script("new MutationObserver((l, o) => { if (document.querySelector('#homeView .hv')) { window.__homeAt = performance.now(); o.disconnect(); } }).observe(document, {childList: true, subtree: true})")
    pg = ctx.new_page(); cdp = ctx.new_cdp_session(pg); sizes = {}
    cdp.send('Network.enable'); cdp.send('Network.emulateNetworkConditions', {'offline': False, 'latency': 150, 'downloadThroughput': 1.6e6 / 8, 'uploadThroughput': 750e3 / 8})
    cdp.send('Emulation.setCPUThrottlingRate', {'rate': 4})
    cdp.on('Network.responseReceived', lambda e: sizes.setdefault(e['requestId'], [e['response']['url'], 0, 0]))
    cdp.on('Network.loadingFinished', lambda e: e['requestId'] in sizes and (sizes[e['requestId']].__setitem__(1, e['encodedDataLength']), sizes[e['requestId']].__setitem__(2, time.time() - t0)))
    t0 = time.time(); pg.goto(url, wait_until='commit', timeout=120000)
    pg.wait_for_selector('#homeView .hv', timeout=120000); t_home = time.time() - t0
    cdp.send('Performance.enable'); m0 = {m['name']: m['value'] for m in cdp.send('Performance.getMetrics')['metrics']}
    print('at home: script %.1fs layout %.1fs style %.1fs' % (m0.get('ScriptDuration', 0), m0.get('LayoutDuration', 0), m0.get('RecalcStyleDuration', 0)))
    pg.wait_for_function("document.fonts.status === 'loaded'", timeout=120000); t_fonts = time.time() - t0
    pg.wait_for_load_state('load', timeout=180000); t_load = time.time() - t0
    fcp = pg.evaluate("(performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime || -1")
    before = sorted([v for v in sizes.values() if 0 < v[2] <= t_home], key=lambda x: x[2])
    print(f'first contentful paint {fcp / 1000:.1f}s; finished before home was shown:')
    for u, sz, t in before: print(f'  {t:5.1f}s {sz / 1024:6.0f} KB  {u[:100]}')
    cdp.send('Performance.enable'); mt = {m['name']: m['value'] for m in cdp.send('Performance.getMetrics')['metrics']}
    print('main-thread seconds: script %.1f  layout %.1f  style %.1f  tasks %.1f' % (mt.get('ScriptDuration', 0), mt.get('LayoutDuration', 0), mt.get('RecalcStyleDuration', 0), mt.get('TaskDuration', 0)))
    early = sorted(sizes.values(), key=lambda x: -x[1])
    total = sum(v[1] for v in early)
    print(f'home rendered at {pg.evaluate("window.__homeAt") / 1000:.1f}s (in-page clock)')
    print(f'home shown {t_home:.1f}s | fonts ready {t_fonts:.1f}s | load event {t_load:.1f}s | {len(early)} requests, {total / 1024:.0f} KB')
    for u, sz, t in early[:8]: print(f'  {sz / 1024:7.0f} KB  {u[:110]}')
    b.close()
srv.shutdown()
