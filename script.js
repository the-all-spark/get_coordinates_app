window.addEventListener("load", start);

function start() {
    console.log("Координаты арены: 323,430,539,430,538,618,322,618");

    let imageBlock = document.querySelector(".photo img"); // изображение
    let finishBtn = document.querySelector(".finish-btn"); // кнопка "Завершить"

    let objCoords = {}; // пустой объект с координатами
    let number = 0; // начальное значение для имени ключа

    // * ---- Получить и сохранить координаты при клике на изображение
    imageBlock.addEventListener("click", getCoords);

    function getCoords(e) {
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

    // * ----- При клике на кнопку "Завершить" - выводим координаты (вызов функции) 
    // TODO запретить клик на кнопку если координат меньше 3х
    finishBtn.addEventListener("click", prepare);
    
    function prepare() {
        // больше не позволит получать координаты до // TODO  очистки данных (перезагрузки)
        imageBlock.removeEventListener("click", getCoords); 

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
        
        if(finishBtn.style.cursor !== "not-allowed") {
            // делаем кнопку неактивной, меняем цвет при наведении на кнопку
            finishBtn.setAttribute("disabled", "");
            finishBtn.style.cursor = "not-allowed"; // ! поменять на обычный при обновлении данных
            finishBtn.onmouseover = function() {
                finishBtn.style.backgroundColor = "rgba(239, 239, 239, 0.3)";
            };

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
            
        }
    }





    



}