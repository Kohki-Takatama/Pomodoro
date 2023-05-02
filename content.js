//-------------------HTML Elements

const dispTimerCount = document.getElementById("dispTimerCount");
const dispTimerStatus = document.getElementById("dispTimerStatus");
const donePmCount = document.getElementById("donePmCount");
const doneMinCount = document.getElementById("doneMinCount");

const startStopButton = document.getElementById("startStopButton");
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

//---------------------Global Model

let globalModel = {
        alermTargetTime:0, 
        pmTargetTime:0,     //ポモドーロタイマーの時間
        sbTargetTime:0,     //ShortBreakの時間
        lbTargetTime:0,     //LongBreakの時間
        lbTargetInterval:0, //lbまでのpm回数

        thisTime:0,         //現在動作中のタイマーの時間
        thisPm:0,           //現在動作中のpmTime※ただしbreakタイミングでも更新される
        pmOrNot:1,          //true=pm felse=sb/lb
        pmCount:0,          //lbまでのpmカウント
        startOrStop:0       //タイマーが動いているか
    }

//--------------------functions

const log = (content) => {
    console.log(content);
}

const timerSoundPlay = () => {
    timerSound.currentTime = 12;
    timerSound.play();
}

const runTimer = (targetTime) => {
    if(globalModel.thisTime <= 0) { //時間設定
        globalModel.thisTime = targetTime;
        globalModel.thisPm = globalModel.pmTargetTime;
    } 
    globalModel.thisTime -= 1;
    dispTimerCount.innerHTML=String(Math.floor(globalModel.thisTime/60)).padStart(2,"0") + ":" + String(globalModel.thisTime%60).padStart(2,"0");
    if(globalModel.thisTime <= 0) { //タイマー終了時の処理
        if(globalModel.pmOrNot) {
            globalModel.pmCount += 1;
            donePmCount.innerHTML=Number(donePmCount.innerHTML) + 1;
            doneMinCount.innerHTML=Math.floor(Number(doneMinCount.innerHTML) + globalModel.thisPm/60);
        }
        if(globalModel.pmCount >= globalModel.lbTargetInterval) {
            globalModel.pmCount = 0;
            globalModel.pmOrNot = 1;
        }
        globalModel.pmOrNot = (globalModel.pmOrNot+1)%2 //pmとbreakの切り替え
        timerSoundPlay();
    }
}

const judgeTimerType = () => {
    if(globalModel.startOrStop) {
        if(globalModel.pmOrNot) {
            runTimer(globalModel.pmTargetTime);
            dispTimerStatus.innerHTML="pm";
        } else if(globalModel.pmCount) {
            runTimer(globalModel.sbTargetTime);
            dispTimerStatus.innerHTML="sb";
        } else {
            runTimer(globalModel.lbTargetTime);
            dispTimerStatus.innerHTML="lb";
        }
    }
}

const resetTimerAndCount = (startOrStopParameter) => {
    globalModel.pmOrNot=1;
    globalModel.thisTime=0;
    globalModel.pmCount=0;
    judgeTimerType();
    globalModel.startOrStop = startOrStopParameter;
}

const alerm = () => {
    let nowTime = new Date();
    nowTime = String(nowTime.getHours()).padStart(2,"0")+":"+String(nowTime.getMinutes()).padStart(2,"0");
    
    if(nowTime === globalModel.alermTargetTime) {
        timerSoundPlay();
        resetTimerAndCount(1);
        globalModel.alermTargetTime=0;
    }
    //予定時刻を取得
    //現在時刻を取得
    //現在時刻＝予定時刻になったら音を再生。
}

const setValueAndSaveLocalStorage = (e) => { 
    log(`Changed: ${e.target.id}`)
    const saveChangedValue = (multiple) => {
        localStorage.setItem(e.target.id, e.target.value);
        return e.target.value * (multiple ? multiple : 1);
    }
    switch(e.target.id) {
        case 'pmTargetTime':
            globalModel.pmTargetTime = saveChangedValue(60);
            break;
        case 'sbTargetTime':
            globalModel.sbTargetTime = saveChangedValue(60);
            break;
        case 'lbTargetTime':
            globalModel.lbTargetTime = saveChangedValue(60);
            break;
        case 'lbTargetInterval':
            globalModel.lbTargetInterval = saveChangedValue();
            break;
        case 'timerSoundVolume':
            timerSound.volume = saveChangedValue();
            break;
        case 'alermTargetTime':
            globalModel.alermTargetTime = saveChangedValue();
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
    globalModel.pmTargetTime = inputPmTargetTime.value*60;
    globalModel.sbTargetTime = inputSbTargetTime.value*60;
    globalModel.lbTargetTime = inputLbTargetTime.value*60;
    globalModel.lbTargetInterval = inputLbTargetInterval.value;

    timerSound.volume = inputTimerSoundVolume.value;
}

//--------------------initial setting
readLocalStorageAndSetValue();

startStopButton.addEventListener('click', ()=>{globalModel.startOrStop = (globalModel.startOrStop+1)%2}, false);
resetButton.addEventListener('click', ()=>{resetTimerAndCount(0)}, false);

for(let element of input) {
    element.addEventListener('change', (e)=>{setValueAndSaveLocalStorage(e)}, false);
}

setInterval(judgeTimerType, 1000);
setInterval(alerm, 1000);

//-------------------test
const test = document.getElementById("test");