const gridContainer = document.querySelector(".grid-container");
let cards = [];
let greenScore = 0;
let blueScore = 0;
let audioState = 0;

document.querySelector(".greenScore").textContent = greenScore;
document.querySelector(".blueScore").textContent = blueScore;

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
  document.querySelector(".greenScore").textContent = greenScore;
  document.querySelector(".blueScore").textContent = blueScore;
  gridContainer.innerHTML = "";
  generateCards();
}

function playPause() {
  if(audioState == 0) {
    audioState = 1;
    document.getElementById('audio').play();
    document.getElementById('audio').volume = 0.3;
    document.getElementById('playPauseBtn').innerHTML = "Pause &#9208;";
  } else {
    audioState = 0;
    document.getElementById('audio').pause();
    document.getElementById('playPauseBtn').innerHTML = "Play &#9658;";
  }
}