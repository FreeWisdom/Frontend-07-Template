# 学习笔记

## proxy基本用法
* 代码应用proxy的特点：预期性变差，故而是为底层库专门设计的

```js
let object = {
    a: 1,
    b: 2
}
```
1. 此时若访问其中的a或b属性，无法在访问时候加入任何监听代码，此乃js最底层的机制（单纯的数据存储），无法改变；
2. 若既想要设置一个普通对象，又要有监听机制。则需要proxy把该对象做一层包裹。
    - 创建Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。
        - `const p = new Proxy(target, handler)`
        - `target`：要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
        - `handler`：一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。
```js
let po = new Proxy(object, {
    //在设置该对象的属性的时候调用 set() 函数
    set(obj, prop, val){
        console.log(obj, prop, val)
    }
})
po.x = 9;       //此时调用了 set() console如下：{a: 1, b: 2} "x" 9
```

## proxy模仿reactive实现原理————之reactive()函数基本代理的实现
1. 首先完成对`po.a = 99;`等赋值属性的监听；
```html
<script>
    let object = {
        a: 1,
        b: 2
    }
    //一般对proxy的使用，会对对象做监听或改变其行为，所以一般的使用会把proxy的使用包进一个函数里；如下：
    function reactive (object){
        return new Proxy(object, {
            set(obj, prop, val){
                console.log(obj, prop, val);
            },

            get(obj, prop){
                return obj[prop];
            }
        })
    }
    let po = reactive(object);
    //此时，可监听po的属性，但object并没有进行改变
    po.a = 99;              //{a: 1, b: 2} "a" 99
    po.x = 100;              //{a: 1, b: 2} "x" 100
    console.log(object)     //{a: 1, b: 2}
</script>
```
2. 完成对object的改变，在set()和get()中加入赋值和返回代码；
```html
<script>
    let object = {
        a: 1,
        b: 2
    }
    //针对set()/get()进行赋值、返回操作，如下：
    function reactive (object){
        return new Proxy(object, {
            set(obj, prop, val){
                obj[prop] = val;
                console.log(obj, prop, val);
                return obj[prop];
            },

            get(obj, prop){
                console.log(obj, prop);
                return obj[prop];
            }
        })
    }
    let po = reactive(object);
    //此时，监听po的属性，且object改变；
    po.a = 99;              //{a: 99, b: 2} "a" 99
    po.x = 100;             //{a: 99, b: 2, x: 100} "x" 100
    console.log(object)     //{a: 99, b: 2, x: 100}
</script>
```
3. 自此，基本完成了使用`po`代理`object`的行为(get/set)，若想要真正完全代理，则需要将proxy中所有的hook补全；

## proxy模仿reactive实现原理————之利用effect(callback)代替事件监听机制
1. vue3的reactive中有`effect`API进行事件监听。故实现`effect(callback)`函数，直接监听`po`上的属性，从而代替事件监听机制；
```html
<script>
    let callbacks = [];

    let object = {
        a: 1,
        b: 2
    }

    function reactive (object){
        return new Proxy(object, {
            set(obj, prop, val){
                obj[prop] = val;
                for (let callback of callbacks) {
                    callback();
                }
                return obj[prop];
            },

            get(obj, prop){
                console.log(obj, prop);
                return obj[prop];
            }
        })
    }

    function effect(callback){
        callbacks.push(callback);
    }

    let po = reactive(object);

    effect(() => {//此时，effect监听属性po.a
        console.log(po.a)       //30
    })

    po.a = 30;
</script>
```
2. 代码分析
    1. 首先执行effect()，将`() => {console.log(po.a)}`push到callbacks[]中；
    2. 由于`reactive(object)`中`return new Proxy()`,实现针对po的监听；
    3. 故而，当最后一行中为po.a赋值时，proxy中的set()/get()纷纷被调用，从而将callbacks[]进行遍历；
    4. 最终，callbacks[]数组中的callback()函数得以执行；
3. 缺点
    - `callbacks[]`为全局变量，不同的对象每次执行监听都要调动(push)它；
    - 在`reactive()`中每次都要遍历所有的对象才可找到对应的callback；

## proxy模仿reactive实现原理————之effect(callback)代替事件监听的优化
1. 接下来的优化，是在reactive和effect之间做个链接，要做到在`callbacks[]`中仅传一个callback，就能在只有对应变量变化的时候触发函数调用；
    1. 在js中，无法获取一个函数能够访问到的所有变量，并使用相应数据结构去表示它；
    2. vue中的实现：可以先调用这个函数，看他实际引用了哪些变量；
        - 若引用了普通变量，无法进行监听；
        - 若引用了reactive变量，则可以在reactive的`get()`中可以进行监听；
2. 在`effect()`中xxxxxxx，获取函数调用object的属性；
    1. 在`effect()`中调用`callback`中想要监视的属性，引动`get()`；
    2. 在`reactive()`的`get()`中，将callback注册进全局`usedReactivities[]`中；
    3. 在`effect()`中，利用全局变量`usedReactivities[]`，形成如下结构，对callback信息进行对应存储，以便set()时根据get()中的参数对应调用：
        ```js
            // callbacks{
            //     {a: 1, b: 2}: {"a": [callback], "b": [callback], "c": [callback], ...}
            // }
        ```
    4. 执行`po.a = 88`、`po.b = 99`、`po.c = 77`，引动`reactive()`中的`set()`，根据set()中的参数调用特制数据结构`callbacks{}`中相应的callback;
    5. 打印出相应监听的`console.log()`，完成监听；
```html
<script>
    let callbacks = new Map();
    let useReactivities = [];

    let object = {
        a: 1,
        b: 2
    }

    function reactive (object){
        return new Proxy(object, {
            set(obj, prop, val){
                obj[prop] = val;
                //⑦当更改po.a或者po.b属性时，根据⑥中callbacks的存储结构，可以按照参数需求取出相应callback()执行
                console.log(callbacks)
                if(callbacks.get(obj))
                    if(callbacks.get(obj).get(prop))
                        for (let callback of callbacks.get(obj).get(prop))
                            callback();
                return obj[prop];
            },

            get(obj, prop){
                //④由于③中的引发，将两个参数push进useReactivities[];
                useReactivities.push([obj, prop]);
                console.log(useReactivities);
                return obj[prop];
            }
        })
    }

    function effect(callback){
        //②清空usedReactivities;
        useReactivities = [];

        //③调用callback中的console.log(po.a, po.b)，引发reactive()中的get();
        callback();

        //⑤由于④的push，如此方知，在callback中调用的console.log(po.a, po.b)，调用的变量`a/b`均在useReactivities[]中
        //⑥在callbacks{}里面，将调用变量的信息如下存储：
        // callbacks{
        //     {a: 1, b: 2}: {"a": [callback], "b": [callback], "c": [callback], ...}
        // }
        for (let reactivity of useReactivities) {
            if(!callbacks.has(reactivity[0])) {
                callbacks.set(reactivity[0], new Map());
            }

            if(!callbacks.get(reactivity[0]).has(reactivity[1])) {
                callbacks.get(reactivity[0]).set(reactivity[1], [])
            }

            callbacks.get(reactivity[0]).get(reactivity[1]).push(callback);
        }
    }

    let po = reactive(object);

    //⑧最终在effect中完成针对`po`的po.a或者po.b更改值时的监视
    //即：若执行`po.a = 9`，通过在effect(() => {})的`{}`自执行中，可以console.log()出po所属属性将要变化的值，即a = 9, b不变 ；
    //①先自执行，引动`po.a`或者`po.b`，此时po被reactive(object)针对object进行代理，然后执行effect(callback)将callback传入；
    effect(() => {
        console.log(po.a)
        console.log(po.b)
        console.log(po.c)
    })

</script>
```
* 若此时`object{}`为如下嵌套对象，此时`effect()`监听如下，执行`po.a.c = 99`，监听嵌套层的对象`c: 3`失效，故仍需优化；
```js
let object = {
        a: { c: 3 },
        b: 2
    }

effect(() => {
    console.log(po.a.c)
})
```

## proxy模仿reactive实现原理————之解决object{}嵌套层监听失效的优化
* 将由于嵌套而产生的proxy，另外缓存到`reactivities{}`中，其它不变，具体顺序见：①——⑦
```html
<script>
    let callbacks = new Map();
    let useReactivities = [];
    let reactivities = new Map();       //⑤故需要全局表格，缓存由于嵌套object{}，产生的proxy；

    let object = {
        a: {
            c: 3
        },
        b: 2
    }

    function reactive (object){
        //⑥若有，则获取缓存中的proxy；
        if(reactivities.has(object)) {
            return reactivities.get(object);
        }

        //⑦若无，则缓存该proxy
        let proxy = new Proxy(object, {
            set(obj, prop, val){
                obj[prop] = val;
                if(callbacks.get(obj))
                    if(callbacks.get(obj).get(prop))
                        for (let callback of callbacks.get(obj).get(prop))
                            callback();
                return obj[prop];
            },

            get(obj, prop){
                useReactivities.push([obj, prop]);
                //①当obj[prop]是对象的时候，再递归调用reactive(obj[prop])；
                //②但是此时reactive(obj[prop])生成了一个新的proxy;
                //③`effect(() => {})`中监听的`console.log(po.a.c)`proxy是A，
                //④而通过effect()调用的proxy是B；

                if(typeof obj[prop] === "object")
                    return reactive(obj[prop]);     //A

                return obj[prop];                   //B
            }
        })

        reactivities.set(object, proxy);

        return proxy;
    }

    function effect(callback){
        useReactivities = [];
        callback();

        for (let reactivity of useReactivities) {
            if(!callbacks.has(reactivity[0])) {
                callbacks.set(reactivity[0], new Map());
            }

            if(!callbacks.get(reactivity[0]).has(reactivity[1])) {
                callbacks.get(reactivity[0]).set(reactivity[1], [])
            }

            callbacks.get(reactivity[0]).get(reactivity[1]).push(callback);
        }
    }

    let po = reactive(object);

    effect(() => {
        console.log(po.a.c)
    })

</script>
```

## 基于proxy实现双向绑定的响应式对象————实现调色盘
1. 基于以上的reactive的实现，进行DOM和数据双向绑定；
2. 数据到DOM元素的单向绑定：当po.r改变的时候，相应id的input中的值也会跟着改变；
3. DOM元素到数据的单向绑定：当input中数值改变的时候，相应id的po.r也会跟着改变；
```html
<body>
    <input id="r" type="range" min="0" max="255"/>
    <input id="g" type="range" min="0" max="255"/>
    <input id="b" type="range" min="0" max="255"/>
    <div id="color" style="width: 500px;height: 500px;"></div>

    <script>
        let callbacks = new Map();
        let useReactivities = [];
        let reactivities = new Map();
        let object = {
            r: 1,
            g: 1,
            b: 1
        }

        function reactive(object){
            if(reactivities.has(object)) {
                return reactivities.get(object);
            }

            let proxy = new Proxy(object, {
                set(obj, prop, val){
                    obj[prop] = val;
                    if(callbacks.get(obj))
                        if(callbacks.get(obj).get(prop))
                            for (let callback of callbacks.get(obj).get(prop))
                                callback();
                    return obj[prop];
                },

                get(obj, prop){
                    useReactivities.push([obj, prop]);
                    if(typeof obj[prop] === "object")
                        return reactive(obj[prop]);

                    return obj[prop];
                }
            })

            reactivities.set(object, proxy);

            return proxy;
        }

        function effect(callback){
            useReactivities = [];
            callback();

            for (let reactivity of useReactivities) {
                if(!callbacks.has(reactivity[0])) {
                    callbacks.set(reactivity[0], new Map());
                }

                if(!callbacks.get(reactivity[0]).has(reactivity[1])) {
                    callbacks.get(reactivity[0]).set(reactivity[1], [])
                }

                callbacks.get(reactivity[0]).get(reactivity[1]).push(callback);
            }
        }

        let po = reactive(object);

        //数据到DOM元素的单向绑定：当po.r改变的时候，相应id的input中的值也会跟着改变；
        effect(() => {
            document.getElementById("r").value = po.r;
            document.getElementById("g").value = po.g;
            document.getElementById("b").value = po.b;
            document.getElementById("color").style.backgroundColor = `rgb(${po.r}, ${po.g}, ${po.b})`;
        })

        //DOM元素到数据的单向绑定：当input中数值改变的时候，相应id的po.r也会跟着改变；
        document.getElementById("r").addEventListener("input", event => po.r = event.target.value);
        document.getElementById("g").addEventListener("input", event => po.g = event.target.value);
        document.getElementById("b").addEventListener("input", event => po.b = event.target.value);
    </script>
</body>
```

## 实现基本拖拽功能
* 在`mousedown`事件中监听`mousemove`以及`mouseup`事件，实现基本的拖拽功能，代码及具体分析如下：
```html
<body>
    <div id="draggable" style="width: 100px;height: 100px;background-color: red;"></div>
    <script>
        let draggable = document.getElementById("draggable");
        let baseX = 0;
        let baseY = 0;
        //①在`mousedown`事件中监听`mousemove`&`mouseup`事件。避免了鼠标一开始未点击时在屏幕滑动的监听。
        draggable.addEventListener("mousedown", function(event){
            let startX = event.clientX;
            let startY = event.clientY;

            let up = event => {
                //④拖动第一次成功，为了使拖动第二次在第一次的基础上再拖动，故添加`baseX`&`baseY`，记录上一次xy的基础，然后在move中加上以`baseX`&`baseY`为基础的移动;
                baseX = baseX + event.clientX - startX;
                baseY = baseY + event.clientY - startY;

                //③`mouseup`时，删除鼠标move&&鼠标up事件
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
            }

            //④鼠标走到哪，让draggable移动到哪;
                //`event.clientX - startX`针对拖拽后的鼠标进行固定，但此时第二次移动未在第一次移动的基础上进行，故仍有bug；
            let move = event => {
                draggable.style.transform = `translate(${baseX + event.clientX - startX}px, ${baseY + event.clientY - startY}px)`;
            }
            
            //②监听`mousemove`&`mouseup`事件时应该在document上监听，而不应在draggable监听。（关于拖拽的小技巧）：
                //1、若在`draggable`监听，当鼠标快速移动，鼠标可能移开`draggable`区域，而导致draggable掉落，出现拖断现象；
                //2、若在`document`监听，会产生捕捉鼠标的效果，鼠标移动出浏览器外也会监听到。而若在`draggable`监听，鼠标移出浏览器无法监听；
            document.addEventListener("mouseup", up);
            document.addEventListener("mousemove", move);
        })
    </script>
</body>
```

## 在正常流里实现拖拽功能
* 理解Range：Range 对象表示文档中的连续范围。
    1. setStart:表示某个节点的range对象的起点位置;
    2. setEnd:表示某个节点的range对象的结束位置;
```html
<body>
    <div id="div">这里是第一段文字</div><!-- range中空格也算作文字文字中包含空格 -->
    <input type="button" onclick="dele()" value="删除">
    <script>
        function dele() {
            var div=document.getElementById("div");
            var range=document.createRange();
            var content=div.firstChild;
            console.log(div.firstChild)
            range.setStart(content,0);
            range.setEnd(content,1);
            console.log(range.getBoundingClientRect());
            range.deleteContents();//此处删除的是”这“字
        }
    </script>
</body>
```
* 正常流里实现拖拽功能
    1. 建立range表，列出能插入的空隙：欲将draggable拖到文字之间，但文字之间没有节点，故需先使用range去找到能拖拽的空位；
    2. getNearest(x, y)方法，从ranges[]表中，找到离传入的某一个点(x,y)，最近的range{}；
    3. 在拖动中`move()`中寻找最近的可以插入的位置；
    4. `range.insertNode(draggable);`方法，把指定的节点插入文档范围的开始点；
```html
<body>
    <div id="container">哈哈哈哈 哈哈哈哈哈哈哈哈哈哈哈哈哈哈</div>
    
    <!-- 注意：”draggable“的style一定要是inline-block，若不然只能沿着浏览器左侧边拖动 -->
    <div id="draggable" style="display:inline-block;width: 100px;height: 100px;background-color: red;"></div>
    <script>
        let draggable = document.getElementById("draggable");
        let baseX = 0;
        let baseY = 0;
        draggable.addEventListener("mousedown", function(event){
            let startX = event.clientX;
            let startY = event.clientY;

            let up = event => {
                baseX = baseX + event.clientX - startX;
                baseY = baseY + event.clientY - startY;
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
            }

            let move = event => {
                //③在拖动中寻找最近的可以插入的位置；
                let range = getNearest(event.clientX, event.clientY);
                //④把指定的节点插入文档范围的开始点；
                range.insertNode(draggable);
            }
            
            document.addEventListener("mouseup", up);
            document.addEventListener("mousemove", move);
        })

        let container = document.getElementById("container");
        let ranges = [];
        //①建立range表，列出能插入的空隙：欲将draggable拖到文字之间，但文字之间没有节点，故需先使用range去找到能拖拽的空位；
        for (let i = 0; i < container.childNodes[0].textContent.length; i++) {//`container.childNodes[0].textContent`包含空格
            let range = document.createRange();
            range.setStart(container.childNodes[0], i);
            range.setEnd(container.childNodes[0], i);
            console.log(range, range.getBoundingClientRect());//得到DOMRect{x: 24, y: 130, width: 0, height: 22, top: 130, …}
            ranges.push(range);
        }

        //②getNearest(x, y)方法，从ranges[]表中，找到离传入的某一个点(x,y)，最近的range{}；
        function getNearest(x, y){
            let min = Infinity;
            let nearestRange = null;
            for (let range of ranges) {
                let rect = range.getBoundingClientRect();
                let distance = (rect.x - x) ** 2 + (rect.y - y) ** 2;
                if(distance < min){
                    nearestRange = range;
                    min = distance;
                }
            }
            return nearestRange;
        }

        //⑤取消鼠标的选中功能；
        document.addEventListener("selectstart", event => event.preventDefault());

    </script>
</body>
```