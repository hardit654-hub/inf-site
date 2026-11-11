# Лучший репетитор по информатике — gsvv.ru/inf

Сайт Артёма Свинченко: курсы, варианты ЕГЭ и контрольные работы.

## Как устроено

- `site/` — то, что лежит на хостинге в `www/gsvv.ru/inf/`. Всё, что попадает в эту папку в ветке `main`, автоматически загружается на хостинг (см. `.github/workflows/deploy.yml`).
- `src/` — исходники курса № 19–21: движок страницы (`index.html`) и данные уроков (`course.js`). Из них собирается `site/ege-19-21/index.html`.

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
