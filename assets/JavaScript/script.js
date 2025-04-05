// =========================
// Firebase Initialization (RTDB using Compat SDK)
// =========================
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

// =========================
// DOM Elements and Global Variables
// =========================
const gameContainer = document.getElementById('gameContainer');
const movesCountElem = document.getElementById('movesCount');
const timeCountElem = document.getElementById('timeCount');
const bestRecordElem = document.getElementById('bestRecord');
const bestNameInput = document.getElementById('bestNameInput');
const resetBtn = document.getElementById('resetBtn');
const difficultySelect = document.getElementById('difficulty');

let movesCount = 0;
let timer;
let timeElapsed = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 0; // Set based on difficulty

// =========================
// Image Arrays for Each Difficulty
// =========================
const easyImages = [
  'assets/images/8-card/emoji-1.png',
  'assets/images/8-card/emoji-2.png',
  'assets/images/8-card/emoji-3.png',
  'assets/images/8-card/emoji-4.png'
];

// Normal Mode: 8 unique images for 16 cards (8 pairs)
const normalImages = [
  'assets/images/16-card/emoji-1.png',
  'assets/images/16-card/emoji-2.png',
  'assets/images/16-card/emoji-3.png',
  'assets/images/16-card/emoji-4.png',
  'assets/images/16-card/emoji-5.png',
  'assets/images/16-card/emoji-6.png',
  'assets/images/16-card/emoji-7.png',
  'assets/images/16-card/emoji-8.png'
];

// Hard Mode: 16 unique images for 32 cards (16 pairs)
const hardImages = [
  'assets/images/16-card/emoji-1.png',
  'assets/images/16-card/emoji-2.png',
  'assets/images/16-card/emoji-3.png',
  'assets/images/16-card/emoji-4.png',
  'assets/images/16-card/emoji-5.png',
  'assets/images/16-card/emoji-6.png',
  'assets/images/16-card/emoji-7.png',
  'assets/images/16-card/emoji-8.png',
  'assets/images/32-card/emoji-9.png',
  'assets/images/32-card/emoji-10.png',
  'assets/images/32-card/emoji-11.png',
  'assets/images/32-card/emoji-12.png',
  'assets/images/32-card/emoji-13.png',
  'assets/images/32-card/emoji-14.png',
  'assets/images/32-card/emoji-15.png',
  'assets/images/32-card/emoji-16.png'
];

// =========================
// Helper: Shuffle Array (Fisher-Yates)
// =========================
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// =========================
// Generate Cards Based on Difficulty (8, 16, 32)
// =========================
function generateCards(totalCards) {
  totalPairs = totalCards / 2;
  let values = [];
  if (totalCards === 8) {
    values = easyImages.slice(0, totalPairs);
  } else if (totalCards === 16) {
    values = normalImages.slice(0, totalPairs);
  } else if (totalCards === 32) {
    values = hardImages.slice(0, totalPairs);
  } else {
    values = easyImages.slice(0, totalPairs);
  }
  let cardValues = values.concat(values);
  console.log("Generated card values:", cardValues);
  return shuffleArray(cardValues);
}

// =========================
// Render Cards
// =========================
function renderCards(cardValues) {
  gameContainer.innerHTML = '';
  cardValues.forEach(value => {
    const card = document.createElement('div');
    card.classList.add('card');
    
    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.style.backgroundImage = `url('${value}')`;
    cardBack.style.backgroundSize = 'cover';
    cardBack.style.backgroundPosition = 'center';
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', () => flipCard(card));
    gameContainer.appendChild(card);
  });
}

// =========================
// Card Flip Logic
// =========================
function flipCard(card) {
  if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  
  if (!firstCard) {
    firstCard = card;
    return;
  }
  
  secondCard = card;
  movesCount++;
  movesCountElem.textContent = movesCount;
  checkForMatch();
}

function checkForMatch() {
  const firstValue = firstCard.querySelector('.card-back').style.backgroundImage;
  const secondValue = secondCard.querySelector('.card-back').style.backgroundImage;
  
  if (firstValue === secondValue) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    resetSelections();
    if (matchedPairs === totalPairs) {
      clearInterval(timer);
      setTimeout(() => {
        alert(`You win! Moves: ${movesCount}, Time: ${timeElapsed}s`);
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
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// =========================
// Timer Functions
// =========================
function startTimer() {
  clearInterval(timer);
  timeElapsed = 0;
  timeCountElem.textContent = timeElapsed;
  timer = setInterval(() => {
    timeElapsed++;
    timeCountElem.textContent = timeElapsed;
  }, 1000);
}

// =========================
// Best Time Functions (RTDB Integration with Live Name Update)
// =========================
// We now use a keydown listener so that the input field stays until Enter is pressed.
function updateBestTime() {
  const difficulty = difficultySelect.value;
  const scoreRef = dbRT.ref('highscores/' + difficulty);
  
  scoreRef.once('value')
    .then(snapshot => {
      const data = snapshot.val();
      console.log("Fetched high score data:", data);
      // If no record exists or current time is better
      if (!data || timeElapsed < data.score) {
        bestNameInput.style.display = 'block';
        bestNameInput.value = '';
        bestNameInput.focus();
        bestNameInput.addEventListener('keydown', bestNameKeyDownHandler);
      } else {
        displayHighScore();
      }
    })
    .catch(error => {
      console.error("Error fetching high score:", error);
    });
}

function bestNameKeyDownHandler(e) {
  if (e.key === 'Enter') {
    const difficulty = difficultySelect.value;
    const scoreRef = dbRT.ref('highscores/' + difficulty);
    
    scoreRef.set({
      name: bestNameInput.value,
      score: timeElapsed,
      difficulty: difficulty,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    })
    .then(() => {
      displayHighScore();
    })
    .catch(error => {
      console.error("Error updating high score:", error);
    });
    
    bestNameInput.removeEventListener('keydown', bestNameKeyDownHandler);
    bestNameInput.style.display = 'none';
  }
}

function displayHighScore() {
  const difficulty = difficultySelect.value;
  const scoreRef = dbRT.ref('highscores/' + difficulty);
  
  scoreRef.once('value')
    .then(snapshot => {
      const data = snapshot.val();
      console.log("Display high score data:", data);
      if (data) {
        bestRecordElem.textContent = `Best: ${data.score}s by ${data.name}`;
      } else {
        bestRecordElem.textContent = "Best: N/A";
      }
      bestNameInput.style.display = 'none';
    })
    .catch(error => {
      console.error("Error displaying high score:", error);
    });
}

// =========================
// Desktop Layout Adjustments
// =========================
function applyDesktopLayout(totalCards) {
  gameContainer.classList.remove('easy-desktop', 'normal-desktop', 'hard-desktop');
  if (window.innerWidth >= 1200) {
    if (totalCards === 8) {
      gameContainer.classList.add('easy-desktop');
    } else if (totalCards === 16) {
      gameContainer.classList.add('normal-desktop');
    } else if (totalCards === 32) {
      gameContainer.classList.add('hard-desktop');
    }
  }
}

// =========================
// Initialize the Game
// =========================
function initGame() {
  movesCount = 0;
  movesCountElem.textContent = movesCount;
  matchedPairs = 0;
  resetSelections();
  clearInterval(timer);
  startTimer();
  
  // Set up the realtime listener to display the current high score
  displayHighScore();
  
  const totalCards = parseInt(difficultySelect.value, 10);
  const cardValues = generateCards(totalCards);
  renderCards(cardValues);
  applyDesktopLayout(totalCards);
}

// Reapply desktop layout on window resize
window.addEventListener('resize', () => {
  const totalCards = parseInt(difficultySelect.value, 10);
  applyDesktopLayout(totalCards);
});

// Event listeners for difficulty change and reset button
difficultySelect.addEventListener('change', initGame);
resetBtn.addEventListener('click', initGame);

// Start the game when DOM is fully loaded
window.addEventListener('DOMContentLoaded', initGame);