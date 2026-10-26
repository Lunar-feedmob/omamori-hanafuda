import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src).read()
head = '''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="日本庭院主题的花札记忆配对小游戏：十三种主题、七套卡面、48 张花札图鉴与御守。">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
'''
s = s.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
i = s.index('<div id="scene"')
open(dst, 'w').write(head + s[:i] + '</head>\n<body>\n' + s[i:] + '\n</body>\n</html>\n')
