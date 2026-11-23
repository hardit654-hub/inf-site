#!/usr/bin/env python3
"""Собирает красивую копию программы поездки для просмотра и скачивания.
Исходник (у школы) — ~/Downloads/Программа_март_6_дней_масленица_2027.docx.
Скрипт делает site/forms/programma-maslenica-2027.docx с сохранением правок из документа.
Запуск: python3 tools/make_programma_docx.py
"""
import zipfile, os

OUT = os.path.join(os.path.dirname(__file__), '..', 'site', 'forms', 'programma-maslenica-2027.docx')
DOCX = os.path.join(os.path.dirname(__file__), 'programma-src.docx')

def esc(s):
    return (s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))

def p(text, style=None, **opts):
    attrs = ''
    if style: attrs += f' <w:pPr><w:pStyle w:val="{style}"/></w:pPr>'
    return f'<w:p{attrs}><w:r><w:t xml:space="preserve">{esc(text)}</w:t></w:r></w:p>'

def heading(text, level=1):
    style = {1: 'Heading1', 2: 'Heading2', 3: 'Heading3'}[level]
    return p(text, style)

def para(text):
    runs = []
    for chunk in text.split('\n'):
        runs.append(f'<w:r><w:t xml:space="preserve">{esc(chunk)}</w:t></w:r>')
    return f'<w:p>{"".join(runs)}</w:p>'

def bullet(text, level=0):
    ind = f'<w:pPr><w:numPr><w:ilvl w:val="{level}"/><w:numId w:val="1"/></w:numPr></w:pPr>'
    return f'<w:p>{ind}<w:r><w:t xml:space="preserve">{esc(text)}</w:t></w:r></w:p>'

def table(rows, header=True):
    out = ['<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblStyle w:val="TableGrid"/><w:tblW w:w="5000" w:type="pct"/></w:tblPr>']
    for i, row in enumerate(rows):
        out.append('<w:tr>')
        for cell in row:
            style = 'TableHeader' if header and i == 0 else ''
            sp = f'<w:pPr><w:pStyle w:val="{style}"/></w:pPr>' if style else ''
            out.append(f'<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr><w:p>{sp}<w:r><w:t xml:space="preserve">{esc(cell)}</w:t></w:r></w:p></w:tc>')
        out.append('</w:tr>')
    out.append('</w:tbl>')
    return ''.join(out)

BODY = [
    heading('Зимняя образовательная практика: «Масленица на Севере»', 1),
    para('Март 2027 · Белое море · 5–8 классы'),
    heading('О программе', 2),
    para('Приглашаем встретить масленицу среди просторов северной тайги на берегу Белого моря. В этом краю '
         'можно увидеть бескрайнюю тайгу, покрытое льдом и наполненное жизнью Белое море, полярное сияние, '
         'древние скалы и старинные поморские поселения. Ребят ждут познавательные занятия по биологии, '
         'туризму и этнографии, морские и пешие путешествия по красивейшим берегам и островам Белого моря.'),
    para('Приезжайте познакомиться с русским севером и получить опыт жизни в условиях северной тайги и исследования северной природы.'),
    heading('Профили', 2),
    heading('«Естествознание»', 3),
    para('Знакомимся с зоологией, ботаникой, теорией эволюции, генетикой, физиологией, молекулярной биологией. '
         'Каждый день — одна из экосистем нашей биосферы: литораль, сублитораль, планктон, тайга, озеро, болото.'),
    heading('«Поморский»', 3),
    para('История края и живые поморские навыки: гончарное и кузнечное дело, подлёдная рыбалка, упряжка '
         'северных оленей, варенье из ягод. Столетия жизни русских людей на Белом море сформировали малый '
         'этнос — поморы. Их знания о северной природе передавались из поколения в поколение и сохранились до наших дней.'),
    para('В программе будут общие мероприятия, экскурсии, факультативы и лекции, но значительная часть времени отдана профильным занятиям.'),
    heading('Ориентировочный распорядок дня', 2),
    para('Все дни построены по одному плану: один день — одна тема. Центральное событие каждого дня — '
         'профильное занятие на природе; остальные занятия расширяют и закрепляют тему.'),
    table([
        ['Часы', 'Занятия'],
        ['9:00', 'Подъём'],
        ['9:15 – 9:30', 'Зарядка'],
        ['9:30 – 10:00', 'Завтрак'],
        ['10:00 – 13:30', 'Экскурсии и занятия'],
        ['13:30 – 14:30', 'Обед и отдых'],
        ['14:30 – 17:30', 'Экскурсии и занятия'],
        ['18:00 – 19:00', 'Занятия в лаборатории'],
        ['19:00 – 20:00', 'Ужин'],
        ['20:00 – 21:45', 'Баня / игры / лекции / факультативы'],
        ['22:00', 'Отбой'],
    ]),
    heading('Ориентировочная программа по дням', 2),
]
DAYS = [
    ('День 1. Знакомство.', 'Прибытие в туристический центр «Полярный Круг». Завтрак, размещение, инструктаж по технике безопасности, отдых.',
     'Экскурсия на литораль — приливно-отливную полосу Белого моря: поговорим про море зимой, познакомимся с литоральными животными и растениями. Костёр и пикник на берегу. Знакомство с лабораторией: микроскопы, аквариумы и другие инструменты биолога.',
     'Экскурсия по деревне: старинные и современные деревенские дома, быт древней и современной деревни. Прогулка на остров Большой Епишкин — первый взгляд на море, пикник у костра. Занятие в керамической мастерской за гончарным кругом.'),
    ('День 2. Геологическое и этнографическое «вчера».', '',
     'Выход на каньон Панфилова Варрака: древние магматические и метаморфические породы, сбор образцов минералов, рассказ о карельских рудах и геологической деятельности ледников. Тайга: стратегии выживания растений на севере, следы животных в зимнем лесу. Занятие в керамической мастерской.',
     'Техника безопасности при передвижении по морскому льду. Снегоходное путешествие в старинную поморскую деревню Чёрная Речка — ей около 500 лет, и живёт она без дороги. В гостях у местных жителей: история деревни и что дают лес и море. Деревянное зодчество, Трифоновская церковь. Поморское плетение пояса. Занятие в кузне.'),
    ('День 3. Рыбные места.', 'Снегоходный или лыжный выход на Нильмозеро. Рассказ о зимнем рыболовном промысле поморов: как поставить сети под лёд. Рыбалка на озере, мастер-класс по приготовлению ухи, обед с горячей ухой.',
     'Экскурсия на исток реки Нильма: собираем пресноводных беспозвоночных. Зимний лес и следы животных на снегоступах. Питомник северных ездовых собак и катание в упряжках. В лаборатории — рассматриваем находки под бинокуляром.',
     'Прогулка по озеру: рассказ про рыбацкие домики на озёрных и морских островах, посещение рыбацкой избушки. Питомник северных ездовых собак и катание в упряжках. Занятие в керамической мастерской.'),
    ('День 4. Море.', 'Техника безопасности при передвижении по морскому льду, лекция о приливах и отливах. Снегоходно-пешеходный выход на Морской порог.',
     'Биологическая экскурсия по литорали: сбор морских животных, горячий обед на выходе. В лаборатории — практикум по животным и растениям литоральной и сублиторальной зон.',
     'Рассказ про литораль, приливы и отливы, использование таблиц приливов в жизни поморов. Сбор и приготовление морской капусты — ламинарии. Питомник северных оленей: оленеводство, адаптации северного оленя; можно погладить и покормить. Мастер-класс «Как запрячь северного оленя?» и катание в упряжках.'),
    ('День 5. Праздник Масленицы.', 'Снегоходный выезд в бухту Биофильтров, по дороге — дайверский лагерь на острове Большой Крестовый: рассказ о зимних погружениях, дайверы поднимут морских животных. На Биофильтрах — прогулки по берегу и горячий обед.',
     'Питомник северных оленей: оленей можно погладить и покормить, катание в упряжках. Питомник северных ездовых собак и катание в упряжках.',
     'Мезенская вышивка. Занятие в кузне. Питомники оленей и ездовых собак с катанием. Вечером — горячие блины и проводы зимы. Масленица!'),
    ('День 6. Верховое болото и северные животные.', '',
     'Экскурсия на верховое болото — уникальное северное сообщество. Промерим мощность торфяного слоя, поговорим о болотных растениях и их адаптациях.',
     'Болото и собирательство в жизни поморов: северные ягоды и лекарственные растения, их заготовка. Из запасённой клюквы сварим варенье на всех, испечём калитки — традиционные северные пироги. Варенье заберём домой, калитки возьмём в дорогу. Завершение программы, вручение подарков и дипломов. Отъезд.'),
]
for title, common, sci, pom in DAYS:
    BODY.append(heading(title, 3))
    if common:
        BODY.append(para(common))
    BODY.append(para('Профиль «Естествознание»: ' + sci))
    BODY.append(para('Профиль «Поморский»: ' + pom))
BODY += [
    para('Возможны изменения в ходе программы из-за погодных и других условий.'),
    heading('Организация программы', 2),
    table([
        ['Что', 'Как'],
        ['Руководитель', 'Михаил Сафонов, кандидат биологических наук'],
        ['Место', 'Туристический центр «Полярный Круг», берег Белого моря'],
        ['Выезд', '7 марта 2027, 0:40 (в ночь с 6 на 7 марта) с Ленинградского вокзала, поезд № 16 «Арктика» до станции Чупа. В пути 28 часов'],
        ['Возвращение', '15 марта 2027, 07:15 на Ленинградский вокзал, поезд № 15 «Арктика»'],
        ['Даты программы', '8 – 13 марта 2027'],
        ['Проживание', 'Номера со всеми удобствами, по 2–3 человека. Пятиразовое питание без ограничений, холодные и горячие напитки круглосуточно, ежедневная уборка, русская баня'],
    ]),
    heading('Стоимость', 2),
    table([
        ['Статья', 'Стоимость'],
        ['Поездка: размещение, питание, программа, трансфер от станции Чупа и обратно', '129 400 ₽'],
        ['Проезд по железной дороге Москва — Чупа — Москва (плацкарт, горячее питание, вожатское сопровождение)', '≈ 19 000 ₽'],
    ]),
    para('Проезд оплачивается дополнительно. Ориентировочная стоимость билетов — на момент формирования группы.'),
    heading('Важно', 2),
    para('Форма на сайте поездки — предварительная запись. Она не подтверждает участие ребёнка: место в группе '
         'согласуется отдельно после связи с родителями.'),
]

CONTENT_TYPES = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>'''

RELS = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>'''

DOC_RELS = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
</Relationships>'''

STYLES = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="ru-RU"/></w:rPr></w:rPrDefault>
<w:pPrDefault><w:pPr><w:spacing w:after="140" w:line="288" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>
  <w:pPr><w:spacing w:before="0" w:after="80"/><w:keepNext/></w:pPr>
  <w:rPr><w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/><w:b/><w:color w:val="12212B"/><w:sz w:val="52"/><w:szCs w:val="52"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>
  <w:pPr><w:keepNext/><w:spacing w:before="400" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr>
  <w:rPr><w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/><w:b/><w:color w:val="12212B"/><w:sz w:val="36"/><w:szCs w:val="36"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>
  <w:pPr><w:keepNext/><w:spacing w:before="360" w:after="100"/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="4" w:color="B9CFD8"/></w:pBdr><w:outlineLvl w:val="1"/></w:pPr>
  <w:rPr><w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/><w:b/><w:color w:val="1F5A50"/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>
  <w:pPr><w:keepNext/><w:spacing w:before="280" w:after="80"/><w:outlineLvl w:val="2"/></w:pPr>
  <w:rPr><w:b/><w:color w:val="8A5A12"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="TableHeader"><w:name w:val="Table Header"/><w:basedOn w:val="Normal"/>
  <w:pPr><w:spacing w:after="40"/></w:pPr><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="20"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/>
  <w:pPr><w:spacing w:after="60"/><w:ind w:left="425"/></w:pPr></w:style>
<w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:tblPr>
  <w:tblBorders><w:top w:val="single" w:sz="4" w:color="CFDDE3"/><w:left w:val="single" w:sz="4" w:color="CFDDE3"/>
  <w:bottom w:val="single" w:sz="4" w:color="CFDDE3"/><w:right w:val="single" w:sz="4" w:color="CFDDE3"/>
  <w:insideH w:val="single" w:sz="4" w:color="E3ECEF"/><w:insideV w:val="single" w:sz="4" w:color="E3ECEF"/></w:tblBorders>
  <w:cellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:cellMar>
</w:tblPr><w:trPr><w:cantSplit/></w:trPr></w:style>
</w:styles>'''

NUMBERING = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>
<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
</w:numbering>'''

SETTINGS = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:zoom w:percent="100"/><w:defaultTabStop w:val="708"/><w:compat/></w:settings>'''

CORE = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<dc:title>Масленица на Севере — программа поездки, март 2027</dc:title>
<dc:subject>Зимняя образовательная практика, 5–8 классы, Белое море</dc:subject>
<dc:creator>Школа</dc:creator>
<dc:language>ru-RU</dc:language>
</cp:coreProperties>'''

APP = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>gsvv.ru/forms</Application></Properties>'''

body = ''.join(BODY)
document = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>{body}
<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>'''

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('[Content_Types].xml', CONTENT_TYPES)
    z.writestr('_rels/.rels', RELS)
    z.writestr('word/document.xml', document)
    z.writestr('word/_rels/document.xml.rels', DOC_RELS)
    z.writestr('word/styles.xml', STYLES)
    z.writestr('word/numbering.xml', NUMBERING)
    z.writestr('word/settings.xml', SETTINGS)
    z.writestr('docProps/core.xml', CORE)
    z.writestr('docProps/app.xml', APP)
print('готово:', os.path.normpath(OUT), os.path.getsize(OUT), 'байт')