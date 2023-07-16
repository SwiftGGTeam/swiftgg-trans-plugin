const pluginFlag = "pluginFlag"
let updateRequestMethod = "updateShouldTranslate"

document.addEventListener("DOMContentLoaded", function () {
  const switchButton = document.querySelector("#switch");
  const label = switchButton.querySelector("label.check");
  const checkbox = document.getElementById("checkbox");
  label.classList.add("disable-animation");
  switchButton.addEventListener('click', () => {
    label.classList.remove("disable-animation");
    checkbox.checked = !checkbox.checked
    document.getElementById('switch').setAttribute('class', checkbox.checked ? 'on' : 'off')
    chrome.storage.local.set({ pluginFlag: checkbox.checked });
    chrome.runtime.sendMessage({type: updateRequestMethod, data: checkbox.checked}).then();
  });
});


chrome.storage.local.get(pluginFlag, (result) => {
  shouldTranslate = result.pluginFlag || false
  document.getElementById("checkbox").checked = shouldTranslate;
  document.getElementById('switch').setAttribute('class', shouldTranslate ? 'on' : 'off')

});

document.addEventListener('change', function(event) {
  var target = event.target;
  if (target.tagName.toLowerCase() === 'select') {
    chrome.tabs.create({ url: target.value });
  }
});