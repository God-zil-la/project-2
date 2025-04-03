
## Installation and Running the Game

1. **Clone or Download the Repository:**  
   Ensure you have the entire project folder with the correct structure.

2. **Open the Game:**  
   Open `index.html` in your preferred web browser (Chrome, Firefox, Safari, etc.). Make sure that the CSS and JavaScript files are linked correctly.

3. **Play the Game:**  
   - Use the difficulty selector to choose Easy, Normal, or Hard.
   - On desktop (window width ≥1200px), the grid layout will force:
     - **Easy:** 2 rows × 4 columns.
     - **Normal:** 2 rows × 8 columns.
     - **Hard:** 4 rows × 8 columns.
   - On mobile devices, the grid is fluid and auto-fills based on the available width.
   - Click on cards to flip them and try to match pairs.
   - A moves counter and timer track your progress.
   - Click the "Reset Game" button to restart.

## Known Issues and Bug Fixes

1. **Responsive Layout Issues on Desktop:**  
   - **Problem:** The grid was initially confined to a fixed-width box.
   - **Solution:** Removed fixed max-width restrictions in the desktop media query so the container expands to fill the full screen. Desktop-specific classes are applied to force fixed column counts based on difficulty.

2. **Images Not Displaying on Cards:**  
   - **Problem:** Card images were not appearing due to incorrect file paths or extensions.
   - **Solution:** Updated the image arrays in JavaScript to include full paths (e.g., `assets/images/8-card/bird-1.png`) and ensured the CSS for `.card-back` displays background images correctly.

3. **Desktop Layout Not Updating on Resize:**  
   - **Problem:** The grid layout did not reapply when resizing the window.
   - **Solution:** Added an event listener on window resize to reapply desktop layout classes based on the current difficulty and window width.

4. **Difficulty-Specific Images:**  
   - **Problem:** Different difficulty modes required unique sets of images.
   - **Solution:** Created separate image arrays (`easyImages`, `normalImages`, `hardImages`) and updated the card generation logic to select the correct set based on the selected difficulty.

## Wireframe Sketches

Wireframe sketches for the Memory Game were created using Balsamiq to plan the layout. The sketches include:
- **Mobile Layout:** A fluid grid where cards auto-fill based on available screen width.
- **Desktop Layout:** A fixed grid layout with specific column counts based on difficulty:
  - **Easy Mode:** 2 rows x 4 columns.
  - **Normal Mode:** 2 rows x 8 columns.
  - **Hard Mode:** 4 rows x 8 columns.
- **UI Elements:** Placement of the header, moves counter, timer, difficulty selector, and reset button.

The wireframes have been saved in the `wireframes/` folder and are available for reference.

## Image Sources

- **Freepik:** Many images used in this project are sourced from [Freepik](https://www.freepik.com/) under their free license terms.
- **Redbubble:** Additional images were obtained from [Redbubble](https://www.redbubble.com).
- **Shutterstock:** Some images were also sourced from [Shutterstock](https://www.shutterstock.com).

Please ensure you review the licensing for each platform when using these images.

## Future Enhancements

- **Best Time Score:**  
  Implement best time tracking using localStorage.
- **Enhanced Animations and Sound Effects:**  
  Add smoother card-flip animations and sound effects.
- **Accessibility Improvements:**  
  Incorporate ARIA attributes and keyboard navigation.
- **Additional Image Sets:**  
  Expand the Normal and Hard modes with more unique images.
- **Custom Difficulty Options:**  
  Allow players to select a custom number of cards or adjust difficulty settings.

## Acknowledgements

- Images used in this project are sourced from [Freepik](https://www.freepik.com/), [Redbubble](https://www.redbubble.com), and [Shutterstock](https://www.shutterstock.com).
- Wireframe sketches were created using [Balsamiq](https://balsamiq.com/).
- Thanks to the google, slack and other online pages