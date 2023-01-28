
import plugin from '../../../../../lib/plugins/plugin.js'
import GachaData from '../model/gachaData.js'
import lodash from 'lodash'
import puppeteer from '../../../../../lib/puppeteer/puppeteer.js'
import setting from "../model/setting.js";
import Coin from "../model/coin.js";
export class torrent extends plugin {
  constructor () {
    super({
      name: '抽卡插件十连',
      dsc: '模拟抽卡，每天十连一次，四点更新',
      event: 'message',
      priority: 99,
      rule: [
        {
          reg: '^#*(10|[武器池常驻]*([一二三四五六七八九]?[十百]+)|抽)[连抽卡奖][123武器池常驻]*$',
          fnc: 'gacha'
        },
        {
          reg: '(^#*定轨|^#定轨(.*))$',
          fnc: 'weaponBing'
        }
      ]
    })
  }

  // 获取配置单
  get appconfig() { return setting.getConfig("gacha") }

  // 十连
  async gacha () {
    // 初始化配置文件
    if (!this.appconfig.enable) { return false; }
    this.GachaData = await GachaData.init(this.e)

    // 获取抽卡次数
    let gachacishu = await this.cishu()
    if (!await this.checkLimit(gachacishu * 10)) return true

    if (Number(gachacishu) === 1 || isNaN(gachacishu)) {
      let data = await this.GachaData.run()
      /** 生成图片 */
      let img = await puppeteer.screenshot('gacha', data)
      if (!img) return false
      /** 撤回消息 */
      let recallMsg = this.GachaData.set.delMsg
      /** 出货了不撤回 */
      if (data.nowFive >= 1 || data.nowFour >= 4) {
        recallMsg = 0
      }
      await this.reply(img, false, { recallMsg })
    } else {
      let datas = []; let all5 = 0; let all4 = 0; let imgs = []; let w; let imgss = []
      for (let i = 1; i <= gachacishu; i++) {
        datas[i] = await this.GachaData.run()
        // eslint-disable-next-line no-unused-vars
        all5 += datas[i].nowFive
        // eslint-disable-next-line no-unused-vars
        all4 += datas[i].nowFour
        let img = await puppeteer.screenshot('gacha', datas[i])
        imgss.push(img)
        imgs.push({
          message: img,
          nickname: Bot.nickname,
          user_id: Bot.uin
        })
      }
      let recallMsg = this.GachaData.set.delMsg
      /** 出货了不撤回 */
      if (all5.nowFive >= 2 || all4.nowFour >= 25) {
        recallMsg = 0
      }
      if (this.e.isGroup) {
        w = await this.e.group.makeForwardMsg(imgs)
        await this.reply(w, false, { recallMsg })
      } else {
        await this.reply(imgss, false, { recallMsg })
      }
    }
  }

  /** 检查限制 */
  async checkLimit(num) {
    let { user } = this.GachaData

    this.Coin = await Coin.init(this.e)
    let limit = await this.Coin.useCoin(this.GachaData.type, num)

    let msg = lodash.truncate(this.e.sender.card, { length: 8 }) + '\n'
    if (!limit && user.today.star.length>0) {
      msg += '今日模拟抽卡五星：'
      if (user.today.star.length >= 8) {
        msg += `${user.today.star.length}个`
      } else {
        user.today.star.forEach(v => { msg += `${v.name}(${v.num})\n`})
        msg = lodash.trim(msg, '\n')
      }
      if (user.week.num >= 2) {
        msg += `\n本周：${user.week.num}个五星`
      }
    } else if (!limit){
      msg += `暂时无法抽卡。\n已累计${(this.GachaData.type === 'weapon')?user.today.weaponNum:user.today.num}抽无五星`
    }
    if (!limit){
      this.reply(msg, false, { recallMsg: this.GachaData.set.delMsg })
    }
    return limit
  }

  async weaponBing () {
    let Gacha = await GachaData.init(this.e)

    let { NowPool, user, msg = '' } = Gacha

    if (user.weapon.type >= 2) {
      user.weapon.type = 0
      user.weapon.bingWeapon = ''
      msg = '\n定轨已取消'
    } else {
      user.weapon.type++
      user.weapon.bingWeapon = NowPool.weapon5[user.weapon.type - 1]
      msg = []
      NowPool.weapon5.forEach((v, i) => {
        if (user.weapon.type - 1 === i) {
          msg.push(`[√] ${NowPool.weapon5[i]}`)
        } else {
          msg.push(`[  ] ${NowPool.weapon5[i]}`)
        }
      })
      msg = '定轨成功\n' + msg.join('\n')
    }
    user.weapon.lifeNum = 0
    Gacha.user = user
    await Gacha.saveUser()

    this.reply(msg, false, { at: this.e.user_id })
  }

  // 获取抽卡次数
  async cishu () {
    let each = this.e.msg.replace(/(0|1|池|武器|十|抽|单|连|卡|奖|2|3)/g, '').trim()
    let replaceArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '百']
    for (let i = 0; i <= 9; i++) {
      if (each.indexOf(replaceArr[i]) !== -1) {
        return (i + 1)
      }
    }
    return 1
  }
}
