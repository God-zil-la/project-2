// =========================
// Memory Game JavaScript with Best Time Record
// =========================

// Select DOM elements
const gameContainer = document.getElementById('gameContainer');
const movesCountElem = document.getElementById('movesCount');
const timeCountElem = document.getElementById('timeCount');
const bestRecordElem = document.getElementById('bestRecord'); // New element for best record display
const resetBtn = document.getElementById('resetBtn');
const difficultySelect = document.getElementById('difficulty');

// Global game variables
let movesCount = 0;
let timer;
let timeElapsed = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 0; // determined by difficulty

// ---------------------------
// Image arrays for each difficulty
// ---------------------------

// Easy Mode: 4 unique images for 8 cards (4 pairs)
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

// ---------------------------
// Helper: Shuffle Array (Fisher-Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ---------------------------
// Generate cards based on difficulty (totalCards: 8, 16, or 32)
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
  
  let cardValues = values.concat(values); // duplicate for pairs
  return shuffleArray(cardValues);
}

// ---------------------------
// Render cards into the game container
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
    // Set the background image using the provided value
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

// ---------------------------
// Card flip logic
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

// ---------------------------
// Timer functions
function startTimer() {
  clearInterval(timer);
  timeElapsed = 0;
  timeCountElem.textContent = timeElapsed;
  timer = setInterval(() => {
    timeElapsed++;
    timeCountElem.textContent = timeElapsed;
  }, 1000);
}

// ---------------------------
// Best Time Functions
// Uses localStorage with keys based on difficulty (8, 16, or 32)
function updateBestTime() {
  const difficulty = difficultySelect.value;
  const bestTimeKey = `bestTime-${difficulty}`;
  const bestNameKey = `bestName-${difficulty}`;
  const storedBestTime = localStorage.getItem(bestTimeKey);
  
  if (!storedBestTime || timeElapsed < parseInt(storedBestTime)) {
    // New record achieved
    const playerName = prompt("New Record! Enter your name:");
    localStorage.setItem(bestTimeKey, timeElapsed);
    localStorage.setItem(bestNameKey, playerName);
    alert(`New record set by ${playerName} with ${timeElapsed} seconds!`);
  }
  
  displayBestTime();
}

function displayBestTime() {
  const difficulty = difficultySelect.value;
  const bestTimeKey = `bestTime-${difficulty}`;
  const bestNameKey = `bestName-${difficulty}`;
  const storedBestTime = localStorage.getItem(bestTimeKey);
  const storedBestName = localStorage.getItem(bestNameKey);
  
  if (storedBestTime && storedBestName) {
    bestRecordElem.textContent = `Best: ${storedBestTime}s by ${storedBestName}`;
  } else {
    bestRecordElem.textContent = `Best: N/A`;
  }
}

// ---------------------------
// Desktop layout adjustments
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

// ---------------------------
// Initialize the game
function initGame() {
  movesCount = 0;
  movesCountElem.textContent = movesCount;
  matchedPairs = 0;
  resetSelections();
  clearInterval(timer);
  startTimer();
  
  // Display best record for current difficulty
  displayBestTime();
  
  // Get total cards from difficulty selector (8, 16, or 32)
  const totalCards = parseInt(difficultySelect.value, 10);
  const cardValues = generateCards(totalCards);
  renderCards(cardValues);
  applyDesktopLayout(totalCards);
}

// Reapply desktop layout on window resize (optional)
window.addEventListener('resize', () => {
  const totalCards = parseInt(difficultySelect.value, 10);
  applyDesktopLayout(totalCards);
});

// Event listeners for difficulty change and reset button
difficultySelect.addEventListener('change', initGame);
resetBtn.addEventListener('click', initGame);

// Start the game on DOM load
window.addEventListener('DOMContentLoaded', initGame);