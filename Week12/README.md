# 重学css（二）
## 一、css排版
### 1、盒
#### （1）区分标签 ( Tag )、元素 (Element)、盒 ( Box )的概念
* 标签 ( Tag ) —— 源代码
* 元素 (Element) —— 语义
* 盒 ( Box ) —— 表现
>HTML 代码中可以书写开始**标签**，结束**标签**，和自封闭**标签**。

标签是一个源代码的概念，所以在 HTML 代码中写的肯定都是标签。

>一对起止**标签**，表示一个**元素**。

元素是存在我们脑子里的一个概念，它是语义领域的一个概念，所以一对起止标签它一定是表示一个我们脑子里面的概念。

>DOM 树中存储的是**元素**和其他类型的节点 ( Node )。

DOM 树中存储的不全是元素，因为DOM 树中存储的东西叫节点 Node，所以元素只是是节点的一种。

比如说我们的文本节点也是节点，但他并不是元素。再比如我们的注释节点，它也是节点但是它也不是元素。当然还有 CDATA 节点，还有 processing-instruction，DTD等这些都是会存入 DOM 树的，当时它们都并不是元素。

很多同学的理解，DOM 树中存储的都是元素，不过这样也没有错。因为其他的节点相对来说都没有那么重要。

>CSS 选择器中的是**元素**。

其实这里还可以加一个 "或"，在《CSS 选择器》中讲到的，CSS 选择器选中的是元素或者是伪元素。

>CSS 选择器中的**元素**，在排版时可能产生多个**盒**。

这个地方是大家需要注意到的一个概念，CSS 选择器选中的元素，它不一定和盒是一一对应的关系。它有可能是一对多的关系的。但是有盒一般来说必定是有对应的元素的。

我们不可能无中生有产生一个元素，即使是号称是无中生有的伪元素也是依附于一个选中的元素产生的。

>排版和渲染的基本单位是**盒**

在实际上我们很多元素都会产生多个盒。

比如说 inline 元素就会因为分行而产生多个盒。又比如说带有伪元素，被伪元素选择器选中的元素也会生成多个盒。所以我们排版盒渲染的基本单位都是盒。

#### （2）盒模型
* 盒模型是一个多层的结构，从里面到外面分为：
    - 最里面就是content，也就是我们的内容；
    - content 到 border 之间有一个圈空白，这个圈叫做 padding，也就是内边距；
    - Border 的外面又有一个圈空白叫 margin，也就是外边距；
    - padding 主要影响的是盒内的空间;
        - 主要决定盒内的空间排布，也就是 content 区域的大小；
    - margin 主要影响的是盒外的空间;
        - 决定了盒周围空白区域的大小；
    - 盒子占用的空间 = content 的大小 + padding 的大小 + border 的大小 + margin 的大小；
* 盒模型里面的 宽 (width) 是有讲究的，盒子的宽度是有可能被 box-sizing 属性所影响的。最常见的两个值就是：
    - content-box
        - 设置的 width 属性只包含 content 的内容的空间；
    - border-box
        - width 就包含了 padding 和 border 的尺寸；

### 2、正常流
#### CSS 排版的三代的排版技术：
1. 第一代就是正常流；
2. 第二代就是基于 Flex 的排版；
3. 第三代就是基于 Grid 的排版；
4. 结合最近推出的 CSS Houdini，可能更接近的是 3.5 代，它是一种完全自由的，允许使用 JavaScript 干预的排版；
目前主流都是在使用 flex 布局。相比 flex，其实正常流并没有变得更简单，反而是更复杂了。不过挺有意思的是，flex 它比前面的第一代的排版技术要简单，比他后面一代的 grid 也简单。个人认为 flex 是最简单并且最容易理解的一代排版技术。正常流呢，其实它能力最差，但是反而他的机制很复杂。

#### 排版
在很多文章中，我们会把layout翻译成排版，有时候也会翻译成布局。但个人也觉得翻译成排版是最贴切的。因为 CSS 当中的layout是源自于传统的排版技术。

传统的排版方式，我们需要先把字版放入一个一个字框里面，按照文字的顺序排列好，然后再把这些字框一个一个的排列进我们的排版框里面。 所以所谓排版就给我们所有可见的东西放到正确的位置上去。而在 HTML 里面，我们是有 "盒" 这样一个东西，在 CSS 的排版里我们只排两样东西：
* 盒
* 文字

#### 正常流
> **从左到右，从上到下**就是我们说的 "正常流 ( Normal Flow )"，所以正常流为什么正常呢？

因为正常流与我们平时书写文字的习惯一致。无论是中文也好，英文也好，它们都是遵循这种自然的排版方式的。

> 但正常流里面，有很多特别不正常的东西，特别的反直觉，反人类的东西。为什么这么奇怪的东西要叫正常流呢？

追溯到 HTML 最早期整个的排版设计，都是从文字出版行业过来的专家所做的。所以它使用的思路都是那个时代的一个专业的思路。跟我们自然人脑子里面的理解，可能就会有一些差异了。

#### 正常流排版
1. 收集盒与文字进行;
2. 计算盒与文字在行中的排布;
3. 计算行与行之间的排布;
> 所有的排版算法，基本上都是差不多的。不论是哪个软件，哪个规则，它们都是这么几个步骤。

#### 两种排布规则
1. 块级排布的我们就叫 BFC —— Block level formatting context (块级格式化上下文)；
2. 行内排布的我们就叫 IFC —— Inline level formatting context (行内级格式化上下文)；

### 3、正常流的行级排布
1. 行内盒是默认与基线对齐
    - 即，盒的下边缘会和文字的基线去做对齐；
2. 当一个盒子里面有文字的时候，这个盒子的对齐就会基于里面文字的基线做对齐；
3. 大部分情况下是不建议大家给行内盒使用基线对齐（默认对齐）；

### 4、正常流的块级排布
#### Float 和 Clear
> * Float
> 1. 正常流里的块盒元素，先按照正常流排到页面的某一个位置;
> 2. 然后在块盒元素的属性中添加 float 时，这个块盒元素就会朝着 float 属性定义的方向去挤；
> 3. 遇到同样的float元素或者挤的到达边界，停止挤，固定位置；
> 4. 然后正常流里的其它元素，会让出所有float元素的宽度和的宽度，再进行正常流的排布；
> 5. 很多情况下，DOM构建完成后，接下来渲染css样式的时候，float会导致重排，影响性能，也是如今不推荐float的原因；
> 故float显著特征为：会影响仍在正常流里排布的盒的尺寸。

* 同一方向float的几个元素，会根据每个元素水平线的高度起始不同，相互影响，产生杂乱堆叠的效果，因此出现了clear使堆叠元素强制换行；

> * Clear
> 1. 有的翻译为清楚浮动，其实本质是找一个干净的空间执行浮动；
> 2. `clear:right`:在父级盒右侧的垂直空间内，在当前行盒水平高度的基础上，找到还未被float占据的空间，占位，使自身摆脱堆叠效果；
> 3. float 是不认 <br/> 的，如果在一个 float 元素的后面加入 <br/> 是无法让他强制换行的；
>   - 因为 br 是正常流的换行，float 只会下移一个行内元素的高度，再换行，针对其他的float元素是没有效的;
> 4. 若要使某个正在float的元素换行，需要使用`clear:right/left`清楚该元素的浮动；

#### Margin 折叠（Margin Collapse、留白折叠、边距折叠）
> 1. 在一个从上往下排布的 BFC 里面，有一个元素它有 margin-bottom，接着下面还有一个元素，它有 margin-top；
> 2. 这两个元素的 margin 是会叠加的，最后叠出来的高度跟两者中最大的 margin 的那一个高度相等；

其实这个是一个排版里面的要求，因为在我们的排版当中，任何一个元素，它的盒模型里面所谓的 margin "只是要求周围有这么多的空间是留白的，而不会说要求元素与元素之间的边距格子都有相对应的空白"。所以只要元素的周围的留白的空间够了，自然就是一个合理的排版方式。

> **注意：**Margin Collapse 只会发生在 BFC 里面。它不会发生在 IFC 或者其他的排版方式里面，比如说 flex、grid 等都不会有 Margin Collapse 的。
> 所以 ***只有正常流中的 BFC 会发生边距折叠！***

### 5、BFC合并
1. Block (块)
    - Block Container：
        - 是在 CSS2.1 标准里面定义的；
        - 里面能装 BFC 的盒；
        - 能容纳正常流的盒，里面就有 BFC；
    - Block-level Box
        - 外面有 BFC 的盒；
        - 也就是说它能够被放入 BFC 的这种盒子里；
    - Block Box = Block Container + Block-level Box
        - 就是上面两个之和；
        - 里外都有 BFC 的盒；
2. Block Container ——————基本上是一些 display 的效果：
    - block
    - inline-block
    - table-cell —— 里面都是正常流，但是 table-row 就不是 block container 了，因为它里面是 table-cell，所以不可能是正常流;
    - flex item —— display: flex 的元素不是 block container，但是 flex 的子元素 flex item 如果它们没有特殊的 display 属性的话它们都是 block container;
    - grid cell —— grid 也是有 cell 的，所有 grid 的 cell 默认也都是 block container
    - table-caption —— table 中有 table-caption (表格标题)，它里面也是正常流

> 任何一个元素里面只要不是特殊 display 模式的，它里面默认就是正常流。

3. Block-level Box
    - 大多数的元素的 display 的值都是有一对的。一个是 block-level 的，一个是 inline-level 的;

4. 以下情况下会设立 BFC:
    - floats —— 浮动的元素里面就是一个正常流，所以会创建 BFC;
    - Absolutely positioned elements —— 绝对定位的元素里面也会创建 BFC，position的值不为relative和static;
    - block containers (such as inline-blocks, table-cells, and table-captions) that are not block boxes —— 是 block container 但不是 block box (即，不是 block-level ) 会创建 BFC，包括以下：
        - inline-blocks
        - table-cells
        - table-captions
        - Flex items
        - grid cell
        - 等等...
    - and block boxes with overflow other than visible —— 拥有 overflow 属性，但是不是 visible 的 block box （即，overflow的值为auto,scroll或hidden）会创建 BFC；

> 能容纳正常流的盒，我们都认为它们会创建 BFC，但是只有一种情况例外：就是 block box 里外都是 BFC 并且 overflow 是 visible。
>   - 用公式来记就是这个："block box && overflow:visible";
>   - 这个其实是非常合理的，它里外都是 BFC 而且它的 overflow 是 visible，就相当于没有 BFC 了，所以这个时候会发生 BFC 合并；

5.  BFC合并
* block box && overflow:visible
    - BFC合并与float
    - BFC合并与边距折叠

6. BFC合并与float

    正常的来讲我们放一个 block box 它的 overflow 不是 visible，这个时候它会创建 BFC 并且整个 block box 放进 BFC 里面。那么整个就会受 BFC 影响，如果不创建 BFC它里面的行盒就会受 float 的影响。

    下来我们用一段代码来看看其中的现象：

    ```html
    <style>
    .float-box {
        float: right;
        width: 100px;
        height: 100px;
        background-color: aqua;
        margin: 20px;
    }
    .text {
        background-color: #2d2f42;
        color: #ededed;
        overflow: visible;
        margin: 30px;
    }
    </style>

    <div class="float-box"></div>
    <div class="text">
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    </div>
    ```

    > ***这里因为我们的 text 盒子给予了 overflow: visible，所以这个 overflow 属性值是不满足创建 BFC 的条件的。所以我们的文字的盒子就会像不存在一样，文字就会环绕着外面的 float-box 元素来进行排布。***

    如果我们把 overflow 的属性值改为 hidden 的话，那么 text 的盒子就会建立 BFC。

    ```html
    <style>
    .float-box {
        float: right;
        width: 100px;
        height: 100px;
        background-color: aqua;
        margin: 20px;
    }
    .text {
        background-color: #2d2f42;
        color: #ededed;
        overflow: hidden;
        margin: 30px;
    }
    </style>

    <div class="float-box"></div>
    <div class="text">
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字 文字
    </div>
    ```

    > ***这里我们就很明显的可以看见一个变化，text 的元素整体作为一个 block level 的元素被排进了 BFC 里面。也就是说这个时候 text 元素的宽度整个围绕着 float-box 元素来进行排布了。***

7. BFC 合并与边距折叠
    边距折叠只会发生在同一个 BFC 里面。如果创建了新的 BFC 的话，它就不会发生边距折叠。如果没有创建 BFC 的话，它就存在着一个同向边距折叠。

    同样我们用一段代码的实例来试验一下：

    ```html
    <style>
    .box {
        width: 100px;
        height: 100px;
        background-color: aqua;
        margin: 20px;
    }
    .overflow-box {
        overflow: visible;
        background-color: pink;
        margin-top: 30px;
    }
    .box {
        width: 100px;
        height:100px;
        background-color: aqua;
        margin: 20px;
    }
    </style>

    <div class="box"></div>
    <div class="overflow-box">
        <div class="box"></div>
    </div>
    ```

    > ***此时box、overflow-box、box三个元素处在body的BFC中，出现了三个元素同时边距折叠；***

    如果我们把 overflow 的属性值改为 hidden 的话，那么 overflow-box 的盒子就会建立 BFC。

    ```html
    <style>
    .box {
        width: 100px;
        height: 100px;
        background-color: aqua;
        margin: 20px;
    }
    .overflow-box {
        overflow: visible;
        background-color: pink;
        margin-top: 30px;
    }
    .box {
        width: 100px;
        height:100px;
        background-color: aqua;
        margin: 20px;
    }
    </style>

    <div class="box"></div>
    <div class="overflow-box">
        <div class="box"></div>
    </div>
    ```

    > ***此时粉色盒子overflow-box内部建立BFC，粉色盒子overflow-box内部的box盒子边距折叠消失，最顶部的box与粉色overflow-box仍处于body的盒子中，故这两个元素仍然存在边距折叠；***

### 6、flex排版
1. Flex 的排版逻辑还是分为三步：
    - 收集盒进行;
    - 计算盒在主轴方向的排布;
    - 计算盒在交叉轴方向的排布;
    > 对 flex 排版来说，是没有文字的，所以说 flex 排版是收集所有的盒进行。因为 flex 它是可以调整排布的方向的，所以我们不会用正常的 top、left、bottom、right 的体系去描述。而是用主轴和交叉轴去描述的。
2. 分行
    - 根据主轴尺寸，把元素分进行;
    - 每加入一个元素到当前行，我们就会让它与行剩余的空间去做比较;
    - 如果当前行已经满了，就创建一个新行，把新元素放到下一行;
    - 若设置了 no-wrap，则强制分配进入第一行。（到计算主轴的时候，我们再去处理这些溢出的部分）;
3. 计算主轴方向
    - 找出所有 Flex 元素;
    - 把主轴方向的剩余尺寸按比例分配给这些元素;
    - 若剩余空间为负数，所有 flex 元素为 0，等比压缩剩余元素;
    > Flex 里面有一个 Flex 属性的，Flex 为 1 就分一份，Flex 为 2 就分两份，如果我们这一行剩余空间是 300px，那么分一份的会分到 100px，而分两份的就会得到 200px。
    > 如果剩余空间为负数，所有带 flex 属性的元素都会被置为 0。然后把剩余的那些元素做等比压缩。 
4. 计算交叉轴方向
    - 根据每一个行最大元素尺寸计算行高;
    - 根据行高、flex-align(元素的属性)、align-items(容器属性定义交叉轴对齐) ，确定元素具体位置;

## 二、css动画与绘制
### 1、动画
1. Transition全属性使用
    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                /* transition全写 */
                .demo1 {
                    width:100px;
                    height:100px;
                    background:rgb(7, 7, 7);
                    transition-property:width;
                    transition-duration:1s;
                    transition-timing-function:linear;
                    transition-delay:2s;
                    /* Firefox 4 */
                    -moz-transition-property:width;
                    -moz-transition-duration:1s;
                    -moz-transition-timing-function:linear;
                    -moz-transition-delay:2s;
                    /* Safari and Chrome */
                    -webkit-transition-property:width;
                    -webkit-transition-duration:1s;
                    -webkit-transition-timing-function:linear;
                    -webkit-transition-delay:2s;
                    /* Opera */
                    -o-transition-property:width;
                    -o-transition-duration:1s;
                    -o-transition-timing-function:linear;
                    -o-transition-delay:2s;
                }

                /* transition简写 */
                .demo2 {
                    width:100px;
                    height:100px;
                    background:yellow;
                    transition:width 1s linear 2s;
                    /* Firefox 4 */
                    -moz-transition:width 1s linear 2s;
                    /* Safari and Chrome */
                    -webkit-transition:width 1s linear 2s;
                    /* Opera */
                    -o-transition:width 1s linear 2s;
                }

                div:hover {
                    width:200px;
                }
            </style>
        </head>
    <body>

    <div class="demo1"></div>
    <div class="demo2"></div>

    <p>请把鼠标指针放到黄色的 div 元素上，来查看过渡效果。</p>

    <p><b>注释：</b>本例在 Internet Explorer 中无效。</p>

    <p><b>注释：</b>这个过渡效果会在开始之前等待两秒。</p>

    </body>
    </html>
    ```
2. Animation全属性使用
    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                /* animation简写 */
                .div1
                {
                width:100px;
                height:100px;
                background:red;
                position:relative;
                animation:myfirst 5s linear 2s infinite alternate;
                /* Firefox: */
                -moz-animation:myfirst 5s linear 2s infinite alternate;
                /* Safari and Chrome: */
                -webkit-animation:myfirst 5s linear 2s infinite alternate;
                /* Opera: */
                -o-animation:myfirst 5s linear 2s infinite alternate;
                }

                /* animation全写 */
                .div2
                {
                width:100px;
                height:100px;
                background:red;
                position:relative;
                animation-name:myfirst;
                animation-duration:5s;
                animation-timing-function:linear;
                animation-delay:2s;
                animation-iteration-count:infinite;
                animation-direction:alternate;
                animation-play-state:running;
                /* Firefox: */
                -moz-animation-name:myfirst;
                -moz-animation-duration:5s;
                -moz-animation-timing-function:linear;
                -moz-animation-delay:2s;
                -moz-animation-iteration-count:infinite;
                -moz-animation-direction:alternate;
                -moz-animation-play-state:running;
                /* Safari and Chrome: */
                -webkit-animation-name:myfirst;
                -webkit-animation-duration:5s;
                -webkit-animation-timing-function:linear;
                -webkit-animation-delay:2s;
                -webkit-animation-iteration-count:infinite;
                -webkit-animation-direction:alternate;
                -webkit-animation-play-state:running;
                /* Opera: */
                -o-animation-name:myfirst;
                -o-animation-duration:5s;
                -o-animation-timing-function:linear;
                -o-animation-delay:2s;
                -o-animation-iteration-count:infinite;
                -o-animation-direction:alternate;
                -o-animation-play-state:running;
                }

                @keyframes myfirst
                {
                0%   {background:red; left:0px; top:0px;}
                25%  {background:yellow; left:200px; top:0px;}
                50%  {background:blue; left:200px; top:200px;}
                75%  {background:green; left:0px; top:200px;}
                100% {background:red; left:0px; top:0px;}
                }

                @-moz-keyframes myfirst /* Firefox */
                {
                0%   {background:red; left:0px; top:0px;}
                25%  {background:yellow; left:200px; top:0px;}
                50%  {background:blue; left:200px; top:200px;}
                75%  {background:green; left:0px; top:200px;}
                100% {background:red; left:0px; top:0px;}
                }

                @-webkit-keyframes myfirst /* Safari and Chrome */
                {
                0%   {background:red; left:0px; top:0px;}
                25%  {background:yellow; left:200px; top:0px;}
                50%  {background:blue; left:200px; top:200px;}
                75%  {background:green; left:0px; top:200px;}
                100% {background:red; left:0px; top:0px;}
                }

                @-o-keyframes myfirst /* Opera */
                {
                0%   {background:red; left:0px; top:0px;}
                25%  {background:yellow; left:200px; top:0px;}
                50%  {background:blue; left:200px; top:200px;}
                75%  {background:green; left:0px; top:200px;}
                100% {background:red; left:0px; top:0px;}
                }
            </style>
        </head>
    <body>

    <p><b>注释：</b>本例在 Internet Explorer 中无效。</p>

    <div class="div1"></div>
    <div style="height: 200px"></div>
    <div class="div2"></div>

    </body>
    </html>
    ```
### 2、颜色
1. RGB
    - 眼睛里面有用于感觉颜色和感受强光的视锥细胞，那么视锥细胞我们只有 3 种。这三种视锥细胞分别能感应红、绿、蓝三原色的光。这是 RGB 颜色的来历；
    - 所以不管自然界的光有多复杂，最后给我们眼睛的刺激都只有三种。所以我们只要把红、绿、蓝三色配成一定的比例最后就能看成相应的颜色；
2. CMYK
    - 在印刷行业里面都会使用 品红、青、黄 三原色，也叫 CMY 色系，这也是像小时候学的红、蓝、黄三原色的由来；
    - 我们会发现在印刷行业用的不是 CMY 颜色，而是 CMYK 颜色；
    - 彩色的颜料相对比较贵，想调出黑色的话，需要把 CMY 颜色都混合到一起才能出这个黑色；
    - 不过黑色（K）本来就是一种非常便宜的油墨，而品红、青和黄都是非常昂贵的油墨；
    - 为了使用最低成本的去节约油墨。凡是需要颜色变暗一些的，我们就会使用这个 CMYK 里面的黑色(k)的墨去调配，故而形成CMYK;
3. HSL 与 HSV
    - 考虑到我们程序员的感受而考虑，又有了一种新的颜色的谱系：HSL 和 HSV；
    - H 就是 Hue 的缩写，表示的是 色相。首先我们有 6 种颜色拼成了一个色盘，然后我们可以通过 Hue 去指定一个在色盘中的角度，然后就可以指定这个颜色的色相。
    - S 就是 Saturation的缩写，表示的是 纯度。比如颜色里面的杂色的数量，颜色中的 S 越高，这个颜色就越鲜艳越纯。
    - L 就是 Lightness 的缩写，表示的是 亮度。
    - V 就是 Value，可以翻译成色值，但是在理论上它真正表示的是 Brightness 也就是 明度。
    - HSL 和 HSV 在很多的时候实际上几乎是完全等价的。但是唯一不一样的就是：
        - Value 到 100% 的时候颜色就会变成一个纯色
        - Lightness 就不一样了，它是一个上下对称的，Lightness 到 0% 的时候他是黑色，而到 100% 的时候就是纯白色。所以我们取一个颜色的纯色我们是需要取 Lightness 的中间值的。
    - > W3C 最后选择了 HSL
        - 如果我们想把整个的页面换一个颜色的风格的话，我们只需要统一的去更换色相 (Hue)即可。
        - 这样的话本身颜色的`明暗关系`和`颜色的鲜艳程度关系`都在改变颜色的同时得以保留。

### 3、绘制
* data:url + svg的官方用法
```html
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>data:url + svg的官方用法</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            .demo {
                height: 600px;
                width: 600px;
                background: url('data:image/svg+xml,<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg"><ellipse cx="300" cy="150" rx="200" ry="80" style="fill:rgb(200,100,50); stroke:rgb(0,0,100);stroke-width:2"/> </svg>');
            }
            .demo1 {
                height: 600px;
                width: 600px;
                background: url('data:image/svg+xml,<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg"><ellipse cx="240" cy="100" rx="220" ry="30" style="fill:purple"/><ellipse cx="220" cy="70" rx="190" ry="20" style="fill:lime"/><ellipse cx="210" cy="45" rx="170" ry="15" style="fill:yellow"/></svg>');
            }

        </style>
    </head>
    <body>
        <div class="demo"></div>
        <div class="demo1"></div>
    </body>
```