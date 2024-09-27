
// Append scripts for webcomponents
(function () {
  function loadScript(scriptSrc) {
    const script = document.createElement('script');
    script.src = scriptSrc;

    script.onerror = () => {
      console.warn(`Error loading script: ${scriptSrc}`);

    };

    document.head.appendChild(script);
  }

  const toastScriptSrc = chrome.runtime.getURL('src/components/dist/toast.js');
  const floatingBtnScriptSrc = chrome.runtime.getURL('src/components/floatingBtn.js');
  const menuScriptSrc = chrome.runtime.getURL('src/components/bookmarkMenu.js');

  loadScript(toastScriptSrc);
  loadScript(floatingBtnScriptSrc);
  loadScript(menuScriptSrc);
})();

// test bookmark menu

function addMenu() {
  let testMenu = document.createElement('bookmark-menu');
  testMenu.classList.add('testmenu');
  document.body.appendChild(testMenu);
  //testMenu.classList.add('bookmark-float-btn');



};




// Initialize floating button
let initialX, initialY, offsetX, offsetY = 0;
let isFloatBtnActive = false;
let animationFrameID;

(function () {
  let floatingButton = document.createElement('bookmark-float-button');
  //floatingButton.className = 'floating-button-ui5864921';


  document.body.appendChild(floatingButton);

  // window.addEventListener('resize', scaleElementsDynamically);
  floatingButton.addEventListener('mousedown', handleMouseDown);
  floatingButton.classList.add('bookmark-float-btn');
  //floatingButton.addEventListener('click', () => console.log('Floating button clicked!'));

  floatingButton.addEventListener('mouseover', () => {
    floatingButton.textContent = truncateText(document.title);

  });

  floatingButton.addEventListener('mouseout', () => {
    if (!isFloatBtnActive) {
      resetFloatBtn();

    }
  });
})();



// Initialize bookmark menu 
let scrollInterval, scrollThresholdPercentage = 0.2;
(function () {
  generateMenu()
  restrictHighlighting();
  chrome.runtime.onMessage.addListener(function (message) {
    if (message.action === "generateMenu") {
      generateMenu();
    }
  });
})();



/**
 * Handles the mouse down event on the floating button.
 *
 * @param {MouseEvent} event - The mouse event object.
 */
function handleMouseDown(event) {
  // Send a message to background.js to check if the current page is bookmarked
  chrome.runtime.sendMessage({ action: "checkBookmark" }, function (response) {
    if (response.bookmarked) {
      //document.querySelector('bookmark-menu').style.display = 'none';

      // The current page is bookmarked
      /*
      document.getElementById('bookmarkMenu-ui5864921').style.display = 'block';
      document.querySelector('.bookmarkMenu-updated-ui5864921').style.display = 'none';
      delBox = document.querySelector('.deleteBox-ui5864921');
      delBox.style.display = 'flex';
      */
    } else {

      // The current page is not bookmarked
      addMenu();
      generateMenu();

      // document.querySelector('bookmark-menu').remove();

      //document.getElementById('bookmarkMenu-ui5864921').style.display = 'block';


    }
  });

  try {
    initialX = event.clientX;
    initialY = event.clientY;
  } catch (error) {
    return;
  }

  floatDragState();

}

// adds drag state to float button
function floatDragState() {
  let floatingButton = document.querySelector('bookmark-float-button');
  isFloatBtnActive = true;

  //floatingButton.classList.add('hover-ui5864921');

  floatingButton.addEventListener('contextmenu', event => event.preventDefault());
  floatingButton.addEventListener('selectstart', event => event.preventDefault());
  floatingButton.addEventListener('mousedown', event => event.preventDefault());
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', floatDropOutside);

  floatingButton.textContent.draggable = false;
  floatingButton.textContent = truncateText(document.title);

  floatingButton.style.borderRadius = '0';
  floatingButton.style.pointerEvents = 'none'; // pointer event allows cursor to be seen past floutbtn
  document.body.style.cursor = 'grabbing';

  //handleMouseDown();
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

  let folderContainer = document.querySelector('.folder-container-ui5864921');
  let rect = folderContainer.getBoundingClientRect();
  let scrollSpeed = 7;
  let scrollThresholdPixels = rect.height * scrollThresholdPercentage;
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

/*
 Hides bookmark menu when mouse is released outside of the bookmark menu.

 */
function floatDropOutside(event) {
  const newFolderBtn = document.querySelector('.new-folder-btn-ui5864921');
  const bookmarkMenu = document.getElementById('bookmarkMenu-ui5864921');

  if (!newFolderBtn.contains(event.target) && !event.target.closest('.main-add-folder-ui5864921') && !event.target.closest('.sub-add-folder-ui5864921')) {
    bookmarkMenu.style.display = 'none';
    document.querySelector('bookmark-menu').remove();
  }

  resetFloatBtn();

}

// resets float button back to circle state
function resetFloatBtn() {
  let floatingButton = document.querySelector('.bookmark-float-btn');
  isFloatBtnActive = false;
  floatingButton.style.cursor = 'grab';
  document.removeEventListener('mousemove', handleMouseMove);
  floatingButton.style.transform = 'translate3d(0, 0, 0)';
  floatingButton.style.borderRadius = '50%';

  /*
  let ptag = floatingButton.querySelector('.ptag');
  if (ptag instanceof Node) {
    ptag.remove();
  }
  */
  //floatingButton.removeChild(ptag);

  floatingButton.classList.remove('hover-ui5864921');
  floatingButton.style.pointerEvents = 'auto';
  document.body.style.cursor = 'auto';
  floatingButton.textContent = '';
  document.removeEventListener('mouseup', floatDropOutside);
  cancelAnimationFrame(animationFrameID);

}


/**
 * Shows a toast message.
 *
 * @param {string} toastText - The text to display in the toast message.
 */
function showToast(toastText) {
  let toastCreate = document.createElement('bookmark-toast');

  let text = toastText ? toastText : "Null";
  toastCreate.innerText = text;

  document.body.appendChild(toastCreate);


  setTimeout(function () {
    toastCreate.remove();
  }, 3000);


}

// Generates the bookmark menu.
function generateMenu() {
  // Check if a bookmark menu already exists
  const existingBookmarkMenu = document.getElementById('bookmarkMenu-ui5864921');
  if (existingBookmarkMenu) {
    // Remove the existing bookmark menu if it exists
    existingBookmarkMenu.parentNode.removeChild(existingBookmarkMenu);
  }

  // Fetch the bookmark menu HTML
  fetch(chrome.runtime.getURL('src/html/bookmarkmenu.html'))
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

      let imageElement = document.createElement('img');
      imageElement.src = chrome.runtime.getURL('src/assets/newFolderXLarge.svg');
      imageElement.classList.add('extension-img');
      newFolderInput.appendChild(imageElement);

      delBox = bookmarkMenu.querySelector('.deleteBox-ui5864921');

      let delBoxImage = document.createElement('img');
      delBoxImage.src = chrome.runtime.getURL('src/assets/rubbishBinSmall.svg');
      delBoxImage.classList.add('extension-img');
      delBox.appendChild(delBoxImage);

      delBox.addEventListener('mouseup', function (event) {
        if (event.target === delBox) {
          delBox.style.display = 'flex';
          chrome.runtime.sendMessage({ action: "deleteBookmark" }, function (response) {
            if (response.success) {
              console.log("Bookmark deleted successfully.");
              showToast('Bookmark Deleted');



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
          let input = document.querySelector('.folder-input input');
          let backDrop = document.querySelector('.backdrop-ui5864921');

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



      // Request all bookmarks from the background script
      chrome.runtime.sendMessage({ action: "getAllBookmarks" }, function (response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }

        let bookmarks = response.bookmarks;
        updateBookmarkMenu(bookmarks, folderContainer);
      });

      // Append the new bookmark menu to the document body
      document.body.appendChild(bookmarkMenu);

    })
    .catch(error => {
      console.error('Failed to load bookmarkmenu.html:', error);
    });
}

// Function to update the bookmark menu
function updateBookmarkMenu(bookmarks, folderContainer) {
  printBookmarkTree(bookmarks);
  let testMenu = document.querySelector('.testmenu');
  processFolders(bookmarks, testMenu);
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
              let mainFolderItem = createFolderItem('main-folder-ui5864921', 'main-add-folder-ui5864921', 'main-f-txt-ui5864921', mainChild.title, mainChild.id);

              // Create an image element
              let imageElement = document.createElement('img');
              imageElement.src = chrome.runtime.getURL('src/assets/newFolderLarge.svg'); // Replace with the path to your image
              imageElement.style.pointerEvents = 'none';
              imageElement.classList.add('extension-img');



              mainFolderItem.addEventListener('mouseup', function (event) {
                if (event.target === mainFolderItem) {
                  saveBookmarkToFolder(mainChild.id);
                  showToast('Bookmark Created In: ' + mainChild.title);

                  //showToast(mainChild.title);
                }
              });



              const addBtn = mainFolderItem.querySelector('.main-add-folder-ui5864921');
              addBtn.appendChild(imageElement);

              const bookmarkMenu = document.getElementById('bookmarkMenu-ui5864921');
              const bookmarkGui = bookmarkMenu.querySelector('.bookmarkMenu-updated-ui5864921');
              const newFolderInput = bookmarkMenu.querySelector('.folder-input');
              let backDrop = document.querySelector('.backdrop-ui5864921');



              addBtn.addEventListener('mouseup', function (event) {
                if (event.target === addBtn) {
                  let input = document.querySelector('.folder-input input');

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


              let testMenu = document.querySelector('.testmenu');
              console.log('testmenu: ', testMenu);

              testMenu.appendChild(mainFolderItem);


              parentElement.appendChild(mainFolderItem);

              mainChild.children.forEach(function (subChild) {
                if (subChild.children && !subChild.url && subChild.title.trim() !== "") {
                  let subFolderItem = createFolderItem('sub-folder-ui5864921', 'sub-add-folder-ui5864921', 'sub-f-txt-ui5864921', subChild.title, subChild.id);



                  subFolderItem.addEventListener('mouseup', function (event) {
                    if (event.target === subFolderItem) {
                      saveBookmarkToFolder(subChild.id);
                      showToast('Bookmark Created In: ' + subChild.title);

                    }
                  });



                  const addBtn = subFolderItem.querySelector('.sub-add-folder-ui5864921');

                  const bookmarkMenu = document.getElementById('bookmarkMenu-ui5864921');
                  const bookmarkGui = bookmarkMenu.querySelector('.bookmarkMenu-updated-ui5864921');
                  const newFolderInput = bookmarkMenu.querySelector('.folder-input');
                  let backDrop = document.querySelector('.backdrop-ui5864921');

                  let imageElement = document.createElement('img');
                  imageElement.src = chrome.runtime.getURL('src/assets/newFolderMedium.svg'); // Replace with the path to your image
                  imageElement.style.pointerEvents = 'none';
                  imageElement.classList.add('extension-img');
                  addBtn.appendChild(imageElement);



                  addBtn.addEventListener('mouseup', function (event) {
                    if (event.target === addBtn) {
                      let input = document.querySelector('.folder-input input');

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
                      let nestedFolderItem = createFolderItem('nested-folder-ui5864921', 'nested-add-folder-ui5864921', 'nested-f-txt-ui5864921', nestedChild.title, nestedChild.id);
                      nestedFolderItem.addEventListener('mouseup', function (event) {
                        if (event.target === nestedFolderItem) {
                          saveBookmarkToFolder(nestedChild.id);
                          showToast('Bookmark Created In: ' + nestedChild.title);

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
  let folderItem = document.createElement('div');
  folderItem.classList.add(itemClass);

  let addFolder = document.createElement('div');
  addFolder.classList.add(addFolderClass);

  let folderName = document.createElement('div');
  folderName.classList.add(nameClass);
  folderName.textContent = title;

  folderItem.appendChild(addFolder);
  folderItem.appendChild(folderName);

  return folderItem;
}



// Saves the current page bookmark to a folder.
function saveBookmarkToFolder(folderId) {
  //showToast('folder being bookmarked id: ' + folderId);
  chrome.runtime.sendMessage({
    action: "saveCurrentPageToBookmark",
    parentFolderId: folderId,
    currentPageUrl: document.URL,
    currentPageTitle: document.title
  }, function (response) {
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
      let folderNumber = prefix + (index + 1);

      let childPrefix = folderNumber + '.';
      printBookmarkTree(bookmark.children, childPrefix, indent + '  ');
    }
  });
}


/**
 * Restricts text highlighting on menu items.
 */
function restrictHighlighting() {
  const menuItems = document.querySelectorAll('.bookmarkMenu-updated-ui5864921, .new-folder-btn-ui5864921, .new-btn-txt-ui5864921, .folder-container-ui5864921, .general-btn-ui5864921, .general-sub-txt-ui5864921, .bookmark-float-btn, .hover-ui5864921, .bookmark-float-btn.hover-ui5864921');

  menuItems.forEach(item => {
    item.addEventListener('contextmenu', event => {
      event.preventDefault();
    });

    item.addEventListener('selectstart', event => {
      event.preventDefault();
    });

    item.addEventListener('mousedown', event => {
      if (event.button === 2) {
        event.preventDefault();
      }
    });

    item.draggable = false;


  });


}

/**
 * Removes the text highlighting on the page, preventing text in floatbutton being highlighted on drag.
 */
function removeHighlight() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
}

/**
 * Truncates the given text if it exceeds the maximum length.
 *
 * @param {string} text - The text to truncate.
 * @returns {string} The truncated text.
 */
function truncateText(text) {
  let linkextra = 10;
  let maxLength = 20;
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}


/**
 * Updates the position of the floating button.
 */
function updateFloatingButtonPosition() {
  let floatingButton = document.querySelector('.bookmark-float-btn');
  floatingButton.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}
