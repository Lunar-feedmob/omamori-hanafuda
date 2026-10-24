// Progress model shared by every platform. The platform adapter only reads and writes the JSON string.
const {LEVELS, MOTIFS, SEALS, OM_TIERS} = require('./data');

const KEY = 'omamori-hanafuda-v1';
const MODES = ['relax', 'std', 'hard'];

function fresh() {
  return {unlocked: 1, best: {relax: {}, std: {}, hard: {}}, collected: {}, collectedAt: {}, seals: {}, mode: 'std', look: 'ukiyo', skin: 'classic',
    sound: true, bgm: true, musicVol: .7, sfxVol: .9, haptics: true, demoDone: false};
}

// Accepts saves written by the web version too, so progress can be carried over by pasting an export later.
function load(platform) {
  const s = fresh();
  let d = null;
  try { d = JSON.parse(platform.storage.get(KEY) || 'null'); } catch (e) {}
  if (!d || typeof d !== 'object') return s;
  const n = Number(d.unlocked); if (n >= 1) s.unlocked = Math.min(LEVELS.length, Math.floor(n));
  if (d.best && typeof d.best === 'object') for (const m of MODES) if (d.best[m]) for (const k in d.best[m]) { const v = Number(d.best[m][k]); if (v > 0 && LEVELS[k - 1]) s.best[m][k] = Math.min(3, v); }
  const ids = new Set(MOTIFS.map(m => m.id));
  if (d.collected) for (const k in d.collected) { const v = Number(d.collected[k]); if (ids.has(k) && v > 0) s.collected[k] = Math.floor(v); }
  if (d.collectedAt) for (const k in d.collectedAt) if (ids.has(k)) s.collectedAt[k] = Number(d.collectedAt[k]) || 0;
  if (d.seals) for (const k in d.seals) if (SEALS.some(x => x.id === k)) s.seals[k] = Number(d.seals[k]) || 1;
  for (const k of ['sound', 'bgm', 'haptics', 'demoDone']) if (typeof d[k] === 'boolean') s[k] = d[k];
  for (const k of ['musicVol', 'sfxVol']) if (typeof d[k] === 'number' && d[k] >= 0 && d[k] <= 1) s[k] = d[k];
  if (MODES.includes(d.mode)) s.mode = d.mode;
  if (typeof d.look === 'string') s.look = d.look;
  if (typeof d.skin === 'string') s.skin = d.skin;
  return s;
}
const persist = (platform, s) => { try { platform.storage.set(KEY, JSON.stringify(s)); } catch (e) {} };
const cleared = (s, n) => MODES.some(m => s.best[m][n] > 0);
const omTier = n => n >= OM_TIERS[2].min ? 2 : n >= OM_TIERS[1].min ? 1 : 0;
const collectedCount = s => MOTIFS.filter(m => s.collected[m.id]).length;

module.exports = {KEY, fresh, load, persist, cleared, omTier, collectedCount};
