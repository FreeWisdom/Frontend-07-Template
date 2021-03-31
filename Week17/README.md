# 工具链

* 为 JS 生产环境制作工具链，覆盖前端开发各个环节；

## 1、脚手架

1. 所有工具的开端都是**脚手架（generator）**；
2. yeoman 是社区较流行的脚手架生成器；

## 2、yeoman 的基本使用

### 2.1、创建脚手架（generator）

1. 创建一个文件夹 toolchain ，在其中编写生成器；

2. 该文件夹下通过命令行运行 npm init ，生成 packge.json 如下：

   * Name 属性必须以 generator- 为前缀；
   * 运行：`npm install -- save yeoman-generator`，将 yeoman-generator 设置为一个依赖项；

   ```json
   {
       "name": "generator-toolchain",
       "version": "1.0.0",
       "description": "",
       "main": "generators/app/index.js",
       "scripts": {
           "test": "echo \"Error: no test specified\" && exit 1"
       },
       "author": "",
       "license": "ISC",
       "dependencies": {
           "save": "^2.4.0",
           "yeoman-generator": "^4.13.0"
       }
   }
   ```

3. 将目录结构设置如下：

   ```js
   ├───package.json
   └───generators/
       ├───app/
       │   └───index.js
   ```

4. 将 app/index.js 初始化如下：

   ```js
   var Generator = require('yeoman-generator');
   
   module.exports = class extends Generator {
       // The name `constructor` is important here
       constructor(args, opts) {
           // Calling the super constructor is important so our generator is correctly set up
           super(args, opts);
   
           // Next, add your custom code
           this.option('babel'); // This method adds support for a `--babel` flag
       }
   
       method1() {
           this.log('method 1 just ran');
       }
   };
   ```

5. 在命令行上，在项目根目录 toolchain 下输入：`npm link`

   * 由于是在本地开发生成器，因此它还不能作为全局 npm 模块使用。可以使用 npm 创建全局模块并与本地模块符号链接。

### 2.2、输出、输入（用户交互）

1. 命令行调用 `yo toolchain`，将看到在 index.js 定义的 `this.log` 在终端中呈现，如下：

   ```s
   [Thales@zhenhanzhedeMacBook-Pro toolchain % yo toolchain
   method 1 just ran
   method 2 just ran
   ```

2. 在 app/index.js/Generator 中增加 prompting 方法如下：

   ```js
   async prompting() {
       this.answers = await this.prompt([
           {
               type: "input",// 输入
               name: "name",
               message: "Your project name",
               default: this.appname // Default to current folder name
           },
           {
               type: "confirm",// 选择
               name: "cool",
               message: "Would you like to enable the Cool feature?"
           }
       ]);
   
       this.log("app name", this.answers.name);
       this.log("cool feature", this.answers.cool);
   }
   ```

3. 命令行调用 `yo toolchain`；

   * 输入 `demo` 回车,即：`answers.name = demo`
   * 选择 `n` 回车,即：`answers.cool = flase`
   * 最后打印出 `this.log()`

   ```shell
   [Thales@zhenhanzhedeMacBook-Pro app % yo toolchain
   method 1 just ran
   [? Your project name demo
   [? Would you like to enable the Cool feature? No
   app name demo
   cool feature false
   [Thales@zhenhanzhedeMacBook-Pro app % 
   ```

### 2.3、文件系统（用户交互）

1. 复制模版文件

   * Given the content of `toolchain/generators/app/templates/index.html` is:

   ```html
   <html>
       <head>
           <title><%= title %></title>
       </head>
   </html>
   ```

2. 在 app/index.js/Generator 中增加 writing 方法如下：

   ```js
   writing() {
       this.log("app answers:", this.answers)
       this.fs.copyTpl(
           this.templatePath('index.html'),
           this.destinationPath('public/index.html'),
           // this.answers.name 会替代 index.html 中的 <%= title %>，生成在 public/index.html 中；
           { title: this.answers.name }
       );
   }
   ```

3. 在 toolchain 的父目录下，创建项目文件夹 demo ，demo 文件夹下，命令行调用 `yo toolchain`：

   * 输入：`first-tool-chain` 回车;

   * 选择：`n` 回车;

     ```shell
     [Thales@zhenhanzhedeMacBook-Pro demo % yo toolchain
     [? Your project name first-tool-chain
     [? Would you like to enable the Cool feature? No
     app name first-tool-chain
     cool feature false
     method 1 just ran
     app answers:
     create public/index.html
     Thales@zhenhanzhedeMacBook-Pro demo % 
     ```

   * 在 demo 目录下，生成 public 文件夹，文件夹中生成 index.html 文件，内容如下：

     - 输入的 Your project name `first-tool-chain` = this.answers.name ,会替代 index.html 中的 <%= title %>，生成在 public/index.html 中，如下；

     ```html
     <html>
         <head>
             <title>first-tool-chain</title>
         </head>
     </html>
     ```

### 2.4、依赖系统（包装npm）

1. 在 app/index.js/Generator 中增加 initPackage 方法：

   * 目的：用来在 public 文件夹下，创建或扩展 package.json 文件；

   ```js
   initPackage() {
     const pkgJson = {
       devDependencies: {
         eslint: '^3.15.0'
       },
       dependencies: {
         react: '^16.2.0'
       }
     };
   
     // Extend or create package.json file in destination path
     this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
   }
   ```

2. 在 app/index.js/Generator 中增加 install 方法：

   * 目的：用来在 public 文件夹下，根据 package.json 文件，生成 node_modules 文件夹；

   ```js
   install() {
     this.npmInstall();
   }
   ```

3. 在 demo 目录下，命令行调用 `yo toolchain`

   * 输入：`first-tool-chain` 回车;

   * 选择：`n` 回车后见最下方 shell 中显示;

   * 在 demo 目录下，生成 public 文件夹，文件夹中生成 index.html 文件，同上；

   * 在 demo 目录下，生成 package.json 文件，如下：

     * ```json
       {
         "devDependencies": {
           "eslint": "^3.15.0"
         },
         "dependencies": {
           "react": "^16.2.0"
         }
       }
       ```

   * 在 demo 目录下，生成 package-lock.json 文件；

   * 在 demo 目录下，生成 node_modules 文件夹；

   ```shell
   [Thales@zhenhanzhedeMacBook-Pro demo % yo toolchain
   [? Your project name first-tool-chain
   [? Would you like to enable the Cool feature? No
   app name first-tool-chain
   cool feature false
   method 1 just ran
      create package.json
      create public/index.html
   npm WARN deprecated circular-json@0.3.3: CircularJSON is in maintenance only, flatted is its successor.
   npm notice created a lockfile as package-lock.json. You should commit this file.
   npm WARN public No description
   npm WARN public No repository field.
   npm WARN public No license field.
   
   added 144 packages from 156 contributors and audited 144 packages in 8.389s
   
   3 packages are looking for funding
     run `npm fund` for details
   
   found 0 vulnerabilities
   
   Thales@zhenhanzhedeMacBook-Pro demo % 
   ```

## 3、创建 generator 生成 vue 项目 

### 3.1、generator 生成 package.json

1. 自选文件夹，创建"文件夹generator-vue"、"文件夹vue-demo" ；

2. 将上面写好的 “toolchain文件” 中的 “generators 文件夹”、“package.json 文件” 两个文件转移到 “generator-vue文件夹” 中；

3. 在 "generator-vue/generators/app/index.js" 文件中，为生成 “vue-demo” 项目的 "package.json" 文件，而作配置：

   ```js
   var Generator = require('yeoman-generator');
   
   module.exports = class extends Generator {
       constructor(args, opts) {
           super(args, opts);
       }
   
       // 为项目创建 package.json
       async initPackage() {
           // 询问后创建项目名称，默认为项目文件夹名称；
           let answers = await this.prompt(
               {
                   type: "input",
                   name: "name",
                   message: "Your project name",
                   default: this.appname// 默认为项目文件夹名称
               }
           );
           const pkgJson = {
               "name": answers.name,
               "version": "1.0.0",
               "description": "",
               "main": "generators/app/index.js",
               "scripts": {
                   "test": "echo \"Error: no test specified\" && exit 1"
               },
               "author": "",
               "license": "ISC",
               "devDependencies": {
               },
               "dependencies": {
               }
           };
   
           // Extend or create package.json file in destination path
           this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
       }
   
       // 为项目安装预备依赖到不同环境；
       install() {
           this.npmInstall(["vue"], {"save-dev": false});
           this.npmInstall(["webpack", "vue-loader"], {"save-dev": true});
       }
     
     	// 为项目增加“HelloWord.vue”模版文件；
       copyFiles() {
           this.fs.copyTpl(
               this.templatePath('HelloWord.vue'),
               this.destinationPath('src/HelloWord.vue'),
               {}
           );
       }
   };
   ```

4. “generator-vue空文件夹” 下 cd 命令行，键入`npm link`;

5. “vue-demo文件夹” 下 cd 命令行，键入`yo vue`，“vue-demo文件夹” 内新增3个文件：

   1. packag.json 文件
   2. package-lock.json 文件
   3. node-moudles 文件夹

### 3.2、generator 生成 vue 模板

1. 在 "generator-vue/generators/app/templates" 文件中，增加 js 模版文件 “HelloWord.vue” 如下：

   ```vue
   <template>
     <p>{{ greeting }} World!</p>
   </template>
   
   <script>
   module.exports = {
     data: function() {
       return {
         greeting: "Hello"
       };
     }
   };
   </script>
   
   <style scoped>
   p {
     font-size: 2em;
     text-align: center;
   }
   </style>
   ```

2. 在 "generator-vue/generators/app/index.js" 文件 ”Generator“ 类中，创建 “copyFiles()” ，为生成 vue 模板做配置：

   ```js
   var Generator = require('yeoman-generator');
   
   module.exports = class extends Generator {
       constructor(args, opts) {
           // …………
       }
   
       // 为项目创建 package.json
       async initPackage() {
         	// …………
       }
   
       // 为项目安装预备依赖到不同环境；
       install() {
         	// …………
       }
     
     	// 为项目增加“HelloWord.vue”模版文件；
       copyFiles() {
           this.fs.copyTpl(
               this.templatePath('HelloWord.vue'),
               this.destinationPath('src/HelloWord.vue'),
               {}
           );
       }
   };
   ```

3. “vue-demo文件夹” 下 cd 命令行，键入`yo vue`，“vue-demo文件夹” 内变为4个文件：

   1. packag.json 文件
   2. package-lock.json 文件
   3. node-moudles 文件夹
   4. src 文件夹
      * HelloWord.vue 文件

### 3.3、generator 生成 webpack.config.js

1. 在 "generator-vue/generators/app/templates" 文件中，增加 webpack 模版文件 “webpack.config.js” 如下：

   ```js
   const { VueLoaderPlugin } = require('vue-loader')
   const webpack = require('webpack'); // 用于访问内置插件
   
   module.exports = {
       entry: "./src/main.js",
       mode: "development",
       module: {
           rules: [
               {
                   test: /\.vue$/,
                   loader: 'vue-loader'
               },
               // 它会应用到普通的 `.js` 文件
               // 以及 `.vue` 文件中的 `<script>` 块
               // {
               //     test: /\.js$/,
               //     loader: 'babel-loader'
               // },
               // 它会应用到普通的 `.css` 文件
               // 以及 `.vue` 文件中的 `<style>` 块
               {
                   test: /\.css$/,
                   use: [
                       'vue-style-loader',
                       'css-loader'
                   ]
               }
           ]
       },
       plugins: [
           // 请确保引入这个插件来施展魔法
           new VueLoaderPlugin()
       ]
   }
   ```

2. 在 "generator-vue/generators/app/templates" 文件中，增加 main.js 模版文件 “main.js” 如下：

   ```js
   import HelloWord from "./HelloWord.vue";
   ```

3. 为使在 “vue-demo 文件” 下可以成功`npm run build`使用 webpack 打包，在 "generator-vue/generators/app/index.js" 文件的 ”Generator“ 类中增加配置如下++++add+++++：

   ```js
   var Generator = require('yeoman-generator');
   
   module.exports = class extends Generator {
       constructor(args, opts) {
           // …………
       }
   
       // 为项目创建 package.json
       async initPackage() {
           // 询问后创建项目名称，默认为项目文件夹名称；
           let answers = await this.prompt(
               // …………
           );
           const pkgJson = {
               // …………
               "scripts": {
                   "test": "echo \"Error: no test specified\" && exit 1",
                 	// +++++add+++++
                   "build": "webpack --config webpack.config.js"
               },
               // …………
           };
               // …………
       }
   
       // 为项目安装预备依赖到不同环境；
       install() {
           this.npmInstall(["vue"], {"save-dev": false});
         	// +++++add+++++
           this.npmInstall([
               "webpack",
               "webpack-cli",
               "vue-loader",
               "vue-template-compiler",
               "vue-style-loader",
               "css-loader",
           ], {"save-dev": true});
       }
   
       // 为项目增加模版文件；
       copyFiles() {
           this.fs.copyTpl(
               this.templatePath('HelloWord.vue'),
               this.destinationPath('src/HelloWord.vue'),
               {}
           );
         	// +++++add+++++
           this.fs.copyTpl(
               this.templatePath('webpack.config.js'),
               this.destinationPath('webpack.config.js'),
               {}
           );
   	      // +++++add+++++
           this.fs.copyTpl(
               this.templatePath('main.js'),
               this.destinationPath('src/main.js'),
               {}
           );
       }
   };
   ```

4. “vue-demo文件夹” 下 cd 命令行，键入`yo vue`，“vue-demo文件夹” 内变为4个文件：
   1. packag.json 文件
   2. package-lock.json 文件
   3. node-moudles 文件夹
   4. webpack.config.js 文件
   5. src 文件夹
      * HelloWord.vue 文件
      * main.js 文件

5. “vue-demo文件夹” 下 cd 命令行，键入`npm run build`，“vue-demo文件夹” 内增加 webpack 打包后的 “dist 文件夹/main.js 文件”，使用webpack 打包成功；

### 3.4、generator 生成 scr/index.html

1. 在 "generator-vue/generators/app/templates" 文件中，增加 html 模版文件 “index.html” 如下（全文件展示）：

   ```html
   <html>
   
   <head>
     <title>
       <%= title %>
     </title>
   </head>
   
   <body>
     <div id="app"></div>
     <!-- script 放到 div 之后，否则会找不到 #app 元素 -->
     <script src="./main.js"></script>
   </body>
   
   </html>
   ```

2. 在 "generator-vue/generators/app/templates/main.js" 文件中，修改 “main.js” 如下（全文件展示，看//+++++add++++++）：

   ```js
   import HelloWord from "./HelloWord.vue";
   //+++++add++++++
   import Vue from "Vue";
   //+++++add++++++
   new Vue({
       el: "#app",
       render: h => h(HelloWord)
   });
   ```

3. 在 "generator-vue/generators/app/index.js" 文件中，增加如下配置（全文件展示，看//+++++add++++++）：

   ```js
   var Generator = require('yeoman-generator');
   
   module.exports = class extends Generator {
       constructor(args, opts) {
           super(args, opts);
       }
   
       // 为项目创建 package.json
       async initPackage() {
           // 询问后创建项目名称，默认为项目文件夹名称；
         	// +++++add:修改为 this.anwsers方便 copyFiles 中 title 引用+++++ 
           this.answers = await this.prompt(
               {
                   type: "input",
                   name: "name",
                   message: "Your project name",
                   default: this.appname// 默认为项目文件夹名称
               }
           );
           const pkgJson = {
               "name": this.answers.name,
               "version": "1.0.0",
               "description": "",
               "main": "generators/app/index.js",
               "scripts": {
                   "test": "echo \"Error: no test specified\" && exit 1",
                   "build": "webpack --config webpack.config.js"
               },
               "author": "",
               "license": "ISC",
               "devDependencies": {
               },
               "dependencies": {
               }
           };
   
           // Extend or create package.json file in destination path
           this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
       }
   
       // 为项目安装预备依赖到不同环境；
       install() {
           this.npmInstall(["vue"], {"save-dev": false});
           this.npmInstall([
               "webpack",
               "webpack-cli",
               "vue-loader",
               "vue-template-compiler",
               "vue-style-loader",
               "css-loader",
             	// +++++add+++++
               "copy-webpack-plugin"
           ], {"save-dev": true});
       }
   
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
         	// +++++add+++++
           this.fs.copyTpl(
               this.templatePath('index.html'),
               this.destinationPath('src/index.html'),
               {title: this.answers.name}
           );
       }
   };
   ```

4. 在 "generator-vue/generators/app/templates/webpack.config.js" 文件中，增加如下配置（全文件展示，看//+++++add++++++）：

   ```js
   const { VueLoaderPlugin } = require('vue-loader')
   const CopyPlugin = require("copy-webpack-plugin");
   const webpack = require('webpack'); // 用于访问内置插件
   
   module.exports = {
       entry: "./src/main.js",
       mode: "development",
       module: {
           rules: [
               {
                   test: /\.vue$/,
                   loader: 'vue-loader'
               },
               {
                   test: /\.css$/,
                   use: [
                       'vue-style-loader',
                       'css-loader'
                   ]
               }
           ]
       },
       plugins: [
           // 请确保引入这个插件来施展魔法
           new VueLoaderPlugin(),
         	//+++++add++++++
           new CopyPlugin({
               patterns: [
                   { from: "src/*.html", to: "[name][ext]" }
               ],
           }),
       ]
   }
   ```

5. “vue-demo文件夹” 下 cd 命令行，键入`yo vue`，“vue-demo项目” 创建成功；

6. “vue-demo文件夹” 下 cd 命令行，键入`npm run build`，“vue-demo项目” 打包完成；

   * 点开 “vue-demo文件夹/dist文件夹/index.html” 如下图展示：

   ![Hello Word！](https://raw.githubusercontent.com/FreeWisdom/Frontend-07-Template/main/Week17/img/HelloWord.png "Hello Word！") 

### 3.5、”创建脚手架--->生成项目“总结

​		通过引用 “yeoman-generator” 创建 Generator 类。Generator 类使用 webpack 、vue loader、copy-webpack-plugin 等通用工具，对 packag.json模板、xxx.vue模板、main.js模板、index.html模板、webpack.config.js模板进行模板设计。从而实现了一个 vue.js 脚手架（generator），通过命令`yo vue`即可创建一个 vue.js 项目后进行开发。

