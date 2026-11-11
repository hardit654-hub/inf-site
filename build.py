"""Собирает страницы курсов: src/engine.html + src/<курс>/course.js -> site/<папка>/index.html"""
import json
COURSES=[
  dict(src='src/19-21/course.js', out='site/ege-19-21/index.html', title='№ 19–21 · Решение в Python',
       og_title='№ 19–21. Решение в Python — курс', url='https://gsvv.ru/inf/ege-19-21/', image='https://gsvv.ru/inf/og-course.jpg',
       desc='Теория игр для ЕГЭ по информатике: одна куча, две кучи, убирание камней. 6 уроков, 37 задач с автопроверкой.'),
  dict(src='src/18/course.js', out='site/ege-18/index.html', title='№ 18 · Динамика в электронных таблицах',
       og_title='№ 18. Динамика в электронных таблицах — курс', url='https://gsvv.ru/inf/ege-18/', image='https://gsvv.ru/inf/og-18.jpg',
       desc='Робот собирает монеты: максимум и минимум, стены, угловые клетки. 3 урока, задачи с файлами и автопроверкой.'),
]
eng=open('src/engine.html').read()
import os
for c in COURSES:
    if not os.path.exists(c['src']): continue
    data=open(c['src']).read().replace('</script>','<\\/script>')
    h=eng.replace('{{TITLE}}',c['title']).replace('{{OG_TITLE}}',c['og_title']).replace('{{DESC}}',c['desc']).replace('{{URL}}',c['url']).replace('{{IMAGE}}',c['image']).replace('{{COURSE_DATA}}','<script>\n'+data+'\n</script>')
    os.makedirs(os.path.dirname(c['out']),exist_ok=True)
    open(c['out'],'w').write(h); print('built',c['out'])
