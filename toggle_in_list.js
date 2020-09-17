var the_active_urls;

chrome.storage.sync.get(["active_urls"], function (result) {
    console.log(result.active_urls);
    if (result.active_urls == null) {
        the_active_urls = [];
        chrome.storage.sync.set({"active_urls": the_active_urls}, function () {
            console.log("Couldn't find active urls, so set active urls to: " + the_active_urls);
        });
    } else {
        the_active_urls = result.active_urls;
        console.log("Loaded active urls: " + the_active_urls);
    }

    if (the_active_urls.includes(document.location.host)) {
        // The url is not already in the list, so add it
        console.log("Removing url " + document.location.host)

        index = the_active_urls.indexOf(document.location.host);
        if (index > -1) {
            the_active_urls.splice(index, 1);
        }

    } else {
        // The url is already in the list, so remove it
        console.log("Adding url " + document.location.host)
        the_active_urls.push(document.location.host)
    }



    chrome.storage.sync.set({"active_urls": the_active_urls}, function () {
        console.log("Set active urls: " + the_active_urls);
    });

    window.location.reload();

})