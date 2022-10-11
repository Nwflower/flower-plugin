/** 导入plugin */
import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import gsCfg from '../model/gsCfg.js'
import fs from 'fs'
import moment from 'moment'
import { segment } from 'oicq'

export class singlegacha extends plugin {
  constructor () {
    super({
      name: '单抽',
      dsc: '模拟抽卡，单抽一次，必出四星及以上角色',
      event: 'message.group',
      priority: 98,
      rule: [
        {
          reg: '^#*单抽$',
          fnc: 'gacha'
        }
      ]
    })
    this._path = process.cwd().replace(/\\/g, '/')
    this.model = 'single'
    this.ele = gsCfg.element
  }

  /** #十连 */
  async gacha () {
    this.set = gsCfg.getGachaSet(this.e.group_id)
    await this.userData()
    const files = fs
      .readdirSync(`${this._path}/plugins/flower-plugin/resources/gacha/single/role`)
      .filter((file) => file.endsWith('.png'))
    let k = 2
    let i = k
    let recallMsg = this.set.delMsg
    this.user.today.num++
    if (!fs.existsSync(`${this._path}/plugins/flower-plugin/data/single/`)) {
      fs.mkdirSync(`${this._path}/plugins/flower-plugin/data/single/`)
    }
    if (fs.existsSync(`${this._path}/plugins/flower-plugin/data/single/${i}.png`)) {
      await this.reply(segment.image(`${this._path}/plugins/flower-plugin/data/single/${i}.png`), false, { recallMsg })
    } else {
      for (let file of files) {
        if (k-- === 0) {
          file = file.replace('.png', '').trim()
          let star = '4'
          if (gsCfg.getStar(gsCfg.roleNameToID(file))) {
            star = '5'
          }
          let base64 = await puppeteer.screenshot('sysCfg', {
            tplFile: `./plugins/flower-plugin/resources/html/${this.model}/single.html`,
            /** 绝对路径 */
            pluResPath: `${this._path}/plugins/flower-plugin/resources/`,
            saveId: 'sysCfg',
            imgType: 'png',
            name: file,
            star,
            element: this.ele[file]
          })
          await this.reply(base64, false, { recallMsg })
          fs.writeFileSync(`${this._path}/plugins/flower-plugin/data/single/${i}.png`, base64.file, 'base64')
        }
      }
    }
    return true
  }

  getNow () {
    return moment().format('X')
  }

  getEnd () {
    let end = moment().endOf('day').format('X')
    let end4 = 3600 * 4
    if (moment().format('k') < 4) {
      end4 += Number(moment().startOf('day').format('X'))
    } else {
      end4 += Number(end)
    }
    return { end, end4 }
  }

  getWeekEnd () {
    return Number(moment().day(7).endOf('day').format('X'))
  }

  get key () {
    /** 群，私聊分开 */
    if (this.e.isGroup) {
      return `${this.prefix}${this.e.group_id}:${this.userId}`
    } else {
      return `${this.prefix}private:${this.userId}`
    }
  }

  /** 用户数据 */
  async userData () {
    if (this.user) return this.user

    let user = await redis.get(this.key)

    if (user) {
      user = JSON.parse(user)
      /** 重置今日数据 */
      if (this.getNow() > user.today.expire) {
        user.today = { star: [], expire: this.getEnd().end4, num: 0, weaponNum: 0 }
      }
      /** 重置本周数据 */
      if (this.getNow() > user.week.expire) {
        user.week = { num: 0, expire: this.getWeekEnd() }
      }
    } else {
      let commom = { num4: 0, isUp4: 0, num5: 0, isUp5: 0 }
      user = {
        permanent: commom,
        role: commom,
        weapon: {
          ...commom,
          /** 命定值 */
          lifeNum: 0,
          /** 定轨 0-取消 1-武器1 2-武器2 */
          type: 1
        },
        today: { star: [], expire: this.getEnd().end4, num: 0, weaponNum: 0 },
        week: { num: 0, expire: this.getWeekEnd() }
      }
    }

    this.user = user

    return user
  }
}
