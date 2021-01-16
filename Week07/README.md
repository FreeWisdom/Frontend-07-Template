# 一、JS表达式
## （一）运算符和表达式
1. `**`是js中唯一右结合的运算符：
    - `3 ** 2 ** 4` === `3 ** (2 ** 4)`
2. `==`臭名昭著类型转换最为复杂的运算符：
    - 不建议使用；
    - 类型相等时，正常比较；
    - 类型不等时，优先将`布尔类型`变量转换成`数字类型`，再比较；
## （二）类型转换
JavaScript 的类型转换用一张图可以概括
<img src="https://cdn.nlark.com/yuque/0/2021/jpeg/114317/1610417199826-assets/web-upload/fc59747b-3e25-4de2-812f-d620b1fbc714.jpeg?x-oss-process=image%2Fresize%2Cw_440">
有几个特殊的转换机制被特殊标注，他们分别是装箱转换、拆箱转换、StringToNumber、NumberToString，接下来我将一一详细介绍它们

### 1、StringToNumber
1. Number()
    - 如果是Boolean值，true和false值将分别被转换为1和0。
    - 如果是数字值，只是简单的传入和返回。
    - 如果是null值，返回0。
    - 如果是undefined，返回NaN。
    - 如果是字符串：　
    - 如果字符串中只包含数字时，将其转换为十进制数值，忽略前导0；
    - 如果字符串中包含有效浮点格式，如“1.1”，将其转换为对应的浮点数字，忽略前导0；
    - 如果字符串中包含有效的十六进制格式，如“0xf”，将其转换为相同大小的十进制数值；
    - 如果字符串为空，将其转换为0；
    - 如果字符串中包含除上述格式之外的字符，则将其转换为NaN；
    - 如果是对象，则调用对象的valueOf（）方法，然后依照前面的规则转换返回的值。如果转换的结果是NaN，则调用对象的toString（）方法，然后再依照前面的规则转换返回的字符串值。
    ```js
    var num1 = Number("Hello world");　　　　　　 //NaN
    var num2 = Number("");　　　　　　　　　　　　  //0
    var num3 = Number("0000011");　　　　　　　   //11
    ```
2. parseInt()
    - 处理整数的时候parseInt()更常用。parseInt()函数在转换字符串时，会忽略字符串前面的空格，直到找到第一个非空格字符；
    - 如果第一个字符不是数字或者负号，parseInt() 就会返回NaN，同样的，用parseInt() 转换空字符串也会返回NaN；
    - 如果第一个字符是数字字符，parseInt() 会继续解析第二个字符，直到解析完所有后续字符串或者遇到了一个非数字字符；
    - parseInt()方法还有基模式，可以把二进制、八进制、十六进制或其他任何进制的字符串转换成整数。基是由parseInt()方法的第二个参数指定的，所以要解析十六进制的值，当然，对二进制、八进制，甚至十进制（默认模式），都可以这样调用parseInt()方法。
    ```js
    var num1 = parseInt("AF",16);　　　　　　 　　　　//175
    var num2 = parseInt("AF");　　　　　　　　　　　　 //NaN
    var num3 = parseInt("10",2);　　　　　　　 　　　 //2　　(按照二进制解析)
    var num4 = parseInt("sdasdad");　　　　　　　　　 //NaN
    var num5 = parseInt("22.22.11")                              //22
    ```
3. parseFloat()
    - parseFloat() 也是从第一个字符（位置0）开始解析每一个字符。也是一直解析到字符串末尾，或者解析到遇见一个无效的浮点数字字符为止；
    - 字符串中第一个小数点是有效的，而第二个小数点就是无效的了，它后面的字符串将被忽略；
    - parseFloat() 只解析十进制，因此它没有第二个参数指定基数的用法；
    - 如果字符串中包含的是一个可解析为正数的数（没有小数点，或者小数点后都是零），parseFloat() 会返回整数。
    ```js
    var num1 = parseFloat("123AF");　　　　　　 　　　　//123
    var num2 = parseFloat("0xA");　　　　　　　　　　　　//0
    var num3 = parseFloat("22.5");　　　　　　　 　　　 //22.5
    var num4 = parseFloat("22.3.56");　　　　　　　　　 //22.3
    var num5 = parseFloat("0908.5");　　　　　　　　　  //908.5
    ```
4. parseInt() 和parseFloat() 的区别
    - parseFloat() 所解析的字符串中第一个小数点是有效的，而parseInt() 遇到小数点会停止解析，因为小数点并不是有效的数字字符;
    - parseFloat() 始终会忽略前导的零，十六进制格式的字符串始终会被转换成0，而parseInt() 第二个参数可以设置基数，按照这个基数的进制来转换;
    - 多数情况下，Number比parseInt、parseFloat好。
### 2、NumberToString
1. String()和toString()都是将其他类型的变量转换为字符串类型；
```JS
let a =1;
let b = 123;
String(a);      // '1'
typeOf(a);      // String
typeOf(b);      //Number
b.toString(); // '123'
typeOf(b);      //String;
```
2. toString()无法转换null和undefined。
```JS
let a;
let b=null;
a.toString();       //Uncaught TypeError: Cannot read property 'toString' of undefined
b.toString();   //Uncaught TypeError: Cannot read property 'toString' of null
String(a);          //"undefined"
String(b);          //"null"
```
### 3、装箱转换
1. 基本包装类型的读取过程
    * 《javascript高级程序设计3》P118的基本包装类型：
        - **每当读取一个基本类型值的时候，后台就会创建一个对应的基本包装类型的对象，从而让我们能够调用一些方法来操作这些数据。**
    ```JS
    var s1 = "some text";
    var s2 = s1.substring(2);
    ```
    * 当第二行代码访问 s1 时，访问过程（装箱过程）处于一种读取模式，也就是要从内存中读取这个字符串的值。而在读取模式中访问字符串时，后台都会自动完成下列处理：
        - 创建 String 类型的一个实例;
            - `var s1 = new String("some text");`
        - 在实例上调用指定的方法;
            - `var s2 = s1.substring(2);`
        -  销毁这个实例。
            - `s1 = null;`
2. 引用类型与基本包装类型的主要区别就是对象的生存期
    - 使用 new 操作符创建的引用类型的实例， 在执行流离开当前作用域之前都一直保存在内存中；
    - 而自动创建的基本包装类型的对象，则只存在于一行代码的执行瞬间，然后立即被销毁。
3. 装箱转换的缺点
    - 装箱机制会频繁产生临时对象，在一些对性能要求较高的场景下，我们应尽量避免对基本类型做装箱转换；
    - 如果在项目中一个值类型变量需要多次拆装箱，那么可以将这个变量提出来在前面显式装箱；
    - 将“s1.substring(8)、s2、"t"”分别push到空数组多次，下面测试出用时情况为："t" < s2 < s1.substring(8);
    ```JS
    //  情况一：a.push(s1.substring(8))
    var a = [];
    var s1 = "some text";
    var s2 = s1.substring(8);
    var d1 = new Date();
    for (var i = 0; i < 100000; i++) {
        a.push(s1.substring(8));
    }
    var d2 = new Date();
    var x = d2 - d1;
    console.log("用时：" + x + ";   s2:" + s2);    // 用时（多算几次求平均）：4/4/5/5/3/;   s2:t
    //  情况二：a.push(s2)
    var a = [];
    var s1 = "some text";
    var s2 = s1.substring(8);
    var d1 = new Date();
    for (var i = 0; i < 100000; i++) {
        a.push(s2);
    }
    var d2 = new Date();
    var x = d2 - d1;
    console.log("用时：" + x + ";   s2:" + s2);    //  用时（多算几次求平均）：3/3/3/3/4/4/4/4/4/2;   s2:t
    //  情况三：a.push("t")
    var a = [];
    var d1 = new Date();
    for (var i = 0; i < 100000; i++) {
        a.push("t");
    }
    var d2 = new Date();
    var x = d2 - d1;
    console.log("用时：" + x + ";   s2:" + s2);    //  用时（多算几次求平均）：4/3/3/3/2/3/3/2/2/3/3/3    s2:t
    ```
### 4、拆箱转换
* 在 JavaScript 标准中，规定了 ToPrimitive 函数，它是**对象类型到基本类型的转换（拆箱转换）**。
    - 对象在转换基本类型时，会调用 valueOf() 和 toString()，并且这两个方法你是可以重写的；
    - 至于调用哪个方法则分情况；
        - 如果重写的方法中出现返回的不是原始值类型的值；
            - 会跳过该方法，寻找重写方法中返回是原始值类型的值的方法；
        - 如果重写的方法中返回的均不是原始值类型的值，则报错；
            ```js
            // 报错。无法将一个对象转换为原始类型的值
            Uncaught TypeError: Cannot convert object to primitive value
            ```
        - 如果重写toString ()、valueOf ()、[Symbol.toPrimitive] ()三个方法，则优先调用[Symbol.toPrimitive] ()；
        - 如果重写toString ()、valueOf ()两个方法，则看这个对象倾向于转换为什么；
            - 如果倾向于转换为 Number 类型的，就优先调用 valueOf（）；
            - 如果倾向于转换为 String 类型，就只调用 toString（）；
            ```js
            var obj = {
                toString () {
                    console.log('toString')
                    return 'string'
                },
                valueOf () {
                    console.log('valueOf')
                    return 'value'
                },
                [Symbol.toPrimitive] () {
                    console.log('primitive')
                    return 'primi'
                }
            }
            ```
# 以下待 重学前端整理
## 二、JS语句
### （一）运行时相关概念
#### 运行时js的语句执行机制--Completion Record
* js语句执行的完成状态--Completion Record，表示一个语句执行之后的**完成状态的结果记录**，有三个字段。
    1. [[type]]，表示完成的状态，取值有 break continue return throw 和 normal;
    2. [[value]]语句的返回值，一般是基本类型；如果语句没有，则值为empty，一般只有表达式语句拥有;
    3. [[target]]表示语句的目标。通常是一个js语句标签。
### （二）简单语句和复合语句

#### 简单语句

### （三）声明

## 三、JS结构化
### （一）宏任务和微任务
### （二）JS函数调用
