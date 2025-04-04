// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ4xlHJ-gw1i-njOeuoX5shRtJ6G7vg8I",
  authDomain: "memory-b0d16.firebaseapp.com",
  projectId: "memory-b0d16",
  storageBucket: "memory-b0d16.firebasestorage.app",
  messagingSenderId: "1081029476081",
  appId: "1:1081029476081:web:0678dc8a912cd8f202b350",
  measurementId: "G-PXM46CJPCW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// =========================
// Select DOM Elements
// =========================
const gameContainer = document.getElementById('gameContainer');
const movesCountElem = document.getElementById('movesCount');
const timeCountElem = document.getElementById('timeCount');
const bestRecordElem = document.getElementById('bestRecord');
const bestNameInput = document.getElementById('bestNameInput');
const resetBtn = document.getElementById('resetBtn');
const difficultySelect = document.getElementById('difficulty');

// =========================
// Global Game Variables
// =========================
let movesCount = 0;
let timer;
let timeElapsed = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 0; // will be set based on selected difficulty

// =========================
// Image Arrays for Each Difficulty
// =========================
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

// =========================
// Helper Function: Shuffle Array (Fisher-Yates)
// =========================
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// =========================
// Generate Cards Based on Difficulty
// totalCards will be 8, 16, or 32
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
  let cardValues = values.concat(values); // duplicate for pairs
  return shuffleArray(cardValues);
}

// =========================
// Render Cards into the Game Container
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
// Best Time Functions with Live Name Update (Firebase Integrated)
// =========================

// Update the best time record in Firebase Firestore and local display
function updateBestTime() {
  const difficulty = difficultySelect.value;
  // We'll use document IDs based on difficulty for simplicity
  const docId = difficulty;
  const highScoreRef = db.collection('highscores').doc(docId);
  
  highScoreRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      // If current time is lower than the stored time, or no record exists
      if (!data.score || timeElapsed < data.score) {
        // Show live input field for best name update
        bestNameInput.style.display = 'block';
        bestNameInput.value = '';
        bestNameInput.focus();
        bestNameInput.addEventListener('input', bestNameInputHandler);
      } else {
        displayBestTime();
      }
    } else {
      // No record exists yet, so show input field for new record
      bestNameInput.style.display = 'block';
      bestNameInput.value = '';
      bestNameInput.focus();
      bestNameInput.addEventListener('input', bestNameInputHandler);
    }
  }).catch(error => {
    console.error("Error fetching high score: ", error);
  });
}

// Handler for live best name input event
function bestNameInputHandler() {
  const difficulty = difficultySelect.value;
  const docId = difficulty;
  const highScoreRef = db.collection('highscores').doc(docId);
  
  // Save the new best score and name as the user types
  highScoreRef.set({
    name: bestNameInput.value,
    score: timeElapsed,
    difficulty: difficulty,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    displayBestTime();
  }).catch(error => {
    console.error("Error updating best score: ", error);
  });
  
  // Optionally, you could debounce this event if needed.
}

// Display best time record from Firebase
function displayBestTime() {
  const difficulty = difficultySelect.value;
  const docId = difficulty;
  const highScoreRef = db.collection('highscores').doc(docId);
  
  highScoreRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      bestRecordElem.textContent = `Best: ${data.score}s by ${data.name}`;
    } else {
      bestRecordElem.textContent = "Best: N/A";
    }
    // Hide the input field after updating
    bestNameInput.style.display = 'none';
    // Remove event listener to prevent duplicate triggers
    bestNameInput.removeEventListener('input', bestNameInputHandler);
  }).catch(error => {
    console.error("Error displaying best score: ", error);
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
  
  // Display the best score for the current difficulty
  displayBestTime();
  
  // Get total number of cards from the difficulty selector (8, 16, or 32)
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

// Start the game when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', initGame);