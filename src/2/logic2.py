# -*- coding: utf-8 -*-
"""Раздел «№ 2 Логика»: таблицы истинности, столбцы и переменные.

Здесь живёт вся математика раздела, независимая от сбора данных:
  * формула в любой записи (Stepik, LaTeX КЕГЭ, Python) -> дерево;
  * фрагмент таблицы (картинка Stepik / HTML-таблица КЕГЭ);
  * перебор соответствий «столбец -> переменная» с проверкой каждого ответа.

Записи формул, которые встречаются в условиях:
  ¬x ∧ y ∧ z        ∨  ∨  ⋁        символы Юникода
  v  /\\  \\/        «v» как «или», /\\ как «и»
  \\( \\neg y \\lor x \\)            LaTeX из банка КЕГЭ
  not x and (y or z)              уже Python

Ответ задачи НЕ берётся из ключа банка: ищем такое соответствие столбцов
переменным, при котором каждая строка фрагмента объясняется функцией F.
Совпало с ключом — ответ подтверждён; не совпало — задача в разбор.
"""
import ast
import itertools
import re

VARS = "xyzwabcdrstuhkmnlpyz"


# --------------------------------------------------------------------------
# 1. Формула -> строка Python
# --------------------------------------------------------------------------

ENT = {
    "&not;": " ¬ ", "&amp;not;": " ¬ ", "&and;": " ∧ ", "&amp;and;": " ∧ ",
    "&or;": " ∨ ", "&amp;or;": " ∨ ", "&rarr;": " → ", "&amp;rarr;": " → ",
    "&equiv;": " ≡ ", "&amp;equiv;": " ≡ ", "&nbsp;": " ", "&xrarr;": " → ",
    "&larr;": " ← ", "&ge;": " ≥ ", "&le;": " ≤ ", "&lt;": " < ", "&gt;": " > ",
    "&minus;": " - ", "&#172;": " ¬ ", "&#8743;": " ∧ ", "&#8744;": " ∨ ",
    "&#8594;": " → ", "&#8801;": " ≡ ", "&not": " ¬ ", "&and": " ∧ ", "&or": " ∨ ",
    "&rarr": " → ", "&equiv": " ≡ ",
}


def unent(t):
    """HTML-сущности логических знаков -> символы (part2 банка ими грешит)."""
    for a, b in ENT.items():
        t = t.replace(a, b)
    return t


def strip_latex_delims(t):
    """Снимает обёртки LaTeX и превращает имена команд в операторы."""
    t = t.replace("\\leftrightarrow", " eqv ")
    t = t.replace("\\leftarrow", " imp ")
    t = t.replace("\\rightarrow", " imp ")
    t = t.replace("\\Rightarrow", " imp ")
    t = t.replace("\\Leftrightarrow", " eqv ")
    t = t.replace("\\Leftarrow", " imp ")
    t = t.replace("\\wedge", " and ")
    t = t.replace("\\land", " and ")
    t = t.replace("\\vee", " or ")
    t = t.replace("\\lor", " or ")
    t = t.replace("\\lnot", " not ")
    t = t.replace("\\neg", " not ")
    t = t.replace("\\oplus", " xor ")
    t = t.replace("\\to", " imp ")
    t = t.replace("\\equiv", " eqv ")
    for d in ("\\(", "\\)", "\\[", "\\]", "$", "\\"):
        t = t.replace(d, " ")
    return unent(t)

LATEX_SEG = re.compile(r"\\((.+?)\\)", re.S)


UNI = {
    "¬": " not ", "∧": " and ", "⋀": " and ", "∨": " or ", "⋁": " or ",
    "→": " imp ", "⇒": " imp ", "≡": " eqv ", "⇔": " eqv ", "↔": " eqv ",
    "⊕": " xor ", "˄": " and ", "˅": " or ",
}


def clean_unicode(s):
    """Символы логики Юникода и письменные связки -> слова операторов."""
    for a, b in UNI.items():
        s = s.replace(a, b)
    s = s.replace("/\\", " and ").replace("\\/", " or ")
    s = re.sub(r"(?<=[-=~!<>])\s*v\s*(?=[(\w])", " or ", s)
    return s


OPS_RE = re.compile(
    r"¬|∧|∨|→|⇒|≡|⇔|⊕|˄|˅|⋀|⋁|/\\|\\/|\bv\b|"
    r"\b(?:and|or|not|imp|eqv|xor)\b"
)


LINES_SPLIT = re.compile(r"[.?!]\s+|\n|;|\s+/\s+")


def find_ops_res(seg):
    """Есть ли в куске текста логические знаки или слова-связки."""
    return bool(OPS_RE.search(seg))


def chunk_count(s):
    """Сколько оторванных от текста кусков: F1, u1, u2, 0, 1 — для отсева мусора."""
    return len(re.findall(r"(?<![A-Za-z_])[A-Za-z]\d+(?![A-Za-z_])", s))


def find_formula(text, count, strict=True):
    """Достаёт из текста задания формулу, которую нужно поставить в F.

    count — сколько переменных в задаче. Формула сидит среди прозы
    («Функция F задаётся выражением … , но успел»), поэтому текст режется на
    куски по служебным фразам, и каждый кусок проверяется как формула.
    Побеждает самый длинный разбор с точно count переменными.
    """
    t = strip_latex_delims(text)
    t = re.sub(r"<table[\s\S]*?</table>", " ", t)      # таблица не часть формулы
    t = re.sub(r"<[^>]+>", " ", t)
    t = re.sub(r"&nbsp;", " ", t).replace("\xa0", " ").replace("\u2009", " ")
    t = re.sub(r"[A-ZА-Я]\s*\.\s*[А-ЯA-Z][а-яa-z]+", " ", t)   # «М. Шагитов»
    t = re.sub(r"\bF\s*(?:[01]\s*){2,}", " ", t)      # «F 0 1 0 0»
    # в банке встречаются заглавия русских слов и многоточия: «Дан … функции F.»
    t = t.replace("…", "...").replace("«", " ").replace("»", " ").replace("“", " ").replace("”", " ")
    t = re.sub(r"([.!?])\1+", "...", t)
    # «…d) На рисунке», «…z) Дан частично» — предложение, к которому приклеилась проза
    # «…(b → c) На рисунке», «…z) Дан частично» — предложение, к которому приклеилась проза;
    # перед пробелом должен стоять символ формулы, иначе голое «F = w or (…» разорвётся
    t = re.sub(r"(?<=[)\w])\s+(?=[А-ЯЁ])(?![А-ЯЁ]{2})", ". ", t)
    t = re.sub(r"\s+", " ", t).lower()      # буквы переменных набраны и строчными, и ЗАГЛАВНЫМИ
    cands = []
    for line in LINES_SPLIT.split(t):
        for seg in LATEX_SEG.split(line):
            seg = unent(seg)
            if not find_ops_res(seg):
                continue
            # «(a → d) ∧ ¬ (b → c) На рисунке» — только для фрагментов с пробелами вокруг букв,
            # начало формулы «F = w or (…» так не порежется
            if not re.search(r"f\s*=", seg):
                seg = re.sub(r"(?<=[)\w])\s+(?=[А-ЯЁ][а-яё])", ". ", seg)
            # «(a → d) ∧ ¬ (b → c) На рисунке» — предложение клеится к формуле
            cands.append(seg)
            # начало формулы: «F =», «F1 =», «выражением», «формулой»
            # «f (x_1, x_2, …) = формула» — список аргументов не часть выражения
            argf = re.search(r"\bf\s*\(\s*x_\d[^)]*\)\s*=\s*", seg)
            if argf:
                tail = re.search(r"\sи\s+фрагмент", seg[argf.end():])
                cands.append(seg[argf.end():argf.end() + tail.start()] if tail else seg[argf.end():])
            # «…функция, для которой Вася заполнял таблицу, следующая: формула»
            coll = re.search(r"\b(?:следующ\w*|имеет вид|имеет следующий вид)\s*:?\s*", seg)
            if coll:                                                      # noqa: E701
                cands.append(seg[coll.end():])
            for pat in (r"(?<!\S)\sи\s+(?=фрагмент)",              # «…формула и фрагмент таблицы»
                        r"\bf\s*[12]?\s*=", r"\bвыражени\w*\b", r"\bформул\w*\b",
                        r"\bфункци\w*\s*:"):
                mm = re.search(pat, seg)
                if mm:
                    cands.append(seg[mm.end():])
                    cands.append(re.sub(r"^\s*:?\s*", "", seg[mm.end():]))   # «выражением: …»
            # хвост после формулы: «, но успел», «. на рисунке», «дан частично»;
            # русское слово после формулы = начало прозы («d) на рисунке…»)
            cut = (re.search(r"(?:[.,]\s*но\s|\.\s*на рисунке|\.\s*дан\s|\.\s*изображ)", seg)
                   or re.search(r"\)\s+[а-яё]{2,}", seg)                # «(z imp y) ещё не …»
                   or re.search(r"[.,]?\s+(?:но|однако|а|даже|забыв|которая|который|которые|что)\s+", seg))
                   # «z , но успел», «…, даже не указав», «…, которая определяла»
            if not cut:
                cut = re.search(r"(?:[a-z0-9)]\s{2,}[а-яё]|[)]\s[а-яё]{2,})", seg)   # хвост прозы
            # конец формулы в пробелах текста
            cut_end = cut.start() if cut else None
            if not cut_end:
                # «f = a and not b or c перепутали столбцы» — формула приклеена к строчной прозе
                mm = re.search(r"\bf\s*[12]?\s*=", seg)
                if mm:
                    tail_cut = re.search(r"(?<=[a-z0-9)])\s+(?=[а-яё])", seg[mm.end():])
                    if tail_cut:
                        cut_end = mm.end() + tail_cut.start()
            if cut_end is not None:
                cands.append(seg[:cut_end])
                # то же без пролога: «…функции z or not (w imp x) or …, однако успел»
                mm = re.search(r"\b(?:функци|выражени|формул)\w*(?:\s+(?![а-яё])f)?\s*:?\s*(?:задаётся|задана|задана)?\s*(?:выражением|выражения|выражение|формулой)?\s*:?\s+((?:not\s+)?[(¬a-z1])", seg)
                if mm and mm.start(1) < cut_end:
                    cands.append(seg[mm.start(1):cut_end])
                for pat in (r"\bf\s*[12]?\s*=", r"\bформулой\b"):
                    mm = re.search(pat, seg)
                    if mm and mm.end() < cut_end:
                        cands.append(seg[mm.end():cut_end])
    cands = [re.sub(r"^\(\s*\)\s*|[\u00a0\u2009]", " ", c) for c in cands]
    # «две функции заданы выражениями: f_1 = …» — имя функции перед «=» не часть формулы
    cands += [re.sub(r"^\s*[a-z]_?\d+\s*=", " ", c) for c in list(cands)]
    # «Миша заполнял… функции (формула)» — формула без «F =»
    for c in list(cands):
        mm = re.search(r"\b(?:функци|выражени|формул)\w*(?:\s+(?![а-яё])f)?\s*:?\s*(?:задаётся|задана)?\s*"
                      r"(?:выражением|выражения|выражение|формулой)?\s*:?\s+((?:not\s+)?[(¬a-z1])", c)
        if mm:
            cands.append(c[mm.start(1):])
    # «…(x imp not z) . на рисунке» — точка-разделитель приклеена к формуле
    cands += [re.sub(r"[\s.,;:]+$", "", c) for c in list(cands)]
    out = []
    seen = set()
    for c in cands:
        key = c.strip()
        if key in seen:
            continue
        seen.add(key)
        try:
            tree = parse(c)
        except Exception:  # noqa: BLE001 — строка текста, а не формула
            continue
        vs = tree_vars(tree)
        if len(vs) == count or (not strict and len(vs) > 0):
            out.append((c.strip(), to_python(tree)))
    out.sort(key=lambda x: len(x[0]))
    return out[-1] if out else None

# --------------------------------------------------------------------------
# 2. Инфиксная запись -> вложенные списки
# --------------------------------------------------------------------------
# Уровни: 1 — эквивалентность (самая младшая связка), 2 — импликация, 3 — или, 4 — и, 5 — не
PREC = {"eqv": 1, "imp": 2, "or": 3, "xor": 3, "and": 4, "not": 5}


def clean_ops(s):
    """Письменные операторы -> слова операторов (и `==` как эквивалентность)."""
    s = clean_unicode(s)
    s = re.sub(r"_?eqv\b|<=>", " eqv ", s)
    s = re.sub(r"_?imp\b|=>|->", " imp ", s)
    s = s.replace("!=", " xor ").replace("<->", " eqv ").replace("==", " eqv ")
    for sym, word in (("~", " not "), ("!", " not ")):
        s = s.replace(sym, word)
    return s


def tokenize(s):
    s = clean_ops(s)
    s = re.sub(r"\s*-\s*(?=\))", " not ", s)
    s = re.sub(r"\)\s*-\s*(?=\w)", ") and not ", s)
    # неявная конъюнкция: 2x, (a)b, x3 — но не «) and» / «) or»
    s = re.sub(r"(?<=\d)(?!\s*(?:and|or|not|imp|eqv|xor)\b)(?=[A-Za-z(])"
               r"|(?<=\))(?!\s*(?:and|or|not|imp|eqv|xor)\b)(?=[A-Za-z(])"
               r"|(?<=[A-Za-z])(?=\d)", " and ", s)
    s = s.replace("(", " ( ").replace(")", " ) ")
    toks = fix_eqv_chain([x for x in s.split() if x])
    out = []
    i = 0
    while i < len(toks):
        t = toks[i]
        if t in ("imp", "eqv", "xor"):
            out.append(t)
        elif t in ("and", "or", "not"):
            out.append(t)
        elif t == "(" or t == ")":
            out.append(t)
        elif re.fullmatch(r"[%s]" % VARS, t):
            out.append(t)
        elif re.fullmatch(r"[01]", t):
            out.append(t)
        elif re.fullmatch(r"[%s]_?\d+|[xy]\d+" % VARS, t):
            out.append(t)  # x_1, p_3 … — именованные переменные в задачах с индексом
        else:
            raise ValueError("непонятный токен: %r в %r" % (t, s))
        i += 1
    return out


PREC_ORDER = {"xor": 1, "imp": 2, "eqv": 2, "or": 3, "and": 4}


def fix_eqv_chain(toks):
    """Правую ветвь `eqv`/`imp` закрываем скобками (связки этих уровней — правосвязные).

    «a ≡ b ∨ b → c»: после ≡ идёт → того же приоритета, значит правая ветвь ≡ — это
    (b → c), а ∨ уровня ниже уже вне её: (a ≡ (b → c)) ∨ …
    """
    toks = list(toks)
    for _ in range(50):
        cut = _first_mixed(toks)
        if cut is None:
            return toks
        head, op, tail = cut
        # первая связка tail отделяет правый операнд; ищем следующую того же уровня
        k = _same_level(tail[1:], PREC_ORDER[op])
        if k < 1:
            return toks
        k += 1
        toks = head + [op] + ["("] + tail[:k] + [")"] + tail[k:]
    return toks


def _same_level(toks, prec):
    """Индекс первой связки приоритета prec на нулевом уровне скобок."""
    depth = 0
    for k, t in enumerate(toks):
        if t == "(":
            depth += 1
        elif t == ")":
            depth -= 1
        elif depth == 0 and t in PREC_ORDER and PREC_ORDER[t] == prec:
            return k
    return -1


def _levels(toks):
    """Для каждой позиции — уровень приоритета связки на этом уровне скобок (иначе None).

    Связки уровня `and` внутри скобок невидимы; сами скобки пропускаются целиком.
    """
    out = [None] * len(toks)
    depth = 0
    for k, t in enumerate(toks):
        if t == "(":
            depth += 1
        elif t == ")":
            depth -= 1
        elif depth == 0 and t in PREC_ORDER:
            out[k] = PREC_ORDER[t]
    return out


def _skip_operand(toks, k):
    """Индекс следующей связки после операнда, начинающегося с toks[k]."""
    depth = 0
    k += 1
    while k < len(toks):
        t = toks[k]
        if t == "(":
            depth += 1
        elif t == ")":
            if depth == 0:
                return k
            depth -= 1
        elif depth == 0 and t in PREC_ORDER:
            return k
        k += 1
    return k


def _first_mixed(toks):
    """Первая связка `head op tail`, где в tail на том же уровне есть связка того же приоритета."""
    levels = _levels(toks)
    for k, t in enumerate(toks):
        if levels[k] is None:
            continue
        # правая ветвь — всё до следующего «равного» оператора; ∨/∧ слабее: пропускаем
        j = _skip_operand(toks, k)
        if j < len(toks) and levels[j] is not None and levels[j] == levels[k]:
            return toks[:k], t, toks[k + 1:]
    return None


class Parser:
    def __init__(self, toks):
        self.t = toks
        self.i = 0

    def peek(self):
        return self.t[self.i] if self.i < len(self.t) else None

    def take(self):
        x = self.peek()
        self.i += 1
        return x

    def parse(self, minp=0):
        left = self.parse_unary()
        while True:
            op = self.peek()
            if op not in PREC or PREC[op] < minp:
                break
            self.take()
            right = self.parse(PREC[op] + 1)
            if op in ("and", "or") and isinstance(left, list) and left[0] == op:
                left = left + [right]          # ассоциативная связка: and(l, m, r)
            else:
                left = [op, left, right]
        return left

    def parse_unary(self):
        op = self.peek()
        if op == "not":
            self.take()
            return ["not", self.parse_unary()]
        if op == "(":
            self.take()
            e = self.parse(0)
            if self.peek() != ")":
                raise ValueError("нет закрывающей скобки")
            self.take()
            return e
        x = self.take()
        if x is None:
            raise ValueError("формула оборвалась")
        return ("const", int(x)) if x in ("0", "1") else ("var", x)


def parse(expr):
    """Формула -> дерево: ('var','x') | ('const',1) | ['and',l,r] | ['not',x] …"""
    toks = tokenize(expr)
    if not toks:
        raise ValueError("пустая формула")
    p = Parser(toks)
    tree = p.parse(PREC["eqv"])
    if p.peek() is not None:
        raise ValueError("лишнее после формулы: %r" % (p.t[p.i:],))
    return tree


def rename_vars(node, names):
    """Дерево -> дерево с переименованными переменными (p_3 -> z).

    Узел — список [оператор, дети...] или ("var", имя).
    """
    if isinstance(node, tuple):
        if node[0] == "var" and node[1] in names:
            return ("var", names[node[1]])
        return node
    return [node[0]] + [rename_vars(child, names) for child in node[1:]]


def tree_vars(tree):
    out = set()

    def go(n):
        if isinstance(n, tuple):
            if n[0] == "var":
                out.add(n[1])
        else:
            for x in n[1:]:
                go(x)

    go(tree)
    return out


# --------------------------------------------------------------------------
# 3. Вычисление дерева
# --------------------------------------------------------------------------

def _el(t, e):
    """Литерал из ручных деревьев -> ("var", имя)."""
    return ("var", t) if isinstance(t, str) else t


def evaluate(tree, env):
    if isinstance(tree, str):
        tree = ("var", tree)
    if isinstance(tree, tuple) and tree[0] in ("var", "const"):
        if tree[0] == "const":
            return tree[1]
        if tree[1] not in env:
            raise ValueError("переменная %s не задана" % (tree[1],))
        v = env[tree[1]]
        return 1 if v else 0
    op = tree[0]
    if op == "not":
        return 0 if evaluate(tree[1], env) else 1
    if op == "and":
        return 1 if all(evaluate(x, env) for x in tree[1:]) else 0
    if op == "or":
        return 1 if any(evaluate(x, env) for x in tree[1:]) else 0
    if op == "imp":
        a, b = evaluate(tree[1], env), evaluate(tree[2], env)
        return 0 if (a == 1 and b == 0) else 1
    if op == "eqv":
        return 1 if evaluate(tree[1], env) == evaluate(tree[2], env) else 0
    if op == "xor":
        return 1 if evaluate(tree[1], env) != evaluate(tree[2], env) else 0
    raise ValueError("неизвестная операция %r" % op)


def _eqv(*xs):
    """Эквивалентность n аргументов (XOR чётности в to_python)."""
    return int(len(set(int(bool(x)) for x in xs)) == 1)


def _xor(*xs):
    return int(sum(int(bool(x)) for x in xs) % 2 == 1)


def to_python(tree):
    """Дерево -> выражение Python (для показа ученику и отладки)."""
    if isinstance(tree, tuple):
        return tree[1] if tree[0] == "var" else str(tree[1])
    op = tree[0]
    if op == "not":
        return "not " + to_python(tree[1])
    if op == "imp":
        return "(not %s or %s)" % (to_python(tree[1]), to_python(tree[2]))
    sym = {"and": "and", "or": "or", "eqv": "_eqv", "xor": "_xor"}[op]
    return "(" + (" %s " % sym).join(to_python(x) for x in tree[1:]) + ")"


# --------------------------------------------------------------------------
# 4. Фрагмент таблицы
# --------------------------------------------------------------------------

def cv(v):
    v = (v or "").strip()
    if v in ("1", "0"):
        return int(v)
    if v.lower() in ("true", "истина"):
        return 1
    if v.lower() in ("false", "ложь"):
        return 0
    if re.fullmatch(r"[a-eа-е]", v.lower()):
        return v.lower()            # «…[a]…» — буква-неизвестная в ячейке, не пустая ячейка
    return None


def parse_html_table(html):
    """HTML-таблица -> {'rows': [...], 'f': [...]}; пустая ячейка — None."""
    m = re.search(r"<table[\s\S]*?</table>", html)
    if not m:
        return None
    rows = re.findall(r"<tr[\s\S]*?</tr>", m.group(0))
    grid = []
    for r in rows:
        cells = re.findall(r"<t[dh][^>]*>([\s\S]*?)</t[dh]>", r)
        clean = []
        for c in cells:
            # x<sub>1</sub> -> x_1, чтобы имя переменной совпало с формулой
            c = re.sub(r"<sub>\s*([^<]*)</sub>", r"_\1", c)
            clean.append(re.sub(r"<[^>]+>", "", c).replace("&nbsp;", " ").strip())
        grid.append(clean)
    grid = [g for g in grid if g]
    if len(grid) < 2:
        return None
    head, body = grid[0], grid[1:]
    # структуру задаёт шапка; строки бывают и без пустых ячеек, и с огрызком в конце
    width = len(head)
    # «1 2 3 4 5» в шапке — номера столбцов, тогда последний столбец с индексом строки
    numbered = width < max(len(g) for g in body) and all(h.isdigit() for h in head)
    observed = width - (0 if numbered else 1)
    legend = not numbered and all(h.isdigit() for h in body[0] if h)
    if legend and len(body[0]) > width:
        body = body[1:]
    fv, rows = [], []
    for g in body:
        pad = [None] * (width - len(g))
        cells = pad + g if numbered else g + pad
        fv.append(None if numbered else cv(cells[observed]))
        rows.append([cv(x) for x in cells[:observed]])
    return {"rows": rows, "f": fv, "head": head}


def parse_all_tables(html):
    """HTML -> список таблиц {'rows', 'f'}: в банке есть задачи с тремя таблицами."""
    out = []
    for m in re.finditer(r"<table[\s\S]*?</table>", html):
        t = parse_html_table(m.group(0))
        if t and t["rows"]:
            out.append(t)
    return out


def solve_cells(tree, head, rows, fvals):
    """Задача с буквами в ячейках: «…[a]…1», ответ — значения a, b, c… подряд.

    head — имена столбцов (x_1 … x_5), rows — значения ячеек (1/0/None/'a'), fvals — столбец F.
    Буквы встречаются и в переменных, и в F. Возвращает строку вида '00101' или None.
    """
    cols = [h.lower().strip() for h in head[:-1]]
    letters = []
    for r in rows + [[f] for f in fvals]:
        for c in r:
            if isinstance(c, str) and c not in letters:
                letters.append(c)
    letters.sort()
    if not letters:
        return None
    dom = {c: {0, 1} for c in letters}
    for _ in range(16):
        changed = False
        for r, fv in zip(rows, fvals):
            fixed = {v: c for v, c in zip(cols, r) if isinstance(c, int)}
            free = [(v, dom[c]) for v, c in zip(cols, r) if isinstance(c, str)]
            fdom = dom[fv] if isinstance(fv, str) else {int(fv)}
            keep = {}
            for v, dom_v in free:
                ok = set()
                rest = [(v2, d2) for v2, d2 in free if v2 != v]
                for b in dom_v:
                    for combo in itertools.product(*[d for _, d in rest]) if rest else [()]:
                        env = dict(fixed)
                        env[v] = b
                        env.update({v2: x for (v2, _), x in zip(rest, combo)})
                        if evaluate(tree, env) in fdom:
                            ok.add(b)
                            break
                keep[v] = ok
            if not free and isinstance(fv, str) and len(fixed) == len(cols):
                ok = {evaluate(tree, fixed)}
                if ok != dom[fv]:
                    dom[fv] = ok
                    changed = True
            for v, ok in keep.items():
                name = dict(zip(cols, r))[v]
                if ok and ok != dom[name]:
                    dom[name] = ok
                    changed = True
        if not changed:
            break
    if any(len(d) != 1 for d in dom.values()):
        return None
    return "".join(str(min(dom[l])) for l in letters)


def solve_count(tree, rows, fvals, unique_rows=False, mode="fragment"):
    """Сколько всего достроек даёт таблица: сумма по всем порядкам столбцов.

    Так считаются задачи «сколько существует различных способов расстановки»:
    ответ — не число порядков, а число наборов-достроек подходящих под таблицу.
    """
    total = 0
    for perm in sorted(itertools.permutations(sorted(tree_vars(tree)))):
        per_row = [fills_row(tree, perm, vals, fv, max_per_row=64)
                   for vals, fv in zip(rows, fvals) if fv is not None]
        if any(not c for c in per_row):
            continue
        if unique_rows:
            for pick in itertools.product(*per_row):
                if len(set(pick)) == len(pick):
                    total += 1
        else:
            total += sum(len(c) for c in per_row)
    return total


def fills_row(tree, perm, vals, fv, max_per_row=None):
    """Все достройки одной строки (в порядке perm), при которых F=fv."""
    vars_ = tree_vars(tree)
    fixed = {v: vals[pos] for pos, v in enumerate(perm) if vals[pos] is not None}
    miss = [v for v in sorted(vars_) if v not in fixed]
    out = set()
    for combo in itertools.product((0, 1), repeat=len(miss)):
        env = dict(fixed)
        env.update(dict(zip(miss, combo)))
        if evaluate(tree, env) == fv:
            out.add(tuple(vals[pos] if vals[pos] is not None else env[v]
                          for pos, v in enumerate(perm)))
            if max_per_row and len(out) >= max_per_row:
                break
    return out


def _solve_one(tree, vars_, rows, fvals, perm, unique_rows, mode):
    """Годится ли порядок столбцов perm для фрагмента.

    Столбцов ровно столько, сколько переменных в условии (perm — их порядок слева
    направо). Буква, которой нет в формуле, значения F не меняет, поэтому такие
    ответы находятся только перебором клеток таблицы.
    """
    cols = len(perm)
    # переменные, которые не стоят ни в одном столбце (буква есть в формуле,
    # а столбцов меньше), перебираются отдельно
    extra = [v for v in vars_ if v not in perm]
    n = len(perm) + len(extra)
    worlds = []          # (полная строка, значение F в ней)
    for combo in itertools.product((0, 1), repeat=n):
        env = dict(zip(list(perm) + extra, combo))
        worlds.append((combo[:len(perm)], 1 if evaluate(tree, env) else 0))

    def matching(vals, fv):
        return [w for w in worlds
                if w[1] == fv
                and all(vals[p] is None or vals[p] == w[0][p] for p in range(cols))]

    cands = []
    for vals, fv in zip(rows, fvals):
        if fv is None:
            continue
        hit = matching(vals, fv)
        if not hit:
            return False
        cands.append({w[0] for w in hit})
    if mode == "full":
        # полная таблица: значения F уже стоят на своих местах в порядке столбцов
        def ev(row):
            return 1 if any(1 if evaluate(tree, dict(zip(list(perm) + extra, row + tail))) else 0
                            for tail in itertools.product((0, 1), repeat=len(extra))) else 0
        return all(ev(row) == fv for row, fv in zip(rows, fvals) if fv is not None)
    if mode in ("true_rows", "false_rows"):
        # фрагмент — ВСЕ строки с F=target: каждая такая строка попадает в какую-то запись
        # фрагмента (остальные строки фрагмента — другие обнаружения той же строки)
        target = 1 if mode == "true_rows" else 0
        for row, fv in worlds:
            if fv != target:
                continue
            if not any(all(vals[p] is None or vals[p] == row[p] for p in range(cols))
                       for vals in rows):
                return False
    if unique_rows and len(cands) > 1:
        return any(len(set(pick)) == len(pick) for pick in itertools.product(*cands))
    return True


def solve(tree, rows, fvals, unique_rows=False, mode="fragment", names=None):
    """Все соответствия «позиция столбца -> переменная», объясняющие фрагмент.

    rows, fvals — строки фрагмента и значения F (None = пусто).
    names — буквы переменных из условия (по умолчанию те, что есть в формуле).
    unique_rows=True — задача про «неповторяющиеся строки».
    mode="fragment"       — известна лишь часть строк таблицы (по умолчанию);
    mode="true_rows"      — таблица содержит ВСЕ наборы, где F истинна;
    mode="false_rows"     — то же для F ложна.

    Возвращает отсортированный список строк вида ['yxzw'].
    """
    cols = len(rows[0]) if rows else 0
    if names is None:
        names = sorted(tree_vars(tree))
    names = sorted(names)
    if len(names) < cols:
        extra = [c for c in sorted(set(VARS) - set(names)) if c]
        seen, spare = set(), []
        for c in extra:
            if c not in seen:
                seen.add(c)
                spare.append(c)
        names = sorted(set(names)) + spare[:cols - len(names)]
    good = set()
    raw = sorted(tree_vars(tree))
    for perm in itertools.permutations(names, cols):
        # задача `p_1 … p_4` + заголовок `x y z w`: ответ — буквы, приписанные p_i,
        # а столбцы ищем уже среди этих букв (любая их расстановка)
        tree_here = tree
        if any(v.startswith("p_") for v in raw):
            order = sorted(raw, key=lambda v: int(v.split("_")[1]) if "_" in v else 0)
            tree_here = rename_vars(tree, {v: perm[i] for i, v in enumerate(order)})
            for cols_perm in itertools.permutations(sorted(perm), cols):
                if _solve_one(tree_here, sorted(perm), rows, fvals, cols_perm,
                              unique_rows, mode):
                    good.add("".join(perm))
                    break
            continue
        check = sorted(tree_vars(tree_here))
        if _solve_one(tree_here, check, rows, fvals, perm, unique_rows, mode):
            good.add("".join(perm))
    return sorted(good)


def count_solutions(eq_text):
    """Для задач «сколько решений имеет уравнение»: перебор всех переменных.

    Уравнение вида «(a→b)∨c→(¬a∧d)=1» — левая часть приравнена к 1.
    """
    t = clean_unicode(strip_latex_delims(eq_text))
    left, _, right = t.rpartition(" eqv ")
    if not left.strip():
        left, right = t, "1"
    tree = parse(left)
    target = 1 if right.strip() in ("1", "") else 0
    vars_ = sorted(tree_vars(tree), key=lambda v: (len(v), v))
    k = 0
    for combo in itertools.product((0, 1), repeat=len(vars_)):
        if evaluate(tree, dict(zip(vars_, combo))) == target:
            k += 1
    return k, vars_


# --------------------------------------------------------------------------
# 5. Сверка с ключом банка
# --------------------------------------------------------------------------

def answer_given(key):
    """Ответ банка -> нормализованное значение для сравнения (буквы подряд, без пробелов)."""
    k = (key or "").strip().lower()
    k = re.sub(r"[\s,;\-–—]", "", k)
    return k


def safe_eval(expr, env):
    """Безопасно считает «значение для проверки» из условия справки задачи.

    Справка у части задач — выражение с ответом, например «x and not (y == 1)»
    после замены букв. Здесь только арифметика и логика над словарём env.
    """
    tree = ast.parse(expr, mode="eval")

    def ev(n):
        if isinstance(n, ast.Expression):
            return ev(n.body)
        if isinstance(n, ast.Constant) and isinstance(n.value, (int, bool)):
            return int(n.value)
        if isinstance(n, ast.Name):
            if n.id not in env:
                raise KeyError(n.id)
            return int(env[n.id])
        if isinstance(n, ast.BoolOp):
            vals = [ev(x) for x in n.values]
            return int(all(vals)) if isinstance(n.op, ast.And) else int(any(vals))
        if isinstance(n, ast.UnaryOp) and isinstance(n.op, ast.Not):
            return 0 if ev(n.operand) else 1
        if isinstance(n, ast.BinOp) and isinstance(n.op, ast.BitAnd):
            return ev(n.left) & ev(n.right)
        if isinstance(n, ast.BinOp) and isinstance(n.op, ast.BitOr):
            return ev(n.left) | ev(n.right)
        raise ValueError("выражение в справке не поддержано: %s" % ast.dump(n))

    return ev(tree)


# --------------------------------------------------------------------------
# 6. Самопроверка
# --------------------------------------------------------------------------
if __name__ == "__main__":
    cases = [
        "F = ((x ≡ ¬y) → ¬(w → x)) ∨ ¬z",
        "¬y ∧ x ∧ (¬z ∨ w)",
        "(¬x ∧ y ∧ z) ∨ (¬x ∧ ¬z)",
        "((x → y) ∧ (y → w)) ∨ (z ≡ (x ∨ y))",
        "c ≡ b ∨ a ≡ b",
        "\\\\(w \\\\lor (\\\\neg x \\\\lor x \\\\land z) \\\\land y\\\\)",
        "F = (x ∧ ¬z ∧ ¬w) ∨ (x ∧ ¬z ∧ y)",
        "¬(w → x) v (¬z → ¬y) v z",
        "((w ≡ ¬y) v (w ≡ ¬z)) ⋀ x ⋀ (y → z)",
        "(¬x ∧ y ∧ z ∧ ¬w) ∨ (¬x ∧ y ∧ ¬z ∧ ¬w) ∨ (x ∧ y ∧ z ∧ ¬w)",
        "((x → z) → y) v ¬w",
        "¬(y → (x ≡ w)) /\\ (z → x)",
        "(a→b)∨c→(¬a∧d)=1",
    ]
    for c in cases:
        try:
            tr = parse(c)
            print("%-62.62s -> %s" % (c, to_python(tr)))
        except Exception as e:  # noqa: BLE001
            print("%-62.62s !! %s" % (c, e))
    print()
    tree = parse("((x ≡ ¬y) → ¬(w → x)) ∨ ¬z")
    rows = [[None, 1, None, None], [None, None, 0, 0], [0, 1, None, None]]
    fv = [1, 1, 1]
    print("демоверсия 2027 (строки без повторов):", solve(tree, rows, fv, unique_rows=True), "ключ yxzw")
    print("уравнений:", count_solutions("(a→b)∨c→(¬a∧d)=1"))