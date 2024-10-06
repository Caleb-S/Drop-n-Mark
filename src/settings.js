
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


    /*
    todo: 
    - display speechbox on settings-card hover.
    - connect preset settings
    - connect root settings


    */

//  function to position the speech bubble
let speechBox = document.getElementById('speechBox');
let bubbleX = 80;
let bubbleY = 80;
// Update speech box position when the window resizes or image changes
window.addEventListener('resize', () => positionSpeechBox(bubbleX, bubbleY));
document.getElementById('image').addEventListener('load', () => positionSpeechBox(bubbleX, bubbleY));

// Call the function with custom offsets (xOffset, yOffset)
positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position

document.getElementById('submit-button').addEventListener('click', processSave);

                updateDropDownMenus();


// function to check which speech button is being hovered.
(function() {
    let settingsContainer = document.getElementById('settingsForm'); 
  
    let presetsCard = document.getElementById('presets');
    let rootCard = document.getElementById('root-folder-pref');
    let sortCard = document.getElementById('organise-folders');
    let removeDupsCard = document.getElementById('remove-duplicates');

    // Get details of element
    let presetsDetails = presetsCard.getElementsByTagName('details')[0];
    let rootDetails = rootCard.getElementsByTagName('details')[0];
    let sortDetails = sortCard.getElementsByTagName('details')[0];
    let removeDupsDetails = removeDupsCard.getElementsByTagName('details')[0];

    // Remove text from speech box
    //let speechBox = document.getElementById('speechBox'); 
    speechBox.innerHTML = '';
    speechBox.style.display = 'none';

    settingsContainer.addEventListener('mouseover', function (event) {
        if (presetsCard.contains(event.target)) {
            //console.log('contains preset card');
            speechBox.textContent = presetsDetails.textContent;
            speechBox.style.display = 'block';
            positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position

        } else if (rootCard.contains(event.target)) {
            //console.log('contains rootCard');
            speechBox.innerHTML = rootDetails.innerHTML;
            speechBox.style.display = 'block';
            positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position

        } else if (sortCard.contains(event.target)) {
            //console.log('contains sortCard');
            speechBox.textContent = sortDetails.textContent;
            speechBox.style.display = 'block';
            positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position

        } else if (removeDupsCard.contains(event.target)) {
            //console.log('contains sortCard');
            speechBox.textContent = removeDupsDetails.textContent;
            speechBox.style.display = 'block';
            positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position

        } else {
            speechBox.innerHTML = '';
            speechBox.style.display = 'none';
        }
    });
})();    

function positionSpeechBox(xOffset = 0, yOffset = 0) {
    const img = document.getElementById('image');


    // Get image dimensions and position
    const imgRect = img.getBoundingClientRect();

    // Calculate the center of the image
    const centerX = imgRect.left + imgRect.width / 2;
    const centerY = imgRect.top + imgRect.height / 2;

    const halfImgWidth = imgRect.width / 1.8;

    // Set speech box dimensions
    speechBox.style.width = `${halfImgWidth}px`; // Set speech box width to half of image width
    speechBox.style.maxWidth = `${halfImgWidth}px`;

    // Position the speech box in the center, with additional offsets
    speechBox.style.left = `${Math.floor(centerX - speechBox.offsetWidth / 1 + xOffset)}px`;
    speechBox.style.top = `${Math.floor(centerY - yOffset)}px`;
    //console.log(`${Math.floor(centerY - speechBox.offsetHeight / 1 + yOffset)}px`);

}

/*
document.getElementById("rootBookmarkBar").addEventListener("change", function() {
    if (this.checked) {
        console.log("Switch is ON");
    } else {
        console.log("Switch is OFF");
    }
});*/

function refreshDropMenus(selectElement) {
    selectElement.querySelectorAll('option').forEach(function (option) {
        if (option.value !== '') {
        option.remove();
        }
    });
    updateDropDownMenus();
}

// add event listeners for root folder settings section
(function() {
    let rootOption = document.querySelectorAll('input[name="options"]');
    let rootSelect = document.getElementById('custom-root-select');
    let rootText = document.getElementById('custom-root-text');
    let dropDownMenus = document.querySelectorAll('.folder-select');
    
 

    for (let i = 0; i < rootOption.length; i++) {
        rootOption[i].addEventListener('change', function() {
            console.log('event triggered');
            if (this === rootOption[2]) {
                rootText.classList.toggle('hidden');
                rootSelect.classList.toggle('hidden');

                rootSelect.addEventListener('mousedown', refreshDropMenus(rootSelect));
            } else {
                if (rootText.classList.contains('hidden')) {
                    rootText.classList.toggle('hidden');
                    rootSelect.classList.toggle('hidden');
                    rootSelect.removeEventListener('mousedown', refreshDropMenus(rootSelect));
                    rootSelect.value = '';
                }
            }
        });
    }
})();

// add event listeners for general folder settings section
(function() {
    let genOption = document.querySelectorAll('input[name="general-folder"]');
    let genSelect = document.getElementById('custom-general-select');
    let genText = document.getElementById('custom-general-text');
    let dropDownMenus = document.querySelectorAll('.folder-select');

    for (let i = 0; i < genOption.length; i++) {
        genOption[i].addEventListener('change', function() {
            console.log('event triggered');
            if (this === genOption[2]) {
                genText.classList.toggle('hidden');
                genSelect.classList.toggle('hidden');

                genSelect.addEventListener('mousedown', refreshDropMenus(genSelect));

            } else {
                if (genText.classList.contains('hidden')) {
                    genText.classList.toggle('hidden');
                    genSelect.classList.toggle('hidden');
                    genSelect.removeEventListener('mousedown', refreshDropMenus(genSelect));
                    genSelect.value = '';
                }

            }
        });
    }
})();

/*
for (let i = 0; i < dropDownMenus.length; i++) {
    dropDownMenus[i].addEventListener('mousedown', function () {
        // remove all options in menus
        
        dropDownMenus[i].querySelectorAll('option').forEach(function (option) {
            option.remove();
        });
        updateDropDownMenus();
    });
}*/

function updateDropDownMenus() {
  

    let dropDownMenus = document.querySelectorAll('.folder-select');


    chrome.runtime.sendMessage({ action: "getAllBookmarks" }, function (response) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        } else {
           
            (response.bookmarks).forEach(function (bookmark) {
                handleBookmarkLevel(bookmark, dropDownMenus, 'root');
            });

        }
    });
}


function handleBookmarkLevel(bookmark, parentElement, level) {
    switch (level) {
        case 'root':
            if (bookmark.children) {
                bookmark.children.forEach(function (child) {
                    handleBookmarkLevel(child, parentElement, 'primary');
                });
            }
            break;

        case 'primary':
            if (bookmark.children) {
                bookmark.children.forEach(function (mainChild) {
                    handleBookmarkLevel(mainChild, parentElement, 'main');
                });
            }
            break;

        case 'main':
            if (bookmark.children && !bookmark.url && bookmark.title.trim() !== "") {
                for (let i = 0; i < parentElement.length; i++) {
                    let option = document.createElement('option');
                    option.value = bookmark.id;
                    option.text = bookmark.title;
                    parentElement[i].appendChild(option);
                }
            }
            break;
    }
}

function processSave() {
    // root folder settings
    // Saves under key 'rootFolder'
     (() => { 
         let selectedFolder = document.getElementById('custom-root-select').value;
         let options = document.querySelectorAll('input[name="options"]');
         chrome.storage.sync.set({ rootFolder: selectedFolder });
         if (selectedFolder === "") {
             chrome.storage.sync.set({ rootFolder:  options[options[0].checked ? 0 : 1].value });
         }
     })();

    // general folder settings
    // Saves under key 'generalFolder'
    (() => { 
        let selectedFolder = document.getElementById('custom-general-select').value;
        let options = document.querySelectorAll('input[name="general-folder"]');
        chrome.storage.sync.set({ generalFolder: selectedFolder });
        if (selectedFolder === "") {
            chrome.storage.sync.set({ generalFolder:  options[options[0].checked ? 0 : 1].value });
        }
    })();

    // Organise Files settings
    // Saves under key 'sortFiles'
    (() => {         
        var organiseFilesSwitch = document.getElementById('organise-files-switch');
        let isChecked = organiseFilesSwitch.checked ? true : false;
        chrome.storage.sync.set({ sortFiles: isChecked });
    })();

    // Organise Folders settings
    // Saves under key 'sortFolders'
    (() => {        
        var sortFoldersSwitch = document.getElementById('organise-folders-switch');
        let isChecked = sortFoldersSwitch.checked ? true : false;
        chrome.storage.sync.set({ sortFolders: isChecked });
    })();

    // Remove Duplicates settings
    // Saves under key 'removeDuplicates'
    (() => {         
        var removeDuplicatesSwitch = document.getElementById('remove-duplicates-switch');
        let isChecked = removeDuplicatesSwitch.checked ? true : false;
        chrome.storage.sync.set({ removeDuplicates: isChecked });
    })();

    //console.log(chrome.storage.sync.get(['rootFolder', 'generalFolder', 'organiseFiles', 'organiseFolders', 'removeDuplicates']));

}

(() => {
// initialise settings wih stored values
    chrome.storage.sync.get(['rootFolder', 'generalFolder', 'sortFiles', 'sortFolders', 'removeDuplicates'], function(result) {

        updateDropDownMenus();
   
        switch (result.rootFolder) {
            case "1":
                document.getElementById('root-opt-1').checked = true;
                break;
            case "2":
                document.getElementById('root-opt-2').checked = true;
                break;
            default:
                document.getElementById('root-opt-3').checked = true;
                document.getElementById('custom-root-text').classList.toggle('hidden');
                const customRootSelect = document.getElementById('custom-root-select');
                customRootSelect.classList.toggle('hidden');

                const observer = new MutationObserver(() => {
                    if (customRootSelect.options.length > 1) {
                        customRootSelect.value = parseInt(result.rootFolder);
                        observer.disconnect();
                    }
                });

                observer.observe(customRootSelect, { childList: true });
                break;
        }
   
        switch (result.generalFolder) {
            case "1":
                document.getElementById('gen-opt-1').checked = true;
                break;
            case "2":
                document.getElementById('gen-opt-2').checked = true;
                break;
            default:
                document.getElementById('gen-opt-3').checked = true;
                document.getElementById('custom-general-text').classList.toggle('hidden');
                const customGeneralSelect = document.getElementById('custom-general-select');
                customGeneralSelect.classList.toggle('hidden');

                const observer = new MutationObserver(() => {
                    if (customGeneralSelect.options.length > 1) {
                        customGeneralSelect.value = parseInt(result.generalFolder);
                        observer.disconnect();
                    }
                });

                observer.observe(customGeneralSelect, { childList: true });
                break;
        }
         console.log(result.sortFiles);
        document.getElementById('organise-files-switch').checked = result.sortFiles;
        document.getElementById('organise-folders-switch').checked = result.sortFolders;
        document.getElementById('remove-duplicates-switch').checked = result.removeDuplicates;

    });
})();
