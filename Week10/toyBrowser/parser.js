const css = require("css");
const layout = require("./layout.js");

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

//初始根节点的原因是为了最后栈空时，方便取出；
let stack = [{type: "document", children: []}];

let rules = [];

function addCSSRules(text) {
    var ast = css.parse(text);
    // console.log(JSON.stringify(ast, null, 4));
    rules.push(...ast.stylesheet.rules);
}

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
    }

    // let inlineStyle = element.attribute.filter(p => p.name == "style");
    // css.parse("* {" + inlineStyle + "}");
    // sp = [1, 0, 0, 0];
    // for(...) { ... }
}


//保证状态机创建完状态之后，在同一个出口输出；
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

        //++++++元素构建好之后直接开始 CSS 计算++++++//
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

    //若是 endTag ，根据情况执行出栈操作；
    } else if(token.type === "endTag") {
        if(top.tagName === token.tagName) {
            //遇到style标签时，执行添加css规则的操作//
            if(top.tagName === "style") {
                addCSSRules(top.children[0].content);
            }
            // console.log("top:", top);
            layout(top);
            stack.pop();
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
            type: "text",
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
        throw new Error('Parse error');
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
        throw new Error('Parse error: missing-whitespace-between-attribute');
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
        //注：此处应emit()，若不然自封闭标签<img/>读不出来；
        emit(currentToken);
        return data;
    } else if(c === EOF) {//报错，处理异常逻辑
        throw new Error('Parse error');
    } else {//报错，处理异常逻辑
        throw new Error('Parse error');
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