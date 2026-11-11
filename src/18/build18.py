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

# Google‑файлы на самом деле в старом формате .xls
def to_xlsx2(name):
    if name in ('36.1-s12.xlsx','36.2-s01.xlsx'):
        p=os.path.join(TMP,name.replace('.xlsx','.xls')); shutil.copy(os.path.join(SRC,name),p)
        subprocess.run(['soffice','--headless','--convert-to','xlsx','--outdir',os.path.join(TMP,'g'),p],check=True,capture_output=True)
        return os.path.join(TMP,'g',name)
    return to_xlsx(name)
_to=to_xlsx
def to_xlsx(name): return to_xlsx2(name) if name in ('36.1-s12.xlsx','36.2-s01.xlsx') else _to(name)

def remake2(src_name,out_name,keep0=False):
    wb,ws,(r0,c0),val,right,down=load(to_xlsx(src_name))
    flat=[int(v) for row in val for v in row if v]
    lo,hi=min(flat),max(flat)
    for i,row in enumerate(val):
        for j,v in enumerate(row):
            if keep0 and v==0: val[i][j]=0; continue
            nv=rng.randint(lo,hi); val[i][j]=nv; ws.cell(r0+i,c0+j).value=nv
    wb.save(os.path.join(OUT,out_name)); return val,right,down

EX_A={'t':'grid','v':[[1,8,8,4],[10,1,1,3],[1,3,12,2],[2,3,5,6]],'d':[[0,0,0,0],[0,1,1,0]]}
EX_B={'t':'grid','v':[[1,8,8,4],[10,1,1,3],[1,3,12,2],[2,3,5,6]],'r':[[0,0,0,0],[0,1,1,0],[0,0,1,0]],'d':[[0,0,0,0],[0,1,0,0]]}
VIDEO13=[{'t':'embed','src':'https://rutube.ru/play/embed/f309de47cad216efa33c35b6590de8c9?t=16579','title':'Видеоразбор Демо 2023 № 18',
          'alt':[{'name':'Rutube','href':'https://rutube.ru/video/f309de47cad216efa33c35b6590de8c9/?t=16579'},{'name':'YouTube','href':'https://youtu.be/OpNX4AEsRq4?t=16579'}]}]

def T(lesson, step, src_name, kind, text_html, extra=None, order='maxmin', keep0=False, after=None):
    name=f'18-{lesson}-{step:02d}.xlsx'
    val,right,down=remake2(src_name,name,keep0)
    N=len(val)
    if kind=='plain_rd': r,d=nowalls(val); mx,mn,_=solve(val,r,d,(0,0),('R','D'),(N-1,N-1))
    elif kind=='plain_ru': r,d=nowalls(val); mx,mn,_=solve(val,r,d,(N-1,0),('R','U'),(0,N-1))
    elif kind=='walls_rd': mx,mn,_=solve(val,right,down,(0,0),('R','D'),(N-1,N-1))
    elif kind=='walls_ru': mx,mn,_=solve(val,right,down,(N-1,0),('R','U'),(0,N-1))
    elif kind=='corner': mx,mn,k=solve(val,right,down,(0,0),('R','D'),'corner'); assert k>=2, (name,k)
    elif kind=='zero_rd': r,d=nowalls(val); mx,mn,_=solve(val,r,d,(0,0),('R','D'),(N-1,N-1),forbid0=True)
    elif kind=='trucks':
        ans=trucks(val); rec(f'{lesson} шаг {step}',ans)
        return task([fileblock(name),h(text_html)]+(extra or []),ans,n=4)
    ans=[mx,mn] if order=='maxmin' else [mn,mx]
    rec(f'{lesson} шаг {step}',ans)
    blocks=[fileblock(name),h(text_html)]+(extra or [])
    return task(blocks,[int(a) for a in ans])

def video(title): return {'type':'video','title':title}

L1=[
 T('36.1',1,'36.1-s01.xls','plain_rd',P(TRY)+polyakov(('вниз','нижнюю'),'Определите максимальную и минимальную денежную сумму, которую может собрать Робот, пройдя из левой верхней клетки в правую нижнюю.')),
 video('Разбор задачи: максимум и минимум в электронной таблице'),
 T('36.1',3,'36.1-s03.xls','plain_rd',polyakov(('вниз','нижнюю'),'Определите максимальную и минимальную денежную сумму, которую может собрать Робот, пройдя из левой верхней клетки в правую нижнюю.')),
 T('36.1',4,'36.1-s04.xls','plain_ru',polyakov(('вверх','верхнюю'),'Определите максимальную и минимальную денежную сумму, которую может собрать Робот, пройдя из левой <b>НИЖНЕЙ</b> клетки в правую <b>ВЕРХНЮЮ</b>.')),
 T('36.1',5,'36.1-s05.xls','trucks',P('(Е. Джобс) Квадрат разлинован на N×N клеток (3 &lt; N &lt; 15), где N – нечетное число. На поле работает 4 исполнителя Грузовичок, которые начинают движение из центральной клетки. Например, для N = 5 из клетки С3. Каждый исполнитель двигается в один из углов – левый верхний, правый верхний, левый нижний или правый нижний – и может двигаться соответственно только – налево и вверх, направо и вверх, вниз и влево, вниз и вправо.',
   'Исполнители работают независимо друг от друга на своей копии поля. Каждая пройденная клетка содержит число – массу в килограммах забираемого груза. Цель исполнителя – забрать как можно больший объем груза, выраженный в килограммах.',
   'Исходные данные записаны в файле в виде электронной таблице размером N×N, каждая ячейка которой соответствует клетке квадрата.','В ответе запишите четыре числа: наилучшие результаты работы каждого Грузовичка, значения расставьте по возрастанию.')),
 T('36.1',6,'36.1-s06.xls','walls_rd',walls_text('ЕГЭ 2022','Попробуйте решить задачу самостоятельно, а после обязательно посмотрите её разбор 😉',demo_word='клетке')),
 {'type':'text','blocks':[h(P('Решение № 18 со стенами в Excel и LibreOffice немного отличается.','Разбор в Excel доступен на следующем шаге.<br>Разбор в LibreOffice доступен на послеследующем шаге.'))]},
 video('Разбор № 18 со стенами в Excel'),
 video('Разбор № 18 со стенами в LibreOffice'),
 T('36.1',10,'36.1-s10.xls','walls_rd',P('(Демо 2022) Квадрат разлинован на N×N клеток (1 &lt; N &lt; 30). '+RD+' '+WALLS+' '+COIN,'Определите максимальную и минимальную денежные суммы, которые может собрать Робот, пройдя из левой верхней клетки в правую нижнюю. '+MAXMIN,'Исходные данные для Робота записаны в файле в виде прямоугольной таблицы, каждая ячейка которой соответствует клетке квадрата.')),
 T('36.1',11,'36.1-s11.xls','walls_ru',P('(Е. Джобс) Квадрат разлинован на N×N клеток (2 &lt; N &lt; 21). В каждой клетке записано целое положительное число – количество монет. Исполнитель Сборщик имеет две команды ВПРАВО и ВВЕРХ, которые, соответственно, перемещают его на одну клетку вправо или на одну клетку вверх. Проходя через клетку, Сборщик собирает все монеты, лежащие на ней. На поле существуют стены, обозначены жирной линией, через которые Сборщик проходить не может. Исполнитель начинает движение в левой нижней клетке и заканчивает в правой верхней.',
   'Какое максимальное и минимальное количество монет может собрать Сборщик, пройдя от начальной клетки до конечной?','Исходные данные для Робота записаны в файле в виде прямоугольной таблицы, каждая ячейка которой соответствует клетке квадрата.','В ответе укажите сначала максимальный, затем минимальный результат, который может быть получен исполнителем.')),
 T('36.1',12,'36.1-s12.xlsx','walls_rd',P('Квадрат разлинован на N × N клеток (1 &lt; N &lt; 30). '+RD+' '+WALLS,COIN,'Определите максимальную и минимальную денежные суммы, которые может собрать Робот, пройдя из левой верхней клетки в правую нижнюю. '+MAXMIN,'Исходные данные представляют собой электронную таблицу размером N × N, каждая ячейка которой соответствует клетке квадрата. Внутренние и внешние стены обозначены утолщёнными линиями.','Пример входных данных:'),extra=[EX_A]),
 T('36.1',13,'36.1-s13.xlsx','walls_rd',P('(Демо 2023) Квадрат разлинован на N × N клеток (1 &lt; N &lt; 30). '+RD+' '+WALLS+' '+COIN,'Определите максимальную и минимальную денежные суммы, которые может собрать Робот, пройдя из левой верхней клетки в правую нижнюю. '+MAXMIN,'Исходные данные представляют собой электронную таблицу размером N × N, каждая ячейка которой соответствует клетке квадрата. Внутренние и внешние стены обозначены утолщенными линиями.','Пример входных данных'),
   extra=[EX_A,{'t':'details','title':'Видеоразбор','v':VIDEO13}]),
]
L2=[
 T('36.2',1,'36.2-s01.xlsx','corner',corner_text('ЕГЭ 2023',order='minmax',try_first=True),order='minmax'),
 video('Разбор: угловые клетки'),
 T('36.2',3,'36.2-s03.xlsx','corner',corner_text('ЕГЭ 2023')),
 T('36.2',4,'36.2-s04.xls','corner',corner_text('Пересдача 2024')),
 T('36.2',5,'36.2-s05.xls','walls_rd',walls_text('Е. Богданов',TRY,demo_word='клетке')),
 video('Разбор задачи Е. Богданова'),
 T('36.2',7,'36.2-s07.xlsx','corner',corner_text('ЕГЭ 2025')),
 video('Разбор ЕГЭ 2025'),
 T('36.2',9,'36.2-s09.xlsx','corner',corner_text('ЕГЭ 2025')),
 T('36.2',10,'36.2-s10.xlsx','corner',corner_text('ЕГЭ 2025')),
 T('36.2',11,'36.2-s11.ods','corner',corner_text('Демо 2026')+P('Пример входных данных'),extra=[EX_B]),
 T('36.2',12,'36.2-s12.ods','corner',P('Попробуйте решить задачу самостоятельно, а после обязательно посмотрите её разбор на следующем шаге')+corner_text('')),
 video('Разбор задачи с угловыми клетками'),
 T('36.2',14,'36.2-s14.ods','corner',corner_text('')),
]
L3=[
 T('36.3',1,'36.3-s01.ods','corner',corner_text('ФИПИ')),
 T('36.3',2,'36.3-s02.xls','corner',P('(Резерв 2024) Квадрат разлинован на N × N клеток (1 &lt; N &lt; 30). '+RD+' '+WALLS,COIN,CORNER,'Исходные данные записаны в файле 18-36.3-02.xlsx в виде электронной таблице.',ASK_C,MAXMIN)),
 T('36.3',3,'36.3-s03.xls','corner',corner_text('ЕГЭ 2025')),
 T('36.3',4,'36.3-s04.xls','zero_rd',P('(Е. Джобс) Квадрат разлинован на N×N клеток (1 &lt; N &lt; 17). '+RD+' В каждой клетке квадрата записано число от 10 до 99. Посетив клетку, Робот прибавляет к счету значение, записанное в этой клетке. Роботу запрещается посещать клетки с нулевым значением.','Гарантируется, что допустимый путь Робота из начальной ячейки в конечную существует.','Исходные данные записаны в файле в виде электронной таблице размером N×N, каждая ячейка которой соответствует клетке квадрата.','Определите максимальный и минимальный счёт, который может собрать Робот, пройдя из левой верхней клетки в правую нижнюю.','В ответе укажите два числа – сначала минимальный счёт, затем максимальный.'),order='minmax',keep0=True),
]
COURSE={'id':'ege-inf','title':'ЕГЭ по информатике','section':{'num':36,'title':'№ 18 Динамика в электронных таблицах','lessons':[
 {'num':'36.1','title':'Базовый уровень Ⅰ','steps':L1},
 {'num':'36.2','title':'Базовый уровень ⅠⅠ','steps':L2},
 {'num':'36.3','title':'Тренировка','steps':L3},
]}}
open(os.path.join(ROOT,'src/18/course.js'),'w').write('/* Данные курса № 18. Собирается скриптом src/18/build18.py */\nwindow.COURSE = '+json.dumps(COURSE,ensure_ascii=False,indent=1)+';\n')
with open(os.path.join(ROOT,'src/18/answers.md'),'w') as f:
    f.write('# Ключ ответов: курс № 18\n\n| Урок, шаг | Ответ |\n|---|---|\n'+''.join(f'| {w} | {" ".join(str(int(x)) for x in a)} |\n' for w,a in KEY))
print('steps',[len(L1),len(L2),len(L3)]); print('\n'.join(f'{w}: {a}' for w,a in KEY))
