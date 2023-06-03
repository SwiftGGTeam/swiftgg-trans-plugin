const pluginFlag = "pluginFlag"
var shouldTranslate = false
let initalRequestMethod = "shouldTranslate"
let updateRequestMethod = "updateShouldTranslate"
let reloadRequestMethod = "reloadShouldTranslate"


chrome.storage.local.get(pluginFlag, (result) => {
    console.log(result.pluginFlag,"local");
    shouldTranslate = result.pluginFlag || false
  });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === updateRequestMethod) {
        shouldTranslate = request.data;
    } else if (request.type === initalRequestMethod) {
        sendResponse({data: shouldTranslate});
    }
});


