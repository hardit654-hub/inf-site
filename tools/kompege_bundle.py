"""Варианты из КЕГЭ (реальный ЕГЭ и т. п.) -> manifest.json для загрузки в кабинет («Варианты» → «Загрузить»).
Файлы и картинки кладутся рядом в папку files/ и img/ (имена: files/v<вариант>-<номер>[-A|-B].<ext>, img/<имя>).
python3 tools/kompege_bundle.py <kims.json> <папка> --mid ege2026 --cid ege-real --num 2026 --title "Реальный ЕГЭ 2026" --group real --year 2026"""
import argparse, json, os, re, html as H

def tex(h):
    return re.sub(r'\\\((.*?)\\\)', lambda m: '<span class="tex">' + H.escape(H.unescape(m.group(1)).strip(), quote=False) + '</span>', h, flags=re.S)

def clean(h):
    h = re.sub(r'\s(class|style|width|height|border|cellpadding|cellspacing)="[^"]*"', '', h)
    h = re.sub(r'</?(span|font|div)>', '', h)
    return tex(h).strip()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('kims'); ap.add_argument('out')
    ap.add_argument('--html', help='модуль с вёрсткой условий: TASKS[(вариант, номер)] = html')
    for a in ('mid', 'cid', 'num', 'title', 'group', 'year'): ap.add_argument('--' + a, required=True)
    a = ap.parse_args()
    kims = json.load(open(a.kims))
    HT = {}
    if a.html:
        import importlib.util
        sp = importlib.util.spec_from_file_location('ht', a.html); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m); HT = m.TASKS
    url = lambda name: f'../api/index.php?action=mfile&m={a.mid}&f={name}'
    lessons, cat = [], []
    for vi, v in enumerate(kims, 1):
        steps = []
        for pos, t in enumerate(v['tasks'], 1):
            h = HT[(vi, pos)] if (vi, pos) in HT else clean(t['text'])
            h = re.sub(r'src="https?://kompege\.ru/images/([^"]+)"', lambda m: f'src="{url("img/" + m.group(1))}"', h)
            blocks = []
            if t['files']:
                fl = []
                for j, f in enumerate(t['files']):
                    ext = re.search(r'\.\w+$', f).group(0)
                    suf = ('-' + 'AB'[j]) if len(t['files']) > 1 else ''
                    name = f'files/v{vi}-{pos}{suf}{ext}'
                    shown = f'{pos}{"_" + "AB"[j] if suf else ""}{ext}'
                    p = os.path.join(a.out, name)
                    fl.append({'name': shown, 'href': url(name) + '&n=' + shown, 'size': (f'{os.path.getsize(p) / 1048576:.1f} МБ'.replace('.', ',') if os.path.getsize(p) >= 1048576 else f'{max(1, round(os.path.getsize(p) / 1024))} КБ') if os.path.exists(p) else ''})
                blocks.append({'t': 'file', 'files': fl})
            blocks.append({'t': 'html', 'v': h})
            tb = t.get('table') or {}
            rows, cols = int(tb.get('rows') or 1), int(tb.get('cols') or 1)
            key = t['key'].replace('\\n', '\n')
            arows = [r.split() for r in key.split('\n') if r.strip()]
            answer = [(arows[i] if i < len(arows) else []) + [''] * 0 for i in range(rows)]
            answer = [(r + [''] * cols)[:cols] for r in answer]
            fields = [{'label': ('Ответ' if rows == 1 else f'{i + 1})'), 'n': cols} for i in range(rows)]
            if re.search(r'[A-Za-zА-Яа-я]', key): fields = [dict(f, txt=1) for f in fields]
            st = {'type': 'fill', 'no': pos, 'pts': 2 if pos in (26, 27) else 1, 'blocks': blocks, 'fields': fields, 'answer': answer}
            steps.append(st)
        title = v['desc']
        lessons.append({'num': str(vi), 'title': title, 'steps': steps})
        txt = lambda h: re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', h))).strip()
        cat.append({'num': str(vi), 'title': title, 'steps': ['task'] * len(steps),
                    'labels': [f'№ {s["no"]}. ' + (lambda q: q if len(q) < 100 else q[:97] + '…')(next((x for x in re.split(r'(?<=[.?!])\s+', txt(s['blocks'][-1]['v'])) if re.search(r'Определите|Найдите|Укажите|Сколько|Какое|Напишите|запишите', x)), txt(s['blocks'][-1]['v'])[:100])) for s in steps]})
    course = {'id': a.cid, 'title': a.title, 'section': {'num': int(a.num), 'title': a.title, 'lessons': lessons}}
    catalog = {'key': f'course-{a.cid}-s{a.num}', 'title': a.title, 'url': f'../exam/?m={a.mid}', 'lessons': cat, 'kind': 'variant', 'series': a.group, 'year': int(a.year)}
    json.dump({'mid': a.mid, 'title': a.title, 'course': course, 'catalog': catalog}, open(os.path.join(a.out, 'manifest.json'), 'w'), ensure_ascii=False)
    print('вариантов', len(lessons), 'заданий', sum(len(l['steps']) for l in lessons))

if __name__ == '__main__': main()
