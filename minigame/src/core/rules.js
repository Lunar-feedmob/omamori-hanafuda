// The memory game itself: dealing, flipping, matching, steps, look-backs, streaks and seals.
// No drawing and no timers in here; the scene drives time and the game reports what happened through events.
const {LEVELS, MOTIFS, SEASONS, BY_ID, YAKU} = require('./data');
const {omTier, collectedCount} = require('./save');

const MODES = {
  relax: {name: '悠闲', limit: false, preview: 1.4, peeks: l => l.n >= 5 ? 2 : 1},
  std: {name: '标准', limit: true, preview: 1.4, peeks: l => l.n >= 5 ? 2 : 1},
  hard: {name: '挑战', limit: true, preview: 1, peeks: () => 1}
};
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const previewMs = (cards, k) => Math.round((2200 + cards * 130) * k);
const peekMs = cards => 1500 + cards * 50;

// Same rules as the web version: in-season and uncollected first; early gardens avoid look-alike cards.
function pickMotifs(lv, save) {
  const S = SEASONS[lv.s], inS = m => S.months.includes(m.m), got = m => !!save.collected[m.id];
  const cap = lv.n <= 4 ? 1 : lv.n <= 6 ? 2 : 3;
  const tiers = [m => inS(m) && !got(m), m => inS(m) && got(m), m => !inS(m) && !got(m), m => !inS(m) && got(m)];
  const per = {}, kasu = {}, out = [];
  for (const f of tiers) for (const id of shuffle(MOTIFS.filter(f).map(m => m.id))) {
    const m = BY_ID[id];
    if (out.length === lv.pairs || (per[m.m] || 0) >= cap || (m.tag === '素札' && kasu[m.m])) continue;
    per[m.m] = (per[m.m] || 0) + 1; if (m.tag === '素札') kasu[m.m] = 1;
    out.push(id);
  }
  for (const id of shuffle(MOTIFS.map(m => m.id))) { if (out.length >= lv.pairs) break; if (!out.includes(id)) out.push(id); }
  return shuffle(out);
}

class Game {
  constructor(n, save, emit, ids) {
    const L = LEVELS[n - 1], M = MODES[save.mode];
    this.n = n; this.L = L; this.mode = save.mode; this.save = save; this.emit = emit || (() => {});
    this.ids = ids || pickMotifs(L, save);
    this.deck = shuffle(this.ids.concat(this.ids)).map(id => ({id, up: false, done: false, peek: false}));
    this.budget = M.limit ? L[save.mode] : Infinity;
    this.used = 0; this.peeks = M.peeks(L); this.peeksUsed = 0; this.misses = 0; this.pairs = 0; this.combo = 0;
    this.first = null; this.phase = 'deal'; this.fresh = []; this.yaku = []; this.seals = []; this.pending = null;
    this.previewMs = previewMs(this.deck.length, M.preview);
  }
  get left() { return this.budget - this.used; }
  get total() { return this.ids.length; }
  startPreview() { this.phase = 'preview'; this.deck.forEach(c => c.peek = true); this.emit('preview', this.previewMs); return this.previewMs; }
  endPreview() { this.deck.forEach(c => c.peek = false); this.phase = 'play'; this.emit('play'); }
  // Returns how long the scene should wait before calling resolve(), or 0.
  tap(i) {
    if (this.phase === 'resolve' && this.pending && this.pending.miss) this.resolve();
    if (this.phase !== 'play') return 0;
    const c = this.deck[i];
    if (!c || c.done || c.up) return 0;
    c.up = true; this.emit('flip', i);
    if (this.first === null) { this.first = i; return 0; }
    const a = this.first; this.first = null; this.used++; this.phase = 'resolve';
    const match = this.deck[a].id === c.id;
    this.pending = {a, b: i, miss: !match};
    if (!match) { this.misses++; this.combo = 0; this.emit('miss', [a, i]); return 950; }
    return 300;
  }
  resolve() {
    const p = this.pending; if (!p) return;
    this.pending = null;
    const A = this.deck[p.a], B = this.deck[p.b];
    if (p.miss) {
      A.up = B.up = false; this.emit('unflip', [p.a, p.b]);
    } else {
      A.done = B.done = true; this.pairs++; this.combo++;
      this.collect(A.id);
      this.emit('match', {cards: [p.a, p.b], id: A.id, combo: this.combo});
      if (this.combo === 3) { if (isFinite(this.budget)) this.budget++; this.seal('san'); this.emit('combo', 3); }
      else if (this.combo === 5) { this.peeks++; this.seal('go'); this.emit('combo', 5); }
      else if (this.combo === 7) { this.seal('nana'); this.emit('combo', 7); }
    }
    if (this.pairs === this.total) { this.phase = 'end'; this.win(); return; }
    if (this.left <= 0) { this.phase = 'end'; this.lose(); return; }
    this.phase = 'play';
  }
  peek() {
    if (this.phase !== 'play' || this.peeks < 1) return 0;
    this.peeks--; this.peeksUsed++; this.phase = 'peek';
    this.deck.forEach(c => { if (!c.done) c.peek = true; });
    const ms = peekMs(this.deck.length); this.emit('peek', ms); return ms;
  }
  endPeek() { this.deck.forEach(c => c.peek = false); this.phase = 'play'; this.emit('play'); }
  collect(id) {
    const s = this.save, before = YAKU.filter(y => y.ids.every(k => s.collected[k])).map(y => y.name);
    const was = s.collected[id] || 0;
    s.collected[id] = was + 1;
    if (!was) { s.collectedAt[id] = Date.now(); this.fresh.push(id); }
    const made = YAKU.filter(y => y.ids.every(k => s.collected[k]) && !before.includes(y.name));
    if (made.length) { this.yaku.push(...made.map(y => y.name)); this.emit('yaku', made); }
    if (was && omTier(was + 1) > omTier(was)) this.emit('upgrade', {id, tier: omTier(was + 1)});
    if (collectedCount(s) === MOTIFS.length) this.seal('zensatsu');
  }
  seal(id) { if (this.save.seals[id]) return; this.save.seals[id] = Date.now(); this.seals.push(id); }
  flowers() {
    if (!isFinite(this.budget)) return this.used <= this.L.hard ? 3 : this.used <= this.L.std ? 2 : 1;
    const r = this.left / this.budget; return r >= .3 ? 3 : r >= .12 ? 2 : 1;
  }
  win() {
    const s = this.save, fl = this.flowers();
    s.best[this.mode][this.n] = Math.max(s.best[this.mode][this.n] || 0, fl);
    if (this.n < LEVELS.length) s.unlocked = Math.max(s.unlocked, this.n + 1);
    if (!this.misses) this.seal('muku');
    if (!this.peeksUsed) this.seal('ichimoku');
    if (LEVELS.every(l => Object.values(s.best).some(b => b[l.n] > 0))) this.seal('hakkei');
    this.emit('win', fl);
  }
  lose() { this.emit('lose'); }
}

module.exports = {Game, MODES, pickMotifs, shuffle};
