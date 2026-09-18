// Apply random accent color on load
const HACKER_COLORS = ["#00ff41", "#00ffff", "#ff00ff", "#ffb300", "#39ff14", "#ff3131"];
const randomColor = HACKER_COLORS[Math.floor(Math.random() * HACKER_COLORS.length)];
document.documentElement.style.setProperty("--hacker", randomColor);

let score = 0;
let currentHoleIndex = null;
let gameInterval = null;

const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");

function startGame() {
    score = 0;
    scoreDisplay.textContent = score;

    if (gameInterval) clearInterval(gameInterval);

    // Pick a new mole position every 800ms
    gameInterval = setInterval(showMole, 800);
}

function showMole() {
    // Clear previous mole
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
        if (index === currentHoleIndex) {
            score++;
            scoreDisplay.textContent = score;
            hole.classList.remove("mole");
            currentHoleIndex = null; // Prevent multi-clicking the same mole
        }
    });
});
