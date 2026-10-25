# 花合帖 · 小游戏版（微信 / 小红书）

和网页版共用同一套规则、数据和美术素材。渲染换成 Canvas 2D，以适配小游戏运行环境（小游戏里没有 DOM）。

## 目录

```
minigame/
  game.js / game.json / project.config.json   微信小游戏入口与配置（appid 先用 touristappid，拿到正式 AppID 后替换）
  src/
    core/data.js     牌、庭院、役、朱印、季节……由 tools/extract-data.mjs 从 ../index.html 生成，勿手改
    core/save.js     存档模型（兼容网页版存档）
    core/rules.js    对局规则：发牌、翻牌、配对、步数、回看、连击、通关
    platform/        宿主适配层：minigame.js（微信 wx / 小红书 xhs，同一 API 形状）、web.js（浏览器预览与自动测试）
    render/ui.js     极简 Canvas UI：每帧绘制场景并登记可点区域，只在有动画或操作时重绘
    render/themes.js 首发四个主题：浮世锦绘、京都和纸、月白风清、电光游园
    scenes/          home.js 主页，play.js 对局与结算
  assets/            cards/classic（48 张 JPG）、backs（4 张卡背）、art（主页名画）、sfx、fonts
  tools/             extract-data.mjs、export-assets.py、build-web.mjs
```

## 开发

```sh
node minigame/tools/extract-data.mjs          # 网页版数据有改动时，同步到 src/core/data.js
python3 minigame/tools/export-assets.py       # 重新导出卡面、卡背、主页画（需要 Playwright）
node minigame/tools/build-web.mjs             # 打包浏览器预览 → minigame/dev/index.html
```

- 微信：在「微信开发者工具」中导入 `minigame/` 目录，项目类型选「小游戏」。
- 浏览器预览：在 `minigame/` 起一个静态服务器，打开 `dev/index.html`。

## 包体预算（微信主包 ≤ 4MB）

| 内容 | 大小 | 放在 |
|---|---|---|
| 代码 | ~60KB | 主包 |
| 彩绘卡面 48 张 | ~1.6MB | 主包 |
| 卡背 4 张、音效、像素字体 | ~350KB | 主包 |
| 主页名画（每个主题 4 张） | ~1.2MB | 分包（待拆） |

## 进度

- [x] 规则与存档（和网页版一致，可导入网页版存档）
- [x] 平台适配层（微信、小红书、浏览器）
- [x] 主页、对局、结算；四个主题
- [x] 资源导出脚本、浏览器自动测试
- [ ] 主题音乐：用 Tone.Offline 把网页版的合成乐器离线渲染成 mp3
- [ ] 图鉴、御守帖、朱印帖、屏风庭院、设置页
- [ ] 分包与按需加载；其余主题和卡面
- [ ] 分享卡片图、海报保存到相册、微信云开发存档
- [ ] 隐私保护指引（相册写入）、真机测试

## 上线清单（个人主体、首版免费、不接广告）

1. 微信公众平台注册「小游戏」，主体选个人，拿到 AppID 写进 `project.config.json`。
2. 小程序备案（个人身份信息，通常 1–3 周）。
3. 软件著作权或电子版权认证：先确认微信当前接受哪一种，再申请。
4. 后台填写用户隐私保护指引：写入相册（海报）、本地存储。
5. 类目选休闲益智，提交自审自查材料，上传体验版后提审。
6. 小红书：在小红书小程序开放平台（miniapp.xiaohongshu.com）确认是否开放小游戏，以及个人主体能否入驻、API 是否与微信同形；如果只开放小程序，就用一个全屏 `<canvas type="2d">` 页面承载同一套代码。

## 素材授权

与网页版相同，见根目录 README「素材致谢」。彩绘卡面为 Louie Mantia 作品，CC BY-SA 4.0，游戏内必须保留署名。
