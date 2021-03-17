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
        //判断delay
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