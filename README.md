![logo.png](/source/intro/logo.png)

swiftgg-trans-plugin 是一款浏览器插件，旨在帮助 iOS 开发者更轻松地学习和理解 Apple 官方文档。只需安装此插件，即可在浏览器中自动对照翻译 SwiftUI 官方教程页面。同时，插件提供翻译开关，方便用户根据需要进行切换。

## 目录
1. 初衷
2. 功能及使用
3. 上线时间
4. 常见问题与解答
5. 相关链接
6. 关于我们

## 初衷
Apple 为了让初学者能够很好的学习 iOS 开发知识，提供了易于理解带有交互效果的学习教程，很多初学者通过这些教程顺利学会了 iOS 开发，创造出了独特且出色的产品。官方文档的质量非常高，但依然会有一些不完美的地方，例如不支持中文，不能及时更新到最新版本等，这也导致会有一部分初学者在学习的时候会遇到一些问题和困惑。

我们创建这款插件的初衷便是帮助 iOS 开发者更容易地学习和理解 SwiftUI 官方文档。我们希望这个插件能够降低学习难度，让更多的人加入到 iOS 开发的行列中。同时我们也期待社区的力量，共同参与到插件和翻译的开发与完善中，让这个插件不断成长，更好地为大家服务。

在未来，我们希望 swiftgg-trans-plugin 成为初学者和资深开发者的得力助手，不仅涵盖 SwiftUI，还能扩展到其他 Apple 官方文档。我们期待与社区成员一起为开源做出贡献，共同推进技术的发展。

## 功能及使用
目前支持的 Apple 官方教程：
- [Introducing SwiftUI](https://developer.apple.com/tutorials/swiftui)
- [Learning SwiftUI](https://developer.apple.com/tutorials/swiftui-concepts/)
- [Exploring SwiftUI Sample Apps](https://developer.apple.com/tutorials/sample-apps)

![screenshot.png](/source/intro/screenshot.png)

### 安装
- [Chrome 下载](https://chrome.google.com/webstore/category/extensions)  [待上架]
- [edge 下载](https://microsoftedge.microsoft.com/addons/Microsoft-Edge-Extensions-Home) [待上架]
- [firfox 下载](https://addons.mozilla.org/zh-CN/firefox/extensions/) [待上架]
- [safari 下载](https://apps.apple.com/cn/story/id1503038495)  [待上架]

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
    3. 选择克隆到本地的仓库文件夹中的 `manifest.json` 文件。
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

## 上线时间
我们计划在 2023 年 4 月中旬正式发布 swiftgg-trans-plugin 插件。在正式上线前，我们会不断优化功能和完善翻译。欢迎大家提前尝试开发版本，为我们提供宝贵的反馈和建议。

## 相关问题与解答
### 如何给插件提 bug/feature？
如果您在使用过程中遇到问题，或者有新的功能需求，欢迎通过 **[GitHub Issues](https://github.com/SwiftGGTeam/swiftgg-trans-plugin/issues)** 向我们反馈。在创建 Issue 时，请尽量详细描述问题或需求，以便我们更快地解决。

### 如何给插件提交代码？
欢迎为本项目做出贡献！ 如果需要给项目提交代码，你可以直接给本项目提交 Pull Request 进行修改。在提交 Pull Request 时，请简要说明所做的修改和原因，如果有较大的修改，最好在提交之前和我们进行沟通，以便我们更好地理解您的贡献。Pull Request 发起方式参考 SwiftGG [Pull Request 说明](https://github.com/SwiftGGTeam/translation/blob/master/%E7%BF%BB%E8%AF%91%E6%B5%81%E7%A8%8B%E6%A6%82%E8%BF%B0%E5%8F%8APR%E8%AF%B4%E6%98%8E.md#%E5%A6%82%E4%BD%95%E5%8F%91%E8%B5%B7-pull-request)。

### 如何给翻译内容纠错或修正？
如果您发现翻译内容有错误或需要修正，可以点击 [SwiftUI-Tutorial-Chinese](https://github.com/SwiftGGTeam/swiftui-tutorial-chinese) 查看如何进行提交。

### 其他问题
如果您有其他问题或建议，请随时通过 **[GitHub Issues](https://github.com/SwiftGGTeam/swiftgg-trans-plugin/issues)** 与我们联系。我们将尽快回复并解决您的问题。

## 相关链接
[SwiftUI-Tutorial-Chinese](https://github.com/SwiftGGTeam/swiftui-tutorial-chinese) 存放翻译文件的仓库。

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
- [OneeMe](https://github.com/OneeMe)
- [IanIsMyUsername](https://github.com/IanIsMyUsername)
- [hiETsang](https://github.com/hiETsang)
- [Ryan-BetterMe](https://github.com/Ryan-BetterMe)
