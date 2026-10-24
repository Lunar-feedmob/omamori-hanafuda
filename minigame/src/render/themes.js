// The first four looks of the mini game, ported from the web build: palette, type, the ornament strip, and how panels,
// buttons, the board and the background are drawn. Card faces are never tinted or filtered; only their corners are rounded.
const {rr, text} = require('./ui');

const SERIF = '"Songti SC","STSong","Noto Serif CJK SC","Noto Serif SC",serif';
const SANS = '"PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const PIXEL = '"Fusion Pixel","PingFang SC",monospace';

const base = {
  font: SERIF, title: SERIF, radius: 4, bw: 1.5, dark: false,
  panel(c, x, y, w, h) { const t = this; rr(c, x, y, w, h, t.radius); c.fillStyle = t.panelBg; c.fill(); c.lineWidth = t.bw; c.strokeStyle = t.line; c.stroke(); },
  button(c, x, y, w, h, label, primary, down, size = 15) {
    const t = this, d = down ? 1 : 0;
    rr(c, x + d, y + d, w, h, t.radius); c.fillStyle = primary ? t.accent : t.panelBg; c.fill();
    c.lineWidth = t.bw; c.strokeStyle = primary ? t.accent : t.line2; c.stroke();
    text(c, label, x + w / 2 + d, y + h / 2 + 1 + d, {size, weight: 700, color: primary ? t.accentInk : t.text, align: 'center', base: 'middle', font: t.font});
  },
  // a thin decorative strip used on top of popups and under headers (the web build's --orn)
  ornament() {},
  background(c, w, h) { c.fillStyle = this.bg; c.fillRect(0, 0, w, h); },
  board(c, x, y, w, h) { rr(c, x, y, w, h, this.radius); c.fillStyle = this.boardBg; c.fill(); c.lineWidth = this.bw; c.strokeStyle = this.line; c.stroke(); }
};

const THEMES = {
  ukiyo: Object.assign({}, base, {
    name: '浮世锦绘', bg: '#f3ecdd', panelBg: '#f8f2e4', boardBg: 'rgba(248,242,228,.95)', text: '#1c2a44', muted: '#4a5670', faint: '#6a7184',
    accent: '#1f3a68', accentInk: '#f8f2e4', shu: '#c8402a', line: 'rgba(31,58,104,.22)', line2: 'rgba(31,58,104,.45)', radius: 3, bw: 2,
    back: 'assets/backs/ukiyo.jpg', art: s => `assets/art/ukiyo-${s}.jpg`, artCredit: '歌川广重《名所江户百景》，芝加哥艺术博物馆开放馆藏',
    ornament(c, x, y, w, h = 12) {   // seigaiha waves
      c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.fillStyle = this.bg; c.fillRect(x, y, w, h); c.strokeStyle = this.accent; c.lineWidth = 1;
      for (let cx = x; cx < x + w + 20; cx += 20) for (const r of [9, 5]) { c.beginPath(); c.arc(cx, y + h, r, Math.PI, 0); c.stroke(); }
      c.restore();
    },
    background(c, w, h) {
      c.fillStyle = this.bg; c.fillRect(0, 0, w, h);
      const g = c.createLinearGradient(0, 0, 0, h * .3); g.addColorStop(0, 'rgba(31,58,104,.22)'); g.addColorStop(1, 'rgba(31,58,104,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h * .3);
      c.save(); c.globalAlpha = .5; this.ornament(c, 0, h - 30, w, 30); c.restore();
    }
  }),
  washi: Object.assign({}, base, {
    name: '京都和纸', bg: '#f4efe3', panelBg: '#fbf8f0', boardBg: 'rgba(251,248,240,.96)', text: '#3a2f26', muted: '#6b5e50', faint: '#7d6f62',
    accent: '#b8392a', accentInk: '#fbf8f0', shu: '#b8392a', line: 'rgba(74,58,44,.18)', line2: 'rgba(74,58,44,.35)', radius: 2, bw: 1,
    back: 'assets/backs/washi.jpg', art: s => `assets/art/washi-${s}.jpg`, artCredit: '神坂雪佳《百々世草》，芝加哥艺术博物馆开放馆藏',
    ornament(c, x, y, w, h = 12) {   // a wooden lattice
      c.fillStyle = '#5a4532'; for (let cx = x; cx < x + w; cx += 16) c.fillRect(cx, y, 3, h); c.fillRect(x, y + h - 3, w, 3);
    },
    background(c, w, h) {
      c.fillStyle = this.bg; c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(74,58,44,.035)'; c.lineWidth = 1; for (let x = 0; x < w; x += 7) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
      this.ornament(c, 0, 0, w, 14);
    }
  }),
  tsuki: Object.assign({}, base, {
    name: '月白风清', dark: true, bg: '#10162a', panelBg: '#19213f', boardBg: 'rgba(14,19,38,.85)', text: '#efebdf', muted: '#c6c1b2', faint: '#9c988d',
    accent: '#d9c78f', accentInk: '#141a2e', shu: '#d0573c', line: 'rgba(236,230,207,.16)', line2: 'rgba(217,199,143,.45)', radius: 2, bw: 1,
    back: 'assets/backs/tsuki.jpg', art: s => `assets/art/tsuki-${s}.jpg`, artCredit: '月冈芳年《月百姿》，公有领域，Wikimedia Commons',
    ornament(c, x, y, w, h = 10) { for (let cx = x + 6; cx < x + w; cx += 13) { c.fillStyle = cx % 26 < 13 ? '#ece6cf' : 'rgba(217,199,143,.85)'; c.beginPath(); c.arc(cx, y + (cx % 26 < 13 ? 3 : 7), 1.1, 0, 7); c.fill(); } },
    background(c, w, h, t) {
      const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0b1124'); g.addColorStop(1, '#1e2846'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      let s = 7; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
      for (let i = 0; i < 70; i++) { c.globalAlpha = .2 + rnd() * .5; c.fillStyle = '#ece6cf'; c.beginPath(); c.arc(rnd() * w, rnd() * h, .5 + rnd(), 0, 7); c.fill(); }
      c.globalAlpha = .9; const mx = w * .78, my = h * .12, gl = c.createRadialGradient(mx, my, 10, mx, my, 120); gl.addColorStop(0, 'rgba(236,230,207,.35)'); gl.addColorStop(1, 'rgba(236,230,207,0)');
      c.fillStyle = gl; c.fillRect(mx - 120, my - 120, 240, 240); c.fillStyle = '#ece6cf'; c.beginPath(); c.arc(mx, my, 34, 0, 7); c.fill(); c.globalAlpha = 1;
    }
  }),
  pixel: Object.assign({}, base, {
    name: '电光游园', dark: true, font: PIXEL, title: PIXEL, bg: '#140f2b', panelBg: '#1c143c', boardBg: '#0d0922', text: '#f4f1ff', muted: '#cfc7f2', faint: '#a59dd0',
    accent: '#ff4f9a', accentInk: '#140f2b', shu: '#ff5d6c', line: '#3ee6ff', line2: '#3ee6ff', radius: 0, bw: 3,
    back: 'assets/backs/pixel.jpg', art: null,
    panel(c, x, y, w, h) { c.fillStyle = '#000'; c.fillRect(x + 4, y + 4, w, h); c.fillStyle = this.panelBg; c.fillRect(x, y, w, h); c.lineWidth = 3; c.strokeStyle = this.line; c.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3); },
    button(c, x, y, w, h, label, primary, down, size = 15) {
      const d = down ? 3 : 0;
      c.fillStyle = '#000'; c.fillRect(x + 4, y + 4, w, h);
      c.fillStyle = primary ? this.accent : this.panelBg; c.fillRect(x + d, y + d, w, h);
      c.lineWidth = 3; c.strokeStyle = primary ? '#ffd23f' : this.line; c.strokeRect(x + d + 1.5, y + d + 1.5, w - 3, h - 3);
      text(c, label, x + w / 2 + d, y + h / 2 + 1 + d, {size, color: primary ? this.accentInk : this.text, align: 'center', base: 'middle', font: this.font});
    },
    ornament(c, x, y, w, h = 8) { for (let cx = x, k = 0; cx < x + w; cx += 8, k++) { c.fillStyle = k % 2 ? '#3ee6ff' : '#ff4f9a'; c.fillRect(cx, y, 8, h / 2); c.fillStyle = k % 2 ? '#ff4f9a' : '#3ee6ff'; c.fillRect(cx, y + h / 2, 8, h / 2); } },
    background(c, w, h) {
      const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#140f2b'); g.addColorStop(.7, '#3a1458'); g.addColorStop(1, '#7a1e6a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      let s = 3; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
      for (let i = 0; i < 60; i++) { c.fillStyle = ['#f4f1ff', '#3ee6ff', '#ffd23f'][i % 3]; c.globalAlpha = .4 + rnd() * .6; const z = rnd() < .2 ? 4 : 2; c.fillRect(Math.floor(rnd() * w / 4) * 4, Math.floor(rnd() * h * .7 / 4) * 4, z, z); }
      c.globalAlpha = .55; c.strokeStyle = '#3ee6ff'; c.lineWidth = 1.5; const hz = h * .82;
      for (let i = -8; i <= 8; i++) { c.beginPath(); c.moveTo(w / 2, hz); c.lineTo(w / 2 + i * w / 6, h); c.stroke(); }
      for (let k = 0; k < 6; k++) { const y = hz + Math.pow(k / 6, 2) * (h - hz); c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
      c.globalAlpha = 1;
    },
    board(c, x, y, w, h) { c.fillStyle = this.boardBg; c.fillRect(x, y, w, h); c.lineWidth = 3; c.strokeStyle = this.line; c.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3); }
  })
};
const ORDER = ['ukiyo', 'washi', 'tsuki', 'pixel'];
const themeOf = key => THEMES[key] || THEMES.ukiyo;
module.exports = {THEMES, ORDER, themeOf, SERIF, SANS};
