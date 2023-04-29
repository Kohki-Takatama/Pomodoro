const timerSound = new Audio('kitchen_timer1.mp3');
timerSound.volume = 0.4;
const HTMLTimer = document.getElementById("HTMLTimer");
const HTMLStatus = document.getElementById("HTMLStatus");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");
const HTMLAlermTargetTime = document.getElementById("alermTargetTime");
const scaduleTitle = document.getElementById("scaduleTitle");
const scadulePm = document.getElementById("scadulePm");
const scaduleMemo = document.getElementById("scaduleMemo");
const addButton = document.getElementById("addButton");
const scaduleTable = document.getElementById("scaduleTable");


let alermTargetTime = HTMLAlermTargetTime.value;
let pmTargetTime = document.getElementById("pmTargetTime").value*60;   //ポモドーロタイマーの時間
let sbTargetTime = document.getElementById("sbTargetTime").value*60;   //ShortBreakの時間
let lbTargetTime = document.getElementById("lbTargetTime").value*60;   //LongBreakの時間
const pmTagetCount = 4;   //lbまでのpm回数

let thisTime = 0; //現在動作中のタイマー
let pmOrNot = 1; //true=pm felse=sb/lb
let pmCount = 0;  //lbまでのpmカウント
let startOrStop = 0;

const timerSoundPlay = () => {
    timerSound.currentTime = 12;
    timerSound.play();
}

const timer = (targetTime) => {
    if(thisTime <= 0) {thisTime = targetTime}  //時間設定
        thisTime -= 1;
        HTMLTimer.innerHTML=String(Math.floor(thisTime/60)).padStart(2,"0") + ":" + String(thisTime%60).padStart(2,"0");
    if(thisTime <= 0) { //タイマー終了時の処理
        if(pmOrNot) {pmCount = (pmCount+1)%pmTagetCount}
        pmOrNot = (pmOrNot+1)%2 //pm判定の切り替え
        timerSoundPlay();
    }
}
const count = () => {
    if(startOrStop) {
        if(pmOrNot) {
            timer(pmTargetTime);
            HTMLStatus.innerHTML="pm";
        } else if(pmCount) {
            timer(sbTargetTime);
            HTMLStatus.innerHTML="sb";
        } else {
            timer(lbTargetTime);
            HTMLStatus.innerHTML="lb";
        }
    }
}

const reset = (startOrStopParameter) => {
    startOrStop = startOrStopParameter;
    pmOrNot=1;thisTime=0;pmCount=0;timer(pmTargetTime);HTMLStatus.innerHTML="pm";
}

const alerm = () => {
    let nowTime = new Date();
    nowTime = String(nowTime.getHours()).padStart(2,"0")+":"+String(nowTime.getMinutes()).padStart(2,"0");
    
    if(nowTime === alermTargetTime) {
        timerSoundPlay();
        reset(1);
        alermTargetTime=0;
    }
    //予定時刻を取得
    //現在時刻を取得
    //現在時刻＝予定時刻になったら音を再生。
}

const addScadule = () => {
    const tr = scaduleTable.tBodies[0].insertRow(-1);
    const tdDeleteButton = tr.insertCell(0);
    const tdTitle = tr.insertCell(1);
    const tdFpm = tr.insertCell(2);
    const tdSlash = tr.insertCell(3);
    const tdSpm = tr.insertCell(4);
    const tdMemo = tr.insertCell(5);
    tdDeleteButton.appendChild(document.createTextNode("Button"));
    tdTitle.appendChild(document.createTextNode(scaduleTitle.value));
    tdFpm.appendChild(document.createTextNode(0));
    tdSlash.appendChild(document.createTextNode("/"));
    tdSpm.appendChild(document.createTextNode(scadulePm.value));
    tdMemo.appendChild(document.createTextNode(scaduleMemo.value));
}

startButton.addEventListener('click', ()=>{startOrStop=1}, false);
stopButton.addEventListener('click', ()=>{startOrStop=0}, false);
resetButton.addEventListener('click', ()=>{reset(0);}, false);
HTMLAlermTargetTime.addEventListener('input', ()=>{alermTargetTime = HTMLAlermTargetTime.value;});
addButton.addEventListener('click', addScadule, false);
setInterval(count, 1000);
setInterval(alerm, 1000);