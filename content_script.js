var json = {}
let currentURL = new URL(document.URL);
let pathArray = currentURL.pathname.split('/');
let baseURL = "https://api.swift.gg/content/"
let url = baseURL + pathArray[pathArray.length-2] + '/' + pathArray[pathArray.length-1]

fetch(url)
  .then(response => response.json())
  .then(data => {
    json = data
    appendNodes();
  });


function addTitle() {
    var title = document.querySelector("div.headline h1");
    console.log(title.innerHTML); // "title"
    var h = document.createElement("h1");
    var t = document.createTextNode("创建卡片视图");
    h.appendChild(t);
    title.append(h);
}


function cloneNode() {
    var div = document.querySelector("#introduction div.intro div.content");
    console.log(div.innerHTML); // "title"
    var cloneNode = div.cloneNode(true);
    console.log(cloneNode);
    div.append(cloneNode);
}

function appendNodes() {
    var pNodes = document.querySelectorAll("p");
    // var json = JSON.parse(rawJSON);
    console.log(typeof pNodes);
    console.log(pNodes.length);
    console.log(Array.isArray(pNodes));
    // console.log(json);

    Array.from(pNodes).filter((node) => Boolean(json[node.innerText])).forEach((node) => {
        console.log(node.innerHTML);
        console.log(node.innerText);
        console.log(typeof json[node.innerText]);
        console.log(json[node.innerText]);
        // debugger;
        console.log(json[node.innerText]["zh"]);
        var parent = node.parentElement;

        var p = document.createElement("p");
        var t = document.createTextNode(json[node.innerText].zh);
        p.appendChild(t);

        parent.insertBefore(p, node);
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