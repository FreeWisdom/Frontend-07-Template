# 浏览器的工作原理（一）
[状态机、HTTP请求](https://github.com/FreeWisdom/Frontend-07-Template/tree/main/Week08)
# 浏览器的工作原理（二）
[HTML解析、css计算](https://github.com/FreeWisdom/Frontend-07-Template/tree/main/Week09)
# 浏览器的工作原理（三）
> 之前我们完成了 CSS 的规则计算，其实就是计算了每个元素匹配中了那些 CSS 规则，并且把这些规则挂载到元素的 ComputedStyle 上面;
> 下一个目标就是根据浏览器的属性来进行排版（英文是 Layout，有时候也翻译成布局）。
## 六、排版
### 根据浏览器属性进行排版
1. flex（http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html）
* 此次浏览器的排版选择用 flex 为例来实现排版算法，至于为什么选择这个排版呢？因为它包含了三代的排版技术。
    - 第一代就是正常流 —— 包含了 position， display，flow；
    - 第二代就是 flex —— 这个就比较接近人的自然思维；
        - 那为什么我们选择了第二代来讲解这一部分呢？那是因为第二代的排版技术比较容易实现，而它的能力又不太差。既然我们只是实现一个模拟浏览器，也就让大家感受一下浏览器中的排版是怎么实现的即可。如果想要实现完整浏览器排版，那里面的逻辑就非常复杂了，这里就不一一实现了。
    - 第三代就是 grid —— 是一种更强大的排版模式；
    - "第四代"可能是 Houdini —— 是一组底层API，它们公开了 CSS 引擎的各个部分，从而使开发人员能够通过加入浏览器渲染引擎的样式和布局过程来扩展CSS。
* 在 flex 排版里面我们有纵排和横排两种，这两种排版方式都是受 flex 属性限制的，所以我们需要在宽高上做抽象；
* 排版里面有一个主轴，它是我们排版的时候主要的延伸方向（如果我们有多个元素，这些元素就会往这个主轴的方向排列）；
* 跟这个主轴相垂直就有一个交叉轴的方向，所以跟主轴垂直方向的属性都叫做交叉轴属性；
* 所以在 flex 排版，里面我们就需要根据 flex-direction 属性去设置主轴的延伸方向，然而交叉轴就是主轴垂直的另外的方向；
    - 如果 flex-direction 是 row：
        - 那么主轴的属性就是 width x left right 等属性，而交叉轴就是：height y top bottom等属性；
    - 如果 flex-direction 是 column 的时候，就刚好是相反的。
* 根据上面的这个抽象，我们在编写这个排版算法的时候就能去掉大量的 if 和 else 判断；
* 这也是一种 web 标准中也采用的一种抽象的描述方式；
2. 分析
    - 处理掉 flex-direction 和 wrap 相关的属性；
    - 重点就是把具体的 width, height, left, right, top, bottom 等属性给抽象成 main (主轴) 和 cross (交叉轴) 等属性；
3. 代码
> 文件：parser.js 的 emit 方法中，找到 endTag 的判断，然后在 stack.pop() 之前加入 layout(top) 函数。
> 因为我们的 parser.js 中的代码已经比较多了，所以把排版的代码放在 layout.js 中进行编写。
> 这里我们就要在头部引入这个 JavaScript 文件。
```js
function emit(token) {
  // 如果是开始标签
  if (token.type == 'startTag') {
    //...
  } else if (token.type == 'endTag') {
    // 校验开始标签是否被结束
    // 不是：直接抛出错误，是：直接出栈
    if (top.tagName !== token.tagName) {
      throw new Error('Parse error: Tag start end not matched');
    } else {
      // 遇到 style 标签时，执行添加 CSS 规则的操作
      if (top.tagName === 'style') {
        addCSSRule(top.children[0].content);
      }
      layout(top); // <==== 这里加入 layout 函数
      stack.pop();
    } else if (token.type === 'text') {
      // ...
    }

    currentTextNode = null;
}
```
> 文件：layout.js
```js
function getStyle(element) {
    if(!element.style) {
        //新增style对象用来添加最后计算出来的属性
        element.style = {};
    }

    for (const prop in element.computedStyle) {
        var p = computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;

        if(element.style[prop].toString().match(/^px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }

        if(element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }

    return element.style;
}

function layout(element) {
    
    // 如果没有 computedStyle 的可以直接跳过
    if (!element.computedStyle) return;

    // 对 Style 做一些预处理
    let elementStyle = getStyle(element);
    
    // 我们的模拟浏览器只做 flex 布局，其他的跳过
    if (elementStyle.display !== 'flex') return;

    // 过滤掉所有文本节点
    // 为了支持 flex 排版中的排序属性 order
    let items = element.children
        .filter(e => e.type === 'element')
        .sort((a, b) => {
        return (a.order || 0) - (b.order || 0);
        });

    let style = elementStyle;

    // 把所有 auto 和空的宽高变成 null 方便我们后面判断
    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') {
        style[size] = null;
        }
    });

    // 把 flex 排版的关键属性都给予默认值
    if (!style.flexDirection || style.flexDirection === 'auto') style.flexDirection = 'row';
    if (!style.alignItems || style.alignItems === 'auto') style.alignItems = 'stretch';
    if (!style.justifyContent || style.justifyContent === 'auto') style.justifyContent = 'flex-start';
    if (!style.flexWrap || style.flexWrap === 'auto') style.flexWrap = 'nowrap';
    if (!style.alignContent || style.alignContent === 'auto') style.alignContent = 'stretch';

    let mainSize, // 主轴长度
        mainStart, // 主轴开始方向
        mainEnd, // 主轴结束方向
        mainSign, // 主轴标记 +1: 就是叠加；-1: 就是叠减
        mainBase; // 主轴开始值

    let crossSize, // 交叉轴长度
        crossStart, // 交叉轴开始方向
        crossEnd, // 交叉轴结束方向
        crossSign, // 交叉轴标记 +1: 就是叠加，-1: 就是叠减
        crossBase; // 交叉轴开始值

    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    // 交叉轴反转的时候，直接调换 crossStart 和 crossEnd 的值
    if (style.flexWrap === 'wrap-reverse') {
        let dummy = crossStart;
        crossStart = crossEnd;
        crossEnd = dummy;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = +1;
    }
}

module.exports = layout;
```

### 收集元素进行
1. 分析：
    * 因为 flex 布局是把元素放到一行空间里面的，当一行的中所有子元素相加的尺寸超出了父级元素的尺寸时，因为空间不足就会把元素放入下一行里面。所以这里这个步骤就是把元素 “收集进每一行里面的逻辑”，为了方便我们后面计算元素而做的准备。
    * 这里要注意的是，flex 排版中还有一个 no-wrap 的属性可以控制分行特性的。如果设置了 no-wrap 我们收集元素进行时直接强行分配进第一行即可了。但是大部分情况默认都不是 no-wrap 的， 所以都是需要我们去动态分行的。
    * 第一行中首先依次加入元素 1，2，3。当我们加入到第 4 个元素的时候，我们发现元素超出了当前行，所以我们需要建立一个新行，然后把元素 4 放入新的一行中。所以在这个部分的代码逻辑就是这样，以此类推把所有元素按照这个逻辑放入 flex 的行中。接下来我们来看看实际的代码是怎么写的。
2. 代码实现：
> 文件：layout.js 中的 layout 函数
```js
/**
 * 元素排版
 * @param {*} element
 */
function layout(element) {
// ... 上一节的代码忽略 ...
// 我们在上一部分之后的代码开始写这一部分的代码

let isAutoMainSize = false;
// 如果是 auto 或者是空时，就是没有这尺寸
// 所以父元素的 flex 行尺寸是根据子元素的总和而定的
// 也就是说无论子元素有多少，都不会超出第一行，所以全部放入第一行即可
if (!style[mainSize]) {
    elementStyle[mainSize] = 0;
    for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let itemStyle = getStyle(item);
    if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== 0)
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
    }

    isAutoMainSize = true;
}

let flexLine = []; // 当前行
let flexLines = [flexLine]; // 所有 flex 行

let mainSpace = elementStyle[mainSize]; // 主轴尺寸
let crossSpace = 0; // 交叉轴尺寸

for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let itemStyle = getStyle(item);

    if (itemStyle[mainSize] === null) itemStyle[mainSize] = 0;

    // 如果当前元素拥有 flex 属性，那这个元素就是弹性的
    // 无论当前行剩余多少空间都是可以放下的
    if (itemStyle.flex) {
        flexLine.push(item);
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
        mainSpace -= itemStyle[mainSize];
        // 因为 Flex 行的高度取决于行内元素最高的元素的高度，所以这里取行内最好的元素
        if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0)
            crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
        flexLine.push(item);
    } else {
    // 如果子元素主轴尺寸大于父元素主轴尺寸，直接把子元素尺寸压成父元素相同即可
    if (itemStyle[mainSize] > style[mainSize]) itemStyle[mainSize] = style[mainSize];
    // 当前行不够空间放入当前子元素时
    if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
    } else {
        flexLine.push(item);
    }
    if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0)
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
    }
}

    flexLine.mainSpace = mainSpace;

    console.log(items);
}
```

### 计算主轴
1. 分析：
    * 找出所有 Flex 元素；
    * 把主轴方向的剩余尺寸按比例分配给这些元素；
    * 若剩余空间为负数，所有 flex 元素为 0， 等比例压缩剩余元素；
2. 代码实现：
> 文件：layout.js 中的 layout 函数
```js
function layout(element) {
    //…………

    /**
     * 计算主轴
    */
    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = style[crossSize] !== undefined ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
        // 等比伸缩比例 = 容器尺寸 / (容器尺寸 + 剩余空间)
        let scale = style[mainSize] / (style[mainSize] + abs(mainSpace));

        // 开始位置
        let currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            // 拥有 flex 属性的不参与等比伸缩
            if (itemStyle.flex)
                itemStyle[mainSize] = 0;

            // 其他元素都参与等比伸缩
            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            // 元素的开始位置 = currentMain （排列到当前元素时的开始位置）
            itemStyle[mainStart] = currentMain;

            // 元素结束位置 = 元素开始位置 + 方向标志（可能是 + / -）* 元素的尺寸
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];

            // 下一个元素的开始位置，就是当前元素的结束位置
            currentMain = itemStyle[mainEnd];
        }
    } else {
        flexLines.forEach(items => {
            let mainSpace = items.mainSpace;
            let flexTotal = 0;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let itemStyle = getStyle(item);
        
                if (itemStyle.flex !== null && itemStyle.flex !== void 0) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }
        
            if (flexTotal > 0) {
                // 证明拥有 flexible 元素
                // 那就可以把 mainSpace(容器剩余空间) 均匀分配给 flex 元素
                let currentMain = mainBase;
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);

                    // 把容器剩余空间，均匀分配给 flex 元素
                    if (itemStyle.flex)
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;

                    // 赋予元素定位
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                /** 没有找到 flexible 元素
                 * 那么 JustifyContent 就可以生效
                 * =================================
                 * Justify-content 定义：
                 * - flex-start:从行首起始位置开始排列
                 * - flex-end: 从行尾位置开始排列
                 * - center: 居中排列
                 * - space-between:均匀排列每个元素，首个元素放置于起点，末尾元素放置于终点
                 * - space-around: 均匀排列每个元素，每个元素周围分配相同的空间
                 */
                if (style.justifyContent === 'flex-start') {
                    let currentMain = mainBase;
                    let step = 0;
                }
        
                if (style.justifyContent === 'flex-end') {
                    let currentMain = mainBase + mainSpace * mainSign;
                    let step = 0;
                }
        
                if (style.justifyContent === 'center') {
                    let currentMain = mainBase + (mainSign * mainSpace) / 2;
                    let step = 0;
                }
        
                if (style.justifyContent === 'space-between') {
                    // 间隔空间 = 剩余空间 / (元素总数 - 1) * 方向表示
                    let step = (mainSpace / (items.length - 1)) * mainSign;
                    let currentMain = mainBase;
                }
        
                if (style.justifyContent === 'space-around') {
                    let step = (mainSpace / items.length) * mainSign;
                    let currentMain = mainBase + step / 2;
                }
        
                // 给每一个元素分配定位信息
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);
            
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }
            }
        });
    }
}
```

### 计算交叉轴
1. 分析：
* 这部分计算交叉轴的尺寸，假设我们现在的 flex-direction 属性值是 row， 那么我们主轴已经计算出来元素的 width，left 和 right，那么交叉轴我们就算它的 height，top 和 bottom。如果这六个都确定了，这个元素的位置就完全确定了。
* 计算交叉轴方向：
    - 根据每一行中最大元素尺寸来计算行高
    - 根据行高 flex-align 和 item-align，确定元素具体位置
2. 代码：
> 文件：layout.js 中的 layout 函数
```js
function layout(element) {
    //…………

    /**
     * 计算主轴
    */
   //………………

    /**
     * =================================
     * 计算交叉轴
     * =================================
     */
    // let crossSpace;

    if (!style[crossSize]) {
        // 没有定义行高，叠加每一个 flex 行的高度做为行高
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for (let i = 0; i < flexLines.length; i++) {
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
        }
    } else {
        // 如果有定义行高，那就用叠减每一个 flex 行的高度获取剩余行高
        crossSpace = style[crossSize];
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    }

    // 根据 flex align 属性来分配行高
    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    // 获取每一个 flex 行的尺寸
    let lineSize = style[crossSize] / flexLines.length;

    // 根据 alignContent 属性来矫正 crossBase 值
    let step;
    if (style.alignContent === 'flex-start' || style.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }

    if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    }

    if (style.alignContent === 'center') {
        crossBase += (crossSign * crossSpace) / 2;
        step = 0;
    }

    if (style.alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    }

    if (style.alignContent === 'space-around') {
        step = crossSpace / flexLines.length;
        crossBase += (crossSigh * step) / 2;
    }

    //对每一行分别进行处理
    flexLines.forEach(items => {
        //先算出这一行的交叉轴尺寸
        let lineCrossSize = style.alignContent === 'stretch'
            ? items.crossSpace + crossSpace / flexLines.length
            : items.crossSpace;

        //处理每个元素；
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            //受每个元素本身的 alignSelf 影响，同时也受父元素的 alignItems 影响；
            let align = itemStyle.alignSelf || style.alignItems;

            //
            if (itemStyle[crossSize] === null)
                itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;

            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }

            if (align === 'flex-end') {
                itemStyle[crossStart] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossEnd] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            }

            if (align === 'center') {
                itemStyle[crossStart] = crossBase + (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }

            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0
                    ? itemStyle[crossSize]
                    : items.crossSpace);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    });
};
```
> 为了可以使用浏览器中的 flex 排版，需要对服务端代码中的 HTML 进行一些修改：
```js
const { Console } = require('console');
const http = require('http');

// 创建 Web 服务器。
const server = http.createServer((req, res) => {
    let body = [];
    req.on('error', (err) => {
        console.log(err);
    }).on('data', (chunk) => {
        console.log("chunk:", chunk, chunk.toString());
        body.push(chunk);
    }).on('end', () => {
        console.log("body1:", body);
        body = Buffer.concat(body).toString();
        console.log("body2:", body);
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(
`<html>
<head>
    <style>
        #container {
            width: 500px;
            height: 300px;
            display: flex;
            background-color: rgb(255,255,255);
        }
        #container #myId {
            width: 200px;
            height: 100px;
            background-color: rgb(255,0,0);
        }
        #container .c1 {
            flex: 1;
            background-color: rgb(0,0,255);
        }
    </style>
</head>
<body>
    <div id="container">
        <div id="myId"></div>
        <div class="c1"></div>
    </div>
</body>
</html>`
        )
    })
});

// 启动服务器
server.listen(8088, () => {
    console.log('服务器已启动');
  // 停止服务器
//   server.close(() => {
//     console.log('服务器已停止');
//   });
});


// 启动服务器
server.listen(8088, () => {
    console.log('服务器已启动');
  // 停止服务器
//   server.close(() => {
//     console.log('服务器已停止');
//   });
});
```
3. 最终在client.js中打印出DOM为
```json
{
    "type": "document",
    "children": [
        {
            "type": "element",
            "children": [
                {
                    "type": "text",
                    "content": "\n"
                },
                {
                    "type": "element",
                    "children": [
                        {
                            "type": "text",
                            "content": "\n    "
                        },
                        {
                            "type": "element",
                            "children": [
                                {
                                    "type": "text",
                                    "content": "\n        #container{\n            width: 500px;\n            height: 300px;\n            display: flex;\n        }\n        #container #myId{\n            width: 200px;\n            background-color: brown;\n        }\n        #container .c1{\n            flex: 1;\n        }\n    "
                                }
                            ],
                            "attribute": [],
                            "tagName": "style",
                            "computedStyle": {},
                            "parent": "~children~0~children~1",
                            "style": {}
                        },
                        {
                            "type": "text",
                            "content": "\n"
                        }
                    ],
                    "attribute": [],
                    "tagName": "head",
                    "computedStyle": {},
                    "parent": "~children~0",
                    "style": {}
                },
                {
                    "type": "text",
                    "content": "\n"
                },
                {
                    "type": "element",
                    "children": [
                        {
                            "type": "text",
                            "content": "\n    "
                        },
                        {
                            "type": "element",
                            "children": [
                                {
                                    "type": "text",
                                    "content": "\n        "
                                },
                                {
                                    "type": "element",
                                    "children": [],
                                    "attribute": [
                                        {
                                            "name": "id",
                                            "value": "myId"
                                        }
                                    ],
                                    "tagName": "div",
                                    "computedStyle": {
                                        "width": {
                                            "value": "200px",
                                            "specificity": [
                                                0,
                                                2,
                                                0,
                                                0
                                            ]
                                        },
                                        "background-color": {
                                            "value": "brown",
                                            "specificity": "~children~0~children~3~children~1~children~1~computedStyle~width~specificity"
                                        }
                                    },
                                    "parent": "~children~0~children~3~children~1",
                                    "style": {
                                        "width": 200,
                                        "background-color": "brown",
                                        "left": 0,
                                        "right": 200,
                                        "top": 0,
                                        "bottom": 300,
                                        "height": 300
                                    }
                                },
                                {
                                    "type": "text",
                                    "content": "\n        "
                                },
                                {
                                    "type": "element",
                                    "children": [],
                                    "attribute": [
                                        {
                                            "name": "class",
                                            "value": "c1"
                                        }
                                    ],
                                    "tagName": "div",
                                    "computedStyle": {
                                        "flex": {
                                            "value": "1",
                                            "specificity": [
                                                0,
                                                1,
                                                1,
                                                0
                                            ]
                                        }
                                    },
                                    "parent": "~children~0~children~3~children~1",
                                    "style": {
                                        "flex": 1,
                                        "width": 300,
                                        "left": 200,
                                        "right": 500,
                                        "top": 0,
                                        "bottom": 300,
                                        "height": 300
                                    }
                                },
                                {
                                    "type": "text",
                                    "content": "\n    "
                                }
                            ],
                            "attribute": [
                                {
                                    "name": "id",
                                    "value": "container"
                                }
                            ],
                            "tagName": "div",
                            "computedStyle": {
                                "width": {
                                    "value": "500px",
                                    "specificity": [
                                        0,
                                        1,
                                        0,
                                        0
                                    ]
                                },
                                "height": {
                                    "value": "300px",
                                    "specificity": "~children~0~children~3~children~1~computedStyle~width~specificity"
                                },
                                "display": {
                                    "value": "flex",
                                    "specificity": "~children~0~children~3~children~1~computedStyle~width~specificity"
                                }
                            },
                            "parent": "~children~0~children~3",
                            "style": {
                                "width": 500,
                                "height": 300,
                                "display": "flex",
                                "flexDirection": "row",
                                "alignItems": "stretch",
                                "justifyContent": "flex-start",
                                "flexWrap": "nowrap",
                                "alignContent": "stretch"
                            }
                        },
                        {
                            "type": "text",
                            "content": "\n"
                        }
                    ],
                    "attribute": [],
                    "tagName": "body",
                    "computedStyle": {},
                    "parent": "~children~0",
                    "style": {}
                },
                {
                    "type": "text",
                    "content": "\n"
                }
            ],
            "attribute": [],
            "tagName": "html",
            "computedStyle": {},
            "parent": "~",
            "style": {}
        },
        {
            "type": "text",
            "content": "\r\n"
        }
    ]
}
```

## 七、渲染
* 浏览器原理的最后一个步骤，浏览器工作原理中，从 URL 发起 HTTP 请求，然后通过解析 HTTP 获得 HTML 代码。通过解析 HTML 代码构建了 DOM 树，然后通过分析 style 属性和选择器匹配给 DOM 树加上 CSS 属性。上一步我们通过分析每个元素的 CSS 属性来计算排版信息。
* 浏览器还有很多其他的功能，而且会有持续的绘制和事件监听。我们这里的模拟浏览器就只做到绘制为止。
### 安装 images 包
* 在编写绘制的代码之前，需要准备一下环境的。在模拟浏览器当中，用绘制图片代替了真正浏览器的绘制屏幕。在 node.js 当中是没有自带的图形绘制的功能。所以这里用 images 包来代替。
> 包地址：https://www.npmjs.com/package/images
`npm install images --save`

### 绘制单个元素
1. >首先在 client.js 中的请求方法里常见 viewport，并且调用 render 函数来渲染。
```js
//++++引入 render 和 images++++//
const render = require('./render.js');
const images = require('images');

//…………
void async function () {
    //………………

    //+++++用800*600的图片作为视口，绘制浏览器；+++++//
    let viewport = images(800, 600);

    console.log("dom----", dom.children[0].children[3].children[1].children[3]);

    // 将视口、想要绘制的DOM元素传入 render();
    render(viewport, dom.children[0].children[3].children[1].children[3]);

    viewport.save('viewport.png');
}();
```
2. >实现 render.js
```js
const images = require('images');

function render(viewport, element) {
    if(element.style) {
        let img = images(element.style.width, element.style.height);

        if (element.style['background-color']) {
            let color = element.style['background-color'] || 'rgb(0, 0, 0)';
            color.match(/rgb\((\d+),(\d+),(\d+)\)/);
            img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3));
            viewport.draw(img, element.style.left || 0, element.style.top || 0);
        }
    }
}

module.exports = render;
```
3. >用 debug 或者 node 执行我们的 client.js 后，会在当前目录中看到 viewport.png，然后图片的效果如下：

### 绘制DOM树
* 上一部分我们完成了单个元素的绘制，从单个元素的绘制进行到 DOM 绘制，其实不难，只需要递归的调用 render 函数就可以完成整个 DOM 的绘制了。
* 思路：
    - 递归调用子元素的绘制方法完成 DOM 树的绘制;
    - 忽略一些不需要绘制的节点;
        - 实际浏览器中，文字绘制是难点，需要依赖字体库，我们这里忽略了;
        - 实际浏览器中，还会对一些图层做 compositing，我们这里也忽略了;
    - 我们来看看代码怎么实现的:
> client.js render 函数的参数改为 dom
```js
const render = require('./render.js');
const images = require('images');

//…………
void async function () {
    //………………
    let viewport = images(800, 600);

    //++++render 函数的参数改为 dom++++//
    render(viewport, dom);

    viewport.save('viewport.png');
}();
```
> render.js 增加递归调用方法
```js
const images = require('images');

function render(viewport, element) {
    if(element.style) {
        let img = images(element.style.width, element.style.height);

        if (element.style['background-color']) {
            let color = element.style['background-color'] || 'rgb(0, 0, 0)';
            color.match(/rgb\((\d+),(\d+),(\d+)\)/);
            img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3));
            viewport.draw(img, element.style.left || 0, element.style.top || 0);
        }
    }

    //++++增加递归调用方法++++//
    if (element.children) {
        for (let child of element.children) {
            render(viewport, child);
        }
    }
}

module.exports = render;
```