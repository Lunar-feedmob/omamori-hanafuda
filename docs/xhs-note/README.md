# 花合帖 · 小红书图文笔记

开发过程的小红书图文笔记：「我和 AI 用 4 天做了款花札游戏」。

| 文件 | 内容 |
|---|---|
| `png/01.png` … `png/10.png` | 10 张 3:4 图片（1080 × 1440），按顺序上传 |
| `caption.md` | 标题（20 字以内）、正文（1000 字以内）和话题 |
| `shots/` | 图里用到的游戏截图（iPhone 14 尺寸，3 倍清晰度，WebP） |
| `cards.html` | 10 张图的排版源文件 |
| `note.html` | 发布用的整理页：图片、可复制的文案和发布步骤 |
| `shots.py` · `render.py` | 重新截图、重新出图的脚本 |

## 重新生成

```sh
./tools/build-web.sh                  # 先构建网页版
python3 docs/xhs-note/shots.py        # 游戏截图 → shots/
python3 docs/xhs-note/render.py       # cards.html → png/01–10.png
```

文案只写已经上线的网页版；小红书小工具版标为「正在准备中」。图里的数字来自 git 记录和实测：4 天、25 次提交；首页出现时间 12.0 秒 → 1.6 秒（模拟中端手机 + 慢速 4G）。
