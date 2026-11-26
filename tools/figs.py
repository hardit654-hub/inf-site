"""Описания картинок -> HTML-куски для встраивания в страницу курса.

    python3 tools/figs.py in.json fragments.json
    python3 tools/figs.py in.json --preview   # PNG-лист для проверки глазами

Ключи in.json — имена картинок (как в тексте задач), значения — описания
из src/<раздел>/pics*.py. Таблица становится обычной HTML-таблицей (её
оформляет CSS страницы), схема — SVG, наследуя цвет текста (работает и в
тёмной теме). В отличие от tools/draw.py здесь нет обёртки .wrap и своих
стилей: кусок вставляется прямо внутрь карточки задачи.
"""
import json
import re
import sys

sys.path.insert(0, "tools")

DIAG_STYLE = "background:#8e8e93;"
SIDE = '<div style="display:flex;gap:28px;align-items:center;flex-wrap:wrap">'


def table_html(spec):
    cells = spec.get("cells") or []
    if not cells:
        return ""
    cols = spec.get("cols") or [""] * len(cells[0])
    rows = spec.get("rows") or [""] * len(cells)
    stars = spec.get("stars", False)
    mark = {tuple(x) for x in (spec.get("mark") or [])}
    row_col = spec.get("row_col")
    has_header = bool(spec.get("has_header", any(cols)))
    numbered_rows = bool(any(rows))
    ncols = len(cols) + (1 if row_col or numbered_rows or has_header else 0)
    parts = ['<table class="fig">']
    if spec.get("title"):
        parts.append(f'<tr><td colspan="{ncols}" style="border:none">{spec["title"]}</td></tr>')
    if has_header or row_col:
        # подпись «Номер пункта» — над номерами строк и столбцов
        pad = (f'<td colspan="2" style="border:none">{row_col[0]}</td>' if row_col
               else '<td style="border:none"></td>')
        parts.append(f"<tr>{pad}" + "".join(f"<td>{c}</td>" for c in cols) + "</tr>")
    for i, row in enumerate(cells):
        parts.append("<tr>")
        if row_col:
            if i == 0:  # вертикальная подпись на всю высоту
                parts.append(f'<td rowspan="{len(cells)}" style="border:none;writing-mode:vertical-rl;'
                             f'transform:rotate(180deg);background:none">{row_col[0]}</td>')
            parts.append(f"<td>{row_col[1][i] if i < len(row_col[1]) else ''}</td>")
        elif numbered_rows:
            parts.append(f"<td>{rows[i] if i < len(rows) else ''}</td>")
        elif has_header:
            parts.append("<td></td>")
        for j, v in enumerate(row):
            style = DIAG_STYLE if i == j else ""
            if (i, j) in mark:
                style += "font-weight:700;box-shadow:inset 0 0 0 2px #c00;"
            parts.append(f'<td{f" style={chr(34)}{style}{chr(34)}" if style else ""}>{v}</td>')
        parts.append("</tr>")
    parts.append("</table>")
    return '<div class="tw">' + "".join(parts) + "</div>"


def graph_svg(spec):
    nodes = spec["nodes"]
    edges = spec.get("edges") or []
    labels = spec.get("labels") or {}
    curves = spec.get("curves") or []
    side = spec.get("side_labels") or {}
    deg = spec.get("deg") or []
    open_nodes = set(spec.get("open_nodes") or [])
    red = set(spec.get("red_labels") or [])
    fs = spec.get("font", 19)
    r = spec.get("radius", 4)
    lw = spec.get("lw", 1.2)
    pad = 30
    xs = [p[0] for p in nodes.values()] + [p[0] for p in labels.values()]
    ys = [p[1] for p in nodes.values()] + [p[1] for p in labels.values()]
    x0, x1, y0, y1 = min(xs) - 2 * pad, max(xs) + 2 * pad, min(ys) - pad, max(ys) + pad
    w, h = round(x1 - x0), round(y1 - y0)
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{round(x0)} {round(y0)} {w} {h}" '
           f'width="{round(w * 1.02)}" style="max-width:100%;height:auto" role="img">']
    for a, b in edges:
        if a not in nodes or b not in nodes:
            continue
        (ax, ay), (bx, by) = nodes[a], nodes[b]
        out.append(f'<line x1="{ax}" y1="{ay}" x2="{bx}" y2="{by}" stroke="currentColor" '
                   f'stroke-width="{lw}" stroke-linecap="round"/>')
    for a, b, off in curves:
        if a not in nodes or b not in nodes:
            continue
        (ax, ay), (bx, by) = nodes[a], nodes[b]
        cx, cy = (ax + bx) / 2, (ay + by) / 2
        nx, ny = by - ay, ax - bx
        norm = (nx * nx + ny * ny) ** 0.5 or 1
        qx, qy = cx + nx / norm * off, cy + ny / norm * off
        out.append(f'<path d="M{ax},{ay} Q{round(qx)},{round(qy)} {bx},{by}" fill="none" '
                   f'stroke="currentColor" stroke-width="{lw}"/>')
    for name, (x, y) in nodes.items():
        if name in open_nodes:
            out.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="none" stroke="currentColor" '
                       f'stroke-width="1.6"/>')
        else:
            out.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="currentColor"/>')
    bg = spec.get("bg")
    for name, (x, y) in labels.items():
        color = "#c00" if name in red else "currentColor"
        if bg:                     # белая подложка: буква читается поверх линий
            out.append(f'<rect x="{x - fs * 0.55}" y="{y - fs * 0.72}" width="{fs * 1.1}" '
                       f'height="{fs * 1.32}" fill="{bg}"/>')
        out.append(f'<text x="{x}" y="{y}" font-size="{fs}" text-anchor="middle" '
                   f'dominant-baseline="middle" fill="{color}" '
                   f'style="stroke:none">{name}</text>')
    for name, d in deg:            # степень вершины — красным над буквой
        if name in nodes:
            x, y = nodes[name]
            out.append(f'<text x="{x - 12}" y="{y - 13}" font-size="{fs - 3}" text-anchor="end" '
                       f'dominant-baseline="middle" fill="#c00" style="stroke:none">{d}</text>')
    for name, text in side.items():
        if name in nodes:
            x, y = nodes[name]
            out.append(f'<text x="{x - 14}" y="{y - 12}" font-size="{fs - 2}" text-anchor="end" '
                       f'dominant-baseline="middle" fill="#8e8e93">{text}</text>')
    out.append("</svg>")
    return "".join(out)


def fragment(spec):
    kind = spec.get("kind", "table")
    body = []
    if kind in ("table", "both") and spec.get("cells"):
        body.append(table_html({**spec, "title": None}))
    if kind in ("graph", "both"):
        gspec = spec if kind == "graph" else spec.get("graph")
        if gspec and gspec.get("nodes"):
            body.append(graph_svg(gspec))
    body = [b for b in body if b]
    if len(body) > 1:
        return SIDE + "".join(body) + "</div>"
    return body[0] if body else ""


PREVIEW_CSS = """
body { background:#f4f4f5; margin:0; padding:16px; font:14px/1.4 -apple-system, Arial, sans-serif; }
.cell { display:inline-block; vertical-align:top; margin:6px; padding:10px 12px;
        background:#fff; border:1px solid #ddd; border-radius:8px; max-width:760px; }
.nm { font-size:11px; color:#888; margin-bottom:6px; }
table.fig { border-collapse:collapse; font-variant-numeric:tabular-nums; }
table.fig td, table.fig th { border:1px solid #555; padding:2px 7px; text-align:center; }
.tw { overflow-x:auto; max-width:100%; }
"""


def preview(specs):
    """Картинки так, как их увидит ученик на странице (для проверки глазами)."""
    from playwright.sync_api import sync_playwright
    body = "".join(f'<div class="cell"><div class="nm">{n}</div>{fragment(v)}</div>'
                   for n, v in specs.items())
    html = '<!doctype html><meta charset="utf-8"><style>' + PREVIEW_CSS + "</style>" + body
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1700, "height": 1000}, device_scale_factor=2)
        pg.set_content(html)
        pg.wait_for_timeout(300)
        pg.screenshot(path=sys.argv[-1], full_page=True)
        b.close()


def main():
    specs = json.load(open(sys.argv[1], encoding="utf-8"))
    if sys.argv[2] == "--preview":
        preview(specs)
        print("картинок:", len(specs))
        return
    if sys.argv[2] == "--list":
        for n, v in specs.items():
            print(n, "<div></div>" if not fragment(v) else fragment(v)[:60])
        return
    frags = {name: fragment(spec) for name, spec in specs.items()}
    json.dump(frags, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("картинок:", len(frags))


if __name__ == "__main__":
    main()