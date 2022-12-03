# Fortune-Algorithm

# Глоссарий
Всё, что будет дальше происходить, находится на плоскости.

Что ж, перед тем, как начать разбираться, что это такое — диаграмма Вороного, напомню некоторые понятия нужных нам геометрических объектов (предполагается, однако, что вы уже знакомы с определениями точки, прямой, луча, отрезка, многоугольника, вершины и ребра многоугольника, вектора и интуитивного понятия разбиения плоскости):

Простой многоугольник — это многоугольник без самопересечений. Мы будем рассматривать только простые многоугольники.

Невыпуклый многоугольник — это многоугольник, в котором найдутся такие две вершины, что через них проводится прямая, пересекающая данный многоугольник где-либо ещё, кроме ребра, соединяющего эти вершины, 

Выпуклый многоугольник — это многоугольник, у которого продолжения сторон не пересекают других его сторон.

Именно из выпуклых многоугольников и будет состоять диаграмма.

Раз уж я начал говорить про полуплоскости, то можно плавно перейти и к самой диаграмме — она состоит из так называемых локусов — областей, в которых присутствуют все точки, которые находятся ближе к данной точке, чем ко всем остальным. В диаграмме Вороного локусы являются выпуклыми многоугольниками.

Точку, для которой строится локус, называют сайтом (site)

Алгоритмы построения диаграммы как раз и есть не что иное, как алгоритмы построения этих самых локусов для всех точек из заданного набора. Локусы в данной задаче также называют многоугольниками Вороного или ячейками Вороного.

# Введение
Перед тем, как начать работу над алгоритмом Форчуна, нужно разобраться с тем, что такое диграмма Вороного. Итак, диаграмма Вороного – множество точек на плоскости, которые разбивают эту плоскость, на которой каждая область этого разбиения образует множество точек, более близких к одному из элементов множества, чем к любому другому элементу множества. Именно из выпуклых многоугольников и будет состоять диаграмма.
Для некоторого конечного набора попарно различных точек на плоскости (далее N — количество точек) диаграмма Вороного представляет из себя разбиение плоскости на области — ячейки диаграммы Вороного. Каждая ячейка содержит в себе лишь одну точку исходного набора точек, называемых сайтами диаграммы Вороного. Все точки ячейки находятся ближе к соответствующему сайту, нежели чем к любому другому. Для обычного определения расстояния на плоскости — метрики Евклида (корень квадратный из суммы квадратов разностей координат точек — из теоремы Пифагора) — форма ячеек в общем случае является выпуклым многоугольником. Конечно же существуют крайние случаи, как если в исходном множестве 1 (ячейка — вся плоскость), 2 точки (ячейка — полуплоскость), либо точки (N > 2) находящиеся на одной прямой (в этом случае внутренними ячейками будут полосы, а внешними — полуплоскости). Крайние, из множества ячеек в общем случае, являются частью выпуклых многоугольников с двумя сторонами, уходящими в бесконечность, то есть параллельными, либо расходящимися лучами. Стороны многоугольников ограничивающих ячейки (но при этом не являющимися их частью) — это рёбра диаграммы Вороного. Они могут быть отрезками, лучами, либо прямыми. Каждое ребро — это множество точек, равноудалённых ровно от двух сайтов, то есть лежит на серединном перпендикуляре для двух сайтов. Вершины многоугольников, ограничивающих ячейки, так и называются — вершины диаграммы Вороного. Вершины являются точками, равноудалёнными от трёх и более сайтов, то есть являются центрами описанных окружностей многоугольников, которые можно было бы построить на сайтах примыкающих ячеек, как на вершинах.
Алгоритм Форчуна берёт множество 2D-точек и строит из них диаграмму Вороного. Суть алгоритма в следующем: по плоскости движется заметающая прямая (англ.sweepline). Движется скачками — от точки к точке. Первая часть этих точек — это точки со ввода, которые становятся сайтами. Вторая часть — это "виртуальные" точки, крайние по ходу движения заметающей прямой точки упомянутых описанных окружностей. При движении (параллельном переносе) заметающей прямой она касается любой такой описанной окружности дважды — второй раз эквивалентен событию, при котором диаграмма Вороного достраивается: к ней добавляется вершина, одно или более рёбер оканчиваются этой новой вершиной и одно или два новых ребра выходят из неё.

# История алгоритма Форчуна и диаграммы Вороного
Алгоритм первоначально опубликовал Стивен Форчун в 1986 в своей статье «Алгоритм заметающей прямой для диаграмм Вороного».
Вообще, первое использование диаграммы Вороного встречается в труде Рене Декарта (1596-1650) «Начала философии» (1644). Декарт предложил деление Вселенной на зоны гравитационного влияния звезд. Только спустя два века, известный немецкий математик Иоганн Петер Густав Лежён-Дирихле (1805 — 1859) ввел диаграммы для двух- и трехмерного случаев. Поэтому их иногда называют диаграммами Дирихле. Ну а уже в 1908 году русский математик Георгий Феодосьевич Вороной (16(28) апреля 1868 — 7(20) ноября 1908) описал эту диаграмму для пространств бОльших размерностей, с тех пор диаграмма носит его фамилию. Вот его краткая биография:
Георгий Феодосьевич Вороной родился в деревне Журавка Полтавской губернии (ныне Черниговская область). С 1889 года обучался в Санкт-Петербургском университете у Андрея Маркова. В 1894 году защитил магистерскую диссертацию «О целых числах, зависящих от корня уравнения третьей степени». В том же году был избран профессором Варшавского университета, где изучал цепные дроби. У Вороного обучался Вацлав Серпинский. В 1897 году Вороной защитил докторскую диссертацию «Об одном обобщении алгоритма непрерывных дробей», удостоенную премии имени Буняковского. 

# Применение
## В программировании, разработке игр и картографии
1)  PenaltyForRotation – добавляет к стоимости пути штраф за смену траектории. Позволяет управлять предпочтением длина/кривизна пути. При установке данного параметра следует учитывать, что реальные игроки предпочитают передвигаться преимущественно по прямым траекториям. 
2)  PenaltyMultiplierForCrouch – в сколько раз путь пройденный присев является менее предпочтительным, чем обычный путь. 
3)  PenaltyMultiplierForBadVisibility – в сколько раз проход по плохо проглядываемым участкам менее предпочтителен, чем по обычным. (Формула: длина пути * (1 – Visibility) * PenaltyMultiplierForBadVisibility).
4)  PickRandomPointInCell–стоитливыбиратьслучайнуюточкувнутриклеткиили использовать сайт Вороного как точку пути. Использование данной опции позволяет сделать каждый получаемый путь уникальным и получать немного разные траектории при одинаковом запросе. 
Можно делать различные фильтры-обработчики фото с помощью диаграммы Вороного, получая некую «мозаику».

## В архитектуре и дизайне
Весьма логично, что людям в голову пришла идея использовать диаграмму Вороного в архитектуре и дизайне, поскольку она сама по себе является красивым рисунком, своего рода «геометрической паутиной», так что есть много случаев применения её в качестве одного из основных элементов композиции или даже каркаса всего творения.

## В археологии
В археологии многоугольники Вороного используются для нанесения на карту ареала применения орудия труда в древних культурах и для изучения влияния соперничающих центров торговли.

В экологии возможности организма на выживание зависят от числа соседей, с которыми он должен бороться за пищу и свет.
— что вполне логично, ведь обычно за любое «выживание» бьются именно соседствующие регионы.

•	В моделировании и распознавании
•	В биологии и химии

# Алгоритм
Я рисую диаграммы в HTML-элементе "canvas". К сожалению, у меня не было реализации кучи или приоритетной очереди в JS, поэтому я использовал классический массив. Таким образом, асимптотическая временная сложность равна O(n2)

# Реализация
# Список литературы
