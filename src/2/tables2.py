# -*- coding: utf-8 -*-
"""Таблицы задач раздела № 2 «Логика».

В шагах курса таблица нарисована картинкой. Здесь она записана строками:
первая строка — верхний ряд таблицы (там либо «?», либо пусто), дальше —
строки значений: сначала все столбцы переменных, последним — значение F.
«_» — пустая клетка.

Формат: (строки, режим, уникальность строк для фрагмента)
  fragment   — известна только часть строк таблицы;
  true_rows  — таблица содержит ВСЕ наборы, где F истинна;
  false_rows — все наборы, где F ложна;
  full       — полная таблица.

Проверка всех ответов: python3 src/2/tables2.py
"""
import itertools
import re
import sys

sys.path.insert(0, __file__.rsplit("/", 1)[0])
import logic2 as L  # noqa: E402

TABLES = {
    # 1. Решение в Python Ⅰ
    "1.1": ("_ _ _ F | 1 0 _ 1 | _ 0 0 1 | _ 0 0 1", "fragment", True),
    "1.3": ("? ? ? F | 0 0 0 1 | 1 0 0 1 | 1 1 0 1", "true_rows", False),
    "1.4": ("? ? ? F | 0 0 1 0 | 0 1 1 0 | 1 1 1 0", "false_rows", False),
    "1.5": ("? ? ? F | 0 0 0 1 | 1 0 0 1 | 1 0 1 1", "true_rows", False),
    "1.6": ("? ? ? F | 1 0 0 1 | 1 0 1 1", "fragment", False),
    "1.8": ("? ? ? F | 1 0 _ 1 | _ 0 0 1 | _ 0 0 1", "fragment", True),
    "1.9": ("? ? ? F | _ 0 0 1 | 0 0 _ 1 | 0 _ _ 1", "fragment", True),
    "1.11": ("? ? ? F | 1 0 1 1 | 0 0 1 1", "fragment", False),
    "1.12": ("_ _ _ _ F | _ 0 1 0 0 | 0 _ _ 0 0 | _ 1 1 _ 0", "fragment", True),
    "1.13": ("? ? ? F | 1 _ _ 1 | _ _ _ 1 | 1 _ 1 1", "fragment", True),
    "1.15": ("? ? ? F | 1 _ 1 0 | _ _ 1 0", "fragment", True),

    # 2. Решение в Python Ⅱ
    "2.1": ("? ? ? ? F | 0 1 1 1 1 | 1 0 0 1 1 | 1 0 1 1 1", "fragment", False),
    "2.3": ("? ? ? ? F | 0 1 0 0 1 | 1 1 0 0 1 | 1 1 1 0 1", "fragment", False),
    "2.4": ("? ? ? ? F | 1 _ _ 1 0 | 1 _ _ _ 0 | _ 1 _ 1 0", "fragment", True),
    "2.5": ("_ _ _ _ F | 1 1 _ _ 1 | _ 1 0 0 1 | 1 _ 1 0 1", "fragment", True),
    "2.6": ("_ _ _ _ F | _ 0 _ _ 0 | 0 1 _ _ 0 | 1 _ _ 0 0", "fragment", False),
    "2.7": ("? ? ? F | 0 0 1 1 | 0 1 1 0", "fragment", False),
    "2.9": ("? ? ? F | _ 0 0 1 | 0 _ _ 1 | 0 _ 0 1", "fragment", True),
    "2.10": ("? ? ? ? F | 1 _ _ 1 0 | _ _ 1 1 0 | _ 0 0 _ 1", "fragment", False),
    "2.11": ("? ? ? F | 1 0 0 0 | 1 0 1 1", "fragment", False),
    "2.12": ("_ _ _ _ F | 1 _ 1 1 0 | _ _ 0 0 1 | _ 0 0 _ 1", "fragment", False),
    "2.14": ("_ _ _ _ F | _ 0 1 1 0 | 1 _ 1 _ 0 | _ _ _ 1 0", "fragment", True),
    "2.15": ("_ _ _ _ F | _ 1 0 1 1 | _ 1 _ 0 1 | _ 0 _ 1 1 | _ _ 1 1 1", "fragment", True),

    # 4. Тренировка
    "4.1": ("_ _ _ _ F | 1 0 _ _ 0 | _ 1 0 _ 0 | 0 _ _ _ 0", "fragment", True),
    "4.2": ("? ? ? ? F | _ _ 0 1 0 | _ 0 1 _ 0 | _ _ _ 0 0", "fragment", True),
    "4.3": ("? ? ? ? F | _ 1 1 _ 1 | 0 _ _ 0 1 | _ 0 1 0 1", "fragment", True),
    "4.4": ("_ _ _ _ F | 0 _ 0 _ 0 | _ 0 1 _ 0 | _ 1 _ _ 0", "fragment", False),
    "4.5": ("_ _ _ _ F | 0 1 _ 0 0 | 1 1 0 _ 0 | _ 1 _ 0 0", "fragment", True),
    "4.6": ("? ? ? ? F | 1 _ _ _ 1 | 0 _ 1 _ 1 | _ 0 0 _ 1", "fragment", False),
    "4.7": ("? ? ? F | 0 0 0 1 | 0 0 1 1 | 0 1 0 0 | 0 1 1 1"
            " | 1 0 0 1 | 1 0 1 1 | 1 1 0 0 | 1 1 1 0", "full", False),
    "4.8": ("? ? ? ? F | 1 1 0 1 1 | 0 1 1 1 1 | 0 _ _ 0 1", "fragment", False),
}


def load(spec):
    """'? ? ? F | 1 0 0 1 | ...' -> (заголовок, строки значений, F)."""
    parts = [p.strip() for p in spec.split(" | ")]
    head = parts[0].split()
    rows, fvals = [], []
    for p in parts[1:]:
        cells = p.split()
        rows.append([None if c == "_" else int(c) for c in cells[:-1]])
        fvals.append(int(cells[-1]))
    return head, rows, fvals


def vars_of(text):
    return set(re.findall(r"(?<![A-Za-z_\\])([a-z])(?![A-Za-z_])", text))


def matches(tree, rows, fvals, perm, unique_rows=False, extra=()):
    """Подходит ли порядок столбцов perm (перебор значений + проверка строк).

    extra — переменные, которым не хватило столбца (буква есть в формуле,
    а столбцов меньше); они перебираются как свободные.
    """
    n = len(perm) + len(extra)
    worlds = []
    for combo in itertools.product((0, 1), repeat=n):
        env = dict(zip(list(perm) + list(extra), combo))
        worlds.append((combo[:len(perm)], L.evaluate(tree, env)))
    cands = []
    for vals, fv in zip(rows, fvals):
        hit = [w[0] for w in worlds
               if w[1] == fv and all(vals[i] is None or vals[i] == w[0][i]
                                     for i in range(len(vals)))]
        if not hit:
            return False
        cands.append(set(hit))
    if unique_rows and len(cands) > 1:
        return any(len(set(p)) == len(p) for p in itertools.product(*cands))
    return True


def solve(formula, spec, names):
    head, rows, fvals = load(spec[0])
    mode, unique = spec[1], spec[2]
    tree = L.parse(formula)
    vars_ = sorted(set(names) | vars_of(formula))
    got = []
    for perm in itertools.permutations(vars_, len(rows[0])):
        extra = [v for v in vars_ if v not in perm]
        if not matches(tree, rows, fvals, perm, unique, extra):
            continue
        got.append("".join(perm))
    return sorted(got)


def main():
    import answers2
    bad = 0
    for key in answers2.KEYS:
        formula, names = answers2.FORMULAS[key][:2]
        got = solve(formula, TABLES[key], names)
        want = answers2.KEYS[key]
        ok = got == [want]
        if not ok:
            bad += 1
        print("%-5s ожидается %-6s найдено %-22s %s"
              % (key, want, ",".join(got) or "—", "" if ok else "ПРОВЕРИТЬ"))
    print("\nрасхождений:", bad)
    return bad


if __name__ == "__main__":
    sys.exit(1 if main() else 0)