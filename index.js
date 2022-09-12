import { currentVersion } from './components/Changelog.js'
import fs from 'node:fs'

logger.info('--------->_<---------')
logger.info(`抽卡插件${currentVersion}很高兴为您服务~`)
logger.info('\n\n8888888888 888       .d88888b.  888       888 8888888888 8888888b.  \n' +
  '888        888      d88P" "Y88b 888   o   888 888        888   Y88b \n' +
  '888        888      888     888 888  d8b  888 888        888    888 \n' +
  '8888888    888      888     888 888 d888b 888 8888888    888   d88P \n' +
  '888        888      888     888 888d88888b888 888        8888888P"  \n' +
  '888        888      888     888 88888P Y88888 888        888 T88b   \n' +
  '888        888      Y88b. .d88P 8888P   Y8888 888        888  T88b  \n' +
  '888        88888888  "Y88888P"  888P     Y888 8888888888 888   T88b\n\n\n' +
  '8888888b.  888      888     888  .d8888b.  8888888 888b    888 \n' +
  '888   Y88b 888      888     888 d88P  Y88b   888   8888b   888 \n' +
  '888    888 888      888     888 888    888   888   88888b  888 \n' +
  '888   d88P 888      888     888 888          888   888Y88b 888 \n' +
  '8888888P"  888      888     888 888  88888   888   888 Y88b888 \n' +
  '888        888      888     888 888    888   888   888  Y88888 \n' +
  '888        888      Y88b. .d88P Y88b  d88P   888   888   Y8888 \n' +
  '888        88888888  "Y88888P"   "Y8888P88 8888888 888    Y888\n\n')
const files = fs
  .readdirSync('./plugins/flower-plugin/apps')
  .filter((file) => file.endsWith('.js'))

let apps = {}
for (let file of files) {
  let name = file.replace('.js', '')
  apps[name] = (await import(`./apps/${file}`))[name]
}
let index = { flower: {} }
export const flower = index.flower || {}

setTimeout(async function () {
  let msgStr = await redis.get('flower:restart-msg')
  let relpyPrivate = async function () { }
  if (msgStr) {
    let msg = JSON.parse(msgStr)
    await relpyPrivate(msg.qq, msg.msg)
    await redis.del('flower:restart-msg')
    let msgs = [`当前抽卡版本: ${currentVersion}`, '您可使用 #抽卡版本 命令查看更新信息']
    await relpyPrivate(msg.qq, msgs.join('\n'))
  }
}, 1000)

export { apps }
