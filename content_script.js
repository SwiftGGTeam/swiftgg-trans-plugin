const isDebugMode = true;
log("Plugin start");
var json = {}
const initialRequestMethod = "shouldTranslate"
const queryStatusRequestMethod = "queryStatus"
const translatedRequestMethod = "translated"
const pageSwitchedRequestMethod = "pageSwitched"
const endUpWhiteList = ["swiftui","swiftui/","sample-apps","sample-apps/","swiftui-concepts","swiftui-concepts/"];
let currentTranslatedURL = null
let translated = false
const tabActiveRequestMethod = "tacActive"
let noDisturb = false

log("Plugin start request flag");

(async () => {
  const response = await chrome.runtime.sendMessage({type: initialRequestMethod});
  log(`Flag status: ${response.shouldTranslate}`);

  await startTranslate(response.shouldTranslate)

  log("Plugin wait page loaded");
})()

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message === pageSwitchedRequestMethod) {
        (async () => {
          if (request.url.includes("developer.apple.com")) {
            const response = await chrome.runtime.sendMessage({type: initialRequestMethod})
            await tabURLUpdated(response.shouldTranslate)

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
              if (elementExists("swiftgg-float")) {
                directRemoveElement("swiftgg-float")
              }
            }
          }

          sendResponse()
        })()

        return true
      }
    }
);

function waitPage() {
  const flagElement = isCategoryPage() ? ".title" : "div.headline h1";
  log(`Plugin ${flagElement}`);
  log("Plugin waiting");
  return new Promise((resolve, reject) => {
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
  var title = document.querySelector("div.headline h1");
  let titleText = json[title.innerText.trim()].zh;
  if (!titleText || titleText === "") {
    return;
  }
  var newNode = document.createElement("h3");
  var text = document.createTextNode(titleText);
  newNode.appendChild(text);
  var parent = title.parentElement;
  parent.insertBefore(newNode, title);
}

function appendH2Nodes() {
  let h2Nodes = document.querySelectorAll("h2");

  Array.from(h2Nodes).filter((node) => Boolean(json[node.innerText])).forEach((node) => {
    var parent = node.parentElement;
    var newNode = document.createElement("h2");
    var t = document.createTextNode(json[node.innerText].zh);
    newNode.appendChild(t);
    parent.insertBefore(newNode, node);
  })
}

function cloneNode() {
  var div = document.querySelector("#introduction div.intro div.content");
  var cloneNode = div.cloneNode(true);
  div.append(cloneNode);
}

function appendPNodes() {
  var pNodes = document.querySelectorAll("p");
  Array.from(pNodes).filter((node) => Boolean(json[node.innerText])).forEach((node) => {
    var parent = node.parentElement;
    var newNode = document.createElement("p");
    var t = document.createTextNode(json[node.innerText].zh);
    newNode.appendChild(t);
    parent.insertBefore(newNode, node);
  })
}

function insertAfter(newElement, targetElement) {
  var parent = targetElement.parentElement;
  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibline);
  }
}

function delay(i) {
  setTimeout(() => {
    console.log(i);
  }, i * 1000);
}

function log(message) {
  if (isDebugMode) {
    console.log(message)
  }
}

function isCategoryPage() {
  const currentURL = getCurrentURL()
  const pathArray = currentURL.pathname.split('/');
  const baseURL = "https://api.swift.gg/content/";
  const url = baseURL + pathArray[pathArray.length-2] + '/' + pathArray[pathArray.length-1];

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

async function tabURLUpdated(shouldTranslate) {
  const currentURL = getCurrentURL()

  if (currentTranslatedURL) {
    if (currentURL.toString() === currentTranslatedURL.toString()) {
      if (isCategoryPage() === false && isSupportedPage() === true) {
        chrome.runtime.sendMessage({type: translatedRequestMethod}, (response) => {})
      }
      return;
    }
  }

  await startTranslate(shouldTranslate)
}

async function startTranslate(shouldTranslate) {
  const currentURL = getCurrentURL()
  currentTranslatedURL = currentURL
  const pathArray = currentURL.pathname.split('/');
  const baseURL = "https://api.swift.gg/content/";
  const url = baseURL + pathArray[pathArray.length-2] + '/' + pathArray[pathArray.length-1];

  if (shouldTranslate === false) {
    return
  }

  if (isSupportedPage() === false) {
    return;
  }

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
    await chrome.runtime.sendMessage({type: translatedRequestMethod}, (response) => {})
  }
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

  cancelButton.addEventListener("mouseenter", function( event ) {
    cancelButton.style.backgroundColor = "#292929"
  }, false)

  cancelButton.addEventListener("mouseleave", function( event ) {
    cancelButton.style.backgroundColor = "#1F1F1F"
  }, false)

  cancelButton.addEventListener("mousedown", function (event) {
    cancelButton.style.backgroundColor = "#333333"
  })

  cancelButton.addEventListener("mouseup", function (event) {
    cancelButton.style.backgroundColor = "#292929"
  })

  cancelButton.onclick = floatCancel

  const translateButton = document.getElementById("swiftgg-float-translate")

  translateButton.addEventListener("mouseenter", function( event ) {
    translateButton.style.backgroundColor = "#212629"
  }, false)

  translateButton.addEventListener("mouseleave", function( event ) {
    translateButton.style.backgroundColor = "#1F1F1F"
  }, false)

  translateButton.addEventListener("mousedown", function (event) {
    translateButton.style.backgroundColor = "#223038"
  })

  translateButton.addEventListener("mouseup", function (event) {
    translateButton.style.backgroundColor = "#212629"
  })

  translateButton.onclick = floatTranslate
}

function floatCancel() {
  const floatElement = document.getElementById("swiftgg-float")
  noDisturb = true
  removeFadeOut(floatElement, 600)
}

function floatTranslate() {
  const floatElement = document.getElementById("swiftgg-float")
  removeFadeOut(floatElement, 600);

  (async () => {
    await startTranslate(true)
  })()
}
function removeFadeOut(el, speed) {
  let seconds = speed/1000;
  el.style.transition = "opacity "+seconds+"s ease";

  el.style.opacity = 0;
  setTimeout(function() {
    el.parentNode.removeChild(el);
  }, speed);
}
