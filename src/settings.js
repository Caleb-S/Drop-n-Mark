
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
const speechBox = document.getElementById('speechBox');
let bubbleX = -33;
let bubbleY = 80;

function positionSpeechBox(xOffset = 0, yOffset = 0) {
            const img = document.getElementById('image');
            

            // Get image dimensions and position
            const imgRect = img.getBoundingClientRect();

            // Calculate the center of the image
            const centerX = imgRect.left + imgRect.width / 2;
            const centerY = imgRect.top + imgRect.height / 2;

   const halfImgWidth = imgRect.width / 1.2;

    // Set speech box dimensions
    speechBox.style.width = `${halfImgWidth}px`; // Set speech box width to half of image width
    speechBox.style.maxWidth = `${halfImgWidth}px`;

    // Position the speech box in the center, with additional offsets
speechBox.style.left = `${Math.floor(centerX - speechBox.offsetWidth / 1 + xOffset)}px`;
speechBox.style.top = `${Math.floor(centerY - yOffset)}px`;
    console.log(`${Math.floor(centerY - speechBox.offsetHeight / 1 + yOffset)}px`);
           
        }

        // Update speech box position when the window resizes or image changes
        window.addEventListener('resize', () => positionSpeechBox(bubbleX, bubbleY));
        document.getElementById('image').addEventListener('load', () => positionSpeechBox(bubbleX, bubbleY));

        // Call the function with custom offsets (xOffset, yOffset)
        positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position


