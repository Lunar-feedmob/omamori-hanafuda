// Entry shared by every host: pick the platform, load progress, and open the home screen.
const detect = require('./platform/index');
const {UI} = require('./render/ui');
const {THEMES, themeOf} = require('./render/themes');
const {load, persist} = require('./core/save');
const Home = require('./scenes/home');
const Play = require('./scenes/play');

const pf = detect();
const save = load(pf);
if (!THEMES[save.look]) save.look = 'ukiyo';
const ui = new UI(pf);
pf.loadFont('assets/fonts/fusion-pixel-12.otf', 'Fusion Pixel');   // only the pixel look uses it; the others use the system's Songti / PingFang
const SFX = {flip: 'card-place-1', unflip: 'card-slide-1', deal: 'card-shuffle', peek: 'card-fan-1', tap: 'card-place-2'};
const app = {
  ui, pf, save, themes: THEMES,
  theme: () => themeOf(save.look),
  persist: () => persist(pf, save),
  sfx: name => { if (save.sound && SFX[name]) pf.audio.play(`assets/sfx/${SFX[name]}.mp3`, save.sfxVol * (name === 'tap' ? .5 : .8)); },
  buzz: kind => { if (save.haptics) pf.vibrate(kind); },
  start: n => ui.go(Play(app, n)),
  home: () => ui.go(Home(app))
};
pf.share.setup(() => ({title: '花合帖 · 翻开两张，找出成对的花札', query: 'from=share'}));
app.home();
if (pf.name === 'web' && typeof window !== 'undefined') window.__app = app;   // test hook, browser preview only
module.exports = app;
