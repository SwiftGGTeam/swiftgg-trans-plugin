const pluginFlag = "pluginFlag"
let shouldTranslate = false
let initialRequestMethod = "shouldTranslate"
let updateRequestMethod = "updateShouldTranslate"
let translatedRequestMethod = "translated"
const reTranslatedRequestMethod = "reTranslated"
var currentTranslatedPage = [];
var currentTabID = 0
var previousTabID = 0
const pageSwitchedRequestMethod = "pageSwitched"
let refreshRequested = false

const BrowserType = {
    chrome: Symbol("chrome"),
    safari: Symbol("safari"),
    firefox: Symbol("firefox"),
    unknown: Symbol("unknown")
}

setTimeout(() => {
    chrome.storage.local.get(pluginFlag, (result) => {
        shouldTranslate = result.pluginFlag || false
        if (!shouldTranslate) {
            chrome.action.setIcon({ path: { "128": "/source/intro/swiftLogo-closed.png"} }).then(r => {})
        }
    });

}, 1)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === updateRequestMethod) {
        shouldTranslate = request.data;
        currentTranslatedPage = []
        currentTabID = 0
        refreshRequested = true
        chrome.tabs.query({}, function (allTabs) {
           chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
               const activeTab = tabs[0]
               updateTabId(activeTab.id)
               if (activeTab.url.includes("developer.apple.com")) {
                   updateLogo(true)
               } else {
                   updateLogo(false)
               }

               let running = []
               for (let tab of allTabs) {
                   if (tab.url.includes("developer.apple.com")) {
                       running.push(chrome.tabs.reload(tab.id))
                   }
               }

               Promise.allSettled(running).then()
           })
        });

        return true
    } else if (request.type === initialRequestMethod) {
        sendResponse({shouldTranslate: shouldTranslate});
    } else if (request.type === translatedRequestMethod) {
        currentTranslatedPage.push(sender.tab.id)
        updateLogo(true)
        return true
    }
});

function delay(i) {
  setTimeout(() => {
  }, i * 1000);
}

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    if (refreshRequested) {
        refreshRequested = false
        return true
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0]
        updateTabId(activeTab.id)
        currentTranslatedPage = removeItemAll(currentTranslatedPage, previousTabID)
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
            currentTranslatedPage = removeItemAll(currentTranslatedPage, currentTabID)
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
            if (currentTranslatedPage.includes(currentTabID)) {
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