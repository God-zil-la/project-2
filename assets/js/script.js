/* global firebase */

// ==== FIREBASE INIT ====
const firebaseConfig = {
  apiKey: "AIzaSyBJ4xlHJ-gw1i-njOeuoX5shRtJ6G7vg8I",
  authDomain: "memory-b0d16.firebaseapp.com",
  projectId: "memory-b0d16",
  storageBucket: "memory-b0d16.appspot.com",
  messagingSenderId: "1081029476081",
  appId: "1:1081029476081:web:0678dc8a912cd8f202b350",
  measurementId: "G-PXM46CJPCW",

  databaseURL: "https://memory-b0d16-default-rtdb.europe-west1.firebasedatabase.app"
};
firebase.initializeApp(firebaseConfig);
const dbRT = firebase.database();

// ==== DOM REFS ====
const gameContainer    = document.getElementById("gameContainer");
const movesCountElem   = document.getElementById("movesCount");
const timeCountElem    = document.getElementById("timeCount");
const bestRecordElem   = document.getElementById("bestRecord");
const bestNameInput    = document.getElementById("bestNameInput");
const resetBtn         = document.getElementById("resetBtn");
const difficultySelect = document.getElementById("difficulty");
const winModal         = document.getElementById("winModal");
const winMessage       = document.getElementById("winMessage");
const closeModalBtn    = document.getElementById("closeModal");

// ==== STATE ====
let movesCount   = 0;
let timer        = null;
let timeElapsed  = 0;
let firstCard    = null;
let secondCard   = null;
let lockBoard    = false;
let matchedPairs = 0;
let totalPairs   = 0;

// ==== IMAGE LISTS ====
const easyImages = [
  "assets/images/8-card/emoji-1.png",
  "assets/images/8-card/emoji-2.png",
  "assets/images/8-card/emoji-3.png",
  "assets/images/8-card/emoji-4.png"
];
const normalImages = [
  "assets/images/12-card/emoji-1.png",
  "assets/images/12-card/emoji-2.png",
  "assets/images/12-card/emoji-3.png",
  "assets/images/12-card/emoji-4.png",
  "assets/images/12-card/emoji-5.png",
  "assets/images/12-card/emoji-6.png"
];
const hardImages = [
  "assets/images/24-card/emoji-1.png", "assets/images/24-card/emoji-2.png",
  "assets/images/24-card/emoji-3.png", "assets/images/24-card/emoji-4.png",
  "assets/images/24-card/emoji-5.png", "assets/images/24-card/emoji-6.png",
  "assets/images/24-card/emoji-7.png", "assets/images/24-card/emoji-8.png",
  "assets/images/24-card/emoji-9.png","assets/images/24-card/emoji-10.png",
  "assets/images/24-card/emoji-11.png","assets/images/24-card/emoji-12.png"
];

// ==== HELPERS ====
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateCards(totalCards) {
  totalPairs = totalCards / 2;
  let imgs;
  if (totalCards === 8) imgs = easyImages.slice(0, totalPairs);
  else if (totalCards === 12) imgs = normalImages.slice(0, totalPairs);
  else if (totalCards === 24) imgs = hardImages.slice(0, totalPairs);
  else imgs = easyImages.slice(0, totalPairs);
  const deck = shuffleArray([...imgs, ...imgs]);
  return deck;
}

function renderCards(deck) {
  gameContainer.innerHTML = "";
  deck.forEach(src => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back" style="background-image:url(${src})"></div>
      </div>`;
    card.addEventListener("click", () => flipCard(card));
    gameContainer.appendChild(card);
  });
}

function flipCard(card) {
  if (lockBoard || card.classList.contains("flipped") || card.classList.contains("matched")) return;
  card.classList.add("flipped");
  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    movesCount++;
    movesCountElem.textContent = movesCount;
    checkForMatch();
  }
}

function checkForMatch() {
  const back1 = firstCard.querySelector(".card-back").style.backgroundImage;
  const back2 = secondCard.querySelector(".card-back").style.backgroundImage;
  if (back1 === back2) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs++;
    resetSelections();
    if (matchedPairs === totalPairs) {
      clearInterval(timer);
      showWinModal();
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetSelections();
    }, 1000);
  }
}

function resetSelections() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function startTimer() {
  clearInterval(timer);
  timeElapsed = 0;
  timeCountElem.textContent = timeElapsed;
  timer = setInterval(() => {
    timeElapsed++;
    timeCountElem.textContent = timeElapsed;
  }, 1000);
}

// ==== HIGH SCORE HANDLING ====
function displayHighScore() {
  const diff = difficultySelect.value;
  const scoreRef = dbRT.ref(`highscores/${diff}`);
  scoreRef.once("value")
    .then(snap => {
      const data = snap.val();
      bestRecordElem.textContent = data
        ? `Best: ${data.score}s by ${data.name}`
        : "Best: N/A";
      bestNameInput.classList.add("hidden");
    })
    .catch(console.error);
}

function updateBestTime() {
  const diff = difficultySelect.value;
  const scoreRef = dbRT.ref(`highscores/${diff}`);
  scoreRef.once("value")
    .then(snap => {
      const data = snap.val();
      if (!data || timeElapsed < data.score) {
        bestNameInput.classList.remove("hidden");
        bestNameInput.value = "";
        bestNameInput.focus();
        bestNameInput.onkeydown = e => {
          if (e.key === "Enter") {
            scoreRef.set({
              name: bestNameInput.value,
              score: timeElapsed,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            }).then(displayHighScore);
          }
        };
      } else {
        displayHighScore();
      }
    })
    .catch(console.error);
}

// ==== CUSTOM WIN MODAL ====
function showWinModal() {
  winMessage.textContent = `You win! Moves: ${movesCount}, Time: ${timeElapsed}s`;
  winModal.classList.remove("hidden");
}

closeModalBtn.addEventListener("click", () => {
  winModal.classList.add("hidden");
  updateBestTime();
  initGame();
});

// ==== LAYOUT CLASS SWITCHING ====
function applyDesktopLayout(totalCards) {
  gameContainer.classList.remove("easy-desktop", "normal-desktop", "hard-desktop");
  if (window.innerWidth >= 1200) {
    if (totalCards === 8) gameContainer.classList.add("easy-desktop");
    if (totalCards === 12) gameContainer.classList.add("normal-desktop");
    if (totalCards === 24) gameContainer.classList.add("hard-desktop");
  }
}

// ==== GAME INITIALIZER ====
function initGame() {
  movesCount = 0;
  matchedPairs = 0;
  movesCountElem.textContent = movesCount;
  resetSelections();
  clearInterval(timer);
  startTimer();
  displayHighScore();

  const totalCards = Number(difficultySelect.value);
  const deck = generateCards(totalCards);
  renderCards(deck);
  applyDesktopLayout(totalCards);
}

// ==== EVENT LISTENERS ====
window.addEventListener("DOMContentLoaded", initGame);
window.addEventListener("resize", () => applyDesktopLayout(Number(difficultySelect.value)));
difficultySelect.addEventListener("change", initGame);
resetBtn.addEventListener("click", initGame);
