# 浏览器的工作原理（二）
>之前我们完成了从 HTTP 发送 Request，到接收到 Response，并且把 Response 中的文本都解析出来。
>这一部分我们主要讲解如何做 HTML 解析 和 CSS 计算这两个部分
## 四、HTML解析
### （一）HTML parse 模块的文件拆分
1. 思路：
    - 为了方便文件管理，我们把 parser 单独拆分到文件中;
    - parser 接收 HTML 文本作为参数，返回一棵 DOM 树;
2. 添加 HTML Parser
    - 之前我们最后获得了一个 Response 对象，这里我们就考虑如何利用这个 Response 中的 body 内容;
    - 获得 Response 之后，把 body 内容传给 parser 中的 parseHTML 方法进行解析;
    - 在真正的浏览器中，我们是应该逐段的传给 parser 处理，然后逐段的返回(异步分段处理);
    - 因为这里我们的目标只是简单实现浏览器工作的原理，所以我们只需要统一解析然后返回就好;
3. 代码实现：
>文件：client.js
```js
 // 1. 引入 parser.js
const parser = require('./parser.js');
// ...
//... 之前代码略
// ...
let response = await request.send();

// 2. 在 `请求方法` 中，获得 response 后加入 HTML 的解析代码
let dom = parser.parseHTML(response.body);
```
>文件：parser.js
```js
module.exports.parseHTML = function (html) {
  console.log(html);
};
```

### （二）用有限状态机 FSM（Finite State Machine)实现 HTML的分析
1. 思路：
    - HTML 标准里面已经把整个 HTML 状态机中的状态都设计好了，我们直接就看HTML标准中给我们设计好的状态：https://html.spec.whatwg.org/multipage/，直接找到 “Tokenization” 查看列出的状态，这里就是所有 HTML 的词法；
    - 在 HTML 中有80个状态，但是在此，因为只需要走一遍浏览器工作的流程，我们就不一一实现了，在其中挑选一部分来实现即可；
2. 初始化 parseHTML 的状态机：
    >文件：parser.js
    ```js
    const EOF = Symbol("EOF");   //end of file

    function data(c) {

    }

    module.exports.parserHTML = function(html) {
        //html 标准中将初始状态称作 data ，故此处将 data 赋值；
        let state = data;

        for (const c of html) {
            //根据字符内容完成状态迁移
            state = state(c);
        }
        
        //因为HTML最后是有文件终结的，故在此使用 Symbol("EOF") 给定一个额外的、无效的字符，作为状态机的最后一个输入，强迫完成截止状态，表示文件终结；
        state = state(EOF);
    }
    ```

### （三）解析标签
1. 认识 HTML 的三种标签
    - 开始标签
    - 结束标签
    - 自封闭标签
2. 用状态机区分三种标签：
    >文件：parser.js
    ```js
    const EOF = Symbol("EOF");   //end of file

    //初始状态
    function data(c) {
        if(c === "<") {// c 是不是一个tag，若是 tag 切换到”标签打开状态“，注：此处不能确定是哪一种标签；
            return tagOpen;
        } else if(c === "EOF") {
            return;
        } else {// c 是不是文本节点；
            return data;
        }
    }

    //标签的开始状态
    function tagOpen(c) {
        if(c === "/") {//判断是不是结束标签”</xxx>“，若是结束标签，切换到”结束标签的打开状态“；
            return endTagOpen;
        } else if(c.match(/^[a-zA-Z]$/)) {//若是英文字母，要么是开始标签，要么是自封闭标签，切换到”标签名称状态“；
            return tagName(c);
        } else {
            return;
        }
    }

    //结束标签的开始状态
    function endTagOpen(c) {
        if(c.match(/^[a-zA-Z]$/)) {//同上，切换到”标签名称状态“
            return tagName(c);
        } else if(c === ">") {//报错，处理异常逻辑

        } else if(c === EOF) {//报错，处理异常逻辑

        } else {//报错，处理异常逻辑

        }
    }

    //标签名称状态
    function tagName(c) {
        if(c.match(/^\t\n\f $/)) {//<html prop></html>，tagName以空白符结束(HTML中有效的4种空白符”tab符\换行符\禁止符\空格符“)，切换到”将开始属性名状态“；
            return beforeAttributeName;
        } else if(c === "/") {//<html/>，若遇到”/“，说明该标签是自封闭标签，切换到”自封闭标签开始关闭状态“
            return selfClosingStartTag;
        } else if(c.match(/^[a-zA-Z]$/)) {
            return tagName;
        } else if(c === ">") {//<html>，若遇到”>“，说明该标签是普通的开始标签，故结束标签，切换到”初始状态“，解析下一个标签；
            return data;
        } else {
            return tagName;
        }
    }

    //将开始属性名状态
    //1.后面具体进行属性的分析，此处除了”>“切换到”初始状态“，其他一律由本状态切换至本状态”将开始属性名状态“
    function beforeAttributeName(c) {
        if(c.match(/^\t\n\f $/)) {
            return beforeAttributeName;
        } else if(c === "=") {
            return beforeAttributeName;
        } else if(c === ">") {
            return data;
        } else {
            return beforeAttributeName;
        }
    }

    //自封闭标签开始关闭状态
    function selfClosingStartTag(c) {
        if(c === ">") {//此处只有”>“是有效的，切换到”初始状态“
            // currentToken.isSelfClosing = true;
            return data;
        } else if(c === EOF) {//报错，处理异常逻辑

        } else {//报错，处理异常逻辑

        }
    }

    module.exports.parserHTML = function(html) {
        //html 标准中将初始状态称作 data ，故此处将 data 赋值；
        let state = data;
        for (let c of html) {
            //根据字符内容完成状态迁移
            state = state(c);
        }
        
        //因为HTML最后是有文件终结的，故在此使用 Symbol("EOF") 给定一个额外的、无效的字符，作为状态机的最后一个输入，强迫完成截止状态，表示文件终结；
        state = state(EOF);
    }
    ```

### （四）创建元素
> 在状态机中，除了状态迁移，还会加入业务逻辑。
> 在标签结束状态提交标签 token 。
1. 业务逻辑：
    - 首先建立一个 currentToken 来暂存当前的 Token（这用于存放开始和结束标签 token ）;
    - 然后建立一个 emit() 方法来接收最后创建完毕的 Token（这后面会用逐个 Token 来创建 DOM 树）;
    - ***HTML 数据开始状态 —— data***
        - 如果找到的是 EOF，那就直接 emit 一个 type: ‘EOF’ 的 Token;
        - 如果是文本内容的话，直接 emit {type: 'text', content: char} 的 token;
    - ***标签开始状态 —— tagOpen***
        - 如果匹配中的是字母，那就是开始标签，直接记录开始标签 Token 对象 {type: 'startTag, tagName: ''};
        - 在 tagName() 状态中我们会把整个完整的标签名拼接好;
    - ***标签结束状态 —— endTagOpen***
        - 如果匹配到字符，那就是结束标签名;
        - 直接记录结束标签 Token 对象 {type: 'endTag', tagName: ''};
        - 雷同，后面会在 tagName() 状态中我们会把整个完整的标签名拼接好;
    - ***标签名状态 —— tagName***（**这里是最核心的业务区了**）
        - 在第三种情况下，匹配到字母时，那就是需要拼接标签名的时候;
            - 这里我们直接给 currentTag 追加字母即可;
        - 当我们匹配到 > 字符时，就是这个标签结束的时候，这个时候我们已经拥有一个完整的标签 Token了;
            - 所以这里我们直接把 currentToken emit 出去;
    - ***标签属性状态 —— beforeAttributeName***
        - 在匹配到 > 字符的时候，这里就是标签结束的时候，所以可以 emit currentToken ;;
    - ***自封闭标签状态 —— selfClosingStartTag***
        - 在匹配到 > 字符时，就是自闭标签结束的时候;
            - 这里我们直接给 currentToken 追加一个 isSelfClosing = true 的状态;
            - 然后直接可以把 currentToken emit 出去了;
2. 代码实现：
    >文件：parser.js
    ```js
    let currentToken = null;

    //保证状态机创建完状态之后，在同一个出口输出；
    function emit(token) {
        console.log(token);
    }

    const EOF = Symbol("EOF");   //end of file

    //初始状态
    function data(c) {
        if(c === "<") {// c 是不是一个tag，若是 tag 切换到”标签打开状态“，注：此处不能确定是哪一种标签；
            return tagOpen;
        } else if(c === EOF) {
            emit({
                type: "EOF"
            });
            return;
        } else {// c 是不是文本节点；
            emit({
                type: "Text",
                content: c
            });
            return data;
        }
    }

    //标签的开始状态
    function tagOpen(c) {
        if(c === "/") {//判断是不是结束标签”</xxx>“，若是结束标签，切换到”结束标签的打开状态“；
            return endTagOpen;
        } else if(c.match(/^[a-zA-Z]$/)) {//若是英文字母，要么是开始标签，要么是自封闭标签，切换到”标签名称状态“；
            //有可能是自封闭、双标签，故设置 type:startTag ，同时符合两种类型标签的开始状态，为了区分后面使用 isSelfClosing；
            currentToken = {
                type: "startTag",
                tagName: ""
            }
            return tagName(c);
        } else {
            return;
        }
    }

    //结束标签的开始状态
    function endTagOpen(c) {
        if(c.match(/^[a-zA-Z]$/)) {//同上，切换到”标签名称状态“
            currentToken = {
                type: "endTag",
                tagName: ""
            }
            return tagName(c);
        } else if(c === ">") {//报错，处理异常逻辑

        } else if(c === EOF) {//报错，处理异常逻辑

        } else {//报错，处理异常逻辑

        }
    }

    //标签名称状态
    function tagName(c) {
        if(c.match(/^[\t\n\f ]$/)) {//<html prop></html>，tagName以空白符结束(HTML中有效的4种空白符”tab符\换行符\禁止符\空格符“)，切换到”将开始属性名状态“；
            return beforeAttributeName;
        } else if(c === "/") {//<html/>，若遇到”/“，说明该标签是自封闭标签，切换到”自封闭标签开始关闭状态“
            return selfClosingStartTag;
        } else if(c.match(/^[a-zA-Z]$/)) {
            //补全tagName;
            currentToken.tagName += c;
            return tagName;
        } else if(c === ">") {//<html>，若遇到”>“，说明该标签是普通的开始标签，故结束标签，切换到”初始状态“，解析下一个标签；
            emit(currentToken);
            return data;
        } else {
            return tagName;
        }
    }

    //将开始属性名状态
    //1.后面具体进行属性的分析，此处除了”>“切换到”初始状态“，其他一律由本状态切换至本状态”将开始属性名状态“
    function beforeAttributeName(c) {
        if(c.match(/^\t\n\f $/)) {
            return beforeAttributeName;
        } else if(c === "=") {
            return beforeAttributeName;
        } else if(c === ">") {
            return data;
        } else {
            return beforeAttributeName;
        }
    }

    //自封闭标签开始关闭状态
    function selfClosingStartTag(c) {
        if(c === ">") {//此处只有”>“是有效的，切换到”初始状态“
            currentToken.isSelfClosing = true;
            //注：此处应emit()，若不然自封闭标签<img/>读不出来；
            emit(currentToken);
            return data;
        } else if(c === EOF) {//报错，处理异常逻辑

        } else {//报错，处理异常逻辑

        }
    }

    module.exports.parserHTML = function(html) {
        //html 标准中将初始状态称作 data ，故此处将 data 赋值；
        let state = data;
        for (let c of html) {
            //根据字符内容完成状态迁移
            state = state(c);
        }
        
        //因为HTML最后是有文件终结的，故在此使用 Symbol("EOF") 给定一个额外的、无效的字符，作为状态机的最后一个输入，强迫完成截止状态，表示文件终结；
        state = state(EOF);
    }
    ```

### （五）处理属性
> 属性值分为单引号、双引号、无引号三种写法，因此需要较多状态处理
> 处理属性的方式跟标签类似
> 属性结束时，我们把属性加到标签 Token 上
1. 业务逻辑：
    - 首先定义一个 currentAttribute 来存放当前找到的属性;
    - 然后在里面叠加属性的名字和属性值，都完成后再放入 currentToken 之中;
    - ***将开始属性名状态 —— beforeAttributeName***
        - 如果遇到 空格 换行 回车 等字符就可以再次进入将开始属性名状态 **beforeAttributeName**，继续等待属性的字符;
        - 如果我们遇到 / 或者 > 就是标签直接结束了，我们就可以进入属性结束状态 **afterAttributeName**;
        - 如果遇到 = 或者 EOF 这里就有 HTML 语法错误，正常来说就会返回 parse error;
        - 其他情况的话，就是刚刚开始属性名时就可以创建新的 currentAttribute 对象 {name: '', value: ''}，然后进入属性名状态 **attributeName**;
    - ***属性名状态 —— attributeName***
        - 如果我们遇到 空格 换行 回车 / > EOF 等字符时，就可以判定这个属性已经结束了，可以直接迁移到 **afterAttributeName** 状态;
        - 如果我们遇到一个 = 字符，证明我们的属性名读取完毕，下来就是属性值了 **beforeAttributeValue**;
        - 如果我们遇到 \u0000 那就是解析错误，直接抛出 Parse error;
        - 最后所有其他的都是当前属性名的字符，直接叠加到 currentAttribute 的 name 值中，然后继续进入属性名状态 **attributeName** 继续读取属性名字符;
    - ***属性值开始状态 —— beforeAttributeValue***
        - 如果我们遇到 空格 换行 回车 / > EOF 等字符时，我们继续往后寻找属性值，所以继续返回 **beforeAttributeValue** 状态;
        - 如果遇到 " 就是双引号属性值，进入 **doubleQuotedAttributeValue**;
        - 如果遇到 ' 就是单引号属性值，进入 **singleQuotedAttributeValue**;
        - 其他情况就是遇到没有引号的属性值，使用 reConsume 的技巧进入 **unquotedAttributeValue(char)**;
    - ***双引号属性值状态 -- doubleQuotedAttributeValue***
        - 这里我们死等 " 字符，到达这个字符证明这个属性的名和值都读取完毕，可以直接把这两个值放入当前 Token 了，进入 **afterQuotedAttributeValue**;
        - 如果遇到 \u0000 或者 EOF 就是 HTML 语法错误，直接抛出 Parse error;
        - 其他情况就是继续读取属性值，并且叠加到 currentAttribute 的 value 中，然后继续进入 **doubleQuotedAttributeValue**;
    - ***单引号属性值状态 —— singleQuotedAttributeValue***
        - 与双引号雷同，这里我们死等 ' 字符，到达这个字符证明这个属性的名和值都读取完毕，可以直接把这两个值放入当前 Token 了，进入 **afterQuotedAttributeValue**;
        - 如果遇到 \u0000 或者 EOF 就是 HTML 语法错误，直接抛出 Parse error;
        - 其他情况就是继续读取属性值，并且叠加到 currentAttribute 的 value 中，然后继续进入 **singleQuotedAttributeValue**;
    - ***引号结束状态 —— afterQuotedAttributeValue***
        - 如果我们遇到空格、换行、回车等字符时，证明还有可能有属性值，所以我们迁移到 **beforeAttributeName** 状态;
        - 这个时候遇到一个 / 字符，因为之前我们读的是属性，属性都是在开始标签中的，在开始标签遇到 / ，那肯定是自封闭标签了。所以这里直接迁移到 **selfClosingStartTag** 状态;
        - 如果遇到 > 字符，证明标签要结束了，直接把当前组装好的属性名和值加入 currentToken， 然后直接 emit 出去，回到 **data**;
        - 如果遇到 EOF 那就是 HTML 语法错误，抛出 Parse error;
        - 其他情况按照浏览器规范，这里属于属性之间缺少空格的解析错误 (Parse error: missing-whitespace-between-attributes);
    - ***无引号属性值状态 —— unquotedAttributeValue***
        - 如果我们遇到空格、换行、回车等字符时，证明属性值结束，这个时候我们就可以直接把当前属性加入 currentToken，然后还有可能有其他属性，所以回到 **beforeAttributeName** 状态;
        - 如果遇到 / 证明标签是一个自封闭标签，先把当前属性加入 currentToken 然后进入 **selfClosingStartTag** 状态;
        - 如果遇到 > 证明标签正常结束了，先把当前属性加入 currentToken 然后直接 emit token;
        - 遇到其他不合法字符都直接抛出 Parse error;
        - 其他情况就是还在读取属性值的字符，所以叠加当前字符到属性值中，然后继续回到 **unquotedAttributeValue**;
    - ***属性名结束状态 —— afterAttributeName***
        - 如果我们遇到空格、换行、回车等字符时，证明还没有找到结束字符，继续寻找，所以重新进入 **afterAttributeName**;
        - 如果遇到 / 证明这个标签是自封闭标签，直接迁移到 **selfClosingStartTag** 状态;
        - 如果遇到 = 字符证明下一个字符开始就是属性值了，迁移到 **beforeAttributeValue** 状态;
        - 如果遇到 > 字符，证明标签正常结束了，先把当前属性加入 currentToken 然后直接 emit token;
        - 如果遇到 EOF 证明HTML 文本异常结束了，直接抛出 Parse error;
        - 其他情况下，属于属性名又开始了，所以把上一个属性加入 currentToken 然后继续记录下一个属性，回到 **attributeName**;
2. 代码实现：
    ```js
    let currentToken = null;
    let currentAttribute = null;

    //保证状态机创建完状态之后，在同一个出口输出；
    function emit(token) {
        console.log(token);
    }

    const EOF = Symbol("EOF");   //end of file

    //初始状态
    function data(c) {
        if(c === "<") {// c 是不是一个tag，若是 tag 切换到”标签打开状态“，注：此处不能确定是哪一种标签；
            return tagOpen;
        } else if(c === EOF) {
            emit({
                type: "EOF"
            });
            return;
        } else {// c 是不是文本节点；
            emit({
                type: "Text",
                content: c
            });
            return data;
        }
    }

    //标签的开始状态
    function tagOpen(c) {
        if(c === "/") {//判断是不是结束标签”</xxx>“，若是结束标签，切换到”结束标签的打开状态“；
            return endTagOpen;
        } else if(c.match(/^[a-zA-Z]$/)) {//若是英文字母，要么是开始标签，要么是自封闭标签，切换到”标签名称状态“；
            //有可能是自封闭、双标签，故设置 type:startTag ，同时符合两种类型标签的开始状态，为了区分后面使用 isSelfClosing；
            currentToken = {
                type: "startTag",
                tagName: ""
            }
            return tagName(c);
        } else {
            return;
        }
    }

    //结束标签的开始状态
    function endTagOpen(c) {
        if(c.match(/^[a-zA-Z]$/)) {//同上，切换到”标签名称状态“
            currentToken = {
                type: "endTag",
                tagName: ""
            }
            return tagName(c);
        } else if(c === ">") {//报错，处理异常逻辑
            throw new Error('Parse error');
        } else if(c === EOF) {//报错，处理异常逻辑
            throw new Error('Parse error');
        } else {//报错，处理异常逻辑

        }
    }

    //标签名称状态
    function tagName(c) {
        if(c.match(/^[\t\n\f ]$/)) {//<html prop></html>，tagName以空白符结束(HTML中有效的4种空白符”tab符\换行符\禁止符\空格符“)，切换到”将开始属性名状态“；
            return beforeAttributeName;
        } else if(c === "/") {//<html/>，若遇到”/“，说明该标签是自封闭标签，切换到”自封闭标签开始关闭状态“
            return selfClosingStartTag;
        } else if(c.match(/^[a-zA-Z]$/)) {
            //补全tagName;
            currentToken.tagName += c;
            return tagName;
        } else if(c === ">") {//<html>，若遇到”>“，说明该标签是普通的开始标签，故结束标签，切换到”初始状态“，解析下一个标签；
            emit(currentToken);
            return data;
        } else {
            return tagName;
        }
    }

    //将开始属性名状态
    //1.后面具体进行属性的分析，此处除了”>“切换到”初始状态“，其他一律由本状态切换至本状态”将开始属性名状态“
    function beforeAttributeName(c) {
        if(c.match(/^[\t\n\f ]$/)) {
            return beforeAttributeName;
        }else if(c === "/" || c === ">" || c === EOF) {
            return afterAttributeName(c);
        } else if(c === "=") {
            //报错，处理异常逻辑
        } else {
            currentAttribute = {
                name: "",
                value: ""
            }
            return attributeName(c);
        }
    }

    function attributeName(c) {
        if(c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
            return afterAttributeName(c);
        } else if(c === "=") {
            return beforeAttributeValue;
        } else if(c === "\u0000") {
            throw new Error('Parse error');
        } else if(c === "\"" || c === "'" || c === "<") {
            throw new Error('Parse error');
        } else {
            currentAttribute.name += c;
            return attributeName;
        }
    }

    function beforeAttributeValue(c) {
        if(c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
            return beforeAttributeValue;
        } else if(c === "\"") {
            return doubleQuotedAttributeValue;
        } else if(c === "\'") {
            return singleQuotedAttributeValue;
        } else if(c === ">") {
            //return data;
        } else {
            return unquotedAttributeValue(c);
        }
    }

    function doubleQuotedAttributeValue(c) {
        if(c === "\"") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            return  afterQuotedAttributeValue;
        } else if(c === "\u0000") {

        } else if(c === EOF) {

        } else {
            currentAttribute.value += c;
            return doubleQuotedAttributeValue;
        }
    }

    function singleQuotedAttributeValue(c) {
        if(c === "\'") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            return afterQuotedAttributeValue;
        } else if(c === "\u0000") {
            throw new Error('Parse error');
        } else if(c === EOF) {
            throw new Error('Parse error');
        } else {
            currentAttribute.value += c;
            return singleQuotedAttributeValue;
        }
    }

    function afterQuotedAttributeValue(c) {
        if(c.match(/^[\n\f\t ]$/)) {
            return beforeAttributeName;
        } else if(c === "/") {
            return selfClosingStartTag;
        } else if(c === ">") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            emit(currentToken);
            return data;
        } else if(c === EOF) {
            throw new Error('Parse error: eof-in-tag');
        } else {
            // currentAttribute.value += c;
            // return beforeAttributeValue;
            throw new Error('Parse error: missing-whitespace-between-attributes');
        }
    }

    function unquotedAttributeValue(c) {
        if(c.match(/^[\n\f\t ]$/)) {
            currentToken[currentAttribute.name] = currentAttribute.value;
            return beforeAttributeName;
        } else if(c === "/") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            return selfClosingStartTag;
        } else if(c === ">") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            emit(currentToken);
            return data;
        } else if(c === "\u0000") {
            throw new Error('Parse error');
        } else if(c === EOF) {
            throw new Error('Parse error');
        } else {
            currentAttribute.value += c;
            return unquotedAttributeValue;
        }
    }

    function afterAttributeName(c) {
        if (c.match(/^[\t\n\f ]$/)) {
            return afterAttributeName;
        } else if (c === '/') {
            return selfClosingStartTag;
        } else if (c === '=') {
            return beforeAttributeValue;
        } else if (c === '>') {
            currentToken[currentAttribute.name] = currentAttribute.value;
            emit(currentToken);
            return data;
        } else if (c === EOF) {
            throw new Error('Parse error');
        } else {
            currentToken[currentAttribute.name] = currentAttribute.value;
            currentAttribute = {
                name: '',
                value: '',
            };
            return attributeName(c);
        }
    }
    

    //自封闭标签开始关闭状态
    function selfClosingStartTag(c) {
        if(c === ">") {//此处只有”>“是有效的，切换到”初始状态“
            currentToken.isSelfClosing = true;
            return data;//注：此处应emit()，若不然自封闭标签<img/>读不出来；
            emit(currentToken);
        } else if(c === EOF) {//报错，处理异常逻辑

        } else {//报错，处理异常逻辑

        }
    }

    module.exports.parserHTML = function(html) {
        //html 标准中将初始状态称作 data ，故此处将 data 赋值；
        let state = data;
        for (let c of html) {
            //根据字符内容完成状态迁移
            state = state(c);
        }
        
        //因为HTML最后是有文件终结的，故在此使用 Symbol("EOF") 给定一个额外的、无效的字符，作为状态机的最后一个输入，强迫完成截止状态，表示文件终结；
        state = state(EOF);
    }
    ```

### （六）用token构建DOM树
1. 分析：
    - 上面处理的是词法分析，这里我们开始语法分析，这个与复杂的 JavaScript 的语法相比就非常简单，所以我们只需要用栈基于可以完成分析。但是如果我们要做一个完整的浏览器，只用栈肯定是不行的，因为浏览器是有容错性的，如果我们没有编写结束标签的话，浏览器是会去为我们补错机制的。
    - 从标签构建 DOM 树的基本技巧是使用栈；
    - 遇到开始标签时创建元素并入栈，遇到结束标签时出栈；
    - 自封闭节点可视为入栈后立刻出栈；
    - 任何元素的父元素是它入栈前的栈顶；
2. 代码实现：
    ```js
    //初始根节点的原因是为了最后栈空时，方便取出；
    let stack = [{type: "document", children: []}];

    //保证状态机创建完状态之后，在同一个出口输出；
    function emit(token) {
        //若是文本节点”text“则直接return忽略；
        if(token.type === "text") {
            return;
        }

        //每次emit()之后取出栈顶元素；
        let top = stack[stack.length - 1];

        //若是 startTag 执行入栈操作；
        if(token.type === "startTag") {
            //入栈的是由 token 的相关信息包装成的 element ("<tag></tag>”背后表示的抽象的东西称作 element；
            let element = {
                type: "element",
                children: [],
                attribute: []
            };

            element.tagName = token.tagName;

            //除 tagName && type 之外的属性其他的都放入 attribute 中；
            for (let iterator in token) {
                if(iterator !== "tagName" && iterator !== "type") {
                    element.attribute.push({
                        name: iterator,
                        value: token[iterator]
                    })
                }
            }

            //元素入栈前理清入栈的先后关系；
            top.children.push(element);
            element.parent = top;

            //若不是自封闭的标签，push进栈
            if(!token.isSelfClosing) {
                stack.push(element);
            }

            // currentTextNode = null;

        //若是 endTag ，根据情况执行出栈操作；
        } else if(token.type === "endTag") {
            if(top.tagName === token.tagName) {
                stack.pop()
            } else {
                throw new Error("Tag start end doesn't match!")
            }
        
            // currentTextNode = null;
        }
    }
    ```

### （七）将文本节点加到DOM树
1. 分析：HTML 解析的最后一步，把文本节点合并后加入 DOM 树里面。
    - 文本节点与自封闭标签处理类似
    - 多个文本节点需要合并
2. 代码实现：
    ```js
    function emit(token) {

        //每次emit()之后取出栈顶元素；
        let top = stack[stack.length - 1];

        //若是 startTag 执行入栈操作；
        if(token.type === "startTag") {
            //入栈的是由 token 的相关信息包装成的 element ("<tag></tag>”背后表示的抽象的东西称作 element；
            let element = {
                type: "element",
                children: [],
                attribute: []
            };

            element.tagName = token.tagName;

            //除 tagName && type 之外的属性其他的都放入 attribute 中；
            for (let iterator in token) {
                if(iterator !== "tagName" && iterator !== "type") {
                    element.attribute.push({
                        name: iterator,
                        value: token[iterator]
                    })
                }
            }

            //元素入栈前理清入栈的先后关系；
            top.children.push(element);
            element.parent = top;

            //若不是自封闭的标签，push进栈
            if(!token.isSelfClosing) {
                stack.push(element);
            }

            //开始标签、结束标签时，清空文本节点
            currentTextNode = null;

        //若是 endTag ，根据情况执行出栈操作；
        } else if(token.type === "endTag") {
            if(top.tagName === token.tagName) {
                stack.pop()
            } else {
                throw new Error("Tag start end doesn't match!")
            }

            //开始标签、结束标签时，清空文本节点
            currentTextNode = null;

        //若是文本节点”text“，不入栈但是要存在相应栈顶元素的 children 中；
        } else if(token.type === "text") {
            if(currentTextNode === null) {
                currentTextNode = {
                    type: "text",
                    content: ""
                };
                top.children.push(currentTextNode);
            }
            currentTextNode.content += token.content;
        }
    }

    module.exports.parserHTML = function(html) {
        //html 标准中将初始状态称作 data ，故此处将 data 赋值；
        let state = data;
        for (let c of html) {
            //根据字符内容完成状态迁移
            state = state(c);
        }
        
        //因为HTML最后是有文件终结的，故在此使用 Symbol("EOF") 给定一个额外的、无效的字符，作为状态机的最后一个输入，强迫完成截止状态，表示文件终结；
        state = state(EOF);
        return stack[0];
    }
    ```

## 五、CSS计算
- **URL -- HTTP请求 --> HTML -- parse --> DOM树** -- css computing --> DOM&css -- layout --> DOM&position -- render --> Bitmap;
- 之前，完成了 HTTP 请求；
- 通过获得的报文，获得需求信息 HTML；
- 通过 HTML 内容解析，构建我们的 DOM 树；
    - 此时 DOM 树中只有 HTML 的标签信息，没有 css 样式信息；
- 接下来就是 CSS 计算 (CSS Computing)；
- 如果我们需要做 CSS 计算，我们就需要对 CSS 的语法与词法进行分析。然后这个过程如果是手动来实现的话，是需要较多的编译原理基础知识的，但是这些编译基础知识的深度对我们知识想了解浏览器工作原理并不是重点。所以这里我们就偷个懒，直接用 npm 上的一个css现成包即可；
- 其实这个 css 包，就是一个 CSS parser，可以帮助我们完成 CSS 代码转译成 AST 抽象语法树。 我们所要做的就是根据这棵抽象语法树抽出各种 CSS 规则，并且把他们运用到我们的 HTML 元素上；
那么我们第一步就是先拿到 CSS 的规则，所以叫做 “收集 CSS 规则”；
### （一）收集css规则
1. 遇到 style 标签时，我们把 CSS 规则保存起来
    - 我们在 tagName === 'endTag' 的判断中，判断当前标签是否是 style 标签；
        - 如果是，我们就可以获取 style 标签里面所有的内容进行 CSS 分析；
        - 这里加入一个 addCSSRule(top.children[0].content)的函数；
            - top 就是当前元素，children[0] 就是 text 元素，而 .content 就是所有的 CSS 规则文本；
    - 注意，我们忽略了在实际情况中还有 link 标签引入 CSS 文件的情况。但是这个过程涉及到多层异步请求和 HTML 解析的过程，为了简化代码的复杂度，不实现这种情况。实际的浏览器是会比我们做的虚拟浏览器复杂的多。
    > 文件：parser.js 中的 emit() 函数
    ```js
    function emit(token) {

        //每次emit()之后取出栈顶元素；
        let top = stack[stack.length - 1];

        //若是 startTag 执行入栈操作；
        if(token.type === "startTag") {
            //入栈的是由 token 的相关信息包装成的 element ("<tag></tag>”背后表示的抽象的东西称作 element；
            let element = {
                type: "element",
                children: [],
                attribute: []
            };

            element.tagName = token.tagName;

            //除 tagName && type 之外的属性其他的都放入 attribute 中；
            for (let iterator in token) {
                if(iterator !== "tagName" && iterator !== "type") {
                    element.attribute.push({
                        name: iterator,
                        value: token[iterator]
                    })
                }
            }

            //元素入栈前理清入栈的先后关系；
            top.children.push(element);
            element.parent = top;

            //若不是自封闭的标签，push进栈
            if(!token.isSelfClosing) {
                stack.push(element);
            }

            //开始标签、结束标签时，清空文本节点
            currentTextNode = null;

        //若是 endTag ，根据情况执行出栈操作；
        } else if(token.type === "endTag") {
            if(top.tagName === token.tagName) {
                //++++++遇到style标签时，执行添加css规则的操作++++++//
                if(top.tagName === "style") {
                    addCSSRules(top.children[0].content);
                }
                stack.pop()
            } else {
                throw new Error("Tag start end doesn't match!")
            }

            //开始标签、结束标签时，清空文本节点
            currentTextNode = null;

        //若是文本节点”text“，不入栈但是要存在相应栈顶元素的 children 中；
        } else if(token.type === "text") {
            if(currentTextNode === null) {
                currentTextNode = {
                    type: "text",
                    content: ""
                };
                top.children.push(currentTextNode);
            }
            currentTextNode.content += token.content;
        }
    }
    ```
2. 调用 CSS Parser 来分析 CSS 规则
    - 首先要通过 node 引入 css 包;
    - 然后调用 css.parse(text) 获得 AST 抽象语法树;
    - 最后通过使用 ... 的特性展开了 ast.stylesheet.rules 中的所有对象，并且加入到 rules 里面;
    > 文件：parser.js 中加入 addCSSRule() 函数
    ```js
    const css = require("css");
    let rules = [];

    function addCSSRules(text) {
        var ast = css.parse(text);
        console.log(JSON.stringify(ast, null, "   "));
        rules.push(...ast.stylesheet.rules);
    }
    ```
3. 最终 AST 输出的结果
    - type 类型是 stylesheet 样式表;
    - 然后在 stylesheet 中有 rules 的 CSS 规则数组;
    - rules 数组中就有一个 declarations 数组，这里面就是我们 CSS 样式的信息了;
    - 拿第一个 declarations 来说明，他的属性为 width， 属性值为 100px，这些就是我们需要的 CSS 规则了;
    - 注：像 body div #myId 这种带有空格的标签选择器，是不会逐个单独分析出来的，所以这种是需要在后面自己逐个分解分析。除非是 , 逗号分隔的选择器才会被拆解成多个 declarations。
    ```json
    {
        "type": "stylesheet",
        "stylesheet": {
            "rules": [
                {
                    "type": "rule",
                    "selectors": [
                    "body div #parserId"
                    ],
                    "declarations": [
                    {
                        "type": "declaration",
                        "property": "width",
                        "value": "100px",
                        "position": {
                            "start": {
                                "line": 3,
                                "column": 13
                            },
                            "end": {
                                "line": 3,
                                "column": 25
                            }
                        }
                    },
                    {
                        "type": "declaration",
                        "property": "background-color",
                        "value": "blue",
                        "position": {
                            "start": {
                                "line": 4,
                                "column": 13
                            },
                            "end": {
                                "line": 4,
                                "column": 34
                            }
                        }
                    }
                    ],
                    "position": {
                    "start": {
                        "line": 2,
                        "column": 9
                    },
                    "end": {
                        "line": 5,
                        "column": 10
                    }
                    }
                },
                {
                    "type": "rule",
                    "selectors": [
                    "body div img"
                    ],
                    "declarations": [
                    {
                        "type": "declaration",
                        "property": "widows",
                        "value": "30px",
                        "position": {
                            "start": {
                                "line": 7,
                                "column": 13
                            },
                            "end": {
                                "line": 7,
                                "column": 25
                            }
                        }
                    },
                    {
                        "type": "declaration",
                        "property": "background-color",
                        "value": "brown",
                        "position": {
                            "start": {
                                "line": 8,
                                "column": 13
                            },
                            "end": {
                                "line": 8,
                                "column": 36
                            }
                        }
                    }
                    ],
                    "position": {
                    "start": {
                        "line": 6,
                        "column": 9
                    },
                    "end": {
                        "line": 9,
                        "column": 10
                    }
                    }
                }
            ],
            "parsingErrors": []
        }
    }
    ```

### （二）添加调用函数
1. 上一步收集好了 CSS 规则，这一步要找一个合适的时机把这些规则应用上。
    -应用的时机肯定是越早越好，CSS 设计里面有一个潜规则，就是 CSS 设计会尽量保证所有的选择器都能够在 startTag 进入的时候就能被判断。
    - 当然，我们后面又加了一些高级的选择器之后，这个规则有了一定的松动，但是大部分的规则仍然是去遵循这个规则的，当我们 DOM 树构建到元素的 startTag 的步骤，就已经可以判断出来它能匹配那些 CSS 规则了;
2. 当创建一个元素后，立即计算CSS
    - 理论上，当我们分析一个元素时，所有的 CSS 规则已经被收集完毕；
        - 所有 head 内的元素无法计算其 css ，在真实浏览器中，还是有必要实现的；
        - 故，假设head 内的所有东西默认不会显示，最外层的 HTML 元素夜魔人不会添加样式；
    - 可能遇到写在 body 的 style 标签，需要重新 CSS 计算的情况，这里也忽略；
> 文件：parser.js 的 emit() 函数加入 computeCSS() 函数调用
```js
function emit(token) {
    //…………
    if(token.type === "startTag") {
        //入栈的是由 token 的相关信息包装成的 element ("<tag></tag>”背后表示的抽象的东西称作 element；
        let element = {
            type: "element",
            children: [],
            attribute: []
        };

        element.tagName = token.tagName;

        //除 tagName && type 之外的属性其他的都放入 attribute 中；
        for (let iterator in token) {
            if(iterator !== "tagName" && iterator !== "type") {
                element.attribute.push({
                    name: iterator,
                    value: token[iterator]
                })
            }
        }

        //++++++计算时机：元素构建好之后直接开始 CSS 计算++++++//
        computeCSS(element);

        //元素入栈前理清入栈的先后关系；
        top.children.push(element);
        element.parent = top;

        //若不是自封闭的标签，push进栈
        if(!token.isSelfClosing) {
            stack.push(element);
        }

        //开始标签、结束标签时，清空文本节点
        currentTextNode = null;
    } else if(token.type === "endTag") {
        //………………
    } else if(token.type === "text") {
        //………………
    }
}
```
> 文件：parser.js 中加入 computeCSS() 函数
```js
//++++++对元素进行 CSS 计算++++++//
function computeCSS(element) {
    //根据 rules 和 element 的内容，可以将 rules 中的 css 样式内容应用到 element 上；
    console.log(rules);
    console.log("compute css for element", element);
}
```

### （三）获取父元素序列
1. 分析：
    - 因为选择器大多数都是跟元素的父元素相关的，所以需要先获取父元素序列；
    - 在 computeCSS 函数中，我们必须知道元素的所有父级元素才能判断元素与规则是否匹配；
    - 我们从上一步骤的 stack，可以获取本元素的父元素；
    - 因为我们首先获取的是 “当前元素”，所以我们获得和计算父元素匹配的顺序是从内向外；
    - 因为栈里面的元素是会不断的变化的，所以后期元素会在栈中发生变化，就会可能被污染，所以这里用 slice() 不传参数，默认复制这个数组；
    - 然后用 reverse() 把元素的顺序倒过来，为什么我们需要颠倒元素的顺序呢？是因为我们的标签匹配是会从当前元素开始逐级的往外匹配（也就是一级一级往父级元素去匹配的）；
2. 添加代码：
> 文件：parser.js 中的 computeCSS() 函数
```js
//++++++对元素进行 CSS 计算++++++//
function computeCSS(element) {
    var element = stack.slice().reverse();
}
```

### （四）选择器与元素匹配
1. 补充知识：首先了解下选择器的机构，选择器其实有一个层级结构：
    - 最外层叫选择器列表，这个我们的 CSS parser 已经帮我们做了拆分；
    - 选择器列表里面的，叫做复杂选择器，这个是由空格分隔了我们的复合选择器；
    - 复杂选择器是根据亲代关系，去选择元素的；
    - 复合选择器，是针对一个元素的本身的属性和特征的判断；
    - 而复合原则性选择器，它又是由紧连着的一对选择器而构成的；
    - 在我们的模拟浏览器中，我们假设一个复杂选择器中只包含简单选择器；
    - 所以拆分选择器时，只需根据空格拆分就可以；
2. 分析
    - 选择器也要从当前元素向外排列
    - 复杂选择器拆成对单个元素的选择器，用循环匹配父级元素队列
3. 代码：
```js
//待写
function match(element, selector) {
    return false;
}

//对元素进行 CSS 计算
function computeCSS(element) {
    var elements = stack.slice().reverse();

    //++++++添加 computedStyle 属性，保存 css 设置的属性++++++//
    if(!element.computedStyle) {
        element.computedStyle = {}
    };

    //++++这里循环 CSS 规则，让规则与元素匹配++++//
    // 1.  如果当前选择器匹配不中当前元素直接 continue
    // 2. 当前元素匹配中了，就一直往外寻找父级元素找到能匹配上选择器的元素
    // 3. 最后检验匹配中的元素是否等于选择器的总数，是就是全部匹配了，不是就是不匹配
    for(let rule of rules) {
        //++++++根据 css parser 的内容，将 rule 中的 selectors (选择器)取出，分割成数组，并反转++++++//
        var selectorParts = rule.selectors[0].split(" ").reverse();

        if(!match(element, selectorParts[0])) {
            continue;
        };

        let matched = false;

        var j = 1;
        for (let i = 0; i < elements.length; i++) {
            if(match(elements[i], selectorParts[j])) {
                j ++;
            }
        }

        if(j >= selectorParts.length) {
            matched = true;
        }

        if(matched) {
            console.log("element:", element, "matched rule:", rule);
        }
    }
}
```

### （五）计算选择器与元素匹配
1. 分析：没有完成 match 匹配函数的实现，那这一部分实现元素与选择器的匹配逻辑。
    - 根据选择器的类型和元素属性，计算是否与当前元素匹配；
    - 这里仅仅实现了三种基本选择器（.class #id div），实际的浏览器中要处理复合选择器；
2. 代码：
```js
//匹配元素和选择器
function match(element, selector) {
    if(!selector || !element.attribute) {
        return false;
    }

    if(selector.charAt(0) === "#") {
        var attr = element.attribute.filter(attr => attr.name === "id")[0];
        if(attr && attr.value === selector.replace('#', '')) {
            return true;
        }
    } else if(selector.charAt(0) === ".") {
        var attr = element.attribute.filter(attr => attr.name === "class")[0];
        if(attr && attr.value === selector.replace('.', '')) {
            return true;
        }
    } else {
        if (element.tagName === selector) {
            return true;
        }
    }

    return false;
}
```

### （六）生成computed属性
1. 分析：生成 computed 属性，只需要把 declarations 里面声明的属性加到元素的 computed 上就可以了。
    - 一旦选择器匹配中了，就把选择器中的属性应用到元素上；
    - 然后形成 computedStyle；
    - 此时， HTML 中的 img 标签会被两个 CSS 选择器匹配中，分别是 body div #myId 和 body div img。这样就会导致前面匹配中后加入 computedStyle 的属性值会被后面匹配中的属性值所覆盖。但是根据 CSS 中的权重规则，ID选择器是高于标签选择器的。这个问题我们下一部分会解决掉。
2. 代码：
> parser.js > computeCSS > for(let rule of rules) {} > if(matched) {}
```js
if(matched) {
    var computedStyle = element.computedStyle;
    for (const declaration of rule.declarations) {
        if(!computedStyle[declaration.property]) {
            computedStyle[declaration.property] = {};
            computedStyle[declaration.property].value = declaration.value;
        }
    }
    console.log("element呀:", element.computedStyle);
    console.log("matched rule:", rule);
}
```

### （七）specificity计算逻辑
1. specification 是什么？
* 针对 computedStyle 覆盖问题，在 CSS 里面有一个 specification 的规定。
    - specification 翻译成中文，很多时候都会被翻译成“优先级”，当然在理论上是对的，但是在英文中，优先级是 priority，所以 specificity 是“专指程度”；
    - 放在 CSS 中理解是，ID 选择器中的专指度是会比 CLASS 选择器的高，所以 CSS 中的 ID 的属性会覆盖 CLASS 的属性；
* 那么 specification 是什么呢？
    - 首先 specification 会有四个元素；
    - 按照 CSS 中优先级的顺序来说   就是 inlineStyle > id > class > tag；
    - 所以把这个生成为 specificity 就是 [     0     , 0  ,   0   ,  0];
    - inlineStyle：所有写在行内 style 属性中的元素都为 inlineStyle ;
    - 数组里面每一个数字都是代表在样式表中出现的次数
* 下面我们用一些例子来分析一下，我们应该如何用 specificity 来分辨优先级的：
    > **A组选择器**
    > A 选择器            ：div div #id
    > A 的 specification ：[0, 1, 0, 2]
    > - id 出现了一次，所以第二位数字是 1
    > - div tag 出现了两次，所以第四位数是 2
    >
    > **B组选择器**
    > B 选择器            ：div #my #id
    > B 的 specification ：[0, 2, 0, 1]
    >
    > - id 出现了两次，所以第二位数字是 2
    > - div tag 出现了一次，所以第四位数是 1
* 那么我们怎么去比较上面的两种选择器，那个更大呢？
    - 需要从左到右开始比对；
    - 遇到同位置的数值一样的，就可以直接跳过；
    - 直到找到一对数值是有不一样的，这个时候就看是哪个选择器中的数值更大，那个选择器的优先级就更高；
    - 只要有一对比对出大小后，后面的就不需要再比对了。
    > 用上面 A 和 B 两种选择器来做对比的话，第一对两个都是 0，所以可以直接跳过;
    > 然后第二位数值对，A选择器是 1，B选择器是 2，很明显 B 要比 A 大，所以 B 选择器中的属性就要覆盖 A 的;
2. 分析实现代码逻辑：
    - CSS 规则根据 specificity 和后来优先规则覆盖；
    - specificity 是个四元组，越左边权重越高；
    - 一个 CSS 规则的 specificity 根据包含的简单选择器相加而成；
3. 代码实现：
> 文件：parser.js 中添加一个 specificity 函数，来计算一个选择器的 specificity
```js
/**
 * 创造 specificity
 * @param {*} selector 
 */
function specificity(selector) {
    var p = [0, 0, 0, 0];
    var selectorParts = selector.split(" ");
    for (var part of selectorParts) {
        if(part.charAt(0) === "#") {
            p[1] += 1;
        } else if(part.charAt(0) === ".") {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}
```
> 文件：parser.js 添加一个 compare 函数，来对比两个选择器的 specificity
```js
/**
 * sp1:旧的
 * sp2:新的
 * **/
function compare(sp1, sp2) {
    if(sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0];
    };
    if(sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1];
    };
    if(sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2];
    };
    return sp1[3] - sp2[3];
}
```
> 文件：parser.js > computeCSS > for(let rule of rules) {} > if(matched) {}中修改匹配中元素后的属性赋值逻辑
```js
if(matched) {
    var sp = specificity(rule.selectors[0]);
    var computedStyle = element.computedStyle;
    for (const declaration of rule.declarations) {
        if(!computedStyle[declaration.property]) {
            computedStyle[declaration.property] = {};
        }
        if(!computedStyle[declaration.property].specificity) {
            computedStyle[declaration.property].value = declaration.value;
            computedStyle[declaration.property].specificity = sp;
        } else if(compare(computedStyle[declaration.property].specificity, sp) < 0) {
            //若旧的 - 新的 < 0，则让新的 value 、sp 覆盖；
            computedStyle[declaration.property].value = declaration.value;
            computedStyle[declaration.property].specificity = sp;
        }
    }
    // console.log("element呀:", element.computedStyle);
    // console.log("matched rule:", rule);
}
```
4. 在 client.js 解决“循环引用”问题
> client.js > void async function 
```js
var CircularJSON = require('circular-json');
//…………
void async function () {
    //…………
    let dom = parser.parserHTML(response.body);
    console.log("dom", CircularJSON.stringify(dom, null, 4));
}();
```
5. 在 client.js 打印出含有 css 的 dom 树
```json
{
    "type": "document",
    "children": [
        {
            "type": "element",
            "children": [
                {
                    "type": "text",
                    "content": "\n"
                },
                {
                    "type": "element",
                    "children": [
                        {
                            "type": "text",
                            "content": "\n    "
                        },
                        {
                            "type": "element",
                            "children": [
                                {
                                    "type": "text",
                                    "content": "Document"
                                }
                            ],
                            "attribute": [],
                            "tagName": "title",
                            "computedStyle": {},
                            "parent": "~children~0~children~1"
                        },
                        {
                            "type": "text",
                            "content": "\n    "
                        },
                        {
                            "type": "element",
                            "children": [
                                {
                                    "type": "text",
                                    "content": "\n        body div #parserId{\n            width: 100px;\n            background-color:blue;\n        }\n        body div img{\n            width: 30px;\n            background-color: brown;\n        }\n    "
                                }
                            ],
                            "attribute": [],
                            "tagName": "style",
                            "computedStyle": {},
                            "parent": "~children~0~children~1"
                        },
                        {
                            "type": "text",
                            "content": "\n"
                        }
                    ],
                    "attribute": [],
                    "tagName": "head",
                    "computedStyle": {},
                    "parent": "~children~0"
                },
                {
                    "type": "text",
                    "content": "\n"
                },
                {
                    "type": "element",
                    "children": [
                        {
                            "type": "text",
                            "content": "\n    "
                        },
                        {
                            "type": "element",
                            "children": [
                                {
                                    "type": "text",
                                    "content": "\n        "
                                },
                                {
                                    "type": "element",
                                    "children": [],
                                    "attribute": [
                                        {
                                            "name": "id",
                                            "value": "parserId"
                                        },
                                        {
                                            "name": "isSelfClosing",
                                            "value": true
                                        }
                                    ],
                                    "tagName": "img",
                                    "computedStyle": {
                                        "width": {
                                            "value": "100px",
                                            "specificity": [
                                                0,
                                                1,
                                                0,
                                                2
                                            ]
                                        },
                                        "background-color": {
                                            "value": "blue",
                                            "specificity": "~children~0~children~3~children~1~children~1~computedStyle~width~specificity"
                                        }
                                    },
                                    "parent": "~children~0~children~3~children~1"
                                },
                                {
                                    "type": "text",
                                    "content": "\n        "
                                },
                                {
                                    "type": "element",
                                    "children": [],
                                    "attribute": [
                                        {
                                            "name": "isSelfClosing",
                                            "value": true
                                        }
                                    ],
                                    "tagName": "img",
                                    "computedStyle": {
                                        "width": {
                                            "value": "30px",
                                            "specificity": [
                                                0,
                                                0,
                                                0,
                                                3
                                            ]
                                        },
                                        "background-color": {
                                            "value": "brown",
                                            "specificity": "~children~0~children~3~children~1~children~3~computedStyle~width~specificity"
                                        }
                                    },
                                    "parent": "~children~0~children~3~children~1"
                                },
                                {
                                    "type": "text",
                                    "content": "\n    "
                                }
                            ],
                            "attribute": [],
                            "tagName": "div",
                            "computedStyle": {},
                            "parent": "~children~0~children~3"
                        },
                        {
                            "type": "text",
                            "content": "\n"
                        }
                    ],
                    "attribute": [],
                    "tagName": "body",
                    "computedStyle": {},
                    "parent": "~children~0"
                },
                {
                    "type": "text",
                    "content": "\n"
                }
            ],
            "attribute": [
                {
                    "name": "lang",
                    "value": "en"
                }
            ],
            "tagName": "html",
            "computedStyle": {},
            "parent": "~"
        },
        {
            "type": "text",
            "content": "\r\n"
        }
    ]
}
```

# 浏览器的工作原理（三）
## 六、排版
## 七、渲染