/* 花合帖 · translations (English, Japanese) for the web build. The page itself is written in Chinese; this file
   translates what appears on screen. Loaded before the page script; the 小红书 build leaves it out (Chinese only). */
var I18N = window.I18N = {dict: {}, cards: {}};
// Card texts by id: [English name, meaning, charm, description] and Japanese [meaning, charm, description].
// Japanese card names are already on the cards (m.jp) and their reading (m.kana) stands in for the Chinese gloss.
I18N.cards = {
  en: {
    'matsu': ['Pine', 'Long life', 'Charm of Long Life', 'Green that never fades, even in winter. At New Year, pine is set by the gate so the year god can find the way home.'],
    'matsu-2': ['Pine (second)', 'Steadfastness', 'Charm of Evergreen', 'Pine again, its branches in another pose. Tokiwa, the Japanese say: unchanging through the seasons, like the pine.'],
    'matsu-tan': ['Pine with Red Ribbon', 'Words of good fortune', 'Charm of the First Shrine Visit', 'The red slip reads “akayoroshi” — how fine. With the plum and cherry slips it makes the Red Ribbons.'],
    'matsu-tsuru': ['Crane and Sun', 'A thousand years', 'Charm of Longevity', 'A red sun rises and a white crane stands beneath the pine. Cranes live a thousand years; this is the first bright card of the year.'],
    'ume': ['Plum', 'Patience that heralds spring', 'Charm of Study', 'The cold has not gone, yet the plum is already in bloom. Sugawara no Michizane, god of learning, loved plums; his shrines are full of them.'],
    'ume-2': ['Plum (second)', 'Quiet fragrance', 'Charm of Purity', 'Another sprig of plum: five small petals, open before the snow has melted.'],
    'ume-tan': ['Plum with Red Ribbon', 'Words of good fortune', 'Charm for Passing Exams', 'A red “akayoroshi” slip on the plum branch, the second of the Red Ribbons.'],
    'ume-uguisu': ['Bush Warbler in Plum', 'News of spring', 'Charm of Good Luck', 'A warbler lands on the plum and sings once, and spring has come. In Japan it is called the bird that announces spring.'],
    'sakura': ['Cherry', 'Fleeting beauty', 'Charm of Good Ties', 'Cherry blossoms last only days. People sit beneath them with sake, and sigh softly as they fall.'],
    'sakura-2': ['Cherry (second)', 'The pathos of things', 'Charm of Fair Bonds', 'Cloud upon cloud of blossom: full bloom.'],
    'sakura-tan': ['Cherry with Poetry Ribbon', 'Famed Yoshino', 'Charm of Love Fulfilled', 'The red slip reads “miyoshino” — Mount Yoshino, where a thousand cherry trees fill the hills.'],
    'sakura-maku': ['Cherry Curtain', 'Feasting together', 'Charm of Fortune', 'A curtain is drawn under the cherries and the blossom party is in full swing. With the sake cup it makes Blossom Viewing.'],
    'fuji': ['Wisteria', 'Grace that lasts', 'Charm of Beauty', 'Wisteria hangs in long clusters, swaying in the early-summer wind. Its vines climb far: a sign of things that last.'],
    'fuji-2': ['Wisteria (second)', 'Unbroken ties', 'Charm of Lasting', 'In the whole deck only wisteria hangs downward; every other plant grows up.'],
    'fuji-tan': ['Wisteria with Ribbon', 'Early-summer elegance', 'Charm of Safe Childbirth', 'A plain red slip. The ribbons of April, May and July hang on grasses and are called the Grass Ribbons.'],
    'fuji-hototogisu': ['Cuckoo in Wisteria', 'First song of summer', 'Charm of Safe Travels', 'A cuckoo crosses a crescent moon. In old poems, the first cuckoo call means summer has begun.'],
    'ayame': ['Iris', 'Warding off evil', 'Charm of Victory', 'Irises are hung at the Boys’ Festival to keep evil away. Shōbu, iris, sounds like the word for valour.'],
    'ayame-2': ['Iris (second)', 'Festival wishes', 'Charm of the Boys’ Festival', 'Its leaves are shaped like swords, said to cut through evil.'],
    'ayame-tan': ['Iris with Ribbon', 'By the water', 'Charm of Good Health', 'On the iris leaves by the water, a red slip is tied as well.'],
    'ayame-yatsuhashi': ['Iris and Eight Bridges', 'A traveller’s poem', 'Charm of Safe Journeys', 'In The Tales of Ise, eight plank bridges zigzag through an iris marsh, and the traveller remembers home.'],
    'botan': ['Peony', 'Wealth and honour', 'Charm of Thriving Trade', 'The king of flowers: large, deep in colour, a sign of prosperity.'],
    'botan-2': ['Peony (second)', 'Splendour', 'Charm of Riches', 'Peonies in the rainy season, heavy with water, at their fullest.'],
    'botan-tan': ['Peony with Blue Ribbon', 'Blue poetry slip', 'Charm of Wisdom', 'A blue slip. With the chrysanthemum and maple slips it makes the Blue Ribbons.'],
    'botan-cho': ['Butterflies and Peony', 'Carefree joy', 'Charm of Wishes Granted', 'Butterflies flit among the peonies. With the boar and the deer they make the most famous set: Boar, Deer, Butterfly.'],
    'hagi': ['Bush Clover', 'Autumn longing', 'Charm of Family Harmony', 'Thin drooping stems covered in small red-purple flowers: one of the Seven Herbs of Autumn.'],
    'hagi-2': ['Bush Clover (second)', 'Gentleness', 'Charm of Fond Thoughts', 'By the old calendar, July is already early autumn.'],
    'hagi-tan': ['Bush Clover with Ribbon', 'Autumn grasses', 'Charm of Friendship', 'The red slip on the bush clover, last of the Grass Ribbons.'],
    'hagi-inoshishi': ['Boar and Bush Clover', 'Forward, always', 'Charm Against Misfortune', 'A boar bursts out of the flowers. It only ever charges ahead, so it stands for pressing on.'],
    'susuki': ['Pampas Grass', 'Autumn wind and harvest', 'Charm of Peace', 'Pampas grass rolls like waves in the autumn wind. For moon viewing, people offer pampas and rice dumplings.'],
    'susuki-2': ['Pampas (second)', 'Plenty', 'Charm of Good Harvest', 'The pampas hill on the cards is always black; the white left above it is the night sky.'],
    'susuki-kari': ['Geese over Pampas', 'The way home', 'Charm of Homecoming', 'Three geese in a line fly over the autumn hill at night, heading south.'],
    'susuki-tsuki': ['Full Moon on Pampas', 'Reunion', 'Charm of Fulfilment', 'The full moon rises over the pampas hill and the sky turns red. With the sake cup it makes Moon Viewing.'],
    'kiku': ['Chrysanthemum', 'Long life, noble heart', 'Charm of Good Health', 'On the Double Ninth, people drink chrysanthemum wine for long life. The flower is also Japan’s imperial crest.'],
    'kiku-2': ['Chrysanthemum (second)', 'Nobility', 'Charm of Long Years', 'The chrysanthemums on the cards come in yellow, red and white.'],
    'kiku-tan': ['Chrysanthemum with Blue Ribbon', 'Blue poetry slip', 'Charm of a Calm Mind', 'A blue slip beside the chrysanthemum, the second of the Blue Ribbons.'],
    'kiku-sakazuki': ['Sake Cup', 'A toast to long life', 'Charm of Fortune and Years', 'The cup bears the character for long life, for drinking among chrysanthemums on the Double Ninth. It makes sets with both the cherry curtain and the moon.'],
    'momiji': ['Maple', 'The turning year', 'Charm of Career', 'In late autumn the maples turn from green to red. Walking the hills to see them is called momijigari.'],
    'momiji-2': ['Maple (second)', 'Passing time', 'Charm of Good Fortune', 'The tenth month of the old calendar is the month without gods: legend says they all go to Izumo.'],
    'momiji-tan': ['Maple with Blue Ribbon', 'Blue poetry slip', 'Charm of the Arts', 'A blue slip among the maple leaves. Gather all three for the Blue Ribbons.'],
    'momiji-shika': ['Deer and Maple', 'Messenger of the gods', 'Charm of the Sacred Deer', 'A deer looks back among the maples. The deer of Nara are held to be messengers of the gods.'],
    'yanagi': ['Willow (Lightning)', 'Sudden storms', 'Charm Against Thunder', 'November’s only plain card shows lightning. It is called the demon card; in some games it is wild.'],
    'yanagi-tan': ['Willow with Ribbon', 'Supple strength', 'Charm of Smooth Paths', 'A willow branch in the rain, a red slip tied to it.'],
    'yanagi-tsubame': ['Swallow and Willow', 'A thriving home', 'Charm of a Safe Home', 'A swallow skims the willow in the rain. Swallows nesting under the eaves mean a house will thrive.'],
    'yanagi-ono': ['Rain Man (Ono no Michikaze)', 'Perseverance', 'Charm of Calligraphy', 'The calligrapher Ono no Michikaze watched a frog in the rain leap again and again at a willow branch until it made it. After that, he never gave up on his brush.'],
    'kiri': ['Paulownia', 'Nobility and good fortune', 'Charm of Success', 'Broad paulownia leaves with flower spikes in a 5-7-5 pattern: the paulownia crest itself.'],
    'kiri-2': ['Paulownia (second)', 'Grace', 'Charm of Kind Patrons', 'December has three plain cards, more than any other month.'],
    'kiri-iro': ['Paulownia (coloured)', 'Bringing wealth', 'Charm of Money', 'The one of the three with a different ground colour; makers used to print their name on it.'],
    'kiri-hoo': ['Phoenix and Paulownia', 'An age of peace', 'Charm of Great Wishes', 'Legend says the phoenix alights only on paulownia trees, and when it comes, peace comes with it. The last of the Five Brights.']
  },
  ja: {
    'matsu': ['不老長寿', '長寿守', '冬も色あせない緑。正月には門松を立て、年神さまが迷わず来られるようにする。'],
    'matsu-2': ['節を曲げない', '常盤守', '同じ松でも、枝ぶりが違う。「常盤」とは、松のように四季を通して変わらないこと。'],
    'matsu-tan': ['めでたい言葉', '初詣守', '赤い短冊に「あかよろし」。梅・桜の短冊と合わせて「赤短」。'],
    'matsu-tsuru': ['千年の寿', '延寿守', '初日が昇り、松の下に白い鶴。鶴は千年、一年で最初の光札。'],
    'ume': ['春を告げる忍耐', '学業守', '寒さの残るうちに、梅が先に咲く。学問の神・菅原道真は梅を愛し、天満宮には梅が多い。'],
    'ume-2': ['清らかな香り', '清浄守', 'もう一枝の梅。雪が消えきらないうちに開く、五弁の小さな花。'],
    'ume-tan': ['めでたい言葉', '合格守', '梅の枝にも「あかよろし」の赤短冊。「赤短」の二枚目。'],
    'ume-uguisu': ['春の便り', '開運守', '鶯が梅の枝にとまり、ひと声鳴けば春が来る。「春告鳥」とも呼ばれる。'],
    'sakura': ['刹那の美', '良縁守', '桜は数日しか咲かない。人は木の下で酒を酌み、散る花にそっとため息をつく。'],
    'sakura-2': ['もののあはれ', '美縁守', '花の雲が重なる、満開のころ。'],
    'sakura-tan': ['名所・吉野', '恋愛成就守', '赤短冊の「みよしの」は吉野山、千本桜が山を埋める地。'],
    'sakura-maku': ['宴のよろこび', '招福守', '桜の下に幕を張り、花見の宴はたけなわ。菊に盃と合わせて「花見酒」。'],
    'fuji': ['優雅に長く', '美守', '藤の花房が垂れ、初夏の風に揺れる。蔓は長く伸び、末長い縁起物。'],
    'fuji-2': ['途切れない縁', '長久守', '花札で下へ垂れるのは藤だけ。ほかの草木はみな上へ伸びる。'],
    'fuji-tan': ['初夏の風雅', '安産守', '文字のない赤短冊。四・五・七月の短冊は草花に掛かり「草短」と呼ぶ。'],
    'fuji-hototogisu': ['夏の初音', '旅行安全守', '三日月をかすめるほととぎす。和歌では、初音を聞けば夏が来る。'],
    'ayame': ['魔除けと尚武', '必勝守', '端午には菖蒲を飾って邪気を払う。「菖蒲」は「尚武」に通じ、男の子への祈り。'],
    'ayame-2': ['端午の願い', '端午守', '剣のような葉は、邪気を断つという。'],
    'ayame-tan': ['水辺の風情', '身体健全守', '水辺の菖蒲の葉にも、赤い短冊がひとつ。'],
    'ayame-yatsuhashi': ['旅の詩情', '交通安全守', '『伊勢物語』の八橋。かきつばたの沢を渡る板橋で、旅人は都を思う。'],
    'botan': ['富貴栄華', '商売繁盛守', '百花の王。大きく色濃い花は富貴のしるし。'],
    'botan-2': ['華やぎ', '富貴守', '梅雨にしっとり濡れた牡丹が、いちばん盛り。'],
    'botan-tan': ['青い短冊', '知恵守', '青い短冊。菊・紅葉の青短冊と合わせて「青短」。'],
    'botan-cho': ['自由なよろこび', '心願成就守', '牡丹の間を舞う蝶。猪・鹿と合わせて有名な役「猪鹿蝶」。'],
    'hagi': ['秋の想い', '家庭円満守', '細い枝に赤紫の小花がこぼれる。秋の七草のひとつ。'],
    'hagi-2': ['やさしさ', '相思守', '旧暦の七月は、もう初秋。'],
    'hagi-tan': ['秋草の風情', '友情守', '萩の赤短冊は「草短」の最後の一枚。'],
    'hagi-inoshishi': ['猪突猛進', '厄除守', '花の中から猪が飛び出す。前へ進むしかない、だから猪突猛進。'],
    'susuki': ['秋風と豊年', '平安守', '芒は秋風に波のように揺れる。月見には芒と団子を供える。'],
    'susuki-2': ['実り', '豊穣守', '花札の芒の山はいつも黒い。残された白が夜空。'],
    'susuki-kari': ['帰郷の道', '帰郷守', '三羽の雁が列をなし、秋の夜の丘を越えて南へ。'],
    'susuki-tsuki': ['円満と団らん', '円満守', '満月が芒の山に昇り、空が赤く染まる。菊に盃と合わせて「月見酒」。'],
    'kiku': ['長寿と高潔', '無病息災守', '重陽には菊酒を飲んで長寿を願う。菊は皇室の紋でもある。'],
    'kiku-2': ['気高さ', '菊寿守', '花札の菊は黄、赤、白。'],
    'kiku-tan': ['青い短冊', '心静守', '菊のそばの青短冊、「青短」の二枚目。'],
    'kiku-sakazuki': ['長寿の祝杯', '福寿守', '盃には「寿」の字。重陽に菊を愛で酒を酌む。花見酒にも月見酒にもなる。'],
    'momiji': ['巡る歳月', '仕事守', '晩秋、楓は緑から紅へ。山へ紅葉を見に行くのが「紅葉狩」。'],
    'momiji-2': ['移ろう時', '良運守', '旧暦十月は「神無月」。神々はみな出雲へ出かけるという。'],
    'momiji-tan': ['青い短冊', '芸能守', '紅葉の間の青短冊。三枚そろえば「青短」。'],
    'momiji-shika': ['神の使い', '神鹿守', '紅葉の中で振り返る鹿。奈良の鹿は神の使いとされる。'],
    'yanagi': ['雷雨の無常', '雷除守', '十一月ただ一枚のカス札は雷。「鬼札」と呼ばれ、遊び方によっては万能札になる。'],
    'yanagi-tan': ['しなやかさ', '順風守', '雨の柳の枝に、赤い短冊がひとつ。'],
    'yanagi-tsubame': ['家運隆盛', '家内安全守', '雨の柳をかすめる燕。軒下に燕が巣をかけると、家が栄えるという。'],
    'yanagi-ono': ['あきらめない心', '書道守', '雨の中、柳の枝へ何度も跳ぶ蛙を見た小野道風。蛙がついに届くのを見て、書の修行をやめなかった。'],
    'kiri': ['高貴と吉祥', '立身守', '大きな桐の葉、花穂は「五七五」に並ぶ。桐紋そのもの。'],
    'kiri-2': ['気品', '貴人守', '十二月はカス札が三枚、四十八枚でいちばん多い。'],
    'kiri-iro': ['招財', '金運守', '三枚のうち地色の違う一枚。昔は札屋の名が刷られた。'],
    'kiri-hoo': ['太平の世', '大願守', '鳳凰は桐にしかとまらず、現れれば世は太平という。五光の最後の一枚。']
  }
};
// Interface and data texts, keyed by the Chinese source as it appears on screen. Value: [English, Japanese].
// "{}" in a key matches any text; {0}, {1}… in a value put the matched pieces back (each one translated in turn).
// An empty Japanese value hides a line that only exists to gloss Japanese for Chinese readers.
Object.assign(I18N.dict, {
  // ---- months, plants, numerals ----
  '一月': ['January', '1月'], '二月': ['February', '2月'], '三月': ['March', '3月'], '四月': ['April', '4月'], '五月': ['May', '5月'], '六月': ['June', '6月'],
  '七月': ['July', '7月'], '八月': ['August', '8月'], '九月': ['September', '9月'], '十月': ['October', '10月'], '十一月': ['November', '11月'], '十二月': ['December', '12月'],
  '一': ['1', '一'], '二': ['2', '二'], '三': ['3', '三'], '四': ['4', '四'], '五': ['5', '五'], '六': ['6', '六'], '七': ['7', '七'], '八': ['8', '八'],
  '春': ['Spring', '春'], '夏': ['Summer', '夏'], '秋': ['Autumn', '秋'], '冬': ['Winter', '冬'],
  // ---- yaku, seals, decks ----
  '五光': ['Five Brights', '五光'], '五张光札全部到齐': ['all five bright cards', '光札五枚がそろう'],
  '猪鹿蝶': ['Boar, Deer, Butterfly', '猪鹿蝶'], '野猪、鹿与蝴蝶': ['the boar, the deer and the butterflies', '猪と鹿と蝶'],
  '赤短': ['Red Ribbons', '赤短'], '松、梅、樱的红色诗笺': ['the red poetry slips of pine, plum and cherry', '松・梅・桜の赤い短冊'],
  '青短': ['Blue Ribbons', '青短'], '牡丹、菊、红叶的蓝色诗笺': ['the blue slips of peony, chrysanthemum and maple', '牡丹・菊・紅葉の青い短冊'],
  '花見酒': ['Blossom Viewing', '花見酒'], '樱下幔幕配一盃酒': ['the cherry curtain and the sake cup', '桜の幕に盃'],
  '月見酒': ['Moon Viewing', '月見酒'], '芒上满月配一盃酒': ['the full moon and the sake cup', '芒の月に盃'],
  '三連': ['3 in a row', '三連'], '连续配对三组': ['three pairs in a row', '三組続けてそろえる'], '五連': ['5 in a row', '五連'], '连续配对五组': ['five pairs in a row', '五組続けてそろえる'],
  '七連': ['7 in a row', '七連'], '连续配对七组': ['seven pairs in a row', '七組続けてそろえる'], '無垢': ['Flawless', '無垢'], '一局里一次也没翻错': ['a garden without a single miss', 'ひと庭のあいだ一度も外さない'],
  '一目': ['One Look', '一目'], '不回看就点亮灯笼': ['light a garden without looking again', '見直さずに庭を灯す'], '八景': ['Eight Views', '八景'], '点亮全部八盏灯笼': ['light all eight gardens', '八つの庭をすべて灯す'],
  '全札': ['Full Deck', '全札'], '集齐四十八张花札': ['collect all forty-eight cards', '花札四十八枚をそろえる'], '花合': ['Month Match', '花合わせ'], '通过庭外「花合」': ['clear “Month Match” beyond the gardens', '庭の外「花合わせ」をクリア'],
  '夜庭': ['Night Garden', '夜の庭'], '通过庭外「夜庭」': ['clear “Night Garden”', '庭の外「夜の庭」をクリア'], '役成': ['Set Made', '役成'], '在「役之庭」凑成指定的役': ['make the set asked for in “Yaku Garden”', '「役の庭」で指定の役をつくる'],
  '彩绘': ['Painted', '彩絵'], 'Mantia · 绿野红缘': ['Mantia · green field, red border', 'Mantia · 緑の野に赤縁'], '墨染': ['Sumi', '墨染'], 'Mantia · 黑边浓墨': ['Mantia · black border, deep ink', 'Mantia · 黒縁と濃墨'],
  '朱缘': ['Vermilion', '朱縁'], 'Mantia · 朱红边框': ['Mantia · vermilion border', 'Mantia · 朱の縁取り'], '花图': ['Hwatu', '花闘'], '韩式 Hwatu · 带「光」字': ['Korean hwatu · marked 光', '韓国式 Hwatu ·「光」入り'],
  '墨绘': ['Ink Wash', '墨絵'], '原创 · 淡墨与朱印': ['original · pale ink and red seals', 'オリジナル · 淡墨と朱印'], '剪纸': ['Paper Cut', '切り絵'], '原创 · 平面色块': ['original · flat colour', 'オリジナル · ベタ色'],
  '网点': ['Screentone', '網点'], '原创 · 黑白网点': ['original · black and white tone', 'オリジナル · 白黒スクリーントーン'],
  '光札': ['Bright', '光札'], '种札': ['Animal', '種札'], '短册': ['Ribbon', '短冊'], '素札': ['Plain', 'カス札'],
  // ---- seasons, gardens, modes ----
  '一〜三月 · 松 梅 桜': ['Jan – Mar · pine, plum, cherry', '一〜三月 · 松 梅 桜'], '新春到花見': ['New Year to blossom time', '新春から花見まで'],
  '四〜六月 · 藤 菖蒲 牡丹': ['Apr – Jun · wisteria, iris, peony', '四〜六月 · 藤 菖蒲 牡丹'], '初夏到梅雨': ['early summer to the rains', '初夏から梅雨まで'],
  '七〜九月 · 萩 芒 菊': ['Jul – Sep · clover, pampas, chrysanthemum', '七〜九月 · 萩 芒 菊'], '赏月到重阳': ['moon viewing to the Double Ninth', '月見から重陽まで'],
  '十〜十二月 · 紅葉 柳 桐': ['Oct – Dec · maple, willow, paulownia', '十〜十二月 · 紅葉 柳 桐'], '时雨到除夜': ['winter showers to year’s end', '時雨から除夜まで'],
  '初音': ['First Song', '初音'], '花見': ['Blossom Viewing', '花見'], '青葉': ['Green Leaves', '青葉'], '夕立': ['Evening Shower', '夕立'],
  '月見': ['Moon Viewing', '月見'], '重陽': ['Double Ninth', '重陽'], '時雨': ['Winter Rain', '時雨'], '除夜': ['Year’s Eve', '除夜'],
  '早春': ['early spring', '早春'], '晚春': ['late spring', '晩春'], '初夏': ['early summer', '初夏'], '梅雨': ['rainy season', '梅雨'], '中秋': ['mid-autumn', '中秋'], '晚秋': ['late autumn', '晩秋'], '初冬': ['early winter', '初冬'], '岁末': ['year’s end', '歳末'],
  '梅开一朵，便暖一分': ['one plum blossom — one blossom’s worth of warmth', ''], '种种往事，都随樱花想起': ['so many things the cherry blossoms bring to mind', ''],
  '满眼青叶，山中杜鹃，初上的鲣鱼': ['green leaves to the eye, a mountain cuckoo, the first bonito', ''], '骤雨来了，群雀紧抓着草叶': ['a sudden shower — the sparrows cling to the grass', ''],
  '明月当空，绕着池塘，走了一整夜': ['the harvest moon — I walk around the pond all night long', ''], '菊花香里，奈良城中，古老的佛像们': ['scent of chrysanthemums — in Nara, the ancient Buddhas', ''],
  '初冬的阵雨，猴子也想要件小蓑衣': ['first winter rain — even the monkey seems to want a little straw coat', ''], '一年又尽，依旧戴着斗笠，穿着草鞋': ['the year has ended — still in my straw hat and sandals', ''],
  '服部嵐雪': ['Hattori Ransetsu', '服部嵐雪'], '松尾芭蕉': ['Matsuo Bashō', '松尾芭蕉'], '山口素堂': ['Yamaguchi Sodō', '山口素堂'], '与謝蕪村': ['Yosa Buson', '与謝蕪村'],
  '同月相配': ['pair by month', '同じ月どうし'], '同一个月的四张牌互相配对，牌面不再一模一样。': ['Any two cards of the same month make a pair — they no longer have to look the same.', '同じ月の四枚どうしがペアになります。絵柄は同じでなくてかまいません。'],
  '花の雲鐘は上野か浅草か': ['花の雲鐘は上野か浅草か', '花の雲鐘は上野か浅草か'], '花开如云，钟声是从上野，还是浅草': ['clouds of blossom — is that bell from Ueno, or Asakusa?', ''],
  '花火一闪': ['by firework light', '花火のひかりで'], '天黑了，只在烟火亮起的一瞬看清牌面；三枚花火代替回看。': ['It is dark: you only see the cards when a firework bursts. Three fireworks replace the second look.', '夜です。花火が上がる一瞬だけ札が見えます。見直しの代わりに花火が三発。'],
  '漆黑的夜，找不到巢的千鸟在鸣叫': ['a pitch-dark night — lost from its nest, a plover cries', ''],
  '役之庭': ['Yaku Garden', '役の庭'], '凑一个役': ['make a set', '役をつくる'], '在步数内配出指定的役，其余的牌只是陪衬。': ['Make the set you are given before the steps run out; the other cards are only scenery.', '手数のうちに指定の役をそろえましょう。ほかの札は脇役です。'],
  '呦的一声，尾音悲凉，夜里的鹿': ['a cry, and its sad trailing end — a deer in the night', ''],
  '悠闲': ['Relaxed', 'のんびり'], '不计步数，慢慢看。': ['No step limit. Take your time.', '手数制限なし。ゆっくりどうぞ。'], '标准': ['Standard', 'ふつう'],
  '步数宽裕；第五庭起，可以多回看一次。': ['Plenty of steps; from the fifth garden you get one extra look.', '手数にゆとりあり。第五の庭から見直しが一回増えます。'],
  '挑战': ['Challenge', 'チャレンジ'], '步数紧，看牌短，只能回看一次。': ['Tight steps, a short first look, one second look.', '手数は少なめ、最初に見る時間も短く、見直しは一回だけ。'],
  // ---- looks ----
  '四叠青春': ['Four-and-a-Half Mats', '四畳半青春'], '四畳半': ['yojōhan', '四畳半'], '歪歪的线，饱满的色块，四叠半被透视拉长。': ['Wobbly lines, bold colour, a tiny room stretched by perspective.', 'ゆがんだ線とベタ色。四畳半がパースで伸びていく。'],
  '昭和漫画': ['Shōwa Manga', '昭和漫画'], '漫画': ['manga', '漫画'], '网点、细线和一点朱红，像旧杂志的连载。': ['Screentone, fine lines and a touch of red, like an old magazine serial.', 'スクリーントーンと細い線、ほんの少しの朱。昔の雑誌の連載のように。'],
  '浮世锦绘': ['Ukiyo-e Prints', '浮世錦絵'], '錦絵': ['nishiki-e', '錦絵'], '主页是当季的广重《名所江户百景》，庭院里是靛蓝与朱红的原创版画。': ['Hiroshige’s One Hundred Famous Views of Edo for the season at home; indigo-and-vermilion prints in the gardens.', 'ホームには季節の広重『名所江戸百景』、庭には藍と朱のオリジナル版画。'],
  '京都和纸': ['Kyoto Washi', '京都和紙'], '和紙': ['washi', '和紙'], '一册文库本，封面是雪佳的四季，朱印只落一枚。': ['A small paperback with Sekka’s seasons on the cover, and a single red seal.', '一冊の文庫本。表紙は雪佳の四季、朱印はひとつだけ。'],
  '砂纹石庭': ['Raked Sand', '砂紋石庭'], '枯山水': ['karesansui', '枯山水'], '砂纹如水，石上生苔，风从耙痕间走过。': ['Sand raked like water, moss on the stone, wind through the furrows.', '水のような砂紋、石に苔、風が熊手の跡を渡る。'],
  '灯火夜祭': ['Lantern Festival', '灯火夜祭'], '夜祭り': ['night festival', '夜祭り'], '广重的烟花照着夜色，灯笼一串串亮起。': ['Hiroshige’s fireworks light the night; strings of lanterns glow.', '広重の花火が夜を照らし、提灯がひとつずつ灯る。'],
  '旅行手账': ['Travel Journal', '旅の手帖'], '旅の手帳': ['travel journal', '旅の手帳'], '纸页、邮戳、纸胶带，北斋的草花夹在页间。': ['Paper, postmarks, washi tape, and Hokusai’s flowers pressed between the pages.', '紙と消印とマスキングテープ。ページのあいだに北斎の草花。'],
  '月白风清': ['Moonlit Breeze', '月白風清'], '月夜': ['moonlit night', '月夜'], '芳年的月挂在卷轴上，八处庭院是一轮渐满的月。': ['Yoshitoshi’s moon hangs as a scroll; the eight gardens are a moon slowly filling.', '芳年の月が掛軸に。八つの庭は満ちていく月。'],
  '金碧琳琅': ['Gold and Azure', '金碧琳琅'], '琳派': ['Rinpa', '琳派'], '光琳与抱一的金屏风，群青、绿青落在金箔上。': ['Kōrin’s and Hōitsu’s gold screens: azurite and malachite on gold leaf.', '光琳と抱一の金屏風。金箔に群青と緑青。'],
  '墨戏山野': ['Ink Frolics', '墨戯山野'], '戯画': ['giga', '戯画'], '兔与蛙在绘卷里嬉闹，墨线一路展开到庭院。': ['Rabbits and frogs romp through the scroll, the ink line running on into the gardens.', '兎と蛙が絵巻で戯れ、墨の線が庭までつづく。'],
  '洋灯旧梦': ['Gaslight Café', '洋灯の夢'], '浪漫': ['Taishō romance', '浪漫'], '梦二的乐谱封面挂在墙上，庭院写进咖啡馆的菜单。': ['Yumeji’s sheet-music covers on the wall; the gardens are on the café menu.', '夢二の楽譜表紙を壁に。庭はカフェのメニューに。'],
  '电光游园': ['Neon Arcade', '電光遊園'], 'ドット': ['pixels', 'ドット'], '霓虹与像素的夜间游园，八处庭院是八个关卡。': ['A neon, pixel-lit night fair; the eight gardens are eight stages.', 'ネオンとドットの夜の遊園地。八つの庭は八つのステージ。'],
  '传统和风': ['Traditional', '伝統和風'], '古画新游': ['Old Masters', '古画新遊'], '节令生活': ['Seasons and Days', '季節の暮らし'], '摩登时光': ['Modern Times', 'モダンな時間'],
  '梅与诗笺': ['Plum and Poem Slip', '梅と短冊'], '紫阳花': ['Hydrangeas', '紫陽花'], '武藏野之月': ['Moon over Musashino', '武蔵野の月'], '冬之川': ['Winter River', '冬の川'],
  '龟户梅屋敷': ['Plum Garden, Kameido', '亀戸梅屋舗'], '大桥阿宅骤雨': ['Sudden Shower over Ōhashi', '大はしあたけの夕立'], '月之岬': ['Moon Viewing Point', '月の岬'], '浅草金龙山': ['Kinryūzan Temple, Asakusa', '浅草金龍山'],
  '忍冈之月': ['Shinobugaoka Moon', '忍岡の月'], '云居之月': ['Moon above the Clouds', '雲居の月'], '原野之月': ['Moon of the Moor', '原野の月'], '浅野川雪月': ['Snow and Moon, Asano River', '浅野川の雪月'],
  '樱枫图': ['Cherry and Maple Trees', '桜楓図'], '酒井抱一': ['Sakai Hōitsu', '酒井抱一'], '1820 年代': ['1820s', '1820年代'], '大都会艺术博物馆开放馆藏（CC0）': ['The Met, Open Access (CC0)', 'メトロポリタン美術館オープンアクセス（CC0）'],
  '八桥图': ['Irises at Yatsuhashi', '八橋図'], '尾形光琳': ['Ogata Kōrin', '尾形光琳'], '1709 年后': ['after 1709', '1709年以降'], '夏秋溪流图 · 左扇': ['Mountain Stream in Summer and Autumn, left screen', '夏秋渓流図 · 左隻'],
  '铃木其一': ['Suzuki Kiitsu', '鈴木其一'], '19 世纪': ['19th century', '19世紀'], '公有领域，图像来自 Wikimedia Commons': ['public domain, image via Wikimedia Commons', 'パブリックドメイン、画像は Wikimedia Commons より'],
  '红白梅图': ['Red and White Plum Blossoms', '紅白梅図'], '18 世纪': ['18th century', '18世紀'],
  '收集进度已同步到你的账号，换台设备打开也能接着玩。': ['Your collection is synced to your account, so you can continue on another device.', '収集の記録はアカウントに同期されます。別の端末でも続きから遊べます。'],
  '收集进度保存在这台设备的浏览器里，刷新页面不会丢失。': ['Your collection is saved in this browser and survives a page refresh.', '収集の記録はこの端末のブラウザに保存されます。再読み込みしても消えません。'],
  '布面': ['Cloth', '布'], '金线': ['Gold Thread', '金糸'], '満願': ['Fulfilled', '満願'], '守': ['charm', '守'],
  '三味线': ['shamisen', '三味線'], '琴与笙': ['koto and shō', '琴と笙'], '钵铃与尺八': ['singing bowl and shakuhachi', '鈴と尺八'], '篠笛与太鼓': ['shinobue and taiko', '篠笛と太鼓'],
  '八音盒': ['music box', 'オルゴール'], '轻快拨弦与拍手': ['plucked strings and claps', '軽やかな撥弦と手拍子'], '玩具钢琴': ['toy piano', 'トイピアノ'], '琵琶与虫声': ['biwa and insects', '琵琶と虫の音'],
  '笙与龙笛': ['shō and ryūteki', '笙と龍笛'], '笛与小鼓': ['flute and kotsuzumi', '笛と小鼓'], '曼陀林与留声机': ['mandolin and gramophone', 'マンドリンと蓄音機'], '芯片音': ['chiptune', 'チップチューン'],
  // ---- home ----
  '主题 · {} / {}': ['Look · {0} / {1}', 'テーマ · {0} / {1}'], '音效已开启，点按关闭': ['Sound on — tap to mute', 'サウンド オン、タップで消音'], '音效已关闭，点按开启': ['Sound off — tap to turn on', 'サウンド オフ、タップでオン'],
  '这个设备上无法加载琴声音色': ['Instrument sounds can’t load on this device', 'この端末では楽器の音色を読み込めません'], '这个设备上无法加载环境音': ['Ambient sound can’t load on this device', 'この端末では環境音を読み込めません'],
  '{}：{}，季节决定音阶': ['{0}: {1}; the season sets the scale', '{0}：{1}。音階は季節で変わります'], '{} / {} 张': ['{0} / {1} cards', '{0} / {1} 枚'],
  '{}/{} 种 · {} 枚 · 金线 {} · 満願 {}': ['{0}/{1} kinds · {2} charms · gold {3} · fulfilled {4}', '{0}/{1} 種 · {2} 体 · 金糸 {3} · 満願 {4}'],
  '{} 组 · {} 步': ['{0} pairs · {1} steps', '{0} 組 · {1} 手'], '{} 组 · 不限步数': ['{0} pairs · no step limit', '{0} 組 · 手数制限なし'],
  '未解锁': ['locked', '未開放'], '已点亮': ['lit', '灯った'], '下一处': ['next', 'つぎ'], '未通关': ['not cleared', '未クリア'], '再访': ['Revisit', 'もう一度'], '继续': ['Continue', 'つづき'],
  '花札': ['Cards', '花札'], '御守': ['Charms', '御守'], '{} 枚': ['{0}', '{0} 体'], '朱印': ['Seals', '朱印'], '清空记录，重新开始': ['Erase everything and start over', '記録を消して最初から'],
  '花合帖': ['花合帖', '花合帖'], '四叠半花札部 · 招新中': ['Hanafuda Club · now recruiting', '四畳半花札部 · 部員募集中'], '四季八景 · 好评连载中': ['Four Seasons, Eight Views · now serialised', '四季八景 · 好評連載中'],
  '第{}話': ['Ch. {0}', '第{0}話'], '第{}話「{}」': ['Ch. {0} “{1}”', '第{0}話「{1}」'], '読む': ['READ', '読む'], '目次': ['Contents', '目次'], '次号': ['soon', '次号'], '済': ['✓', '済'],
  '刊头底图：葛饰北斋《北斋漫画》，芝加哥艺术博物馆开放馆藏': ['Masthead: Katsushika Hokusai, Hokusai Manga — Art Institute of Chicago, Open Access', '題字背景：葛飾北斎『北斎漫画』、シカゴ美術館オープンアクセス'],
  '四季八景': ['Four Seasons, Eight Views', '四季八景'], '名所江戸百景 · {}': ['100 Famous Views of Edo · {0}', '名所江戸百景 · {0}'], '第{}庭「{}」 · {}': ['Garden {0} “{1}” · {2}', '第{0}の庭「{1}」 · {2}'],
  '歌川广重《名所江户百景 · {}》（{}），芝加哥艺术博物馆开放馆藏': ['Utagawa Hiroshige, One Hundred Famous Views of Edo · {0} ({1}), Art Institute of Chicago, Open Access', '歌川広重『名所江戸百景 · {0}』（{1}）、シカゴ美術館オープンアクセス'],
  '花札 · 四季八景': ['Hanafuda · Four Seasons, Eight Views', '花札 · 四季八景'], '庭院文库': ['Garden Library', '庭の文庫'], '第{}庭「{}」へ': ['to Garden {0} “{1}”', '第{0}の庭「{1}」へ'],
  '封面：神坂雪佳《百々世草》「{}」（1909–10），芝加哥艺术博物馆开放馆藏': ['Cover: Kamisaka Sekka, A World of Things · “{0}” (1909–10), Art Institute of Chicago, Open Access', '表紙：神坂雪佳『百々世草』「{0}」（1909–10）、シカゴ美術館オープンアクセス'],
  '印': ['✓', '印'], '第{}庭 · {} · {}': ['Garden {0} · {1} · {2}', '第{0}の庭 · {1} · {2}'], '灯火夜祭 · 四季八景': ['Lantern Festival · Four Seasons, Eight Views', '灯火夜祭 · 四季八景'], '{} · 第{}庭 · {}': ['{0} · Garden {1} · {2}', '{0} · 第{1}の庭 · {2}'],
  '背景：歌川广重《名所江户百景 · 两国花火》（1858），芝加哥艺术博物馆开放馆藏': ['Background: Utagawa Hiroshige, Fireworks at Ryōgoku (1858), Art Institute of Chicago, Open Access', '背景：歌川広重『名所江戸百景 · 両国花火』（1858）、シカゴ美術館オープンアクセス'],
  '{}月{}日 · 旅行记': ['{0}/{1} · travel notes', '{0}月{1}日 · 旅日記'], '第{}庭 · {}': ['Garden {0} · {1}', '第{0}の庭 · {1}'], '四季印章集': ['Seasonal Stamp Rally', '四季のスタンプ帳'], '次の駅': ['next stop', '次の駅'],
  '草花：葛饰北斋《北斋漫画》 · 纸纹：ambientCG（CC0）': ['Flowers: Katsushika Hokusai, Hokusai Manga · paper: ambientCG (CC0)', '草花：葛飾北斎『北斎漫画』 · 紙の質感：ambientCG（CC0）'],
  '月冈芳年《月百姿》「{}」（1885–92），公有领域，图像来自 Wikimedia Commons': ['Tsukioka Yoshitoshi, One Hundred Aspects of the Moon · “{0}” (1885–92), public domain, via Wikimedia Commons', '月岡芳年『月百姿』「{0}」（1885–92）、パブリックドメイン、Wikimedia Commons より'],
  '第{}段 · {}': ['Scene {0} · {1}', '第{0}段 · {1}'], '《鸟兽人物戏画》甲卷（12 世纪），高山寺藏，公有领域，图像来自 Wikimedia Commons': ['Frolicking Animals, scroll A (12th c.), Kōzan-ji, public domain, via Wikimedia Commons', '『鳥獣人物戯画』甲巻（12世紀）、高山寺蔵、パブリックドメイン、Wikimedia Commons より'],
  '绘卷八段': ['Eight Scenes of the Scroll', '絵巻八段'], '自右向左展开': ['unrolls right to left', '右から左へ'], '喫茶 · 四季八景': ['Café · Four Seasons, Eight Views', '喫茶 · 四季八景'], '本日推荐 · {}': ['Today’s special · {0}', '本日のおすすめ · {0}'],
  '第{}庭「{}」': ['Garden {0} “{1}”', '第{0}の庭「{1}」'], '竹久梦二为セノオ乐谱所作封面《{}》（{}），公有领域，图像来自 Wikimedia Commons': ['Takehisa Yumeji, cover for Senoo sheet music “{0}” ({1}), public domain, via Wikimedia Commons', '竹久夢二によるセノオ楽譜の表紙『{0}』（{1}）、パブリックドメイン、Wikimedia Commons より'],
  '庭院一览': ['The Gardens', '庭のお品書き'], '準備中': ['soon', '準備中'],
  '我的庭院': ['My Garden', 'わたしの庭'], '十二月花屏风 · 集齐一个月的四张，那一扇就会着色': ['Twelve-month screen · collect a month’s four cards and its panel comes into colour', '十二か月花屏風 · ひと月の四枚がそろうと、その一扇に色がつきます'],
  '绘马架': ['Ema rack', '絵馬掛け'], '満願的御守会挂在这里': ['fulfilled charms hang here', '満願の御守はここに掛かります'], '着色 {} / 12 · 満願 {} 枚 · 朱印 {} / {}': ['in colour {0} / 12 · fulfilled {1} · seals {2} / {3}', '彩色 {0} / 12 · 満願 {1} 体 · 朱印 {2} / {3}'],
  '庭院海报': ['Garden poster', '庭のポスター'], '还是一张白纸，等第一张花札': ['still a blank sheet, waiting for its first card', 'まだ白紙。最初の一枚を待っています'], '四张都到齐了，这一扇已经着色': ['all four are here — this panel is in colour', '四枚そろって、この一扇に色がつきました'],
  '再收 {} 张{}的花札，画就会完全显现': ['{0} more {1} card(s) and the picture appears in full', 'あと{0}枚、{1}の札がそろえば絵がすっかり現れます'],
  '庭外': ['Beyond the Gardens', '庭の外'], '庭外 {}': ['Beyond the Gardens: {0}', '庭の外 {0}'], '庭外 {}，未开放': ['Beyond the Gardens: {0}, locked', '庭の外 {0}（未開放）'], '{} · 已成': ['{0} · done', '{0} · 達成'],
  '八庭之外，三种玩法': ['three more ways to play', '八つの庭の外に、三つの遊び方'], '点亮全部八处庭院后开放': ['opens once all eight gardens are lit', '八つの庭をすべて灯すと開きます']
});
Object.assign(I18N.dict, {
  // ---- posters ----
  '我的庭院 · {}': ['My Garden · {0}', 'わたしの庭 · {0}'], '十二月花屏风': ['Twelve-Month Screen', '十二か月花屏風'],
  '花札 {} / 48 · 御守 {} 枚 · 朱印 {} / {}': ['cards {0} / 48 · charms {1} · seals {2} / {3}', '花札 {0} / 48 · 御守 {1} 体 · 朱印 {2} / {3}'],
  '屏风着色 {} / 12 · 満願 {} 枚': ['screen in colour {0} / 12 · fulfilled {1}', '屏風の彩色 {0} / 12 · 満願 {1} 体'],
  '{} 步 · 收下御守 {} 枚{}': ['{0} steps · {1} charms{2}', '{0} 手 · 御守 {1} 体{2}'], ' · 凑成 {}': [' · made {0}', ' · {0} 成立'],
  '御守 · {} · {}': ['Charm · {0} · {1}', '御守 · {0} · {1}'], '保佑「{}」': ['for “{0}”', 'ご利益「{0}」'], '得自花札「{}」 · 已收下 {} 枚': ['from the card “{0}” · {1} received', '花札「{0}」より · {1} 体'],
  '花合帖 · {}': ['Hana Awase · {0}', '花合わせ帖 · {0}'], '海报': ['Poster', 'ポスター'], '正在绘制…': ['Drawing…', '描いています…'], '按「{}」的样子排版。': ['Laid out in the “{0}” style.', '「{0}」のスタイルで組んでいます。'],
  '海报 · {}': ['Poster · {0}', 'ポスター · {0}'], '没能画出来': ['Couldn’t draw it', '描けませんでした'], '这个浏览器暂时不支持生成图片。': ['This browser can’t create images right now.', 'このブラウザでは画像を作れません。'],
  '返回': ['Back', '戻る'], '关闭': ['Close', '閉じる'], '保存图片': ['Save image', '画像を保存'], '分享': ['Share', '共有'], '存到相册': ['Save to Photos', '写真に保存'], '发到小红书': ['Post to Xiaohongshu', '小紅書に投稿'],
  '也可以长按或右键图片直接保存。': ['You can also long-press or right-click the image to save it.', '画像の長押しや右クリックでも保存できます。'],
  '正在保存…': ['Saving…', '保存しています…'], '已存到相册。': ['Saved to Photos.', '写真に保存しました。'], '没能保存：请在系统设置里允许小红书访问相册。': ['Couldn’t save: allow photo access in your settings.', '保存できませんでした。設定で写真へのアクセスを許可してください。'],
  '已保存。': ['Saved.', '保存しました。'], '已取消保存。': ['Save cancelled.', '保存をキャンセルしました。'], '如果没有开始下载，请长按或右键图片保存。': ['If nothing downloads, long-press or right-click the image to save it.', 'ダウンロードが始まらないときは、画像を長押しまたは右クリックで保存してください。'],
  '没能打开发布页，可以先存到相册再发笔记。': ['Couldn’t open the composer; save to Photos and post from there.', '投稿画面を開けませんでした。写真に保存してから投稿してください。'],
  '生成海报': ['Make a poster', 'ポスターを作る'],
  // ---- collection book ----
  '花札图鉴': ['Card Book', '花札図鑑'], '四十八张，十二个月': ['Forty-eight cards, twelve months', '四十八枚、十二か月'],
  '每月四张，各画一种当季的花木：一月松，二月梅，三月樱……十二月桐。按旧历，一月到三月是春，十月已入冬。': ['Four cards for each month, each month a plant of its season: January pine, February plum, March cherry … December paulownia. By the old calendar, January to March is spring and October is already winter.', '各月四枚、その月の草木が描かれます。一月は松、二月は梅、三月は桜……十二月は桐。旧暦では一月から三月が春、十月はもう冬です。'],
  '光札 · 5 张': ['Brights · 5', '光札 · 5 枚'], '鹤、幔幕、满月、道风、凤凰。一副牌里最亮的五景。': ['Crane, curtain, full moon, Michikaze, phoenix: the five brightest scenes in the deck.', '鶴、幕、満月、道風、鳳凰。一組でいちばん華やかな五景。'],
  '种札 · 9 张': ['Animals · 9', '種札 · 9 枚'], '花木旁多了鸟兽或器物：黄莺、蝴蝶、鹿、酒盃。': ['A bird, beast or object joins the plant: warbler, butterflies, deer, sake cup.', '草木に鳥獣や道具が加わる。鶯、蝶、鹿、盃。'],
  '短册 · 10 张': ['Ribbons · 10', '短冊 · 10 枚'], '花枝上系着诗笺，红的、蓝的，或者无字。': ['A poetry slip tied to the branch: red, blue, or blank.', '枝に短冊。赤、青、あるいは無地。'],
  '素札 · 24 张': ['Plains · 24', 'カス札 · 24 枚'], '只有花木。日语叫「カス」，最朴素，也最多。': ['Just the plant. Called kasu in Japanese: the plainest, and the most common.', '草木だけ。「カス」と呼ばれ、いちばん素朴で数も多い。'],
  '凑齐特定的几张，叫作': ['Certain groups of cards make a', '決まった札をそろえると'], '「役」': [' yaku', '「役」'], '。这里不必懂规则，收集时留意它们就好。': [' (set). No need to learn the rules here — just watch for them as you collect.', 'になります。ルールを覚えなくても大丈夫、集めながら気にかけてみてください。'],
  '已凑齐': ['complete', 'そろった'], '朱印帖': ['Seal Book', '御朱印帳'], '连续配对、零失误、点亮灯笼，都会在这里留下一枚朱印。': ['Streaks, flawless rounds and lit gardens each leave a red seal here.', '連続でそろえる、ノーミス、庭を灯す。そのたびにここへ朱印がひとつ。'],
  '{}之月': ['{0}', '{0}の月'], '新': ['new', '新'], '收于 {}月{}日': ['found {0}/{1}', '{0}月{1}日に入手'], '本季已收集 {} / 12 张': ['{0} / 12 this season', 'この季節 {0} / 12 枚'],
  // ---- omamori book ----
  '御守帖': ['Charm Book', '御守帳'], '已收 {} / 12 种': ['{0} / 12 kinds', '{0} / 12 種'], '再收 {} 枚升为{}': ['{0} more to reach {1}', 'あと{0}体で{1}に'], '已满願': ['fulfilled', '満願'],
  '四十八枚御守徽章。配对一组花札，对应的徽章就会点亮；还没求得的只留一道剪影。同一枚收得越多，布面会绣上金线（3 枚），再织成「満願」（6 枚）。点开亮着的徽章，看看它保佑什么。': ['Forty-eight charm badges. Match a pair and its badge lights up; the rest are still silhouettes. Collect the same charm again and its cloth gains gold thread (3), then becomes Fulfilled (6). Tap a lit badge to see what it protects.', '四十八の御守のバッジ。花札をひと組そろえると、そのバッジが灯ります。まだのものは影だけ。同じ御守が増えると、布に金糸（3体）、やがて「満願」（6体）に。灯ったバッジをタップすると、ご利益が見られます。'],
  '御守 · {} · {}·': ['Charm · {0} · {1}', '御守 · {0} · {1}'], '保佑「{}」。得自花札「': ['For “{0}”. From the card “', 'ご利益は「{0}」。花札「'], '」。': ['”.', '」より。'], '已收下 {} 枚{}': ['{0} received{1}', '{0} 体{1}'],
  ' · 初次求得于 {}月{}日': [' · first found {0}/{1}', ' · {0}月{1}日に初めて'], '再配对 {} 次「': ['Match “', 'あと{0}回「'], '」，就能升为{}。': ['” {0} more time(s) to reach the next tier.', '」をそろえると次の段へ。'],
  '已经満願：愿望圆满，金线织满了整只御守。': ['Fulfilled: the wish is complete, gold thread covers the whole charm.', '満願。願いはかない、金糸が御守いっぱいに。'], '收好': ['Keep it', 'しまう'], '御守的成长': ['How a charm grows', '御守の育ち方'],
  '御守升级 · {}': ['Charm upgraded · {0}', '御守が育ちました · {0}'], '{} · 第 {} 枚': ['{0} · no. {1}', '{0} · {1} 体目'], '金线织满，愿望圆满': ['gold thread all over: wish fulfilled', '金糸に満ち、願いがかないました'], '布面绣上了金线': ['gold thread on the cloth', '布に金糸が入りました'],
  '初见 · 记入图鉴': ['New · added to the book', '初めて · 図鑑に記録'], '再会 · 御守 +1': ['Again · charm +1', 'ふたたび · 御守 +1'], '{} · 收下一枚{}': ['{0} · received: {1}', '{0} · {1}をひとつ'],
  '屏风上的「{}」着色了': ['“{0}” on the screen is in colour', '屏風の「{0}」に色がつきました'], '{}的四张花札都到齐了': ['all four cards of {0}', '{0}の四枚がそろいました'], '回主页看看「我的庭院」': ['see “My Garden” on the home screen', 'ホームの「わたしの庭」を見てみましょう'],
  // ---- credits & stats ----
  '素材致谢': ['Credits', '素材クレジット'], '开源素材': ['Open materials', 'オープン素材'],
  '游玩统计 · 只存在这台设备上': ['Play stats · kept on this device only', 'プレイ記録 · この端末にだけ保存'], '你在庭院里的足迹': ['Your steps in the gardens', '庭での足あと'],
  '共开局 {} 次。「平均」都按打完的局计算，步数只算通关局。': ['{0} rounds started. Averages count finished rounds; steps count cleared rounds only.', '開始 {0} 回。平均は終えた回、手数はクリアした回で計算しています。'],
  '庭院': ['Garden', '庭'], '开局': ['Played', '開始'], '通关': ['Cleared', 'クリア'], '失败': ['Lost', '失敗'], '通关率': ['Clear %', 'クリア率'], '均步数': ['Avg steps', '平均手数'], '均回看': ['Avg looks', '平均見直し'], '均翻错': ['Avg misses', '平均ミス'], '均用时': ['Avg time', '平均時間'],
  '新手演示：出现 {} 次，看完 {} 次，跳过 {} 次。': ['Tutorial: shown {0} times, finished {1}, skipped {2}.', 'チュートリアル：表示 {0} 回、最後まで {1} 回、スキップ {2} 回。'], '切换主题：{}。': ['Looks switched: {0}.', 'テーマ切り替え：{0}。'], '还没有切换过': ['none yet', 'まだありません'], '{} {} 次': ['{0} ×{1}', '{0} {1} 回'],
  '复制统计，发给开发者': ['Copy stats for the developer', '記録をコピーして開発者へ'], '已复制 ✓': ['Copied ✓', 'コピーしました ✓'], '已选中，长按复制': ['Selected — long-press to copy', '選択しました。長押しでコピー'],
  // ---- win / lose ----
  '一枚摺成': ['One print, pulled', '一枚摺りあがり'], '一卷读毕': ['One volume, read', '一巻読了'], '砂纹耙定': ['The sand is raked', '砂紋ととのう'], '月已满': ['The moon is full', '月満ちて'], '金屏成': ['The gold screen is done', '金屏風なる'],
  '一段画成': ['One scene, painted', '一段描きあがり'], '灯火通明': ['All lanterns lit', '灯火あかあか'], '盖上了这一站的印': ['Stamped at this stop', 'この駅のスタンプ'], '一曲终了': ['The song ends', '一曲おわり'], '本话完': ['End of chapter', '今回おわり'],
  '完美收工！': ['Nailed it!', '完璧！'], 'STAGE CLEAR!': ['STAGE CLEAR!', 'STAGE CLEAR!'], '墨色未足': ['Not enough ink', '墨色まだ浅く'], '书页还没读完': ['Pages left unread', 'まだ読みかけ'], '风乱了砂纹': ['The wind mussed the sand', '風が砂紋を乱した'],
  '云遮了月': ['Clouds over the moon', '雲が月を隠した'], '金箔还没贴满': ['The gold leaf isn’t finished', '金箔まだ貼りきれず'], '画卷还没画完': ['The scroll isn’t finished', '絵巻まだ途中'], '灯火将熄': ['The lanterns are going out', '灯が消えかけ'],
  '这一页还空着': ['This page is still blank', 'このページはまだ空白'], '今日打烊': ['Closed for today', '本日閉店'], '下回待续': ['To be continued', '次回につづく'], '再来一次！': ['One more time!', 'もう一回！'], 'GAME OVER': ['GAME OVER', 'GAME OVER'],
  '庭院点亮了': ['The garden is lit', '庭が灯りました'], '八处庭院，全部点亮': ['All eight gardens are lit', '八つの庭がすべて灯りました'], '凑成了「{}」': ['Made “{0}”', '「{0}」ができました'], '夜庭里，灯笼亮了': ['Lanterns lit in the night garden', '夜の庭に灯がともる'], '花合，圆满': ['Month Match complete', '花合わせ、満願'],
  '用了 {} 步，还剩 {} 步。': ['{0} steps used, {1} left.', '{0} 手で、残り {1} 手。'], '用了 {} 步（参考 {} 步）。': ['{0} steps (par {1}).', '{0} 手（目安 {1} 手）。'], '收下御守 {} 枚。': ['{0} charms received.', '御守を {0} 体いただきました。'],
  '凑成役：{}。': ['Sets made: {0}.', '役：{0}。'], '下一处庭院「{}」的灯，也亮了。': ['The lantern of the next garden, “{0}”, is lit too.', '次の庭「{0}」にも灯がともりました。'], '庭外的三种玩法也开放了：花合、夜庭、役之庭。': ['Three new ways to play are open beyond the gardens: Month Match, Night Garden, Yaku Garden.', '庭の外の三つの遊び方も開きました：花合わせ、夜の庭、役の庭。'],
  '本局新收进图鉴（{}）': ['New in the book this round ({0})', 'この回で図鑑に入った札（{0}）'], '前往 · {}': ['On to {0}', '{0}へ'], '再玩一次': ['Play again', 'もう一度'], '再来一局': ['Another round', 'もう一局'], '返回庭院': ['Back to the gardens', '庭へもどる'], '打开图鉴': ['Open the book', '図鑑を開く'],
  '步数用完了': ['Out of steps', '手数がなくなりました'], '步数用尽了。{}': ['Out of steps. {0}', '手数を使い切りました。{0}'], '步数用尽了。': ['Out of steps.', '手数を使い切りました。'],
  '配成 {} / {} 组。庭院还在，再来一次时，步数和回看都会恢复，牌也会重新洗过。': ['{0} / {1} pairs. The garden is still here — try again with fresh steps, looks and a new shuffle.', '{0} / {1} 組。庭はそのまま。もう一度なら手数も見直しも戻り、札も配り直します。'],
  '役札配成 {} / {} 组。庭院还在，再来一次时，步数和回看都会恢复，牌也会重新洗过。': ['Set cards {0} / {1}. The garden is still here — try again with fresh steps, looks and a new shuffle.', '役札 {0} / {1} 組。庭はそのまま。もう一度なら手数も見直しも戻り、札も配り直します。'],
  '这一局收下的花札与御守，已经记在图鉴里。': ['The cards and charms from this round are already in your book.', 'この回の花札と御守は、図鑑に記録済みです。'],
  '也可以回主页，换成「标准」或「悠闲」。': ['Or switch to Standard or Relaxed on the home screen.', 'ホームで「ふつう」か「のんびり」に替えることもできます。'], '想慢慢记，回主页换成「悠闲」，不计步数。': ['To take it slow, switch to Relaxed on the home screen — no step limit.', 'ゆっくり覚えたいなら、ホームで「のんびり」に。手数制限なし。'],
  '重试本关': ['Try again', 'もう一度挑戦'], '同一组牌': ['Same cards', '同じ札で'],
  // ---- in play ----
  '庭外 · {}': ['Beyond · {0}', '庭の外 · {0}'], '{} · 第{}庭': ['{0} · Garden {1}', '{0} · 第{1}の庭'], '{} · 第{}庭 · {}·': ['{0} · Garden {1} · {2}', '{0} · 第{1}の庭 · {2}'],
  '发牌中…': ['Dealing…', '配っています…'], '花火亮了，快看': ['Firework! Look now', '花火です、今のうちに'], '记住「{}」的牌：{}': ['Remember the cards for “{0}”: {1}', '「{0}」の札を覚えて：{1}'], '看一眼，记在心里': ['Take a look and remember', 'よく見て、覚えて'],
  '第 {} 张，{}': ['card {0}, {1}', '{0} 枚目、{1}'], '背面朝上': ['face down', '裏向き'], '已配对：{}': ['matched: {0}', 'そろった：{0}'],
  '剩余步数': ['Steps left', '残り手数'], '已用步数': ['Steps used', '使った手数'], '不限': ['no limit', '制限なし'], '已用 {}': ['used {0}', '使用 {0}'], '参考 {} 步': ['par {0}', '目安 {0} 手'],
  '役札 · {}': ['Set · {0}', '役札 · {0}'], '已配对': ['Pairs', 'そろった組'], '/ {} 组': ['/ {0}', '/ {0} 組'], '连续 {}': ['{0} in a row', '{0} 連続'],
  '重新看牌，本关还剩 {} 次，不消耗步数': ['Look again — {0} left this garden, costs no steps', 'もう一度見る。この庭であと {0} 回、手数は減りません'], '本关的重新看牌已用完': ['No more looks in this garden', 'この庭の見直しは使い切りました'],
  '还剩 {} 步，不急': ['{0} steps left — no rush', 'あと {0} 手、あわてずに'], '凑「{}」：还差 {}': ['For “{0}” you still need {1}', '「{0}」まで：あと {1}'], '同一个月的两张就是一对': ['Two cards of the same month make a pair', '同じ月の二枚でひと組'],
  '翻开两张，找出成对的花札': ['Turn over two cards to find a pair', '二枚めくって、同じ札を探そう'], '再翻一张': ['One more', 'もう一枚'], '连续配对 {} 组': ['{0} pairs in a row', '{0} 組連続'],
  '不是一对，记下它们 · 点任意处继续': ['Not a pair — remember them · tap anywhere', 'ちがう組。覚えておいて · どこかをタップ'], '花信 · 多给一步': ['Blossom news · +1 step', '花信 · 一手増えます'], '花信': ['Blossom news', '花信'],
  '风来 · 多一次回看': ['A breeze · +1 look', '風来 · 見直し +1'], '花吹雪': ['Blossom storm', '花吹雪'], '凑成役': ['Set made', '役ができました'], '四十八张，都在这里了': ['All forty-eight are here', '四十八枚、ここにそろいました'],
  '又一枚花火': ['Another firework', 'もう一発の花火'], '再看一眼，步数不变': ['Another look — steps unchanged', 'もう一度見る、手数はそのまま'], '庭院已整理完毕': ['The garden is in order', '庭がととのいました'],
  '记住花札的位置': ['Remember where the cards are', '札の場所を覚えよう'], '重新看牌': ['Look again', 'もう一度見る'], '重来': ['Restart', 'やり直す'], '选牌 ·': ['choose ·', '札を選ぶ ·'], '空格': ['Space', 'スペース'], '翻开 ·': ['flip ·', 'めくる ·'], '再看一眼': ['look again', 'もう一度見る'],
  // ---- tutorial ----
  '练习庭': ['Practice Garden', '練習の庭'], '跳过': ['Skip', 'スキップ'], '{} / 4 · {}': ['{0} / 4 · {1}', '{0} / 4 · {1}'], '看牌': ['Look', '見る'], '翻牌': ['Flip', 'めくる'], '回看': ['Look again', '見直す'], '完成': ['Done', '完了'],
  '开局时，牌会亮几秒。记住它们的位置。': ['At the start the cards show for a few seconds. Remember where they are.', '始まりに札が数秒見えます。場所を覚えましょう。'],
  '现在翻开两张。每翻两张，算一步。': ['Now turn over two. Every two cards is one step.', '二枚めくってみましょう。二枚で一手です。'], '先点下面闪动的「重新看牌」。': ['First tap the glowing “Look again” below.', 'まず下の光っている「もう一度見る」をタップ。'],
  '再翻一张。': ['One more.', 'もう一枚。'], '配对成功！图案相同的两张会留下。': ['A pair! Matching cards stay face up.', 'そろいました！同じ絵の二枚は残ります。'], '再找出最后一对。': ['Now find the last pair.', '最後の一組を探しましょう。'],
  '不是一对，它们会自动盖回。点任意处继续。': ['Not a pair; they turn back over. Tap anywhere to go on.', 'ちがう組なので、裏に戻ります。どこかをタップして続けます。'], '再试一次，想想刚才看到的位置。': ['Try again — think where you saw them.', 'もう一度。さっき見た場所を思い出して。'],
  '记不清的时候，点「重新看牌」。它不耗步数，每处庭院可以用一到两次。': ['If you forget, tap “Look again”. It costs no steps; each garden gives you one or two.', '思い出せないときは「もう一度見る」。手数は減らず、各庭で一、二回使えます。'],
  '看清了吗？': ['Got it?', '見えましたか？'], '接着，把剩下的牌配完。': ['Now match the rest.', 'では、残りをそろえましょう。'], '开始第{}庭「{}」': ['Start Garden {0} “{1}”', '第{0}の庭「{1}」をはじめる'], '回到庭院': ['Back to the gardens', '庭へもどる'],
  '就这么简单': ['That’s all there is to it', 'これだけです'], '在': ['Match every card', ''], '步数用尽前': [' before the steps run out', '手数がなくなる前に'], '配完全部牌，就点亮这处庭院。': [' and the garden lights up.', 'すべての札をそろえると、庭が灯ります。'],
  '第一次翻出的花札，会收进': ['Each new card goes into the', '初めてめくった花札は'], '，并得到一枚': [', and you receive a', 'に入り、'], '连续配对': ['Pairs in a row', '連続でそろえると'], '会盖下朱印，还会多给一步或一次回看。': [' earn a red seal, plus an extra step or look.', '朱印が押され、一手か見直しが増えます。'], '开始': ['Start', 'はじめる'],
  // ---- settings & resets ----
  '设置': ['Settings', '設定'], '主题': ['Look', 'テーマ'], '图鉴': ['Book', '図鑑'], '卡面': ['Cards', '札の絵柄'], '难度': ['Difficulty', '難しさ'], '声音': ['Sound', 'サウンド'], '其他': ['More', 'その他'], '语言': ['Language', '言語'],
  '套牌面，图像原样显示。切换主题时会换成推荐卡面，自己选过之后就不再自动更换。': [' decks, shown exactly as drawn. Switching looks picks the matching deck until you choose one yourself.', '組の絵柄。絵はそのまま表示します。テーマを替えるとおすすめの絵柄になります（自分で選ぶとそのまま）。'],
  '音效': ['Sound effects', '効果音'], '翻牌、配对与通关的声音': ['flips, pairs and clears', 'めくる・そろう・クリアの音'], '背景乐': ['Music', 'BGM'], '每个主题一组乐器，季节决定音阶': ['each look has its own instruments; the season sets the scale', 'テーマごとの楽器。音階は季節で変わります'],
  '庭院环境音': ['Garden ambience', '庭の環境音'], '流水、鹿威し，以及黄莺、风铃、铃虫或寺钟': ['running water, a shishi-odoshi, and warblers, wind chimes, crickets or a temple bell', '水音、鹿威し、そして鶯・風鈴・鈴虫・寺の鐘'],
  '音乐音量': ['Music volume', 'BGM の音量'], '背景乐与环境音': ['music and ambience', 'BGM と環境音'], '音效音量': ['Effects volume', '効果音の音量'], '翻牌、配对与通关': ['flips, pairs and clears', 'めくる・そろう・クリア'],
  '触感震动': ['Haptics', '振動'], '配对、失手与通关时轻轻一震': ['a light buzz on pairs, misses and clears', 'そろう・はずす・クリアのときに軽く振動'], '声音检测': ['Sound check', 'サウンドチェック'],
  '听不到声音时点一下，会播放一段测试音并显示音频状态。': ['If you hear nothing, tap to play a test phrase and see the audio status.', '音が出ないときにタップすると、テスト音を鳴らして状態を表示します。'],
  '再看一遍新手演示': ['Replay the tutorial', 'チュートリアルをもう一度'], '游玩统计': ['Play stats', 'プレイ記録'], '查看统计': ['View stats', '記録を見る'],
  '记录每处庭院的开局、通关、步数、回看和用时，只存在这台设备上。做试玩时可以一键复制发给开发者。': ['Rounds, clears, steps, looks and time for each garden, kept on this device. Handy to send to the developer during playtests.', '庭ごとの開始・クリア・手数・見直し・時間を、この端末だけに記録します。テストプレイ時は開発者へコピーして送れます。'],
  '从头再来': ['Start over', '最初から'], '清除花札图鉴、御守、朱印、通关记录和游玩统计，新手演示也会重新出现。主题、卡面、难度和声音设置会保留。': ['Clears the card book, charms, seals, records and stats; the tutorial comes back. Look, deck, difficulty and sound settings stay.', '図鑑・御守・朱印・クリア記録・プレイ記録を消去し、チュートリアルも再表示します。テーマ・絵柄・難しさ・サウンド設定は残ります。'],
  '清除全部进度': ['Clear all progress', 'すべての進行を消去'], '清除全部进度？': ['Clear all progress?', 'すべての進行を消去しますか？'],
  '已收集的 {} 张花札、{} 枚御守、{} 枚朱印、所有庭院的通关记录和游玩统计都会清空，无法恢复。': ['Your {0} cards, {1} charms, {2} seals, every garden record and your stats will be erased. This can’t be undone.', '集めた花札 {0} 枚、御守 {1} 体、朱印 {2} 個、すべての庭の記録とプレイ記録が消え、元に戻せません。'],
  '主题、卡面、难度和声音设置会保留。': ['Look, deck, difficulty and sound settings stay.', 'テーマ・絵柄・難しさ・サウンド設定は残ります。'], '清除，从初音重新开始': ['Clear and begin again at “First Song”', '消去して「初音」から'], '先不了': ['Not now', 'やめておく'],
  '清空记录': ['Erase records', '記録を消す'], '清空这台浏览器里的全部游戏记录？': ['Erase every game record in this browser?', 'このブラウザのゲーム記録をすべて消しますか？'],
  '包括图鉴、御守、朱印、所有庭院的通关记录和游玩统计，以及主题、卡面、难度和声音设置。{}': ['This includes the card book, charms, seals, every record and stats, and your look, deck, difficulty and sound settings. {0}', '図鑑・御守・朱印・すべての記録とプレイ記録、それにテーマ・絵柄・難しさ・サウンド設定も含みます。{0}'],
  '账号里同步的进度也会一起清空。': ['Progress synced to your account is erased too.', 'アカウントに同期した進行も消えます。'], '清空后页面会刷新，回到第一次打开时的样子，无法恢复。': ['The page then reloads as if opened for the first time. This can’t be undone.', '消去後ページを再読み込みし、初めて開いた状態に戻ります。元に戻せません。'],
  '清空并刷新': ['Erase and reload', '消して再読み込み'], '已清空': ['Cleared', '消去しました'], '庭院回到了早春': ['The gardens are back to early spring', '庭は早春に戻りました'], '从第一庭「初音」重新开始': ['Begin again at Garden 1 “First Song”', '第一の庭「初音」から'],
  // ---- sound check ----
  '运行中': ['running', '動作中'], '已暂停（需要再点一下）': ['suspended (tap once more)', '一時停止（もう一度タップ）'], '已关闭': ['closed', '停止'], '被系统打断': ['interrupted by the system', 'システムに中断されました'], '未创建': ['not created', '未作成'],
  'Tone.js 音色': ['Tone.js instruments', 'Tone.js 音源'], '简易合成': ['simple synth', '簡易シンセ'], '尚未启动': ['not started', '未起動'], '已加载': ['loaded', '読み込み済み'], '加载中或失败': ['loading or failed', '読み込み中または失敗'],
  '正在播放测试音…': ['Playing a test sound…', 'テスト音を再生中…'], '开': ['on', 'オン'], '其他系统': ['other system', 'その他のOS'],
  // ---- markup labels ----
  '主要导航': ['Main navigation', 'メインナビゲーション'], '切换主题': ['Switch look', 'テーマを切り替え'], '对局': ['Game', '対局'], '打开图鉴': ['Open the book', '図鑑を開く'], '跳过演示': ['Skip tutorial', 'チュートリアルをスキップ'], '返回庭院 ': ['Back to the gardens', '庭へもどる'],
  '1 / 4 · 看牌': ['1 / 4 · Look', '1 / 4 · 見る'], '春 · 第一庭': ['Spring · Garden 1', '春 · 第一の庭'], '已用 0': ['used 0', '使用 0'], '/ 4 组': ['/ 4', '/ 4 組'], '中文': ['中文', '中文'], '已成': ['done', '達成'],
  '松': ['Pine', '松'], '梅': ['Plum', '梅'], '桜': ['Cherry', '桜'], '藤': ['Wisteria', '藤'], '菖蒲': ['Iris', '菖蒲'], '牡丹': ['Peony', '牡丹'], '萩': ['Bush clover', '萩'], '芒': ['Pampas', '芒'], '菊': ['Chrysanthemum', '菊'], '紅葉': ['Maple', '紅葉'], '柳': ['Willow', '柳'], '桐': ['Paulownia', '桐'],
  '第{}庭 {}': ['Garden {0} {1}', '第{0}の庭 {1}'], '{}第{}庭 {}': ['{0} Garden {1} {2}', '{0} 第{1}の庭 {2}'], '第{}庭 {}，未解锁': ['Garden {0} {1}, locked', '第{0}の庭 {1}（未開放）'], '第{}庭 {}，已通关': ['Garden {0} {1}, cleared', '第{0}の庭 {1}（クリア済み）'],
  '庭院文库': ['Garden Library', '庭の文庫'], '好评连载中': ['NOW SERIALISED', '好評連載中'], '旅行记': ['travel notes', '旅日記'], '{}月{}日 · 旅行记': ['{0}/{1} · travel notes', '{0}月{1}日 · 旅日記'], '跟随系统': ['Follow the system', 'システムに合わせる'], 'English': ['English', 'English'], '日本語': ['日本語', '日本語']
});
Object.assign(I18N.dict, {
  '{} × {}': ['{0} × {1}', '{0} × {1}'], '寓意': ['Meaning', '意味'], '在庭院里翻出这张花札，就会记入图鉴。': ['Turn this card up in a garden to add it to the book.', '庭でこの札をめくると、図鑑に記録されます。'],
  '第{}段': ['Scene {0}', '第{0}段'], '{}第{}段 {}': ['{0} Scene {1} {2}', '{0} 第{1}段 {2}'], '{} 组': ['{0} pairs', '{0} 組'], '{} 步': ['{0} steps', '{0} 手'], '第{}庭': ['Garden {0}', '第{0}の庭'],
  '完結': ['Complete', '完結'], '再読': ['Reread', '再読'], '最新話': ['Latest chapter', '最新話'], '{} ▶': ['{0} ▶', '{0} ▶'], '再逛一次': ['Again', 'もう一度'], '参加': ['Join', '参加'], 'NEXT! {}': ['NEXT! {0}', 'NEXT! {0}'],
  '已收下 {}': ['{0} received', '{0} 体'], '{}，{}，已收 {}': ['{0}, {1}, {2}', '{0}、{1}、{2}'], '未求得的御守': ['Charm not yet found', 'まだの御守'], '已收 {} 枚': ['{0} received', '{0} 体'],
  '《鸟兽人物戏画》甲卷：青蛙与兔子相扑': ['Frolicking Animals, scroll A: frogs and rabbits wrestling', '『鳥獣人物戯画』甲巻：蛙と兎の相撲'],
  '春夜 · {}': ['Spring night · {0}', '春の夜 · {0}'], '夏夜 · {}': ['Summer night · {0}', '夏の夜 · {0}'], '秋夜 · {}': ['Autumn night · {0}', '秋の夜 · {0}'], '冬夜 · {}': ['Winter night · {0}', '冬の夜 · {0}'],
  '{} 的分享海报': ['Share poster: {0}', '{0} のシェア用ポスター'], '{}《{}》（{}），{}': ['{0}, {1} ({2}), {3}', '{0}『{1}』（{2}）、{3}'], '{}《{}》': ['{0}, {1}', '{0}『{1}』'],
  '竹久梦二 乐谱封面《{}》': ['Takehisa Yumeji, sheet-music cover “{0}”', '竹久夢二 楽譜表紙『{0}』'], '杜若': ['Rabbit-ear iris', '杜若'], '蘭': ['Orchid', '蘭'], '朝顔': ['Morning glory', '朝顔'], '北斋的草花小稿': ['Hokusai’s flower sketches', '北斎の草花スケッチ'],
  '月冈芳年《月百姿》「{}」': ['Tsukioka Yoshitoshi, One Hundred Aspects of the Moon: “{0}”', '月岡芳年『月百姿』「{0}」'], '— {}': ['— {0}', '— {0}'], '歌川广重《名所江户百景 · {}》': ['Utagawa Hiroshige, One Hundred Famous Views of Edo · {0}', '歌川広重『名所江戸百景 · {0}』'],
  '翻开 · {}　{}': ['Open · {0}  {1}', 'ひらく · {0}　{1}'], '{}收下御守 {} 枚。{}': ['{0} {1} charms received.{2}', '{0}御守を {1} 体いただきました。{2}'], '获得 {} 朵花': ['{0} flowers', '花 {0} 輪'],
  '<br>凑成役：{}。': ['<br>Sets made: {0}.', '<br>役：{0}。'],
  // ---- credits ----
  '花札「彩绘」「墨染」「朱缘」': ['Cards “Painted”, “Sumi”, “Vermilion”', '花札「彩絵」「墨染」「朱縁」'], '：Louie Mantia 绘制，后两套另有すけじょ参与；来自': [': drawn by Louie Mantia (the last two with すけじょ); from', '：Louie Mantia 作（後の二組は すけじょ も参加）。出典'],
  '，未作修改。': [', unmodified.', '、改変なし。'], '花札「花图」': ['Cards “Hwatu”', '花札「花闘」'], '：韩式 Hwatu，Marcus Richert 以 Louie Mantia 的花札为基础制作，Spenĉjo 整理上传；': [': Korean hwatu by Marcus Richert after Louie Mantia’s cards, uploaded by Spenĉjo;', '：韓国式 Hwatu。Marcus Richert が Louie Mantia の花札をもとに制作、Spenĉjo がアップロード。'],
  '，CC BY-SA 4.0，未作修改。': [', CC BY-SA 4.0, unmodified.', '、CC BY-SA 4.0、改変なし。'], '花札「墨绘」「剪纸」「网点」与御守': ['Cards “Ink Wash”, “Paper Cut”, “Screentone” and the charms', '花札「墨絵」「切り絵」「網点」と御守'],
  '：本作原创，由程序绘制；御守花纹取自传统和柄。': [': original to this game, drawn in code; the charm cloth patterns are traditional Japanese motifs.', '：本作オリジナル、プログラムで描画。御守の柄は伝統的な和柄。'],
  '我的庭院 · 十二月花屏风': ['My Garden · Twelve-Month Screen', 'わたしの庭 · 十二か月花屏風'], '，均为公有领域作品，图像来自大都会艺术博物馆开放馆藏（CC0），仅裁切取景。': ['; all public domain, images from The Met Open Access (CC0), cropped only.', '。いずれもパブリックドメイン、画像はメトロポリタン美術館オープンアクセス（CC0）、トリミングのみ。'],
  '月白风清 · 金碧琳琅 · 墨戏山野 · 洋灯旧梦': ['Moonlit Breeze · Gold and Azure · Ink Frolics · Gaslight Café', '月白風清 · 金碧琳琅 · 墨戯山野 · 洋灯の夢'],
  '：月冈芳年《月百姿》（1885–92）中的四幅；酒井抱一《樱枫图》、尾形光琳《八桥图》（大都会艺术博物馆，CC0）、铃木其一《夏秋溪流图》、尾形光琳《红白梅图》；《鸟兽人物戏画》甲卷（12 世纪，高山寺藏）；竹久梦二为セノオ乐谱所作封面四幅（1917–24）。均为公有领域，图像经': [': four prints from Tsukioka Yoshitoshi’s One Hundred Aspects of the Moon (1885–92); Sakai Hōitsu, Cherry and Maple Trees, and Ogata Kōrin, Irises at Yatsuhashi (The Met, CC0); Suzuki Kiitsu, Mountain Stream in Summer and Autumn; Ogata Kōrin, Red and White Plum Blossoms; Frolicking Animals, scroll A (12th c., Kōzan-ji); four sheet-music covers by Takehisa Yumeji for Senoo (1917–24). All public domain, images via', '：月岡芳年『月百姿』（1885–92）より四図、酒井抱一「桜楓図」、尾形光琳「八橋図」（メトロポリタン美術館、CC0）、鈴木其一「夏秋渓流図」、尾形光琳「紅白梅図」、『鳥獣人物戯画』甲巻（12世紀、高山寺蔵）、竹久夢二のセノオ楽譜表紙四点（1917–24）。いずれもパブリックドメイン、画像は'],
  '取得，仅缩放、裁切；绘卷转成墨色以统一纸色。': [', resized and cropped only; the scroll is toned to ink to match the paper.', 'より。縮小とトリミングのみ、絵巻は紙の色に合わせて墨色に調整。'], '像素字体': ['Pixel font', 'ドットフォント'],
  '（12px，SIL OFL 1.1），只保留本作用到的字；DotGothic16（SIL OFL 1.1，Google Fonts）。': [' (12 px, SIL OFL 1.1), subset to the characters used; DotGothic16 (SIL OFL 1.1, Google Fonts).', '（12px、SIL OFL 1.1）、使う文字だけに絞り込み。DotGothic16（SIL OFL 1.1、Google Fonts）。'],
  '卡背': ['Card backs', '札の裏'], '：江户至明治时期的染布型纸（katagami），': [': Edo–Meiji textile dyeing stencils (katagami),', '：江戸〜明治の染め型紙、'], '大都会艺术博物馆开放馆藏': ['The Met Open Access', 'メトロポリタン美術館オープンアクセス'],
  '。裁取花纹部分，镂空处透出底色；部分主题把柿涩纸染成主题色。墨戏山野的卡背是《鸟兽戏画》里欢呼的青蛙，电光游园的卡背为本作原创像素画。': ['. The pattern is cropped and the cut-outs show the colour beneath; some looks tint the persimmon paper. Ink Frolics uses the cheering frog from the Frolicking Animals scroll; Neon Arcade’s back is original pixel art.', '。柄の部分を切り出し、彫り抜きから地色がのぞきます。テーマによっては柿渋紙を染めています。墨戯山野の裏は『鳥獣戯画』の喜ぶ蛙、電光遊園の裏は本作オリジナルのドット絵。'],
  '菊菱': ['Chrysanthemum lozenges', '菊菱'], '麻の葉': ['Hemp leaf', '麻の葉'], '杉綾と波': ['Herringbone and waves', '杉綾と波'], '菊菱に紗綾形': ['Chrysanthemum lozenges on key fret', '菊菱に紗綾形'], '梅散らし': ['Scattered plum', '梅散らし'], '矢筈': ['Arrow feathers', '矢筈'], '草花': ['Flowers and grasses', '草花'], '紗綾形': ['Key fret', '紗綾形'], '八角繋ぎ': ['Linked octagons', '八角繋ぎ'],
  '主页插图': ['Home artwork', 'ホームの絵'], '：神坂雪佳《百々世草》（1909–10）、葛饰北斋《北斋漫画》、歌川广重《名所江户百景》中的「两国花火」「龟户梅屋敷」「大桥阿宅骤雨」「月之岬」「浅草金龙山」（1856–58），均为公有领域作品，图像来自': [': Kamisaka Sekka, A World of Things (1909–10); Katsushika Hokusai, Hokusai Manga; Utagawa Hiroshige, One Hundred Famous Views of Edo — Fireworks at Ryōgoku, Plum Garden at Kameido, Sudden Shower over Ōhashi, Moon Viewing Point, Kinryūzan Temple at Asakusa (1856–58). All public domain, images from the', '：神坂雪佳『百々世草』（1909–10）、葛飾北斎『北斎漫画』、歌川広重『名所江戸百景』より「両国花火」「亀戸梅屋舗」「大はしあたけの夕立」「月の岬」「浅草金龍山」（1856–58）。いずれもパブリックドメイン、画像は'],
  '芝加哥艺术博物馆开放馆藏': ['Art Institute of Chicago Open Access', 'シカゴ美術館オープンアクセス'], '（CC0），仅缩放、裁切取景。纸纹：': [' (CC0), resized and cropped only. Paper texture:', '（CC0）、縮小とトリミングのみ。紙の質感：'],
  '纸牌音效': ['Card sounds', 'カードの効果音'], '琴声、风铃、尺八与环境音': ['Koto, wind chimes, shakuhachi and ambience', '琴・風鈴・尺八・環境音'], '（MIT）实时合成。': [' (MIT), synthesised live.', '（MIT）でリアルタイム合成。'], '落花特效': ['Falling petals', '花びらの演出'], '字体': ['Fonts', 'フォント'],
  '：每个主题两到三种。日文显示字体 Shippori Mincho B1、Zen Old Mincho、Shippori Mincho、Kaisei Decol、Klee One、Yusei Magic、Zen Antique、Hina Mincho、Kaisei Tokumin、Yuji Boku、Shippori Antique B1、DotGothic16；中文 Noto Serif SC、Noto Sans SC；点缀用 Yuji Syuku（石庭标题）、ZCOOL XiaoWei（和纸标题）、ZCOOL KuaiLe（手账标题），均为 SIL OFL 1.1，经 Google Fonts 提供。': [': two or three per look. Japanese display faces Shippori Mincho B1, Zen Old Mincho, Shippori Mincho, Kaisei Decol, Klee One, Yusei Magic, Zen Antique, Hina Mincho, Kaisei Tokumin, Yuji Boku, Shippori Antique B1, DotGothic16; Latin faces Cormorant Garamond, Source Serif 4, Inter, IM Fell English, Fraunces, Caveat, Poiret One, Bangers, Baloo 2, Silkscreen; Chinese Noto Serif SC and Noto Sans SC. All SIL OFL 1.1 via Google Fonts.', '：テーマごとに二〜三種。和文の見出し書体 Shippori Mincho B1、Zen Old Mincho、Shippori Mincho、Kaisei Decol、Klee One、Yusei Magic、Zen Antique、Hina Mincho、Kaisei Tokumin、Yuji Boku、Shippori Antique B1、DotGothic16、本文 Shippori Mincho・Zen Kaku Gothic New。いずれも SIL OFL 1.1、Google Fonts 経由。'],
  '包括图鉴、御守、朱印、所有庭院的通关记录和游玩统计，以及主题、卡面、难度和声音设置。': ['This includes the card book, charms, seals, every record and stats, and your look, deck, difficulty and sound settings.', '図鑑・御守・朱印・すべての記録とプレイ記録、それにテーマ・絵柄・難しさ・サウンド設定も含みます。'],
  '旅行记': ['travel notes', '旅日記'], '{}「{}」': ['{0} “{1}”', '{0}「{1}」'], '歌川広重': ['Utagawa Hiroshige', '歌川広重'], '松村景文': ['Matsumura Keibun', '松村景文'], '窪俊満': ['Kubo Shunman', '窪俊満'], '礒田湖龍斎': ['Isoda Koryūsai', '礒田湖龍斎']
});
(function () {
  'use strict';
  var IDX = {en: 0, ja: 1}, exact = null, patterns = null;
  // Latin faces per look for English (the look's Japanese face stays behind them for Japanese words), Japanese faces for Japanese.
  var EN_FACES = {
    ukiyo: ['"Cormorant Garamond"', '"Source Serif 4"'], washi: ['"Cormorant Garamond"', '"Source Serif 4"'], kare: ['"Cormorant Garamond"', '"Source Serif 4"'],
    tsuki: ['"Cormorant Garamond"', '"Source Serif 4"'], rinpa: ['"Cormorant Garamond"', '"Source Serif 4"'], giga: ['"IM Fell English"', '"Source Serif 4"'],
    matsuri: ['"Fraunces"', '"Inter"'], techo: ['"Caveat"', '"Inter"'], taisho: ['"Poiret One"', '"Source Serif 4"'],
    manga: ['"Bangers"', '"Inter"'], youth: ['"Baloo 2"', '"Inter"'], pixel: ['"Silkscreen"', '"Inter"']
  };
  var JP_STACK = {
    ukiyo: '"Shippori Mincho B1"', washi: '"Zen Old Mincho"', kare: '"Shippori Mincho"', tsuki: '"Hina Mincho"', rinpa: '"Kaisei Tokumin"', giga: '"Yuji Boku"',
    matsuri: '"Kaisei Decol"', techo: '"Klee One"', taisho: '"Shippori Antique B1"', manga: '"Zen Antique"', youth: '"Yusei Magic"', pixel: '"DotGothic16","Fusion Pixel"'
  };
  var SANS = {matsuri: 1, techo: 1, youth: 1, pixel: 1, manga: 0};
  var FONT_URL = {
    en: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Inter:wght@400;600;700&family=IM+Fell+English&family=Fraunces:opsz,wght@9..144,600&family=Caveat:wght@600&family=Poiret+One&family=Bangers&family=Baloo+2:wght@600;800&family=Silkscreen&display=swap',
    ja: 'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;700&family=Shippori+Mincho:wght@500;700&display=swap'
  };
  function compile() {
    exact = {}; patterns = [];
    Object.keys(I18N.dict).forEach(function (k) {
      if (k.indexOf('{}') < 0) { exact[k] = I18N.dict[k]; return; }
      var parts = k.split('{}').map(function (p) { return p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
      patterns.push({re: new RegExp('^' + parts.join('([\\s\\S]*?)') + '$'), v: I18N.dict[k], weight: k.replace(/\{\}/g, '').length});
    });
    patterns.sort(function (a, b) { return b.weight - a.weight; });
  }
  // Cards: names, meanings, charms and descriptions come keyed by id; turn them into Chinese-keyed entries.
  I18N.registerCards = function (motifs) {
    motifs.forEach(function (m) {
      var en = I18N.cards.en[m.id], ja = I18N.cards.ja[m.id]; if (!en || !ja) return;
      var add = function (zh, e, j) { if (!zh || I18N.dict[zh]) return; I18N.dict[zh] = [e, j]; };
      add(m.cn, en[0], '');   // Japanese shows the card's own name, so its Chinese gloss is dropped
      add(m.mean, en[1], ja[0]); add(m.om, en[2], ja[1]); add(m.desc, en[3], ja[2]);
    });
    exact = null;
  };
  var CJK = /[぀-ヿ㐀-鿿]/;
  function tr(s, lang, depth) {
    if (!s || !CJK.test(s) || depth > 4) return s;
    if (!exact) compile();
    var i = IDX[lang], lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0], core = s.trim();
    var hit = exact[core];
    if (hit && hit[i] != null) return lead + hit[i] + trail;
    for (var k = 0; k < patterns.length; k++) {
      var m = patterns[k].re.exec(core); if (!m) continue;
      var out = patterns[k].v[i]; if (out == null) break;
      var caps = m.slice(1).map(function (c) { return tr(c, lang, depth + 1); });
      return lead + out.replace(/\{(\d)\}/g, function (_, n) { return caps[+n] != null ? caps[+n] : ''; }) + trail;
    }
    if (/^· /.test(core)) { var rest = tr(core.slice(2), lang, depth + 1); return rest ? lead + '· ' + rest + trail : ''; }
    if (/ ·$/.test(core)) return lead + tr(core.slice(0, -2), lang, depth + 1) + ' ·' + trail;
    // pieces joined by " · ", full-width spaces or the Chinese list comma
    var seps = [' · ', '　', '、', ' '];
    for (var q = 0; q < seps.length; q++) if (core.indexOf(seps[q]) >= 0) {
      var bits = core.split(seps[q]), changed = false;
      bits = bits.map(function (b) { var t = b ? tr(b, lang, depth + 1) : b; if (t !== b) changed = true; return t; }).filter(function (b, j) { return b !== '' || core.split(seps[q])[j] === ''; });
      if (changed) return lead + bits.join(lang === 'en' && seps[q] !== ' · ' ? (seps[q] === '、' ? ', ' : '  ') : seps[q]) + trail;
    }
    return s;
  }
  I18N.t = function (s, lang) { return lang && lang !== 'zh' ? tr(String(s), lang, 0) : s; };

  // ---- the page: translate what is on screen now and whatever appears later ----
  var LANG = 'zh', src = new WeakMap(), attrDone = new WeakMap(), ATTRS = ['aria-label', 'alt', 'title', 'placeholder'];
  function skip(el) { return !el || el.closest('[translate="no"],svg,script,style,textarea,canvas'); }
  function doText(n) {
    if (skip(n.parentElement)) return;
    var cur = n.data, done = src.get(n);
    if (done && done.out === cur) return;
    if (!CJK.test(cur)) return;
    var out = tr(cur, LANG, 0);
    src.set(n, {out: out});
    if (out !== cur) n.data = out;
  }
  function doAttrs(el) {
    if (skip(el)) return;
    // remember what each attribute was turned into: a Japanese result still contains kanji and must not be translated again
    var done = attrDone.get(el) || {};
    ATTRS.forEach(function (a) {
      var v = el.getAttribute(a); if (!v || !CJK.test(v) || done[a] === v) return;
      var o = tr(v, LANG, 0); done[a] = o; if (o !== v) el.setAttribute(a, o);
    });
    attrDone.set(el, done);
  }
  function walk(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1 || skip(root)) return;
    doAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT), n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
  }
  I18N.start = function (lang, look) {
    LANG = lang;
    var root = document.documentElement;
    root.lang = lang === 'ja' ? 'ja' : 'en'; root.dataset.lang = lang;
    var link = document.createElement('link'); link.rel = 'stylesheet'; link.href = FONT_URL[lang]; document.head.appendChild(link);
    var css = '';
    Object.keys(JP_STACK).forEach(function (k) {
      if (lang === 'en') {
        var f = EN_FACES[k];
        css += ':root[data-lang="en"][data-look="' + k + '"]{--f-head:' + f[0] + ',' + f[1] + ',serif;--f-body:' + f[1] + ',' + (SANS[k] ? 'system-ui,sans-serif' : 'Georgia,serif') + ';--f-jp:' + f[0] + ',' + JP_STACK[k] + ',serif}\n';
      } else {
        var body = SANS[k] ? '"Zen Kaku Gothic New","Hiragino Sans",sans-serif' : '"Shippori Mincho","Hiragino Mincho ProN","Yu Mincho",serif';
        css += ':root[data-lang="ja"][data-look="' + k + '"]{--f-head:' + body + ';--f-body:' + body + '}\n';
      }
    });
    if (lang === 'en') css += ':root[data-lang="en"] .jp{font-feature-settings:normal}\n'
      + ':root[data-lang="en"] [class^="hv-"] h1::after{content:"Hana Awase";display:block;margin-top:.35em;font:600 .3em/1.1 var(--f-head);letter-spacing:.24em;text-transform:uppercase;writing-mode:horizontal-tb;-webkit-text-stroke:0;text-shadow:none}\n';
    else css += ':root[data-lang="ja"] [class^="hv-"] h1::after{content:"花合わせ帖";display:block;margin-top:.35em;font-size:.3em;letter-spacing:.3em;writing-mode:horizontal-tb;-webkit-text-stroke:0;text-shadow:none}\n';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    walk(document.body);
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        if (m.type === 'characterData') doText(m.target);
        else if (m.type === 'attributes') doAttrs(m.target);
        else m.addedNodes.forEach(walk);
      });
    }).observe(document.body, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS});
  };
})();
