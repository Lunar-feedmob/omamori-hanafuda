# 御守花札 · 小红书小工具版

小红书「小工具」是运行在 App 内安全沙箱里的离线 H5（标准 HTML/CSS/JS），可以挂在笔记下点开即玩。
这一版由网页源码 `src/page.html` 自动生成，网页仍是唯一源码。

- 上传包：`xhs/release/omamori-hanafuda-xhs.zip`（zip 根目录即 `index.html`）
- 规范依据：官方「小工具容器能力清单」（2026-10-22 版）与官方打包 Skill `minitool-zip-builder` 1.6.0；以上传页提供的最新改写口令为准，口令更新后需重新校验。

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
| 海报 | 「发到小红书」（postNote 带图唤起发布页）与「存到相册」 |
| 振动 | 客户端 9.50+ 用平台 vibrateShort |
| 顶部 | 客户端 9.49+ 读取容器按钮位置并留出空间 |
| 字体 | 日文显示字体按用到的字裁成子集打包；中文正文用手机自带字体 |
| 卡面 | 彩绘（WebP）+ 墨绘、剪纸、网点（SVG）；墨染、朱缘、花图不打包，相关主题借用相近卡面 |
| 兼容 | JS 转译到 Chrome 61；CSS 为 inset / gap / aspect-ratio / max() / env() / display:contents 提供回退 |

## 已验证 / 未验证

- 已验证：官方审计脚本 PASS（包体 4.5 MB，高于建议的 2 MB、低于 10 MB 上限）；离线运行（拦截全部外部请求）、模拟容器 SDK 下的存档、海报存相册、发笔记、振动均正常。
- 未验证：真机与 PC 模拟器（需要 Builder Hub 权限）；Android 8.1 / Chrome 61 真机兼容性。
