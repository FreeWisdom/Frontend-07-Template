# JavaScript 中的类型
1. 数字类型（Number）
2. 字符类型（String）
3. 布尔类型（Boolean）
    - 表示真值
    - 计算机领域的 true 和 false，是把日常生活中真假的概念做了一个抽象
4. 对象（Object）
5. Null
    - 代表的是有值，但是是空
    - 由于js设计之初，时间仓促，有一个设计 bug：`typeOf null` 值的变量时会出来 Object，官方极大可能不会修复。
6. Undefined
    - 根本没有定义过这个值
    - Null 和 Undefined 经常被混用：
        - 一般来说我们不会把 Undefined 赋值给变量，我们会检查一个变量的值是否是 Undefined。
        - 客观上来说 JavaScript 是允许进行 Undefined 赋值的。
        - 但，建议要克制使用 undefined 赋值，尽量使用 Null 代替 Undefined 进行赋值。
7. Symbol
    - 新加的基本类型
    - 它一定程度上代替了 String 的作用
    - 可以用于 Object 里的索引
    - 与 String 最大的区别就是，String 全天下都一样，只要你能猜出 String 的内容是什么，无论前面后面加了多少个符号，只要别人想用，对象的属性总是能取出来。
    - Symbol 就不一样了，如果你取不到 Symbol，那里面的内容是不可能被取得的。这个也是 JavaScript 独特有的特性。

## 一、Number类型
* Number 的语法 在 2018 年的标准里面有 4 个部分：
    1. 十进制（Decimal Literal）
        - 0、0.、.2、1e3
            - ***`0.toString()`报错的原因：***
                - 由于 `0.` 是合法的10进制语法，`0.` 会被js看做是`0`，`0.toString()`当做`0toString()`，故而会报错；
                - 可以这么写：
                    - `0 .toString()` 或者 `0..toString()`
    2. 二进制（Binary Integral Literal）
        - 0b111 —— 以 0b 开头，可以用 0 或者 1
    3. 八进制（Octal Integral Literal）
        - 0o10 —— 以 0o 开头，可以用 0-7
    4. 十六进制（Hex Integer Literal）
        - 0xFF —— 0x 开头，可以用 0-9，然后 A-F

## 二、String类型
### 1、字符集（String）
1. ASCII
    - 早年因为字符数量比较少，所以我们都把字符的编码都叫 ASCII 码；
    - 但是其实是错的，ASCII 只规定了 127 个计算机里最常用的 127 个字符
        - 包括26个大写，26个小写英文字母，0-9数字，以及各种制表符、特殊符号、换行、控制字符，总共用了127个，所以用 0-127 来表示；
    - 显然就没有办法表示中文，ASCII 字符集最早是美国计算机先发明出来的一种编码方式，只照顾到英文；
    - 除ASCII码外，各个编码都不兼容，但所有的编码都会兼容 ASCII；
2. Unicode
    - Unicode 是后来建立的标准，把全世界的各种字符都放在一起，形成一个大合集，所以也叫 “联合的编码集”；
    - Unicode 的字符的数量非常庞大，然后还划成了各种的片区，每个片区分给不同国家的字符和字体；
    - 早年的时候大家觉得 Unicode 中 0000 到 FFFF 就已经够了，也就是相等于两个字节，后来发现还不够用，所以这个也造成了一些设计上的问题；
3. UCS
    - Unicode 和另外一个标准化组织合并产生了 UCS；
    - UCS也是只有 0000 到 FFFF 一个范围的字符集；
4. GB（国标）
    - GB2312 是国标的第一个版本，也是大家广泛使用的一个版本；
    - GBK(GB3000) 是后来推出的扩充版本，GBK 本来也是以为够用了；
    - 后来又出了一个大全的版本叫 GB18030, 这个就补上了所有的缺失的字符了；
    - 国标范围比较小，与 Unicode 相比同样的一组中文，用 GB 编码肯定要比用 Unicode 要省空间；
5. ISO-8859
    - 与国标类似，一些东欧国家把自己国家的语言设计成了类似 GB 一样的 ASCII 扩展
    - 8859 系列都是跟 ASCII 兼容，但是互不兼容，所以它不是一个统一的标准
    - 然后我们国家也没有往 ISO 里面去推，所以 ISO 里面是没有中文的版本的
6. BIG5
    - BIG5 与国标类似，是台湾一般用的就是 BIG5，俗称大五码
        - 我们小时候一般大家不用 Unicode 的时候，就会发现台湾游戏玩不了，所有文字都是乱码，这个就是因为他们用的是大五码来表示字符的；
    - ISO-8859系列和 BIG5 系列的性质特别的像，都是属于一定的国家地区语言的特定的编码格式；
    - 但是他们的码点都是重复的，所以是不兼容的，所以会出现乱码，需要去切换编码才能正常看到文字；
### 2、字符编码（Encoding）
1. ASCII 不存在编码问题：
    - 因为 ASCII 字符集本身最多就占一个字节，所以说它的编码和码点事一模一样的，我们是没有办法做出比一个字节更小的编码单位。所以ASCII 不存在编码问题；
2. GB、Unicode 都存在编码问题：
    - 因为 Unicode 结合了各个国家的字符，所以它存在一些各种不同的编码方式。
3. UTF（Unicode Transformation Format），Unicode 可以由不同的字符集实现。最常用的编码是 UTF-8 和 UTF-16：
    1. UTF-8（全称：Unicode Transformation Format 8-bit）
        - 是一种针对 Unicode 的字符编码。里面的 8 是代表 8 个 bit 位，代表一个字符。
            - 即，默认一个字节，代表一个字符。
            - 故，一段 ASCII 编码的文字一定是 utf-8 编码的文字，反之不成立；
    2. UTF-16（全称：Unicode Transformation Format 16-bit）
        - 是一种针对 Unicode 的字符编码。里面的 16 是代表 16 个 bit 位，代表两个字符。
            - 即，默认两个字节，代表一个字符。
4. 例汉字“一”分别用 utf-8/utf-16 表示的方法
### 3、通过JavaScript进行utf-8编码
* 题目：将javascript生成的Unicode编码字符串转为UTF-8编码的字符串
    1. 确定字符集 Unicode ：
        - ECMAScript3要求JavaScript必须支持Unicode2.1及后续版本，ECMAScript5则要求支持Unicode3及后续版本。所以，我们编写出来的javascript程序，都是使用Unicode编码的；
    2. 确定编码方式 UTF-8 ：
        - 如标题所说的应用场景十分常见，例如发送一段二进制到服务器时，服务器规定该二进制内容的编码必须为UTF-8。
    3. 思路：
        通过程序将 javascript 的 Unicode 字符集，通过 UTF-8 编码，得到16进制，再形成2进制，传给服务器。
    4. 简便方法：
```js
function UTF8_Encoding(string){
  return new TextEncoder().encode(string);
}
```
### 4、字符串语法（Grammar）
1. 早年 JavaScript 支持两种写法：
    - 双引号字符串 —— “abc”
    - 单引好字符串 —— 'abc'
2. 字符串里面的 “微语法”
    - 双引号和单引号字符串其实没有什么区别，它们之间的区别仅仅是在单双引号的使用下，双引号里面可以加单引号作为普通字符，而单引号中可以加双引号作为普通字符。
    - 引号中会有一些特殊字符，比如说 “回车” 就需要用 \n、“Tab” 符就是 \t。在双引号当中如果我们想使用双引号这个字符的时候，同样我们可以在前面加上反斜杠： \"。没有特殊含义的字符，就是在它们前面加上反斜杠。（然后反斜杠自身也是 \\ 就可以了）
3. 比较新的 JavaScript 版本就加了 “反引号” —— `abc`，也就是我们键盘上 1 键左边的按键。目前来说反引号这个符号是不太常用，也正因为这个字符不常用，所以它非常适合做语法的结构。
    - 反引号要比早年的双单引号更加强大，里面可以解析出回车、空格、Tab等字符。特别是可以在里面插入 ${变量名} ，直接就可以在字符串内插入变量拼接。只要我们在里面不用反引号，我们可以随便加什么都行。
    - 案例 —— 这里我们尝试使用正则表达式，来匹配一个单引号/双引号的字符串：
        - 看首先是空白定义，包含回车、斜杠、\n\r
        - 2028 和 2029 就是对应的分段和分页
        - \x 和 \u 两种转义方法
```js
// 双引号字符正则表达式
"(?:[^"\n\\\r\u2028\u2029]|\\(?:[''\\bfnrtv\n\r\u2029\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*"

// 单引号字符正则表达式
'(?:[^'\n\\\r\u2028\u2029]|\\(?:[''\\bfnrtv\n\r\u2029\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*'
```

## 三、布尔类型
1. true
2. false

## 四、null/undefined
1. Null 表示有值，但是是空；
    - 注意：***Null 是关键字。***
    - 那么 null 是一个关键字，所以它就没有这一类的问题，如果我们给 Null 赋值它就会报错。
        - 例如：
            ```js
            function foo() {
            var null = 0;
            console.log(null);
            }
            ```
2. Undefined 语义上就表示根本没有人去设置过这个值，所以就是没有定义
    - 注意：***Undefined 不是关键字。***
        - Undefined 是一个全局变量，在早期的 JavaScript 版本里全局的变量我们还可以给他重新赋值的。
            - 如我们把 Undefined 赋值成 true，最后造成了一大堆地方出问题了。
    - 虽然说新版本的 JavaScript 无法改变全局的 Undefined 的值，但是在局部函数领域中，我们还是可以改变 Undefined 的值的。
        - 例如：
            ```js
            function foo() {
            var undefined = 1;
            console.log(undefined);
            }
            ```
3. 如何表示 Undefined 最安全？
    - 在开发的过程中我们一般不用全局变量，我们会用 void 0 来产生 Undefined ，因为 void 运算符是一个关键字，void 后面不管跟着什么，他都会把后面的表达式的值变成 Undefined 。那么 void 0、void 1、void 的一切都是可以的，一般我们都会写 void 0。

## 五、Object
### 设计对象的原则
1. 我们不应该收到语言描述的干扰（特别是业务需求的干扰）
2. 在设计对象的状态和行为时，我们总是遵循 “行为改变状态” 的原则
3. 违背了这个原则，整个对象的内聚性就没有了，这个对架构上会造成巨大的破坏
### Object 三要素
* 只要三要素齐备，就为对象。对象就要有状态，状态是可以被改变的，改变就是行为。
    1. Identifier —— 唯一标识
        - 使用内存地址
    2. State —— 状态
    3. Behavior —— 行为
### Object —— Class（类）
1. 归类
    - 研究单个对象，从里面提取共性变成类，之后又在类之间去提取共性，把它们变成更高的抽象类。
        - 比如，在 “羊” 和 “鱼” 中提取共性，然后把它们之间的共享再提取出来变成 “动物” 类。
        - 对于 “归类” 方法而言，多继承是非常自然的事情，如 C++ 中的菱形继承，三角形继承等。
2. 分类
    - 把世界万物都抽象为一个基类 Object，然后定义这个 Object 中有什么。
        - 采用分类思想的计算机语言，则是单继承结构。并且会有一个基类 Object。
3. JavaScript 这个语言比较接近 “分类” 这个思想，但是它也不完全是分类的思想，因为它是一个多范式的面向对象语言。
### Object —— Prototype（原型）
1. 原型是 JavaScript 描述对象的方式。
2. 原型
    - 找出类中的一个具体实例；
    - 将实例的特征加到这个类的原型上；
    - 要实现其它实例，需要根据该类的原型进行修改，而实现；
3. 用 JavaScript 去设计狗咬人的代码
    - 如果我们按照一个比较朴素的方法，我们就会去定义一个 Dog Class，然后里面给予这个 Class 一个 bite 的方法。
        ```js
        class Dog {
        bite(Human) {
            // ......
        }
        }
        ```
    - 这样的一段代码是跟我们的题目是一模一样的，但是这个抽象是一个错误的抽象。因为这个违背了面向对象的基本特征，不管我们是怎么设计，只要这个 bite 发生在狗身上就是错误的。
    - 因为我们前面讲到了面向对象的三要素，对象的状态必须是对象本身的行为才能改变的。那么如果我们在狗的 Class 中写 bite 这个动作，但是改变的状态是 “人”，最为狗咬了人之后，只会对人造成伤害。所以在这个行为中 “人” 的状态是发生变化的，那么如果行为是在狗的 Class 中就违反了面向对象的特征了。
    - 所以我们应该在 “人” 的 Class 中设计一个行为。这里更加合理的行为应该是 hunt 表示被伤害了，然后传入这个行为的参数就是收到的伤害程度 damage。因为这里人只关心它收到的伤害有多少就可以了，他是不需要关系是狗咬的还是什么咬的。
        ```js
        class Human {
        hurt(damage) {
            //......
        }
        }
        ```
    - 代码实现逻辑如下：
        ```js
        class Human {
        constructor(name) {
            this.name = name;
            this.healthPoints = 100;
        }

        hurt(dogName, damage) {
            this.healthPoints -= damage;
            console.log(`${this.name} 受到了 ${dogName} 的 ${damage} 点伤害，剩余生命中为 ${this.healthPoints}，已返回水晶！`);
        }
        }

        class Dog {
        constructor(name) {
            this.name = name;
            this.attackPower = 100;
        }

        bite() {
            return this.attackPower;
        }
        }

        let human = new Human("特朗普");
        let novelCoronavirusMadDog = new Dog("新冠疯狗");

        human.hurt(novelCoronavirusMadDog.name, novelCoronavirusMadDog.bite());
        ```
### Object —— Property（属性）
1. JavaScript 的属性是 `key：value` 对，
    - key ：可以是两种类型
        - symbol：只能通过变量引用，故两个 symbol 即使名字相同，值也不同，优化了属性访问权限控制；
        - string：可以拿到对象实例后访问到该属性；
    - value ：有两种形态
        - 数据属性（Data Property）
            - [[value]]
                - js七种类型均可；
            - attribute（和property区分，是属性的一种特针值）
                - writable：是否可写特征值；
                    - `writable: false`：仅仅是`.`运算不可更改；
                        - 但仍可通过`define property`修改 writable 特征值，强行将数据变得可更改；
                - enumerable：是否可枚举特征值；
                - configurable：是否可以被改变（配置）特征值；
                    - `configurable: false`：所有的属性都不可更改；
        - 访问器属性（Accessor Property）
            - attribute
                - get 
                - set
                - enumerable
                - configurable
2. 访问属性的原型机制
    - “原型链”：访问属性时若当前对象没有，则会沿着原型找原型对象是否有此名称的属性；
        - “原型链”保证了每个对象只需要描述自己和原型区别；
### Object —— API/语法（Application Programming Interface、Grammar）
1. {}.[]Object.defineProperty：
    - 最**基础**的方式，提供了基本的对象机制，通过**语法**创建对象、访问属性、定义新的属性、改变属性的特征值；
2. Object.create/Object.setPrototypeOf/Object.getPrototypeOf：
    - 基于**原型**的描述对象的**API**，在指定原型的情况下去创建对象、修改一个对象的原型、获取一个对象原型
3. new/class/extends新**语法**结构：
    - 基于**类**的方式描述对象
4. new/function/prototype 历史包袱
    - 不伦不类，长得像基于 class 的，实际上仍需要 prototype 知识才能完成面向对象的抽象。
        - 故不建议使用（es3前历史使用）；
### JavaScript 中的对象分类
1. 宿主对象（host Objects）：由 JavaScript 宿主环境提供的对象，它们的行为完全由宿主环境决定。
    - JavaScript 宿主对象千奇百怪，但是前端最熟悉的无疑是浏览器环境中的宿主了。
    - 在浏览器环境中，我们都知道全局对象是 window，window 上又有很多属性，如 document。
    - 实际上，这个全局对象 window 上的属性，一部分来自 JavaScript 语言，一部分来自浏览器环境。
    - JavaScript 标准中规定了全局对象属性，w3c 的各种标准中规定了 Window 对象的其它属性。
2. 内置对象（Built-in Objects）：由 JavaScript 语言提供的对象。
    - 固有对象（Intrinsic Objects ）：由标准规定，随着 JavaScript 运行时创建而自动创建的对象实例。
    - 原生对象（Native Objects）：可以由用户通过 Array、RegExp 等内置构造器或者特殊语法创建的对象。
3. 普通对象（Ordinary Objects）：由{}语法、Object 构造器或者 class 关键字定义类创建的对象，它能够被原型继承。
4. 用对象来模拟函数与构造器：函数对象与构造器对象
    - 我在前面介绍了对象的一般分类，在 JavaScript 中，还有一个看待对象的不同视角，这就是用对象来模拟函数和构造器。
    - 事实上，JavaScript 为这一类对象预留了私有字段机制，并规定了抽象的函数对象与构造器对象的概念。
        - 函数对象的定义是：具有 [[call]] 私有字段的对象；
        - 构造器对象的定义是：具有私有字段 [[construct]] 的对象；
    - JavaScript 用对象模拟函数的设计代替了一般编程语言中的函数，它们可以像其它语言的函数一样被调用、传参。
        - 任何宿主只要提供了“具有 [[call]] 私有字段的对象”，就可以被 JavaScript 函数调用语法支持。
    - 任何对象只需要实现 [[call]]，它就是一个函数对象，可以去作为函数被调用；
    - 如果它能实现 [[construct]]，它就是一个构造器对象，可以作为构造器被调用。
4. 特殊行为对象
    - Array：Array 的 length 属性根据最大的下标自动发生变化。
    - Object.prototype：作为所有正常对象的默认原型，不能再给它设置原型了。
    - String：为了支持下标运算，String 的正整数属性访问会去字符串里查找。
    - Arguments：arguments 的非负整数型下标属性跟对应的变量联动。
    - 模块的 namespace 对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import 吧。
    - 类型数组和数组缓冲区：跟内存块相关联，下标运算比较特殊。
    - bind 后的 function：跟原来的函数相关联。
        - `typeOf function()`结果不是 Object ，结果是Function。

