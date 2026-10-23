// Generates the three original 48-card decks (墨绘 ink, 剪纸 kirie, 网点 tone) as SVG files.
// Usage: node tools/make-decks.mjs <output cards dir>
// Every deck shares one set of compositions; a style only decides how each role is painted.
import {mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const out = process.argv[2] || 'cards';
const r2 = n => Math.round(n * 100) / 100;
const rad = d => d * Math.PI / 180;
let K = {};   // palette of the style being drawn

function blossom(x, y, r, fill, center = K.gold) {
  let s = '';
  for (let k = 0; k < 5; k++) { const a = rad(k * 72 - 90); s += `<circle cx="${r2(x + Math.cos(a) * r * .55)}" cy="${r2(y + Math.sin(a) * r * .55)}" r="${r2(r * .5)}" fill="${fill}"/>`; }
  return s + `<circle cx="${x}" cy="${y}" r="${r2(r * .26)}" fill="${center}"/>`;
}
function star(x, y, ro, ri, n, rot, fill) {
  let d = '';
  for (let k = 0; k < n * 2; k++) { const r = k % 2 ? ri : ro, a = rad(rot + k * 180 / n - 90); d += (k ? 'L' : 'M') + r2(x + Math.cos(a) * r) + ' ' + r2(y + Math.sin(a) * r); }
  return `<path d="${d}Z" fill="${fill}"/>`;
}
const maple = (x, y, s, rot, fill) => star(x, y, s, s * .45, 5, rot, fill) + `<circle cx="${x}" cy="${y}" r="${r2(s * .18)}" fill="${K.dred}"/>`;
const ell = (cx, cy, rx, ry, rot, fill) => `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(rx)}" ry="${r2(ry)}" transform="rotate(${rot} ${r2(cx)} ${r2(cy)})" fill="${fill}"/>`;
const qpt = (p0, p1, p2, t) => [(1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];
const BIRD = (x, y, k, body, belly) =>
  `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 0 Q6 -3 12 -1 L19 -8 L16 0 L23 1 L13 2.5 Q6 4 0 0Z" fill="${body}"/><path d="M4 1 Q8 3 12 1.5" stroke="${belly}" stroke-width="1.4" fill="none"/><circle cx="2" cy="-.6" r=".5" fill="${K.white}" stroke="none"/><path d="M0 -.2 L-2.6 .4 L0 .8Z" fill="${K.gold}"/></g>`;

/* ---------- the twelve plants (50 × 80 drawing space) ---------- */
const PLANT = {
  1() {
    const cl = (x, y, w) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${r2(w * .42)}" fill="${K.green}"/>` +
      [-.8, -.4, 0, .4, .8].map(t => `<path d="M${x} ${r2(y + w * .3)} L${r2(x + t * w)} ${r2(y - w * .3)}" stroke="${K.dgreen}" stroke-width=".9"/>`).join('');
    return `<g fill="none" stroke="${K.brown}" stroke-linecap="round"><path d="M20 80 C22 66 13 58 20 47 C26 38 24 30 31 22" stroke-width="3.4"/><path d="M19 49 C14 45 10 46 8 48" stroke-width="2"/><path d="M23 58 C31 56 35 58 40 60" stroke-width="2"/></g>`
      + cl(31, 21, 13) + cl(10, 46, 9) + cl(39, 59, 10);
  },
  2() {
    let s = `<g fill="none" stroke="${K.ink}" stroke-linejoin="round" stroke-linecap="round"><path d="M6 80 L13 63 L9 49 L20 37 L17 23 L27 10" stroke-width="2.6"/><path d="M20 37 L33 31 L43 35" stroke-width="1.8"/><path d="M13 63 L26 60" stroke-width="1.6"/></g>`;
    [[13, 63, 5.5], [9, 49, 5], [20, 37, 5.5], [17, 23, 5], [27, 10, 5], [33, 31, 5], [43, 35, 4.5], [26, 60, 5]].forEach(([x, y, r]) => s += blossom(x, y, r, K.red));
    [[4, 40], [38, 26], [30, 14], [47, 32]].forEach(([x, y]) => s += `<circle cx="${x}" cy="${y}" r="1.6" fill="${K.dred}"/>`);
    return s;
  },
  3() {
    let s = `<g fill="none" stroke="${K.brown}" stroke-linecap="round"><path d="M26 80 C24 66 29 56 25 42" stroke-width="3.2"/><path d="M25 52 C19 48 15 47 11 44" stroke-width="1.8"/><path d="M26 58 C32 54 36 52 41 48" stroke-width="1.8"/></g>`;
    [[12, 20, 10], [26, 12, 12], [40, 21, 10], [17, 33, 10], [34, 34, 11], [26, 25, 10]].forEach(([x, y, r]) => s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${K.pink}"/>`);
    [[9, 17], [21, 9], [31, 14], [41, 19], [15, 33], [35, 35], [26, 26], [44, 29], [19, 22]].forEach(([x, y]) => s += blossom(x, y, 3.2, K.white, K.pink2));
    return s;
  },
  4() {
    let s = `<path d="M0 7 Q25 15 50 6" fill="none" stroke="${K.ink}" stroke-width="2.2"/>`;
    [[6, 9], [16, 11.5], [28, 12], [40, 10], [47, 7.5]].forEach(([x, y], i) => s += ell(x, y + 2, 3.2, 1.4, i % 2 ? 25 : -25, K.green));
    [[9, 10, 9], [20, 12, 11], [32, 12, 10], [43, 9, 8]].forEach(([x, y, n]) => {
      for (let i = 0; i < n; i++) s += ell(x + Math.sin(i * 1.3) * 1.3, y + 3 + i * 3.7, 3.4 * (1 - i / (n + 3)), 2.1, 0, i % 2 ? K.violet : K.purple);
    });
    return s;
  },
  5() {
    let s = '';
    [[8, 46, -3, K.dgreen], [15, 60, 2, K.green], [22, 40, -1, K.dgreen], [30, 54, 3, K.green], [37, 44, -2, K.dgreen], [44, 58, 1, K.green]].forEach(([x, h, l, c]) =>
      s += `<path d="M${x - 2} 80 Q${x + l} ${80 - h / 2} ${x + l * 2} ${80 - h} Q${x + l + 1} ${80 - h / 2} ${x + 2} 80Z" fill="${c}"/>`);
    [[14, 20], [31, 26], [43, 16]].forEach(([x, y]) => {
      s += ell(x - 3, y + 3, 2.8, 6.5, -38, K.purple) + ell(x + 3, y + 3, 2.8, 6.5, 38, K.purple) + ell(x, y - 3, 2.2, 5, 0, K.blue)
        + `<path d="M${x - 3.5} ${y + 3} l2 2 M${x + 3.5} ${y + 3} l-2 2" stroke="${K.gold}" stroke-width=".9"/>`;
    });
    return s;
  },
  6() {
    let s = `<path d="M25 80 Q14 64 3 66 Q14 57 25 70Z" fill="${K.green}"/><path d="M25 80 Q36 62 48 63 Q37 57 25 70Z" fill="${K.dgreen}"/><path d="M25 80 Q22 66 25 52" stroke="${K.dgreen}" stroke-width="1.6" fill="none"/>`;
    const flower = (cx, cy, k) => {
      let f = '';
      for (let i = 0; i < 7; i++) { const a = i * 360 / 7; f += ell(cx + Math.cos(rad(a)) * 6 * k, cy + Math.sin(rad(a)) * 6 * k, 6.5 * k, 4.6 * k, a, K.red); }
      for (let i = 0; i < 5; i++) { const a = i * 72 + 20; f += ell(cx + Math.cos(rad(a)) * 3 * k, cy + Math.sin(rad(a)) * 3 * k, 3.8 * k, 2.8 * k, a, K.dred); }
      return f + `<circle cx="${cx}" cy="${cy}" r="${r2(2 * k)}" fill="${K.gold}"/>`;
    };
    return s + flower(25, 42, 1.25) + flower(10, 20, .7) + `<circle cx="40" cy="20" r="4" fill="${K.red}"/><path d="M36 22 Q40 27 44 22" fill="${K.green}"/>`;
  },
  7() {
    let s = '';
    [[[3, 80], [8, 36], [42, 26]], [[10, 80], [18, 50], [47, 46]], [[1, 64], [16, 20], [34, 8]], [[18, 80], [30, 62], [49, 64]]].forEach(([a, b, c], j) => {
      s += `<path d="M${a[0]} ${a[1]} Q${b[0]} ${b[1]} ${c[0]} ${c[1]}" fill="none" stroke="${K.dgreen}" stroke-width=".9"/>`;
      for (let t = .32; t <= 1.001; t += .085) {
        const [x, y] = qpt(a, b, c, t);
        s += ell(x, y + 2.2, 1.9, 1.05, 30 + j * 10, K.moss);
        s += `<circle cx="${r2(x + 1.2)}" cy="${r2(y - 1.4)}" r="1.25" fill="${K.hagi}"/>`;
      }
    });
    return s;
  },
  8() {
    let s = '';
    [[8, 30], [13, 24], [19, 28], [30, 26], [36, 22], [42, 30]].forEach(([x, top]) => s += `<path d="M${x} 52 Q${x + 2} 40 ${x + 5} ${top}" fill="none" stroke="${K.ink}" stroke-width=".9"/>`);
    s += `<path d="M0 46 Q14 34 28 40 Q40 45 50 38 L50 80 L0 80Z" fill="${K.hill}"/>`;
    for (let i = 0; i < 9; i++) { const x = 3 + i * 5.5; s += `<path d="M${x} 80 Q${x + 3} 64 ${x + 7} ${48 - (i % 3) * 3}" fill="none" stroke="${K.grass}" stroke-width=".55"/>`; }
    return s;
  },
  9() {
    let s = `<path d="M25 80 Q22 60 25 38" stroke="${K.dgreen}" stroke-width="1.8" fill="none"/>`
      + ell(17, 62, 7, 3.2, -25, K.dgreen) + ell(33, 56, 7, 3.2, 25, K.green) + ell(15, 50, 5, 2.4, -40, K.green);
    const flower = (cx, cy, k, c1, c2) => {
      let f = '';
      for (let i = 0; i < 18; i++) { const a = i * 20; f += ell(cx + Math.cos(rad(a)) * 7 * k, cy + Math.sin(rad(a)) * 7 * k, 5 * k, 1.5 * k, a, c1); }
      for (let i = 0; i < 12; i++) { const a = i * 30 + 15; f += ell(cx + Math.cos(rad(a)) * 4 * k, cy + Math.sin(rad(a)) * 4 * k, 3.2 * k, 1.2 * k, a, c2); }
      return f + `<circle cx="${cx}" cy="${cy}" r="${r2(2.2 * k)}" fill="${c2}"/>`;
    };
    return s + flower(25, 27, 1.15, K.gold, K.gold2) + flower(41, 44, .55, K.red, K.gold) + flower(9, 38, .5, K.white, K.gold);
  },
  10() {
    let s = `<g fill="none" stroke="${K.brown}" stroke-linecap="round"><path d="M50 8 Q32 16 21 33 Q14 44 3 50" stroke-width="1.7"/><path d="M30 20 Q36 28 40 34" stroke-width="1"/><path d="M15 42 Q20 50 22 56" stroke-width="1"/></g>`;
    [[42, 9, 6, 10, K.red], [31, 17, 6.5, -15, K.dred], [22, 29, 7, 20, K.red], [12, 43, 6, -10, K.dred], [40, 33, 5.5, 30, K.red], [22, 55, 5.5, -25, K.red], [6, 30, 5, 15, K.red], [45, 22, 4.5, -30, K.dred]]
      .forEach(a => s += maple(...a));
    return s;
  },
  11() {
    let s = `<path d="M0 68 Q12 63 25 67 T50 66 L50 80 L0 80Z" fill="${K.blue}"/><path d="M4 72 q4 -2 8 0 M20 74 q4 -2 8 0 M36 72 q4 -2 8 0" stroke="${K.white}" stroke-width=".6" fill="none"/>`;
    [[5, 48], [12, 58], [19, 44], [27, 56], [34, 46], [41, 60], [47, 42]].forEach(([x, end], i) => {
      s += `<path d="M${x} 0 Q${x + 5} ${end / 2} ${x - 1} ${end}" fill="none" stroke="${i % 2 ? K.green : K.moss}" stroke-width="1.1"/>`;
      for (let t = .25; t < 1; t += .18) { const [px, py] = qpt([x, 0], [x + 5, end / 2], [x - 1, end], t); s += ell(px + 1, py, 1.6, .7, 70, K.green); }
    });
    return s;
  },
  12() {
    let s = '';
    [[15, 5], [25, 7], [35, 5]].forEach(([x, n]) => {
      const top = 46 - n * 3.3;
      s += `<path d="M${x} 52 L${x} ${r2(top)}" stroke="${K.ink}" stroke-width=".9"/>`;
      for (let i = 0; i < n; i++) s += `<circle cx="${x + (i % 2 ? 1.6 : -1.6)}" cy="${r2(top + 1 + i * 3.2)}" r="1.9" fill="${i % 2 ? K.violet : K.purple}"/>`;
    });
    return s + `<path d="M1 80 Q-1 57 15 55 Q26 55 27 80Z" fill="${K.dgreen}"/><path d="M21 80 Q23 51 39 53 Q52 57 50 80Z" fill="${K.green}"/>`
      + `<path d="M14 80 Q14 66 15 57 M8 70 L14 66 L20 70 M36 80 Q36 66 38 55 M30 68 L37 63 L44 68" stroke="${K.moss}" stroke-width=".7" fill="none"/>`;
  }
};

/* ---------- the special cards: animals, objects and the five brights ---------- */
const SPECIAL = {
  '01-hikari': {under: () => `<circle cx="36" cy="18" r="12" fill="${K.sun}"/>`,
    over: () => `<path d="M14 64 Q22 54 34 60 Q30 69 18 68Z" fill="${K.white}" stroke="${K.ink}" stroke-width=".6"/><path d="M15 64 L7 69 L16 67Z" fill="${K.ink}"/>`
      + `<path d="M30 60 Q35 50 30 42" stroke="${K.ink}" stroke-width="3.2" fill="none"/><path d="M30 60 Q35 50 30 42" stroke="${K.white}" stroke-width="2" fill="none"/>`
      + `<circle cx="30" cy="41" r="2.4" fill="${K.white}" stroke="${K.ink}" stroke-width=".5"/><circle cx="30" cy="39.4" r="1.1" fill="${K.sun}"/><path d="M32 41 L38 42.6 L32 42.2Z" fill="${K.ink}"/>`
      + `<path d="M18 60 Q25 52 32 58" fill="none" stroke="${K.ink}" stroke-width=".8"/><path d="M22 68 L21 77 M26 68 L27 77" stroke="${K.ink}" stroke-width=".9"/>`},
  '02-tane': {over: () => ell(33, 50, 6.5, 4.2, -18, K.olive) + `<circle cx="39" cy="46" r="3.2" fill="${K.olive}"/><path d="M41.6 45.5 L45 46 L41.6 47Z" fill="${K.ink}"/><circle cx="39.8" cy="45.4" r=".6" fill="${K.ink}"/>`
    + ell(31, 49, 4.2, 2.2, -18, K.olive2) + `<path d="M27 52 L20 56 L22 52.5Z" fill="${K.olive2}"/><path d="M33 54 L32 57 M35 54 L35.5 57" stroke="${K.ink}" stroke-width=".6"/>`},
  '03-hikari': {over: () => {
    let s = `<path d="M1 50 L49 50 L49 70 Q43 76 37 70 Q31 76 25 70 Q19 76 13 70 Q7 76 1 70Z" fill="${K.cloth}" stroke="${K.dred}" stroke-width=".8"/><rect x="1" y="50" width="48" height="4" fill="${K.sun}"/>`
      + `<path d="M1 54 Q25 61 49 54" stroke="${K.sun}" stroke-width="1.2" fill="none"/>`;
    [12, 25, 38].forEach(x => s += blossom(x, 63, 4.2, K.sun, K.gold));
    return s;
  }},
  '04-tane': {under: () => `<circle cx="37" cy="56" r="8" fill="${K.gold}"/><circle cx="40" cy="53.5" r="7.2" fill="${K.bg}"/>`, over: () => BIRD(10, 60, 1.25, K.ink, K.sun)},
  '05-tane': {over: () => `<path d="M-2 66 L24 58 L24 63 L-2 71Z" fill="${K.brown}"/><path d="M24 58 L52 64 L52 69 L24 63Z" fill="${K.deer}"/>`
    + `<path d="M4 69 L4 78 M18 65 L18 76 M30 64 L30 76 M44 67 L44 78" stroke="${K.ink}" stroke-width="1"/>`},
  '06-tane': {over: () => {
    const fly = (x, y, k, c1, c2) => ell(x - 3 * k, y - 2 * k, 3.2 * k, 2.4 * k, -30, c1) + ell(x + 3 * k, y - 2 * k, 3.2 * k, 2.4 * k, 30, c1)
      + ell(x - 2.4 * k, y + 2 * k, 2.2 * k, 1.6 * k, 25, c2) + ell(x + 2.4 * k, y + 2 * k, 2.2 * k, 1.6 * k, -25, c2)
      + `<path d="M${x} ${r2(y - 3 * k)} L${x} ${r2(y + 3.5 * k)}" stroke="${K.ink}" stroke-width="${r2(.8 * k)}"/>`;
    return fly(14, 10, 1.15, K.blue, K.gold) + fly(38, 60, 1, K.purple, K.gold);
  }},
  '07-tane': {over: () => `<ellipse cx="25" cy="64" rx="13" ry="7" fill="${K.boar}"/><path d="M35 59 L46 63.5 L44.5 68 L35 69.5Z" fill="${K.boar}"/><rect x="44.6" y="63" width="2.2" height="4" rx=".6" fill="${K.boar2}"/>`
    + `<path d="M42.5 66 L44.2 62.8" stroke="${K.white}" stroke-width=".9" stroke-linecap="round"/><circle cx="40" cy="62.6" r=".7" fill="${K.white}"/><path d="M36 58.5 L38 55.5 L39.5 59Z" fill="${K.boar2}"/>`
    + `<path d="M14 58 Q25 54 36 58" stroke="${K.boar2}" stroke-width="1.6" fill="none"/><path d="M16 69 L15 76 M21 70 L21 77 M30 70 L30 77 M35 69 L36 76" stroke="${K.boar2}" stroke-width="2"/>`},
  '08-tane': {over: () => BIRD(6, 20, .7, K.ink, K.white) + BIRD(19, 15, .7, K.ink, K.white) + BIRD(32, 10, .7, K.ink, K.white)},
  '08-hikari': {sky: true, under: () => `<circle cx="25" cy="25" r="14.5" fill="${K.cream}"/>`},
  '09-tane': {over: () => `<path d="M9 62 Q25 78 41 62Z" fill="${K.sun}"/><ellipse cx="25" cy="62" rx="16" ry="4" fill="${K.gold}"/><ellipse cx="25" cy="62" rx="14" ry="2.9" fill="${K.dred}"/>`
    + `<ellipse cx="25" cy="73.5" rx="6" ry="1.8" fill="${K.dred}"/><text x="25" y="71.2" text-anchor="middle" font-size="6.4" font-weight="800" font-family="serif" fill="${K.gold}" stroke="none">寿</text>`},
  '10-tane': {over: () => `<ellipse cx="22" cy="64" rx="10.5" ry="5.2" fill="${K.deer}"/><path d="M28 62 L33 51 L36.5 52.5 L32.5 64Z" fill="${K.deer}"/>` + ell(36.5, 50.5, 4, 2.4, 22, K.deer)
    + `<path d="M34 48.5 L32 41.5 M32.6 43.6 L29.6 41 M37 48.5 L39 41.5 M38.4 43.6 L41.6 41.4" stroke="${K.deer2}" stroke-width=".9" fill="none" stroke-linecap="round"/>`
    + `<path d="M15 67 L14 77 M19 68 L19.5 77 M26 68 L26 77 M30 67 L31 76" stroke="${K.deer2}" stroke-width="1.5"/><circle cx="39.6" cy="51" r=".55" fill="${K.ink}"/>`
    + [[17, 62], [21, 61], [25, 62.5], [19, 65]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${K.white}" stroke="none"/>`).join('')},
  '11-tane': {under: () => Array.from({length: 10}, (_, i) => `<path d="M${6 + i * 6} 0 L${i * 6 - 4} 66" stroke="${K.rain}" stroke-width=".45"/>`).join(''),
    over: () => `<path d="M26 44 L9 35 L22 46Z" fill="${K.ink}"/><path d="M26 44 L43 33 L30 46Z" fill="${K.ink}"/><ellipse cx="26" cy="46" rx="4.4" ry="2.5" fill="${K.ink}"/>`
      + `<path d="M24 48 L17 59 M27 48 L23 60" stroke="${K.ink}" stroke-width="1.3"/><circle cx="29.5" cy="45.4" r="1.1" fill="${K.sun}"/><ellipse cx="25" cy="47.2" rx="2.4" ry=".9" fill="${K.white}"/>`},
  '11-hikari': {under: () => Array.from({length: 10}, (_, i) => `<path d="M${6 + i * 6} 0 L${i * 6 - 4} 66" stroke="${K.rain}" stroke-width=".45"/>`).join(''),
    over: () => `<path d="M13 36 Q24 25 35 36Z" fill="${K.sun}"/><path d="M24 26 L24 24" stroke="${K.ink}" stroke-width=".8"/><path d="M13 36 Q24 33 35 36" fill="none" stroke="${K.dred}" stroke-width=".6"/>`
      + `<path d="M24 36 L24 50" stroke="${K.ink}" stroke-width=".8"/><circle cx="23" cy="41" r="2.5" fill="${K.skin}"/><path d="M20.5 39.6 Q23 36.6 25.5 39.6Z" fill="${K.ink}"/>`
      + `<path d="M18 45 L28 45 L32 63 L14 63Z" fill="${K.robe}"/><path d="M23 45 L22 63" stroke="${K.dred}" stroke-width=".6"/><path d="M16 63 L14 65 M30 63 L32 65" stroke="${K.ink}" stroke-width=".8"/>`
      + ell(38, 63, 3.2, 2.2, 0, K.moss) + `<circle cx="36.6" cy="61.3" r=".9" fill="${K.moss}"/><circle cx="39.4" cy="61.3" r=".9" fill="${K.moss}"/><circle cx="36.6" cy="61.1" r=".35" fill="${K.ink}" stroke="none"/><circle cx="39.4" cy="61.1" r=".35" fill="${K.ink}" stroke="none"/>`
      + `<path d="M35 64 l-2 2 M41 64 l2 2" stroke="${K.green}" stroke-width=".7"/>`},
  '12-hikari': {over: () => {
    let s = '';
    [K.sun, K.gold, K.green, K.blue, K.purple].forEach((c, i) => s += `<path d="M20 38 Q${30 + i * 2} ${10 - i} ${47 - i * 1.5} ${4 + i * 3}" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
    return s + `<path d="M8 45 Q15 32 27 36 Q25 47 11 49Z" fill="${K.sun}"/><path d="M13 41 Q22 25 35 29 Q26 36 18 45Z" fill="${K.gold}"/>`
      + `<circle cx="8.5" cy="38" r="3.3" fill="${K.green}"/><path d="M6.5 35.5 L5 31 M8.5 35 L8.5 30.5 M10.5 35.5 L12 31" stroke="${K.green}" stroke-width=".8"/>`
      + `<path d="M5.4 38.4 L2 39.6 L5.4 39.8Z" fill="${K.gold}"/><circle cx="7.6" cy="37.4" r=".6" fill="${K.ink}"/>`;
  }}
};
// 11月のカス: thunder over a vermilion gate — the "oni" card, drawn without the willow.
const THUNDER = () => `<rect x="0" y="0" width="50" height="46" fill="${K.night}"/><path d="M0 46 Q25 38 50 46 L50 80 L0 80Z" fill="${K.ink}"/>`
  + `<path d="M31 2 L21 19 L28 19 L17 40 L35 15 L27 15 L37 2Z" fill="${K.gold}"/><path d="M10 6 L6 14 L9 14 L5 22 L13 12 L10 12 L13 6Z" fill="${K.gold2}"/>`
  + `<rect x="9" y="52" width="4" height="26" fill="${K.sun}"/><rect x="37" y="52" width="4" height="26" fill="${K.sun}"/><rect x="5" y="49" width="40" height="4" fill="${K.sun}"/><rect x="7" y="56" width="36" height="2.4" fill="${K.sun}"/>`
  + [[16, 30], [25, 26], [34, 30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${K.dred}"/><circle cx="${x}" cy="${y}" r="1.4" fill="${K.gold}"/>`).join('');
const RIBBON_TEXT = {1: 'あかよろし', 2: 'あかよろし', 3: 'みよしの'};
const BLUE = new Set([6, 9, 10]);
function ribbon(m) {
  const c = BLUE.has(m) ? K.ribbonBlue : K.ribbonRed;
  let s = `<path d="M16 17 L24 15 Q27 38 34 60 L26 62.5 Q20 40 16 17Z" fill="${c}"/><path d="M16 17 L24 15" stroke="${K.dred}" stroke-width=".6"/>`;
  const t = RIBBON_TEXT[m];
  if (t) [...t].forEach((ch, i) => { const k = (i + .6) / (t.length + .6), x = 20 + k * 9, y = 21 + k * 37; s += `<text x="${r2(x)}" y="${r2(y)}" font-size="4.4" font-family="serif" text-anchor="middle" fill="${K.ink}" stroke="none" transform="rotate(-14 ${r2(x)} ${r2(y)})">${ch}</text>`; });
  return s;
}

/* ---------- styles ---------- */
const MONTH_TINT = ['#fde7e2', '#fbe3e6', '#fde8ef', '#ece6f7', '#e3ecf8', '#fde9e4', '#f3e6f0', '#fff0d6', '#fff3d9', '#fde6da', '#e3f0ea', '#ece8f6'];
const STYLES = {
  ink: {
    K: {ink: '#2a2724', red: '#b5452f', dred: '#7d2f24', green: 'rgba(70,96,74,.82)', dgreen: '#2f3a31', moss: 'rgba(120,138,96,.82)', gold: '#c49a45', gold2: '#dcb96a',
      pink: 'rgba(224,170,178,.8)', pink2: '#c4848f', purple: 'rgba(112,96,150,.82)', violet: 'rgba(160,146,190,.78)', blue: 'rgba(72,96,140,.8)', brown: '#4a3f35',
      white: '#faf7f0', cream: '#fffdf6', hagi: '#9a5674', grass: 'rgba(250,247,240,.45)', hill: '#2a2724', olive: '#7d8040', olive2: '#5c5f2c', cloth: '#faf6ec',
      boar: '#3a332b', boar2: '#25201b', deer: '#8c5c38', deer2: '#4a3322', rain: 'rgba(42,39,36,.35)', sun: '#c23b22', ribbonRed: '#b8402c', ribbonBlue: '#3e4f7a',
      skin: '#f3dcc4', robe: '#4f3a5e', night: '#3a3631', sky: '#e3d7c3'},
    bg: () => '#f2ede1',
    defs: `<filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale=".8"/></filter>`
      + `<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .2  0 0 0 0 .17  0 0 0 0 .12  0 0 0 .13 0"/></filter>`,
    wrap: s => `<g filter="url(#rough)">${s}</g><rect x="0" y="-1" width="50" height="82" filter="url(#grain)"/>`,
    frame: `<rect x="1.4" y=".4" width="47.2" height="79.2" rx="1.2" fill="none" stroke="#2a2724" stroke-width=".55"/><rect x="2.4" y="1.4" width="45.2" height="77.2" rx=".8" fill="none" stroke="#2a2724" stroke-width=".2"/>`,
    mark: `<rect x="3.6" y="2.6" width="8.4" height="8.4" rx=".9" fill="#c23b22"/><text x="7.8" y="8.9" font-size="6" font-family="serif" font-weight="700" text-anchor="middle" fill="#f6efe2">光</text>`
  },
  kirie: {
    K: {ink: '#1f2d47', red: '#ec4b32', dred: '#b8301f', green: '#36a269', dgreen: '#1f6f4a', moss: '#9bc55a', gold: '#f5b42e', gold2: '#ffd56b', pink: '#ff9fb4', pink2: '#ff6d8f',
      purple: '#7a54d4', violet: '#b59df3', blue: '#3a7ad6', brown: '#8a5536', white: '#ffffff', cream: '#fff6cf', hagi: '#d6448c', grass: '#ffd9a8', hill: '#1f2d47',
      olive: '#a4b832', olive2: '#6f8a1f', cloth: '#ffffff', boar: '#6b4a35', boar2: '#3f2a1d', deer: '#d9894a', deer2: '#8a4f25', rain: '#7aa7e0', sun: '#ff4b2e',
      ribbonRed: '#ec3b2a', ribbonBlue: '#2f5fc9', skin: '#ffd8b8', robe: '#3a7ad6', night: '#2b2350', sky: '#ff7f4f'},
    bg: m => MONTH_TINT[m - 1],
    defs: `<filter id="cut" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx=".35" dy=".55" stdDeviation=".3" flood-color="#2b1d10" flood-opacity=".32"/></filter>`,
    wrap: s => `<g filter="url(#cut)">${s}</g>`,
    frame: `<rect x="1" y="0" width="48" height="80" rx="2.4" fill="none" stroke="#ffffff" stroke-width="2"/>`,
    mark: `<circle cx="8" cy="7" r="4.6" fill="#f5b42e"/><text x="8" y="9.1" font-size="5.6" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#1f2d47">光</text>`
  },
  tone: {
    K: {ink: '#111', red: 'url(#t2)', dred: '#111', green: 'url(#t1)', dgreen: '#111', moss: 'url(#t1)', gold: 'url(#t3)', gold2: '#fff', pink: '#fff', pink2: 'url(#t1)',
      purple: 'url(#t2)', violet: 'url(#t1)', blue: 'url(#t2)', brown: '#111', white: '#fff', cream: '#fff', hagi: 'url(#t2)', grass: '#fff', hill: '#111',
      olive: 'url(#t1)', olive2: '#111', cloth: '#fff', boar: '#111', boar2: '#111', deer: 'url(#t3)', deer2: '#111', rain: '#111', sun: '#d7261e',
      ribbonRed: '#d7261e', ribbonBlue: 'url(#t2)', skin: '#fff', robe: 'url(#t2)', night: 'url(#t2)', sky: 'url(#t1)'},
    bg: () => '#fbfaf6',
    defs: `<pattern id="t1" width="1.8" height="1.8" patternUnits="userSpaceOnUse"><rect width="1.8" height="1.8" fill="#fff"/><circle cx=".9" cy=".9" r=".34" fill="#111"/></pattern>`
      + `<pattern id="t2" width="1.5" height="1.5" patternUnits="userSpaceOnUse"><rect width="1.5" height="1.5" fill="#fff"/><circle cx=".75" cy=".75" r=".52" fill="#111"/></pattern>`
      + `<pattern id="t3" width="1.3" height="1.3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.3" height="1.3" fill="#fff"/><rect width=".42" height="1.3" fill="#111"/></pattern>`,
    wrap: s => `<g stroke="#111" stroke-width=".5" stroke-linejoin="round">${s}</g>`,
    frame: `<rect x="1.2" y=".2" width="47.6" height="79.6" rx="1" fill="none" stroke="#111" stroke-width="1.6"/>`,
    mark: `<circle cx="8" cy="7" r="4.6" fill="#d7261e"/><text x="8" y="9.1" font-size="5.6" font-family="serif" font-weight="700" text-anchor="middle" fill="#fff">光</text>`
  }
};

/* ---------- the 48 cards ---------- */
const DECK = {
  1: ['hikari', 'tanzaku', 'kasu1', 'kasu2'], 2: ['tane', 'tanzaku', 'kasu1', 'kasu2'], 3: ['hikari', 'tanzaku', 'kasu1', 'kasu2'], 4: ['tane', 'tanzaku', 'kasu1', 'kasu2'],
  5: ['tane', 'tanzaku', 'kasu1', 'kasu2'], 6: ['tane', 'tanzaku', 'kasu1', 'kasu2'], 7: ['tane', 'tanzaku', 'kasu1', 'kasu2'], 8: ['hikari', 'tane', 'kasu1', 'kasu2'],
  9: ['tane', 'tanzaku', 'kasu1', 'kasu2'], 10: ['tane', 'tanzaku', 'kasu1', 'kasu2'], 11: ['hikari', 'tane', 'tanzaku', 'kasu'], 12: ['hikari', 'kasu1', 'kasu2', 'kasu3']
};
function cardSVG(style, m, kind) {
  const st = STYLES[style];
  K = {...st.K, bg: st.bg(m)};
  const file = `${String(m).padStart(2, '0')}-${kind}`;
  const sp = SPECIAL[file] || {};
  let bg = K.bg, body;
  if (m === 11 && kind === 'kasu') body = THUNDER();
  else {
    if (sp.sky) bg = K.sky;
    let plant = PLANT[m]();
    if (kind === 'kasu2') plant = `<g transform="translate(50 0) scale(-1 1)">${plant}</g>`;
    body = (sp.under ? sp.under() : '') + plant + (sp.over ? sp.over() : '') + (kind === 'tanzaku' ? ribbon(m) : '')
      + (kind === 'kasu3' ? `<rect x="0" y="66" width="50" height="14" fill="${K.gold}"/><path d="M0 66 H50" stroke="${K.ink}" stroke-width=".5"/>` : '');
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 50 82"><defs>${st.defs}</defs>`
    + `<rect x="0" y="-1" width="50" height="82" fill="${bg}"/>${st.wrap(body)}${kind === 'hikari' ? st.mark : ''}${st.frame}</svg>`;
  return [file, svg];
}
let n = 0;
for (const style of Object.keys(STYLES)) {
  mkdirSync(join(out, style), {recursive: true});
  for (const [m, kinds] of Object.entries(DECK)) for (const kind of kinds) {
    const [file, svg] = cardSVG(style, +m, kind);
    writeFileSync(join(out, style, file + '.svg'), svg); n++;
  }
}
console.log(`wrote ${n} cards to ${out}`);
