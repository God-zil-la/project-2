// =========================
// Memory Game JavaScript with Live Best Name Record
// =========================

// Select DOM elements
const gameContainer = document.getElementById('gameContainer');
const movesCountElem = document.getElementById('movesCount');
const timeCountElem = document.getElementById('timeCount');
const bestRecordElem = document.getElementById('bestRecord');
const bestNameInput = document.getElementById('bestNameInput'); // new input element
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
    values = easyImages.slice(0, totalPairs);
  } else if (totalCards === 16) {
    values = normalImages.slice(0, totalPairs);
  } else if (totalCards === 32) {
    values = hardImages.slice(0, totalPairs);
  } else {
    values = easyImages.slice(0, totalPairs);
  }
  
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
// Best Time Functions (Live Best Score Name Update)
// ---------------------------

function updateBestTime() {
  const difficulty = difficultySelect.value;
  const bestTimeKey = `bestTime-${difficulty}`;
  const bestNameKey = `bestName-${difficulty}`;
  const storedBestTime = localStorage.getItem(bestTimeKey);

  // If no record exists or current time is lower, prompt for new record
  if (!storedBestTime || timeElapsed < parseInt(storedBestTime)) {
    // New record: show the best name input field
    bestNameInput.style.display = 'block';
    bestNameInput.value = ''; // Clear any previous input
    bestNameInput.focus();
    
    // Remove any existing listener to avoid duplicate events
    bestNameInput.removeEventListener('input', bestNameInputHandler);
    bestNameInput.addEventListener('input', bestNameInputHandler);
  } else {
    displayBestTime();
  }
}

function bestNameInputHandler() {
  const difficulty = difficultySelect.value;
  const bestTimeKey = `bestTime-${difficulty}`;
  const bestNameKey = `bestName-${difficulty}`;

  // Save the new record and name live as the user types
  localStorage.setItem(bestTimeKey, timeElapsed);
  localStorage.setItem(bestNameKey, bestNameInput.value);
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
  // Hide the input field after updating the record
  bestNameInput.style.display = 'none';
}