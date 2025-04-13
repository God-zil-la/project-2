/**
 * @jest-environment jsdom
 */

// ----- Test Setup: Create minimal DOM elements before each test -----
beforeEach(() => {
    document.body.innerHTML = `
      <div id="gameContainer"></div>
      <div id="movesCount">0</div>
      <div id="timeCount">0</div>
      <div id="bestRecord">Best: N/A</div>
      <input id="bestNameInput" type="text" style="display: none;" />
      <select id="difficulty">
        <option value="8">8</option>
        <option value="16">16</option>
        <option value="32">32</option>
        <option value="40">40</option>
      </select>
      <button id="resetBtn">Reset</button>
    `;
  });
  
  // ----- Sample Test: Check that essential DOM elements exist -----
  test("Essential DOM elements are present", () => {
    expect(document.getElementById("gameContainer")).not.toBeNull();
    expect(document.getElementById("movesCount")).not.toBeNull();
    expect(document.getElementById("timeCount")).not.toBeNull();
    expect(document.getElementById("bestRecord")).not.toBeNull();
    expect(document.getElementById("bestNameInput")).not.toBeNull();
    expect(document.getElementById("difficulty")).not.toBeNull();
    expect(document.getElementById("resetBtn")).not.toBeNull();
  });
  
  // ----- Dummy Function for Demonstration -----
  // In your real app, move this function into its own module and import it.
  function generateCards(totalCards) {
    // For demonstration, create an array of image file names.
    // Assume totalCards is an even number: 8, 16, 32, or 40.
    const pairs = totalCards / 2;
    let images = [];
    for (let i = 1; i <= pairs; i++) {
      images.push(`emoji-${i}.png`);
    }
    // Duplicate the array to simulate pairs.
    let cardValues = images.concat(images);
    // Simple shuffle: sort by random comparator (note: not a robust shuffle for production)
    return cardValues.sort(() => Math.random() - 0.5);
  }
  
  // ----- Sample Test: Check generateCards function -----
  test("generateCards returns the expected number of cards", () => {
    const totalCards = 8;
    const cards = generateCards(totalCards);
    expect(Array.isArray(cards)).toBe(true);
    expect(cards.length).toBe(totalCards);
  });
  
  // You can add more tests to target other functions or logic from your memory game.
  