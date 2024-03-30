import "./styles.scss";

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
const cardCount = 16;
const score = {
  tries: 0,
  time: 0,
};

let timer;

function checkWin(appContainer) {
  const matchedCards = document.querySelectorAll(".matched");
  if (matchedCards.length === cardCount) {
    clearTimeout(timer);
    const appContainer = document.getElementById("app");
    const winOverlay = document.createElement("div");
    winOverlay.classList.add("win-overlay");
    winOverlay.innerHTML = `<h1 class="heading">Congratulations! <br>You Won!</h1>
                            <h3>Time: ${score.time} seconds</h3>
                            <h3>Flips: ${score.tries}</h3>
                            <button class="fancy-button" id="reStartButton">Play Again</button>`;

    setTimeout(() => {
      appContainer.appendChild(winOverlay);
      const restartButton = document.getElementById("reStartButton");
      restartButton.addEventListener("click", () => {
        winOverlay.style.display = "none";
        appContainer.innerHTML = "";
        startGame(appContainer);
      });
    }, 500);
  }
}

function flipCard() {
  updateScoreBoard();
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
  checkWin();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function startGame(appContainer) {
  initializeScoreBoard(appContainer);
  initializeBoard(appContainer);
}

function initializeScoreBoard(appContainer) {
  const scoreBoard = document.createElement("div");
  scoreBoard.classList.add("score-board");
  scoreBoard.innerHTML = `<div class="score-container"><h1>Flips: <span id="tries">0</span></h1> <h1>Time: <span id="time">0</span></h1></div>`;
  appContainer.appendChild(scoreBoard);
  initializeTimer();
}

function initializeTimer() {
  const time = document.getElementById("time");
  let seconds = 0;
  timer = setInterval(() => {
    score.time = seconds;
    time.innerText = seconds;
    seconds++;
  }, 1000);

  document.getElementById("time").innerText = score.time; // Initialize the time to 0
}

function updateScoreBoard() {
  const tries = document.getElementById("tries");
  score.tries++;
  tries.innerText = score.tries;
}

function initializeBoard(appContainer) {
  const memoryGameContainer = document.createElement("div");
  memoryGameContainer.classList.add("memory-game-container");
  appContainer.appendChild(memoryGameContainer);
  const cardsContainer = document.querySelectorAll(".memory-game-container");
  cardsContainer.forEach((container) => {
    container.innerHTML = "";
    let cardNumbers = Array.from(
      { length: cardCount / 2 },
      (_, i) => i + 1
    ).concat(Array.from({ length: cardCount / 2 }, (_, i) => i + 1)); // [1, 2, 3, ..., 8, 1, 2, 3, ..., 8]
    cardNumbers.sort(() => Math.random() - 0.5); // Shuffle the array

    for (let i = 0; i < cardCount; i++) {
      let card = document.createElement("div");
      card.classList.add("memory-card");
      card.dataset.framework = cardNumbers[i];
      card.innerHTML = `<div class="card image${cardNumbers[i]} sprite" ></div>
                                            <div class="card back-face"></div>`;
      container.appendChild(card);
    }
  });
  const cards = document.querySelectorAll(".memory-card");

  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * cardCount);
    card.style.order = randomPos;
  });

  cards.forEach((card) => card.addEventListener("click", flipCard));
}

function showStartScreen(appContainer) {
  const startScreen = document.createElement("div");
  startScreen.classList.add("start-screen");
  startScreen.innerHTML = `<h1>Memory Game</h1>
                                    <button class="fancy-button" id="startButton">Start Game</button>`;
  appContainer.appendChild(startScreen);

  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", () => {
    startScreen.style.display = "none";
    startGame(appContainer);
  });
}

(function () {
  const appContainer = document.getElementById("app");
  showStartScreen(appContainer);
})();
