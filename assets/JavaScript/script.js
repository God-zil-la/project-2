// Select DOM elements
const userGuess = document.getElementById("userGuess");
const guessBtn = document.getElementById("guessBtn");
const feedback = document.getElementById("feedback");
const attemptsDisplay = document.getElementById("attempts");
const resetBtn = document.getElementById("resetBtn");

// Generate a random number between 1 and 100
let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let gameActive = true; // to prevent more guesses after correct answer

// Listen for the Guess button click
guessBtn.addEventListener("click", function () {
  if (!gameActive) return; // Stop if game is already over

  const guessValue = parseInt(userGuess.value, 10);

  // Basic validation
  if (isNaN(guessValue) || guessValue < 1 || guessValue > 100) {
    feedback.textContent = "Please enter a valid number between 1 and 100.";
    feedback.style.color = "red";
    return;
  }

  attempts++;
  attemptsDisplay.textContent = `Attempts: ${attempts}`;

  if (guessValue === randomNumber) {
    feedback.textContent = "Correct! You guessed the number!";
    feedback.style.color = "green";
    gameActive = false;
    showResetButton();
  } else if (guessValue < randomNumber) {
    feedback.textContent = "Too low! Try a higher number.";
    feedback.style.color = "red";
  } else {
    feedback.textContent = "Too high! Try a lower number.";
    feedback.style.color = "red";
  }
});

// Show Reset Button
function showResetButton() {
  resetBtn.style.display = "inline-block";
}

// Reset the game
resetBtn.addEventListener("click", function () {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  gameActive = true;

  // Clear UI
  userGuess.value = "";
  feedback.textContent = "";
  feedback.style.color = "#333";
  attemptsDisplay.textContent = "Attempts: 0";
  resetBtn.style.display = "none";
});
