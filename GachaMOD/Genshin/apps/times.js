import plugin from '../../../../../lib/plugins/plugin.js'
import lodash from 'lodash'
import YAML from 'yaml'
import fs from 'node:fs'
import Coin from "../model/coin.js";
import GsCfg from "../../../../genshin/model/gsCfg.js";

let cfgMap = {
  蓝球: 'blue',
  粉球: 'pink',
  撤回时间: 'delMsg'
}

let sysCfgReg = `^#*设置抽卡\\s*(${lodash.keys(cfgMap).join('|')})?\\s*(.*)$`
export class times extends plugin {
  constructor () {
    super({
      name: '抽卡次数管理',
      dsc: '管理抽卡插件',
      event: 'message',
      priority: 1704,
      rule: [
        {
          reg: sysCfgReg,
          fnc: 'sysCfg'
        }
      ]
    })
    this._path = process.cwd().replace(/\\/g, '/')
    this.resPath = `${this._path}/plugins/flower-plugin/resources`
    this.model = 'sysCfg'


    this.configPath = './plugins/genshin/config/'
  }

  async sysCfg (e) {
    if (!e.isMaster) { return true }
    let ob = (this.e.isGroup) ? `${parseInt(this.e.group_id)}` : 'default'

    let cfgReg = new RegExp(sysCfgReg)
    let regRet = cfgReg.exec(e.msg)
    if (!regRet) { return true }
    let groupset = await GsCfg.getConfig('gacha','set')
    if (e.isGroup) {
      if (groupset[ob] === undefined) {
        groupset[ob] = groupset.default
      }
      if (groupset[ob].delMsg === undefined) {
        groupset[ob].delMsg = groupset.default.delMsg
      }
    }

    let coin = new Coin(e)
    if (regRet[1]) {
      // 设置模式
      let val = regRet[2] || ''
      let cfgKey = cfgMap[regRet[1]]

      switch (cfgKey) {
        case 'blue':
          val = Math.min(10000, Math.max(1, val * 1))
          await coin.setCoinConfig(ob, cfgKey, val)
          break
        case 'pink':
          val = Math.min(10000, Math.max(1, val * 1))
          await coin.setCoinConfig(ob, cfgKey, val)
          break
        case 'delMsg':
          val = Math.min(120, Math.max(0, val * 1))
          groupset[ob].delMsg = val
          break
      }
    }
    let coinConfig = { ...await coin.getCoinConfig(ob),...await coin.getCoinConfig(ob)}
    let msgs = [
      `当前本群每日粉球：${coinConfig.pink}，修改命令#设置抽卡粉球100`,
      `当前本群每日蓝球：${coinConfig.blue}，修改命令#设置抽卡蓝球10`,
      `当前本群抽卡撤回时间：${groupset[ob].delMsg}秒，修改命令#设置抽卡撤回时间100`,
    ]
    let msg = []
    for (let m of msgs) {
      msg.push({
        message: m,
        nickname: Bot.nickname,
        user_id: Bot.uin
      })
    }
    let sed = await Bot.pickFriend(Bot.uin).makeForwardMsg(msg)
    fs.writeFileSync(`${this.configPath}gacha.set.yaml`, YAML.stringify(groupset))
    await this.reply(sed, false, groupset[ob].delMsg)
    return true
  }
}