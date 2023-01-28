import plugin from '../../../../../lib/plugins/plugin.js'
import { segment } from 'oicq'
import setting from "../model/setting.js";
import fs from "node:fs";
import { modResources } from "../model/MODpath.js";

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
  get appconfig() { return setting.getConfig("gacha") }

  async relife (e) {
    let cdtime = this.appconfig['relifeCD']
    if (CD[e.user_id] && !e.isMaster) {
      e.reply('每' + cdtime + '分钟只能投胎一次哦！')
      return true
    }
    CD[e.user_id] = true
    CD[e.user_id] = setTimeout(() => {
      if (CD[e.user_id]) delete CD[e.user_id]
    }, cdtime * 60 * 1000)
    const files = fs.readdirSync(`${modResources}/GenshinRelife/`)
    let number = Math.floor(Math.random() * files.length)
    await this.reply(segment.image(`${modResources}/GenshinRelife/${files[number]}`))

    return true
  }
}
