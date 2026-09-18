// Set random hacker accent color on load
const HACKER_COLORS = ["#00ff41", "#00ffff", "#ff00ff", "#ffb300", "#39ff14", "#ff3131"];
const randomColor = HACKER_COLORS[Math.floor(Math.random() * HACKER_COLORS.length)];
document.documentElement.style.setProperty("--hacker", randomColor);

const symbols = ["🔑", "🔒", "💾", "💻", "⚡", "👾", "🛡️", "📡"];
let cardsData = [...symbols, ...symbols]; // 16 cards total (8 pairs)

let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false;

const grid = document.getElementById("card-grid");
const movesDisplay = document.getElementById("moves");
const statusDisplay = document.getElementById("game-status");

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initGame() {
    grid.innerHTML = "";
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    lockBoard = false;
    movesDisplay.textContent = moves;
    statusDisplay.textContent = "Find all matching symbol pairs";

    shuffle(cardsData);

    cardsData.forEach((symbol, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.textContent = "❓";

        card.addEventListener("click", flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this.classList.contains("flipped") || this.classList.contains("matched")) return;

    this.classList.add("flipped");
    this.textContent = this.dataset.symbol;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        // Match found
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === symbols.length) {
            statusDisplay.textContent = `SYSTEM DECRYPTED! Cleared in ${moves} moves.`;
        }
    } else {
        // Not a match - flip back after delay
        lockBoard = true;
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.textContent = "❓";
            card2.textContent = "❓";
            flippedCards = [];
            lockBoard = false;
        }, 800);
    }
}

function resetGame() {
    initGame();
}

initGame();
