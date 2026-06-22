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
