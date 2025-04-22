/* global firebase */

// ——— Firebase init ———
const firebaseConfig = {
  apiKey: "...", authDomain: "...",
  databaseURL: "...", /* etc */
};
firebase.initializeApp(firebaseConfig);
const dbRT = firebase.database();

// ——— DOM refs ———
const gameContainer    = document.getElementById('gameContainer');
const movesCountElem   = document.getElementById('movesCount');
const timeCountElem    = document.getElementById('timeCount');
const bestRecordElem   = document.getElementById('bestRecord');
const bestNameInput    = document.getElementById('bestNameInput');
const resetBtn         = document.getElementById('resetBtn');
const difficultySelect = document.getElementById('difficulty');
const winModal         = document.getElementById('winModal');
const winMessage       = document.getElementById('winMessage');
const modalCloseBtn    = document.getElementById('modalCloseBtn');

// ——— Image arrays ———
const easyImages   = [/* four 8-card URLs */];
const normalImages = [/* six 12-card URLs */];
const hardImages   = [/* twelve 24-card URLs */];

// ——— State ———
let movesCount   = 0;
let timer, timeElapsed = 0;
let firstCard, secondCard = null;
let lockBoard    = false;
let matchedPairs = 0;
let totalPairs   = 0;

// ——— Helpers ———
function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateCards(count) {
  totalPairs = count / 2;
  let values = [];
  if (count === 8)      values = easyImages.slice(0, totalPairs);
  else if (count === 12) values = normalImages.slice(0, totalPairs);
  else if (count === 24) values = hardImages.slice(0, totalPairs);
  else {
    console.warn(`Unknown count ${count}, defaulting to 8`);
    values = easyImages.slice(0, totalPairs);
  }
  return shuffleArray(values.concat(values));
}

function renderCards(vals) {
  gameContainer.innerHTML = '';
  vals.forEach(url => {
    const card = document.createElement('div');
    card.className = 'card';
    const inner = document.createElement('div');
    inner.className = 'card-inner';
    const front = document.createElement('div');
    front.className = 'card-front';
    const back  = document.createElement('div');
    back.className = 'card-back';
    back.style.backgroundImage = `url(${url})`;
    inner.append(front, back);
    card.append(inner);
    card.addEventListener('click', () => flipCard(card));
    gameContainer.append(card);
  });
}

// ——— Flip & match ———
function flipCard(card) {
  if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  if (!firstCard) { firstCard = card; return; }
  secondCard = card;
  movesCountElem.textContent = ++movesCount;
  checkForMatch();
}

function checkForMatch() {
  const a = firstCard.querySelector('.card-back').style.backgroundImage;
  const b = secondCard.querySelector('.card-back').style.backgroundImage;
  if (a === b) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    resetPick();
    if (matchedPairs === totalPairs) {
      clearInterval(timer);
      setTimeout(() => {
        showWinModal();
        updateBestTime();
      }, 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetPick();
    }, 1000);
  }
}

function resetPick() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// ——— Timer ———
function startTimer() {
  clearInterval(timer);
  timeElapsed = 0;
  timeCountElem.textContent = 0;
  timer = setInterval(() => { timeCountElem.textContent = ++timeElapsed; }, 1000);
}

// ——— High score ———
function updateBestTime() {
  const diff = difficultySelect.value;
  dbRT.ref(`highscores/${diff}`).once('value')
    .then(snap => {
      const d = snap.val();
      if (!d || timeElapsed < d.score) {
        bestNameInput.classList.remove('hidden');
        bestNameInput.value = '';
        bestNameInput.focus();
        bestNameInput.addEventListener('keydown', nameHandler);
      } else displayHighScore();
    })
    .catch(console.error);
}

function nameHandler(e) {
  if (e.key === 'Enter') {
    const diff = difficultySelect.value;
    dbRT.ref(`highscores/${diff}`).set({
      name: bestNameInput.value,
      score: timeElapsed,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    })
    .then(displayHighScore)
    .catch(console.error);
    bestNameInput.removeEventListener('keydown', nameHandler);
    bestNameInput.classList.add('hidden');
  }
}

function displayHighScore() {
  const diff = difficultySelect.value;
  dbRT.ref(`highscores/${diff}`).once('value')
    .then(snap => {
      const d = snap.val();
      bestRecordElem.textContent = d
        ? `Best: ${d.score}s by ${d.name}`
        : 'Best: N/A';
      bestNameInput.classList.add('hidden');
    })
    .catch(console.error);
}

// ——— Win modal ———
function showWinModal() {
  winMessage.textContent = `Moves: ${movesCount}, Time: ${timeElapsed}s`;
  winModal.classList.remove('hidden');
}
modalCloseBtn.addEventListener('click', () => {
  winModal.classList.add('hidden');
  initGame();
});

// ——— Desktop grid tweaks ———
function applyDesktop(count) {
  gameContainer.classList.remove('easy-desktop','normal-desktop','hard-desktop');
  if (window.innerWidth >= 1200) {
    if (count === 8)   gameContainer.classList.add('easy-desktop');
    if (count === 12)  gameContainer.classList.add('normal-desktop');
    if (count === 24)  gameContainer.classList.add('hard-desktop');
  }
}

// ——— Init ———
function initGame() {
  movesCount = 0;
  movesCountElem.textContent = 0;
  matchedPairs = 0;
  resetPick();
  clearInterval(timer);
  startTimer();
  displayHighScore();
  const total = parseInt(difficultySelect.value, 10);
  renderCards(generateCards(total));
  applyDesktop(total);
}

window.addEventListener('resize', () => applyDesktop(parseInt(difficultySelect.value,10)));
difficultySelect.addEventListener('change', initGame);
resetBtn.addEventListener('click', initGame);
window.addEventListener('DOMContentLoaded', initGame);
