# 花合帖 · Hana Awase · 花合わせ帖

日本庭院主题的花札记忆配对小游戏。记住花札的位置，在步数用尽前翻出成对的两张，沿着四季走完八处庭院。适配手机竖屏。

在线游玩：https://lunar-feedmob.github.io/omamori-hanafuda/

## 语言

中文、English、日本語。首次打开按系统语言自动选择，设置 →「语言」可随时切换。
页面源码以中文写成，`i18n.js`（源文件在 `src/i18n/`）把屏幕上出现的文字翻成英文或日文：卡名、寓意、御守、介绍、界面与素材致谢都有译文；
俳句保留原文，英文附译文。日文界面改用日文字形（Shippori Mincho / Zen Kaku Gothic New），英文按主题配拉丁字体。小红书小工具版只打包中文。

## 玩法

- 开局所有牌亮出几秒，记住位置。
- 一次翻两张算一步；相同便留下，不同就合上。
- 在步数用尽前配完，点亮下一处庭院。
- 「重新看牌」让未配的牌再亮一瞬，不耗步数。
- 难度三档：悠闲（不计步数）、标准、挑战。
- 连续配对会盖下朱印：三連多给一步，五連多一次回看，七連下一阵花吹雪。
- 翻错后点任意处，牌立刻盖回，不用等待。
- 第一次进入庭院前，会先进「练习庭」：四张牌演示看牌、翻牌、回看三件事，随时可以跳过；设置里可以再看一遍。
- 点亮全部八处庭院后，主页开放「庭外」三种玩法（每局按真实季节重新生成）：
  - **花合**：同一个月的四张牌互相配对，牌面不再一模一样。
  - **夜庭**：看牌只有烟火亮起的一瞬，三枚花火代替回看。
  - **役之庭**：在步数内配出指定的役（如猪鹿蝶），其余的牌只是陪衬。
- 每个主题的卡背是一张江户—明治时期的染布型纸（katagami），镂空处透出主题底色。
- 桌面端（宽于 960px）主页分两栏，「我的庭院」「庭外」和统计会自动放到较短的一栏，让两边高度接近；对局左侧是信息栏，右侧是牌阵；方向键选牌，空格或回车翻开，R 再看一眼。
- 支持震动的手机（如安卓 Chrome）在配对、翻错、连击和通关时会轻震，可在设置里关闭。
- 设置里可以清除全部进度（保留主题等设置）；主页底部的「清空记录，重新开始」会清掉浏览器里的全部游戏记录和设置，并刷新页面。

## 试玩统计

设置 → 游玩统计：按庭院记录开局、通关、失败、平均步数、回看、翻错和用时，以及新手演示看完或跳过的次数、主题切换次数。数据只存在本机，可以一键复制成表格，方便试玩时收集反馈。

## 收集

- **花札图鉴**：完整 48 张，附寓意、介绍、收集日期，以及「役」的进度。
- **御守帖**：48 枚御守徽章，获得即点亮，未获得只显示剪影。同一枚收得越多越华丽：布面 → 金线（3 枚）→ 満願（6 枚，金线织锦加流苏），升级时会有提示。
- **朱印帖**：三連、五連、七連、無垢、一目、八景、全札，以及庭外的花合、夜庭、役成。
- **我的庭院 · 十二月花屏风**：主页上的十二扇屏风，每月一幅花鸟版画。没有牌时是白纸；每收一张当月的花札，画就从雾中升起一截；四张到齐，这一扇着色。満願的御守挂在下方的绘马架上，朱印盖在一旁。

## 主题

十二种主题共用同一套玩法和布局。主页底栏（桌面端左侧栏）的「主题」按钮点一下就换到下一个主题，按钮上显示当前主题名；对局顶栏的调色盘按钮同样一点即换，不会打断正在进行的一局，每个主题有自己的卡背、牌桌、转场和一组乐器（季节决定音阶），切换时不会打断正在进行的一局。设置里可以分别调音乐和音效的音量。

| 分组 | 主题 | 主页 | 推荐卡面 | 声音 |
|---|---|---|---|---|
| 传统和风 | 浮世锦绘 | 按季节展示广重《名所江户百景》的版画海报 | 彩绘 | 三味线，通关敲拍子木 |
| 传统和风 | 京都和纸 | 文库本封面，按季节换神坂雪佳的画 | 墨绘 | 琴与笙，翻页声 |
| 传统和风 | 砂纹石庭 | 一圈砂纹，一块石 | 墨染 | 钵铃与尺八，风声 |
| 古画新游 | 月白风清 | 月冈芳年《月百姿》挂成卷轴，八处庭院是一轮渐满的月 | 彩绘 | 琵琶与虫声，通关寺钟 |
| 古画新游 | 金碧琳琅 | 光琳、抱一、其一的金屏风，关卡是一枚枚色纸 | 彩绘 | 笙与龙笛 |
| 古画新游 | 墨戏山野 | 《鸟兽戏画》相扑一段做封面，关卡排在可横向展开的绘卷上 | 墨绘 | 笛与小鼓 |
| 节令生活 | 灯火夜祭 | 广重「两国花火」上的灯笼与摊位 | 朱缘 | 篠笛与太鼓，通关远处烟火 |
| 节令生活 | 旅行手账 | 东海道旅行手帐：广重《东海道五十三次》八处宿场、乘车券、驿站印章路线图，卡背是明信片背面 | 剪纸 | 八音盒，盖章声 |
| 摩登时光 | 洋灯旧梦 | 咖啡馆墙上挂着竹久梦二的乐谱封面，关卡写在菜单上 | 朱缘 | 曼陀林与留声机底噪 |
| 摩登时光 | 四叠青春 | 四叠半杂志页 | 剪纸 | 轻快拨弦与拍手 |
| 摩登时光 | 昭和漫画 | 以《北斋漫画》为刊头的连载目次 | 网点 | 玩具钢琴，唱片底噪，连击「咚」 |
| 摩登时光 | 电光游园 | 霓虹像素的游园，PRESS START 与关卡地图 | 剪纸 | 芯片音，连击投币声 |

## 源码

`src/page.html` 是页面源码（claude.ai Artifact 的发布版本）；`index.html` 由它加上 `<!doctype>`/`<head>` 外壳生成。

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
- 卡背（`backs/`）：江户至明治时期的染布型纸（katagami），[大都会艺术博物馆开放馆藏](https://www.metmuseum.org/about-the-met/policies-and-documents/open-access)（CC0）：[菊菱](https://www.metmuseum.org/art/collection/search/69131)、[麻の葉](https://www.metmuseum.org/art/collection/search/53215)、[杉綾と波](https://www.metmuseum.org/art/collection/search/69130)、[菊菱に紗綾形](https://www.metmuseum.org/art/collection/search/69138)、[梅散らし](https://www.metmuseum.org/art/collection/search/69145)、[梅](https://www.metmuseum.org/art/collection/search/69107)、[矢筈](https://www.metmuseum.org/art/collection/search/69114)。裁取花纹，镂空处做成透明，部分主题把柿涩纸染成主题色。
- 十二月花屏风（`niwa/`）：歌川广重「雪中松に錦鶏」「梅」「枝垂桜に鳥」「藤に燕」「菖蒲に雀」「牡丹に鶏」「月に雁」「菊に鷦鷯」「紅葉に孔雀」，松村景文「萩に虫」，窪俊満「柳に翡翠」，礒田湖龍斎「桐に鳳凰」；公有领域，图像来自大都会艺术博物馆开放馆藏（CC0，馆藏号 44894、56940、36725、36726、36724、56939、36742、36731、36741、55364、54058、36694），仅裁切取景。
- 新主题插图（`art/tsuki-*`、`art/rinpa-*`、`art/giga-*`、`art/taisho-*`）：月冈芳年《月百姿》「忍冈之月」「云居之月」「原野之月」「浅野川雪月」（1885–92）；酒井抱一《樱枫图》、尾形光琳《八桥图》（大都会艺术博物馆，CC0）、铃木其一《夏秋溪流图》左扇、尾形光琳《红白梅图》；《鸟兽人物戏画》甲卷（12 世纪，高山寺藏）；竹久梦二为セノオ乐谱所作封面《桜町》《羽衣》《月光》《Old Refrain》（1917–24）。均为公有领域，图像经 [Wikimedia Commons](https://commons.wikimedia.org/) 取得，仅缩放、裁切；绘卷转为墨色以统一纸色。
- 新主题卡背：大都会艺术博物馆型纸「草花」(69147)、「紗綾形」(65305)、「八角繋ぎ」(69143)；墨戏山野卡背取自《鸟兽戏画》相扑一段的青蛙；电光游园卡背为本项目原创像素画。
- 像素字体（`fonts/`）：[Fusion Pixel Font](https://github.com/TakWolf/fusion-pixel-font) 12px 简体中文版，SIL OFL 1.1（许可证见 `fonts/fusion-pixel-OFL.txt`），只保留本作用到的字。
- 纸牌音效（`sfx/`）：Kenney「[Casino Audio](https://kenney.nl/assets/casino-audio)」，CC0，已转码为 MP3。
- 琴声、风铃、尺八与环境音：[Tone.js](https://github.com/Tonejs/Tone.js)（MIT）实时合成。
- 落花特效：[canvas-confetti](https://github.com/catdad/canvas-confetti)（ISC）。
- 字体：每个主题两到三种。日文显示字体 Shippori Mincho B1、Zen Old Mincho、Shippori Mincho、Kaisei Decol、Klee One、Yusei Magic、Zen Antique、Hina Mincho、Kaisei Tokumin、Yuji Boku、Shippori Antique B1、DotGothic16；中文 Noto Serif SC、Noto Sans SC；点缀用 Yuji Syuku、ZCOOL XiaoWei、ZCOOL KuaiLe（SIL OFL 1.1），经 Google Fonts 提供。
- 俳句：服部嵐雪、松尾芭蕉、山口素堂、与謝蕪村的作品（公有领域），中文译文为本项目所作。
