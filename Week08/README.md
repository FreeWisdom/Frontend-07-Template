# 浏览器的工作原理（一）
## 一、浏览器总论
    我们从URL访问一个网页，经过浏览器的解析和渲染后成为了Bitmap（Bitmap（位图）：在浏览器看到的页面都是一个图片形式叫做位图，然后经过显卡转换为我们可以识别的光信号。），这是一个浏览器的渲染流程。下面，会实现一个简单的基础流程，但是真正的浏览器还包含了很多功能，比如历史等等，而我们完成的是从 URL 请求到 Bitmap 页面展示的流程。
<img src="https://github.com/FreeWisdom/Frontend-07-Template/tree/main/Week08/img/browserRenderingProcess.png">

* 浏览器渲染流程：
1. URL 部分：经过 HTTP 请求，然后解析HTTP回应内容，然后提取文本的 HTML；
2. HTML 部分：得到 HTML 后，我们可以通过文本分析（parse），然后把HTML的文本编译为一个 DOM 树；
3. DOM 部分：这个时候的 DOM 树是光秃秃的，然后我们进行 CSS 计算（CSS computing 将 CSS 展示的最终结果展示），最终把 CSS 挂载在这个 DOM 树上；
4. DOM with CSS 部分：经过计算后，我们就拥有一个有样式的 DOM 树，这个时候我们就可以布局（或者排版）了，通过布局计算，每一个 DOM 都会得到一个计算后的盒和位置；（获得位置的不是 DOM 元素本身，而是 css 最后生成的核，为了简化，我们这里只做到每个 DOM 只生成一个盒即可）
5. DOM with position 部分：最后我们就可以开始渲染（Render），把这个 DOM 树该有背景图的有背景图，该有背景色的有背景色，最后把这些样式画到一张图片上。
6. bitmap 部分：最后可以通过操作系统和硬件驱动提供的API接口，将 bitmap 展示给用户看。

## 二、状态机
### 1、有限状态机
#### ①什么是状态机
    因为有限状态机处理字符串是整个的浏览器里面贯穿使用的技巧，“有限状态机”也称为“状态机”，并不对应“无限状态机”，那么什么是有限状态机？
1. 每一个状态都是一个机器，每个机器都是互相解耦，强有力的抽象机制：
    - 在每一个机器里，我们可以做计算、存储、输出等；
    - 所有的这些机器接受的输入是一致的；
    - 状态机的每一个机器本身没有状态，如果我们用函数来表达的话，它应该是纯函数（无副作用）；
        - 无副作用指的是：不应该再受函数外部变量的输入，控制输出结果，会影响状态本身的切换逻辑，输出是可以的；
2. 每一个机器知道下一个状态：
    - 每一个机器都有确定的下一个状态（Moore）
    - 每一个机器根据输入决定下一个状态（Mealy）
3. 状态机的四要素：
    - 现态：是指当前所处的状态。
    - 条件：又称为“事件”，当一个条件被满足，将会触发一个动作，或者执行一次状态的迁移。
    - 动作：条件满足后执行的动作。动作执行完毕后，可以迁移到新的状态，也可以仍旧保持原状态。动作不是必需的，当条件满足后，也可以不执行任何动作，直接迁移到新状态。
    - 次态：条件满足后要迁往的新状态。“次态”是相对于“现态”而言的，“次态”一旦被激活，就转变成新的“现态”了。
#### ②js如何实现状态机
```js
// 每个函数是一个状态
function state (input) { // 函数参数就是输入
  // 在函数中，可以自由地编写代码，处理每个状态的逻辑
  return next; // 返回值作为下一个状态
}

/** ========= 以下是调试 ========= */
while (input) {
  // 获取输入
  state = state(input); // 把状态机的返回值作为下一个状态
}
```
* 以上代码我们看到:
    1. 每一个函数是一个状态；
    2. 函数的参数是输入 input；
    3. 函数的返回值就是下一个状态，即下一个返回值一定得是一个状态函数；
* 故状态机理想的实现方式是：一系列返回状态函数的一批状态函数；
* 调用状态函数的时候，往往会用一个循环来获取输入，然后通过 state = state(input)，来让状态机接收输入来完成状态切换；
    - Mealy 型状态机，返回值一定是根据 input 返回下一个状态；
    - Moore 型状态机，返回值是与 input 没有任何关系，都是固定的状态返回；

### 2、不使用状态机处理字符串
    首先了解一下，在不使用状态机的情况下来实现一些字符串的处理方式：
1. 在一个字符串中，找到字符“a”：
    ```js
    function findA(str) {
        for (let c of str) {
            if(c === "a")
                return true;
        }
        return false;
    };

    console.log(findA("app"))
    ```
2. 不使用正则表达式，纯粹用 JavaScript 实现，在一个字符串中，找到字符“ab”：
    ```js
    function findAB(str) {
        let findA = false;
        for (const iterator of str) {
            if(iterator === "a") {
                findA = true;
            } else if(findA && iterator === "b") {
                return true;
            } else {
                findA = false;
            }
        }
        return false;
    }

    console.log(findAB("ab"))
    ```
3. 不使用正则表达式，纯粹用 JavaScript 实现，在一个字符串中，找到字符“abcdef”：
    1. 方法一：逐个查找
        ```js
        /**
         * 逐个查找，直到找到最终结果
        * @param {*} string 被匹配的字符
        */
        function findABCDE(str) {
            let findA = false;
            let findB = false;
            let findC = false;
            let findD = false;
            let findE = false;
            for (const iterator of str) {
                if(iterator === "a") {
                    findA = true;
                } else if(findA && iterator === "b") {
                    findB = true;
                } else if(findB && iterator === "c") {
                    findC = true;
                } else if(findC && iterator === "d") {
                    findD = true;
                } else if(findD && iterator === "e") {
                    return true
                } else if(findE && iterator === "f") {
                    findE = true
                } else {
                    findA = findB = findC = findD = findE = false;
                }
            }
            return false;
        }

        console.log(findABCDE("abcdef gr t"))
        ```
    2. 方法二：通用字符串匹配，
        - 使用 "substring" 方法 、"匹配字符的长度"，截取字符，与目标字符比较
        ```js
            /**
            * 通用字符串匹配
            * @param {*} match 需要匹配的字符
            * @param {*} string 被匹配的字符
            */
            function matchWithSubstring(match, string) {
                for (let i = 0; i < string.length - 1; i++) {
                    if (string.substring(i, i + match.length) === match) {
                        return true;
                    }
                }
                return false;
            }

            console.log(matchWithSubstring('abcdef', 'hello abc rt abcdef'));
        ```

### 3、使用状态机处理字符串
#### (1)在一个字符串中找到字符“abcdef”
1. 分析：
    - **核心逻辑：每找到一个目标字符就切换一个状态**
    - 首先每一个状态都是状态函数，用 state 承载各种状态；
    - 应该有一个开始状态和结束状态函数，分别为 start 和 end；
    - 状态函数名字都代表当前状态的情况 matchedA 就是已经匹配中 a 字符了，以此类推；
    - 每一个状态中的逻辑就是匹配下一个字符；
        - 如果匹配成功返回下一个状态函数名`return findA;`，不能加括号，因为参数需要在`state = state(iterator);`处获取；
        - 如果匹配失败返回开始状态`start(iterator)`再从头判断，此处需带参数称之为 reConsume ；
    - 因为字符中最后一个是 f 字符，所以 findE 成功后，可以直接返回结束状态`end()`因为 end() 直接调用始终返回 `end` 故此处可以带括号；
    - end 这个结束状态，也被称为陷阱方法 (Trap)，因为状态转变结束了，所以让状态一直停留在这里，直到循环结束；
2. js实现状态机查询字符串
    ```js
    /**
     * 状态机查询
    */
    function findABCDEF(str) {
        let state = start;
        for (const iterator of str) {
            state = state(iterator);
        }
        console.log(state, end)
        return state === end;
    }

    function start(iterator) {
        if(iterator === "a") {
            return findA;
        } else {
            return start;
        }
    }

    function findA(iterator) {
        if(iterator === "b") {
            return findB;
        } else {
            return start(iterator);
        }
    }

    function findB(iterator) {
        if(iterator === "c") {
            return findC;
        } else {
            return start(iterator);
        }
    }

    function findC(iterator) {
        if(iterator === "d") {
            return findD;
        } else {
            return start(iterator);
        }
    }

    function findD(iterator) {
        if(iterator === "e") {
            return findE;
        } else {
            return start(iterator);
        }
    }

    function findE(iterator) {
        if(iterator === "f") {
            return end();
        } else {
            return start(iterator);
        }
    }

    function end(iterator) {
        return end;
    }

    console.log(findABCDEF("abab cdef gr t"))
    ```
3. 复习知识：“`fun()`和`fun`的区别：”
    - JS中函数是一个对象，对象保存在内存中，函数名是指向这个函数的指针。
    - 举例说明：
        ```js
        function fun(){
            alert("Hello,JavaSrcipt");
        }
        var onclick_1 = fun;//表示把函数地址值赋值给和
        /* 等效于
        var onclick_1 = function fun(){
            alert("Hello,JavaScript")
        }		
        注意：并不会执行，只是将函数值赋予的onclick
        使用：我们可以通过onclik_1()来调用该函数，onclick_1相当于函数名
        */
        var onclick_2 = fun();//表示立即执行这个函数
        ```
#### (2)在一个字符串中找到字符“abcabx”
1. 分析：
    - 这个问题与上面的区别在于"ab"有重复；
    - 第一次 “b” 后面是 "c"，而第二次 “b” 后面应该是 “x”；
    - 如果第二次的后面不是 “x” 的话就回到`return findB(iterator);`；
        - 然后在 findB 中判断是 findC 或者 start(iterator)
2. js实现状态机查询字符串
    ```js
    function findABCABX(str) {
        let state = start;
        for (const iterator of str) {
            state = state(iterator);
            console.log(state)
        }
        return state === end;
    }

    function start(iterator) {
        if(iterator === "a") {
            return findA;
        } else {
            return start;
        }
    }

    function findA(iterator) {
        if(iterator === "b") {
            return findB;
        } else {
            return start(iterator);
        }
    }

    function findB(iterator) {
        if(iterator === "c") {
            return findC;
        } else {
            return start(iterator);
        }
    }

    function findC(iterator) {
        if(iterator === "a") {
            return findA2;
        } else {
            return start(iterator);
        }
    }

    function findA2(iterator) {
        if(iterator === "b") {
            return findB2;
        } else {
            return start(iterator);
        }
    }

    function findB2(iterator) {
        if(iterator === "x") {
            return end;
        } else {
            return findB(iterator);
        }
    }

    function end(iterator) {
        return end;
    }

    console.log(findABCABX("abcabca bxabx"))
    ```



## 三、HTTP请求
### 1、HTTP的协议解析
#### ISO-OSI 七层网络模型
1. HTTP 组成：
    - 应用
    - 表示
    - 会话
        - 对应 node 的代码里，对应的包为： require('http')
2. TCP 组成：
    - 传输
        - 传输协议包含：TCP、UTP
        - 因为网页需要可靠传输，所以我们只关心 TCP
        - TCP 层对应包为： require("net")
3. Internet 组成：
    - 网络
        - 有时候讲上网有两层意思
        - 网页所在的应用层的协议（web：world wide web）万维网；
        - 底层负责数据传输的是 （Internet）英特网;
            - internet 协议就是 （IP：Internet Protocol） 协议；
        - 公司内网，叫 Intranet
4. 4G/5G/Wi-Fi 组成：
    - 数据链路
    - 物理层
        - 为了完成对数据准确的传输
        - 传输都是点对点的传输
        - 必须有直接的连接才能进行传输
#### TCP与IP的基础知识
1. 流
    - TCP层中传输数据的概念是 “流”
        - 流是一种没有明显的分割单位
        - 它只保证前后的顺序是正确的
2. 端口
    - TCP 协议是被计算机里面的软件所使用的
    - 每一个软件都会去从网卡去拿数据
    - 端口决定哪一个数据包分配给哪一个软件
    - 对应 node.js 的话就是应用 require('net')
3. 包
    - TCP的传输概念就是一个一个的数据包
    - 每一个数据包可大可小
    - 这个取决于你整个的网络中间设备的传输能力
4. IP地址
    - IP根据地址去找到数据包应该从哪里到哪里
    - 在 Internet 上的连接关系非常复杂，中间就会有一些大型的路由节点
    - 当我们访问一个 IP 地址时，就会连接上我们的小区地址上，然后到电信的主干
        - 如果是访问外国的话，就会再上到国际的主干地址上
    - 这个IP地址是唯一的标识，连入 Internet 上的每一个设备
    - 所以 IP 包，就是通过 IP 地址找到自己需要被传输到哪里
5. libnet/libpcap
    - 在 node 中没有对应 IP 协议的底层库，node底层需要调用 C++ 的这两个库
    - libnet 负责构造 IP 包并且发送
    - labpcap 负责从网卡抓取所有流经网卡的IP包
    - 如果我们去用交换机而不是路由器去组网，我们用IP层的 labpcap 基础库包，就能抓到很多本来不属于发给我们的IP包
#### HTTP的基础知识
1. Request 请求
2. Response 返回
    - 相对于 TCP 这种全双工通道，就是可以发也可以收，没有优先关系
    - 而 HTTP 特别的是必须得先由客户端发起一个 request
    - 然后服务端回来一个 response
    - 所以每一个 request 必定有一个对应的 response
    - 如果 request 或者 response 多了都说明协议出错

### 2、服务端环境准备
#### 编写node.js服务端
```js
const http = require('http');

// 创建 Web 服务器。
const server = http.createServer((req, res) => {
    let body = [];
    req.on('error', (err) => {
        console.log(err);
    }).on('data', (chunk) => {
        body.push(chunk.toString())
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log("body:", body);
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end("hello word\n")
    })
});

// 启动服务器
server.listen(8088, () => {
  console.log('服务器已启动');
  // 停止服务器
  server.close(() => {
    console.log('服务器已停止');
  });
});
```
#### 了解 HTTP Request 协议
* HTTP 协议的 request 部分：
    > POST / HTTP/1.1                                           //request line
    > Host: 127.0.0.1                                           //headers
    > Content-Type: application/x-www-form-urlencoded           //headers
    >                                                           //空行结束headers
    > field1=aaa&code=x%3D1
* HTTP 协议是一个文本型的协议，文本型的协议一般来说与二进制的协议是相对的，也意味着这个协议里面所有内容都是字符串。
* HTTP 协议的第一行叫做 ***request line***，包含了三个部分：
    1. Method：例如 POST，GET 等
    2. Path：默认就是 “/”
        - 域名后面的斜杠后面的内容就是路径
    3. HTTP和HTTP版本：HTTP/1.1
* 然后接下来就是 ***Headers***
    - Header的行数不固定
    - 每一行都是以一个冒号分割了 key: value 格式
    - Headers是以空行进行结束
* 最后的一部分就是 ***body*** 部分：
    - 这个部分的内容是以 Content-Type来决定的
    - Content-Type 规定了什么格式，那么 body 就用什么格式来写

### 3、实现一个HTTP请求
1. 分析：
    - 设计一个HTTP请求的类
    - content type 是一个必要的字段，要有默认值
    - body 是 KV 格式
    - 不同的 content-type 影响 body 的格式
2. 首先从使用上去设计接口的形式
    ```js
    /**
     * 请求方法的使用
     */
    void async function () {
        let request = new Request({
            method: "POST",             //http
            host: "127.0.0.1",          //IP层
            port: "8088",               //tcp
            path: "/",                  //http
            headers: {                  //http
                ["X-Foo2"]: "custom"
            },
            body: {
                name: "zhz"
            }
        })

        let response = await request.send();

        console.log(response);
    }();
    ```
3. 其次是 Request 类的实现
    ```js
    /**
     * Request类的实现
     */
    class Request {
        //1、Request 构造器中收集必要信息
        constructor(options) {
            this.method = options.method || "GET";
            this.host = options.host;
            this.port = options.port || 80;//http协议默认端口80
            this.body = options.body || {};
            this.headers = options.headers || {};

            //HTTP协议中一定要有"Content-Type"的 header ，否则 body 无法解析；
            if(!this.headers["Content-Type"]) {
                this.headers["Content-Type"] = "application/x-www-form-urlencoded";
            }

            //body 其实有四种比较常用的编码格式，此处仅写两种;
            //不同的 Content-Type 对 body 有不同的影响，此处处理
            if(this.headers["Content-Type"] === "application/json") {
                this.bodyText = JSON.stringify(this.body);
            } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
                this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join("&");
            }

            //HTTP协议中一定要有"Content-Length"的 header ，该 header 不推荐从外面传入，而应取 bodyText 的长度，若长度错误的话，HTTP 协议的请求将会是一个非法的请求；
            this.headers["Content-Length"] = this.bodyText.length;

            console.log(this)
            /** 以上的目的均为写出 Request {} 内的所有内容
            Request {
                method: 'POST',
                host: '127.0.0.1',
                port: '8088',
                body: { name: 'zhz' },
                headers:{ 
                    'X-Foo2': 'custom',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': 8 
                },
                bodyText: 'name=zhz' 
            } 
            */
        }

        //2、send 函数把真实请求发送到服务器
        send() {
            return new Promise((resolve, reject) => {

            })
        }
    }
    ```

### 4、send函数的编写，了解response格式
#### (1)send函数的编写
1. 分析：
    - Send 函数是异步的，返回一个 Promise ；
    - 所以在 send 的过程中会逐步收到 response；
    - 最后把 response 构造好之后再让 Promise 得到 resolve；
    - 因为过程是逐步收到信息的，我们需要设计一个 ResponseParse；
    - 这样 Parse 可以通过逐步地去接收 response 的信息来构造 response 对象不同的部分；
2. 实现：
    ```js
    // 发送请求的方法，返回 Promise 对象
    send() {
        return new Promise((resolve, reject) => {
        const parser = new ResponseParser();
        resolve('');
        });
    }
    ```
#### (2)设计 ResponseParser
1. 分析：
    - 逐步接受 response 文本并分析；
    - Receive 函数接收字符串；
    - 然后用状态机对逐个字符串进行处理；
    - 所以我们需要循环每个字符串，然后加入 receiveCharState 函数来对每个字符进行处理；
2. 实现：
    ```js
    class ResponseParser {
        constructor() {}
        receive(string) {
            for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
            }
        }
        receiveChar(char) {}
    }
    ```
#### (3)了解 HTTP Response 协议
在接下来的部分，我们需要在代码中解析 HTTP Response 中的内容，所以我先来了解一下 HTTP Response 中的内容。

> HTTP/1.1 200 OK                               //status line
> Content-Type: text/html                       //headers
> Date: Mon, 23 Dec 2019 06:46:19 GMT           //headers
> Connection: keep-alive                        //headers
> Transfer-Encoding: chunked                    //headers
>                                               //空行表示 headers 与 body 分隔
> 26                                            //body
> <html><body>Hello World</body></html>         //body
>                                               //body
> 0                                             //body
>
>

1. 首先第一行的 status line 与 request line 相反
    - 第一部分是 HTTP协议的版本：HTTP/1.1
    - 第二部分是 HTTP 状态码：200 (在实现我们的浏览器，为了更加简单一点，我们可以把200以外的状态为出错)
    - 第三部分是 HTTP 状态文本：OK
2. 随后就是 header 部分：
    - HTML的 request 和 response 都是包含 header 的
    - 它的格式跟 request 是完全一致的
    - 最后是一个空行，用来分割 headers 和 body 内容的部分的
3. 最后是 body 部分：
    - 这里 body 的格式也是根据 Content-Type 来决定的
    - 这里有一种比较典型的格式叫做 chunked body (是 Node 默认返回的一种格式)
        - Chunked body 是由一个十六进制的数字单独占一行
        - 后面跟着内容部分
        - 最后跟着一个十六进制的0，0之后就是整个 body 的结尾了


### 5、发送请求
1. 通过实现 send 函数中的逻辑来真正发送请求到服务端思路：
    - 设计支持已有的 connection 或者自己新增 connection
    - 收到数据传给 parser
    - 根据 parser 的状态 resolve Promise
2. 代码实现
    ```js
        //2、send 函数把真实请求发送到服务器
        send(connection) {
            return new Promise((resolve, reject) => {
                const parser = new ResponseParser;
                if(connection) {
                    //若链接存在，按照格式写入并发送
                    connection.write(this.toString());
                } else {
                    //若链接不存在，创建一个到端口 port 和 主机 host的 TCP 连接。
                    connection = net.createConnection({
                        host: this.host,
                        port: this.port
                    }, () => {
                        // `toString` 是把请求参数按照 HTTP Request 的格式组装
                        connection.write(this.toString());

                        //connection 最终形成 Socket {xxx:xxx} 与服务端通信;
                        //console.log("connection:", connection)
                    })
                }

                //监听 connection 的 data
                connection.on("data", (data) => {
                    console.log("发送成功，监听返回的data：", data.toString());

                    //将 data 转为字符串，传给 parser
                    parser.receive(data.toString());
                    if(parser.isFinished) {
                        //若 parse 结束，结束 parser ，结束 connection 。
                        resolve(parser.response);
                        connection.end();
                    }
                })

                connection.on("error", (err) => {
                    reject(err);
                    connection.end();
                })
            })
        }

        //3、toString 的实现
        toString() {
            //request line
            //headers
            //空格
            //bodyText
            //注：该格式一定要严谨，若不然，会发送失败
            return `${this.method} ${this.path} HTTP/1.1\r
    ${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join("\r\n")}\r
    \r
    ${this.bodyText}`
        }
    }
    ```
    
### 6、response解析
1. 思路：
    - Response 必须分段构造，所以我们要用一个 Response Parser 来 “装配”
    - ResponseParser 分段处理 Response Text，我们用状态机来分析文本结构
2. 实现：
    ```js
    class ResponseParser {
        constructor() {
            this.WAITING_STATUS_LINE = 0;               //\r状态
            this.WAITING_STATUS_LINE_END = 1;           //\n状态
            this.WAITING_HEADER_NAME = 2;               //header name 状态
            this.WAITING_HEADER_SPACE = 3;              //":"+"空格"状态
            this.WAITING_HEADER_VALUE = 4;              //header value状态
            this.WAITING_HEADER_LINE_END = 5;           //\n状态
            this.WAITING_HEADER_BLOCK_END = 6;          //header之后的空行状态
            this.WAITING_BODY = 7;                      //body格式不固定，无法在同一个Response Parser中解决状态

            this.current = this.WAITING_STATUS_LINE;    //开始置为初始状态
            this.statusLine = "";
            this.headers = {};
            this.headerName = "";
            this.headerValue = "";
            this.bodyParser = null;
        }

        get isFinished() {
            return this.bodyParser && this.bodyParser.isFinished;
        }

        get response() {
            this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\S\s]+)/);
            return {
                statusCode: RegExp.$1,          //RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个子匹配(以括号为标志)字符串
                statusText: RegExp.$2,
                headers: this.headers,
                body: this.bodyParser.content.join("")
            }
        }

        receive(str) {
            for (let i = 0; i < str.length; i++) {
                this.receiveCharState(str.charAt(i))
            }
        }

        //状态机代码
        receiveCharState(char) {
            if(this.current === this.WAITING_STATUS_LINE) {
                if(char === "\r") {
                    this.current = this.WAITING_STATUS_LINE_END;
                } else {
                    this.statusLine += char;
                }
            } else if(this.current === this. WAITING_STATUS_LINE_END) {
                if(char === "\n") {
                    this.current = this.WAITING_HEADER_NAME;
                }
            } else if(this.current === this.WAITING_HEADER_NAME) {
                if(char === ":"){
                    this.current = this.WAITING_HEADER_SPACE;
                } else if(char === "\r") {
                    //此时所有的header已经收到
                    this.current = this.WAITING_HEADER_BLOCK_END;
                    //”Transfer-Encoding“在 node 中是”chunked“形式，在此根据不同的值，调用不同的 bodyParser;
                    if(this.headers["Transfer-Encoding"] === "chunked") {
                        this.bodyParser = new TrunkedBodyParser();
                    } else if(this.headers["Transfer-Encoding"] === "xxx") {
                        //写其它的 bodyParser
                    }
                } else {
                    this.headerName += char;
                }
            } else if(this.current === this.WAITING_HEADER_SPACE) {
                if(char === " ") {
                    this.current = this.WAITING_HEADER_VALUE;
                }
            } else if(this.current === this.WAITING_HEADER_VALUE) {
                if(char === "\r") {
                    this.current = this.WAITING_HEADER_LINE_END;
                    this.headers[this.headerName] = this.headerValue;
                    this.headerName = "";
                    this.headerValue = "";
                } else {
                    this.headerValue += char;
                }
            }else if(this.current === this.WAITING_HEADER_LINE_END) {
                if(char === "\n") {
                    this.current = this.WAITING_HEADER_NAME;
                }
            } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
                if(char === "\n") {
                    this.current = this.WAITING_BODY;
                }
            } else if(this.current === this.WAITING_BODY) {
                this.bodyParser.receiveCharState(char);
            }
        }
    }
    ```

### 7、response body的解析
1. 思路：
    - Response 的 body 可能根据 Content-Type 有不同的结构，因此我们会采用子 Parser 的结构来解决问题
    - 以 ChunkedBodyParser 为例，我们同样用状态机来处理 body 的格式
2. 实现：
    ```js
    class TrunkedBodyParser {
        constructor() {
            /**分析chunk：
             * f                                        //trunk长度
             * hello word zhz                           //trunk内容
             *                                          //trunk结束
             * 0                                        //trunk长度，遇到body为0的chunk，结束body
             *                                          //trunk内容，内容为空
             *                                          //trunk结束
             */
            this.WAITING_LENGTH = 0;                    //读取长度，遇到\r，退出当前状态，到下一个状态；
            this.WAITING_LENGTH_LINE_END = 1;           //遇到\n，退出当前状态，到下一个状态；
            this.READING_TRUNK = 2;                     //计算内容长度，匹配读取的长度，退出当前状态，到下一个状态；
            this.WAITING_NEW_LINE = 3;
            this.WAITING_NEW_LINE_END = 4;

            this.length = 0;
            this.content = [];
            this.isFinished = false;
            this.current = this.WAITING_LENGTH;
        }

        receiveCharState(char) {
            if(this.current === this.WAITING_LENGTH) {
                if(char === "\r") {
                    //此时读取完length，若为0，则isFinished；
                    if(this.length === 0) {
                        this.isFinished = true;
                    }
                    this.current = this.WAITING_LENGTH_LINE_END
                } else {
                    //f3(16) ==> 243(10)
                    this.length *= 16;
                    this.length += parseInt(char, 16)
                }
            } else if(this.current === this.WAITING_LENGTH_LINE_END) {
                if(char === "\n") {
                    this.current = this.READING_TRUNK;
                }
            } else if(this.current === this.READING_TRUNK) {
                this.content.push(char);
                this.length --;
                if(this.length === 0) {
                    this.current = this.WAITING_NEW_LINE;
                }
            } else if(this.current === this.WAITING_NEW_LINE) {
                if(char === "\r") {
                    this.current = this.WAITING_NEW_LINE_END
                }
            } else if(this.current === this.WAITING_NEW_LINE_END) {
                if(char === "\n") {
                    this.current = this.WAITING_LENGTH;
                }
            }
        }
    }
    ```

# 浏览器的工作原理（二）见week9
## 四、HTML解析
## 五、CSS计算

# 浏览器的工作原理（三）见week10
## 六、排版
## 七、渲染

# 复习生疏知识
1. void操作符
    > 产生式 UnaryExpression : void UnaryExpression 按如下流程解释:
    > 令 expr 为解释执行UnaryExpression的结果。
    > 调用 GetValue(expr).
    > 返回 undefined.
    > 注意：GetValue一定要调用，即使它的值不会被用到，但是这个表达式可能会有副作用(side-effects)。
    - void 之后接一元表达式；