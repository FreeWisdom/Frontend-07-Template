var CircularJSON = require('circular-json');
const net = require("net");
const parser = require("./parser.js");

/**
 * Request类的实现
 */
class Request {
    //1、Request 构造器中收集必要信息
    constructor(options) {
        this.method = options.method || "GET";
        this.path = options.path || "/";
        this.host = options.host;
        this.port = options.port || 80;//http协议默认端口80
        this.body = options.body || {};
        this.headers = options.headers || {};

        //HTTP协议中一定要有"Content-Type"的 header ，否则 body 无法解析；
        if(!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }

        //body 其实有四种比较常用的编码格式，此处仅写两种
        //不同的 Content-Type 对 body 有不同的影响，此处处理
        if(this.headers["Content-Type"] === "application/json") {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join("&");
        }

        //HTTP协议中一定要有"Content-Length"的 header ，该 header 不推荐从外面传入，而应取 bodyText 的长度，若长度错误的话，HTTP 协议的请求将会是一个非法的请求；
        this.headers["Content-Length"] = this.bodyText.length;

        // console.log(this)
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
                    // console.log("connection:", connection)
                })
            }

            //监听 connection 的 data
            connection.on("data", (data) => {
                // console.log("发送成功，监听返回的data：", data.toString());

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

/**
 * ResponseParser 类的实现
 * 逐步接受 response 文本并分析
 */
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
    console.log("response.body:", response.body);
    let dom = parser.parserHTML(response.body);
    console.log("dom", dom);
    console.log("dom", CircularJSON.stringify(dom, null, 4));
}();

//void + 一元表达式