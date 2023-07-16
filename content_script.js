const isDebugMode = true;
log("Plugin start");
var json = {}
const initialRequestMethod = "shouldTranslate"
const updateRequestMethod = "updateShouldTranslate"
const reloadRequestMethod = "reloadShouldTranslate"
const translatedRequestMethod = "translated"
const pageSwitchedRequestMethod = "pageSwitched"
const endUpWhiteList = ["swiftui","swiftui/","sample-apps","sample-apps/","swiftui-concepts","swiftui-concepts/"];
var previousGlobalUrl = {}
var globalUrl = {}

log("Plugin start request flag");
chrome.runtime.sendMessage({type: initialRequestMethod}, (response) => {
  log(`Flag status: ${response.shouldTranslate}`);

  startTranslate(response.shouldTranslate)

  log("Plugin wait page loaded");

});

function waitPage(callback) {
  const flagElement = isCategoryPage() ? ".title" : "div.headline h1";
  log(`Plugin ${flagElement}`);
  log("Plugin waiting");
  let interval = setInterval(function() {
    log("Plugin retry");
    let asyncElement = document.querySelector(flagElement);
      if (asyncElement) {
        clearInterval(interval);
        log("Element loaded");
        callback()
      }
  }, 200);
}

function waitJsonLoaded(callback) {
    log("Will wait Json loaded");
    var maxCheckCount = 1000
    var currentCheckCount = 0
    const interval = setInterval(() => {
      log(`retry times: ${currentCheckCount}`);
      if (currentCheckCount >= maxCheckCount) {
        clearInterval(interval);
      }
      currentCheckCount ++;
      if (json != null) {
        clearInterval(interval);
        callback();
      }
    }, 400);
}

function fetchRelatedData(url) {
  fetch(url)
   .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
   })
   .then(data => {
     json = data;
  })    
  .catch(error => {
    console.error('Error fetching data:', error);
  });
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
  var h2Nodes = document.querySelectorAll("h2");

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
  const currentURL = new URL(document.URL);
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
  let style = document.createElement("style");
  style.innerHTML = "p.indicator {\n" +
      "    font-size: 18px;\n" +
      "    font-weight: bold;\n" +
      "}";
  document.head.appendChild(style);
  let pElement = document.createElement("p")
  pElement.classList.add("indicator")
  pElement.textContent = "SwiftGG 正在运行，请点击上方按钮开始学习 ⬆️"
  contentDiv.appendChild(spaceElement)
  contentDiv.appendChild(spaceElement2)
  contentDiv.appendChild(pElement)
}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // listen for messages sent from background.js
      if (request.message === pageSwitchedRequestMethod) {
        if (request.url.includes("developer.apple.com")) {
          chrome.runtime.sendMessage({type: initialRequestMethod}, (response) => {
            log(`Flag status: ${response.shouldTranslate}`);

            startTranslate(response.shouldTranslate)

            log("Plugin wait page loaded");

          });
        }
      }
    }
);

function startTranslate(shouldTranslate) {
  const currentURL = new URL(document.URL);
  previousGlobalUrl = globalUrl
  globalUrl = currentURL
  globalUrl.search = ""
  globalUrl.hash = ""
  const pathArray = currentURL.pathname.split('/');
  const baseURL = "https://api.swift.gg/content/";
  const url = baseURL + pathArray[pathArray.length-2] + '/' + pathArray[pathArray.length-1];

  if (previousGlobalUrl.toString() === globalUrl.toString()) {
    if (isCategoryPage() === false) {
      chrome.runtime.sendMessage({type: translatedRequestMethod}, (response) => {})
    }
    return;
  }

  if (shouldTranslate === false) {
    return
  }

  if (isCategoryPage() === false) {
    fetchRelatedData(url)
  }

  waitPage(function() {
    if (isCategoryPage() === true) {
      updateAHerfToAbsolutURL()
      log("in category page")
      addInstructionToCategoryPage()
    } else {
      waitJsonLoaded(function() {
        log("Plugin Start add content");
        updateAHerfToAbsolutURL()
        addTitleNode();
        appendH2Nodes();
        appendPNodes();
        chrome.runtime.sendMessage({type: translatedRequestMethod}, (response) => {})
      });
    }
  });
}