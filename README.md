# Memory Game Project

Memory Game is a responsive card matching game built using HTML, CSS, and JavaScript. The game supports multiple difficulty modes, tracks moves and time, and saves a global best score (with the player's name) using Firebase Realtime Database. The project is designed to work on both mobile and desktop devices with a responsive layout.

> **Image Attribution:**  
> Images are sourced from [Freepik](https://www.freepik.com/), [Redbubble](https://www.redbubble.com), and [Shutterstock](https://www.shutterstock.com) under their respective free license terms.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation and Running the Game](#installation-and-running-the-game)
- [Functionality & Testing](#functionality--testing)
- [Issues, Bugs, and Solutions](#issues-bugs-and-solutions)
- [Responsive Design](#responsive-design)
- [Future Enhancements](#future-enhancements)
- [Acknowledgements](#acknowledgements)

---

## Overview

Memory Game challenges players to flip cards and find matching pairs. The number of cards and images used depends on the selected difficulty:

- **Easy Mode:** 8 cards (4 pairs)  
- **Normal Mode:** 16 cards (8 pairs)  
- **Hard Mode:** 32 cards (16 pairs)

On desktop screens (≥1200px), the game container adjusts to fixed grid layouts based on the difficulty:
- **Easy:** 2 rows × 4 columns  
- **Normal:** 2 rows × 8 columns  
- **Hard:** 4 rows × 8 columns

A moves counter and timer track your game progress. When you win, if you’ve beaten the stored best time for the selected difficulty, you can enter your name. The new record is saved to Firebase Realtime Database and is shared across devices.

---

## Features

- **Difficulty Modes:**  
  - Easy: 8 cards using 4 unique images  
  - Normal: 16 cards using 8 unique images  
  - Hard: 32 cards using 16 unique images

- **Responsive Design:**  
  - Mobile-first fluid grid layout on small devices  
  - Desktop-specific fixed grid layouts (via CSS classes) when window width ≥1200px

- **Game Logic:**  
  - Card flipping and matching  
  - Moves counter and timer  
  - Reset game functionality

- **Global High Score:**  
  - High scores are stored in Firebase Realtime Database  
  - Live update: When you win with a new record, you can type your full name (pressing Enter finalizes the record)  
  - The best score is displayed across devices

- **Firebase Integration:**  
  - Uses Firebase Realtime Database (RTDB) with compat SDK  
  - Realtime listener updates the high score display if data changes

---

## Project Structure


---

## Installation and Running the Game

1. **Clone or Download the Repository:**  
   Ensure the entire project folder (with its structure) is on your machine.

2. **Set Up Firebase:**  
   - Create a Firebase project and set up Realtime Database.
   - Update the Firebase configuration in `js/script.js` with your project's credentials.
   - Ensure your Realtime Database rules allow read and write for testing (e.g., `.read` and `.write` set to `true`).

3. **Open the Game:**  
   Open `index.html` in your web browser (Chrome, Firefox, etc.). Ensure your Firebase SDK scripts are included in the `<head>` and that all file paths (images, CSS, JS) are correct.

4. **Play the Game:**  
   - Choose a difficulty (Easy, Normal, Hard) using the dropdown in the header.
   - Flip cards to match pairs.
   - When you win, if your time beats the stored best score, an input field appears for you to enter your name. Press Enter to finalize the record.
   - The best score is updated and displayed, and it will appear for all users (via Firebase RTDB).

---

## Functionality & Testing

- **Card Generation and Matching:**  
  Cards are generated based on the selected difficulty. The game duplicates and shuffles the image array to create pairs. Card flip and match logic ensure that once a matching pair is found, the cards remain flipped.

- **Timer and Moves Counter:**  
  The game starts a timer and resets moves and time at the beginning of each game. The timer updates every second.

- **High Score Update (Firebase RTDB):**  
  - When you win, the game calls `updateBestTime()`.  
  - If no record exists or if your current time is lower than the stored record, an input field (`bestNameInput`) is displayed.
  - The input field waits for you to type your full name and press Enter. Once Enter is pressed, the record (time and name) is saved to Firebase.
  - A realtime listener updates the display (`bestRecord`) if the data changes in Firebase.
  - Test this by playing a game on one device and then checking on another device or browser instance to see if the updated high score appears.

- **Debug Logging:**  
  The code logs generated card values and fetched high score data to the console for easier debugging.

---

## Issues, Bugs, and Solutions

1. **Firebase Already Defined Warning:**  
   - **Issue:** Multiple Firebase SDK script tags causing the library to load more than once.
   - **Solution:** Ensure that each Firebase SDK is included only once in the HTML.

2. **Database Region Warning:**  
   - **Issue:** Incorrect database URL causing a warning.
   - **Solution:** Update the `databaseURL` in your Firebase config to match your project’s region (e.g., `https://memory-b0d16-default-rtdb.europe-west1.firebasedatabase.app`).

3. **Cards Not Rendering When Firebase Code Is Included:**  
   - **Issue:** An error in Firebase initialization or data fetching was halting script execution.
   - **Solution:** Isolate and comment out Firebase code to confirm cards render; then verify Firebase configuration, SDK inclusion, and database rules.

4. **High Score Input Closes After One Letter:**  
   - **Issue:** The event listener was being removed immediately after the first input.
   - **Solution:** Use a `keydown` listener to wait for the Enter key so the full name can be entered before the listener is removed.

5. **Live High Score Not Updating Across Devices:**  
   - **Issue:** Using one-time reads instead of a realtime listener.
   - **Solution:** Set up a realtime listener (using `on('value')`) to update the display live when data in the database changes.

---

## Responsive Design

- **Mobile:**  
  The game container uses a fluid grid that auto-fills based on available screen width. Controls and game info in the header wrap or stack as needed.

- **Desktop:**  
  When the window width is ≥1200px, the game container expands to fill the full screen and uses fixed column layouts (via classes such as `easy-desktop`, `normal-desktop`, and `hard-desktop`) based on the selected difficulty.

- **Testing:**  
  Use Developer Tools (F12) to toggle device modes and test responsiveness. Verify that high score updates (via Firebase RTDB) are visible across different devices.

---

## Future Enhancements

- **Best Time Score Persistence:**  
  Enhance the leaderboard to store multiple scores and display a full leaderboard.
- **Enhanced Animations:**  
  Improve card-flip animations and add sound effects.
- **Accessibility:**  
  Implement ARIA attributes and keyboard navigation.
- **Custom Difficulty Options:**  
  Allow users to specify a custom number of cards or additional game settings.
- **Improved Security Rules:**  
  Update Firebase RTDB rules for production.

---

## Acknowledgements

- **Firebase:**  
  The project uses Firebase Realtime Database for global high score storage.
- **Image Sources:**  
  Images are sourced from [Freepik](https://www.freepik.com/), [Redbubble](https://www.redbubble.com), and [Shutterstock](https://www.shutterstock.com).
- **Wireframe Design:**  
  Wireframe sketches were created using [Balsamiq](https://balsamiq.com/).
- **Community Resources:**  
  Special thanks to online tutorials and google for guidance on responsive design, Firebase integration, and JavaScript game development.
