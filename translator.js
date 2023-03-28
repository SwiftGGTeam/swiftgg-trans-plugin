//Checking page title
if (document.title.indexOf("Creating") != -1) {
    //Creating Elements
    var btn = document.createElement("BUTTON");
    var t = document.createTextNode("CLICK ME");
    btn.appendChild(t);
    //Appending to DOM 
    document.body.appendChild(btn);
}

// var btn = document.createElement("BUTTON")
// var t = document.createTextNode("CLICK ME");
// btn.appendChild(t);
// //Appending to DOM 
// document.body.appendChild(btn);

const parser = new DOMParser();
const parsed = parser.parseFromString(document.documentElement.innerHTML, "text/html");
console.log(parsed.firstChild);


var title = document.querySelector("h1");
console.log(title.innerText); // "title"
var h = document.createElement("h1")
var t = document.createTextNode("创建卡片视图");
h.appendChild(t);
title.append(t)

var div = document.querySelector("#introduction div.intro div.content");
console.log(div.innerHTML); // "title"
var cloneNode = div.cloneNode(true);
console.log(cloneNode)
div.append(cloneNode);

var pNodes = div.querySelectorAll("p");
var newDiv = div.cloneNode(true);
console.log(node)
for (var node in pNodes) {
    console.log(node)
    newDiv.appendChild(node)
}

// div.append(newDiv)
// var h = document.createElement("h1")
// var t = document.createTextNode("创建卡片视图");
// h.appendChild(t);
// title.append(t)

{
    [
        {"en": {"ch": ""}},
        {"en": {"ch": ""}},
        {"en": {"ch": ""}},
        {"en": {"ch": ""}},
        {"en": {"ch": ""}}
    ]
}