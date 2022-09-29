/** 导入plugin */
import plugin from '../../../lib/plugins/plugin.js'
import { currentVersion, yunzaiVersion } from '../components/Changelog.js'
import lodash from 'lodash'
import YAML from 'yaml'
import fs from 'node:fs'
import { Cfg } from '../components/index.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import { exec } from 'child_process'
import gsCfg from '../model/gsCfg.js'

let cfgMap = {
  自定义: 'gacha.diy',
  小保底概率: 'gachas.wai',
  五星角色概率: 'gachas.chance5',
  四星角色概率: 'gachas.chance4',
  五星武器概率: 'gachas.chanceW5',
  四星武器概率: 'gachas.chanceW4',
  概率复位: 'gacha.setchance',
  五星角色: 'genshin.c5',
  四星角色: 'genshin.c4',
  五星武器: 'genshin.w5',
  四星武器: 'genshin.w4',
  随机卡池: 'gacha.random',
  卡池同步: 'gacha.get',
  转生间隔: 'relife.time',
  群名片频率: 'card.hz',
  群名片复位: 'card.set',
  违禁词: 'word.listen',
  屏蔽词: 'word.listen'
}

let sysCfgReg = `^#抽卡设置\\s*(${lodash.keys(cfgMap).join('|')})?\\s*(.*)$`
let timer
let defSetPath = './plugins/flower-plugin/defSet/'
let configPath = './plugins/flower-plugin/config/'
export class admin extends plugin {
  constructor () {
    super({
      name: '抽卡插件管理',
      dsc: '管理抽卡插件',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: sysCfgReg,
          fnc: 'sysCfg'
        },
        {
          reg: '^#*抽卡(插件)?(强制)?更新$',
          fnc: 'updateGachaPlugin'
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
    if (!e.isMaster) { return true }
    let cfgReg = new RegExp(sysCfgReg)
    let regRet = cfgReg.exec(e.msg)
    if (!regRet) { return true }

    let pool = getPool()
    let probability = getConfig('gacha', 'gacha')
    let random = getConfig('gacha', 'random')
    let star = gsCfg.getdefSet('role', 'other')
    if (regRet[1]) {
      // 设置模式
      let val = regRet[2] || ''
      let arr = []
      let cfgKey = cfgMap[regRet[1]]

      switch (cfgKey) {
        case 'gachas.chance5':
          probability.chance5 = getValMath(val, 0, 10000)
          cfgKey = false// 取消独立验证
          break
        case 'gachas.chance4':
          probability.chance4 = getValMath(val, 0, 10000)
          cfgKey = false// 取消独立验证
          break
        case 'gachas.chanceW5':
          probability.chanceW5 = getValMath(val, 0, 10000)
          cfgKey = false// 取消独立验证
          break
        case 'gachas.chanceW4':
          probability.chanceW4 = getValMath(val, 0, 10000)
          cfgKey = false// 取消独立验证
          break
        case 'gachas.wai':
          probability.wai = getValMath(val, 0, 100)
          cfgKey = false// 取消独立验证
          break
        case 'gacha.setchance':
          probability.chance5 = 60
          probability.chance4 = 510
          probability.chanceW5 = 70
          probability.chanceW4 = 600
          probability.wai = 50
          cfgKey = false// 取消独立验证
          break
        case 'genshin.c5':
          arr = val.replaceAll('，', ',').split(',')
          if (!arr) {
            e.reply('当前卡池里找不到指定的角色哦！')
            return true
          }
          // eslint-disable-next-line no-case-declarations
          let p51 = []; let p52 = []
          p51.push(arr[0])
          pool.up5 = p51
          if (arr.length === 1) {
            pool.up5_2 = pool.up5
          } else {
            p52.push(arr[1])
            pool.up5_2 = p52
          }
          setConfig('gacha', 'pool', pool)
          cfgKey = false// 取消独立验证
          break
        case 'genshin.w5':
          arr = val.replaceAll('，', ',').split(',')
          if (arr.length !== 2) {
            e.reply('设置格式有误，再试一试吧！')
            return true
          }
          pool.weapon5 = arr
          setConfig('gacha', 'pool', pool)
          cfgKey = false// 取消独立验证
          break
        case 'genshin.w4':
          arr = val.replaceAll('，', ',').split(',')
          if (arr.length === 0) {
            e.reply('设置格式有误，再试一试吧！')
            return true
          }
          pool.weapon4 = arr
          setConfig('gacha', 'pool', pool)
          cfgKey = false// 取消独立验证
          break
        case 'genshin.c4':
          arr = val.replaceAll('，', ',').split(',')
          pool.up4 = arr
          setConfig('gacha', 'pool', pool)
          cfgKey = false// 取消独立验证
          break
        case 'gacha.random':
          // eslint-disable-next-line no-case-declarations
          let wea = []; let wea4 = []; let r4 = []; let allw5; let w1; let we4; let p511 = []; let p522 = []
          p511.push(gsCfg.roleIdToName(lodash.sample(star.five)))
          p522.push(gsCfg.roleIdToName(lodash.sample(star.five)))
          pool.up5 = p511
          pool.up5_2 = p522
          r4.push(gsCfg.roleIdToName(lodash.sample(star.four)))
          r4.push(gsCfg.roleIdToName(lodash.sample(star.four)))
          r4.push(gsCfg.roleIdToName(lodash.sample(star.four)))
          pool.up4 = r4
          allw5 = random.allUP5w
          we4 = random.allUP4w
          w1 = lodash.sample(allw5)
          wea.push(w1)
          allw5 = lodash.difference(allw5, w1)
          wea.push(lodash.sample(allw5))
          pool.weapon5 = wea
          for (let i = 0; i < 5; i++) {
            w1 = lodash.sample(we4)
            we4 = lodash.difference(we4, w1)
            wea4.push(w1)
          }
          pool.weapon4 = wea4
          setConfig('gacha', 'pool', pool)
          cfgKey = false// 取消独立验证
          break
        case 'gacha.get':
          // eslint-disable-next-line no-case-declarations
          let poolArr = gsCfg.getdefSet('gacha', 'pool')
          poolArr = [...poolArr].reverse()
          /** 获取设置卡池 */
          pool = poolArr.find((val) => new Date().getTime() <= new Date(val.endTime).getTime()) || poolArr.pop()
          setConfig('gacha', 'pool', pool)
          cfgKey = false// 取消独立验证
          break
        case 'relife.time':
          val = Math.min(1440, Math.max(1, val * 1))
          break
        case 'card.hz':
          val = Math.min(1440, Math.max(0, val * 1))
          break
        case 'card.set':
          Bot.gl.forEach((v, k) => { Bot.pickGroup(k).setCard(Bot.uin, Bot.nickname) })
          this.reply('所有群名片已复位为' + Bot.nickname)
          return true
        default:
          val = !/关闭/.test(val)
          break
      }
      if (cfgKey) {
        Cfg.set(cfgKey, val)
      }
    }
    let genshincharact5 = pool.up5 + ',' + pool.up5_2
    let genshincharact4 = pool.up4.join()
    let genshinweapon5 = pool.weapon5.join()
    let genshinweapon4 = pool.weapon4.join()

    let cfg = {
      gachadiy: getStatus('gacha.diy', true),
      gachawai: probability.wai,
      gachacharact5: probability.chance5,
      gachacharact4: probability.chance4,
      gachaweapon5: probability.chanceW5,
      gachaweapon4: probability.chanceW4,
      relifetime: Cfg.get('relife.time', 120),
      cardHz: Cfg.get('card.hz', 0),
      word: getStatus('word.listen', false)
    }

    let gachaconfigchance = (probability.wai === 50 && probability.chance5 === 60 && probability.chance4 === 510 && probability.chanceW5 === 70 && probability.chanceW4 === 600) ? '无需复位' : '可复位'
    setConfig('gacha', 'gacha', probability)
    setConfig('gacha', 'pool', pool)
    console.log(cfg)

    let layoutPath = process.cwd() + '/plugins/flower-plugin/resources/html/layout/'
    let base64 = await puppeteer.screenshot('sysCfg', {
      tplFile: `./plugins/flower-plugin/resources/html/${this.model}/index.html`,
      /** 绝对路径 */
      pluResPath: `${this._path}/plugins/flower-plugin/resources/`,
      saveId: 'sysCfg',
      defaultLayout: layoutPath + 'default.html',
      elemLayout: layoutPath + 'elem.html',
      imgType: 'png',
      sys: {
        copyright: `Created By Yunzai-Bot<span class="version">${yunzaiVersion}</span> & Flower-Plugin<span class="version">${currentVersion}</span>`
      },
      gachaconfigchance,
      genshincharact5,
      genshincharact4,
      genshinweapon5,
      genshinweapon4,
      ...cfg
    })

    await e.reply(base64)
    return true
  }

  async updateGachaPlugin (e) {
    if (!e.isMaster) {
      return true
    }
    let isForce = e.msg.includes('强制')
    let command = 'git  pull'
    if (isForce) {
      command = 'git  checkout . && git  pull'
      e.reply('正在执行强制更新操作，请稍等')
    } else {
      e.reply('正在执行更新操作，请稍等')
    }
    exec(command, { cwd: `${this._path}/plugins/flower-plugin/` }, function (error, stdout, stderr) {
      if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
        e.reply('目前已经是最新版的抽卡插件了~')
        return true
      }
      if (error) {
        e.reply('抽卡插件更新失败！\nError code: ' + error.code + '\n' + error.stack + '\n 请稍后重试。')
        return true
      }
      e.reply('抽卡插件更新成功，正在尝试重新启动Yunzai以应用更新...')
      timer && clearTimeout(timer)
      redis.set('gacha:restart-msg', JSON.stringify({
        msg: '重启成功，新版抽卡插件已经生效',
        qq: e.user_id
      }), { EX: 30 })
      timer = setTimeout(function () {
        let command = 'npm run start'
        if (process.argv[1].includes('pm2')) {
          command = 'npm run restart'
        }
        exec(command, function (error, stdout, stderr) {
          if (error) {
            e.reply('自动重启失败，请手动重启以应用新版抽卡插件。\nError code: ' + error.code + '\n' + error.stack + '\n')
            Bot.logger.error(`重启失败\n${error.stack}`)
            return true
          } else if (stdout) {
            Bot.logger.mark('重启成功，运行已转为后台，查看日志请用命令：npm run log')
            Bot.logger.mark('停止后台运行命令：npm stop')
            process.exit()
          }
        })
      }, 1000)
    })
    return true
  }
}

const getStatus = function (rote, def = true) {
  if (Cfg.get(rote, def)) {
    return '<div class="cfg-status" >已开启</div>'
  } else {
    return '<div class="cfg-status status-off">已关闭</div>'
  }
}

const getConfig = function (app, name) {
  let defp = `${defSetPath}${app}/${name}.yaml`
  if (!fs.existsSync(`${configPath}${app}.${name}.yaml`)) {
    fs.copyFileSync(defp, `${configPath}${app}.${name}.yaml`)
  }
  let conf = `${configPath}${app}.${name}.yaml`

  try {
    return YAML.parse(fs.readFileSync(conf, 'utf8'))
  } catch (error) {
    logger.error(`[${app}][${name}] 格式错误 ${error}`)
    return false
  }
}

const setConfig = function (app, name, yamlObject) {
  fs.writeFileSync(`${configPath}${app}.${name}.yaml`, YAML.stringify(yamlObject, null, '\t'))
}

const getValMath = function (val, min, max) {
  return Math.min(max, Math.max(min, val * 1))
}

const getPool = function () {
  let app = 'gacha'; let name = 'pool'
  if (!fs.existsSync(`${configPath}${app}.${name}.yaml`)) {
    let allPool = YAML.parse(fs.readFileSync(`${defSetPath}${app}/${name}.yaml`, 'utf8'))
    setConfig(app, name, allPool[0])
    return allPool[0]
  } else {
    return getConfig(app, name)
  }
}
