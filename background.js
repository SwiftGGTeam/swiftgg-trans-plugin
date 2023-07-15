const pluginFlag = "pluginFlag"
const translatedFlag = "pluginFlag"
var shouldTranslate = false
let initalRequestMethod = "shouldTranslate"
let updateRequestMethod = "updateShouldTranslate"
let reloadRequestMethod = "reloadShouldTranslate"
let startTranslateRequestMethod = "startTranslate"
var currentTranslatingPage = [];
var currentTabID = 0
var previousTabID = 0

chrome.storage.local.get(pluginFlag, (result) => {
    shouldTranslate = result.pluginFlag || false
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === updateRequestMethod) {
        shouldTranslate = request.data;
        currentTranslatingPage = []
        currentTabID = 0
        console.log("clear" + " Current" + currentTabID)
        chrome.tabs.query({}, function (tabs) {
           let running = []
           for (let tab of tabs) {
               if (tab.url.includes("developer.apple.com")) {
                   running.push(chrome.tabs.reload(tab.id))
               }
           }

           Promise.allSettled(running).then()

           chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
               const activeTab = tabs[0]
               updateTabId(activeTab.id)
               if (activeTab.url.includes("developer.apple.com")) {
                   updateLogo(true)
               } else {
                   updateLogo(false)
               }
           })
        });
    } else if (request.type === initalRequestMethod) {
        sendResponse({shouldTranslate: shouldTranslate});
    } else if (request.type === startTranslateRequestMethod) {
        currentTranslatingPage.push(sender.tab.id)
        updateLogo(true)
    }
});

function delay(i) {
  setTimeout(() => {
    console.log(i);
  }, i * 1000);
}

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0]
        updateTabId(activeTab.id)
        currentTranslatingPage = removeItemAll(currentTranslatingPage, previousTabID)
        if (activeTab.url.includes("developer.apple.com")) {
            updateLogo(true)
        } else {
            updateLogo(false)
        }
    });
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        updateTabId(tab.id)
        if (tab.url && !(tab.url.includes('developer.apple.com/'))) {
            updateLogo(false)
            currentTranslatingPage = removeItemAll(currentTranslatingPage, currentTabID)
        } else if (tab.url && (tab.url.includes('developer.apple.com/'))) {
            updateLogo(true)
        }
    });
});

function removeItemAll(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
function updateTabId(id) {
    previousTabID = currentTabID
    currentTabID = id
}

function updateLogo(active) {
    if (active) {
        if (shouldTranslate) {
            if (currentTranslatingPage.includes(currentTabID)) {
                chrome.action.setIcon({ path: { "128": "/source/intro/swiftLogo-translating.png"} }).then(r => {})
            } else {
                console.log(currentTranslatingPage, tab.id)
                chrome.action.setIcon({ path: { "128": "/source/intro/swiftLogo-running.png"} }).then(r => {})
            }
        } else {
            chrome.action.setIcon({ path: { "128": "/source/intro/swiftLogo.png"} }).then(r => {})
        }
    } else {
        chrome.action.setIcon({ path: { "128": "/source/intro/swiftLogo.png"} }).then(r => {})
    }
}