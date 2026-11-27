"""Курс № 3 «Базы данных»: шаги из Stepik (раздел 439768) — текст без изменений.
Вложения и картинки — из sources/3-bd. Запуск: python3 src/3/build3.py"""
import json, re, os, sys, shutil, html as H
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from stepik_conv import to_blocks
from answers3 import ANS
SRC = os.path.join(ROOT, 'sources/3-bd'); OUT = os.path.join(ROOT, 'site/ege-46'); NUM = 46
IMG = os.path.join(ROOT, 'site/ege/img')  # страница курса берёт картинки из ege/img
# папка Google Drive из 3.3 и 3.8 -> файл в ней
FOLDERS = {'1NZ16XNvAp4AeBZheAM-dySymhJ4S2J9Z': '3_2024.xlsx'}
NAMES = {}  # исходный файл -> имя на сайте

def fsize(n): return f'{n / 1048576:.1f} МБ'.replace('.', ',') if n >= 1048576 else f'{max(1, round(n / 1024))} КБ'

def put(href, tid):
    m = re.search(r'/(?:d|folders)/([\w-]+)', href)
    if m and 'google.com' in href:
        src = FOLDERS.get(m.group(1)) or next(f for f in sorted(os.listdir(os.path.join(SRC, 'files'))) if f.startswith('g_' + m.group(1) + '.'))
        p = os.path.join(SRC, 'files', src)
        name = NAMES.setdefault(src, '3-' + tid + os.path.splitext(src)[1] if src.startswith('g_') else '3-' + src)
    elif 'pro100ege.org' in href or 'kompege.ru' in href:
        src = href.rsplit('/', 1)[1]; p = os.path.join(SRC, 'files', src)
        name = NAMES.setdefault(src, src if src.startswith('3-') else '3-' + src)
    else:
        raise SystemExit(f'{tid}: нет файла для ссылки {href}')
    if not os.path.exists(p): raise SystemExit(f'{tid}: нет {p}')
    shutil.copy(p, os.path.join(OUT, 'files', name))
    return {'name': name, 'href': 'files/' + name, 'size': fsize(os.path.getsize(p))}

KEEP = {'src', 'href', 'colspan', 'rowspan', 'alt'}
def clean(h):
    h = re.sub(r'<(\w+)((?:\s+[\w-]+(?:="[^"]*")?)*)\s*(/?)>',
               lambda m: '<' + m.group(1) + ''.join(f' {a}="{v}"' for a, v in re.findall(r'([\w-]+)="([^"]*)"', m.group(2)) if a in KEEP) + m.group(3) + '>', h)
    h = re.sub(r'</?(span|div|font)>', '', h)
    h = re.sub(r'\s+', ' ', h).strip()
    h = re.sub(r'<p>(?:&nbsp;|\s|<br>)*</p>', '', h)
    return h

def build():
    os.makedirs(os.path.join(OUT, 'files'), exist_ok=True); os.makedirs(IMG, exist_ok=True)
    d = json.load(open(os.path.join(SRC, 'steps_all.json')))
    lessons = []; used = set()
    for u in range(1, len(d['units']) + 1):
        L = d['lessons'][str(d['units'][str(u)]['lesson'])]; out = []
        for k, sid in enumerate(L['steps'], 1):
            s = d['steps'][str(sid)]; name = s['block']['name']; tid = f'{u}.{k}'
            if name == 'video': out.append({'type': 'video', 'title': 'Видеоразбор'}); continue
            h = clean(s['block']['text'] or '')
            h = re.sub(r'<details> ?<summary>Видеоразбор</summary>.*?</details>', '', h, flags=re.S)
            h = re.sub(r'<p>(?:<[^>]+>|\s)*PRO100 ЕГЭ информатика ЕГЭ(?:<[^>]+>|\s)*</p>', '', h)
            h = re.sub(r'<p>(?:<[^>]+>|\s)*🎬 Видеоразбор:.*?</p>', '', h, flags=re.S)
            h = re.sub(r'<a href="[^"]*fipi[^"]*">(.*?)</a>', r'\1', h, flags=re.S)
            files = []
            def a(m):
                f = put(H.unescape(m.group(1)), tid)
                if f['name'] not in [x['name'] for x in files]: files.append(f)
                return f'<a href="{f["href"]}" target="_blank" rel="noopener">{m.group(2)}</a>'
            h = re.sub(r'<a href="([^"]*)">(.*?)</a>', a, h, flags=re.S)
            n = [0]
            def img(m):
                n[0] += 1; fn = f'img3.{tid}-{n[0]}.png'
                shutil.copy(os.path.join(SRC, 'img', fn), os.path.join(IMG, fn)); return f'<img src="img/{fn}" alt="">'
            h = re.sub(r'<img[^>]*>', img, h)
            assert not re.search(r'stepik|ucarecdn|pro100|kompege|google|fipi\.ru|youtu|rutube|vk\.com', h, re.I), tid
            blocks = ([{'t': 'file', 'files': files}] if files else []) + to_blocks(h)
            if name == 'text': out.append({'type': 'text', 'blocks': blocks}); continue
            assert name in ('number', 'string'), (tid, name)
            used.add(tid)
            fld = {'label': 'Ответ', 'n': 1}
            out.append({'type': 'fill', 'blocks': blocks, 'fields': [fld], 'answer': [[ANS[tid]]]})
        lessons.append({'num': f'{NUM}.{u}', 'title': L['title'], 'steps': out})
    extra = set(ANS) - used
    course = {'id': 'ege-inf', 'title': 'ЕГЭ по информатике', 'section': {'num': NUM, 'title': '№ 3 Базы данных', 'lessons': lessons}}
    open(os.path.join(HERE, 'course.js'), 'w').write('/* Данные курса № 3. Собирается скриптом src/3/build3.py */\nwindow.COURSE = ' + json.dumps(course, ensure_ascii=False, indent=1) + ';\n')
    print('уроков', len(lessons), 'шагов', sum(len(l['steps']) for l in lessons), 'задач', len(used), 'ответы без задачи:', sorted(extra))

if __name__ == '__main__': build()
