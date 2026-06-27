const HACKER_COLORS = [
    "#00ff41", // Hacker green
    "#00ffff", // Cyan
    "#00aaff", // Sky blue
    "#ff00ff", // Magenta
    "#ffb300", // Amber
    "#ff3131", // Bright red
    "#e8ffe8", // Soft white
    "#39ff14", // Neon green
    "#9d00ff", // Purple
    "#ff5e00", // Orange
    "#00ffaa", // Aqua green
    "#ff0055", // Pink red
    "#bcff00", // Lime
    "#1ad1d1", // Teal
    "#7b2cbf", // Violet
    "#ffff00", // Yellow

    // Additional colors
    "#00ffcc", // Mint cyan
    "#66ff66", // Light green
    "#33ccff", // Electric blue
    "#6699ff", // Cornflower blue
    "#9966ff", // Lavender
    "#cc66ff", // Bright lavender
    "#ff66cc", // Hot pink
    "#ff6699", // Rose pink
    "#ff884d", // Bright coral
    "#ffcc00", // Gold
    "#ffee33", // Neon yellow
    "#ccff33", // Yellow-green
    "#66ffcc", // Seafoam
    "#00e5ff", // Bright cyan
    "#40c4ff", // Light azure
    "#82b1ff", // Ice blue
    "#b388ff", // Pastel violet
    "#ea80fc", // Orchid
    "#ff80ab", // Bubblegum pink
    "#ff8a80", // Salmon
    "#ffd180", // Peach
    "#ffffff", // Pure white
    "#c8f7ff", // Frost blue
    "#d4ff6a", // Electric lime
    "#aaffee", // Pale aqua
    "#ffdf6b", // Soft gold
    "#7df9ff", // Electric blue
    "#f72585", // Neon pink
    "#4cc9f0", // Bright cyan-blue
    "#7209b7", // Deep neon purple
    "#b5179e", // Neon fuchsia
    "#80ffdb", // Mint
    "#caffbf", // Light lime
    "#fdffb6", // Pale yellow
    "#ffd6a5", // Warm peach
    "#9bf6ff", // Ice cyan
    "#bde0fe", // Bright powder blue
    "#ffc6ff"  // Soft pink
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

function autoResizeTextarea(textarea) {

    textarea.style.height = "auto";

    textarea.style.height = textarea.scrollHeight + "px";

}


function openDecryptModal() {

    document
        .getElementById("decryptModal")
        .classList.remove("hidden");
}

function closeDecryptModal() {

    document
        .getElementById("decryptModal")
        .classList.add("hidden");
}

function copyDecrypted() {

    navigator.clipboard.writeText(
        document.getElementById("decryptModalOutput").value
    );

    //showNotification("Copied!");
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

    requestAnimationFrame(() => {
        autoResizeTextarea(modalOutput);
    });
}


function decryptMessage() {

    const text = document.getElementById("input").value;
    const key = document.getElementById("key").value;

    const decrypted = decrypt(text, key);

    document.getElementById("output").value = decrypted;

    const decryptOutput =
        document.getElementById("decryptModalOutput");

    decryptOutput.value = decrypted;

    openDecryptModal();

    requestAnimationFrame(() => {
        autoResizeTextarea(decryptOutput);
    });

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
