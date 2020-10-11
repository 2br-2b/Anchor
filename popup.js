//Set the default maximum depth to 5
if (!localStorage.max_depth) localStorage['max_depth'] = 5;


// Populate the max depth field
chrome.storage.sync.get(["max_depth"], function (max) {
    max_depth.value = (max.max_depth == null) ? 5 : max.max_depth;
});

// Populate the urls field
chrome.storage.sync.get(["active_urls"], function (result) {
    var formatted_string = "";
    for (var i = 0; i < result.active_urls.length; i++) {
        formatted_string += result.active_urls[i] + "\n";
    }
    document.getElementById("urls").value = (result.active_urls == null) ? "ERROR" : formatted_string.slice(0, -1);
});

// Code for when "Save changes" is pressed
save_changes_button.onclick = function () {
    var new_depth = document.getElementById("max_depth").value;

    if (new_depth <= 0) {
        alert("Please enter a valid depth!");
        return;
    }


    active_urls_field = document.getElementById("urls").value.split("\n");
    chrome.storage.sync.set({"active_urls": active_urls_field}, function () {});


    chrome.storage.sync.set({"max_depth": new_depth}, function () {
        reload_page();
        window.close();
    });


};


//When the Toggle Whitelist button is clicked
toggle_whitelist.onclick = function () {
    var the_active_urls;

    chrome.storage.sync.get(["active_urls"], function (result) {

        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            // Get the domain name
            var current_tab = tabs[0];
            var domain_name = current_tab.url.split("/")[2];

            console.log(domain_name);

            // If there isn't already a list of active urls, create it
            if (result.active_urls == null) {
                the_active_urls = ["www.reddit.com", "www.youtube.com", "www.google.com"];

                chrome.storage.sync.set({"active_urls": the_active_urls}, function () {
                    console.log("Couldn't find active urls, so set active urls to: " + the_active_urls);
                });
            } else {
                the_active_urls = result.active_urls;
                console.log("Loaded active urls: " + the_active_urls);
            }

            if (the_active_urls.includes(domain_name)) {
                // The url is not already in the list, so add it
                console.log("Removing url " + domain_name)

                index = the_active_urls.indexOf(domain_name);
                if (index > -1) {
                    the_active_urls.splice(index, 1);
                }

            } else {
                // The url is already in the list, so remove it
                console.log("Adding url " + domain_name)
                the_active_urls.push(domain_name)
            }

            // Save the active url list
            chrome.storage.sync.set({"active_urls": the_active_urls}, function () {
                console.log("Set active urls: " + the_active_urls);
                reload_page();
                window.close();
            });
        });
    })
};


reload_page = function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        // console.log(tabs);
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        // console.log("Reloaded the page");
    });

}