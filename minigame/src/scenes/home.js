// Home: the season's artwork as the hero, a continue button, difficulty, the eight gardens, and the theme switch.
const {LEVELS, SEASONS, KANJI, MOTIFS} = require('../core/data');
const {cleared, collectedCount} = require('../core/save');
const {MODES} = require('../core/rules');
const {rr, text, vtext, picture} = require('../render/ui');
const {ORDER} = require('../render/themes');

function targetLevel(s) { for (const l of LEVELS) if (l.n <= s.unlocked && !cleared(s, l.n)) return l; return LEVELS[Math.min(s.unlocked, LEVELS.length) - 1]; }

module.exports = function Home(app) {
  const {ui} = app;
  return {
    onEnter() { const th = app.theme(); if (th.art) ui.preload(SEASONS.map(x => th.art(x.key))); },
    draw(c, t, w, h) {
      const th = app.theme(), s = app.save, sf = app.pf.info(), tgt = targetLevel(s), S = SEASONS[tgt.s];
      const pad = 16, W = w - pad * 2, top = sf.safeTop + 12, bottom = h - sf.safeBottom - 10;
      th.background(c, w, h, t);
      // title
      if (th === app.themes.pixel) {
        const blink = Math.floor(t / 500) % 2;
        for (const [dx, col] of [[3, '#ff4f9a'], [-3, '#3ee6ff'], [0, '#ffd23f']]) text(c, '御守花札', w / 2 + dx, top + 50, {size: 52, font: th.title, color: col, align: 'center'});
        text(c, `HANAFUDA · MEMORY · ${['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'][tgt.s]}`, w / 2, top + 74, {size: 11, font: th.font, color: '#3ee6ff', align: 'center', spacing: 2});
        ui.animate(1000); this.blink = blink;
      } else {
        text(c, '御守花札', pad, top + 36, {size: 32, weight: 700, font: th.title, color: th.text, spacing: 3});
        text(c, `${S.name} · ${tgt.sub}`, w - pad, top + 32, {size: 12, font: th.font, color: th.muted, align: 'right'});
        text(c, tgt.haiku[0], pad, top + 62, {size: 13, font: th.font, color: th.muted});
      }
      // fixed blocks from the bottom up; the hero takes what is left
      const footH = 44, tileH = 60, gridH = tileH * 2 + 10, modeH = 40, btnH = 50;
      const footY = bottom - footH, gridY = footY - 14 - gridH, modeY = gridY - 12 - modeH, btnY = modeY - 14 - btnH, heroY = top + 80, heroH = Math.max(90, btnY - 16 - heroY);
      // hero
      const go = () => { app.sfx('tap'); app.start(tgt.n); };
      const hero = ui.area('hero', pad, heroY, W, heroH, go);
      if (th.art) {
        const im = ui.img(th.art(S.key));
        if (th === app.themes.tsuki) {   // a hanging scroll
          const sw = Math.min(W * .62, heroH * .62), sx = w / 2 - sw / 2;
          c.fillStyle = '#3c3428'; c.fillRect(sx, heroY + 8, sw, heroH - 16);
          picture(c, im, sx + 10, heroY + 20, sw - 20, heroH - 40, 'contain');
          for (const y of [heroY, heroY + heroH - 12]) { rr(c, sx - 10, y, sw + 20, 12, 6); c.fillStyle = '#5a4430'; c.fill(); }
        } else if (th === app.themes.washi) {   // a paperback cover with an obi
          const cw = Math.min(W * .62, heroH * .71), cx = w / 2 - cw / 2;
          c.save(); c.shadowColor = 'rgba(58,47,38,.35)'; c.shadowBlur = 16; c.shadowOffsetY = 8; c.fillStyle = '#fbf8f0'; c.fillRect(cx, heroY, cw, heroH); c.restore();
          picture(c, im, cx, heroY, cw, heroH * .72, 'cover');
          c.fillStyle = th.accent; c.fillRect(cx, heroY + heroH * .72, cw, heroH * .28);
          vtext(c, '御守花札', cx + cw - 22, heroY + 30, {size: 22, font: th.title, color: '#3a2f26', weight: 700});
          text(c, `第${KANJI[tgt.n - 1]}庭「${tgt.name}」へ`, cx + 12, heroY + heroH * .72 + 28, {size: 14, font: th.font, color: '#fbf8f0', weight: 700});
          text(c, tgt.haiku[1], cx + 12, heroY + heroH * .72 + 50, {size: 11, font: th.font, color: 'rgba(251,248,240,.85)'});
        } else {   // ukiyo: a framed print with a title slip
          c.fillStyle = '#fbf6ea'; c.fillRect(pad, heroY, W, heroH); c.lineWidth = 2; c.strokeStyle = th.accent; c.strokeRect(pad + 1, heroY + 1, W - 2, heroH - 2);
          picture(c, im, pad + 8, heroY + 8, W - 16, heroH - 16, 'cover');
          c.fillStyle = '#fbf6ea'; c.fillRect(w - pad - 40, heroY + 14, 28, 96); c.strokeStyle = th.accent; c.lineWidth = 1.5; c.strokeRect(w - pad - 40, heroY + 14, 28, 96);
          vtext(c, '名所江戸', w - pad - 26, heroY + 34, {size: 15, font: th.title, color: th.text});
        }
      } else {   // pixel: the start box
        th.panel(c, pad, heroY + heroH / 2 - 56, W, 112);
        c.font = `400 26px ${th.font}`; const pw = c.measureText('PRESS START').width;
        if (!this.blink) text(c, '▶', w / 2 - pw / 2 - 12, heroY + heroH / 2 - 4, {size: 22, color: '#ffd23f', font: th.font, base: 'middle', align: 'right'});
        text(c, 'PRESS START', w / 2, heroY + heroH / 2 - 4, {size: 26, color: '#ffd23f', font: th.font, align: 'center', base: 'middle'});
        text(c, `STAGE ${tgt.n} · ${tgt.name}`, w / 2, heroY + heroH / 2 + 30, {size: 13, color: th.text, font: th.font, align: 'center'});
      }
      if (hero.down) { c.fillStyle = 'rgba(0,0,0,.06)'; c.fillRect(pad, heroY, W, heroH); }
      // continue
      const label = `${cleared(s, tgt.n) ? '再访' : '继续'} · 第${KANJI[tgt.n - 1]}庭「${tgt.name}」`;
      th.button(c, pad, btnY, W, btnH, label, true, ui.area('go', pad, btnY, W, btnH, go).down, 16);
      // difficulty
      const segW = W / 3;
      Object.entries(MODES).forEach(([k, m], i) => {
        const x = pad + i * segW, on = s.mode === k, a = ui.area('mode-' + k, x, modeY, segW, modeH, () => { s.mode = k; app.persist(); app.sfx('tap'); });
        th.button(c, x + 2, modeY, segW - 4, modeH, m.name, on, a.down, 14);
      });
      // gardens
      const tw = (W - 3 * 8) / 4;
      LEVELS.forEach((l, i) => {
        const x = pad + (i % 4) * (tw + 8), y = gridY + Math.floor(i / 4) * (tileH + 10), locked = l.n > s.unlocked, best = s.best[s.mode][l.n] || 0;
        const a = ui.area('lv' + l.n, x, y, tw, tileH, locked ? null : () => { app.sfx('tap'); app.start(l.n); });
        c.globalAlpha = locked ? .45 : 1;
        th.panel(c, x + (a.down ? 1 : 0), y + (a.down ? 1 : 0), tw, tileH);
        if (l.n === tgt.n) { c.lineWidth = 2; c.strokeStyle = th.accent; c.strokeRect(x - 2, y - 2, tw + 4, tileH + 4); }
        text(c, th === app.themes.pixel ? `STAGE ${l.n}` : `第${KANJI[i]}庭`, x + tw / 2, y + 16, {size: 10, color: th.muted, font: th.font, align: 'center'});
        text(c, l.name, x + tw / 2, y + 37, {size: 17, color: th.text, font: th.title, align: 'center', weight: 700});
        text(c, locked ? '未解锁' : best ? '✿'.repeat(best) + '·'.repeat(3 - best) : SEASONS[l.s].name, x + tw / 2, y + 53, {size: 10, color: best ? th.accent : th.muted, font: th.font, align: 'center'});
        c.globalAlpha = 1;
      });
      // footer: theme switch and the collection count
      const nextLook = ORDER[(ORDER.indexOf(s.look) + 1) % ORDER.length] || ORDER[0];
      const ta = ui.area('theme', pad, footY, W * .5, footH, () => { s.look = nextLook; app.persist(); app.sfx('tap'); ui.go(Home(app)); });
      th.button(c, pad, footY, W * .5 - 4, footH, `主题 · ${th.name}`, false, ta.down, 13);
      text(c, `花札 ${collectedCount(s)}/${MOTIFS.length} · 朱印 ${Object.keys(s.seals).length}`, w - pad, footY + footH / 2 + 1, {size: 12, color: th.muted, font: th.font, align: 'right', base: 'middle'});
      if (th.art) text(c, th.artCredit, w / 2, bottom + 6, {size: 9, color: th.faint, font: th.font, align: 'center'});
    }
  };
};
module.exports.targetLevel = targetLevel;
