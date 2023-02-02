import plugin from '../../../lib/plugins/plugin.js'
import setting from "../model/setting.js";
import block from "../GachaMOD/Genshin/model/block.js";
import Common from "../../../lib/common/common.js";
import fs from "fs";
import { _path } from "../model/path.js";

export class setBlock extends plugin {
  constructor () {
    super({
      name: '抽卡插件隐形拉黑',
      dsc: '降低拉黑用户的抽卡概率、且请求喵喵面板时总是失败',
      event: 'message',
      priority: 7,
      rule: [{
        reg: '^#*隐形拉黑[0-9]*$',
        fnc: 'setBlock'
      },{
        reg: '^#*取消隐形拉黑[0-9]*$',
        fnc: 'delBlock'
      },{
        reg: '^#*隐形拉黑(名单|列表)$',
        fnc: 'getBlock'
      },{
        reg: '^#*(全部面板更新|更新全部面板|获取游戏角色详情|更新面板|面板更新).*',
        log: false,
        fnc: 'getProfile'
      },{
        reg: '面板',
        log: false,
        fnc: 'Profile'
      },{
        reg: '体力',
        fnc: 'spirit'
      }]
    })
    
    this.config = setting.getConfig('block')
  }

  // 体力返回验证码
  async spirit () {
    if (!this.config.enable) { return false }
    if (!block.getBlockBoolean(this.e.user_id)){ return false }
    await Common.sleep(500)
    this.reply('米游社遇到验证码，请稍后重试')
    return true
  }

  // 获取喵喵面板的CD
  async setCd (seconds = 60) {
    let ext = new Date() * 1 + seconds * 1000
    await redis.set(`miao:profile-cd:${this.e.uid}`, ext + '', { EX: seconds })
  }

  async inCd () {
    let ext = await redis.get(`miao:profile-cd:${this.e.uid}`)
    if (!ext || isNaN(ext)) {
      return false
    }
    let cd = (new Date() * 1) - ext
    if (cd < 0 && Math.abs(cd) < 100 * 60 * 1000) {
      return Math.ceil(0 - cd / 1000)
    }
    return false
  }

  async getProfile () {
    // 模拟喵喵面板获取 黑名单用户直接返回失败
    if (!this.config.enable) { return false }
    if (!block.getBlockBoolean(this.e.user_id)){ return false }
    let uid = await this.e.runtime.getUid()

    let cdTime = await this.inCd()
    if (cdTime) {
      this.reply(`请求过快，请${cdTime}秒后重试..`)
      return true
    }

    this.reply(`开始获取uid:${uid}的数据，可能会需要一定时间~`)
    await Common.sleep(2500)
    this.reply(`请求失败，可能是面板服务升级维护或遇到故障，请稍后重试...`)

    await this.setCd(300)
    return true
  }

  async Profile () {
    // 黑名单用户删除本地缓存的喵喵面板并且同时屏蔽喵喵面板的自动更新
    if (!this.config.enable) { return false }
    if (!block.getBlockBoolean(this.e.user_id)){ return false }
    let uid = await this.e.runtime.getUid()
    if (fs.existsSync(`${_path}/data/UserData/${uid}.json`)){ fs.unlinkSync(`${_path}/data/UserData/${uid}.json`) }
    await redis.set(`miao:profile-refresh-cd:${uid}`, 'TRUE', { EX: 3600 * 12 })
    return false
  }

  async setBlock () {
    if (!this.e.isMaster) { return false }
    if (!this.config.enable) { return false }
    let msg = this.e.msg.replace(/#*隐形拉黑/g,'').trim()
    let qq = parseInt(msg)
    if (!qq || isNaN(qq)) { this.reply('请输入正确的QQ号') } else {
      let config = setting.getConfig('block')
      let list = config.list
      if (!(list.includes(qq) || list.includes(qq.toString()))) {
        list.push(qq);
      }
      await this.reply(`已拉黑用户${qq.toString()}`)
      config.list = list
      setting.setConfig('block', config)
    }
    return true
  }

  async delBlock () {
    if (!this.e.isMaster) { return false }
    if (!this.config.enable) { return false }
    let msg = this.e.msg.replace(/#*取消隐形拉黑/g,'').trim()
    logger.info(msg)
    let qq = parseInt(msg)
    logger.info(qq)
    if (!qq) { this.reply('请输入正确的QQ号') } else {
      let config = setting.getConfig('block')
      let list = config.list
      list.remove = function(val) {
        let index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      if (list.includes(qq) || list.includes(qq.toString())) {
        list.remove(qq);
      }
      await this.reply(`已取消拉黑用户${qq.toString()}`)
      config.list = list
      setting.setConfig('block', config)
    }
    return true
  }

  async getBlock () {
    if (!this.e.isMaster) { return false }
    if (!this.config.enable) { return false }
    let config = setting.getConfig('block')
    let list = config.list
    await this.reply(`隐形拉黑用户列表${list.join('\n')}`)
    return true
  }
}
