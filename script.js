window.addEventListener("load", start);

function start() {
    
    let imageBlock = document.querySelector(".photo img"); // изображение
    
    let pointsBlock = document.querySelector(".points"); // контейнер для вывода координат точек
    let pointsExample = document.querySelector(".points-example"); // пример вывода точек
    let coordStrExample = document.querySelector(".coord-str-example"); // пример вывода строки координат 
    let coordStr = document.querySelector(".coord-str"); // контейнер для вывода строки с координатами

    let finishBtn = document.querySelector(".finish-btn"); // кнопка "Завершить"
    let resetBtn = document.querySelector(".reset-btn"); // кнопка "Обновить"
    let copyBtn = document.querySelector(".copy-btn"); // кнопка копирования строки

    let objCoords = {}; // пустой объект с координатами
    let number = 0; // начальное значение для имени ключа

    // * ---- Вывести размеры загруженного изображения
    //console.log(`ширина: ${imageBlock.clientWidth}`);
    //console.log(`высота: ${imageBlock.clientHeight}`);

    let wElem = document.querySelector(".width-size");
    let hElem = document.querySelector(".height-size");

    let w = imageBlock.clientWidth;
    let h = imageBlock.clientHeight;

    wElem.append(w);
    hElem.append(h);

    // * ---- Получить и сохранить координаты при клике на изображение
    imageBlock.addEventListener("click", getCoords);

    function getCoords(e) {

        // разблокировка кнопки "Завершить"
        if(finishBtn.getAttribute("disabled") === "") {
            finishBtn.removeAttribute("disabled");
        }

        clickReaction(e); // реакция на клик мышки (вызов функции)

        let coords = getPosition(e); // получаем координаты одной точки (вызов функции) 

        number++;
        objCoords = savePoint(number, coords); // сохраняем координаты под порядковым номеров в объекте (вызов функции) 
        //console.log(objCoords);
    }

    // * функция отмечает каждую точку клика полупрозрачным кругом
    function clickReaction(e) {
        let x = e.pageX;
        let y = e.pageY;

        let circleMark = document.createElement("div");
        circleMark.className = "circle-mark";

        // высчитываем значения смещения круга с учетом размеров блока (20 x 20 px)
        // top: calc(430px - 10px); 
        // left: calc(323px - 10px);
        let yPos = y - 10;
        let xPos = x - 10;

        circleMark.style.top = yPos + "px"; // Y
        circleMark.style.left = xPos + "px"; // X
        circleMark.style.display = "block";

        document.querySelector(".photo").append(circleMark);
    }

    // * функция получения координат
    function getPosition(e) {
        let x = e.pageX;
        let y = e.pageY;
        return [x, y];
    }

    // * функция сохранения координат
    function savePoint(number, coordinates) {
        objCoords[number] = coordinates; // имя переменной - порядковый номер, свойство - координаты точки (массив)
        return objCoords;
    }

    // * ----- При клике на кнопку "Завершить" - вывести координаты
    finishBtn.addEventListener("click", prepare);
    
    function prepare() {
        // больше не позволит получать координаты до очистки данных (перезагрузки)
        imageBlock.removeEventListener("click", getCoords); 

        // разблокировка кнопки "Обновить"
        if(resetBtn.getAttribute("disabled") === "") {
            resetBtn.removeAttribute("disabled");
        }

        // убираем кружки
        let circles = document.querySelectorAll(".circle-mark");
        let circlesArr = Array.from(circles);

        for(let i = 0; i < circlesArr.length; i++) {
            circlesArr[i].remove();
        }
        makeString(objCoords); // вызов функции
    }

    // * функция записи координат через запятую (после нажатия на кнопку "Завершить")
    function makeString(obj) {
        //console.log(obj);

        if(finishBtn.getAttribute("disabled") === null) {

            // делаем кнопку неактивной
            finishBtn.setAttribute("disabled", "");
           
            let coordStr = ""; // пустая строка для вывода
            let objLength = Object.keys(obj).length; // количество свойств в объекте

            // перебор свойств объектов
            for (let prop in obj) {
                //console.log(obj[prop]);   // значение
                //console.log(prop);        // ключ

                if (prop == objLength) {
                    coordStr += obj[prop].join(","); // если пара ключ=значение последняя, запятая не ставится
                } else {
                    coordStr += obj[prop].join(",") + ","; 
                }
            }
            showCoords(obj,coordStr);  // вызов функции вывода строки
        }
    }

    // * функция вывода блока информации с координатами (получает объект с точками и строку координат)
    function showCoords(object,string) {

        // вывод точек и их координат
        // <span>Точка 1:</span> <span class="coord">x = 228,</span> <span class="coord">y = 788</span>
        for (let prop in object) {
            
            // заголовок с номером точки
            let pointNumSpan = document.createElement("span");
            let pointNum = `Точка ${prop}: `;
            pointNumSpan.prepend(pointNum);
                //console.log(pointNumSpan);

            //координата X
            let xSpan = document.createElement("span");
            xSpan.className = "coord";
            let numX = ` x = ${object[prop][0]},`;
            xSpan.innerHTML = numX;
                //console.log(xSpan);

            //координата Y
            let ySpan = document.createElement("span");
            ySpan.className = "coord";
            let numY = ` y = ${object[prop][1]}`;
            ySpan.innerHTML = numY;
                //console.log(ySpan);

            //скрываем примеры, соединяем и выводим точки
            pointsExample.style.display = "none";
            coordStrExample.style.display = "none";

            pointsBlock.append(pointNumSpan);
            pointsBlock.append(xSpan);
            pointsBlock.append(ySpan);
            pointsBlock.insertAdjacentHTML("beforeend","</br>");
        }
        
        // вывод строки координат
        let N = 60; // лимит символов в строке //! зависит от ширины выведенного на страницу изображения
        coordStr.innerHTML = divideStr(string,N);
        coordStr.style.color = "black"; 

        //сделать активной кнопку копирования строки с координатами
        copyBtn.removeAttribute("disabled");
        copyBtn.addEventListener("click", function() { copyCoordStr(string) });

        // выделение полигона
        highlightPolygon(string);
    }

    // * функция разбивки строки с координатами
    function divideStr(str,N) {
        //console.log(str);

        let numbersArr = str.trim().split(","); // разрезаем строку на массив чисел через запятую
        //console.log(numbersArr);

        let result = []; // массив для отдельных строк
        let currentNumStr = numbersArr.shift(); // кладём первое число в текущую строку

        // цикл по массиву цифр
        for (let number of numbersArr) {
            //если следующее число не укладывается в лимит или текущая строка сама больше лимита
            if (currentNumStr.length + number.length >= N || currentNumStr.length >= N) {
                result.push(currentNumStr); // строка обрывается и записывается в массив
                currentNumStr = number; // начало новой строки
            } else {
                currentNumStr += ',' + number; //добавляем слово через запятую к текущей строке
            }
        }

        result.push(currentNumStr); //остатки в текущей строке отправляются на выход
        //console.log(result);

        return result.join(',\n'); // вывод массива строк (в конце строки запятая и перенос на новую строку)
    }

    // * функция копирования строки с координатами (в виде одной строки)
    function copyCoordStr(str) {
        document.querySelector(".copy-btn svg path").style.fill = "#1fbc8c";
        document.querySelector(".copied-message").style.display = "block"; 
        
        navigator.clipboard.writeText(str);
    }

    // * функция выделения цветом и рамкой полигона по координатам
    function highlightPolygon(str) {
            //console.log(str);

        let svgBlock = document.querySelector(".photo svg");
       
        let polygonElem = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygonElem.setAttribute("points", str);
            //console.log(polygonElem);

        svgBlock.append(polygonElem);
            //console.log(svgBlock);

        svgBlock.style.display = "block";  
    }

    // * ----- Сброс данных при клике на кнопку "Обновить"
    resetBtn.addEventListener("click", reset);

    function reset() {
        // очищаем блок с точками, строку; делаем неактивной кнопку обновить
        pointsBlock.innerHTML = "";
        coordStr.innerHTML = "";
        resetBtn.setAttribute("disabled", "");

        // удаляем выделенный полигон, скрываем svg
        let poly = document.querySelector(".photo svg polygon");
        poly.remove();
        document.querySelector(".photo svg").style.display = "none";

        // очищаем объект с координатами точек
        objCoords = {}; 
        number = 0;
        
        // возвращаем примеры
        pointsExample.style.display = "block";
        coordStrExample.style.display = "block";

        imageBlock.addEventListener("click", getCoords); // возвращаем обработчик события

        // очищаем сообщение и реакцию иконки на копирование 
        document.querySelector(".copy-btn svg path").style.fill = "#C0C0C0";
        document.querySelector(".copied-message").style.display = "none"; 
        


    }

    // TODO разбивать длинную строку на части
    // TODO дать возможность корректировать каждую цифру => меняется область выделения

    // TODO кнопка обновить должна стать активной после начала клика по точкам


}