// Picks the host. WeChat exposes `wx`; Xiaohongshu is expected to expose `xhs` with the same mini-game shape (verify in its docs).
/* global wx, xhs */
module.exports = function detect() {
  if (typeof wx !== 'undefined' && wx.createCanvas) return require('./minigame')(wx, 'wechat');
  if (typeof xhs !== 'undefined' && xhs.createCanvas) return require('./minigame')(xhs, 'xiaohongshu');
  return require('./web')();
};
