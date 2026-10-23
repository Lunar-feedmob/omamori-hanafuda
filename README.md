# 御守花札

日本庭院主题的花札记忆配对小游戏。在步数用完前翻出成对的花札，按四季走完八处庭院，收集 36 组花札图鉴和对应的御守。适配手机竖屏。

## 玩法

- 开局所有牌亮出几秒，记住位置。
- 每次翻开两张算一步，图案相同即配对成功。
- 在步数用完前配完全部牌即可通关，并解锁下一处庭院。
- 每关可以「重新看牌」一次，不消耗步数。
- 第一次翻出某组花札会解锁它的图鉴；收集进度保存在浏览器里。

## 本地运行

音效通过 `fetch` 加载，需要用本地服务器打开，而不是直接双击文件：

```sh
python3 -m http.server 8000
# 然后打开 http://localhost:8000
```

## 素材致谢

- 花札图像：Louie Mantia 绘制，来自 [Wikimedia Commons](https://commons.wikimedia.org/wiki/User:Louiemantia)，[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。图像未作修改，位于 `cards/`，仍按 CC BY-SA 4.0 授权。
- 纸牌音效：Kenney「[Casino Audio](https://kenney.nl/assets/casino-audio)」，CC0。已转码为 MP3，位于 `sfx/`。
- 琴声、风铃与环境音：[Tone.js](https://github.com/Tonejs/Tone.js)（MIT）实时合成。
- 落花特效：[canvas-confetti](https://github.com/catdad/canvas-confetti)（ISC）。
- 字体：Yuji Syuku、Shippori Mincho、Noto Serif SC、Noto Sans SC（SIL OFL 1.1），经 Google Fonts 提供。
