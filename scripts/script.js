// View
const FRONT = "card_front";
const BACK = "card_back";
const CARD = "card";
const ICON = "icon";

let moves = 0;
let counter = document.getElementById("counter");
let music = document.getElementById("song");
let gameOverSound = document.getElementById("gameOverSound");
let flipSound = document.getElementById("flipSound");
let matchSound = document.getElementById("matchSound");
let gameContainer = document.getElementById("game-container");
let gameOverLayer = document.getElementById("gameOver");
let areThereCards = "no";
let inputPlayerName = document.getElementById("playerName");
let errorMsg = document.getElementById("errorMsg");
let playerName = "";
let infoSavedState = false;

function sendPlayersInfo() {
  if (inputPlayerName.value == "" && areThereCards == "no") {
    errorMsg.classList.add("empty-value");
    setTimeout(() => {
      errorMsg.classList.remove("empty-value");
    }, 2000);
    return (infoSavedState = false);
  }
  if (inputPlayerName.value != "" && areThereCards == "no") {
    playerName = inputPlayerName.value;
    errorMsg.classList.remove("empty-value");
    initializeCards(game.createCards());
    inputPlayerName.readOnly = true;
    return (infoSavedState = true);
  }
  if (inputPlayerName.value != "" && areThereCards == "yes") {
    errorMsg.classList.add("empty-value");
    errorMsg.innerHTML = "Erase data to start a new game.";
    setTimeout(() => {
      errorMsg.classList.remove("empty-value");
    }, 2000);
  }
}

function eraseData() {
  areThereCards = "no";
  inputPlayerName.value = "";
  playerName = "";
  music.pause();
  music.currentTime = 0;
  counter.classList.remove("gameStarted");
  infoSavedState = false;
  inputPlayerName.readOnly = false;
  errorMsg.innerHTML = "Please, enter your name.";
  game.clearCards();
  cleanBoard();
}

function cleanBoard() {
  gameBoard.innerHTML = "";
}

function initializeCards() {
  music.play();
  music.loop = true;
  counter.classList.add("gameStarted");
  moves = 0;
  counter.innerHTML = "Moves: 0";
  let gameBoard = document.getElementById("gameBoard");
  game.cards.forEach((card) => {
    let cardElement = document.createElement("div");
    cardElement.id = card.id;
    cardElement.classList.add(CARD);
    cardElement.dataset.icon = card.icon;

    createCardsContent(card, cardElement);

    cardElement.addEventListener("click", flipCard);
    gameBoard.appendChild(cardElement);
  });
}

function createCardsContent(card, cardElement) {
  createCardFace(FRONT, card, cardElement);
  createCardFace(BACK, card, cardElement);
}

function createCardFace(face, card, element) {
  let cardElementFace = document.createElement("div");
  cardElementFace.classList.add(face);
  if (face === FRONT) {
    let iconElement = document.createElement("img");
    iconElement.classList.add(ICON);
    iconElement.src = "./assets/images/" + card.icon + ".png";
    cardElementFace.appendChild(iconElement);
  } else {
    cardElementFace.innerHTML = "&lt/&gt";
  }
  element.appendChild(cardElementFace);
  areThereCards = "yes";
}

function flipCard() {
  if (game.setCard(this.id)) {
    flipSound.play();
    this.classList.add("flip");
    if (game.secondCard) {
      moves++;
      counter.innerHTML = `Moves: ${moves}`;
      if (game.checkMatch()) {
        matchSound.play();
        matchSound.currentTime = 0;
        game.clearCards();
        if (game.checkGameOver()) {
          saveUser();
          updateRankig();
          setTimeout(() => {
            music.pause();
            music.currentTime = 0;
            music.loop = false;
            gameContainer.style.filter = "blur(5px)";
            gameOverLayer.style.display = "flex";
            gameOverSound.play();
            let congratulations = document.getElementById("congratulations");
            congratulations.innerHTML = `Congratulations, ${playerName}!`;
            let finalMovesQuantity =
              document.getElementById("finalMovesQuantity");
            finalMovesQuantity.innerHTML = `It took you ${moves} moves to finish the game.`;
          }, 500);
        }
      } else {
        setTimeout(() => {
          let firstCardView = document.getElementById(game.firstCard.id);
          let secondCardView = document.getElementById(game.secondCard.id);
          firstCardView.classList.remove("flip");
          secondCardView.classList.remove("flip");
          game.unflipCards();
        }, 1000);
      }
    }
  }
}

function back() {
  gameOverLayer.style.display = "none";
  gameContainer.style.filter = "";
  showRanking();
}

function showRanking() {
  let ranking = document.getElementById("ranking");
  gameContainer.style.filter = "blur(5px)";
  ranking.style.display = "flex";
  ranking.scrollTop = 0;
}

function backFromRanking() {
  ranking.style.display = "none";
  gameContainer.style.filter = "";
}

const getLocalStorage = () => JSON.parse(localStorage.getItem("db_user")) ?? [];
const setLocalStorage = (dbUser) => {
  dbUser.sort(sortMoves);
  localStorage.setItem("db_user", JSON.stringify(dbUser));
};
// The Nullish Coalescing Operator (??) returns the first argument if it’s not null/undefined. Otherwise, the second one.

const createUser = (user) => {
  const dbUser = getLocalStorage();
  dbUser.push(user);
  setLocalStorage(dbUser);
};

const readUser = () => getLocalStorage();

const saveUser = () => {
  const user = {
    name: document.getElementById("playerName").value,
    moves: moves,
  };
  createUser(user);
};

const createRow = (user, initial = 1) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td>#${initial+1}</td>
        <td>${user.name}</td>
        <td>${user.moves}</td>
    `;
  document.querySelector("#tableRanking>tbody").appendChild(newRow);
};

const updateRankig = () => {
  const dbUser = readUser();
  clearRanking();
  dbUser.forEach(createRow);
};

const clearRanking = () => {
  const rows = document.querySelectorAll("#tableRanking>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

function sortMoves(a, b) {
  return a.moves - b.moves;
}

updateRankig();