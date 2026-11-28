"""Сборка раздела № 1 «Графы, таблицы дорог» из выгрузки sources/1/steps_all.json.

Тексты шагов переносятся как есть, картинки — исходные (sources/1/img1.<урок>.<шаг>-<n>.png),
видео — заглушки. Ответы — src/1/answers1.py, данные сопоставления и таблицы — sources/1/extra.json.

Прогресс учеников: номер раздела (1) и номера уроков (2.1 … 2.7) не менять; шаги,
у которых тип или место разошлись с прежней версией, получают явный key (см. KEYS).
"""
import html
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))

import answers1                     # noqa: E402
from stepik_conv import split_code  # noqa: E402

FULL = os.path.join(ROOT, "sources/1/steps_all.json")
EXTRA = os.path.join(ROOT, "sources/1/extra.json")
ASSETS = os.path.join(ROOT, "sources/1")
OUT = os.path.join(HERE, "course.js")

TITLES = {
    "1": "Теория графов",
    "2": "Сопоставление схемы и таблицы",
    "3": "Супер алгоритм для устного решения",
    "4": "Стандартные задачи",
    "5": "Симметричные графы, графы без длин дорог",
    "6": "Решение в Python",
    "7": "Тренировка",
}

# шаги, у которых в прежней версии был другой тип: свой ключ, чтобы чужой прогресс не засчитался
KEYS = {"1.4": "m4", "1.5": "t5",
        "3.3": "s3", "3.5": "s5", "3.6": "s6", "3.8": "s8", "3.9": "s9",
        "7.3": "s3", "7.4": "s4", "7.5": "s5", "7.6": "s6", "7.8": "s8"}

# шаги-«текст» в выгрузке, которые на деле — ролик
VIDEO_STEPS = {"7.14"}

# одинаковые картинки: (шаг, номер) -> файл, на который ссылаемся
SAME_IMG = {("6.4", 1): "img1.6.6-1.png", ("6.4", 2): "img1.6.6-1.png"}

VIDEO_STUB = ('<div class="video"><span class="pl">▶</span><b>Видеоразбор</b>'
              '<span>Видео к этому шагу появится позже</span></div>')


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
    # таблица-«рамка» с одной ячейкой — это выноска, а не таблица
    if t.count("<td") == 1:
        return '<div class="cond"><table><tbody><tr><td>' + re.sub(
            r"</?t(?:able|body|r)>|<td>", "", t) + "</td></tr></tbody></table></div>"
    return '<div class="tw">' + t + "</div>"



def strip_media(h):
    """Ролики с чужих площадок убираем: на их месте будет своё видео."""
    # разборы-ролики под катом
    h = re.sub(r"<details>\s*<summary>[^<]*Видеоразбор[^<]*</summary>.*?</details>", "", h, flags=re.S)
    # встроенный плеер + «если видео не грузится… в ютубе / в ВК» -> заглушка
    h = re.sub(r"<p>\s*<iframe\b.*?</iframe>\s*</p>\s*(?:<p>[^<]*видео не грузится[^<]*</p>\s*<ul>.*?</ul>)?",
               VIDEO_STUB, h, flags=re.S)
    h = re.sub(r"<iframe\b.*?</iframe>", "", h, flags=re.S)
    # абзацы со ссылками на ролики (только абзац целиком, а не из <p> до ближайшего </p>)
    h = re.sub(r"<p\b[^>]*>(?:(?!</p>).)*?(?:rutube|youtu|vk\.com)(?:(?!</p>).)*?</p>", "", h, flags=re.S)
    return h


def replace_images(tid, h):
    index = 0

    def local_image(m):
        nonlocal index
        index += 1
        name = SAME_IMG.get((tid, index), "img1.%s-%d.png" % (tid, index))
        if not os.path.isfile(os.path.join(ASSETS, name)):
            raise FileNotFoundError("нет картинки: sources/1/" + name)
        return '<img src="img/%s" alt="">' % name
    return re.sub(r"<img\b[^>]*>", local_image, h)


def to_blocks(h):
    """HTML шага -> блоки движка: html, code, details («Решение»)."""
    h = math(h)
    h = re.sub(r"<table\b[^>]*>.*?</table>", tw, h, flags=re.S)
    # картинку в тексте — с новой строки, чтобы она не прилипала к словам
    h = re.sub(r"(?<=\S)[ \t]+(<img\b)", r"\n\1", h)
    out, pos = [], 0
    for m in re.finditer(r"<details>\s*<summary>(.*?)</summary>(.*?)</details>", h, flags=re.S):
        out += split_code(h[pos:m.start()])
        title = html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()
        out.append({"t": "details", "title": title, "v": split_code(m.group(2))})
        pos = m.end()
    out += split_code(h[pos:])
    return [b for b in out if b["t"] in ("code", "details")
            or re.sub(r"<[^>]+>|\s|&nbsp;", "", b["v"]) or "<img" in b["v"] or 'class="video"' in b["v"]]


def blocks(tid, h):
    return to_blocks(blank(replace_images(tid, clean_watermark(strip_media(h)))))


def clean_watermark(h):
    r"""Водяной знак площадки убираем сразу: build.py чистит не все варианты разметки."""
    h = re.sub(r"<p\b[^>]*>[^<]*(?:<(?!p\b)[^>]*>[^<]*)*PRO100 ЕГЭ информатика ЕГЭ[^<]*(?:<(?!</p>)[^>]*>[^<]*)*</p>",
               "", h, flags=re.I)
    h = re.sub(r"<span\b[^>]*>[^<]*(?:<(?!span\b)[^>]*>[^<]*)*PRO100 ЕГЭ информатика ЕГЭ[^<]*(?:<(?!</span>)[^>]*>[^<]*)*</span>",
               "", h, flags=re.I)
    return h.replace("PRO100 ЕГЭ информатика ЕГЭ", "")


def fields_for(ans):
    f = {"label": "Ответ", "n": 1}
    if not ans.isdigit():
        f["txt"] = 1
    return f


def match_step(tid, b, ex):
    pairs = ex["pairs"]
    return {"type": "match", "blocks": blocks(tid, b["text"]),
            "items": [html.escape(p[0], quote=False) for p in pairs],
            "options": [p[1] for p in pairs],
            "answer": list(range(len(pairs)))}


def table_step(tid, b, ex):
    rows, cols = ex["rows"], ex["cols"]
    on = {tuple(p) for p in ex["checked"]}
    ans = ["".join("1" if (r, c) in on else "0" for c in cols) for r in rows]
    assert ans == answers1.ANS[tid], (tid, ans)
    head = ("<p>Отметьте единицей ячейку, если между вершинами есть дорога, и нулём — если нет. "
            "В каждой строке — значения по столбцам %s.</p>" % ", ".join(cols))
    return {"type": "fill", "blocks": blocks(tid, b["text"]) + [{"t": "html", "v": head}],
            "fields": [{"label": r, "n": len(cols)} for r in rows],
            "answer": [list(a) for a in ans]}


def build():
    d = json.load(open(FULL, encoding="utf-8"))
    extra = json.load(open(EXTRA, encoding="utf-8"))
    lessons, key = [], {}
    for pos in sorted(d["units"], key=int):
        les = d["lessons"][str(d["units"][pos]["lesson"])]
        out = []
        for i, sid in enumerate(les["steps"], 1):
            tid = "%s.%d" % (pos, i)
            b = d["steps"].get(str(sid), {}).get("block")
            if not b or b["name"] == "video" or tid in VIDEO_STEPS:
                st = {"type": "video", "title": "Видеоразбор"}
            elif b["name"] == "matching":
                st = match_step(tid, b, extra[str(sid)])
            elif b["name"] == "table":
                st = table_step(tid, b, extra[str(sid)])
            elif b["name"] in ("string", "number"):
                ans = str(answers1.ANS[tid])
                st = {"type": "fill", "blocks": blocks(tid, b["text"]),
                      "fields": [fields_for(ans)], "answer": [[ans]]}
                key["%s:%d" % (pos, i)] = (tid, ans)
            else:
                st = {"type": "text", "blocks": blocks(tid, b["text"])}
            if tid in KEYS:
                st = {"key": KEYS[tid], **st}
            out.append(st)
        if any(k.startswith(pos + ".") for k in KEYS):
            # ключ в середине урока сдвинул бы нумерацию следующих шагов: остальным — прежний номер
            for i, st in enumerate(out, 1):
                st.setdefault("key", str(i))
                out[i - 1] = {"key": st.pop("key"), **st}
        lessons.append({"num": "2." + pos, "title": TITLES[pos], "steps": out})
    course = {"id": "ege-inf", "title": "ЕГЭ по информатике",
              "section": {"num": 1, "title": "№ 1 Графы, таблицы дорог", "lessons": lessons}}
    open(OUT, "w", encoding="utf-8").write(
        "/* Данные раздела № 1. Собирается скриптом src/1/build1.py */\nwindow.COURSE = "
        + json.dumps(course, ensure_ascii=False, indent=1) + ";\n")
    open(os.path.join(HERE, "answers.json"), "w").write(
        json.dumps(key, ensure_ascii=False, indent=0))
    n = sum(1 for l in lessons for s in l["steps"] if s["type"] in ("fill", "match"))
    print("уроков", len(lessons), "шагов", sum(len(l["steps"]) for l in lessons), "задач", n)


if __name__ == "__main__":
    build()
