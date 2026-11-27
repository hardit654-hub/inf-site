"""Курс № 10 «Поиск слов»: шаги из Stepik (раздел 783741) — текст без изменений.
Вложения и картинки — из sources/10. Запуск: python3 src/10/build10.py"""
import json, re, os, sys, shutil, html as H
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from stepik_conv import to_blocks
from answers10 import ANS
SRC = os.path.join(ROOT, 'sources/10'); OUT = os.path.join(ROOT, 'site/ege-43'); NUM = 43
IMG = os.path.join(ROOT, 'site/ege/img')  # страница курса берёт картинки из ege/img
TITLES = {1: 'Стандартные задачи', 2: 'Сноски, поиск в составе слов', 3: 'Сложные слова, соединенные дефисом',
          4: 'Тренировка', 5: 'Сложные задачи'}
# часть адреса исходной ссылки -> (файл в sources/10/files, имя на сайте)
FILES = [
    ('uploads/10-1.docx', '10-1.docx', '10-vor.docx'),
    ('uploads/10-0.docx', '10-0.docx', '10-onegin.docx'),
    ('1Kmowr5U', 'g_1Kmowr5UFXSntMTt8r1pTmLVj00VROq2x', '10-poedinok.docx'),
    ('1v-drnJ', 'g_1Kmowr5UFXSntMTt8r1pTmLVj00VROq2x', '10-poedinok.docx'),
    ('1tHA1bMp', 'g_1Kmowr5UFXSntMTt8r1pTmLVj00VROq2x', '10-poedinok.docx'),
    ('11Rwc1AC', 'g_1Kmowr5UFXSntMTt8r1pTmLVj00VROq2x', '10-poedinok.docx'),
    ('15pNOU7Uuz6SxOTswNAMmKBReFUUQYdrG', 'g_1Kmowr5UFXSntMTt8r1pTmLVj00VROq2x', '10-poedinok.docx'),
    ('uploads/10-286.docx', '10-286.docx', '10-vojna-i-mir.docx'),
    ('_10.odt', '301_10.odt', '10-vojna-i-mir.odt'),
    ('uploads/1_10.odt', '1_10.odt', '10-vor-odt.odt'),
    ('10-106_fHm5bmb', '10-106_fHm5bmb.docx', '10-dubrovsky.docx'),
    ('uploads/10-141.docx', '10-141.docx', '10-gogol-vecher.docx'),
    ('15rQE7L', 'g_15rQE7L-e_a831JIfahsfZXYW6vB0GBxF', '10-sevastopol.docx'),
    ('1O8ozaUl', 'g_1O8ozaUlwgyiYl6KpD6Ca3inbQzfSoVsb', '10-sevastopol-2.docx'),
    ('1QbHFKLL', 'g_1QbHFKLL7Fx-UMFHxt0hM-b_H4AaL17Mm', '10-nekrasov.docx'),
    ('179A9kda', 'g_179A9kdaFLrMph427yRmHsS9l8pZ9kbrt', '10-chekhov-futlyar.docx'),
    ('uploads/10-34.docx', '10-34.docx', '10-kapitanskaya.docx'),
    ('AGaTeH_9Q', '10-34.docx', '10-kapitanskaya.docx'),
    ('1JOWLk9b', '10-34.docx', '10-kapitanskaya.docx'),
    ('1IEnLfQ', 'g_1IEnLfQYztgQqNBAeE_ZZQjl_UY9oMk8C', '10-bulgakov-master.docx'),
    ('1blm7pl6', 'g_1IEnLfQYztgQqNBAeE_ZZQjl_UY9oMk8C', '10-bulgakov-master.docx'),
    ('IbdjYXHna', 'IbdjYXHna.doc', '10-bulgakov-sobache.doc'),
    ('DEMO_10', 'DEMO_10.odt', '10-demo.odt'),
    ('1aa2NmNQ', 'g_1aa2NmNQeoEJkN4Pj40Wydu-Np2yPPeW1', '10-poisk.docx'),
    ('1p4lcgsA', 'g_1p4lcgsAL9VBs23xrW44zKOyiImmvGDH2', '10-poedinok-1.doc'),
    ('4Xb_dTXyu', '4Xb_dTXyu.doc', '10-3.7.doc'),
    ('NJx7V7nVO', 'NJx7V7nVO.docx', '10-1.16.docx'),
    ('1C3qC3pM', 'g_1C3qC3pMWlfULFisKbvZtDAmd96pYwOYh', '10-fipi-301.zip'),
]

def fsize(n): return f'{n / 1048576:.1f} МБ'.replace('.', ',') if n >= 1048576 else f'{max(1, round(n / 1024))} КБ'

def put(href):
    for part, src, name in FILES:
        if part in href:
            p = os.path.join(SRC, 'files', src)
            shutil.copy(p, os.path.join(OUT, 'files', name))
            return {'name': name, 'href': 'files/' + name, 'size': fsize(os.path.getsize(p))}
    raise SystemExit('нет файла для ссылки ' + href)

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
    for u in range(1, 6):
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
                f = put(H.unescape(m.group(1)))
                if f['name'] not in [x['name'] for x in files]: files.append(f)
                return f'<a href="{f["href"]}" target="_blank" rel="noopener">{m.group(2)}</a>'
            h = re.sub(r'<a href="([^"]*)">(.*?)</a>', a, h, flags=re.S)
            n = [0]
            def img(m):
                n[0] += 1; fn = f'img10.{tid}-{n[0]}.png'
                shutil.copy(os.path.join(SRC, fn), os.path.join(IMG, fn)); return f'<img src="img/{fn}" alt="">'
            h = re.sub(r'<img[^>]*>', img, h)
            assert not re.search(r'stepik|ucarecdn|pro100|google|fipi\.ru|youtu|rutube|vk\.com', h, re.I), tid
            blocks = ([{'t': 'file', 'files': files}] if files else []) + to_blocks(h)
            if name == 'text': out.append({'type': 'text', 'blocks': blocks}); continue
            assert name == 'string', (tid, name)
            used.add(tid)
            out.append({'type': 'fill', 'blocks': blocks, 'fields': [{'label': 'Ответ', 'n': 1, 'txt': 1}], 'answer': [[ANS[tid]]]})
        lessons.append({'num': f'{NUM}.{u}', 'title': TITLES[u], 'steps': out})
    extra = set(ANS) - used
    course = {'id': 'ege-inf', 'title': 'ЕГЭ по информатике', 'section': {'num': NUM, 'title': '№ 10 Поиск слов', 'lessons': lessons}}
    open(os.path.join(HERE, 'course.js'), 'w').write('/* Данные курса № 10. Собирается скриптом src/10/build10.py */\nwindow.COURSE = ' + json.dumps(course, ensure_ascii=False, indent=1) + ';\n')
    print('уроков', len(lessons), 'шагов', sum(len(l['steps']) for l in lessons), 'задач', len(used), 'ответы без задачи:', sorted(extra))

if __name__ == '__main__': build()
