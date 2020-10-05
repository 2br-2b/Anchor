if (!localStorage.max_depth) localStorage['max_depth'] = 10;

save_changes_button.onclick = function () {
    var new_depth = document.getElementById("max_depth").value;

    if (new_depth <= 0) {
        alert("Please enter a valid depth!");
        return;
    }
    chrome.storage.sync.set({"max_depth": new_depth}, function () {
        reload_page();
    });

};




toggle_whitelist.onclick = function () {
    var the_active_urls;

    chrome.storage.sync.get(["active_urls"], function (result) {

        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            var current_tab = tabs[0];
            var domain_name = current_tab.url.split("/")[2];

            console.log(domain_name);

            if (result.active_urls == null) {
                the_active_urls = [];
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



            chrome.storage.sync.set({"active_urls": the_active_urls}, function () {
                console.log("Set active urls: " + the_active_urls);
            });



            reload_page();




        });


        /**/

    })
};


reload_page = function () {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            var current_tab = tabs[0];
            chrome.tabs.update(current_tab.id, {url: current_tab.url})
        })
    });
}