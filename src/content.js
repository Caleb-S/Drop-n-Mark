
// Append scripts for webcomponents
(function () {
  const scripts = ['toast', 'floatingBtn', 'bookmarkMenu', 'folderCard'];
  const prodpath = 'src/components/dist/';
  const devpath = 'src/components/';

  chrome.runtime.sendMessage({ action: 'getEnvironment' }, response => {
    let path;
    response.devmode ? path = devpath : path = prodpath;
    for (let script of scripts) {
      loadScript(path + script + '.js');
    }
  });

  function loadScript(scriptPath) {
    let script = document.createElement('script');
    script.src = chrome.runtime.getURL(scriptPath);
    script.onerror = () => { console.warn(`Error loading script: ${script.src}`); };
    document.head.appendChild(script);
  }
})();



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
    let testMenu = document.createElement('bookmark-menu');
    testMenu.classList.add('testmenu');
    if (response.bookmarked) {

      console.log('is bookmarked');
      testMenu.setAttribute('bookmarked', '');
      testMenu.setAttribute('src', chrome.runtime.getURL('src/assets/rubbishBinSmall.svg'));
      let deleteBox = testMenu.shadowRoot.querySelector('.deleteBox');
      deleteBox.addEventListener('mouseup', function (event) {


        chrome.runtime.sendMessage({ action: "deleteBookmark" }, function (response) {
          if (response.success) {
            showToast('Removed Bookmark');

          } else {
            showToast('Failed To Remove Bookmark');
          }
        });


      });

      document.body.appendChild(testMenu);



    } else {

      generateMenu();

    }
  });
  document.addEventListener('mouseup', floatDropOutside);
}


/*
 Hides bookmark menu when mouse is released outside of the bookmark menu.

 */
function floatDropOutside(event) {
  /*
  const newFolderBtn = document.querySelector('.new-folder-btn-ui5864921');
  const bookmarkMenu = document.getElementById('bookmarkMenu-ui5864921');

  if (!newFolderBtn.contains(event.target) && !event.target.closest('.main-add-folder-ui5864921') && !event.target.closest('.sub-add-folder-ui5864921')) {
    bookmarkMenu.style.display = 'none';
    document.querySelector('bookmark-menu').remove();
  }
  */

  document.querySelector('bookmark-menu').remove();

}

/**
 * Shows a toast message.
 *
 * @param {string} toastText - The text to display in the toast message.
 */
function showToast(toastText) {

  //remove all bookmark-toasts
  let toasts = document.querySelectorAll('bookmark-toast');
  toasts.forEach(function (toast) {
    toast.remove();
  });


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

  let testMenu = document.createElement('bookmark-menu');

  const folderContainer = testMenu;

  // Request all bookmarks from the background script
  chrome.runtime.sendMessage({ action: "getAllBookmarks" }, function (response) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }

    let bookmarks = response.bookmarks;
    updateBookmarkMenu(bookmarks, folderContainer);
  });


  chrome.storage.local.get(['scrollPosition'], (result) => {
    if (result.scrollPosition !== undefined) {
      // Set the scrollTop to the saved position
      testMenu.setAttribute('scrollPosition', result.scrollPosition);
    }
  });

  testMenu.addEventListener('menu-scroll-point', (event) => {
    const value = event.detail;
    chrome.storage.local.set({ scrollPosition: value });

  });



  // Append the new bookmark menu to the document body
  document.body.appendChild(testMenu);




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
              let mainFolderItem = createFolderItem('main-folder-ui5864921', 'main-add-folder-ui5864921',
                'main-f-txt-ui5864921',
                mainChild.title,
                mainChild.id);

              // Create an image element
              let imageElement = document.createElement('img');
              imageElement.src = chrome.runtime.getURL('src/assets/newFolderLarge.svg'); // Replace with the path to your image
              imageElement.style.pointerEvents = 'none';
              imageElement.classList.add('extension-img');



              mainFolderItem.addEventListener('mouseup', function (event) {
                if (event.target === mainFolderItem) {
                  saveBookmarkToFolder(mainChild.id);
                  showToast('Bookmarked Under: ' + mainChild.title);

                  //showToast(mainChild.title);
                }
              });



              const addBtn = mainFolderItem.querySelector('.main-add-folder-ui5864921');
              addBtn.appendChild(imageElement);

              const bookmarkMenu = document.getElementById('bookmarkMenu-ui5864921');
              let backDrop = document.querySelector('.backdrop-ui5864921');



              addBtn.addEventListener('mouseup', function (event) {
                if (event.target === addBtn) {
                  let input = document.querySelector('.folder-input input');

                  // bookmarkGui.style.display = 'none';
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
                          showToast('Bookmarked Under: ' + folderName);

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
                      showToast('Bookmarked Under: ' + subChild.title);

                    }
                  });

                  const addBtn = subFolderItem.querySelector('.sub-add-folder-ui5864921');

                  const bookmarkMenu = document.getElementById('bookmarkMenu-ui5864921');
                  //const bookmarkGui = bookmarkMenu.querySelector('.bookmarkMenu-updated-ui5864921');
                  //  const newFolderInput = bookmarkMenu.querySelector('.folder-input');
                  let backDrop = document.querySelector('.backdrop-ui5864921');

                  let imageElement = document.createElement('img');
                  imageElement.src = chrome.runtime.getURL('src/assets/newFolderMedium.svg'); // Replace with the path to your image
                  imageElement.style.pointerEvents = 'none';
                  imageElement.classList.add('extension-img');
                  addBtn.appendChild(imageElement);



                  addBtn.addEventListener('mouseup', function (event) {
                    if (event.target === addBtn) {
                      let input = document.querySelector('.folder-input input');

                      // bookmarkGui.style.display = 'none';
                      //  newFolderInput.style.display = 'flex';
                      bookmarkMenu.querySelector('.folder-input input').focus();

                      input.addEventListener('keydown', function (event) {
                        if (event.key === 'Enter') {
                          event.preventDefault();

                          const folderName = input.value;

                          chrome.runtime.sendMessage({ action: 'createFolder', folderName: folderName, parentFolderId: subChild.id }, function (response) {

                            const folderId = response.folderId;

                            if (folderId) {
                              saveBookmarkToFolder(folderId);
                              showToast('Bookmarked Under: ' + folderName);

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


