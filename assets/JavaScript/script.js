// =========================
// Memory Game JavaScript
// =========================

// Select DOM elements
const gameContainer = document.getElementById('gameContainer');
const movesCountElem = document.getElementById('movesCount');
const timeCountElem = document.getElementById('timeCount');
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
// Define image arrays for each difficulty
// ---------------------------

// Easy Mode: 4 unique images for 8 cards (4 pairs)
const easyImages = [
  'assets/images/8-card/bird-1.png',
  'assets/images/8-card/bird-2.png',
  'assets/images/8-card/bird-3.png',
  'assets/images/8-card/bird-4.png'
];

// Normal Mode: 8 unique images for 16 cards (8 pairs)
const normalImages = [
  'assets/images/16-card/bird-1.png',
  'assets/images/16-card/bird-2.png',
  'assets/images/16-card/bird-3.png',
  'assets/images/16-card/bird-4.png',
  'assets/images/16-card/bird-5.png',
  'assets/images/16-card/bird-6.png',
  'assets/images/16-card/bird-7.png',
  'assets/images/16-card/bird-8.png'
];

// Hard Mode: 16 unique images for 32 cards (16 pairs)
const hardImages = [
  'assets/images/32-card/bird-1.png',
  'assets/images/32-card/bird-2.png',
  'assets/images/32-card/bird-3.png',
  'assets/images/32-card/bird-4.png',
  'assets/images/32-card/bird-5.png',
  'assets/images/32-card/bird-6.png',
  'assets/images/32-card/bird-7.png',
  'assets/images/32-card/bird-8.png',
  'assets/images/32-card/bird-9.png',
  'assets/images/32-card/bird-10.png',
  'assets/images/32-card/bird-11.png',
  'assets/images/32-card/bird-12.png',
  'assets/images/32-card/bird-13.png',
  'assets/images/32-card/bird-14.png',
  'assets/images/32-card/bird-15.png',
  'assets/images/32-card/bird-16.png'
];

// ---------------------------
// Helper function: Shuffle array (Fisher-Yates)
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
    // Easy mode: use easyImages (4 unique images)
    values = easyImages.slice(0, totalPairs);
  } else if (totalCards === 16) {
    // Normal mode: use normalImages (8 unique images)
    values = normalImages.slice(0, totalPairs);
  } else if (totalCards === 32) {
    // Hard mode: use hardImages (16 unique images)
    values = hardImages.slice(0, totalPairs);
  } else {
    // Fallback: use easyImages if an unexpected value is given
    values = easyImages.slice(0, totalPairs);
  }
  
  // Duplicate to form pairs and shuffle the combined array
  let cardValues = values.concat(values);
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
    // Set the background image to the image file
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
// Flip card logic
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
// Desktop layout adjustments
// On desktop (≥1200px), we want fixed column counts.
// Easy: 8 cards → 2 rows x 4 columns (class: easy-desktop)
// Normal: 16 cards → 2 rows x 8 columns (class: normal-desktop)
// Hard: 32 cards → 4 rows x 8 columns (class: hard-desktop)
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
  
  // Get total number of cards from the difficulty selector (8, 16, or 32)
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

// Start the game when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', initGame);
