/** 导入plugin */
import plugin from '../../../lib/plugins/plugin.js'
import lodash from 'lodash'
import { Cfg } from '../components/index.js'
import YAML from 'yaml'
import fs from 'node:fs'
import gsCfg from '../model/gsCfg.js'

let cfgMap = {
  每日次数: 'group.cishu',
  撤回消息秒数: 'group.del',
  分计: 'pool.open',
  百连十次: 'pool.hun'
}

let sysCfgReg = `^#*设置抽卡\\s*(${lodash.keys(cfgMap).join('|')})?\\s*(.*)$`
export class times extends plugin {
  constructor () {
    super({
      name: '抽卡次数管理',
      dsc: '管理抽卡插件',
      event: 'message',
      priority: 101,
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

    /** 默认设置 */
    this.defSetPath = './plugins/flower-plugin/defSet/'

    /** 用户设置 */
    this.configPath = './plugins/flower-plugin/config/'
  }

  async sysCfg (e) {
    if (!e.isMaster) {
      return true
    }
    let ob = (this.e.isGroup) ? `${parseInt(this.e.group_id)}` : 'default'
    let cfgReg = new RegExp(sysCfgReg)
    let regRet = cfgReg.exec(e.msg)

    if (!regRet) {
      return true
    }
    let groupset = YAML.parse(fs.readFileSync(`${this.configPath}gacha.set.yaml`, 'utf8'))

    if (e.isGroup) {
      let set = gsCfg.getGachaSet(this.e.group_id)
      if (groupset[ob] === undefined) {
        groupset[ob] = set
      }
      if (groupset[ob].count === undefined) {
        groupset[ob].count = set.count
      }
      if (groupset[ob].LimitSeparate === undefined) {
        groupset[ob].LimitSeparate = set.LimitSeparate
      }
      if (groupset[ob].delMsg === undefined) {
        groupset[ob].delMsg = set.delMsg
      }
      if (groupset[ob].tenGacha === undefined) {
        groupset[ob].tenGacha = set.tenGacha
      }
    }

    if (regRet[1]) {
      // 设置模式
      let val = regRet[2] || ''
      let cfgKey = cfgMap[regRet[1]]

      switch (cfgKey) {
        case 'group.cishu':
          val = Math.min(10000, Math.max(1, val * 1))
          groupset[ob].count = val
          cfgKey = false
          break
        case 'group.del':
          val = Math.min(120, Math.max(0, val * 1))
          groupset[ob].delMsg = val
          cfgKey = false
          break
        case 'pool.open':
          groupset[ob].LimitSeparate = val === '开启' ? 1 : 0
          cfgKey = false
          break
        case 'pool.hun':
          groupset[ob].tenGacha = val === '开启' ? 1 : 0
          cfgKey = false
          break
        default:
          val = !/关闭/.test(val)
          break
      }
      if (cfgKey) {
        Cfg.set(cfgKey, val)
      }
    }
    let fenkai = (groupset[ob].LimitSeparate) ? '是' : '否'
    let bailian = (groupset[ob].tenGacha) ? '是' : '否'
    let msgs = [
      `当前本群每日抽卡次数：${groupset[ob].count}，修改命令#设置抽卡每日次数100`,
      `当前本群抽卡撤回消息秒数：${groupset[ob].delMsg}，修改命令#设置抽卡撤回消息秒数100`,
      `当前本群武器池和角色池抽卡次数限制是否分开：${fenkai}，修改命令#设置抽卡分计关闭`,
      `当前本群百连是否消耗十次抽卡次数：${bailian}，修改命令#设置抽卡百连十次关闭`
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
