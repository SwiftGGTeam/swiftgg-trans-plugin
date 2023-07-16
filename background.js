const pluginFlag = "pluginFlag"
var shouldTranslate = false
let initialRequestMethod = "shouldTranslate"
let updateRequestMethod = "updateShouldTranslate"
let reloadRequestMethod = "reloadShouldTranslate"
let startTranslateRequestMethod = "startTranslate"
var currentTranslatingPage = [];
var currentTabID = 0
var previousTabID = 0
const pageSwitchedRequestMethod = "pageSwitched"

chrome.storage.local.get(pluginFlag, (result) => {
    shouldTranslate = result.pluginFlag || false
    if (!shouldTranslate) {
        chrome.action.setIcon({ path: { "128": "/source/intro/swiftLogo-closed.png"} }).then(r => {})
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === updateRequestMethod) {
        shouldTranslate = request.data;
        currentTranslatingPage = []
        currentTabID = 0
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
    } else if (request.type === initialRequestMethod) {
        sendResponse({shouldTranslate: shouldTranslate});
    } else if (request.type === startTranslateRequestMethod) {
        currentTranslatingPage.push(sender.tab.id)
        updateLogo(true)
    }
});

function delay(i) {
  setTimeout(() => {
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

        chrome.tabs.sendMessage( tabId, {
            message: pageSwitchedRequestMethod,
            url: activeTab.url
        }).then()
    });

    return true
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
                setIcon("/source/intro/swiftLogo-translating.png")
            } else {
                setIcon("/source/intro/swiftLogo-running.png")
            }
        } else {
            setIcon("/source/intro/swiftLogo-closed.png")
        }
    } else {
        if (shouldTranslate) {
            setIcon("/source/intro/swiftLogo.png")
        } else {
            setIcon("/source/intro/swiftLogo-closed.png")
        }
    }
}

const BrowserType = {
    chrome: Symbol("chrome"),
    safari: Symbol("safari"),
    firefox: Symbol("firefox"),
    unknown: Symbol("unknown")
}

function detectBrowser() {
    const isChrome = typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined';
    const isFirefox = typeof browser !== 'undefined' && typeof browser.runtime !== 'undefined';
    const isSafari = typeof safari !== 'undefined' && typeof safari.extension !== 'undefined';

    if (isChrome) {
        return BrowserType.chrome
    } else if (isFirefox) {
        return BrowserType.firefox
    } else if (isSafari) {
        return BrowserType.safari
    } else {
        return BrowserType.unknown
    }
}

function setIcon(path) {
    switch (detectBrowser()) {
        case BrowserType.chrome:
            chrome.action.setIcon({ path: { "128": path} }).then(r => {})
            break
        case BrowserType.firefox:
            browser.browserAction.setIcon({ path: { "128": path} }).then()
            break
        case BrowserType.safari:
            browser.browserAction.setIcon({ path: { "128": path} }).then()
            break
        case BrowserType.unknown:
            break
    }
}