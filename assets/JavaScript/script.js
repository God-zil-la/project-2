/***********************************
 * Tell JSHint that `firebase` is global
 ***********************************/
/* global firebase */

/***********************************
 * (Optional) If you want ES6 checks:
 *   /* jshint esversion: 6 * /
 ***********************************/

// =========================
// Firebase Initialization (RTDB using Compat SDK)
// =========================
var firebaseConfig = {
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
var dbRT = firebase.database(); // Using Realtime Database

// =========================
// DOM Elements & Global Variables
// =========================
var gameContainer = document.getElementById('gameContainer');
var movesCountElem = document.getElementById('movesCount');
var timeCountElem = document.getElementById('timeCount');
var bestRecordElem = document.getElementById('bestRecord');
var bestNameInput = document.getElementById('bestNameInput');
var resetBtn = document.getElementById('resetBtn');
var difficultySelect = document.getElementById('difficulty');

var movesCount = 0;
var timer;
var timeElapsed = 0;
var firstCard = null;
var secondCard = null;
var lockBoard = false;
var matchedPairs = 0;
var totalPairs = 0; // Based on selected difficulty

// =========================
// Image Arrays for Each Difficulty
// =========================
var easyImages = [
  'assets/images/8-card/emoji-1.png',
  'assets/images/8-card/emoji-2.png',
  'assets/images/8-card/emoji-3.png',
  'assets/images/8-card/emoji-4.png'
];

var normalImages = [
  'assets/images/16-card/emoji-1.png',
  'assets/images/16-card/emoji-2.png',
  'assets/images/16-card/emoji-3.png',
  'assets/images/16-card/emoji-4.png',
  'assets/images/16-card/emoji-5.png',
  'assets/images/16-card/emoji-6.png',
  'assets/images/16-card/emoji-7.png',
  'assets/images/16-card/emoji-8.png'
];

var hardImages = [
  'assets/images/32-card/emoji-1.png',
  'assets/images/32-card/emoji-2.png',
  'assets/images/32-card/emoji-3.png',
  'assets/images/32-card/emoji-4.png',
  'assets/images/32-card/emoji-5.png',
  'assets/images/32-card/emoji-6.png',
  'assets/images/32-card/emoji-7.png',
  'assets/images/32-card/emoji-8.png',
  'assets/images/32-card/emoji-9.png',
  'assets/images/32-card/emoji-10.png',
  'assets/images/32-card/emoji-11.png',
  'assets/images/32-card/emoji-12.png',
  'assets/images/32-card/emoji-13.png',
  'assets/images/32-card/emoji-14.png',
  'assets/images/32-card/emoji-15.png',
  'assets/images/32-card/emoji-16.png'
];

// Expert mode: 40 cards (20 pairs) - 20 unique images needed
var expertImages = [
  'assets/images/40-card/emoji-1.png',
  'assets/images/40-card/emoji-2.png',
  'assets/images/40-card/emoji-3.png',
  'assets/images/40-card/emoji-4.png',
  'assets/images/40-card/emoji-5.png',
  'assets/images/40-card/emoji-6.png',
  'assets/images/40-card/emoji-7.png',
  'assets/images/40-card/emoji-8.png',
  'assets/images/40-card/emoji-9.png',
  'assets/images/40-card/emoji-10.png',
  'assets/images/40-card/emoji-11.png',
  'assets/images/40-card/emoji-12.png',
  'assets/images/40-card/emoji-13.png',
  'assets/images/40-card/emoji-14.png',
  'assets/images/40-card/emoji-15.png',
  'assets/images/40-card/emoji-16.png',
  'assets/images/40-card/emoji-17.png',
  'assets/images/40-card/emoji-18.png',
  'assets/images/40-card/emoji-19.png',
  'assets/images/40-card/emoji-20.png'
];

// =========================
// Helper Function: Shuffle Array (Fisher-Yates)
// =========================
function shuffleArray(array) {
  var i, j, temp;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// =========================
// Generate Cards Based on Difficulty (8, 16, 32, or 40 cards)
// =========================
function generateCards(totalCards) {
  totalPairs = totalCards / 2;
  var values = [];
  if (totalCards === 8) {
    values = easyImages.slice(0, totalPairs);
  } else if (totalCards === 16) {
    values = normalImages.slice(0, totalPairs);
  } else if (totalCards === 32) {
    values = hardImages.slice(0, totalPairs);
  } else if (totalCards === 40) {
    values = expertImages.slice(0, totalPairs);
  } else {
    values = easyImages.slice(0, totalPairs);
  }
  var cardValues = values.concat(values); // Duplicate to create pairs
  console.log("Generated card values:", cardValues);
  return shuffleArray(cardValues);
}

// =========================
// Render Cards into the Game Container
// =========================
function renderCards(cardValues) {
  gameContainer.innerHTML = '';
  cardValues.forEach(function(value) {
    var card = document.createElement('div');
    card.classList.add('card');
    
    var cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    
    var cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    
    var cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.style.backgroundImage = 'url(' + value + ')';
    cardBack.style.backgroundSize = 'cover';
    cardBack.style.backgroundPosition = 'center';
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', function() {
      flipCard(card);
    });
    gameContainer.appendChild(card);
  });
}

// =========================
// Card Flip Logic
// =========================
function flipCard(card) {
  if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) {
    return;
  }
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
  var firstValue = firstCard.querySelector('.card-back').style.backgroundImage;
  var secondValue = secondCard.querySelector('.card-back').style.backgroundImage;
  
  if (firstValue === secondValue) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    resetSelections();
    if (matchedPairs === totalPairs) {
      clearInterval(timer);
      setTimeout(function() {
        alert('You win! Moves: ' + movesCount + ', Time: ' + timeElapsed + 's');
        updateBestTime();
      }, 500);
    }
  } else {
    lockBoard = true;
    setTimeout(function() {
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
  timer = setInterval(function() {
    timeElapsed++;
    timeCountElem.textContent = timeElapsed;
  }, 1000);
}

// =========================
// Best Time Functions (RTDB with Live Name Update using Enter Key)
// =========================
function updateBestTime() {
  var difficulty = difficultySelect.value;
  var scoreRef = dbRT.ref('highscores/' + difficulty);
  
  scoreRef.once('value')
    .then(function(snapshot) {
      var data = snapshot.val();
      console.log("Fetched high score data:", data);
      if (!data || timeElapsed < data.score) {
        bestNameInput.style.display = 'block';
        bestNameInput.value = '';
        bestNameInput.focus();
        bestNameInput.addEventListener('keydown', bestNameKeyDownHandler);
      } else {
        displayHighScore();
      }
    })
    .catch(function(error) {
      console.error("Error fetching high score:", error);
    });
}

function bestNameKeyDownHandler(e) {
  if (e.key === 'Enter') {
    var difficulty = difficultySelect.value;
    var scoreRef = dbRT.ref('highscores/' + difficulty);
    
    scoreRef.set({
      name: bestNameInput.value,
      score: timeElapsed,
      difficulty: difficulty,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    })
    .then(function() {
      displayHighScore();
    })
    .catch(function(error) {
      console.error("Error updating high score:", error);
    });
    
    bestNameInput.removeEventListener('keydown', bestNameKeyDownHandler);
    bestNameInput.style.display = 'none';
  }
}

function displayHighScore() {
  var difficulty = difficultySelect.value;
  var scoreRef = dbRT.ref('highscores/' + difficulty);
  
  scoreRef.once('value')
    .then(function(snapshot) {
      var data = snapshot.val();
      console.log("Display high score data:", data);
      if (data) {
        bestRecordElem.textContent = 'Best: ' + data.score + 's by ' + data.name;
      } else {
        bestRecordElem.textContent = "Best: N/A";
      }
      bestNameInput.style.display = 'none';
    })
    .catch(function(error) {
      console.error("Error displaying high score:", error);
    });
}

// =========================
// Desktop Layout Adjustments
// =========================
function applyDesktopLayout(totalCards) {
  gameContainer.classList.remove('easy-desktop', 'normal-desktop', 'hard-desktop', 'expert-desktop');
  if (window.innerWidth >= 1200) {
    if (totalCards === 8) {
      gameContainer.classList.add('easy-desktop');
    } else if (totalCards === 16) {
      gameContainer.classList.add('normal-desktop');
    } else if (totalCards === 32) {
      gameContainer.classList.add('hard-desktop');
    } else if (totalCards === 40) {
      gameContainer.classList.add('expert-desktop');
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
  
  displayHighScore(); // Show high score if any
  
  var totalCards = parseInt(difficultySelect.value, 10);
  var cardValues = generateCards(totalCards);
  renderCards(cardValues);
  applyDesktopLayout(totalCards);
}

// Reapply desktop layout on window resize
window.addEventListener('resize', function() {
  var totalCards = parseInt(difficultySelect.value, 10);
  applyDesktopLayout(totalCards);
});

// Change difficulty and reset game
difficultySelect.addEventListener('change', initGame);
resetBtn.addEventListener('click', initGame);

// Start the game when DOM is loaded
window.addEventListener('DOMContentLoaded', initGame);
