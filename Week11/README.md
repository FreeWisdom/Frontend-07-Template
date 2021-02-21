# 重学css（一）
## 一、css总论
### 1、css语法研究
1. CSS 2.1 语法标准
    - CSS 2.1 是一个比较老的版本，但是它在 2.1 的版本的时候建立了一个 Snapshot，没有其他版本去替代它。所以 CSS 2.1 的 Grammar Summary 部分是当时比较完整的一份语法列表。现在已经大量引入 CSS3 ，会有一些语法差异和不全。但总体来讲是一个不错的起点，让我们可以先开始认识 CSS 的语法基础；
    - 这里的语法是使用 “产生式” 来表达的。但是这里会有一些 CSS 中特别的表达方式和标准：
        - `[ ]` —— 方括号代表组的概念；
        - `?` —— 问号代表可以存在和不存在；
        - `|` —— 单竖线代表 “或” 的意思；
        - `*` —— 星号代表 0 个或 多个；
2. CSS 总体结构
    * @charset
    * @import
    * rules : 多个规则，这里面的规则没有顺序要求
        - @media
        - @page
        - rule
            - 这里基本上就是我们平时写的 CSS 样式规则部分
    我们平时写都是在写普通的 CSS 规则，charset 我们基本都不会用，一般我们都会用 UTF-8。
    这里讲到的是 CSS 2.1 的 CSS 结构，在 CSS3 中我们有更多的 @ 规则 和 CSS 规则，我们首先要在 CSS3 中找到这两块的所有内容，然后补充道这个总体结构中，那么我们就可以形成 CSS 的总体结构。这时候我们对 CSS 的语法认识就有完备性了。
### 2、css语法@规则研究
1. @charset: https://www.w3.org/TR/css-syntax-3/
    - 在 CSS syntax 3 中 CSS 2.1 中做了一个重新的定义，但是相对 CSS 2.1 基本没有什么变化；
2. @import: https://www.w3.org/TR/css-cascade-4/
    - import 在 css cascade 4 的规范里面；
    - 因为 CSS 的全称就是 Cascade Style Sheet（级联表），所以 import 属于级联规则之一；
3. @media: https://www.w3.org/TR/css3-conditional/
    - Media 不是在 media query 标准里，在 CSS3 的 conditional 标准里，但是在 media 的 conditional 标准中又引用了 media query，规定了 media 后面的一部分的查询规则。所以我们常常去讲 media query 是一个新特性，其实它并不是，它是类似一个预置好的函数的一个规范；
    - 真正把 Media 特性真正引入到 CSS3 当中，是通过 CSS3 中的 conditional 标准；
    - 那么 Conditional，就是 “有条件的”，用来控制一些规则在有效条件下才会生效；
4. @page: https://www.w3.org/TR/css-page-3/
    - page 有一份单独的 CSS3 标准来表述它，就是 css page 3 它主要是给我们需要打印的页面所使用的；
    - 理论上这个叫做分页媒体，其实主要的分页媒体就是打印机，页面是不会有分页的；
5. @counter-style: https://www.w3.org/TR/css-counter-styles-3/
    - 我们平时写列表的时候会有一个 counter ，也就是列表最前面的那个 “小黑点” 或者是 “小数字”；
6. @keyFrames: https://www.w3.org/TR/css-animations-1/
    - keyFrames 是用于动画效果定义的；
7. @fontFace: https://www.w3.org/TR/css-fonts-3/
    - fontFace 就是使用 web font 功能时候用到的，它可以用来定义一切字体，由此延伸出一个技巧叫 Icon font；
8. @supports: https://www.w3.org/TR/css3-conditional/
    - 这个同样是来自于 conditional 的标准，它是用来检查某些 CSS 的功能是否存在的；
    - supports 是一个比较尴尬的存在，自己就是隶属于 CSS3，所以它本身是有兼容性问题的导致没办法用，所以现在基本上不推荐使用 support 来检查 CSS 兼容性，因为检查的那个属性，比 support 这个规则兼容性要更好，所以根本检查不了；
    - 估计可能 4～5年后，CSS 新出来的新特性再用 support 来检查会更好一点；
    - 现在推荐工程工具去代替；
9. @namespace: https://www.w3.org/TR/css-namespaces-3/
    - 现在 HTML 里面除了 HTML 命名空间，还引入了 SVG、MathML 等这样的其他的命名空间的标记和标签，所以 CSS 里面有了对应的设施，其实主要是一个完备性的考量，并不是一个特别重要的规则；
* 这里不是完整的列表，还有 3 个规则，因为 它们本身状态太年轻在讨论状态，要不就是已经没有浏览器支持了，或者是已经被废弃了。分别是：
    - @document
    - @color-profile
    - @font-feature
* 最常用的需要展开掌握的有三种：
    - @media
    - @keyFrames
    - @fontFace
### 3、css语法普通规则研究
```css
div {
  background-color: blue;
}
```
* 通过以上代码示例, CSS 代码是有分为 选择器 和 声明 两部分。在之前 理解浏览器原理 的 CSS parser 中，把 CSS parse 成分 selector 部分和 declaration 部分，这里也按照这个方法来理解 CSS 规则：
    - 选择器 —— selector (div);
    - 声明 —— declaration;
        - Key —— 键 (background-color);
        - Value —— 值 (blue);
1. Selector 选择器
    - Level 3 —— https://www.w3.org/TR/selectors-3/
        - Selectors_group —— 选择器组：用逗号分隔
        - Selector —— 选择器：需要用 combinators (组合器) 把多个简单选择器拼在一起的
        - Combinator —— 组合器：+、>、~、空格
        - Simple_selector_sequence —— 简单选择器：类型选择器、* 一定会在最前面，然后可以是 ID、class、attr、pseudo等选择器
        ```js
        //The productions are:(上述的产生式)
        selectors_group
        : selector [ COMMA S* selector ]*
        ;
        selector
        : simple_selector_sequence [ combinator simple_selector_sequence ]*
        ;
        combinator
        /* combinators can be surrounded by whitespace */
        : PLUS S* | GREATER S* | TILDE S* | S+
        ;
        simple_selector_sequence
        : [ type_selector | universal ]
            [ HASH | class | attrib | pseudo | negation ]*
        | [ HASH | class | attrib | pseudo | negation ]+
        ;
        ``` 
    - Level 4 —— https://www.w3.org/TR/selectors-4/
        - Level 4 和 Level 3 是非常的相似的，但是它的选择器更复杂；
        - 增加了很多的伪类选择器、“或” 和 “与” 的关系；
        - 而且它的 NOT 也更强大；
        - Level 4 的话我们看一看拓展思路就可以了，因为从 2018年12月 开始也没有再更新了；
        - 所以目测是遇到问题了，处于比较难推动的阶段，所以投入使用还有很漫长的路要走；
2. Key
    - Properties｜性质
    - Variables｜CSS 变量—— https://www.w3.org/TR/css-variables/
        - 可以声明一个双减号开头的变量：--main-color: #06c
        - 然后我们可以在子元素中使用这些 CSS 变量了 color: var(--main-color)
        - 可以跟其他的函数进行嵌套：--accent-background: linear-gradient(to top, var(--main-color), white);
        - 使用 var() 函数的时候是可以给默认值的，传入第二个参数就是默认值：var(--main-color, black)
        - CSS 变量处理可以用作 value，还可以用作 key：先声明了--side: margin-top 然后就可以这样使用 var(--side): 20px
        ```css
        :root {
            --main-color: #06c;
            --accent-color: #006;
        }
        /* The rest of the CSS file */
        #foo h1 {
            color: var(--main-color);
        }
        ```
3. Value
    - Level 4 —— https://www.w3.org/TR/css-values-4/
        - 它也是 working draft (工作草稿) 状态，但是实现状态非常的好;
        - 而且这个版本一直有保持更新，最后一次更新是 2019年1月份;
        - 数字类型有：整型、百分比、浮点型还有带维度 (Dimensions);
        - 长度单位有：相对单位 (em, ex, cap, ch ... )、视口单位 (vw, vh, vi, vb, vmin, vmax)、绝对单位 (cm, mm, Q, in, pt, pc px);
        - 其他单位：弧度单位 (deg, grad, rad, turn)、时间单位 (s, ms)、频率单位 (Hz, kHz)、分辨率单位 (dpi, dpcm, dppx);
        - 数据类型：颜色 <color>、图片 <image>、2D 位置 <position> 等类型;
        - 函数：计算 cal()、最小值 min()、最大值 max() 、范围剪切 clamp()、切换value toogle()、属性引用 attr();
### 4、使用爬虫收集整套 CSS 标准
1. W3C 中取出 css 标准相关文章的标题、链接
    - 通过类似爬虫的方法，在 W3C 网站上抓取标准的内容。然后我们对他进行一些处理，方便后续的一些工作。首先我们打开 W3C 的标准和草稿列表页：https://www.w3.org/TR/。这里可以看到所有的 W3C 的标准和草稿，但是只需要 CSS 部分的。如果检查元素中查看，可以看到其实所有的数据都已经挂载在 DOM 上了，只是前端做了筛选分页而已。所以可以用一段代码，直接复制到浏览器的 console 中运行，筛选出所有 CSS 相关的文章列表。
    ```js
    // 获取 CSS 相关的标准列表
    JSON.stringify(
        Array.prototype.slice
            .call(document.querySelector('#container').children)
            .filter(e => e.getAttribute('data-tag').match(/css/)) // 找到有 CSS tag 的
            .map(e => ({ name: e.children[1].innerText, url: e.children[1].children[0].href })) // 只获取标题名字和链接
    );
    ```
    - 经过上面代码，可在 console 中得到：
    ```json
    [{"name":"CSS Cascading and Inheritance Level 5","url":"https://www.w3.org/TR/2021/WD-css-cascade-5-20210119/"},{"name":"CSS Pseudo-Elements Module Level 4","url":"https://www.w3.org/TR/2020/WD-css-pseudo-4-20201231/"},{"name":"CSS Snapshot 2020","url":"https://www.w3.org/TR/2020/NOTE-css-2020-20201222/"},{"name":"CSS Box Model Module Level 3","url":"https://www.w3.org/TR/2020/CR-css-box-3-20201222/"},{"name":"CSS Containment Module Level 1","url":"https://www.w3.org/TR/2020/REC-css-contain-1-20201222/"},{"name":"CSS Text Module Level 3","url":"https://www.w3.org/TR/2020/CR-css-text-3-20201222/"},{"name":"CSS Backgrounds and Borders Module Level 3","url":"https://www.w3.org/TR/2020/CR-css-backgrounds-3-20201222/"},{"name":"CSS Cascading and Inheritance Level 3","url":"https://www.w3.org/TR/2020/PR-css-cascade-3-20201222/"},{"name":"CSS Grid Layout Module Level 1","url":"https://www.w3.org/TR/2020/CRD-css-grid-1-20201218/"},{"name":"CSS Grid Layout Module Level 2","url":"https://www.w3.org/TR/2020/CRD-css-grid-2-20201218/"},{"name":"CSS Box Sizing Module Level 3","url":"https://www.w3.org/TR/2020/WD-css-sizing-3-20201218/"},{"name":"CSS Display Module Level 3","url":"https://www.w3.org/TR/2020/CRD-css-display-3-20201218/"},{"name":"CSS Images Module Level 3","url":"https://www.w3.org/TR/2020/CRD-css-images-3-20201217/"},{"name":"CSS Containment Module Level 2","url":"https://www.w3.org/TR/2020/WD-css-contain-2-20201216/"},{"name":"CSS Custom Highlight API Module Level 1","url":"https://www.w3.org/TR/2020/WD-css-highlight-api-1-20201208/"},{"name":"CSS Conditional Rules Module Level 3","url":"https://www.w3.org/TR/2020/CR-css-conditional-3-20201208/"},{"name":"TTML Media Type Definition and Profile Registry","url":"https://www.w3.org/TR/2020/NOTE-ttml-profile-registry-20201119/"},{"name":"CSS Lists and Counters Module Level 3","url":"https://www.w3.org/TR/2020/WD-css-lists-3-20201117/"},{"name":"CSS Fonts Module Level 4","url":"https://www.w3.org/TR/2020/WD-css-fonts-4-20201117/"},{"name":"CSS Color Module Level 4","url":"https://www.w3.org/TR/2020/WD-css-color-4-20201112/"},{"name":"CSS Values and Units Module Level 4","url":"https://www.w3.org/TR/2020/WD-css-values-4-20201111/"},{"name":"CSS Scroll Anchoring Module Level 1","url":"https://www.w3.org/TR/2020/WD-css-scroll-anchoring-1-20201111/"},{"name":"CSS Color Adjustment Module Level 1","url":"https://www.w3.org/TR/2020/WD-css-color-adjust-1-20201109/"},{"name":"Requirements for Chinese Text Layout中文排版需求","url":"https://www.w3.org/TR/2020/WD-clreq-20201101/"},{"name":"CSS Box Sizing Module Level 4","url":"https://www.w3.org/TR/2020/WD-css-sizing-4-20201020/"},{"name":"CSS Properties and Values API Level 1","url":"https://www.w3.org/TR/2020/WD-css-properties-values-api-1-20201013/"},{"name":"Worklets Level 1","url":"https://www.w3.org/TR/2020/WD-worklets-1-20200908/"},{"name":"CSS Inline Layout Module Level 3","url":"https://www.w3.org/TR/2020/WD-css-inline-3-20200827/"},{"name":"CSS Cascading and Inheritance Level 4","url":"https://www.w3.org/TR/2020/WD-css-cascade-4-20200818/"},{"name":"Requirements for Japanese Text Layout 日本語組版処理の要件(日本語版)","url":"https://www.w3.org/TR/2020/NOTE-jlreq-20200811/"},{"name":"Media Queries Level 5","url":"https://www.w3.org/TR/2020/WD-mediaqueries-5-20200731/"},{"name":"Media Queries Level 4","url":"https://www.w3.org/TR/2020/CR-mediaqueries-4-20200721/"},{"name":"CSS Overflow Module Level 3","url":"https://www.w3.org/TR/2020/WD-css-overflow-3-20200603/"},{"name":"Encoding","url":"https://www.w3.org/TR/2020/NOTE-encoding-20200602/"},{"name":"Requirements for Hangul Text Layout and Typography : 한국어 텍스트 레이아웃 및 타이포그래피를 위한 요구사항","url":"https://www.w3.org/TR/2020/NOTE-klreq-20200527/"},{"name":"Ethiopic Layout Requirements","url":"https://www.w3.org/TR/2020/WD-elreq-20200526/"},{"name":"CSS Positioned Layout Module Level 3","url":"https://www.w3.org/TR/2020/WD-css-position-3-20200519/"},{"name":"CSS Text Decoration Module Level 4","url":"https://www.w3.org/TR/2020/WD-css-text-decor-4-20200506/"},{"name":"CSS Ruby Layout Module Level 1","url":"https://www.w3.org/TR/2020/WD-css-ruby-1-20200429/"},{"name":"CSS Box Alignment Module Level 3","url":"https://www.w3.org/TR/2020/WD-css-align-3-20200421/"},{"name":"CSS Box Model Module Level 4","url":"https://www.w3.org/TR/2020/WD-css-box-4-20200421/"},{"name":"CSS Speech Module","url":"https://www.w3.org/TR/2020/CR-css-speech-1-20200310/"},{"name":"CSS Transforms Module Level 2","url":"https://www.w3.org/TR/2020/WD-css-transforms-2-20200303/"},{"name":"CSS Color Module Level 5","url":"https://www.w3.org/TR/2020/WD-css-color-5-20200303/"},{"name":"CSS Conditional Rules Module Level 4","url":"https://www.w3.org/TR/2020/WD-css-conditional-4-20200303/"},{"name":"Resize Observer","url":"https://www.w3.org/TR/2020/WD-resize-observer-1-20200211/"},{"name":"Timed Text Markup Language 2 (TTML2) (2nd Edition)","url":"https://www.w3.org/TR/2020/CR-ttml2-20200128/"},{"name":"CSS Basic User Interface Module Level 4","url":"https://www.w3.org/TR/2020/WD-css-ui-4-20200124/"},{"name":"CSS Writing Modes Level 3","url":"https://www.w3.org/TR/2019/REC-css-writing-modes-3-20191210/"},{"name":"CSS Spatial Navigation Level 1","url":"https://www.w3.org/TR/2019/WD-css-nav-1-20191126/"},{"name":"CSS Text Module Level 4","url":"https://www.w3.org/TR/2019/WD-css-text-4-20191113/"},{"name":"CSS Multi-column Layout Module Level 1","url":"https://www.w3.org/TR/2019/WD-css-multicol-1-20191015/"},{"name":"CSS Text Decoration Module Level 3","url":"https://www.w3.org/TR/2019/CR-css-text-decor-3-20190813/"},{"name":"CSS Generated Content Module Level 3","url":"https://www.w3.org/TR/2019/WD-css-content-3-20190802/"},{"name":"CSS Writing Modes Level 4","url":"https://www.w3.org/TR/2019/CR-css-writing-modes-4-20190730/"},{"name":"CSS Table Module Level 3","url":"https://www.w3.org/TR/2019/WD-css-tables-3-20190727/"},{"name":"CSS Syntax Module Level 3","url":"https://www.w3.org/TR/2019/CR-css-syntax-3-20190716/"},{"name":"CSS Animation Worklet API","url":"https://www.w3.org/TR/2019/WD-css-animation-worklet-1-20190625/"},{"name":"CSS Overscroll Behavior Module Level 1","url":"https://www.w3.org/TR/2019/WD-css-overscroll-1-20190606/"},{"name":"CSS Values and Units Module Level 3","url":"https://www.w3.org/TR/2019/CR-css-values-3-20190606/"},{"name":"CSS Easing Functions Level 1","url":"https://www.w3.org/TR/2019/CR-css-easing-1-20190430/"},{"name":"WebVTT: The Web Video Text Tracks Format","url":"https://www.w3.org/TR/2019/CR-webvtt1-20190404/"},{"name":"Non-element  Selectors  Module  Level 1","url":"https://www.w3.org/TR/2019/NOTE-selectors-nonelement-1-20190402/"},{"name":"CSS Scroll Snap Module Level 1","url":"https://www.w3.org/TR/2019/CR-css-scroll-snap-1-20190319/"},{"name":"CSS Transforms Module Level 1","url":"https://www.w3.org/TR/2019/CR-css-transforms-1-20190214/"},{"name":"CSS Snapshot 2018","url":"https://www.w3.org/TR/2019/NOTE-css-2018-20190122/"},{"name":"Motion Path Module Level 1","url":"https://www.w3.org/TR/2018/WD-motion-1-20181218/"},{"name":"Filter Effects Module Level 1","url":"https://www.w3.org/TR/2018/WD-filter-effects-1-20181218/"},{"name":"CSS Fragmentation Module Level 4","url":"https://www.w3.org/TR/2018/WD-css-break-4-20181218/"},{"name":"CSS Fragmentation Module Level 3","url":"https://www.w3.org/TR/2018/CR-css-break-3-20181204/"},{"name":"Geometry Interfaces Module Level 1","url":"https://www.w3.org/TR/2018/CR-geometry-1-20181204/"},{"name":"Selectors Level 4","url":"https://www.w3.org/TR/2018/WD-selectors-4-20181121/"},{"name":"CSS Flexible Box Layout Module Level 1","url":"https://www.w3.org/TR/2018/CR-css-flexbox-1-20181119/"},{"name":"CSS Shadow Parts","url":"https://www.w3.org/TR/2018/WD-css-shadow-parts-1-20181115/"},{"name":"Timed Text Markup Language 2 (TTML2)","url":"https://www.w3.org/TR/2018/REC-ttml2-20181108/"},{"name":"Selectors Level 3","url":"https://www.w3.org/TR/2018/REC-selectors-3-20181106/"},{"name":"CSS Paged Media Module Level 3","url":"https://www.w3.org/TR/2018/WD-css-page-3-20181018/"},{"name":"Web Animations","url":"https://www.w3.org/TR/2018/WD-web-animations-1-20181011/"},{"name":"CSS Transitions","url":"https://www.w3.org/TR/2018/WD-css-transitions-1-20181011/"},{"name":"CSS Animations Level 1","url":"https://www.w3.org/TR/2018/WD-css-animations-1-20181011/"},{"name":"CSS Scrollbars Module Level 1","url":"https://www.w3.org/TR/2018/WD-css-scrollbars-1-20180925/"},{"name":"CSS Fonts Module Level 3","url":"https://www.w3.org/TR/2018/REC-css-fonts-3-20180920/"},{"name":"Cascading  Style  Sheets,  level 1","url":"https://www.w3.org/TR/2018/SPSD-CSS1-20180913/"},{"name":"CSS Logical Properties and Values Level 1","url":"https://www.w3.org/TR/2018/WD-css-logical-1-20180827/"},{"name":"CSS Painting API Level 1","url":"https://www.w3.org/TR/2018/CR-css-paint-api-1-20180809/"},{"name":"CSS Basic User Interface Module Level 3 (CSS3 UI)","url":"https://www.w3.org/TR/2018/REC-css-ui-3-20180621/"},{"name":"CSS Color Module Level 3","url":"https://www.w3.org/TR/2018/REC-css-color-3-20180619/"},{"name":"CSS Layout API Level 1","url":"https://www.w3.org/TR/2018/WD-css-layout-api-1-20180412/"},{"name":"DOMMatrix interface","url":"https://www.w3.org/TR/2018/NOTE-matrix-20180412/"},{"name":"CSS Typed OM Level 1","url":"https://www.w3.org/TR/2018/WD-css-typed-om-1-20180410/"},{"name":"CSS Counter Styles Level 3","url":"https://www.w3.org/TR/2017/CR-css-counter-styles-3-20171214/"},{"name":"CSS Overflow Module Level 4","url":"https://www.w3.org/TR/2017/WD-css-overflow-4-20170613/"},{"name":"CSS Fill and Stroke Module Level 3","url":"https://www.w3.org/TR/2017/WD-fill-stroke-3-20170413/"},{"name":"CSS Image Values and Replaced Content Module Level 4","url":"https://www.w3.org/TR/2017/WD-css-images-4-20170413/"},{"name":"CSS Rhythmic Sizing","url":"https://www.w3.org/TR/2017/WD-css-rhythm-1-20170302/"},{"name":"Ready-made Counter Styles","url":"https://www.w3.org/TR/2017/NOTE-predefined-counter-styles-20170216/"},{"name":"CSS Snapshot 2017","url":"https://www.w3.org/TR/2017/NOTE-css-2017-20170131/"},{"name":"CSS Round Display Level 1","url":"https://www.w3.org/TR/2016/WD-css-round-display-1-20161222/"},{"name":"Cascading Style Sheets Level 2 Revision 2 (CSS 2.2) Specification","url":"https://www.w3.org/TR/2016/WD-CSS22-20160412/"},{"name":"CSS Device Adaptation Module Level 1","url":"https://www.w3.org/TR/2016/WD-css-device-adapt-1-20160329/"},{"name":"CSS Object Model (CSSOM)","url":"https://www.w3.org/TR/2016/WD-cssom-1-20160317/"},{"name":"CSSOM View Module","url":"https://www.w3.org/TR/2016/WD-cssom-view-1-20160317/"},{"name":"CSS Custom Properties for Cascading Variables Module Level 1","url":"https://www.w3.org/TR/2015/CR-css-variables-1-20151203/"},{"name":"CSS Will Change Module Level 1","url":"https://www.w3.org/TR/2015/CR-css-will-change-1-20151203/"},{"name":"CSS Snapshot 2015","url":"https://www.w3.org/TR/2015/NOTE-css-2015-20151013/"},{"name":"CSS Page Floats","url":"https://www.w3.org/TR/2015/WD-css-page-floats-3-20150915/"},{"name":"Priorities for CSS from the Digital Publishing Interest Group","url":"https://www.w3.org/TR/2015/WD-dpub-css-priorities-20150820/"},{"name":"CSS Template Layout Module","url":"https://www.w3.org/TR/2015/NOTE-css-template-3-20150326/"},{"name":"CSS Exclusions Module Level 1","url":"https://www.w3.org/TR/2015/WD-css3-exclusions-20150115/"},{"name":"Compositing and Blending Level 1","url":"https://www.w3.org/TR/2015/CR-compositing-1-20150113/"},{"name":"Fullscreen","url":"https://www.w3.org/TR/2014/NOTE-fullscreen-20141118/"},{"name":"CSS Presentation Levels Module","url":"https://www.w3.org/TR/2014/NOTE-css3-preslev-20141014/"},{"name":"CSS  Mobile  Profile 2.0","url":"https://www.w3.org/TR/2014/NOTE-css-mobile-20141014/"},{"name":"Behavioral Extensions to CSS","url":"https://www.w3.org/TR/2014/NOTE-becss-20141014/"},{"name":"CSS3 Hyperlink Presentation Module","url":"https://www.w3.org/TR/2014/NOTE-css3-hyperlinks-20141014/"},{"name":"CSS  TV  Profile 1.0","url":"https://www.w3.org/TR/2014/NOTE-css-tv-20141014/"},{"name":"The CSS ‘Reader’ Media Type","url":"https://www.w3.org/TR/2014/NOTE-css3-reader-20141014/"},{"name":"CSS  Marquee  Module  Level 3","url":"https://www.w3.org/TR/2014/NOTE-css3-marquee-20141014/"},{"name":"CSS Regions Module Level 1","url":"https://www.w3.org/TR/2014/WD-css-regions-1-20141009/"},{"name":"CSS Line Grid Module Level 1","url":"https://www.w3.org/TR/2014/WD-css-line-grid-1-20140916/"},{"name":"CSS Masking Module Level 1","url":"https://www.w3.org/TR/2014/CR-css-masking-1-20140826/"},{"name":"CSS Font Loading Module Level 3","url":"https://www.w3.org/TR/2014/WD-css-font-loading-3-20140522/"},{"name":"CSS Generated Content for Paged Media Module","url":"https://www.w3.org/TR/2014/WD-css-gcpm-3-20140513/"},{"name":"SVG Integration","url":"https://www.w3.org/TR/2014/WD-svg-integration-20140417/"},{"name":"CSS Scoping Module Level 1","url":"https://www.w3.org/TR/2014/WD-css-scoping-1-20140403/"},{"name":"CSS Shapes Module Level 1","url":"https://www.w3.org/TR/2014/CR-css-shapes-1-20140320/"},{"name":"CSS Namespaces Module Level 3","url":"https://www.w3.org/TR/2014/REC-css-namespaces-3-20140320/"},{"name":"CSS Style Attributes","url":"https://www.w3.org/TR/2013/REC-css-style-attr-20131107/"},{"name":"Selectors  API  Level 2","url":"https://www.w3.org/TR/2013/NOTE-selectors-api2-20131017/"},{"name":"CSS Print Profile","url":"https://www.w3.org/TR/2013/NOTE-css-print-20130314/"},{"name":"Media Queries","url":"https://www.w3.org/TR/2012/REC-css3-mediaqueries-20120619/"},{"name":"Cascading Style Sheets Level 2 Revision 1 (CSS 2.1) Specification","url":"https://www.w3.org/TR/2011/REC-CSS2-20110607/"},{"name":"A MathML for CSS Profile","url":"https://www.w3.org/TR/2011/REC-mathml-for-css-20110607/"},{"name":"Cascading Style Sheets (CSS) Snapshot 2010","url":"https://www.w3.org/TR/2011/NOTE-css-2010-20110512/"},{"name":"Cascading Style Sheets (CSS) Snapshot 2007","url":"https://www.w3.org/TR/2011/NOTE-css-beijing-20110512/"},{"name":"Associating Style Sheets with XML documents 1.0 (Second Edition)","url":"https://www.w3.org/TR/2010/REC-xml-stylesheet-20101028/"},{"name":"CSS Techniques for Web Content Accessibility Guidelines 1.0","url":"https://www.w3.org/TR/2000/NOTE-WCAG10-CSS-TECHS-20001106/"},{"name":"Aural Cascading Style Sheets (ACSS) Specification","url":"https://www.w3.org/TR/1999/WD-acss-19990902"},{"name":"Positioning HTML Elements with Cascading Style Sheets","url":"https://www.w3.org/TR/1999/WD-positioning-19990902"},{"name":"CSS Printing Extensions","url":"https://www.w3.org/TR/1999/WD-print-19990902"},{"name":"List of suggested extensions to CSS","url":"https://www.w3.org/TR/1998/NOTE-CSS-potential-19981210"}]
    ```
2. 在上述链接中，取出每个页面想要获得标准展示 table 的属性名 
    - 然后点击下方的 "Copy" 即可复制，把这个 JSON 内容保存在一个 JavaScript 文件里面，并且赋予一个变量叫 standards。这里用一个简单的方法来获取爬取信息，在 W3C 原本的页面上开启一个 iframe，这样我们就可以忽略掉跨域的问题；
    - 然后我们需要的信息就是每个链接页面中 class 属性m名为 propdef 的表格中的内容；
    ```js
    let standards = [...] // 这里面的内容就是我们刚刚从 W3C 网页中爬取到的内容
                    
    let iframe = document.createElement('iframe');
    document.body.innerHtml = '';
    document.body.appendChild(iframe);

    function happen(element, event) {
    return new Promise(function (resolve) {
        let handler = () => {
            resolve();
            element.removeEventListener(event, handler);
        };
        element.addEventListener(event, handler);
    });
    }

    void (async function () {
        for (let standard of standards) {
            iframe.src = standard.url; // 让 Iframe 跳转到每个 standards 中的详情页面
            console.log(standard.name); 
            await happen(iframe, 'load'); // 等待 iframe 中的页面打开完毕
            console.log(iframe.contentDocument.querySelectorAll('.propdef')); // 这里打印出表格的内容
        }
    })();
    ```

## 二、选择器
### 1、选择器语法
1. 简单选择器
    1. 星号 —— *
        - 通用选择器，可以选择任何的元素
    2. 类型选择器｜type selector —— div svg|a
        - 也叫做 type selector, 也就是说它选择的是元素中的 tagName (标签名) 属性，tagName 也是我们平常最常用的的选择器；
        - HTML 也是有命名空间的，它主要有三个：HTML、SVG、MathML
            - 如果我们想选 SVG 或者 MathML 里面特定的元素，我们就必须要用到单竖线 | ，CSS选择器里面单竖线是一个命名空间的分隔符，而HTML 里面命名空间分隔符是 冒号 : 。然后前面说到的命名空间是需要 @namespace 来声明的，他们是配合使用的，但是这个命名空间的使用不是很频繁，它的存在只是为了一个完备性考虑；
            - HTML 和 SVG当中唯一一个重叠的元素名就只有一个 a；
        - 我们可以认为，类型选择器就是一个简单的文本字符串即可；
    3. 类选择器｜class selector —— .class-name
        - 以 . 开头的选择器就是 class 选择器，也是最经典之一。它会选择一个 class，也可以用空格做分隔符来制定多个 class ，这个 .class 只要匹配中其中一个就可以了；
    4. ID 选择器｜id selector —— #id
        - 以 # 开头加上 ID 名选中一个 ID，这个是严格匹配的，ID 里面是可以加减号或者是其他符号；
    5. 属性选择器｜attribute selector —— [attr=value]
        - 它包括了 class 属性选择器和 id 选择器；
        - 这个选择器的完整语法是 attr=value，等号前面是属性名，后面是属性值；
        - 这里面的等号前面可以加 ～ 就表示像 class 一样，可以支持拿空格分隔的值的序列`attr~=value`；
        - 如果在等号前面加单竖线，表示这个属性以这个值开头即可`attr|=value`；
        - 如果我们对优先级没有特殊要求的话，我们理论上是可以用属性选择器来代替 class 选择器和 id 选择器的；
    6. 伪类 —— :hover
        - 以 : 开头的，它主要是一些元素的特殊状态；
        - 这个跟我们写的 HTML 没有关系，多半来自于交互和效果；
        - 一些伪类选择器是带有函数的伪类选择器，这些我们都是可以去使用伪类来解决的；
    7. 伪元素选择器 —— ::before
        - 一般来说是以 :: 双冒号开头的；
        - 实际上是支持使用单冒号的，但是我们提倡双冒号这个写法，因为我们可以一眼就看出这个是伪元素选择器，和伪类区分开来；
        - 伪元素选中一些原本不存在的元素，如果我们不选择它们，这个地方就不存在这个元素了，选择后就会多了一个元素；
2. 复合选择器
    - <简单选择器><简单选择器><简单选择器>；
    - `*` 或则 div 必须写在最前面，伪类或伪元素一定要写在后面；
    - 首先复合选择器是以多个简单选择器构成的，只要把简单选择器挨着写就变成一个复合选择器了。它的语义就是我们选中的元素必须同时 match 几个简单选择器，形成了 “与” 的关系；
3. 复杂选择器
    - 复合选择器中间用连接符就可以变成复杂选择器了，复杂选择器是针对一个元素的结构来进行选择的；
    - <复合选择器> " " <复合选择器> —— 子孙选择器，单个元素必须要有空格左边的一个父级节点或者祖先节点；
    - <复合选择器> ">" <复合选择器> —— 父子选择器，必须是元素直接的上级父元素；
    - <复合选择器> "~" <复合选择器> —— 邻接关系选择器；
    - <复合选择器> "+" <复合选择器> —— 邻接关系选择器；
    - <复合选择器> "||" <复合选择器> —— 双竖线是 Selector Level 4 才有的，当我们做表格的时候可以选中每一个列；

### 2、选择器优先级
1. 简单选择器计数
我们从一个案例出发，选择器优先级是对一个选择器里面包含的所有简单选择器进行计数。所以选择器列表不被视为一个完整的选择器（也就是逗号分隔的选择器），因为选择器列表中间是以逗号分隔开的复杂选择器来进行简单选择器计数的。

2. > 例子：#id div.a#id
    - 这个里面包含了两个 ID 选择器，一个类型选择器和一个 class 选择器;
    - 根据一个 specificity 数组的计数 [inline-style个数, ID 选择器个数, class 选择器个数, tagName 选择器个数];
    - 我们这个例子就会得出 specificity = [0, 2, 1, 1];
    - 在选择器的标准里面，有一个这样的描述，会采用一个 N (一个足够大的数)进制来表示选择器优先级;
    - 所以 specificity = 0*N³ + 2*N² + 1*N + 1;
    - 只需要取一个足够大的 N，算出来就是选择器的优先级了;
    - 比如说我们用 N = 1000000，那么 specificity = 2000001000001，这个就是这个例子中选择器的 specificity 优先级了;
    - 像 IE 的老版本 IE6，为了节省内存 N 取值不够大，取了一个 N 为 255 的值，所以就发生了非常好玩的事情：
        - 比如说 256 个 class 就相当于一个 ID。后来大部分的浏览器都选择了 65536，基本上就再也没有发生过超过额度的事情了。因为标准里面只说采用一个比较大的值就可以，但是我们要考虑内存暂用的问题，所以我们会取一个 16 进制上比较整的数，一般来说都是 256 的整次幂（因为 256 是刚好是一个字节）。
### 3、伪类
1. 链接/行为
    - :any-link —— 可以匹配任何的超链接;
    - :link —— 还没有访问过的超链接;
    - :visited —— 已经被访问过的超链接;
        - 一旦使用了 :link 或者 :visited 之后，我们就再也无法对这个元素的文字颜色之外的属性进行更改。为什么要这样设计呢？
        - 因为一旦使用了 layout 相关的属性，比如说我们给 :visited 的尺寸加大一点，它就会影响排版。这样我们就可以通过 JavaScript 的 API 去获取这个链接是否被访问过了。但是如果我们能获得链接是否被访问过了，那么我们就可以知道用户访问过那些网站了，这个对于浏览器的安全性来说是一个致命打击。所以这里也提醒一下大家，不要以为做一些表现性的东西与安全没有任何关系，其实安全性是一个综合的考量。CSS 它也能造成安全漏洞的;
    - :hover —— 用户鼠标放在元素上之后的状态，之前是只能对超链接生效，但是现在是可以在很多元素中使用了;
    - :active —— 之前也是只对超链接生效的，点击之后当前的链接就会生效;
    - :focus —— 就是焦点在这个元素中的状态，一般用于 input 标签，其实任何可以获得焦点的元素都可以使用;
    - :target —— 链接到当前的目标，这个不是给超链接用的，是给锚点的 a 标签使用的，就是当前的 HASH 指向了当前的 a 标签的话就会激活 target 伪类;
2. 树结构
    - :empty —— 这个元素是否有子元素;
    - :nth-child() —— 是父元素的第几个儿子（child）;
    - :nth-last-child() —— 与 nth-child 一样，只不过从后往前数;
    - :first-child :last-child :only-child;
    - :nth-child 是一个非常复杂的伪类，里面支持一种语法，比如说可以在括号里面写奇偶 event 或者 odd，也可以写 4N+1、3N-1，这个就会分别匹配到整数的形态。因为这个是一个比较复杂的选择器，我们就不要在里面写过于复杂的表达式了，只用它来处理一下奇偶，逢3个多1个，逢4个多1个等等这种表达式;
        - 其实 empty 、nth-last-child、last-child、only-child 这几个选择器，是破坏了我们之前在 浏览器原理 中的说到的 CSS 计算的时机问题。
        - 我们可以想象一下，当我们在开始标签计算的时候，肯定不知道它有没有子标签。empty 影响不是特别大，但是 last-child 的这个关系其实还是影响蛮大的。所以浏览在实现这些的时候是做了特别处理的，要么就是浏览器实现的不是特别好，要么就是浏览器要耗费更大的性能来得以实现。所以建议大家尽量避免大量使用这些破坏回溯原则的标签;
3. 逻辑型
    - :not 伪类 —— 主流浏览器只支持简单选择器的序列（复合选择器）我们是没有办法在里面写复杂选择器的语法的;
    - :where :has —— 在 CSS Level 4 加入了这两个非常强大了逻辑型伪类;
        - 温馨不建议把选择器写的过于复杂，很多时候都可以多加一点 class 去解决的。如果选择器写的过于复杂，某种程度上意味着 HTML 结构写的不合理。不光是为了给浏览器工程省麻烦，也不光是为了性能，而是为了自身的代码结构考虑，所以我们不应该出现过于复杂的选择器;
### 4、伪元素
* 一共分为 4 种
    - ::before
    - ::after
        - ::before 和 ::after 是在元素的内容的前和后，插入一个伪元素。一旦应用了 before 和 after 的属性，declaration（声明）里面就可以写一个叫做 content 的属性（一般元素是没有办法写 content 的属性的）。content 的属性就像一个真正的 DOM 元素一样，可以去生成盒，可以参与后续的排版和渲染了。所以我们可以给他声明 border、background等这样的属性。
    - ::first-line
    - ::first-letter
        - ::first-line 和 ::first-letter 的机制就不一样了。这两个其实原本就存在 content 之中。他们顾名思义就是 选中“第一行” 和选中 “第一个字母”。它们 不是一个不存在的元素，是把一部分的文本括了起来让我们可以对它进行一些处理。
> 可以理解为：伪元素向界面上添加了一个不存在的元素。
1. before 和 after
    - 带有 before 伪元素的选择器，会给他实际选中的元素的内容前面增加了一个元素，只需要通过他的 content 属性为它添加文本内容即可。（这里我们也可以给伪元素赋予 content: '' 为空）所以我们可以任何的给 before 和 after 指定 display 属性，和不同元素一样比较自由的。
    - 我们在实现一些组建的时候，也会常常使用这种不污染 DOM 树，但是能实际创造视觉效果的方式来给页面添加一些修饰性的内容。
    ```html
    <div>
    <::before/>
    content content content content
    content content content content
    content content content content
    content content content content
    <::after/>
    </div>
    ```
2. first-letter 和 first-line
    - first-letter 相当于有一个元素把内容里面的第一个字母给括了起来。这个 first-letter 我们是可以任意声明各种不同的属性的，但是我们是无法改变它的 content 的。我们应该都看到过报纸上的第一个字母会比较大，然后会游离出来的效果，这个在 CSS 里面我们就可以用 ::first-letter的伪元素选择器了。使用这个来实现相比用 JavaScript 来实现就会更加稳定和代码更加优雅一些。
    ```html
    <div>
    <::first-letter>c</::first-letter>ontent content content content
    content content content content
    content content content content
    content content content content
    </div>
    ```
    - first-line 是针对排版之后的 line，其实跟我们源码里面的 first line 没有任何的关系的。假如说我们的浏览器提供的渲染的宽度不同，first-line 在两个环境里面它最终括住的元素数量就不一样多了。所以我们用这个选择器的时候需要去根据需求的情况使用，很有可能在我们开发机器上和用户的机器上渲染出来的效果是不一样的。
    ```html
    <div>
    <::first-line>content content content content content</::first-line>
    content content content content
    content content content content
    content content content content
    </div>
    ```
3. 这两个选择器其实可用的属性也是有区别的：
    - first-line 可用属性
        - font 系列;
        - color 系列;
        - background 系列;
        - word-spacing;
        - letter-spacing;
        - text-decoration;
        - text-transform;
        - line-height;
    - first-letter 可用属性
        - font 系列;
        - color 系列;
        - background 系列;
        - text-decoration;
        - text-transform;
        - letter-spacing;
        - word-spacing;
        - line-height;
        - float;
        - vertical-align;
        - 盒模型系列：margin, padding, border;
4. 练习
>编写一个 match 函数。它接受两个参数，第一个参数是一个选择器字符串性质，第二个是一个 HTML 元素。
>这个元素你可以认为它一定会在一棵 DOM 树里面。通过选择器和 DOM 元素来判断，当前的元素是否能够匹配到我们的选择器。
>（不能使用任何内置的浏览器的函数，仅通过 DOM 的 parent 和 children 这些 API，来判断一个元素是否能够跟一个选择器相匹配。）以下是一个调用的例子。
```js

```
5. 思考
* 为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢?(TODO: 各种标准文档中也没找到详细解释，找到具体出处,以下全凭臆测)
    1. 性能上
        - first-letter 很好匹配，不需要更多信息，在开始标签结束时就可以完成匹配，和其它选择器表现一致，性能良好。
        - first-line 则不然，它需要知道父元素的第一个行框盒子，所以需要在父元素布局阶段之后才能完成匹配，和 :last-nth-child 一样，已经破坏了回溯原则。如果这时再改变布局就会导致父元素重新布局，得不偿失。
    2. 表现上
        - first-line 应用 float 本身没什么意义，应用 float 的节点会导致其之后的行内盒子环绕着它进行布局，而 first-line 本身就占满一行了，其之后的文本节点也必然会出现在第二行，也就是说就算 first-line 支持 float，表现上也不会有太大区别。
        - 但是 first-line 支持 letter-space 之类同样会影响布局的属性，却不支持 margin 之类的盒子属性，所以以上解释只是个人理解；

# 重学css（二）
## 一、css排版
### 1、盒
### 2、正常流
### 3、正常流的行级排布
### 4、正常流的块级排布
### 5、BFC合并
### 6、flex排版

## 二、css动画与绘制
### 1、动画
### 2、颜色
### 3、绘制