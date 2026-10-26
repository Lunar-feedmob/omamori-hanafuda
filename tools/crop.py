# Crop regions out of images and save them as WebP, using headless Chromium's canvas (no PIL here).
# usage: crop.py SRC_DIR OUT_DIR JOBS_JSON   where JOBS = [[src, x, y, w, h, outW, outName, quality], ...]
import sys, json, base64, threading, http.server, functools, socketserver, os
from playwright.sync_api import sync_playwright
src_dir, out_dir, jobs = sys.argv[1], sys.argv[2], json.loads(open(sys.argv[3]).read())
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=src_dir); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
JS = """async ([src, x, y, w, h, ow, q]) => {
  const im = new Image(); im.src = src; await im.decode();
  const oh = Math.round(h * ow / w), c = document.createElement('canvas'); c.width = ow; c.height = oh;
  const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(im, x, y, w, h, 0, 0, ow, oh);
  return [c.toDataURL('image/webp', q), im.naturalWidth, im.naturalHeight, oh]; }"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(); pg.goto(f'http://127.0.0.1:{port}/')
    for src, x, y, w, h, ow, name, q in jobs:
        data, nw, nh, oh = pg.evaluate(JS, [f'http://127.0.0.1:{port}/{src}', x, y, w, h, ow, q])
        path = os.path.join(out_dir, name); open(path, 'wb').write(base64.b64decode(data.split(',')[1]))
        print(name, f'{ow}x{oh}', os.path.getsize(path) // 1024, 'KB', '(source', nw, 'x', nh, ')')
    b.close()
srv.shutdown()
