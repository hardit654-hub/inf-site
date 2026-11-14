"""Раздел «Системы счисления» курса ЕГЭ: шаги исходного курса (раздел 17), текст без изменений.
Картинки — из sources/17. Ответы проверяются расчётом.
Запуск: python3 src/17/build17.py <папка с raw/steps.json>"""
import json, re, os, sys, shutil, html as H
RAW = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.dirname(HERE))
from stepik_conv import to_blocks
SRC = os.path.join(ROOT, 'sources/17'); OUT = os.path.join(ROOT, 'site/ege-17')
TITLES = ['Системы счисления, чётко и по делу', 'Перевод в десятичную систему счисления', 'Перевод из десятичной системы счисления',
          'Очень важно для КЕГЭ', 'Сложение и вычитание в различных системах счисления', 'Полезные лайфхаки']

def to(n, b):
    d = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; s = ''
    while True:
        s = d[n % b] + s; n //= b
        if n == 0: return s
# ответы, посчитанные заново (сверяются с правильными попытками там, где они есть)
CALC = {
 '17.1.5': '10', '17.1.6': '123', '17.1.7': '7',
 '17.2.3': str(int('1101', 2)), '17.2.4': str(int('1101', 3)), '17.2.5': str(int('333', 4)), '17.2.6': str(int('20', 18)), '17.2.7': '9',
 '17.3.4': to(1234567, 2)[-1], '17.3.5': to(120, 8)[-1], '17.3.6': to(12, 2), '17.3.7': to(15, 9), '17.3.8': to(19, 9), '17.3.9': to(1024, 2), '17.3.10': to(6868, 7),
 '17.4.3': 'F', '17.4.4': to(21, 16), '17.4.5': to(16, 16), '17.4.6': str(0xDED), '17.4.7': str(0xBABA), '17.4.8': str(int('1000111010101', 2)),
 '17.4.9': to(0x4552DCCDE, 8), '17.4.10': to(int('123', 5), 16),
 '17.5.2': to(int('1110', 2) + int('110', 2), 2), '17.5.3': to(int('567', 8) + int('765', 8), 8), '17.5.5': to(int('6354', 8) + int('743', 8), 8),
 '17.5.6': to(0xABC + 0x789, 16), '17.5.8': to(int('11100100', 2) + int('1101001', 2), 8), '17.5.9': str(int('12', 3) + int('21', 3)),
 '17.5.10': to(int('1101', 2) - int('101', 2), 2), '17.5.11': to(int('1100', 2) - int('111', 2), 2), '17.5.13': to(int('1101', 2) - int('11', 2), 2),
 '17.5.14': to(int('301', 8) - int('46', 8), 8), '17.5.16': to(int('321', 8) - int('46', 8), 8),
 '17.6.3': to(5 ** 7, 5), '17.6.4': to(16 ** 3, 16), '17.6.5': to(8 ** 3 - 8, 8), '17.6.6': to(8 ** 3 - 1, 8), '17.6.7': to(3 ** 10 - 3 ** 7, 3), '17.6.8': to(16 ** 3 - 1, 16),
}
HEX = {'17.4.3', '17.4.4', '17.4.5', '17.4.10', '17.5.6', '17.6.4', '17.6.8'}  # ответ может содержать буквы
# задания на сопоставление и выбор (варианты — из исходного курса)
MATCH = {
 '17.1.3': [('Позиционная система счисления', 'Вес цифры зависит от её позиции в числе'),
            ('Непозиционная система счисления', 'Цифра на любой позиции в числе имеет одинаковый вес')],
 '17.1.4': [('Набор символов, используемый в позиционной системе счисления', 'Алфавит'),
            ('Количество символов в алфавите позиционной системы счисления', 'Основание'),
            ('Место цифры в записи числа в позиционной системе счисления', 'Разряд')],
}
CHOICE = {'17.1.8': (['1234 в 5-ричной системе счисления', '15 в 5-ричной системе счисления',
                      '1234000000000 в 8-ричной системе счисления', '99100941 в 11-ричной системе счисления'], [0, 2, 3])}

KEEP = {'src', 'href', 'colspan', 'rowspan', 'alt'}
def katexify(t):
    """Формулы писались под MathJax; для KaTeX: индекс после \\, ставим на пустую группу, русские слова — в \\text{}."""
    t = t.replace('\u200b', '').strip()
    t = re.sub(r'\\,_', r'\\,{}_', t)
    return re.sub(r'([А-Яа-яЁё]+)', r'\\text{\1}', t)
def color(attrs):
    """Цвет текста сохраняем — им в теории связаны цифры и разряды."""
    m = re.search(r'style="[^"]*?color:\s*(#[0-9a-fA-F]{3,6})', attrs)
    return f' style="color:{m.group(1)}"' if m and m.group(1).lower() not in ('#fff', '#ffffff') else ''
def clean(h):
    # формулы: <span class="math-tex">\(…\)</span> -> <span class="tex">…</span> (рисует KaTeX)
    h = re.sub(r'<span class="math-tex">\s*\\\((.*?)\\\)\s*</span>', lambda m: '\x01' + katexify(m.group(1)) + '\x02', h, flags=re.S)
    # водяной знак исходного курса — убираем
    h = re.sub(r'<p[^>]*>(?:\s|<[^>]+>)*PRO100 ЕГЭ информатика ЕГЭ(?:\s|<[^>]+>)*</p>', '', h)
    h = re.sub(r'<(\w+)((?:\s+[\w-]+(?:="[^"]*")?)*)\s*(/?)>',
               lambda m: '<' + m.group(1) + ''.join(f' {a}="{v}"' for a, v in re.findall(r'([\w-]+)="([^"]*)"', m.group(2))
                                                     if a in KEEP) + color(m.group(2)) + m.group(3) + '>', h)
    for _ in range(3):  # цветные фрагменты — в метки, чтобы общая обработка не сняла </span>
        h = re.sub(r'<span style="color:(#\w+)">((?:(?!<span).)*?)</span>', '\x03\\1\x04\\2\x05', h, flags=re.S)
        h = re.sub(r'<span>((?:(?!<span).)*?)</span>', r'\1', h, flags=re.S)
    h = re.sub(r'</?(div|font)>', '', h)
    h = re.sub(r'\s+', ' ', h).strip()
    h = re.sub(r'<p>(?:&nbsp;|\s|<br>)*</p>', '', h)
    return h  # формулы пока в метках \x01…\x02: общая обработка удаляет </span>; ставим теги в самом конце (texfix)

def texfix(o):
    if isinstance(o, dict): return {k: texfix(v) for k, v in o.items()}
    if isinstance(o, list): return [texfix(x) for x in o]
    if isinstance(o, str): return re.sub('\x03(#\\w+)\x04', r'<span style="color:\1">', o).replace('\x05', '</span>').replace('\x01', '<span class="tex">').replace('\x02', '</span>')
    return o

def imgs(h, tid):
    n = [0]
    def r(m):
        n[0] += 1; name = f'{tid}-{n[0]}.png'; src = os.path.join(SRC, f'img{tid}-{n[0]}.png')
        if os.path.exists(src): shutil.copy(src, os.path.join(OUT, 'img', name)); return f'<img src="img/{name}" alt="">'
        return m.group(0)
    return re.sub(r'<img[^>]*>', r, h)

def build():
    os.makedirs(os.path.join(OUT, 'img'), exist_ok=True)
    steps = json.load(open(os.path.join(RAW, 'steps.json')))
    lessons = []; key = {}
    for n in range(1, 7):
        out = []
        for s in [x for x in steps if x['l'] == n]:
            tid = f'17.{n}.{s["k"]}'
            if s['name'] == 'video': out.append({'type': 'video', 'title': 'Видеоразбор'}); continue
            blocks = to_blocks(imgs(clean(s['text'] or ''), tid))
            if s['name'] == 'text': out.append({'type': 'text', 'blocks': blocks}); continue
            if s['name'] == 'matching':
                pairs = MATCH[tid]; opts = sorted({b for _, b in pairs})
                # проверка по правильной попытке: пары из набора задания
                out.append({'type': 'match', 'blocks': blocks, 'items': [a for a, _ in pairs], 'options': opts, 'answer': [opts.index(b) for _, b in pairs]})
                key[f'{n}:{len(out)}'] = (tid, '; '.join(f'{a} — {b}' for a, b in pairs)); continue
            if s['name'] == 'choice':
                opts, ans = CHOICE[tid]
                out.append({'type': 'choice', 'multi': True, 'blocks': blocks, 'options': opts, 'answer': ans})
                key[f'{n}:{len(out)}'] = (tid, ', '.join(opts[i] for i in ans)); continue
            ans = CALC[tid]
            ok = [y['r'] for y in (s['sub'] or []) if y['st'] == 'correct']
            if ok:
                got = str(ok[0].get('number', ok[0].get('text', ''))).strip()
                assert got.upper() == ans.upper(), (tid, got, ans)
            f = {'label': 'Ответ', 'n': 1}
            if tid in HEX: f['txt'] = 1
            out.append({'type': 'fill', 'blocks': blocks, 'fields': [f], 'answer': [[ans]]})
            key[f'{n}:{len(out)}'] = (tid, ans)
        lessons.append({'num': f'17.{n}', 'title': TITLES[n - 1], 'steps': out})
    lessons = texfix(lessons)
    course = {'id': 'ege-inf', 'title': 'ЕГЭ по информатике', 'section': {'num': 17, 'title': 'Системы счисления', 'lessons': lessons}}
    open(os.path.join(HERE, 'course.js'), 'w').write('/* Данные раздела «Системы счисления». Собирается скриптом src/17/build17.py */\nwindow.COURSE = ' + json.dumps(course, ensure_ascii=False, indent=1) + ';\n')
    json.dump(key, open(os.path.join(HERE, 'answers.json'), 'w'), ensure_ascii=False, indent=0)
    print('уроков', len(lessons), 'шагов', sum(len(l['steps']) for l in lessons), 'задач', sum(1 for l in lessons for s in l['steps'] if s['type'] != 'text' and s['type'] != 'video'))

if __name__ == '__main__': build()
