"""Курс № 22 «Параллельные процессы»: шаги из Stepik (раздел 35) — текст без изменений,
плюс три задачи из открытого курса КЕГЭ, которых нет на Stepik.
Файлы и картинки — из sources/22 (скачаны workflow «Скачать исходные файлы заданий»).
Запуск: python3 src/22/build22.py <папка с raw/steps.json и raw/kompege.json>"""
import json, re, os, sys, shutil, html as H
RAW = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.dirname(HERE))
from stepik_conv import to_blocks
SRC = os.path.join(ROOT, 'sources/22'); OUT = os.path.join(ROOT, 'site/ege-22')

# Ответы: правильные попытки на Stepik; для 35.7 и 35.8 — точный расчёт (проверен на 34 задачах с известными ответами)
CALC = {'35.7.2': 8, '35.7.3': 3, '35.7.4': 11, '35.7.5': 16, '35.7.6': 15, '35.7.7': 3, '35.7.8': 18, '35.7.9': 85,
        '35.8.2': 31, '35.8.3': 61, '35.8.4': 17}
DROP = {'35.7.10'}  # дословно 35.2.8 (тот же файл и тот же вопрос)
LESSON_IDS = {1918030: 1, 1974906: 2, 1074879: 3, 1104278: 4, 1624132: 5, 1398090: 6, 1074880: 7, 1129858: 8}
TITLES = ['Без движения процессов. Теория', 'Без движения процессов. Различные задачи', 'Движение процессов Ⅰ',
          'Движение процессов Ⅱ', 'Важно! Движение процессов. Наглядный способ', 'Движение процессов. Сложные задачи с ЕГЭ',
          'Тренировка', 'Интересные задачи']
# из КЕГЭ: (домашка, номер задачи, урок, куда)
KOMPEGE = [(1, 5, 2), (1, 15, 2), (2, 10, 8)]
VIDEO = {'35.5.2': 'Наглядный способ: рисуем связи процессов'}

def fsize(n): return f'{n / 1048576:.1f} МБ'.replace('.', ',') if n >= 1048576 else f'{max(1, round(n / 1024))} КБ'

def find_src(prefix):
    for fn in sorted(os.listdir(SRC)):
        if fn.startswith(prefix + '.') and not fn.startswith('img'): return fn
    return None

def put_file(prefix):
    fn = find_src(prefix)
    if not fn: return None
    ext = fn.rsplit('.', 1)[1]; ext = 'ods' if ext == 'dat' else ext
    name = f'22-{prefix.lstrip("s")}.{ext}'
    shutil.copy(os.path.join(SRC, fn), os.path.join(OUT, 'files', name))
    return {'name': name, 'href': 'files/' + name, 'size': fsize(os.path.getsize(os.path.join(SRC, fn)))}

KEEP = {'src', 'href', 'colspan', 'rowspan', 'alt'}
def clean(h):
    """Тот же вид, что даёт перенос со страницы Stepik: без стилей и лишних обёрток. Текст не меняется."""
    h = re.sub(r'<(\w+)((?:\s+[\w-]+(?:="[^"]*")?)*)\s*(/?)>',
               lambda m: '<' + m.group(1) + ''.join(f' {a}="{v}"' for a, v in re.findall(r'([\w-]+)="([^"]*)"', m.group(2)) if a in KEEP) + m.group(3) + '>', h)
    h = re.sub(r'</?(span|div|font)>', '', h)
    h = re.sub(r'\s+', ' ', h).strip()
    h = re.sub(r'<p>(?:&nbsp;|\s|<br>)*</p>', '', h)
    return h

def links(h, tid):
    def a(m):
        href, text = H.unescape(m.group(1)), m.group(2)
        plain = re.sub(r'<[^>]+>', '', text).strip()
        if plain in ('файле', 'таблице'): return text           # ссылка на файл -> кнопка скачивания над условием
        mm = re.match(r'/lesson/(\d+)/step/(\d+)', href)
        if mm and int(mm.group(1)) in LESSON_IDS: return f'<a href="#35.{LESSON_IDS[int(mm.group(1))]}-{mm.group(2)}">{text}</a>'
        return f'<a href="{H.escape(href)}" target="_blank" rel="noopener">{text}</a>'
    return re.sub(r'<a href="([^"]*)"[^>]*>(.*?)</a>', a, h, flags=re.S)

def imgs(h, tid):
    n = [0]
    def r(m):
        n[0] += 1; name = f'{tid}-{n[0]}.png'; src = os.path.join(SRC, f'img{tid}-{n[0]}.png')
        if os.path.exists(src): shutil.copy(src, os.path.join(OUT, 'img', name)); return f'<img src="img/{name}" alt="">'
        return m.group(0)
    return re.sub(r'<img[^>]*>', r, h)

def build():
    os.makedirs(os.path.join(OUT, 'files'), exist_ok=True); os.makedirs(os.path.join(OUT, 'img'), exist_ok=True)
    steps = json.load(open(os.path.join(RAW, 'steps.json')))
    kom = json.load(open(os.path.join(RAW, 'kompege.json')))
    KT = {(1 if v['kim'] == 25015428 else 2, i): t for v in kom for i, t in enumerate(v['tasks'], 1)}
    lessons = []; key = {}
    for n in range(1, 9):
        out = []
        for s in [x for x in steps if x['l'] == n]:
            tid = f'35.{n}.{s["k"]}'
            if tid in DROP: continue
            if s['name'] == 'video':
                out.append({'type': 'video', 'title': VIDEO.get(tid, 'Видеоразбор')}); continue
            h = imgs(links(clean(s['text'] or ''), tid), tid)
            blocks = []
            if s['name'] != 'text' or re.search(r'>(файле|таблице)<', s['text'] or ''):
                f = put_file('s' + tid)
                if f: blocks.append({'t': 'file', 'files': [f]})
            blocks += to_blocks(h)
            if s['name'] == 'text': out.append({'type': 'text', 'blocks': blocks}); continue
            ok = [y['r']['text'] for y in (s['sub'] or []) if y['st'] == 'correct']
            ans = str(CALC.get(tid, ok[0] if ok else '')).strip()
            assert ans, tid
            key[f'{n}:{len(out) + 1}'] = (tid, ans)
            out.append({'type': 'fill', 'blocks': blocks, 'fields': [{'label': 'Ответ', 'n': 1}], 'answer': [[ans]]})
        for hw, i, ln in KOMPEGE:
            if ln != n: continue
            t = KT[(hw, i)]
            f = put_file(f'k{hw}.{i}')
            blocks = ([{'t': 'file', 'files': [f]}] if f else []) + to_blocks(clean(t['text']))
            key[f'{n}:{len(out) + 1}'] = (f'КЕГЭ {hw}.{i}', str(t['key']))
            out.append({'type': 'fill', 'blocks': blocks, 'fields': [{'label': 'Ответ', 'n': 1}], 'answer': [[str(t['key'])]]})
        lessons.append({'num': f'35.{n}', 'title': TITLES[n - 1], 'steps': out})
    course = {'id': 'ege-inf', 'title': 'ЕГЭ по информатике', 'section': {'num': 35, 'title': '№ 22 Параллельные процессы', 'lessons': lessons}}
    open(os.path.join(HERE, 'course.js'), 'w').write('/* Данные курса № 22. Собирается скриптом src/22/build22.py */\nwindow.COURSE = ' + json.dumps(course, ensure_ascii=False, indent=1) + ';\n')
    json.dump(key, open(os.path.join(HERE, 'answers.json'), 'w'), ensure_ascii=False, indent=0)
    print('уроков', len(lessons), 'шагов', sum(len(l['steps']) for l in lessons), 'задач', sum(1 for l in lessons for s in l['steps'] if s['type'] == 'fill'))

if __name__ == '__main__': build()
