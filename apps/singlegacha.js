/** 导入plugin */
import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import gsCfg from '../model/gsCfg.js'
import fs from 'fs'
import moment from 'moment'
import pool from '../model/pool.js'
import lodash from 'lodash'
import GachaData from '../model/gachaData.js'

export class singlegacha extends plugin {
  constructor () {
    super({
      name: '单抽',
      dsc: '模拟抽卡色',
      event: 'message',
      priority: 98,
      rule: [
        {
          reg: '^#*单抽[12武器池常驻]*$',
          fnc: 'gacha'
        }
      ]
    })
    this._path = process.cwd().replace(/\\/g, '/')
    this.model = 'single'
    this.ele = gsCfg.element
    /** 卡池 */
    this.pool = {}
    /** 默认角色池 */
    this.type = 'role'
    /** 抽卡结果 */
    this.res = []
    this.isweaponpool = false
  }

  init () {
    if (!fs.existsSync('${this._path}/plugins/flower-plugin/data/single/')){
      fs.mkdirSync('${this._path}/plugins/flower-plugin/data/single/', { recursive: true });
    }
  }

  async gacha () {
    this.GachaData = await GachaData.init(this.e)

    this.def = gsCfg.getConfig('gacha', 'gacha')
    if (this.e.group_id) {
      this.set = gsCfg.getGachaSet(this.e.group_id)
    } else {
      this.set = this.def
    }
    await this.getTpye()
    await this.getPool()
    await this.userData()
    this.res = this.lottery()
    let recallMsg = this.set.delMsg

    let base64 = await puppeteer.screenshot('sysCfg', {
      tplFile: `./plugins/flower-plugin/resources/html/${this.model}/single.html`,
      /** 绝对路径 */
      pluResPath: `${this._path}/plugins/flower-plugin/resources/`,
      saveId: 'sysCfg',
      imgType: 'png',
      name: this.res.name,
      star: this.res.star,
      element: this.res.element,
      type: this.res.type,
      info: this.res.info,
      isWeaponPool: this.isweaponpool,
      ...this.lotteryInfo(),
      isWeapon: (this.res.type === 'weapon')
    })
    await this.reply(base64, false, { recallMsg })
    fs.writeFileSync(`${this._path}/plugins/flower-plugin/data/single/${this.res.name}.png`, base64.file, 'base64')

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

  getTpye () {
    if (this.e.msg.includes('2')) this.role2 = true
    if (this.e.msg.includes('武器')) this.type = 'weapon'
    if (this.e.msg.includes('常驻')) this.type = 'permanent'
  }

  getWeekEnd () {
    return Number(moment().day(7).endOf('day').format('X'))
  }

  get key () {
    /** 群，私聊分开 */
    if (this.e.isGroup) {
      return `${this.e.group_id}:${this.userId}`
    } else {
      return `private:${this.userId}`
    }
  }

  /** 奖池数据 */
  async getPool () {
    let NowPool = pool.getPool(this.e.user_id)
    /** 获取设置卡池 */
    this.NowPool = NowPool

    if (this.type === 'weapon') {
      let weapon4 = lodash.difference(this.def.weapon4, NowPool.weapon4)
      let weapon5 = lodash.difference(this.def.weapon5, NowPool.weapon5)
      this.isweaponpool = true
      this.pool = {
        up4: NowPool.weapon4,
        role4: this.def.role4,
        weapon4,
        up5: NowPool.weapon5,
        five: weapon5
      }
    }

    if (this.type === 'role') {
      let role4 = lodash.difference(this.def.role4, NowPool.up4)
      let role5 = lodash.difference(this.def.role5, NowPool.up5)

      let up5 = NowPool.up5
      if (this.role2) up5 = NowPool.up5_2

      this.pool = {
        /** up卡池 */
        up4: NowPool.up4,
        /** 常驻四星 */
        role4,
        /** 常驻四星武器 */
        weapon4: this.def.weapon4,
        /** 五星 */
        up5,
        /** 常驻五星 */
        five: role5
      }
    }

    if (this.type === 'permanent') {
      this.pool = {
        up4: [],
        role4: this.def.role4,
        weapon4: this.def.weapon4,
        up5: [],
        five: this.def.role5,
        fiveW: this.def.weapon5
      }
    }

    this.pool.weapon3 = this.def.weapon3
  }

  /** 用户数据 */
  async userData () {
    let { user } = this.GachaData

    if (user) {
      // user = JSON.parse(user)
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

  /**
   * 抽奖
   */
  lottery (save = true) {
    /** 十连抽 */
    if (this.type === 'weapon') { this.user.today.weaponNum++ } else { this.user.today.num++ }
    if (!this.lottery5()) { if (!this.lottery4()) { this.lottery3() } }
    if (save) this.saveUser()
    return this.res
  }

  lottery5 () {
    /** 是否大保底 */
    let isBigUP = false
    let isBing = false
    let tmpChance5 = this.probability()
    let type = this.type
    /** 没有抽中五星 */
    if (lodash.random(1, 10000) > tmpChance5) {
      /** 五星保底数+1 */
      this.user[this.type].num5++
      return false
    }

    let nowCardNum = this.user[this.type].num5 + 1

    /** 五星保底清零 */
    this.user[this.type].num5 = 0
    /** 四星保底数+1 */
    this.user[this.type].num4++

    let tmpUp = this.def.wai

    /** 已经小保底 */
    if (this.user[this.type].isUp5 === 1) {
      tmpUp = 101
    }

    if (this.type === 'permanent') tmpUp = 0

    let tmpName = ''
    if (this.type === 'weapon' && this.user[this.type].lifeNum >= 2) {
      /** 定轨 */
      tmpName = this.getBingWeapon()
      this.user[this.type].lifeNum = 0
      isBing = true
    } else if (lodash.random(1, 100) <= tmpUp) {
      /** 当祈愿获取到5星角色时，有50%的概率为本期UP角色 */
      if (this.user[this.type].isUp5 === 1) isBigUP = true
      /** 大保底清零 */
      this.user[this.type].isUp5 = 0
      /** 抽取up */
      tmpName = lodash.sample(this.pool.up5)

      /** 定轨清零 */
      if (tmpName === this.getBingWeapon()) {
        this.user[this.type].lifeNum = 0
      }
    } else {
      if (this.type === 'permanent') {
        if (lodash.random(1, 100) <= 50) {
          tmpName = lodash.sample(this.pool.five)
          type = 'role'
        } else {
          tmpName = lodash.sample(this.pool.fiveW)
          type = 'weapon'
        }
      } else {
        /** 歪了 大保底+1 */
        this.user[this.type].isUp5 = 1
        tmpName = lodash.sample(this.pool.five)
      }
    }

    /** 命定值++ */
    if (tmpName !== this.getBingWeapon()) {
      this.user[this.type].lifeNum++
    }

    /** 记录今天五星 */
    this.user.today.star.push({ name: tmpName, num: nowCardNum })
    /** 本周五星数 */
    this.user.week.num++

    this.res = {
      name: tmpName,
      star: 5,
      type,
      num: nowCardNum,
      element: this.ele[tmpName] || '',
      isBigUP,
      isBing,
      rand: lodash.random(1, 7)
    }
    return true
  }

  lottery4 () {
    let tmpChance4 = this.def.chance4

    /** 四星保底 */
    if (this.user[this.type].num4 >= 9) {
      tmpChance4 += 10000
    } else if (this.user[this.type].num4 >= 5) {
      tmpChance4 = tmpChance4 + Math.pow(this.user[this.type].num4 - 4, 2) * 500
    }

    /** 没抽中四星 */
    if (lodash.random(1, 10000) > tmpChance4) {
      /** 四星保底数+1 */
      this.user[this.type].num4++
      return false
    }

    /** 保底四星数清零 */
    this.user[this.type].num4 = 0

    /** 四星保底 */
    let tmpUp = 50
    if (this.type == 'weapon') tmpUp = 75

    if (this.user[this.type].isUp4 == 1) {
      this.user[this.type].isUp4 = 0
      tmpUp = 100
    }

    if (this.type == 'permanent') tmpUp = 0

    let type = 'role'
    let tmpName = ''
    /** 当祈愿获取到4星物品时，有50%的概率为本期UP角色 */
    if (lodash.random(1, 100) <= tmpUp) {
      /** up 4星 */
      tmpName = lodash.sample(this.pool.up4)
      type = this.type
    } else {
      this.user[this.type].isUp4 = 1
      /** 一半概率武器 一半4星 */
      if (lodash.random(1, 100) <= 50) {
        tmpName = lodash.sample(this.pool.role4)
        type = 'role'
      } else {
        tmpName = lodash.sample(this.pool.weapon4)
        type = 'weapon'
      }
    }

    this.res = {
      name: tmpName,
      star: 4,
      type,
      element: this.ele[tmpName] || ''
    }

    return true
  }

  lottery3 () {
    /** 随机三星武器 */
    let tmpName = lodash.sample(this.pool.weapon3)
    this.res = {
      name: tmpName,
      star: 3,
      type: 'weapon',
      element: this.ele[tmpName] || ''
    }

    return true
  }

  probability () {
    let tmpChance5 = this.def.chance5

    if (this.type == 'role' || this.type == 'permanent') {
      /** 增加双黄概率 */
      if (this.user.week.num == 1) {
        tmpChance5 *= 2
      }

      /** 保底 */
      if (this.user[this.type].num5 >= 90) {
        tmpChance5 = 10000
      } else if (this.user[this.type].num5 >= 74) {
        /** 74抽之后逐渐增加概率 */
        tmpChance5 = 590 + (this.user[this.type].num5 - 74) * 530
      } else if (this.user[this.type].num5 >= 60) {
        /** 60抽之后逐渐增加概率 */
        tmpChance5 = this.def.chance5 + (this.user[this.type].num5 - 50) * 40
      }
    }

    if (this.type == 'weapon') {
      tmpChance5 = this.def.chanceW5

      /** 增加双黄概率 */
      if (this.user.week.num == 1) {
        tmpChance5 = tmpChance5 * 3
      }

      /** 80次都没中五星 */
      if (this.user[this.type].num5 >= 80) {
        tmpChance5 = 10000
      } else if (this.user[this.type].num5 >= 62) {
        /** 62抽后逐渐增加概率 */
        tmpChance5 = tmpChance5 + (this.user[this.type].num5 - 61) * 700
      } else if (this.user[this.type].num5 >= 45) {
        /** 50抽后逐渐增加概率 */
        tmpChance5 = tmpChance5 + (this.user[this.type].num5 - 45) * 60
      } else if (this.user[this.type].num5 >= 10 && this.user[this.type].num5 <= 20) {
        tmpChance5 = tmpChance5 + (this.user[this.type].num5 - 10) * 30
      }
    }

    return tmpChance5
  }

  /** 获取定轨的武器 */
  getBingWeapon (sortName = false) {
    if (this.type != 'weapon') return false

    let name = this.pool.up5[this.user[this.type].type - 1]

    if (sortName) {
      name = gsCfg.shortName(name, true)
    }

    return name
  }

  lotteryInfo () {
    let info = `累计「${this.user[this.type].num5}抽」`
    let nowFive = 0
    let nowFour = 0

    if (this.res.star === 5) {
      nowFive++
      info = `${this.res.name}「${this.res.num}抽」`
      if (this.res.isBigUP) info += '大保底'
      if (this.res.isBing) info += '定轨'
    }
    if (this.res.star === 4) {
      nowFour++
    }

    let poolName = `角色池：${gsCfg.shortName(this.pool.up5[0])}`
    if (this.type === 'permanent') poolName = '常驻池'

    let res = {
      info,
      nowFive,
      nowFour,
      poolName,
      isWeapon: this.type === 'weapon',
      bingWeapon: this.getBingWeapon(true),
      lifeNum: this.user[this.type]?.lifeNum || 0
    }

    logger.debug(`[${poolName}] [五星数：${nowFive}] [${info}] [定轨：${res.lifeNum}]`)

    return res
  }

  async saveUser () {
    let Gacha = await GachaData.init(this.e)
    Gacha.user = this.user
    await Gacha.saveUser()
  }
}
