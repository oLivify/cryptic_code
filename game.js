// Apply random hacker color theme
const HACKER_COLORS = ["#00ff41", "#00ffff", "#ff00ff", "#ffb300", "#39ff14", "#ff3131"];
const randomColor = HACKER_COLORS[Math.floor(Math.random() * HACKER_COLORS.length)];
document.documentElement.style.setProperty("--hacker", randomColor);

let score = 0;
let currentHoleIndex = null;
let moleTimer = null;
let gameActive = false;
const moleDuration = 1000; // 1 second to hit each mole

const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");

function startGame() {
    // Reset state
    score = 0;
    scoreDisplay.textContent = score;
    gameActive = true;
    currentHoleIndex = null;

    // Clear any leftover timers and active mole graphics
    clearTimeout(moleTimer);
    holes.forEach(hole => hole.classList.remove("mole"));

    // Start the loop
    spawnMole();
}

function spawnMole() {
    if (!gameActive) return;

    // Clear previous active mole graphic
    holes.forEach(hole => hole.classList.remove("mole"));

    // Select a random new hole
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * holes.length);
    } while (newIndex === currentHoleIndex && holes.length > 1);

    currentHoleIndex = newIndex;
    holes[currentHoleIndex].classList.add("mole");

    // Start countdown for current mole. If it runs out -> Game Over
    clearTimeout(moleTimer);
    moleTimer = setTimeout(() => {
        gameOver();
    }, moleDuration);
}

function gameOver() {
    gameActive = false;
    clearTimeout(moleTimer);
    holes.forEach(hole => hole.classList.remove("mole"));
    currentHoleIndex = null;

    alert(`Game Over! You missed a mole.\nFinal Score: ${score}`);
}

// Attach click listeners to all holes
holes.forEach((hole, index) => {
    hole.addEventListener("click", () => {
        // Only react if game is running and player clicked the active mole
        if (gameActive && index === currentHoleIndex) {
            clearTimeout(moleTimer); // Cancel failure timer
            score++;
            scoreDisplay.textContent = score;

            // Remove mole immediately so player knows they hit it
            hole.classList.remove("mole");
            currentHoleIndex = null;

            // Pause briefly (150ms) before spawning the next mole
            setTimeout(() => {
                if (gameActive) spawnMole();
            }, 150);
        }
    });
});
