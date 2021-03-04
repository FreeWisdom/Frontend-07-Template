# 一、重学HTML
## 1、重要的HTML实体（DTD）
* &nbsp 在网页上出现多个空格，会出现分词的问题
* &quot 是双引号
* &amp 是&符
* &lt 是小于号
* &gt 是大于号
## 2、HTML标签语义
* `<main></main>` 放的主要部分 表示一个
* `<hgroup></hgroup>` 标题组
* `<abbr></abbr>` 表示缩写、简写 有title属性
* `<strong></strong>` 表示重点 文章的重点
* `<em></em>` 表示强调 语气上
* `<figure></figure>` 用作文档中插图的图像
* `<figcaption></figcaption>` 元素为 figure 添加标题
    ```html
    <figure>
        <figcaption>黄浦江上的的卢浦大桥</figcaption>
        <img src="xxx.jpg"/>
    </figure>
    ```
* `<nav></nav>` nav 标签定义导航链接的部分。
* `<dfn></dfn>` dfn表示定义当前的词
* `<samp></samp>` 表示例子
* `<pre></pre>` 表示预格式化的文本,常见应用就是用来表示计算机的源代码。
* `<code></code>` 代码
## 3、HTML中的几种语法
* Element: `<tagname>...</tagname>`
* Text: `text`
* Comment: `<!--comments -->`
* DocumentType: `<!Doctype html>`
* ProcessingInstruction: `<?a 1?>`
* CDATA: `<![CDATA[ ]]>`

# 二、浏览器API
## 1、浏览器 API 的分类：
1. DOM API 大致会包含 4 个部分：
    - 节点 API：DOM 树形结构中的节点相关 API；
    - 事件 API：触发和监听事件相关 API；
    - Range API：操作文字范围相关 API；
    - 遍历 API：遍历 DOM 需要的 API；
        - 即，traversal系列，不建议用。
2. CSS OM
3. 其他：提供 API 的主要标准化组织
    - khronos
        - WebGL
    - ECMA
        - ECMAScript
    - WHATWG
        - HTML
    - W3C
        - webaudio
        - CG/WG
## 2、DOM API——节点

DOM 的树形结构所有的节点有统一的接口 Node，DOM (Document Object Model，文档对象模型)，是 HTML 文档节点的 javascript 运行时模型。

![DOM 树中节点类型的继承关系](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week13/img/node-api.png "DOM 树中节点类型的继承关系")

在这些节点中，除了 Document 和 DocumentFrangment，都有与之对应的 HTML 写法，我们可以看一下。

```html
Element: <tagname>...</tagname>
Text: textComment: <!-- comments -->
DocumentType: <!Doctype html>
ProcessingInstruction: <?a 1?>
```

我们在编写 HTML 代码并且运行后，就会在内存中得到这样一棵 DOM 树，HTML 的写法会被转化成对应的文档模型，而我们则可以通过 JavaScript 等语言去访问这个文档模型。这里我们每天都需要用到，**要重点掌握的是：Document、Element、Text 节点**。

DocumentFragment 也非常有用，它常常被用来高性能地批量添加节点。

因为 Comment、DocumentType 和 ProcessingInstruction 很少需要运行时去修改和操作，所以有所了解即可。

1. 节点的导航操作

    Node 是 DOM 树继承关系的根节点，它定义了 DOM 节点在 DOM 树上的操作，首先，Node 提供了一组属性，来表示它在 DOM 树中的父、子、邻居关系关系，它们是：

    - parentNode
    - childNodes
    - firstChild
    - lastChild
    - nextSibling
    - previousSibling
2. 操作 DOM 树的节点

    所有这几个修改型的 API，全都是在父元素上操作的，比如我们要想实现“删除一个元素的上一个元素”，必须要先用 parentNode 获取其父元素。这样的设计是符合面向对象的基本原则的。“拥有哪些子元素”是父元素的一种状态，所以修改状态，应该是父元素的行为。这个设计我认为是 DOM API 中好的部分。

    - appendChild：向元素添加新的子节点，作为最后一个子节点。
    - insertBefore：在指定的已有的子节点之前插入新节点。
    - removeChild：从元素中移除子节点。
    - replaceChild：替换元素中的子节点。
3. 创建节点

    DOM 标准规定了节点必须从文档的 create 方法创建出来，不能够使用原生的 JavaScript 的 new 运算。于是 document 对象有这些方法：

    - createElement
    - createTextNode
    - createCDATASection
    - createComment
    - createProcessingInstruction
    - createDocumentFragment
    - createDocumentType
4. 节点高级API
    - compareDocumentPosition 是一个用于比较两个节点中关系的函数。
    - contains 检查一个节点是否包含另一个节点的函数。
    - isEqualNode 检查两个节点是否完全相同。
    - isSameNode 检查两个节点是否是同一个节点，实际上在 JavaScript 中可以用“===”。
    - cloneNode 复制一个节点，如果传入参数 true，则会连同子元素做深拷贝。
5. 元素的属性
    可以把元素的 Attribute 当作字符串来看待，这样就有以下的 API：
    - getAttribute
    - setAttribute
    - removeAttribute
    - hasAttribute
    
    还可以把 Attribute 当作节点：
    
    - getAttributeNode
    - setAttributeNode
    
    还可以使用 attributes 对象
    
    - 比如 document.body.attributes.class = “a” === document.body.setAttribute(“class”, “a”)。
6. 查找元素

    document 节点提供了查找元素的能力。比如有下面的几种：

    - querySelector
    - querySelectorAll
    - getElementById
    - getElementsByName
    - getElementsByTagName
    - getElementsByClassName
    
    我们需要注意，getElementById、getElementsByName、getElementsByTagName、getElementsByClassName，这几个 API 的性能高于 querySelector。而 getElementsByName、getElementsByTagName、getElementsByClassName 获取的集合并非数组，而是一个能够动态更新的集合。

## 3、DOM API——事件
1. 监听事件
    - 监听事件的 API：EventTarget.addEventListener()
    - addEventListener 有三个参数：
        - 事件名称；
        - 事件处理函数；
        - 捕获还是冒泡。
        ```js
        target.addEventListener(type, listener [, useCapture]);
        ```
    - 第三个参数不一定是 bool 值，也可以是个对象，它提供了更多选项:
        - once：只执行一次。
        - passive：承诺此事件监听不会调用 preventDefault，这有助于性能。
        - useCapture：是否捕获（否则冒泡）。
        ```js
        target.addEventListener(type, listener [, options]);
        ```

    >https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget
    >https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
    >https://developer.mozilla.org/zh-CN/docs/Web/Events

2. 捕获与冒泡
    - 捕获：计算机处理事件的逻辑
        - 实际上点击事件来自触摸屏或者鼠标，鼠标点击并没有位置信息，
        - 但是一般操作系统会根据位移的累积计算出来，跟触摸屏一样，提供一个坐标给浏览器。
        - 那么，把这个坐标转换为具体的元素上事件的过程，就是捕获过程了。
    - 冒泡：人类处理事件的逻辑
        - 冒泡是确定了发生了事件的元素后，从 DOM 树层级中由内向外，向根节点方向触发。
        - 冒泡过程，则是符合人类理解逻辑的：当你按电视机开关时，你也按到了电视机。
    - 在一个事件发生时，捕获过程跟冒泡过程总是先后发生，跟你是否监听毫无关联。
    - 实际监听事件时，我建议这样使用冒泡和捕获机制：
        - 默认使用冒泡模式，当开发组件时，遇到需要父元素控制子元素的行为，可以使用捕获机制。
    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>捕获和冒泡</title>
            <meta name="description" content="">
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
            <div
                id="outer"
                style="background-color:green;width:100%;height:200px;opacity: 0.8;color:white"
            >
                outer
                <div
                    id="inner"
                    style="background-color: red;width:100%;height:100px;opacity: 0.7;"
                >
                    inner
                </div>
            </div>
            <script>
                var outer = document.getElementById("outer");
                var inner = document.getElementById("inner");

                outer.addEventListener("click", () => {
                    console.log("冒泡1：outer")
                });
                inner.addEventListener("click", () => {
                    console.log("冒泡1：inner")
                });
                // 仅上方两个事件时，打印顺序如下：
                // 冒泡1：inner
                // 冒泡1：outer

                inner.addEventListener("click", () => {
                    console.log("捕获2：inner")
                }, true);
                outer.addEventListener("click", () => {
                    console.log("捕获2：outer")
                }, true);
                // 仅上方四个事件时，打印顺序如下：
                // 捕获2：outer
                // 冒泡1：inner
                // 捕获2：inner
                // 冒泡1：outer

                inner.addEventListener("click", () => {
                    console.log("冒泡3：inner")
                });
                // 仅上方五个事件时，打印顺序如下：
                // 捕获2：outer
                // 冒泡1：inner
                // 捕获2：inner
                // 冒泡3：inner
                // 冒泡1：outer
                
            </script>
        </body>
    </html>
    ```
## 4、DOM API——Range

Range API 是一个比较专业的领域，如果不做富文本编辑类的业务，不需要太深入。

Range API 表示一个 HTML 上的范围，这个范围是以文字为最小单位的，所以 Range 不一定包含完整的节点，它可能是 Text 节点中的一段，也可以是头尾两个 Text 的一部分加上中间的元素。

通过 Range API 可以比节点 API 更精确地操作 DOM 树，凡是 节点 API 能做到的，Range API 都可以做到，而且可以做到更高性能，但是 Range API 使用起来比较麻烦，所以在实际项目中，并不常用，只有做底层框架和富文本编辑对它有强需求。

1. Range 选择范围的一些方法
    - range.setStartBefore
    - range.setEndBefore
    - range.setStartAfter
    - range.setEndAfter
    - range.selectNode
    - range.selectNodeContents
2. range的完整用法
    - 例子展示了如何使用 range 来取出元素和在特定位置添加新元素。
    ```js
    var range = new Range(),
        firstText = p.childNodes[1],
        secondText = em.firstChild;

        range.setStart(firstText, 9); // do not forget the leading space
        range.setEnd(secondText, 4);

        var fragment = range.extractContents();

        range.insertNode(document.createTextNode("aaaa"));
    ```
3. 使用range将元素的子元素终极逆序(操作DOM)
    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>DOM的子元素逆序</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
            <!--
                考点一：DOM的集是living状态
                    - 最后一个元素挪走，不会影响之前的元素，可以直接在living collection上操作，不用再使用数组；
                考点二：元素的子元素insert时候不需要先从原来的位置挪走，子元素进行insert操作时若已经在DOM树上，底层会先将其remove下来，再append到新的树上；
            -->
            <div id="a">
                <p>1</p>
                <h>2</h>
                <p>3</p>
                <div>4</div>
            </div>
            <script>
                let element = document.getElementById("a");

                /**
                * 方法一：使用数组
                * 缺点：代码冗余、效率低
                * ======================================================================================================
                * **/
                function reverseChildren1(element) {
                    let children = Array.prototype.slice.call(element.childNodes);
                    
                    element.innerHTML = "";

                    // for (const child of children) {
                    //     element.removeChild(child)
                    // }

                    children.reverse();

                    for (const child of children) {
                        element.appendChild(child);
                    }
                }

                /**
                * 方法二：直接living collection上操作
                * ======================================================================================================
                * **/
                function reverseChildren2(element) {
                    var l = element.childNodes.length;
                    while(l -- > 0) {
                        element.appendChild(element.childNodes[l])
                    }
                }

                /**
                * 终极方法
                * 方法三：使用fragment减少树的DOM操作
                * ======================================================================================================
                * **/
                function reverseChildren3(element) {
                    let range = new Range();
                    range.selectNodeContents(element);
                    let fragment = range.extractContents();
                    var l = fragment.childNodes.length;
                    while(l -- > 0) {
                        fragment.appendChild(fragment.childNodes[l]);
                    }
                    element.appendChild(fragment);
                }

                reverseChildren3(element)
            </script>
        </body>
    </html>
    ```
## 4、CSSOM

正如 HTML 和 CSS 分别承担了语义和表现的分工，DOM 和 CSSOM 也有语义和表现的分工。

CSSOM 是 CSS 的对象模型，在 W3C 标准中，它包含两个部分：

- 描述样式表和规则等 CSS 的模型部分（CSSOM）；
- 跟元素视图相关的 View 部分（CSSOM View）；
### 4-1 CSSOM 的本体
1. 创建样式表：使用 HTML 标签来做到，我们用 style 标签和 link 标签创建样式表，例如：
    ```html
    <style title="Hello">
    a {
    color:red;
    }
    </style>
    <link rel="stylesheet" title="x" href="data:text/css,p%7Bcolor:blue%7D">
    ```
2. 获取文档中所有的样式表：
    ```js
    document.styleSheets
    ```
3. 针对样式表的操作:
    - 查看：`document.styleSheets[0].cssRules[*]`
    - 增加：`document.styleSheets[0].insertRule("p { color:pink; }", 0)`
    - 移除：`document.styleSheets[0].removeRule(0)`
    - 修改 property 和 value：`document.styleSheets[0].cssRules[0].style.color = 'red'`
    - 修改选择器：`document.styleSheets[0].cssRules[0].selectorText = '*'`
4. CSSOM 还提供了一个非常重要的方法，来获取一个元素最终经过 CSS 计算得到的属性：`window.getComputedStyle(elt, pseudoElt);`
    - 其中第一个参数就是我们要获取属性的元素;
    - 第二个参数是可选的，用于选择伪元素。
### 4-2 CSSOM View
CSSOM View 这一部分的 API，可以视为 DOM API 的扩展，它在原本的 Element 接口上，添加了显示相关的功能，这些功能，又可以分成三个部分：
1. ***窗口部分:***窗口 API窗口 API 用于操作浏览器窗口的位置、尺寸等。
    - moveTo(x, y) 窗口移动到屏幕的特定坐标；
    - moveBy(x, y) 窗口移动特定距离；
    - resizeTo(x, y) 改变窗口大小到特定尺寸；
    - resizeBy(x, y) 改变窗口大小特定尺寸。
2. ***滚动部分:***要想理解滚动，首先我们必须要建立一个概念，在 PC 时代，浏览器可视区域的滚动和内部元素的滚动关系是比较模糊的，但是在移动端越来越重要的今天，两者必须分开看待，两者的性能和行为都有区别。
    - ***视口滚动 API:***可视区域（视口）滚动行为由 window 对象上的一组 API 控制
        - scrollX 是视口的属性，表示 X 方向上的当前滚动距离，有别名 pageXOffset；
        - scrollY 是视口的属性，表示 Y 方向上的当前滚动距离，有别名 pageYOffset；
        - scroll(x, y) 使得页面滚动到特定的位置，有别名 scrollTo，支持传入配置型参数 {top, left}；
        - scrollBy(x, y) 使得页面滚动特定的距离，支持传入配置型参数 {top, left}。
        
        通过这些属性和方法，我们可以读取视口的滚动位置和操纵视口滚动。

        示例：https://www.nhooo.com/run/js_win_scrollX_scrollY.html

        不过，要想监听视口滚动事件，我们需要在 document 对象上绑定事件监听函数：
        
        ```js
        document.addEventListener("scroll", function(event){ //......})
        ```
        视口滚动 API 是页面的顶层容器的滚动，大部分移动端浏览器都会采用一些性能优化，它和元素滚动不完全一样，请大家一定建立这个区分的意识。
    - **元素滚动 API**
        - scrollTop 表示 Y 方向上的当前滚动距离；
        - scrollLeft 表示 X 方向上的当前滚动距离；
        - scrollWidth 表示元素内部的滚动内容的宽度，一般来说会大于等于元素宽度；
        - scrollHeight 表示元素内部的滚动内容的高度，一般来说会大于等于元素高度；
        - scroll(x, y) 使得元素滚动到特定的位置，有别名 scrollTo，支持传入配置型参数 {top, left}；
        - scrollBy(x, y) 使得元素滚动到特定的位置，支持传入配置型参数 {top, left}；
        - scrollIntoView(arg) 滚动元素所在的父元素，使得元素滚动到可见区域，可以通过 arg 来指定滚到中间、开始或者就近。
        
        除此之外，可滚动的元素也支持 scroll 事件，我们在元素上监听它的事件即可：
        ```js
        element.addEventListener("scroll", function(event){
        //......
        })
        ```
3. ***布局部分***:这是整个 CSSOM 中最常用到的部分，我们同样要分成全局 API 和元素上的 API。
    - ***全局尺寸信息***:window 对象上提供了一些全局的尺寸信息，它是通过属性来提供的
        - **window.innerHeight, window.innerWidth 这两个属性表示视口的大小;**
        - window.outerWidth, window.outerHeight 这两个属性表示浏览器窗口占据的大小，很多浏览器没有实现，一般来说这两个属性无关紧要;
        - **window.devicePixelRatio 这个属性非常重要，表示物理像素和 CSS 像素单位的倍率关系，Retina 屏这个值是 2，后来也出现了一些 3 倍的 Android 屏;**
        - window.screen （屏幕尺寸相关的信息）window.screen.width, window.screen.height 设备的屏幕尺寸;
        - window.screen.availWidth, window.screen.availHeight 设备屏幕的可渲染区域尺寸，一些 Android 机器会把屏幕的一部分预留做固定按钮，所以有这两个属性，实际上一般浏览器不会实现的这么细致;
        - window.screen.colorDepth, window.screen.pixelDepth 这两个属性是固定值 24，应该是为了以后预留;
        
        虽然 window 有这么多相关信息，在我看来，我们主要使用的是 innerHeight、innerWidth 和 devicePixelRatio 三个属性，因为我们前端开发工作只需要跟视口打交道，其它信息大概了解即可。
    - ***元素的布局信息:***我们是否能够取到一个元素的宽（width）和高（height）呢？实际上，我们首先应该从脑中消除“元素有宽高”这样的概念，有些元素可能产生多个盒，事实上，***只有盒有宽和高，元素是没有的***。所以我们获取宽高的对象应该是“盒”，于是 CSSOM View 为 Element 类添加了两个方法：
        - getClientRects()
            - getClientRects 会返回一个列表，里面包含元素对应的每一个盒所占据的客户端矩形区域，这里每一个矩形区域可以用 x, y, width, height 来获取它的位置和尺寸。
        - getBoundingClientRect()
            - getBoundingClientRect ，这个 API 的设计更接近我们脑海中的元素盒的概念，它获取元素的整体盒子的信息，这个 API 获取的区域会包括当 overflow 为 visible 时的子元素区域。
