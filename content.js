//-------------------HTML Elements

const dispTimerCount = document.getElementById("dispTimerCount");
const dispTimerStatus = document.getElementById("dispTimerStatus");
const donePmCount = document.getElementById("donePmCount");
const doneMinCount = document.getElementById("doneMinCount");

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");

const inputAlermTargetTime = document.getElementById("alermTargetTime");

const input = document.querySelectorAll(".input");

const inputPmTargetTime = document.getElementById("pmTargetTime");   
const inputSbTargetTime = document.getElementById("sbTargetTime");   
const inputLbTargetTime = document.getElementById("lbTargetTime"); 
const inputLbTargetInterval = document.getElementById("lbTargetInterval");

const inputTimerSoundVolume = document.getElementById("timerSoundVolume");

//---------------------Audio

const timerSound = new Audio('kitchen_timer1.mp3');

//---------------------let

let alermTargetTime = 0 //inputAlermTargetTime.value;
let pmTargetTime = 0;   //ポモドーロタイマーの時間
let sbTargetTime = 0;   //ShortBreakの時間
let lbTargetTime = 0;   //LongBreakの時間
let lbTagetInterval = 0;   //lbまでのpm回数

let thisTime = 0; //現在動作中のタイマーの時間
let pmOrNot = 1; //true=pm felse=sb/lb
let pmCount = 0;  //lbまでのpmカウント
let startOrStop = 0; //タイマーが動いているか

//--------------------functions

const log = (content) => {
    console.log(content);
}

const timerSoundPlay = () => {
    timerSound.currentTime = 12;
    timerSound.play();
}

const runTimer = (targetTime) => {
    if(thisTime <= 0) { //時間設定
        thisTime = targetTime
    } 
    thisTime -= 1;
    dispTimerCount.innerHTML=String(Math.floor(thisTime/60)).padStart(2,"0") + ":" + String(thisTime%60).padStart(2,"0");
    if(thisTime <= 0) { //タイマー終了時の処理
        if(pmOrNot) {
            pmCount = (pmCount+1)%lbTagetCount
            donePmCount.innerHTML=Number(donePmCount.innerHTML) + 1;
            doneMinCount.innerHTML=Number(doneMinCount.innerHTML) + Number(inputPmTargetTime.value);
        }
        pmOrNot = (pmOrNot+1)%2 //pmとbreakの切り替え
        timerSoundPlay();
    }
}

const judgeTimerType = () => {
    log(pmTargetTime)
    if(startOrStop) {
        if(pmOrNot) {
            runTimer(pmTargetTime);
            dispTimerStatus.innerHTML="pm";
        } else if(pmCount) {
            runTimer(sbTargetTime);
            dispTimerStatus.innerHTML="sb";
        } else {
            runTimer(lbTargetTime);
            dispTimerStatus.innerHTML="lb";
        }
    }
}

const resetTimerAndCount = (startOrStopParameter) => {
    startOrStop = startOrStopParameter;
    pmOrNot=1;
    thisTime=0;
    pmCount=0;
    runTimer(pmTargetTime);
    dispTimerStatus.innerHTML="pm";
}

const alerm = () => {
    let nowTime = new Date();
    nowTime = String(nowTime.getHours()).padStart(2,"0")+":"+String(nowTime.getMinutes()).padStart(2,"0");
    
    if(nowTime === alermTargetTime) {
        timerSoundPlay();
        resetTimerAndCount(1);
        alermTargetTime=0;
    }
    //予定時刻を取得
    //現在時刻を取得
    //現在時刻＝予定時刻になったら音を再生。
}

const setValueAndSaveLocalStorage = (e) => { 
    log(`Changed: ${e.target.id}`)
    const saveChangedValue = (variable, multiple) => {
        log(variable)
        variable = e.target.value * (multiple ? multiple : 1);
        log(variable)
        localStorage.setItem(e.target.id, e.target.value)
    }
    switch(e.target.id) {
        case 'pmTargetTime':
            saveChangedValue(pmTargetTime, 60);
            break;
        case 'sbTargetTime':
            saveChangedValue(sbTargetTime, 60);
            break;
        case 'lbTargetTime':
            saveChangedValue(lbTargetTime, 60);
            break;
        case 'lbTagetInterval':
            saveChangedValue(lbTagetInterval);
            break;
        case 'timerSoundVolume':
            saveChangedValue(timerSound.volume);
            break;
        case 'alermTargetTime':
            saveChangedValue(alermTargetTime);
            break;
        default:
            log('don\'t match any case')
            break;
    }
}

const readLocalStorageAndSetValue = () => {
    //----------------localStorage to element
    inputPmTargetTime.value = localStorage.getItem('pmTargetTime');
    inputSbTargetTime.value = localStorage.getItem('sbTargetTime');
    inputLbTargetTime.value = localStorage.getItem('lbTargetTime');
    inputLbTargetInterval.value = localStorage.getItem('lbTargetInterval');

    inputTimerSoundVolume.value = localStorage.getItem('timerSoundVolume');
    //----------------element to var
    pmTargetTime = inputPmTargetTime.value*60;
    sbTargetTime = inputSbTargetTime.value*60;
    lbTargetTime = inputLbTargetTime.value*60;
    lbTagetInterval = inputLbTargetInterval.value;

    timerSound.volume = inputTimerSoundVolume.value;
}

//--------------------initial setting
readLocalStorageAndSetValue();

startButton.addEventListener('click', ()=>{startOrStop=1}, false);
stopButton.addEventListener('click', ()=>{startOrStop=0}, false);
resetButton.addEventListener('click', ()=>{resetTimerAndCount(0)}, false);

for(let element of input) {
    element.addEventListener('change', (e)=>{setValueAndSaveLocalStorage(e)}, false);
}

setInterval(judgeTimerType, 1000);
setInterval(alerm, 1000);

//-------------------test
const test = document.getElementById("test");