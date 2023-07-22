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
const endUpWhiteList = ["swiftui","swiftui/","sample-apps","sample-apps/","swiftui-concepts","swiftui-concepts/"];
let currentTranslatedURL = null
let translated = false
const tabActiveRequestMethod = "tabActive"
let noDisturb = false
let shouldTranslate = false

log("Plugin start request flag");

(async () => {
  const response = await chrome.runtime.sendMessage({type: initialRequestMethod});
  log(`Flag status: ${response.shouldTranslate}`);
  shouldTranslate = response.shouldTranslate

  await startTranslate()

  log("Plugin wait page loaded");
})()

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message === pageSwitchedRequestMethod) {
        (async () => {
          if (request.url.includes("developer.apple.com")) {
            const response = await chrome.runtime.sendMessage({type: initialRequestMethod})
            shouldTranslate = response.shouldTranslate
            await startTranslate()

            sendResponse()
          }
        })()

        return true
      } else if (request.message === queryStatusRequestMethod) {
        sendResponse({status: translated})
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
      }
    }
);

function waitPage() {
  const flagElement = isCategoryPage() ? ".title" : "div.headline h1";
  log(`Plugin ${flagElement}`);
  log("Plugin waiting");
  return new Promise((resolve) => {
    const interval = setInterval(function() {
      log("Plugin retry");
      let asyncElement = document.querySelector(flagElement);
      if (asyncElement) {
        log("Element loaded");
        resolve()
        clearInterval(interval);
      }
    }, 200);
  })
}

async function fetchRelatedData(url) {
  try {
    const response = await fetch(url)
    checkResponse(response)
    json = await response.json()
  } catch (error) {
    console.log('Error fetching data:', error);
  }
}

function checkResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }
}

function updateAHerfToAbsolutURL() {
  let relativeLinks = document.querySelectorAll('a[href^="/"]');
  log("Plugin start update herf");
  for (let i = 0; i < relativeLinks.length; i++) {
    let link = relativeLinks[i];
    let relativePath = link.getAttribute('href');
    let absolutePath = `https://developer.apple.com${relativePath}`;
    log(absolutePath);
    link.setAttribute('href', absolutePath);
    link.setAttribute('target', '_blank');
  }
}

function addTitleNode() {
  let title = document.querySelector("div.headline h1");
  let titleText = json[title.innerText.trim()].zh;
  if (!titleText || titleText === "") {
    return;
  }
  let newNode = document.createElement("h3");
  let text = document.createTextNode(titleText);
  newNode.dataset.tag = "swiftgg"
  newNode.appendChild(text);
  let parent = title.parentElement;
  parent.insertBefore(newNode, title);
}

function isInjectedElement(element) {
  // Check if the element has a "data-tag" attribute and its value is "swiftgg"
  return element.hasAttribute('data-tag') && element.getAttribute('data-tag') === 'swiftgg';
}

function appendH2Nodes() {
  let h2Nodes = document.querySelectorAll("h2");

  Array.from(h2Nodes).filter((node) => Boolean(json[node.innerText])).forEach((node) => {
    let parent = node.parentElement;
    let newNode = document.createElement("h2");
    let t = document.createTextNode(json[node.innerText].zh);
    newNode.dataset.tag = "swiftgg"
    newNode.appendChild(t);
    parent.insertBefore(newNode, node);
  })
}

// function cloneNode() {
//   let div = document.querySelector("#introduction div.intro div.content");
//   let cloneNode = div.cloneNode(true);
//   div.append(cloneNode);
// }

function appendPNodes() {
  let pNodes = document.querySelectorAll("p");
  Array.from(pNodes).filter((node) => Boolean(json[node.innerText])).forEach((node) => {
    let parent = node.parentElement;
    let newNode = document.createElement("p");
    let t = document.createTextNode(json[node.innerText].zh);
    newNode.dataset.tag = "swiftgg"
    newNode.appendChild(t);
    parent.insertBefore(newNode, node);
  })
}

function log(message) {
  if (isDebugMode) {
    console.log(message)
  }
}

function isCategoryPage() {
  const currentURL = getCurrentURL()
  const pathArray = currentURL.pathname.split('/');

  const lastPath = pathArray[pathArray.length - 1] || pathArray[pathArray.length - 2];
  return endUpWhiteList.includes(lastPath)
}

function addInstructionToCategoryPage() {
  let contentDiv = document.getElementsByClassName("copy-container")[0]
  let spaceElement = document.createElement("br");
  let spaceElement2 = document.createElement("br");
  let pElement = document.createElement("p")
  pElement.classList.add("indicator")
  pElement.textContent = "⬆️ SwiftGG 正在运行，请点击上方按钮开始学习 ⬆️"
  spaceElement.dataset.tag = "swiftgg"
  spaceElement2.dataset.tag = "swiftgg"
  pElement.dataset.tag = "swiftgg"
  contentDiv.appendChild(spaceElement)
  contentDiv.appendChild(spaceElement2)
  contentDiv.appendChild(pElement)
}



function isSupportedPage() {
  const currentURL = getCurrentURL()
  const pathArray = currentURL.pathname.split('/').filter(function (el){
    return el !== ""
  })

  return endUpWhiteList.includes(pathArray[pathArray.length-2]) || endUpWhiteList.includes(pathArray[pathArray.length-1])
}

async function startTranslate() {
  const currentURL = getCurrentURL()

  if (currentTranslatedURL) {
    if (currentURL.toString() === currentTranslatedURL.toString()) {
      if (isCategoryPage() === false && isSupportedPage() === true) {
        chrome.runtime.sendMessage({type: translatedRequestMethod}, () => {})
      }
      return;
    }
  }

  await translate()
}

async function translate() {
  const currentURL = getCurrentURL()
  const pathArray = currentURL.pathname.split('/');
  const baseURL = "https://api.swift.gg/content/";
  const url = baseURL + pathArray[pathArray.length-2] + '/' + pathArray[pathArray.length-1];

  if (shouldTranslate === false) {
    return
  }

  if (isSupportedPage() === false) {
    return;
  }

  currentTranslatedURL = currentURL

  if (isCategoryPage() === false) {
    await fetchRelatedData(url)
  }

  await waitPage()

  if (isCategoryPage() === true) {
    updateAHerfToAbsolutURL()
    log("in category page")
    addInstructionToCategoryPage()
  } else {
    log("Plugin Start add content");
    updateAHerfToAbsolutURL()
    addTitleNode();
    appendH2Nodes();
    appendPNodes();
    translated = true
    await chrome.runtime.sendMessage({type: translatedRequestMethod}, () => {})
  }

  removeFloatElement()
}

function removeTranslate() {
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
      element.remove()
    }
  }

  currentTranslatedURL = null
  translated = false
}

function getCurrentURL() {
  const currentURL = new URL(document.URL)
  currentURL.hash = ""
  currentURL.search = ""
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

  cancelButton.addEventListener("mouseenter", function() {
    if (checkColorSchema()) {
      cancelButton.style.backgroundColor = "#292929"
    } else {
      cancelButton.style.backgroundColor = "#F0F0F0"
    }
  }, false)

  cancelButton.addEventListener("mouseleave", function() {
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

  translateButton.addEventListener("mouseenter", function()  {
    if (checkColorSchema()) {
      translateButton.style.backgroundColor = "#212629"
    } else {
      translateButton.style.backgroundColor = "#D9F2FF"
    }
  }, false)

  translateButton.addEventListener("mouseleave", function() {
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

  (async () => {
    await startTranslate()
  })()
}
function removeFadeOut(el, speed) {
  let seconds = speed/1000;
  el.style.transition = "opacity "+seconds+"s ease";

  el.style.opacity = "0";
  setTimeout(function() {
    el.parentNode.removeChild(el);
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