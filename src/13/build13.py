"""Раздел «№ 13 IP-адреса и маски»: шаги исходного курса (раздел 29) — текст без изменений,
плюс задачи из домашней работы открытого курса КЕГЭ (занятие 9), которых нет в исходном курсе.
Картинки — из sources/29. Ответы: правильные попытки; где их нет — перебор по ipaddress.
Запуск: python3 src/13/build13.py <папка с raw/steps.json и raw/kompege.json>"""
import json, re, os, sys, shutil, html as H
from ipaddress import ip_network
RAW = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.dirname(HERE))
from stepik_conv import to_blocks
SRC = os.path.join(ROOT, 'sources/29'); OUT = os.path.join(ROOT, 'site/ege-13')

TITLES = ['Теория по IP-адресам Ⅰ', 'Теория по IP-адресам Ⅱ', 'Устное решение Ⅰ', 'Устное решение Ⅱ',
          'Решение в Python', 'Тренировка', 'Дополнительные задачи']
# ответы, которых нет среди правильных попыток — посчитаны перебором (см. check())
CALC = {'29.3.11': '2796202', '29.3.14': '4', '29.7.7': '16'}
# задачи КЕГЭ (номер в домашке -> урок), повторы исходного курса пропущены: 2 (= 29.4.14), 14 (= 29.6.7)
KOMPEGE = {1: 6, 3: 6, 4: 6, 10: 6, 13: 6, 15: 6, 5: 7, 6: 7, 7: 7, 8: 7, 9: 7, 11: 7, 12: 7}
VIDEO = {'29.1.2': 'Сети и IP-адреса', '29.1.8': 'Адрес сети, номер узла и маска', '29.2.2': 'Сколько в сети IP-адресов',
         '29.3.3': 'Разбор: сумма единиц чётна', '29.3.4': 'Разбор: количество единиц', '29.3.9': 'Разбор: считаем сочетаниями',
         '29.4.3': 'Разбор: наибольший адрес компьютера', '29.4.9': 'Разбор: байт маски'}

def check():
    b = lambda ip: bin(int(ip))[2:].zfill(32)
    assert sum(1 for ip in ip_network('115.192.0.0/255.192.0.0') if b(ip).count('1') % 3) == 2796202
    assert sum(1 for ip in ip_network('202.75.38.152/29') if '111' in b(ip)) == 4
    ok = [A for A in range(256) if all(b(ip)[:16].count('1') <= b(ip)[16:].count('1') for ip in ip_network(f'32.0.{A}.6/20', strict=False))]
    assert ok[0] == 16

KEEP = {'src', 'href', 'colspan', 'rowspan', 'alt'}
def katexify(t):
    t = t.replace('\u200b', '').strip()
    return re.sub(r'([А-Яа-яЁё]+)', r'\\text{\1}', t)
def clean(h):
    h = re.sub(r'<span class="math-tex">\s*\\\((.*?)\\\)\s*</span>', lambda m: '\x01' + katexify(m.group(1)) + '\x02', h, flags=re.S)
    h = re.sub(r'<(\w+)((?:\s+[\w-]+(?:="[^"]*")?)*)\s*(/?)>',
               lambda m: '<' + m.group(1) + ''.join(f' {a}="{v}"' for a, v in re.findall(r'([\w-]+)="([^"]*)"', m.group(2)) if a in KEEP) + m.group(3) + '>', h)
    h = re.sub(r'</?(span|div|font)>', '', h)
    h = re.sub(r'\s+', ' ', h).strip()
    h = re.sub(r'<p>(?:&nbsp;|\s|<br>)*</p>', '', h)
    return h
def texfix(o):
    if isinstance(o, dict): return {k: texfix(v) for k, v in o.items()}
    if isinstance(o, list): return [texfix(x) for x in o]
    if isinstance(o, str): return o.replace('\x01', '<span class="tex">').replace('\x02', '</span>')
    return o
def imgs(h, tid):
    n = [0]
    def r(m):
        n[0] += 1; name = f'{tid}-{n[0]}.png'; src = os.path.join(SRC, f'img{tid}-{n[0]}.png')
        if os.path.exists(src): shutil.copy(src, os.path.join(OUT, 'img', name)); return f'<img src="img/{name}" alt="">'
        return m.group(0)
    return re.sub(r'<img[^>]*>', r, h)
def kclean(h):
    h = re.sub(r'\s(class|style|width|height|border|cellpadding|cellspacing|align)="[^"]*"', '', h)
    h = re.sub(r'</?(span|font|div)>', '', h)
    return re.sub(r'\s+', ' ', h).strip()

def build():
    check()
    os.makedirs(os.path.join(OUT, 'img'), exist_ok=True)
    steps = json.load(open(os.path.join(RAW, 'steps.json')))
    kom = json.load(open(os.path.join(RAW, 'kompege.json')))['tasks']
    lessons = []; key = {}
    for n in range(1, 8):
        out = []
        for s in [x for x in steps if x['l'] == n]:
            tid = f'29.{n}.{s["k"]}'
            if s['name'] == 'video': out.append({'type': 'video', 'title': VIDEO.get(tid, 'Видеоразбор')}); continue
            blocks = to_blocks(imgs(clean(s['text'] or ''), tid))
            if s['name'] == 'text': out.append({'type': 'text', 'blocks': blocks}); continue
            ok = [y['r'] for y in (s['sub'] or []) if y['st'] == 'correct']
            if s['name'] == 'choice':
                opts = s['opts']['options']; ans = [i for i, v in enumerate(ok[0]['choices']) if v]
                multi = s['opts']['is_multiple_choice']
                st = {'type': 'choice', 'blocks': blocks, 'options': opts, 'answer': ans if multi else ans[0]}
                if multi: st['multi'] = True
                out.append(st); key[f'{n}:{len(out)}'] = (tid, ', '.join(opts[i] for i in ans)); continue
            if s['name'] == 'fill-blanks':
                a = ok[0]['blanks']
                out.append({'type': 'fill', 'blocks': blocks, 'fields': [{'label': 'Наименьшее', 'n': 1}, {'label': 'Наибольшее', 'n': 1}], 'answer': [[a[0]], [a[1]]]})
                key[f'{n}:{len(out)}'] = (tid, ' и '.join(a)); continue
            ans = CALC.get(tid) or str(ok[0].get('text', ok[0].get('number', ''))).strip()
            assert ans, tid
            f = {'label': 'Ответ', 'n': 1}
            if re.search(r'[A-Za-zА-Яа-я]', ans): f['txt'] = 1
            out.append({'type': 'fill', 'blocks': blocks, 'fields': [f], 'answer': [[ans]]})
            key[f'{n}:{len(out)}'] = (tid, ans)
        for i, ln in KOMPEGE.items():
            if ln != n: continue
            t = kom[i - 1]
            out.append({'type': 'fill', 'blocks': to_blocks(kclean(t['text'])), 'fields': [{'label': 'Ответ', 'n': 1}], 'answer': [[str(t['key'])]]})
            key[f'{n}:{len(out)}'] = (f'КЕГЭ {i}', str(t['key']))
        lessons.append({'num': f'29.{n}', 'title': TITLES[n - 1], 'steps': out})
    lessons = texfix(lessons)
    course = {'id': 'ege-inf', 'title': 'ЕГЭ по информатике', 'section': {'num': 29, 'title': '№ 13 IP-адреса и маски', 'lessons': lessons}}
    open(os.path.join(HERE, 'course.js'), 'w').write('/* Данные раздела № 13. Собирается скриптом src/13/build13.py */\nwindow.COURSE = ' + json.dumps(course, ensure_ascii=False, indent=1) + ';\n')
    json.dump(key, open(os.path.join(HERE, 'answers.json'), 'w'), ensure_ascii=False, indent=0)
    print('уроков', len(lessons), 'шагов', sum(len(l['steps']) for l in lessons), 'задач', sum(1 for l in lessons for s in l['steps'] if s['type'] in ('fill', 'choice')))

if __name__ == '__main__': build()
