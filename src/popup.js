
var removeDupButton = document.getElementById("remove-dup-btn");
document.getElementById("remove-dup-btn").addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "deleteDuplicates" });




});

    // Listen for messages from the content script or background script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        /*
            Error: Could not establish connection. Receiving end does not exist.
            */
            if (request.action === "updateButton") {
                console.log('bitta action eh?');
                // Calculate the total number of duplicates again
                calculateTotalDuplicates(function(totalDuplicates) {
                    removeDupButton.innerText = "Remove Duplicates (" + totalDuplicates + ")";
                });
            }
    });


document.addEventListener("DOMContentLoaded", function() {

    // Calculate the total number of duplicates initially
    calculateTotalDuplicates(function(totalDuplicates) {
        removeDupButton.innerText = "Remove Duplicates (" + totalDuplicates + ")";
    });




});


// Function to calculate the total number of duplicates
function calculateTotalDuplicates(callback) {
    // Request the background script to count duplicates
    chrome.runtime.sendMessage({ action: "countDuplicates" }, function(response) {
        var totalDuplicates = response.totalDuplicates;
        callback(totalDuplicates);
    });
}


