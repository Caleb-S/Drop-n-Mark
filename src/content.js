
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
    script.onerror = () => { console.log(`Error loading script: ${script.src}`); };
    document.head.appendChild(script);
  }
})();

(function () {
  let floatingButton = document.createElement('bookmark-float-button');
  document.body.appendChild(floatingButton);
  floatingButton.addEventListener('mousedown', handleMouseDown);
  floatingButton.setAttribute('stylesheet', chrome.runtime.getURL('src/components/styles/floating-btn.css'));
})();

document.addEventListener('mouseup', (e) => {
    if (document.getElementsByTagName('bookmark-menu').length > 0) {
        
      let menus = document.getElementsByTagName('bookmark-menu');

for (let i = menus.length - 1; i >= 0; i--) {
    if (!menus[i].hasAttribute('createFolder')) {
        menus[i].remove();
    }
}

    }
});

function handleMouseDown(event) {

    let bookmarkMenu = document.createElement('bookmark-menu');
    //document.addEventListener('mouseup', () => bookmarkMenu.remove());


    console.log('runtime: ' + chrome.runtime?.id);
    if (chrome.runtime?.id) {
        chrome.runtime.sendMessage({ action: "checkBookmark" }, function (response) {
            response.bookmarked ? displayDeleteBox() :  displayBookmarkMenu();
        });
    } else {
       showToast('Error: Refresh Page & Try Again'); 
    }


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

            floatingButton.setAttribute('stylesheet', chrome.runtime.getURL('src/components/styles/floating-btn.css'));
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

                floatingButton.setAttribute('stylesheet', chrome.runtime.getURL('src/components/styles/floating-btn.css'));
                floatingButton.addEventListener('mousedown', handleMouseDown);
                document.body.appendChild(floatingButton);

                newFolder.remove();
            });
        });
    }

    function displayBookmarkMenu() {
        const newFolderBtn = bookmarkMenu.shadowRoot.querySelector('.new-folder-btn');

        newFolderBtn.addEventListener('mouseup', displayCreateFolder);

        bookmarkMenu.addEventListener('menu-scroll-point', (event) => {
            chrome.storage.local.set({ scrollPosition: event.detail });
        });

        bookmarkMenu.addEventListener('save-general', (event) => {
            chrome.storage.local.get(['generalFolder'], function (result) {
                result.generalFolder ? saveBookmarkToFolder(result.generalFolder) : saveBookmarkToFolder("2");
            });
        });


        chrome.storage.local.get(['scrollPosition'], (result) => {
            if (result.scrollPosition !== undefined) {
                bookmarkMenu.setAttribute('scrollPosition', result.scrollPosition);
            }
        });

        chrome.runtime.sendMessage({ action: "getAllBookmarks" }, function (response) {
            chrome.storage.local.get(['storedBookmarks', 'storedHtml'], function (result) {
                if (!response.bookmarks || response.bookmarks.length === 0) {
                    console.log('no bookmarks received');
                    return; // Early exit if there are no bookmarks
                }

                const currentBookmarks = response.bookmarks[0];

                if (result.storedBookmarks === undefined) {
                    console.log('no stored bookmarks');
                    updateBookmarks(currentBookmarks);
                } else if (JSON.stringify(currentBookmarks) !== JSON.stringify(result.storedBookmarks)) {
                    console.log('stored bookmarks changed');
                    updateBookmarks(currentBookmarks);
                } else {
                    console.log('stored bookmarks using storedHtml');
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = result.storedHtml; // Create a temporary container
                    const divs = Array.from(tempDiv.children);

                        for (const div of divs) {
                            timeout = setTimeout(() => {
                            bookmarkMenu.appendChild(div); // Append the existing div directly
                                }, 0);

                            // Optional: Delay between appends for better UX
                        }
                    document.body.appendChild(bookmarkMenu); // Append the bookmarkMenu to the body once done



                }
            });

            if (devmode) {
                printBookmarkTree(response.bookmarks);
            }

            function updateBookmarks(bookmark) {
                handleBookmarkLevel(bookmark, bookmarkMenu, 'root');
                document.body.appendChild(bookmarkMenu);
                chrome.storage.local.set({ storedBookmarks: bookmark });
                chrome.storage.local.set({ storedHtml: bookmarkMenu.innerHTML });
            }
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
            floatingButton.setAttribute('stylesheet', chrome.runtime.getURL('src/components/styles/floating-btn.css'));
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
                floatingButton.setAttribute('stylesheet', chrome.runtime.getURL('src/components/styles/floating-btn.css'));
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
                for (let i = 0; i < bookmark.children.length; i++) {
                    handleBookmarkLevel(bookmark.children[i], parentElement, 'sub');
                }
            }
            break;

        case 'sub':
            if (bookmark.children && !bookmark.url && bookmark.title.trim() !== "") {
                parentElement.appendChild(createFolderItem('sub', bookmark.title, bookmark.id));
                for (let i = 0; i < bookmark.children.length; i++) {
                    handleBookmarkLevel(bookmark.children[i], parentElement, 'nested');
                }
           
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



