const isDebugMode = true;
log("Plugin start");

/**
 * @param {{zh:string}} json
 */
let json = {}

const initialRequestMethod = "shouldTranslate"
const removeTranslateRequestMethod = "removeTranslate"
const queryStatusRequestMethod = "queryStatus"
const translatedRequestMethod = "translated"
const pageSwitchedRequestMethod = "pageSwitched"
const translateCurrentRequestMethod = "translateCurrent"
const displayMethodRequestMethod = "displayMethod"
const queryDisplayMethodRequestMethod = "queryDisplayMethod"
const endUpWhiteList = ["swiftui", "swiftui/", "sample-apps", "sample-apps/", "swiftui-concepts", "swiftui-concepts/", "visionos", "visionos/"]
const categoryEndUpWhiteList = ["swiftui", "swiftui/", "sample-apps", "sample-apps/", "swiftui-concepts", "swiftui-concepts/"]
let currentTranslatedURL = null
let translated = false
const tabActiveRequestMethod = "tabActive"
let noDisturb = false
let shouldTranslate = false
let globalCurrentURL = null
let removedElement = []

log("Plugin start request flag");

async function loadJsonData(path) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'getJsonData', path: path }, response => {
            console.log(`Plugin getJsonData: ${response.data}`);
            resolve(response.data);
        });
    });
}

// 在脚本开始时调用这个函数
(async () => {
    getCurrentURL()
    let response = await chrome.runtime.sendMessage({ type: initialRequestMethod });
    if (!response) {
        // 有时候 safari 中会出现 service worker 被杀掉，这里做一个保护
        response = { shouldTranslate: true };
        console.log("Response is null, set shouldTranslate to default true");
    }
    log(`Flag status: ${response.shouldTranslate}`);
    shouldTranslate = response.shouldTranslate

    await startTranslate()
})();

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === pageSwitchedRequestMethod) {
            (async () => {
                if (request.url.includes("developer.apple.com")) {
                    const response = await chrome.runtime.sendMessage({ type: initialRequestMethod })

                    if (globalCurrentURL) {
                        if (globalCurrentURL.toString() !== getCurrentURL().toString()) {
                            shouldTranslate = response.shouldTranslate
                            translated = false

                            await startTranslate()
                        }
                    }

                    sendResponse()
                }
            })()

            return true
        } else if (request.message === queryStatusRequestMethod) {
            sendResponse({ status: translated })
        } else if (request.message === tabActiveRequestMethod) {
            (async () => {
                if (isSupportedPage(request.url) && !isCategoryPage(request.url)) {
                    if (request.shouldTranslate && !translated && !noDisturb) {
                        await injectFloat()
                    } else if (!request.shouldTranslate) {
                        removeFloatElement()
                    }
                }

                sendResponse()
            })()

            return true
        } else if (request.message === translateCurrentRequestMethod) {
            (async () => {
                shouldTranslate = true
                await startTranslate()

                sendResponse()
            })()
            return true
        } else if (request.message === removeTranslateRequestMethod) {
            removeTranslate()
            sendResponse()
        } else if (request.message === displayMethodRequestMethod) {
            (async () => {
                await changeDisplayMethod(request.data)
                sendResponse()
            })()

            return true
        }
    }
);

function waitPage() {
    // 只要页面中有 p 标签，我们就认为页面已经加载完成
    const flagElementQuery = "p";
    log("Plugin waiting");
    return new Promise((resolve) => {
        const interval = setInterval(function () {
            log("Plugin retry");
            let asyncElement = document.querySelector(flagElementQuery);
            if (asyncElement) {
                log("Element loaded");
                resolve()
                clearInterval(interval);
            }
        }, 200);
    })
}

async function fetchRelatedData(path) {
    try {
        const response = await loadJsonData(path)
        json = response
    } catch (error) {
        console.log('Error fetching data:', error);
    }
}

function checkResponse(response) {
    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }
}

function addTitleNode() {
    let title = document.querySelector("div.headline h1");
    if (!title) { return; }
    let titleText = json[title.innerText.trim()]?.zh;
    if (!titleText || titleText === "") {
        return;
    }
    let newNode = document.createElement("h3");
    [...title.attributes].forEach((a) => {
        newNode.setAttribute(a.nodeName, a.nodeValue)
    })
    let text = document.createTextNode(titleText);

    let wrapper = document.createElement("div")
    wrapper.dataset.tag = "swiftgg:wrapper"

    newNode.dataset.tag = "swiftgg:translated"
    title.dataset.tag = "swiftgg:original"

    let space = document.createElement("p")
    space.dataset.tag = "swiftgg:space"

    newNode.appendChild(text);

    let hideNewNode = newNode.cloneNode(true)
    hideNewNode.dataset.tag = "swiftgg:hide-translate"

    let parent = title.parentNode;
    parent.insertBefore(wrapper, title);
    wrapper.appendChild(title)
    wrapper.appendChild(newNode)
    wrapper.appendChild(hideNewNode)
    wrapper.appendChild(space)
}

function isInjectedElement(element) {
    // Check if the element has a "data-tag" attribute and its value is "swiftgg"
    return element.hasAttribute('data-tag') && element.getAttribute('data-tag') === 'swiftgg:translated';
}

function isHideInjectedElement(element) {
    // Check if the element has a "data-tag" attribute and its value is "swiftgg"
    return element.hasAttribute('data-tag') && element.getAttribute('data-tag') === 'swiftgg:hide-translate';
}


function isOriginalElement(element) {
    // Check if the element has a "data-tag" attribute and its value is "swiftgg"
    return element.hasAttribute('data-tag') && element.getAttribute('data-tag') === 'swiftgg:original';
}

function isWrapperElement(element) {
    // Check if the element has a "data-tag" attribute and its value is "swiftgg"
    return element.hasAttribute('data-tag') && element.getAttribute('data-tag') === 'swiftgg:wrapper';
}

function isSpaceElement(element) {
    // Check if the element has a "data-tag" attribute and its value is "swiftgg"
    return element.hasAttribute('data-tag') && element.getAttribute('data-tag') === 'swiftgg:space';
}

function appendH2Nodes() {
    let h2Nodes = document.querySelectorAll("h2");

    Array.from(h2Nodes).filter((node) => Boolean(json[node.innerText])).forEach((node) => {
        let parent = node.parentNode;
        let newNode = document.createElement("h2");
        [...node.attributes].forEach((a) => {
            newNode.setAttribute(a.nodeName, a.nodeValue)
        })
        let t = document.createTextNode(json[node.innerText].zh);

        let wrapper = document.createElement("div")
        wrapper.dataset.tag = "swiftgg:wrapper"

        newNode.dataset.tag = "swiftgg:translated"
        node.dataset.tag = "swiftgg:original"

        let space = document.createElement("p")
        space.dataset.tag = "swiftgg:space"

        newNode.appendChild(t);

        let hideNewNode = newNode.cloneNode(true)
        hideNewNode.dataset.tag = "swiftgg:hide-translate"

        parent.insertBefore(wrapper, node);
        wrapper.appendChild(node)
        wrapper.appendChild(newNode)
        wrapper.appendChild(hideNewNode)
        wrapper.appendChild(space)
    })
}

// function cloneNode() {
//   let div = document.querySelector("#introduction div.intro div.content");
//   let cloneNode = div.cloneNode(true);
//   div.append(cloneNode);
// }

function appendPNodes() {
    let pNodes = document.querySelectorAll("p");
    log(`Find ${pNodes.length} p elements to change`);
    Array.from(pNodes).filter((node) => Boolean(json[node.innerText])).forEach((node) => {
        let parent = node.parentNode;
        let newNode = document.createElement("p");
        [...node.attributes].forEach((a) => {
            newNode.setAttribute(a.nodeName, a.nodeValue)
        })
        let t = document.createTextNode(json[node.innerText].zh);

        let wrapper = document.createElement("div")
        wrapper.dataset.tag = "swiftgg:wrapper"

        newNode.dataset.tag = "swiftgg:translated"
        node.dataset.tag = "swiftgg:original"

        let space = document.createElement("p")
        space.dataset.tag = "swiftgg:space"

        newNode.appendChild(t);

        let hideNewNode = newNode.cloneNode(true)
        hideNewNode.dataset.tag = "swiftgg:hide-translate"

        parent.insertBefore(wrapper, node);
        wrapper.appendChild(node)
        wrapper.appendChild(newNode)
        wrapper.appendChild(hideNewNode)
        wrapper.appendChild(space)
    })
}

function log(message) {
    if (isDebugMode) {
        console.log('[Twine by SwiftGG]' + message)
    }
}
/**
 * 检查当前页面是否为无需翻译的首页页面，这种页面只要提示用户继续往下走就行了
 * @returns {boolean} - 如果当前页面是类别页面则返回 true，否则返回 false
 */
function isCategoryPage() {
    // TODO: 这个逻辑以后要改掉，现在是写死在插件的
    const currentURL = getCurrentURL()
    const pathArray = currentURL.pathname.split('/');
    const lastPath = pathArray[pathArray.length - 1] || pathArray[pathArray.length - 2];
    const result = categoryEndUpWhiteList.includes(lastPath);
    log(`Plugin isCategoryPage: ${result}`);
    return result;
}


function addInstructionToCategoryPage() {
    let contentDiv = document.getElementsByClassName("copy-container")[0]
    let spaceElement = document.createElement("br");
    let spaceElement2 = document.createElement("br");
    let pElement = document.createElement("p")
    pElement.classList.add("indicator")
    pElement.textContent = chrome.i18n.getMessage("is_running")
    spaceElement.dataset.tag = "swiftgg:translated"
    spaceElement2.dataset.tag = "swiftgg:translated"
    pElement.dataset.tag = "swiftgg:translated"
    contentDiv.appendChild(spaceElement)
    contentDiv.appendChild(spaceElement2)
    contentDiv.appendChild(pElement)
}



function isSupportedPage() {
    const currentURL = getCurrentURL()
    const pathArray = currentURL.pathname.split('/').filter(function (el) {
        return el !== ""
    })

    const result = endUpWhiteList.includes(pathArray[pathArray.length - 2]) || endUpWhiteList.includes(pathArray[pathArray.length - 1])
    log(`Plugin isSupportedPage: ${result}`);
    return result;
}

async function startTranslate() {
    const currentURL = getCurrentURL()

    if (currentTranslatedURL) {
        if (currentURL.toString() === currentTranslatedURL.toString()) {
            if (isCategoryPage() === false && isSupportedPage() === true) {
                chrome.runtime.sendMessage({ type: translatedRequestMethod }, () => { })
            }
            return;
        }
    }

    await translate()
}

async function translate() {
    const currentURL = getCurrentURL()
    const pathArray = currentURL.pathname.split('/');
    let path = pathArray[pathArray.length - 2] + '/' + pathArray[pathArray.length - 1];
    if (pathArray[pathArray.length - 1] === "visionos") {
        path = "visionos/visionos"
    }

    if (shouldTranslate === false) {
        return
    }

    if (isSupportedPage() === false) {
        return;
    }

    currentTranslatedURL = currentURL

    if (isCategoryPage() === false) {
        await fetchRelatedData(path)
    }

    await waitPage()

    if (isCategoryPage() === true) {
        log("in category page")
        addInstructionToCategoryPage()
    } else {
        log("Plugin Start add content");
        addTitleNode();
        appendH2Nodes();
        appendPNodes();
        translated = true
        await chrome.runtime.sendMessage({ type: translatedRequestMethod }, () => { })
    }

    removeFloatElement()

    const displayMethod = await chrome.runtime.sendMessage({ type: queryDisplayMethodRequestMethod });
    await changeDisplayMethod(displayMethod)
}

function removeTranslate() {
    rollBackRemovedElement()
    rollbackWeakenOriginal()
    rollbackAutoWeaken()

    removeTranslatedNode()

    removeWrapperNode()

    currentTranslatedURL = null
    translated = false
}

function removeWrapperNode() {
    const body = document.body;
    let allElements = [];

    // Recursively iterate through the body and its children's children
    function iterate(element) {
        allElements.push(element);

        for (const child of element.children) {
            iterate(child);
        }
    }

    iterate(body);

    for (const element of allElements) {
        if (isWrapperElement(element)) {
            for (let el of element.children) {
                element.parentNode.insertBefore(el, element)
            }

            element.remove()
        }

        if (isSpaceElement(element)) {
            element.remove()
        }
    }
}


function removeTranslatedNode() {
    const body = document.body;
    let allElements = [];

    // Recursively iterate through the body and its children's children
    function iterate(element) {
        allElements.push(element);

        for (const child of element.children) {
            iterate(child);
        }
    }

    iterate(body);

    for (const element of allElements) {
        if (isInjectedElement(element) || isHideInjectedElement(element)) {
            element.remove()
        }
    }
}

function removeOriginal() {
    removedElement = []

    const body = document.body;
    let allElements = [];

    // Recursively iterate through the body and its children's children
    function iterate(element) {
        allElements.push(element);

        for (const child of element.children) {
            iterate(child);
        }
    }

    iterate(body);

    for (const element of allElements) {
        if (isOriginalElement(element)) {
            removedElement.push({
                parent: element.parentNode,
                node: element,
                afterNode: getElementAfter(element)
            })
            element.remove()
        }
    }
}

function removeTranslated() {
    removedElement = []

    const body = document.body;
    let allElements = [];

    // Recursively iterate through the body and its children's children
    function iterate(element) {
        allElements.push(element);

        for (const child of element.children) {
            iterate(child);
        }
    }

    iterate(body);

    for (const element of allElements) {
        if (isInjectedElement(element)) {
            removedElement.push({
                parent: element.parentNode,
                node: element,
                afterNode: getElementAfter(element)
            })
            element.remove()
        }
    }
}

function weakenOriginal() {
    const body = document.body;
    let allElements = [];

    // Recursively iterate through the body and its children's children
    function iterate(element) {
        allElements.push(element);

        for (const child of element.children) {
            iterate(child);
        }
    }

    iterate(body);

    for (const element of allElements) {
        if (isOriginalElement(element)) {
            addClassAtBeginning(element, "grey-text")
        }
    }
}

function rollbackWeakenOriginal() {
    const body = document.body;
    let allElements = [];

    // Recursively iterate through the body and its children's children
    function iterate(element) {
        allElements.push(element);

        for (const child of element.children) {
            iterate(child);
        }
    }

    iterate(body);

    for (const element of allElements) {
        if (isOriginalElement(element)) {
            element.classList.remove("grey-text")
        }
    }
}

function addAutoWeaken() {
    const body = document.body;
    let allElements = [];

    // Recursively iterate through the body and its children's children
    function iterate(element) {
        allElements.push(element);

        for (const child of element.children) {
            iterate(child);
        }
    }

    iterate(body);

    for (const element of allElements) {
        if (isOriginalElement(element)) {
            element.addEventListener("mouseenter", autoWeaken, false)
            element.addEventListener("mouseleave", autoCancelWeaken, false)
        }
    }
}

function addFloatListener() {
    const body = document.body;
    let allElements = [];

    // Recursively iterate through the body and its children's children
    function iterate(element) {
        allElements.push(element);

        for (const child of element.children) {
            iterate(child);
        }
    }

    iterate(body);

    for (const element of allElements) {
        if (isWrapperElement(element)) {
            element.addEventListener("mouseenter", addFloatTranslate, false)
            element.addEventListener("mouseleave", cancelFloatTranslate, false)
        }
    }
}

function rollbackFloatListener() {
    const body = document.body;
    let allElements = [];

    // Recursively iterate through the body and its children's children
    function iterate(element) {
        allElements.push(element);

        for (const child of element.children) {
            iterate(child);
        }
    }

    iterate(body);

    for (const element of allElements) {
        if (isWrapperElement(element)) {
            element.removeEventListener("mouseenter", addFloatTranslate, false)
            element.removeEventListener("mouseleave", cancelFloatTranslate, false)
        }
    }
}

function addReplaceListener() {
    const body = document.body;
    let allElements = [];

    // Recursively iterate through the body and its children's children
    function iterate(element) {
        allElements.push(element);

        for (const child of element.children) {
            iterate(child);
        }
    }

    iterate(body);

    for (const element of allElements) {
        if (isWrapperElement(element)) {
            element.addEventListener("mouseenter", addReplaceTranslate, false)
            element.addEventListener("mouseleave", cancelReplaceTranslate, false)
        }
    }
}

function rollbackReplaceListener() {
    const body = document.body;
    let allElements = [];

    // Recursively iterate through the body and its children's children
    function iterate(element) {
        allElements.push(element);

        for (const child of element.children) {
            iterate(child);
        }
    }

    iterate(body);

    for (const element of allElements) {
        if (isWrapperElement(element)) {
            element.removeEventListener("mouseenter", addReplaceTranslate, false)
            element.removeEventListener("mouseleave", cancelReplaceTranslate, false)
        }
    }
}

function hideAllTranslation() {
    const body = document.body;
    let allElements = [];

    // Recursively iterate through the body and its children's children
    function iterate(element) {
        allElements.push(element);

        for (const child of element.children) {
            iterate(child);
        }
    }

    iterate(body);

    for (const element of allElements) {
        if (isHideInjectedElement(element)) {
            element.classList.add("swiftgg-hide")
        }
    }
}

function rollbackAutoWeaken() {
    const body = document.body;
    let allElements = [];

    // Recursively iterate through the body and its children's children
    function iterate(element) {
        allElements.push(element);

        for (const child of element.children) {
            iterate(child);
        }
    }

    iterate(body);

    for (const element of allElements) {
        if (isOriginalElement(element)) {
            element.removeEventListener("mouseenter", autoWeaken, false)
            element.removeEventListener("mouseleave", autoCancelWeaken, false)
        }
    }
}

function autoWeaken(event) {
    event.currentTarget.classList.remove("grey-text")
}

function autoCancelWeaken(event) {
    addClassAtBeginning(event.currentTarget, "grey-text")
}

function addFloatTranslate(event) {
    event.currentTarget.children[1].classList.remove("swiftgg-hide")
}

function cancelFloatTranslate(event) {
    event.currentTarget.children[1].classList.add("swiftgg-hide")
}

function addReplaceTranslate(event) {
    const first = event.currentTarget.children[0]
    const second = event.currentTarget.children[1]
    const temp = first.textContent
    first.textContent = second.textContent
    second.textContent = temp
}

function cancelReplaceTranslate(event) {
    const first = event.currentTarget.children[0]
    const second = event.currentTarget.children[1]
    const temp = second.textContent
    second.textContent = first.textContent
    first.textContent = temp
}

function addClassAtBeginning(element, newClass) {
    const currentClasses = Array.from(element.classList);
    currentClasses.unshift(newClass);
    element.className = currentClasses.join(' ');
}

function getElementAfter(element) {
    const parent = element.parentNode;
    let nextElement = parent.firstChild;
    while (nextElement !== null && nextElement !== element) {
        nextElement = nextElement.nextSibling;
    }

    if (nextElement) {
        return nextElement.nextSibling;
    } else {
        return null
    }
}

function rollBackRemovedElement() {
    for (let element of removedElement.reverse()) {
        if (element.afterNode) {
            element.parent.insertBefore(element.node, element.afterNode)
        } else {
            element.parent.appendChild(element.node)
        }
    }

    removedElement = []
}

function getCurrentURL() {
    const currentURL = new URL(document.URL)
    currentURL.hash = ""
    currentURL.search = ""

    globalCurrentURL = currentURL

    return currentURL
}

async function injectFloat() {
    if (elementExists("swiftgg-float")) {
        return
    }

    const response = await fetch(chrome.runtime.getURL("float.html"))
    const floatContent = await response.text()
    console.log(floatContent)
    const container = document.createElement('div')
    container.innerHTML = floatContent
    const bodyElement = document.body
    bodyElement.insertBefore(container, bodyElement.firstChild)

    setFloatColorSchema()
    addListenerToFloatElement()
}

function elementExists(elementId) {
    const element = document.getElementById(elementId);
    return !!element;
}

function directRemoveElement(elementId) {
    const element = document.getElementById(elementId);
    element.remove()
}

function addListenerToFloatElement() {
    const cancelButton = document.getElementById("swiftgg-float-cancel")

    cancelButton.addEventListener("mouseenter", function () {
        if (checkColorSchema()) {
            cancelButton.style.backgroundColor = "#292929"
        } else {
            cancelButton.style.backgroundColor = "#F0F0F0"
        }
    }, false)

    cancelButton.addEventListener("mouseleave", function () {
        if (checkColorSchema()) {
            cancelButton.style.backgroundColor = "#1F1F1F"
        } else {
            cancelButton.style.backgroundColor = "#FAFAFA"
        }
    }, false)

    cancelButton.addEventListener("mousedown", function () {
        if (checkColorSchema()) {
            cancelButton.style.backgroundColor = "#333333"
        } else {
            cancelButton.style.backgroundColor = "#E6E6E6"
        }
    })

    cancelButton.addEventListener("mouseup", function () {
        if (checkColorSchema()) {
            cancelButton.style.backgroundColor = "#292929"
        } else {
            cancelButton.style.backgroundColor = "#F0F0F0"
        }
    })

    cancelButton.onclick = floatCancel

    const translateButton = document.getElementById("swiftgg-float-translate")

    translateButton.addEventListener("mouseenter", function () {
        if (checkColorSchema()) {
            translateButton.style.backgroundColor = "#212629"
        } else {
            translateButton.style.backgroundColor = "#D9F2FF"
        }
    }, false)

    translateButton.addEventListener("mouseleave", function () {
        if (checkColorSchema()) {
            translateButton.style.backgroundColor = "#1F1F1F"
        } else {
            translateButton.style.backgroundColor = "#FAFAFA"
        }
    }, false)

    translateButton.addEventListener("mousedown", function () {
        if (checkColorSchema()) {
            translateButton.style.backgroundColor = "#223038"
        } else {
            translateButton.style.backgroundColor = "#B8E0F5"
        }
    })

    translateButton.addEventListener("mouseup", function () {
        if (checkColorSchema()) {
            translateButton.style.backgroundColor = "#212629"
        } else {
            translateButton.style.backgroundColor = "#D9F2FF"
        }
    })

    translateButton.onclick = floatTranslate

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (e.matches) {
            applyDarkSchemaToFloat()
        } else {
            applyLightSchemaToFloat()
        }
    });
}

function floatCancel() {
    const floatElement = document.getElementById("swiftgg-float")
    noDisturb = true
    removeFadeOut(floatElement, 600)
}

function floatTranslate() {
    const floatElement = document.getElementById("swiftgg-float")
    removeFadeOut(floatElement, 600);
    shouldTranslate = true;
    translated = true;

    (async () => {
        await startTranslate()
    })()
}
function removeFadeOut(el, speed) {
    let seconds = speed / 1000;
    el.style.transition = "opacity " + seconds + "s ease";

    el.style.opacity = "0";
    setTimeout(function () {
        el.remove()
    }, speed);
}

function applyLightSchemaToFloat() {
    const swiftggFloatDiv = document.getElementById("swiftgg-float")
    if (swiftggFloatDiv) swiftggFloatDiv.style.backgroundColor = "#FAFAFA"
    if (swiftggFloatDiv) swiftggFloatDiv.style.setProperty("box-shadow", "0 0 15px  rgba(0,0,0,0.10)")
    if (swiftggFloatDiv) swiftggFloatDiv.style.setProperty("-moz-box-shadow", "0 0 15px  rgba(0,0,0,0.10)")
    if (swiftggFloatDiv) swiftggFloatDiv.style.setProperty("-webkit-box-shadow", "0 0 15px  rgba(0,0,0,0.10)")
    if (swiftggFloatDiv) swiftggFloatDiv.style.setProperty("-o-box-shadow", "0 0 15px  rgba(0,0,0,0.10)")
    const swiftggFloatHeaderText = document.getElementById("swiftgg-float-header-text")
    if (swiftggFloatHeaderText) swiftggFloatHeaderText.style.color = "#000000"
    const swiftggFloatBodyText = document.getElementById("swiftgg-float-body-text")
    if (swiftggFloatBodyText) swiftggFloatBodyText.style.color = "#595959"
    const swiftggFloatCancelButton = document.getElementById("swiftgg-float-cancel")
    if (swiftggFloatCancelButton) swiftggFloatCancelButton.style.backgroundColor = "#FAFAFA"
    if (swiftggFloatCancelButton) swiftggFloatCancelButton.style.border = "2px solid #CCCCCC"
    const swiftggFloatCancelText = document.getElementById("swiftgg-float-cancel-text")
    if (swiftggFloatCancelText) swiftggFloatCancelText.style.color = "#A6A6A6"
    const swiftggFloatTranslateButton = document.getElementById("swiftgg-float-translate")
    if (swiftggFloatTranslateButton) swiftggFloatTranslateButton.style.backgroundColor = "#FAFAFA"
    if (swiftggFloatTranslateButton) swiftggFloatTranslateButton.style.border = "2px solid #00A0F0"
    const swiftggFloatTranslateText = document.getElementById("swiftgg-float-translate-text")
    if (swiftggFloatTranslateText) swiftggFloatTranslateText.style.color = "#00AAFF"
}

function applyDarkSchemaToFloat() {
    const swiftggFloatDiv = document.getElementById("swiftgg-float")
    if (swiftggFloatDiv) swiftggFloatDiv.style.backgroundColor = "#1F1F1F"
    const swiftggFloatHeaderText = document.getElementById("swiftgg-float-header-text")
    if (swiftggFloatHeaderText) swiftggFloatHeaderText.style.color = "#FFFFFF"
    const swiftggFloatBodyText = document.getElementById("swiftgg-float-body-text")
    if (swiftggFloatBodyText) swiftggFloatBodyText.style.color = "#CCCCCC"
    const swiftggFloatCancelButton = document.getElementById("swiftgg-float-cancel")
    if (swiftggFloatCancelButton) swiftggFloatCancelButton.style.backgroundColor = "#1F1F1F"
    if (swiftggFloatCancelButton) swiftggFloatCancelButton.style.border = "2px solid #404040"
    const swiftggFloatCancelText = document.getElementById("swiftgg-float-cancel-text")
    if (swiftggFloatCancelText) swiftggFloatCancelText.style.color = "#878787"
    const swiftggFloatTranslateButton = document.getElementById("swiftgg-float-translate")
    if (swiftggFloatTranslateButton) swiftggFloatTranslateButton.style.backgroundColor = "#1F1F1F"
    if (swiftggFloatTranslateButton) swiftggFloatTranslateButton.style.border = "2px solid #006FA6"
    const swiftggFloatTranslateText = document.getElementById("swiftgg-float-translate-text")
    if (swiftggFloatTranslateText) swiftggFloatTranslateText.style.color = "#01AAFF"
}

function setFloatColorSchema() {
    if (checkColorSchema()) {
        applyDarkSchemaToFloat()
    } else {
        applyLightSchemaToFloat()
    }
}

function checkColorSchema() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
}

function removeFloatElement() {
    if (elementExists("swiftgg-float")) {
        directRemoveElement("swiftgg-float")
    }
}

async function changeDisplayMethod(method) {
    rollBackRemovedElement()
    rollbackWeakenOriginal()
    rollbackAutoWeaken()
    rollbackFloatListener()
    rollbackReplaceListener()

    hideAllTranslation()

    if (method === "auto") {
        weakenOriginal()
        addAutoWeaken()
    } else if (method === "chinese") {
        removeOriginal()
    } else if (method === "highlight") {

    } else if (method === "weaken") {
        weakenOriginal()
    } else if (method === "float") {
        removeTranslated()
        addFloatListener()
    } else if (method === "replace") {
        removeTranslated()
        addReplaceListener()
    } else if (method === "original") {
        removeTranslated()
    }
}
