var devmode = false;
chrome.runtime.sendMessage({ action: 'getEnvironment' }, response => {
    devmode = response.devmode;
    if (devmode) {
        console.warn(`| WARNING: DROPNMARK IS IN DEVMODE
  |
  | COMMANDS:
  | [Ctrl Shift L] - Reload Extension
  | [Ctrl Shift K] - Remove html for blank canvas
  |
  `);
        reloadExtensionHotkey();
        blackPageHotkey();
    }
});

// Reload extension using (Ctrl Shift L) key combination
function reloadExtensionHotkey() {
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'L') {
            setTimeout(function () { location.reload(); }, 1000);


            chrome.runtime.sendMessage({ action: 'refreshExtension' });

        }
    });
}

// Remove all html, creating blank page using (Ctrl Shift K) key combination
function blackPageHotkey() {
    document.addEventListener('keydown', function (event) {
        // Check if Ctrl + Shift + K is pressed
        if (event.ctrlKey && event.shiftKey && event.key === 'K') {
            // Get all <link> elements with rel="stylesheet"
            var cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
            var divs = document.querySelectorAll('div');

            divs.forEach(function (div) {
                div.remove();
            });

            // Remove each <link> element from the document
            cssLinks.forEach(function (link) {
                link.remove();
            });
        }
    });
}



