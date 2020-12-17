# 使用LL算法构建AST（四则运算 --> 抽象语法树）

## 日志
1. 正则表达式：
    - 将字符串`"10 + 33 - 4 * 50 / 2"`中所有字符按照类型划分，写出可以区分类别的正则表达式；
    - 利用正则表达式，在`tokenize("1033 - 4 * 500")`函数中实现对参数”字符串“类型的监控；
2. 词法分析：
    - 即扫描scanner。读取代码，然后把它们按照预定的规则合并成一个个的标识tokens。
    - 同时，它会移除空白符，注释，等。
    - 最后，整个代码将被分割进一个tokens列表（或者说一维数组）。
    - 具体实现：利用第一步的正则监控，将字符串`"10 + 33 - 4 * 50 / 2"`以`token = {type: "数字", value: "10" }`形式分类整理并逐个遍历捕获；
    - 这是”处理词法“的普遍方法，实现字符串的词法分析器；
3. 语法分析：
    - 将词法分析出来的数组转化成树形的表达形式。同时，验证语法，语法如果有错的话，抛出语法错误。
    - 具体实现：按照由低（基层）到高（顶层）“乘法表达式 -> 加法表达式 -> 表达式”顺序，针对四则运算(...函数表达式...)的字符串，进行表达式的递归，分类。

## AST理解与探索
* AST：Abstract syntax tree抽象语法树；
* 语法分析：构建抽象语法树的过程；
* 语法分析算法核心思想
    - LL算法：left left按照从左到右的规约扫描
    - LR算法
* 用例：
1. 代码转换之babel；
    - babel 是一个 JavaScript 编译器；
    - 宏观来说，它分3个阶段运行代码：
        1. 解析(parsing)：将代码字符串转换成AST抽象语法树；
            - 即，本节课所学将代码进行词法、语法进行分析，转化成ast;
        2. 转译(transforming)：对抽象语法树进行操作，兼容es6/7代码等，即，修改tokens；
        3. 生成(generation) — 根据变换后的抽象语法树，生成新的代码字符串。
2. 代码从旧的框架迁移到新框架；***（可以探索下找找例子）***
3. Prettier 格式化；
4. 代码--->可视化；
5. 线上转ast网站:https://astexplorer.net/

## 生疏小技
* RegExpObject.exec(string)
    - 如果 exec() 找到了匹配的文本，则返回一个结果数组。否则，返回 null。
    - 如果在一个字符串中完成了一次模式匹配之后要开始检索新的字符串，就必须手动地把 lastIndex 属性重置为 0。
    - 注：无论 RegExpObject 是否是全局模式，exec() 都会把完整的细节添加到它返回的数组中。这就是 exec() 与 String.match() 的不同之处，后者在全局模式下返回的信息要少得多。因此我们可以这么说，***在循环中反复地调用 exec() 方法是唯一一种获得全局模式的完整模式匹配信息的方法***。

* RegExpObject.lastIndex
    - lastIndex 属性用于规定下次匹配的起始位置。
    - 注意： 该属性只有设置标志 g 才能使用。
    - 注意：该属性是可读可写的。只要目标字符串的下一次搜索开始，就可以对它进行设置。当方法 exec() 或 test() 再也找不到可以匹配的文本时，它们会自动把 lastIndex 属性重置为 0。
    ```js
    var str="The rain in Spain stays mainly in the plain";
    var patt1=/ain/g;

    while (patt1.test(str)==true) 
    {
        console.log("'ain' found. Index now at: "+patt1.lastIndex);
        console.log("<br>");
    }

    // 'ain' found. Index now at: 8
    // 'ain' found. Index now at: 17
    // 'ain' found. Index now at: 28
    // 'ain' found. Index now at: 43
    ```
* Generator 函数的使用
    - for...of循环可以自动遍历 Generator 函数运行时生成的Iterator对象，且此时不再需要调用next方法。
        ```js
        function* foo() {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
        yield 5;
        return 6;
        }

        for (let v of foo()) {
        console.log(v);
        }
        // 1 2 3 4 5
        ```
        上面代码使用for...of循环，依次显示 5 个yield表达式的值。这里需要注意，一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象，所以上面代码的return语句返回的6，不包括在for...of循环之中。
    - 除了for...of循环以外，扩展运算符（...）、解构赋值和Array.from方法内部调用的，都是遍历器接口。这意味着，它们都可以将 Generator 函数返回的 Iterator 对象，作为参数。
        ```js
        function* numbers () {
        yield 1
        yield 2
        return 3
        yield 4
        }

        // 扩展运算符
        [...numbers()] // [1, 2]

        // Array.from 方法
        Array.from(numbers()) // [1, 2]

        // 解构赋值
        let [x, y] = numbers();
        x // 1
        y // 2

        // for...of 循环
        for (let n of numbers()) {
        console.log(n)
        }
        // 1
        // 2
        ```
* js中`isNaN()`和`Number.isNaN()`的区别
    - `isNaN('xxx')`：当我们向isNaN传递一个参数，它的本意是通过Number()方法尝试将这参数转换成Number类型，如果成功返回false，如果失败返回true。所以isNaN只是判断传入的参数是否能转换成数字，并不是严格的判断是否等于NaN。
    - `Number.isNaN('xxx')`：判断传入的参数是否严格的等于NaN(也就是 ===)。
        ```js
        //那一般在什么情况下会用到Number.isNaN呢：当两个变量进行运算时，我们可以使用Number.isNaN来判断它的值是否为NaN
        console.log(Number.isNaN(1/'测试')); //输出true
        ```
    - 两者的区别：Number.isNaN不存在类型转换的行为。
        ```js
        console.log(isNaN('测试')) //true isNaN会通过Number方法，试图将字符串"测试"转换成Number类型，但转换失败了，因为 Number('测试') 的结果为NaN ，所以最后返回true。
        console.log(Number.isNaN('测试')) //false Number.isNaN方法，只是严格的判断传入的参数是否全等于NaN( '测试' === NaN) ，字符串当然不全等于NaN啦，所以输出false。
        ```
