# 学习笔记


## 生疏小技
* Number.isInteger() 方法用来判断给定的参数是否为整数。

* `Array(10000).fill(0)`
```javaScript
const array1 = [1, 2, 3, 4];
// fill with 0 from position 2 until position 4
console.log(array1.fill(0, 2, 4));
// expected output: [1, 2, 0, 0]
```

* 数组的栈实现（先进后出）
```js
//考虑到js的数组实现，该种栈实现性能低下；
shift()//删除并返回数组的第一个元素
unshift()//向数组的开头添加一个或更多元素，并返回新的长度。
```
或者
```js
pop()//删除并返回数组的最后一个元素
push()//向数组的末尾添加一个或更多元素，并返回新的长度。
```

* 数组的队列实现（先进先出）
```js
push()//向数组的末尾添加一个或更多元素，并返回新的长度。
shift()//删除并返回数组的第一个元素
```
或者
```js
pop()//删除并返回数组的最后一个元素
unshift()//向数组的开头添加一个或更多元素，并返回新的长度。
```

* **乘方运算符
```js
> 2 ** 2 * 2//2²×2
8
> 2 **（2 * 2）//2的2*2次方
16
```


## css中子元素`display:inline-block;`换行后，造成上下行之间产生间隙问题解决办法。
```css
.cell{
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: antiquewhite;
}
#container{
    font-size:0;  /* 清除因子元素display：inline-block换行后，产生的行行间隔问题*/
    background-color: brown;
}
```

## 花哨名词
* 启发式搜索：事先判断下一步所搜索坐标的优先级，达到有目的的寻路；
    + A：通过启发式搜索能找到最优路径的方式；
    + A*：通过启发式搜索不能找到最优路径的方式；