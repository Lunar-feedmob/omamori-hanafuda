# 花合帖 · 小红书小工具版

小红书「小工具」是运行在 App 内安全沙箱里的离线 H5（标准 HTML/CSS/JS），可以挂在笔记下点开即玩。
这一版由网页源码 `src/page.html` 自动生成，网页仍是唯一源码。

- 上传包：`xhs/release/hana-awase-xhs.zip`（zip 根目录即 `index.html`），也挂在 GitHub Releases 上
- 图标：`xhs/release/icon-1024.png`、`icon-512.png`（本作原创剪纸卡面）
- 规范依据：官方打包 Skill `minitool-zip-builder` 1.7.0（总包上限 10 MB，建议 2 MB 以内）；以上传页提供的最新改写口令为准，口令更新后需重新校验。

## 构建

```sh
python3 xhs/assets.py          # 一次即可：字体子集、WebP 卡面与插图 → xhs/.cache
cd xhs && npm install && node build.mjs
```

## 与网页版的差别

| 项目 | 小工具版 |
|---|---|
| 网络 | 完全离线，所有资源打包在内（容器禁止联网） |
| 存档 | 客户端 9.46+ 用平台 Storage API；低版本退回浏览器存储 |
| 声音 | Tone.js 换成 `tone-lite.js`（同名接口，Web Audio 实现）；纸牌音效实时合成（包内不能放音频文件） |
| 落花 | canvas-confetti 换成 `confetti-lite.js`（原库含 Web Worker） |
| 振动 | 客户端 9.50+ 用平台 vibrateShort |
| 顶部 | 客户端 9.49+ 读取容器按钮位置并留出空间 |
| 字体 | 日文显示字体按用到的字裁成子集打包；中文正文用手机自带字体 |
| 卡面 | 彩绘（WebP）+ 墨绘、剪纸、网点（SVG）；墨染、朱缘、花图不打包，相关主题借用相近卡面 |
| 兼容 | JS 转译到 Chrome 61；CSS 为 inset / gap / aspect-ratio / max() / env() / display:contents 提供回退 |

## 已验证 / 未验证

- 已验证：官方审计脚本 PASS（包体 4.5 MB，高于建议的 2 MB、低于 10 MB 上限）；离线运行（拦截全部外部请求）、模拟容器 SDK 下的存档与振动均正常。
- 未验证：真机与 PC 模拟器（需要 Builder Hub 权限）；Android 8.1 / Chrome 61 真机兼容性。

## 发布步骤

1. **入口**：电脑打开 [小红书创作服务平台](https://creator.xiaohongshu.com/) → Builder hub → 小工具 → 上传小工具。小工具目前内测，看不到入口说明账号还没开通。
2. **改写口令**：上传页第一步给出的「改写口令」按最新规范校验一遍；规范有更新时重新打包（`node xhs/build.mjs`）。
3. **基础信息**：名称「花合帖」；Slogan 例如「四季八庭的花札记忆」；图标用 `icon-1024.png`。
4. **部署**：上传 `hana-awase-xhs.zip`，版本号 `1.0.0`；权限只勾「本地存储」（存进度用；不用相册、摄像头、麦克风）。
5. **扫码预览**：手机上逐项确认——第一次点按后有声音；配对时手机轻震；关掉再进，进度还在；顶部按钮没被容器的胶囊按钮挡住；主题按钮能切换十三个主题；第一局前的练习庭能跳过。
6. **提交审核**：通常几分钟到几小时，最长一到三个工作日。
7. **挂到笔记**：手机端发笔记时，从「小工具」入口选择花合帖；读者在笔记下点开即玩。
8. **更新版本**：改完网页源码后重新构建，在 Builder hub 的小工具管理里上传新 zip、提高版本号。
