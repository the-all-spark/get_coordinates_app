window.addEventListener("load", start);

function start() {
    window.localStorage.clear(); // очищаем хранилище

    let applyStylesBtn = document.querySelector(".styleBlock input[type='submit']"); // кнопка формы стилизации

    let sizeLine = document.querySelector(".size-line"); // строка с размерами изображения
    let sizeLineMessage = document.querySelector(".size-line-message");
    
    let pointsBlock = document.querySelector(".points"); // контейнер для вывода координат точек
    let coordStrBlock = document.querySelector(".coord-str"); // контейнер для вывода строки с координатами

    let pointsExample = document.querySelector(".points-example"); // пример вывода точек
    let coordStrExample = document.querySelector(".coord-str-example"); // пример вывода строки координат 

    let finishBtn = document.querySelector(".finish-btn"); // кнопка "Завершить"
    let resetBtn = document.querySelector(".reset-btn"); // кнопка "Обновить"
    let copyBtn = document.querySelector(".copy-btn"); // кнопка копирования строки
    let changeImageBtn = document.querySelector(".change-image-btn"); // кнопка "Загрузить другое изображение"

    let objCoords = {}; // пустой объект для координат
    let number = 0; // начальное значение для имени ключа в объекте
    let coordString; // строка координат

    // * Выделение поля ввода ширины одним кликом
    let forms = document.querySelectorAll(".form");

    for (let i = 0; i < forms.length; i++) {
        let inputFields = forms[i].querySelectorAll('input[type="text"]');
        
        inputFields.forEach((input) => input.addEventListener("click", function(e) { 
            setTimeout(() => { e.target.select(); }, 1);
        }));
    }
    
    // * Вывод координат при клике на кнопку "Завершить" 
    finishBtn.addEventListener("click", function() { prepareToShowCoords(objCoords) });

    // * Сброс данных при клике на кнопку "Обновить"
    resetBtn.addEventListener("click", reset);

    // * Смена изображения при клике на кнопку "Загрузить другое изображение"
    changeImageBtn.addEventListener("click", changeImage);

    // * Кнопка копирования строки координат
    copyBtn.addEventListener("click", function() { copyCoordStr(coordString) });

    // * ---- Загрузка изображения на страницу
    let submitBtn = document.querySelector(".submitting-form button");
    submitBtn.addEventListener("click", submitImage);

    // * функция загрузки изображения на страницу
    function submitImage() {
        console.log("Загрузить изображение");
        let error = document.querySelector('.submit-error');

        let imgFile = file.files[0]; // объект File ( <input type="file" id="file"/> )
        
        // если изображение выбрано через форму =>
        if (imgFile !== undefined) {

            error.style.display = "none";
            document.querySelector(".submitting-form").style.display = "none";

            // создание элемента img на страницу
            let img = document.createElement('img');
            img.setAttribute("id","image");
            img.alt = "Изображение";
            
            // запись данных в хранилище localStorage в формате (ключ, значение)
            img.src = URL.createObjectURL(imgFile); // присваивание URL -> src
            localStorage.setItem("loadedImage", img.src);
            //console.log(localStorage);

            displayImage(img);
        } else {
            // если изображение не выбрано через форму => ошибка
            error.style.display = "block";
        }
    }

    // * Функция отображения изображения на странице
    function displayImage(img) {
        let container = document.querySelector('.photo');
        container.prepend(img);

        // * получение ширины изображения (пользовательского значения)
        let form =  document.querySelector(".submitting-form");

        let imageInput = form.querySelector('[name="widthSize"]');
        let imgWidth = imageInput.value; // введенное значение (или 1000 по умолч.)

        let image = document.querySelector('.photo img');
        image.style.width = `${imgWidth}px`;
        
        // * обработка события после загрузки изображения
        image.addEventListener("load", function() { 
            applyStylesBtn.removeAttribute("disabled");
            showInfo(this);
        }); 
    }

    // * Функция применения стилей к изображению 
    applyStylesBtn.addEventListener("click", applyStyles);

    function applyStyles() {
        console.log("Применить стили к изображению");

        let styleForm = document.querySelector('.styleBlock');

        // * Радио-кнопка
        let boxSizingAll = styleForm.querySelectorAll('[name="boxSizing"]'); // введенное значение (или content-box по умолч.)
        let selectedBoxSizing = getSelectedRadio(boxSizingAll); // определить какой символ выбран
        //console.log(selectedBoxSizing); 

        // функция получения выбранного символа
        function getSelectedRadio(radioArr) {
            for (let i = 0; i < radioArr.length; i++) {
                if (!radioArr[i].checked) continue;
                return radioArr[i].value;
            }
        }

        // * Ширина и цвет рамки
        let borderSize = styleForm.querySelector('[name="borderSize"]').value;
        let borderColor = styleForm.querySelector('[name="borderColor"]').value;
        //console.log(borderSize);
        //console.log(borderColor);

        // * Применение стилей
        let image = document.querySelector('.photo img');
        
        image.style.boxSizing = `${selectedBoxSizing}`;
        image.style.border = `${borderSize}px solid ${borderColor}`;

        document.querySelector(".submit-btn span").style.opacity = 1;
    }

    // * Убрать сообщение при фокусе на поле формы стилизации
    let inputAll = document.querySelectorAll(".styleBlock input");

    inputAll.forEach((input) => input.addEventListener("focus", function() {
        document.querySelector(".submit-btn span").style.opacity = "";
    }));

    // * ---- Получение информации
    function showInfo(loadedImg) {
        console.log("Показать информацию");
        //console.log(loadedImg);

        sizeLineMessage.style.display = "none";
        sizeLine.style.display = "block";

        if (loadedImg.complete) {
            // * изменить размеры изображения


            // * вывести размеры загруженного изображения
            showImageSizes(loadedImg);  
            
            // * получить и сохранить координаты при клике на изображение
            loadedImg.addEventListener("click", getCoords);

            // отобразить кнопку "Загрузить другое изображение"
            changeImageBtn.style.display = "block";
        }
    }

    // функция отображения размеров изображения
    function showImageSizes(image) {
        let wElem = document.querySelector(".width-size");
        let hElem = document.querySelector(".height-size");

        let w = image.clientWidth;
        let h = image.clientHeight;

        //console.log(`ширина: ${w}`);
        //console.log(`высота: ${h}`);

        wElem.append(w);
        hElem.append(h);
    }

    // * функция получения координат: реакция на клик мышки на карте => получение и сохранение координат
    function getCoords(e) {

        // разблокировка кнопки "Обновить"
        if (resetBtn.getAttribute("disabled") === "") {
            resetBtn.removeAttribute("disabled");
        }

        // разблокировка кнопки "Завершить"
        if (finishBtn.getAttribute("disabled") === "") {
            finishBtn.removeAttribute("disabled");
        }

        addClickReaction(e); // отображаем реакцию на клик мышки

        let coords = getPosition(e); // получаем координаты одной точки

        number++;
        objCoords = savePoint(number, coords); // сохраняем координаты под порядковым номером в объекте
        //console.log(objCoords);   
    }

    // * функция отмечает каждую точку клика полупрозрачным кругом с обводкой 20 х 20px
    function addClickReaction(e) {
        let circleMark = document.createElement("div");
        circleMark.className = "circle-mark";

        let diameter = 20;
        circleMark.style.width = diameter + "px";
        circleMark.style.height = diameter + "px";

        // координаты точки клика
        let x = e.pageX;
        let y = e.pageY;

        // через размер кружков рассчитать смещение позиционирования
        let parametersToCorrect = getObjectFromParams(circleMark, diameter, x, y); 
        correctCircleOffset(parametersToCorrect);

        circleMark.style.display = "block";
        document.querySelector(".photo").append(circleMark);
    }

    // функция построения объекта из параметров 
    function getObjectFromParams(circle, diameter, x, y) {
        return {
            circle, 
            diameter, 
            x, 
            y
        }
    }

    // * функция расчета смещения отображения круга в зависимости от его ширины 
    // принимает объект, включающий элемент круга, его диаметр, координаты X и Y клика (деструктурирует его)
    function correctCircleOffset( {circle, diameter, x, y} ) {

        /* вычисляем значения смещения круга с учетом его размеров (например, для круга 20 x 20 px)
            top: calc(430px - 10px); 
            left: calc(323px - 10px); 
        */
        let offset = diameter/2;

        let yPos = y - offset;
        let xPos = x - offset;

        circle.style.top = yPos + "px"; // Y
        circle.style.left = xPos + "px"; // X
    }

    // * функция получения координат точки клика
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

    // * функция подготовки к выводу координат (при клике на "Завершить") 
    // принимает объект массивов точек вида [x,y]
    function prepareToShowCoords(obj) {
        console.log("Вывести координаты"); 
        
        // больше не позволит получать координаты до очистки данных (перезагрузки)
        document.querySelector(".photo img").removeEventListener("click", getCoords);
        
        if (finishBtn.getAttribute("disabled") === null) {
            finishBtn.setAttribute("disabled", ""); // делаем кнопку неактивной
        }

        //скрываем примеры
        pointsExample.style.display = "none"; 
        coordStrExample.style.display = "none";

        changeCircles(obj); // изменяем кружки на более мелкие (точки)

        // * отображаем блок с координатами
        showCoordsBlock(obj);
        
        // * записываем координаты через запятую и отображаем строку
        //let coordString = makeCoordString(obj);
        coordString = makeCoordString(obj);
        showCoordsStr(coordString);
        
        //делаем активной кнопку копирования строки с координатами
        copyBtn.removeAttribute("disabled");

        // выделяем полигон по точкам (координатам)
        highlightPolygon(coordString);
    }

    // * функция изменения размера кружков (принимает массив с координатами точек)
    // принимает объект массивов точек вида [x,y]
    function changeCircles(obj) {

        let circles = document.querySelectorAll(".circle-mark");
        let circlesArr = Array.from(circles);

        let newDiam = 5;

        for (let i = 0; i < circlesArr.length; i++) {
            circlesArr[i].style.width = newDiam + "px";
            circlesArr[i].style.height = newDiam + "px";
            circlesArr[i].style.backgroundColor = "#ffffff";

            let x = obj[i+1][0]; // нумерация точек с 1
            let y = obj[i+1][1];

            let parametersToCorrect = getObjectFromParams(circlesArr[i], newDiam, x, y); 
            correctCircleOffset(parametersToCorrect);
        }
    }

    // * функция записи координат через запятую (после нажатия на кнопку "Завершить")
    // принимает объект массивов точек вида [x,y]
    function makeCoordString(coordinates) {
        let coordStr = "";
        let coordinatesAmount = Object.keys(coordinates).length; // количество свойств в объекте

        for (let point in coordinates) {
            if (point == coordinatesAmount) {
                coordStr += coordinates[point].join(","); // если пара ключ=значение последняя, запятая не ставится
            } else {
                coordStr += coordinates[point].join(",") + ","; 
            }
        }
        return coordStr;       
    }

    // * функция вывода блока с координатами
    // принимает объект массивов точек вида [x,y] и строку с координатами
    function showCoordsBlock(obj) {

        // вывод точек и их координат
        // <span>Точка 1:</span> <span class="coord">x = 228,</span> <span class="coord">y = 788</span>
        for (let number in obj) {
            
            // заголовок с номером точки
            let pointNumSpan = document.createElement("span");
            let pointNum = `Точка ${number}: `;
            pointNumSpan.prepend(pointNum);

            //координата X
            let xSpan = document.createElement("span");
            xSpan.className = "coord";
            let numX = ` x = ${obj[number][0]},`;
            xSpan.innerHTML = numX;

            //координата Y
            let ySpan = document.createElement("span");
            ySpan.className = "coord";
            let numY = ` y = ${obj[number][1]}`;
            ySpan.innerHTML = numY;

            pointsBlock.append(pointNumSpan);
            pointsBlock.append(xSpan);
            pointsBlock.append(ySpan);
            pointsBlock.insertAdjacentHTML("beforeend","</br>");
        }
    }

    // * функция вывода строки с координатами (принимает строку с координатами)
    function showCoordsStr(string) {
        let N = getSymbolLimit(); // лимит символов в строке (в зависимости от ширины экрана)

        coordStrBlock.innerHTML = divideStr(string, N);
        coordStrBlock.style.color = "black"; 
    }

    // * функция определения лимита символов для строки с координатами
    function getSymbolLimit(){
        let symbolAmount;

        if (window.innerWidth < 1480) {
            symbolAmount = 30;
        }
        if (window.innerWidth >= 1480 && window.innerWidth <= 1550) {
            symbolAmount = 60;
        }
        if (window.innerWidth > 1550) {
            symbolAmount = 80;
        }
        return symbolAmount;
    }

    // * функция разбивки строки с координатами
    function divideStr(str, N) {

        let numbersArr = str.trim().split(","); // разрезаем строку на массив чисел через запятую

        let result = []; // массив для отдельных строк
        let currentNumStr = numbersArr.shift(); // кладём первое число в текущую строку

        // цикл по массиву цифр
        for (let number of numbersArr) {
            //если следующее число не укладывается в лимит или текущая строка сама больше лимита
            if (currentNumStr.length + number.length >= N || currentNumStr.length >= N) {
                result.push(currentNumStr); // строка обрывается и записывается в массив
                currentNumStr = number; // начало новой строки
            } else {
                currentNumStr += ',' + number; //добавляем число через запятую к текущей строке
            }
        }

        result.push(currentNumStr); //остатки в текущей строке отправляются на выход
        return result.join(',\n'); // вывод массива строк (в конце строки запятая и перенос на новую строку)
    }

    // * функция копирования строки с координатами (в виде одной строки)
    function copyCoordStr(str) {
        console.log("Скопирована строка координат!");

        copyBtn.classList.add("active"); //выделяет кнопку зеленым
        document.querySelector(".copied-message").style.display = "block"; 
        
        navigator.clipboard.writeText(str);
    }

    // * функция выделения цветом и рамкой полигона по координатам
    function highlightPolygon(str) {
        let svgBlock = document.querySelector(".photo svg");
    
        let polygonElem = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygonElem.setAttribute("points", str);

        svgBlock.append(polygonElem);
        svgBlock.style.display = "block";  
    }

    // * функция сброса данных
    function reset() {
        console.log("Обновить информацию");

        // очищаем блок с точками, строку координат
        pointsBlock.innerHTML = "";
        coordStrBlock.innerHTML = "";

        // делаем неактивной кнопку обновить и завершить
        resetBtn.setAttribute("disabled", "");
        finishBtn.setAttribute("disabled", "");

        // делаем неактивной кнопку копирования, очищаем сообщение и реакцию иконки на копирование 
        copyBtn.setAttribute("disabled", "");
        copyBtn.classList.remove("active"); //удаляет выделение кнопки зеленым
        document.querySelector(".copied-message").style.display = "none"; 

        // очищаем объект с координатами точек
        if (!isEmpty(objCoords)) {
            objCoords = {};
        }
        number = 0;

        deletePolygons();
        removeCircles();
        
        // возвращаем примеры
        pointsExample.style.display = "block";
        coordStrExample.style.display = "block";

        document.querySelector(".photo img").addEventListener("click", getCoords); // возвращаем обработчик события
    }

    // * функция проверки объекта на пустоту
    function isEmpty(obj) {
        for (let key in obj) {
            return false;
        }
        return true;
    }

    // * функция удаления выделенного полигона, скрытие svg
    function deletePolygons() {
        let polygons = document.querySelectorAll(".photo svg polygon");

        if (Array.from(polygons).length > 0) {
            polygons.forEach( (poly) =>  poly.remove() );
        }

        document.querySelector(".photo svg").style.display = "none";
    }

    // * функция удаления кружков выделения точек
    function removeCircles() {
        let circles = document.querySelectorAll(".circle-mark");
        let circlesArr = Array.from(circles);

        circlesArr.forEach( (circle) => circle.remove() );
    }

    // * функция загрузки другого изображения (сброс данных, вывод формы загрузки файла)
    function changeImage() {
        console.log("Заменить изображение");

        window.localStorage.clear();
        reset(); // сброс данных

        changeImageBtn.style.display = "none";

        document.querySelector(".width-size").innerHTML = "";
        document.querySelector(".height-size").innerHTML = "";
        sizeLine.style.display = "none";
        sizeLineMessage.style.display = "block";

        document.querySelector(".photo img").remove();
        document.querySelector(".submitting-form").style.display = "block";
        document.querySelector("#file").value = '';
    }


    // TODO дать возможность корректировать каждую цифру => меняется область выделения

    // TODO очистка хранилища 
    //window.localStorage.clear();
    //console.log(localStorage);

}