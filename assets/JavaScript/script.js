/* global firebase */

//
// Firebase Initialization
//
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

//
// DOM Elements
//
const gameContainer   = document.getElementById('gameContainer');
const movesCountElem  = document.getElementById('movesCount');
const timeCountElem   = document.getElementById('timeCount');
const bestRecordElem  = document.getElementById('bestRecord');
const bestNameInput   = document.getElementById('bestNameInput');
const resetBtn        = document.getElementById('resetBtn');
const difficultySelect= document.getElementById('difficulty');

//
// Modal Elements
//
const winModal     = document.getElementById('winModal');
const winMessage   = document.getElementById('winMessage');
const modalCloseBtn= document.getElementById('modalCloseBtn');

//
// Image Arrays
//
const easyImages = [
  'assets/images/8-card/emoji-1.png',
  'assets/images/8-card/emoji-2.png',
  'assets/images/8-card/emoji-3.png',
  'assets/images/8-card/emoji-4.png'
];
const normalImages = [
  'assets/images/12-card/emoji-1.png',
  'assets/images/12-card/emoji-2.png',
  'assets/images/12-card/emoji-3.png',
  'assets/images/12-card/emoji-4.png',
  'assets/images/12-card/emoji-5.png',
  'assets/images/12-card/emoji-6.png'
];
const hardImages = [
  'assets/images/24-card/emoji-1.png',
  'assets/images/24-card/emoji-2.png',
  'assets/images/24-card/emoji-3.png',
  'assets/images/24-card/emoji-4.png',
  'assets/images/24-card/emoji-5.png',
  'assets/images/24-card/emoji-6.png',
  'assets/images/24-card/emoji-7.png',
  'assets/images/24-card/emoji-8.png',
  'assets/images/24-card/emoji-9.png',
  'assets/images/24-card/emoji-10.png',
  'assets/images/24-card/emoji-11.png',
  'assets/images/24-card/emoji-12.png'
];

//
// Game State
//
let movesCount   = 0;
let timer;
let timeElapsed  = 0;
let firstCard    = null;
let secondCard   = null;
let lockBoard    = false;
let matchedPairs = 0;
let totalPairs   = 0;

//
// Shuffle (Fisher–Yates)
//
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

//
// Generate card values
//
function generateCards(totalCards) {
  totalPairs = totalCards / 2;
  let values = [];
  if (totalCards === 8) {
    values = easyImages.slice(0, totalPairs);
  } else if (totalCards === 12) {
    values = normalImages.slice(0, totalPairs);
  } else if (totalCards === 24) {
    values = hardImages.slice(0, totalPairs);
  }
  return shuffleArray(values.concat(values));
}

//
// Render cards
//
function renderCards(cardValues) {
  gameContainer.innerHTML = '';
  cardValues.forEach(value => {
    const card      = document.createElement('div');
    card.classList.add('card');
    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    const cardBack  = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.style.backgroundImage = `url(${value})`;
    cardInner.append(cardFront, cardBack);
    card.appendChild(cardInner);
    card.addEventListener('click', () => flipCard(card));
    gameContainer.appendChild(card);
  });
}

//
// Flip & Match Logic
//
function flipCard(card) {
  if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  if (!firstCard) {
    firstCard = card;
    return;
  }
  secondCard = card;
  movesCountElem.textContent = ++movesCount;
  checkForMatch();
}

function checkForMatch() {
  const firstVal  = firstCard.querySelector('.card-back').style.backgroundImage;
  const secondVal = secondCard.querySelector('.card-back').style.backgroundImage;
  if (firstVal === secondVal) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    resetSelections();
    if (matchedPairs === totalPairs) {
      clearInterval(timer);
      setTimeout(() => {
        showWinModal(movesCount, timeElapsed);
        updateBestTime();
      }, 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetSelections();
    }, 1000);
  }
}

function resetSelections() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

//
// Timer
//
function startTimer() {
  clearInterval(timer);
  timeElapsed = 0;
  timeCountElem.textContent = timeElapsed;
  timer = setInterval(() => {
    timeCountElem.textContent = ++timeElapsed;
  }, 1000);
}

//
// High Score (Realtime DB)
//
function updateBestTime() {
  const difficulty = difficultySelect.value;
  const scoreRef   = dbRT.ref('highscores/' + difficulty);
  scoreRef.once('value')
    .then(snapshot => {
      const data = snapshot.val();
      if (!data || timeElapsed < data.score) {
        bestNameInput.classList.remove('hidden');
        bestNameInput.value = '';
        bestNameInput.focus();
        bestNameInput.addEventListener('keydown', bestNameKeyDownHandler);
      } else {
        displayHighScore();
      }
    })
    .catch(console.error);
}

function bestNameKeyDownHandler(e) {
  if (e.key === 'Enter') {
    const difficulty = difficultySelect.value;
    const scoreRef   = dbRT.ref('highscores/' + difficulty);
    scoreRef.set({
      name:       bestNameInput.value,
      score:      timeElapsed,
      difficulty: difficulty,
      timestamp:  firebase.database.ServerValue.TIMESTAMP
    })
    .then(displayHighScore)
    .catch(console.error);
    bestNameInput.removeEventListener('keydown', bestNameKeyDownHandler);
    bestNameInput.classList.add('hidden');
  }
}

function displayHighScore() {
  const difficulty = difficultySelect.value;
  dbRT.ref('highscores/' + difficulty).once('value')
    .then(snapshot => {
      const data = snapshot.val();
      bestRecordElem.textContent = data
        ? `Best: ${data.score}s by ${data.name}`
        : 'Best: N/A';
      bestNameInput.classList.add('hidden');
    })
    .catch(console.error);
}

//
// Custom Win Modal
//
function showWinModal(moves, time) {
  winMessage.textContent = `Moves: ${moves}, Time: ${time}s`;
  winModal.classList.remove('hidden');
}
function hideWinModal() {
  winModal.classList.add('hidden');
  initGame();
}
modalCloseBtn.addEventListener('click', hideWinModal);

//
// Desktop Layout
//
function applyDesktopLayout(totalCards) {
  gameContainer.classList.remove('easy-desktop','normal-desktop','hard-desktop');
  if (window.innerWidth >= 1200) {
    if (totalCards === 8)   gameContainer.classList.add('easy-desktop');
    if (totalCards === 12)  gameContainer.classList.add('normal-desktop');
    if (totalCards === 24)  gameContainer.classList.add('hard-desktop');
  }
}

//
// Init
//
function initGame() {
  movesCount   = 0;
  movesCountElem.textContent = movesCount;
  matchedPairs = 0;
  resetSelections();
  clearInterval(timer);
  startTimer();
  displayHighScore();
  const totalCards = parseInt(difficultySelect.value, 10);
  renderCards(generateCards(totalCards));
  applyDesktopLayout(totalCards);
}

window.addEventListener('resize', () => applyDesktopLayout(parseInt(difficultySelect.value,10)));
difficultySelect.addEventListener('change', initGame);
resetBtn.addEventListener('click', initGame);
window.addEventListener('DOMContentLoaded', initGame);
