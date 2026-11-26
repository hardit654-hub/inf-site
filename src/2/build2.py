"""Раздел № 2 «Логика» курса ЕГЭ.

Теория и тексты задач перенесены из исходного курса без изменений; таблицы
в условиях нарисованы картинками, поэтому рисуем их сами (figs.table_html) по
проверенным данным из tables2.py. Ответы сверяются командой
    python3 src/2/tables2.py && python3 src/2/check2.py

Запуск: python3 src/2/build2.py
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "tools"))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))
import figs                        # noqa: E402
import answers2                    # noqa: E402
import tables2                     # noqa: E402
from check2 import EN, load_bank, text_of  # noqa: E402
from stepik_conv import to_blocks  # noqa: E402

FULL = os.path.join(ROOT, "sources/2-logika/steps_all.json")
OUT = os.path.join(HERE, "course.js")

# названия уроков берём из исходного курса
TITLES = {
    "1": "Решение в Python Ⅰ",
    "2": "Решение в Python Ⅱ",
    "3": "Полностью программное решение №2",
    "4": "Тренировка",
}

# шаги без проверяемого ответа
TEXT = {"2.16", "4.9", "4.10", "4.11"}

# видео: исходный шаг содержит только запись разбора, поэтому пока заголовок
# и место под ролик (своё видео вставится позже)
VIDEO = {
    "1.2": "Разбор задач 1.1 – 1.6",
    "1.7": "Разбор задач 1.5 – 1.8",
    "1.10": "Разбор задач 1.9 – 1.12",
    "1.14": "Разбор задач 1.13 – 1.15",
    "2.2": "Разбор задач 1",
    "2.8": "Разбор задач 2",
    "2.13": "Разбор задач 2",
}

# дополнительные задачи из открытого банка: (после какого шага, номера задач)
KEGE = {4: (9, [70, 71, 74, 75, 76, 78, 79, 83, 46, 85,
                734, 735, 791, 816, 1185, 1267, 1282, 1357, 1422, 1846])}

# задачи, для которых формула в условии не распознаётся автоматически
FORMULA = {
    "2.5": "(x ∨ ¬y) ∧ ¬(y ≡ z) ∧ ¬w",
    "2.6": "¬(y → x) ∨ (z → w) ∨ ¬z",
    "4.1": "((x → z) → y) ∨ ¬w",
}

# «Кто заполнял» — таблица без верхнего ряда с вопросительными знаками
NOHEAD = {"1.1", "1.12", "2.5", "2.6", "2.14", "2.15", "4.1", "4.2", "4.3", "4.4", "4.5"}


def table_html(tid):
    head, rows, _ = tables2.load(tables2.TABLES[tid][0])
    cells = [["" if c is None else str(c) for c in r] for r in rows]
    return figs.table_html({"cols": [] if tid in NOHEAD else head, "cells": cells})


def blank(h):
    """Пустые абзацы и висячие пробелы убираем, остальное не трогаем."""
    h = re.sub(r"<p[^>]*>(?:\s|&nbsp;|<br\s*/?>)*</p>", "", h)
    return h.strip()


def blocks(tid, body, extra=""):
    """HTML шага -> блоки движка; вместо картинки таблицы — нарисованная таблица."""
    h = body["text"]
    imgs = list(re.finditer(r'<p[^>]*>\s*(?:<a[^>]*>)?\s*<img\b[^>]*>\s*(?:</a>)?\s*</p>', h))
    if imgs and tid != "2.16":
        # первая картинка после формулы — таблица условия
        m = imgs[0]
        before, after = h[:m.start()], h[m.end():]
        for n, extra_img in enumerate(imgs[1:], 1):
            after = after.replace(extra_img.group(0), "", 1)
        h = before + table_html(tid) + after
    h = blank(h) + extra
    return to_blocks(re.sub(r"\n{3,}", "\n\n", h))


def kege_blocks(text):
    t = text
    for a, b in EN.items():
        t = t.replace(a, b)
    def tex(m):
        s = m.group(1)
        s = s.replace("\\equiv", "≡").replace("\\lor", "∨").replace("\\land", "∧")
        s = s.replace("\\neg", "¬").replace("\\to", "→").replace("\\leftrightarrow", "≡")
        s = re.sub(r"\\(?:left|right|big)", "", s)
        return '<span class="tex">%s</span>' % s
    t = re.sub(r"\\\((.+?)\\\)", tex, t, flags=re.S)
    t = re.sub(r"<colgroup>.*?</colgroup>", "", t, flags=re.S)
    return t


def fields_for(ans):
    f = {"label": "Ответ", "n": 1}
    if not ans.isdigit():
        f["txt"] = 1
    return f


def build():
    d = json.load(open(FULL, encoding="utf-8"))
    bank = load_bank()
    lessons, key = [], {}
    for pos in sorted(d["units"], key=int):
        les = d["lessons"][str(d["units"][pos]["lesson"])]
        out = []
        for i, sid in enumerate(les["steps"], 1):
            tid = "%s.%d" % (pos, i)
            b = d["steps"].get(str(sid), {}).get("block")
            if not b or b["name"] == "video":
                out.append({"type": "video", "title": VIDEO.get(tid, "Видеоразбор")})
                continue
            # картинки-таблицы не переносим (рисованные таблицы уже нарисованы
            # из данных), остальные картинки в этом разделе не нужны
            b = dict(b, text=re.sub(r"<img\b[^>]*>", "", b["text"]))
            if tid in TEXT:
                # картинку с таблицей не сохраняем: перенести её без ошибок
                # нельзя, поэтому шаг идёт с пометкой
                h = re.sub(r"<p[^>]*>\s*<img\b[^>]*>\s*</p>", "<p>"
                           "<em>Таблица к задаче — в разборе.</em></p>", blank(b["text"]))
                h += ('<p><em>В этом шаге две функции — такие задачи решаются '
                      'программой из урока «Полностью программное решение».</em></p>'
                      if tid in ("4.10", "4.11") else "")
                out.append({"type": "text", "blocks": to_blocks(re.sub(r"\n{3,}", "\n\n", h))})
                continue
            if b["name"] != "string":
                out.append({"type": "text", "blocks": to_blocks(blank(b["text"]))})
                continue
            ans = answers2.KEYS[tid]
            out.append({"type": "fill", "blocks": blocks(tid, b),
                        "fields": [fields_for(ans)], "answer": [[ans]]})
            key["%s:%d" % (pos, len(out))] = (tid, ans)
        lessons.append({"num": "2." + pos, "title": TITLES[pos], "steps": out})
    for les in lessons:
        pos = int(les["num"].split(".")[1])
        if pos not in KEGE:
            continue
        after, ids = KEGE[pos]
        extra = []
        for tid in ids:
            ans = answers2.HW_KEYS[tid]
            assert bank[str(tid)]["key"] == ans, tid
            extra.append({"type": "fill", "blocks": to_blocks(kege_blocks(bank[str(tid)]["text"])),
                          "fields": [fields_for(ans)], "answer": [[ans]]})
            key["%s:%d" % (pos, after + len(extra))] = ("kege%d" % tid, ans)
        les["steps"][after:after] = extra
    course = {"id": "ege-inf", "title": "ЕГЭ по информатике",
              "section": {"num": 2, "title": "№ 2 Логика", "lessons": lessons}}
    open(OUT, "w", encoding="utf-8").write(
        "/* Данные раздела № 2. Собирается скриптом src/2/build2.py */\nwindow.COURSE = "
        + json.dumps(course, ensure_ascii=False, indent=1) + ";\n")
    open(os.path.join(HERE, "answers.json"), "w").write(
        json.dumps(key, ensure_ascii=False, indent=0))
    n = sum(1 for l in lessons for s in l["steps"] if s["type"] == "fill")
    print("уроков", len(lessons), "шагов", sum(len(l["steps"]) for l in lessons), "задач", n)


if __name__ == "__main__":
    build()