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