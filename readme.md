# Get Coordinates Application (HTML | CSS | JS)

## О проекте
Приложение позволяет получить координаты точек при клике на изображение (в виде упорядоченного списка и строки) и выделить по ним полигон.

**Инструменты:** 
![image](https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white "Visual Studio Code")

**Языки:** 
![image](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white "HTML") 
![image](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white "CSS") 
![image](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E "JS") 

**Демо:** [Перейти на сайт](https://the-all-spark.github.io/get_coordinates_app/)  
<img src="./assets/app-screenshot-start.jpg" width="400" alt="Скриншот приложение до загрузки изображения">
<img src="./assets/submit_image_screenshot.jpg" width="400" alt="Загрузка изображения, скриншот">
<img src="./assets/click_to_get_coordinates_screenshot.jpg" width="400" alt="Получение координат точек кликов, скриншот">
<img src="./assets/show_coordinates_screenshot.jpg" width="400" alt="Отображение координат точек клика на странице, скриншот">

## Реализованный функционал:
1. загрузка изображения на страницу, помещение его в хранилище localStorage;
2. вывод размеров загруженного изображения;
3. получение координат каждой точки клика; отображение точки клика в виде красного круга;
4. при клике на кнопку "Завершить":
   - вывод координат в блоке в формате "Точка <номер>: x = <значение>, y = <значение>";
   - вывод координат в виде строки "x,y" (при клике на кнопку "Завершить");
   - выделение полигона рамкой и цветом заливки по координатам (создание элемента `<polygon>` с атрибутом `points` и его значением - строкой координат);
7. копирование строки с координатами при клике на иконку "Скопировать" (отображается надпись "Скопировано!");
8. сброс координат и удаление выделения полигона при клике на кнопку "Обновить";
9. смена изображения при клике на кнопку "Загрузить другое изображение".