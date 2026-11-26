"""Ответы всех задач раздела № 1 «Графы, таблицы дорог».

    python3 src/1/solve1.py          # пересчитать, записать calc_answers.json
    python3 src/1/solve1.py 2.5      # показать разбор одной задачи

Как считается:
  таблица -> граф (число в клетке = длина дороги, * = дорога есть);
  схема -> множество рёбер (из описания рисунка в pics.py);
  перебираем все взаимно-однозначные соответствия «буква -> номер пункта»,
  у которых совпали степени вершин и все рёбра;
  формулировка вопроса задачи (из текста шага) говорит, что взять из ответа:
  длина одной дороги, сумма двух дорог, кратчайший путь, номера двух пунктов.
"""
import heapq
import itertools
import json
import os
import re
import sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import pics  # noqa: E402

STEPS = os.path.join(os.path.dirname(os.path.dirname(HERE)), "sources/2/steps_all.json")
OUT = os.path.join(HERE, "calc_answers.json")


# ---------------- граф из таблицы ----------------

def gg(cells):
    d = defaultdict(dict)
    for i, r in enumerate(cells):
        for j, v in enumerate(r):
            if i != j:
                if v == "*":
                    d[i][j] = 1
                elif isinstance(v, str) and v.isdigit():
                    d[i][j] = int(v)
    return d


def sp(d, s, t):
    dist = {s: 0}
    prev = {}
    pq = [(0, s)]
    while pq:
        x, u = heapq.heappop(pq)
        if x > dist.get(u, 10 ** 9):
            continue
        for v, w in d[u].items():
            if x + w < dist.get(v, 10 ** 9):
                dist[v] = x + w
                prev[v] = u
                heapq.heappush(pq, (x + w, v))
    if t not in dist:
        return None
    return dist[t]


def E_edges(edges, letters=None):
    d = defaultdict(set)
    for a, b in edges:
        d[a].add(b)
        d[b].add(a)
    for l in letters or ():
        d[l]
    return d


def sig(adj, keys):
    """Отпечаток графа: для каждой вершины — набор чисел, описывающих связи.

    У каждой вершины n1 количество соседей степени 1, n2 — степени 2 и т. д.
    """
    keys = list(keys)
    for k in keys:
        if k not in adj:             # номер пункта без дорог
            adj = dict(adj)
            adj[k] = ()
    deg = {k: len(adj[k]) for k in keys}
    out = []
    for k in keys:
        cnt = {}
        for v in adj[k]:
            cnt[deg[v]] = cnt.get(deg[v], 0) + 1
        out.append(tuple(sorted(cnt.items())))
    return sorted(out)


def all_maps(cells, letters, edges):
    """Соответствия «буква -> номер пункта» (номер с нуля), сохраняющие схему."""
    d = gg(cells)
    if len(d) > len(letters) and len(cells) == len(letters):
        # в схеме есть вершины без букв (объезды): ищем соответствие только
        # по подграфу таблицы, сохраняя все дороги между выбранными пунктами
        dd = defaultdict(dict)
        for i in d:
            for j, v in d[i].items():
                if j < len(letters):
                    dd[i][j] = v
        d = {i: dd[i] for i in range(len(letters))}
    E = E_edges(edges, letters)
    n = len(letters)
    need = [len(E[l]) for l in letters]
    dbg = os.environ.get('DBG')
    if dbg: print('need', dict(zip(letters, need)), 'have', [len(d[i]) for i in range(len(d))])
    res = []
    for perm in itertools.permutations(range(n)):
        if [len(d[p]) for p in perm] != need:
            continue
        ok = True
        for i in range(n):
            for j in range(n):
                if (perm[j] in d[perm[i]]) != (letters[j] in E[letters[i]]):
                    ok = False
                    break
            if not ok:
                break
        if ok:
            res.append(perm)
    if not res and os.environ.get('DBG'):
        # таблица ломается на подграфе без вершин-концевых? подсказываем, как
        # связан каждый пункт таблицы по соседям с одинаковым числом дорог
        print('  таблица:')
        for i in d:
            print('   П%d (%d):' % (i + 1, len(d[i])),
                  {'П%d' % (j + 1): w for j, w in d[i].items()})
        print('  схема:')
        for l in letters:
            print('   %s (%d):' % (l, len(E[l])), dict.fromkeys(sorted(E[l])))
    return d, E, res


# ---------------- вопрос задачи ----------------

PAIR = r"из пункта ([A-ZА-ЯЁ]) в пункт[ы]? ([A-ZА-ЯЁ])"


def plain(h):
    t = re.sub(r"<[^>]+>", " ", h)
    t = t.replace("&nbsp;", " ")
    return re.sub(r"\s+", " ", t).strip()


def solve(spec, q):
    g = spec.get("graph") or spec
    cells = spec.get("cells") or g.get("cells")
    if not cells:                      # схема без таблицы — проверить нечего
        return None, "только схема", 0
    cells = [[r[j] if j < len(r) else "" for j in range(len(r))] for r in cells]
    letters = sorted(g["nodes"])
    d, E, perms = all_maps(cells, letters, g["edges"])
    if not perms:
        return None, "нет соответствия", 0
    idx = {l: i for i, l in enumerate(letters)}

    def road(p, a, b):
        return d[p[idx[a]]].get(p[idx[b]])

    res = set()
    dbg = os.environ.get("DBG")
    for p in perms:
        if dbg:
            print("PERM", {l: p[i] + 1 for i, l in enumerate(letters)})
        pairs = re.findall(PAIR, q)
        if len(pairs) == 2:
            res.add(str(road(p, *pairs[0]) + road(p, *pairs[1])))
            continue
        # «из пункта А в пункты В и Б» — сумма двух дорог из одного пункта
        m = re.search(r"из пункта ([A-ZА-ЯЁ]) в пункты ([A-ZА-ЯЁ]) и ([A-ZА-ЯЁ])", q)
        if m:
            a, b, c = m.groups()
            res.add(str(road(p, a, b) + road(p, a, c)))
            continue
        m = re.search(r"кратчайшего пути из пункта ([A-ZА-ЯЁ]) в пункт ([A-ZА-ЯЁ])", q)
        if m:
            res.add(str(sp(d, p[idx[m.group(1)]], p[idx[m.group(2)]])))
            continue
        m = re.search(r"более короткой из дорог ([A-ZА-ЯЁ])([A-ZА-ЯЁ]) и ([A-ZА-ЯЁ])([A-ZА-ЯЁ])", q)
        if m:
            a, b, c, e = m.groups()
            res.add(str(min(road(p, a, b), road(p, c, e))))
            continue
        nums = re.findall(r"пунктам? ([A-ZА-ЯЁ]) и ([A-ZА-ЯЁ])", q)
        if nums:
            a, b = nums[0]
            res.add("".join(sorted([str(p[idx[a]] + 1), str(p[idx[b]] + 1)])))
            continue
        m = re.search(r"пункта ([A-ZА-ЯЁ]) в пункт ([A-ZА-ЯЁ])", q)
        if m:
            res.add(str(road(p, m.group(1), m.group(2))))
            continue
        return None, "вопрос не распознан: " + q, 0
    if len(res) == 1:
        return res.pop(), "%d соответствие(й)" % len(perms), len(perms)
    return "||".join(sorted(res)), "неоднозначно %s (%d)" % (sorted(res), len(perms)), len(perms)


# ---------------- все задачи ----------------

def tasks():
    """Задачи раздела: (позиция.шаг, описание рисунка, текст)."""
    d = json.load(open(STEPS))
    url2name = {}
    for line in open(os.path.join(os.path.dirname(HERE), "..", "sources/2-urls.txt")):
        name, url = line.split()
        url2name[url.strip().rstrip("/").split("/")[-1]] = name
    for pos in sorted(d["units"], key=int):
        L = d["lessons"][str(d["units"][pos]["lesson"])]
        for i, sid in enumerate(L["steps"], 1):
            b = d["steps"][str(sid)]["block"]
            if b["name"] in ("text", "video"):
                continue
            ids = re.findall(r"ucarecdn\.stepik\.net/([0-9a-f\-]+)/", b["text"])
            name = url2name.get(ids[0]) if ids else None
            spec = pics.PICTURES.get(name) if name else None
            yield "%s.%d" % (pos, i), name, spec, plain(b["text"])


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    out = {}
    for key, name, spec, text in tasks():
        if only and key != only:
            continue
        if spec is None:
            print("%-6s %-20s  без рисунка (таблица встраивается в шаг)" % (key, name))
            continue
        q = re.search(r"(Определите[^.]*\.\s*(?:В ответе[^.]*\.)?)", text)
        q = q.group(1) if q else ""
        try:
            ans, info, n = solve(spec, q)
        except Exception as ex:
            ans, info, n = None, "%s: %s" % (type(ex).__name__, ex), 0
        out[key] = ans
        print("%-6s %-20s %-10s %-26s %s" % (key, name, ans, info, q[:80]))
    if not only:
        json.dump(out, open(OUT, "w"), ensure_ascii=False, indent=1)
        print("\nвсего задач:", len(out), "записано:", OUT)


if __name__ == "__main__":
    main()