
let devmode;

// Append scripts for webcomponents
(function () {
  const scripts = ['toast', 'floatingBtn', 'bookmarkMenu', 'folderCard'];
  const prodpath = 'src/components/dist/';
  const devpath = 'src/components/';

  chrome.runtime.sendMessage({ action: 'getEnvironment' }, response => {
    let path;
    devmode = response.devmode;
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

document.addEventListener('mouseup', (e) => {
    if (document.getElementsByTagName('bookmark-menu').length > 0) {
        
        let menu = document.getElementsByTagName('bookmark-menu')[0];
        if (!menu.hasAttribute('createFolder')) {
            menu.remove();
        }
    }
});

function handleMouseDown(event) {
    let bookmarkMenu = document.createElement('bookmark-menu');
    //document.addEventListener('mouseup', () => bookmarkMenu.remove());
        

    chrome.runtime.sendMessage({ action: "checkBookmark" }, function (response) {
        response.bookmarked ? displayDeleteBox() :  displayBookmarkMenu();
    });


    function displayDeleteBox() {
        bookmarkMenu.setAttribute('bookmarked', '');
        bookmarkMenu.setAttribute('src', chrome.runtime.getURL('src/assets/rubbishBinSmall.svg'));
        document.body.appendChild(bookmarkMenu);

        let deleteBox = bookmarkMenu.shadowRoot.querySelector('.deleteBox');
        deleteBox.addEventListener('mouseup', function (event) {
            chrome.runtime.sendMessage({ action: "deleteBookmark" }, function (response) {
                response.success ? showToast('Removed Bookmark') : showToast('Failed To Remove Bookmark');
            });
        });
    }

    function displayCreateFolder() {
        let newFolder = document.createElement('bookmark-menu');
        newFolder.setAttribute('createFolder', '');
        newFolder.setAttribute('src', chrome.runtime.getURL('src/assets/newFolderXLarge.svg'));

        document.querySelector('bookmark-float-button').remove();
        document.body.appendChild(newFolder);

        newFolder.shadowRoot.querySelector('.backdrop').addEventListener('mousedown', () => {
            let floatingButton = document.createElement('bookmark-float-button');
            floatingButton.addEventListener('mousedown', handleMouseDown);
            document.body.appendChild(floatingButton);

            newFolder.remove();
        });

        newFolder.addEventListener('create-folder', (event) => {
            chrome.runtime.sendMessage({ 
                action: 'createFolder', folderName: event.detail 
            }, function (response) {

                response.folderId
                    ? (saveBookmarkToFolder(response.folderId), showToast(`Bookmark Created in: ${event.detail}`)) 
                    : showToast('Failed to Create folder');

                let floatingButton = document.createElement('bookmark-float-button');
                floatingButton.addEventListener('mousedown', handleMouseDown);
                document.body.appendChild(floatingButton);

                newFolder.remove();
            });
        });
    }

    function displayBookmarkMenu() {
        const newFolderBtn = bookmarkMenu.shadowRoot.querySelector('.new-folder-btn');
        document.body.appendChild(bookmarkMenu);

        newFolderBtn.addEventListener('mouseup', displayCreateFolder);

        bookmarkMenu.addEventListener('menu-scroll-point', (event) => {
            chrome.storage.local.set({ scrollPosition: event.detail });
        });

        bookmarkMenu.addEventListener('save-general', (event) => {
            chrome.storage.sync.get(['generalFolder'], function (result) {
                result.generalFolder ? saveBookmarkToFolder(result.generalFolder) : saveBookmarkToFolder("2");
            });
        });


        chrome.storage.local.get(['scrollPosition'], (result) => {
            if (result.scrollPosition !== undefined) {
                bookmarkMenu.setAttribute('scrollPosition', result.scrollPosition);
            }
        });

        chrome.runtime.sendMessage({ action: "getAllBookmarks" }, function (response) {
                (response.bookmarks).forEach(function (bookmark) {
                    handleBookmarkLevel(bookmark, bookmarkMenu, 'root');
                });
                devmode ? printBookmarkTree(response.bookmarks) : '';
        });
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
  let toasts = document.querySelectorAll('bookmark-toast');

  toasts.forEach(function (toast) {
    toast.remove();
  });

  toastCreate.innerText = text;
  document.body.appendChild(toastCreate);

  setTimeout(function () {
    toastCreate.remove();
  }, 3000);
}

function saveBookmarkToFolder(folderId) {
    chrome.runtime.sendMessage({
        action: 'saveCurrentPageToBookmark',
        parentFolderId: folderId,
        currentPageUrl: document.URL,
        currentPageTitle: document.title
    });
}

function createFolderItem(type, title, id) {
    let image = type === 'main' ? 'src/assets/newFolderLarge.svg' : 'src/assets/newFolderMedium.svg';

    let folderItem = document.createElement('bookmark-folder-card');
    folderItem.innerText = title;
    folderItem.setAttribute('type', type);
    folderItem.setAttribute('src', chrome.runtime.getURL(image));
    folderItem.addEventListener('create-bookmark', function (event) {
        saveBookmarkToFolder(id);
        showToast('Bookmarked Under: ' + title);

    });

    const addFolder = folderItem.shadowRoot.getElementById('folder-button');
    const addBookmark = folderItem.shadowRoot.getElementById('container');

    folderItem.addEventListener('create-sub-folder', (event) => {
        let newFolder = document.createElement('bookmark-menu');
        newFolder.setAttribute('createFolder', '');
        newFolder.setAttribute('src', chrome.runtime.getURL('src/assets/newFolderXLarge.svg'));
        newFolder.shadowRoot.querySelector('.backdrop').addEventListener('mousedown', () => {
            let floatingButton = document.createElement('bookmark-float-button');
            floatingButton.addEventListener('mousedown', handleMouseDown);
            document.body.appendChild(floatingButton);

            newFolder.remove();
        });

        newFolder.addEventListener('create-folder', (event) => {
            chrome.runtime.sendMessage({ 
                action: 'createFolder', folderName: event.detail, parentFolderId: id 
            }, function (response) {

                response.folderId
                    ? (saveBookmarkToFolder(response.folderId), showToast(`Bookmark Created in: ${event.detail}`)) 
                    : showToast('Failed to Create folder');

                let floatingButton = document.createElement('bookmark-float-button');
                floatingButton.addEventListener('mousedown', handleMouseDown);
                document.body.appendChild(floatingButton);

                newFolder.remove();
            });
        });

        document.body.appendChild(newFolder);
        document.querySelector('bookmark-float-button').remove();
    });

    return folderItem;
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
                parentElement.appendChild(createFolderItem('main', bookmark.title, bookmark.id));
                bookmark.children.forEach(function (subChild) {
                    handleBookmarkLevel(subChild, parentElement, 'sub');
                });
            }
            break;

        case 'sub':
            if (bookmark.children && !bookmark.url && bookmark.title.trim() !== "") {
                parentElement.appendChild(createFolderItem('sub', bookmark.title, bookmark.id));
                bookmark.children.forEach(function (nestedChild) {
                    handleBookmarkLevel(nestedChild, parentElement, 'nested');
                });
            }
            break;

        case 'nested':
            if (!bookmark.url && bookmark.title.trim() !== "") {
                parentElement.appendChild(createFolderItem('nested', bookmark.title, bookmark.id));
            }
            break;
    }
}


/**
 * Prints the bookmark tree recursively.
 *
 * @param {Array} bookmarks - The array of bookmark objects.
 * @param {string} prefix - The prefix for folder numbering.
 * @param {string} indent - The indentation string.
 */
function printBookmarkTree(bookmarks, prefix = '', indent = '') {
    let output = [];

    function traverse(bookmarks, prefix = '', indent = '') {
        bookmarks.forEach(function (bookmark, index) {
            if (!bookmark.url) {
                let folderNumber = prefix + (index + 1);
                let childPrefix = folderNumber + '.';
                output.push(`${bookmark.title} : ${folderNumber}`);
                traverse(bookmark.children, childPrefix, indent + '  ');
            }
        });
    }

    traverse(bookmarks, prefix, indent);
}



