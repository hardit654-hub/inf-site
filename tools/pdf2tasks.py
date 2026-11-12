"""PDF варианта (СтатГрад и т. п.) -> задания в формате курса.
Текст переносится как есть (курсив, жирный, индексы), таблицы и рисунки вырезаются из PDF картинками.
Использование: python3 tools/pdf2tasks.py <pdf> <папка-вывода>
В папке появятся tasks.json и img/*.png. Материалы в репозиторий не кладутся."""
import sys, os, re, json, html as H
import pymupdf as fz

ZOOM = 3          # чёткость картинок
LEFT = 70         # левое поле текста
RIGHT = 542       # правое поле текста

def is_header(l): return l['bbox'][1] < 56
def txt(l): return ''.join(s['text'] for s in l['spans'])

def task_starts(doc):
    """Номера заданий: жирные цифры в рамке слева (x < 60)."""
    out = []
    for pn, p in enumerate(doc):
        head = ''.join(s['text'] for b in p.get_text('dict')['blocks'] if b['type'] == 0 for l in b['lines'] for s in l['spans'] if l['bbox'][1] < 56)
        m = re.search(r'Вариант\s+(\S+)', head)
        for b in p.get_text('dict')['blocks']:
            if b['type'] != 0: continue
            for l in b['lines']:
                t = txt(l).strip()
                if l['bbox'][0] < 60 and re.fullmatch(r'\d{1,2}', t) and l['spans'][0]['flags'] & 16:
                    out.append(dict(page=pn, y=l['bbox'][1] - 3, n=int(t), var=m.group(1) if m else ''))
    return out

def span_html(s, base=None, size=None):
    t = H.escape(s['text'])
    if not t.strip(): return t
    f = s['flags']
    small = size and s['size'] < size * 0.8
    if small and base is not None and s['origin'][1] > base + 0.4: t = f'<sub>{t}</sub>'
    elif (f & 1) or (small and base is not None and s['origin'][1] < base - 2): t = f'<sup>{t}</sup>'
    if f & 2: t = f'<i>{t}</i>'
    if f & 16: t = f'<b>{t}</b>'
    if 'Courier' in s['font'] or 'Consolas' in s['font'] or 'Mono' in s['font']: t = f'<code>{t}</code>'
    return t

def split_cols(l, words):
    """Части строки, разделённые большими промежутками (табуляцией)."""
    b = l['bbox']
    ws = sorted([w for w in words if w[1] >= b[1] - 1 and w[3] <= b[3] + 1 and w[0] >= b[0] - 1 and w[2] <= b[2] + 1], key=lambda w: w[0])
    cols, last = [], None
    for w in ws:
        if last is None or w[0] - last > 10: cols.append(w[4])
        else: cols[-1] += ' ' + w[4]
        last = w[2]
    return cols

def line_html(l, base, size):
    """Спаны строки в HTML; пробел, если между спанами есть зазор, а самого пробела в тексте нет."""
    out, prev = '', None
    for s in l['spans']:
        if prev is not None and s['text'] and prev['text'] and not prev['text'].endswith(' ') and not s['text'].startswith(' ') \
           and s['bbox'][0] - prev['bbox'][2] > 1.6: out += ' '
        out += span_html(s, base, size); prev = s
    return out

def merge_rows(lines, words=()):
    """Строки с одной базовой линией (выключка по ширине режет строку на куски) -> одна строка."""
    rows = []
    for l in sorted(lines, key=lambda l: (round(l['bbox'][3]), l['bbox'][0])):
        if rows and abs(rows[-1]['y1'] - l['bbox'][3]) < 3:
            r = rows[-1]; r['parts'].append(l); r['x1'] = max(r['x1'], l['bbox'][2]); r['x0'] = min(r['x0'], l['bbox'][0])
        else:
            rows.append(dict(parts=[l], x0=l['bbox'][0], x1=l['bbox'][2], y0=l['bbox'][1], y1=l['bbox'][3]))
    for r in rows:
        r['parts'].sort(key=lambda l: l['bbox'][0])
        r['mono'] = all(('Courier' in s['font'] or 'Mono' in s['font']) for l in r['parts'] for s in l['spans'] if s['text'].strip())
        h = ''
        big = [s for l in r['parts'] for s in l['spans'] if s['text'].strip()]
        size = max((s['size'] for s in big), default=0)
        base = max((s['origin'][1] for s in big if s['size'] >= size * 0.8), default=None)
        for i, l in enumerate(r['parts']):
            if i and not h.endswith(' '): h += ' '
            h += line_html(l, base, size)
        r['cells'] = [re.sub(r'</i>(\s*)<i>', r'\1', line_html(l, base, size)).strip() for l in r['parts']]
        if len(r['parts']) == 1 and r['x1'] < LEFT + 300 and words:
            cols = split_cols(r['parts'][0], words)
            if len(cols) >= 2:
                it = all(s['flags'] & 2 for s in r['parts'][0]['spans'] if s['text'].strip())
                r['cells'] = [f'<i>{H.escape(c)}</i>' if it else H.escape(c) for c in cols]
        r['html'] = re.sub(r'</i>(\s*)<i>', r'\1', re.sub(r'</b>(\s*)<b>', r'\1', h)).strip()
        r['text'] = ' '.join(txt(l) for l in r['parts']).strip()
    return rows

def region_items(doc, page, y0, y1, imgdir, tag, counter):
    p = doc[page]
    d = p.get_text('dict')
    lines = [l for b in d['blocks'] if b['type'] == 0 for l in b['lines']
             if y0 <= l['bbox'][1] < y1 and not is_header(l) and txt(l).strip()]
    # номер задания и «Ответ: ___» не нужны
    lines = [l for l in lines if not (l['bbox'][0] < 60 and re.fullmatch(r'\d{1,2}', txt(l).strip()))]
    ans_y = min([l['bbox'][1] for l in lines if re.match(r'\s*Ответ:', txt(l))], default=None)
    lines = [l for l in lines if not re.match(r'\s*Ответ:', txt(l))]
    filebox = any('Задание выполняется с использованием' in txt(l) for l in lines)
    lines = [l for l in lines if 'Задание выполняется с использованием' not in txt(l)]
    # графика: картинки и векторные рисунки/таблицы
    g = [fz.Rect(b['bbox']) for b in d['blocks'] if b['type'] == 1 and y0 <= b['bbox'][1] < y1]
    # рамка «Задание выполняется с использованием прилагаемого файла» — не рисунок
    bands = [fz.Rect(40, l['bbox'][1] - 9, 560, l['bbox'][3] + 9) for b in d['blocks'] if b['type'] == 0 for l in b['lines'] if 'Задание выполняется с использованием' in txt(l)]
    for dr in p.get_drawings():
        r = dr['rect']
        if r.y0 < y0 - 2 or r.y0 >= y1 or r.x1 < 60 or r.y1 < 56: continue
        if any(bd.contains(r) for bd in bands): continue
        if dr.get('fill') == (1.0, 1.0, 1.0) and not dr.get('color'): continue  # белая подложка под текстом
        g.append(fz.Rect(r))
    # склеиваем пересекающиеся и стоящие рядом по высоте
    figs = []
    for r in sorted(g, key=lambda r: r.y0):
        r = fz.Rect(r)
        for k, f in enumerate(figs):
            if r.y0 <= f.y1 + 4 and r.y1 >= f.y0 - 4:
                figs[k] = f | r; break
        else: figs.append(r)
    changed = True
    while changed:
        changed = False
        for i in range(len(figs)):
            for j in range(i + 1, len(figs)):
                if figs[i].y0 <= figs[j].y1 + 4 and figs[i].y1 >= figs[j].y0 - 4:
                    figs[i] = figs[i] | figs[j]; figs.pop(j); changed = True; break
            if changed: break
    inside = lambda l, f: f.contains(fz.Point((l['bbox'][0] + l['bbox'][2]) / 2, (l['bbox'][1] + l['bbox'][3]) / 2))
    for k in range(len(figs)):
        for l in lines:
            if inside(l, figs[k] + (-2, -2, 2, 2)): figs[k] = figs[k] | fz.Rect(l['bbox'])
    for k in range(len(figs)):
        for l in sorted(lines, key=lambda l: l['bbox'][1]):
            t = txt(l).strip(); f = figs[k]
            if -4 <= l['bbox'][1] - f.y1 < 30 and ('▲' in t or '▼' in t):
                figs[k] = f | fz.Rect(l['bbox'])
    text_lines = [l for l in lines if not any(inside(l, f + (-2, -2, 2, 2)) for f in figs)]
    items = []
    imgs = [fz.Rect(b['bbox']) for b in d['blocks'] if b['type'] == 1]
    for f in figs:
        if f.width < 8 or f.height < 8: continue
        # пустая табличка для ответа рядом со словом «Ответ» — бланк, не часть условия
        if ans_y is not None and f.y0 > ans_y - 70 and not any(inside(l, f + (-2, -2, 2, 2)) for l in lines) and not any(f.intersects(r) for r in imgs): continue
        clip = fz.Rect(f.x0 - 2, f.y0 - 2, f.x1 + 2, f.y1 + 2)
        for l in text_lines:
            lb = fz.Rect(l['bbox'])
            if lb.x1 > clip.x0 and lb.x0 < clip.x1:
                if lb.y0 < clip.y0 < lb.y1: clip.y0 = lb.y1 - 1
                if lb.y0 < clip.y1 < lb.y1: clip.y1 = lb.y0 + 1
        counter[0] += 1
        name = f'{tag}-{counter[0]}.png'
        p.get_pixmap(matrix=fz.Matrix(ZOOM, ZOOM), clip=clip).save(os.path.join(imgdir, name))
        items.append(dict(y=f.y0, kind='img', src='img/' + name, w=round(clip.width * 96 / 72)))
    for r in merge_rows(text_lines, p.get_text('words')):
        items.append(dict(y=r['y0'], kind='row', **{k: r[k] for k in ('x0', 'x1', 'y0', 'y1', 'html', 'text', 'mono', 'cells')}))
    items.sort(key=lambda it: it['y'])
    return items, filebox

def to_html(items):
    """Строки -> абзацы. Новый абзац: короткая предыдущая строка, большой отступ сверху, красная строка, центрирование."""
    out, para, prev, pre = [], [], None, []
    def flush():
        nonlocal para
        if para:
            cls = ' class="c"' if para[0].get('center') else ''
            out.append(f'<p{cls}>' + ' '.join(r['html'] for r in para) + '</p>'); para = []
    def flush_pre():
        nonlocal pre
        if pre:
            base = min(r['x0'] for r in pre)
            body = '\n'.join(' ' * round((r['x0'] - base) / 7.2) + H.unescape(re.sub(r'<[^>]+>', '', r['html'])) for r in pre)
            out.append('<pre><code>' + H.escape(body) + '</code></pre>'); pre = []
    # колонки из коротких строк (пример входных данных) -> таблица без рамок
    grouped, i = [], 0
    while i < len(items):
        it = items[i]
        if it['kind'] == 'row' and len(it['cells']) >= 2 and it['x1'] < LEFT + 300 and not it['mono']:
            j = i
            while j + 1 < len(items) and items[j + 1]['kind'] == 'row' and len(items[j + 1]['cells']) >= 2 and items[j + 1]['x1'] < LEFT + 300 and not items[j + 1]['mono'] and items[j + 1]['y0'] - items[j]['y1'] < 4: j += 1
            if j > i:
                n = max(len(x['cells']) for x in items[i:j + 1])
                grouped.append(dict(kind='grid', rows=[x['cells'] + [''] * (n - len(x['cells'])) for x in items[i:j + 1]])); i = j + 1; continue
        grouped.append(it); i += 1
    items = grouped
    for it in items:
        if it['kind'] == 'grid':
            flush(); flush_pre(); out.append('<table class="plain"><tbody>' + ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in it['rows']) + '</tbody></table>'); prev = None; continue
        if it['kind'] == 'img':
            flush(); flush_pre(); out.append(f'<p class="fig"><img src="{it["src"]}" alt="" style="width:{it["w"]}px"></p>'); prev = None; continue
        if it['mono']:
            flush(); pre.append(it); prev = it; continue
        flush_pre()
        center = it['x0'] > LEFT + 25 and it['x1'] < RIGHT - 25 and abs((it['x0'] + it['x1']) / 2 - (LEFT + RIGHT) / 2) < 30
        it['center'] = center
        listy = re.match(r'(\d{1,2}[.)]|[а-яa-z]\)|[A-ZА-Я]\.|[–—-])\s', it['text'])
        if listy and prev is not None and prev['x1'] >= RIGHT - 30 and not re.search(r'[;:.!?]\s*$', prev['text']): listy = None  # перенос строки, а не пункт списка
        newp = (listy or prev is None or prev['x1'] < RIGHT - 30 or it['y0'] - prev['y1'] > 3.5 or it['x0'] > LEFT + 12
                or center or (prev and prev.get('center')))
        short = (prev is not None and para and not prev.get('center') and it['x1'] < LEFT + 300 and it['y0'] - prev['y1'] < 3.5
                 and it['x0'] < LEFT + 12 and all(x['x1'] < LEFT + 300 for x in para) and prev['x1'] < LEFT + 300)
        if short:
            para[-1] = dict(para[-1], html=para[-1]['html'] + '<br>' + it['html']); prev = it; continue
        if newp: flush()
        para.append(it); prev = it
    flush(); flush_pre()
    h = '\n'.join(out)
    h = re.sub(r'\s*</i>(\s*)<i>\s*', ' ', h); h = re.sub(r'\s*</b>(\s*)<b>\s*', ' ', h)
    h = re.sub(r' +</(i|b|sub|sup)>', r'</\1> ', h); h = re.sub(r' +</p>', '</p>', h); h = re.sub(r'  +', ' ', h)
    h = re.sub(r'(\w)- (\w)', lambda m: m.group(1) + m.group(2) if m.group(1).islower() and m.group(2).islower() else m.group(0), h)  # переносы слов
    return h

def extract(pdf, outdir):
    doc = fz.open(pdf)
    imgdir = os.path.join(outdir, 'img'); os.makedirs(imgdir, exist_ok=True)
    st = task_starts(doc)
    variants = {}
    for i, s in enumerate(st):
        nxt = st[i + 1] if i + 1 < len(st) and st[i + 1]['var'] == s['var'] else None
        # конец задания: начало следующего или конец страниц варианта
        pages = []
        if nxt and nxt['page'] == s['page']:
            pages.append((s['page'], s['y'], nxt['y']))
        else:
            pages.append((s['page'], s['y'], 842))
            last = nxt['page'] if nxt else s['page']
            if not nxt:  # последнее задание варианта: до последней страницы с этим вариантом
                last = s['page']
                while last + 1 < len(doc) and s['var'] and s['var'] in doc[last + 1].get_text()[:200]: last += 1
            for pg in range(s['page'] + 1, last + 1):
                pages.append((pg, 0, nxt['y'] if nxt and pg == nxt['page'] else 842))
        items, filebox, counter = [], False, [0]
        for pg, y0, y1 in pages:
            it, fb = region_items(doc, pg, y0, y1, imgdir, f"{s['var']}-{s['n']}", counter)
            items += it
            # рамка «с использованием файла» стоит над номером задания
        prevpage_lines = doc[s['page']].get_text('dict')
        for b in prevpage_lines['blocks']:
            if b['type'] == 0:
                for l in b['lines']:
                    if 'Задание выполняется с использованием' in txt(l) and s['y'] - 40 < l['bbox'][1] < s['y'] + 5: filebox = True
        variants.setdefault(s['var'], []).append(dict(n=s['n'], html=to_html(items), file=filebox))
    # ответы: «Вариант X» и строки «N) ответ»
    ans, cur = {}, None
    for p in doc:
        if 'класс. Вариант' in p.get_text()[:300] or 'Инструкция по выполнению' in p.get_text(): continue  # страницы заданий
        for line in p.get_text().splitlines():
            m = re.match(r'\s*Вариант\s+(\S+)\s*$', line)
            if m and m.group(1) in variants: cur = m.group(1)
            m2 = re.match(r'\s*(\d{1,2})\)\s*(.+?)\s*$', line)
            if cur and m2: ans.setdefault(cur, {})[int(m2.group(1))] = m2.group(2)
    json.dump(dict(variants=variants, answers=ans), open(os.path.join(outdir, 'tasks.json'), 'w'), ensure_ascii=False, indent=1)
    for v, ts in variants.items(): print(v, len(ts), 'заданий', 'ответов', len(ans.get(v, {})))

if __name__ == '__main__': extract(sys.argv[1], sys.argv[2])
