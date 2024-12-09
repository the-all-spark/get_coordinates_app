window.addEventListener("load", start);

function start() {
    window.localStorage.clear(); // очищаем хранилище

    let sizeLine = document.querySelector(".size-line"); // строка с размерами изображения
    let sizeLineMessage = document.querySelector(".size-line-message");
    
    let pointsBlock = document.querySelector(".points"); // контейнер для вывода координат точек
    let coordStr = document.querySelector(".coord-str"); // контейнер для вывода строки с координатами

    let pointsExample = document.querySelector(".points-example"); // пример вывода точек
    let coordStrExample = document.querySelector(".coord-str-example"); // пример вывода строки координат 

    let finishBtn = document.querySelector(".finish-btn"); // кнопка "Завершить"
    let resetBtn = document.querySelector(".reset-btn"); // кнопка "Обновить"
    let copyBtn = document.querySelector(".copy-btn"); // кнопка копирования строки
    let changeImageBtn = document.querySelector(".change-image-btn"); // кнопка "Загрузить другое изображение"

    let objCoords = {}; // пустой объект с координатами
    let number = 0; // начальное значение для имени ключа в объекте

    // * ---- Загрузка изображения на страницу
    let submitBtn = document.querySelector(".submitting-form button");
    submitBtn.addEventListener("click", submitImage);

    function submitImage() {
        console.log("Загрузить изображение");

        let error = document.querySelector('.submit-error');

        let imgFile = file.files[0]; // объект File ( <input type="file" id="file"/> )
        
        // если изображение выбрано =>
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
            // если изображение не выбрано -> ошибка
            error.style.display = "block";
        }
    }

    // Функция отображения изображения на странице
    function displayImage(img) {
        let container = document.querySelector('.photo');
        container.prepend(img);

        let image = document.querySelector('.photo img');

        // * обработка события после загрузки изображения
        image.addEventListener("load", function() { getInfo(this) } ); 
    }

    // * ---- Получение информации (выполнение последующего кода) только после того, как загружено изображение
    function getInfo(loadedImg) {
        console.log("Показать информацию");

        // * Отобразить кнопку "Загрузить другое изображение"
        changeImageBtn.style.display = "block";
        changeImageBtn.addEventListener("click", changeImage);

        // * ---- Вывести размеры загруженного изображения
        //console.log(`ширина: ${imageBlock.clientWidth}`);
        //console.log(`высота: ${imageBlock.clientHeight}`);

        if(loadedImg.complete) {
            //console.log(loadedImg.complete); // true если изображение загружено

            let wElem = document.querySelector(".width-size");
            let hElem = document.querySelector(".height-size");

            let w = loadedImg.clientWidth;
            let h = loadedImg.clientHeight;

            wElem.append(w);
            hElem.append(h);
        }
        sizeLine.style.display = "block";
        sizeLineMessage.style.display = "none";

        // * ---- Получить и сохранить координаты при клике на изображение
        loadedImg.addEventListener("click", getCoords);

        // * ----- При клике на кнопку "Завершить" вывести координаты
        finishBtn.addEventListener("click", function() { prepare(objCoords) });

        // * ----- Сброс данных при клике на кнопку "Обновить"
        resetBtn.addEventListener("click", reset);

    }

    // * функция получения координат: реакция на клик мышки, получение и сохранение координат
    function getCoords(e) {

        // разблокировка кнопки "Обновить"
        if(resetBtn.getAttribute("disabled") === "") {
            resetBtn.removeAttribute("disabled");
        }

        // разблокировка кнопки "Завершить"
        if(finishBtn.getAttribute("disabled") === "") {
            finishBtn.removeAttribute("disabled");
        }

        // точки кликов отмечаем большими кружками 20 х 20px
        let diameter = 20;
        addClickReaction(e,diameter); // реакция на клик мышки (вызов функции)

        let coords = getPosition(e); // получаем координаты одной точки (вызов функции) 

        number++;
        objCoords = savePoint(number, coords); // сохраняем координаты под порядковым номеров в объекте (вызов функции) 
        //console.log(objCoords);   
    }

    // * функция отмечает каждую точку клика полупрозрачным кругом с обводкой
    function addClickReaction(e,diameter) {
        let circleMark = document.createElement("div");
        circleMark.className = "circle-mark";

        let x = e.pageX;
        let y = e.pageY;

        // через размер кружков рассчитать смещение позиционирования
        correctCircleOffset(circleMark,diameter,x,y);

        circleMark.style.display = "block";
        document.querySelector(".photo").append(circleMark);
    }

    // * функция расчета смещения отображения круга в зависимости от его ширины 
    // принимает элемент круга, его диаметр, координаты X и Y клика
    function correctCircleOffset(circle,diameter,x,y) {
            //console.log(diameter);
            //console.log(x);
            //console.log(y);

        circle.style.width = diameter + "px";
        circle.style.height = diameter + "px";

        /* вычисляем значения смещения круга с учетом его размеров (например, для круга 20 x 20 px)
            top: calc(430px - 10px); 
            left: calc(323px - 10px); */
        let offset = diameter/2;

        let yPos = y - offset;
        let xPos = x - offset;

        circle.style.top = yPos + "px"; // Y
        circle.style.left = xPos + "px"; // X
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

    // * функция подготовки к выводу координат (при клике на "Завершить") 
    function prepare(obj) {
        //console.log(obj);
        
        // больше не позволит получать координаты до очистки данных (перезагрузки)
        document.querySelector(".photo img").removeEventListener("click", getCoords); 

        changeCircles(obj); // изменяем кружки на более мелкие (точки)
        makeString(obj); // записываем координаты через запятую
        
    }

    // * функция изменения размера кружков (принимает массив с координатами точек)
    function changeCircles(obj) {

        let circles = document.querySelectorAll(".circle-mark");
        let circlesArr = Array.from(circles);

        let newDiam = 5;

        for(let i = 0; i < circlesArr.length; i++) {
            let x = obj[i+1][0]; 
            let y = obj[i+1][1];

            correctCircleOffset(circlesArr[i],newDiam,x,y); // вызов функции
            circlesArr[i].style.backgroundColor = "#ffffff";
        }
        
    }

    // * функция записи координат через запятую (после нажатия на кнопку "Завершить")
    function makeString(obj) {

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
        let N = 60; // лимит символов в строке //! должно зависеть от ширины выведенного на страницу изображения
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
        copyBtn.classList.add("active"); //выделяет кнопку зеленым
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

    // * функция сброса данных
    function reset() {
        // очищаем блок с точками, строку; делаем неактивной кнопку обновить и завершить
        pointsBlock.innerHTML = "";
        coordStr.innerHTML = "";
        resetBtn.setAttribute("disabled", "");
        finishBtn.setAttribute("disabled", "");

        // делаем неактивной кнопку копирования, очищаем сообщение и реакцию иконки на копирование 
        copyBtn.setAttribute("disabled", "");
        copyBtn.classList.remove("active"); //удаляет выделение кнопки зеленым
        document.querySelector(".copied-message").style.display = "none"; 

        // удаляем выделенный полигон, скрываем svg, если объект отмечен. Иначе - удаляем точки выделения
        let poly = document.querySelector(".photo svg polygon");
        if(poly) {
            poly.remove();
            document.querySelector(".photo svg").style.display = "none";
            removeCircles();
        } else {
            removeCircles();
        }
        
        // очищаем объект с координатами точек
        objCoords = {};
        number = 0;
        
        // возвращаем примеры
        pointsExample.style.display = "block";
        coordStrExample.style.display = "block";

        document.querySelector(".photo img").addEventListener("click", getCoords); // возвращаем обработчик события

        // очищаем сообщение и реакцию иконки на копирование 
        document.querySelector(".copied-message").style.display = "none"; 
        
        // * функция удаления кружков выделения точек
        function removeCircles() {
            let circles = document.querySelectorAll(".circle-mark");
            let circlesArr = Array.from(circles);

            for(let i = 0; i < circlesArr.length; i++) {
                circlesArr[i].remove();
            }
        }
    }

    // * функция загрузки другого изображения (сброс данных, вывод формы загрузки файла)
    function changeImage() {
        console.log("Замена изображения");
        reset(); // сброс данных

        changeImageBtn.style.display = "none";

        document.querySelector(".width-size").innerHTML = "";
        document.querySelector(".height-size").innerHTML = "";
        sizeLine.style.display = "none";
        sizeLineMessage.style.display = "block";

        document.querySelector(".photo img").remove();
        document.querySelector(".submitting-form").style.display = "block";
    }


    // TODO дать возможность корректировать каждую цифру => меняется область выделения

    // TODO очистка хранилища 
    //window.localStorage.clear();
    //console.log(localStorage);

}