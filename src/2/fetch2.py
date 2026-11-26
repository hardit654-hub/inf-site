# -*- coding: utf-8 -*-
"""Заглушка: копирует сохранённую выгрузку КЕГЭ в sources/2/kege2-raw.json.

Настоящую выгрузку делает src/2/fetch2.py (через браузер). Здесь только
перенос уже скачанного файла, чтобы сборка не зависела от учётных данных.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
DST = os.path.join(ROOT, "sources", "2", "kege2-raw.json")

src = sys.argv[1] if len(sys.argv) > 1 else ""
if not src or not os.path.exists(src):
    sys.exit("укажите путь к выгрузке: python3 src/2/fetch2.py <файл.json>")
data = json.load(open(src))
tasks = data.get("tasks", data)
if isinstance(tasks, dict):
    tasks = list(tasks.values())
tasks = [t for t in tasks if str(t.get("number")) == "2"]
json.dump({"source": "kompege", "number": 2, "tasks": tasks},
          open(DST, "w"), ensure_ascii=False, indent=1)
print("записано", len(tasks), "задач ->", DST)