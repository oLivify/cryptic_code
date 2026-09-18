// Apply random hacker color on load
const HACKER_COLORS = ["#00ff41", "#00ffff", "#ff00ff", "#ffb300", "#39ff14", "#ff3131"];
const randomColor = HACKER_COLORS[Math.floor(Math.random() * HACKER_COLORS.length)];
document.documentElement.style.setProperty("--hacker", randomColor);

let sequence = [];
let playerSequence = [];
let level = 1;
let isPlayingSequence = false;
let gameActive = false;

const tiles = document.querySelectorAll(".tile");
const levelDisplay = document.getElementById("level");
const statusDisplay = document.getElementById("status");

tiles.forEach(tile => {
    tile.addEventListener("click", handleTileClick);
});

function startGame() {
    sequence = [];
    playerSequence = [];
    level = 1;
    gameActive = true;
    levelDisplay.textContent = level;
    statusDisplay.textContent = "Memorize the sequence...";
    nextRound();
}

function nextRound() {
    playerSequence = [];
    statusDisplay.textContent = "Watch closely...";
    isPlayingSequence = true;

    // Add a random tile index (0 to 8) to sequence
    const nextTile = Math.floor(Math.random() * tiles.length);
    sequence.push(nextTile);

    // Play back sequence
    let i = 0;
    const interval = setInterval(() => {
        flashTile(sequence[i]);
        i++;
        if (i >= sequence.length) {
            clearInterval(interval);
            setTimeout(() => {
                isPlayingSequence = false;
                statusDisplay.textContent = "Your Turn!";
            }, 500);
        }
    }, 600);
}

function flashTile(index) {
    const tile = tiles[index];
    tile.classList.add("active");
    setTimeout(() => {
        tile.classList.remove("active");
    }, 350);
}


function gameOver() {
    gameActive = false;
    statusDisplay.textContent = `SYSTEM FAILURE: Sequence Broken! Final Level: ${level}`;
}
