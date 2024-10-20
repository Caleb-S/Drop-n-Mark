const devmode = true;


// Function to create 100 folders inside "Other Bookmarks"
function createBookmarkFolders() {
    var amount = 500; 
    // Find the "Other Bookmarks" folder
    chrome.bookmarks.search({ title: 'Test Folder' }, function(results) {
        if (results.length > 0) {
            // Get the "Other Bookmarks" folder id
            const otherBookmarksId = results[0].id;
            
            // Create 100 folders within the "Other Bookmarks" folder
            for (let i = 1; i <= 5000; i++) {
                chrome.bookmarks.create({
                    parentId: otherBookmarksId,
                    title: `Folder ${i}`
                });
            }
            console.log(`{amount} folders created in 'Other bookmarks'.`);
        } else {
            console.log("'Other bookmarks' folder not found.");
        }
    });
}

// Call the function to create the folders
//createBookmarkFolders();



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getEnvironment') {
    sendResponse({ devmode: devmode });
  }
});

// restart extension
if (devmode) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'refreshExtension') {
      console.log('Received refresh request from content script');

      chrome.runtime.reload();


      sendResponse({ result: 'Extension refresh initiated' });
    }

  });
}

// -----------------------------------------------------------------------------

function injectedFunction() {
  document.body.style.backgroundColor = "orange";
    console.log('injectedFunction');
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getAllBookmarks") {
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
      sendResponse({ bookmarks: bookmarkTreeNodes });
    });
    return true;
  }
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "saveCurrentPageToBookmark") {
    console.log('background savecurrentpagetobookmark');
    var parentFolderId = request.parentFolderId;
    var currentPageUrl = request.currentPageUrl;
    var currentPageTitle = request.currentPageTitle;


      chrome.bookmarks.create({
        url: currentPageUrl,
        title: currentPageTitle,
        parentId: parentFolderId // Use the provided parent folder ID
      }, function (bookmark) {
        sendResponse({ success: true, bookmark: bookmark });
      });

    return true;
  }
});

// triggered when delete dupes button is clicked
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "deleteDuplicates") {
    deleteDuplicateBookmarks();
  
  }
});

// Function to delete duplicate bookmarks, keeping one instance in each folder
function deleteDuplicateBookmarks() {
    // Retrieve all bookmarks
    chrome.bookmarks.getTree(function (bookmarkTree) {
        const rootFolder = bookmarkTree[0];
        // Create an object to store unique URLs for each folder
        const uniqueURLsByFolder = {};

        // Search for duplicates and destroy them
        searchAndDestroy(rootFolder, uniqueURLsByFolder);
    });


    // Recursive function to traverse through folders and delete duplicate bookmarks
    function searchAndDestroy(folder, uniqueURLsByFolder) {
        if (folder.children) {
            for (let i = 0; i < folder.children.length; i++) {
                const child = folder.children[i];

                if (child.url) {
                    // Bookmark found
                    const bookmarkURL = child.url;

                    // Check if the URL already exists in the uniqueURLsByFolder object for the current folder
                    if (uniqueURLsByFolder[folder.id] && uniqueURLsByFolder[folder.id].hasOwnProperty(bookmarkURL)) {
                        // Duplicate bookmark found within the folder, remove it
                        chrome.bookmarks.remove(child.id);
                    } else {
                        // Add the URL to the uniqueURLsByFolder object for the current folder
                        if (!uniqueURLsByFolder[folder.id]) {
                            uniqueURLsByFolder[folder.id] = {};
                        }
                        uniqueURLsByFolder[folder.id][bookmarkURL] = true;
                    }
                } else {
                    // Folder found, recursively traverse through its children
                    searchAndDestroy(child, uniqueURLsByFolder);
                }
            }
        }
    }

}

function countDuplicates(folder, uniqueURLsByFolder, duplicates) {
  if (folder.children) {
    for (let i = 0; i < folder.children.length; i++) {
      const child = folder.children[i];

      if (child.url) {
        // Bookmark found
        const bookmarkURL = child.url;

        // Check if the URL already exists in the uniqueURLsByFolder object for the current folder
        if (uniqueURLsByFolder[folder.id] && uniqueURLsByFolder[folder.id].hasOwnProperty(bookmarkURL)) {
          // Duplicate bookmark found within the folder, increase the count
          duplicates += 1;
        } else {
          // Add the URL to the uniqueURLsByFolder object for the current folder
          if (!uniqueURLsByFolder[folder.id]) {
            uniqueURLsByFolder[folder.id] = {};
          }
          uniqueURLsByFolder[folder.id][bookmarkURL] = true;
        }
      } else {
        // Folder found, recursively traverse through its children
        duplicates = countDuplicates(child, uniqueURLsByFolder, duplicates);
      }
    }
  }

  return duplicates;
}


async function folderOrBookmarkCreated(trigger) {
        // Get and process settings
        result = await new Promise(resolve => chrome.storage.local.get(['sortFiles', 'sortFolders', 'removeDuplicates'], resolve));
        // Sort Folders if enabled
        if (result.sortFolders && trigger === 'created') {
            await moveAllFoldersToRoot();
        }

        // Sort Files if enabled
        if (result.sortFilesi && trigger === 'moved') {
            await moveAllFilesToRoot();
        }

        // Remove Duplicates if enabled
        if (result.removeDuplicates && trigger === 'moved') {
            deleteDuplicateBookmarks();
        }
}


// Listener for bookmark or folder creation
chrome.bookmarks.onCreated.addListener((id, bookmark) => {
    // Check if the created item is a folder (folders have no 'url' property)
    if (!bookmark.url) {
        folderOrBookmarkCreated('created');
    } else {
        folderOrBookmarkCreated('moved');
    }
});

// Listen for messages from the content script or other parts of the extension
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "countDuplicates") {
    // Perform the logic to count duplicates

    chrome.bookmarks.getTree(function (bookmarkTree) {
      const rootFolder = bookmarkTree[0];
      const uniqueURLsByFolder = {};

      var totalDuplicates = countDuplicates(rootFolder, uniqueURLsByFolder, 0);
      sendResponse({ totalDuplicates: totalDuplicates });
    });

    return true; // To indicate that a response will be sent asynchronously
  }
});



// Add event listener for "keydown" event in the content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'createFolder') {
    const folderName = request.folderName.trim(); // Get the folder name from the message and remove leading/trailing whitespace
    const parentFolderId = request.parentFolderId;
    if (folderName !== '') {

      if (typeof parentFolderId !== 'undefined') {
        chrome.bookmarks.create({ parentId: parentFolderId, index: 0, title: folderName }, function (newFolder) {
          // Set the folderId variable to the ID of the newly created folder
          folderId = newFolder.id;

          // Send the folderId back to the content script
          sendResponse({ folderId: folderId });
        });

      } else {
        chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
          const bookmarksBarFolder = bookmarkTreeNodes[0].children[0];
            //let folderId; 
            chrome.storage.local.get(['rootFolder'], function (result) {
                let folderId = result.rootFolder;


                if (bookmarksBarFolder) {
                    // Get the first child of the "Bookmarks Bar" folder
                    const firstChild = bookmarksBarFolder.children[0];

                    // Create a new folder in the "Bookmarks Bar" folder at the top
                    chrome.bookmarks.create({ parentId: folderId, index: firstChild ? firstChild.index : 0, title: folderName }, function (newFolder) {

                        // Set the folderId variable to the ID of the newly created folder
                        folderId = newFolder.id;

                        // Send the folderId back to the content script
                        sendResponse({ folderId: folderId });
                    });
                }
            });
        });

      }
      // Get the "Bookmarks Bar" folder

    }
  }

  return true;
});

// Listen for messages from content.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "checkBookmark") {
    // Check if the current page is bookmarked
    chrome.bookmarks.search({ url: sender.tab.url }, function (bookmarks) {
      // Send a response back to content.js
      sendResponse({ bookmarked: bookmarks.length > 0 });
    });

    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  }
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "deleteBookmark") {
    chrome.bookmarks.search({ url: sender.tab.url }, function (bookmarks) {
      if (bookmarks.length > 0) {
        var bookmarkId = bookmarks[0].id;

        chrome.bookmarks.getSubTree("0", function (treeNodes) {
          var foldersToDeleteFrom = [];

          // Recursive function to find all folders that contain the bookmark
          function findFolders(nodes) {
            for (var i = 0; i < nodes.length; i++) {
              var node = nodes[i];
              if (node.children) {
                findFolders(node.children);
              }
              if (node.id !== "0" && node.children) {
                for (var j = 0; j < node.children.length; j++) {
                  var child = node.children[j];
                  if (child.id === bookmarkId) {
                    foldersToDeleteFrom.push(node.id);
                    break;
                  }
                }
              }
            }
          }

          findFolders(treeNodes);

          // Delete bookmark from all folders
          foldersToDeleteFrom.forEach(function (folderId) {
            chrome.bookmarks.remove(bookmarkId, function () {
            });
          });

          sendResponse({ success: true });
        });
      } else {
        sendResponse({ success: false });
      }
    });

    return true; // Required to send a response asynchronously
  }
});

async function moveAllFoldersToRoot() {
    const getBookmarkTree = () => new Promise(resolve => chrome.bookmarks.getTree(resolve));
    const getStorage = () => new Promise(resolve => chrome.storage.local.get(['rootFolder'], resolve));
    const getBookmarkById = (id) => new Promise(resolve => chrome.bookmarks.get(id, resolve));
    const moveBookmark = (id, parentId) => new Promise(resolve => chrome.bookmarks.move(id, { parentId }, resolve));

    const bookmarkTree = await getBookmarkTree();
    const tree = bookmarkTree[0];
    const bookmarkBar = bookmarkTree[0].children[0];
    const otherBookmarks = bookmarkTree[0].children[1];
    let rootFolder = otherBookmarks.id;

    const storageResult = await getStorage();
    if (storageResult.rootFolder === "1") {
        rootFolder = bookmarkBar.id;
    } else if (storageResult.rootFolder === "2") {
        rootFolder = otherBookmarks.id;
    } else if (storageResult.rootFolder) {
        const bookmarkNodes = await getBookmarkById(storageResult.rootFolder);
        if (bookmarkNodes.length > 0 && !bookmarkNodes[0].url) {
            rootFolder = storageResult.rootFolder;
        } else {
            console.log('Custom Folder does not exist, using Fallback folder.');
        }
    }

    // Non-recursive, breadth-first folder traversal with batching
    const folderQueue = [tree];
    const foldersToMove = [];

    while (folderQueue.length) {
        const folder = folderQueue.shift();
        if (folder.children) {
            for (const child of folder.children) {
                if (child.children && child.parentId !== tree.id &&
                    (child.parentId === otherBookmarks.id || child.parentId === bookmarkBar.id)) {
                    foldersToMove.push(child.id);  // Queue for moving
                }
                folderQueue.push(child);  // Queue child folders for traversal
            }
        }
    }

    // Move folders to root in batches to avoid freezing
    for (const folderId of foldersToMove) {
        await moveBookmark(folderId, rootFolder);
    }
}



async function moveAllFilesToRoot() {
    const getBookmarkTree = () => new Promise(resolve => chrome.bookmarks.getTree(resolve));
    const getStorage = () => new Promise(resolve => chrome.storage.local.get(['generalFolder'], resolve));
    
    const getRoot = () => new Promise(resolve => chrome.storage.local.get(['rootFolder'], resolve));
    const getBookmarkById = (id) => new Promise(resolve => chrome.bookmarks.get(id, resolve));
    const moveBookmark = (id, parentId) => new Promise(resolve => chrome.bookmarks.move(id, { parentId }, resolve));

    // Retrieve the full bookmark tree
    const bookmarkTree = await getBookmarkTree();
    const tree = bookmarkTree[0];
    const bookmarkBar = bookmarkTree[0].children[0];
    const otherBookmarks = bookmarkTree[0].children[1];
    let generalFolder = otherBookmarks.id;

    // Get storage settings for the root folder
    const storageResult = await getStorage();
    if (storageResult.generalFolder === "1") {
        generalFolder = bookmarkBar.id;
    } else if (storageResult.generalFolder === "2") {
        generalFolder = otherBookmarks.id;
    } else if (storageResult.generalFolder) {
        (async () => {
            const bookmarkNodes = await getBookmarkById(storageResult.generalFolder);
            if (bookmarkNodes.length > 0 && !bookmarkNodes[0].url) {
                generalFolder = storageResult.generalFolder;
            } else {
                console.log('Custom Folder does not exist, using Fallback folder.');
            }
        })();
    }



    const rootResult = await getRoot();
    const rootFolder = rootResult.rootFolder;
    if (rootResult.rootFolder !== "1" && rootResult.rootFolder !== "2") {
        (async () => {

            const bookmarkNodes = await getBookmarkById(storageResult.rootFolder);
            if (bookmarkNodes.length > 0 && !bookmarkNodes[0].url) {
                rootFolder = storageResult.rootFolder;
            } else {
                console.log('Custom Folder does not exist, using Fallback folder.');
            }

        })();
    }


    // Queue for breadth-first traversal
    const folderQueue = [tree];
    const filesToMove = [];

    // Traverse folders and identify files for moving
    while (folderQueue.length) {
        const folder = folderQueue.shift();
        if (folder.children) {
            for (const child of folder.children) {
                if ((child.url && child.parentId === "1") || (child.url &&  child.parentId === "2")) {
                    // Collect files with URLs outside the root folder
                    filesToMove.push(child.id);
                }
                if (child.children) {
                    folderQueue.push(child);  // Queue subfolders for traversal
                }
            }
        }
    }

    // Move files to the root folder in batches to avoid freezing
    for (const fileId of filesToMove) {
        
        await moveBookmark(fileId, generalFolder);
    }
}



chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === "updateSettings") {
        result = await new Promise(resolve => chrome.storage.local.get(['sortFiles', 'sortFolders', 'removeDuplicates'], resolve));
        // Sort Folders if enabled
        if (result.sortFolders) {
            await moveAllFoldersToRoot();
        }

        // Sort Files if enabled
        if (result.sortFiles) {
            await moveAllFilesToRoot();
        }

        // Remove Duplicates if enabled
        if (result.removeDuplicates) {
            deleteDuplicateBookmarks();
        }
        return true; // Required to send a response asynchronously
    }
});


