export class Component {
    constructor() {

    }
    //为 DOM 添加属性
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }
    //为 DOM 添加子元素
    appendChild(child) {
        console.log(this.root, child)
        // 由于所有的正常 HTML 元素都变成 ElementWrapper，故此处 child 不是正常的 HTML 元素，不能被 appendChild ；
        // this.root.appendChild(child);
        // 需要利用 ElementWrapper 的 mountTo 方法完成 DOM 的子元素添加；
        child.mountTo(this.root);
    }
    //往 body 挂载当前 DOM
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

class ElementWrapper extends Component {
    constructor(type) {
        this.root = document.createElement(type);
    }
}

class TextWrapper extends Component {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
}

export function createElement(type, attributes, ...children) {
    let element;
    if(typeof type === "string") {
        //若是字符串，创建相应元素
        //用 ElementWrapper 达到 HTML 普通元素与自定义 jsx 标签的接口兼容（兼容 mountTo() ）
        element = new ElementWrapper(type);
    } else {
        //若不是字符串，创建相应实例
        element = new type;
    }
    //为元素增加属性 对象用for in
    for (const attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute]);
    }
    //为元素增加子节点 数组用for of
    for (const child of children) {
        //若child为文本，则将child转化成文本节点
        if(typeof child === "string") {
            child = new TextWrapper(child);
        }
        element.appendChild(child);
    }
    return element;
}

