const HACKER_COLORS = [
    "#00ff41", "#00ffff", "#00aaff", "#ff00ff", "#ffb300", "#ff3131",
    "#e8ffe8", "#39ff14", "#9d00ff", "#ff5e00", "#00ffaa", "#ff0055",
    "#bcff00", "#1ad1d1", "#7b2cbf", "#ffff00", "#00ffcc", "#66ff66",
    "#33ccff", "#6699ff", "#9966ff", "#cc66ff", "#ff66cc", "#ff6699",
    "#ff884d", "#ffcc00", "#ffee33", "#ccff33", "#66ffcc", "#00e5ff",
    "#40c4ff", "#82b1ff", "#b388ff", "#ea80fc", "#ff80ab", "#ff8a80",
    "#ffd180", "#ffffff", "#c8f7ff", "#d4ff6a", "#aaffee", "#ffdf6b",
    "#7df9ff", "#f72585", "#4cc9f0", "#7209b7", "#b5179e", "#80ffdb",
    "#caffbf", "#fdffb6", "#ffd6a5", "#9bf6ff", "#bde0fe", "#ffc6ff"
];

const randomColor = HACKER_COLORS[Math.floor(Math.random() * HACKER_COLORS.length)];
document.documentElement.style.setProperty("--hacker", randomColor);

// Clear all input and output fields when the page loads or refreshes
window.addEventListener("load", () => {
    const fieldsToClear = ["input", "key", "output", "modalOutput", "decryptModalOutput"];
    fieldsToClear.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = "";
        }
    });
});

// Toggle key visibility between text and password modes
function toggleKeyVisibility() {
    const keyInput = document.getElementById("key");
    const toggleBtn = document.getElementById("toggleKeyBtn");

    if (keyInput.type === "password") {
        keyInput.type = "text";
        if (toggleBtn) toggleBtn.textContent = "Hide";
    } else {
        keyInput.type = "password";
        if (toggleBtn) toggleBtn.textContent = "Show";
    }
}

function openModal() {
    document.getElementById("successModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("successModal").classList.add("hidden");
}

function autoResizeTextarea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

function openDecryptModal() {
    document.getElementById("decryptModal").classList.remove("hidden");
}

function closeDecryptModal() {
    document.getElementById("decryptModal").classList.add("hidden");
}

function copyDecrypted() {
    navigator.clipboard.writeText(
        document.getElementById("decryptModalOutput").value
    );
}

async function pasteMessage() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById("input").value = text;
    } catch (err) {
        console.error(err);
    }
}

async function shareMessage() {
    if (navigator.share) {
        await navigator.share({
            title: "Secret Messages",
            text: document.getElementById("output").value
        });
    } else {
        copyOutput();
    }
}

const alphabet = "abcdefghijklmnopqrstuvwxyz";

function generateTable() {
    const table = [];
    for (let i = 0; i < 26; i++) {
        table.push(
            alphabet.slice(i) + alphabet.slice(0, i)
        );
    }
    return table;
}

const vigenereTable = generateTable();

function encrypt(text, key) {
    key = key.toLowerCase().replace(/[^a-z]/g, "");
    if (key.length === 0) return "";

    let result = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const lower = char.toLowerCase();

        if (lower < 'a' || lower > 'z') {
            result += char;
            continue;
        }

        const textPos = alphabet.indexOf(lower);
        const keyPos = alphabet.indexOf(
            key[keyIndex % key.length]
        );

        const encryptedPos = (textPos + keyPos) % 26;
        let encryptedChar = alphabet[encryptedPos];

        if (char >= 'A' && char <= 'Z') {
            encryptedChar = encryptedChar.toUpperCase();
        }

        result += encryptedChar;
        keyIndex++;
    }

    return result;
}

function decrypt(text, key) {
    key = key.toLowerCase().replace(/[^a-z]/g, "");
    if (key.length === 0) return "";

    let result = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const lower = char.toLowerCase();

        if (lower < 'a' || lower > 'z') {
            result += char;
            continue;
        }

        const textPos = alphabet.indexOf(lower);
        const keyPos = alphabet.indexOf(
            key[keyIndex % key.length]
        );

        const decryptedPos = (textPos - keyPos + 26) % 26;
        let decryptedChar = alphabet[decryptedPos];

        if (char >= 'A' && char <= 'Z') {
            decryptedChar = decryptedChar.toUpperCase();
        }

        result += decryptedChar;
        keyIndex++;
    }

    return result;
}

function encryptMessage() {
    const text = document.getElementById("input").value;
    const key = document.getElementById("key").value;
    const encrypted = encrypt(text, key);

    document.getElementById("output").value = encrypted;
    document.getElementById("modalOutput").value = encrypted;

    openModal();

    requestAnimationFrame(() => {
        autoResizeTextarea(document.getElementById("modalOutput"));
    });
}

function decryptMessage() {
    const text = document.getElementById("input").value;
    const key = document.getElementById("key").value;
    const decrypted = decrypt(text, key);

    document.getElementById("output").value = decrypted;

    const decryptOutput = document.getElementById("decryptModalOutput");
    decryptOutput.value = decrypted;

    openDecryptModal();

    requestAnimationFrame(() => {
        autoResizeTextarea(decryptOutput);
    });
}

function copyOutput() {
    const output = document.getElementById("output");
    navigator.clipboard.writeText(output.value);
}

function clearAll() {
    document.getElementById("input").value = "";
    document.getElementById("key").value = "";
    document.getElementById("output").value = "";
}

function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);
}

function generateRandomKey() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const length = Math.floor(Math.random() * 21) + 5;
    let key = "";

    for (let i = 0; i < length; i++) {
        key += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    document.getElementById("key").value = key;
}
