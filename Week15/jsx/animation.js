// tick钟表滴答声表示时间线
//私有的避免外部访问
const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick_handler");
const ANIMATIONS = Symbol("animations")
const START_TIME = Symbol("start_time");
const PAUSE_START = Symbol("pause_start");
const PAUSE_TIME = Symbol("pause_time");

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

export class Animation {
    constructor(object, property, startValue, endValue, duration, timingFunction, delay, template) {
        timingFunction= timingFunction || (v => v);
        template = template || (v=> v);

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
        //"属性" = 开始值 + 值的变化区间 * x%;
        //通过 template 达到可以设置 css 属性的效果，用法见文件 animation-demo.js 中 tl.add() 的最后一个参数；
        // progress：在动画的过程 duration 里面的进展，this.timingFunction(零到一的时间) 包含了贝塞尔曲线的源码，返回的 progress 是零到一的进展；
        let progress = this.timingFunction(time / this.duration)
        this.object[this.property] = this.template(this.startValue + range * progress);
    }
}