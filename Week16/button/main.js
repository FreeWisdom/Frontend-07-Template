import { Button } from './Button.js';
// 必须添加，否则 jsx 转换后无法调用到 createElement 方法
import { createElement } from './framework';

let a = <Button>Content</Button>;

a.mountTo(document.body);
