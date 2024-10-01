
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


function handleMouseDown(event) {
  chrome.runtime.sendMessage({ action: "checkBookmark" }, function (response) {
    if (response.bookmarked) {
      let bookmarkMenu = document.createElement('bookmark-menu');
      bookmarkMenu.setAttribute('bookmarked', '');
      bookmarkMenu.setAttribute('src', chrome.runtime.getURL('src/assets/rubbishBinSmall.svg'));
      let deleteBox = bookmarkMenu.shadowRoot.querySelector('.deleteBox');
      deleteBox.addEventListener('mouseup', function (event) {
        chrome.runtime.sendMessage({ action: "deleteBookmark" }, function (response) {
          response.success ? showToast('Removed Bookmark') : showToast('Failed To Remove Bookmark');
        });
      });
      document.body.appendChild(bookmarkMenu);
      document.addEventListener('mouseup', () => bookmarkMenu.remove());

    } else {
      let bookmarkMenu = document.createElement('bookmark-menu');
      bookmarkMenu.addEventListener('menu-scroll-point', (event) => {
        chrome.storage.local.set({ scrollPosition: event.detail });
      });

      bookmarkMenu.addEventListener('save-general', (event) => {
        saveBookmarkToFolder('2');
      });

      chrome.storage.local.get(['scrollPosition'], (result) => {
        if (result.scrollPosition !== undefined) {
          bookmarkMenu.setAttribute('scrollPosition', result.scrollPosition);
        }
      });

      chrome.runtime.sendMessage({ action: "getAllBookmarks" }, function (response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        } else {
          (response.bookmarks).forEach(function (bookmark) {
            handleBookmarkLevel(bookmark, bookmarkMenu, 'root');
          });
          devmode ? printBookmarkTree(response.bookmarks) : '';
        }
      });
      document.body.appendChild(bookmarkMenu);


      const newFolderBtn = bookmarkMenu.shadowRoot.querySelector('.new-folder-btn');
      newFolderBtn.addEventListener('mouseup', function (event) {
        let newFolder = document.createElement('bookmark-menu');
        newFolder.setAttribute('createFolder', '');
        newFolder.setAttribute('src', chrome.runtime.getURL('src/assets/newFolderXLarge.svg'));
        document.body.appendChild(newFolder);
        document.querySelector('bookmark-float-button').remove();
        newFolder.shadowRoot.querySelector('.backdrop').addEventListener('mousedown', () => {
          newFolder.remove();
          let floatingButton = document.createElement('bookmark-float-button');
          document.body.appendChild(floatingButton);
          floatingButton.addEventListener('mousedown', handleMouseDown);

        });

        newFolder.addEventListener('create-folder', (event) => {
          chrome.runtime.sendMessage({ action: 'createFolder', folderName: event.detail }, function (response) {
            const folderId = response.folderId;

            if (folderId) {
              saveBookmarkToFolder(folderId);
              showToast('Bookmark Created in: ' + event.detail);

            } else {
              showToast('Failed to Create folder');
            }

            newFolder.remove();

            let floatingButton = document.createElement('bookmark-float-button');
            document.body.appendChild(floatingButton);
            floatingButton.addEventListener('mousedown', handleMouseDown);
          });
        });



      });
      document.addEventListener('mouseup', () => bookmarkMenu.remove());

      //document.addEventListener('mouseup', () => floatDropOutside);

    }


  });


}



/*
 Hides bookmark menu when mouse is released outside of the bookmark menu.

 */
function floatDropOutside(event) {


  console.log(bookmarkMenu);




  //bookmarkMenu.remove();



  let mainAddFolder = bookmarkMenu.shadowRoot.querySelector('.main-add-folder');
  let subAddFolder = bookmarkMenu.shadowRoot.querySelector('.sub-add-folder');
  let newFolderBtn = bookmarkMenu.shadowRoot.querySelector('.new-folder-btn');

  if (
    !(newFolderBtn && newFolderBtn.contains(event.target)) &&
    !event.target.closest(mainAddFolder) &&
    !event.target.closest(subAddFolder)
  ) {
    // bookmarkMenu.style.display = 'none';

    console.log('outside button');
  } else {
    console.log('inside button');
  }



  //document.querySelector('bookmark-menu').remove();

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

  let FolderItem = document.createElement('bookmark-folder-card');
  FolderItem.innerText = title;
  FolderItem.setAttribute('type', type);
  FolderItem.setAttribute('src', chrome.runtime.getURL(image));


  const addBookmark = FolderItem.shadowRoot.getElementById('container');
  const addFolder = FolderItem.shadowRoot.getElementById('folder-button');
  FolderItem.addEventListener('create-bookmark', function (event) {

    saveBookmarkToFolder(id);
    showToast('Bookmarked Under: ' + title);
    /*
    console.log(event.target);
    if (event.target === addBookmark) {
      saveBookmarkToFolder(id);
      showToast('Bookmarked Under: ' + title);
    }
    */

    /*

    if (event.target === addFolder) {
      let newFolder = document.createElement('bookmark-menu');
      newFolder.setAttribute('createFolder', '');
      newFolder.setAttribute('src', chrome.runtime.getURL('src/assets/newFolderXLarge.svg'));
      document.body.appendChild(newFolder);
      document.querySelector('bookmark-float-button').remove();
      newFolder.shadowRoot.querySelector('.backdrop').addEventListener('mousedown', () => {
        newFolder.remove();
        let floatingButton = document.createElement('bookmark-float-button');
        document.body.appendChild(floatingButton);
        floatingButton.addEventListener('mousedown', handleMouseDown);

      });

      */




  });




  FolderItem.addEventListener('create-sub-folder', (event) => {


    let newFolder = document.createElement('bookmark-menu');
    newFolder.setAttribute('createFolder', '');
    newFolder.setAttribute('src', chrome.runtime.getURL('src/assets/newFolderXLarge.svg'));
    document.body.appendChild(newFolder);
    document.querySelector('bookmark-float-button').remove();
    newFolder.shadowRoot.querySelector('.backdrop').addEventListener('mousedown', () => {
      newFolder.remove();
      let floatingButton = document.createElement('bookmark-float-button');
      document.body.appendChild(floatingButton);
      floatingButton.addEventListener('mousedown', handleMouseDown);

    });

    newFolder.addEventListener('create-folder', (event) => {
      chrome.runtime.sendMessage({ action: 'createFolder', folderName: event.detail, parentFolderId: id }, function (response) {
        const folderId = response.folderId;

        if (folderId) {
          saveBookmarkToFolder(folderId);
          showToast('Bookmark Created in: ' + event.detail);

        } else {
          showToast('Failed to Create folder');
        }

        newFolder.remove();

        let floatingButton = document.createElement('bookmark-float-button');
        document.body.appendChild(floatingButton);
        floatingButton.addEventListener('mousedown', handleMouseDown);
      });
    });

  });


  /*
    addBtn.addEventListener('mouseup', function (event) {
  
    });
    */

  return FolderItem;
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
  //console.log(output.join('\n'));
}



