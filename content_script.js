var json = {}
let currentURL = new URL(document.URL);
let pathArray = currentURL.pathname.split('/');
let baseURL = "https://api.swift.gg/content/";
let url = baseURL + pathArray[pathArray.length-2] + '/' + pathArray[pathArray.length-1];

fetch(url)
  .then(response => response.json())
  .then(data => {
    json = data;
    addTitleNode();
    appendH2Nodes();
    appendPNodes();
  });


function addTitleNode() {
    var title = document.querySelector("div.headline h1");
    titleText = json[title.innerText.trim()].zh;
    // console.log(title.innerText.trim());
    // console.log(titleText);
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
        // debugger;
        // console.log(json[node.innerText]["zh"]);
        var parent = node.parentElement;

        var newNode = document.createElement("h2");
        var t = document.createTextNode(json[node.innerText].zh);
        newNode.appendChild(t);

        parent.insertBefore(newNode, node);
        // insertAfter(p, node);
    })
}


function cloneNode() {
    var div = document.querySelector("#introduction div.intro div.content");
    console.log(div.innerHTML); // "title"
    var cloneNode = div.cloneNode(true);
    console.log(cloneNode);
    div.append(cloneNode);
}

function appendPNodes() {
    var pNodes = document.querySelectorAll("p");

    Array.from(pNodes).filter((node) => Boolean(json[node.innerText])).forEach((node) => {
        // debugger;
        // console.log(json[node.innerText]["zh"]);
        var parent = node.parentElement;

        var newNode = document.createElement("p");
        var t = document.createTextNode(json[node.innerText].zh);
        newNode.appendChild(t);

        parent.insertBefore(newNode, node);
        // insertAfter(p, node);
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