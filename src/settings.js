document.getElementById('submit-button').addEventListener('click', processSave);
document.querySelectorAll('input[name="preset"]').forEach(function (element) {
    element.addEventListener('click', presetOptions);
});
    
let presets = {
    "1": {
        "name": 'Default',
        "rootFolder": 1,
        "generalFolder": 1,
        "sortFiles": false,
        "sortFolders": false,
        "removeDuplicates": false
    },
    "2": {
        "name": 'Recommended',
        "rootFolder": 2,
        "generalFolder": 1,
        "sortFiles": true,
        "sortFolders": true,
        "removeDuplicates": true
    },
    "3": {
        "name": 'Maverick',
        "rootFolder": 1,
        "generalFolder": 2,
        "sortFiles": false,
        "sortFolders": true,
        "removeDuplicates": true
    }
};

function presetOptions() {
    let value;

    let rootFolderPref;
    let generalFolderPref;
    let sortFilesPref;
    let sortFoldersPref;
    let removeDuplicatesPref;
    
    function update() {
        updateSetting('rootFolder', rootFolderPref);
        updateSetting('generalFolder', generalFolderPref);
        updateSetting('sortFiles', sortFilesPref);
        updateSetting('sortFolders', sortFoldersPref);
        updateSetting('removeDuplicates', removeDuplicatesPref);
    }

    document.querySelectorAll('input[name="preset"]').forEach(function (element) {
        if (element.checked) {
            value = element.value;
        }
    });

    if (value !== '0') {
        rootFolderPref = presets[`${value}`].rootFolder;
        generalFolderPref = presets[`${value}`].generalFolder;
        sortFilesPref = presets[`${value}`].sortFiles;
        sortFoldersPref = presets[`${value}`].sortFolders;
        removeDuplicatesPref = presets[`${value}`].removeDuplicates;
        update();   
    }

}


function checkIfPreset() {
    // Get the current settings from the UI
    const rootFolder = document.querySelector('input[name="options"]:checked').value;
    const generalFolder = document.querySelector('input[name="general-folder"]:checked').value;
    const sortFiles = document.getElementById('organise-files-switch').checked;
    const sortFolders = document.getElementById('organise-folders-switch').checked;
    const removeDuplicates = document.getElementById('remove-duplicates-switch').checked;

    // Compare current settings with each preset
    for (let preset in presets) {
        if (
            rootFolder == presets[preset].rootFolder &&
            generalFolder == presets[preset].generalFolder &&
            sortFiles === presets[preset].sortFiles &&
            sortFolders === presets[preset].sortFolders &&
            removeDuplicates === presets[preset].removeDuplicates
        ) {
            console.log(`Matching preset found: ${preset}`);
            let presetCard = document.querySelector(`input[value="${preset}"]`);
            presetCard.checked = true;
            return preset; // Return the preset ID that matches
        }
    }
    document.querySelector('input[value="0"]').checked = true;

    console.log("No matching preset found.");
    return null; // Return null if no preset matches
}



// function to check which speech button is being hovered.
(function() {
    let bubbleX = 80;
    let bubbleY = 80;

    let settingsContainer = document.getElementById('settingsForm'); 

    let speechBox = document.getElementById('speechBox');
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
    settingsContainer.addEventListener('mouseover', function (event) {
        window.addEventListener('resize', () => positionSpeechBox(bubbleX, bubbleY));
        if (presetsCard.contains(event.target)) {
            //console.log('contains preset card');
            speechBox.textContent = presetsDetails.textContent;
            speechBox.classList.toggle('hidden', false);
            positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position
        } else if (rootCard.contains(event.target)) {
            //console.log('contains rootCard');
            speechBox.innerHTML = rootDetails.innerHTML;
            speechBox.classList.toggle('hidden', false);
            positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position
        } else if (sortCard.contains(event.target)) {
            //console.log('contains sortCard');
            speechBox.textContent = sortDetails.textContent;
            speechBox.classList.toggle('hidden', false);
            positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position
        } else if (removeDupsCard.contains(event.target)) {
            //console.log('contains sortCard');
            speechBox.textContent = removeDupsDetails.textContent;
            speechBox.classList.toggle('hidden', false);
            positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position
        } else {
            speechBox.innerHTML = '';
            speechBox.classList.toggle('hidden', true);
        }
    });
    
    settingsContainer.addEventListener('mouseout', function (event) {
        speechBox.classList.toggle('hidden', true);
        window.removeEventListener('resize', () => positionSpeechBox(bubbleX, bubbleY));
    });
})();    




// add event listeners for root folder settings section
(function() {
    let rootOption = document.querySelectorAll('input[name="options"]');
    let rootSelect = document.getElementById('custom-root-select');
    let rootText = document.getElementById('custom-root-text');
    let dropDownMenus = document.querySelectorAll('.folder-select');
    
 

    for (let i = 0; i < rootOption.length; i++) {
        rootOption[i].addEventListener('change', function() {
            checkIfPreset();
            if (this === rootOption[2]) {
                rootText.classList.toggle('hidden', true);
                rootSelect.classList.toggle('hidden', false);

                rootSelect.addEventListener('mousedown', refreshDropMenus(rootSelect));
            } else {
                rootText.classList.toggle('hidden', false);
                rootSelect.classList.toggle('hidden', true);
                rootSelect.removeEventListener('mousedown', refreshDropMenus(rootSelect));
                rootSelect.value = '';
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
            checkIfPreset();
            if (this === genOption[2]) {
                genText.classList.toggle('hidden', true);
                genSelect.classList.toggle('hidden', false);

                genSelect.addEventListener('mousedown', refreshDropMenus(genSelect));

            } else {
                genText.classList.toggle('hidden', false);
                genSelect.classList.toggle('hidden', true);
                genSelect.removeEventListener('mousedown', refreshDropMenus(genSelect));
                genSelect.value = '';


            }
        });
    }
})();


// event listeners for switches 
(function() {
let switches = document.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < switches.length; i++) {
        switches[i].addEventListener('change', function() {
            checkIfPreset();
        });
    }
})();

(() => {
    // initialise settings wih stored values
    chrome.storage.sync.get(['rootFolder', 'generalFolder', 'sortFiles', 'sortFolders', 'removeDuplicates'], function(result) {

        // root folder settings
        if (result.rootFolder) {
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

            // general folder settings
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

            // Organise Files settings
            document.getElementById('organise-files-switch').checked = result.sortFiles;
            console.log('sort files: ', result.sortFiles);
            // Organise Folders settings
            document.getElementById('organise-folders-switch').checked = result.sortFolders;

            // Remove Duplicates settings
            document.getElementById('remove-duplicates-switch').checked = result.removeDuplicates;
        }

        checkIfPreset();
    });
})();




function positionSpeechBox(xOffset = 0, yOffset = 0) {
    const img = document.getElementById('image');

    let speechBox = document.getElementById('speechBox');
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

function refreshDropMenus(selectElement) {
    selectElement.querySelectorAll('option').forEach(function (option) {
        if (option.value !== '') {
        option.remove();
        }
    });
    updateDropDownMenus();
}

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


      chrome.runtime.sendMessage({ action: "updateSettings" });

}

function updateSetting(setting, value) {

    // root folder settings
    if (setting === 'rootFolder') {
        switch ('' + value) {
            case "1":
                document.getElementById('root-opt-1').checked = true;
                break;
            case "2":
                document.getElementById('root-opt-2').checked = true;
                break;
            default:
                updateDropDownMenus();
                document.getElementById('root-opt-3').checked = true;
                document.getElementById('custom-root-text').classList.toggle('hidden');
                const customRootSelect = document.getElementById('custom-root-select');
                customRootSelect.classList.toggle('hidden');

                const observer = new MutationObserver(() => {
                    if (customRootSelect.options.length > 1) {
                        customRootSelect.value = parseInt(value);
                        observer.disconnect();
                    }
                });

                observer.observe(customRootSelect, { childList: true });
                break;
        }
    }

    // general folder settings
    if (setting === 'generalFolder') {

        switch ('' + value) {
            case "1":
                document.getElementById('gen-opt-1').checked = true;
                break;
            case "2":
                document.getElementById('gen-opt-2').checked = true;
                break;
            default:
                updateDropDownMenus();
                document.getElementById('gen-opt-3').checked = true;
                document.getElementById('custom-general-text').classList.toggle('hidden');
                const customGeneralSelect = document.getElementById('custom-general-select');
                customGeneralSelect.classList.toggle('hidden');

                const observer = new MutationObserver(() => {
                    if (customGeneralSelect.options.length > 1) {
                        customGeneralSelect.value = parseInt(value);
                        observer.disconnect();
                    }
                });

                observer.observe(customGeneralSelect, { childList: true });
                break;
        }
    }

    if (setting === 'sortFiles') {

        // Organise Files settings
        document.getElementById('organise-files-switch').checked = value;
    }

    if (setting === 'sortFolders') {
        // Organise Folders settings
        document.getElementById('organise-folders-switch').checked = value;
    }

    if (setting === 'removeDuplicates') {
        // Remove Duplicates settings
        document.getElementById('remove-duplicates-switch').checked = value;
    }


}

