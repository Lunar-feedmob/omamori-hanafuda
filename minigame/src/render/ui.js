// A small immediate-mode canvas UI: the current scene draws itself every frame and registers its tappable areas as it goes.
// Redraws only while something is moving (ui.animate) or after input, to spare the battery.
const now = () => Date.now();

class UI {
  constructor(pf) {
    this.pf = pf; this.ctx = pf.canvas.getContext('2d'); this.images = {}; this.hits = []; this.scene = null; this.layer = null;
    this.until = 0; this.dirty = true; this.press = null; this.timers = [];
    pf.onTouch(p => { this.press = this.hit(p); if (this.press) { this.press.down = true; this.dirty = true; } },
      () => {}, p => {
        const h = this.hit(p), pr = this.press; this.press = null; this.dirty = true;
        if (h && pr && h.id === pr.id && h.onTap) h.onTap(p);
        else if (!h && (this.layer || this.scene) && (this.layer || this.scene).onTapEmpty) (this.layer || this.scene).onTapEmpty(p);
      });
    if (pf.onResize) pf.onResize(() => { this.dirty = true; if (this.scene && this.scene.onResize) this.scene.onResize(); });
    const loop = () => { this.frame(); pf.raf(loop); };
    pf.raf(loop);
  }
  get size() { return this.pf.info(); }
  go(scene) { this.clearTimers(); this.scene = scene; this.layer = null; this.enter = now(); this.animate(450); if (scene.onEnter) scene.onEnter(); }
  show(layer) { this.layer = layer; this.layerAt = now(); this.animate(400); }
  hide() { this.layer = null; this.dirty = true; }
  animate(ms) { this.until = Math.max(this.until, now() + ms); }
  later(fn, ms) { const t = setTimeout(() => { this.timers = this.timers.filter(x => x !== t); fn(); this.dirty = true; }, ms); this.timers.push(t); return t; }
  clearTimers() { this.timers.forEach(clearTimeout); this.timers = []; }
  img(src) {
    if (!src) return null;
    const e = this.images[src];
    if (e) return e.img || null;
    this.images[src] = {img: null};
    this.pf.loadImage(src).then(im => { this.images[src].img = im; this.dirty = true; });
    return null;
  }
  preload(list) { list.forEach(s => this.img(s)); }
  // the topmost registered area under the point wins; a layer (modal) blocks everything below it
  hit(p) { for (let i = this.hits.length - 1; i >= 0; i--) { const h = this.hits[i]; if (p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h) return h; if (h.block) return null; } return null; }
  area(id, x, y, w, h, onTap, extra) { const a = Object.assign({id, x, y, w, h, onTap, down: this.press && this.press.id === id}, extra); this.hits.push(a); return a; }
  frame() {
    const t = now();
    if (!this.dirty && t > this.until) return;
    this.dirty = false;
    const {w, h, dpr} = this.size, c = this.ctx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.hits = [];
    if (this.scene) this.scene.draw(c, t, w, h);
    if (this.layer) this.layer.draw(c, t, w, h);
  }
}

// drawing helpers shared by every scene
function rr(c, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.arcTo(x + w, y, x + w, y + r, r); c.lineTo(x + w, y + h - r); c.arcTo(x + w, y + h, x + w - r, y + h, r);
  c.lineTo(x + r, y + h); c.arcTo(x, y + h, x, y + h - r, r); c.lineTo(x, y + r); c.arcTo(x, y, x + r, y, r); c.closePath();
}
function text(c, s, x, y, o = {}) {
  c.font = `${o.weight || 400} ${o.size || 15}px ${o.font || 'sans-serif'}`;
  c.fillStyle = o.color || '#000'; c.textAlign = o.align || 'left'; c.textBaseline = o.base || 'alphabetic';
  if (o.spacing) {   // letter-spaced text (canvas letterSpacing isn't available everywhere)
    const chars = [...String(s)], widths = chars.map(ch => c.measureText(ch).width), total = widths.reduce((a, b) => a + b, 0) + o.spacing * (chars.length - 1);
    let cx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x;
    c.textAlign = 'left'; chars.forEach((ch, i) => { c.fillText(ch, cx, y); cx += widths[i] + o.spacing; });
    return total;
  }
  c.fillText(s, x, y);
  return c.measureText(s).width;
}
// vertical text, top to bottom
function vtext(c, s, x, y, o = {}) { const size = o.size || 15; [...s].forEach((ch, i) => text(c, ch, x, y + i * size * (o.step || 1.12), Object.assign({}, o, {align: 'center'}))); }
function wrap(c, s, x, y, maxW, lh, o = {}) {
  c.font = `${o.weight || 400} ${o.size || 15}px ${o.font || 'sans-serif'}`;
  let line = '', yy = y;
  for (const ch of String(s)) { if (c.measureText(line + ch).width > maxW && line) { text(c, line, x, yy, o); line = ch; yy += lh; } else line += ch; }
  if (line) text(c, line, x, yy, o);
  return yy + lh;
}
// an image fitted inside a box: 'contain' keeps it whole, 'cover' fills and trims the overflow
function picture(c, im, x, y, w, h, mode = 'cover') {
  if (!im) return false;
  const iw = im.width, ih = im.height, k = mode === 'cover' ? Math.max(w / iw, h / ih) : Math.min(w / iw, h / ih), dw = iw * k, dh = ih * k;
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.drawImage(im, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh); c.restore();
  return true;
}
const ease = t => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

module.exports = {UI, rr, text, vtext, wrap, picture, ease};
