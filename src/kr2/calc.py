"""Контрольная № 2 (кинематика): считает ответы и хеши для страницы, печатает журнал."""
import json, re
from fractions import Fraction as F


def f(x):
    """Число в виде строки без хвостовых нулей: 51.4286, 2.5, 4"""
    x = F(x).limit_denominator(100000)
    s = ('%.4f' % float(x)).rstrip('0').rstrip('.')
    return s if s != '-0' else '0'

# ---- правильные ответы (вычислены заново, см. журнал ниже) ----
# 1.1  v_мин/v_сек = (ω_мин·R_мин)/(ω_сек·R_сек) = (1/3600·3)/(1/60·1) = 1/20 = 0,05
# 1.2  v = 2/4 = 0,5 м/с; R = 0,25 м; ω = v/R = 2 рад/с
# 1.3  a = 4π²R/T² = 4π²·3/100 ≈ 1,18 м/с² (с π²≈10 → 1,2)
# 1.4  a = ω²R; a_гидр/a_пар = (ω/40)²·8R/(ω²R) = 8/1600 = 0,005 = 1/200
# 1.5  ω = 2π/4; v₂ = ωL − v₁ = π/2 − 0,4 ≈ 1,17 м/с
# 2.1  ν = v/(2πR); R_перед = R_зад/2 → ν_перед/ν_зад = 2
# 2.2  v_вал = 10/20 = 0,5 м/с; v_рук = 3·v_вал = 1,5 м/с
# 2.3  v = 20 м/с; a = vω = v·2πν = 20·16π ≈ 1005,3 м/с²
# 2.4  a = v²/R; a₂/a₁ = (2v)²/(4R) ÷ v²/R = 1
# 2.5  R = 3(R − 6) → R = 9 см
ANS = {
    '1': {'1': '0,05', '2': '2', '3': '1,18', '4': '0,005', '5': '1,17'},
    '2': {'1': '2', '2': '1,5', '3': '1005,3', '4': '1', '5': '9'},
}

SALT = 'inf-kr2'
# Задач с двумя ответами нет: у всех один ответ, поэтому MULTI = 0 везде.
MULTI = {}


def norm(s, multi=False):
    s = s.strip().lower().replace(' ', '').replace('\u00a0', '')
    s = s.replace('ё', 'е')
    s = re.sub(r'(рад/с|м/с2|м/с²|м/с|см|км/ч|об/с)', '', s)   # единицы, если их вписали
    s = re.sub(r'(\d)\.(\d)', r'\1,\2', s)                      # 0.4 -> 0,4, но дроби не трогаем
    if multi:
        parts = [p for p in s.replace(';', ',').split(',') if p]
        return ', '.join(parts)
    return s


def h(s):
    x = 0x811c9dc5
    for c in s:
        x ^= ord(c)
        x = (x * 0x01000193) & 0xFFFFFFFF
    return format(x, 'x')


KEY = {v: {n: h(f'{SALT}|{v}|{n}|{norm(a)}') for n, a in d.items()} for v, d in ANS.items()}
PIN_RAW = '1147'
PIN = h(SALT + '|pin|' + PIN_RAW)

if __name__ == '__main__':
    print('const KEY=' + json.dumps(KEY, ensure_ascii=False, separators=(',', ':')) + ';')
    print(f'const PIN="{PIN}", SALT="{SALT}";')
    print(f'// код учителя: {PIN_RAW}')
    for v, d in ANS.items():
        for n, a in d.items():
            print(v, n, '->', a, '| хеш', KEY[v][n])