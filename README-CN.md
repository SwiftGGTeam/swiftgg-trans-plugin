<div align="center">
<img src="./Twine%20by%20SwiftGG%20plugin/source/intro/logo.png" alt="logo" style="display: block; margin: auto; width: 150px;"/>
</div>


Twine by SwiftGG 是一款浏览器插件，旨在帮助 iOS 开发者更轻松地学习和理解 Apple 官方文档。以社区提供的本地化内容为基础，可以识别 Apple 文档中的英文内容进行双语翻译，进而帮助开发者完成学习任务。

## 目录
1. 初衷
2. 项目方案
3. 功能及使用
4. 常见问题与解答
5. 功能计划
6. 关于我们

## 初衷
Apple 为了让初学者能够很好的学习 iOS 开发知识，提供了易于理解带有交互效果的学习教程，很多初学者通过这些教程顺利学会了 iOS 开发，创造出了独特且出色的产品。官方文档的质量非常高，但依然会有一些不完美的地方，例如不支持中文，不能及时更新到最新版本等，这也导致会有一部分初学者在学习的时候会遇到一些问题和困惑。

我们创建这款插件的初衷便是帮助 iOS 开发者更容易地学习和理解 SwiftUI 官方文档。我们希望这个工具能够降低学习难度，让更多的人加入到 iOS 开发的行列中。同时我们也期待社区的力量，共同参与到插件和翻译的开发与完善中，让这个插件不断成长，更好地为大家服务。

在未来，我们希望 Twine by SwiftGG 成为初学者和资深开发者的得力助手，不仅涵盖 SwiftUI，还能扩展到其他 Apple 官方文档。我们期待与社区成员一起为开源做出贡献，共同推进技术的发展。

## 项目方案
![flow.png](./Twine%20by%20SwiftGG%20plugin/source/intro/Flow.PNG)
在用户体验上，我们采用了类似沉浸式翻译的方式，中英文参照排列，同时你也可以自定义显示模式。这个方案保留了沉浸式的用户体验，同时在过程中还融入了社区的力量，能让更多的人参与进来，这也意味着插件会产生更多的语言版本，会有更高效的迭代速度和更有意思的交流与沟通。

目前，Twine by SwiftGG 是一个完全开源的项目，由 3 个仓库构成，分别是:
- 浏览器插件仓库：https://github.com/SwiftGGTeam/swiftgg-trans-plugin
- 数据后台仓库：https://github.com/SwiftGGTeam/swiftui-trans-api
- 本地化文件库：https://github.com/SwiftGGTeam/swiftui-tutorial-chinese

## 功能及使用
目前我们支持了三个互动式的教学文档，它们分别是：
- [Introducing SwiftUI](https://developer.apple.com/tutorials/swiftui)
- [Learning SwiftUI](https://developer.apple.com/tutorials/swiftui-concepts/)
- [Exploring SwiftUI Sample Apps](https://developer.apple.com/tutorials/sample-apps)

![screenshot.png](./Twine%20by%20SwiftGG%20plugin/source/intro/screenshot.png)

使用非常简单，点击插件，打开自动翻译，进入到对应的教程页面即可自动翻译，可以根据你的喜好切换翻译展示方式，如果需要暂时不显示翻译，可以通过开关暂时关闭当前页面的翻译。只需要打开即可轻松上手。

### 安装
目前你可以在以下几个浏览器扩展商店中下载这款插件
- [从 Chrome 扩展商店下载](https://chrome.google.com/webstore/detail/twine-by-swiftgg/kelkibamnlfhadhkaonlpplfiidhbofk) 
- [从 macOS App Store 下载](https://apps.apple.com/cn/app/twine-by-swiftgg/id6451390893)
- [从 iOS App Store 下载](https://apps.apple.com/cn/app/twine-by-swiftgg/id6451390893)


**手动安装**
1. 克隆此仓库到本地：
    ```
     git clone <https://github.com/SwiftGGTeam/swiftgg-trans-plugin.git>
    ```
2. 根据你的浏览器类型，选择对应的安装方式。
- 对于 **Google Chrome** 用户：
    1. 打开 `chrome://extensions/` 页面。
    2. 开启右上角的 "开发者模式"。
    3. 点击 "加载已解压的扩展程序"，然后选择克隆到本地的仓库文件夹。
- 对于 **Mozilla Firefox** 用户：
    1. 打开 `about:debugging` 页面。
    2. 点击 "此 Firefox"，然后点击 "临时加载附加组件"。
    3. 修改 `manifest.json` 文件中的 `"service_worker": "./background.js"` 到 `"scripts": ["./background.js"]`。
    4. 在 `manifest.json` 文件中的 `permissions` 里面加入 `"declarativeNetRequest"` 和 `"browsingData"`。
    5. 选择克隆到本地的仓库文件夹中的 `manifest.json` 文件。
- 对于 **Microsoft Edge** 用户：
    1. 打开 `edge://extensions/` 页面。
    2. 开启右下角的 "开发者模式"。
    3. 点击 "加载解压缩的扩展"，然后选择克隆到本地的仓库文件夹。
- 对于 **Safari** 用户：
    **打开"开发"菜单：**
    1. 选择 Safari > 偏好设置。
    2. 选择高级选项。
    3. 选中"在菜单栏中显示开发菜单"选项。
    
    **允许"未签名的扩展"，当退出 Safari 的时候，设置会被重置，需要重新设置。**
    1. 打开 Safari 并且选择"开发"，允许未签名的扩展。
    2. 选择 Safari > 偏好设置。
    3. 选择扩展，在列表中找到我们的扩展，选中启用。


## 常见问题与解答
### 如何给插件提 bug/feature？
如果您在使用过程中遇到问题，或者有新的功能需求，欢迎通过 **[GitHub Issues](https://github.com/SwiftGGTeam/swiftgg-trans-plugin/issues)** 向我们反馈。在创建 Issue 时，请尽量详细描述问题或需求，以便我们更快地解决。

### 如何给插件提交代码？
欢迎为本项目做出贡献！ 如果需要给项目提交代码，你可以直接给本项目提交 Pull Request 进行修改。在提交 Pull Request 时，请简要说明所做的修改和原因，如果有较大的修改，最好在提交之前和我们进行沟通，以便我们更好地理解您的贡献。Pull Request 发起方式参考 SwiftGG [Pull Request 说明](https://github.com/SwiftGGTeam/translation/blob/master/%E7%BF%BB%E8%AF%91%E6%B5%81%E7%A8%8B%E6%A6%82%E8%BF%B0%E5%8F%8APR%E8%AF%B4%E6%98%8E.md#%E5%A6%82%E4%BD%95%E5%8F%91%E8%B5%B7-pull-request)。

### 如何给翻译内容纠错或修正？
如果您发现翻译内容有错误或需要修正，可以点击 [SwiftUI-Tutorial-Chinese](https://github.com/SwiftGGTeam/swiftui-tutorial-chinese) 查看如何进行提交。

### 其他问题
如果您有其他问题或建议，请随时通过 **[GitHub Issues](https://github.com/SwiftGGTeam/swiftgg-trans-plugin/issues)** 与我们联系。我们将尽快回复并解决您的问题。

## 功能计划
下一阶段，我们要做的事情有：
- 浏览器插件方面
  - 支持多语言
  - 支持 iOS 版本 Safari 浏览器
- 数据后台仓库：
  - 使用 vapor 对后台进行重构
  - 优化网页里英文内容的匹配规则，支持更多的页面
- 本地化文件库
  - 提供更多学习资料的本地化文档
  - 优化翻译文档的格式和内容编辑体验

## 关于我们
SwiftGG 是一个致力于为 Swift 语言和 iOS 开发者提供高质量中文技术文章的社区。我们热衷于分享技术知识和经验，我们希望通过这个插件，以及社区的其他活动和项目，帮助更多的开发者更好地学习和了解 Swift 和 iOS 开发。
如果您对我们的项目感兴趣，或者想要了解更多关于 SwiftGG 的信息，请访问我们的官方网站：[https://swiftgg.com](https://swiftgg.com/)。
您也可以通过以下方式关注我们：
- **[GitHub](https://github.com/SwiftGGTeam)**
- **[微博](https://weibo.com/swiftguide)**

### 开发成员
- [SketchK](https://github.com/SwiftGGTeam/swiftgg-trans-plugin/commits?author=SketchK)
- [numbbbbb](https://github.com/numbbbbb)
- [zyterence](https://github.com/zyterence)
- [SpatialOnee](https://github.com/OneeMe)
- [IanIsMyUsername](https://github.com/IanIsMyUsername)
- [hiETsang](https://github.com/hiETsang)
- [Ryan-BetterMe](https://github.com/Ryan-BetterMe)
- [JacobMao](https://github.com/JacobMao)
- [RyanZhu](https://github.com/underthestars-zhy)
- [FrankChu](https://github.com/yongfrank)

