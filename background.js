chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getAllBookmarks") {
      chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
        sendResponse({ bookmarks: bookmarkTreeNodes });
      });
      return true;
    }
  });


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "saveCurrentPageToBookmark") {
    var parentFolderId = request.parentFolderId;
    var currentPageUrl = request.currentPageUrl;
    var currentPageTitle = request.currentPageTitle;
    
    
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var currentPage = tabs[0];
      

      chrome.bookmarks.create({ 
        url: currentPageUrl, 
        title: currentPageTitle,
        parentId: parentFolderId // Use the provided parent folder ID
      }, function(bookmark) {
        sendResponse({ success: true, bookmark: bookmark });
      });
    });

    return true;
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "deleteDuplicates") {
    deleteDuplicateBookmarks();
    updateButton();
  }
});

// Function to delete duplicate bookmarks, keeping one instance in each folder
function deleteDuplicateBookmarks() {
  // Retrieve all bookmarks
  chrome.bookmarks.getTree(function (bookmarkTree) {
    const rootFolder = bookmarkTree[0];

    // Create an object to store unique URLs for each folder
    const uniqueURLsByFolder = {};

    // Traverse through all folders recursively
    traverseFolders(rootFolder, uniqueURLsByFolder);
  });
  
}

// Recursive function to traverse through folders and delete duplicate bookmarks
function traverseFolders(folder, uniqueURLsByFolder) {
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
        traverseFolders(child, uniqueURLsByFolder);
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



function sendMessageToContentScript(tabId) {
  chrome.tabs.sendMessage(tabId, { action: "generateMenu" });
}

function handleBookmarksUpdated(id, changeInfo) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    sendMessageToContentScript(tabs[0].id);
  });
}

chrome.bookmarks.onCreated.addListener(handleBookmarksUpdated);
chrome.bookmarks.onRemoved.addListener(handleBookmarksUpdated);
chrome.bookmarks.onChanged.addListener(handleBookmarksUpdated);




function updateButton() {
  // Send a message to the background script to update the button
  chrome.runtime.sendMessage({ action: "updateButton" }, function(response) {
    if (chrome.runtime.lastError) {
      // Handle error, if any
      console.error(chrome.runtime.lastError);
    } else {
      // Handle response, if needed
      console.log(response);
    }
  });
}


chrome.action.onClicked.addListener(function(tab) {
  updateButton();
});

// Listen for messages from the content script or other parts of the extension
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "countDuplicates") {
    // Perform the logic to count duplicates

    chrome.bookmarks.getTree(function(bookmarkTree) {
      console.log("counting");
      const rootFolder = bookmarkTree[0];
      const uniqueURLsByFolder = {};

      var totalDuplicates = countDuplicates(rootFolder, uniqueURLsByFolder, 0);
      sendResponse({ totalDuplicates: totalDuplicates });
    });

    return true; // To indicate that a response will be sent asynchronously
  }
});

/*
// Add event listener for "keydown" event in the content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'createFolder') {
    const folderName = request.folderName.trim(); // Get the folder name from the message and remove leading/trailing whitespace

    if (folderName !== '') {
      // Get the "Bookmarks Bar" folder
      chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
        const bookmarksBarFolder = bookmarkTreeNodes[0].children[0];

        if (bookmarksBarFolder) {
          // Get the first child of the "Bookmarks Bar" folder
          const firstChild = bookmarksBarFolder.children[0];

          // Create a new folder in the "Bookmarks Bar" folder at the top
          chrome.bookmarks.create({ parentId: bookmarksBarFolder.id, index: firstChild ? firstChild.index : 0, title: folderName }, function (newFolder) {
            console.log('New folder created:', newFolder);

            // Set the folderId variable to the ID of the newly created folder
            folderId = newFolder.id;

            // Send the folderId back to the content script
            sendResponse({ folderId: folderId });
          });
        }
      });
    }
  }

  return true;
});
*/

// Add event listener for "keydown" event in the content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'createFolder') {
    const folderName = request.folderName.trim(); // Get the folder name from the message and remove leading/trailing whitespace
    const parentFolderId = request.parentFolderId;
    console.log('test | parent folder: ',parentFolderId);
    if (folderName !== '') {

      if (typeof parentFolderId !== 'undefined') {
        console.log('test | Correct Path');
        chrome.bookmarks.create({ parentId: parentFolderId, index: 0, title: folderName }, function (newFolder) {
          console.log('New folder created:', newFolder);

          // Set the folderId variable to the ID of the newly created folder
          folderId = newFolder.id;

          // Send the folderId back to the content script
          sendResponse({ folderId: folderId });
        });

      } else {
        console.log('test | Wrong Path');
        chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
          const bookmarksBarFolder = bookmarkTreeNodes[0].children[0];
  
          if (bookmarksBarFolder) {
            // Get the first child of the "Bookmarks Bar" folder
            const firstChild = bookmarksBarFolder.children[0];
  
            // Create a new folder in the "Bookmarks Bar" folder at the top
            chrome.bookmarks.create({ parentId: bookmarksBarFolder.id, index: firstChild ? firstChild.index : 0, title: folderName }, function (newFolder) {
              console.log('New folder created:', newFolder);
  
              // Set the folderId variable to the ID of the newly created folder
              folderId = newFolder.id;
  
              // Send the folderId back to the content script
              sendResponse({ folderId: folderId });
            });
          }
        });

      }
      // Get the "Bookmarks Bar" folder
      
    }
  }

  return true;
});
  
// Listen for messages from content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "checkBookmark") {
    // Check if the current page is bookmarked
    chrome.bookmarks.search({ url: sender.tab.url }, function(bookmarks) {
      // Send a response back to content.js
      sendResponse({ bookmarked: bookmarks.length > 0 });
    });

    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "deleteBookmark") {
    chrome.bookmarks.search({ url: sender.tab.url }, function(bookmarks) {
      if (bookmarks.length > 0) {
        var bookmarkId = bookmarks[0].id;

        chrome.bookmarks.getSubTree("0", function(treeNodes) {
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
          foldersToDeleteFrom.forEach(function(folderId) {
            chrome.bookmarks.remove(bookmarkId, function() {
              console.log("Bookmark deleted from folder with ID:", folderId);
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
