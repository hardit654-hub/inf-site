"""Раздел № 1 «Графы, таблицы дорог» курса ЕГЭ.

Картинки оставляются исходными: исходные изображения предпочтительнее неточных перерисовок.

Запуск: python3 src/1/build1.py
"""
import html as H
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(ROOT, "tools"))
import pics            # noqa: E402
import pics_kege       # noqa: E402
import figs            # noqa: E402
import kege1           # noqa: E402
from answers1 import ANS          # noqa: E402
from stepik_conv import to_blocks  # noqa: E402

OUT = os.path.join(HERE, "course.js")
FULL = os.path.join(ROOT, "sources/2/steps_all.json")
URLS = os.path.join(ROOT, "sources/2-urls.txt")

TITLES = ["Теория графов", "Сопоставление схемы и таблицы",
          "Супер алгоритм для устного решения", "Стандартные задачи",
          "Симметричные графы, графы без длин дорог", "Решение в Python", "Тренировка"]

# подписи к видео (в исходных шагах названия нет)
VIDEO = {
    "2.3": "Разбор: как сопоставить схему и таблицу",
    "2.8": "Разбор: длина дороги между двумя пунктами",
    "2.14": "Разбор: кратчайший путь",
    "3.2": "Как решать такие задачи на скорость",
    "3.4": "Разбор: сумма двух дорог",
    "3.7": "Разбор: ещё одна задача",
    "3.10": "Разбор: звёздочки в таблице",
    "4.3": "Разбор: стандартная задача",
    "4.5": "Разбор: стандартная задача",
    "5.3": "Разбор: граф без длин дорог",
    "5.7": "Разбор: номера пунктов по таблице",
    "6.2": "Как решать задачу в Python",
    "6.3": "Разбор программы",
    "6.5": "Разбор программы",
}

# шаги без проверяемого ответа (задачи «реши и сравни с разбором», примеры
# программ) идут текстом: пустых полей для ввода на странице не будет
TEXT = {"1.4", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8", "3.9", "3.10",
        "3.11", "6.4", "6.6", "7.3", "7.4", "7.5", "7.6"}

# дополнительные задачи из открытого банка: (после какого шага, номера задач)
KEGE = {2: (15, [37, 39, 10083, 16312, 42])}

KEEP = {"class", "style"}
def _keep_img(tag):
    return re.sub(r'\\s+(?:alt|height|name|width)="[^"]*"', '', tag)


def clean(h):
    h = re.sub(r'<img\\b[^>]*>', lambda m: _keep_img(m.group(0)), h)
    h = re.sub(r'<(?!img\b)(\w+)((?:\s+[\w-]+(?:="[^"]*")?)*)\s*(/?)>',
               lambda m: '<' + m.group(1) + ''.join(f' {a}="{v}"' for a, v in re.findall(r'([\w-]+)="([^"]*)"', m.group(2))
                                                    if a in KEEP or (a == 'href' and m.group(1) == 'a')) + m.group(3) + '>', h)
    h = re.sub(r'</?(span|font|div)\b[^>]*>', '', h)
    h = re.sub(r'<sup><sub>[^<]*</sub></sup>', '', h)
    h = re.sub(r'<p style="text-align: right;">\s*</p>', '', h)
    h = re.sub(r'\s+', ' ', h).strip()
    h = re.sub(r'<p>(?:&nbsp;|\s|<br>)*</p>', '', h)
    return h


def url2name():
    m = {}
    for line in open(URLS):
        if line.strip():
            n, u = line.split()
            m[u.strip().rstrip('/').split('/')[-1]] = n
    return m

U2N = url2name()

def fig(name):
    m = re.search(r"ucarecdn\.stepik\.net/([0-9a-f\-]+)/", name or "")
    if m:
        name = U2N.get(m.group(1))
    spec = pics.PICTURES.get(name) or pics_kege.PICTURES.get(name)
    if not spec:
        return None
    return figs.fragment(spec)

def put_figs(h, name=None, extra=""):
    """Локальные исходники подставляются из sources/1; содержимое картинки не меняется."""
    def local_image(match):
        tag = match.group(0)
        ids = re.findall(r'ucarecdn\.stepik\.net/([0-9a-f\-]+)/', tag)
        fname = U2N.get(ids[0]) if ids else name
        if not fname:
            return tag
        original = fname if fname.startswith("img") else "img" + fname
        src = os.path.join(ROOT, "sources/1", original)
        if not os.path.isfile(src):
            src = os.path.join(ROOT, "sources/2", original)
        if os.path.isfile(src):
            target = fname if fname.startswith("img") else "img" + fname
            tag = re.sub(r'src="[^"]*"', 'src="img/%s"' % target, tag)
            tag = re.sub(r'<img\b', '<img class="fig-source"', tag, count=1)
        return tag
    h = re.sub(r'<img\b[^>]*>', local_image, h)
    if extra:
        h += extra
    return h

def blocks(tid, name, h, extra=""):
    h = put_figs(clean(h), name, extra)
    return to_blocks(h)

def video_links(h):
    """Встроенные видео и их прямые ссылки — для нетехнического шага."""
    out = []
    for m in re.finditer(r'<iframe\b[^>]*\bsrc="([^"]+)"', h):
        src = H.unescape(m.group(1))
        if "youtube.com/embed/" in src or "vk.com/video_ext" in src:
            num = re.search(r"embed/([^\"?]+)", src)
            vid = re.search(r"oid=(-?\d+)&id=(\d+)", src)
            out.append((src, {"youtube.com/embed/" in src and "YouTube"
                              or "ВКонтакте": num and ("https://youtu.be/" + num.group(1))
                              or vid and ("https://vk.com/video%s_%s" % vid.groups()) or src}))
    return out

def fields_for(ans):
    f = {"label": "Ответ", "n": 1}
    if not ans.isdigit():
        f["txt"] = 1
    return f

TIERS = {"3.1", "3.2", "7.8"}

SLIDES = {
    "3.1": """<h2>Как решать задачи о таблицах дорог</h2>
      <p>В задачах о таблицах дорог почти всегда есть «подозрительный» пункт.
      С него и нужно начинать.</p>
      <ol>
        <li><b>Считаем число дорог</b> (степень). Ищем пункт, у которого дорог
        больше всех или меньше всех, — так его легко найти в таблице.</li>
        <li><b>Ищем пункт с известным окружением.</b> В условии часто сказано,
        с какими пунктами он связан. Таких пунктов в схеме немного.</li>
        <li><b>Сравниваем соседей.</b> Если у пункта 5 дорог, а в таблице есть
        ровно одно такое значение — номер найден.</li>
      </ol>
      <p>Порядок действий простой: нашли пункт в схеме — нашли его номер в
      таблице — вычёркиваем найденные пары — переходим к следующему.</p>""",
    "3.2": """<h2>Пример: пункт с пятью дорогами</h2>
      <p>В таблице звёздочками отмечены дороги. Считаем звёздочки по строкам:</p>
      <ul>
        <li>строка П1 — 5 звёздочек;</li>
        <li>строка П2 — 4;</li>
        <li>строки П3, П4, П6, П7 — по 3;</li>
        <li>строки П5, П8 — по 2.</li>
      </ul>
      <p>На схеме тоже ровно один пункт, из которого выходят 5 дорог. Значит,
      П1 — этот пункт. Дальше смотрим, с кем он связан: его соседи по таблице
      должны совпасть с соседями пункта на схеме.</p>
      <p>Так вычёркивается пара за парой, и в конце остаются все номера.</p>""",
    "7.8": """<h2>Как быстро сопоставить таблицу и схему</h2>
      <ol>
        <li><b>Считаем дороги.</b> У каждого пункта таблицы считаем число
        известных дорог (для таблиц со звёздочками — число звёздочек в строке).</li>
        <li><b>Ищем одинокий пункт.</b> Сравниваем: на схеме есть пункт, у
        которого число дорог встречается только у него — он и находится первым.</li>
        <li><b>Различаем похожие.</b> Если у двух пунктов одинаковое число дорог,
        смотрим, как связаны их соседи, — это и разводит пары.</li>
        <li><b>Считаем сумму.</b> Когда номера пунктов найдены, берём нужные
        значения из таблицы.</li>
      </ol>
      <p>Это весь метод: степени, окружение, сравнение соседей.</p>""",
}


def tier_slide(tid):
    """Шаг устного алгоритма: текст с примером, без поля для ввода."""
    return {"type": "text", "blocks": to_blocks(SLIDES[tid])}


def build():
    d = json.load(open(FULL))
    lessons, key = [], {}
    for pos in sorted(d["units"], key=int):
        les = d["lessons"][str(d["units"][pos]["lesson"])]
        out = []
        for i, sid in enumerate(les["steps"], 1):
            tid = f"{pos}.{i}"
            b = d["steps"].get(str(sid), {}).get("block")
            if not b:
                out.append({"type": "video", "title": VIDEO.get(tid) or "Видеоразбор"}); continue
            if tid in TIERS:
                out.append(tier_slide(tid)); continue
            name = b["name"]
            if name == "video":
                out.append({"type": "video", "title": VIDEO.get(tid) or "Видеоразбор"}); continue
            ids = re.findall(r"ucarecdn\.stepik\.net/([0-9a-f\-]+)/", b["text"])
            fname = U2N.get(ids[0]) if ids else None
            candidate = "img%s-1.png" % tid
            if os.path.isfile(os.path.join(ROOT, "sources/1", candidate)):
                fname = candidate
            elif tid == "3.5":
                fname = "img2.3.5-1.png"
            if name in ("number", "string", "table", "matching") and tid not in TEXT:
                ans = ANS.get(tid, "")
                if not ans:
                    raise SystemExit("нет ответа для шага " + tid)
                st = {"type": "fill", "blocks": blocks(tid, fname, b["text"]),
                      "fields": [fields_for(ans)], "answer": [[ans]]}
                if name in ("table", "matching"):
                    st["fields"][0]["label"] = "Матрица"
                out.append(st); key[f"{pos}:{len(out)}"] = (tid, ans); continue
            out.append({"type": "text", "blocks": blocks(tid, fname, b["text"])})
        lessons.append({"num": f"2.{pos}", "title": TITLES[int(pos) - 1], "steps": out})
    for les in lessons:
        pos = int(les["num"].split(".")[1])
        if pos not in KEGE:
            continue
        after, ids = KEGE[pos]
        extra = []
        for task in kege1.TASKS:
            if task["id"] not in ids:
                continue
            h = re.sub(r"<p>@(k\d+)</p>", lambda m: fig(m.group(1)) or "", task["text"])
            st = {"type": "fill", "blocks": to_blocks(h), "fields": [fields_for(task["ans"])],
                  "answer": [[task["ans"]]]}
            extra.append(st)
            key[f"{pos}:{after + len(extra)}"] = ("kege%d" % task["id"], task["ans"])
        les["steps"][after:after] = extra
    course = {"id": "ege-inf", "title": "ЕГЭ по информатике",
              "section": {"num": 1, "title": "№ 1 Графы, таблицы дорог", "lessons": lessons}}
    open(OUT, "w").write("/* Данные раздела № 1. Собирается скриптом src/1/build1.py */\nwindow.COURSE = "
                         + json.dumps(course, ensure_ascii=False, indent=1) + ";\n")
    json.dump(key, open(os.path.join(HERE, "answers.json"), "w"), ensure_ascii=False, indent=0)
    n = sum(1 for l in lessons for s in l["steps"] if s["type"] != "text" and s["type"] != "video")
    print("уроков", len(lessons), "шагов", sum(len(l["steps"]) for l in lessons), "задач", n)

if __name__ == "__main__":
    build()