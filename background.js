const pluginFlag = "pluginFlag"
var shouldTranslate = false
let initalRequestMethod = "shouldTranslate"
let updateRequestMethod = "updateShouldTranslate"
let reloadRequestMethod = "reloadShouldTranslate"


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === updateRequestMethod) {
        shouldTranslate = request.data;
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.reload(tabs[0].id);
        });
    } else if (request.type === initalRequestMethod) {
      chrome.storage.local.get(pluginFlag, (result) => {
        shouldTranslate = result.pluginFlag || false
        sendResponse({shouldTranslate: shouldTranslate});
      });
      return true; // 因为 chrome.storage.local.get 是异步的，显式地返回 true 以保持 sendResponse 的引用
    }
});

function delay(i) {
  setTimeout(() => {
    console.log(i);
  }, i * 1000);
}
