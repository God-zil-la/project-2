
## Installation and Running the Game

1. **Clone or Download the Repository:**  
   Ensure that you have the entire project folder with the correct structure.

2. **Open the Game:**  
   Open `index.html` in your preferred web browser (Chrome, Firefox, Safari, etc.). Ensure that the CSS and JavaScript files are linked correctly.

3. **Play the Game:**  
   - Use the difficulty selector to choose Easy, Normal, or Hard.
   - On desktop (window width ≥1200px), the grid layout will display:
     - **Easy Mode:** 2 rows x 4 columns.
     - **Normal Mode:** 2 rows x 8 columns.
     - **Hard Mode:** 4 rows x 8 columns.
   - On mobile devices, the grid auto-fills based on available width.
   - Click on cards to flip them and match pairs.
   - A moves counter and timer track your progress.
   - Click "Reset Game" to restart.

## Issues, Bugs, and Solutions

1. **Responsive Layout Not Filling the Screen on Desktop:**  
   - **Issue:** Initially, the game container was confined to a fixed-width box on desktop.
   - **Solution:** Removed the max-width constraint for desktop layouts (≥1200px) so that the container expands fully to the viewport width. Desktop-specific classes (`easy-desktop`, `normal-desktop`, `hard-desktop`) were added via JavaScript to enforce fixed column counts.

2. **Images Not Displaying on Cards:**  
   - **Issue:** Card images were not visible because of incorrect file paths or file extensions.
   - **Solution:** Updated image arrays in JavaScript to include full paths (e.g., `assets/images/8-card/bird-1.png`). Verified the folder structure and file names. Adjusted the CSS for `.card-back` to ensure background images are displayed properly.

3. **Desktop Layout Not Updating on Resize:**  
   - **Issue:** When resizing the window, the desktop layout did not reapply.
   - **Solution:** Added a window resize event listener in the JavaScript to reapply desktop layout classes based on the current difficulty and window width.

4. **Difficulty-Specific Images and Layout:**  
   - **Issue:** Different difficulty modes required unique sets of images and specific grid layouts on desktop.
   - **Solution:** Created separate image arrays for Easy, Normal, and Hard modes, and updated the card generation logic accordingly. Also, desktop-specific classes force fixed grid layouts:
     - **Easy Mode:** 4 columns.
     - **Normal/Hard Modes:** 8 columns.

## Wireframe Sketches

Wireframe sketches were created using Balsamiq to guide the design process:

- **Mobile Layout:**  
  A fluid grid layout where cards auto-fill based on screen width. The header contains the game title, moves counter, timer, difficulty selector, and reset button.

- **Desktop Layout:**  
  The header spans full width with game controls, and the game container fills the available screen. Desktop-specific layouts force:
  - **Easy Mode:** 2 rows × 4 columns.
  - **Normal Mode:** 2 rows × 8 columns.
  - **Hard Mode:** 4 rows × 8 columns.

Wireframe sketches are saved in the `wireframes/` folder and are available for reference.

## Image Sources

- **Freepik:** Images are primarily sourced from Freepik under their free license terms.
- **Redbubble:** Some images were obtained from Redbubble.
- **Shutterstock:** Additional images are sourced from Shutterstock.

Please review each platform’s licensing for your intended use.

## Future Enhancements

- **Best Time Score:**  
  Implement best time tracking using localStorage.
- **Enhanced Animations and Sound Effects:**  
  Improve card flip animations and add sound effects.
- **Accessibility Improvements:**  
  Incorporate ARIA attributes and keyboard navigation support.
- **Additional Image Sets:**  
  Expand Normal and Hard modes with more unique images.
- **Custom Difficulty Options:**  
  Allow users to select a custom number of cards or adjust difficulty.

## Acknowledgements

- Images are sourced from [Freepik](https://www.freepik.com/), [Redbubble](https://www.redbubble.com), and [Shutterstock](https://www.shutterstock.com).
- Wireframe sketches were created using [Balsamiq](https://balsamiq.com/).
- Thanks to the google, slack and other online pages
