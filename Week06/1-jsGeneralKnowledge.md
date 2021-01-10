# JS语言通识
## 一、泛用语言类分类方法
* 语言按语法分类
    - 非形式语言：中文、英文……
    - 形式语言
        - 乔姆斯基谱系：是计算机科学中刻画形式文法表达能力的一个分类谱系，是由诺姆·乔姆斯基于 1956 年提出的。它包括以下四个层次：
            1. 0- 型文法（无限制文法或短语结构文法）包括所有的文法。
            2. 1- 型文法（上下文相关文法）生成上下文相关语言。
            3. 2- 型文法（上下文无关文法）生成上下文无关语言。
            4. 3- 型文法（正规文法）生成正则语言。

## 二、产生式
### 1、有关产生式相关的名词解析
* 产生式： 在计算机中指 Tiger 编译器将源程序经过词法分析（Lexical Analysis）和语法分析（Syntax Analysis）后得到的一系列符合文法规则（Backus-Naur Form，BNF）的语句；
* 巴科斯诺尔范式：即巴科斯范式（英语：Backus Normal Form，缩写为 BNF）是一种用于表示上下文无关文法的语言，上下文无关文法描述了一类形式语言。
    - 它是由约翰·巴科斯（John Backus）和彼得·诺尔（Peter Naur）首先引入的用来描述计算机语言语法的符号集；
* 终结符：最终在代码中出现的字符；
* 语法结构名：用尖括号（ < , > ）括起来的名称来表示；
* 语法结构：分成基础结构和需要用其他语法结构定义的复合结构；
    - 基础结构称终结符；
    - 复合结构称非终结符；
* 终结符：引号和中间的字符表示；
* 可以有括号；
* '*'：表示重复多次；
* '|'：表示 “或”；
* '+'：表示至少一次；
### 2、用 BNF 来表述四则运算、带括号的四则运算。
#### 2.1、编写四则运算产生式:
* 四则运算是加减乘除，它是有一个优先级的关系的。
    - 我们可以理解为一个 1+2x3 的连加法当中，可以拆分成一个 1 和 2x3 组成的；
    - 那么 2x3 是它的子结构，然后 2 和 3 ，就是这个结构中的 Number ，然后中间就是运算符 * 。
* 所以用 BNF 去描述这个远算的时候，首先我们会定义一个“加”法表达式，格式就是：
    - 乘法表达式的列表 或
      加法表达式 + 乘法表达式 或
      加法表达式 - 乘法表达式
* 因为 BNF 是可以递归的，所以在定义表达式的时候，可以使用自身的表达式。
* 那么乘法也是类似，只不过那加法中乘法的表达式换成了 Number 就可以了：
    - Number 或
      乘法表达式 * Number 或
      乘法表达式 / Number
* 用代码是这样写的：
    1. 四则远算是：1 + 2 * 3
    2. 里面的终结符：
        - Number
        - '+'、'-'、'*'、'/'
    3. 里面的非终结符：
        - MultiplicativeExpression
        - AdditiveExpression
```html
<MultiplicativeExpression>::=<Number> |
    <MultiplicativeExpression> "*" <Number> |
    <MultiplicativeExpression> "/" <Number>

<AdditiveExpression>::=<MultiplicativeExpression> |
    <AdditiveExpression> "+" <MultiplicativeExpression> |
    <AdditiveExpression> "-" <MultiplicativeExpression>
```
#### 2.2、编写带括号的四则运算产生式:
    1. 括号运算：（1 + 2） * 3
    2. 里面的终结符：
        - Number
        - '+'、'-'、'*'、'/'、'('、')'
    3. 里面的非终结符：
        - MultiplicativeExpression
        - AdditiveExpression
        - BracketExpression
```html
<BracketExpression>  ::=  <Number> | "("<AdditiveExpression>")"

<MultiplicativeExpression>::=<Number> |
    <MultiplicativeExpression> "*" <Number> |
    <MultiplicativeExpression> "/" <Number>

<AdditiveExpression>::=<MultiplicativeExpression> |
    <AdditiveExpression> "+" <MultiplicativeExpression> |
    <AdditiveExpression> "-" <MultiplicativeExpression>
```
### 3、尝试通过产生式，理解乔姆斯基谱系
1. 0-型：无限制文法
    - 产生式： ? ::= ?
    - 在无限制文法当中是可以产生多个非终结符
    - 所以在无限制文法里面是可以随便写
2. 1-型：上下文相关文法
    - 产生式： ? <A> ? ::= ? <B> ?
    - 对产生的书写做出了一定的限制
    - 可以在左边右边的 ? 中写多个非终结符
    - 但是可变化的只能是前面与后面，并且是有关系的
    - 而中间一定是有一个固定的不变的部分
    - 所以 <A> 前面的 ? 就是上文，后面的 ? 就是下文
3. 2-型：上下文无关文法
    - 产生式： <A> ::= ?
    - 左边的 <A> 一定是一个非终结符
    - 右边的 ? 就是可以随便写，可以是一大堆终结符或者混合终结符和非终结符
4. 3-型：正则文法
    - 产生式：
        - <A> ::= <A>? ✅
        - <A> ::=? <A> ❌
    - 假如说正则文法是递归定义的，那么它不允许这个定义 A 出现在尾巴上
    - 如果左边的符号 <A> ，那么右边一定要出现在产生式的最开头的
    - 根据这个规则，所有的正则文法都是可以被正则表达式来表示的
### 4、JavaScript是哪种文法？
* JavaScript 总体上属于上下文无关文法，其中的表达式部分大部分属于正则文法，但是这里面是有两个特例：
    1. JavaScript 的表达式里面有新加一个 ** 运算符， ** 表示乘方
        - 乘方运算符其实是右结合的 ，比如说 2 ** 1 ** 2 结果是 2
        - 这里是因为 1 ** 2 是先计算的，1 的 2 次方是 1，然后 2 的 1 次方是2，所以最后结果是 2 而不是 4
        - 所以因为它是右结合的，就不是一个正则文法，如果 if 这些判断加入的话，就更加不是正则文法了
    2. 比如说 get
        - 如果我们在写成 get a {return 1} 那 get 就类似关键字的东西
        - 但是如果我们在 get 后面加入 : ，那 get 本身就是属性名了
* 所以如果我们严格按照乔姆斯基谱系来理解，那么 JavaScript 是属于上下文相关文法。
### 5.其他产生式
* 除了乔姆斯基谱系可以用 BNF 来定义，其实还有很多的不同的产生式的类型。
    - 比如说后来出现的 EBNF、ABNF，都是针对 BNF 的基础上做了语法上的扩张。
    - 一般来说每一个语言的标准里面，都会自定义一个产生式的书写方式。
    - 如 JavaScript 中是：
```js
AdditiveExpression:
  MultiplicativeExpression
  AdditiveExpression +
MultiplicativeExpression
  AdditiveExpression -
MultiplicativeExpression 
```

## 三、现代语言分类
### 现代语言的特例
1. C++ 中， * 可能表达乘号或者指针，具体是哪个，取决于星号前面的标识符是否被声明为类型；
2. VB 中， < 可能是小于号，也可能是 XML 直接量的开始，取决于当前位置是否可以接受XML直接量；
3. Python 中，行首的 tab 符和空格会根据上一行的行首空白以一定规则被处理成虚拟终结符 indent 或者 dedent；
4. JavaScript 中， / 可能是除号，也可能是正则表达式开头，处理方式类似于 VB，字符串模版中也需要特殊处理 } ，还有自动插入分号规则；
### 语言的分类
1. 形式语言 —— 用途
    - 数据描述语言 —— 有些时候我们需要去存储一个粹的数据，本身是没有办法进行编程的
        - JSON, HTML, XAML, SQL, CSS
    - 编程语言
        - C, C++, Java, C#, Python, Ruby, Perl, PHP, Go, Perl, Lisp, T-SQL, Clojure, Haskell, JavaScript, CoffeeScriptx
2. 形式语言 —— 表达方式
    - 声明式语言
        - JSON, HTML, XAML, SQL, CSS, Lisp, Clojure, Haskell
    - 命令型语言
        - C, C++, Java, C#, Python, Ruby, Perl, JavaScript

## 四、编程语言性质
### 图灵完备性
* 图灵完备性 ：在可计算性理论里，如果一系列操作数据的规则（如指令集、编程语言、细胞自动机）可以用来模拟单带图灵机，那么它是图灵完全的。这个词源于引入图灵机概念的数学家艾伦·图灵。虽然图灵机会受到储存能力的物理限制，图灵完全性通常指“具有无限存储能力的通用物理机器或编程语言”。
* 图灵机（Turing machine） ：又称确定型图灵机，是英国数学家艾伦·图灵于 1936 年提出的一种将人的计算行为抽象掉的数学逻辑机，其更抽象的意义为一种计算模型，可以看作等价于任何有限逻辑数学过程的终极强大逻辑机器。
1. 命令式 —— 图灵机
    - goto
    - if 和 while
2. 声明式 —— lambda
    - 递归
### 动态与静态
1. 动态：
    - 在用户的设备 / 在线服务器上运行
    - 时机：产品实际运用时
    - 术语：Runtime（运行时）
2. 静态：
    - 在程序员的设配上运行
    - 时机：产品开发时
    - 术语：Compile time（编译时）
* 注：JavaScript 这种解释执行的语言，它是没有 Compile time 的。我们现在也会用到 Webpack 去 build 一下我们的代码，但是实际上还是没有 Compile time 的。所以说，今天的 Runtime 和 Compile time 的对应已经不准确了，但是我们依然会愿意沿用 Compile time 的习惯，因为 JavaScript 它也是 “Compile time（开发时）” 的一个时间，所以也会用 Compile time 这个词来讲 JavaScript 里面的一些特性。
### 类型系统
1. 动态类型系统 —— 在用户机器上可以找到的类型时
    - JavaScript就是动态类型系统
2. 静态类型系统 —— 只在程序员编写代码的时候可以找到的类型时
    - C++最终编译到目标的机器的代码的时候，所有的类型信息都被丢掉了
3. 半动态半静态类型系统 
    - 比如 Java 一类的语言提供了反射机制
    - 在编译时主要的类型检查和类型的操作，都已经在编译时被处理掉了
    - 但是如果你想在运行时去获得类型信息，还是可以通过反射去获取的
4. 强类型与弱类型 —— 说明在编程语言里类型转换发生的形式
    - 强类型： 无隐式转换
        - 类型转化是不会默认发生
    - 弱类型： 有隐式转换
        - JavaScript 就是典型的弱类型的语言，默认吧 Number 转换成 String 类型然后相加后给你得到一个 String 类型，还有 String 和 Boolean 双等运算，会先把 Boolean 转成 Number 然后再跟 String 去做是否相同的对比
5. 复合类型
    - 结构体
    - 函数签名（包含参数类型和返回值类型两个部分）
6. 子类型 —— 典型的语言就是 C++（在做类型转换的时候，会有一些默认的行为）
7. 泛型
    - 协变与逆变： https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html
    - 协变例子：凡是能用范型数组 Array <Parent> 的地方都能用 Array <Child>
    - 逆变例子：凡是能用 Function <Child> 的地方，都能用 Function <Parent>

## 五、一般命令式编程语言的设计方式
* 一般来说我们的命令式语言可能有一些细微的结构上的不一致，但是它总体上来讲会分成5个层级。
    1. 原子级（Atom）—— 一个语言的最小的组成单位
        - 关键字（Identifier）
        - 字符/数字的直接量（Literal）
        - 变量名（Variables）
    2. 表达式（Expression）—— 原子级结构通过运算符相连接和辅助符号形成
        - 原子单位（Atom）
        - 操作符（Operator）—— 加减乘除，拼接符等等
        - 语法符（Punctuator）
    3. 语句（Statement）—— 表达式加上特定的标识符、关键字、符号形成一定的结构
        - 表达式（Expression）
        - 关键字（Keyword）
        - 语法符（Punctuator）
    4. 结构化（Structure）—— 帮助我们组织、分块、分成不同的复用结构
        - 函数（Function）
        - 类（Class）
        - 过程（Process）—— PASCAL 语言就会有 Process 的概念
        - 命名空间（Namespace）—— C++ / PHP 中就会有 Namespace 的概念
    5. 程序（Program）—— 管理语言模块和安装
        - 程序（Program）—— 实际执行的代码
        - 模块（Module）—— 准备好被复用的模块
        - 包（Package）
        - 库（Library）
* 语法 --语义--> 进行时