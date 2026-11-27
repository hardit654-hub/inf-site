"""Курс «Электронные таблицы» (LibreOffice Calc и MS Excel): шаги из Stepik (раздел 439766) — текст без изменений.
Выгрузка — sources/office/steps_all.json, вложения и картинки — sources/excel. Запуск: python3 src/excel/build_excel.py"""
import json, re, os, sys, shutil, html as H
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.dirname(HERE)); sys.path.insert(0, HERE)
from stepik_conv import to_blocks
from answers_excel import ANS, CHOICE
DATA = os.path.join(ROOT, 'sources/office/steps_all.json'); SRC = os.path.join(ROOT, 'sources/excel')
OUT = os.path.join(ROOT, 'site/excel'); NUM = 1
# id файла в исходной ссылке -> имя в sources/excel/files (и на сайте)
FILES = {
    '1pnnjM0HoTwitt1u_kuoSqYg8LYSzWaDp': 'summ-min-maks-srznach-schet.ods',
    '1-IsAhOn1dUigAQeE__ZoF0qr1doIeMLL': 'kvadrat-s-chislami.ods',
    '1Pl3UDCT1P4sBrF8kopr4CrReDTwn1s5I': 'funkcii-schet.ods',
    '18dxubVuHbtJqwqpvI1M_Sm3rtmos9mNL': 'schetesli-summesli.ods',
    '1x8C2I1ZkhP6ESTWa8K4Xi5_DsHKgrN9O': 'scheteslimn.ods',
    '1X_5zHxiY0mNoOutBd-x9krg3TRKMnUtO': 'uslovie-v-schetesli.ods',
    '1seiAYHCEnRicuN7ydlmI87JIe7b5mZkR': 'filtr-sortirovka.ods',
    '1lpwcbcXv5USVeMNFaODsgm5oArxWqHqG': 'ostat-priemy.ods',
    '1GDrJ-mR83T-8_VWg4SwoX533eYR-V9jj': 'naimenshiy-naibolshiy.ods',
    '1XMEs6rm0j8SJA_q-TeOmrs1_KNC4QpN7': 'naimenshiy-naibolshiy-4.ods',
    '1dTj-eUQaiQu5m1xZHh9oGbKjSp7Bt-8-': 'schetchiki.ods',
    '1ZR1sIMoMe6QqLlUOlB8XwPglzyN9uOSh': 'vpr1.ods',
    '17f26VTDRKF_uJd2sdJB5kUWtr3GZfjAB': 'vpr-neskolko-listov.ods',
}

def fsize(n): return f'{n / 1048576:.1f} МБ'.replace('.', ',') if n >= 1048576 else f'{max(1, round(n / 1024))} КБ'

def put(href):
    for fid, name in FILES.items():
        if fid in href:
            p = os.path.join(SRC, 'files', name)
            shutil.copy(p, os.path.join(OUT, 'files', name))
            return {'name': name, 'href': 'files/' + name, 'size': fsize(os.path.getsize(p))}
    return None

KEEP = {'src', 'href', 'colspan', 'rowspan', 'alt'}
def clean(h):
    h = re.sub(r'<(\w+)((?:\s+[\w-]+(?:="[^"]*")?)*)\s*(/?)>',
               lambda m: '<' + m.group(1) + ''.join(f' {a}="{v}"' for a, v in re.findall(r'([\w-]+)="([^"]*)"', m.group(2)) if a in KEEP) + m.group(3) + '>', h)
    h = re.sub(r'</?(span|div|font)>', '', h)
    h = re.sub(r'\s+', ' ', h).strip()
    h = re.sub(r'<p>(?:&nbsp;|\s|<br>)*</p>', '', h)
    return h

def build():
    os.makedirs(os.path.join(OUT, 'files'), exist_ok=True); os.makedirs(os.path.join(OUT, 'img'), exist_ok=True)
    d = json.load(open(DATA))
    lessons = []; used = set()
    for u in range(1, len(d['units']) + 1):
        L = d['lessons'][str(d['units'][str(u)]['lesson'])]; out = []
        if u == 1:
            # вместо ссылок на уроки по MS Excel — место под своё видео
            out.append({'type': 'video', 'key': 'video-excel', 'title': 'Уроки по Excel'})
            lessons.append({'num': f'{NUM}.{u}', 'label': str(u), 'title': L['title'], 'steps': out}); continue
        for k, sid in enumerate(L['steps'], 1):
            s = d['steps'][str(sid)]; name = s['block']['name']; tid = f'{u}.{k}'
            if name == 'video': out.append({'type': 'video', 'title': 'Видеоразбор'}); continue
            h = clean(s['block']['text'] or '')
            h = re.sub(r'<details> ?<summary>Видеоразбор</summary>.*?</details>', '', h, flags=re.S)
            h = re.sub(r'<p>(?:<[^>]+>|\s)*PRO100 ЕГЭ информатика ЕГЭ(?:<[^>]+>|\s)*</p>', '', h)
            files = []
            def a(m):
                f = put(H.unescape(m.group(1)))
                if f is None: return f'<a href="{m.group(1)}" target="_blank" rel="noopener">{m.group(2)}</a>'
                if f['name'] not in [x['name'] for x in files]: files.append(f)
                return f'<a href="{f["href"]}" target="_blank" rel="noopener">{m.group(2)}</a>'
            h = re.sub(r'<a href="([^"]*)">(.*?)</a>', a, h, flags=re.S)
            n = [0]
            def img(m):
                n[0] += 1; fn = f'imgx.{tid}-{n[0]}.png'
                shutil.copy(os.path.join(SRC, fn), os.path.join(OUT, 'img', fn)); return f'<img src="img/{fn}" alt="">'
            h = re.sub(r'<img[^>]*>', img, h)
            assert not re.search(r'stepik|ucarecdn|pro100|google|fipi\.ru|youtu|rutube|vk\.com', h, re.I), tid
            blocks = ([{'t': 'file', 'files': files}] if files else []) + to_blocks(h)
            if name == 'text': out.append({'type': 'text', 'blocks': blocks}); continue
            used.add(tid)
            if name == 'choice':
                opts, ok = CHOICE[tid]
                out.append({'type': 'choice', 'blocks': blocks, 'options': opts, 'answer': ok}); continue
            assert name in ('number', 'string'), (tid, name)
            fld = {'label': 'Ответ', 'n': 1}
            if name == 'string': fld['txt'] = 1
            out.append({'type': 'fill', 'blocks': blocks, 'fields': [fld], 'answer': [[ANS[tid]]]})
        lessons.append({'num': f'{NUM}.{u}', 'label': str(u), 'title': L['title'], 'steps': out})
    extra = (set(ANS) | set(CHOICE)) - used
    course = {'id': 'excel', 'title': 'Электронные таблицы', 'sections': [
        {'num': NUM, 'title': 'Знакомство с LibreOffice Calc и MS Excel', 'lessons': lessons}]}
    open(os.path.join(HERE, 'course.js'), 'w').write('/* Данные курса «Электронные таблицы». Собирается скриптом src/excel/build_excel.py */\nwindow.COURSE = ' + json.dumps(course, ensure_ascii=False, indent=1) + ';\n')
    print('уроков', len(lessons), 'шагов', sum(len(l['steps']) for l in lessons), 'задач', len(used), 'ответы без задачи:', sorted(extra))

if __name__ == '__main__': build()
