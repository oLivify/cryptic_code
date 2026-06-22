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
    return text
        .toLowerCase()
        .replace(/[^A-Z]/g, "");
}

function encrypt(text, key) {

    text = cleanText(text);
    key = cleanText(key);

    if (key.length === 0) {
        return "";
    }

    let result = "";

    for (let i = 0; i < text.length; i++) {

        const row =
            alphabet.indexOf(
                key[i % key.length]
            );

        const col =
            alphabet.indexOf(
                text[i]
            );

        result +=
            vigenereTable[row][col];
    }

    return result;
}

function decrypt(text, key) {

    text = cleanText(text);
    key = cleanText(key);

    if (key.length === 0) {
        return "";
    }

    let result = "";

    for (let i = 0; i < text.length; i++) {

        const row =
            alphabet.indexOf(
                key[i % key.length]
            );

        const col =
            vigenereTable[row]
            .indexOf(text[i]);

        result += alphabet[col];
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
