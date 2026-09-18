// Apply random accent color on load
const HACKER_COLORS = ["#00ff41", "#00ffff", "#ff00ff", "#ffb300", "#39ff14", "#ff3131"];
const randomColor = HACKER_COLORS[Math.floor(Math.random() * HACKER_COLORS.length)];
document.documentElement.style.setProperty("--hacker", randomColor);

let score = 0;
let currentHoleIndex = null;
let gameInterval = null;
let activeMoleClicked = true; // Tracks if the current mole was hit

const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");

function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    currentHoleIndex = null;
    activeMoleClicked = true;

    if (gameInterval) clearInterval(gameInterval);

    // Pick a new mole position every 900ms
    gameInterval = setInterval(showMole, 900);
}

function gameOver() {
    clearInterval(gameInterval);
    gameInterval = null;
    
    // Clear all moles
    holes.forEach(hole => hole.classList.remove("mole"));
    currentHoleIndex = null;

    alert(`Game Over! You missed a mole. Final Score: ${score}`);
}

function showMole() {
    // If a mole was visible and wasn't clicked in time -> Lose
    if (currentHoleIndex !== null && !activeMoleClicked) {
        gameOver();
        return;
    }

    // Reset hit tracker for the new turn
    activeMoleClicked = false;

    // Clear previous mole graphics
    holes.forEach(hole => hole.classList.remove("mole"));

    // Pick a new random hole (different from the last one)
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * holes.length);
    } while (newIndex === currentHoleIndex);

    currentHoleIndex = newIndex;
    holes[currentHoleIndex].classList.add("mole");
}

// Add click listener to each hole
holes.forEach((hole, index) => {
    hole.addEventListener("click", () => {
        if (index === currentHoleIndex && !activeMoleClicked) {
            activeMoleClicked = true; // Player hit it in time
            score++;
            scoreDisplay.textContent = score;
            hole.classList.remove("mole");
        }
    });
});
