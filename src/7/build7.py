"""Курс № 7 «Кодирование изображений и звука»: шаги из Stepik (раздел 439730) — текст без изменений.
Картинки — из sources/7. Запуск: python3 src/7/build7.py"""
import json, re, os, sys, shutil
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from stepik_conv import to_blocks
from answers7 import ANSWERS as ANS
SRC = os.path.join(ROOT, 'sources/7'); NUM = 44
IMG = os.path.join(ROOT, 'site/ege/img')  # страница курса берёт картинки из ege/img
TITLES = {1: 'Кодирование изображения', 2: 'Отработка задач на кодирование изображения',
          3: 'Сжатие изображений, степень прозрачности', 4: 'Звук', 5: 'Задачи на звук и изображения',
          6: 'Задачи на звук и изображения часть 2', 7: 'Задачи на звук и изображения часть 3', 8: 'Тренировка'}
# сопоставление (шаг 4.4): 1 микрофон — моно, 2 — стерео, 4 — квадро; порядок — как в задании
MATCH = {'4.4': [('одного микрофона, то использовался', 'формат моно'),
                 ('двух микрофонов, то использовался', 'формат стерео'),
                 ('четырёх микрофонов, то использовался', 'формат квадро')]}

# адрес картинки -> имя файла (sources/7-urls.txt)
URLS = {u: f for f, u in (l.split() for l in open(os.path.join(ROOT, 'sources/7-urls.txt')) if l.strip())}

KEEP = {'src', 'href', 'colspan', 'rowspan', 'alt'}
def clean(h):
    h = re.sub(r'<(\w+)((?:\s+[\w-]+(?:="[^"]*")?)*)\s*(/?)>',
               lambda m: '<' + m.group(1) + ''.join(f' {a}="{v}"' for a, v in re.findall(r'([\w-]+)="([^"]*)"', m.group(2)) if a in KEEP) + m.group(3) + '>', h)
    h = re.sub(r'</?(span|div|font)>', '', h)
    h = re.sub(r'\s+', ' ', h).strip()
    h = re.sub(r'<p>(?:&nbsp;|\s|<br>)*</p>', '', h)
    return h

def build():
    os.makedirs(IMG, exist_ok=True)
    d = json.load(open(os.path.join(SRC, 'steps_all.json')))
    lessons = []; used = set()
    for u in range(1, 9):
        L = d['lessons'][str(d['units'][str(u)]['lesson'])]; out = []
        for k, sid in enumerate(L['steps'], 1):
            s = d['steps'][str(sid)]; name = s['block']['name']; tid = f'{u}.{k}'
            if name == 'video': out.append({'type': 'video', 'title': 'Видеоразбор'}); continue
            h = clean(s['block']['text'] or '')
            h = re.sub(r'<details> ?<summary>Видеоразбор</summary>.*?</details>', '', h, flags=re.S)
            h = re.sub(r'<p>[^<]*Видеоразбор: <a href="[^"]*">.*?</a>\.?</p>', '', h, flags=re.S)
            h = re.sub(r'<p>(?:<[^>]+>|\s)*PRO100 ЕГЭ информатика ЕГЭ(?:<[^>]+>|\s)*</p>', '', h)
            def img(m):
                fn = URLS[m.group(1)]
                shutil.copy(os.path.join(SRC, fn), os.path.join(IMG, fn)); return f'<img src="img/{fn}" alt="">'
            h = re.sub(r'<img[^>]*src="([^"]*)"[^>]*>', img, h)
            assert not re.search(r'stepik|ucarecdn|pro100|google|fipi\.ru|youtu|rutube|vk\.com|<a ', h, re.I), tid
            blocks = to_blocks(h)
            if name == 'text': out.append({'type': 'text', 'blocks': blocks}); continue
            if name == 'matching':
                pairs = MATCH[tid]; opts = sorted({b for _, b in pairs})
                out.append({'type': 'match', 'blocks': blocks, 'items': [a for a, _ in pairs], 'options': opts,
                            'answer': [opts.index(b) for _, b in pairs]}); used.add(tid); continue
            assert name in ('string', 'number'), (tid, name)
            used.add(tid)
            f = {'label': 'Ответ', 'n': 1}
            if name == 'string': f['txt'] = 1
            out.append({'type': 'fill', 'blocks': blocks, 'fields': [f], 'answer': [[ANS[tid]]]})
        lessons.append({'num': f'{NUM}.{u}', 'title': TITLES[u], 'steps': out})
    extra = set(ANS) - used
    course = {'id': 'ege-inf', 'title': 'ЕГЭ по информатике', 'section': {'num': NUM, 'title': '№ 7 Кодирование изображений и звука', 'lessons': lessons}}
    open(os.path.join(HERE, 'course.js'), 'w').write('/* Данные курса № 7. Собирается скриптом src/7/build7.py */\nwindow.COURSE = ' + json.dumps(course, ensure_ascii=False, indent=1) + ';\n')
    print('уроков', len(lessons), 'шагов', sum(len(l['steps']) for l in lessons), 'задач', len(used), 'ответы без задачи:', sorted(extra))

if __name__ == '__main__': build()
