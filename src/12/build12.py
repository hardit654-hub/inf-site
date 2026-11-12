"""Курс № 12 «Машина Тьюринга»: шаги из Stepik (раздел 42, автор — Артём Свинченко) + задачи из открытого курса КЕГЭ
с изменёнными числами. Сырые данные лежат вне репозитория (scratchpad), сюда попадает только готовый course.js.
Запуск: python3 src/12/build12.py <папка с raw/*.json>"""
import json,re,sys,os,html as H
RAW=sys.argv[1] if len(sys.argv)>1 else os.environ.get('RAW12')
sys.path.insert(0,os.path.join(os.path.dirname(__file__)))
from answers12 import ANS, DROP, IMG, VIDEO_TITLES, KOMPEGE, KOMPEGE_PLACE, PRE_FIX

def load(n):
    for f in (f'{RAW}/stepik3-42.{n}.json',f'{RAW}/stepik2-42.{n}.json',f'{RAW}/stepik-42.{n}.json'):
        if os.path.exists(f): return json.load(open(f))['steps']

from tm12 import table_html

def tex(h):
    def rpl(m):
        a=H.unescape(m.group(1)).strip()
        return '<span class="tex">'+H.escape(a,quote=False)+'</span>'
    return re.sub(r'<math><semantics>.*?<annotation>(.*?)</annotation></semantics></math>',rpl,h,flags=re.S)

def tidy(h):
    h=tex(h)
    h=re.sub(r'</?span>','',h)
    h=re.sub(r'<p>(?:&nbsp;|\s)*</p>','',h)
    h=h.replace('<strong>&nbsp;</strong>','&nbsp;')
    # таблицы-«рамки» (одна ячейка) делаем выносками, таблицы программ — с прокруткой
    def wrap(m):
        t=m.group(0)
        top=re.sub(r'<table data-ok>.*?</table data-ok>','',t[7:-8],flags=re.S)
        if top.count('<td')==1: return '<div class="cond">'+re.sub(r'^<table><tbody><tr><td>|</td></tr></tbody></table>$','',t)+'</div>'
        return '<div class="tw">'+t+'</div>'
    # вложенные таблицы: сначала внутренние
    for _ in range(3):
        h=re.sub(r'<table>(?:(?!<table>).)*?</table>',lambda m:wrap(m).replace('<table>','<table data-ok>').replace('</table>','</table data-ok>'),h,flags=re.S)
    h=h.replace('<table data-ok>','<table>').replace('</table data-ok>','</table>')
    return h.strip()

def split_code(h):
    """html -> блоки: html и code (для <pre><code>)."""
    out=[];pos=0
    for m in re.finditer(r'<pre>(?:<code>)?(.*?)(?:</code>)?</pre>',h,flags=re.S):
        if m.start()>pos: out.append({'t':'html','v':h[pos:m.start()]})
        code=H.unescape(re.sub(r'<br\s*/?>','\n',m.group(1))); code=re.sub(r'<[^>]+>','',code)
        out.append({'t':'code','v':code.rstrip()})
        pos=m.end()
    if pos<len(h): out.append({'t':'html','v':h[pos:]})
    return [b for b in out if b['t']=='code' or re.sub(r'<[^>]+>|\s|&nbsp;','',b['v'])]

def to_blocks(h):
    h=tidy(h)
    blocks=[]; pos=0
    for m in re.finditer(r'<details><summary>(.*?)</summary>(.*?)</details>',h,flags=re.S):
        blocks+=split_code(h[pos:m.start()])
        title=H.unescape(re.sub(r'<[^>]+>','',m.group(1))).strip()
        blocks.append({'t':'details','title':title,'v':split_code(m.group(2))})
        pos=m.end()
    blocks+=split_code(h[pos:])
    return blocks

def replace_img(tid,h):
    if tid not in IMG: return h
    order,spec,label=IMG[tid]
    t=table_html(order,spec)
    if label: t='<p>Программа работы исполнителя:</p>'+t
    h2,n=re.subn(r'<p><img[^>]*></p>',t,h,count=1)
    if not n: h2,n=re.subn(r'<img[^>]*>',t,h,count=1)
    assert n,tid
    return h2

def video_step(n,s):
    tid=f'42.{n}.{s["k"]}'
    v=VIDEO_TITLES.get(tid,{})
    st={'type':'video','title':v.get('title','Видеоразбор')}
    if v.get('embed'): st['embed']=v['embed']
    if v.get('blocks'): st['blocks']=v['blocks']
    if v.get('theory'):
        demo=[x for x in load(4) if x['k']==2][0]['html']
        part=demo.split('<p><strong>Выполните задание.</strong>')[0].replace('(Демо 2026) ','')
        st['blocks']=[{'t':'html','v':'<h3>Описание исполнителя МТ из демоверсии ЕГЭ</h3><p>Пока видео нет, прочитайте, как устроен исполнитель. Этот текст стоит в начале каждого задания № 12.</p>'}]+to_blocks(part)
    return st

def build():
    lessons=[]
    titles=['Теория','Простые задачки','Простые задачки','Демоверсия 2026','Решение в Python','Задачи на числа','Тренировка','На основе старых задач № 12','Разные задачки']
    for n in range(1,10):
        steps=[]
        for s in load(n):
            tid=f'42.{n}.{s["k"]}'
            if tid in DROP: continue
            h=s['html']
            if s.get('video') or tid in VIDEO_TITLES:
                steps.append(video_step(n,s)); continue
            h=replace_img(tid,h)
            if tid in PRE_FIX:
                it=iter(PRE_FIX[tid]); h=re.sub(r'<pre>.*?</pre>',lambda m:'<pre><code>'+H.escape(next(it),quote=False)+'</code></pre>',h,flags=re.S)
            if not s.get('typename'):
                steps.append({'type':'text','blocks':to_blocks(h)}); continue
            tn=s['typename']
            if tn.startswith('Выберите'):
                raw=[o['t'] for o in s.get('opts') or []] or re.findall(r'<label>(.*?)</label>',s.get('fill',''))
                opts=[H.unescape(re.sub(r'<[^>]+>','',o)).replace('\xa0',' ').strip() for o in raw]
                st={'type':'choice','blocks':to_blocks(h),'options':opts,'answer':ANS[tid]}
                if tid+'#expl' in ANS: st['blocks'].append({'t':'details','title':'Пояснение','v':[{'t':'html','v':ANS[tid+'#expl']}],'after':1})
                steps.append(st); continue
            if tn.startswith('Сопоставьте'):
                m=ANS[tid]
                steps.append({'type':'match','blocks':to_blocks(h),'items':[k for k,_ in m['pairs']],'options':m['options'],'answer':[m['options'].index(v) for _,v in m['pairs']]}); continue
            a=ANS[tid]
            steps.append({'type':'fill','blocks':to_blocks(h),'fields':[{'label':'Ответ','n':1}],'answer':[[str(a)]]})
        if n==1:  # разбор демоверсии 2027 — сразу после видео с теорией
            import demo27
            i=next(i for i,s in enumerate(steps) if s.get('title')==VIDEO_TITLES['42.1.2']['title'])
            steps[i+1:i+1]=demo27.steps(to_blocks)
        # задачи из КЕГЭ
        for after,kid in KOMPEGE_PLACE.get(n,[]):
            k=KOMPEGE[kid]
            st={'type':'fill','blocks':[{'t':'html','v':tidy(k['html'])}],'fields':[{'label':'Ответ','n':1}],'answer':[[str(k['answer'])]]}
            if k.get('solution'): st['blocks'].append({'t':'details','title':'Решение','v':[{'t':'html','v':k['solution']}]})
            if after=='end': steps.append(st)
            else: steps.insert(after,st)
        lessons.append({'num':f'42.{n}','title':titles[n-1],'steps':steps})
    course={'id':'ege-inf','title':'ЕГЭ по информатике','section':{'num':42,'title':'№ 12 Машина Тьюринга','lessons':lessons}}
    out=os.path.join(os.path.dirname(__file__),'course.js')
    open(out,'w').write('/* Данные курса № 12. Собирается скриптом src/12/build12.py */\nwindow.COURSE = '+json.dumps(course,ensure_ascii=False,indent=1)+';\n')
    print('уроков',len(lessons),'шагов',sum(len(l['steps']) for l in lessons),'задач',sum(1 for l in lessons for s in l['steps'] if s['type'] in('fill','choice','match')))
if __name__=='__main__': build()
