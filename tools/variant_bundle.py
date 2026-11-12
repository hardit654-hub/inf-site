"""Собирает папку для загрузки варианта(ов) в кабинет учителя (закрытые материалы).
Вход: tasks.json и img/ от tools/pdf2tasks.py, папка с файлами к заданиям (3.ods, 17.txt, …).
Выход: папка с manifest.json, img/, files/. Её выбирают в кабинете → «Варианты» → «Загрузить».
Материалы хранятся в базе на хостинге и выдаются только вошедшим ученикам; в репозиторий не попадают.

python3 tools/variant_bundle.py --tasks out/tasks.json --files zip/ --out bundle/ \
   --mid sg2627-1 --cid sg2627 --num 1 --title "СтатГрад · Тренировочная работа № 1 (03.11.2026)" \
   [--note 24="текст пометки"]"""
import argparse, json, os, re, shutil, html as H

def fsize(n):
    return f'{n / 1048576:.1f} МБ'.replace('.', ',') if n >= 1048576 else f'{max(1, round(n / 1024))} КБ'

def label(n, h):
    t = re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', re.sub(r'<table.*?</table>', ' ', h, flags=re.S)))).strip()
    qs = [s for s in re.split(r'(?<=[.?!])\s+', t) if re.search(r'Определите|Найдите|Укажите|Сколько|Какое|Какую|Чему|Для какого|Напишите', s)]
    s = re.sub(r'\s+([,.;:?])', r'\1', qs[0] if qs else t)
    s = s if len(s) <= 100 else s[:97].rstrip() + '…'
    return f'№ {n}. {s}'

def fields_for(ans, n):
    rows = [r.strip() for r in ans.split(';') if r.strip()]
    if len(rows) > 1:
        return [{'label': f'{i + 1})', 'n': 1} for i in range(len(rows))], [[r] for r in rows]
    parts = ans.split()
    f = {'label': 'Ответ', 'n': len(parts)}
    if re.search(r'[^\d\s.,\-]', ans): f['txt'] = 1
    return [f], [parts]

def main():
    ap = argparse.ArgumentParser()
    for a in ('tasks', 'files', 'out', 'mid', 'cid', 'num', 'title'): ap.add_argument('--' + a, required=True)
    ap.add_argument('--series', default='СтатГрад')
    ap.add_argument('--note', action='append', default=[])
    a = ap.parse_args()
    notes = dict(x.split('=', 1) for x in a.note)
    src = json.load(open(a.tasks))
    base = os.path.dirname(os.path.abspath(a.tasks))
    shutil.rmtree(a.out, ignore_errors=True); os.makedirs(os.path.join(a.out, 'img')); os.makedirs(os.path.join(a.out, 'files'))
    url = lambda name: f'../api/index.php?action=mfile&m={a.mid}&f={name}'
    files = {}
    for fn in sorted(os.listdir(a.files)):
        p = os.path.join(a.files, fn)
        if os.path.isfile(p) and not fn.startswith('.'):
            m = re.match(r'(\d+)', fn)
            if m: files.setdefault(int(m.group(1)), []).append(fn)
            shutil.copy(p, os.path.join(a.out, 'files', fn))
    lessons, cat_lessons = [], []
    for li, (var, tasks) in enumerate(src['variants'].items(), 1):
        ans = {int(k): v for k, v in src['answers'].get(var, {}).items()}
        steps = []
        for t in tasks:
            h = t['html']
            for i, m in enumerate(re.findall(r'src="(img/[^"]+)"', h), 1):
                new = f'v{li}-{t["n"]}-{i}.png'
                shutil.copy(os.path.join(base, m), os.path.join(a.out, 'img', new))
                h = h.replace(f'src="{m}"', f'src="{url("img/" + new)}"')
            blocks = []
            if t['file'] and files.get(t['n']):
                blocks.append({'t': 'file', 'files': [{'name': fn, 'href': url('files/' + fn), 'size': fsize(os.path.getsize(os.path.join(a.files, fn)))} for fn in files[t['n']]]})
            blocks.append({'t': 'html', 'v': h})
            a_ = ans.get(t['n'], '')
            note = notes.get(str(t['n']))
            if not a_ or not re.search(r'\d|^[a-z]+$', a_) or note:
                msg = note or f'В ответах к варианту написано: «{H.escape(a_)}». Проверки ответа нет.'
                blocks.insert(0, {'t': 'html', 'v': f'<div class="vnote">⚠️ {msg}</div>'})
                steps.append({'type': 'text', 'blocks': blocks}); continue
            fl, an = fields_for(a_, t['n'])
            steps.append({'type': 'fill', 'blocks': blocks, 'fields': fl, 'answer': an})
        title = f'Вариант {var}'
        lessons.append({'num': str(li), 'title': title, 'steps': steps})
        cat_lessons.append({'num': str(li), 'title': title, 'steps': ['task' if s['type'] == 'fill' else s['type'] for s in steps],
                            'labels': [label(t['n'], t['html']) if s['type'] == 'fill' else '' for t, s in zip(tasks, steps)]})
    short = a.title.split(' · ', 1)[-1]
    course = {'id': a.cid, 'title': a.series, 'section': {'num': int(a.num), 'title': short, 'lessons': lessons}}
    catalog = {'key': f'course-{a.cid}-s{a.num}', 'title': a.title, 'url': f'../sg/?m={a.mid}', 'lessons': cat_lessons, 'kind': 'variant'}
    json.dump({'mid': a.mid, 'title': a.title, 'course': course, 'catalog': catalog}, open(os.path.join(a.out, 'manifest.json'), 'w'), ensure_ascii=False)
    n = sum(1 for l in lessons for s in l['steps'] if s['type'] == 'fill')
    print('вариантов', len(lessons), 'задач с проверкой', n, 'файлов', sum(len(v) for v in files.values()))

if __name__ == '__main__': main()
