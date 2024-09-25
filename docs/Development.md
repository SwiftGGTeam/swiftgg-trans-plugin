# Twine 开发文档

## 插件整体代码逻辑

1. 判断当前页面是否需要翻译
2. 翻译
   1. 从 `https://api.swiftgg.team/content/` 下获取当前页面对应的翻译的 JSON 文件
   2. 根据 JSON 文件，分别将页面中的下面的元素增加当前语言的翻译文件：
      1. `h1`
      2. `h2`
      3. `p`

### 注意事项

- 在 Plugin 中添加新的文件文件夹，不要直接在  Insepector 中拖，要在 build phase 中添加，不然不会保留文件夹结构。

