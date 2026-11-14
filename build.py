"""Собирает страницы курсов: src/engine.html + src/<курс>/course.js -> site/<папка>/index.html"""
import json
COURSES=[
  dict(src='src/17/course.js', out='site/ege-17/index.html', title='Системы счисления',
       og_title='Системы счисления — курс', url='https://gsvv.ru/inf/ege/', image='https://gsvv.ru/inf/og-course.jpg',
       desc='Системы счисления для ЕГЭ: перевод чисел, шестнадцатеричная система, сложение и вычитание, полезные свойства.'),
  dict(src='src/4/course.js', out='site/ege-4/index.html', title='№ 4 · Условие Фано',
       og_title='№ 4. Кодирование, условие Фано — курс', url='https://gsvv.ru/inf/ege-4/', image='https://gsvv.ru/inf/og-4.jpg',
       desc='Неравномерный двоичный код для ЕГЭ по информатике: условие Фано, суммарная длина, решение в Python. 7 уроков, 60 задач.'),
  dict(src='src/12/course.js', out='site/ege-12/index.html', title='№ 12 · Машина Тьюринга',
       og_title='№ 12. Машина Тьюринга — курс', url='https://gsvv.ru/inf/ege-12/', image='https://gsvv.ru/inf/og-12.jpg',
       desc='Исполнитель МТ для ЕГЭ по информатике: таблица программы, устное решение, Python. 9 уроков, 92 задачи с автопроверкой.'),
  dict(src='src/18/course.js', out='site/ege-18/index.html', title='№ 18 · Динамика в электронных таблицах',
       og_title='№ 18. Динамика в электронных таблицах — курс', url='https://gsvv.ru/inf/ege-18/', image='https://gsvv.ru/inf/og-18.jpg',
       desc='Робот собирает монеты: максимум и минимум, стены, угловые клетки. 3 урока, задачи с файлами и автопроверкой.'),
  dict(src='src/19-21/course.js', out='site/ege-19-21/index.html', title='№ 19–21 · Решение в Python',
       og_title='№ 19–21. Решение в Python — курс', url='https://gsvv.ru/inf/ege-19-21/', image='https://gsvv.ru/inf/og-course.jpg',
       desc='Теория игр для ЕГЭ по информатике: одна куча, две кучи, убирание камней. 6 уроков, 37 задач с автопроверкой.'),
  dict(src='src/22/course.js', out='site/ege-22/index.html', title='№ 22 · Параллельные процессы',
       og_title='№ 22. Параллельные процессы — курс', url='https://gsvv.ru/inf/ege/', image='https://gsvv.ru/inf/og-course.jpg',
       desc='Параллельные процессы в электронных таблицах: без движения процессов, сдвиг процессов, ВПР.'),
]
eng=open('src/engine.html').read()
import os, re as _re
def load_course(path):
    t=open(path).read(); return json.loads(t[t.index('{'):t.rindex('}')+1])
def scrub(o):
    """Убираем всё, что выдаёт Stepik: водяной знак, ссылки на stepik.org, отсылки к его вкладкам."""
    if isinstance(o, dict): return {k: scrub(v) for k,v in o.items()}
    if isinstance(o, list):  # блоки, где только ссылка на ролик сообщества PRO100, убираем целиком
        return [scrub(x) for x in o if not (isinstance(x, dict) and x.get('t')=='details' and 'pro100' in json.dumps(x).lower())]
    if not isinstance(o, str): return o
    s=o
    s=_re.sub(r'<p>(?:(?!</p>).)*?pro100ege(?:(?!</p>).)*?</p>', '', s, flags=_re.S|_re.I)
    s=_re.sub(r'\(\s*PRO100 ЕГЭ\s*\)\s*', '', s)
    s=_re.sub(r'<p>(?:(?!</p>).)*?(?:stepik\.org|во вкладке решени)(?:(?!</p>).)*?</p>', '', s, flags=_re.S|_re.I)
    s=_re.sub(r'<p>(?:\s|<[^>]+>)*PRO100 ЕГЭ информатика ЕГЭ(?:\s|<[^>]+>)*</p>', '', s)
    s=s.replace('PRO100 ЕГЭ информатика ЕГЭ','')
    return s
def rebase(o, folder):
    """Относительные ссылки на картинки и файлы раздела -> ../<папка раздела>/… (страница курса теперь /ege/)."""
    rel=lambda u: u if _re.match(r'(https?:|//|/|\.\./|#|data:|mailto:)', u) else '../'+folder+'/'+u
    if isinstance(o, dict): return {k: (rel(v) if k in ('href','src') and isinstance(v,str) else rebase(v, folder)) for k,v in o.items()}
    if isinstance(o, list): return [rebase(x, folder) for x in o]
    if isinstance(o, str): return _re.sub(r'((?:src|href)=")([^"]+)"', lambda m: m.group(1)+rel(m.group(2))+'"', o)
    return o
# Один курс «ЕГЭ»: все разделы на одной странице, слева — оглавление по номерам заданий.
# Прогресс каждого раздела хранится под прежним ключом (course-ege-inf-s<номер>), поэтому ответы учеников сохраняются.
ORDER=['src/17/course.js','src/4/course.js','src/12/course.js','src/18/course.js','src/19-21/course.js','src/22/course.js']
secs=[]
for src in ORDER:
    c=next(x for x in COURSES if x['src']==src); d=load_course(src); s=d['section']
    folder=c['out'].split('/')[1]
    les=rebase(scrub(s['lessons']), folder)
    for i,l in enumerate(les,1): l['label']=str(i)   # показываем «1, 2, 3…» внутри номера; num остаётся ключом прогресса
    secs.append(dict(num=s['num'], title=c['title'], key='course-%s-s%s'%(d['id'],s['num']), lessons=les))
ege=dict(id='ege-inf', title='ЕГЭ', sections=secs)
data='window.COURSE = '+json.dumps(ege, ensure_ascii=False)+';'
ntask=sum(1 for s in secs for l in s['lessons'] for st in l['steps'] if st['type'] in ('fill','choice','match'))
desc='Курс ЕГЭ по информатике: '+', '.join(c['title'].split(' · ')[0] for c in COURSES)+'. Теория, шаблоны решений и %d задач с автопроверкой.'%ntask
h=eng.replace('{{TITLE}}','ЕГЭ по информатике').replace('{{OG_TITLE}}','ЕГЭ по информатике — курс').replace('{{DESC}}',desc).replace('{{URL}}','https://gsvv.ru/inf/ege/').replace('{{IMAGE}}','https://gsvv.ru/inf/og-course.jpg').replace('{{COURSE_DATA}}','<script>\n'+data.replace('</script>','<\\/script>')+'\n</script>')
os.makedirs('site/ege',exist_ok=True); open('site/ege/index.html','w').write(h); print('built site/ege/index.html', len(secs), 'разделов', ntask, 'задач')
# Старые адреса разделов ведут в общий курс, в тот же раздел (ссылки из домашки и закладки продолжают работать)
for src in ORDER:
    c=next(x for x in COURSES if x['src']==src); num=load_course(src)['section']['num']
    open(c['out'],'w').write(f'''<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>{c['title']}</title>
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<link rel="canonical" href="https://gsvv.ru/inf/ege/">
<script>location.replace("../ege/"+(location.hash?location.hash:"?s={num}"));</script>
<meta http-equiv="refresh" content="0;url=../ege/?s={num}"></head>
<body><p><a href="../ege/?s={num}">Курс переехал — открыть «ЕГЭ по информатике»</a></p></body></html>''')
    print('redirect',c['out'])

# Закрытые варианты (СтатГрад, реальный ЕГЭ): открываются в режиме экзамена site/exam/ (страница пишется вручную).
# Старый адрес ../sg/?m=… ведёт туда же — ссылки из домашки и закладки продолжают работать.
os.makedirs('site/sg',exist_ok=True)
open('site/sg/index.html','w').write('''<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Варианты</title>
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<script>location.replace("../exam/"+location.search+location.hash);</script></head>
<body><p><a href="../exam/">Открыть вариант</a></p></body></html>''')
print('redirect site/sg/index.html')

# Структура курсов для кабинета (без ответов): уроки и какие шаги — задачи
import re
import html as _H
def task_label(st):
    """Короткая подпись задачи для выбора домашки: источник, ключевые числа и вопрос."""
    if st['type'] not in ('fill','choice','match'): return ''
    h=' '.join(b['v'] for b in st.get('blocks',[]) if b.get('t')=='html')
    h=re.sub(r'<table.*?</table>|<details.*?</details>','',h,flags=re.S)
    txt=lambda x:re.sub(r'\s+',' ',_H.unescape(re.sub(r'<[^>]+>',' ',x))).replace('\xa0',' ').strip()
    paras=[txt(x) for x in re.findall(r'<p[^>]*>(.*?)</p>',h,flags=re.S)] or [txt(h)]
    paras=[x for x in paras if x]
    if not paras: return ''
    qs=[x for x in paras if re.search(r'(Определите|Найдите|Укажите|Сколько|Какую|Какое|Какая|Каково|Выберите|Сопоставьте)',x)]
    q=qs[-1] if qs else paras[-1]
    first=paras[0]
    src=re.match(r'^\(([^)]{2,40})\)',first)
    m=re.search(r'(числа \d+|из \d+ (?:символ\w*|нул\w*|единиц\w*)|\d+ нул\w+ и \d+ единиц\w*)',first)
    for x,y in [('После выполнения программы на ленте осталось ровно','Осталось ровно'),('После выполнения программы на ленте оказалась','Получилась'),
                ('Определите максимально возможное','Найдите макс.'),('Определите минимально возможное','Найдите мин.'),('Определите наибольшее возможное','Найдите наиб.'),
                ('Определите наименьшее возможное','Найдите наим.'),(' в исходной последовательности',' в исходной строке'),
                (', которые будут находится на ленте после выполнения программы',' после работы'),(' на ленте после выполнения программы',' после работы'),
                (' , ',', '),(' .','.'),('  ',' ')]:
        q=q.replace(x,y)
    s=(('('+src.group(1)+') ') if src else '')+((m.group(1)+': ') if m else '')+q
    return s if len(s)<=120 else s[:117].rstrip()+'…'
def keys(l):
    # ключи шагов как в движке: у вставленных шагов свой key, остальные — по порядку без них
    if not any(st.get('key') for st in l['steps']): return {}
    n=0; out=[]
    for st in l['steps']:
        if st.get('key'): out.append(st['key'])
        else: n+=1; out.append(str(n))
    return {'keys':out}
cat=[]
for c in COURSES:
    if not os.path.exists(c['src']): continue
    t=open(c['src']).read(); d=json.loads(t[t.index('{'):t.rindex('}')+1]); s=scrub(d['section'])
    cat.append(dict(key='course-%s-s%s'%(d['id'],s['num']), title=c['title'], url='../ege/', group='ЕГЭ',
        lessons=[dict(num=l['num'], label=str(li), title=l['title'], steps=[('task' if st['type'] in ('fill','choice','match') else st['type']) for st in l['steps']],
                      labels=[task_label(st) for st in l['steps']], **keys(l)) for li,l in enumerate(s['lessons'],1)]))
os.makedirs('site/kabinet',exist_ok=True)
json.dump(dict(courses=cat), open('site/kabinet/courses.json','w'), ensure_ascii=False, indent=1)
print('built site/kabinet/courses.json')
