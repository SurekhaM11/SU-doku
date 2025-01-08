let selectedCell = null;
let solvedGrid = [];
//let newGameGrid = [];
let filledBoard = [];
let newGameGrid;
const numberTracker = {
  1: { filled: 0, total: 9 },
  2: { filled: 0, total: 9 },
  3: { filled: 0, total: 9 },
  4: { filled: 0, total: 9 },
  5: { filled: 0, total: 9 },
  6: { filled: 0, total: 9 },
  7: { filled: 0, total: 9 },
  8: { filled: 0, total: 9 },
  9: { filled: 0, total: 9 },
};
let preFilledCount = 0;
document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("sudoku");
  const keyboard = id("keyBoard");
  // document.getElementById("hint_id").classList.add("blur");
  // document.getElementById("validate_id").classList.add("blur");
  document.getElementById("sudoku-board").classList.add("blur");
  const keyBoardTable = document.createElement("table");
  const keyRow = document.createElement("tr");
  for (let i = 1; i <= 9; i++) {
    const keyCell = document.createElement("td");
    keyCell.textContent = i;
    keyCell.setAttribute("data-number", i);
    // Add click event to handle number input

    keyCell.addEventListener("click", () => {
      if (!keyCell.classList.contains("disabled")) {
        if (selectedCell && !selectedCell.classList.contains("default")) {
          const currentNumber = selectedCell.textContent;
          const newNumber = i;

          if (currentNumber) {
            updateTracker(currentNumber, "remove"); // Remove the old number from the tracker
          }

          selectedCell.textContent = newNumber; // Place the new number
          updateTracker(newNumber, "add"); // Add the new number to the tracker
          selectedCell.classList.add("user-input"); // Mark as user-input
        } else if (!selectedCell) {
          alert("Please select a cell first!"); // Alert if no cell is selected
        } else {
          alert("Cannot change default values!"); // Prevent modifying default values
        }
      }
    });

    keyRow.appendChild(keyCell);
  }
  keyBoardTable.appendChild(keyRow);
  keyboard.appendChild(keyBoardTable);

  // Event listener for the start button
  const startButton = document.getElementById("start-btn");
  startButton.addEventListener("click", () => {
    applyTheme();
    const gameGrid = startNewGame();

    // document.getElementById("hint_id").classList.remove("blur");
    // document.getElementById("validate_id").classList.remove("blur");
    document.getElementById("sudoku-board").classList.remove("blur");
    //console.log("grid from start:", gameGrid);
    initializeTracker(gameGrid);
  });
});

function startNewGame() {
  const difficulty = document.querySelector('input[name="diff"]:checked').value;
  newGameGrid = generateNewGame(difficulty);
  generateBoardFromGrid(newGameGrid);
  lives = 3;
  document.getElementById("lives").textContent = `Lives remaining: ${lives}`;
  //document.getElementById("buttons").classList.remove("blur");
  document.getElementById("sudoku-board").classList.remove("blur");
  startTimer();
  preFilledCount = countPreFilledCells(newGameGrid);
  console.log(`Pre-filled cells: ${preFilledCount}`);

  return newGameGrid;
}

function generateNewGame(difficulty) {
  document.getElementById("sudoku-board").classList.remove("blur");
  solvedGrid = generateSolvedGrid();
  const gameGrid = JSON.parse(JSON.stringify(solvedGrid));
  // console.log("solution 1:,in generateNewGame function", solvedGrid);
  const blanks = difficulty === "easy" ? 30 : difficulty === "medium" ? 45 : 60;

  for (let i = 0; i < blanks; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    } while (gameGrid[row][col] === "-");
    gameGrid[row][col] = "-";
  }
  //console.log("solution 2:,in generateNewGame function", solvedGrid);
  return gameGrid;
}
function captureFilledBoard() {
  const board = document.getElementById("sudoku");
  filledBoard = [];

  // Loop through the table rows and cells
  const rows = board.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const row = [];
    const cells = rows[i].getElementsByTagName("td");
    for (let j = 0; j < cells.length; j++) {
      row.push(
        cells[j].textContent === "" ? "-" : parseInt(cells[j].textContent)
      );
    }
    filledBoard.push(row);
  }

  //console.log("Filled Board:", filledBoard); // Debug log
}
function validateSolution() {
  captureFilledBoard();
  // console.log("solution:", solvedGrid);
  // Compare filledBoard with solution
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (filledBoard[i][j] !== solvedGrid[i][j]) {
        alert("Incorrect solution!");
        clearTimeout(timer);
        // document.getElementById("buttons").classList.add("blur");
        // document.getElementById("sudoku").classList.add("blur");
        // document.getElementById("keyBoard").classList.add("blur");
        document.getElementById("sudoku-board").classList.add("blur");
        return false;
      }
    }
  }
  //document.getElementById("sudoku").classList.add("blur");
  document.getElementById("sudoku-board").classList.add("blur");
  alert("Congratulations! You solved the Sudoku!");

  return true;
}

function generateSolvedGrid() {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

  // Populate the grid with a valid Sudoku solution
  fillGrid(grid);
  return grid;
}

function fillGrid(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of numbers) {
          if (isValidPlace(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValidPlace(grid, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }

  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (grid[i][j] === num) return false;
    }
  }
  return true;
}

function generateBoardFromGrid(grid) {
  const board = id("sudoku");
  const table = document.createElement("table");

  for (let i = 0; i < 9; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement("td");
      cell.textContent = grid[i][j] === "-" ? "" : grid[i][j];

      if (grid[i][j] !== "-") {
        cell.classList.add("default");
      }

      cell.addEventListener("click", () => {
        if (selectedCell) {
          selectedCell.classList.remove("selected");
        }
        selectedCell = cell;
        cell.classList.add("selected");
      });

      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  board.innerHTML = "";
  board.appendChild(table);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function id(id) {
  return document.getElementById(id);
}
function startTimer() {
  if (id("time-1").checked) timeRemaining = 300;
  else if (id("time-2").checked) timeRemaining = 600;
  else if (id("time-3").checked) timeRemaining = 900;
  else timeRemaining = 0;
  //sets times for first second
  id("timer").textContent = timeConversion(timeRemaining);
  timer = setInterval(function () {
    timeRemaining--;
    if (timeRemaining === 0) endGame();
    id("timer").textContent = timeConversion(timeRemaining);
  }, 1000);
}
function applyTheme() {
  const body = document.body;

  if (id("theme-1").checked) {
    body.classList.remove("dark");
    body.classList.add("light");
  } else {
    body.classList.remove("light");
    body.classList.add("dark");
  }

  // console.log(
  //   "Theme applied:",
  //   body.classList.contains("dark") ? "Dark" : "Light"
  // );
}
function timeConversion(time) {
  let minutes = Math.floor(time / 60);
  if (minutes < 10) minutes = "0" + minutes;
  let seconds = time % 60;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}
function endGame() {
  //disable moves and stop the timer
  disableSelect = true;
  clearTimeout(timer);
  //display win or loss
  if (lives < 0 || timeRemaining === 0) {
    if (timeRemaining === 0) {
      alert("Time's Up, You lost");
    }
    if (lives === 0) {
      alert(" exceeded hints");
    }
    //document.getElementById("sudoku").classList.add("blur");
    document.getElementById("sudoku-board").classList.add("blur");
    clearInterval(timer);
    id("lives").textContent = "You Lost!";
  } else {
    id("lives").textContent = "You win!";
    // document.getElementById("sudoku").classList.add("blur");
    document.getElementById("sudoku-board").classList.add("blur");
  }
}
function getHint() {
  if (!selectedCell) {
    alert("Please select a cell to get a hint!");
    return;
  }

  // Prevent giving a hint for pre-filled cells
  if (selectedCell.classList.contains("default")) {
    alert("Cannot give a hint for pre-filled cells!");
    return;
  }

  // Determine the row and column of the selected cell
  const table = document.getElementById("sudoku");
  const rows = Array.from(table.getElementsByTagName("tr"));
  const rowIndex = rows.findIndex((row) =>
    Array.from(row.children).includes(selectedCell)
  );
  const colIndex = Array.from(rows[rowIndex].children).indexOf(selectedCell);
  lives--;
  document.getElementById("lives").textContent = `Lives remaining: ${lives}`;
  if (lives < 0) {
    console.log("lives:", lives);
    if (lives === -1) {
      const result = window.confirm(
        "Hints limit Exceeded.Do you want to continue?...Without Hints"
      );
      console.log("prompt:", result);
      if (result) {
        alert("No hints will be provided");
        lives = 0;
        document.getElementById(
          "lives"
        ).textContent = `Lives remaining: ${lives}`;
      } else {
        alert("Game ends");
        document.getElementById("keyBoard").classList.add("blur");
        document.getElementById("buttons").classList.add("blur");
        endGame();
      }
    }
  } else {
    // Get the correct value from the solved grid
    const correctValue = solvedGrid[rowIndex][colIndex];
    selectedCell.textContent = correctValue;
    updateTracker(correctValue, "add");
    selectedCell.classList.add("hint");
  }
  //console.log(`Hint provided at (${rowIndex}, ${colIndex}): ${correctValue}`);
}
function initializeTracker(grid) {
  //console.log("grid from inilizetracker:", grid);
  // Reset the tracker
  Object.keys(numberTracker).forEach((num) => {
    numberTracker[num].filled = 0;
    const keyCell = document.querySelector(`[data-number="${num}"]`);
    if (keyCell) {
      keyCell.classList.remove("disabled");
      keyCell.style.pointerEvents = "auto";
      keyCell.style.opacity = "1";
    }
  });

  // Count occurrences of each number in the initial grid
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const value = grid[i][j];
      if (value !== "-") {
        numberTracker[value].filled++;
      }
    }
  }

  //console.log("Number Tracker Initialized:", numberTracker);
}
function updateTracker(number, action) {
  console.log("action:", action);
  if (numberTracker[number]) {
    if (action === "add") {
      numberTracker[number].filled++;
      preFilledCount++;
    } else if (action === "remove") {
      numberTracker[number].filled--;
    }

    console.log(`Tracker Updated for ${number}:`, numberTracker[number]);
    const keyCell = document.querySelector(`[data-number="${number}"]`);
    if (numberTracker[number].filled === numberTracker[number].total) {
      keyCell.classList.add("disabled"); // Disable the button
      keyCell.style.pointerEvents = "none"; // Prevent further clicks
      keyCell.style.opacity = "0.5"; // Dim the button
    } else {
      keyCell.classList.remove("disabled"); // Enable the button if not full
      keyCell.style.pointerEvents = "auto";
      keyCell.style.opacity = "1";
    }
  }
  console.log("numbertracker :", numberTracker[number].filled);
  // for (let i = 0; i < 9; i++) {
  //   if (numberTracker[number].filled == 9) {
  //     preFilledCount = preFilledCount + 1;
  //   }
  // }
  console.log("no. of filled positions:", preFilledCount);
  if (preFilledCount == 81) {
    validateSolution();
  }
}
// function removeNumber() {
//   if (selectedCell && !selectedCell.classList.contains("default")) {
//     const currentNumber = selectedCell.textContent;

//     if (currentNumber) {
//       updateTracker(currentNumber, "remove"); // Remove the number from the tracker
//       selectedCell.textContent = ""; // Clear the cell
//     }
//   } else {
//     alert("Cannot remove a number from this cell!");
//   }
// }
function countPreFilledCells(grid) {
  let count = 0;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] !== "-") {
        count++; // Increment the count for each pre-filled cell
      }
    }
  }

  return count;
}
