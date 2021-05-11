# 四、工具链—持续集成

## 1、发布前检查相关知识

* 持续集成前，客户端开发模式为：前期各自开发，最终集成联调。

* **早期的持续集成**打破了这个开发模式，它有两个重要概念：
  * 第一个概念叫 **`daily build`**，通过服务器端代码在每晚进行全局`build`，大概8小时左右；
  * 第二个概念叫**`build verification test`（BVT）**，构建的验证测试，属于冒烟测试，最简单、基本的case，对`build`的内容进行验证；
    * 客户端时代的开发周期长（几个月—几年），测试工程师产生case的成本高，但周期长故而合理；

* **前端的持续集成**与早期持续集成是有一定区别：
  * **提交的时候进行build和基本验证：**前端的`build`时间更短，可以控制在一个更短的时间线范围，最多大概也就3分钟。虽然时间短，也没必要1/2个小时就build，可以选择在提交的时候进行build和基本验证；
  * **更轻量级的检查方式：**对于前端短周期（几小时—几周）开发而言，使用上述（BVT）测试，测试工程师产生case的成本高，周期短，不合理；
    * **lint：**所以前端变通的采用了更轻量级的检查方式---lint---只对代码风格和常见代码模式进行校验；
    * **`PhantomsJS`无头浏览器**：而若想做比较完整的测试可以使用`PhantomsJS`无头浏览器进行测试，前端可以使用类似于`PhantomsJS`的无头浏览器进行持续集成，可以生成完整`DOM` 树，检查`DOM` 树的特定格式来完成BVT。但使用`PhantomsJS`无头浏览器进行单元测试就大可不必。

以下主要介绍三方面知识：

* 一是通过`Git Hook` 来获取校验时机；
* 二是通过`Eslint`进行代码轻量级检查；
* 三是通过`PhantomsJS`对代码生成出的样子做规则校验和检查。

## 2、Git Hooks基本用法

​		每一个 `git` 仓库默认会有`Git Hooks`。

​		新建一个干净的文件夹，然后新建一个`README.md`，然后通过`git init` 初始化代码仓库，将`README.md` 文件提交至缓存区，可以通过`git status` 查看文件状态。

​		然后我们可以通过`ls -a` 可以找到`.git` 文件夹。

```shell
mkdir git-demo
cd git-demo
touch README.md							# 新建README.md 
git init										# 初始化代码仓库
git add README.md
git commit -a -m 'init'
git log											# 查看提交记录
ls -a												# 查看.git文件夹
open ./.git									# 打开.git， Windows使用start命令，Linux和Mac使用open
```

​		打开`.git` 文件夹，看到`hooks` 文件夹包含多个后缀为`.sample`的文件。若去掉后缀`.sample`，则是Linux可执行的文件。

​		如果需要对服务端的git进行处理的话，就可以使用`pre-receive`。

* 一般而言，我们常用的就是**`pre-commit`** ，lint 操作一般放在这；

* 而`git push`前的一些 check 的检查，则放在**`pre-push`**中；

  本次也主要围绕这两个钩子进行操作。我们可以新建``pre-commit`文件，将`pre-commit.sample`文件修改为我们较为熟悉的`Node.js`：

```shell
git-demo % cd .git

.git % cd hooks

hooks % touch pre-commit

hooks % ls
applypatch-msg.sample		pre-applypatch.sample		pre-push.sample			update.sample
commit-msg.sample		pre-commit			pre-rebase.sample
fsmonitor-watchman.sample	pre-commit.sample		pre-receive.sample
post-update.sample		pre-merge-commit.sample		prepare-commit-msg.sample

hooks % ls -l ./pre-commit
-rw-r--r--  1 Thales  staff  0  4 21 15:12 ./pre-commit		# 只有读写权限，没有执行权限

hooks % chmod +x ./pre-commit															# 增加执行权限

hooks % ls -l ./pre-commit   
-rwxr-xr-x  1 Thales  staff  0  4 21 15:12 ./pre-commit		# 已有执行权限

```

​		在`pre-commit` 文件中用 node**`require("process")`**模块在 `git commit` 命令前阻止文件提交，如下：

```
#!/usr/bin/env node

let process = require("process");

console.log("hello hooks!");

process.exitCode = 1;
```

​		若此时，对 README.md 文件进行修改，并进行 commit 后，`git status`会发现文件依然还在本地缓存中，并没有上传到暂存空间中。

## 3、ESLint 结合 Git Hooks 使用

>  ESLint官网示例：https://eslint.org/docs/developer-guide/nodejs-api#eslint-class；
>
> .git/hooks/pre-commit，使用上方官网示例；
>
> 文件中的`await exec("git stash push -k")`集成了下面讲述的**边界处理**情况：

```js
#!/usr/bin/env node

let process = require("process");
let child_process = require("child_process")
const { ESLint } = require("eslint");

function exec(name) {
    return new Promise(function (resolve) {
        child_process.exec(name, resolve)
    })
}

(async function main() {
    // 1. 创建自动修复的实例，请一定设置 fasle ，保证 commit 时不出现自动修改带来的 bug ；
    const eslint = new ESLint({ fix: false });

    // 2. 对目标目录文件夹的文件进行 lint ，不会对文件进行修改；
    await exec("git stash push -k")		// 存储正在工作中的git；
    const results = await eslint.lintFiles(["index.js"]);		// 对add .中的进行eslint校验；
    await exec("git stash pop")

    // 跳过第三步
    // // 3. 代码修改文件
    // await ESLint.outputFixes(results);

    // 4. Format the results.
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = formatter.format(results);

    // 5. Output it.
    console.log(resultText);

    // 由于eslint的错误不算检查异常，因此需要自行对错误进行阻止提交操作
    for (const result of results) {
        if (result.errorCount) {
            process.exitCode = 1;
        }
    }
})().catch((error) => {
    process.exitCode = 1;
    console.error(error);
});
```

> 重点处理一下边界情况：在进行`git add .`后再次进行编辑，commit的版本是执行过`git add .`的文件，但是校验的确实当前修改的版本。可以通过`git stash` 相关命令来处理。

```shell
git stash push
git stash list // 查看记录
git stash pop // 两次更改被合成了一次
git add .
git stash push -k // 变更依然在，eslint依然检查要提交的版本
git stash pop // 将之前的修改释放回来
```

