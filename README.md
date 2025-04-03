Math Guessing Game
A simple guessing game built with HTML5, CSS3, and JavaScript. The user must guess a random number between 1 and 100, receiving hints (“too high,” “too low”) until they guess correctly.

Table of Contents
Overview

Project Structure

Installation

Usage

Game Rules

Features & Future Enhancements

Contributing

License

Overview
This project demonstrates fundamental web development concepts:

Semantic HTML5 for structure

CSS3 for styling and responsive design

JavaScript for dynamic behavior and game logic

Technologies Used
HTML5

CSS3

JavaScript (ES6+)

Project Structure
markdown
Kopiera
Redigera
project-2/
  ├─ index.html
  ├─ assets/
  │   └─ styles.css/
  │       └─ styles.css
  └─ javascript/
      └─ script.js
index.html
The main entry point of the game, containing the HTML layout and references to the CSS and JS files.

assets/styles.css/styles.css
The primary stylesheet for the game’s layout, colors, and responsiveness.

javascript/script.js
The JavaScript logic for generating the random number, tracking attempts, validating guesses, and displaying feedback.

Installation
Clone or download this repository to your local machine.

Open index.html in your preferred web browser (Chrome, Firefox, Safari, Edge, etc.).

(No additional build steps or installations required.)

Usage
Once the page loads, you’ll see the game interface with a field to enter your guess (between 1 and 100).

Type a number and click Guess.

Read the feedback message:

Too high: Your guess is higher than the secret number.

Too low: Your guess is lower than the secret number.

Correct: You found the secret number! A button to “Play Again” appears.

The Attempts counter tracks how many guesses you’ve made.

Press Play Again to reset and generate a new random number.

Game Rules
The secret number is an integer between 1 and 100.

Each guess increments your Attempts count.

If your guess is out of bounds (less than 1 or more than 100), you’ll see a prompt to enter a valid number.

Once the correct guess is made, the game is over until you choose to play again.

Features & Future Enhancements
Basic Validation: Ensures users don’t submit invalid numbers.

Attempts Counter: Displays how many guesses have been made.

Play Again: Allows immediate replay without reloading the page.

Possible Future Additions
Difficulty levels (1–50, 1–200, etc.)

Timer or scoring system

Audio/visual feedback for correct/wrong guesses

CSS animations or transitions

Mobile-optimized UI (further refining for small screens)

Contributing
Fork the repository.

Create a new branch for your feature or bug fix.

Submit a pull request describing your changes.

All suggestions to improve the code, styling, or gameplay are welcome.

License
This project is open-source. Feel free to modify and distribute. If you do, consider giving credit to the original source. You can replace this section with a more detailed license (like MIT, Apache, or GPL) if you prefer.

Enjoy the Game!
If you have any questions or issues, feel free to open an issue or reach out. Have fun guessing!
