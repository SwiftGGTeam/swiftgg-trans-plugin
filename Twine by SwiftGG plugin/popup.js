const pluginFlag = "pluginFlag"
const displayMethodFlag = "displayMethodFlag"
const updateRequestMethod = "updateShouldTranslate"
const updateCurrentRequestMethod = "updateTranslateCurrent"
const queryCurrentRequestMethod = "queryTranslateCurrent"
const displayMethodRequestMethod = "displayMethod"
const endUpWhiteList = ["swiftui", "swiftui/", "sample-apps", "sample-apps/", "swiftui-concepts", "swiftui-concepts/", "visionos", "visionos/"]
const categoryEndUpWhiteList = ["swiftui", "swiftui/", "sample-apps", "sample-apps/", "swiftui-concepts", "swiftui-concepts/"]

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
      chrome.runtime.sendMessage({ type: updateRequestMethod, data: checkbox.checked }).then();
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const switchButton = document.querySelector("#current-switch");

  if (!switchButton) return

  const label = switchButton.querySelector("label.check");
  const checkbox = document.getElementById("current-checkbox");
  checkbox.checked = false
  switchButton.setAttribute("class", "off")
  label.classList.add("disable-animation");
  switchButton.addEventListener('click', () => {
    label.classList.remove("disable-animation");
    checkbox.checked = !checkbox.checked
    document.getElementById('current-switch').setAttribute('class', checkbox.checked ? 'on' : 'off')
    chrome.runtime.sendMessage({ type: updateCurrentRequestMethod, data: checkbox.checked }).then();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const displaySelect = document.getElementById("display-method")

  if (!displaySelect) return

  displaySelect.addEventListener("change", (event) => {
    event.stopPropagation()
    chrome.storage.local.set({ displayMethodFlag: displaySelect.value }).then(() => {
      queryActiveTab().then((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          message: displayMethodRequestMethod,
          url: true.url,
          data: displaySelect.value
        }).then().catch((e) => { console.log(e) })
      })
    })
  })
});

document.addEventListener("DOMContentLoaded", function () {
  fetch('/_locales/en/messages.json')
    .then(response => response.json())
    .then(data => {
      Object.entries(data).forEach(([key, translation]) => {
        var element = document.getElementById(key);
        if (element) {
          element.innerHTML = chrome.i18n.getMessage(key);
        }
      });
    })
    .catch(error => console.error(error));
});

(async () => {
  const result = await chrome.storage.local.get(pluginFlag)
  let shouldTranslate = result.pluginFlag
  if (shouldTranslate === undefined) {
    // 默认开启翻译，除非明确关闭
    shouldTranslate = true
    chrome.storage.local.set({ pluginFlag: shouldTranslate }).then()
  }
  const displayMethodResult = await chrome.storage.local.get(displayMethodFlag)

  document.getElementById("display-method").value = displayMethodResult.displayMethodFlag || "auto"
  document.getElementById("checkbox").checked = shouldTranslate;
  document.getElementById('switch').setAttribute('class', shouldTranslate ? 'on' : 'off')
})()

document.addEventListener('click', function (event) {
  const target = event.target.closest('.course-item');
  if (target) {
    event.preventDefault();
    const link = target.querySelector('.course-link');
    if (link) {
      chrome.tabs.create({ url: link.href });
    }
  }
});

async function queryActiveTab() {
  return (await chrome.tabs.query({ active: true, currentWindow: true }))[0]
}

function isSupportedPage(url) {
  const currentURL = new URL(url)
  const pathArray = currentURL.pathname.split('/').filter(function (el) {
    return el !== ""
  })

  return endUpWhiteList.includes(pathArray[pathArray.length - 2]) || endUpWhiteList.includes(pathArray[pathArray.length - 1])
}

