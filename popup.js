const pluginFlag = "pluginFlag"
const updateRequestMethod = "updateShouldTranslate"
const updateCurrentRequestMethod = "updateTranslateCurrent"
const queryCurrentRequestMethod = "queryTranslateCurrent"

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
    chrome.storage.local.set({ pluginFlag: checkbox.checked }).then(() => {
      chrome.runtime.sendMessage({type: updateCurrentRequestMethod, data: checkbox.checked}).then();
    });
  });
});


(async () => {
  const result = await chrome.storage.local.get(pluginFlag)
  const shouldTranslate = result.pluginFlag || false
  document.getElementById("checkbox").checked = shouldTranslate;
  document.getElementById('switch').setAttribute('class', shouldTranslate ? 'on' : 'off')

  const response = await chrome.runtime.sendMessage({type: queryCurrentRequestMethod})
  document.getElementById("current-checkbox").checked = response.status;
  document.getElementById('current-switch').setAttribute('class', response.status ? 'on' : 'off')
})()

document.addEventListener('change', function(event) {
  const target = event.target;
  if (target.tagName.toLowerCase() === 'select') {
    chrome.tabs.create({url: target.value}).then();
  }
});