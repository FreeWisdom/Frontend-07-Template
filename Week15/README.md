# 组件化
## 1、组件的基本知识
### 1.1、组件的基本概念
### 1.2、对象 与 组件 区别
### 1.3、component（组件）各要素及信息流转
### 1.4、Attribute 与 Property 区别
### 1.5、如何设计组件状态
### 1.6、组件生命周期 Lifecycle
### 1.7、组件的子组件 Children

## 2、为组件添加jsx语法
### 2.1、搭建jsx环境
### 2.2、jsx的基本使用方法

## 3、实现轮播组件底层封装
### 3.1、将识别 jsx 语法的功能封装到底层 frameWork.js 中
### 3.2、顶层的 main.js 中只保留实际封装的 Carousel 功能

## 4、轮播动画
### 4.1、图片排版
### 4.2、main.js 中的 render 函数增加轮播逻辑，实现自动轮播
### 4.3、 实现拖拽

## 5、将 Carousel 类抽离到 jsx 文件夹下新建的 Carousel.js文件，并在 main.js 做引用；

> Carousel.js

```js
import { Component } from "./frameWork.js";

export class Carousel extends Component{
    //……………………
}
```

> main.js

```js
import { Component, createElement} from "./frameWork.js";
import { Carousel } from "./Carousel.js";

//………………
```

## 6、动画

之前动画都是 css 写的，现在考虑如何使用 js 实现动画，动画最基础的能力是每帧执行一个什么样的基础事件。

### 6.1、 js 中几种处理帧的方案
1. 16ms 计时器：正常人眼最高识别的帧是60帧，所以要16ms；
    * 缺点不可控，会发生积压，故会选择以下两种；
```js
setInterval(() => {}, 16);
```
2. 16ms 延时器：
```js
let tick = () => {
    setTimout(tick, 16);
}
```
3. 现在浏览器支持的RAM:申请浏览器执行下一帧的时候执行该代码，跟浏览器的帧率相关。
    * concelAnimationFrame:避免资源浪费；
```js
let tick = () => {
    let handler = requestAnimationFrame(tick);
    concelAnimationFrame(handler);
}
```
### 6.2、建立 Animation类（动画）、Timeline类（时间线） 的能力
1. 建立时间线（Timeline类）
    * jsx 文件下，新建 animation 文件;
    * animation 文件中添加 私有tick(时间线)、Timeline类
2. 根据时间线，将动画关联进时间线
    * animation 文件中添加 Animation 类
    ```js
    // tick钟表滴答声表示时间线
    //私有的避免外部访问
    const TICK = Symbol("tick");
    const TICK_HANDLER = Symbol("tick_handler");
    const ANIMATIONS = Symbol("animations")

    export class Timeline {
        constructor() {
            //Animation 的队列
            this[ANIMATIONS] = new Set();
        }

        start() {
            let startTime = Date.now();
            this[TICK] = () => {
                let duringTime = Date.now() - startTime;
                for(let animation of this[ANIMATIONS]) {
                    let duringTimeCheck = duringTime;
                    //动画的持续时间 < 开始时间到现在时间时，将该animation删除，不执行
                    if(animation.duration < duringTime) {
                        this[ANIMATIONS].delete(animation);
                        duringTimeCheck = animation.duration;
                    }
                    //duringTime 是实时改变的，避免 animation.reciveTime(duringTime) 的 duringTime 超出预值，故传入 duringTimeCheck；
                    animation.reciveTime(duringTimeCheck);
                }
                requestAnimationFrame(this[TICK]);
            }
            this[TICK]();
        }

        pause() {}
        resume() {}

        reset() {}

        //将 Animation 添加到 Timeline
        add(animation) {
            this[ANIMATIONS].add(animation)
        }
    }

    export class Animation {
        constructor(object, property, startValue, endValue, duration, timingFunction) {
            this.object = object;
            this.property = property;
            this.startValue = startValue;
            this.endValue = endValue;
            //动画持续时间
            this.duration = duration;
            this.timingFunction = timingFunction;
        }

        reciveTime(time) {
            console.log(time)
            //值的变化区间
            let range = this.endValue - this.startValue;
            //"属性" = 开始值 + 值的变化区间 * x%
            this.object[this.property] = this.startValue + range * (time / this.duration)
        }
    }
    ```
3. 在 main.js 中的 `tl.start();`前加入`tl.add(object, property, startValue, endValue, duration, timingFunction)`测试
    ```js
    let tl = new Timeline();
    tl.add(new Animation({ set a(v){console.log("v:", v)} }, "a", 0, 100, 1000, null));
    tl.start();
    ```
4. 控制台可见时间线从 0 打印到了 100
### 6.3、设计时间线中动画的延迟处理
```js
// tick钟表滴答声表示时间线
//私有的避免外部访问
const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick_handler");
const ANIMATIONS = Symbol("animations")
const START_TIME = Symbol("start_time");

export class Timeline {
    constructor() {
        //Animation 的队列
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }

    start() {
        let startTime = Date.now();
        this[TICK] = () => {
            let now = Date.now();
            for(let animation of this[ANIMATIONS]) {
                let duringTimeCheck;
                //判断动画是否有延迟
                if(this[START_TIME].get(animation) < startTime) {
                    duringTimeCheck = now - startTime;
                } else {
                    duringTimeCheck = now - this[START_TIME].get(animation);
                }

                //动画的持续时间 < 开始时间到现在时间时，将该animation删除，不执行
                if(animation.duration < duringTimeCheck) {
                    this[ANIMATIONS].delete(animation);
                    duringTimeCheck = animation.duration;
                }
                //now 是实时改变的，避免 animation.reciveTime(animation.duration) 的 animation.duration 超出预值，故传入 duringTimeCheck；
                animation.reciveTime(duringTimeCheck);
            }
            requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }

    pause() {}
    resume() {}

    reset() {}

    //将 Animation 添加到 Timeline
    add(animation, startTime) {
        //判断不延迟或延迟（动态设置动画的startTime）
        if(arguments.length < 2) {
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation, startTime);
    }
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, timingFunction, delay) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        //动画持续时间
        this.duration = duration;
        this.timingFunction = timingFunction;
        this.delay = delay;
    }

    reciveTime(time) {
        console.log(time)
        //值的变化区间
        let range = this.endValue - this.startValue;
        //"属性" = 开始值 + 值的变化区间 * x%，100为a赋值
        this.object[this.property] = this.startValue + range * (time / this.duration);
    }
}
```