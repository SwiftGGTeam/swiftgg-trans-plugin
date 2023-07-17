const pluginFlag = "pluginFlag"
let shouldTranslate = null
let initialRequestMethod = "shouldTranslate"
let updateRequestMethod = "updateShouldTranslate"
const queryStatusRequestMethod = "queryStatus"
let translatedRequestMethod = "translated"
const pageSwitchedRequestMethod = "pageSwitched"
const endUpWhiteList = ["swiftui","swiftui/","sample-apps","sample-apps/","swiftui-concepts","swiftui-concepts/"];

const BrowserType = {
    chrome: Symbol("chrome"),
    safari: Symbol("safari"),
    firefox: Symbol("firefox"),
    unknown: Symbol("unknown")
}

retrieveShouldTranslate().then()

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === updateRequestMethod) {
        (async () => {
            shouldTranslate = request.data;
            const allTabs = await queryAllTabs()
            const activeTab = await queryActiveTab()
            if (activeTab.url.includes("developer.apple.com")) {
                await updateLogo(true)
            } else {
                await updateLogo(false)
            }

            for (let tab of allTabs) {
                if (tab.url.includes("developer.apple.com")) {
                    if (isCategoryPage(tab.url) || tab.id === activeTab.id) {
                        await chrome.tabs.reload(tab.id)
                    }
                }
            }

            sendResponse()
        })();

        return true
    } else if (request.type === initialRequestMethod) {
        (async () => {
            const result = await retrieveShouldTranslate()
            sendResponse({shouldTranslate: result});
        })()

        return true
    } else if (request.type === translatedRequestMethod) {
        (async () => {
            await updateLogo(true)
            sendResponse()
        })()

        return true
    }
});

function delay(i) {
    setTimeout(() => {
    }, i * 1000);
}

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    (async () => {
        const activeTab = await queryActiveTab()

        if (activeTab.url.includes("developer.apple.com")) {
            await updateLogo(true)
        } else {
            await updateLogo(false)
        }

        try {
            await chrome.tabs.sendMessage(activeTab.id, {
                message: pageSwitchedRequestMethod,
                url: activeTab.url
            })
        } catch (error) {
            console.log(error)
        }
    })()
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    (async () => {
        const tab = await chrome.tabs.get(activeInfo.tabId)
        if (tab.url && !(tab.url.includes('developer.apple.com/'))) {
            await updateLogo(false)
        } else if (tab.url && (tab.url.includes('developer.apple.com/'))) {
            console.log("active")
            await updateLogo(true)
        }
    })()
});

async function updateLogo(active) {
    if (active) {
        if (shouldTranslate) {
            if ((await queryActiveTabStatus())) {
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

async function queryAllTabs(callback) {
    return await chrome.tabs.query({})
}

async function queryActiveTab(callback) {
    return (await chrome.tabs.query({ active: true, currentWindow: true }))[0]
}

function isSupportedPage(url) {
    const currentURL = new URL(url)
    const pathArray = currentURL.pathname.split('/').filter(function (el){
        return el !== ""
    })

    return endUpWhiteList.includes(pathArray[pathArray.length-2]) || endUpWhiteList.includes(pathArray[pathArray.length-1])
}

async function retrieveShouldTranslate() {
    const result = await chrome.storage.local.get(pluginFlag)
    const previousShouldTranslate = shouldTranslate
    shouldTranslate = result.pluginFlag || false
    if (previousShouldTranslate == null) {
        if (!shouldTranslate) {
            chrome.action.setIcon({ path: { "128": "/source/intro/swiftLogo-closed.png"} }).then(r => {})
        }
    }
    return result.pluginFlag || false
}

async function queryActiveTabStatus() {
    try {
        const activeTab = await queryActiveTab()
        const response = await chrome.tabs.sendMessage(activeTab.id, {
            message: queryStatusRequestMethod,
            url: activeTab.url
        })
        return response.status
    } catch (error) {
        return false
    }
}

function isCategoryPage(url) {
    const currentURL = new URL(url)
    currentURL.hash = ""
    currentURL.search = ""
    const pathArray = currentURL.pathname.split('/');

    const lastPath = pathArray[pathArray.length - 1] || pathArray[pathArray.length - 2];
    return endUpWhiteList.includes(lastPath)
}