
## Installation and Running the Game

1. **Clone or Download the Repository:**  
   Make sure you have the entire project folder with the correct structure.

2. **Open the Game:**  
   Open `index.html` in your preferred web browser (Chrome, Firefox, Safari, etc.). Ensure the CSS and JavaScript files are linked correctly.

3. **Play the Game:**  
   - Use the difficulty selector to choose a mode: Easy, Normal, or Hard.
   - On desktop (window width ≥1200px), the grid layout will display:
     - **Easy Mode:** 2 rows × 4 columns (8 cards).
     - **Normal Mode:** 2 rows × 8 columns (16 cards).
     - **Hard Mode:** 4 rows × 8 columns (32 cards).
   - On mobile devices, the grid is fluid and auto-fills based on available width.
   - Click the cards to flip them and try to match pairs.
   - A moves counter and timer track your performance.
   - Click the "Reset Game" button to restart.

## Known Issues and Bug Fixes

1. **Responsive Layout Issues:**  
   - **Problem:** Initially, the layout was confined to a fixed-width box on desktop.
   - **Solution:** Removed max-width restrictions in the desktop media query so the container expands to fill the full screen, with desktop-specific classes forcing fixed column counts.

2. **Images Not Displaying:**  
   - **Problem:** Card images did not appear due to incorrect file paths or file extensions.
   - **Solution:** Updated image arrays in the JavaScript to include full paths (e.g., `assets/images/8-card/bird-1.png`) and ensured that the CSS for `.card-back` properly displays background images.

3. **Desktop Layout Not Updating on Resize:**  
   - **Problem:** The grid layout did not reapply when resizing the window.
   - **Solution:** Added a window resize event listener to reapply desktop layout classes based on the current difficulty and window width.

4. **Difficulty-Specific Images:**  
   - **Problem:** Different difficulty modes needed unique sets of images.
   - **Solution:** Created separate image arrays (`easyImages`, `normalImages`, `hardImages`) and modified the card generation logic to select the correct set based on the selected difficulty.

## Wireframe Sketches

Wireframe sketches for this Memory Game were created using Balsamiq. The sketches include:
- **Initial Layout Wireframe:** Illustrates the mobile-first design with a fluid grid layout.
- **Desktop Layout Wireframe:** Shows how the grid adapts on larger screens with fixed column counts for each difficulty mode (2 rows for Easy and Normal, 4 rows for Hard).
- **UI Elements Wireframe:** Details the placement of the header, moves counter, timer, difficulty selector, and reset button.

These wireframes helped guide the design and ensure that responsive behaviors were implemented correctly. The sketches are available as part of the project documentation and can be found in the project folder under a subdirectory (e.g., `wireframes/`) or as shared files in our project management system.

## Future Enhancements

- **Best Time Score:**  
  Track and display the best time using localStorage.
- **Enhanced Animations and Sound Effects:**  
  Improve card-flip animations and add sound effects.
- **Accessibility Improvements:**  
  Incorporate ARIA attributes and keyboard navigation.
- **Additional Image Sets:**  
  Expand the Normal and Hard modes with more unique images.
- **Custom Difficulty Options:**  
  Allow users to select a custom number of cards or define their own difficulty.

## Acknowledgements

- Images used in this project are sourced from [Freepik](https://www.freepik.com/).
- Wireframe sketches were created using [Balsamiq](https://balsamiq.com/).
- Thanks to the open-source community and various online tutorials and resources that contributed to the development of this project.
