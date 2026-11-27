"""Курс № 9 «Работа в электронных таблицах»: шаги из Stepik (раздел 439767) — текст без изменений.
Вложения и картинки — из sources/9. Запуск: python3 src/9/build9.py"""
import json, re, os, sys, shutil, html as H
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from stepik_conv import to_blocks
from answers9 import ANS
SRC = os.path.join(ROOT, 'sources/9'); OUT = os.path.join(ROOT, 'site/ege-45'); NUM = 45
IMG = os.path.join(ROOT, 'site/ege/img')  # страница курса берёт картинки из ege/img
# папки Google Drive из 4.2 и 4.4 -> файл в них
FOLDERS = {'14NqbsfSGIkOsRFZhbxZVlRMLjfY5Iwe7': '1yfzQozJ_hKziRGiE2pz9L7bJ8ett_ENf',
           '1J_YMBBGyAW0uKp_x-TrLS4kniW6zsmZP': '1yMgtuQkzb5ZD-jxxX97uCxM_f8K3-drI'}
NAMES = {}  # исходный файл -> имя на сайте

def fsize(n): return f'{n / 1048576:.1f} МБ'.replace('.', ',') if n >= 1048576 else f'{max(1, round(n / 1024))} КБ'

def put(href, tid):
    m = re.search(r'/(?:d|folders)/([\w-]+)', href)
    if m and 'google.com' in href:
        gid = FOLDERS.get(m.group(1), m.group(1)); src = 'g_' + gid
        p = os.path.join(SRC, 'files', src)
        ext = '.xlsx' if open(p, 'rb').read(2) == b'PK' else '.xls'
        name = NAMES.setdefault(src, f'9-{tid}{ext}')
    elif 'pro100ege.org' in href or 'kompege.ru' in href:
        src = href.rsplit('/', 1)[1]; p = os.path.join(SRC, 'files', src)
        name = NAMES.setdefault(src, '9-' + src.lstrip('9-_') if not src.startswith('9') else src)
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
            h = re.sub(r'<a href="[^"]*fipi[^"]*">(.*?)</a>', r'\1', h, flags=re.S)
            files = []
            def a(m):
                f = put(H.unescape(m.group(1)), tid)
                if f['name'] not in [x['name'] for x in files]: files.append(f)
                return f'<a href="{f["href"]}" target="_blank" rel="noopener">{m.group(2)}</a>'
            h = re.sub(r'<a href="([^"]*)">(.*?)</a>', a, h, flags=re.S)
            n = [0]
            def img(m):
                n[0] += 1; fn = f'img9.{tid}-{n[0]}.png'
                shutil.copy(os.path.join(SRC, fn), os.path.join(IMG, fn)); return f'<img src="img/{fn}" alt="">'
            h = re.sub(r'<img[^>]*>', img, h)
            assert not re.search(r'stepik|ucarecdn|pro100|kompege|google|fipi\.ru|youtu|rutube|vk\.com', h, re.I), tid
            blocks = ([{'t': 'file', 'files': files}] if files else []) + to_blocks(h)
            if name == 'text': out.append({'type': 'text', 'blocks': blocks}); continue
            assert name in ('number', 'string'), (tid, name)
            used.add(tid)
            fld = {'label': 'Ответ', 'n': 1}
            if name == 'string': fld['txt'] = 1
            out.append({'type': 'fill', 'blocks': blocks, 'fields': [fld], 'answer': [[ANS[tid]]]})
        lessons.append({'num': f'{NUM}.{u}', 'title': L['title'], 'steps': out})
    extra = set(ANS) - used
    course = {'id': 'ege-inf', 'title': 'ЕГЭ по информатике', 'section': {'num': NUM, 'title': '№ 9 Работа в электронных таблицах', 'lessons': lessons}}
    open(os.path.join(HERE, 'course.js'), 'w').write('/* Данные курса № 9. Собирается скриптом src/9/build9.py */\nwindow.COURSE = ' + json.dumps(course, ensure_ascii=False, indent=1) + ';\n')
    print('уроков', len(lessons), 'шагов', sum(len(l['steps']) for l in lessons), 'задач', len(used), 'ответы без задачи:', sorted(extra))

if __name__ == '__main__': build()
