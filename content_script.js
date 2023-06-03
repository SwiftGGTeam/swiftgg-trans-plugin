var json = {}
let currentURL = new URL(document.URL);
let pathArray = currentURL.pathname.split('/');
let baseURL = "https://api.swift.gg/content/";
let url = baseURL + pathArray[pathArray.length-2] + '/' + pathArray[pathArray.length-1];
let initalRequestMethod = "shouldTranslate"
let updateRequestMethod = "updateShouldTranslate"
let reloadRequestMethod = "reloadShouldTranslate"

chrome.runtime.sendMessage({type: initalRequestMethod}, (response) => {
  const data = response.data;
  if (data == true) {
    fetchRelatedData(url)
    waitPageLoaded()
  }
});

function waitPageLoaded() {
    var maxCheckCount = 10
    var currentCheckCount = 0
    window.addEventListener('load', () => {
      const interval = setInterval(() => {
        if (currentCheckCount >= maxCheckCount) {
          clearInterval(interval);
        }
        currentCheckCount ++;
        const element = document.querySelector("div.headline h1");
        if (element) {
          updateAHerfToAbsolutURL()
          clearInterval(interval);
          addTitleNode();
          appendH2Nodes();
          appendPNodes();
        }
      }, 200);
    });
}

function fetchRelatedData(url) {
  if (url.endsWith("swiftui") || url.endsWith("swiftui/")) {
    return;
  }
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
  for (let i = 0; i < relativeLinks.length; i++) {
    let link = relativeLinks[i];
    let relativePath = link.getAttribute('href');
    let absolutePath = `https://developer.apple.com${relativePath}`;
    link.setAttribute('href', absolutePath);
    link.setAttribute('target', '_blank');
  }
}

function addTitleNode() {
  var title = document.querySelector("div.headline h1");
  titleText = json[title.innerText.trim()].zh;
  if (!titleText || titleText == "") {
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
  if (parent.lastChild == targetElement) {
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

