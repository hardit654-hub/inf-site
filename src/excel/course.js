/* Данные курса «Электронные таблицы». Собирается скриптом src/excel/build_excel.py */
window.COURSE = {
 "id": "excel",
 "title": "Электронные таблицы",
 "sections": [
  {
   "num": 1,
   "title": "Знакомство с LibreOffice Calc и MS Excel",
   "lessons": [
    {
     "num": "1.1",
     "label": "1",
     "title": "Уроки по Excel",
     "steps": [
      {
       "type": "video",
       "key": "video-excel",
       "title": "Уроки по Excel"
      }
     ]
    },
    {
     "num": "1.2",
     "label": "2",
     "title": "Интерфейс LibreOffice Calc",
     "steps": [
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<h2>Содержание урока</h2> <p>В этом уроке вы познакомитесь с:</p> <ul> <li><strong>интерфейсом Электронных таблиц </strong>на примере <strong>LibreOffice Calc</strong></li> <li><strong>автозаполнением</strong></li> </ul> <p>А также установите LibreOffice на свой компьютер.</p>"
        }
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<h2>Где скачать LibreOffice?</h2> <p>Скачать LibreOffice можно по <a href=\"https://www.libreoffice.org/download/download-libreoffice/\" target=\"_blank\" rel=\"noopener\">ссылке</a>. Данный продукт является бесплатным, в отличие от Excel.</p> <p>Скачивайте последнюю версию.</p>"
        }
       ]
      },
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<p><strong>Очень важно вам самим повторить все действия, которые выполняет преподаватель в видео на следующих шагах!</strong></p>"
        }
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Какой номер имеет последняя строка в вашей версии LibreOffice Calc?</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "1048576"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Какой заголовок имеет последний столбец в вашей версии LibreOffice Calc?</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1,
         "txt": 1
        }
       ],
       "answer": [
        [
         "AMJ"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Вычислите в LibreOffice Calc какое количество дней пройдёт с 1.09.2023 до 1.01.2024? </p> <p><em>Пояснение: правильным ответом для дат 1.09.2023 и 2.09.2023 будет число 1.</em></p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1,
         "txt": 1
        }
       ],
       "answer": [
        [
         "122"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Какое число будет в ячейке А3, если потянуть за маркер автозаполнения вниз?</p> <p> <img src=\"img/imgx.2.9-1.png\" alt=\"\"></p> <p><em>Решите задачу устно, а затем проверьте себя в LibreOffice Calc.</em></p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1,
         "txt": 1
        }
       ],
       "answer": [
        [
         "7"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Какое число будет в ячейке B7, если два раза кликнуть по маркеру автозаполнения левой кнопкой мыши ?</p> <p> <img src=\"img/imgx.2.10-1.png\" alt=\"\"></p> <p><em>Решите задачу устно, а затем проверьте себя в LibreOffice Calc.</em></p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1,
         "txt": 1
        }
       ],
       "answer": [
        [
         "13"
        ]
       ]
      },
      {
       "type": "choice",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Что будет в ячейке С10, если два раза кликнуть по маркеру автозаполнения левой кнопкой мыши?</p> <p><img src=\"img/imgx.2.11-1.png\" alt=\"\"></p> <p><em>Решите задачу устно, а затем проверьте себя в LibreOffice Calc.</em></p>"
        }
       ],
       "options": [
        "21",
        "29",
        "Пустота, так как для автозаполнения двойным кликом мыши необходимо, чтобы был заполнен соседний левый или правый столбец."
       ],
       "answer": 1
      },
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<h1>Полезные клавишные комбинации</h1> <h3>Изменение масштаба</h3> <p><code>Ctrl</code> + <code>+</code> – увеличить масштаб.</p> <p><code>Ctrl</code> + <code>-</code> – уменьшить масштаб.</p> <h3>Отмена действий</h3> <p><code>Ctrl</code> + <code>Z</code> – отменить последнее действие.</p> <p><code>Ctrl</code> + <code>Y</code> – обратная команда к <code>Ctrl</code> + <code>Z</code>.</p> <h3>Копирование, вставка, вырезание</h3> <p><code>Ctrl</code> + <code>C</code> – копировать.</p> <p><code>Ctrl</code> + <code>V</code> – вставить.</p> <p><code>Ctrl</code> + <code>X</code> – вырезать.</p> <h3>Поиск и замена</h3> <p><code>Ctrl</code> + <code>F</code> – найти.</p> <p><code>Ctrl</code> + <code>H</code> – заменить.</p> <h3>Быстрое перемещение</h3> <p><code>Ctrl</code> + <strong><code>↓</code> </strong>– переместить курсор вниз.</p> <p><img src=\"img/imgx.2.12-1.png\" alt=\"\"> <img src=\"img/imgx.2.12-2.png\" alt=\"\"></p> <p><code>Ctrl</code> + <strong><code>↑</code> </strong>– переместить курсор вверх.</p> <p><code>Ctrl</code> + <strong><code>→</code> </strong>– переместить курсор вправо.</p> <p><code>Ctrl</code> + <code>←</code><strong> </strong>– переместить курсор влево.</p> <p>Если нажать <code>Ctrl + Shift + стрелка</code>, то тогда курсор переместится в указанном направлении, и при этом произойдёт выделение.</p> <p><img src=\"img/imgx.2.12-3.png\" alt=\"\"> <img src=\"img/imgx.2.12-4.png\" alt=\"\"></p> <p>Используя данный приём можно выделить нужные данные и скопировать.</p> <p><img src=\"img/imgx.2.12-5.png\" alt=\"\"> <img src=\"img/imgx.2.12-6.png\" alt=\"\"></p>"
        }
       ]
      }
     ]
    },
    {
     "num": "1.3",
     "label": "3",
     "title": "Формулы и адресация",
     "steps": [
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<h2>Содержание урока</h2> <p>В этом уроке вы узнаете, как ведут себя при копировании <strong>относительные, абсолютные и смешанные ссылки</strong> в формуле.</p>"
        }
       ]
      },
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<p><strong>Очень важно вам самим повторить все действия, которые выполняет преподаватель в видео на следующих шагах!</strong></p>"
        }
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "choice",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Какой знак нужно использовать, чтобы сделать ссылку абсолютной, то есть закрепить ссылку при копировании?</p>"
        }
       ],
       "options": [
        "%",
        "&",
        "#",
        "$",
        "!",
        "*",
        "@"
       ],
       "answer": 3
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Какое значение будет получено в ячейке С6, если туда скопировать ячейку С1?</p> <p><img src=\"img/imgx.3.5-1.png\" alt=\"\"></p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "21"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Какое значение будет получено в ячейке С6, если туда скопировать ячейку С1?</p> <p><img src=\"img/imgx.3.6-1.png\" alt=\"\"></p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "11"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Какое значение будет получено в ячейке С6, если туда скопировать ячейку С1?</p> <p><img src=\"img/imgx.3.7-1.png\" alt=\"\"></p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "21"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Какое значение будет получено в ячейке С6, если туда скопировать ячейку С1?</p> <p><img src=\"img/imgx.3.8-1.png\" alt=\"\"></p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "11"
        ]
       ]
      }
     ]
    },
    {
     "num": "1.4",
     "label": "4",
     "title": "Функции СУММ, МИН/МАКС, СРЗНАЧ, СЧЁТ",
     "steps": [
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<h2>Содержание урока</h2> <p>В этом уроке вы познакомитесь с функциями:</p> <ul> <li><strong>СУММ</strong></li> <li><strong>МИН, МАКС</strong></li> <li><strong>СРЗНАЧ</strong></li> <li><strong>СЧЁТ</strong></li> </ul>"
        }
       ]
      },
      {
       "type": "text",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "summ-min-maks-srznach-schet.ods",
           "href": "files/summ-min-maks-srznach-schet.ods",
           "size": "27 КБ"
          },
          {
           "name": "kvadrat-s-chislami.ods",
           "href": "files/kvadrat-s-chislami.ods",
           "size": "12 КБ"
          },
          {
           "name": "funkcii-schet.ods",
           "href": "files/funkcii-schet.ods",
           "size": "12 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><strong>Очень важно вам самим повторить все действия, которые выполняет преподаватель в видео на следующих шагах!</strong></p> <p>Для этого скачайте файл с электронной таблицей – <strong><a href=\"files/summ-min-maks-srznach-schet.ods\" target=\"_blank\" rel=\"noopener\">файл_1</a></strong>, <a href=\"files/kvadrat-s-chislami.ods\" target=\"_blank\" rel=\"noopener\">файл_2</a> и <strong><a href=\"files/funkcii-schet.ods\" target=\"_blank\" rel=\"noopener\">файл 3</a></strong>. </p>"
        }
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "summ-min-maks-srznach-schet.ods",
           "href": "files/summ-min-maks-srznach-schet.ods",
           "size": "27 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/summ-min-maks-srznach-schet.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a> с помощью функции СУММ найдите суммарное количество упаковок товаров в магазине В.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "2697"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "summ-min-maks-srznach-schet.ods",
           "href": "files/summ-min-maks-srznach-schet.ods",
           "size": "27 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/summ-min-maks-srznach-schet.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a> с помощью функции СУММ найдите суммарное количество упаковок во всех магазинах для каждого товара.</p> <p>В ответ запишите суммарное количество упаковок для товара Мармелад желейный. </p> "
        },
        {
         "t": "details",
         "title": "Подсказка",
         "v": [
          {
           "t": "html",
           "v": " <ol> <li>Сначала с помощью функции сумм найдите сумму упаковок в магазине А, В и С для товара Батончик соевый: в ячейку F2 введите формулу =СУММ(C2:E2).</li> <li>Выделите ячейку F2, в правом нижнем углу найдите маркер автозаполнения и \"растяните\" формулу для всех товаров.</li> <li>Обязательно проверьте правильность автозаполнения формулы.</li> </ol> "
          }
         ]
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "483"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "kvadrat-s-chislami.ods",
           "href": "files/kvadrat-s-chislami.ods",
           "size": "12 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/kvadrat-s-chislami.ods\" target=\"_blank\" rel=\"noopener\">файле 2</a> с помощью ровно одной функции СУММ найдите сумму чисел из зелёных ячеек.</p> <p>В ответ запишите одно число – сумму чисел из зелёных ячеек.</p> <ol> </ol>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "68"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "summ-min-maks-srznach-schet.ods",
           "href": "files/summ-min-maks-srznach-schet.ods",
           "size": "27 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/summ-min-maks-srznach-schet.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a> с помощью функции МАКС найдите максимальное количество упаковок одного товара в магазине В.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "199"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "summ-min-maks-srznach-schet.ods",
           "href": "files/summ-min-maks-srznach-schet.ods",
           "size": "27 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/summ-min-maks-srznach-schet.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a> с помощью функции МИН найдите минимальное количество упаковок одного товара в магазинах В и С (минимальное число в диапазоне D2:E20). </p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "12"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "summ-min-maks-srznach-schet.ods",
           "href": "files/summ-min-maks-srznach-schet.ods",
           "size": "27 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/summ-min-maks-srznach-schet.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a> с помощью функции СРЗНАЧ найдите среднее количество упаковок в магазинах В и С (среднее значение в диапазоне D2:E20).</p> <p>В ответ дайте число с точностью два знака после запятой.</p> <p><em>Например: для числа 68,67654 в ответ нужно записать 68,68.</em></p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "155.24"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "funkcii-schet.ods",
           "href": "files/funkcii-schet.ods",
           "size": "12 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/funkcii-schet.ods\" target=\"_blank\" rel=\"noopener\">файле 3</a> найдите количество чисел в столбце A.</p> "
        },
        {
         "t": "details",
         "title": "Подсказка",
         "v": [
          {
           "t": "html",
           "v": " <p>В любой ячейке напишите формулу <code>=СЧЁТ(A:A)</code>. Для этого в поле параметра функции в качестве диапазона выберите весь столбец А – просто кликните по названию столбца.</p> "
          }
         ]
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "97"
        ]
       ]
      }
     ]
    },
    {
     "num": "1.5",
     "label": "5",
     "title": "Функции СУММЕСЛИ, СЧЁТЕСЛИ ...",
     "steps": [
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<h2>Содержание урока</h2> <p>В этом уроке вы познакомитесь с функциями:</p> <ul> <li><strong>СЧЁТЕСЛИ</strong></li> <li><strong>СУММЕСЛИ</strong></li> <li><strong>СРЗНАЧЕСЛИ</strong></li> <li><strong>МИНЕСЛИ, МАКСЕСЛИ</strong></li> </ul>"
        }
       ]
      },
      {
       "type": "text",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetesli-summesli.ods",
           "href": "files/schetesli-summesli.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><strong>Очень важно вам самим повторить все действия, которые выполняет преподаватель в видео на следующих шагах!</strong></p> <p>Для этого скачайте файл с электронной таблицей – <a href=\"files/schetesli-summesli.ods\" target=\"_blank\" rel=\"noopener\">файл_1</a>. </p>"
        }
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetesli-summesli.ods",
           "href": "files/schetesli-summesli.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/schetesli-summesli.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a> с помощью функции СЧЁТЕСЛИ найдите количество товаров, количество упаковок которых в магазине В больше 150.</p> "
        },
        {
         "t": "details",
         "title": "Пример",
         "v": [
          {
           "t": "html",
           "v": " <p> <img src=\"img/imgx.5.4-1.png\" alt=\"\"></p> <p>Для данной таблицы ответом будет число 2.</p> "
          }
         ]
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "5"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetesli-summesli.ods",
           "href": "files/schetesli-summesli.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/schetesli-summesli.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a> с помощью функции СУММЕСЛИ найдите в магазине С суммарное количество упаковок товаров, цена которых больше 40.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "281"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetesli-summesli.ods",
           "href": "files/schetesli-summesli.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/schetesli-summesli.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a> с помощью функции СУММЕСЛИ для каждого товара в столбце I найдите суммарное количество упаковок данного товара в магазинах, в которых его цена меньше 30.</p> <p>В ответ дайте максимальное получившиеся значение из столбца I. </p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "456"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetesli-summesli.ods",
           "href": "files/schetesli-summesli.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/schetesli-summesli.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a> с помощью функции СРЗНАЧЕСЛИ в магазине В найдите среднее количество упаковок среди тех товаров, у которых цена не меньше 50.</p> <p>Ответ дайте с точностью два знака после запятой.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "161.33"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetesli-summesli.ods",
           "href": "files/schetesli-summesli.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/schetesli-summesli.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a> с помощью функции СРЗНАЧЕСЛИ для каждого товара в столбце I найдите среднее количество упаковок данного товара среди магазинов, где его цена не меньше 10.</p> <p>В ответ дайте сумму чисел в столбце I с точностью два знака после запятой.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "2769.33"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetesli-summesli.ods",
           "href": "files/schetesli-summesli.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/schetesli-summesli.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a> с помощью функции МАКСЕСЛИ найдите максимальное количество упаковок одного товара в магазине А, при условии, что цена на данный товар и в магазине А, и в магазине В, и в магазине С не больше 20.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "142"
        ]
       ]
      }
     ]
    },
    {
     "num": "1.6",
     "label": "6",
     "title": "Функции СУММЕСЛИМН, СЧЁТЕСЛИМН ...",
     "steps": [
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<h2>Содержание урока</h2> <p>В этом уроке вы познакомитесь с функциями:</p> <ul> <li><strong>СЧЁТЕСЛИМН</strong></li> <li><strong>СУММЕСЛИМН</strong></li> <li><strong>СРЗНАЧЕСЛИМН</strong></li> </ul>"
        }
       ]
      },
      {
       "type": "text",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "scheteslimn.ods",
           "href": "files/scheteslimn.ods",
           "size": "28 КБ"
          },
          {
           "name": "uslovie-v-schetesli.ods",
           "href": "files/uslovie-v-schetesli.ods",
           "size": "27 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><strong>Очень важно вам самим повторить все действия, которые выполняет преподаватель в видео на следующих шагах!</strong></p> <p>Для этого скачайте файл с электронной таблицей – <a href=\"files/scheteslimn.ods\" target=\"_blank\" rel=\"noopener\">файл_1</a> и <a href=\"files/uslovie-v-schetesli.ods\" target=\"_blank\" rel=\"noopener\">файл 2</a>. </p>"
        }
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "scheteslimn.ods",
           "href": "files/scheteslimn.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/scheteslimn.ods\" target=\"_blank\" rel=\"noopener\"><strong>файле 1</strong></a> с помощью функции СУММЕСЛИМН в магазине А найдите суммарное количество упаковок товаров, на которые действует скидка, и цена которых не больше 30.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "1084"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "scheteslimn.ods",
           "href": "files/scheteslimn.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/scheteslimn.ods\" target=\"_blank\" rel=\"noopener\"><strong>файле 1</strong></a> с помощью функции СУММЕСЛИМН для каждого товара найдите суммарное количество упаковок данного товара в тех магазинах, в которых его цена находится в диапазоне от 20 до 60 включительно. </p> <p>В ответ запишите количество товаров, для которых полученные значения не меньше 200.</p> "
        },
        {
         "t": "details",
         "title": "Подсказка",
         "v": [
          {
           "t": "html",
           "v": " <p>Для первого товара определите суммарное количество упаковок, при условии, что цена в соответствующем магазине больше или равна 20 и меньше или равна 60. Для этого с помощью мастера функций напишите формулу как показано на рисунке:</p> <p><img src=\"img/imgx.6.5-1.png\" alt=\"\"></p> <p>С помощью маркера автозаполнения скопируйте формулу вниз по столбцу для каждого товара.</p> <p>С помощью функции СЧЁТЕСЛИ определите количество ячеек в столбце J, значение которых не меньше 200.</p> "
          }
         ]
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "8"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "scheteslimn.ods",
           "href": "files/scheteslimn.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/scheteslimn.ods\" target=\"_blank\" rel=\"noopener\"><strong>файле 1</strong></a> с помощью функции СРЗНАЧЕСЛИМН в магазине C найдите среднее количество упаковок товаров, на которые действует скидка, и цена которых не больше 20.</p> <p>Ответ дайте с точностью два знака после запятой.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "183.83"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "scheteslimn.ods",
           "href": "files/scheteslimn.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/scheteslimn.ods\" target=\"_blank\" rel=\"noopener\"><strong>файле 1</strong></a> с помощью функции СЧЁТЕСЛИМН найдите количество товаров, количество упаковок которых в магазине В не больше 155 и в магазине С не меньше 111.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "14"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "scheteslimn.ods",
           "href": "files/scheteslimn.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <strong><a href=\"files/scheteslimn.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a></strong>&nbsp;с помощью функции СЧЁТЕСЛИМН найдите количество товаров для которых выполняются все условия:</p> <ul> <li>количество упаковок в магазине А&nbsp;больше 100 и меньше 150</li> <li>цена товара в магазине А не больше 25</li> <li>на товар предоставляется скидка</li> </ul>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "3"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "uslovie-v-schetesli.ods",
           "href": "files/uslovie-v-schetesli.ods",
           "size": "27 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <strong><a href=\"files/uslovie-v-schetesli.ods\" target=\"_blank\" rel=\"noopener\">файле 2</a></strong> определите количество товаров у которых цена не превосходит средней цены всех товаров.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1,
         "txt": 1
        }
       ],
       "answer": [
        [
         "7"
        ]
       ]
      }
     ]
    },
    {
     "num": "1.7",
     "label": "7",
     "title": "Фильтр и сортировка",
     "steps": [
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<h2>Содержание урока</h2> <p>В этом уроке вы познакомитесь с <strong>сортировкой </strong>и <strong>фильтром</strong>.</p>"
        }
       ]
      },
      {
       "type": "text",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "filtr-sortirovka.ods",
           "href": "files/filtr-sortirovka.ods",
           "size": "77 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><strong>Очень важно вам самим повторить все действия, которые выполняет преподаватель в видео на следующих шагах!</strong></p> <p>Для этого скачайте <a href=\"files/filtr-sortirovka.ods\" target=\"_blank\" rel=\"noopener\">файл</a> с электронной таблицей. </p>"
        }
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "filtr-sortirovka.ods",
           "href": "files/filtr-sortirovka.ods",
           "size": "77 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>Используя информацию листа Движение товаров <a href=\"files/filtr-sortirovka.ods\" target=\"_blank\" rel=\"noopener\"><strong>файла</strong></a> определите количество операций произведённых 2 июня в магазинах М10, М11.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "23"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "filtr-sortirovka.ods",
           "href": "files/filtr-sortirovka.ods",
           "size": "77 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>Используя информацию листа Движение товаров <strong><a href=\"files/filtr-sortirovka.ods\" target=\"_blank\" rel=\"noopener\">файла</a></strong> определите суммарное количество упаковок <strong> </strong>товаров <strong>поступивших</strong> в магазин с ID равным М9, в период с 3 по 4 июня включительно<strong>. </strong></p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "3020"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "filtr-sortirovka.ods",
           "href": "files/filtr-sortirovka.ods",
           "size": "77 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>Используя информацию листа \"Движение товаров\" из <strong><a href=\"files/filtr-sortirovka.ods\" target=\"_blank\" rel=\"noopener\">файла</a></strong>, определите суммарное количество упаковок товаров, <strong>поступивших</strong> в магазин <strong>М13</strong> <strong>с 1 по 5 июня включительно, цена которых не меньше 100 и не больше 200. </strong></p> <h3> </h3> <h3>Важно</h3> <p>При решении в LibreOffice есть нюанс...</p> <p>Если выбрать даты, а потом применить стандартный фильтр, то из всех выбранных дат, остаётся только самая первая. То есть фильтр работает некорректно.</p> <p>Чтобы всё было хорошо. </p> <ol> <li>Применяем стандартный фильтр, чтобы установить цену от 100 до 200.</li> <li><strong>Копируем отфильтрованные данные на новый лист.</strong></li> <li>Применяем все остальные фильтры.</li> </ol> <p> То есть после каждого применения стандартного фильтра, нужно копировать данные на новый лист.</p> <p><img src=\"img/imgx.7.7-1.png\" alt=\"\"></p>   <p><strong>Примечание 1</strong><br> Если есть возможность, то избегайте использование стандартного фильтра. <br> Например, в данной задаче цену можно выбрать вручную.</p> <p><img src=\"img/imgx.7.7-2.png\" alt=\"\"></p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "1430"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "filtr-sortirovka.ods",
           "href": "files/filtr-sortirovka.ods",
           "size": "77 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>Используя информацию листов \"Движение товаров\", \"Товар\", \"Магазин\" из <strong><a href=\"files/filtr-sortirovka.ods\" target=\"_blank\" rel=\"noopener\">файла</a></strong>, определите на сколько увеличилось (разница между поступлением и продажей) количество упаковок кофе всех сортов, имеющихся в наличии в магазинах Заречного района, за период с 3 по 8 июня включительно.</p> "
        },
        {
         "t": "details",
         "title": "Подсказка",
         "v": [
          {
           "t": "html",
           "v": " <p>ID магазинов <em>Заречного района</em> с помощью фильтра можно найти на листе Магазин, а Артикул товара – <em>кофе всех сортов</em> с помощью фильтра можно найти на листе Товар. </p> "
          }
         ]
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "779"
        ]
       ]
      }
     ]
    },
    {
     "num": "1.8",
     "label": "8",
     "title": "Функция ОСТАТ",
     "steps": [
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<h2>Содержание урока</h2> <p>В этом уроке вы познакомитесь с:</p> <ul> <li>функцией <strong>ОСТАТ</strong></li> <li>приёмом, который позволяет найти <strong>количество, сумму, среднее значение чисел, которые удовлетворяют условию –</strong><strong> имеют определённый остаток при делении на некоторое число.</strong></li> </ul>"
        }
       ]
      },
      {
       "type": "text",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "ostat-priemy.ods",
           "href": "files/ostat-priemy.ods",
           "size": "20 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><strong>Очень важно вам самим повторить все действия, которые выполняет преподаватель в видео на следующих шагах!</strong></p> <p>Для этого скачайте файл с электронной таблицей – <strong><a href=\"files/ostat-priemy.ods\" target=\"_blank\" rel=\"noopener\">файл_1</a></strong>. </p>"
        }
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "ostat-priemy.ods",
           "href": "files/ostat-priemy.ods",
           "size": "20 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><em><strong>Попробуйте решить задачу самостоятельно, но обязательно посмотрите её разбор на следующем шаге. </strong></em></p> <p><em><strong>В видео рассматривается важный приём </strong></em>😉</p> <p>В <strong><a href=\"files/ostat-priemy.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a></strong> определите количество строк, в которых содержится ровно три чётных числа.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "29"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "ostat-priemy.ods",
           "href": "files/ostat-priemy.ods",
           "size": "20 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><em><strong>Попробуйте решить задачу самостоятельно, но обязательно посмотрите её разбор на следующем шаге. </strong></em></p> <p><em><strong>В видео рассматривается важный приём </strong></em>😉</p> <p>В <strong><a href=\"files/ostat-priemy.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a></strong> определите количество строк, в которых сумма нечётных чисел не больше 100.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1,
         "txt": 1
        }
       ],
       "answer": [
        [
         "37"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "ostat-priemy.ods",
           "href": "files/ostat-priemy.ods",
           "size": "20 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><em><strong>Попробуйте решить задачу самостоятельно, но обязательно посмотрите её разбор на следующем шаге. </strong></em></p> <p><em><strong>В видео рассматривается важный приём </strong></em>😉</p> <p>В <strong><a href=\"files/ostat-priemy.ods\" target=\"_blank\" rel=\"noopener\">файле 1</a></strong> определите количество строк, в которых среднее значение чисел, последняя цифра которых равна 3, не больше 30 и не меньше 10.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "13"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      }
     ]
    },
    {
     "num": "1.9",
     "label": "9",
     "title": "Логические функции",
     "steps": [
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<h2>Содержание урока</h2> <p>В этом уроке вы познакомитесь с:</p> <ul> <li>логическими функциями <strong>ЕСЛИ</strong>, <strong>ЕСЛИМН</strong>, <strong>И, </strong><strong>ИЛИ, </strong><strong>НЕ</strong></li> <li>приёмом, который позволяет найти <strong>количество (сумму) подходящих строк</strong> </li> </ul>"
        }
       ]
      },
      {
       "type": "text",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetesli-summesli.ods",
           "href": "files/schetesli-summesli.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><strong>Очень важно вам самим повторить все действия, которые выполняет преподаватель в видео на следующих шагах!</strong></p> <p>Для этого скачайте файл с электронной таблицей – <a href=\"files/schetesli-summesli.ods\" target=\"_blank\" rel=\"noopener\">файл_1</a>. </p>"
        }
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetesli-summesli.ods",
           "href": "files/schetesli-summesli.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/schetesli-summesli.ods\" target=\"_blank\" rel=\"noopener\">файле_1</a> для каждого товара рассчитайте размер скидки. Если цена товара в магазине B меньше 50, то скидка 5%, иначе 10%.</p> <p>В ответ запишите наибольший артикул товара, для которого размер скидки равен 10%.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "15"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetesli-summesli.ods",
           "href": "files/schetesli-summesli.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><em><strong>Попробуйте решить задачу самостоятельно, но обязательно посмотрите её разбор на следующем шаге. </strong></em></p> <p><em><strong>В видео рассматривается важный приём </strong></em>😉</p> <p>В <a href=\"files/schetesli-summesli.ods\" target=\"_blank\" rel=\"noopener\">файле_1</a> найдите количество товаров, для которых выполняется условие – количество упаковок в магазине А меньше количества упаковок в магазине В.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "10"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetesli-summesli.ods",
           "href": "files/schetesli-summesli.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/schetesli-summesli.ods\" target=\"_blank\" rel=\"noopener\">файле_1</a> для каждого товара рассчитайте размер скидки. Если цена товара в магазине А меньше 20, то скидка 5%, иначе если цена товара меньше 50, то размер скидки 10%, иначе размер скидки 15%.</p> <p>В ответ запишите суммарное количество упаковок товаров магазина А, для которых размер скидки равен 10%.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "937"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetesli-summesli.ods",
           "href": "files/schetesli-summesli.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/schetesli-summesli.ods\" target=\"_blank\" rel=\"noopener\">файле_1</a> для каждого товара рассчитайте размер скидки. Если цена товара в магазине А меньше 20, и в магазине B меньше 20 и в магазине С меньше 20, то скидка 5%, иначе размер равен скидки 10%.</p> <p>В ответ запишите количество товаров, для которых размер скидки равен 10%.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "17"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetesli-summesli.ods",
           "href": "files/schetesli-summesli.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/schetesli-summesli.ods\" target=\"_blank\" rel=\"noopener\">файле_1</a> для каждого товара рассчитайте размер скидки. Если количество упаковок данного товара или в магазине А меньше 50, или в магазине B меньше 50 или в магазине С меньше 50, то скидка 0%, иначе размер скидки равен 10%.</p> <p>В ответ запишите наибольший артикул товара, для которого размер скидки равен 0%.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "8"
        ]
       ]
      }
     ]
    },
    {
     "num": "1.10",
     "label": "10",
     "title": "Функции НАИМЕНЬШИЙ, НАИБОЛЬШИЙ",
     "steps": [
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<h2>Содержание урока</h2> <p>В этом уроке вы познакомитесь с:</p> <ul> <li>функциями <strong>НАИМЕНЬШИЙ, НАИБОЛЬШИЙ</strong></li> <li>приёмом, который позволяет <strong>отсортировать данные в строке</strong></li> <li>приёмом, который позволяет с помощью сортировки отвечать на вопросы: <strong>можно ли разбить числа на две группы с равными суммами</strong> и т.п.</li> </ul>"
        }
       ]
      },
      {
       "type": "text",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "naimenshiy-naibolshiy.ods",
           "href": "files/naimenshiy-naibolshiy.ods",
           "size": "151 КБ"
          },
          {
           "name": "naimenshiy-naibolshiy-4.ods",
           "href": "files/naimenshiy-naibolshiy-4.ods",
           "size": "104 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><strong>Очень важно вам самим повторить все действия, которые выполняет преподаватель в видео на следующих шагах!</strong></p> <p>Для этого скачайте <a href=\"files/naimenshiy-naibolshiy.ods\" target=\"_blank\" rel=\"noopener\">файл 1</a> и <a href=\"files/naimenshiy-naibolshiy-4.ods\" target=\"_blank\" rel=\"noopener\">файл_2</a> с электронной таблицей. </p>"
        }
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "naimenshiy-naibolshiy-4.ods",
           "href": "files/naimenshiy-naibolshiy-4.ods",
           "size": "104 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/naimenshiy-naibolshiy-4.ods\" target=\"_blank\" rel=\"noopener\"><strong>файле 2</strong></a> определите количество строк для которых выполняется условие:</p> <ul> <li>наибольшее из четырёх чисел меньше суммы трёх других.</li> </ul>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "5535"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "naimenshiy-naibolshiy-4.ods",
           "href": "files/naimenshiy-naibolshiy-4.ods",
           "size": "104 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/naimenshiy-naibolshiy-4.ods\" target=\"_blank\" rel=\"noopener\"><strong>файле 2</strong></a> определите количество строк для которых выполняется условие:</p> <ul> <li>сумма максимального и минимального чисел строки больше удвоенной суммы оставшихся чисел.</li> </ul>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "205"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "naimenshiy-naibolshiy-4.ods",
           "href": "files/naimenshiy-naibolshiy-4.ods",
           "size": "104 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/naimenshiy-naibolshiy-4.ods\" target=\"_blank\" rel=\"noopener\"><strong>файле 2</strong></a> определите количество строк для которых выполняется условие:</p> <ul> <li>квадрат суммы максимального и минимального чисел в строке больше суммы квадратов оставшихся.</li> </ul>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "6150"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "naimenshiy-naibolshiy-4.ods",
           "href": "files/naimenshiy-naibolshiy-4.ods",
           "size": "104 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><em><strong>Попробуйте решить задачу самостоятельно, но обязательно посмотрите её разбор на следующем шаге. </strong></em></p> <p><em><strong>В видео рассматривается важный приём </strong></em>😉</p> <p>В <a href=\"files/naimenshiy-naibolshiy-4.ods\" target=\"_blank\" rel=\"noopener\"><strong>файле 2</strong></a> определите количество строк для которых выполняется условие:</p> <ul> <li>четыре числа можно разбить на две пары чисел с равными суммами.</li> </ul> "
        },
        {
         "t": "details",
         "title": "Подсказка",
         "v": [
          {
           "t": "html",
           "v": " <p>Задача легко решается с помощью сортировки чисел в строке. Подумайте как сортировка поможет дать ответ на вопрос задачи.</p> "
          }
         ]
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "197"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "naimenshiy-naibolshiy-4.ods",
           "href": "files/naimenshiy-naibolshiy-4.ods",
           "size": "104 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>В <a href=\"files/naimenshiy-naibolshiy-4.ods\" target=\"_blank\" rel=\"noopener\"><strong>файле 2</strong></a> определите количество строк для которых выполняется условие:</p> <ul> <li>четыре числа <strong>нельзя </strong>разбить на две пары чисел с равными суммами.</li> </ul>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "6203"
        ]
       ]
      }
     ]
    },
    {
     "num": "1.11",
     "label": "11",
     "title": "Повторяющиеся числа",
     "steps": [
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<h2>Содержание урока</h2> <p>В этом уроке вы познакомитесь с:</p> <ul> <li>приёмом <strong>подсчитывания счётчиков для каждого числа строки</strong></li> <li>применением счётчиков для <strong>определения повторяющихся чисел</strong></li> </ul>"
        }
       ]
      },
      {
       "type": "text",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetchiki.ods",
           "href": "files/schetchiki.ods",
           "size": "366 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><strong>Очень важно вам самим повторить все действия, которые выполняет преподаватель в видео на следующих шагах!</strong></p> <p>Для этого скачайте <a href=\"files/schetchiki.ods\" target=\"_blank\" rel=\"noopener\">файл</a> с электронной таблицей. </p>"
        }
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetchiki.ods",
           "href": "files/schetchiki.ods",
           "size": "366 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><em><strong>Попробуйте решить задачу самостоятельно, но обязательно посмотрите её разбор на следующем шаге. </strong></em></p> <p><em><strong>В видео рассматривается важный приём </strong></em>😉</p> <p>Откройте <strong><a href=\"files/schetchiki.ods\" target=\"_blank\" rel=\"noopener\">файл</a></strong> электронной таблицы, содержащей в каждой строке семь натуральных чисел. Определите количество строк таблицы, для чисел которых выполнено условие:</p> <ul> <li>в строке есть два числа, каждое из которых повторяется дважды, а остальные три числа различны</li> </ul>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "183"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetchiki.ods",
           "href": "files/schetchiki.ods",
           "size": "366 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>Откройте <strong><a href=\"files/schetchiki.ods\" target=\"_blank\" rel=\"noopener\">файл</a></strong> электронной таблицы, содержащей в каждой строке семь натуральных чисел. Определите количество строк таблицы, для чисел которых выполнено условие:</p> <ul> <li>в строке есть одно число, которое повторяется в строке трижды, а остальные четыре числа различны</li> </ul>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "69"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetchiki.ods",
           "href": "files/schetchiki.ods",
           "size": "366 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><em><strong>Попробуйте решить задачу самостоятельно, но обязательно посмотрите её разбор на следующем шаге. </strong></em></p> <p><em><strong>В видео рассматривается важный приём </strong></em>😉</p> <p>Откройте <strong><a href=\"files/schetchiki.ods\" target=\"_blank\" rel=\"noopener\">файл</a></strong> электронной таблицы, содержащей в каждой строке семь натуральных чисел. Определите количество строк таблицы, для чисел которых выполнено условие:</p> <ul> <li>среднее арифметическое неповторяющихся чисел строки больше среднего арифметического всех её повторяющихся чисел</li> </ul> <p>Строки, в которых нет повторяющихся или нет неповторяющихся чисел, в ответ брать не нужно.</p> <p><em>Пример: 1, 1, 1, 2, 2, 6, 7.</em></p> <p><em>Среднее арифметическое неповторяющихся: (6 + 7) / 2.</em></p> <p><em>Среднее арифметическое повторяющихся: (1 + 1 + 1 + 2 + 2) / 5.</em></p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "1649"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetchiki.ods",
           "href": "files/schetchiki.ods",
           "size": "366 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>Откройте&nbsp;<strong><a href=\"files/schetchiki.ods\" target=\"_blank\" rel=\"noopener\">файл</a></strong>&nbsp;электронной таблицы, содержащей в каждой строке семь натуральных чисел. Определите количество строк таблицы, для чисел которых выполнено условие:</p> <ul> <li>среднее арифметическое всех повторяющихся чисел строки меньше среднего арифметического всех её чисел</li> </ul> <p>Если повторяющихся чисел в строке нет, то такая строка не подходит под условие задания.&nbsp;</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "1649"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetchiki.ods",
           "href": "files/schetchiki.ods",
           "size": "366 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>Откройте&nbsp;<strong><a href=\"files/schetchiki.ods\" target=\"_blank\" rel=\"noopener\">файл</a></strong>&nbsp;электронной таблицы, содержащей в каждой строке семь натуральных чисел. Определите количество строк таблицы, для чисел которых выполнено условие:</p> <ul> <li>повторяющиеся числа не являются ни максимальными, ни минимальными числами строки</li> </ul> <p><em>Если в строке нет повторяющихся чисел, то такая строка подходит под условие задачи.</em></p> <ul> </ul>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "14807"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "schetchiki.ods",
           "href": "files/schetchiki.ods",
           "size": "366 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>Откройте <strong><a href=\"files/schetchiki.ods\" target=\"_blank\" rel=\"noopener\">файл</a></strong> электронной таблицы, содержащей в каждой строке семь натуральных чисел. Определите количество строк таблицы, для чисел которых выполнено условие:</p> <ul> <li>максимальное число строки не является повторяющимся числом</li> </ul>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "15380"
        ]
       ]
      }
     ]
    },
    {
     "num": "1.12",
     "label": "12",
     "title": "Функции перевода чисел из одной системы счисления в другую",
     "steps": [
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<h2>Содержание урока</h2> <p>В этом уроке вы познакомитесь с функциями <strong>ОСНОВАНИЕ, ДЕС.</strong></p>"
        }
       ]
      },
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<p><strong>Очень важно вам самим повторить все действия, которые выполняет преподаватель в видео на следующих шагах!</strong></p>"
        }
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Переведите число 3452 из десятичной системы счисления в систему счисления с основанием 7.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "13031"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Переведите число 3452 из десятичной системы счисления в систему счисления с основанием 36.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1,
         "txt": 1
        }
       ],
       "answer": [
        [
         "2NW"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Переведите число 10321<sub>5</sub> из пятеричной системы счисления в десятичную систему счисления.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "711"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Переведите число 1ABC<sub>24</sub> из 24 системы счисления в десятичную систему счисления.</p> "
        },
        {
         "t": "details",
         "title": "Подсказка",
         "v": [
          {
           "t": "html",
           "v": " <p> Не забудьте в функции число <code>1ABC</code> взять в кавычки, так как функция принимает в качестве параметра текстовую строку.</p> <p><img src=\"img/imgx.12.7-1.png\" alt=\"\"></p> "
          }
         ]
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "19860"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Найдите наименьшее основание системы счисления, в которой число 876 имеет в своей записи ровно две единицы.</p> "
        },
        {
         "t": "details",
         "title": "Подсказка",
         "v": [
          {
           "t": "html",
           "v": " <p>Можно в столбце с помощью автозаполнения получить различные основания от 2 до 36. Для каждого основания получить число 876 в системе счисления с данным основанием:</p> <p><img src=\"img/imgx.12.8-1.png\" alt=\"\"></p> "
          }
         ]
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "5"
        ]
       ]
      }
     ]
    },
    {
     "num": "1.13",
     "label": "13",
     "title": "Функция ВПР",
     "steps": [
      {
       "type": "text",
       "blocks": [
        {
         "t": "html",
         "v": "<h2>Содержание урока</h2> <p>В этом уроке вы познакомитесь с функцией <strong>ВПР</strong>.</p>"
        }
       ]
      },
      {
       "type": "text",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "vpr1.ods",
           "href": "files/vpr1.ods",
           "size": "28 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p><strong>Очень важно вам самим повторить все действия, которые выполняет преподаватель в видео на следующих шагах!</strong></p> <p>Для этого скачайте <a href=\"files/vpr1.ods\" target=\"_blank\" rel=\"noopener\">файл</a> с электронной таблицей. </p>"
        }
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "file",
         "files": [
          {
           "name": "vpr-neskolko-listov.ods",
           "href": "files/vpr-neskolko-listov.ods",
           "size": "15 КБ"
          }
         ]
        },
        {
         "t": "html",
         "v": "<p>Используя информацию из <strong><a href=\"files/vpr-neskolko-listov.ods\" target=\"_blank\" rel=\"noopener\">файла</a> (</strong>листов: Движение товаров, Товар), с помощью функции<strong> ВПР</strong> получите столбец Наименование товара на листе Движение товаров.</p> <p>С помощью фильтра определите сколько упаковок товара <strong>Яйцо диетическое</strong> было <strong>продано </strong>за всё время.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "148"
        ]
       ]
      }
     ]
    },
    {
     "num": "1.14",
     "label": "14",
     "title": "Решение в электронных таблицах",
     "steps": [
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Укажите наименьшее основание системы счисления, в которой запись числа 68 трёхзначна.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "5"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Укажите через пробел в порядке возрастания все десятичные натуральные числа, не превосходящие 17, запись которых в троичной системе счисления оканчивается на две одинаковые цифры.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1,
         "txt": 1
        }
       ],
       "answer": [
        [
         "4 8 9 13 17"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Число 86 записали в системах счисления с основаниями от 2 до 10 включительно. При каком основании сумма цифр в записи этого числа будет простым числом? Если таких оснований несколько, то укажите максимальное из них.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "4"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>123 записали в системах счисления с основаниями от 2 до 10 включительно. При каких основаниях цифры этого числа образуют возрастающие арифметические прогрессии при чтении слева направо? В ответе укажите сумму всех подходящих оснований.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "17"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Запись десятичного числа в системах счисления с основаниями 3 и 5 в обоих случаях имеет последней цифрой 0. Какое минимальное натуральное десятичное число удовлетворяет этому требованию?</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "15"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Число Y из десятичной системы счисления перевели в системы счисления с основаниями 16, 8 и 2. Часть символов при записи утеряна. Позиции утерянных символов обозначены символом *:</p> "
        },
        {
         "t": "html",
         "v": "<p class=\"formula\">Y = 10******<sub>2</sub> = *4*<sub>8</sub> = *2<sub>16</sub> .</p>"
        },
        {
         "t": "html",
         "v": " <p>В ответ запишите Y в десятичной системе счисления.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "162"
        ]
       ]
      },
      {
       "type": "video",
       "title": "Видеоразбор"
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Значение арифметического выражения: <tt>9<sup>7</sup> + 3<sup>21</sup> – 3<sup>2 </sup></tt> записали в системе счисления с основанием 3. Сколько цифр «2» содержится в этой записи?</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "12"
        ]
       ]
      },
      {
       "type": "fill",
       "blocks": [
        {
         "t": "html",
         "v": "<p>Найдите систему счисления (X), в которой выполняется равенство 21<sub>X</sub> · 13<sub>X</sub> = 313<sub>X</sub>?</p> <p>В ответе укажите число – основание системы счисления.</p>"
        }
       ],
       "fields": [
        {
         "label": "Ответ",
         "n": 1
        }
       ],
       "answer": [
        [
         "6"
        ]
       ]
      }
     ]
    }
   ]
  }
 ]
};
