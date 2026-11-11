import openpyxl
THICK={'medium','thick','double','mediumDashed','mediumDashDot','mediumDashDotDot','slantDashDot'}
def load(path):
    wb=openpyxl.load_workbook(path); ws=wb.worksheets[0]
    cells=[(c.row,c.column) for row in ws.iter_rows() for c in row if isinstance(c.value,(int,float))]
    r0=min(r for r,_ in cells); r1=max(r for r,_ in cells); c0=min(c for _,c in cells); c1=max(c for _,c in cells)
    R,C=r1-r0+1,c1-c0+1
    val=[[ws.cell(r0+i,c0+j).value for j in range(C)] for i in range(R)]
    def th(side): return side is not None and side.style in THICK
    def b(i,j): return ws.cell(r0+i,c0+j).border
    # wall to the right of (i,j) / below (i,j); outer edges are walls
    right=[[ (j==C-1) or th(b(i,j).right) or th(b(i,j+1).left) for j in range(C)] for i in range(R)]
    down=[[ (i==R-1) or th(b(i,j).bottom) or th(b(i+1,j).top) for j in range(C)] for i in range(R)]
    return wb,ws,(r0,c0),val,right,down
def solve(val,right,down,start=(0,0),dirs=('R','D'),ends='corner',forbid0=False):
    """dirs: moves allowed; ends: 'corner' (stop where both moves blocked) or (i,j) target cell"""
    R,C=len(val),len(val[0])
    step={'R':(0,1),'D':(1,0),'U':(-1,0),'L':(0,-1)}
    def blocked(i,j,d):
        if d=='R': return right[i][j]
        if d=='L': return j==0 or right[i][j-1]
        if d=='D': return down[i][j]
        if d=='U': return i==0 or down[i-1][j]
    # topological order: process by increasing distance in move direction
    import functools,sys
    sys.setrecursionlimit(100000)
    order=sorted(((i,j) for i in range(R) for j in range(C)), key=lambda p: sum((p[0]*step[d][0]+p[1]*step[d][1]) for d in dirs))
    mx={start:val[start[0]][start[1]]}; mn=dict(mx)
    if forbid0 and val[start[0]][start[1]]==0: return None
    for (i,j) in order:
        if (i,j) not in mx: continue
        for d in dirs:
            if blocked(i,j,d): continue
            ni,nj=i+step[d][0],j+step[d][1]
            v=val[ni][nj]
            if forbid0 and v==0: continue
            mx[(ni,nj)]=max(mx.get((ni,nj),-10**18),mx[(i,j)]+v)
            mn[(ni,nj)]=min(mn.get((ni,nj),10**18),mn[(i,j)]+v)
    if ends=='corner':
        fin=[p for p in mx if all(blocked(p[0],p[1],d) for d in dirs)]
    else:
        fin=[ends] if ends in mx else []
    return max(mx[p] for p in fin), min(mn[p] for p in fin), len(fin)

def trucks(val):
    """4 исполнителя из центра в углы; каждый может идти только к своему углу. Максимум для каждого."""
    N=len(val); c=N//2; res=[]
    for di,dj in ((-1,-1),(-1,1),(1,-1),(1,1)):
        best={}
        rows=range(c,-1,-1) if di<0 else range(c,N)
        cols=range(c,-1,-1) if dj<0 else range(c,N)
        for i in rows:
            for j in cols:
                prev=[]
                if i!=c: prev.append(best[(i-di,j)])
                if j!=c: prev.append(best[(i,j-dj)])
                best[(i,j)]=val[i][j]+(max(prev) if prev else 0)
        res.append(best[(0 if di<0 else N-1, 0 if dj<0 else N-1)])
    return sorted(res)
