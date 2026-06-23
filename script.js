const HACKER_COLORS = [
  "#00ff41", // classic matrix green
  "#00ffff", // cyan
  "#00aaff", // electric blue
  "#ff00ff", // hot magenta
  "#ffb300", // amber terminal
  "#ff3131", // red alert
  "#e8ffe8", // phosphor white
];

const randomColor =
  HACKER_COLORS[Math.floor(Math.random() * HACKER_COLORS.length)];

document.documentElement.style
  .setProperty("--hacker", randomColor);





const alphabet = "abcdefghijklmnopqrstuvwxyz";

function generateTable() {
    const table = [];

    for (let i = 0; i < 26; i++) {
        table.push(
            alphabet.slice(i) +
            alphabet.slice(0, i)
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

        const decryptedPos =
            (textPos - keyPos + 26) % 26;

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

    const text =
        document.getElementById("input").value;

    const key =
        document.getElementById("key").value;

    document.getElementById("output").value =
    encrypt(text, key);

    showNotification("Message Encrypted");
}

function decryptMessage() {

    const text =
        document.getElementById("input").value;

    const key =
        document.getElementById("key").value;

    document.getElementById("output").value =
        decrypt(text, key);

  showNotification("Message Decrypted");
}

function copyOutput() {

    const output =
        document.getElementById("output");

    navigator.clipboard.writeText(
        output.value
    );

    showNotification("Copied!");
}



function clearAll() {

    document.getElementById("input").value = "";
    //document.getElementById("key").value = "";
    document.getElementById("output").value = "";
}

function showNotification(message) {

    const notification =
        document.getElementById(
            "notification"
        );

    notification.textContent =
        message;

    notification.classList.add(
        "show"
    );

    setTimeout(() => {
        notification.classList.remove(
            "show"
        );
    }, 2500);
}

function generateRandomKey() {

    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    // Random length between 5 and 25
    const length =
        Math.floor(Math.random() * 21) + 5;

    let key = "";

    for (let i = 0; i < length; i++) {

        key += alphabet[
            Math.floor(
                Math.random() * alphabet.length
            )
        ];
    }

    document.getElementById("key").value = key;
}
