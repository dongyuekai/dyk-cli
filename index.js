#!/usr/bin/env node

// 可以自动的解析命令和参数，用于处理用户输入的命令
const program = require('commander')
// 下载并提取 git 仓库，用于下载项目模板
const download = require('download-git-repo')
// 通用的命令行用户界面集合，用于和用户进行交互
const inquirer = require('inquirer')
// 下载过程久的话，可以用于显示下载中的动画效果
const ora = require('ora')
// 可以给终端的字体加上颜色
const chalk = require('chalk')
// handlebars是一种简单的模板语言
const handlebars = require('handlebars')
// 可以在终端上显示出 √ 或 × 等的图标
const logSymbols = require('log-symbols')
const fs = require('fs')
const path = require('path')
const packageData = require('./package.json')

const templates = {
  "ts-vue": {
    url: "https://github.com/easy-wheel/ts-vue",
    downloadUrl: "https://github.com:easy-wheel/ts-vue#master",
    description: "ts-vue是一个中后台前端解决方案，它基于 vue, typescript 和 element-ui实现。"
  },
  "umi-hooks": {
    url: "https://github.com/easy-wheel/Umi-hooks",
    downloadUrl: "https://github.com:easy-wheel/Umi-hooks#master",
    description:
      "Umi-Hooks是一个中后台前端解决方案，它基于 umi, react, typescript 和 ant-design实现。",
  },
  "cra-base-template": {
    url: "https://github.com/dongyuekai/create_react_web_app",
    downloadUrl: "https://github.com:dongyuekai/create_react_web_app#master",
    description:
      "cra-base-template是一个用cra脚手架搭建的React模板程序，它按需引入了antd、antd-mobile，添加了对px2rem和sass的支持",
  }
}

// 定义版本 和 --help 信息
program
  .version(packageData.version)
  .option("-i, --init", "初始化项目")
  .option("-V, --version", "查看版本号信息")
  .option("-l, --list", "查看可用的模板列表")
program.parse(process.argv)

// 如果是执行init
if (program.opts() && program.opts().init) {
  // 初始化项目
  inquirer
    .prompt([
      {
        type: "input",
        name: "projectName",
        message: "请输入项目名称"
      },
      {
        type: "input",
        name: "description",
        message: "请输入项目简介",
      },
      {
        type: "input",
        name: "author",
        message: "请输入作者名称",
      },
      {
        type: "list",
        name: "template",
        message: "选择其中一个作为项目模版",
        choices: [
          "ts-vue (vue+ts项目模版)",
          "umi-hooks (react+ts项目模版)",
          "cra-base-template (基于CRA脚手架搭建的基础项目按需引入antd、antd-mobile,支持px2rem和scss)"
        ],
      },
    ])
    .then(async answers => {
      // 把采集到的用户输入的数据解析替换到 package.json 文件中
      console.log('选择了：', answers.template.split(" ")[0])
      let url = templates[answers.template.split(" ")[0]].downloadUrl
      await initTemplateDefault(answers, url)
    })
}
async function initTemplateDefault(customContent, gitUrl) {

  // console.log('dyk-customContent-', customContent)
  // dyk - customContent - {
  //   projectName: 'dyk-proj',
  //   description: '用dyk-cli构建的项目',
  //   author: 'dyk',
  //   template: 'ts-vue (vue+ts项目模版)'
  // }

  // console.log('dyk-gitUrl-', gitUrl)
  // dyk-gitUrl- https://github.com:easy-wheel/ts-vue#master

  console.log(chalk.bold.cyan('dyk-cli: ') + "will creating a new project starter")
  const { projectName = "" } = customContent
  try {
    await checkName(projectName)
    await downloadTemplate(gitUrl, projectName)
    await changeTemplate(customContent)
  } catch (error) {
    console.log(chalk.red(error));
  }
}

// 检查创建的项目是否已经存在
function checkName(projectName) {
  return new Promise((resolve, reject) => {
    fs.readdir(process.cwd(), (err, data) => {
      console.log('dyk--process.cwd()---', process.cwd())
      console.log('dyk----data---', data)
      if (err) {
        return reject(err)
      }
      if (data.includes(projectName)) {
        return reject(new Error(`${projectName} already exists!!!`))
      }
      resolve()
    })
  })
}

// 下载模板
function downloadTemplate(gitUrl, projectName) {
  const spinner = ora("download template......").start()
  return new Promise((resolve, reject) => {
    download(
      gitUrl,
      path.resolve(process.cwd(), projectName),
      { clone: true },
      function (err) {
        if (err) {
          return reject(err)
          spinner.fail() // 下载失败提示
        }
        spinner.succeed() // 下载成功提示
        resolve()
      }
    )
  })
}

// 根据用户输入值修改package.json
function changeTemplate(customContent) {
  const { projectName = "", description = "", author = "" } = customContent
  return new Promise((resolve, reject) => {
    // 读取的是根据模板生成的package.json
    fs.readFile(
      path.resolve(process.cwd(), projectName, 'package.json'),
      "utf8",
      (err, data) => {
        if (err) {
          return reject(err)
        }
        let packageContent = JSON.parse(data)
        packageContent.name = projectName
        packageContent.author = author
        packageContent.description = description
        fs.writeFile(
          path.resolve(process.cwd(), projectName, 'package.json'),
          JSON.stringify(packageContent, null, 2
          ),
          "utf8",
          (err, data) => {
            if (err) {
              return reject(err)
            }
            resolve()
          }
        )
      }
    )
  })
}


// 如果是执行list 就查看模板
if (program.opts() && program.opts().list) {
  // 查看可用的模板列表
  for (let key in templates) {
    console.log(`${key} : ${templates[key].description}`)
  }
}







