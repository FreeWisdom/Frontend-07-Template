var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    // 为项目创建 package.json
    async initPackage() {
        // 询问后创建项目名称，默认为项目文件夹名称；
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
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('src/index.html'),
            {title: this.answers.name}
        );
    }
};