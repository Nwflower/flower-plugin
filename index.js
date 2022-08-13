import { currentVersion } from './components/Changelog.js'
import fs from 'node:fs'

if (Bot?.logger?.info) {
  Bot.logger.info('--------->_<---------')
  Bot.logger.info(`抽卡插件${currentVersion}很高兴为您服务~`)
} else {
  console.log(`抽卡插件${currentVersion}很高兴为您服务~`)
}
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
