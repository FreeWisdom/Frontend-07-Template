# 二、工具链—单元测试工具

​		所谓"测试框架"，就是运行测试的工具。通过它，可以为JavaScript应用添加测试，从而保证代码的质量。

## 1、mocha的使用

全局安装:

```bash
$ npm install --global mocha
```

新建“test-demo文件夹”，安装项目的开发环境依赖：

```shell
$ cd test-demo
$ npm install
$ npm install --save-dev mocha
```

“test-demo文件夹”下新建“test文件夹”；

“test-demo文件夹”下新建[`add.js`](https://github.com/FreeWisdom/Frontend-07-Template/tree/main/Week18/test-demo/add.js):

```js
function add(a, b) {
    return a + b;
}
module.exports = add;
```

“test文件夹”下新建[`test.js`](https://github.com/FreeWisdom/Frontend-07-Template/tree/main/Week18/test-demo/test/test.js):

```js
var assert = require('assert');
var add = require('./add.js');

// describe块称为"测试套件"（test suite），表示一组相关的测试。它是一个函数，第一个参数是测试套件的名称（"加法函数的测试"），第二个参数是一个实际执行的函数。
describe('add function testing.', function () {
  
  	// it块称为"测试用例"（test case），表示一个单独的测试，是测试的最小单位。它也是一个函数，第一个参数是测试用例的名称（"1 加 1 应该等于 2"），第二个参数是一个实际执行的函数。
    it('1 + 2 shuld be 3', function () {
        assert.equal(add(1, 2), 3);
    });
    it('5 + 9 shuld be 14', function () {
        assert.equal(add(5, 9), 14);
    });
});
```

上面这段代码，就是测试脚本，它可以独立执行。测试脚本里面应该包括一个或多个`describe`块，每个`describe`块应该包括一个或多个`it`块。

进入[`test`](https://github.com/FreeWisdom/Frontend-07-Template/tree/main/Week18/test-demo/test)文件夹，执行以下命令运行测试:

```bash
$ cd test
$ mocha test.js
> test-demo@1.0.0 test ··/··/test-demo
> mocha
  add function testing.
    ✓ 1 + 2 shuld be 3
    ✓ 5 + 9 shuld be 14
  2 passing (9ms)
```

## 2、ES6测试

如果测试脚本是用ES6写的，那么运行测试之前，需要先用Babel转码。

进入[`test`](https://github.com/FreeWisdom/Frontend-07-Template/tree/main/Week18/test-demo/test)目录，打开[`test/test.js`](https://github.com/FreeWisdom/Frontend-07-Template/tree/main/Week18/test-demo/test/test.js)文件，可以看到这个测试用例是用ES6写的。

```js
import { equal } from 'assert';
import add from '../add.js';

describe('add function testing.', function () {
    it('1 + 2 shuld be 3', function () {
        equal(add(1, 2), 3);
    });
    it('5 + 9 shuld be 14', function () {
        equal(add(5, 9), 14);
    });
});

describe('add function testing.', function () {
    it('3 + 4 shuld be 7', function () {
        equal(add(3, 4), 7);
    });
    it('7 + 8 shuld be 15', function () {
        equal(add(7, 8), 15);
    });
});
```

ES6转码，需要安装Babel。

```shell
$ npm install --save-dev @babel/core @babel/register @babel/preset-env
```

在项目目录下面，新建一个[`.babelrc`](https://github.com/FreeWisdom/Frontend-07-Template/tree/main/Week18/test-demo/.babelrc)配置文件。

**注：“presets”一定要加“s”，不然会出现“会出先`Error: Unknown option: .preset`这个错误”**

```json
{
    "presets": ["@babel/preset-env"]
}
```

Mocha默认只执行`test`子目录下面第一层的测试用例，不会执行更下层的用例。为了改变这种行为，就必须**加上`--recursive`参数，这时`test`子目录下面所有的测试用例不管在哪一层都会执行**。

**Mocha默认运行`test`子目录里面的测试脚本**。所以，一般都会把测试脚本放在`test`目录里面，然后执行`mocha`就不需要参数了。

```shell
$ cd test-demo
$ ./node_modules/.bin/mocha --require @babel/register
```

为了使每次test时，在命令行输入减少工作量，在`package.json`文件夹中修改`script:{}`如下：

```json
"scripts": {
  "test": "mocha --require @babel/register"
},
```

如此，命令行中输入如下即可

```shell
$ cd test-demo
$ npm run test
> test-demo@1.0.0 test ../../test-demo
> mocha --recursive --require @babel/register
  add function testing.
    ✓ 1 + 2 shuld be 3
    ✓ 5 + 9 shuld be 14
  add function testing.
    ✓ 3 + 4 shuld be 7
    ✓ 7 + 8 shuld be 15
  4 passing (37ms)
```

## 3、Istanbul/nyc 实现 code coverage

Istanbul 使用行计数器来设置 ES5和 ES2015 + JavaScript 代码，这样可以跟踪单元测试对代码库的执行情况。用于 Istanbul 的 nyc 命令行客户端可以很好地与大多数 JavaScript 测试框架协同工作: tap、 mocha、 AVA 等等。

为了可以测试覆盖范围，安装nyc。

```shell
$ npm install -save-dev nyc
```

nyc 在 babel 中无法使用，故使用 @istanbuljs/nyc-config-babel 和 babel-plugin-istanbul 为 babel 支持的测试覆盖项目提供便捷的默认配置。安装依赖项:

```shell
$ npm i babel-plugin-istanbul @istanbuljs/nyc-config-babel --save-dev
```

在`.babelrc`中加上`istanbul`插件：

```json
{
    "presets": ["@babel/preset-env"],
    "plugins": ["istanbul"]
}
```

test-demo根目录下新建`.nycrc`文件，如下：

```json
{
    "extends": "@istanbuljs/nyc-config-babel"
}
```

在 package.json 中设置测试脚本，如下所示:

```json
"scripts": {
    "test": "mocha --require @babel/register",
    "coverage": "nyc mocha"
},
```

在命令行输入如下，即完成✅ coverage

```shell
$ npm run coverage 
> test-demo@1.0.0 coverage /Users/../../test-demo
> nyc mocha
  add function testing.
    ✓ 1 + 2 shuld be 3
    ✓ 5 + 9 shuld be 14
  add function testing.
    ✓ 3 + 4 shuld be 7
    ✓ 7 + 8 shuld be 15
  4 passing (53ms)
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |                   
 add.js   |     100 |      100 |     100 |     100 |                   
----------|---------|----------|---------|---------|-------------------
```

## 4、对 parser.js 进行测试

1. 配置测试环境：编写`.babelrc`和`.nycrc` 文件，增加依赖插件

```json
// .babelrc
{
  "presets": ["@babel/preset-env"],
  "plugins": ["istanbul"],
  "sourceMaps": "inline" // sourceMaps 匹配到行
}
```

2. 编辑`launch.json`，方便测试时进行调试

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "runtimeArgs": [
        "--require", "@babel/register"
      ],
      "sourceMaps": true, // 对测试代码sourceMaps进行匹配
      "args": [

      ],
      "program": "${workspaceFolder}/node_modules/.bin/mocha" // 运行命令时，执行debugger
    }
  ]
}
```

3. 通过运行`npm run coverage`，覆盖测试；
   * 一般要求Funcs达到100%；
   * Lines达到90%以上；

## 5、单元测试 集成到 generator

还是以上一篇中的生成 vue 项目为例。

1. 将上一篇的`generator-vue`文件夹复制一份到欲创建项目的目标文件夹中，修改文件夹名为`generator-vue-test`，同时修改该文件夹下的 packag.json 文件的"`"name": "generator-vue-test"`；
2. 在`generator-vue-test`文件夹中的 index.js 中针对单元测试需要安装的依赖工具进行配置，对照上面1-4中的 package.json 文件添加到 index.js 文件的 `install(){}`中，结果如下；

```js
// 为项目安装预备依赖到不同环境；
install() {
  this.npmInstall([
    "vue",
    "css"
  ], { "save-dev": false });

  this.npmInstall([
    "@babel-loader",
    "@babel/core",
    "@babel/preset-env",
    "@babel/register",
    "@istanbuljs/nyc-config-babel",
    "babel-plugin-istanbul",
    "mocha",
    "nyc",
    "webpack",
    "webpack-cli",
    "vue-loader",
    "vue-template-compiler",
    "vue-style-loader",
    "css-loader",
    "copy-webpack-plugin"
  ], { "save-dev": true });
}
```

3. 将测试中用到的`.babelrc` `.nycrc`两个文件拷贝到`generator-vue-test/generators/app/templates`文件中，作为输出的模版；

4. 为单元测试的示例添加模板，`generator-vue-test/generators/app/templates`文件中新建`sample.test.js`文件；

   * 编写示例如下：

     ```js
     import assert from 'assert'
     
     describe('test case:', function () {
         it('1 + 2 == 3', function () {
             assert.equal(1 + 2, 3);
         })
     })
     ```

5. 将`generator-vue-test/generators/app/templates`文件夹下的所有文件对应输出，在 index.js 的`copyFiles(){}`函数中进行配置，如下：

```js
// 为项目增加模版文件；
copyFiles() {
  this.fs.copyTpl(
    this.templatePath('HelloWord.vue'),
    this.destinationPath('src/HelloWord.vue'),
    {}
  );
  this.fs.copyTpl(
    this.templatePath('webpack.config.js'),
    this.destinationPath('webpack.config.js'),
    {}
  );
  this.fs.copyTpl(
    this.templatePath('main.js'),
    this.destinationPath('src/main.js'),
    {}
  );
  this.fs.copyTpl(
    this.templatePath('index.html'),
    this.destinationPath('src/index.html'),
    { title: this.answers.name }
  );
  this.fs.copyTpl(
    this.templatePath('.nycrc'),
    this.destinationPath('.nycrc'),
    {}
  );
  this.fs.copyTpl(
    this.templatePath('.babelrc'),
    this.destinationPath('.babelrc'),
    {}
  );
}
```

6. 将 index.js 的 initPackage 函数中 `pkgJson.scripts` npm 单元测试命令相关的进行添加，如下：

```js
"scripts": {
  "test": "mocha --require @babel/register",
  "coverage": "nyc mocha --require @babel/register",
  "build": "webpack --config webpack.config.js"
},
```

7. 在`generator-vue-test`文件夹下执行`npm link`在全局的`node_modules`目录之中，生成一个符号链接，指向模块的本地目录，即在本机任何目录下的文件夹下都可以创建新的项目。

8. 在本机任何文件夹都可以新建一个文件夹，并且进入（ cd ）该文件夹，执行`yo vue-test`创建新项目；

