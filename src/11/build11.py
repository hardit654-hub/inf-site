"""Раздел «№ 11 Информационный объём»: шаги исходного курса (раздел 4) — текст без изменений,
плюс задачи из домашней работы открытого курса КЕГЭ (занятие 1), которых нет в исходном курсе.
Ответы: правильные попытки, все пересчитаны программой (calc11.py); она же сверяет ключи КЕГЭ. Картинок в разделе нет.
Запуск: python3 src/11/build11.py <папка с steps.json и kompege.json>"""
import json, re, os, sys, html as H
RAW = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from stepik_conv import to_blocks
from calc11 import A as CALC

# 4.4.6 — та же задача, что 4.3.11 (708 номеров, более 213 Кбайт)
DROP = {'4.4.6'}
# задачи КЕГЭ (taskId), которых нет в исходном курсе; все — в урок «Тренировка».
# Не взяты (тот же текст, что в исходном курсе, или тот же вопрос с другими числами):
# 126 (как 4.1.7), 132 (= 4.6.9), 134 (как 4.1.11), 136 (= 4.2.6), 138 (как 4.6.4), 1194 (как 4.2.4), 1855 (как 4.2.2),
# 17524 (= 4.3.1), 17630 (= 4.3.11), 1366 (как 4.7.8), 17552 (= 4.3.5)
KOMPEGE = [10, 1412, 17934, 17935]
KOMPEGE_LESSON = 7

KEEP = {'src', 'href', 'colspan', 'rowspan', 'alt'}
def clean(h):
    """Без стилей и лишних обёрток. Текст не меняется; содержимое <pre> сохраняется как есть (переносы строк)."""
    pres = []
    def keep_pre(m): pres.append(m.group(0)); return f'\x03{len(pres) - 1}\x03'
    h = re.sub(r'<pre.*?</pre>', keep_pre, h, flags=re.S)
    h = re.sub(r'<(\w+)((?:\s+[\w-]+(?:="[^"]*")?)*)\s*(/?)>',
               lambda m: '<' + m.group(1) + ''.join(f' {a}="{v}"' for a, v in re.findall(r'([\w-]+)="([^"]*)"', m.group(2)) if a in KEEP) + m.group(3) + '>', h)
    h = re.sub(r'</?(span|div|font)>', '', h)
    h = re.sub(r'\s+', ' ', h).strip()
    h = re.sub(r'<p>(?:&nbsp;|\s|<br>)*</p>', '', h)
    def pre(m):
        p = re.sub(r'<code[^>]*>', '<code>', pres[int(m.group(1))])
        return re.sub(r'<pre[^>]*>', '<pre>', p)
    return re.sub(r'\x03(\d+)\x03', pre, h)

def links(h):
    return re.sub(r'<a href="([^"]*)"[^>]*>', lambda m: f'<a href="{m.group(1)}" target="_blank" rel="noopener">', h)

def embeds(blocks):
    """<iframe> с видео -> блок embed движка."""
    out = []
    for b in blocks:
        if b['t'] == 'details': b = dict(b, v=embeds(b['v']))
        if b['t'] != 'html' or '<iframe' not in b['v']: out.append(b); continue
        parts = re.split(r'<iframe[^>]*src="([^"]+)"[^>]*>\s*</iframe>', b['v'])
        for i, p in enumerate(parts):
            if i % 2: out.append({'t': 'embed', 'src': p, 'title': 'Видеоразбор'})
            elif re.sub(r'<[^>]+>|\s|&nbsp;', '', p): out.append({'t': 'html', 'v': re.sub(r'^\s*</p>|<p>\s*$', '', p.strip())})
    return out

URLS = []
def images(h, tid):
    """Картинки с чужого сервера -> свои копии img/<урок>.<шаг>-<n>.png (список для скачивания — sources/4-urls.txt)."""
    n = [0]
    def rep(m):
        n[0] += 1; name = f'{tid}-{n[0]}.png'; URLS.append(f'img{name} {m.group(1)}')
        return f'src="img/{name}"'
    return re.sub(r'src="(https://ucarecdn\.stepik\.net/[^"]+)"', rep, h)

def tex(h):
    """Формулы \\( … \\) -> <span class="tex"> (их рисует движок через KaTeX)."""
    return re.sub(r'\\\((.*?)\\\)', lambda m: '<span class="tex">' + H.escape(H.unescape(m.group(1)).strip(), quote=False) + '</span>', h, flags=re.S)

def texb(blocks):
    """tex() внутри готовых блоков (после to_blocks, который снимает <span>)."""
    out = []
    for b in blocks:
        if b['t'] == 'details': b = dict(b, v=texb(b['v']))
        elif b['t'] == 'html': b = dict(b, v=tex(b['v']))
        out.append(b)
    return out

def kclean(h):
    h = re.sub(r'\s(class|style|width|height|border|cellpadding|cellspacing|align)="[^"]*"', '', h)
    h = re.sub(r'</?(span|font|div)>', '', h)
    return re.sub(r'\s+', ' ', h).strip()

def build():
    src = json.load(open(os.path.join(RAW, 'steps.json')))
    kom = {t['taskId']: t for t in json.load(open(os.path.join(RAW, 'kompege.json')))['tasks']}
    lessons = []; key = {}
    for L in src['lessons']:
        n = L['n']; out = []
        for s in L['steps']:
            tid = f'4.{n}.{s["k"]}'
            if tid in DROP: continue
            if s['name'] == 'video': out.append({'type': 'video', 'title': 'Видеоразбор'}); continue
            blocks = texb(embeds(to_blocks(links(images(clean(s['text'] or ''), tid)))))
            if s['name'] == 'text': out.append({'type': 'text', 'blocks': blocks}); continue
            assert s['name'] == 'string', tid
            ok = {str(y['r'].get('text', '')).strip() for y in (s.get('sub') or []) if y['st'] == 'correct'}
            c = CALC.get(f'{n}.{s["k"]}')
            assert c is not None or len(ok) == 1, (tid, ok)     # без пересчёта — ровно одна верная попытка
            ans = str(c) if c is not None else ok.pop()
            out.append({'type': 'fill', 'blocks': blocks, 'fields': [{'label': 'Ответ', 'n': 1}], 'answer': [[ans]]})
            key[f'{n}:{len(out)}'] = (tid, ans)
        if n == KOMPEGE_LESSON:
            for i in KOMPEGE:
                t = kom[i]; ans = str(CALC[f'K{i}'])
                assert ans == str(t['key']), (i, ans, t['key'])  # ключ КЕГЭ совпал с пересчётом
                out.append({'type': 'fill', 'blocks': texb(to_blocks(kclean(t['text']))), 'fields': [{'label': 'Ответ', 'n': 1}], 'answer': [[ans]]})
                key[f'{n}:{len(out)}'] = (f'КЕГЭ {i}', ans)
        lessons.append({'num': f'4.{n}', 'title': L['title'], 'steps': out})
    course = {'id': 'ege-inf', 'title': 'ЕГЭ по информатике', 'section': {'num': 4, 'title': '№ 11 Информационный объём', 'lessons': lessons}}
    open(os.path.join(HERE, 'course.js'), 'w').write('/* Данные раздела № 11. Собирается скриптом src/11/build11.py */\nwindow.COURSE = ' + json.dumps(course, ensure_ascii=False) + ';\n')
    json.dump(key, open(os.path.join(HERE, 'answers.json'), 'w'), ensure_ascii=False, indent=0)
    open(os.path.join(HERE, 'urls.txt'), 'w').write('\n'.join(URLS) + '\n')
    print('уроков', len(lessons), 'шагов', sum(len(l['steps']) for l in lessons), 'задач', sum(1 for l in lessons for s in l['steps'] if s['type'] == 'fill'))

if __name__ == '__main__': build()
