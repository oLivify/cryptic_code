const HACKER_COLORS = [
    "#00ff41", "#00ffff", "#00aaff", "#ff00ff", "#ffb300", "#ff3131", "#e8ffe8",
    "#39ff14", "#9d00ff", "#ff5e00", "#00ffaa", "#ff0055", "#bcff00", "#1ad1d1", 
    "#7b2cbf", "#ffff00"
  ];

const randomColor = HACKER_COLORS[Math.floor(Math.random() * HACKER_COLORS.length)];
document.documentElement.style.setProperty("--hacker", randomColor);

function openModal() {

    document
        .getElementById("successModal")
        .classList.remove("hidden");
}

function closeModal() {

    document
        .getElementById("successModal")
        .classList.add("hidden");
}

function resizeOutputBox() {

    const output = document.getElementById("modalOutput");

    // Force reset first
    output.style.height = "auto";

    // Then set to real content height
    output.style.height = output.scrollHeight + "px";
}


async function pasteMessage() {

    try {

        const text =
            await navigator.clipboard.readText();

        document.getElementById(
            "input"
        ).value = text;

        //showNotification("Pasted");

    } catch (err) {

        //showNotification("Paste Failed");

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

    const encrypted = encrypt(text, key);

    document.getElementById("output").value = encrypted;
    document.getElementById("modalOutput").value = encrypted;

    openModal();

    // IMPORTANT: wait until modal is visible
    requestAnimationFrame(() => {
        requestAnimationFrame(resizeOutputBox);
    });
}


function decryptMessage() {
    //pasteMessage();

    const text =
        document.getElementById("input").value;

    const key =
        document.getElementById("key").value;

    document.getElementById("output").value =
        decrypt(text, key);

  //showNotification("Message Decrypted");
}

function copyOutput() {

    const output =
        document.getElementById("output");

    navigator.clipboard.writeText(
        output.value
    );

    //showNotification("Copied!");
}



function clearAll() {

    document.getElementById("input").value = "";
    //document.getElementById("key").value = "";
    document.getElementById("output").value = "";

    //showNotification("Cleared!");
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

// function toggleKeyVisibility() {
//     const keyInput = document.getElementById("key");
//     if (keyInput.type === "password") {
//         keyInput.type = "text";
//     } else {
//         keyInput.type = "password";
//     }
// }


//history stuff ~~dont use~~
// function logOperation(operation) {

//     const history =
//         document.getElementById("history");

//     const now = new Date();

//     const timestamp =
//         now.toLocaleTimeString();

//     const entry =
//         document.createElement("div");

//     entry.className = "history-entry";

//     entry.textContent =
//         `[${timestamp}] ${operation}`;

//     history.prepend(entry);
// }

// function logOperation(operation) {

//     const history =
//         JSON.parse(
//             localStorage.getItem("cipherHistory")
//         ) || [];

//     const now =
//         new Date().toLocaleTimeString();

//     history.unshift(
//         `[${now}] ${operation}`
//     );

//    history.splice(20);

//     localStorage.setItem(
//         "cipherHistory",
//         JSON.stringify(history)
//     );

//     renderHistory();
// }


// function renderHistory() {

//     const historyDiv =
//         document.getElementById("history");

//     const history =
//         JSON.parse(
//             localStorage.getItem("cipherHistory")
//         ) || [];

//     historyDiv.innerHTML = "";

//     history.forEach(entry => {

//         const div =
//             document.createElement("div");

//         div.className =
//             "history-entry";

//         div.textContent =
//             entry;

//         historyDiv.appendChild(div);
//     });
// }



//always last thing
// window.onload = function() {
//     renderHistory();
// };
