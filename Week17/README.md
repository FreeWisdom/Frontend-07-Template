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

## 4、webpack 提供 build 能力

* webpack最初是为了nodejs设计的，并非为了web开发而设计；
* 现在webpack做web打包非常多，他的核心思路是最终打包成一个js文件，然后通过手动引入到html文件中, 它可以做多文件的合并，并通过各种loader和plugin去制定各种规则；
* 使用webpack需要安装两个包， webpack 和 webpack-cli ，webpack是核心， webpack-cli提供命令；
* webpack配置文件采用commonjs规范：
  * `module.exports = {}`导出一个对象;
  * 该对象中包含几个基础模块：entry, output, module, plugin。
* npx webpack 这个命令运行的时候，会去校验有没有 webpack ，没有就会装了之后再用，装了就会直接用。

## 5、babel 提供 transform 能力

​		http://www.ruanyifeng.com/blog/2016/01/babel.html

## 6、本次创建项目过程中 其他技术能力

### 6.1、npm link

1. **npm link 介绍**

   开发NPM模块的时候，有时我们会希望，边开发边试用，比如本地调试的时候，`require('myModule')`会自动加载本机开发中的模块。Node规定，使用一个模块时，需要将其安装到全局的或项目的`node_modules`目录之中。对于开发中的模块，解决方法就是在全局的`node_modules`目录之中，生成一个符号链接，指向模块的本地目录。`npm link`就能起到这个作用，会自动建立这个符号链接。

2. **npm link 实例**

   请设想这样一个场景，你开发了一个模块`myModule`，目录为`src/myModule`，你自己的项目`myProject`要用到这个模块，项目目录为`src/myProject`。首先，在模块目录（`src/myModule`）下运行`npm link`命令。

   ```shell
   src/myModule$ npm link
   ```

   上面的命令会在NPM的全局模块目录内，生成一个符号链接文件，该文件的名字就是`package.json`文件中指定的模块名，如下：

   ```shell
   /path/to/global/node_modules/myModule -> src/myModule
   ```

   这个时候，已经可以全局调用`myModule`模块了。但是，如果我们要让这个模块安装在项目内，还要进行下面的步骤。

   切换到项目目录，再次运行`npm link`命令，并指定模块名。

   ```shell
   src/myProject$ npm link myModule
   ```

   上面命令等同于生成了本地模块的符号链接如下：

   ```shell
   src/myProject/node_modules/myModule -> /path/to/global/node_modules/myModule
   ```

   然后，就可以在你的项目中，加载该模块了。

   ```shell
   var myModule = require('myModule');
   ```

   这样一来，`myModule`的任何变化，都可以直接反映在`myProject`项目之中。但是，这样也出现了风险，任何在`myProject`目录中对`myModule`的修改，都会反映到模块的源码中。

   如果你的项目不再需要该模块，可以在项目目录内使用`npm unlink`命令，删除符号链接。

   ```shell
   src/myProject$ npm unlink myModule
   ```

### 6.2、npx

- **主要特点**

  1. 临时安装可执行依赖包，不用全局安装，不用担心长期的污染。
  2. 可以执行依赖包中的命令，安装完成自动运行。
  3. 自动加载 node_modules 中依赖包，不用指定$PATH。
  4. 可以指定 node 版本、命令的版本，解决了不同项目使用不同版本的命令的问题。

- **npx 用来解决全局命令行工具只能有一个的问题。**

  > 比如装个 webpack,使用的是 4.x，可是已经装了全局的 1.x 版本并且还要继续使用，这个时候可以不装在全局，用 npx webpack 代替 webpack 命令，互不干扰。

- **npm vs npx**

  > npm 是一个 node package 安装工具。 npx 的作用是先检查本地有没有安装某个 package，如果没有去远程 registry 找，找到的话直接使用，不用下载到本地 node-modules 包里面，这样就能优化本地项目的大小，也可以避免安装 package 到全局。