
/*
document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const option1 = document.getElementById('option1').checked;
    chrome.storage.sync.set({ option1: option1 }, function() {
        console.log('Settings saved');
    });
});

// Load saved settings
chrome.storage.sync.get(['option1'], function(result) {
    document.getElementById('option1').checked = result.option1 || false;
});
*/
let bubbleX = -60;
let bubbleY = -45;

function positionSpeechBox(xOffset = 0, yOffset = 0) {
            const img = document.getElementById('image');
            const speechBox = document.getElementById('speechBox');

            // Get image dimensions and position
            const imgRect = img.getBoundingClientRect();

            // Calculate the center of the image
            const centerX = imgRect.left + imgRect.width / 2;
            const centerY = imgRect.top + imgRect.height / 2;

            // Position the speech box in the center, with additional offsets
            speechBox.style.left = `${centerX - speechBox.offsetWidth / 2 + xOffset}px`;
            speechBox.style.top = `${centerY - speechBox.offsetHeight / 2 + yOffset}px`;
        }

        // Update speech box position when the window resizes or image changes
        window.addEventListener('resize', () => positionSpeechBox());
        document.getElementById('image').addEventListener('load', () => positionSpeechBox());

        // Call the function with custom offsets (xOffset, yOffset)
        positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position


