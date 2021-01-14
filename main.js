var timeSpawn = 0;
var video = document.getElementById('video');

var drops = [];
var dropsSpawn = [];


function startGame () {
    var timeGame = 0;
    let indexDrop = 0;
    var timerGame = function timerGame() {
        if ( timeSpawn === 40 && drops.length < 5 ) {
            let widthDisplay = document.getElementById('displays').clientWidth;
            let widthWindow = document.documentElement.clientWidth - widthDisplay;
            let formulaMin = 0;
            let formulaMax = 10;
            let sumbolOne = Math.floor(Math.random() * (formulaMax - formulaMin + 1)) + formulaMin;
            let sumbolTwo = Math.floor(Math.random() * (formulaMax - formulaMin + 1)) + formulaMin;;
            let sumbol = '';
            let produce;
            let formulaSumbol = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
            switch (formulaSumbol) {
                case 1:
                    sumbol = '-';
                    break;
                case 2:
                    sumbol = '+';
                    break;
                case 3:
                    sumbol = '*';
                    break;
                case 4:
                    sumbol = '/';
                    break;
                default:
                    return false;
            }
            produce = Number.parseInt(sumbolOne + sumbol + sumbolTwo);
            let posXmin = 30;
            let posXmax = widthWindow - widthDisplay;
            let pos = Math.round(Math.random() * (posXmax - posXmin) + posXmin);
            timeSpawn = 0;
            drops.push({positionY: 0, positionX: pos, result: produce, status: true, id: indexDrop});

            // Create Element
                dropsSpawn[indexDrop]= document.createElement('div');
                dropsSpawn[indexDrop].className = "drop";
                dropsSpawn[indexDrop].style.left = drops[indexDrop].positionX + 'px';
                dropsSpawn[indexDrop].style.top = drops[indexDrop].positionY + 'px';

                document.body.append(dropsSpawn[indexDrop]);
            //

            indexDrop++;
        }

        
        for ( let i = 0; i < drops.length; i++) {
            drops[i].positionY += 2;
            for ( let i = 0; i < dropsSpawn.length; i++) {
                dropsSpawn[i].style.top = drops[i].positionY + 'px';
            }
            if ( drops[i].positionY >= video.getBoundingClientRect().top) {
                dropsSpawn[i].remove();
                indexDrop--;
                drops.splice(i, 1);
            }
        }

        timeGame++;
        timeSpawn++;
    }
    return timerGame;
}



var cycle = startGame();



setInterval(cycle, 100);

startGame();