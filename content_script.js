[
    {"en": "", "ch": "", "tips": ""},
    {"en": "", "ch": "", "tips": ""},
    {"en": "", "ch": "", "tips": ""},
    {"en": "", "ch": "", "tips": ""},
    {"en": "", "ch": "", "tips": ""}
]

var json = {
    "paragraphs": [
        {"en": "Scrumdinger keeps a list of daily scrums that the user attends, and displays that list in its root view.", "ch": "中文翻译"},
        {"en": "In this tutorial, you’ll build a CardView that displays a summary of a daily scrum. In the next tutorial, you’ll build a List view that uses this CardView in each row of the List.", "ch": "中文翻译"},
        {"en": "Download the starter project and follow along with this tutorial, or open the finished project and explore the code on your own.", "ch": "中文翻译"},
        {"en": "To create a consistent look throughout your app, you’ll create a theme with two contrasting color properties. You’ll use the main color for a view’s background and the accent color for a view’s text.", "ch": "中文翻译"},
        {"en": "In the Project navigator, create a new group named Models.", "ch": "中文翻译"},
        {"en": "In the Models group, create a new Swift file named Theme.swift.", "ch": "中文翻译"},
        {"en": "Import the SwiftUI framework.", "ch": "中文翻译"},
        {"en": "Although you’re not creating a view in this section, you add Color properties from the SwiftUI framework. SwiftUI treats colors as View instances that you can add directly to a view hierarchy.", "ch": "中文翻译"},
        {"en": "Create an enumeration named Theme with a raw value type of String.", "ch": "中文翻译"},
        {"en": "Swift automatically creates strings from each case name in Theme.", "ch": "中文翻译"},
        {"en": "The compiler throws an error because an enumeration must have cases to declare a raw type. You’ll fix this error in the next step.", "ch": "中文翻译"}
    ],
    "headers": [
        {"en": "", "ch": ""},
        {"en": "", "ch": ""},
        {"en": "", "ch": ""},
        {"en": "", "ch": ""},
        {"en": "", "ch": ""}
    ]
}


// const parser = new DOMParser();
// const parsed = parser.parseFromString(document.documentElement.innerHTML, "text/html");
// console.log(parsed.firstChild);


// window.οnlοad = function() {
//     addTitle()
//     cloneNode()
//     appendNodes()
// }

addTitle()
// cloneNode()
appendNodes()

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
    console.log(typeof pNodes);
    console.log(pNodes.length);
    console.log(Array.isArray(pNodes));
    for (const node of pNodes) {
        console.log(node.innerHTML);
        json.paragraphs.forEach(function(item, index){
            if (item.en === node.innerText) {
                console.log(node.innerText);
                console.log(item.ch);
                var parent = node.parentElement;

                var p = document.createElement("p");
                var t = document.createTextNode(item.ch);
                p.appendChild(t);

                parent.insertBefore(p, node);
                // insertAfter(p, node);
            }
        });


    }
}

function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentElement;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibline);
    }
}