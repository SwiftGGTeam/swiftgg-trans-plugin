var json = {
    "This tutorial guides you through building Landmarks — an app for discovering and sharing the places you love. You’ll start by building the view that shows a landmark’s details.": {
        "zh": "本教程将指导你构建 Landmarks —— 一款发现和分享你喜欢的地方的应用程序。首先你将构建一个用来显示地标详情的视图。",
        "tips": ""
    },
    "To lay out the views, Landmarks uses stacks to combine and layer the image and text view components. To add a map to the view, you’ll include a standard MapKit component. As you refine the view’s design, Xcode provides real-time feedback so you can see how those changes translate into code.": {
        "zh": "对于界面布局，Landmarks 使用堆栈的方式来组合以及布局图像和文本组件。因为界面中有地图模块，所以需要添加系统的 MapKit 组件。每当你重新调整界面的设计样式时，Xcode 会提供实时反馈，因此你可以看到这些修改是如何转化成为代码的。",
        "tips": ""
    },
    "Download the project files to begin building this project, and follow the steps below.": {
        "zh": "下载工程文件来开始构建此项目，并按照以下的步骤操作。",
        "tips": ""
    },
    "Create a new Xcode project that uses SwiftUI. Explore the canvas, previews, and the SwiftUI template code.": {
        "zh": "创建一个使用 SwiftUI 的新 Xcode 项目。首先浏览一下画布、预览部分和 SwiftUI 提供的模板代码。",
        "tips": ""
    },
    "To preview and interact with views from the canvas in Xcode, and to use all the latest features described throughout the tutorials, ensure your Mac is running macOS Monterey or later.": {
        "zh": "要在 Xcode 的画布中预览以及和视图交互，还有使用我们这个教程中提到的最新功能，你需要保证 Mac 运行的是 macOS Monterey 或者更高的版本。 ",
        "tips": ""
    },
    "Step 1": {
        "zh": "第 1 步",
        "tips": ""
    },
    "Open Xcode and either click “Create a new Xcode project” in Xcode’s startup window, or choose File > New > Project.": {
        "zh": "打开 Xcode，然后在启动窗口中点击 “Create a new Xcode project”，或者点击状态栏中的 File > New > Project。",
        "tips": ""
    },
    "Step 2": {
        "zh": "第 2 步",
        "tips": ""
    },
    "In the template selector, select iOS as the platform, select the App template, and then click Next.": {
        "zh": "在模板选择器中，选择 iOS 作为程序运行的平台，选择 App，然后单击 Next。",
        "tips": ""
    },
    "Step 3": {
        "zh": "第 3 步",
        "tips": ""
    },
    "Enter “Landmarks” as the product name, select “SwiftUI” for the interface and “Swift” for the language, and click Next. Choose a location to save the Landmarks project on your Mac.": {
        "zh": "输入“Landmarks”作为产品名称，界面选择“SwiftUI”，语言选择“Swift”，点击下一步。在 Mac 上选择一个位置来保存 Landmarks 项目。",
        "tips": ""
    },
    "Step 4": {
        "zh": "第 4 步",
        "tips": ""
    },
    "In the Project navigator, select LandmarksApp.swift.": {
        "zh": "在左侧的项目导航栏中，点击 LandmarksApp.swift 文件。",
        "tips": ""
    },
    "An app that uses the SwiftUI app life cycle has a structure that conforms to the App protocol. The structure’s body property returns one or more scenes, which in turn provide content for display. The @main attribute identifies the app’s entry point.": {
        "zh": "使用 SwiftUI 框架的应用程序应该具有一个遵循 App 协议的结构体。结构体的 body 属性返回一个或者多个场景（Scene），这些场景提供内容以供显示。 @main 属性标识应用程序的入口。",
        "tips": ""
    },
    "Step 5": {
        "zh": "第 5 步",
        "tips": ""
    },
    "In the Project navigator, select ContentView.swift.": {
        "zh": "在项目导航栏中，选择 ContentView.swift 文件。",
        "tips": ""
    },
    "By default, SwiftUI view files declare two structures. The first structure conforms to the View protocol and describes the view’s content and layout. The second structure declares a preview for that view.": {
        "zh": "默认情况下，SwiftUI 视图文件声明两个结构体。第一个结构符合 View 协议，描述了视图的内容和布局。第二个结构声明该视图的预览样式。",
        "tips": ""
    },
    "Step 6": {
        "zh": "第 6 步",
        "tips": ""
    },
    "In the canvas, click Resume to display the preview.": {
        "zh": "在右边的画布中，点击 Resume 来显示程序的预览效果。",
        "tips": ""
    },
    "Tip": {
        "zh": "提示",
        "tips": ""
    },
    "If the canvas isn’t visible, select Editor > Canvas to show it.": {
        "zh": "如果没有看到画布，点击状态栏中的 Editor > Canvas 让画布显示。",
        "tips": ""
    },
    "Step 7": {
        "zh": "第 7 步",
        "tips": ""
    },
    "Inside the body property, change “Hello, World!” to a greeting for yourself.": {
        "zh": "在 body 属性中，试着修改“Hello, World!”来给自己一个问候吧！",
        "tips": ""
    },
    "As you change the code in a view’s body property, the preview updates to reflect your changes.": {
        "zh": "每当你修改 body 属性里面的代码，预览界面将会同步更新你的修改。",
        "tips": ""
    },
    "You can customize a view’s display by changing your code, or by using the inspector to discover what’s available and to help you write code.": {
        "zh": "你可以尝试自己修改代码自定义界面展示，或者使用检查器(inspector)来探索有哪些可用的属性。",
        "tips": ""
    },
    "As you build the Landmarks app, you can use any combination of editors: the source editor, the canvas, or the inspectors. Your code stays updated, regardless of which tool you use.": {
        "zh": "在构建 Landmarks 应用程序时，你可以使用任意组合的编辑器：源代码编辑器、画布或检查器。无论你使用哪种工具修改，你的代码都会保持更新。",
        "tips": ""
    },
    "Next, you’ll customize the text view using the inspector.": {
        "zh": "接下来，你将使用检查器自定义文本视图。",
        "tips": ""
    },
    "In the preview, Command-click the greeting to bring up the structured editing popover, and choose “Show SwiftUI Inspector”.": {
        "zh": "在预览界面中，按住 Command 键并点击文字会弹出一个编辑窗口，然后选择“Show SwiftUI Inspector”。",
        "tips": ""
    },
    "The popover shows different attributes that you can customize, depending on the type of view you inspect.": {
        "zh": "弹窗会更具你选择的视图类型展示不同的可供调整的属性。",
        "tips": ""
    },
    "Use the inspector to change the text to “Turtle Rock”, the name of the first landmark you’ll show in your app.": {
        "zh": "使用检查器将文字更改为“Turtle Rock”，这是在应用中将要显示的第一个地标的名称。",
        "tips": ""
    },
    "Change the Font modifier to “Title”.": {
        "zh": "选择字体修饰符，修改为“Title”。",
        "tips": ""
    },
    "This applies the system font to the text so that it responds correctly to the user’s preferred font sizes and settings.": {
        "zh": "这样做会将系统的字体应用到文本上，让他可以跟随用户设置的字体大小和偏好进行调整。",
        "tips": ""
    },
    "To customize a SwiftUI view, you call methods called modifiers. Modifiers wrap a view to change its display or other properties. Each modifier returns a new view, so it’s common to chain multiple modifiers, stacked vertically.": {
        "zh": "要自定义 SwiftUI 视图，您需要调用称为修饰符（modifiers）的方法。修饰符用来包装一个视图，它可以更改这个视图的显示或其他属性。每个修饰符都返回一个新视图，因此通常需要垂直堆叠多个修饰符。",
        "tips": ""
    },
    "Edit the code by hand to change the padding() modifier to the foregroundColor(.green) modifier; this changes the text’s color to green.": {
        "zh": "手动编辑代码，将 padding() 修饰符改为 foregroundColor(.green) 修饰符；会将文本的颜色改为绿色。",
        "tips": ""
    },
    "Your code is always the source of truth for the view. When you use the inspector to change or remove a modifier, Xcode updates your code immediately to match.": {
        "zh": "视图的修改始终来源于你的代码。当使用检查器更改或删除修饰符时，Xcode 会立即更新你的源代码来匹配你的修改。",
        "tips": ""
    },
    "This time, open the inspector by Command-clicking on the Text declaration in the code editor, and then choose “Show SwiftUI Inspector” from the popover. Click the Color pop-up menu and choose Inherited to change the text color to black again.": {
        "zh": "这一次，通过在代码编辑器中按住 Command 键并单击 Text 声明来打开检查器，然后从弹出窗口中选择“Show SwiftUI Inspector”。点击颜色弹出菜单并选择继承，这样就能再次将文本颜色更改为黑色。",
        "tips": ""
    },
    "Notice that Xcode updates your code automatically to reflect the change, removing the foregroundColor(.green) modifier.": {
        "zh": "请注意，在你修改之后 Xcode 会自动更新您的代码，这里它会删除 foregroundColor(.green) 修饰符。",
        "tips": ""
    },
    "Beyond the title view you created in the previous section, you’ll add text views to contain details about the landmark, such as the name of the park and state it’s in.": {
        "zh": "除了在上一节中创建的标题视图之外，你还将添加包含有关地标的文本视图，例如公园的名称和它所在的州。",
        "tips": ""
    },
    "When creating a SwiftUI view, you describe its content, layout, and behavior in the view’s body property; however, the body property only returns a single view. You can combine and embed multiple views in stacks, which group views together horizontally, vertically, or back-to-front.": {
        "zh": "创建 SwiftUI 视图时，你会在视图的 body 属性中描述其内容、布局和行为。但是， body 属性只能返回一个视图。因此你可以在堆栈中组合以及嵌入多个视图，这些视图以水平排列、垂直排列或前后堆叠的方式组合在一起。",
        "tips": ""
    },
    "In this section, you’ll use a vertical stack to place the title above a horizontal stack that contains details about the park.": {
        "zh": "在本节中，你将使用垂直堆栈将标题放在包含公园信息的水平堆栈上方。",
        "tips": ""
    },
    "You can use Xcode’s structured editing support to embed a view in a container view, open an inspector, or help with other useful changes.": {
        "zh": "您可以使用 Xcode 的快速编辑功能， 它可以嵌入视图到当前容器，打开检查器或帮助你进行其他的修改。",
        "tips": ""
    },
    "Command-click the text view’s initializer to show the structured editing popover, and then choose “Embed in VStack”.": {
        "zh": "按住 Command 键并点击文本视图的初始化方法，然后在弹窗中选择“Embed in VStack”。",
        "tips": ""
    },
    "Next, you’ll add a text view to the stack by dragging a Text view from the library.": {
        "zh": "接下来，将通过从控件库中拖动 Text 视图的方式来将文本视图添加到堆栈中。",
        "tips": ""
    },
    "Open the library by clicking the plus button (+) at the top-right of the Xcode window, and then drag a Text view to the place in your code immediately below the “Turtle Rock” text view.": {
        "zh": "点击 Xcode 窗口右上角的加号按钮 (+) 打开组件库，然后将 Text 视图拖到代码中“Turtle Rock”文本视图正下方的位置。",
        "tips": ""
    },
    "Replace the Text view’s placeholder text with “Joshua Tree National Park”.": {
        "zh": "将 Text 视图的默认占位文本替换为“Joshua Tree National Park”。",
        "tips": ""
    },
    "Customize the location to match the desired layout.": {
        "zh": "调整位置来匹配我们需要的布局。",
        "tips": ""
    },
    "Set the location’s font to subheadline.": {
        "zh": "将位置的字体设置为 subheadline 。",
        "tips": ""
    },
    "Edit the VStack initializer to align the views by their leading edges.": {
        "zh": "编辑 VStack 初始化方法，让文本居左对齐。",
        "tips": ""
    },
    "By default, stacks center their contents along their axis and provide context-appropriate spacing.": {
        "zh": "默认情况下，垂直堆栈会将内容居中对齐，并根据内容提供一个合适的默认间距。",
        "tips": ""
    },
    "Next, you’ll add another text view to the right of the location, this for the park’s state.": {
        "zh": "接下来，你将在公园位置文本的右边添加另一个文本，这是公园所属的州。",
        "tips": ""
    },
    "In the canvas, Command-click “Joshua Tree National Park”, and choose “Embed in HStack”.": {
        "zh": "在画布中，按住 Command 键并单击“Joshua Tree National Park”，然后选择“Embed in HStack”。",
        "tips": ""
    },
    "Add a new text view after the location, change the placeholder text to the park’s state, and then set its font to subheadline.": {
        "zh": "在公园位置的后面添加一个新的文本视图，将占位符文本更改为公园所属的州，然后将它的字体设置为 subheadline 。",
        "tips": ""
    },
    "Step 8": {
        "zh": "第 8 步",
        "tips": ""
    },
    "To direct the layout to use the full width of the device, separate the park and the state by adding a Spacer to the horizontal stack holding the two text views.": {
        "zh": "要让界面按照整个设备的宽度来布局，你可以通过将 Spacer 插入到两个文本的中间，这样水平方向上的布局就会用间距分隔公园和所属的州。",
        "tips": ""
    },
    "A spacer expands to make its containing view use all of the space of its parent view, instead of having its size defined only by its contents.": {
        "zh": "Spacer 会尽可能的撑开它在父视图里面的空间，而不是由父视图里面的内容决定的。",
        "tips": ""
    },
    "Step 9": {
        "zh": "第 9 步",
        "tips": ""
    },
    "Finally, use the padding() modifier method to give the landmark’s name and details a little more space.": {
        "zh": "最后，使用 padding() 修饰符方法给地标的名称和细节一些内边距。",
        "tips": ""
    },
    "With the name and location views all set, the next step is to add an image for the landmark.": {
        "zh": "名称和位置视图都设置好后，下一步是为地标添加图像。",
        "tips": ""
    },
    "Instead of adding more code in this file, you’ll create a custom view that applies a mask, border, and drop shadow to the image.": {
        "zh": "不需要在这个文件中添加更多的代码了，你讲创建一个新的自定义视图，这个视图包含一个图片，并且会给图片添加蒙版，边框以及投影。",
        "tips": ""
    },
    "Start by adding an image to the project’s asset catalog.": {
        "zh": "首先将图像添加到项目的资源文件目录中。\n",
        "tips": ""
    },
    "Find turtlerock@2x.jpg in the project files’ Resources folder; drag it into the asset catalog’s editor. Xcode creates a new image set for the image.": {
        "zh": "在项目文件的 Resources 文件夹中找到 turtlerock@2x.jpg，将它拖到资源目录中。 Xcode 会为图片自动创建一个新的图像集合。",
        "tips": ""
    },
    "Next, you’ll create a new SwiftUI view for your custom image view.": {
        "zh": "接下来，你将创建一个新的 SwiftUI 视图用来自定义图片。",
        "tips": ""
    },
    "Choose File > New > File to open the template selector again. In the User Interface section, select “SwiftUI View” and click Next. Name the file CircleImage.swift and click Create.": {
        "zh": "点击状态栏中的 File > New > File 再次打开模版选择窗口。在 User Interface 这一行中选择 “SwiftUI View” 然后点击下一步。将文件命名为“CircleImage.swift”，然后点击“Create”。",
        "tips": ""
    },
    "You’re ready to insert the image and modify its display to match the desired design.": {
        "zh": "你已经做好了准备，接下来就是插入图片，然后修改图片成设计的效果。",
        "tips": ""
    },
    "Replace the text view with the image of Turtle Rock by using the Image(_:) initializer, passing it the name of the image to display.": {
        "zh": "使用 Image(_:) 初始化方法将文本视图替换为 Turtle Rock 的图像视图，并将要显示的图像的名称传递给它。",
        "tips": ""
    },
    "Add a call to clipShape(Circle()) to apply the circular clipping shape to the image.": {
        "zh": "添加 clipShape(Circle()) ，将图片裁剪成圆形。",
        "tips": ""
    },
    "The Circle type is a shape that you can use as a mask, or as a view by giving the circle a stroke or fill.": {
        "zh": "Circle 类型是一种形状，你可以将它用作遮罩，也可以给圆圈添加描边或填充来用作视图。",
        "tips": ""
    },
    "Create another circle with a gray stroke, and then add it as an overlay to give the image a border.": {
        "zh": "创建另一个带灰色描边的圆形，然后将它作为图片的覆盖层，这样相当于给图片添加边框。",
        "tips": ""
    },
    "Next, add a shadow with a 7 point radius.": {
        "zh": "接下来，添加一个半径为 7 点的阴影。\n",
        "tips": ""
    },
    "Switch the border color to white.": {
        "zh": "将边框颜色切换成白色",
        "tips": ""
    },
    "This completes the image view.": {
        "zh": "这样就完成了这个图片视图",
        "tips": ""
    },
    "Next you’ll create a map that centers on a given coordinate. You can use the Map view from MapKit to render the map.": {
        "zh": "接下来，你将创建一个以给定坐标为中心的地图。你可以使用 MapKit 中的地图视图来进行渲染展示。",
        "tips": ""
    },
    "To get started, you’ll create a new custom view to manage your map.": {
        "zh": "首先，您将创建一个新的自定义视图来管理您的地图。\n",
        "tips": ""
    },
    "Choose File > New > File, select iOS as the platform, select the “SwiftUI View” template, and click Next. Name the new file MapView.swift and click Create.": {
        "zh": "选择 File > New > File，选择 iOS 作为平台，选择“SwiftUI View”模板，点击 Next。将新文件命名为 MapView.swift ，然后点击“创建”。\n",
        "tips": ""
    },
    "Add an import statement for MapKit.": {
        "zh": "添加一行导入 MapKit 框架的代码",
        "tips": ""
    },
    "When you import SwiftUI and certain other frameworks in the same file, you gain access to SwiftUI-specific functionality provided by that framework.": {
        "zh": "当你在同一文件中导入 SwiftUI 和某些其他框架时，你可以访问这个框架提供给 SwiftUI 的特定的功能。",
        "tips": ""
    },
    "Create a private state variable that holds the region information for the map.": {
        "zh": "创建一个私有状态变量，用于保存地图的区域信息。\n",
        "tips": ""
    },
    "You use the @State attribute to establish a source of truth for data in your app that you can modify from more than one view. SwiftUI manages the underlying storage and automatically updates views that depend on the value.": {
        "zh": "你可以使用 @State 属性为你的应用程序建立真实的数据来源，随后可以从多个视图中修改这些数据。 SwiftUI 管理底层存储逻辑并且能够自动刷新关联到这些值的视图。",
        "tips": ""
    },
    "Replace the default Text view with a Map view that takes a binding to the region.": {
        "zh": "将默认的 Text 视图替换成带地区绑定的 Map 视图。",
        "tips": ""
    },
    "By prefixing a state variable with $, you pass a binding, which is like a reference to the underlying value. When the user interacts with the map, the map updates the region value to match the part of the map that’s currently visible in the user interface.": {
        "zh": "通过在状态变量前加上 $ 前缀，您可以传递一个绑定值，它类似于对原始值的引用。当用户与地图进行交互时，地图会根据界面中看到的地图区域更新它绑定的地区值。",
        "tips": ""
    },
    "When previews are in static mode, they only fully render native SwiftUI views. For the Map view, you’ll need to switch to a live preview to see it render.": {
        "zh": "当预览处于静态模式时，它们只会呈现原生 SwiftUI 视图。对于 Map 视图，你需要切换到实时预览模式才能看到它的渲染效果。\n",
        "tips": ""
    },
    "Click Live Preview to switch the preview to live mode. You might need to click Try Again or Resume above your preview.": {
        "zh": "单击实时预览将预览切换为实时模式。如果没能成功，你可以点击预览上方的“Try Again”或“Resume”多试几次。",
        "tips": ""
    },
    "In a moment, you’ll see a map centered on Turtle Rock. You can manipulate the map in live preview to zoom out a bit and see the surrounding area.": {
        "zh": "很快，你会看到以 Turtle Rock 为中心的地图界面。您可以在实时预览中操作地图放大缩小或者查看周围区域。",
        "tips": ""
    },
    "You now have all of the components you need — the name and place, a circular image, and a map for the location.": {
        "zh": "你现在已经准备好了所有需要的视图组件了，名称、地点、一个圆形图片，还有地图。",
        "tips": ""
    },
    "With the tools you’ve used so far, combine your custom views to create the final design for the landmark detail view.": {
        "zh": "利用你前面使用到的工具，组合你的自定义的视图然后构建最终的地标界面吧。",
        "tips": ""
    },
    "In the Project navigator, select the ContentView.swift file.": {
        "zh": "在项目导航栏中，选择 ContentView.swift 文件。",
        "tips": ""
    },
    "Embed the VStack that holds the three text views in another VStack.": {
        "zh": "将包含三个文本视图的 VStack 嵌入到另一个 VStack 中。\n",
        "tips": ""
    },
    "Add your custom MapView to the top of the stack. Set the size of the MapView with frame(width:height:).": {
        "zh": "将你自定义的 MapView 添加到堆栈的顶部。使用 frame(width:height:) 设置 MapView 的大小。",
        "tips": ""
    },
    "When you specify only the height parameter, the view automatically sizes to the width of its content. In this case, MapView expands to fill the available space.": {
        "zh": "当你仅指定了 height 参数时，视图会根据内容的宽度自适应大小。在这种情况下， MapView 会自动扩展填满能够占据的空间。",
        "tips": ""
    },
    "Click Live Preview to see the rendered map in the composed view.": {
        "zh": "单击实时预览可以在组合视图中查看渲染出来的地图。",
        "tips": ""
    },
    "You can continue editing the view while showing a Live Preview.": {
        "zh": "你可以在显示实时预览的同时继续编辑视图。\n",
        "tips": ""
    },
    "Add the CircleImage view to the stack.": {
        "zh": "将 CircleImage 视图添加到堆栈。\n",
        "tips": ""
    },
    "To layer the image view on top of the map view, give the image an offset of -130 points vertically, and padding of -130 points from the bottom of the view.": {
        "zh": "要使图片盖在地图之上，你需要给图像提供 -130 单位的垂直偏移，也就是让它往上偏移 130 个单位，并且将它距离底部的间距调整为 -130 单位。",
        "tips": ""
    },
    "These adjustments make room for the text by moving the image upwards.": {
        "zh": "向上调整图片来为文本腾出空间。",
        "tips": ""
    },
    "Add a spacer at the bottom of the outer VStack to push the content to the top of the screen.": {
        "zh": "在外层的 VStack 底部添加一个 Spacer，将整体内容推到屏幕的顶部。",
        "tips": ""
    },
    "To allow the map content to extend to the top edge of the screen, add the ignoresSafeArea(edges: .top) modifier to the map view.": {
        "zh": "为了让地图内容能够扩展到屏幕顶部的边缘，需要将 ignoresSafeArea(edges: .top) 修饰符添加到地图视图。",
        "tips": ""
    },
    "Add a divider and some additional descriptive text for the landmark.": {
        "zh": "给地标添加分隔线和一些其它的描述。",
        "tips": ""
    },
    "Step 10": {
        "zh": "第 10 步",
        "tips": ""
    },
    "Finally, move the subheadline font modifier from each Text view to the HStack containing them, and apply the secondary color to the subheadline text.": {
        "zh": "最后，将 subheadline 字体修饰符从内部的文本视图移动到包含他们的父级 HStack，然后将 secondary 颜色应用到 HStack 上。",
        "tips": ""
    },
    "When you apply a modifier to a layout view like a stack, SwiftUI applies the modifier to all the elements contained in the group.": {
        "zh": "当你将修饰符应用到堆栈等布局视图时，SwiftUI 会将修饰符应用到堆栈中包含的所有元素。",
        "tips": ""
    }
}

// document.addEventListener('DOMContentLoaded', function() {
//     console.log('我被执行了！');
//     appendNodes();
// });

appendNodes();

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
    // var json = JSON.parse(rawJSON);
    console.log(typeof pNodes);
    console.log(pNodes.length);
    console.log(Array.isArray(pNodes));
    // console.log(json);

    Array.from(pNodes).filter((node) => Boolean(json[node.innerText])).forEach((node) => {
        console.log(node.innerHTML);
        console.log(node.innerText);
        console.log(typeof json[node.innerText]);
        console.log(json[node.innerText]);
        // debugger;
        console.log(json[node.innerText]["zh"]);
        var parent = node.parentElement;

        var p = document.createElement("p");
        var t = document.createTextNode(json[node.innerText].zh);
        p.appendChild(t);

        parent.insertBefore(p, node);
        // insertAfter(p, node);
    })
}

function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentElement;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibline);
    }
}