"""Ответы к задачам № 5, у которых нет верных попыток: перебор по условию."""
def tern(n):
    s=''
    while n: s=str(n%3)+s; n//=3
    return s or '0'
def k58(order):
    for K in range(1000,10000):
        d=[int(c) for c in str(K)]; S=sum(d); P1=S-max(d); P2=S-min(d)
        a,b=sorted([P1,P2]) if order=='up' else sorted([P1,P2],reverse=True)
        yield K,int(str(a)+str(b))
r58=next(K for K,L in k58('up') if L==1319)
r59=next(K for K,L in k58('down') if L==2015)
def f63(N):
    t=tern(N)
    t+= t[-2:] if N%3==0 else tern(sum(map(int,t)))
    return int(t,3)
r63=min(R for N in range(1,10000) if (R:=f63(N))>220 and R%2==0)
def f64(N):
    b=bin(N)[2:]
    b+= b[-3:] if N%3==0 else bin((N%3+1)*3)[2:]
    return int(b,2)
r64=max(R for N in range(1,10000) if (R:=f64(N))<=468)
def f611(N):
    b=bin(N)[2:]
    b= b.replace('1','11') if N%2==0 else b.replace('0','00')
    return int(b,2)
r611=max(N for N in range(1,10000) if (R:=f611(N))<68 and R!=N)
def f79(N):
    b=bin(N)[2:]; b+= '101' if N%5==0 else '1'
    b+= '111' if int(b,2)%7==0 else '1'
    return int(b,2)
r79=max(N for N in range(1,2000000) if f79(N)<1728404)
def f710(N):
    b=bin(N)[2:]; x=N
    for _ in range(3):
        b+= '1' if sum(map(int,str(x)))%2 else '0'; x=int(b,2)
    return x
lo,hi=123456789,1987654321
# R>>3 == N, значит разные N дают разные R: считаем N, у которых R попадает в отрезок
nlo,nhi=lo//8-2,hi//8+2
inner=sum(1 for N in list(range(nlo,nlo+10))+list(range(nhi-10,nhi+1)) if lo<=f710(N)<=hi)
r710=(nhi-10-(nlo+10))+inner
# проверка: R(N) монотонно растёт, значит середина целиком внутри
assert lo<=f710(nlo+10)<=hi and lo<=f710(nhi-11)<=hi
for k,v in dict(r58=r58,r59=r59,r63=r63,r64=r64,r611=r611,r79=r79,r710=r710).items(): print(k,v)
