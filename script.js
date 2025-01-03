const board = document.getElementById('board');
const statusBox = document.getElementById('statusBox');
const restartButton = document.getElementById('restartButton');
const redScore = document.getElementById('redScore');
const yellowScore = document.getElementById('yellowScore');

let currentPlayer = 'red';
let gameActive = true;
let boardState = Array(6).fill(null).map(() => Array(7).fill(null));

function createBoard() {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    if (!gameActive) return;

    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    // Find the lowest empty cell in the column
    for (let r = 5; r >= 0; r--) {
        if (!boardState[r][col]) {
            boardState[r][col] = currentPlayer;
            const targetCell = document.querySelector(`.cell[data-row="${r}"][data-col="${col}"]`);
            targetCell.classList.add(currentPlayer);
            if (checkWin(r, col)) {
                gameActive = false;
                statusBox.textContent = `${currentPlayer === 'red' ? 'Red' : 'Yellow'} Wins!`;
                statusBox.style.backgroundColor = currentPlayer;
                updateScore();
            } else if (boardState.flat().every(cell => cell)) {
                gameActive = false;
                statusBox.textContent = 'Draw';
            } else {
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                statusBox.textContent = `${currentPlayer === 'red' ? 'Red' : 'Yellow'}'s Turn`;
            }
            break;
        }
    }
}

function checkWin(row, col) {
    const directions = [
        { dr: 0, dc: 1 }, // Horizontal
        { dr: 1, dc: 0 }, // Vertical
        { dr: 1, dc: 1 }, // Diagonal down-right
        { dr: 1, dc: -1 } // Diagonal down-left
    ];

    for (const { dr, dc } of directions) {
        let count = 1;
        for (let i = 1; i < 4; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r < 0 || r >= 6 || c < 0 || c >= 7 || boardState[r][c] !== currentPlayer) break;
            count++;
        }
        for (let i = 1; i < 4; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (r < 0 || r >= 6 || c < 0 || c >= 7 || boardState[r][c] !== currentPlayer) break;
            count++;
        }
        if (count >= 4) return true;
    }
    return false;
}

function updateScore() {
    if (currentPlayer === 'red') {
        redScore.textContent = parseInt(redScore.textContent) + 1;
    } else {
        yellowScore.textContent = parseInt(yellowScore.textContent) + 1;
    }
}

restartButton.addEventListener('click', () => {
    board.innerHTML = '';
    boardState = Array(6).fill(null).map(() => Array(7).fill(null));
    currentPlayer = 'red';
    gameActive = true;
    statusBox.textContent = "Red's Turn";
    statusBox.style.backgroundColor = 'gray';
    createBoard();
});

createBoard();
