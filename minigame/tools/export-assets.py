"""Turn the web build's art into mini-game assets (PNG/JPG; no SVG, and no WebP to keep older iOS hosts safe).
Usage: python3 minigame/tools/export-assets.py   (needs Playwright + Chromium; writes into minigame/assets/)
  cards/<skin>/*.jpg      48 card faces, 244x400 (corners are clipped to the card's own radius when drawn)
  backs/<look>.jpg        card backs pre-composited: cloth colour + katagami + frame, 244x400
  art/<look>-<season>.jpg home artwork, max 720 px wide
"""
import base64, functools, http.server, json, os, re, socketserver, sys, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'minigame', 'assets')
SKINS = sys.argv[1].split(',') if len(sys.argv) > 1 else ['classic']
LOOKS = ['ukiyo', 'washi', 'tsuki', 'pixel']
html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
# card back markup per look, read from the web build so both stay identical
backs = {}
for look in LOOKS:
    if look == 'pixel': continue
    m = re.search(look + r": \{cloth: '([^']+)'.*?frame: '([^']+)'", html)
    backs[look] = {'cloth': m.group(1), 'frame': m.group(2), 'img': f'backs/{look}.webp'}
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{port}/'
JS = """async ([src, w, h, mime, q, fit]) => {
  const im = new Image(); im.src = src; await im.decode();
  const k = fit === 'width' ? Math.min(1, w / im.naturalWidth) : 1, W = fit === 'width' ? Math.round(im.naturalWidth * k) : w, H = fit === 'width' ? Math.round(im.naturalHeight * k) : h;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.imageSmoothingQuality = 'high';
  if (mime === 'image/jpeg') { g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); }
  g.drawImage(im, 0, 0, W, H); return c.toDataURL(mime, q); }"""
def save(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'wb').write(base64.b64decode(data.split(',')[1]))
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(); pg.goto(base + 'README.md')
    for skin in SKINS:
        files = sorted(f for f in os.listdir(os.path.join(ROOT, 'cards', skin)) if f.endswith('.svg'))
        for f in files:
            save(os.path.join(OUT, 'cards', skin, f[:-4] + '.jpg'), pg.evaluate(JS, [base + f'cards/{skin}/{f}', 244, 400, 'image/jpeg', .9, 'box']))
        print(skin, len(files), 'cards')
    for look, bk in backs.items():
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 80" width="244" height="400">'
               f'<rect width="50" height="80" fill="{bk["cloth"]}"/><image href="{base}{bk["img"]}" x="0" y="0" width="50" height="80" preserveAspectRatio="xMidYMid slice"/>{bk["frame"]}</svg>')
        # inline the katagami as a data URL so the SVG renders self-contained in an <img>
        img = pg.evaluate("async u => { const b = await (await fetch(u)).blob(); return await new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(b); }); }", base + bk['img'])
        svg = svg.replace(base + bk['img'], img)
        save(os.path.join(OUT, 'backs', look + '.jpg'), pg.evaluate(JS, ['data:image/svg+xml;charset=utf-8,' + __import__('urllib.parse').parse.quote(svg), 244, 400, 'image/jpeg', .88, 'box']))
    # the pixel back is drawn in code in the web build; render it from the page itself
    pg.goto(base + 'index.html'); pg.wait_for_timeout(1500)
    svg = pg.evaluate("document.querySelector('.card .face.back svg') ? null : null")
    pixel = pg.evaluate("""() => { const m = [...document.scripts].map(s => s.textContent).join('\\n'); return null; }""")
    save(os.path.join(OUT, 'backs', 'pixel.jpg'), pg.evaluate("""async () => {
      const u = 2.5, art = ['....#.#....', '...##.##...', '.#.#####.#.', '.#########.', '..##@@@##..', '###@@@@@###', '..##@@@##..', '.#########.', '.#.#####.#.', '...##.##...', '....#.#....'];
      const c = document.createElement('canvas'); c.width = 244; c.height = 400; const g = c.getContext('2d'); const k = 244 / 50; g.scale(k, k);
      const px = (x, y, col, o = 1) => { g.globalAlpha = o; g.fillStyle = col; g.fillRect(x * u, y * u, u, u); g.globalAlpha = 1; };
      g.fillStyle = '#1c143c'; g.fillRect(0, 0, 50, 80);
      for (let y = 0; y < 32; y++) for (let x = 0; x < 20; x++) if ((x + y) % 4 === 0) px(x, y, '#3a2f73', .7);
      art.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== '.') px(x + 4.5, y + 10.5, ch === '@' ? '#ffd23f' : '#ff4f9a'); }));
      for (const [x, y] of [[3, 3], [16, 4], [4, 27], [15, 28]]) px(x, y, '#3ee6ff');
      g.strokeStyle = '#3ee6ff'; g.lineWidth = 2.5; g.strokeRect(1.25, 1.25, 47.5, 77.5);
      return c.toDataURL('image/jpeg', .9); }"""))
    for look, files in {'ukiyo': ['ukiyo-%s.jpg'], 'washi': ['washi-%s.jpg'], 'tsuki': ['tsuki-%s.webp']}.items():
        for season in ['spring', 'summer', 'autumn', 'winter']:
            src = files[0] % season
            save(os.path.join(OUT, 'art', f'{look}-{season}.jpg'), pg.evaluate(JS, [base + 'art/' + src, 720, 0, 'image/jpeg', .84, 'width']))
    b.close()
srv.shutdown()
total = sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(OUT) for f in fs)
print('assets total', round(total / 1024), 'KB')
