//-------------------HTML Elements

const dispTimerCount = document.getElementById("dispTimerCount");
const dispTimerStatus = document.getElementById("dispTimerStatus");
const donePmCount = document.getElementById("donePmCount");
const doneMinCount = document.getElementById("doneMinCount");

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");

const inputAlermTargetTime = document.getElementById("alermTargetTime");

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
            doneMinCount.innerHTML=Number(doneMinCount.innerHTML) + pmTargetTime/60;
        }
        pmOrNot = (pmOrNot+1)%2 //pmとbreakの切り替え
        timerSoundPlay();
    }
}

const judgeTimerType = () => {
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

const setValueAndSaveLocalStorage = (targetElement) => { 
    /*
    json.targetVar ができるかどうかでだいぶ変わる。たぶんできない。
    */
    let jsonValue = JSON.parse();
    switch(targetElement) {
        case inputPmTargetTime:
            jsonValue.pmTargetTime = inputPmTargetTime.value;
            break;
        case inputSbTargetTime:
            break;
        case inputLbTargetTime:
            break;
        case inputLbTargetInterval:
            break;
        case inputTimerSoundVolume:
            break;
    }
    JSON.stringify()
}

const readLocalStorageAndSetValue = () => {
    const jsonValue = {pmTargetTime:25, sbTargetTime:5, lbTargetTime:15, lbTargetInterval:4, TimerSoundVolume:0.4}//JSON.parse()
    //----------------json to element
    inputPmTargetTime.value = jsonValue.pmTargetTime;
    inputSbTargetTime.value = jsonValue.sbTargetTime;
    inputLbTargetTime.value = jsonValue.lbTargetTime;
    inputLbTargetInterval.value = jsonValue.lbTargetInterval;

    inputTimerSoundVolume.value = jsonValue.TimerSoundVolume;
    //----------------element to var
    pmTargetTime = inputPmTargetTime.value*60;
    sbTargetTime = inputSbTargetTime.value*60;
    lbTargetTime = inputLbTargetTime.value*60;
    lbTagetInterval = inputLbTargetInterval.value;

    timerSound.volume = inputTimerSoundVolume.value;
    
}

//--------------------initial setting

readJsonAndSetValue();

startButton.addEventListener('click', ()=>{startOrStop=1}, false);
stopButton.addEventListener('click', ()=>{startOrStop=0}, false);
resetButton.addEventListener('click', ()=>{resetTimerAndCount(0)}, false);

inputAlermTargetTime.addEventListener('input', ()=>{alermTargetTime = inputAlermTargetTime.value}, false);
inputPmTargetTime.addEventListener('input', ()=>{pmTargetTime = inputPmTargetTime.value*60}, false);
inputSbTargetTime.addEventListener('input', ()=>{sbTargetTime = inputSbTargetTime.value*60}, false);
inputLbTargetTime.addEventListener('input', ()=>{lbTargetTime = inputLbTargetTime.value*60}, false);
inputLbTargetInterval.addEventListener('input', ()=>{lbTagetCount = inputLbTargetInterval.value}, false);
inputTimerSoundVolume.addEventListener('input', ()=>{timerSound.volume = inputTimerSoundVolume.value}, false);

setInterval(judgeTimerType, 1000);
setInterval(alerm, 1000);