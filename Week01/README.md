# 学习笔记

## DOM不熟练方法:
* document.getElementById
* document.getElementsByClassName
* document.createElement
* Element.classList.add
* Element.innerText
* Element.innerHTML
* Element.appendChild

## 几种遍历比较
* for···of
    - 为遍历数组而设计，遍历出来的是value；
        - 如果要通过for...of循环，获取数组的索引，可以借助数组实例的entries方法和keys方法（参见《数组的扩展》一章）。
    - for...of循环内部调用的是数据结构的Symbol.iterator方法。
    - for...of循环可以代替数组实例的forEach方法。
        ```js
        const arr = ['red', 'green', 'blue'];

        arr.forEach(function (element, index) {
        console.log(element); // red green blue
        console.log(index);   // 0 1 2
        });
        ```
    - for...of循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。这一点跟for...in循环也不一样。
        ```js
        let arr = [3, 5, 7];
        arr.foo = 'hello';

        for (let i in arr) {
        console.log(i); // "0", "1", "2", "foo"
        }

        for (let i of arr) {
        console.log(i); //  "3", "5", "7"
        }
        ```
* for···in为遍历对象而设计，遍历出来的是key；
* forEach：一般用来遍历数组，不能continue跳过/break终止循环, 没有返回值, return可以跳过当前循环；

## 常用技法
* 允许异步操作的语言，while(true){}方式组织代码，表示无限进行下去的事件；
* 一位数组的clone函数中，运用了Object.create()方法，来创建新对象，可以减少内存空间，且以原有的pattern为原型，继承了原有pattern的方法和数据；
* 嵌套的三目运算清楚的展示逻辑方法：
```javascript
cell.innerText = 
    pattern[i][j] == 2 ? "❌" : 
    pattern[i][j] == 1 ? "⭕️" : "";
```

## async异步编程不同实现方法的实例链接
callback：https://github.com/FreeWisdom/Frontend-07-Template/blob/main/Week01/TrafficLights/callBackAsynchTrafficLights.html

Promise：https://github.com/FreeWisdom/Frontend-07-Template/blob/main/Week01/TrafficLights/promiseAsynchTrafficLights.html

generator：https://github.com/FreeWisdom/Frontend-07-Template/blob/main/Week01/TrafficLights/generatorAsynchTrafficLights.html

async/await：https://github.com/FreeWisdom/Frontend-07-Template/blob/main/Week01/TrafficLights/asyncAwaitTrafficLights.html