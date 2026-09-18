// Apply random accent color on load
const HACKER_COLORS = ["#00ff41", "#00ffff", "#ff00ff", "#ffb300", "#39ff14", "#ff3131"];
const randomColor = HACKER_COLORS[Math.floor(Math.random() * HACKER_COLORS.length)];
document.documentElement.style.setProperty("--hacker", randomColor);

let score = 0;
let currentHoleIndex = null;
let moleTimer = null;
let moleDuration = 1000; // Time in milliseconds player has to click (1 second)

const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");

function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    clearTimeout(moleTimer);
    nextTurn();
}

function gameOver() {
    clearTimeout(moleTimer);
    holes.forEach(hole => hole.classList.remove("mole"));
    currentHoleIndex = null;
    alert(`Game Over! You missed a mole. Final Score: ${score}`);
}

function nextTurn() {
    // Clear previous active mole
    holes.forEach(hole => hole.classList.remove("mole"));

    // Pick a new random hole (different from previous if possible)
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * holes.length);
    } while (newIndex === currentHoleIndex);

    currentHoleIndex = newIndex;
    holes[currentHoleIndex].classList.add("mole");

    // If timer ends before player clicks -> Game Over
    moleTimer = setTimeout(() => {
        gameOver();
    }, moleDuration);
}

// Add click event to holes
holes.forEach((hole, index) => {
    hole.addEventListener("click", () => {
        // Only trigger if clicked hole currently has the mole
        if (index === currentHoleIndex) {
            clearTimeout(moleTimer); // Stop the game over timeout
            score++;
            scoreDisplay.textContent = score;
            hole.classList.remove("mole");
            currentHoleIndex = null;

            // Wait brief pause (200ms) then spawn next mole
            setTimeout(nextTurn, 200);
        }
    });
});
