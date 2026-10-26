#!/bin/sh
# Assemble the web build from src/: the translation bundle, index.html for GitHub Pages, and two local test pages.
set -e
cd "$(dirname "$0")/.."
cat src/i18n/engine.js src/i18n/cards.js src/i18n/dict1.js src/i18n/dict2.js src/i18n/dict3.js src/i18n/engine-tail.js > i18n.js
node --check i18n.js
mkdir -p tools/test/out
python3 -c "import re,sys; s=open('src/page.html').read(); open('tools/test/out/page.js','w').write(re.findall(r'<script>(.*?)</script>', s, re.S)[-1])"
node --check tools/test/out/page.js
python3 tools/wrap.py src/page.html index.html
cp index.html _preview.html
sed 's/catch (e) {}/catch (e) { console.error("DBG", e \&\& e.message) }/g' index.html > _dbg.html
echo "web build ok"
