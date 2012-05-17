chrome.tabs.getAllInWindow(null, function (tabs) {
    for (var tab in tabs) {
        chrome.pageAction.show(tabs[tab].id);
    }
});


chrome.tabs.onCreated.addListener(function (tab) {
    chrome.pageAction.show(tab.id);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.pageAction.show(tabId);
});


chrome.extension.onRequest.addListener(
        function (request, sender, sendResponse) {

            if (request.op == "getTranslation") {
                google.language.translate(request.text, request.source_language, request.target_language,
                    function (result) {
                        console.log(result);
                        sendResponse({ value: result });
                    }
                );
            }
            else if (request.op == "detectLanguage") {
                google.language.detect(request.text,
                    function (result) {
                        console.log(result);
                        sendResponse({ value: result });
                    }
                );
            }
            else if (request.op == "getView") {
                var view = $.View(request.url, request.params);
                console.log("View in background - " + view);
                sendResponse(view);
            }
            else if (request.op == "getSettings") {
                sendResponse(Settings.get_settings());
            }
            else if (request.op == "setItem") {
                localStorage[request.key] = request.value;
            }
            else if (request.op == "getItem") {
                sendResponse(localStorage[request.key]);
            }
            else if (request.op == "getAllItems") {
                result = {};
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i)
                    result[key] = localStorage[key];
                }
                sendResponse(result);
            }
            else if (request.op == "getTagsHashList") {
            }
        });