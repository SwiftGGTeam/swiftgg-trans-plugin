const pluginFlag = "pluginFlag"
var shouldTranslate = false
let initalRequestMethod = "shouldTranslate"
let updateRequestMethod = "updateShouldTranslate"
let reloadRequestMethod = "reloadShouldTranslate"


chrome.storage.local.get(pluginFlag, (result) => {
    shouldTranslate = result.pluginFlag || false
  });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === updateRequestMethod) {
        shouldTranslate = request.data;
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.reload(tabs[0].id);
        });
    } else if (request.type === initalRequestMethod) {
        sendResponse({shouldTranslate: shouldTranslate});
    }
});

function delay(i) {
  setTimeout(() => {
    console.log(i);
  }, i * 1000);
}
