///////////////////////////////
// DOM Elements & Game State //
///////////////////////////////

/** @type {HTMLDivElement} Main board container */
const gameContainer  = document.getElementById("game-container");
/** @type {HTMLElement} Displays move counter */
const movesCountElem = document.getElementById("moves-count");
/** @type {HTMLElement} Displays elapsed seconds */
const timeCountElem  = document.getElementById("time-count");
/** @type {HTMLInputElement} Input where winner writes their name */
const bestNameInput  = document.getElementById("best-name-input");
/** @type {HTMLButtonElement} Resets the game */
const resetBtn       = document.getElementById("reset-btn");
/** @type {HTMLSelectElement} Difficulty dropdown (8/12/24) */
const difficultySelect = document.getElementById("difficulty-select");
/** @type {HTMLDivElement} Victory modal overlay */
const winModal       = document.getElementById("win-modal");
/** @type {HTMLElement} Paragraph that shows win stats */
const winText        = document.getElementById("win-text");
/** @type {HTMLButtonElement} Plays again from the modal */
const playAgainBtn   = document.getElementById("play-again-btn");

//////////////////////////
// Card Image Sources   //
//////////////////////////

/** @constant {string[]} Easy‑level images (4 distinct, duplicated => 8 cards) */
const easyImages   = [
  "assets/images/8-card/emoji-1.png",
  "assets/images/8-card/emoji-2.png",
  "assets/images/8-card/emoji-3.png",
  "assets/images/8-card/emoji-4.png"
];
/** @constant {string[]} Normal‑level images (6 distinct, duplicated => 12 cards) */
const normalImages = [
  "assets/images/12-card/emoji-1.png",
  "assets/images/12-card/emoji-2.png",
  "assets/images/12-card/emoji-3.png",
  "assets/images/12-card/emoji-4.png",
  "assets/images/12-card/emoji-5.png",
  "assets/images/12-card/emoji-6.png"
];
/** @constant {string[]} Hard‑level images (12 distinct, duplicated => 24 cards) */
const hardImages   = [
  "assets/images/24-card/emoji-1.png",
  "assets/images/24-card/emoji-2.png",
  "assets/images/24-card/emoji-3.png",
  "assets/images/24-card/emoji-4.png",
  "assets/images/24-card/emoji-5.png",
  "assets/images/24-card/emoji-6.png",
  "assets/images/24-card/emoji-7.png",
  "assets/images/24-card/emoji-8.png",
  "assets/images/24-card/emoji-9.png",
  "assets/images/24-card/emoji-10.png",
  "assets/images/24-card/emoji-11.png",
  "assets/images/24-card/emoji-12.png"
];

//////////////////////////
// Mutable State        //
//////////////////////////

let movesCount   = 0;      // number of flips performed by the player
let timer        = null;   // setInterval handle
let timeElapsed  = 0;      // seconds elapsed since start
let firstCard    = null;   // first flipped card element
let secondCard   = null;   // second flipped card element
let lockBoard    = false;  // guards against triple‑clicking while two cards showing
let matchedPairs = 0;      // how many pairs are matched
let totalPairs   = 0;      // total pairs for current difficulty

//////////////////////////
// Utility Functions    //
//////////////////////////

/**
 * In‑place shuffle (Fisher–Yates) of the provided array.
 *
 * @template T
 * @param {T[]} arr – Array to shuffle.
 * @returns {T[]} The same array reference, now randomised.
 */
function shuffleArray(arr){
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build a duplicated & shuffled list of card image URLs based on difficulty.
 *
 * @param {number} totalCards – 8, 12, or 24 (must be even).
 * @returns {string[]} Array length `totalCards` containing image URLs.
 */
function generateCards(totalCards){
  totalPairs = totalCards / 2;

  let src = [];
  if (totalCards === 8)  src = easyImages.slice(0, totalPairs);
  if (totalCards === 12) src = normalImages.slice(0, totalPairs);
  if (totalCards === 24) src = hardImages.slice(0, totalPairs);

  return shuffleArray([...src, ...src]);
}

/**
 * Render card elements into the DOM and wire their click handlers.
 *
 * @param {string[]} urls – Shuffled array of back‑image URLs.
 * @returns {void}
 */
function renderCards(urls){
  gameContainer.innerHTML = "";

  urls.forEach(url => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back" style="background-image:url('${url}')"></div>
      </div>`;

    card.addEventListener("click", () => flipCard(card));
    gameContainer.appendChild(card);
  });
}

/**
 * Flip a card. When two cards are up, check for a match.
 *
 * @param {HTMLElement} card – The card element clicked by the user.
 * @returns {void}
 */
function flipCard(card){
  if (lockBoard || card.classList.contains("flipped") || card.classList.contains("matched"))
    return;

  card.classList.add("flipped");

  if (!firstCard){
    firstCard = card; // first selection
    return;
  }

  secondCard = card; // second selection
  movesCountElem.textContent = ++movesCount;

  checkForMatch();
}

/**
 * Compare the two selected cards; if they match, mark as paired, else flip back.
 * Ends the game when all pairs are matched.
 *
 * @returns {void}
 */
function checkForMatch(){
  const imgA = firstCard .querySelector(".card-back").style.backgroundImage;
  const imgB = secondCard.querySelector(".card-back").style.backgroundImage;

  if (imgA === imgB){
    firstCard .classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs++;
    resetSelections();

    if (matchedPairs === totalPairs){ // win condition
      clearInterval(timer);
      setTimeout(showWinModal, 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard .classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetSelections();
    }, 1000);
  }
}

/**
 * Clear selected cards and unlock further clicks.
 *
 * @returns {void}
 */
function resetSelections(){
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

/**
 * Start (or restart) the game timer, updating the display each second.
 *
 * @returns {void}
 */
function startTimer(){
  clearInterval(timer);
  timeElapsed = 0;
  timeCountElem.textContent = 0;

  timer = setInterval(() => {
    timeCountElem.textContent = ++timeElapsed;
  }, 1000);
}

//////////////////////////
// Modal & Records      //
//////////////////////////

/**
 * Populate and show the victory modal.
 *
 * @returns {void}
 */
function showWinModal(){
  winText.textContent = `You win! Moves: ${movesCount}, Time: ${timeElapsed}s`;
  winModal.classList.remove("hidden");
}

playAgainBtn.addEventListener("click", () => {
  winModal.classList.add("hidden");
  initGame();
});

/**
 * Stub for high‑score storage.
 * Insert your database logic if desired.
 *
 * @returns {void}
 */
function updateBestTime(){
  // TODO: implement persistent high‑score logic
}

//////////////////////////
// Layout Helpers       //
//////////////////////////

/**
 * Adds desktop CSS classes so the grid snaps to fixed columns on large screens.
 *
 * @param {number} totalCards – Deck size (8, 12, or 24).
 * @returns {void}
 */
function applyDesktopLayout(totalCards){
  gameContainer.classList.remove("easy-desktop", "normal-desktop", "hard-desktop");

  if (window.innerWidth >= 1200){
    if (totalCards === 8)  gameContainer.classList.add("easy-desktop");
    if (totalCards === 12) gameContainer.classList.add("normal-desktop");
    if (totalCards === 24) gameContainer.classList.add("hard-desktop");
  }
}

//////////////////////////
// Game Initialiser     //
//////////////////////////

/**
 * Reset state, build a new shuffled board, apply responsive layout, and start timer.
 *
 * @returns {void}
 */
function initGame(){
  movesCount = 0;
  matchedPairs = 0;
  movesCountElem.textContent = 0;
  resetSelections();

  clearInterval(timer);
  startTimer();

  const total = parseInt(difficultySelect.value, 10);
  renderCards(generateCards(total));
  applyDesktopLayout(total);
}

//////////////////////////
// Event Listeners      //
//////////////////////////

window.addEventListener("DOMContentLoaded", initGame);
window.addEventListener("resize", () => applyDesktopLayout(parseInt(difficultySelect.value, 10)));
difficultySelect.addEventListener("change", initGame);
resetBtn.addEventListener("click", initGame);
