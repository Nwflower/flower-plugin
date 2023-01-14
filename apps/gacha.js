/** 导入plugin */
import plugin from '../../../lib/plugins/plugin.js'
import GachaData from '../model/gachaData.js'
import fs from 'node:fs'
import lodash from 'lodash'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import { Cfg } from '../components/index.js'
export class gacha extends plugin {
  constructor () {
    super({
      name: '[抽卡插件]十连',
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

  /** #十连 */
  async gacha () {
    this.GachaData = await GachaData.init(this.e)
    if (!Cfg.get('gacha.diy', true)) { return false }
    if (this.checkLimit()) return

    let gachacishu = await this.cishu()

    if (Number(gachacishu) === 1 || isNaN(gachacishu)) {
      let data = await this.GachaData.run()
      /** 生成图片 */
      let img = await puppeteer.screenshot('gacha', data)
      if (!img) return
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
        datas[i] = await this.GachaData.run(this.GachaData.set.tenGacha === 1)
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
  checkLimit () {
    /** 主人不限制 */
    if (this.e.isMaster) return false

    let { user } = this.GachaData
    let { num, weaponNum } = user.today

    let nowCount = num
    if (this.GachaData.type == 'weapon') nowCount = weaponNum

    if (this.GachaData.set.LimitSeparate == 1) {
      if (nowCount < this.GachaData.set.count * 10) return false
    } else {
      if (num + weaponNum < this.GachaData.set.count * 10) return false
    }

    let msg = lodash.truncate(this.e.sender.card, { length: 8 }) + '\n'

    if (user.today.star.length > 0) {
      msg += '今日抽卡已达上限\n五星：'
      if (user.today.star.length >= 4) {
        msg += `${user.today.star.length}个`
      } else {
        user.today.star.forEach(v => {
          msg += `${v.name}(${v.num})\n`
        })
        msg = lodash.trim(msg, '\n')
      }
      if (user.week.num >= 2) {
        msg += `\n本周：${user.week.num}个五星`
      }
    } else {
      msg += `今日抽卡已达上限\n累计${nowCount}抽无五星`
    }
    this.reply(msg, false, { recallMsg: this.GachaData.set.delMsg })
    return true
  }

  /** #定轨 */
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
        if (user.weapon.type - 1 == i) {
          msg.push(`[√] ${NowPool.weapon5[i]}`)
        } else {
          msg.push(`[  ] ${NowPool.weapon5[i]}`)
        }
      })
      msg = '定轨成功\n' + msg.join('\n')
    }
    /** 命定值清零 */
    user.weapon.lifeNum = 0
    Gacha.user = user
    await Gacha.saveUser()

    this.reply(msg, false, { at: this.e.user_id })
  }

  /** 初始化创建配置文件 */
  async init () {
    await GachaData.getStr()

    if (fs.existsSync(process.cwd().replace(/\\/g, '/') + '/plugins/flower-plugin/config/gacha.set.yaml')) return

    fs.copyFileSync(process.cwd().replace(/\\/g, '/') + '/plugins/flower-plugin/defSet/gacha/set.yaml', './plugins/flower-plugin/config/gacha.set.yaml')
  }

  /** 获取抽卡次数 */
  async cishu () {
    let each = this.e.msg.replace(/(0|1|[武器池]*|十|抽|单|连|卡|奖|2|3)/g, '').trim()
    let replaceArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '百']
    for (let i = 0; i <= 9; i++) {
      if (each.indexOf(replaceArr[i]) !== -1) {
        return (i + 1)
      }
    }
    return 1
  }
}
