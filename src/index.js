import "./styles.scss";

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
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
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

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

(function shuffle() {
  const appContainer = document.getElementById("app");
  const memoryGameContainer = document.createElement("div");
  memoryGameContainer.classList.add("memory-game-container");
  appContainer.appendChild(memoryGameContainer);
  const cardsContainer = document.querySelectorAll(".memory-game-container");
  cardsContainer.forEach((container) => {
    container.innerHTML = "";
    let cardNumbers = Array.from({ length: 8 }, (_, i) => i+1).concat(
        Array.from({ length: 8 }, (_, i) => i+1)
    ); // [1, 2, 3, ..., 8, 1, 2, 3, ..., 8]
    cardNumbers.sort(() => Math.random() - 0.5); // Shuffle the array
    for (let i = 0; i < 16; i++) {
      let card = document.createElement("div");
      card.classList.add("memory-card", "sprite");
      card.dataset.framework = cardNumbers[i];
      card.innerHTML = `<div class="card image${cardNumbers[i]}"></div>
                                            <div class="card back-face"></div>`;
      container.appendChild(card);
    }
  });
  const cards = document.querySelectorAll(".memory-card");

  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 16);
    card.style.order = randomPos;
  });

  cards.forEach((card) => card.addEventListener("click", flipCard));
})();
