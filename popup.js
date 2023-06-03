const pluginFlag = "pluginFlag"
let updateRequestMethod = "updateShouldTranslate"

document.addEventListener("DOMContentLoaded", function () {
  const label = document.querySelector("#switch label.check");
  label.classList.add("disable-animation");
  document.getElementById("checkbox").addEventListener('change', (e) => {
    label.classList.remove("disable-animation");
    document.getElementById('switch').setAttribute('class', e.target.checked ? 'on' : 'off')
    chrome.storage.local.set({ pluginFlag: e.target.checked });
    chrome.runtime.sendMessage({type: updateRequestMethod, data: e.target.checked});
  })
});

chrome.storage.local.get(pluginFlag, (result) => {
  shouldTranslate = result.pluginFlag || false
  document.getElementById("checkbox").checked = shouldTranslate;
  document.getElementById('switch').setAttribute('class', shouldTranslate ? 'on' : 'off')

});
