const pluginFlag = "pluginFlag"
let autoTranslate = null
let initialRequestMethod = "shouldTranslate"
let updateRequestMethod = "updateShouldTranslate"
const removeTranslateRequestMethod = "removeTranslate"
const queryStatusRequestMethod = "queryStatus"
const tabActiveRequestMethod = "tabActive"
const translatedRequestMethod = "translated"
const pageSwitchedRequestMethod = "pageSwitched"
const queryCurrentRequestMethod = "queryTranslateCurrent"
const updateCurrentRequestMethod = "updateTranslateCurrent"
const translateCurrentRequestMethod = "translateCurrent"
const endUpWhiteList = ["swiftui","swiftui/","sample-apps","sample-apps/","swiftui-concepts","swiftui-concepts/"];
let globalActiveTab = null

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
            autoTranslate = request.data;
            const allTabs = await queryAllTabs()
            await updateLogo()

            for (let tab of allTabs) {
                if (tab.url.includes("developer.apple.com")) {
                    if (isCategoryPage(tab.url)) {
                        await requestTranslate(request.data, tab)
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
            await updateLogo()
            sendResponse()
        })()

        return true
    } else if (request.type === queryCurrentRequestMethod) {
        (async () => {
            sendResponse({status: await queryActiveTabStatus()})
        })()

        return true
    } else if (request.type === updateCurrentRequestMethod) {
        (async () => {
            const activeTab = await queryActiveTab()

            await requestTranslate(request.data, activeTab)

            await updateLogo()

            sendResponse()
        })();
    }
});

chrome.tabs.onUpdated.addListener(function() {
    (async () => {
        const previousActiveTab = globalActiveTab
        const activeTab = await queryActiveTab()

        await updateLogo()

        if (previousActiveTab && activeTab && previousActiveTab.url === activeTab.url) {
            return
        }

        try {
            await chrome.tabs.sendMessage(activeTab.id, {
                message: pageSwitchedRequestMethod,
                url: activeTab.url
            })
        } catch (error) {
            console.log(error)
        }

        await updateLogo()
    })()
});

chrome.tabs.onActivated.addListener(function() {
    (async () => {
        const activeTab = await queryActiveTab()

        await updateLogo()

        try {
            if (activeTab.id && activeTab.url.includes("developer.apple.com")) {
                await chrome.tabs.sendMessage(activeTab.id, {
                    message: tabActiveRequestMethod,
                    url: activeTab.url,
                    shouldTranslate: autoTranslate,
                })
            }
        } catch (error) {
            console.log(error)
        }

        await updateLogo()
    })()
});

async function requestTranslate(translate, tab) {
    if (translate) {
        try {
            await chrome.tabs.sendMessage(tab.id, {
                message: translateCurrentRequestMethod,
                url: tab.url
            })
        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            await chrome.tabs.sendMessage(tab.id, {
                message: removeTranslateRequestMethod,
                url: tab.url
            })
        } catch (error) {
            console.log(error)
        }
    }
}

async function updateLogo() {
    const activeTab = await queryActiveTab()

    if (activeTab) {} else return

    if (autoTranslate) {
        if (activeTab.url.includes("developer.apple.com")) {
            if (isSupportedPage(activeTab.url.toString()) && !isCategoryPage(activeTab.url.toString())) {
                if (await queryActiveTabStatus()) {
                    await setIcon("/source/intro/swiftLogo-translating.png")
                } else {
                    await setIcon("/source/intro/swiftLogo-translating-pause.png")
                }
            } else {
                await setIcon("/source/intro/swiftLogo-running.png")
            }
        } else {
            await setIcon("/source/intro/swiftLogo.png")
        }
    } else {
        if (activeTab.url.includes("developer.apple.com")) {
            if (await queryActiveTabStatus()) {
                await setIcon("/source/intro/swiftLogo-translating.png")
            } else {
                await setIcon("/source/intro/swiftLogo-closed.png")
            }
        } else {
            await setIcon("/source/intro/swiftLogo-closed.png")
        }
    }
}

function detectBrowser() {
    const isChrome = typeof chrome !== 'undefined'
    const isFirefox = typeof browser !== 'undefined'
    const isSafari = typeof safari !== 'undefined'

    if (isSafari) {
        return BrowserType.safari
    } else if (isChrome) {
        return BrowserType.chrome
    } else if (isFirefox) {
        return BrowserType.firefox
    } else {
        return BrowserType.unknown
    }
}

async function setIcon(path) {
    switch (detectBrowser()) {
        case BrowserType.chrome:
            await chrome.action.setIcon({ path: { "128": path} })
            break
        case BrowserType.firefox:
            await browser.browserAction.setIcon({ path: { "128": path} })
            break
        case BrowserType.safari:
            await browser.browserAction.setIcon({ path: { "128": path} })
            break
        case BrowserType.unknown:
            break
    }
}

async function queryAllTabs() {
    return await chrome.tabs.query({})
}

async function queryActiveTab() {
    const activeTab = (await chrome.tabs.query({ active: true, currentWindow: true }))[0]
    if (activeTab) {
        globalActiveTab = activeTab
    }

    return activeTab || globalActiveTab
}

async function retrieveShouldTranslate() {
    if (autoTranslate) {
        return autoTranslate
    }
    const result = await chrome.storage.local.get(pluginFlag)
    const previousShouldTranslate = autoTranslate
    autoTranslate = result.pluginFlag || false
    if (previousShouldTranslate == null) {
        if (!autoTranslate) {
            await chrome.action.setIcon({ path: { "128": "/source/intro/swiftLogo-closed.png"} })
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

function isSupportedPage(url) {
    const currentURL = new URL(url)
    currentURL.hash = ""
    currentURL.search = ""

    const pathArray = currentURL.pathname.split('/').filter(function (el){
        return el !== ""
    })

    return endUpWhiteList.includes(pathArray[pathArray.length-2]) || endUpWhiteList.includes(pathArray[pathArray.length-1])
}
