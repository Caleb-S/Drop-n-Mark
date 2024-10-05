
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


// function to check which speech button is being hovered.
(function() {
    let settingsContainer = document.getElementById('settingsForm'); 
  
    let presetsCard = document.getElementById('presets');
    let rootCard = document.getElementById('root-folder');
    let sortCard = document.getElementById('sort-files');
    let removeDupsCard = document.getElementById('remove-duplicates');

    // Get details of element
    let presetsDetails = presetsCard.getElementsByTagName('details');
    let rootDetails = rootCard.getElementsByTagName('details');
    let sortDetails = sortCard.getElementsByTagName('details');
    let removeDupsDetails = removeDupsCard.getElementsByTagName('details');

    // Remove text from speech box
    //let speechBox = document.getElementById('speechBox'); 
    speechBox.innerHTML = '';
    speechBox.style.display = 'none';

    settingsContainer.addEventListener('mouseover', function (event) {
        if (presetsCard.contains(event.target)) {
            //console.log('contains preset card');
            speechBox.textContent = presetsDetails[0].textContent;
            speechBox.style.display = 'block';
            positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position

        } else if (rootCard.contains(event.target)) {
            //console.log('contains rootCard');
            speechBox.innerHTML = rootDetails[0].innerHTML;
            speechBox.style.display = 'block';
            positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position

        } else if (sortCard.contains(event.target)) {
            //console.log('contains sortCard');
            speechBox.textContent = sortDetails[0].textContent;
            speechBox.style.display = 'block';
            positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position

        } else if (removeDupsCard.contains(event.target)) {
            //console.log('contains sortCard');
            speechBox.textContent = removeDupsDetails[0].textContent;
            speechBox.style.display = 'block';
            positionSpeechBox(bubbleX, bubbleY); // Example values to adjust the position

        } else {
            speechBox.innerHTML = '';
            speechBox.style.display = 'none';
        }
    });
});    

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


let rootOption = document.querySelectorAll('input[name="options"]');
let genOption = document.querySelectorAll('input[name="general-folder"]');
let genSelect = document.getElementById('custom-general-select');
let genText = document.getElementById('custom-general-text');
let dropDownMenus = document.querySelectorAll('.folder-select');
let rootSelect = document.getElementById('custom-root-select');
let rootText = document.getElementById('custom-root-text');

for (let i = 0; i < rootOption.length; i++) {
    rootOption[i].addEventListener('change', function() {
        console.log('event triggered');
        if (this === rootOption[2]) {
            rootText.classList.toggle('hidden');
            rootSelect.classList.toggle('hidden');
       
           
            updateDropDownMenus();
        } else {
            if (rootText.classList.contains('hidden')) {
                rootText.classList.toggle('hidden');
                rootSelect.classList.toggle('hidden');
            }
        }
    });
}

for (let i = 0; i < genOption.length; i++) {
    genOption[i].addEventListener('change', function() {
        console.log('event triggered');
        if (this === genOption[2]) {
            genText.classList.toggle('hidden');
            genSelect.classList.toggle('hidden');
       
           
            updateDropDownMenus();
        } else {
            if (genText.classList.contains('hidden')) {
                genText.classList.toggle('hidden');
                genSelect.classList.toggle('hidden');
            }
        }
    });
}

for (let i = 0; i < dropDownMenus.length; i++) {
    dropDownMenus[i].addEventListener('mousedown', function () {
        // remove all options in menus
        
        dropDownMenus[i].querySelectorAll('option').forEach(function (option) {
            option.remove();
        });
        updateDropDownMenus();
    });
}

function updateDropDownMenus() {

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
                console.log(bookmark.title);
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


function getBookmarks(bookmarks, prefix = '', indent = '') {
  let output = [];
    let includeFolderNumber = false;

    function traverse(bookmarks, prefix = '', indent = '') {
        bookmarks.forEach(function (bookmark, index) {
            if (!bookmark.url) {
                let folderNumber = prefix + (index + 1);
                let childPrefix = folderNumber + '.';
                if (childPrefix.length < 8 && prefix.length >  3) {
                    if (includeFolderNumber === true) {

                    output.push(`${bookmark.title} : ${folderNumber} `);
                    } else {
                        output.push(`${bookmark.title}`);
                    }
                }
                traverse(bookmark.children, childPrefix, indent + '  ');
            }
        });
    }

  traverse(bookmarks, prefix, indent);
  //console.log(output.join('\n'));
return output;
}
