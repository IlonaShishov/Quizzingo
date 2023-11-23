const gridContainer = document.querySelector(".grid-container");
let cards = [];
let greenScore = 0;
let blueScore = 0;
let blackScore = 0;
let audioState = 0;

const TIME_LIMIT = 10;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
document.getElementById("timer").innerHTML = formatTime(
  timeLeft
);

document.querySelector(".greenScore").textContent = greenScore;
document.querySelector(".blueScore").textContent = blueScore;
document.querySelector(".blackScore").textContent = blackScore;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data];
    generateCards();
  });

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.innerHTML = `
      <div class="front">
        [${card.level} - ${card.subject}]
        <br>
        <br>
        ${card.question}
      </div>
      <div class="back">
        LVL - ${card.level}
        <br>
        <br>
        ${card.subject}
      </div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {

  if (this.classList.contains("flipped")) {
    updateScore(this);
    return
  }
  
  this.classList.add("flipped");
}

function updateScore(element) {
  const frontElement = element.querySelector(".front");
  if (frontElement) {
    if (frontElement.classList.contains("greenTeam")) {
      frontElement.classList.remove("greenTeam");
      greenScore--;
      document.querySelector(".greenScore").textContent = greenScore;

      frontElement.classList.add("blueTeam");
      blueScore++;
      document.querySelector(".blueScore").textContent = blueScore;
    } else if (frontElement.classList.contains("blueTeam")) {
      frontElement.classList.remove("blueTeam");
      blueScore--;
      document.querySelector(".blueScore").textContent = blueScore;

      frontElement.classList.add("blackTeam");
      blackScore++;
      document.querySelector(".blackScore").textContent = blackScore;
    } else if (frontElement.classList.contains("blackTeam")) {
      frontElement.classList.remove("blackTeam");
      blackScore--;
      document.querySelector(".blackScore").textContent = blackScore;

      frontElement.classList.add("greenTeam");
      greenScore++;
      document.querySelector(".greenScore").textContent = greenScore;
    } else {
      frontElement.classList.add("greenTeam");
      greenScore++;
      document.querySelector(".greenScore").textContent = greenScore;
    }
  }
}

function restart() {
  greenScore = 0;
  blueScore = 0;
  blackScore = 0;
  document.querySelector(".greenScore").textContent = greenScore;
  document.querySelector(".blueScore").textContent = blueScore;
  document.querySelector(".blackScore").textContent = blackScore;
  gridContainer.innerHTML = "";
  generateCards();
  onTimesUp();
  if(audioState != 0) {
    playPause();
  }
}

function playPause() {
  if(audioState == 0) {
    startTimer();
    audioState = 1;
    document.getElementById('audio').play();
    document.getElementById('audio').volume = 0.3;
    document.getElementById('playPauseBtn').innerHTML = "Pause &#9208;";
  } else {
    onTimesUp();
    audioState = 0;
    document.getElementById('audio').pause();
    document.getElementById('audio').currentTime = 0;
    document.getElementById('playPauseBtn').innerHTML = "Play &#9658;";
  }
}

function onTimesUp() {
  clearInterval(timerInterval);
  restartTime();
}

function restartTime() {
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  timerInterval = null;
  document.getElementById("timer").innerHTML = formatTime(
    timeLeft
  );
}

function startTimer() {
  restartTime();
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("timer").innerHTML = formatTime(
      timeLeft
    );

    if (timeLeft === 0) {
      playPause();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}