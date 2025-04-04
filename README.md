# Memory Game Project

Memory Game is a responsive card matching game built with HTML, CSS, and JavaScript. In this project, players choose a difficulty level to play:
- **Easy:** 8 cards (4 pairs)
- **Normal:** 16 cards (8 pairs)
- **Hard:** 32 cards (16 pairs)

On desktop (window width ≥1200px), the grid layout adapts according to the selected difficulty:
- **Easy Mode:** 2 rows × 4 columns
- **Normal Mode:** 2 rows × 8 columns
- **Hard Mode:** 4 rows × 8 columns

The game tracks moves and time, and displays card images on the card backs. Images for each mode are stored in separate directories:
- **Easy Mode:** `assets/images/8-card/` (e.g., `bird-1.png` to `bird-4.png`)
- **Normal Mode:** `assets/images/16-card/` (e.g., `bird-1.png` to `bird-8.png`)
- **Hard Mode:** `assets/images/32-card/` (e.g., `bird-1.png` to `bird-16.png`)

> **Image Attribution:**  
> - Images are sourced from [Freepik](https://www.freepik.com/), [Redbubble](https://www.redbubble.com), and [Shutterstock](https://www.shutterstock.com) under their respective free license terms.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation and Running the Game](#installation-and-running-the-game)
- [Issues, Bugs, and Solutions](#issues-bugs-and-solutions)
- [Responsive Design & Testing](#responsive-design--testing)
- [Wireframe Sketches](#wireframe-sketches)
- [Future Enhancements](#future-enhancements)
- [Acknowledgements](#acknowledgements)

## Overview

Memory Game challenges players to flip cards and find matching pairs. Depending on the selected difficulty:
- **Easy Mode:** 8 cards (4 unique images, 4 pairs)
- **Normal Mode:** 16 cards (8 unique images, 8 pairs)
- **Hard Mode:** 32 cards (16 unique images, 16 pairs)

On desktop screens, desktop-specific CSS classes force a fixed grid layout:
- **Easy:** 2 rows × 4 columns.
- **Normal:** 2 rows × 8 columns.
- **Hard:** 4 rows × 8 columns.

A moves counter and timer track performance. When all pairs are matched, a win alert is displayed.

## Features

- **Difficulty Modes:**  
  - Easy, Normal, and Hard modes that adjust the number of cards and images used.
- **Responsive Design:**  
  - Mobile-first fluid grid layout on small screens.
  - On desktop, the game container expands to fill the screen with fixed column counts (via desktop-specific classes applied by JavaScript).
- **Game Logic:**  
  - Card flip animation, match checking, moves counter, and timer.
  - Reset functionality and window resize handling for layout adjustments.
- **Image Handling:**  
  - Card backs display images from the appropriate directory based on difficulty.
  - Correct file paths and case sensitivity are maintained to ensure images load correctly.

## Project Structure


## Installation and Running the Game

1. **Clone or Download the Repository:**  
   Make sure you have the complete project folder with the correct structure.

2. **Open the Game:**  
   Open `index.html` in your preferred web browser (Chrome, Firefox, Safari, etc.). Ensure that the CSS and JS files are linked correctly.

3. **Play the Game:**  
   - Use the difficulty selector (located in the header) to choose Easy, Normal, or Hard.
   - On desktop (≥1200px), the grid layout forces:
     - **Easy:** 2 rows × 4 columns.
     - **Normal:** 2 rows × 8 columns.
     - **Hard:** 4 rows × 8 columns.
   - On mobile devices, the grid auto-fills based on available width.
   - Click on cards to flip them and match pairs.
   - A moves counter and timer display your progress.
   - Use the "Reset Game" button to restart the game.

## Issues, Bugs, and Solutions

1. **Responsive Layout Not Filling the Screen on Desktop:**  
   - **Issue:** The game container was initially confined to a fixed-width box.  
   - **Solution:** Removed the max-width in the desktop media query (≥1200px) so that the container expands fully across the viewport. Desktop-specific classes (`easy-desktop`, `normal-desktop`, `hard-desktop`) force the grid to display a fixed number of columns.

2. **Background Images Not Displaying on Cards:**  
   - **Issue:** Card background images were not visible due to incorrect file paths, file name case sensitivity, or untracked files.  
   - **Solution:**  
     - Updated JavaScript image arrays with full, correct paths (e.g., `assets/images/8-card/bird-1.png`).
     - Ensured the file names and extensions match exactly.
     - Verified that the images are committed to the repository so GitHub Pages can serve them.
     - Adjusted relative paths (using `../`) in the CSS if needed.

3. **Desktop Layout Not Updating on Window Resize:**  
   - **Issue:** The desktop grid layout did not reapply when resizing the window.  
   - **Solution:**  
     - Added a window resize event listener in JavaScript to reapply the desktop layout classes based on the current difficulty and window width.

4. **Difficulty-Specific Image Handling and Layout:**  
   - **Issue:** Different difficulty modes required unique sets of images and distinct grid layouts.  
   - **Solution:**  
     - Created separate image arrays for Easy, Normal, and Hard modes.
     - Updated the card generation logic to use the correct image set based on the selected difficulty.
     - Desktop-specific classes are applied via JavaScript to enforce the desired grid layout (e.g., 4 columns for Easy mode and 8 columns for Normal/Hard modes).

## Responsive Design & Testing

- **Mobile:**  
  The game container uses a fluid grid layout with auto-fill columns. Cards wrap naturally based on the screen width.
- **Desktop:**  
  When the window width is ≥1200px, the game container expands to fill the full screen width. JavaScript applies classes to enforce a fixed number of columns based on difficulty:
  - **Easy:** 4 columns.
  - **Normal/Hard:** 8 columns.
- **Testing:**  
  Use your browser’s Developer Tools (F12) to toggle device mode and emulate various screen sizes. Verify that the layout adjusts correctly and that the desktop classes are applied when appropriate.

## Wireframe Sketches

Wireframe sketches for this project were created using Balsamiq. The sketches include:
- **Mobile Layout:**  
  A fluid grid with a header that includes the game title, moves counter, timer, difficulty selector, and reset button.
- **Desktop Layout:**  
  A full-width header and game container. The grid is forced to fixed column counts:
  - **Easy:** 2 rows × 4 columns.
  - **Normal:** 2 rows × 8 columns.
  - **Hard:** 4 rows × 8 columns.

The wireframes are saved in the `wireframes/` folder and have been used to guide the development of the responsive design.

## Image Sources

- **Freepik:**  
  Many images are sourced from Freepik under their free license terms.
- **Redbubble:**  
  Additional images have been obtained from Redbubble.
- **Shutterstock:**  
  Some images are sourced from Shutterstock.

Please review the licensing terms on each site for your intended use.

## Future Enhancements

- **Best Time Score:**  
  Implement best time tracking using localStorage.
- **Enhanced Animations and Sound Effects:**  
  Improve card flip animations and add sound effects.
- **Accessibility Improvements:**  
  Integrate ARIA attributes and keyboard navigation support.
- **Additional Image Sets:**  
  Expand Normal and Hard modes with more unique images.
- **Custom Difficulty Options:**  
  Allow users to select a custom number of cards or adjust game settings.

## Acknowledgements

- Images used in this project are sourced from [Freepik](https://www.freepik.com/), [Redbubble](https://www.redbubble.com), and [Shutterstock](https://www.shutterstock.com).
- Wireframe sketches were created using [Balsamiq](https://balsamiq.com/).
- Special thanks to the online resources that helped inspire and build this project.
