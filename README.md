# Лучший репетитор по информатике — gsvv.ru/inf

Сайт Артёма Свинченко: курсы, варианты ЕГЭ и контрольные работы.

## Как устроено

- `site/` — то, что лежит на хостинге в `www/gsvv.ru/inf/`. Всё, что попадает в эту папку в ветке `main`, автоматически загружается на хостинг (см. `.github/workflows/deploy.yml`).
- `src/engine.html` — движок страницы курса, `src/<курс>/course.js` — данные уроков. `python3 build.py` собирает `site/ege-19-21/` и `site/ege-18/`.
- `src/18/build18.py` — генератор курса № 18: берёт исходные таблицы из `sources/18`, ставит новые числа (стены не трогает), считает ответы и пишет файлы в `site/ege-18/files/`.
- `sources/` — исходные файлы заданий; скачиваются автоматически по спискам `sources/*-urls.txt`.

Загружаются только изменённые файлы. Файлы, которые лежат на хостинге, но не в репозитории (например, `kr1.html` и `ege-demo-site/files/`), не трогаются.

## Настройка (один раз)

В репозитории: **Settings → Secrets and variables → Actions → New repository secret**:

| Имя | Что вписать |
|---|---|
| `FTP_SERVER` | адрес FTP-сервера из панели хостинга |
| `FTP_USERNAME` | логин FTP (`u3640031_deploy`, его домашняя папка — `www/gsvv.ru/inf`) |
| `FTP_PASSWORD` | пароль FTP |

Проверить загрузку вручную: вкладка **Actions → Загрузка сайта на хостинг → Run workflow**.

## Ссылки для Telegram

Telegram не может получить превью напрямую с хостинга, поэтому для отправки в Telegram есть короткие ссылки на GitHub Pages (папка `share/`). Они показывают превью и сразу перебрасывают на сайт:

| Ссылка для Telegram | Куда ведёт |
|---|---|
| https://hardit654-hub.github.io/inf-site/ | https://gsvv.ru/inf/ |
| https://hardit654-hub.github.io/inf-site/kurs/ | курс № 19–21 |
| https://hardit654-hub.github.io/inf-site/demo/ | демоверсия ЕГЭ‑2027 |

Один раз нужно включить GitHub Pages: **Settings → Pages → Source: GitHub Actions**.
