var floatingButton = document.createElement('div');
floatingButton.className = 'floating-button-ui5864921';
document.body.appendChild(floatingButton);

var initialX = 0, initialY = 0, offsetX = 0, offsetY = 0, isDragging = false, animationFrameID;
var scrollInterval, scrollThresholdPercentage = 0.2;




// append script with src of toast.js
(function () {
  // Create a script element
  var script = document.createElement('script');

  // Set the source of the script (external file)
  script.src = chrome.runtime.getURL('toast.js');

  // Append the script to the body
  document.body.appendChild(script);
})();







generateMenu()
updateDivSize2();
restrictHighlighting();

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "generateMenu") {

    generateMenu();
  }
});

window.addEventListener('resize', updateDivSize);
window.addEventListener('resize', updateDivSize2);

/**
 * Handles the mouse down event on the floating button.
 *
 * @param {MouseEvent} event - The mouse event object.
 */
function handleMouseDown(event) {
  // Send a message to background.js to check if the current page is bookmarked
  chrome.runtime.sendMessage({ action: "checkBookmark" }, function (response) {
    if (response.bookmarked) {
      // The current page is bookmarked
      document.getElementById('bookmarkMenu-ui5864921').style.display = 'block';
      document.querySelector('.bookmarkMenu-updated-ui5864921').style.display = 'none';

      delBox = document.querySelector('.deleteBox-ui5864921');
      delBox.style.display = 'flex';



    } else {
      // The current page is not bookmarked

      document.getElementById('bookmarkMenu-ui5864921').style.display = 'block';
      updateDivSize();

    }
  });




  floatingButton.style.cursor = 'grabbing';
  floatingButton.classList.add('hover-ui5864921');
  floatingButton.style.pointerEvents = 'none';
  floatingButton.addEventListener('contextmenu', event => event.preventDefault());
  floatingButton.textContent.draggable = false;
  floatingButton.addEventListener('selectstart', event => event.preventDefault());
  floatingButton.addEventListener('mousedown', event => event.preventDefault());
  floatingButton.textContent = truncateText(document.title);
  floatingButton.style.borderRadius = '0';
  updateDivSize2();
  initialX = event.clientX;
  initialY = event.clientY;
  isDragging = true; handleMouseDown
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}


/**
 * Handles the mouse move event.
 *
 * @param {MouseEvent} event - The mouse event object.
 */
function handleMouseMove(event) {
  offsetX = event.clientX - initialX;
  offsetY = event.clientY - initialY;
  cancelAnimationFrame(animationFrameID);
  animationFrameID = requestAnimationFrame(updateFloatingButtonPosition);

  var folderContainer = document.querySelector('.folder-container-ui5864921');
  var rect = folderContainer.getBoundingClientRect();
  var scrollSpeed = 7;
  var scrollThresholdPixels = rect.height * scrollThresholdPercentage;
  removeHighlight();

  if (event.clientY >= rect.bottom - scrollThresholdPixels && event.clientY <= rect.bottom && event.clientX >= rect.left && event.clientX <= rect.right) {
    clearInterval(scrollInterval);
    scrollInterval = setInterval(() => { folderContainer.scrollTop += scrollSpeed; }, 10);
  } else if (event.clientY <= rect.top + scrollThresholdPixels && event.clientY >= rect.top && event.clientX >= rect.left && event.clientX <= rect.right) {
    clearInterval(scrollInterval);
    scrollInterval = setInterval(() => { folderContainer.scrollTop -= scrollSpeed; }, 10);
  } else {
    clearInterval(scrollInterval);
  }
}

/**
 * Removes the text highlighting on the page.
 */
function removeHighlight() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
}

/**
 * Updates the position of the floating button.
 */
function updateFloatingButtonPosition() {
  floatingButton.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}

/**
 * Handles the mouse up event on the page.
 *
 * @param {MouseEvent} event - The mouse event object.
 */
function handleMouseUp(event) {
  isDragging = false;
  floatingButton.style.cursor = 'grab';
  document.removeEventListener('mousemove', handleMouseMove);
  floatingButton.style.transform = 'translate3d(0, 0, 0)';
  floatingButton.style.borderRadius = '50%';

  const newFolderBtn = document.querySelector('.new-folder-btn-ui5864921');
  const bookmarkMenu = document.getElementById('bookmarkMenu-ui5864921');

  const mainAddBtn = document.querySelector('.main-add-folder-ui5864921');


  if (!newFolderBtn.contains(event.target) && !event.target.closest('.main-add-folder-ui5864921') && !event.target.closest('.sub-add-folder-ui5864921')) {
    bookmarkMenu.style.display = 'none';
  }

  floatingButton.classList.remove('hover-ui5864921');
  floatingButton.style.pointerEvents = 'auto';
  floatingButton.textContent = '';
  document.removeEventListener('mouseup', handleMouseUp);
  cancelAnimationFrame(animationFrameID);
  updateDivSize2();
}


floatingButton.addEventListener('mousedown', handleMouseDown);
floatingButton.addEventListener('click', () => console.log('Floating button clicked!'));
floatingButton.addEventListener('mouseover', () => {
  floatingButton.classList.add('hover-ui5864921');
  updateDivSize2();
  floatingButton.textContent = truncateText(document.title);
  floatingButton.style.borderRadius = '0';
});
floatingButton.addEventListener('mouseout', () => {
  if (!isDragging) {
    floatingButton.style.transform = 'translate3d(0, 0, 0)';
    floatingButton.classList.remove('hover-ui5864921');
    floatingButton.textContent = '';
    floatingButton.style.borderRadius = '50%';
    updateDivSize2();
    document.getElementById('bookmarkMenu-ui5864921').style.display = 'none';
  }
});

/**
 * Truncates the given text if it exceeds the maximum length.
 *
 * @param {string} text - The text to truncate.
 * @returns {string} The truncated text.
 */
function truncateText(text) {
  var linkextra = 10;
  var maxLength = 20;
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * Retrieves the current page URL.
 *
 * @returns {string} The current page URL.
 */
function getCurrentPageUrl() {
  return window.location.href;
}

/**
 * Retrieves the current page title.
 *
 * @returns {string} The current page title.
 */
function getCurrentPageTitle() {
  return document.title;
}


/**
 * Processes the bookmark folders.
 *
 * @param {Array} bookmarks - The array of bookmark objects.
 * @param {HTMLElement} parentElement - The parent HTML element to append the folder items to.
 */
function processFolders(bookmarks, parentElement) {
  bookmarks.forEach(function (bookmark) {
    if (!bookmark.url) {
      console.log(bookmark.children);
    }
    if (bookmark.children) { // Root Folder
      bookmark.children.forEach(function (child) { // Primary Folders
        if (child.children) {
          child.children.forEach(function (mainChild) {
            if (mainChild.children && !mainChild.url && mainChild.title.trim() !== "") {
              var mainFolderItem = createFolderItem('main-folder-ui5864921', 'main-add-folder-ui5864921', 'main-f-txt-ui5864921', mainChild.title, mainChild.id);

              // Create an image element
              var imageElement = document.createElement('img');
              imageElement.src = chrome.runtime.getURL('assets/newFolderLarge.svg'); // Replace with the path to your image
              imageElement.style.pointerEvents = 'none';
              imageElement.classList.add('extension-img');



              mainFolderItem.addEventListener('mouseup', function (event) {
                if (event.target === mainFolderItem) {
                  saveBookmarkToFolder(mainChild.id);
                  showToast('Bookmark Created In: ' + mainChild.title);
                  updateDivSize2();
                  //showToast(mainChild.title);
                }
              });



              const addBtn = mainFolderItem.querySelector('.main-add-folder-ui5864921');
              addBtn.appendChild(imageElement);

              const bookmarkMenu = document.getElementById('bookmarkMenu-ui5864921');
              const bookmarkGui = bookmarkMenu.querySelector('.bookmarkMenu-updated-ui5864921');
              const newFolderInput = bookmarkMenu.querySelector('.folder-input');
              var backDrop = document.querySelector('.backdrop-ui5864921');



              addBtn.addEventListener('mouseup', function (event) {
                if (event.target === addBtn) {
                  var input = document.querySelector('.folder-input input');

                  bookmarkGui.style.display = 'none';
                  newFolderInput.style.display = 'flex';
                  bookmarkMenu.querySelector('.folder-input input').focus();

                  input.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                      event.preventDefault();

                      const folderName = input.value;

                      chrome.runtime.sendMessage({ action: 'createFolder', folderName: folderName, parentFolderId: mainChild.id }, function (response) {


                        const folderId = response.folderId;
                        if (folderId) {
                          saveBookmarkToFolder(folderId);
                          showToast('Bookmark Created in: ' + folderName);
                          updateDivSize2();
                        } else {
                          console.log('Failed to create folder.');
                        }


                      });
                    }

                  });


                  backDrop.addEventListener('mousedown', function (event) {
                    generateMenu();


                  });

                }
              });


              parentElement.appendChild(mainFolderItem);

              mainChild.children.forEach(function (subChild) {
                if (subChild.children && !subChild.url && subChild.title.trim() !== "") {
                  var subFolderItem = createFolderItem('sub-folder-ui5864921', 'sub-add-folder-ui5864921', 'sub-f-txt-ui5864921', subChild.title, subChild.id);



                  subFolderItem.addEventListener('mouseup', function (event) {
                    if (event.target === subFolderItem) {
                      saveBookmarkToFolder(subChild.id);
                      showToast('Bookmark Created In: ' + subChild.title);
                      updateDivSize2();
                    }
                  });



                  const addBtn = subFolderItem.querySelector('.sub-add-folder-ui5864921');

                  const bookmarkMenu = document.getElementById('bookmarkMenu-ui5864921');
                  const bookmarkGui = bookmarkMenu.querySelector('.bookmarkMenu-updated-ui5864921');
                  const newFolderInput = bookmarkMenu.querySelector('.folder-input');
                  var backDrop = document.querySelector('.backdrop-ui5864921');

                  var imageElement = document.createElement('img');
                  imageElement.src = chrome.runtime.getURL('assets/newFolderMedium.svg'); // Replace with the path to your image
                  imageElement.style.pointerEvents = 'none';
                  imageElement.classList.add('extension-img');
                  addBtn.appendChild(imageElement);



                  addBtn.addEventListener('mouseup', function (event) {
                    if (event.target === addBtn) {
                      var input = document.querySelector('.folder-input input');

                      bookmarkGui.style.display = 'none';
                      newFolderInput.style.display = 'flex';
                      bookmarkMenu.querySelector('.folder-input input').focus();

                      input.addEventListener('keydown', function (event) {
                        if (event.key === 'Enter') {
                          event.preventDefault();

                          const folderName = input.value;

                          chrome.runtime.sendMessage({ action: 'createFolder', folderName: folderName, parentFolderId: subChild.id }, function (response) {


                            const folderId = response.folderId;

                            if (folderId) {
                              saveBookmarkToFolder(folderId);
                              showToast('Bookmark Created in: ' + folderName);
                              updateDivSize2();
                            } else {
                              console.log('Failed to create folder.');
                            }


                          });
                        }

                      });





                      backDrop.addEventListener('mousedown', function (event) {
                        generateMenu();


                      });

                    }
                  });



                  parentElement.appendChild(subFolderItem);

                  subChild.children.forEach(function (nestedChild) {
                    if (!nestedChild.url && nestedChild.title.trim() !== "") {
                      var nestedFolderItem = createFolderItem('nested-folder-ui5864921', 'nested-add-folder-ui5864921', 'nested-f-txt-ui5864921', nestedChild.title, nestedChild.id);
                      nestedFolderItem.addEventListener('mouseup', function (event) {
                        if (event.target === nestedFolderItem) {
                          saveBookmarkToFolder(nestedChild.id);
                          showToast('Bookmark Created In: ' + nestedChild.title);
                          updateDivSize2();
                        }
                      });
                      parentElement.appendChild(nestedFolderItem);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}


/**
 * Creates a folder item element.
 *
 * @param {string} itemClass - The CSS class for the folder item.
 * @param {string} addFolderClass - The CSS class for the add folder button.
 * @param {string} nameClass - The CSS class for the folder name.
 * @param {string} title - The folder title.
 * @param {string} id - The folder ID.
 * @returns {HTMLElement} The created folder item element.
 */
function createFolderItem(itemClass, addFolderClass, nameClass, title, id) {
  var folderItem = document.createElement('div');
  folderItem.classList.add(itemClass);

  var addFolder = document.createElement('div');
  addFolder.classList.add(addFolderClass);

  var folderName = document.createElement('div');
  folderName.classList.add(nameClass);
  folderName.textContent = title;

  folderItem.appendChild(addFolder);
  folderItem.appendChild(folderName);

  return folderItem;
}

/**
 * Saves the current page bookmark to a folder.
 *
 * @param {string} folderId - The ID of the folder to save the bookmark to.
 */
function saveBookmarkToFolder(folderId) {
  console.log('folder id: |', folderId);
  //showToast('folder being bookmarke id: ' + folderId);
  chrome.runtime.sendMessage({
    action: "saveCurrentPageToBookmark",
    parentFolderId: folderId,
    currentPageUrl: document.URL,
    currentPageTitle: document.title
  }, function (response) {
    console.log(response);
  });
}

/**
 * Shows a toast message.
 *
 * @param {string} toastText - The text to display in the toast message.
 */
function showToast(toastText) {
  var toastCreate = document.createElement('bookmark-toast');

  var text = toastText ? toastText : "Null";
  toastCreate.innerText = text;

  document.body.appendChild(toastCreate);

  /*
  setTimeout(function () {
    toastCreate.remove();
  }, 3000);
  */

}


/**
 * Generates the bookmark menu.
 */
function generateMenu() {
  // Check if a bookmark menu already exists
  const existingBookmarkMenu = document.getElementById('bookmarkMenu-ui5864921');
  if (existingBookmarkMenu) {
    // Remove the existing bookmark menu if it exists
    existingBookmarkMenu.parentNode.removeChild(existingBookmarkMenu);
  }

  // Fetch the bookmark menu HTML
  fetch(chrome.runtime.getURL('bookmarkmenu.html'))
    .then(response => response.text())
    .then(html => {
      // Create a bookmark menu element from the fetched HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const bookmarkMenu = doc.getElementById('bookmarkMenu-ui5864921');
      const bookmarkGui = bookmarkMenu.querySelector('.bookmarkMenu-updated-ui5864921');

      const folderContainer = bookmarkMenu.querySelector('.folder-container-ui5864921');

      const newFolderBtn = bookmarkMenu.querySelector('.new-folder-btn-ui5864921');
      const generalBtn = bookmarkMenu.querySelector('.general-btn-ui5864921');
      const newFolderInput = bookmarkMenu.querySelector('.folder-input');

      var imageElement = document.createElement('img');
      imageElement.src = chrome.runtime.getURL('assets/newFolderXLarge.svg');
      imageElement.classList.add('extension-img');
      newFolderInput.appendChild(imageElement);

      delBox = bookmarkMenu.querySelector('.deleteBox-ui5864921');

      var delBoxImage = document.createElement('img');
      delBoxImage.src = chrome.runtime.getURL('assets/rubbishBinSmall.svg');
      delBoxImage.classList.add('extension-img');
      delBox.appendChild(delBoxImage);

      delBox.addEventListener('mouseup', function (event) {
        if (event.target === delBox) {
          delBox.style.display = 'flex';
          chrome.runtime.sendMessage({ action: "deleteBookmark" }, function (response) {
            if (response.success) {
              console.log("Bookmark deleted successfully.");
              showToast('Bookmark Deleted');
              updateDivSize2();


            } else {
              console.log("Current page is not bookmarked.");
            }
          });

        }
      });



      newFolderBtn.addEventListener('mouseup', function (event) {
        if (event.target === newFolderBtn) {



          bookmarkGui.style.display = 'none';
          newFolderInput.style.display = 'flex';
          bookmarkMenu.querySelector('.folder-input input').focus();




          // Get the input element
          var input = document.querySelector('.folder-input input');
          var backDrop = document.querySelector('.backdrop-ui5864921');

          input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
              event.preventDefault();

              const folderName = input.value;

              chrome.runtime.sendMessage({ action: 'createFolder', folderName: folderName }, function (response) {

                const folderId = response.folderId;
                console.log('Folder ID:', folderId);

                if (folderId) {
                  saveBookmarkToFolder(folderId);
                  showToast('Bookmark Created in: ' + folderName);
                  updateDivSize2();
                } else {
                  console.log('Failed to create folder.');
                }

              });


              input.value = '';
              document.querySelector('.folder-input').style.display = 'none';

            }
          });

          backDrop.addEventListener('mousedown', function (event) {
            generateMenu();


          });




        }
      });


      generalBtn.addEventListener('mouseup', function (event) {
        if (event.target === generalBtn) {

          saveBookmarkToFolder("2");
        }
      });

      // Function to update the bookmark menu
      function updateBookmarkMenu(bookmarks) {
        printBookmarkTree(bookmarks);
        processFolders(bookmarks, folderContainer);
      }

      // Request all bookmarks from the background script
      chrome.runtime.sendMessage({ action: "getAllBookmarks" }, function (response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }

        var bookmarks = response.bookmarks;
        updateBookmarkMenu(bookmarks);
      });

      // Append the new bookmark menu to the document body
      document.body.appendChild(bookmarkMenu);

    })
    .catch(error => {
      console.error('Failed to load bookmarkmenu.html:', error);
    });
}



/**
 * Prints the bookmark tree recursively.
 *
 * @param {Array} bookmarks - The array of bookmark objects.
 * @param {string} prefix - The prefix for folder numbering.
 * @param {string} indent - The indentation string.
 */
function printBookmarkTree(bookmarks, prefix = '', indent = '') {
  bookmarks.forEach(function (bookmark, index) {
    if (!bookmark.url) {
      var folderNumber = prefix + (index + 1);

      var childPrefix = folderNumber + '.';
      printBookmarkTree(bookmark.children, childPrefix, indent + '  ');
    }
  });
}



/**
 * Updates the size of the div element.
 */

function updateDivSize() {
  var zoomLevel = parseFloat(getComputedStyle(document.documentElement).zoom);
  var referenceZoomLevel = 1;

  var zoomRatio = zoomLevel / referenceZoomLevel;
  var divScale = 1 / zoomRatio;
  var windowHeight = screen.innerHeight * 0.4;

  var zoomResistantDiv = document.querySelector('.bookmarkMenu-updated-ui5864921');
  zoomResistantDiv.style.width = windowHeight + 'px';
  if (zoomResistantDiv != null) {

    zoomResistantDiv.style.transform = 'scale(' + divScale + ')';
    var currentWidth = zoomResistantDiv.offsetWidth;


    zoomResistantDiv.style.height = (currentWidth * 2) + 'px';
  }
}




/**
 * Updates the size and position of the floating button.
 */


function updateDivSize2() {
  var zoomLevel = parseFloat(getComputedStyle(document.documentElement).zoom);

  /* Orange Button */
  var divSize = 20 / zoomLevel;
  var divPosition = 20 / zoomLevel;

  var floatingButton = document.querySelector('.floating-button-ui5864921');
  floatingButton.style.width = divSize + 'px';
  floatingButton.style.height = divSize + 'px';
  floatingButton.style.padding = '0px';

  floatingButton.style.right = divPosition + 'px';
  floatingButton.style.bottom = divPosition + 'px';


  var hover2 = document.querySelector('.hover-ui5864921');

  var hoverX = 20 / zoomLevel;
  var fontSize = 20 / zoomLevel;

  if (hover2 != null) {
    hover2.style.fontSize = fontSize + 'px';
    hover2.style.width = 'auto';
    hover2.style.paddingLeft = (20 / zoomLevel) + 'px';
    hover2.style.paddingRight = (20 / zoomLevel) + 'px';
    hover2.style.paddingTop = (5 / zoomLevel) + 'px';
    hover2.style.paddingBottom = (5 / zoomLevel) + 'px';
    hover2.style.height = 'auto';
    console.log('hover boi!');
  }

  /* New Folder Input */
  var folderInputBox = document.querySelector('.folder-input');

  var divScale = 1 / zoomLevel;

  if (folderInputBox != null) {
    folderInputBox.style.transform = 'scale(' + divScale + ')';

  }

  /* toast */
  var toast = document.querySelector('bookmark-toast');
  if (toast != null) {
    toast.style.padding = (10 / zoomLevel) + 'px ' + (20 / zoomLevel) + 'px';
    toast.style.fontSize = (20 / zoomLevel) + 'px';
    toast.style.bottom = divPosition + 'px';

  }

  /* delete box */
  var delBox = document.querySelector('.deleteBox-ui5864921');
  if (delBox != null) {
    delBox.style.transform = 'scale(' + divScale + ')';

  }


}
















/**
 * Restricts text highlighting on menu items.
 */
function restrictHighlighting() {
  const menuItems = document.querySelectorAll('.bookmarkMenu-updated-ui5864921, .new-folder-btn-ui5864921, .new-btn-txt-ui5864921, .folder-container-ui5864921, .general-btn-ui5864921, .general-sub-txt-ui5864921, .floating-button-ui5864921, .hover-ui5864921, .floating-button-ui5864921.hover-ui5864921');

  menuItems.forEach(item => {
    item.addEventListener('selectstart', event => {
      event.preventDefault();
    });
  });

  menuItems.forEach(item => {
    item.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
  });

  menuItems.forEach(item => {
    item.draggable = false;
  });

  menuItems.forEach(item => {
    item.addEventListener('mousedown', event => {
      if (event.button === 2) {
        event.preventDefault();
      }
    });
  });
}




