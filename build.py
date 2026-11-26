"""Собирает страницы курсов: src/engine.html + src/<курс>/course.js -> site/<папка>/index.html"""
import json
COURSES=[
  dict(src='src/1/course.js', out='site/ege-1/index.html', title='№ 1 · Графы, таблицы дорог',
       og_title='№ 1. Графы, таблицы дорог — курс', url='https://gsvv.ru/inf/ege/', image='https://gsvv.ru/inf/og-course.jpg',
       desc='Графы и таблицы дорог для ЕГЭ по информатике: сопоставление схемы и таблицы, кратчайший путь, решение в Python. 7 уроков, 39 задач с автопроверкой.'),
  dict(src='src/17/course.js', out='site/ege-17/index.html', title='Системы счисления',
       og_title='Системы счисления — курс', url='https://gsvv.ru/inf/ege/', image='https://gsvv.ru/inf/og-course.jpg',
       desc='Системы счисления для ЕГЭ: перевод чисел, шестнадцатеричная система, сложение и вычитание, полезные свойства.'),
  dict(src='src/4/course.js', out='site/ege-4/index.html', title='№ 4 · Условие Фано',
       og_title='№ 4. Кодирование, условие Фано — курс', url='https://gsvv.ru/inf/ege-4/', image='https://gsvv.ru/inf/og-4.jpg',
       desc='Неравномерный двоичный код для ЕГЭ по информатике: условие Фано, суммарная длина, решение в Python. 7 уроков, 60 задач.'),
  dict(src='src/5/course.js', out='site/ege-5/index.html', title='№ 5 · Анализ алгоритмов',
       og_title='№ 5. Анализ алгоритмов — курс', url='https://gsvv.ru/inf/ege/', image='https://gsvv.ru/inf/og-course.jpg',
       desc='Анализ алгоритмов для ЕГЭ по информатике: двоичная запись числа, приписывание разрядов, решение в Python. 7 уроков, 66 задач с автопроверкой.'),
  dict(src='src/8/course.js', out='site/ege-8/index.html', title='№ 8 · Комбинаторика в Python',
       og_title='№ 8. Комбинаторика — курс', url='https://gsvv.ru/inf/ege/', image='https://gsvv.ru/inf/og-course.jpg',
       desc='Комбинаторика для ЕГЭ по информатике (№ 8): слова и числа с условиями, алфавитный список, перестановки, решение в Python. 8 уроков, 71 задача с автопроверкой.'),
  dict(src='src/11/course.js', out='site/ege-11/index.html', title='№ 11 · Информационный объём',
       og_title='№ 11. Информационный объём — курс', url='https://gsvv.ru/inf/ege/', image='https://gsvv.ru/inf/og-course.jpg',
       desc='Информационный объём для ЕГЭ по информатике (№ 11): посимвольное кодирование, пароли и идентификаторы, серийные номера, решение в Python. 7 уроков, 61 задача с автопроверкой.'),
  dict(src='src/12/course.js', out='site/ege-12/index.html', title='№ 12 · Машина Тьюринга',
       og_title='№ 12. Машина Тьюринга — курс', url='https://gsvv.ru/inf/ege-12/', image='https://gsvv.ru/inf/og-12.jpg',
       desc='Исполнитель МТ для ЕГЭ по информатике: таблица программы, устное решение, Python. 9 уроков, 92 задачи с автопроверкой.'),
  dict(src='src/13/course.js', out='site/ege-13/index.html', title='№ 13 · IP-адреса и маски',
       og_title='№ 13. IP-адреса и маски сети — курс', url='https://gsvv.ru/inf/ege/', image='https://gsvv.ru/inf/og-course.jpg',
       desc='IP-адреса и маски сети для ЕГЭ по информатике: теория, устное решение, Python. 7 уроков, 72 задачи с автопроверкой.'),
  dict(src='src/14/course.js', out='site/ege-14/index.html', title='№ 14 · Системы счисления в Python',
       og_title='№ 14. Системы счисления — курс', url='https://gsvv.ru/inf/ege/', image='https://gsvv.ru/inf/og-course.jpg',
       desc='Системы счисления для ЕГЭ по информатике (№ 14): неизвестная цифра и кратность, количество и сумма цифр, решение в Python. 6 уроков, 63 задачи с автопроверкой.'),
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
ORDER=['src/1/course.js','src/17/course.js','src/4/course.js','src/5/course.js','src/8/course.js','src/11/course.js','src/12/course.js','src/13/course.js','src/14/course.js','src/18/course.js','src/19-21/course.js','src/22/course.js']
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
# Картинки разделов: sources/<раздел>/img<раздел>.<урок>.<шаг>-<n>.png (качает fetch.yml) -> site/<папка раздела>/img/ (без «img» в имени)
for src in ORDER:
    c=next(x for x in COURSES if x['src']==src); num=load_course(src)['section']['num']; folder=c['out'].split('/')[1]
    sdir='sources/%s'%num
    if not os.path.isdir(sdir): continue
    for name in sorted(os.listdir(sdir)):
        if not _re.match(r'img%s\.\d+\.\d+-\d+\.png$'%num, name): continue
        dst='site/%s/img/%s'%(folder,name[3:])
        if not os.path.exists(dst): os.makedirs(os.path.dirname(dst),exist_ok=True); open(dst,'wb').write(open(sdir+'/'+name,'rb').read()); print('img',dst)
os.makedirs('site/ege',exist_ok=True); open('site/ege/index.html','w').write(h); print('built site/ege/index.html', len(secs), 'разделов', ntask, 'задач')
# Старые адреса разделов ведут в общий курс, в тот же раздел (ссылки из домашки и закладки продолжают работать)
for src in ORDER:
    c=next(x for x in COURSES if x['src']==src); num=load_course(src)['section']['num']
    os.makedirs(os.path.dirname(c['out']),exist_ok=True)
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

# Курс «7 класс» (рабочая тетрадь Босовой): разделы — параграфы, собирается src/inf7/build7.py
inf7=load_course('src/inf7/course.js')
n7=sum(1 for s in inf7['sections'] for l in s['lessons'] for st in l['steps'] if st['type'] in ('fill','choice','match'))
h=eng.replace('{{TITLE}}','Информатика · 7 класс').replace('{{OG_TITLE}}','Информатика, 7 класс — задачи').replace('{{DESC}}','Задачи по информатике для 7 класса: Всемирная паутина, представление и измерение информации, двоичное кодирование, устройство компьютера, файлы. %d задач с автопроверкой.'%n7).replace('{{URL}}','https://gsvv.ru/inf/inf7/').replace('{{IMAGE}}','https://gsvv.ru/inf/og-course.jpg').replace('{{COURSE_DATA}}','<script>\nwindow.COURSE = '+json.dumps(inf7, ensure_ascii=False).replace('</script>','<\\/script>')+';\n</script>')
os.makedirs('site/inf7',exist_ok=True); open('site/inf7/index.html','w').write(h); print('built site/inf7/index.html', len(inf7['sections']), 'разделов', n7, 'задач')

# Курс «ОГЭ» (тестовая часть, № 1–10, с теорией): собирается src/oge/buildoge.py; картинки — из sources/oge
import shutil
oge=load_course('src/oge/course.js')
noge=sum(1 for s in oge['sections'] for l in s['lessons'] for st in l['steps'] if st['type'] in ('fill','choice','match'))
h=eng.replace('{{TITLE}}','ОГЭ по информатике').replace('{{OG_TITLE}}','ОГЭ по информатике — курс').replace('{{DESC}}','Подготовка к ОГЭ по информатике: задания № 1–10 с теорией — кодирование, системы счисления, логика, графы, адреса в интернете, исполнители. %d задач с автопроверкой.'%noge).replace('{{URL}}','https://gsvv.ru/inf/oge/').replace('{{IMAGE}}','https://gsvv.ru/inf/og-course.jpg').replace('{{COURSE_DATA}}','<script>\nwindow.COURSE = '+json.dumps(oge, ensure_ascii=False).replace('</script>','<\\/script>')+';\n</script>')
os.makedirs('site/oge/img',exist_ok=True); open('site/oge/index.html','w').write(h)
for name in sorted(set(_re.findall(r'img/(img[\w.\-]+\.png)', json.dumps(oge, ensure_ascii=False)))):
    a,b='sources/oge/'+name,'site/oge/img/'+name
    if not os.path.exists(b) or open(a,'rb').read()!=open(b,'rb').read(): shutil.copyfile(a,b)
print('built site/oge/index.html', len(oge['sections']), 'разделов', noge, 'задач')

# Картинки эмодзи (Twemoji) для старых Windows: sources/emoji/*.svg -> site/emoji/ (их подставляет site/emoji.js)
os.makedirs('site/emoji',exist_ok=True)
for name in sorted(os.listdir('sources/emoji')) if os.path.isdir('sources/emoji') else []:
    a2,b2='sources/emoji/'+name,'site/emoji/'+name
    if name.endswith('.svg') and (not os.path.exists(b2) or open(a2,'rb').read()!=open(b2,'rb').read()): shutil.copyfile(a2,b2)
print('emoji', len(os.listdir('site/emoji')))

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
for s7 in inf7['sections']:
    cat.append(dict(key='course-%s-s%s'%(inf7['id'],s7['num']), title=s7['title'], url='../inf7/', group='7 класс',
        lessons=[dict(num=l['num'], label=l.get('label',l['num']), title=l['title'], steps=[('task' if st['type'] in ('fill','choice','match') else st['type']) for st in l['steps']],
                      labels=[task_label(st) for st in l['steps']]) for l in s7['lessons']]))
for so in oge['sections']:
    cat.append(dict(key='course-%s-s%s'%(oge['id'],so['num']), title=so['title'], url='../oge/', group='ОГЭ',
        lessons=[dict(num=l['num'], label=l.get('label',l['num']), title=l['title'], steps=[('task' if st['type'] in ('fill','choice','match') else st['type']) for st in l['steps']],
                      labels=[task_label(st) for st in l['steps']]) for l in so['lessons']]))
os.makedirs('site/kabinet',exist_ok=True)
json.dump(dict(courses=cat), open('site/kabinet/courses.json','w'), ensure_ascii=False, indent=1)
print('built site/kabinet/courses.json')

# Кабинет и сервер собираются из маленьких частей: src/kabinet/ и src/api/ (их удобно править по одной).
# Строка /*#include имя*/ в шаблоне заменяется содержимым файла. Части один раз нарезаны из готовых файлов: tools/split_parts.py.
import subprocess
if not (os.path.exists('src/kabinet/index.html') and os.path.exists('src/api/index.php')):
    subprocess.run(['python3', 'tools/split_parts.py'], check=True)
def assemble(tpl, out):
    d = os.path.dirname(tpl); res = []
    for line in open(tpl, encoding='utf-8').read().splitlines(keepends=True):
        m = _re.fullmatch(r'/\*#include (\S+)\*/\n?', line)
        res.append(open(os.path.join(d, m.group(1)), encoding='utf-8').read() if m else line)
    open(out, 'w', encoding='utf-8').write(''.join(res)); print('собран', out)
assemble('src/kabinet/index.html', 'site/kabinet/index.html')
assemble('src/api/index.php', 'site/api/index.php')
# форма записи на поездку: исходник — src/forms/index.html
if os.path.exists('src/forms/index.html'):
    os.makedirs('site/forms', exist_ok=True)
    shutil.copy('src/forms/index.html', 'site/forms/index.html'); print('скопирована site/forms/index.html')
