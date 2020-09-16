chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(localStorage.status);
        if (request.type == "status") sendResponse({status: localStorage.status});
    }
);
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, {file: "toggle_in_list.js"});
 });
 