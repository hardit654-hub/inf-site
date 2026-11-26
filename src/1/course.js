/* Данные раздела № 1. Собирается скриптом src/1/build1.py */
window.COURSE = {
 "id": "ege-inf",
 "title": "ЕГЭ по информатике",
 "section": {
  "num": 1,
  "title": "№ 1 Графы, таблицы дорог",
  "lessons": [
   {
    "num": "2.1",
    "title": "Теория графов",
    "steps": [
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<h2 style=\"text-align: center;\">Содержание урока</h2> <p>В этом уроке мы изучим основные теоретические сведения по теории графов.</p>"
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
        "v": "<h2 style=\"text-align: center;\">Термины по теории графов</h2> <p>📝 <strong>Граф</strong> — совокупность вершин и рёбер.</p> <p>📝 <strong>Взвешенный граф</strong> — граф, в котором каждое ребро имеет вес (числовое значение).</p> <p>📝 <strong>Ориентированный граф</strong> — граф, в котором каждое ребро имеет направление.</p> <p>📝 <strong>Степень вершины графа</strong> — это количество выходящих из неё (или, что то же самое, входящих в неё) рёбер.</p> <p>📝 <strong>Петля</strong> — ребро графа, исходящее из вершины и возвращающееся в ту же вершину.</p> <p>📝 <strong>Матрица смежности</strong> — это вид представления графа в виде матрицы, в которой, если на пересечении строки, соответствующей одной вершине, и столбца, соответствующего второй вершине, стоит отметка, то она означает наличие ребра между этими двумя вершинами.</p> <p>📝 <strong>Весовая матрица</strong> — это вид представления графа в виде матрицы, в которой, если на пересечении строки, соответствующей одной вершине, и столбца, соответствующего второй вершине, стоит число (вес), то оно означает наличие ребра данного веса между этими двумя вершинами.</p>"
       }
      ]
     },
     {
      "type": "text",
      "blocks": []
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<h3>Постройте матрицу смежности для графа:</h3> <p> <img class=\"fig-source\" alt=\"\" height=\"198\" name=\"image.png\" src=\"img/img2.1.5-1.png\" width=\"219\"></p>"
       }
      ],
      "fields": [
       {
        "label": "Матрица",
        "n": 1,
        "txt": 1
       }
      ],
      "answer": [
       [
        "0 11 13 0 0 0 0; 11 0 0 14 0 0 0; 13 0 0 0 0 12 0; 0 14 0 0 10 0 0; 0 0 0 10 0 15 0; 0 0 12 0 15 0 9; 0 0 0 0 0 9 0"
       ]
      ]
     }
    ]
   },
   {
    "num": "2.2",
    "title": "Сопоставление схемы и таблицы",
    "steps": [
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<h2 style=\"text-align: center;\">Содержание урока</h2> <p>В этом уроке мы изучим основные приёмы, необходимые для решения № 1.</p>"
       }
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p><em><strong>Попробуйте решить задачу самостоятельно, а после обязательно посмотрите её разбор на следующем шаге </strong></em>😉</p> <p>На рисунке справа схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о длинах этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"197\" name=\"image.png\" src=\"img/img2.2.2-1.png\" width=\"617\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова длина дороги из пункта Е в пункт В.</p> <p style=\"text-align:right;\"></p>"
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
        "20"
       ]
      ]
     },
     {
      "type": "video",
      "title": "Разбор: как сопоставить схему и таблицу"
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<h2 style=\"text-align: center;\">Конспект по № 1</h2> <h3><strong>Решим задачу:</strong></h3> <table style=\"width: 100%;\"> <tbody> <tr> <td> <p><em>На рисунке справа схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о длинах этих дорог (в километрах).</em></p> <p><img class=\"fig-source\" alt=\"\" height=\"168\" name=\"image.png\" src=\"img/img2.2.4-1.png\" width=\"526\"></p> <p><em>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова длина дороги из пункта В в пункт Е.</em></p> </td> </tr> </tbody> </table> <h3><strong>Решение:</strong></h3> <p>Проставим в матрице смежности и на графе степени вершин – количество дорог, которые выходят из каждого города.</p> <p><img class=\"fig-source\" alt=\"\" height=\"156\" name=\"image.png\" src=\"img/img2.2.4-2.png\" width=\"527\"></p> <p><strong>1. </strong>Чтобы найти длину дороги из пункта В в пункт Е, нужно найти номера городов В и Е в таблице.</p> <ul> <li>Заметим, что город В – <strong>единственный </strong>город, из которого выходит <strong>пять </strong>дорог. Ищем такой город в таблице. Это город П6. Значит, город В – это город П6.</li> <li>Заметим, что город Е – <strong>единственный </strong>город, из которого выходит <strong>четыре </strong>дороги. Ищем такой город в таблице. Это город П4. Значит, город Е – это город П4.</li> </ul> <p><strong>2. </strong>Чтобы найти длину дороги между городами В и Е, смотрим на ячейку в таблице, находящуюся на пересечение городов П6 и П4. Получаем длину дороги ВЕ — 20.</p> <p><img class=\"fig-source\" alt=\"\" height=\"156\" name=\"image.png\" src=\"img/img2.2.4-3.png\" width=\"527\"></p> <h3><strong>Ответ:</strong> 20.</h3>"
       }
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке справа схема дорог <em>N</em>-ского района изображена в виде графа, в таблице содержатся сведения о длинах этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"227\" name=\"image.png\" src=\"img/img2.2.5-1.png\" width=\"657\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова длина дороги из пункта Е в пункт Г.<br> В ответе запишите целое число – так, как оно указано в таблице.</p> <p style=\"text-align:right;\"></p>"
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
        "40"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке справа схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о длинах этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"194\" name=\"image.png\" src=\"img/img2.2.6-1.png\" width=\"605\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова длина дороги из пункта Г в пункт В.</p> "
       },
       {
        "t": "details",
        "title": "Решение",
        "v": [
         {
          "t": "html",
          "v": " <p>Заметим, что из городов В и Г выходит по четыре дороги. Эти два города являются единственными городами, из которых выходит по четыре дороги. Значит этим городам соответствуют города П2 и П3. По условии задачи нам нужна дорога между городами В и Г. То есть между городами П2 и П3. Ищем длину этой дороги в таблице – 8.</p>  "
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
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p><em><strong>Попробуйте решить задачу самостоятельно, а после обязательно посмотрите её разбор на следующем шаге </strong></em>😉</p> <p>На рисунке справа схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о длинах этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"187\" name=\"image.png\" src=\"img/img2.2.7-1.png\" width=\"578\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите длину дороги из пункта В в пункт Б.</p> <p style=\"text-align:right;\"></p>"
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
      "title": "Разбор: длина дороги между двумя пунктами"
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке справа схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о длинах этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"217\" name=\"image.png\" src=\"img/img2.2.9-1.png\" width=\"617\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите длину дороги из пункта Е в пункт Б.</p> <p style=\"text-align:right;\"></p>"
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
        "t": "html",
        "v": "<p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"245\" name=\"image.png\" src=\"img/img2.2.10-1.png\" width=\"733\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова протяжённость дороги из пункта Д в пункт Г.<br> В ответе запишите целое число – так, как оно указано в таблице.</p> <p style=\"text-align:right;\"></p>"
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
        "9"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"274\" name=\"image.png\" src=\"img/img2.2.11-1.png\" width=\"739\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова протяжённость дороги из пункта Ж в пункт Г.<br> В ответе запишите целое число – так, как оно указано в таблице.</p> <p style=\"text-align:right;\"></p>"
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
        "9"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке справа схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о длинах этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"222\" name=\"image.png\" src=\"img/img2.2.12-1.png\" width=\"584\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова длина дороги из пункта Е в пункт В.</p> <p style=\"text-align:right;\"></p>"
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
        "36"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p><em><strong>Попробуйте решить задачу самостоятельно, а после обязательно посмотрите её разбор на следующем шаге </strong></em>😉</p> <p>На рисунке справа схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о длинах этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"189\" name=\"image.png\" src=\"img/img2.2.13-1.png\" width=\"592\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите длину кратчайшего пути из пункта Е в пункт В. <br> В ответе запишите целое число – количество километров.</p> <p style=\"text-align:right;\"></p>"
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
        "25"
       ]
      ]
     },
     {
      "type": "video",
      "title": "Разбор: кратчайший путь"
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке справа схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о длинах этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"205\" name=\"image.png\" src=\"img/img2.2.15-1.png\" width=\"576\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите длину кратчайшего пути из пункта Е в пункт В.</p> <p style=\"text-align:right;\"></p>"
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
        "20"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке слева схема дорог N-ского района, в таблице звёздочкой\nобозначено наличие дороги из одного населённого пункта в другой. Отсутствие\nзвёздочки означает, что такой дороги нет.</p>\n<div style=\"display:flex;gap:28px;align-items:center;flex-wrap:wrap\"><div class=\"tw\"><table class=\"fig\"><tr><td style=\"border:none\"></td><td>П1</td><td>П2</td><td>П3</td><td>П4</td><td>П5</td><td>П6</td></tr><tr><td>П1</td><td style=\"background:#8e8e93;\"></td><td>*</td><td>*</td><td></td><td>*</td><td></td></tr><tr><td>П2</td><td>*</td><td style=\"background:#8e8e93;\"></td><td>*</td><td></td><td>*</td><td></td></tr><tr><td>П3</td><td>*</td><td>*</td><td style=\"background:#8e8e93;\"></td><td></td><td>*</td><td>*</td></tr><tr><td>П4</td><td></td><td></td><td></td><td style=\"background:#8e8e93;\"></td><td>*</td><td></td></tr><tr><td>П5</td><td>*</td><td>*</td><td>*</td><td>*</td><td style=\"background:#8e8e93;\"></td><td>*</td></tr><tr><td>П6</td><td></td><td></td><td>*</td><td></td><td>*</td><td style=\"background:#8e8e93;\"></td></tr></table></div><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"34 -26 482 364\" width=\"492\" style=\"max-width:100%;height:auto\" role=\"img\"><line x1=\"110\" y1=\"30\" x2=\"280\" y2=\"10\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"110\" y1=\"30\" x2=\"110\" y2=\"290\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"280\" y1=\"10\" x2=\"110\" y2=\"290\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"280\" y1=\"10\" x2=\"290\" y2=\"160\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"110\" y1=\"30\" x2=\"290\" y2=\"160\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"110\" y1=\"290\" x2=\"290\" y2=\"160\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"290\" y1=\"160\" x2=\"450\" y2=\"70\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"290\" y1=\"160\" x2=\"450\" y2=\"250\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"110\" y1=\"290\" x2=\"450\" y2=\"250\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><circle cx=\"110\" cy=\"30\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"280\" cy=\"10\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"110\" cy=\"290\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"290\" cy=\"160\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"450\" cy=\"70\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"450\" cy=\"250\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><rect x=\"85.55\" y=\"-9.68\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"96\" y=\"4\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">А</text><rect x=\"271.55\" y=\"-3.6799999999999997\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"282\" y=\"10\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Б</text><rect x=\"83.55\" y=\"294.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"94\" y=\"308\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Е</text><rect x=\"291.55\" y=\"124.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"302\" y=\"138\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Г</text><rect x=\"425.55\" y=\"60.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"436\" y=\"74\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Ж</text><rect x=\"445.55\" y=\"254.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"456\" y=\"268\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Д</text></svg></div>\n<p>Определите, какие номера населённых пунктов в таблице могут соответствовать\nнаселённым пунктам Б и Е на схеме. В ответе запишите эти два номера в\nвозрастающем порядке без пробелов и знаков препинания.</p>"
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
        "56"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке слева схема дорог N-ского района, в таблице звёздочкой\nобозначено наличие дороги из одного населённого пункта в другой. Отсутствие\nзвёздочки означает, что такой дороги нет.</p>\n<div style=\"display:flex;gap:28px;align-items:center;flex-wrap:wrap\"><div class=\"tw\"><table class=\"fig\"><tr><td style=\"border:none\"></td><td>П1</td><td>П2</td><td>П3</td><td>П4</td><td>П5</td><td>П6</td><td>П7</td></tr><tr><td>П1</td><td style=\"background:#8e8e93;\"></td><td>*</td><td>*</td><td></td><td></td><td></td><td></td></tr><tr><td>П2</td><td>*</td><td style=\"background:#8e8e93;\"></td><td>*</td><td>*</td><td></td><td></td><td></td></tr><tr><td>П3</td><td>*</td><td>*</td><td style=\"background:#8e8e93;\"></td><td></td><td></td><td>*</td><td></td></tr><tr><td>П4</td><td></td><td>*</td><td></td><td style=\"background:#8e8e93;\"></td><td>*</td><td></td><td></td></tr><tr><td>П5</td><td></td><td></td><td></td><td>*</td><td style=\"background:#8e8e93;\"></td><td>*</td><td>*</td></tr><tr><td>П6</td><td></td><td></td><td>*</td><td></td><td>*</td><td style=\"background:#8e8e93;\"></td><td>*</td></tr><tr><td>П7</td><td></td><td></td><td></td><td></td><td>*</td><td>*</td><td style=\"background:#8e8e93;\"></td></tr></table></div><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-38 -18 614 288\" width=\"626\" style=\"max-width:100%;height:auto\" role=\"img\"><line x1=\"40\" y1=\"130\" x2=\"150\" y2=\"40\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"40\" y1=\"130\" x2=\"150\" y2=\"220\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"150\" y1=\"40\" x2=\"150\" y2=\"220\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"150\" y1=\"40\" x2=\"260\" y2=\"130\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"260\" y1=\"130\" x2=\"380\" y2=\"40\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"150\" y1=\"220\" x2=\"380\" y2=\"220\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"380\" y1=\"40\" x2=\"380\" y2=\"220\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"380\" y1=\"40\" x2=\"510\" y2=\"130\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"380\" y1=\"220\" x2=\"510\" y2=\"130\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><circle cx=\"40\" cy=\"130\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"150\" cy=\"40\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"150\" cy=\"220\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"260\" cy=\"130\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"380\" cy=\"40\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"380\" cy=\"220\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"510\" cy=\"130\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><rect x=\"11.549999999999999\" y=\"116.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"22\" y=\"130\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Б</text><rect x=\"129.55\" y=\"-1.6799999999999997\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"140\" y=\"12\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">А</text><rect x=\"131.55\" y=\"226.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"142\" y=\"240\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">В</text><rect x=\"249.55\" y=\"134.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"260\" y=\"148\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Г</text><rect x=\"361.55\" y=\"-1.6799999999999997\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"372\" y=\"12\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Д</text><rect x=\"361.55\" y=\"226.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"372\" y=\"240\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Е</text><rect x=\"505.55\" y=\"116.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"516\" y=\"130\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Ж</text></svg></div>\n<p>Определите, какие номера населённых пунктов в таблице могут соответствовать\nнаселённым пунктам В и Е на схеме. В ответе запишите эти два номера в\nвозрастающем порядке без пробелов и знаков препинания.</p>"
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
        "46"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке изображена схема дорог N-ского района. В таблице звёздочкой\nобозначено наличие дороги из одного населённого пункта в другой. Отсутствие\nзвёздочки означает, что такой дороги нет.</p>\n<div style=\"display:flex;gap:28px;align-items:center;flex-wrap:wrap\"><div class=\"tw\"><table class=\"fig\"><tr><td colspan=\"2\" style=\"border:none\"></td><td>П1</td><td>П2</td><td>П3</td><td>П4</td><td>П5</td><td>П6</td><td>П7</td></tr><tr><td rowspan=\"7\" style=\"border:none;writing-mode:vertical-rl;transform:rotate(180deg);background:none\"></td><td>E</td><td style=\"background:#8e8e93;\"></td><td></td><td></td><td></td><td></td><td>*</td><td></td></tr><tr><td>F</td><td></td><td style=\"background:#8e8e93;\"></td><td>*</td><td>*</td><td>*</td><td></td><td></td></tr><tr><td>C</td><td></td><td>*</td><td style=\"background:#8e8e93;\"></td><td></td><td>*</td><td>*</td><td></td></tr><tr><td>D</td><td></td><td>*</td><td></td><td style=\"background:#8e8e93;\"></td><td>*</td><td>*</td><td></td></tr><tr><td>B</td><td></td><td>*</td><td>*</td><td>*</td><td style=\"background:#8e8e93;\"></td><td>*</td><td></td></tr><tr><td>A</td><td>*</td><td></td><td>*</td><td>*</td><td>*</td><td style=\"background:#8e8e93;\"></td><td>*</td></tr><tr><td>G</td><td></td><td></td><td></td><td></td><td></td><td>*</td><td style=\"background:#8e8e93;\"></td></tr></table></div><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-12 -28 520 348\" width=\"530\" style=\"max-width:100%;height:auto\" role=\"img\"><line x1=\"200\" y1=\"30\" x2=\"210\" y2=\"120\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"200\" y1=\"30\" x2=\"330\" y2=\"230\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"200\" y1=\"30\" x2=\"440\" y2=\"70\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"210\" y1=\"120\" x2=\"330\" y2=\"120\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"330\" y1=\"120\" x2=\"440\" y2=\"70\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"330\" y1=\"120\" x2=\"330\" y2=\"230\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"330\" y1=\"120\" x2=\"210\" y2=\"260\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"330\" y1=\"120\" x2=\"60\" y2=\"40\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"440\" y1=\"70\" x2=\"330\" y2=\"230\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"440\" y1=\"70\" x2=\"210\" y2=\"120\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><circle cx=\"60\" cy=\"40\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"200\" cy=\"30\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"330\" cy=\"120\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"210\" cy=\"120\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"440\" cy=\"70\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"330\" cy=\"230\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"210\" cy=\"260\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><rect x=\"37.55\" y=\"-3.6799999999999997\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"48\" y=\"10\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">E</text><rect x=\"189.55\" y=\"-11.68\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"200\" y=\"2\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">F</text><rect x=\"331.55\" y=\"82.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"342\" y=\"96\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">A</text><rect x=\"201.55\" y=\"132.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"212\" y=\"146\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">D</text><rect x=\"437.55\" y=\"32.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"448\" y=\"46\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">B</text><rect x=\"311.55\" y=\"248.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"322\" y=\"262\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">C</text><rect x=\"185.55\" y=\"276.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"196\" y=\"290\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">G</text></svg></div>\n<p>Каждому населённому пункту на схеме соответствует его номер в таблице, но\nнеизвестно, какой именно номер. Определите, какие номера в таблице могут\nсоответствовать населённым пунктам E и F на схеме. В ответе запишите эти два\nномера в возрастающем порядке без пробелов и знаков препинания.</p>"
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
        "35"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке изображена схема дорог N-ского района, в таблице звёздочкой\nобозначено наличие дороги из одного населённого пункта в другой. Отсутствие\nзвёздочки означает, что такой дороги нет.</p>\n<div style=\"display:flex;gap:28px;align-items:center;flex-wrap:wrap\"><div class=\"tw\"><table class=\"fig\"><tr><td colspan=\"2\" style=\"border:none\"></td><td>П1</td><td>П2</td><td>П3</td><td>П4</td><td>П5</td><td>П6</td><td>П7</td></tr><tr><td rowspan=\"7\" style=\"border:none;writing-mode:vertical-rl;transform:rotate(180deg);background:none\"></td><td>A</td><td style=\"background:#8e8e93;\"></td><td></td><td>*</td><td>*</td><td></td><td></td><td>*</td></tr><tr><td>G</td><td></td><td style=\"background:#8e8e93;\"></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>C</td><td>*</td><td></td><td style=\"background:#8e8e93;\"></td><td></td><td></td><td></td><td>*</td></tr><tr><td>D</td><td>*</td><td></td><td></td><td style=\"background:#8e8e93;\"></td><td>*</td><td>*</td><td></td></tr><tr><td>B</td><td></td><td></td><td></td><td>*</td><td style=\"background:#8e8e93;\"></td><td></td><td>*</td></tr><tr><td>F</td><td></td><td></td><td></td><td>*</td><td></td><td style=\"background:#8e8e93;\"></td><td></td></tr><tr><td>E</td><td>*</td><td></td><td>*</td><td></td><td>*</td><td></td><td style=\"background:#8e8e93;\"></td></tr></table></div><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-14 -20 550 442\" width=\"561\" style=\"max-width:100%;height:auto\" role=\"img\"><line x1=\"60\" y1=\"40\" x2=\"70\" y2=\"360\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"60\" y1=\"40\" x2=\"90\" y2=\"210\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"70\" y1=\"360\" x2=\"260\" y2=\"290\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"70\" y1=\"360\" x2=\"390\" y2=\"210\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"260\" y1=\"290\" x2=\"470\" y2=\"350\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"470\" y1=\"350\" x2=\"90\" y2=\"210\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"470\" y1=\"350\" x2=\"60\" y2=\"40\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><circle cx=\"60\" cy=\"40\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"240\" cy=\"150\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"90\" cy=\"210\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"70\" cy=\"360\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"260\" cy=\"290\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"390\" cy=\"210\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"470\" cy=\"350\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><rect x=\"35.55\" y=\"-3.6799999999999997\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"46\" y=\"10\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">A</text><rect x=\"235.55\" y=\"118.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"246\" y=\"132\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">G</text><rect x=\"61.55\" y=\"226.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"72\" y=\"240\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">C</text><rect x=\"47.55\" y=\"378.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"58\" y=\"392\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">D</text><rect x=\"241.55\" y=\"308.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"252\" y=\"322\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">B</text><rect x=\"387.55\" y=\"172.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"398\" y=\"186\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">F</text><rect x=\"465.55\" y=\"366.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"476\" y=\"380\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">E</text></svg></div>\n<p>Каждому населённому пункту на схеме соответствует его номер в таблице, но\nнеизвестно, какой именно номер. Определите, какие номера населённых пунктов в\nтаблице могут соответствовать населённым пунктам B и E на схеме. В ответе\nзапишите эти два номера в возрастающем порядке без пробелов и знаков\nпрепинания.</p>"
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
        "26"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог изображена в виде графа, в таблице звёздочками\nобозначено наличие дороги между населёнными пунктами.</p>\n<div style=\"display:flex;gap:28px;align-items:center;flex-wrap:wrap\"><div class=\"tw\"><table class=\"fig\"><tr><td style=\"border:none\"></td><td>П1</td><td>П2</td><td>П3</td><td>П4</td><td>П5</td><td>П6</td><td>П7</td><td>П8</td></tr><tr><td>П1</td><td style=\"background:#8e8e93;\"></td><td>*</td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>П2</td><td>*</td><td style=\"background:#8e8e93;\"></td><td>*</td><td></td><td></td><td></td><td></td><td>*</td></tr><tr><td>П3</td><td></td><td>*</td><td style=\"background:#8e8e93;\"></td><td>*</td><td>*</td><td>*</td><td>*</td><td></td></tr><tr><td>П4</td><td></td><td></td><td>*</td><td style=\"background:#8e8e93;\"></td><td></td><td></td><td></td><td>*</td></tr><tr><td>П5</td><td></td><td></td><td>*</td><td></td><td style=\"background:#8e8e93;\"></td><td></td><td></td><td>*</td></tr><tr><td>П6</td><td></td><td></td><td>*</td><td></td><td></td><td style=\"background:#8e8e93;\"></td><td></td><td></td></tr><tr><td>П7</td><td></td><td></td><td>*</td><td></td><td></td><td></td><td style=\"background:#8e8e93;\"></td><td>*</td></tr><tr><td>П8</td><td></td><td>*</td><td></td><td>*</td><td>*</td><td></td><td>*</td><td style=\"background:#8e8e93;\"></td></tr></table></div><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-26 -24 652 384\" width=\"665\" style=\"max-width:100%;height:auto\" role=\"img\"><line x1=\"50\" y1=\"170\" x2=\"180\" y2=\"30\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"180\" y1=\"30\" x2=\"300\" y2=\"160\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"180\" y1=\"30\" x2=\"180\" y2=\"300\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"300\" y1=\"160\" x2=\"560\" y2=\"200\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"300\" y1=\"160\" x2=\"420\" y2=\"280\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"300\" y1=\"160\" x2=\"420\" y2=\"60\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"300\" y1=\"160\" x2=\"470\" y2=\"160\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"420\" y1=\"280\" x2=\"180\" y2=\"300\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"420\" y1=\"60\" x2=\"180\" y2=\"300\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><line x1=\"180\" y1=\"300\" x2=\"560\" y2=\"200\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><circle cx=\"50\" cy=\"170\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"180\" cy=\"30\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"300\" cy=\"160\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"180\" cy=\"300\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"420\" cy=\"60\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"470\" cy=\"160\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"420\" cy=\"280\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><circle cx=\"560\" cy=\"200\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><rect x=\"23.549999999999997\" y=\"136.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"34\" y=\"150\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Е</text><rect x=\"177.55\" y=\"-7.68\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"188\" y=\"6\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">А</text><rect x=\"299.55\" y=\"124.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"310\" y=\"138\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Г</text><rect x=\"175.55\" y=\"316.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"186\" y=\"330\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">И</text><rect x=\"401.55\" y=\"32.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"412\" y=\"46\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Ж</text><rect x=\"465.55\" y=\"116.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"476\" y=\"130\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Б</text><rect x=\"393.55\" y=\"286.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"404\" y=\"300\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">Д</text><rect x=\"555.55\" y=\"206.32\" width=\"20.900000000000002\" height=\"25.080000000000002\" fill=\"var(--bg, #fff)\"/><text x=\"566\" y=\"220\" font-size=\"19\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"currentColor\" style=\"stroke:none\">В</text></svg></div>\n<p>Так как таблицу и схему рисовали независимо друг от друга, нумерация\nнаселённых пунктов в таблице никак не связана с буквенными обозначениями на\nграфе. Выпишите последовательно без пробелов и знаков препинания указанные на\nграфе буквенные обозначения пунктов от П1 до П8: сначала букву,\nсоответствующую П1, затем букву, соответствующую П2, и т. д.</p>"
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
        "БИЕВЖДАГ"
       ]
      ]
     }
    ]
   },
   {
    "num": "2.3",
    "title": "Супер алгоритм для устного решения",
    "steps": [
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<h2>Как решать задачи о таблицах дорог</h2>\n      <p>В задачах о таблицах дорог почти всегда есть «подозрительный» пункт.\n      С него и нужно начинать.</p>\n      <ol>\n        <li><b>Считаем число дорог</b> (степень). Ищем пункт, у которого дорог\n        больше всех или меньше всех, — так его легко найти в таблице.</li>\n        <li><b>Ищем пункт с известным окружением.</b> В условии часто сказано,\n        с какими пунктами он связан. Таких пунктов в схеме немного.</li>\n        <li><b>Сравниваем соседей.</b> Если у пункта 5 дорог, а в таблице есть\n        ровно одно такое значение — номер найден.</li>\n      </ol>\n      <p>Порядок действий простой: нашли пункт в схеме — нашли его номер в\n      таблице — вычёркиваем найденные пары — переходим к следующему.</p>"
       }
      ]
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<h2>Пример: пункт с пятью дорогами</h2>\n      <p>В таблице звёздочками отмечены дороги. Считаем звёздочки по строкам:</p>\n      <ul>\n        <li>строка П1 — 5 звёздочек;</li>\n        <li>строка П2 — 4;</li>\n        <li>строки П3, П4, П6, П7 — по 3;</li>\n        <li>строки П5, П8 — по 2.</li>\n      </ul>\n      <p>На схеме тоже ровно один пункт, из которого выходят 5 дорог. Значит,\n      П1 — этот пункт. Дальше смотрим, с кем он связан: его соседи по таблице\n      должны совпасть с соседями пункта на схеме.</p>\n      <p>Так вычёркивается пара за парой, и в конце остаются все номера.</p>"
       }
      ]
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог N-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"220\" name=\"image.png\" src=\"img/img2.3.3-1.png\" width=\"615\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта F в пункт G и из пункта С в пункт В.<br> В ответе запишите целое число.</p>"
       }
      ]
     },
     {
      "type": "video",
      "title": "Разбор: сумма двух дорог"
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог N-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"238\" src=\"img/img2.3.5-1.png\" width=\"594\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта E в пункт G и из пункта F в пункт H.</p> <p>В ответе запишите целое число.</p>"
       }
      ]
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог N-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах). </p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"358\" name=\"image.png\" src=\"img/img2.3.6-1.png\" width=\"752\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта G в пункт A и из пункта D в пункт E.</p> <p>В ответе запишите целое число.</p>"
       }
      ]
     },
     {
      "type": "video",
      "title": "Разбор: ещё одна задача"
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог N-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"251\" name=\"image.png\" src=\"img/img2.3.8-1.png\" width=\"698\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта B в пункт C и из пункта А в пункт Н.<br> В ответе запишите целое число.</p>"
       }
      ]
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог N-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"239\" name=\"image.png\" src=\"img/img2.3.9-1.png\" width=\"650\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта D в пункт E и из пункта G в пункт D. <br> В ответе запишите целое число.</p>"
       }
      ]
     },
     {
      "type": "video",
      "title": "Разбор: звёздочки в таблице"
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<p>В таблице содержатся сведения о дорогах между населёнными пунктами (звёздочка означает, что дорога между соответствующими городами есть). На рисунке справа та же схема дорог изображена в виде графа.</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"383\" name=\"image.png\" src=\"img/img2.3.11-1.png\" width=\"654\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите номера населённых пунктов В и Б в таблице.</p> <p>В ответе напишите два числа без разделителей: сначала для пункта Б, затем для пункта В.</p>"
       }
      ]
     }
    ]
   },
   {
    "num": "2.4",
    "title": "Стандартные задачи",
    "steps": [
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<h2 style=\"text-align: center;\">Содержание урока</h2> <p>В этом уроке мы продолжим изучать приёмы, необходимые для решения № 1.</p>"
       }
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p><em><strong>Попробуйте решить задачу самостоятельно, а после обязательно посмотрите её разбор на следующем шаге </strong></em>😉</p> <p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"218\" name=\"image.png\" src=\"img/img2.4.2-1.png\" width=\"584\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта D в пункт H и из пункта A в пункт B.</p> <p>В ответе запишите целое число.</p>"
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
        "18"
       ]
      ]
     },
     {
      "type": "video",
      "title": "Разбор: стандартная задача"
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p><em><strong>Попробуйте решить задачу самостоятельно, а после обязательно посмотрите её разбор на следующем шаге </strong></em>😉</p> <p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"260\" name=\"image.png\" src=\"img/img2.4.4-1.png\" width=\"781\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта B в пункт D и из пункта A в пункт E.</p> <p>В ответе запишите целое число.</p>"
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
        "92"
       ]
      ]
     },
     {
      "type": "video",
      "title": "Разбор: стандартная задача"
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"230\" name=\"image.png\" src=\"img/img2.4.6-1.png\" width=\"684\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта B в пункт D и из пункта F в пункт A.</p> <p>В ответе запишите целое число.</p> "
       },
       {
        "t": "details",
        "title": "Видеоразбор",
        "v": [
         {
          "t": "html",
          "v": " <p><a href=\"https://rutube.ru/video/f309de47cad216efa33c35b6590de8c9/?r=wd&amp;t=37\">https://rutube.ru/video/f309de47cad216efa33c35b6590de8c9/?r=wd&amp;t=37</a></p> <p style=\"text-align:center;\"><iframe></iframe></p> <p style=\"text-align:right;\"></p> "
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
        "58"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"211\" name=\"image.png\" src=\"img/img2.4.7-1.png\" width=\"623\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта D в пункт A и из пункта G в пункт C.</p> <p>В ответе запишите целое число.</p> "
       },
       {
        "t": "details",
        "title": "Видеоразбор",
        "v": [
         {
          "t": "html",
          "v": " <p><a href=\"https://rutube.ru/video/4867e8f7b9a2fe68fca002084a7ef3cf/?r=wd&amp;t=12\">https://rutube.ru/video/4867e8f7b9a2fe68fca002084a7ef3cf/?r=wd&amp;t=12</a></p> <p style=\"text-align:center;\"><iframe></iframe></p> <p style=\"text-align:right;\"></p> "
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
        "66"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"272\" name=\"image.png\" src=\"img/img2.4.8-1.png\" width=\"684\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак<br> не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта <em>B</em> в пункт <em>F</em> и из пункта <em>E</em> в пункт <em>C</em>.</p> <p>В ответе запишите целое число.</p>"
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
        "74"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"267\" name=\"image.png\" src=\"img/img2.4.9-1.png\" width=\"629\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта D в пункт C и из пункта E в пункт G.</p> <p>В ответе запишите целое число.</p>"
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
        "65"
       ]
      ]
     }
    ]
   },
   {
    "num": "2.5",
    "title": "Симметричные графы, графы без длин дорог",
    "steps": [
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<h2 style=\"text-align: center;\">Содержание урока</h2> <p>В этом уроке мы научимся решать № 1 с симметричным графом и № 1 с дорогами с неизвестной длиной. </p>"
       }
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p><em><strong>Попробуйте решить задачу самостоятельно, а после обязательно посмотрите её разбор на следующем шаге </strong></em>😉</p> <p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"240\" name=\"image.png\" src=\"img/img2.5.2-1.png\" width=\"554\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова протяжённость дороги из пункта Д в пункт Е. В ответе запишите целое число – так, как оно указано в таблице.</p>"
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
        "7"
       ]
      ]
     },
     {
      "type": "video",
      "title": "Разбор: граф без длин дорог"
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог N-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"233\" name=\"image.png\" src=\"img/img2.5.4-1.png\" width=\"600\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта В в пункт Б и из пункта Г в пункт Д.</p> <p>В ответе запишите целое число. </p>"
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
        "20"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог <em>N</em>-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"211\" name=\"image.png\" src=\"img/img2.5.5-1.png\" width=\"618\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта Б в пункт А и из пункта Д в пункт Е.</p> <p>В ответе запишите целое число.</p>"
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
        "v": "<p><em><strong>Попробуйте решить задачу самостоятельно, а после обязательно посмотрите её разбор на следующем шаге </strong></em>😉</p> <p>В таблице содержатся сведения о дорогах между населёнными пунктами (звёздочка означает, что дорога между соответствующими городами есть). На рисунке справа та же схема дорог изображена в виде графа.</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"235\" name=\"image.png\" src=\"img/img2.5.6-1.png\" width=\"630\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите номера населённых пунктов В и Б в таблице. В ответе напишите два числа без разделителей: сначала для пункта Б, затем для пункта В.</p>"
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
      "title": "Разбор: номера пунктов по таблице"
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>В таблице содержатся сведения о дорогах между населёнными пунктами (звёздочка означает, что дорога между соответствующими городами есть). На рисунке справа та же схема дорог изображена в виде графа.</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"272\" name=\"image.png\" src=\"img/img2.5.8-1.png\" width=\"637\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите номера населённых пунктов В и Ж в таблице. В ответе напишите два числа без разделителей: сначала для пункта Ж, затем для пункта В.</p>"
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
        "36"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке слева изображена схема дорог Н-ского района, в таблице звёздочкой обозначено наличие дороги из одного населённого пункта в другой. Отсутствие звёздочки означает, что такой дороги нет.</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"237\" name=\"image.png\" src=\"img/img2.5.9-1.png\" width=\"639\"></p> <p>Каждому населённому пункту на схеме соответствует его номер в таблице, но неизвестно, какой именно номер. Определите, какие номера населённых пунктов в таблице могут соответствовать населённым пунктам F и B на схеме. В ответе запишите эти два номера в возрастающем порядке без пробелов и знаков препинания.</p>"
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
        "24"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке слева изображена схема дорог N-ского района. В таблице звёздочкой обозначено наличие дороги из одного населённого пункта в другой. Отсутствие звёздочки означает, что такой дороги нет.</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"295\" name=\"image.png\" src=\"img/img2.5.10-1.png\" width=\"742\"></p> <p>Каждому населённому пункту на схеме соответствует его номер в таблице, но неизвестно, какой именно номер. Определите, какие номера населённых пунктов в таблице могут соответствовать населённым пунктам E и G на схеме. В ответе запишите эти два номера в возрастающем порядке без пробелов и знаков препинания.</p>"
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
        "45"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке слева изображена схема дорог Н-ского района, в таблице звёздочкой обозначено наличие дороги из одного населённого пункта в другой. Отсутствие звёздочки означает, что такой дороги нет.</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"219\" name=\"image.png\" src=\"img/img2.5.11-1.png\" width=\"584\"></p> <p>Каждому населённому пункту на схеме соответствует его номер в таблице, но неизвестно, какой именно номер. Определите, какие номера населённых пунктов в таблице могут соответствовать населённым пунктам D и A на схеме. В ответе запишите эти два номера в возрастающем порядке без пробелов и знаков препинания.</p>"
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
        "35"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о длине этих дорог в километрах.</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"222\" name=\"image.png\" src=\"img/img2.5.12-1.png\" width=\"578\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите длину более короткой из дорог БА и АВ. В ответе запишите целое число.</p>"
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
     }
    ]
   },
   {
    "num": "2.6",
    "title": "Решение в Python",
    "steps": [
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<h2 style=\"text-align:center;\">Содержание урока</h2> <p>В этом уроке мы научимся решать № 1 с помощью программирования.</p> <p><strong>Зачем решать № 1 кодом?</strong></p> <ol> <li>Чтобы проверить себя. Можно решить устно, решить кодом и сравнить полученные ответы.</li> <li>Решать кодом № 1 очень просто. Наверняка, кто-то выберет основным именно программный способ.</li> </ol> <p><strong>Решать кодом № 1 сложно?</strong><br> Нет, легко! Можно просто выучить шаблон. К тому же можно запросто понять как он работает. Этот способ реально лёгкий.</p>  <table style=\"width:100%;\"> <tbody> <tr> <td> <p><strong>❗ На данный момент в курсе мы ещё не изучили Python. Вернитесь к этому уроку, когда его изучите.</strong></p> <p>Чтобы понять решение № 1 в Python нужно знать</p> <ul> <li>Списки</li> <li>Списочные выражение</li> <li>split()</li> <li>replace()</li> </ul> </td> </tr> </tbody> </table>"
       }
      ]
     },
     {
      "type": "video",
      "title": "Как решать задачу в Python"
     },
     {
      "type": "video",
      "title": "Разбор программы"
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<h2 style=\"text-align:center;\">Шаблон решения № 1 в Python</h2> "
       },
       {
        "t": "code",
        "v": "from itertools import * print('1 2 3 4 ...') for per in permutations(): g =  t =  for i in range(): g = g.replace(per[i], str(i + 1)) if {s[0]: set(s[1:]) for s in g.split()} == {s[0]: set(s[1:]) for s in t.split()}: print(*per)"
       },
       {
        "t": "html",
        "v": " <p>Для решения любого задания № 1 с реальных ЕГЭ прошлых лет, можно написать данный код, заполнить пропуски и получить ответ на задание.</p> <p>На наш взгляд, данный код решит задание с <strong>реального экзамена текущего года</strong> с вероятностью 98%.<br> Могут возникнуть трудности, если поменяется формулировка задания или если будет больше девяти городов.</p> <h2 style=\"text-align:center;\">Пример использования шаблона</h2> <h3 style=\"text-align:center;\">Условие </h3> <table style=\"width:100%;\"> <tbody> <tr> <td> <p>На рисунке справа схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о длинах этих дорог (в километрах).</p> <p><img class=\"fig-source\" alt=\"\" height=\"154\" name=\"image.png\" src=\"img/img2.6.6-1.png\" width=\"487\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова длина дороги из пункта В в пункт Д.</p> </td> </tr> </tbody> </table> <h3 style=\"text-align:center;\">Решение</h3> "
       },
       {
        "t": "code",
        "v": "from itertools import * print('1 2 3 4 5 6') for per in permutations('абвгде'): g = 'абв багв вабгд гбвд дгве ед' t = '1256 2145 34 4235 51246 615' for i in range(6): g = g.replace(per[i], str(i + 1)) if {s[0]: set(s[1:]) for s in g.split()} == {s[0]: set(s[1:]) for s in t.split()}: print(*per)"
       },
       {
        "t": "html",
        "v": " <p> Программа выводит</p> "
       },
       {
        "t": "code",
        "v": "1 2 3 4 5 6 б г е д в а"
       },
       {
        "t": "html",
        "v": " <p>Это значит, что пункту 1 соответствует Б, пункту 2 соответствует Г...<br> Нам нужна длина дороги ВД, то есть длина дороги между пунктами 4 и 5. Смотрим в таблицу, получаем ответ – 5.</p> <h3 style=\"text-align:center;\">Пояснения по написанию кода</h3> <p><img class=\"fig-source\" alt=\"\" height=\"173\" name=\"image.png\" src=\"img/img2.6.6-1.png\" width=\"547\"></p> <p><strong>1. Переписываем граф</strong><br> Для каждого города из графа указываем его соседей. <code>g = 'а... б... в... г... д... е...'</code> Вместо троеточий записываем соседей данного города.</p> <p>В данном случае из города <code>а</code> идут дороги в города <code>б</code> и <code>в</code> – поэтому получается <code><strong>а</strong>бв</code>. Из города <code>б</code> идут дороги в города <code>а</code>, <code>г</code> и <code>в</code> – <code><strong>б</strong>агв</code>. Аналогично записываем остальные города.</p> "
       },
       {
        "t": "code",
        "v": "g = 'абв багв вабгд гбвд дгве ед'"
       },
       {
        "t": "html",
        "v": "  <p><strong>2.</strong> <strong>Переписываем таблицу</strong><br> Для каждого города из таблицы указываем его соседей. <code>t = '1... 2... 3... 4... 5... 6...'</code> Вместо троеточий записываем соседей данного города.</p> <p>В данном случае из города <code>1</code> идут дороги в города <code>2</code>, <code>5</code> и <code>6</code> – поэтому получается <code><strong>1</strong>256</code>. Из города <code>2</code> идут дороги в города <code>1</code>, <code>4</code> и <code>5</code> – <code><strong>2</strong>145</code>. Аналогично записываем остальные города.</p> "
       },
       {
        "t": "code",
        "v": "t = '1256 2145 34 4235 51246 615'"
       },
       {
        "t": "html",
        "v": "  <p><strong>3. Заполняем оставшиеся пропуски</strong></p> <ul> <li><code>print('1 2 3 4 5 6')</code> – выводим числа от 1 до 6, так как в этой задаче всего 6 городов.</li> <li><code>for per in permutations('абвгде'):</code> – Записываем строку с <strong>буквенными </strong>обозначениями всех городов.</li> <li><code>for i in range(6):</code> – Ставим число 6, так как в данной задаче всего 6 городов.</li> </ul> <p>Полный код</p> "
       },
       {
        "t": "code",
        "v": "from itertools import * print('1 2 3 4 5 6') # Выводим числа от 1 до 6, так как всего 6 городов for per in permutations('абвгде'): # Указываем используемые города g = 'абв багв вабгд гбвд дгве ед' t = '1256 2145 34 4235 51246 615' for i in range(6): # Ставим число 6, так как в данной задаче всего 6 городов g = g.replace(per[i], str(i + 1)) if {s[0]: set(s[1:]) for s in g.split()} == {s[0]: set(s[1:]) for s in t.split()}: print(*per)"
       }
      ]
     },
     {
      "type": "video",
      "title": "Разбор программы"
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<h2 style=\"text-align:center;\">Наш предыдущий способ решения № 1 кодом</h2> <p>Если Вы уже выучили наш старый код для решения № 1, то используйте его. Не нужно переучиваться на новую версию кода.<br> Именно для Вас мы оставили данный конспект.</p> <p>Всем остальным рекомендуем пропустить данный материал.</p> <h3 style=\"text-align:center;\">Видеоразбор</h3> <p><iframe></iframe></p> <p>Если видео не грузится, то можно посмотреть его</p> <ul> <li><a href=\"https://youtu.be/9MeuO8eR55Y\">В ютубе</a></li> <li><a href=\"https://vk.com/video-205997912_456239189\">В ВК</a></li> </ul> <h3 style=\"text-align:center;\">Шаблон решения № 1 в Python</h3> "
       },
       {
        "t": "code",
        "v": "from itertools import * table = 'Выписываем дороги цифрами' graph = 'Выписываем дороги буквами' for per in permutations('Выписываем все города буквами'): new_graph = table for i in range(1, 'Указываем количество городов + 1'): new_graph = new_graph.replace(str(i), per[i-1]) if set(graph.split()) == set(new_graph.split()): print('1 2 3 4 5 6') print(*per)"
       },
       {
        "t": "html",
        "v": " <h3 style=\"text-align:center;\">Пример использования шаблона</h3> <table style=\"width:100%;\"> <tbody> <tr> <td> <p>На рисунке справа схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о длинах этих дорог (в километрах).</p> <p><img class=\"fig-source\" alt=\"\" height=\"154\" name=\"image.png\" src=\"img/img2.6.6-1.png\" width=\"487\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова длина дороги из пункта В в пункт Д.</p> </td> </tr> </tbody> </table> <h3 style=\"text-align:center;\">Решение</h3> "
       },
       {
        "t": "code",
        "v": "from itertools import * table = '12 15 16 21 24 25 34 42 43 45 51 52 54 56 61 65' graph = 'аб ба ав ва бв вб бг гб гд дг де ед вд дв вг гв' for per in permutations('абвгде'): new_graph = table for i in range(1, 7): new_graph = new_graph.replace(str(i), per[i-1]) if set(graph.split()) == set(new_graph.split()): print('1 2 3 4 5 6') print(*per)"
       },
       {
        "t": "html",
        "v": " <p> Программа выводит</p> "
       },
       {
        "t": "code",
        "v": "1 2 3 4 5 6 б г е д в а"
       },
       {
        "t": "html",
        "v": " <p>Это значит, что пункту 1 соответствует Б, пункту 2 соответствует Г...</p> <p>Нам нужна длина дороги ВД, то есть длина дороги между пунктами 5 и 4. Смотрим в таблицу, получаем ответ – 5.</p>"
       }
      ]
     }
    ]
   },
   {
    "num": "2.7",
    "title": "Тренировка",
    "steps": [
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"285\" name=\"image.png\" src=\"img/img2.7.1-1.png\" width=\"796\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта А в пункты В и Б.<br> В ответе запишите целое число</p>"
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
        "28"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог N-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"236\" name=\"image.png\" src=\"img/img2.7.2-1.png\" width=\"618\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта В в пункт Е и из пункта Б в пункт Д.</p> <p>В ответе запишите целое число.</p>"
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
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"246\" name=\"image.png\" src=\"img/img2.7.3-1.png\" width=\"766\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта Д в пункты Е и Г.<br> В ответе запишите целое число.</p>"
       }
      ]
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог N-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"234\" name=\"image.png\" src=\"img/img2.7.4-1.png\" width=\"599\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта A в пункт B и из пункта E в пункт F.<br> В ответе запишите целое число</p>"
       }
      ]
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке изображена схема дорог <em>N</em>-ского района, в таблице звёздочкой обозначено наличие дороги из одного населённого пункта в другой. Отсутствие звёздочки означает, что такой дороги нет.</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"248\" name=\"image.png\" src=\"img/img2.7.5-1.png\" width=\"626\"></p> <p>Каждому населённому пункту на схеме соответствует номер в таблице, но неизвестно, какой именно номер. Определите, какие номера в таблице могут соответствовать населённым пунктам G и A на схеме. В ответе запишите эти два номера в возрастающем порядке без пробелов и знаков препинания.</p>"
       }
      ]
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"215\" name=\"image.png\" src=\"img/img2.7.6-1.png\" width=\"696\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта Г в пункты Е и Д. В ответе запишите целое число.</p>"
       }
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах). Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе.</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"226\" name=\"image.png\" src=\"img/img2.7.7-1.png\" width=\"482\"></p> <p>Определите сумму протяженностей дорог из пункта пункта A в пункт Е и из пункта B в пункт H.<br> В ответе запишите целое число.</p>"
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
        "38"
       ]
      ]
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<h2>Как быстро сопоставить таблицу и схему</h2>\n      <ol>\n        <li><b>Считаем дороги.</b> У каждого пункта таблицы считаем число\n        известных дорог (для таблиц со звёздочками — число звёздочек в строке).</li>\n        <li><b>Ищем одинокий пункт.</b> Сравниваем: на схеме есть пункт, у\n        которого число дорог встречается только у него — он и находится первым.</li>\n        <li><b>Различаем похожие.</b> Если у двух пунктов одинаковое число дорог,\n        смотрим, как связаны их соседи, — это и разводит пары.</li>\n        <li><b>Считаем сумму.</b> Когда номера пунктов найдены, берём нужные\n        значения из таблицы.</li>\n      </ol>\n      <p>Это весь метод: степени, окружение, сравнение соседей.</p>"
       }
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке схема дорог Н-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"221\" name=\"image.png\" src=\"img/img2.7.9-1.png\" width=\"781\"></p>  <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова протяжённость дороги из пункта К в пункт Д.<br> В ответе запишите целое число – так, как оно указано в таблице.</p>"
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
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>На рисунке справа схема дорог Н-ского района изображена в виде графа, звёздочка в ячейке таблицы обозначает наличие дороги между двумя пунктами. Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе.</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"218\" name=\"image.png\" src=\"img/img2.7.10-1.png\" width=\"512\"></p> <p>Определите сумму протяженностей дорог из пункта D в пункт B и из пункта C в пункт A. В ответе запишите целое число.</p>"
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
        "v": "<p>На рисунке схема дорог N-ского района изображена в виде графа, в таблице содержатся сведения о протяжённости каждой из этих дорог (в километрах).</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"219\" name=\"image.png\" src=\"img/img2.7.11-1.png\" width=\"600\"></p> <p>Так как таблицу и схему рисовали независимо друг от друга, то нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Определите, какова сумма протяжённостей дорог из пункта G в пункт C и из пункта B в пункт H.</p> <p>В ответе запишите целое число.</p>"
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
        "t": "html",
        "v": "<p>(СтатГрад) На рисунке схема дорог изображена в виде графа, в таблице звёздочками обозначено наличие дороги между населёнными пунктами. Так как таблицу и схему рисовали независимо друг от друга, нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Выпишите последовательно без пробелов и знаков препинания указанные на графе буквенные обозначения пунктов от П1 до П8: сначала букву, соответствующую П1, затем букву, соответствующую П2, и т. д.</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"253\" name=\"image.png\" src=\"img/img2.7.12-1.png\" width=\"624\"></p> "
       },
       {
        "t": "details",
        "title": "Видеоразбор",
        "v": [
         {
          "t": "html",
          "v": " <p> <a href=\"https://youtu.be/GoUlzv4t2e8?t=196\">https://youtu.be/GoUlzv4t2e8?t=196</a></p> <p> <a href=\"https://vk.com/video-205997912_456239216\">https://vk.com/video-205997912_456239216</a></p>  "
         }
        ]
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
        "ДАЕВГБЖИ"
       ]
      ]
     },
     {
      "type": "fill",
      "blocks": [
       {
        "t": "html",
        "v": "<p>(СтатГрад) На рисунке схема дорог изображена в виде графа, в таблице звёздочками обозначено наличие дороги между населёнными пунктами. Так как таблицу и схему рисовали независимо друг от друга, нумерация населённых пунктов в таблице никак не связана с буквенными обозначениями на графе. Выпишите последовательно без пробелов и знаков препинания указанные на графе буквенные обозначения пунктов от П1 до П9: сначала букву, соответствующую П1, затем букву, соответствующую П2, и т. д.</p> <p style=\"text-align:center;\"><img class=\"fig-source\" alt=\"\" height=\"262\" name=\"image.png\" src=\"img/img2.7.13-1.png\" width=\"678\"></p>  "
       },
       {
        "t": "details",
        "title": "Видеоразбор",
        "v": [
         {
          "t": "html",
          "v": " <p> <a href=\"https://www.youtube.com/live/BzVI_V02CQU?si=kDa_pon_Vn4N51Wj&amp;t=207\">https://www.youtube.com/live/BzVI_V02CQU?si=kDa_pon_Vn4N51Wj&amp;t=207</a></p> <p> <a href=\"https://vk.com/video-205997912_456239208\">https://vk.com/video-205997912_456239208</a></p> "
         }
        ]
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
        "БЖКИДАЕГВ"
       ]
      ]
     },
     {
      "type": "text",
      "blocks": [
       {
        "t": "html",
        "v": "<h1 style=\"text-align: center;\">Ещё больше задач для тренировки</h1> <p>Ссылка на это видео в рутуб: <a href=\"https://rutube.ru/video/a65a2cd8ba16a22439121b5369d42697/?r=wd\">https://rutube.ru/video/a65a2cd8ba16a22439121b5369d42697/?r=wd</a>.</p> <p style=\"text-align: center;\"><iframe></iframe></p>"
       }
      ]
     }
    ]
   }
  ]
 }
};
