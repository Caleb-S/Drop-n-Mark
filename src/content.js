
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
      let bookmarkMenu = document.createElement('bookmark-menu')
      bookmarkMenu.setAttribute('bookmarked', '');
      bookmarkMenu.setAttribute('src', chrome.runtime.getURL('src/assets/rubbishBinSmall.svg'));
      let deleteBox = bookmarkMenu.shadowRoot.querySelector('.deleteBox');
      deleteBox.addEventListener('mouseup', function (event) {
        chrome.runtime.sendMessage({ action: "deleteBookmark" }, function (response) {
          response.success ? showToast('Removed Bookmark') : showToast('Failed To Remove Bookmark');
        });
      });
      document.body.appendChild(bookmarkMenu);

    } else {
      let bookmarkMenu = document.createElement('bookmark-menu');
      bookmarkMenu.addEventListener('menu-scroll-point', (event) => {
        chrome.storage.local.set({ scrollPosition: event.detail });
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
    }
  });

  document.addEventListener('mouseup', floatDropOutside);
}



/*
 Hides bookmark menu when mouse is released outside of the bookmark menu.

 */
function floatDropOutside(event) {


  const bookmarkMenu = document.querySelector('bookmark-menu');
  const newFolderBtn = bookmarkMenu.shadowRoot.querySelector('.new-folder-btn');

  if (!newFolderBtn.contains(event.target) && !event.target.closest('.main-add-folder') && !event.target.closest('.sub-add-folder')) {
    //bookmarkMenu.style.display = 'none';
    document.querySelector('bookmark-menu').remove();
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


function createFolderItem(type, title, id) {
  let image = type === 'main' ? 'src/assets/newFolderLarge.svg' : 'src/assets/newFolderMedium.svg';

  let FolderItem = document.createElement('bookmark-folder-card');
  FolderItem.innerText = title;
  FolderItem.setAttribute('type', type);
  FolderItem.setAttribute('src', chrome.runtime.getURL(image));

  FolderItem.addEventListener('mouseup', function (event) {
    if (event.target === FolderItem) {
      chrome.runtime.sendMessage({
        action: "saveCurrentPageToBookmark",
        parentFolderId: id,
        currentPageUrl: document.URL,
        currentPageTitle: document.title
      });
      showToast('Bookmarked Under: ' + title);
    }
  });

  const addBtn = FolderItem.shadowRoot.getElementById('folder-button');

  addBtn.addEventListener('mouseup', function (event) {
    if (event.target === addBtn) {
      console.log('Add Folder Selected');
      // logic for add folder, should bring up input box.
    }
  });

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
  console.log(output.join('\n'));
}



