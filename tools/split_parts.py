"""Один раз разрезает большие файлы сайта на маленькие части, которые удобно править.
Части лежат в src/kabinet/ и src/api/; build.py собирает из них site/kabinet/index.html и site/api/index.php
(строка вида /*#include имя*/ в шаблоне заменяется содержимым файла). Если части уже есть, ничего не делает.
Режем по строкам-ориентирам (точное содержимое строки), а не по номерам строк."""
import os

NOTE_HTML = '<!-- Страница собирается из частей src/kabinet/ (build.py). Править части там, а не этот файл. -->\n'
NOTE_PHP = '// Файл собирается из частей src/api/ (build.py). Править части там, а не этот файл.\n'

# (часть или None = остаётся в шаблоне, строка-ориентир, 'at' — часть начинается с этой строки / 'after' — со следующей)
JOBS = [
    ('site/kabinet/index.html', 'src/kabinet', 'index.html', NOTE_HTML, [
        ('style.css', '<style>', 'after'),
        (None, '</style>', 'at'),
        ('js/1-base.js', '<script>', 'after'),
        ('js/2-login.js', '/* ---------- вход ---------- */', 'at'),
        ('js/3-progress.js', '/* ---------- прогресс: подсчёт ---------- */', 'at'),
        ('js/4-student.js', '/* ---------- ученик ---------- */', 'at'),
        ('js/5-teacher.js', '/* ---------- учитель ---------- */', 'at'),
        ('js/6-calendar.js', '/* ---------- календарь «Сделать до»: дни занятий подсвечены зелёным ---------- */', 'at'),
        ('js/7-schedule.js', '/* ---------- расписание всех учеников по дням недели ---------- */', 'at'),
        ('js/8-variants.js', '/* ---------- варианты (закрытые материалы) ---------- */', 'at'),
        ('js/9-route.js', '/* ---------- маршрут ---------- */', 'at'),
        (None, '</script>', 'at'),
    ]),
    ('site/api/index.php', 'src/api', 'index.php', NOTE_PHP, [
        ('1-core.php', '<?php', 'after'),
        ('2-auth.php', '/* ---------- запрос ---------- */', 'at'),
        ('3-data.php', '/* ---------- прогресс ----------', 'at'),
        ('4-actions-student.php', '/* ---------- действия ---------- */', 'at'),
        ('5-actions-materials.php', '/* ----- закрытые материалы ----- */', 'at'),
        ('6-actions-rating.php', "case 'leaderboard':", 'at'),
        ('7-actions-teacher.php', '/* ----- кабинет учителя ----- */', 'at'),
    ]),
]


def split(src, outdir, tplname, note, cuts):
    lines = open(src, encoding='utf-8').read().splitlines(keepends=True)
    starts = []
    for name, anchor, mode in cuts:
        hits = [i for i, l in enumerate(lines) if l.rstrip('\n') == anchor]
        assert len(hits) == 1, (src, anchor, hits)
        starts.append((hits[0] + (1 if mode == 'after' else 0), name))
    assert [s for s, _ in starts] == sorted(s for s, _ in starts), src
    segs = [(0, None)] + starts + [(len(lines), None)]
    tpl = []
    for (a, name), (b, _) in zip(segs, segs[1:]):
        chunk = ''.join(lines[a:b])
        if name is None:
            tpl.append(chunk)
        else:
            path = os.path.join(outdir, name)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            open(path, 'w', encoding='utf-8').write(chunk)
            tpl.append('/*#include %s*/\n' % name)
    text = ''.join(tpl)
    first = text.index('\n') + 1            # пометка «не править здесь» — второй строкой файла
    open(os.path.join(outdir, tplname), 'w', encoding='utf-8').write(text[:first] + note + text[first:])
    print('разрезан', src, '->', outdir, len(starts), 'частей')


if __name__ == '__main__':
    for src, outdir, tplname, note, cuts in JOBS:
        if not os.path.exists(os.path.join(outdir, tplname)):
            split(src, outdir, tplname, note, cuts)
