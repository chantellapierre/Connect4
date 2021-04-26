/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// const winner = document.querySelector('#winner');
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
document.getElementById('current-player').innerHTML = ' ' + currPlayer;
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

//set board to empty matrix array
function makeBoard() {
	for (let i = 0; i < HEIGHT; i++) {
		board[i] = [];
		for (let j = 0; j < WIDTH; j++) {
			board[i][j] = null;
		}
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	//gets "htmlBoard" variable from the item in HTML w/ID of "board"
	let htmlBoard = document.getElementById('board');
	//creates top row of clickable slots for game
	let top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	//iterates over width of game board creating squares
	for (let x = 0; x < WIDTH; x++) {
		let headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	//iterate over rows of game and make main game board
	for (let y = 0; y < HEIGHT; y++) {
		//create squares in rows
		const row = document.createElement('tr');
		//iterate over columns of game
		for (let x = 0; x < WIDTH; x++) {
			//create squares in columns
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			//append squares to rows
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	for (let y = HEIGHT - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
}
/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	const piece = document.createElement('div');
	piece.classList.add(`p${currPlayer}`);
	piece.classList.add('piece');
	piece.style.top = -50 * (y + 2);
	const spot = document.getElementById(`${y}-${x}`);
	spot.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
	alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	const x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	const y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	if (board.every((row) => row.every((cell) => cell))) {
		return endGame('Tie!');
	}

	// switch players
	if (currPlayer === 1) {
		currPlayer = 2;
		document.getElementById('current-player').innerHTML = ' ' + currPlayer;
	} else {
		currPlayer = 1;
		document.getElementById('current-player').innerHTML = ' ' + currPlayer;
	}
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}
	//loop over outer array
	for (let y = 0; y < HEIGHT; y++) {
		//loop over inner array
		for (let x = 0; x < WIDTH; x++) {
			//find four across in horizontal, vertical, diagonal right, diagonal left directions
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

//reset game
let reset = document.getElementById('reset');
reset.addEventListener('click', function() {
	location.reload();
});

makeBoard();
makeHtmlBoard();
