window.addEventListener("load", start);

function start() {
    console.log("Координаты арены: 323,430,539,430,538,618,322,618");

    let imageBlock = document.querySelector(".photo img"); // изображение

    let objCoords = {}; // пустой объект с координатами
    let number = 0; // начальное значение для имени ключа

    // * ---- Получить и сохранить координаты при клике на изображение
    imageBlock.addEventListener("click", getCoords);

    function getCoords(e) {
        // ! реакция на клик мышки

        let coords = getPosition(e); // получаем координаты одной точки (вызов функции) 

        number++;
        objCoords = savePoint(number, coords); // сохраняем координаты под порядковым номеров в объекте (вызов функции) 
        //console.log(objCoords);
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








}