let hourAngle = 0;
let minuteAngle = 0;
let alarmTime = null;
let alarmActive = false;
let countdownInterval = null;
let dragging = false;
let isHourHand = false;

const hourHand = document.getElementById("hour-hand");
const minuteHand = document.getElementById("minute-hand");
const selectedTime = document.getElementById("selected-time");
const setAlarmBtn = document.getElementById("set-alarm");
const countdownTimer = document.getElementById("countdown-timer");
const mathChallenge = document.getElementById("math-challenge");
const mathQuestion = document.getElementById("math-question");
const mathAnswer = document.getElementById("math-answer");
const submitAnswer = document.getElementById("submit-answer");
const alarmSound = document.getElementById("alarm-sound");

// Generate clock numbers
const clockNumbers = document.getElementById("clock-numbers");
for (let i = 1; i <= 12; i++) {
    let angle = (i - 3) * 30;
    let x = 175 + 140 * Math.cos(angle * (Math.PI / 180));
    let y = 175 + 140 * Math.sin(angle * (Math.PI / 180));

    let number = document.createElement("div");
    number.textContent = i;
    number.style.left = `${x}px`;
    number.style.top = `${y}px`;
    number.style.position = "absolute";
    number.style.fontSize = "26px";
    number.style.fontWeight = "bold";
    number.style.color = "white";
    number.style.transform = "translate(-50%, -50%)";
    clockNumbers.appendChild(number);
}

// Update displayed time
function updateSelectedTime() {
    let hours = Math.floor(hourAngle / 30);
    let minutes = Math.floor(minuteAngle / 6);
    selectedTime.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Dragging logic
function startDrag(e, handType) {
    dragging = true;
    isHourHand = handType;
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
}

function drag(e) {
    if (!dragging) return;

    let rect = document.getElementById("clock").getBoundingClientRect();
    let centerX = rect.left + rect.width / 2;
    let centerY = rect.top + rect.height / 2;
    let deltaX = e.clientX - centerX;
    let deltaY = e.clientY - centerY;
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
    angle = (angle + 360) % 360;

    if (isHourHand) {
        hourAngle = Math.round(angle / 30) * 30;
        hourHand.style.transform = `rotate(${hourAngle}deg)`;
    } else {
        minuteAngle = Math.round(angle / 6) * 6;
        minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    }

    updateSelectedTime();
}

function stopDrag() {
    dragging = false;
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
}

// Attach event listeners for dragging
hourHand.addEventListener("mousedown", (e) => startDrag(e, true));
minuteHand.addEventListener("mousedown", (e) => startDrag(e, false));

// Set Alarm
setAlarmBtn.addEventListener("click", () => {
    alarmTime = selectedTime.textContent;
    alert(`Alarm set for ${alarmTime}`);

    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
});

// Countdown Timer Logic
function updateCountdown() {
    if (!alarmTime) return;

    const now = new Date();
    const alarmDate = new Date();
    const [hours, minutes] = alarmTime.split(":").map(Number);
    
    alarmDate.setHours(hours, minutes, 0, 0);

    let timeDiff = alarmDate - now;

    if (timeDiff <= 0) {
        clearInterval(countdownInterval);
        countdownTimer.textContent = "00:00:00";
        triggerAlarm();
        return;
    }

    let hrs = Math.floor(timeDiff / (1000 * 60 * 60));
    let mins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    let secs = Math.floor((timeDiff % (1000 * 60)) / 1000);

    countdownTimer.textContent = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Alarm Trigger
function triggerAlarm() {
    if (!alarmActive) {
        alarmActive = true;
        alarmSound.play(); // Play alarm sound
        mathChallenge.classList.remove("hidden"); // Show math challenge
        generateMathProblem(); // Generate a new problem
        alert("⏰ Alarm is ringing! Solve the problem to stop it.");
    }
}

// Generate Math Problem
function generateMathProblem() {
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    mathQuestion.textContent = `Solve: ${num1} + ${num2}`;
    submitAnswer.dataset.correctAnswer = num1 + num2;
}

// Check Answer
submitAnswer.addEventListener("click", () => {
    if (parseInt(mathAnswer.value) === parseInt(submitAnswer.dataset.correctAnswer)) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        alert("✅ Correct! Alarm stopped.");
        mathChallenge.classList.add("hidden");
        alarmActive = false;
    } else {
        alert("❌ Wrong answer! Try again.");
    }
});
