// Set random hacker accent color on load
const HACKER_COLORS = ["#00ff41", "#00ffff", "#ff00ff", "#ffb300", "#39ff14", "#ff3131"];
const randomColor = HACKER_COLORS[Math.floor(Math.random() * HACKER_COLORS.length)];
document.documentElement.style.setProperty("--hacker", randomColor);

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
const HUMAN = "X";
const COMPUTER = "O";

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

const cells = document.querySelectorAll(".cell");
const statusDisplay = document.getElementById("status");

cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

function handleCellClick(e) {
    const index = parseInt(e.target.getAttribute("data-index"));

    if (board[index] !== "" || !gameActive) return;

    makeMove(index, HUMAN);

    if (checkWinner(HUMAN)) {
        statusDisplay.textContent = "You Win! 🎉";
        gameActive = false;
        return;
    }

    if (isDraw()) {
        statusDisplay.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    // Computer Turn
    statusDisplay.textContent = "Computer is thinking...";
    gameActive = false; // Disable clicking during AI delay

    setTimeout(() => {
        computerMove();

        if (checkWinner(COMPUTER)) {
            statusDisplay.textContent = "Computer Wins!";
            gameActive = false;
        } else if (isDraw()) {
            statusDisplay.textContent = "It's a Draw!";
            gameActive = false;
        } else {
            statusDisplay.textContent = "Your Turn (X)";
            gameActive = true;
        }
    }, 500);
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add("disabled");
}

function computerMove() {
    // 1. Try to win
    let move = findBestMove(COMPUTER);
    // 2. Block player from winning
    if (move === null) move = findBestMove(HUMAN);
    // 3. Take center if available
    if (move === null && board[4] === "") move = 4;
    // 4. Pick a random empty spot
    if (move === null) {
        const emptyIndices = board
            .map((val, idx) => (val === "" ? idx : null))
            .filter(val => val !== null);
        move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    if (move !== undefined && move !== null) {
        makeMove(move, COMPUTER);
    }
}

function findBestMove(player) {
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        const line = [board[a], board[b], board[c]];
        if (line.filter(val => val === player).length === 2 && line.includes("")) {
            return condition[line.indexOf("")];
        }
    }
    return null;
}

function checkWinner(player) {
    return winConditions.some(condition => {
        return condition.every(index => board[index] === player);
    });
}

function isDraw() {
    return board.every(cell => cell !== "");
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    statusDisplay.textContent = "Your Turn (X)";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("disabled");
    });
}
