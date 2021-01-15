const load1 = document.querySelector('.load-game1');
const load2 = document.querySelector('.load-game2');
const load3 = document.querySelector('.load-game3');
const soundDown = document.getElementById('sound-down');
const soundFon = document.getElementById('sound-fon');
const soundAllow = document.getElementById('sound-allow');


// Statistics

var scoreGame = document.getElementById('score-game');
var timesGame = document.getElementById('time-game');
var responseGame = document.getElementById('response-game');
var rightGame = document.getElementById('right-game');
var wrongGame = document.getElementById('wrong-game');
var missedGame = document.getElementById('missed-game');


var playing = false;
var autoplay = false;
// Время всей игры
var timeGame = 0;
// Правильные/Неправильные ответы
var allowAnswer = 0;
var denyAnswer = 0;
var missedAnswer = 0;
// Счёт
var score = 0;
//
var responseAnswer = 0;

soundDown.pause();
soundFon.volume = 0.5;

var timeSpawn = 0;

var height = 200;
var userResult = 1;
var video = document.getElementById('video');
var footer = document.getElementById('footer');
var scoreTag = document.getElementById('score');
var solutionUserTag = document.getElementById('solution');

var drops = [];


function startGame () {
    scoreTag.textContent = score;
    footer.style.height = height + 'px';
    var timerGame = function timerGame() {
        if ( timeSpawn === 40 && drops.length < 5 ) {
            let widthDisplay = document.getElementById('displays').clientWidth;
            let widthWindow = document.documentElement.clientWidth - widthDisplay;
            let formulaMin = 0;
            let formulaMax = 10;
            let sumbol = '';
            let formulaSumbol = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
            switch (formulaSumbol) {
                case 1:
                    formulaMin = -50;
                    formulaMax = 50;
                    break;
                case 2:
                    formulaMin = -50;
                    formulaMax = 50;
                    break;
            }
            let sumbolOne = Math.floor(Math.random() * (formulaMax - formulaMin + 1)) + formulaMin;
            let sumbolTwo = Math.floor(Math.random() * (formulaMax - formulaMin + 1)) + formulaMin;;
            let produce;
            
            switch (formulaSumbol) {
                case 1:
                    produce = sumbolOne - sumbolTwo;
                    sumbol = '-';
                    break;
                case 2:
                    produce = sumbolOne + sumbolTwo;
                    sumbol = '+';
                    break;
                case 3:
                    produce = sumbolOne * sumbolTwo;
                    sumbol = '*';
                    let stat = true;
                    if ( produce % 2 != 0 || isNaN(produce) === true || !produce ){
                        stat = false;
                    }
                    if ( stat === false ){
                        while ( stat === false ) {
                            sumbolOne = Math.floor(Math.random() * (formulaMax - formulaMin + 1)) + formulaMin;
                            sumbolTwo = Math.floor(Math.random() * (formulaMax - formulaMin + 1)) + formulaMin;
                            produce = sumbolOne * sumbolTwo;
                            if ( produce % 2 === 0 && isNaN(produce) === false && produce ){
                                stat = true;
                            }
                        }
                    } 
                    break;
                case 4:
                    produce = sumbolOne / sumbolTwo;
                    let status = true;
                    if ( produce % 2 != 0 || isNaN(produce) === true || !produce ){
                        status = false;
                    }
                    if ( status === false ){
                        while ( status === false ) {
                            sumbolOne = Math.floor(Math.random() * (formulaMax - formulaMin + 1)) + formulaMin;
                            sumbolTwo = Math.floor(Math.random() * (formulaMax - formulaMin + 1)) + formulaMin;
                            produce = sumbolOne / sumbolTwo;
                            if ( produce % 2 === 0 && isNaN(produce) === false && produce ){
                                status = true;
                            }
                        }
                    } 
                    sumbol = '/';
                    break;
                default:
                    return false;
            }
            let posXmin = 30;
            let posXmax = widthWindow - widthDisplay;
            let pos = Math.round(Math.random() * (posXmax - posXmin) + posXmin);
            timeSpawn = 0;

            // Create Element
            var dropsSpawn = document.createElement('div');

            var str = `<div class="center"><span>${sumbolOne}</span></div><div class="center"><span>${sumbol}</span></div><div class="center"><span>${sumbolTwo}</span></div>`;

            dropsSpawn.innerHTML = str + dropsSpawn.innerHTML;
            
            dropsSpawn.className = "drop";
            dropsSpawn.style.left = pos + 'px';
            dropsSpawn.style.top = 0 + 'px';

            document.body.append(dropsSpawn);
            drops.push({positionY: 0, positionX: pos, result: produce, status: true, div: dropsSpawn, timeLive: 0});
        }
        
        for ( let i = 0; i < drops.length; i++) {
            drops[i].timeLive++;
            drops[i].positionY += 4;
            drops[i].div.style.top = drops[i].positionY + 'px';
            
            if ( drops[i].positionY + 100 >= video.getBoundingClientRect().top) {
                drops[i].div.remove();
                height += 50;
                footer.style.height = height + 'px';
                score = score - 50;
                scoreTag.textContent = score;
                missedAnswer++;
                soundDown.play();
                drops.splice(i, 1);
            }
        }

        if ( video.getBoundingClientRect().top <= 150 && playing === true ) {
            statistics ();
            clearInterval(interval);
            playing = false;
            setTimeout( function() {
                load2.classList.add("no-loaded");
                load3.classList.remove("no-loaded");
            }, 4000);
        }

        timeGame++;
        timeSpawn++;
    }
    return timerGame;
}

function compare () {
    for ( let i = 0; i < drops.length; i++) {
        if ( drops[i].result === userResult ) {
            drops[i].div.remove();
            soundAllow.play();
            score = (score + 100) - Math.ceil(drops[i].timeLive / 10);
            responseAnswer = responseAnswer + drops[i].timeLive;
            scoreTag.textContent = score;
            drops.splice(i, 1);
            allowAnswer++;
        } else if ( drops[i].result != userResult ) {
            score = (score - ( 20 + Math.ceil(drops[i].timeLive / 10)));
            scoreTag.textContent = score;
            denyAnswer++;
        }
    }
}

function statistics () {
    soundFon.pause();
    scoreGame.textContent = score;
    timesGame.textContent = timeGame / 10;
    if (responseAnswer === 0) {
        responseGame.textContent = 0;
    } else {
        responseGame.textContent = Math.ceil((responseAnswer / 10) / allowAnswer);
    }
    rightGame.textContent = allowAnswer;
    wrongGame.textContent = denyAnswer;
    missedGame.textContent = missedAnswer;
}

setInterval ( function() { 
    if ( autoplay === true ) {
        let solution = Math.floor(Math.random() * (4 - 0 + 1)) + 0;

        if( typeof drops[solution].result === undefined ) {
            return false;
        } else {
            userResult = drops[solution].result;
            solutionUserTag.textContent = userResult;
            compare ();
        }
    }
}, 3000);



var cycle = startGame();

function clickPlay () {
    load1.classList.add("no-loaded");
    load2.classList.remove("no-loaded");
    playing = true;
    soundFon.play();
    return cycle;
}
function clickRestart () {
    load3.classList.add("no-loaded");
    load2.classList.remove("no-loaded");
    playing = true;
    timeGame = 0;
    allowAnswer = 0;
    denyAnswer = 0;
    missedAnswer = 0;
    score = 0;
    responseAnswer = 0;
    timeSpawn = 0;
    height = 200;
    footer.style.height = height + 'px';
    drops = [];
    scoreTag.textContent = score;
    interval = setInterval(cycle, 100);
    soundFon.play();
    return cycle;
}

function clickAutoplay () {
    load1.classList.add("no-loaded");
    load2.classList.remove("no-loaded");
    playing = true;
    autoplay = true;
    soundFon.play();
    return cycle;
}

var interval = setInterval(cycle, 100);

