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
// Global variable to store current generated image file
let currentBlobFile = null;

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

            const fullMessage = secretText + "###END###";
            
            let binaryMsg = "";
            for (let i = 0; i < fullMessage.length; i++) {
                let bin = fullMessage.charCodeAt(i).toString(2).padStart(8, '0');
                binaryMsg += bin;
            }

            if (binaryMsg.length > (data.length / 4) * 3) {
                alert("Message is too long for this image size!");
                return;
            }

            let msgIdx = 0;
            for (let i = 0; i < data.length && msgIdx < binaryMsg.length; i++) {
                if ((i + 1) % 4 === 0) continue;

                let currentBit = parseInt(binaryMsg[msgIdx]);
                data[i] = (data[i] & 0xFE) | currentBit;
                msgIdx++;
            }

            ctx.putImageData(imgData, 0, 0);

            canvas.toBlob((blob) => {
                if (!blob) {
                    alert("Error generating image file!");
                    return;
                }

                // Store file reference for Web Share API
                currentBlobFile = new File([blob], "stego_image.png", { type: "image/png" });

                const blobUrl = URL.createObjectURL(blob);
                const preview = document.getElementById('encode-preview');
                const downloadBtn = document.getElementById('download-btn');
                const shareBtn = document.getElementById('share-btn');
                const saveInstructions = document.getElementById('save-instructions');

                preview.src = blobUrl;
                preview.style.display = 'inline-block';
                saveInstructions.style.display = 'block';

                downloadBtn.href = blobUrl;
                downloadBtn.style.display = 'inline-block';

                // Show native Web Share button if browser supports file sharing (iOS Safari/Android Chrome)
                if (navigator.canShare && navigator.canShare({ files: [currentBlobFile] })) {
                    shareBtn.style.display = 'inline-block';
                }
            }, 'image/png');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
}

// Native mobile share popup
async function shareImage() {
    if (!currentBlobFile) return;
    try {
        await navigator.share({
            files: [currentBlobFile],
            title: 'Steganography Image',
            text: 'Here is the encoded image payload.'
        });
    } catch (err) {
        console.log("Share cancelled or not supported", err);
    }
}

function decodeMessage() {
    const fileInput = document.getElementById('decode-file');
    const decodeText = document.getElementById('decode-text');

    if (!fileInput.files[0]) {
        alert("Please select an image to decode!");
        return;
    }

    decodeText.value = "Extracting secret payload... Please wait.";

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

            // Cap scanning to max ~50,000 characters to prevent freezes on giant photos
            const MAX_BITS_TO_SCAN = 400000; 
            const totalBitsToScan = Math.min(data.length, MAX_BITS_TO_SCAN);

            let binaryMsg = "";
            let extractedText = "";
            let i = 0;

            // Process in chunks to prevent UI freeze
            function processChunk() {
                const CHUNK_SIZE = 30000; // Bits per async frame
                const end = Math.min(i + CHUNK_SIZE, totalBitsToScan);

                for (; i < end; i++) {
                    if ((i + 1) % 4 === 0) continue; // Skip Alpha channel

                    binaryMsg += (data[i] & 1).toString();

                    if (binaryMsg.length === 8) {
                        let charCode = parseInt(binaryMsg, 2);
                        extractedText += String.fromCharCode(charCode);
                        binaryMsg = "";

                        // Check if end delimiter was reached
                        if (extractedText.endsWith("###END###")) {
                            decodeText.value = extractedText.replace("###END###", "");
                            return; // Stop immediately
                        }
                    }
                }

                if (i < totalBitsToScan) {
                    // Yield control back to browser to keep animation/UI smooth
                    setTimeout(processChunk, 0);
                } else {
                    decodeText.value = "No hidden message detected (or image was compressed/modified).";
                }
            }

            processChunk();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
}
