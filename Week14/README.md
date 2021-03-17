# 组件化
## 1、组件的基本知识
* 前端架构中最热门的就有两个话题：
    1. 组件化；
        - 组件化的概念是从开始研究如何扩展 HTML 标签开始的，最后延伸出来的一套前端架构体系。而它最重要的作用就是提高前端代码的复用性。
    2. 架构模式；
        - 架构模式就是大家特别熟悉的 MVC, MVVM 等设计模式，这个话题主要关心的就是前端跟数据逻辑层之间的交互。

### 1.1、组件的基本概念

组件都会区分为模块和对象，组件是与 UI 强相关的，所以某种意义上我们可以认为 ***组件是特殊的模块或者是特殊的对象*** 。

组件化的**特点**是： ***可以使用树形结构来进行组合，并且有一定的模版化的配置能力*** 。这个就是组件的一个基本概念。

### 1.2、对象 与 组件 区别
#### 1.2.1、对象的 3 大要素：
1. 属性 —— Properties
2. 方法 —— Methods
3. 继承关系 —— Inherit

在 JavaScript 中，普通对象可以用 属性、方法、继承关系 来描述。这里面的继承，在 JavaScript 中使用的是原型继承。

这里说的 “普通对象” 不包含复杂的函数对象或者是其他的特殊对象，在 JavaScript 当中，属性和方法是一体的。
#### 1.2.2、组件中的 8 大要素：

组件在对象的基础上添加了很多语义相关的概念，也是这样使得组件变成了一种非常适合描述 UI 的概念。

1. 属性 —— Properties
    * Properties 和 Attribute 在英语的含义中是有很大的区别，但都会翻译成 “属性”。 如果遇到两个单词都出现的时候，就会把 Attribute 翻译为 “特性”，把 Properties 翻译成 “属性”。
2. 方法 —— Methods
3. 继承 —— Inherit
4. 特性 —— Attribute
5. 配置与状态 —— Config & State
    * 对组件的一种配置。我们经常会在一个构造函数创建一个对象的时候用到 Config ，我们传入这个构造函数的参数就叫 “Config（配置）”;
    * 当用户去操作或者是一些方法被调用的时候，一个 state 就会发生变化。这种就是组件的状态，是会随着一些行为而改变的。而 state 和 properties、attributes、config 都有可能是相似或者相同的。
6. 事件 —— Event
    * 一个事件是组件往外传递的。我们的组件主要是用来描述 UI 这样的东西，基本上它都会有这种事件来实现它的某种类型的交互。
7. 生命周期 —— Lifecycle
    * 见下 ### 1.6、xxx ；
8. 子组件 —— Children
    * 见下 ### 1.7、xxx ;
    * children 是组件当中一个 **必要** 的条件，因为没有 children 组件就不可能形成树形结构，那么描述界面的能力就会差很多。
        - 拖拽系统可以把写好的 UI 组件拖到页面上，但是后面发现除了可以拖拽在某些区域之外，还需要一些自动排序、组件嵌套组件的需求，这时组件与组件之间没有树形结构就不好使了。

### 1.3、component（组件）各要素及信息流转

![组件的各要素及信息流转](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/component.png "组件的各要素及信息流转")

1. **图片左侧：**组件最直接产生变化的来源是组件使用者的输入和操作，当一个用户在选择框组件中选了一个选项，此时组件的 state（状态），甚至会关联到 children（子组件） 的变化；
2. **图片右边：**的这几种情况就是组件的开发者与组件的关系。
    * 第一行：组件开发者使用 Markup Code（标记语言代码）对组件产生影响。其实，也就是开发者通过 Attribute（组件特性） 来更改组件的一些特征或者是特性；
    * 第三行：组件开发者使用 JS 对组件产生影响。其实，也就是开发者通过 Property（属性） 来更改组件的一些特征或者是特性，与对象中的 Property（属性） 是一样的概念。；
    * 第二行：method（方法）用于描述一个复杂的过程，但是在 JavaScript 当中的 Property 是允许有 get 和 set 这样的方法的，所以最终 method 和 property 两者的作用也是差不多的；
    * 第四行：如果一个组件的开发者需要传递一个消息给到使用组件的程序员，此时需要用到 event（事件），当一个组件内部因为某种行为或者事件触发到了变化时，组件就会给使用者发送 event 消息。所以这里的 event 的方向就是反过来的，从组件往外传输的；

> Attribute 和 Property 是不是一样的呢？有的时候是，有的时候也不是，这个完全取决于组件体系的设计者。组件的实现者或者是设计者可以让 attribute 和 property 统一。甚至我们把 state、config、attribute、property 四者都全部统一也是可以的。

### 1.4、Attribute 与 Property 区别
#### 1.4.1、Attribute 与 Property 在英文中的区别：
1. 从 Attribute 这个英文单词理解，更多是在强调描述性。
    * Attribute 最初就是在 XML 里面中使用的；
    * 比如，说我们描述一个人，头发很多、长相很帅、皮肤很白，这些都是属于 Attribute，也可以说是某一样东西的特性和特征方面的描述。
2. Property 更多的是一种从属关系。
    * 因为 Property 是从属关系的，所以经常会在面向对象里面使用；
    * 比如在开发中经常会发现一个对象，它有一个 Property 是另外一个对象，大概率它们间有一个从属关系，子对象从属于父对象。但是这里也有一种特殊情况，如果是弱引用的话，一个对象引用了另外一个对象，这样就是完全是另一个概念了。
#### 1.4.2、Attribute 与 Property 在运用场景中的区别：
1. Attribute 与 Property 在**普通组件**中的用法
    * Attribute:
        * HTML 中的 Attribute 是可以通过 HTML 属性去设置的;
        * 同时也可以通过 JavaScript 去设置的;

    ```html
    <my-component attribute="v" />
    <script>
    myComponent.getAttribute('a')
    myComponent.setAttribute('a', value)
    </script>
    ```

    * Property:
        * 这里就是定义某一个元素的 a = ‘value’;
        * 这个就不是 attribute 了，而是 property;

    ```js
    myComponent.a = 'value';
    ```

    > **很多同学都认为这只是两种不同的写法，其实它们的行为是有区别的。**

2. Attribute 与 Property 在 **Class 属性**中的用法
    * 早年 JavaScript 的 Class 是一个关键字，所以早期 class 作为关键词是不允许做为属性名的。但是现在这个已经被改过来了，关键字也是可以做属性名的;
    * 为了让这个关键字可以这么用，HTML 里面就做了一个妥协的设计。在 HTML 中属性仍然叫做 class 但是在 DOM 对象中的 property 就变成了 className。但是两者还是一个互相反射的关系的，这个神奇的关系会经常让大家掉一些坑里面;
        - 比如说在 React 里面，我们写 className它自动就把 Class 给设置了。
    * 现在 JavaScript 语言中，已经没有 class 和 className 两者不一致的问题了。我们是可以使用 div.class 这样的写法的。但是 HTML 中就还是不支持 className 这个名字的，这个也是一些历史包袱导致的问题。

    ```html
    <div class="class1 class2"></div>

    <script>
    var div = document.getElementByTagName('div');
    div.className // 输出就是 class1 class2 
    </script>
    ```

3. Attribute 与 Property 在 **Style 属性**中的用法
    * 在 HTML 里面的 Style 属性中
        - Attribute 是一个字符串;
            - 同时可以使用 getAttribute 和 setAttribute 去取得和设置这个属性。
        - Property 是一个字符串语义化之后的对象;
            - 但是如果我们用`div.style`，就会得到一个 key 和 vaule 的结构。
    
    ```html
    <div class="class1 class2" style="color:blue"></div>

    <script>
    var div = document.getElementByTagName('div');
    div.style // 这里就是一个对象
    </script>
    ```

4. Attribute 与 Property 在 **Href 属性**中的用法
    * property 是经过 resolve 过的 url。
        - 比如我们的 href 的值输入的是 `"//m.taobao.com"`。这个时候前面的 http 或者是 https 协议是根据当前的页面做的，所以这里的 href 就需要编译一遍才能响应当前页面的协议。
        - http 到 https 改造后，在让我们的网站使用 https 协议的时候，我们需要把所有写死的 http 或者 https 的 url 都要改成使用 // 。
    * 所以在我们 href 里面写了什么就出来什么的，就是 attribute。

    ```html
    <a href="//m.taobao.com"></a>
    <script>
    var a = document.getElementByTagName('a');

    // 这个获得的结果就是 "http://m.taobao.com"， 这个 url 是 resolve 过的结果
    // 所以这个是 Property
    a.href;
    
    // 而这个获得的是 "//m.taobao.com", 跟 HTML 代码中完全一致
    // 所以这个是 Attribute
    a.getAttribute('href');

    </script>
    ```

    * 在上面的代码中我们也可以看到，我们可以同时访问 property 和 attribute。它们的语义虽然非常的接近，但是它们不是一样的东西。

    > 不过**如果我们更改了任何一方，都会让另外一方发生改变**。这个是需要我们去注意的现象。

5. Attribute 与 Property 在 **input 和 value** 中的用法
    * 我们很多都以为 property 和 attribute 中的 value 都是完全等效的。其实不是的，**这个 attribute 中的 input 的 value 相当于一个 value 的默认值**。**不论是用户在 input 中输入了值，还是开发者使用 JavaScript 对 input 的 value 进行赋值，这个 input 的 attribute 是不会跟着变的**。
    * 而在 input 的显示上是会优先显示 property，所以 attribute 中的 value 值就相当于一个默认值而已。这就是一个非常著名的坑，早期同学们有使用过 JQuery 的话，我们会觉得里面的 prop 和 attr 是一样的，没想到在 value 这里就会踩坑。
    * 所以后来 JQuery 库就出了一个叫 val 的方法，这样我们就不需要去想 attribute 还是 property 的 value，直接用它提供的 val 取值即可。
    * 《补充！？那么如果让我们去设计一个标签系统，我们会让 property 和 attribute 等效还是不等效呢？ 等学习完整个组件化的知识后，我们一起来回答一下这个问题。》

    ```html
    <input value = "cute" />
    <script>
        // 若 property 没有设置， 则结果是 attribute
        var input = document.getElementByTagName(‘input’); 
        input.value // cute
        input.getAttribute(‘value’); // cute
        // 若 value 属性已经设置，则 attribute 不变，property 变化， 元素上实际的效果是 property 优先
        input.value = ‘hello’; 
        input.value // hello
        input.getAttribute(‘value’); // cute
    </script>
    ```

### 1.5、如何设计组件状态

|**Markup set**|**JavaScript Set**|**JavaScript Change**|**User Input Change**|             |
|:------------:|:----------------:|:-------------------:|:-------------------:|:-----------:|
|      ❌      |        ✅        |          ✅          |          ❓         |**Property** |
|      ✅      |        ✅        |          ✅          |          ❓         |**Attribute**|
|      ❌      |        ❌        |          ❌          |          ✅         |**State**    |
|      ❌      |        ✅        |          ❌          |          ❌         |**Config**   |

1. 分成了四个场景：
    * Markup set —— 用标签去设置；
    * JavaScript Set —— 使用 JavaScript 代码去设置；
    * JavaScript Change —— 使用 JavaScript 代码去改变；
    * User Input Change —— 终端用户的输入而改变；
2. 组件中四要素与四个场景的关系：
    * Property
        ❌ 它是不能够被 markup 这种静态的声明语言去设置；
        ✅ 但是它是可以被 JavaScript 设置；
        ✅ 但是它是可以被 JavaScript 改变；
        ❓ 大部分情况下 property 是不应该由用户的输入去改变的，但是小数情况下，可能是来源于我们的业务逻辑，才有可能会接受用户输入的改变；
    * Attribute
        ✅ 是可以由 markup 去设置；
        ✅ 是可以由 JavaScript 去设置；
        ✅ 是可以被 JavaScript 所改变；
        ❓ 用户的输入就不一定会改变它，与 Property 同理；
    * State
        ❌ 状态是会由组件内部去改变的，它不会从组件的外部进行改变。如果我们想设计一个组件是从外部去改变组件的状态的话，那么我们组件内部的 state 就失控了。因为我们不知道组件外部什么时候会改变我们组件的 state，导致我们 state 的一致性无法保证。
        ✅ 但是作为一个组件的设计者和实践者，我们一定要保证用户输入是能改变我们组件的 state 的。比如说用户点击了一个 tab，然后点中的 tab 就会被激活，这种交互一般都会用 state 去控制的。
    * Config
        ✅ Config 在组件中是一个一次性生效的东西，它只会在我们组件构造的时候触发。所以它是不可更改的。也是因为它的不可更改性，所以我们通常会把 config 留给全局。通常每个页面都会有一份 config，然后拿着这个在页面内去使用。

### 1.6、组件生命周期 Lifecycle

![组件的生命周期](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/lifeCycle.png "组件的生命周期")

1. 生命周期，必定会有`created`和`destroy`；
2. 一个组件有一个非常重要的事情，就是它被创建之后，它有没有被显示出来。这里就涉及生命周期中的 `mount`，也就是组件有没有被挂载到 “屏幕的这棵树上”。
    * 这个生命周期我们可以在 React 和 Vue 里面看到，我们经常会使用这个生命周期，在组件被挂載后做一些相应的初始化操作。
3. 有挂載那必然就会有卸载，所以组件中就有`unmount`。而这个挂載与卸载的整个生命周期是可以反复的发生的，我们可以挂上去然后卸下来，然后再挂上去，这样反复又反复的走这个生命周期。
    * 所以在 unmount 之后，是可以回到 created 构建组件的这个生命周期的状态。
4. 那么组件还会在什么时候发生状态更变呢？这里我们就有两种情况：
    * 程序员使用代码去改变或者设置这个组件的状态;
    * 用户输入时影响了组件的状态;
        - 比如说我们用户点了一下按钮或者 Tab，这个时候就会触发这个组件的状态更变。同时也会产生一个组件的生命周期，而这个生命周期就是 `Render` 渲染或者 `Update` 更新。
5. 我们看到的所谓 `willMount`、`didMount` 无非就是这个生命周期之中更细节的位置;

### 1.6、组件的子组件 Children
Children 是构建组件树最重要的一个组件特性，并且在使用中其实有两种类型的 Children：
1. Content 型 Children 
    - 我们有几个 Children，最终就能显示出来几个 Children。这种类型的 Children，它的组件树是非常简单的。
2. Template 型 Children
    - 这个时候整个 Children 它充当了一个模版的作用。
        - 比如说我们设计一个 list，但是最后的结果不一定就与我们 Children 代码中写的一致。因为我们 List 肯定是用于多个列表数据的，所以 list 的表示数量是与我们传入组件的 data 数据所相关的。如果我们有 100 个实际的 children 时，我们的 list 模版就会被复制 100 份。

```html
<my-button><img src=“{{icon}}”/>{{title}}</my-button>

<my-list>
    <li><img src=“{{icon}}”/>{{title}}</li>
</my-list>
```

> 在设计我们的组件树的 children 的时候，一定要考虑到这两种不同的场景。
>> 比如我们在 React中，它没有 template 型的 children，但是它的 children 可以传函数，然后这个函数可以返回一个 children。这个时候它就充当了一个模版型 children 的作用了。
>> 那么在 Vue 里面当我们去做一些无尽的滚动列表的时候，这个对 Vue 的模版型 children 就有一定的要求。

## 2、为组件添加jsx语法

由 “1、组件的基本知识可知” ，一个组件系统是由 Markup 和 JavaScript 两者都可访问的一个环境。所以我们的第一步就是建立一个可以使用 markup 的环境。这里我们会学习使用两种 markup 建立的风格：

* 第一种是基于与 React 一样的 JSX 去建立我们组件的风格；
* 第二种则是基于类似 Vue 的这种，基于标记语言的 Parser 的一种风格；

JSX 在大家一般认知里面，它是属于 React 的一部分。其实 Facebook 公司会把 JSX 定义为一种纯粹的语言扩展。

> 即： JSX 也是可以被其他组件体系去使用的。
> 甚至我们可以把它单独作为一种，快捷创建 HTML 标签的方式去使用。

### 2.1、搭建jsx环境
1. 建立项目
    ```
    mkdir jsx
    ```

2. 初始化 NPM
    ```
    npm init
    ```
    * 执行以上命令之后，会出现一些项目配置的选项问题，直接一直按回车。

3. 安装 webpack-cli
    * webpack 是打包工具，定义入口文件，将所有模块引入整理后，通过 loader 和 plugin 处理后，打包输出；
    * Wepack 可以把一个普通的 JavaScript 文件变成能把不同的 import 和 require 的文件给打包到一起的工具；
    * 全局安装 webpack-cli：
    ```
    npm install -g webpack webpack-cli
    ```

4. 安装 babel-loader
    * webpack 通过 babel-loader 使用 Babel ;
    * 而 JSX 它是一个 babel 的插件，所以我们需要依次安装 webpack，babel-loader, babel 和 babel 的 plugin；
    * 需要注意的是，我们需要加上 --save-dev，这样我们就会把 babel 加入到我们的开发依赖中；
    ```
    npm install --save-dev webpack babel-loader
    ```
    * 为了验证我们是正确安装好了，可以打开项目目录下的 package.json，查找`"devDependencies:{}"`中的内容，如下：
    ```json
    {
        "name": "jsx",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "author": "",
        "license": "ISC",
        "devDependencies": {
            "babel-loader": "^8.2.2",
            "webpack": "^5.24.4"
        }
    }
    ```

5. 配置 webpack.config.js
    1. 配置 webpack 需要在项目的根目录创建一个 webpack.config.js 文件；
    2. webpack config 它是一个 nodejs 的模块，所以我们需要用 module.exports 来写它的设置:
    ```js
    module.exports = {

    }
    ```
    3. Webpack 最基本的，需要设置一个 entry (设置它的入口文件)。这里我们就设置一个 main.js 即可:
    ```js
    module.exports = {
        entry: "./main.js",
    }
    ```
    4. 在根目录下创建一个 main.js 的文件了。在里面先加入一个简单的 for of 循环。
    ```js
    // main.js 文件内容
    for (let i of [1, 2, 3]) {
        console.log(i);
    }
    ```
    5. 我们在根目录下执行 webpack 命令来打包 main.js 的文件，需要执行下面的这行命令进行打包：
    ```
    webpack
    ```
    6. 这时发现，在根目录中生成了一个新的文件夹 dist；
        * 这个就是 webpack 打包默认生成的文件夹，我们所有打包好的 JavaScript 和资源都会被默认放入这个文件夹当中；
        * 这个 dist 文件夹里面有一个打包好的 main.js 的文件，这个就是我们写的 main.js，通过 webpack 被打包好的版本；

6. 安装 @babel/core @babel/preset-env
    
    > Babel 是编译工具，把高版本语法编译成低版本语法，或者将文件按照自定义规则转换成js语法;
    
    1. 由于步骤 4 中安装 babel-loader 时，没有直接依赖 babel ，所以需要另外安装 @babel/core 和 @babel/preset-env。需要执行下面的命令行来安装：
    ```
    npm install --save-dev @babel/core @babel/preset-env
    ```
    2. 安装完成后，就需要在 webpack.config.js 中做配置，方便在打包的时候用上 babel-loader；
        * 上面配置好的 webpack.config.js 的 entry 后面添加一个选项叫做 module；
        * 然后模块中还可以加入一个 rules，这个就是构建的时候所使用的规则。rules 是一个数组类型的配置，这里面的每一个规则是由一个 test 和一个 use 组成的。
            * test: test 的值是一个正则表达式，用于匹配需要使用这个规则的文件。这里需要把所有的 JavaScript 文件给匹配上，所以使用 /\.js/ 即可；
            * use: loader: 只需要加入的 babel-loader 的名字即可；
                * options: 
                    * presets: 这里是 loader 的选项，这里需要加入 @babel/preset-env  最后的配置文件就会是这个样子：
    ```js
    module.exports = {
        entry: './main.js',
        module: {
            rules: [{
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            }]
        }
    }
    ```
    3. 在命令行执行 webpack;
    4. 进入 dist 文件夹，打开我们编译后的 main.js;
        * 发现源文件的 for of 被重新编译成了普通的 for 循环；
        * 这就是 '@babel/preset-env' 的转换效果；
    ```js
    (()=>{for(var o=0,l=[1,3,5];o<l.length;o++){var r=l[o];console.log(r)}})();
    ```
    
    以上 JSX 所需的基本环境搭建完毕。

7. webpack.config.js 中的 mode 配置
    1. 为了平时开发中的方便，需要在 webpack.config.js 中添加一个 `mode: development` ，这个配置表示 开发者模式 。
        * 一般来说，在代码仓库里面写的 webpack 配置都会默认加上这个`mode: 'development'`;
        * 当真正发布的时候，就会把它改成 `mode: 'production'`;
    ```js
    module.exports = {
        entry: './main.js',
        module: {
            // …………
        },
        mode: 'development'
    }
    ```
    2. 在命令行执行 webpack;
    3. main.js 发生变化，如下代码：
        * 编译后的代码没有被压缩成一行了。这样我们就可以调试 webpack 生成的代码了；
        * 在 main.js 中的代码被转成字符串，并且被放入一个 eval() 的函数里面；
        * 那么就可以在调试的时候把它作为一个单独的文件去使用了，并且可以进行断点调试；

    ![开发环境下的main.js](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/dev-mainjs.png "开发环境下的main.js")

8. 引入 JSX
    1. 若使用现在的配置在 main.js 里面使用 JSX 语法会怎么样？
        1. 在 main.js 里面加入这段代码：
        ```js
        var a = <div/>
        ```
        2. 在命令行执行 webpack，报错：在 = 后面不能使用 “小于号”，但是在正常的 JSX 语法中，这个其实是 HTML 标签的 “尖括号”，因为没有 JSX 语法的编译过程，所以 JavaScript 默认就会认为这个就是 “小于号”。

        ![不支持jsx语法](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/erromain.png "不支持jsx语法")

    2. 如何使 webpack 编译过程支持 JSX 语法呢？
        1. 需要加入一个最关键的一个包，这个包名非常的长，叫做 @babel/plugin-transform-react-jsx。执行以下命令来安装它：
        ```
        npm install --save-dev @babel/plugin-transform-react-jsx
        ```
        2. 还需要在 webpack 中进行配置：在 module 里面的 rules 里面的 use 里面加入一个 plugins 的配置，然后在其中加入 ['@babel/plugin-transform-react-jsx']。然后最终我们的 webpack 配置文件就是这样的：
        ```js

        ```
        3. 配置好之后，在命令行执行 webpack。这时候没有再报错，证明代码现在支持使用 JSX 语法。
        4. main.js 发生变化，如下代码：
            
        ![支持jsx语法后的main.js](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/支持jsx语法后的main.png "支持jsx语法后的main")

        5. 图中在 eval 里面加入的 <div/> 被翻译成一个 React.createElement("div", null) 的函数调用；
            * 所以应该怎么实现 React.createElement，以及能否把这个换成我们自己的函数名字呢？

### 2.2、jsx的基本使用方法
#### 2.2.1、自定义编译后 React.createElement() 的函数名为 creatElement()
1. 打开 webpack.config.js，在 plugins 的位置进行修改如下：
    ```js
    module.exports = {
        entry: './main.js',
        module: {
            rules: [{
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            [
                                '@babel/plugin-transform-react-jsx',
                                {
                                    pragma: 'creatElement'
                                }
                            ]
                        ]
                    }
                }
            }]
        },
        mode: 'development'
    }
    ```

2. 命令行执行 webpack；
    * 这么一改， JSX 就与 React 的框架没有任何联系了，会发现里面的 React.createElement 就会变成 createElement。 

    ![自定义编译后的函数名](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/自定义编译后的函数名.png "自定义编译后的函数名")

3. 在 dist 文件中创建 main.html ，引用main.js， main.html 代码如下：
    ```html
    <body>
        <script src="./main.js"></script>
    </body>
    ```

4. 运行 main.html ，控制台报错如下：

    ![main.html报错找不到creatElement函数](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/main.html报错找不到creatElement函数.png "main.html报错找不到creatElement函数")

5. 错误在 main.js 里面还没有定义 createElement 这个函数，所以找不到。我们需要自己编写一个 createElement 函数。打开根目录下的 main.js 并且把之前的 for 循环给删除了，然后加上如下代码，直接返回空，先让这个函数可以被调用即可：
    ```js
    function createElement() {
        return;
    }
    let a = <div />;
    ```

6. 命令行 webpack 重新编译，然后刷新 main.html 页面，发现报错没了，可以正常运行；

#### 2.2.2、实现 createElement() 函数
##### 2.2.2.1、找到 createElement() 函数的参数
* 给 jsx 添加属性
    1.  打开 jsx 文件中的 main.js ，给 jsx 添加属性，如下：
        ```html
        function createElement() {
            return;
        }

        let a = <div id="a"></div>;
        ```

    2. 命令行执行 webpack ；
    3. 打开 dist 文件中的 main.html 观察 createElement() 函数的第二个参数如下：
        * 第二个参数是以 Key-Value 的方式存储的JavaScript 对象所表示的传属性列表；

        ![createElement第二个参数](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/createElement第二个参数.png "createElement第二个参数")

* 给 jsx 添加 children
    1.  打开 jsx 文件中的 main.js ，给 jsx 添加 children，如下：
        ```html
        function createElement() {
            return;
        }

        let a = (
            <div id="a">
                <span></span>
                <span></span>
                <span></span>
            </div>
        )
        ```
    2. 命令行执行 webpack ；
    3. 打开 dist 文件中的 main.html 观察 createElement() 函数的第三个参数如下：
        * 第三个参数是 ...children 表示把后面所有的参数 (不定个数) 都会变成一个数组赋予给 children 变量；

        ![createElement第三个参数](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/createElement第三个参数.png "createElement第三个参数")

* 那么 createElement 这个函数就可以写成这样：
    - 第一个参数 type —— 就是这个标签的类型;
    - 第二个参数 attribute —— 标签内的所有属性与值;
    - 剩余的参数都是子节点 ...children —— 这里我们使用了 JavaScript 之中比较新的语法 ...children 表示把后面所有的参数 (不定个数) 都会变成一个数组赋予给 children 变量

    ```js
    function createElement(type, attribute, ...children) {
        return;
    }
    ```

##### 2.2.2.2、令 createElement() 函数返回实体 DOM
* jsx 中无文本节点时
    1. 打开 jsx 中的 main.js ,修改该文件如下：
        ```js
        function createElement(type, attributes, ...children) {
            //创建元素
            let element = document.createElement(type);

            //为元素增加属性 对象用for in
            for (const attribute in attributes) {
                element.setAttribute(attribute, attributes[attribute]);
            }

            //为元素增加子节点 数组用for of
            for (const child of children) {
                element.appendChild(child);
            }

            // 直接返回 element 表示的节点
            return element;
        }

        let a = (
            <div id="a">
                <span></span>
                <span></span>
                <span></span>
            </div>
        )

        document.body.appendChild(a);
        ```
    2. 命令行执行 webpack；
    3. 打开 main.html 文件观察 DOM，发现成功的把节点生成并且挂载到 body 之上；

        ![createElement() 函数返回实体 DOM 无文字](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/domObj.png "createElement() 函数返回实体 DOM 无文字")

* jsx 中有文本节点时
    1. 打开 jsx 中的 main.js , a 中加入文本节点，并且在 createElement() 函数中加入处理文本节点的内容，如下：
        ```js
        function createElement(type, attributes, ...children) {
            //创建元素
            let element = document.createElement(type);

            //为元素增加属性 对象用for in
            for (const attribute in attributes) {
                element.setAttribute(attribute, attributes[attribute]);
            }

            //为元素增加子节点 数组用for of
            for (const child of children) {
                //---------------新增---------------//
                //若child为文本，则将child转化成文本节点
                if(typeof child === "string") {
                    child = document.createTextNode(child);
                }

                element.appendChild(child);
            }

            return element;
        }

        //---------------新改---------------//
        let a = (
            <div id="a">
                hey zhz!
            </div>
        )

        document.body.appendChild(a);
        ```
    2. 命令行执行 webpack；
    3. 打开 main.html 文件观察，发现文字可以展示到浏览器上

        ![createElement() 函数返回实体 DOM 有文字](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/domObjText.png "createElement() 函数返回实体 DOM 有文字")

##### 2.2.2.3、JSX 实现自定义标签
在 jsx 文件夹下 main.js 文件中：
1. 在 createElment 函数之后定义 Div 类；
2. 在 jsx 中将`<div>xxx</div>`改为`<Div></Div>`;
3. 修改 createElment 函数，增加第一个参数 type 为类的判断；
    ```js
    function createElement(type, attributes, ...children) {
        let element;
        if(typeof type === "string") {
            //若是字符串，创建相应元素
            element = document.createElement(type);
        } else {
            //若不是字符串，创建相应实例
            element = new type;
        }
        
        //为元素增加属性 对象用for in
        for (const attribute in attributes) {
            element.setAttribute(attribute, attributes[attribute]);
        }

        //为元素增加子节点 数组用for of
        for (const child of children) {
            //若child为文本，则将child转化成文本节点
            if(typeof child === "string") {
                child = document.createTextNode(child);
            }

            element.appendChild(child);
        }

        return element;
    }

    class Div {
        //初始化类，依据 div 元素，创建类的根 DOM
        constructor() {
            this.root = document.createElement("div");
        }

        //为 DOM 添加属性
        setAttribute(name, value) {
            this.root.setAttribute(name, value)
        }

        //为 DOM 添加子元素
        appendChild(child) {
            this.root.appendChild(child);
        }

        //往 body 挂载当前 DOM
        mountTo(parent) {
            parent.appendChild(this.root);
        }
    }

    let a = (
        <Div id="a">
            <span>hey</span>
            <span>zhz</span>
            <span>dan</span>
        </Div>
    )

    // document.body.appendChild(a);
    a.mountTo(document.body);
    ```
4. 命令行执行 webpack ，观察 DOM ，如图：

    ![自定义 jsx 中createElement() 函数返回 DOM ](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/calssDom.png "自定义 jsx 中createElement() 函数返回 DOM ")
5. 由于最后将 jsx 挂载到 body 时，调用的是 `a.mountTo(document.body)`，若变量 a 不是自定义元素，而是正常的 HTML 元素，此时 a 上没有 mountTo 方法，则必须**给普通元素加一个 Wrapper 类，让 正常的 HTML 元素也能保持和自定义类相同的接口**，同理需给文本元素也添加 wrapper 类，以便和自定义类有相同的接口，如下：
    ```js
    function createElement(type, attributes, ...children) {
        let element;
        if(typeof type === "string") {
            //若是字符串，创建相应元素
            //用 ElementWrapper 达到 HTML 普通元素与自定义 jsx 标签的接口兼容（兼容 mountTo() ）
            element = new ElementWrapper(type);
        } else {
            //若不是字符串，创建相应实例
            element = new type;
        }
        
        //为元素增加属性 对象用for in
        for (const attribute in attributes) {
            element.setAttribute(attribute, attributes[attribute]);
        }

        //为元素增加子节点 数组用for of
        for (const child of children) {
            //若child为文本，则将child转化成文本节点
            if(typeof child === "string") {
                child = new TextWrapper(child);
            }
            element.appendChild(child);
        }

        return element;
    }

    class Div {
        //初始化类，依据 div 元素，创建类的根 DOM
        constructor() {
            this.root = document.createElement("div");
        }

        //为 DOM 添加属性
        setAttribute(name, value) {
            this.root.setAttribute(name, value)
        }

        //为 DOM 添加子元素
        appendChild(child) {
            console.log(this.root, child)
            // 由于所有的正常 HTML 元素都变成 ElementWrapper，故此处 child 不是正常的 HTML 元素，不能被 appendChild ；
            // this.root.appendChild(child);
            // 需要利用 ElementWrapper 的 mountTo 方法完成 DOM 的子元素添加；
            child.mountTo(this.root);
        }

        //往 body 挂载当前 DOM
        mountTo(parent) {
            parent.appendChild(this.root);
        }
    }

    class ElementWrapper {
        constructor(type) {
            this.root = document.createElement(type);
        }

        setAttribute(name, value) {
            this.root.setAttribute(name, value);
        }

        appendChild(child) {
            console.log("child", child)
            // this.root.appendChild(child);
            // 同上
            child.mountTo(this.root);
        }

        mountTo(parent) {
            parent.appendChild(this.root);
        }
    }

    class TextWrapper {
        constructor(content) {
            this.root = document.createTextNode(content);
        }

        setAttribute(name, value) {
            this.root.setAttribute(name, value);
        }

        appendChild(child) {
            child.mountTo(this.root);
        }

        mountTo(parent) {
            parent.appendChild(this.root);
        }
    }

    let a = (
        <Div id="a">
            <span>hey</span>
            <span>zhz</span>
            <span>dan</span>
        </Div>
    )

    // document.body.appendChild(a);
    a.mountTo(document.body);
    ```
6. 命令行执行 webpack ，观察 DOM ，如图：

    ![自定义 jsx 中createElement() 函数返回 DOM ](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/calssDom.png "自定义 jsx 中createElement() 函数返回 DOM ")

## 3、实现轮播组件底层封装
### 3.1、将识别 jsx 语法的功能封装到底层 frameWork.js 中
1. 根目录建立 framework.js 把 createElement、 ElementWrapper、TextWrapper 这三个移到 framework.js 文件中；
2. createElement 方法是需要 export 出去让 main.js 可以引入;
3. ElementWrapper、TextWrapper 不需要 export ，因为它们都属于内部给 createElement 使用;
4. ElementWrapper、TextWrapper 类中公共部分封装到 Component 类中，并且将 Component 类 export ，供 main.js 中 import；
```js
export class Component {
    constructor() {

    }
    //为 DOM 添加属性
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }
    //为 DOM 添加子元素
    appendChild(child) {
        console.log(this.root, child)
        // 由于所有的正常 HTML 元素都变成 ElementWrapper，故此处 child 不是正常的 HTML 元素，不能被 appendChild ；
        // this.root.appendChild(child);
        // 需要利用 ElementWrapper 的 mountTo 方法完成 DOM 的子元素添加；
        child.mountTo(this.root);
    }
    //往 body 挂载当前 DOM
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

class ElementWrapper extends Component {
    constructor(type) {
        this.root = document.createElement(type);
    }
}

class TextWrapper extends Component {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
}

export function createElement(type, attributes, ...children) {
    let element;
    if(typeof type === "string") {
        //若是字符串，创建相应元素
        //用 ElementWrapper 达到 HTML 普通元素与自定义 jsx 标签的接口兼容（兼容 mountTo() ）
        element = new ElementWrapper(type);
    } else {
        //若不是字符串，创建相应实例
        element = new type;
    }
    //为元素增加属性 对象用for in
    for (const attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute]);
    }
    //为元素增加子节点 数组用for of
    for (const child of children) {
        //若child为文本，则将child转化成文本节点
        if(typeof child === "string") {
            child = new TextWrapper(child);
        }
        element.appendChild(child);
    }
    return element;
}
```
### 3.2、顶层的 main.js 中只保留实际封装的 Carousel 功能
1. 如果每次都需要手动 webpack 打包一下，就特别麻烦，为了方便调试代码，这里安装了 webpack dev server 来解决这个问题；根目录下，执行：
    ```
    npm install --save-dev webpack-dev-server webpack-cli
    ```
2. 将 package.json 中 scripts 更改，命令行中就可以通过`npm start`启动；
3. 在浏览器打开`localhost:8080/main.html`就可以实时打包加载 js 文件，并渲染页面；
    ```json
    "scripts": {
        "start": "webpack serve"
    },
    ```
4. 将轮播图的资源放入 main.js ，建立轮播图的类 Carousel ；
5. 引入 Component, createElement 两个模块，具体逻辑，详见每一行的注释；
    ```js
    import { Component, createElement} from "./frameWork.js";

    class Carousel extends Component{
        //初始化类，依据 div 元素，创建类的根 DOM
        constructor() {
            super();
            //空对象存储 attributes ，为重写 setAttribute 方法找容器；
            this.attributes = Object.create(null);
        }
        //为了使用 src={photos} 中链接，故重写了 setAttribute 方法，
        setAttribute(name, value) {
            this.attributes[name] = value;
        }
        mountTo(parent) {
            //由于图片在属性上，先分析属性，得到了图片链接，render 中才能形成 DOM ；
            //先确保 mountTo 之后调用 render ，才能最终确保 render 在 setAttribute 之后；
            //所以需要重写mountTo；
            parent.appendChild(this.render());
        }
        render() {
            this.root = document.createElement("div");
            //根据属性中的内容，生成新的 DOM 
            for (const attribute of this.attributes.src) {
                const child = document.createElement("img");
                child.src = attribute;
                console.log("attribute",attribute)
                this.root.appendChild(child);
            }

            return this.root;
        }
    }

    let photos = [
        "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
        "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
        "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
        "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"
    ]

    //此处，在打包完成的代码中，调用了 createElement 
    let a = (
        <Carousel src={photos}>
        </Carousel>
    )

    a.mountTo(document.body);
    ```
6. 图片正常展示到页面上

    ![猫猫图](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/maomaotu.png "猫猫图")

## 4、轮播动画
### 4.1、图片排版

由于图片的元素都是 img 标签，使用这个标签，点击并且拖动的时候，它自带可以被拖拽。把 img 换成 div，然后使用 background-image，解决这个默认拖动问题。为组件中的内容添加 class 属性，在 HTML 中加入 css 样式控制；如下：

    > main.html 修改为：

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>轮播图</title>
        <style>
            .wrapper {
                white-space: nowrap;
                width: 614px;
                height: 344px;
                overflow: hidden;
            }
            .wrapper > div {
                display: inline-block;
                background-size: contain;
                width: 614px;
                height: 344px;
                transition: ease 1s;
            }
        </style>
    </head>
    <body>
        <script src="./main.js"></script>
    </body>
    </html>
    ```

    > main.js 中的 render 函数修改为：

    ```js
    render() {
        this.root = document.createElement("div");
        //---------------------为容器加 class 名----------------------//
        this.root.classList.add("wrapper");
        //根据属性中的内容，生成新的 DOM 
        for (const attribute of this.attributes.src) {
            //---------------------为 child 加背景图----------------------//
            const child = document.createElement("div");
            child.style.backgroundImage = `url(${attribute})`;
            this.root.appendChild(child);
        }
        

        return this.root;
    }
    ```

    > 此时页面中图片样式为：

    ![猫猫图](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week14/img/photo-inline.png "猫猫图")

### 4.2、main.js 中的 render 函数增加轮播逻辑，实现自动轮播
    
    ```js
    render() {
        this.root = document.createElement("div");
        this.root.classList.add("wrapper");
        //根据属性中的内容，生成新的 DOM 
        for (const attribute of this.attributes.src) {
            const child = document.createElement("div");
            child.style.backgroundImage = `url(${attribute})`;
            this.root.appendChild(child);
        }

        let currentIndex = 0;
        setInterval(() => {
            let children = this.root.children;
            let nextIndex = (currentIndex + 1) % children.length;

            let current = children[currentIndex];
            let next = children[nextIndex];

            //由于每一次轮播时，current 位置都是正确的；
            //故在轮播前先将 next 放到正确的位置，此时不需要 css 中的过渡动画；
            next.style.transition = "none";
            //下一张图片放到正确位置：
            //则 next 需要移动的长度即为：(current 的当前位置的末尾/当前 next 的位置 1 * 100%) - (第几个 next 的位置 nextIndex * 100%)
            next.style.transform = `translateX(${100 - nextIndex * 100}%)`

            //由于上面一行设置的 next.style.transform 会被下方的动画覆盖，故需要添加延时器
            setTimeout(() => {
                //next 移动到相应位置后，在轮播中又需要 css 中的过渡动画；
                next.style.transition = "";
                //轮播动画
                current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
                next.style.transform = `translateX(${- nextIndex * 100}%)`

                currentIndex = nextIndex;
            }, 30)
        }, 3000)


        return this.root;
    }
    ```

### 4.3、 实现拖拽
1. 为了使自动轮播功能不影响到拖拽，故先将上述 main.js>render() 中的 setInterval 注释掉；
2. main.js>render() 中，在 `this.root` 上监听 mousedown 事件，在 mousedown 事件中同时监听 mousemove/mouseup 事件，并且在 mouseup 中删除 mousemove/mousedown 事件，**形成任何拖拽场景下的基础代码**如下：

```js
this.root.addEventListener("mousedown", () => {
    console.log("mousedown")

    let mouseMove = event => {
        console.log("mousemove")
    };
    let mouseUp = event => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
        console.log("mouseUp")
    }
    
    //mousedown 已经是在 root 上监听， mousemove/mouseup 没有必要在 root 上监听。所以可以在 document 上直接监听这两个事件。在现代浏览器当中，使用 document 监听有额外好处：即使鼠标移出浏览器窗口外，一样可以监听到事件。
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
})
```
3. 在 this.root.addEventListener("mousedown", (event) => {}) 中实现拖拽切换图片
```js
let position = 0;
this.root.addEventListener("mousedown", (event) => {
    //记录鼠标起始x坐标
    let startX = event.clientX;
    let mouseMove = event => {
        //鼠标x坐标移动的距离
        let moveX = event.clientX - startX;
        for (const child of this.root.children) {
            //为了使 dom 跟随鼠标移动符合人的直觉，鼠标摁下选中图片时关闭过渡动画效果，完成接下来的图片跟随鼠标移动；
            child.transition = "none";
            //移动当前 child 的 DOM 元素；
            //注：由于是操作改变的css属性，故当前的移动不以上一次的移动为前体条件，依然是以初次图片的位置为前提条件；
            child.style.transform = `translateX(${- position * 614 + moveX}px)`;
        }
    };
    
    let mouseUp = event => {
        let moveX = event.clientX - startX;
        //定位移动到第几张图片
        position = position - Math.round(moveX / event.target.clientWidth);
        for (const child of this.root.children) {
            //鼠标抬起时将 css 中的过渡动画打开，完成接下来这一张图片接下来本身的移动；
            child.transition = "";
            child.style.transform = `translateX(${- position * 614}px)`
        }

        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
    }

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
})
```
4. 最终实现拖拽
```js
let position = 0;
    this.root.addEventListener("mousedown", (event) => {
    let children = this.root.children;
    //记录鼠标起始x坐标
    let startX = event.clientX;
    let mouseMove = event => {
        //鼠标x坐标移动的距离
        let moveX = event.clientX - startX;
        let clientWidth = event.target.clientWidth
        //***与相同的*对应可解开注释***当前是第几个
        let current = position - ((moveX - moveX % clientWidth) / clientWidth);
        // let current = position - Math.round(moveX / clientWidth);
        //当前这个及其前后，3张图的便利，然后分别做动画
        for (const offset of [-1, 0, 1]) {
            //分别为
            let pictureIndex = current + offset;
            pictureIndex = (pictureIndex + children.length) % children.length;
            //为了使 dom 跟随鼠标移动符合人的直觉，鼠标摁下选中图片时关闭过渡动画效果，完成接下来的图片跟随鼠标移动；
            children[pictureIndex].style.transition = "none";
            //移动当前 child 的 DOM 元素；
            //注：由于是操作改变的css属性，故当前的移动不以上一次的移动为前体条件，依然是以初次图片的位置为前提条件；
            //***与相同的*对应可解开注释***
            // children[pictureIndex].style.transform = `translateX(${- pictureIndex * 614 + offset * 614}px)`;
            children[pictureIndex].style.transform = `translateX(${- pictureIndex * 614 + offset * 614 + moveX % 614}px)`;
        }
    };
    
    let mouseUp = event => {
        let moveX = event.clientX - startX;
        //定位移动到第几张图片
        position = position - Math.round(moveX / event.target.clientWidth);
        
        for (const offset of [0, -Math.sign(Math.round(moveX / 614) - moveX + 307 * Math.sign(moveX))]) {
            let pictureIndex = position + offset;
            pictureIndex = (pictureIndex + children.length) % children.length;
            children[pictureIndex].style.transition = "";
            children[pictureIndex].style.transform = `translateX(${- pictureIndex * 614 + offset * 614}px)`;
        }

        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
    }

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
})
```

## 5、抽象开发组件需要的能力

> 见接下来文章

