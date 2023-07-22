const pluginFlag = "pluginFlag"
const updateRequestMethod = "updateShouldTranslate"
const updateCurrentRequestMethod = "updateTranslateCurrent"
const queryCurrentRequestMethod = "queryTranslateCurrent"
const endUpWhiteList = ["swiftui","swiftui/","sample-apps","sample-apps/","swiftui-concepts","swiftui-concepts/"];

document.addEventListener("DOMContentLoaded", function () {
  const switchButton = document.querySelector("#switch");
  const label = switchButton.querySelector("label.check");
  const checkbox = document.getElementById("checkbox");
  label.classList.add("disable-animation");
  switchButton.addEventListener('click', () => {
    label.classList.remove("disable-animation");
    checkbox.checked = !checkbox.checked
    document.getElementById('switch').setAttribute('class', checkbox.checked ? 'on' : 'off')
    chrome.storage.local.set({ pluginFlag: checkbox.checked }).then(() => {
      chrome.runtime.sendMessage({type: updateRequestMethod, data: checkbox.checked}).then();
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const switchButton = document.querySelector("#current-switch");
  const label = switchButton.querySelector("label.check");
  const checkbox = document.getElementById("current-checkbox");
  checkbox.checked = false
  switchButton.setAttribute("class", "off")
  label.classList.add("disable-animation");
  switchButton.addEventListener('click', () => {
    label.classList.remove("disable-animation");
    checkbox.checked = !checkbox.checked
    document.getElementById('current-switch').setAttribute('class', checkbox.checked ? 'on' : 'off')
    chrome.runtime.sendMessage({type: updateCurrentRequestMethod, data: checkbox.checked}).then();
  });
});


(async () => {
  const result = await chrome.storage.local.get(pluginFlag)
  const shouldTranslate = result.pluginFlag || false
  document.getElementById("checkbox").checked = shouldTranslate;
  document.getElementById('switch').setAttribute('class', shouldTranslate ? 'on' : 'off')

  const activeTab = await queryActiveTab()

  if (isSupportedPage(activeTab.url) && !isCategoryPage(activeTab.url)) {
    const response = await chrome.runtime.sendMessage({type: queryCurrentRequestMethod})
    document.getElementById("current-checkbox").checked = response.status;
    document.getElementById('current-switch').setAttribute('class', response.status ? 'on' : 'off')
  } else {
    const element = document.getElementById("translate-current")
    element.remove()
  }
})()

document.addEventListener('change', function(event) {
  const target = event.target;
  if (target.tagName.toLowerCase() === 'select') {
    chrome.tabs.create({url: target.value}).then();
  }
});

async function queryActiveTab() {
  return (await chrome.tabs.query({ active: true, currentWindow: true }))[0]
}

function isSupportedPage(url) {
  const currentURL = new URL(url)
  const pathArray = currentURL.pathname.split('/').filter(function (el){
    return el !== ""
  })

  return endUpWhiteList.includes(pathArray[pathArray.length-2]) || endUpWhiteList.includes(pathArray[pathArray.length-1])
}

function isCategoryPage(url) {
  const currentURL = new URL(url)
  currentURL.hash = ""
  currentURL.search = ""
  const pathArray = currentURL.pathname.split('/');

  const lastPath = pathArray[pathArray.length - 1] || pathArray[pathArray.length - 2];
  return endUpWhiteList.includes(lastPath)
}