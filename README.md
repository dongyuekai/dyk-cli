# dyk-cli
利用 node 实现的一个脚手架项目构建工具

commander.js，可以自动的解析命令和参数，用于处理用户输入的命令。

download-git-repo，下载并提取 git 仓库，用于下载项目模板。

Inquirer.js，通用的命令行用户界面集合，用于和用户进行交互。

ora，下载过程久的话，可以用于显示下载中的动画效果。

chalk，可以给终端的字体加上颜色。

log-symbols，可以在终端上显示出 √ 或 × 等的图标。

## 在package.json中配置bin:
```
"bin": {
    "dyk": "./index.js"
},
```

## 在index.js文件中定义了以下命令：
```
program
  .version(packageData.version)
  .option("-i, --init", "初始化项目")
  .option("-V, --version", "查看版本号信息")
  .option("-l, --list", "查看可用的模板列表")
program.parse(process.argv)
```
## yarn link 将dyk-cli link到全局

## 新建一个项目  test-dyk-cli 然后执行 dyk --init 完成初始化
