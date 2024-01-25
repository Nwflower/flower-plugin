import plugin from '../../../../../lib/plugins/plugin.js'
import setting from '../model/setting.js'
import fs from 'node:fs'
import { modResources } from '../model/MODpath.js'
import puppeteer from '../../../../../lib/puppeteer/puppeteer.js'
import YAML from 'yaml'
import GsCfg from '../../../../genshin/model/gsCfg.js'
import { _path } from '../../../model/path.js'

let CD = {}
export class genshinrelife extends plugin {
  constructor () {
    super({
      name: '抽卡插件转生',
      dsc: '转生成原神中的角色',
      event: 'message',
      priority: 1680,
      rule: [
        {
          reg: '^#*(原神)?转生$',
          fnc: 'relife'
        }
      ]
    })
  }

  // 获取配置单
  get appconfig () { return setting.getConfig('gacha') }

  async relife (e) {
    // 校验CD和权限
    let cdtime = this.appconfig.relifeCD
    if (CD[e.user_id] && !e.isMaster) {
      e.reply('每' + cdtime + '分钟只能投胎一次哦！')
      return true
    }
    CD[e.user_id] = true
    CD[e.user_id] = setTimeout(() => {
      if (CD[e.user_id]) delete CD[e.user_id]
    }, cdtime * 60 * 1000)

    // 随机获取角色名
    let identities = YAML.parse(fs.readFileSync(`${modResources}/yaml/identity.yaml`, 'utf-8'))
    let characterList = Object.keys(identities)
    let character = characterList[Math.floor(Math.random() * characterList.length)]

    if (!fs.existsSync(`${_path}/plugins/miao-plugin/resources/meta-gs/character/${character}/data.json`)) {
      logger.error('【抽卡插件】转生功能需要安装 喵喵插件 才能正常使用。')
      return false
    }

    // 获取身份
    let identity = identities[character]

    // 获取神之眼
    let element = GsCfg.getdefSet('element', 'role')[character]

    // 获取称号
    let data = JSON.parse(fs.readFileSync(`${_path}/plugins/miao-plugin/resources/meta-gs/character/${character}/data.json`, 'utf-8'))
    let title = data.title

    let colorData = YAML.parse(fs.readFileSync(`${modResources}/yaml/color.yaml`, 'utf-8'))
    let color = colorData[element]

    let base64 = await puppeteer.screenshot('flower-plugin', {
      tplFile: './plugins/flower-plugin/GachaMOD/Genshin/resources/html/relife/relife.html',
      pluResPath: `${_path}/plugins/flower-plugin/GachaMOD/Genshin/resources/`,
      saveId: 'genshinrelife',
      imgType: 'png',
      identity,
      title,
      element,
      color,
      character,
      card: `${_path}/plugins/miao-plugin/resources/meta-gs/character/${character}/imgs/card.webp`,
      splash: `${_path}/plugins/miao-plugin/resources/meta-gs/character/${character}/imgs/splash.webp`
    })
    await this.reply(base64)
    return true
  }
}
