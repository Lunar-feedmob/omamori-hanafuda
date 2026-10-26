import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src).read()
head = '''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="日本庭院主题的花札记忆配对小游戏：十三种主题、七套卡面、48 张花札图鉴与御守。">
<meta name="theme-color" content="#0f111c">
<meta name="application-name" content="花合帖">
<meta name="apple-mobile-web-app-title" content="花合帖">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="icon" href="favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="icons/icon.svg" type="image/svg+xml">
<link rel="icon" href="icons/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png" sizes="180x180">
<link rel="manifest" href="manifest.webmanifest">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
'''
s = s.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
i = s.index('<div id="scene"')
open(dst, 'w').write(head + s[:i] + '</head>\n<body>\n' + s[i:] + '\n</body>\n</html>\n')
