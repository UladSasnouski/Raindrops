const load1 = document.querySelector('.load-game1');
const load2 = document.querySelector('.load-game2');
const load3 = document.querySelector('.load-game3');
const soundDown = document.getElementById('sound-down');
const soundFon = document.getElementById('sound-fon');
const soundAllow = document.getElementById('sound-allow');
var numbers = document.querySelectorAll("[data-number]");
let temporarily;
    

// Statistics

var scoreGame = document.getElementById('score-game');
var timesGame = document.getElementById('time-game');
var responseGame = document.getElementById('response-game');
var rightGame = document.getElementById('right-game');
var wrongGame = document.getElementById('wrong-game');
var missedGame = document.getElementById('missed-game');
var button = document.querySelectorAll("[data-key]");
var fullscreen = document.getElementById('btnFullscreen')

addEventListener('keydown', function(e){
    mouseDown(e.keyCode);
});

var targetMin = 0;
var targetMax = 10;
var setGravity = 4;

var scoreTop = 0;

var bonus = false;

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
solutionUserTag.textContent = "0";

var drops = [];

function mouseDown(elem) {
    if ( elem === 96 || elem === 97 || elem === 98 || elem === 99 || elem === 100 || elem === 101 || elem === 102 || elem === 103 || elem === 104 || elem === 105 || elem === 109 || elem === 110 || elem === 13 ) {
        const board = document.querySelector(`button[data-key="${elem}"]`).click();
        console.log(elem);
    } else {
        return false;
    }
};


function startGame () {
    scoreTag.textContent = score;
    footer.style.height = height + 'px';
    if (solutionUserTag.textContent === "Play" || solutionUserTag.textContent === "How To Play" || solutionUserTag.textContent === "" ) {
        del ();
    }
    var timerGame = function timerGame() {
        if ( timeSpawn === 40 && drops.length < 5 ) {
            let widthDisplay = document.getElementById('displays').clientWidth;
            let widthWindow = document.documentElement.clientWidth - widthDisplay;
            let formulaMin = targetMin;
            let formulaMax = targetMax;
            let sumbol = '';
            let formulaSumbol = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
            
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
            drops[i].positionY += setGravity;
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
            clearInterval(bonusTimer);
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
    let control = true;
    for ( let i = 0; i < drops.length; i++) {
        if ( drops[i] != undefined && drops[i].result === userResult ) {
            drops[i].div.classList.add("destroy");
            soundAllow.play();
            control = false;
            setTimeout( function() {
                drops[i].div.remove();
                if ( scoreTop >= 10) {
                    score = (score + 100) - Math.ceil(drops[i].timeLive / 10) + (scoreTop * 2);
                    responseAnswer = responseAnswer + drops[i].timeLive;
                    scoreTag.textContent = score;
                } else {
                    score = (score + 100) - Math.ceil(drops[i].timeLive / 10);
                    responseAnswer = responseAnswer + drops[i].timeLive;
                    scoreTag.textContent = score;
                }
                drops.splice(i, 1);
                allowAnswer++;
                scoreTop++;
                solutionUserTag.textContent = "0";
                userResult = 0;
            }, 900);
        } else if ( drops[i] != undefined && drops[i].bonus === userResult && bonus === true ) {
            drops[i].div.classList.add("destroy");
            soundAllow.play();
            control = false;
            bonus = false;
            setTimeout( function() {
                switch (drops.length) {
                    case 1:
                        drops[0].div.remove();
                        if ( scoreTop >= 10) {
                            score = (score + 100) - Math.ceil(drops[i].timeLive / 10) + (scoreTop * 2);
                            responseAnswer = responseAnswer + drops[i].timeLive;
                            scoreTag.textContent = score;
                        } else {
                            score = (score + 100) - Math.ceil(drops[i].timeLive / 10);
                            responseAnswer = responseAnswer + drops[i].timeLive;
                            scoreTag.textContent = score;
                        }
                        break;
                    case 2:
                        drops[0].div.remove();
                        drops[1].div.remove();
                        if ( scoreTop >= 10) {
                            score = (score + 200) - Math.ceil(drops[i].timeLive / 10) + (scoreTop * 2);
                            responseAnswer = responseAnswer + drops[i].timeLive;
                            scoreTag.textContent = score;
                        } else {
                            score = (score + 200) - Math.ceil(drops[i].timeLive / 10);
                            responseAnswer = responseAnswer + drops[i].timeLive;
                            scoreTag.textContent = score;
                        }
                        break;
                    case 3:
                        drops[0].div.remove();
                        drops[1].div.remove();
                        drops[2].div.remove();
                        if ( scoreTop >= 10) {
                            score = (score + 300) - Math.ceil(drops[i].timeLive / 10) + (scoreTop * 2);
                            responseAnswer = responseAnswer + drops[i].timeLive;
                            scoreTag.textContent = score;
                        } else {
                            score = (score + 300) - Math.ceil(drops[i].timeLive / 10);
                            responseAnswer = responseAnswer + drops[i].timeLive;
                            scoreTag.textContent = score;
                        }
                        break;
                    case 4:
                        drops[0].div.remove();
                        drops[1].div.remove();
                        drops[2].div.remove();
                        drops[3].div.remove();
                        if ( scoreTop >= 10) {
                            score = (score + 400) - Math.ceil(drops[i].timeLive / 10) + (scoreTop * 2);
                            responseAnswer = responseAnswer + drops[i].timeLive;
                            scoreTag.textContent = score;
                        } else {
                            score = (score + 400) - Math.ceil(drops[i].timeLive / 10);
                            responseAnswer = responseAnswer + drops[i].timeLive;
                            scoreTag.textContent = score;
                        }
                        break;
                    case 5:
                        drops[0].div.remove();
                        drops[1].div.remove();
                        drops[2].div.remove();
                        drops[3].div.remove();
                        drops[4].div.remove();
                        if ( scoreTop >= 10) {
                            score = (score + 500) - Math.ceil(drops[i].timeLive / 10) + (scoreTop * 2);
                            responseAnswer = responseAnswer + drops[i].timeLive;
                            scoreTag.textContent = score;
                        } else {
                            score = (score + 500) - Math.ceil(drops[i].timeLive / 10);
                            responseAnswer = responseAnswer + drops[i].timeLive;
                            scoreTag.textContent = score;
                        }
                        break;
                }
                drops.splice(0, 10);
                allowAnswer++;
                solutionUserTag.textContent = "0";
                userResult = 0;
            }, 900);
        }
    }
    if ( drops != undefined && control === true ) {
        score = ( score - 25 );
        scoreTag.textContent = score;
        scoreTop = 0;
        denyAnswer++;
        solutionUserTag.textContent = "0";
        userResult = 0;
    }
}

function statistics () {
    autoplay === false;
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

        if( drops[solution] === undefined ) {
            return false;
        } else {
            userResult = drops[solution].result;
            solutionUserTag.textContent = userResult;
            compare ();
        }
    }
}, 3000);

setInterval ( function() { 
    targetMin = targetMin + 1;
    targetMax = targetMax + 5;
    setGravity = setGravity + 0.5;
}, 15000);

var bonusTimer = setInterval ( function() { 
    if ( drops.length < 5 ) {
        let widthDisplay = document.getElementById('displays').clientWidth;
        let widthWindow = document.documentElement.clientWidth - widthDisplay;
        let formulaMin = 0;
        let formulaMax = 10;
        let sumbol = '';
        let formulaSumbol = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
        
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
        
        dropsSpawn.className = "drop-bonus";
        dropsSpawn.style.left = pos + 'px';
        dropsSpawn.style.top = 0 + 'px';

        document.body.append(dropsSpawn);
        drops.push({positionY: 0, positionX: pos, bonus: produce, status: true, div: dropsSpawn, timeLive: 0});
    }
    bonus = true;
}, 40000);

for (var i = 0; i < numbers.length; i++) {
    var number = numbers[i];
    number.addEventListener('click', function (e) {
      numberPress(e.target.textContent);
    });
};

function numberPress(number) {
    if (solutionUserTag.textContent === "Play" ) {
        solutionUserTag.textContent = "0";
    }
    if (solutionUserTag.textContent === "0") {
        solutionUserTag.textContent = number;
        userResult = +number;
    } else {
        temporarily = solutionUserTag.textContent + number;
        solutionUserTag.textContent = temporarily;
        userResult = +temporarily;
    }
};

function del () {
    if (solutionUserTag.textContent === "Play") {
        solutionUserTag.textContent = "0";
    }
    if (solutionUserTag.textContent === "") {
        solutionUserTag.textContent = "0";
        userResult = 0;
    } else {
        solutionUserTag.textContent = "0";
        userResult = 0;
    }
};

function submit () {
    if (solutionUserTag.textContent === "Play" || solutionUserTag.textContent === "" ) {
        return false;
    } else {
        compare ();
    }
};

function negative () {
    if (solutionUserTag.textContent === "Play" || solutionUserTag.textContent === "0" || solutionUserTag.textContent === "" ) {
        solutionUserTag.textContent = "-";
    } else {
        temporarily = "-" + solutionUserTag.textContent;
        solutionUserTag.textContent = +temporarily;
        userResult = +temporarily;
    }
};

var cycle = startGame();

function clickPlay () {
    load1.classList.add("no-loaded");
    load2.classList.remove("no-loaded");
    playing = true;
    solutionUserTag.textContent = "0"
    soundFon.play();
    return cycle;
}
function clickRestart () {
    location.reload()
}

function clickAutoplay () {
    load1.classList.add("no-loaded");
    load2.classList.remove("no-loaded");
    playing = true;
    autoplay = true;
    solutionUserTag.textContent = "0"
    soundFon.play();
    return cycle;
}

var interval = setInterval(cycle, 100);
bonusTimer;

function toggleFullscreen(elem) {
    elem = elem || document.documentElement;
    if (!document.fullscreenElement && !document.mozFullScreenElement &&
      !document.webkitFullscreenElement && !document.msFullscreenElement) {
      fullscreen.style.visibility = 'visible';
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
  
  fullscreen.addEventListener('click', function() {
    toggleFullscreen();
  });