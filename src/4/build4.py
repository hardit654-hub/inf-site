"""Курс № 4 «Кодирование. Условие Фано»: шаги из Stepik (раздел 6, автор — Артём Свинченко)
+ задача из открытого курса КЕГЭ с изменёнными числами. Сырые данные лежат вне репозитория.
Запуск: python3 src/4/build4.py <папка с raw/s-6.N.json>"""
import json,re,sys,os,html as H
RAW=sys.argv[1]
HERE=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,HERE); sys.path.insert(0,os.path.dirname(HERE))
from stepik_conv import tidy, to_blocks
from answers4 import ANS, DROP, IMGS, VIDEO_TITLES, OPTS, KOMPEGE, KOMPEGE_PLACE

def load(n): return json.load(open(f'{RAW}/s-6.{n}.json'))['steps']

def replace_imgs(tid,h):
    if tid not in IMGS: return h
    it=iter(IMGS[tid])
    def rpl(m):
        r=next(it)
        return r if r.startswith('<') else f'<p><img src="{r}" alt=""></p>'
    h2=re.sub(r'<p><img[^>]*></p>|<img[^>]*>',rpl,h)
    return h2

def build():
    titles=['Условие Фано','Задачки','Решение в Python','Ещё задачки','Тренировка','Обратное условие Фано','Когда использовать обратное условие Фано?']
    lessons=[]
    for n in range(1,8):
        steps=[]
        for s in load(n):
            tid=f'6.{n}.{s["k"]}'
            if tid in DROP: continue
            if s.get('video') or tid in VIDEO_TITLES:
                v=VIDEO_TITLES.get(tid,{}); st={'type':'video','title':v.get('title','Видеоразбор задачи')}
                if v.get('embed'): st['embed']=v['embed']
                steps.append(st); continue
            h=replace_imgs(tid,s['html'])
            h=h.replace('PRO100 ЕГЭ информатика ЕГЭ','')
            tn=s.get('typename')
            if not tn:
                steps.append({'type':'text','blocks':to_blocks(h)}); continue
            if tn.startswith('Выберите'):
                if tid in OPTS: opts=OPTS[tid]
                else:
                    raw=[o['t'] for o in s.get('opts') or []] or re.findall(r'<label>(.*?)</label>',s.get('fill',''))
                    opts=[H.unescape(re.sub(r'<[^>]+>','',o)).replace('\xa0',' ').strip() for o in raw]
                st={'type':'choice','blocks':to_blocks(h),'options':opts,'answer':ANS[tid]}
                if tid+'#expl' in ANS: st['blocks'].append({'t':'details','title':'Пояснение','v':[{'t':'html','v':ANS[tid+'#expl']}]})
                steps.append(st); continue
            steps.append({'type':'fill','blocks':to_blocks(h),'fields':[{'label':'Ответ','n':1}],'answer':[[str(ANS[tid])]]})
        for after,kid in KOMPEGE_PLACE.get(n,[]):
            k=KOMPEGE[kid]
            st={'type':'fill','blocks':[{'t':'html','v':tidy(k['html'])},{'t':'details','title':'Решение','v':[{'t':'html','v':k['solution']}]}],
                'fields':[{'label':'Ответ','n':1}],'answer':[[str(k['answer'])]]}
            steps.append(st) if after=='end' else steps.insert(after,st)
        lessons.append({'num':f'6.{n}','title':titles[n-1],'steps':steps})
    course={'id':'ege-inf','title':'ЕГЭ по информатике','section':{'num':6,'title':'№ 4 Кодирование. Условие Фано','lessons':lessons}}
    open(os.path.join(HERE,'course.js'),'w').write('/* Данные курса № 4. Собирается скриптом src/4/build4.py */\nwindow.COURSE = '+json.dumps(course,ensure_ascii=False,indent=1)+';\n')
    print('уроков',len(lessons),'шагов',sum(len(l['steps']) for l in lessons),'задач',sum(1 for l in lessons for s in l['steps'] if s['type'] in('fill','choice','match')))
if __name__=='__main__': build()
