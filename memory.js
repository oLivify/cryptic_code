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

// Check if an encrypted message exists in the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const lockedMessage = urlParams.get("msg");

// Update handleTileClick inside memory.js
function handleTileClick(e) {
    if (!gameActive || isPlayingSequence) return;

    const clickedIndex = parseInt(e.target.getAttribute("data-index"));
    flashTile(clickedIndex);
    playerSequence.push(clickedIndex);

    const currentStep = playerSequence.length - 1;

    if (playerSequence[currentStep] !== sequence[currentStep]) {
        e.target.classList.add("wrong");
        setTimeout(() => e.target.classList.remove("wrong"), 400);
        gameOver();
        return;
    }

    if (playerSequence.length === sequence.length) {
        // Check if player cleared Round 3 (level increases to 4)
        if (level === 3 && lockedMessage) {
            gameActive = false;
            statusDisplay.textContent = "LEVEL 3 CLEARED // DATA UNLOCKED";
            document.getElementById("decrypt-section").style.display = "block";
            return;
        }

        level++;
        levelDisplay.textContent = level;
        statusDisplay.textContent = "Access Granted! Next Level...";
        isPlayingSequence = true;
        setTimeout(nextRound, 1000);
    }
}

// Vigenère Cipher Decryption function for memory.js
function decryptGameMessage() {
    const key = document.getElementById("game-key").value;
    if (!key || !lockedMessage) return;

    let result = "";
    let keyIndex = 0;

    for (let i = 0; i < lockedMessage.length; i++) {
        let charCode = lockedMessage.charCodeAt(i);

        if (charCode >= 32 && charCode <= 126) {
            let shift = key.charCodeAt(keyIndex % key.length);
            let decryptedCode = ((charCode - 32 - shift + 9500) % 95) + 32;
            result += String.fromCharCode(decryptedCode);
            keyIndex++;
        } else {
            result += lockedMessage[i];
        }
    }

    document.getElementById("decrypted-result").value = result;
}

function gameOver() {
    gameActive = false;
    statusDisplay.textContent = `SYSTEM FAILURE: Sequence Broken! Final Level: ${level}`;
}
