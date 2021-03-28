// listen -> recognize -> dispatch
// new Listener(new Recognizer(dispatch));

export class dispatcher {
    constructor(element) {
        this.element = element;
    }

    dispatch(type, properties) {
        let event = new Event(type);
        for (let name in properties) {
            event[name] = properties[name];
        }
        this.element.dispatchEvent(event);
    };
}


export class Listener {
    constructor(element, recognizer) {
        // TODO 提供 API 解除事件绑定，避免内存泄露
        let isListeningMouse = false;
        let contexts = new Map();

        element.addEventListener('mousedown', event => {
            let context = Object.create(null);
            // 0 0b00001 左键
            // 1 0b00100 中键/滚轮点击
            // 2 0b00010 右键
            // 3 0b01000 侧面-后退
            // 4 0b10000 侧面-前进
            contexts.set(`mouse-${1 << event.button}`, context)

            recognizer.start(event, context);

            let mousemove = event => {
                let button = 1;

                while (button <= event.buttons) {
                    if (button & event.buttons) {
                        // order of buttons & button property are different
                        let key;
                        if (button === 2) {
                            key = 4;
                        } else if (button === 4) {
                            key = 2;
                        } else {
                            key = button;
                        }
                        const context = contexts.get(`mouse-${key}`);
                        recognizer.move(event, context);
                    }
                    button = button << 1;
                }
            };

            let mouseup = event => {
                const context = contexts.get(`mouse-${1 << event.button}`);
                recognizer.end(event, context);
                contexts.delete(`mouse-${1 << event.button}`);
                if (event.buttons === 0) {
                    document.removeEventListener('mousemove', mousemove);
                    document.removeEventListener('mouseup', mouseup);
                    isListeningMouse = false;
                }
            };

            if (!isListeningMouse) {
                document.addEventListener('mousemove', mousemove);
                document.addEventListener('mouseup', mouseup);
                isListeningMouse = true;
            }
        });

        element.addEventListener('touchstart', event => {
            for (let touch of event.changedTouches) {
                const context = Object.create(null);
                contexts.set(touch.identifier, context);
                recognizer.start(touch, context);
            }
        });

        element.addEventListener('touchmove', event => {
            for (let touch of event.changedTouches) {
                const context = contexts.get(touch.identifier);
                recognizer.move(touch, context);
            }
        });

        element.addEventListener('touchend', event => {
            for (let touch of event.changedTouches) {
                const context = contexts.get(touch.identifier);
                recognizer.end(touch, context);
                contexts.delete(touch.identifier);
            }
        });

        // alert 等打断
        element.addEventListener('touchcancel', event => {
            for (let touch of event.changedTouches) {
                const context = contexts.get(touch.identifier);
                recognizer.cancel(touch, context);
                contexts.delete(touch.identifier);
            }
        });
    }
}

export class Recognizer {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }

    start(point, ctx) {
        ctx.startX = point.clientX;
        ctx.startY = point.clientY;

        this.dispatcher.dispatch('start', {
            clientX: point.clientX,
            clientY: point.clientY,
        });

        ctx.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        }]

        ctx.isTap = true;
        ctx.isPan = false;
        ctx.isPress = false;

        ctx.handler = setTimeout(() => {
            ctx.isTap = false;
            ctx.isPan = false;
            ctx.isPress = true;
            ctx.handler = null;
            this.dispatcher.dispatch('press', {});
        }, 500);
    };

    move(point, ctx) {
        let dx = point.clientX - ctx.startX;
        let dy = point.clientY - ctx.startY;

        if (!ctx.isPan && dx ** 2 + dy ** 2 > 100) {
            ctx.isTap = false;
            ctx.isPan = true;
            ctx.isPress = false;
            ctx.isVertical = Math.abs(dx) < Math.abs(dy);
            this.dispatcher.dispatch('panstart', {
                startX: ctx.startX,
                startY: ctx.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: ctx.isVertical
            });
            clearTimeout(ctx.handler);
        }

        if (ctx.isPan) {
            this.dispatcher.dispatch('pan', {
                startX: ctx.startX,
                startY: ctx.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: ctx.isVertical
            });
        }

        // 只保留 0.5s 内的点来计算速度
        ctx.points = ctx.points.filter(point => Date.now() - point.t < 500);

        ctx.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        });
    };

    end(point, ctx) {
        if (ctx.isTap) {
            this.dispatcher.dispatch('tap', {});
            // Tap 事件处理逻辑中没有注销定时器
            clearTimeout(ctx.handler);
        }

        if (ctx.isPress) {
            this.dispatcher.dispatch('pressend', {});
        }

        let d, v;
        // 只保留 0.5s 内的点来计算速度
        ctx.points = ctx.points.filter(point => Date.now() - point.t < 500);
        if (!ctx.points.length) {
            v = 0;
        } else {
            d = Math.sqrt((point.clientX - ctx.points[0].x) ** 2 + (point.clientY - ctx.points[0].y) ** 2);
            v = d / (Date.now() - ctx.points[0].t);
        }

        // v 单位： 像素/毫秒
        if (v > 1.5) {
            ctx.isFlick = true;
            this.dispatcher.dispatch('flick', {
                startX: ctx.startX,
                startY: ctx.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: ctx.isVertical,
                isFlick: ctx.isFlick,
                velocity: v
            });
        } else {
            ctx.isFlick = false;
        }

        // panend 中要判断是否以 flick 结束
        if (ctx.isPan) {
            this.dispatcher.dispatch('panend', {
                startX: ctx.startX,
                startY: ctx.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: ctx.isVertical,
                isFlick: ctx.isFlick,
                velocity: v
            });
        }

        this.dispatcher.dispatch('end', {
            startX: ctx.startX,
            startY: ctx.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            isVertical: ctx.isVertical,
            isFlick: ctx.isFlick,
            velocity: v
        });
    };

    cancel(point, ctx) {
        clearTimeout(ctx.handler);
        this.dispatcher.dispatch('cancel', {});
    };
}

export function enableGesture(element) {
    return new Listener(element, new Recognizer(new dispatcher(element)))
}
