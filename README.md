# 御守花札

日本庭院主题的花札记忆配对小游戏。记住花札的位置，在步数用尽前翻出成对的两张，沿着四季走完八处庭院。适配手机竖屏。

在线游玩：https://lunar-feedmob.github.io/omamori-hanafuda/

## 玩法

- 开局所有牌亮出几秒，记住位置。
- 一次翻两张算一步；相同便留下，不同就合上。
- 在步数用尽前配完，点亮下一处庭院。
- 「重新看牌」让未配的牌再亮一瞬，不耗步数。
- 难度三档：悠闲（不计步数）、标准、挑战。
- 连续配对会盖下朱印：三連多给一步，五連多一次回看，七連下一阵花吹雪。
- 翻错后点任意处，牌立刻盖回，不用等待。
- 第一次玩时，第一处庭院会带你翻开第一对牌；第一次翻错时会提示「重新看牌」。
- 设置里可以清除全部进度（保留主题等设置）；主页底部的「清空记录，重新开始」会清掉浏览器里的全部游戏记录和设置，并刷新页面。

## 试玩统计

设置 → 游玩统计：按庭院记录开局、通关、失败、平均步数、回看、翻错和用时，以及主题切换次数。数据只存在本机，可以一键复制成表格，方便试玩时收集反馈。

## 收集

- **花札图鉴**：完整 48 张，附寓意、介绍、收集日期，以及「役」的进度。
- **御守帖**：48 枚御守徽章，获得即点亮，未获得只显示剪影。
- **朱印帖**：三連、五連、七連、無垢、一目、八景、全札。

## 主题

七种主题共用同一套玩法和布局，每个主题有自己的卡背和牌桌，切换时不会打断正在进行的一局：

| 分组 | 主题 | 主页 | 推荐卡面 |
|---|---|---|---|
| 传统和风 | 浮世锦绘 | 按季节展示广重《名所江户百景》的版画海报 | 彩绘 |
| 传统和风 | 京都和纸 | 文库本封面，按季节换神坂雪佳的画 | 墨绘 |
| 传统和风 | 砂纹石庭 | 一圈砂纹，一块石 | 墨染 |
| 节令生活 | 灯火夜祭 | 广重「两国花火」上的灯笼与摊位 | 朱缘 |
| 节令生活 | 旅行手账 | 纸页、印章集、北斋草花小稿 | 剪纸 |
| 动画漫画 | 四叠青春 | 四叠半杂志页 | 剪纸 |
| 动画漫画 | 昭和漫画 | 以《北斋漫画》为刊头的连载目次 | 网点 |

## 本地运行

```sh
python3 -m http.server 8000
# 打开 http://localhost:8000
```

`tools/make-decks.mjs` 用来重新生成三套原创牌面：`node tools/make-decks.mjs cards`。

## 素材致谢

- 花札「彩绘」(`cards/classic`)、「墨染」(`cards/sumi`)、「朱缘」(`cards/shu`)：Louie Mantia 绘制，后两套另有すけじょ参与；来自 [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:SVG_Hanafuda)，[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)，未作修改。
- 花札「花图」(`cards/hwatu`)：韩式 Hwatu，Marcus Richert 以 Louie Mantia 的花札为基础制作，Spenĉjo 整理上传；[Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:SVG_Hwatu)，CC BY-SA 4.0，未作修改。文件按日式月份重命名（韩式的十一月桐、十二月柳已对调）。
- 花札「墨绘」「剪纸」「网点」(`cards/ink`、`cards/kirie`、`cards/tone`) 与御守徽章：本项目原创，由程序绘制；御守花纹取自传统和柄。
- 主页插图（`art/`）：神坂雪佳《百々世草》（1909–10）、葛饰北斋《北斋漫画》、歌川广重《名所江户百景》中的「两国花火」「龟户梅屋敷」「大桥阿宅骤雨」「月之岬」「浅草金龙山」（1856–58），均为公有领域作品，图像来自[芝加哥艺术博物馆开放馆藏](https://www.artic.edu/open-access)（CC0），仅缩放与裁切取景；纸纹为 [ambientCG Paper006](https://ambientcg.com/view?id=Paper006)（CC0）。
- 纸牌音效（`sfx/`）：Kenney「[Casino Audio](https://kenney.nl/assets/casino-audio)」，CC0，已转码为 MP3。
- 琴声、风铃、尺八与环境音：[Tone.js](https://github.com/Tonejs/Tone.js)（MIT）实时合成。
- 落花特效：[canvas-confetti](https://github.com/catdad/canvas-confetti)（ISC）。
- 字体：每个主题两到三种。日文显示字体 Shippori Mincho B1、Zen Old Mincho、Shippori Mincho、Kaisei Decol、Klee One、Yusei Magic、Zen Antique；中文 Noto Serif SC、Noto Sans SC；点缀用 Yuji Syuku、ZCOOL XiaoWei、ZCOOL KuaiLe（SIL OFL 1.1），经 Google Fonts 提供。
- 俳句：服部嵐雪、松尾芭蕉、山口素堂、与謝蕪村的作品（公有领域），中文译文为本项目所作。
