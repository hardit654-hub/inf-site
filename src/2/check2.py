# -*- coding: utf-8 -*-
"""Сверка всех ответов раздела № 2 перед публикацией.

1. Задачи со страницы курса: формула (answers2.FORMULAS) + таблица (tables2.TABLES),
   ответ должен быть единственный и совпадать с answers2.KEYS.
2. Домашняя работа из открытого банка (задание 2): формула и таблица берутся
   из самого условия, ответ сравнивается с ключом банка (answers2.HW_KEYS).

Запуск: python3 src/2/check2.py
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import answers2   # noqa: E402
import logic2 as L  # noqa: E402
import tables2     # noqa: E402

RAW = os.path.join(ROOT, "sources", "2", "kege2-raw.json")

EN = {"&and;": "∧", "&or;": "∨", "&not;": "¬", "&nvand;": "¬∧", "&minus;": "¬"}


def load_bank():
    tasks = json.load(open(RAW, encoding="utf-8"))["tasks"]
    return {str(t["taskId"]): t for t in tasks}


def text_of(t):
    t = t["text"]
    for a, b in EN.items():
        t = t.replace(a, b)
    t = re.sub(r"\\\((.*?)\\\)", r"\1", t, flags=re.S)
    t = re.sub(r"<br\s*/?>|</p>", "\n", t)
    t = re.sub(r"<[^>]+>", " ", t)
    return t.replace("\xa0", " ")


def norm(s):
    return re.sub(r"\s+", "", s).replace("v", "∨").lower()


def check_steps():
    bad = []
    for key in answers2.KEYS:
        formula, names = answers2.FORMULAS[key]
        got = tables2.solve(formula, tables2.TABLES[key], names)
        if got != [answers2.KEYS[key]]:
            bad.append((key, answers2.KEYS[key], got))
    return bad


def check_hw():
    bank = load_bank()
    bad = []
    for tid in answers2.HW:
        t = bank[str(tid)]
        found = L.find_formula(text_of(t), 4, strict=False)
        if not found:
            bad.append((tid, answers2.HW_KEYS[tid], "формула не найдена"))
            continue
        formula = found[0]
        table = L.parse_html_table(t["text"])
        # буквы переменных берём из условия: в формулах банка встречаются
        # и «a», и «v» вместо ∨
        names = set(re.findall(r"(?<![a-z])([a-z])(?![a-z])", text_of(t)))
        names |= set(re.findall(r"(?<![A-Za-z_])([a-z])(?![A-Za-z_])", formula))
        names.discard("v")
        got = L.solve(L.parse(formula), table["rows"], table["f"],
                      names=names, unique_rows=True)
        want = answers2.HW_KEYS[tid]
        ok = got == [want] and t["key"] == want
        if not ok:
            bad.append((tid, want, "%s / банк %s" % (got, t["key"])))
    return bad


def main():
    a = check_steps()
    b = check_hw()
    print("задач на странице: %d, расхождений: %d" % (len(answers2.KEYS), len(a)))
    for row in a:
        print("  ", row)
    print("домашняя работа: %d задач, расхождений: %d" % (len(answers2.HW), len(b)))
    for row in b:
        print("  ", row)
    return len(a) + len(b)


if __name__ == "__main__":
    sys.exit(1 if main() else 0)