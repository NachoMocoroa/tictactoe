let state = [];
let totalClicks = 0;
let turn = null;
const cells = document.querySelectorAll('#board .cell');
const btnReset = document.querySelector('#btnReset');
const resultField = document.querySelector('#result');
const player1Score = document.querySelector('#score_1');
const player2Score = document.querySelector('#score_2');
const player1 = {
  value: 'X',
  score: 0,
  clicks: 0
};
const player2 = {
  value: 'O',
  score: 0,
  clicks: 0
};
const successPositions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const minClicks = 3;
const maxClicks = 9;
const classCellDisabled = 'cell-disabled';
const classInvisible = 'invisible';
const classPlayer_1 = 'player-1';
const classPlayer_2 = 'player-2';
const winText = 'WINS!';
const tieText = 'TIE';
const emptyString = '';

// Reset game variables
function reset() {
  state = [
    [ null, null, null ],
    [ null, null, null ],
    [ null, null, null ]
  ];
  turn = player1.value;
  totalClicks = 0;
  player1.clicks = 0;
  player2.clicks = 0;
  resultField.classList.add(classInvisible);
  resultField.textContent = emptyString;
  populate(state);
};

// Disable cells
function disableCells() {
  cells.forEach(cell => cell.classList.add(classCellDisabled));
};

// Clear cell classes and values
function clearCell(cell) {
  cell.textContent = emptyString;
  cell.dataset.value = emptyString;
  cell.classList.remove(classPlayer_1);
  cell.classList.remove(classPlayer_2);
  cell.classList.remove(classCellDisabled);
};

// Set cells classes and values
function setCell(cell, param) {
  if(param === player1.value) {
    cell.classList.add(classPlayer_1);
    ++player1.clicks;
    turn = player2.value;
  } else {
    cell.classList.add(classPlayer_2);
    ++player2.clicks;
    turn = player1.value;
  }
  cell.textContent = param === player1.value ? player1.value : player2.value;
  cell.dataset.value = param === player1.value ? player1.value : player2.value;
  cell.classList.add(classCellDisabled);
  ++totalClicks;
};

// Populate board cells
function populate(board) {
  let row = -1;
  let column = 0;
  for (let i = 0; i < cells.length; i++) {
    if(i % 3 === 0) {
      ++row;
      column = 0;
    }
    if(board[row][column] === player1.value) {
      setCell(cells[i], player1.value);
    } else if(board[row][column] === player2.value) {
      setCell(cells[i], player2.value);
    } else {
      clearCell(cells[i]);
    }
    ++column;
  }
  checkGame();
};

// Click event for cells
function cellClick(event) {
  const cell = event.target;
  if(totalClicks === 0) {
    setCell(cell, player1.value);
  } else {
    if(turn === player1.value) {
      setCell(cell, player1.value);
    } else {
      setCell(cell, player2.value);
    }
  }
  state[cell.dataset.row][cell.dataset.col] = cell.textContent;
  checkGame();
};

// Check game status
function checkGame() {
  if(player1.clicks >= minClicks || player2.clicks >= minClicks) {
    let areEquals = false;
    let winValue = null;
    const mergedState = [].concat.apply([], state);
    for (let i = 0; i < successPositions.length; i++) {
      const val_1 = mergedState[successPositions[i][0]];
      const val_2 = mergedState[successPositions[i][1]];
      const val_3 = mergedState[successPositions[i][2]];
      if (val_1 !== null && val_2 !== null && val_3 !== null) {
        areEquals = val_1 === val_2 && val_2 === val_3;
      }
      if(areEquals) {
        winValue = val_1;
        break;
      }
    }
    if(areEquals) {
      setScore (winValue);
      disableCells();
    } else if(!areEquals && totalClicks === maxClicks) {
      setScore(null);
      disableCells();
    }
  }
};

// Set game result field value and class
function setScore(value) {
  resultField.classList.remove(classInvisible);
  resultField.classList.remove(classPlayer_1);
  resultField.classList.remove(classPlayer_2);
  if (value) {
    value === player1.value ? 
      player1Score.textContent = ++player1.score 
      : player2Score.textContent = ++player2.score;
    const resultFieldClass = value === player1.value ? classPlayer_1 : classPlayer_2;
    resultField.classList.add(resultFieldClass);
    resultField.textContent = '"' + value + '" ' + winText;
  } else {
    resultField.textContent = tieText;
  }
};

// Set listeners for reset button and board cells
function setListeners() {
  btnReset.addEventListener('click', reset);
  cells.forEach(cell => {
    cell.dataset.value = emptyString;
    cell.addEventListener('click', cellClick);
  });
};

// Game initialization
function init() {
  setListeners();
  reset();
};

init();