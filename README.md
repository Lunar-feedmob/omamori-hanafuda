# 御守花札

日本庭院主题的花札记忆配对小游戏。记住花札的位置，在步数用尽前翻出成对的两张，沿着四季点亮八盏灯笼。适配手机竖屏。

在线游玩：https://lunar-feedmob.github.io/omamori-hanafuda/

## 玩法

- 开局所有牌亮出几秒，记住位置。
- 一次翻两张算一步；相同便留下，不同就合上。
- 在步数用尽前配完，点亮下一处庭院的灯笼。
- 「重新看牌」让未配的牌再亮一瞬，不耗步数。
- 难度分三档：悠闲（不计步数）、标准、挑战。
- 连续配对会盖下朱印：三連多给一步，五連多一次回看，七連下一阵花吹雪。

## 收集

- 图鉴收录完整的 48 张花札，附寓意、介绍和对应的御守。
- 「役」（五光、猪鹿蝶、赤短、青短、花見酒、月見酒）的收集进度。
- 朱印帖：三連、五連、七連、無垢、一目、八景、全札。
- 进度保存在浏览器里。

## 主题与声音

- 四种庭院主题：月下枯山水、四季绘卷 · 金云、和纸晨光 · 淡墨、茶室侘寂。八处庭院各有一幅场景，并配一首当季的古典俳句。
- 三套卡面：彩绘、墨染、朱缘。
- 音色随季节变化：春琴、夏风铃、秋尺八、冬钵铃；可选背景琴声与庭院环境音。

## 本地运行

音效通过 `fetch` 加载，需要用本地服务器打开：

```sh
python3 -m http.server 8000
# 打开 http://localhost:8000
```

## 素材致谢

- 花札图像（`cards/`）：Louie Mantia 绘制；「墨染」(`cards/sumi`) 与「朱缘」(`cards/shu`) 两套另有すけじょ参与。来自 [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:SVG_Hanafuda)，按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 授权，图像未作修改。
- 纸牌音效（`sfx/`）：Kenney「[Casino Audio](https://kenney.nl/assets/casino-audio)」，CC0，已转码为 MP3。
- 琴声、风铃、尺八与环境音：[Tone.js](https://github.com/Tonejs/Tone.js)（MIT）实时合成。
- 落花特效：[canvas-confetti](https://github.com/catdad/canvas-confetti)（ISC）。
- 字体：Zen Old Mincho、Shippori Mincho B1、Yuji Boku、Kaisei Decol、ZCOOL XiaoWei、Noto Serif SC、Noto Sans SC（SIL OFL 1.1），经 Google Fonts 提供。
- 俳句：服部嵐雪、松尾芭蕉、山口素堂、与謝蕪村的作品（公有领域），中文译文为本项目所作。
