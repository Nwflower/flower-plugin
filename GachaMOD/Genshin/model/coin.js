import base from "./base.js";
import setting from "./setting.js";
import moment from "moment";
import lodash from 'lodash'

export default class Coin extends base {
  constructor (e) {
    super(e)
    this.model = 'coin'
    let config = setting.getConfig('coin')
    this.config = {...config.default,...config[this.e.group_id]}
  }

  static async init (e) {
    let coin = new Coin(e)
    // 领蓝球和粉球
    await coin.getCoin()
    return coin
  }

  async useCoin (type = 'role', num = 10){
    let coin = await this.getCoin()
    let flag = true
    // 主人不限制
    if (this.e.isMaster){ return true }
    if (type === 'permanent') {
      if(coin.blue - num >= 0) {
        coin.blue -= num
      } else {
        await this.e.reply(`你的相遇之缘不足。需要${num}个，你还有${coin.blue}个。`)
        flag = false
      }
    } else {
      if(coin.pink - num >= 0) {
        coin.pink -= num
      } else {
        await this.e.reply(`你的纠缠之缘不足。需要${num}个，你还有${coin.pink}个。`)
        flag = false
      }
    }
    this.user = coin
    await this.saveUser()
    return flag
  }

  get key () {
    return `${this.prefix}${this.userId}`
  }

  async setCoinConfig (groupID, sort = 'pink', num = 10){
    let config = setting.getConfig('coin')
    lodash.set(config, `${groupID}.${sort}`, num)
    setting.setConfig('coin', config)
  }

  async getCoinConfig (groupID){
    if (groupID){
      let config = setting.getConfig('coin')
      return config[groupID]
    } else {
      return this.config
    }
  }

  async getCoin () {
    if (this.user) return this.user
    let user = await redis.get(this.key)

    if (user) {
      user = await JSON.parse(user)
      if (this.getNow() > user.expire) { user = this.receive() }
    } else { user = this.receive() }
    this.user = user
    return user
  }

  async receive () {
    await this.e.reply(`今日成功领取${this.config.pink}个纠缠之缘和${this.config.blue}个相遇之缘`)
    return {  pink: this.config.pink , blue: this.config.blue, expire: this.getEnd().end4}
  }

  async saveUser () {
    let user = this.user
    user['expire'] = this.getEnd().end4
    await redis.setEx(this.key, 3600 * 24, JSON.stringify(user))
  }

  getNow () {
    return moment().format('X')
  }

  getEnd () {
    let end = moment().endOf('day').format('X')
    let end4 = 3600 * 4
    if (moment().format('k') < 4) {
      end4 += Number(moment().startOf('day').format('X'))
    } else { end4 += Number(end) }
    return { end, end4 }
  }
}