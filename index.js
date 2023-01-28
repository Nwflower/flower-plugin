import fs from 'node:fs'
import { pluginName } from "./model/path.js";
import { currentVersion } from "./model/Changelog.js";
import common from "../../lib/common/common.js";

logger.info('--------- >_< ---------')
logger.info(`抽卡插件${currentVersion}很高兴为您服务~`)
if (Math.floor(Math.random()*100)<5){
  logger.info('\n\n' +
    '8888888888 888       .d88888b.  888       888 8888888888 8888888b.  \n' +
    '888        888      d88P" "Y88b 888   o   888 888        888   Y88b \n' +
    '888        888      888     888 888  d8b  888 888        888    888 \n' +
    '8888888    888      888     888 888 d888b 888 8888888    888   d88P \n' +
    '888        888      888     888 888d88888b888 888        8888888P"  \n' +
    '888        888      888     888 88888P Y88888 888        888 T88b   \n' +
    '888        888      Y88b. .d88P 8888P   Y8888 888        888  T88b  \n' +
    '888        88888888  "Y88888P"  888P     Y888 8888888888 888   T88b \n\n' +
    '8888888b.  888      888     888   .d8888b.    8888888   888b    888 \n' +
    '888   Y88b 888      888     888  d88P  Y88b     888     8888b   888 \n' +
    '888    888 888      888     888  888    888     888     88888b  888 \n' +
    '888   d88P 888      888     888  888            888     888Y88b 888 \n' +
    '8888888P"  888      888     888  888  88888     888     888 Y88b888 \n' +
    '888        888      888     888  888    888     888     888  Y88888 \n' +
    '888        888      Y88b. .d88P  Y88b  d88P     888     888   Y8888 \n' +
    '888        88888888  "Y88888P"    "Y8888P88   8888888   888    Y888 \n')
}

const syncFiles = fs.readdirSync(`./plugins/${pluginName}/GachaMOD`)
let apps = {}


const appfiles = fs
  .readdirSync(`./plugins/${pluginName}/apps`)
  .filter((file) => file.endsWith('.js'))
for (let appfile of appfiles) {
  let name = appfile.replace('.js', '')
  apps[name] = (await import(`./apps/${appfile}`))[name]
}

for (let sync of syncFiles) {
  const files = fs
    .readdirSync(`./plugins/${pluginName}/GachaMOD/${sync}/apps`)
    .filter((file) => file.endsWith('.js'))
  for (let file of files) {
    let name = file.replace('.js', '')
    apps[name] = (await import(`./GachaMOD/${sync}/apps/${file}`))[name]
  }
}

setTimeout(async function () {
  let msgStr = await redis.get('flower:restart-msg')
  if (msgStr) {
    let msg = JSON.parse(msgStr)
    await common.relpyPrivate(msg.qq, msg.msg)
    await redis.del('flower:restart-msg')
    let msgs = [`当前抽卡版本: ${currentVersion}`, '您可使用 #抽卡版本 命令查看更新信息']
    await common.relpyPrivate(msg.qq, msgs.join('\n'))
  }
}, 1000)

export { apps }
