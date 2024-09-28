
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

};

(function () {
  let floatingButton = document.createElement('bookmark-float-button');


  document.body.appendChild(floatingButton);

  floatingButton.addEventListener('mousedown', handleMouseDown);


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
      addMenu();
      generateMenu();
    }
  });
  document.addEventListener('mouseup', floatDropOutside);
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
  let testMenu = document.querySelector('bookmark-menu');
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
