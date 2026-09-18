// Apply random hacker color on load
const HACKER_COLORS = ["#00ff41", "#00ffff", "#ff00ff", "#ffb300", "#39ff14", "#ff3131"];
const randomColor = HACKER_COLORS[Math.floor(Math.random() * HACKER_COLORS.length)];
document.documentElement.style.setProperty("--hacker", randomColor);

let state = "idle"; // "idle", "waiting", "ready"
let startTime = 0;
let timeoutId = null;
let bestTime = null;

const box = document.getElementById("target-box");
const title = document.getElementById("box-title");
const sub = document.getElementById("box-sub");
const bestDisplay = document.getElementById("best-score");

function handleBoxClick() {
    if (state === "idle") {
        // Start waiting phase
        state = "waiting";
        box.className = "reaction-box waiting";
        title.textContent = "WAIT FOR GREEN...";
        sub.textContent = "Do not click yet!";

        // Random delay between 2 and 5 seconds
        const randomDelay = Math.floor(Math.random() * 3000) + 2000;
        timeoutId = setTimeout(() => {
            state = "ready";
            box.className = "reaction-box ready";
            title.textContent = "CLICK NOW!";
            sub.textContent = "";
            startTime = Date.now();
        }, randomDelay);

    } else if (state === "waiting") {
        // Player clicked too early
        clearTimeout(timeoutId);
        state = "idle";
        box.className = "reaction-box";
        title.textContent = "TOO EARLY!";
        sub.textContent = "Click to try again.";

    } else if (state === "ready") {
        // Player clicked on time
        const reactionTime = Date.now() - startTime;
        state = "idle";
        box.className = "reaction-box";
        title.textContent = `${reactionTime} ms`;
        sub.textContent = "Click to try again";

        // Update best score
        if (bestTime === null || reactionTime < bestTime) {
            bestTime = reactionTime;
            bestDisplay.textContent = bestTime;
        }
    }
}
