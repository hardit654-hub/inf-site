"""Курс № 18. Берёт исходные таблицы из sources/18, ставит новые числа (стены и размеры не трогает),
пересчитывает ответы и пишет site/ege-18/files/*.xlsx и src/18/course.js."""
import json, os, random, subprocess, sys, shutil
sys.path.insert(0, os.path.dirname(__file__))
from grid18 import load, solve, trucks
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC=os.path.join(ROOT,'sources/18'); OUT=os.path.join(ROOT,'site/ege-18/files'); TMP='/tmp/b18'
os.makedirs(OUT,exist_ok=True); os.makedirs(TMP,exist_ok=True)

def to_xlsx(name):
    p=os.path.join(SRC,name)
    if name.endswith('.xlsx'): return p
    subprocess.run(['soffice','--headless','--convert-to','xlsx','--outdir',TMP,p],check=True,capture_output=True)
    return os.path.join(TMP,os.path.splitext(name)[0]+'.xlsx')

def h(x): return {'t':'html','v':x}
def P(*ps): return ''.join(f'<p>{p}</p>' for p in ps)
TRY='Попробуйте решить задачу самостоятельно, а после обязательно посмотрите её разбор на следующем шаге 😉'
COIN='Перед каждым запуском Робота в каждой клетке квадрата лежит монета достоинством от 1 до 100. Посетив клетку, Робот забирает монету с собой; это также относится к начальной и конечной клеткам маршрута Робота.'
WALLS='Квадрат ограничен внешними стенами. Между соседними клетками квадрата также могут быть внутренние стены. Сквозь стену Робот пройти не может.'
RD='Исполнитель Робот может перемещаться по клеткам, выполняя за одно перемещение одну из двух команд: вправо или вниз. По команде вправо Робот перемещается в соседнюю правую клетку, по команде вниз – в соседнюю нижнюю.'
CORNER='В «угловых» клетках поля – тех, которые справа и снизу ограничены стенами, Робот не может продолжать движение, поэтому накопленная сумма считается итоговой. Таких конечных клеток на поле может быть несколько, включая правую нижнюю клетку поля. При разных запусках итоговые накопленные суммы могут различаться.'
TABLE='Исходные данные представляют собой электронную таблицу размером N × N, каждая ячейка которой соответствует клетке квадрата. Внутренние и внешние стены обозначены утолщёнными линиями.'
ASK_C='Определите максимальную и минимальную денежные суммы среди всех возможных итоговых сумм, которые может собрать Робот, пройдя из левой верхней клетки в конечную клетку маршрута.'
MAXMIN='В ответе укажите два числа – сначала максимальную сумму, затем минимальную.'

def corner_text(src, order='maxmin', try_first=False):
    o=MAXMIN if order=='maxmin' else 'В ответе укажите два числа – сначала минимальную сумму, затем максимальную.'
    return (P(TRY) if try_first else '')+P(f'({src}) Квадрат разлинован на N × N клеток (1 &lt; N &lt; 30). '+RD+' '+WALLS if src else 'Квадрат разлинован на N × N клеток (1 &lt; N &lt; 30). '+RD+' '+WALLS, COIN, CORNER, ASK_C+' '+o, TABLE)

def polyakov(direction, ask):
    return P(f'(К.Ю. Поляков) Квадрат разлинован на N×N клеток (1 &lt; N &lt; 17). Исполнитель Робот может перемещаться по клеткам, выполняя за одно перемещение одну из двух команд: вправо или {direction[0]}. По команде вправо Робот перемещается в соседнюю правую клетку, по команде {direction[0]} – в соседнюю {direction[1]}. При попытке выхода за границу квадрата Робот разрушается. Перед каждым запуском Робота в каждой клетке квадрата лежит монета достоинством от 1 до 100. Посетив клетку, Робот забирает монету с собой; это также относится к начальной и конечной клетке маршрута Робота.',
      'Исходные данные записаны в файле в виде электронной таблице размером N×N, каждая ячейка которой соответствует клетке квадрата.', ask, MAXMIN)

def walls_text(src, extra_try=None, table=False, demo_word='клеткам'):
    t=P(extra_try) if extra_try else ''
    body=f'({src}) Квадрат разлинован на N×N клеток (1 &lt; N &lt; 30). '+RD+' '+WALLS+f' Перед каждым запуском Робота в каждой клетке квадрата лежит монета достоинством от 1 до 100. Посетив клетку, Робот забирает монету с собой; это также относится к начальной и конечной {demo_word} маршрута Робота.'
    return t+P(body,'Исходные данные для Робота записаны в файле в виде прямоугольной таблицы, каждая ячейка которой соответствует клетке квадрата.','Определите максимальную и минимальную денежную сумму, которую может собрать Робот, пройдя из левой верхней клетки в правую нижнюю.',MAXMIN)

rng=random.Random(18)
def remake(src_name, out_name, mode, **kw):
    """mode: 'coins' new values 1..100; 'keep0' new values in original range, zeros kept"""
    wb,ws,(r0,c0),val,right,down=load(to_xlsx(src_name))
    flat=[v for row in val for v in row if v]
    lo,hi=(min(flat),max(flat))
    for i,row in enumerate(val):
        for j,v in enumerate(row):
            if mode=='keep0' and v==0: continue
            nv=rng.randint(max(1,lo) if mode!='coins' else 1, hi if mode!='coins' else 100)
            val[i][j]=nv; ws.cell(r0+i,c0+j).value=nv
    wb.save(os.path.join(OUT,out_name))
    return val,right,down

def fsize(n): return f"{max(1,round(os.path.getsize(os.path.join(OUT,n))/1024))} КБ"
def fileblock(n): return {'t':'file','files':[{'name':n,'href':'files/'+n,'size':fsize(n)}]}
def task(blocks, ans, n=2, label='Ответ'):
    return {'type':'fill','blocks':blocks,'fields':[{'label':label,'n':n}],'answer':[[str(a) for a in ans]]}
KEY=[]
def rec(where, ans): KEY.append((where, ans))

# ----- answers helpers
def tl_br(val,right,down): mx,mn,_=solve(val,right,down,(0,0),('R','D'),(len(val)-1,len(val)-1)); return mx,mn
def bl_tr(val,right,down): N=len(val); mx,mn,_=solve(val,right,down,(N-1,0),('R','U'),(0,N-1)); return mx,mn
def corner(val,right,down): mx,mn,k=solve(val,right,down,(0,0),('R','D'),'corner'); return mx,mn,k
def nowalls(val): N=len(val); F=[[False]*N for _ in range(N)]; return [[j==N-1 for j in range(N)] for i in range(N)],[[i==N-1 for j in range(N)] for i in range(N)]
