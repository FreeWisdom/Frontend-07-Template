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