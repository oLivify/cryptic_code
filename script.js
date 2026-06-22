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

    if (key.length === 0) {
        return "";
    }

    let result = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {

        const char = text[i];
        const lowerChar = char.toLowerCase();

        // Keep spaces, punctuation, numbers, emojis, etc.
        if (!alphabet.includes(lowerChar)) {
            result += char;
            continue;
        }

        const row =
            alphabet.indexOf(
                key[keyIndex % key.length]
            );

        const col =
            alphabet.indexOf(lowerChar);

        let encryptedChar =
            vigenereTable[row][col];

        // Preserve original capitalization
        if (char === char.toUpperCase()) {
            encryptedChar =
                encryptedChar.toUpperCase();
        }

        result += encryptedChar;

        keyIndex++;
    }

    return result;
}

function decrypt(text, key) {

    key = key.toLowerCase().replace(/[^a-z]/g, "");

    if (key.length === 0) {
        return "";
    }

    let result = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {

        const char = text[i];
        const lowerChar = char.toLowerCase();

        // Keep spaces, punctuation, numbers, emojis, etc.
        if (!alphabet.includes(lowerChar)) {
            result += char;
            continue;
        }

        const row =
            alphabet.indexOf(
                key[keyIndex % key.length]
            );

        const col =
            vigenereTable[row]
            .indexOf(lowerChar);

        let decryptedChar =
            alphabet[col];

        // Preserve original capitalization
        if (char === char.toUpperCase()) {
            decryptedChar =
                decryptedChar.toUpperCase();
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
}

function decryptMessage() {

    const text =
        document.getElementById("input").value;

    const key =
        document.getElementById("key").value;

    document.getElementById("output").value =
        decrypt(text, key);
}

function copyOutput() {

    const output =
        document.getElementById("output");

    navigator.clipboard.writeText(
        output.value
    );

    alert("Copied!");
}
