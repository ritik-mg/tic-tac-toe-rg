var board;
// Initialize Players and Available Spots
const AI_symbol = 'X';
const HUMAN_symbol = 'O'

// Combo of ID of Squares to Win 
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

// Setting cells equal to all cells in html file
const cells = document.querySelectorAll('.cell');
startGame();

// Resets the Board
function startGame() {
    document.querySelector(".endgame").style.display = "none";
    board = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

// Starts Turns Based on Human Click
function turnClick(square) {
    if (typeof board[square.target.id] == 'number') {
        turn(square.target.id, HUMAN_symbol)
        if (!checkTie()) {
			setTimeout(function() {
				turn(bestSpot(), AI_symbol);
			}, 400);
        }
    }
}

// Executes Turn
function turn(squareId, player) {
    board[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let win = checkWinner(board, player);
    if (win) {
        gameOver(win);
    }
}

// Checks for a Winner
function checkWinner(mimic_board, player) {
    let winner = null;
    let plays = [];
    for (let i = 0; i < mimic_board.length; i++) {
        if (mimic_board[i] === player) {
            plays.push(i);
        }
    }
    for (let i = 0; i < winCombos.length; i++) {
        if (plays.includes(winCombos[i][0]) && plays.includes(winCombos[i][1]) &&
            plays.includes(winCombos[i][2])) {
            winner = { i, player };
            break;
        }
    }
    return winner;
}

// Stops the game and outputs result
function gameOver(winner) {
    for (let i of winCombos[winner.i]) {
        document.getElementById(i).style.backgroundColor =
            winner.player == HUMAN_symbol ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(winner.player == HUMAN_symbol ? "You Win!" : "You Lose :(");
}

// Outputs Result
function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

// Returns number of empty spots on board
function emptySquares() {
	return board.filter(s => typeof s == 'number');
}

// AI uses minimax algorithm to find the best spot
function bestSpot() {
	return minimax(board, AI_symbol).index;
}

// Checks for any tie
function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

// gives the other player
function otherplayer(player){
    return ('O'+'X').replace(player,"");
}

// Minimax Algorithm

function minimax(mimic_board, player) {
	let openSpots = emptySquares();

	if (checkWinner(mimic_board, HUMAN_symbol)) {
		return {score: -10};
	} else if (checkWinner(mimic_board, AI_symbol)) {
		return {score: 10};
	} else if (openSpots.length === 0) {
		return {score: 0};
	}
	
	let best_move =-1;
    let best_score=Infinity;
    if(player==AI_symbol) best_score=-Infinity;
	for (let i = 0; i <9; i++) {
        if(typeof mimic_board[i]!='number') continue;
		let move=mimic_board[i];
		mimic_board[i] = player;
        let temp= minimax(mimic_board,otherplayer(player));
        if(temp.score>best_score && player==AI_symbol){
              best_score=temp.score;
              best_move=move;
        }
        if(temp.score<best_score && player==HUMAN_symbol){
            best_score=temp.score;
            best_move=move;
        }
		mimic_board[i] = move;
	}
	return {index:best_move,score:best_score};
}