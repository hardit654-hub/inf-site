"""Раздел № 2 «Логика» курса ЕГЭ.

Теория и тексты задач берутся из выгрузки исходного курса без изменений,
вместе с разметкой: таблицы условий и формулы остаются как были. Ответы
сверяются командой
    python3 src/2/tables2.py && python3 src/2/check2.py

Запуск: python3 src/2/build2.py
"""
import html
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "tools"))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))
import answers2                    # noqa: E402
import tables2                     # noqa: E402
from check2 import EN, load_bank   # noqa: E402
from stepik_conv import split_code  # noqa: E402

FULL = os.path.join(ROOT, "sources/2-logika/steps_all.json")
OUT = os.path.join(HERE, "course.js")

# названия уроков берём из исходного курса
TITLES = {
    "1": "Решение в Python Ⅰ",
    "2": "Решение в Python Ⅱ",
    "3": "Полностью программное решение №2",
    "4": "Тренировка",
}

# Информационные шаги без проверяемого ответа по признаку в исходном дампе.
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






def blank(h):
    """Пустые абзацы, лишние пустые строки и висячие пробелы убираем."""
    h = re.sub(r"<p[^>]*>(?:\s|&nbsp;|<br\s*/?>)*</p>", "", h)
    h = re.sub(r"\n{3,}", "\n\n", h)
    return h.strip()


def math(h):
    r"""<span class="math-tex">\(...\)</span> -> <span class="tex">...</span>."""
    return re.sub(r'<span class="math-tex">\\\((.+?)\\\)</span>',
                  lambda m: '<span class="tex">' + html.escape(m.group(1).strip(), quote=False) + '</span>',
                  h, flags=re.S)


def TD_WRAP(tag):
    """Атрибуты ячейки: отступы исходника заменяем аккуратными."""
    style = re.search(r'style="([^"]*)"', tag)
    keep = []
    if style:
        css = {k.strip(): v.strip() for k, v in
               (x.split(":", 1) for x in style.group(1).split(";") if ":" in x)}
        css.pop("padding", None)
        css["padding"] = "3px 10px"
        keep.append("style=\"%s\"" % ";".join("%s:%s" % (k, v) for k, v in css.items()))
    align = re.search(r'\b(align|valign)="([^"]*)"', tag)
    if align:
        keep.append('%s="%s"' % align.groups())
    return "<td" + ("" if not keep else " " + " ".join(keep)) + ">"


def tw(m):
    """Таблица из исходного шага: стили рамки убираем, даём прокрутку.

    Текст в ячейках иногда обёрнут в <p> с отступами — внутри таблицы
    такие абзацы сливаются в один.
    """
    t = re.sub(r'<table\b[^>]*>', "<table>", m.group(0))
    t = re.sub(r"<(?:tbody|thead|tfoot)>|</(?:tbody|thead|tfoot)>", "", t)
    t = re.sub(r"<p\b[^>]*>\s*</p>", "", t)
    t = re.sub(r"</?p\b[^>]*>", "\x00", t)
    t = re.sub(r"\s+", " ", t)
    # ячейки с обнулёнными отступами выглядят слишком тесно — даём обычные
    t = re.sub(r"<td\b[^>]*>", lambda m: TD_WRAP(m.group(0)), t)
    t = re.sub(r">\s+", ">", t)
    t = re.sub(r"\s+<", "<", t)
    t = re.sub(r"\x00+", " ", t).replace("\x00", " ")
    return '<div class="tw">' + t + "</div>"


def to_blocks(h):
    """HTML шага -> блоки движка (html / code); таблицы — в «tw» с прокруткой."""
    h = math(h)
    # таблицу из исходного шага (формулу в условии) оставляем, но с прокруткой
    h = re.sub(r"<table\b[^>]*>.*?</table>", tw, h, flags=re.S)
    out = []
    pos = 0
    # разборы из исходного шага остаются только в виде подсказки «смотрите видео»
    for m in re.finditer(r"<details><summary>(.*?)</summary>.*?</details>", h, flags=re.S):
        out += split_code(h[pos:m.start()])
        title = html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()
        pos = m.end()
    out += split_code(h[pos:])
    return [b for b in out if b["t"] in ("code", "details")
            or re.sub(r"<[^>]+>|\s|&nbsp;", "", b["v"])]


def blocks(tid, body, extra=""):
    """HTML шага -> блоки движка; разметка условия сохраняется как есть."""
    h = blank(re.sub(r"<img\b[^>]*>", "", body["text"])) + extra
    return to_blocks(h)


def kege_blocks(text):
    r"""Задача из банка: \(...\) -> формулы обычными символами в «span class="tex"»."""
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
            if tid in TEXT:
                h = blank(re.sub(r"<img\b[^>]*>", "", b["text"]))
                out.append({"type": "text", "blocks": to_blocks(h)})
                continue
            if b["name"] != "string":
                # теория: текстовый шаг без задачи и без кнопки «Заполнить»
                h = blank(re.sub(r"<img\b[^>]*>", "", b["text"]))
                out.append({"type": "text", "blocks": to_blocks(h)})
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