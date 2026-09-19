// Apply random hacker accent color
const HACKER_COLORS = ["#00ff41", "#00ffff", "#ff00ff", "#ffb300", "#39ff14", "#ff3131"];
const randomColor = HACKER_COLORS[Math.floor(Math.random() * HACKER_COLORS.length)];
document.documentElement.style.setProperty("--hacker", randomColor);

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

    if (tab === 'encode') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('encode-panel').classList.add('active');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('decode-panel').classList.add('active');
    }
}

// LSB Steganography Engine
function encodeMessage() {
    const fileInput = document.getElementById('encode-file');
    const secretText = document.getElementById('encode-text').value;

    if (!fileInput.files[0] || !secretText) {
        alert("Please select an image and enter a secret message!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('stego-canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imgData.data;

            // Append delimiter to signify end of message
            const fullMessage = secretText + "###END###";
            
            // Convert message to binary
            let binaryMsg = "";
            for (let i = 0; i < fullMessage.length; i++) {
                let bin = fullMessage.charCodeAt(i).toString(2).padStart(8, '0');
                binaryMsg += bin;
            }

            if (binaryMsg.length > (data.length / 4) * 3) {
                alert("Message is too long for this image size!");
                return;
            }

            // Write binary into Least Significant Bits (RGB channels)
            let msgIdx = 0;
            for (let i = 0; i < data.length && msgIdx < binaryMsg.length; i++) {
                if ((i + 1) % 4 === 0) continue; // Skip Alpha channel

                let currentBit = parseInt(binaryMsg[msgIdx]);
                // Set LSB
                data[i] = (data[i] & 0xFE) | currentBit;
                msgIdx++;
            }

            ctx.putImageData(imgData, 0, 0);

            // Convert canvas to Blob for reliable mobile/desktop downloads
            canvas.toBlob((blob) => {
                if (!blob) {
                    alert("Error generating image file!");
                    return;
                }

                // Create a temporary object URL
                const blobUrl = URL.createObjectURL(blob);
                const preview = document.getElementById('encode-preview');
                const downloadBtn = document.getElementById('download-btn');

                preview.src = blobUrl;
                preview.style.display = 'inline-block';
                
                downloadBtn.href = blobUrl;
                downloadBtn.download = "stego_image.png";
                downloadBtn.style.display = 'inline-block';

                // Programmatically click to trigger download on tap/click
                downloadBtn.onclick = function() {
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                };
            }, 'image/png');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
}

function decodeMessage() {
    const fileInput = document.getElementById('decode-file');

    if (!fileInput.files[0]) {
        alert("Please select an image to decode!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('stego-canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, img.width, img.height).data;

            let binaryMsg = "";
            let extractedText = "";

            for (let i = 0; i < data.length; i++) {
                if ((i + 1) % 4 === 0) continue; // Skip Alpha channel

                binaryMsg += (data[i] & 1).toString();

                if (binaryMsg.length === 8) {
                    let charCode = parseInt(binaryMsg, 2);
                    let char = String.fromCharCode(charCode);
                    extractedText += char;
                    binaryMsg = "";

                    // Stop when reaching the end delimiter
                    if (extractedText.endsWith("###END###")) {
                        extractedText = extractedText.replace("###END###", "");
                        document.getElementById('decode-text').value = extractedText;
                        return;
                    }
                }
            }

            document.getElementById('decode-text').value = "No hidden message found or image unreadable.";
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
}
