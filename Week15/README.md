# 库化（动画、手势）

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
### 6.4、完善 暂停（pause）、开始（resume） 逻辑
1. 建立暂停/重启的环境：
    * 新建 animation-demo.html 和 animation-demo.js 文件如下;
    * webpack.config.js 中的 entry 入口改变为```entry: './animation-demo.js',```；
    ```js
    import { Timeline, Animation } from "./animation.js"

    let tl = new Timeline();
    tl.start();

    tl.add(new Animation(document.querySelector("#el").style, "transform", 0, 500, 2000, null, 0, v => `translateX(${v}px)`));
    document.getElementById("pause").addEventListener("click", () => {
        tl.pause();
    })
    document.getElementById("resume").addEventListener("click", () => {
        tl.resume();
    })
    ```
    ```html
    <body>
        <div id="el" style="width: 100px;height: 100px;background-color: blueviolet;"></div>
        <button id="pause">pause</button><button id="resume">resume</button>
        <script type="module" src="./animation-demo.js"></script>
    </body>
    ```
2. Animation.js 中增加以下逻辑：
    1. Animation 类的 constructor 参数中增加 template；
    2. reciveTime() 中通过 template 设置 css 属性的效果，用法见文件 animation-demo.js 中 tl.add() 的最后一个参数；
    ```js
    export class Animation {
        constructor(object, property, startValue, endValue, duration, timingFunction, delay, template) {
            this.object = object;
            this.property = property;
            this.startValue = startValue;
            this.endValue = endValue;
            //动画持续时间
            this.duration = duration;
            this.timingFunction = timingFunction;
            this.delay = delay;
            this.template = template;
        }

        reciveTime(time) {
            //值的变化区间
            let range = this.endValue - this.startValue;
            //"属性" = 开始值 + 值的变化区间 * x%，100为a赋值
            //通过 template 达到可以设置 css 属性的效果，用法见文件 animation-demo.js 中 tl.add() 的最后一个参数；
            this.object[this.property] = this.template(this.startValue + range * time / this.duration);
        }
    }
    ```
3. 增加两个私有变量
    ```js
    const PAUSE_START = Symbol("pause_start");
    const PAUSE_TIME = Symbol("pause_time");
    ```
4. Timeline 类增加以下逻辑
    1. pause() 中记录 PAUSE_START 为当前时间；
    2. resume() 中根据 PAUSE_START 记录停止的时间 PAUSE_TIME ；
    3. 在 duringTimeCheck 的时间中加上 PAUSE_TIME ；
    ```js
    export class Timeline {
        constructor() {
            this[ANIMATIONS] = new Set();
            this[START_TIME] = new Map();
        }

        start() {
            let startTime = Date.now();
            this[PAUSE_TIME] = 0;

            this[TICK] = () => {
                let now = Date.now();
                for(let animation of this[ANIMATIONS]) {
                    let duringTimeCheck;
                    if(this[START_TIME].get(animation) < startTime) {
                        duringTimeCheck = now - startTime - this[PAUSE_TIME];
                    } else {
                        duringTimeCheck = now - this[START_TIME].get(animation) - this[PAUSE_TIME];
                    }
                    if(animation.duration < duringTimeCheck) {
                        this[ANIMATIONS].delete(animation);
                        duringTimeCheck = animation.duration;
                    }
                    animation.reciveTime(duringTimeCheck);
                }
                //动画暂停准备：存储 AnimationFrame 
                this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
            }
            this[TICK]();
        }

        //暂停动画：取消 AnimationFrame 
        pause() {
            this[PAUSE_START] = Date.now();
            cancelAnimationFrame(this[TICK_HANDLER]);
        }
        //在以前的基础上重新启动：重启时间线
        resume() {
            this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
            this[TICK]();
        }

        reset() {}

        //将 Animation 添加到 Timeline
        add(animation, startTime) {
            if(arguments.length < 2) {
                startTime = Date.now();
            }
            this[ANIMATIONS].add(animation);
            this[START_TIME].set(animation, startTime);
        }
    }
    ```
### 6.5、完善 延迟（delay）、时间线内动画形态函数（timingFunction/贝塞尔曲线功能） 逻辑
1. Timeline 类的 satrt() 中处理 delay 逻辑：
    * 在 duringTimeCheck 的时间中减去 delay ；
    * 若 duringTimeCheck 是负数则动画还未开始；
    ```js
    start() {
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;

        this[TICK] = () => {
            let now = Date.now();
            for(let animation of this[ANIMATIONS]) {
                let duringTimeCheck;
                //判断动画是否有延迟,通过 duringTimeCheck 时间；
                if(this[START_TIME].get(animation) < startTime) {
                    duringTimeCheck = now - startTime - this[PAUSE_TIME] - animation.delay;
                } else {
                    duringTimeCheck = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;
                }

                if(animation.duration < duringTimeCheck) {
                    this[ANIMATIONS].delete(animation);
                    duringTimeCheck = animation.duration;
                }

                //若 duringTimeCheck 是负数则不执行动画
                if(duringTimeCheck > 0)
                    animation.reciveTime(duringTimeCheck);
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }
    ```
2. Animation 类的 reciveTime() 中，处理 TimingFunction 逻辑（增加贝塞尔曲线的功能）
    * 增加 progress 进展接受 timingFunction 函数的返回值；
    ```js
    reciveTime(time) {
        //值的变化区间
        let range = this.endValue - this.startValue;
        //"属性" = 开始值 + 值的变化区间 * x%;
        //通过 template 达到可以设置 css 属性的效果，用法见文件 animation-demo.js 中 tl.add() 的最后一个参数；
        // progress 是在动画的过程 duration 里零到一的进展，this.timingFunction(零到一的 time ) 该函数为三次贝塞尔曲线；
        let progress = this.timingFunction(time / this.duration);
        this.object[this.property] = this.template(this.startValue + range * progress);
    }
    ```
    * 根目录增加 ease.js 文件，cubicBezier() 函数为贝塞尔曲线的源码； 
    ```js
    export function cubicBezier(p1x, p1y, p2x, p2y) {
        const ZERO_LIMIT = 1e-6;
    
        const ax = 3 * p1x - 3 * p2x + 1;
        const bx = 3 * p2x - 6 * p1x;
        const cx = 3 * p1x;
    
        const ay = 3 * p1y - 3 * p2y + 1;
        const by = 3 * p2y - 6 * p1y;
        const cy = 3 * p1y;
    
        function sampleCurverDerivativeX(t) {
        return (3 * ax * t + 2 * bx) * t + cx;
        }
    
        function sampleCurveX(t) {
        return ((ax * t + bx) * t + cx) * t;
        }
    
        function sampleCurveY(t) {
        return ((ay * t + by) * t + cy) * t;
        }
    
        function solveCurveX(x) {
        var t2 = x;
        var derivative;
        var x2;
    
        for (let i = 0; i < 8; i++) {
            // f(t) - x = 0
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < ZERO_LIMIT) {
            return t2;
            }
            derivative = sampleCurverDerivativeX(t2);
            // == 0, failure
            if (Math.abs(derivative) < ZERO_LIMIT) {
            break;
            }
            t2 -= x2 / derivative;
        }
        var t1 = 1;
        var t0 = 0;
        t2 = x;
        while (t1 > t0) {
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < ZERO_LIMIT) {
            return t2;
            }
            if (x2 > 0) {
            t1 = t2;
            } else {
            t0 = t2;
            }
            t2 = (t1 + t0) / 2;
        }
    
        // Failure
        return t2;
        }
    
        function solve(x) {
        return sampleCurveY(solveCurveX(x));
        }
    
        return solve;
    }
    export let linear = v => v;
    export let ease = cubicBezier(0.25, 0.1, 0.25, 1);
    export let easeIn = cubicBezier(0.42, 0, 1, 1);
    export let easeOut = cubicBezier(0, 0, 0.58, 1);
    export let easeInOut = cubicBezier(0.42, 0, 0.58, 1);
    ```
    * 在 animation-demo.js 对 ease 不同的种类进行测试，并与 css 动画的 ease 进行对比；
    ```html
    <!-- animation-demo.html 中增加对比的 div -->
    <body>
        <div id="el" style="width: 100px;height: 100px;background-color: blueviolet;"></div>
        <div id="el2" style="width: 100px;height: 100px;background-color: rgb(186, 226, 43);"></div>
        <button id="pause">pause</button><button id="resume">resume</button>
        <script type="module" src="./animation-demo.js"></script>
    </body>
    ```
    ```js
    //animation-demo.js 中对 自建动画库&原生css 进行对比测试；
    import { Timeline, Animation } from "./animation.js"
    import { ease, linear, easeIn, easeOut } from "./ease.js"

    let tl = new Timeline();
    tl.start();

    tl.add(new Animation(document.querySelector("#el").style, "transform", 0, 500, 2000, ease, 0, v => `translateX(${v}px)`));
    document.getElementById("el2").style.transition = "2s ease";
    document.getElementById("el2").style.transform = "translateX(500px)";

    document.getElementById("pause").addEventListener("click", () => {
        tl.pause();
    })
    document.getElementById("resume").addEventListener("click", () => {
        tl.resume();
    })
    ```
    
    ![动画对比](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week15/img/动画对比.gif "动画对比")

3. 完成 Timeline 类的 reset() 
    ```js
    reset() {
        this.pause();
        let startTime = Date.now();
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[PAUSE_TIME] = 0;
        this[PAUSE_START] = 0;
        this[TICK_HANDLER] = null;
    }
    ```
### 6.6、为 Timeline 类增加状态管理
1. constructor 中为初始状态 `"Inited"`;
2. start 中为状态 `"Started"`，必须由 `"Inited"` 状态进入;
3. pause 中为状态 `"paused"`，必须由 `"Started"` 状态进入;
4. resume 中进入状态 `"Started"`，必须由 `"Paused"` 状态进入;
5. reset 中进入状态 `"Inited"`;
    ```js
    export class Timeline {
        constructor() {
            this.state = "Inited";
            //Animation 的队列
            this[ANIMATIONS] = new Set();
            this[START_TIME] = new Map();
        }

        start() {
            if(this.state !== "Inited")
                return;
            this.state = "Started";

            let startTime = Date.now();
            this[PAUSE_TIME] = 0;

            this[TICK] = () => {
                let now = Date.now();
                for(let animation of this[ANIMATIONS]) {
                    let duringTimeCheck;
                    //判断动画是否有延迟
                    if(this[START_TIME].get(animation) < startTime) {
                        duringTimeCheck = now - startTime - this[PAUSE_TIME] - animation.delay;
                    } else {
                        duringTimeCheck = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;
                    }

                    //动画的持续时间 < 开始时间到现在时间时，将该animation删除，不执行
                    if(animation.duration < duringTimeCheck) {
                        this[ANIMATIONS].delete(animation);
                        duringTimeCheck = animation.duration;
                    }

                    //若 duringTimeCheck 是负数则不执行动画
                    if(duringTimeCheck > 0)
                        //now 是实时改变的，避免 animation.reciveTime(animation.duration) 的 animation.duration 超出预值，故传入 duringTimeCheck；
                        animation.reciveTime(duringTimeCheck);
                }
                //动画暂停准备：存储 AnimationFrame 
                this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
            }
            this[TICK]();
        }

        //暂停动画：取消 AnimationFrame 
        pause() {
            if(this.state !== "Started")
                return;
            this.state = "Paused";

            this[PAUSE_START] = Date.now();
            cancelAnimationFrame(this[TICK_HANDLER]);
        }
        //在以前的基础上重新启动：重启时间线
        resume() {
            if(this.state !== "Paused")
                return;
            this.state = "Started";

            this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
            this[TICK]();
        }

        reset() {
            this.pause();
            this.state = "Inited";
            let startTime = Date.now();
            this[ANIMATIONS] = new Set();
            this[START_TIME] = new Map();
            this[PAUSE_TIME] = 0;
            this[PAUSE_START] = 0;
            this[TICK_HANDLER] = null;
        }

        //将 Animation 添加到 Timeline
        add(animation, startTime) {
            //判断delay
            if(arguments.length < 2) {
                startTime = Date.now();
            }
            this[ANIMATIONS].add(animation);
            this[START_TIME].set(animation, startTime);
        }
    }
    ```


## 7、手势
### 7.1、基础手势体系

![基础手势体系图](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week15/img/基础手势体系图.gif "基础手势体系图")
### 7.2、新建 gesture-demo 文件夹，完成监听鼠标移动事件
1. 文件夹中新建 gesture.html 文件；
    ```html
    <script src="./gesture.js"></script>
    ```
2. 文件夹中新建 gesture.js 文件；
    * 鼠标 mousedown 事件在移动端上监听不到；
    * 所以需要在下一步再次添加移动端的 touchstart 事件；
    ```js
    let element = document.documentElement;

    element.addEventListener("mousedown", event => {
        
        let mousemove = event => {
            console.log(event.clientX, event.clientY)
        }
        let mouseup = event => {
            element.removeEventListener("mousemove", mousemove);
            element.removeEventListener("mouseup", mouseup);
        }
        element.addEventListener("mousemove", mousemove);
        element.addEventListener("mouseup", mouseup);
    })
    ```
### 7.3、完成移动端触屏事件
1. gesture.js 文件中添加触屏事件；
    * touch 事件触发一定是 start 和 move 在同一个元素上；
    * 因为电脑可以识别鼠标的移动，而手机无法识别手的移动，故移动触屏事件与上面的鼠标点击事件有别，不需要在 down 后再进行监听；
2. `event.changedTouches`打印出的 `TouchList` 数组中每一个 `Touch` 表示多点触屏事件数组中的每一个事件信息；
3. 每一个 `Touch` 都包含了当前事件的所有信息，其中`identifier` 是事件的唯一标识；
4. 触屏的 `touchcancel` 事件，是系统打断 `touchmove` 事件后，系统自动触发的，鼠标事件中就不会出现这种情况；
    ```js
    element.addEventListener("touchstart", event => {
        console.log(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    })
    element.addEventListener("touchmove", event => {
        console.log(event.changedTouches);
    })
    element.addEventListener("touchend", event => {
        console.log(event.changedTouches);
    })
    element.addEventListener("touchcancel", event => {
        console.log(event.changedTouches);
    })
    ```
### 7.4、gesture.js 文件中完成对鼠标操作、触屏操作的统一抽象
* 抽象后，可以不用区分 电脑的鼠标操作/移动端的手势操作；
* 仅需要针对某一点的 start/move/cancel/end 事件处理一套逻辑即可；
    ```js
    let element = document.documentElement;

    // ****鼠标移动事件
    element.addEventListener("mousedown", event => {
        start(event);
        
        let mousemove = event => {
            move(event);
        }
        let mouseup = event => {
            end(event);
            element.removeEventListener("mousemove", mousemove);
            element.removeEventListener("mouseup", mouseup);
        }
        element.addEventListener("mousemove", mousemove);
        element.addEventListener("mouseup", mouseup);
    })

    // ****触屏事件
    element.addEventListener("touchstart", event => {
        for (const touch of event.changedTouches) {
            start(touch);
        }
    })
    element.addEventListener("touchmove", event => {
        for (const touch of event.changedTouches) {
            move(touch);
        }
    })
    element.addEventListener("touchend", event => {
        for (const touch of event.changedTouches) {
            end(touch);
        }
    })
    element.addEventListener("touchcancel", event => {
        for (const touch of event.changedTouches) {
            cancel(touch);
        }
    })

    // ****鼠标事件、触屏事件抽象统一，
    let start = point => {
        console.log("start:", point.clientX, point.clientY)
    }
    let move = point => {
        console.log("move:", point.clientX, point.clientY)
    }
    let end = point => {
        console.log("end:", point.clientX, point.clientY)
    }
    let cancel = point => {
        console.log("cancel:", point.clientX, point.clientY)
    }
    ```
### 7.5、根据手势体系图，gesture.js 文件中区分几种手势功能
1. 根据业务的逻辑图处理以 start 开始的以下三种情况:
    1. 经历 end 事件---> tap；
    2. move 事件中移动 10px---> panstart；
    3. setTimeout 0.5s ---> pressstart；
    ```js
    let handler;
    let startX, startY;
    //Tap && Pan 不能同时发生默认互斥，故设置初始状态不同；
    let isPan = false, isTap = true, isPress = false;

    // ****鼠标事件、触屏事件抽象统一
    let start = point => {
        isPan = false;
        isTap = true;
        isPress = false;
        startX = point.clientX;
        startY = point.clientY;
        handler = setTimeout(() => {
            isPan = false;
            isTap = false;
            isPress = true;
            handler = null;
            console.log("pressstart")
        }, 500);
    }
    let move = point => {
        let distanceX = point.clientX - startX;
        let distanceY = point.clientY - startY;
        let distance = distanceX ** 2 + distanceY ** 2;
        if(!isPan && distance > 100) {
            isPan = true;
            isTap = false;
            isPress = false;
            clearTimeout(handler);
            console.log("panstart");
        }
        if(isPan) {
            console.log("pan");
        }
    }
    let end = point => {
        if(isTap) {
            console.log("tap")
            clearTimeout(handler);
        }
        if(isPan) {
            console.log("panend");
        }
        if(isPress) {
            console.log("pressend");
        }
    }
    let cancel = point => {
        clearTimeout(handler);
    }
    ```
2. 处理上方代码的全局变量：
    * 从触屏考虑，kennel存在多个 touch 事件；
    * 从鼠标考虑，可能存在多个按键，最多存在 5 个；
    * 综上，全局变量是不合理的，故需要将这些全局变量放到参数中传入;
        - 为 start/move/end/cancel 添加参数 context ，context 中包含所有全局变量；
        - 以上代码修改如下：
    ```js
    // ****鼠标事件、触屏事件抽象统一
    let start = (point, context) => {
        context.isPan = false;
        context.isTap = true;
        context.isPress = false;
        context.startX = point.clientX;
        context.startY = point.clientY;
        context.handler = setTimeout(() => {
            context.isPan = false;
            context.isTap = false;
            context.isPress = true;
            context.handler = null;
            console.log("pressstart")
        }, 500);
    }
    let move = (point, context) => {
        let distanceX = point.clientX - context.startX;
        let distanceY = point.clientY - context.startY;
        let distance = distanceX ** 2 + distanceY ** 2;
        if(!context.isPan && distance > 100) {
            context.isPan = true;
            context.isTap = false;
            context.isPress = false;
            clearTimeout(context.handler);
            console.log("panstart");
        }
        if(context.isPan) {
            console.log("pan", distanceX, distanceY);
        }
    }
    let end = (point, context) => {
        if(context.isTap) {
            console.log("tap")
            clearTimeout(context.handler);
        }
        if(context.isPan) {
            console.log("panend");
        }
        if(context.isPress) {
            console.log("pressend");
        }
    }
    let cancel = (point, context) => {
        clearTimeout(context.handler);
    }
    ```
3. 同时在触屏/鼠标中为 start/move/end/cancel 添加 context 参数；
    ```js
    let element = document.documentElement;
    //确保鼠标只监听一个 move/up 事件
    let isListeningMouse = false;

    // ****鼠标移动事件
    element.addEventListener("mousedown", event => {
        let context = Object.create(null);
        contexts.set("mouse" + (1 << event.button), context);
        start(event, context);
        let mousemove = event => {
            let button = 1;
            //处理鼠标中多个按键；
            while(button <= event.buttons){
                if(button & event.buttons) {
                    //order 0f buttons & button property is not same
                    let key;
                    if(button === 2) {
                        key = 4;
                    } else if(button === 4) {
                        key = 2;
                    } else {
                        key = button;
                    }
                    let context = contexts.get("mouse" + key);
                    move(event, context);
                }
                button = button << 1;//1/2/4/8/16/32/…………/0b00001
            }
        }
        let mouseup = event => {
            let context = contexts.get("mouse" + (1 << event.button))
            end(event, context);
            contexts.delete("mouse" + (1 << event.button));
            if(event.buttons === 0) {
                element.removeEventListener("mousemove", mousemove);
                element.removeEventListener("mouseup", mouseup);
                isListeningMouse = false;
            }
        }
        if(!isListeningMouse) {
            element.addEventListener("mousemove", mousemove);
            element.addEventListener("mouseup", mouseup);
            isListeningMouse = true;
        }
    })

    // ****触屏事件
    let contexts = new Map();
    element.addEventListener("touchstart", event => {
        for (const touch of event.changedTouches) {
            let context = Object.create(null);
            contexts.set(touch.identifier, context)
            start(touch, context);
        }
    })
    element.addEventListener("touchmove", event => {
        for (const touch of event.changedTouches) {
            let context = contexts.get(touch.identifier)
            move(touch, context);
        }
    })
    element.addEventListener("touchend", event => {
        for (const touch of event.changedTouches) {
            let context = contexts.get(touch.identifier);
            end(touch, context);
            contexts.delete(touch.identifier);
        }
    })
    element.addEventListener("touchcancel", event => {
        for (const touch of event.changedTouches) {
            let context = contexts.get(touch.identifier);
            cancel(touch);
            contexts.delete(touch.identifier);
        }
    })
    ```
### 7.6、派发事件
1. gesture.js 文件
    - 在 end() 中派发 "tap" 事件；
    - 增加 dispatch() 事件逻辑；
    ```js
    let end = (point, context) => {
        if(context.isTap) {
            console.log("tap")
            dispatch("tap", {})
            clearTimeout(context.handler);
        }
        //…………
    }
    ```
    ```js
    // ****事件派发
    function dispatch(type, properties) {
        let event = new Event(type);
        for (const name in properties) {
            event[name] = properties.name;
        }
        element.dispatchEvent(event)
    }
    ```
2. gesture.html 文件
    - DOM 增加对派发事件的监听；
    ```html
    <script>
        document.documentElement.addEventListener("tap", event => {
            console.log("tap event trigger", event)
        })
    </script>
    ```
### 7.7、实现 flick(鼠标移动的速度 > 1.5) 事件
1. 在 start 中记录起始点的时间和 X/Y 坐标；
    ```js
    context.points = [{
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
    }];
    ```
2. 在 move 中，每隔 500ms 记录一个点;
    ```js
    context.points = context.points.filter(point => Date.now() - point.t < 500);
    context.points.push({
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
    });
    ```
3. 在 end 中对速度进行计算，并判断 flick 事件是否出发;
    ```js
    context.points = context.points.filter(point => Date.now() - point.t < 500);
    let dx, dy, d, v, t;
    if(!context.points.length) {
        v = 0;
    } else {
        dx = point.clientX - context.points[0].x;
        dy = point.clientY - context.points[0].y;
        d = Math.sqrt(dx ** 2 + dy ** 2);
        t = Date.now() - context.points[0].t;
        v = d / t;
    }
    if(v > 1.5) {
        console.log("flick", "v=", v);
        context.isFlick = true;
    } else {
        context.isFlick = false;
    }
    ```

## 8、终极封装
### 8.1、gesture.html 文件修改
```html
<body oncontextmenu="event.preventDefault()"></body>
<script type="module">
    import { enableGesture } from "./gesture.js";
    enableGesture(document.documentElement)
    document.documentElement.addEventListener("tap", event => {
        console.log("tap event trigger")
    })
    document.documentElement.addEventListener("press", event => {
        console.log("press event trigger")
    })
    document.documentElement.addEventListener("penstart", event => {
        console.log("penstart event trigger")
    })
    document.documentElement.addEventListener("pen", event => {
        console.log("pen event trigger")
    })
    document.documentElement.addEventListener("flick", event => {
        console.log("flick event trigger")
    })
    document.documentElement.addEventListener("penend", event => {
        console.log("penend event trigger")
    })
</script>
```
### 8.2、gesture.js 文件修改
```js
// ****事件派发
export class Dispatcher {
    constructor(element) {
        this.element = element;
    }
    dispatch(type, properties) {
        let event = new Event(type);
        for (const name in properties) {
            event[name] = properties.name;
        }
        this.element.dispatchEvent(event)
    }
}

export class Listener {
    constructor(element, recongnizer) {
        // ****鼠标事件、触屏事件 的监听
        let isListeningMouse = false;
        let contexts = new Map();
        // **鼠标移动事件
        element.addEventListener("mousedown", event => {
            let context = Object.create(null);
            contexts.set("mouse" + (1 << event.button), context);
            recongnizer.start(event, context);
            let mousemove = event => {
                let button = 1;
                while(button <= event.buttons){
                    if(button & event.buttons) {
                        //order 0f buttons & button property is not same
                        let key;
                        if(button === 2) {
                            key = 4;
                        } else if(button === 4) {
                            key = 2;
                        } else {
                            key = button;
                        }
                        let context = contexts.get("mouse" + key);
                        recongnizer.move(event, context);
                    }
                    button = button << 1;//1/2/4/8/16/32/…………/0b00001
                }
            }
            let mouseup = event => {
                let context = contexts.get("mouse" + (1 << event.button))
                recongnizer.end(event, context);
                contexts.delete("mouse" + (1 << event.button));
                if(event.buttons === 0) {
                    document.removeEventListener("mousemove", mousemove);
                    document.removeEventListener("mouseup", mouseup);
                    isListeningMouse = false;
                }
            }
            if(!isListeningMouse) {
                document.addEventListener("mousemove", mousemove);
                document.addEventListener("mouseup", mouseup);
                isListeningMouse = true;
            }
        })
        // **触屏事件
        element.addEventListener("touchstart", event => {
            for (const touch of event.changedTouches) {
                let context = Object.create(null);
                contexts.set(touch.identifier, context)
                recongnizer.start(touch, context);
            }
        })
        element.addEventListener("touchmove", event => {
            for (const touch of event.changedTouches) {
                let context = contexts.get(touch.identifier)
                recongnizer.move(touch, context);
            }
        })
        element.addEventListener("touchend", event => {
            for (const touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recongnizer.end(touch, context);
                contexts.delete(touch.identifier);
            }
        })
        element.addEventListener("touchcancel", event => {
            for (const touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recongnizer.cancel(touch);
                contexts.delete(touch.identifier);
            }
        })
    }
}

export class Recongnizer {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }
    // ****事件识别————鼠标事件、触屏事件抽象统一
    start(point, context) {
        context.isPan = false;
        context.isTap = true;
        context.isPress = false;
        context.startX = point.clientX;
        context.startY = point.clientY;
        context.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        }];
        context.handler = setTimeout(() => {
            context.isPan = false;
            context.isTap = false;
            context.isPress = true;
            context.handler = null;
            this.dispatcher.dispatch("press", {})
        }, 500);
    }
    move(point, context) {
        let distanceX = point.clientX - context.startX;
        let distanceY = point.clientY - context.startY;
        let distance = distanceX ** 2 + distanceY ** 2;
        if(!context.isPan && distance > 100) {
            context.isPan = true;
            context.isTap = false;
            context.isPress = false;
            context.isVertical = Math.abs(distanceX) - Math.abs(distanceY);
            clearTimeout(context.handler);
            this.dispatcher.dispatch("penstart", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: context.clientY,
                isVertical: context.isVertical
            })
        }
        if(context.isPan) {
            this.dispatcher.dispatch("pen", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: context.clientY,
                isVertical: context.isVertical
            })
        }
        context.points = context.points.filter(point => Date.now() - point.t < 500);
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        });
    }
    end(point, context) {
        if(context.isTap) {
            this.dispatcher.dispatch("tap", {});
            clearTimeout(context.handler);
        }
        if(context.isPress) {
            this.dispatcher.dispatch("tap", {});
        }
        context.points = context.points.filter(point => Date.now() - point.t < 500);
        let dx, dy, d, v, t;
        if(!context.points.length) {
            v = 0;
        } else {
            dx = point.clientX - context.points[0].x;
            dy = point.clientY - context.points[0].y;
            d = Math.sqrt(dx ** 2 + dy ** 2);
            t = Date.now() - context.points[0].t;
            v = d / t;
        }
        if(v > 1.5) {
            this.dispatcher.dispatch("flick", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: context.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            })
            context.isFlick = true;
        } else {
            context.isFlick = false;
        }
        if(context.isPan) {
            this.dispatcher.dispatch("penend", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: context.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick
            })
        }
    }
    cancel(point, context) {
        clearTimeout(context.handler);
        this.dispatcher.dispatch("cancel", {})
    }
}

export function enableGesture(element) {
    new Listener(element, new Recongnizer(new Dispatcher(element)));
}
```
