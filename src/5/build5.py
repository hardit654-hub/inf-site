"""Раздел «№ 5 Анализ алгоритмов»: шаги исходного курса (раздел 25) — текст без изменений,
плюс задачи из домашней работы открытого курса КЕГЭ (занятие 16), которых нет в исходном курсе.
Ответы: правильные попытки; где их нет — перебор (calc5.py); ключи КЕГЭ проверены перебором (checkk.py).
Запуск: python3 src/5/build5.py <папка с steps.json и kompege.json>"""
import json, re, os, sys, html as H
RAW = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from stepik_conv import to_blocks

TITLES = ['Как решать № 5 на ЕГЭ?', 'Решение в Python Ⅰ', 'Решение в Python Ⅱ', 'Решение в Python Ⅲ',
          'Решение в Python Ⅳ', 'Тренировка', 'Решение в Python более сложных задач']
# ответы, которых нет среди правильных попыток — посчитаны перебором, примеры из условий сходятся
CALC = {'25.5.8': '1577', '25.5.9': '2677', '25.6.3': '222', '25.6.4': '457', '25.6.11': '29',
        '25.7.9': '432098', '25.7.10': '233024691'}
# повторы внутри курса: тот же текст, другие числа (оставлена задача с видеоразбором)
DROP = {'25.2.13', '25.5.4', '25.7.3'}
# задачи КЕГЭ (номер в домашке -> урок); повторы исходного курса пропущены:
# 1 (= 25.3.6), 2 (= 25.2.6), 7 (= 25.7.1), 10 (= 25.3.5), 11 (= 25.4.5), 12 (= 25.4.6),
# 14, 15 (= 25.5.5), 19 (= 25.5.13), 20 (= 25.7.4), 21 (= 25.5.1)
KOMPEGE = {3: 6, 4: 6, 5: 6, 6: 6, 9: 6, 16: 6, 17: 6, 18: 6, 8: 7, 13: 7, 22: 7}

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
    return re.sub(r'\x03(\d+)\x03', lambda m: re.sub(r'<code[^>]*>', '<code>', pres[int(m.group(1))]), h)

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

def kclean(h):
    h = re.sub(r'\s(class|style|width|height|border|cellpadding|cellspacing|align)="[^"]*"', '', h)
    h = re.sub(r'</?(span|font|div)>', '', h)
    return re.sub(r'\s+', ' ', h).strip()

def build():
    steps = json.load(open(os.path.join(RAW, 'steps.json')))
    kom = json.load(open(os.path.join(RAW, 'kompege.json')))['tasks']
    lessons = []; key = {}
    for n in range(1, 8):
        out = []
        for s in [x for x in steps if x['l'] == n]:
            tid = f'25.{n}.{s["k"]}'
            if tid in DROP: continue
            if s['name'] == 'video': out.append({'type': 'video', 'title': 'Видеоразбор'}); continue
            blocks = embeds(to_blocks(links(clean(s['text'] or ''))))
            if s['name'] == 'text': out.append({'type': 'text', 'blocks': blocks}); continue
            assert s['name'] == 'string', tid
            ok = [y['r'] for y in (s['sub'] or []) if y['st'] == 'correct']
            ans = CALC.get(tid) or str(ok[0].get('text', '')).strip()
            assert ans, tid
            out.append({'type': 'fill', 'blocks': blocks, 'fields': [{'label': 'Ответ', 'n': 1}], 'answer': [[ans]]})
            key[f'{n}:{len(out)}'] = (tid, ans)
        for i, ln in KOMPEGE.items():
            if ln != n: continue
            t = kom[i - 1]
            out.append({'type': 'fill', 'blocks': to_blocks(kclean(t['text'])), 'fields': [{'label': 'Ответ', 'n': 1}], 'answer': [[str(t['key'])]]})
            key[f'{n}:{len(out)}'] = (f'КЕГЭ {i}', str(t['key']))
        lessons.append({'num': f'25.{n}', 'title': TITLES[n - 1], 'steps': out})
    course = {'id': 'ege-inf', 'title': 'ЕГЭ по информатике', 'section': {'num': 25, 'title': '№ 5 Анализ алгоритмов', 'lessons': lessons}}
    open(os.path.join(HERE, 'course.js'), 'w').write('/* Данные раздела № 5. Собирается скриптом src/5/build5.py */\nwindow.COURSE = ' + json.dumps(course, ensure_ascii=False) + ';\n')
    json.dump(key, open(os.path.join(HERE, 'answers.json'), 'w'), ensure_ascii=False, indent=0)
    print('уроков', len(lessons), 'шагов', sum(len(l['steps']) for l in lessons), 'задач', sum(1 for l in lessons for s in l['steps'] if s['type'] == 'fill'))

if __name__ == '__main__': build()
