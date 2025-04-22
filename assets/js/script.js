
//////////////////////////
// DOM Elements & State //
//////////////////////////
const gameContainer  = document.getElementById("gameContainer");
const movesCountElem = document.getElementById("movesCount");
const timeCountElem  = document.getElementById("timeCount");
const bestRecordElem = document.getElementById("bestRecord");
const bestNameInput  = document.getElementById("bestNameInput");
const resetBtn       = document.getElementById("resetBtn");
const difficultySelect = document.getElementById("difficulty");
const winModal       = document.getElementById("winModal");
const winText        = document.getElementById("winText");
const playAgainBtn   = document.getElementById("playAgainBtn");

const easyImages   = [
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

let movesCount = 0,
    timer      = null,
    timeElapsed= 0,
    firstCard  = null,
    secondCard = null,
    lockBoard  = false,
    matchedPairs = 0,
    totalPairs = 0;

////////////////////////
// Helpers & Helpers  //
////////////////////////
function shuffleArray(arr){
  for(let i=arr.length-1; i>0; i--){
    const j = Math.floor(Math.random()* (i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

function generateCards(totalCards){
  totalPairs = totalCards/2;
  let src = [];
  if(totalCards===8)   src = easyImages.slice(0,totalPairs);
  if(totalCards===12)  src = normalImages.slice(0,totalPairs);
  if(totalCards===24)  src = hardImages.slice(0,totalPairs);
  const cardVals = shuffleArray([...src, ...src]);
  return cardVals;
}

function renderCards(vals){
  gameContainer.innerHTML = "";
  vals.forEach(url => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back" style="background-image:url('${url}')"></div>
      </div>`;
    card.addEventListener("click", ()=> flipCard(card));
    gameContainer.appendChild(card);
  });
}

function flipCard(card){
  if(lockBoard || card.classList.contains("flipped")||card.classList.contains("matched"))
    return;
  card.classList.add("flipped");
  if(!firstCard){ firstCard = card; return; }
  secondCard = card;
  movesCountElem.textContent = ++movesCount;
  checkForMatch();
}

function checkForMatch(){
  const a = firstCard.querySelector(".card-back").style.backgroundImage;
  const b = secondCard.querySelector(".card-back").style.backgroundImage;
  if(a===b){
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs++;
    resetSelections();
    if(matchedPairs===totalPairs){
      clearInterval(timer);
      setTimeout(showWinModal,500);
    }
  } else {
    lockBoard = true;
    setTimeout(()=>{
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetSelections();
    },1000);
  }
}

function resetSelections(){
  [firstCard, secondCard, lockBoard] = [null,null,false];
}

function startTimer(){
  clearInterval(timer);
  timeElapsed=0;
  timeCountElem.textContent = 0;
  timer = setInterval(()=>{
    timeCountElem.textContent = ++timeElapsed;
  },1000);
}

////////////////////////
// Modal & Best Time  //
////////////////////////
function showWinModal(){
  winText.textContent = `You win! Moves: ${movesCount}, Time: ${timeElapsed}s`;
  winModal.classList.remove("hidden");
}
playAgainBtn.addEventListener("click", ()=>{
  winModal.classList.add("hidden");
  initGame();
});

function updateBestTime(){
  // your existing RTDB high‑score logic can go here
}

////////////////////////
// Layout & Init      //
////////////////////////
function applyDesktopLayout(totalCards){
  gameContainer.classList.remove("easy-desktop","normal-desktop","hard-desktop");
  if(window.innerWidth>=1200){
    if(totalCards===8)   gameContainer.classList.add("easy-desktop");
    if(totalCards===12)  gameContainer.classList.add("normal-desktop");
    if(totalCards===24)  gameContainer.classList.add("hard-desktop");
  }
}

function initGame(){
  movesCount = 0; matchedPairs=0;
  movesCountElem.textContent = 0;
  resetSelections();
  clearInterval(timer);
  startTimer();

  const total = parseInt(difficultySelect.value,10);
  renderCards(generateCards(total));
  applyDesktopLayout(total);
}

window.addEventListener("DOMContentLoaded", initGame);
window.addEventListener("resize", ()=> applyDesktopLayout(parseInt(difficultySelect.value,10)));
difficultySelect.addEventListener("change", initGame);
resetBtn.addEventListener("click", initGame);
