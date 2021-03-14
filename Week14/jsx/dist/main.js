/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/***/ (() => {

eval("function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction createElement(type, attributes) {\n  var element;\n\n  if (typeof type === \"string\") {\n    //若是字符串，创建相应元素\n    //用 ElementWrapper 达到 HTML 普通元素与自定义 jsx 标签的接口兼容（兼容 mountTo() ）\n    element = new ElementWrapper(type);\n  } else {\n    //若不是字符串，创建相应实例\n    element = new type();\n  } //为元素增加属性 对象用for in\n\n\n  for (var attribute in attributes) {\n    element.setAttribute(attribute, attributes[attribute]);\n  } //为元素增加子节点 数组用for of\n\n\n  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n    children[_key - 2] = arguments[_key];\n  }\n\n  for (var _i = 0, _children = children; _i < _children.length; _i++) {\n    var child = _children[_i];\n\n    //若child为文本，则将child转化成文本节点\n    if (typeof child === \"string\") {\n      child = new TextWrapper(child);\n    }\n\n    element.appendChild(child);\n  }\n\n  return element;\n}\n\nvar Div = /*#__PURE__*/function () {\n  //初始化类，依据 div 元素，创建类的根 DOM\n  function Div() {\n    _classCallCheck(this, Div);\n\n    this.root = document.createElement(\"div\");\n  } //为 DOM 添加属性\n\n\n  _createClass(Div, [{\n    key: \"setAttribute\",\n    value: function setAttribute(name, value) {\n      this.root.setAttribute(name, value);\n    } //为 DOM 添加子元素\n\n  }, {\n    key: \"appendChild\",\n    value: function appendChild(child) {\n      console.log(this.root, child); // 由于所有的正常 HTML 元素都变成 ElementWrapper，故此处 child 不是正常的 HTML 元素，不能被 appendChild ；\n      // this.root.appendChild(child);\n      // 需要利用 ElementWrapper 的 mountTo 方法完成 DOM 的子元素添加；\n\n      child.mountTo(this.root);\n    } //往 body 挂载当前 DOM\n\n  }, {\n    key: \"mountTo\",\n    value: function mountTo(parent) {\n      parent.appendChild(this.root);\n    }\n  }]);\n\n  return Div;\n}();\n\nvar ElementWrapper = /*#__PURE__*/function () {\n  function ElementWrapper(type) {\n    _classCallCheck(this, ElementWrapper);\n\n    this.root = document.createElement(type);\n  }\n\n  _createClass(ElementWrapper, [{\n    key: \"setAttribute\",\n    value: function setAttribute(name, value) {\n      this.root.setAttribute(name, value);\n    }\n  }, {\n    key: \"appendChild\",\n    value: function appendChild(child) {\n      console.log(\"child\", child); // this.root.appendChild(child);\n      // 同上\n\n      child.mountTo(this.root);\n    }\n  }, {\n    key: \"mountTo\",\n    value: function mountTo(parent) {\n      parent.appendChild(this.root);\n    }\n  }]);\n\n  return ElementWrapper;\n}();\n\nvar TextWrapper = /*#__PURE__*/function () {\n  function TextWrapper(content) {\n    _classCallCheck(this, TextWrapper);\n\n    this.root = document.createTextNode(content);\n  }\n\n  _createClass(TextWrapper, [{\n    key: \"setAttribute\",\n    value: function setAttribute(name, value) {\n      this.root.setAttribute(name, value);\n    }\n  }, {\n    key: \"appendChild\",\n    value: function appendChild(child) {\n      child.mountTo(this.root);\n    }\n  }, {\n    key: \"mountTo\",\n    value: function mountTo(parent) {\n      parent.appendChild(this.root);\n    }\n  }]);\n\n  return TextWrapper;\n}();\n\nvar a = createElement(Div, {\n  id: \"a\"\n}, createElement(\"span\", null, \"hey\"), createElement(\"span\", null, \"zhz\"), createElement(\"span\", null, \"dan\"));\nvar photos = [\"https://images.unsplash.com/photo-1603389865219-669a0768193e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80\", \"https://images.unsplash.com/photo-1615058338328-f81366d78111?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDUwfEZ6bzN6dU9ITjZ3fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60\", \"https://images.unsplash.com/photo-1577462282244-b58c2816d686?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDM3NnxGem8zenVPSE42d3x8ZW58MHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60\", \"https://images.unsplash.com/photo-1531264993164-04a70aa46453?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDQ2N3xGem8zenVPSE42d3x8ZW58MHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60\"]; // document.body.appendChild(a);\n\na.mountTo(document.body);\n\n//# sourceURL=webpack://jsx/./main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./main.js"]();
/******/ 	
/******/ })()
;