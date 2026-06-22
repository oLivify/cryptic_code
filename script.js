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

function cleanText(text) {
    return text.toLowerCase();
}

function encrypt(text, key) {

    text = text.toLowerCase();
    key = key.toLowerCase();

    let result = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {

        const char = text[i];

        if (!alphabet.includes(char)) {
            result += char;
            continue;
        }

        const row =
            alphabet.indexOf(
                key[keyIndex % key.length]
            );

        const col =
            alphabet.indexOf(char);

        result +=
            vigenereTable[row][col];

        keyIndex++;
    }

    return result;
}

function decrypt(text, key) {

    text = text.toLowerCase();
    key = key.toLowerCase();

    let result = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {

        const char = text[i];

        if (!alphabet.includes(char)) {
            result += char;
            continue;
        }

        const row =
            alphabet.indexOf(
                key[keyIndex % key.length]
            );

        const col =
            vigenereTable[row]
            .indexOf(char);

        result += alphabet[col];

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

    output.select();

    navigator.clipboard.writeText(
        output.value
    );

    alert("Copied!");
}
