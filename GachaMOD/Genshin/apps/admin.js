import plugin from '../../../../../lib/plugins/plugin.js'
import { currentVersion } from '../../../model/Changelog.js'
import lodash from 'lodash'
import puppeteer from '../../../../../lib/puppeteer/puppeteer.js'
import { exec } from 'child_process'
import { _path, pluginResources, pluginRoot } from "../../../model/path.js";
import setting, {setting as pluginSetting} from "../model/setting.js";
import gsCfg from "../../../../genshin/model/gsCfg.js";
import pool from "../model/pool.js";
import Common from "../../../../../lib/common/common.js";

let cfgMap = {
  自定义: 'gacha.enable',
  小保底概率: 'gacha.wai',
  五星角色概率: 'gacha.chance5',
  四星角色概率: 'gacha.chance4',
  五星武器概率: 'gacha.chanceW5',
  四星武器概率: 'gacha.chanceW4',
  概率复位: 'gacha.setchance',
  卡池同步: 'gacha.sync',
  卡池自动同步: 'gacha.sync',
  五星角色: 'pool.c5',
  四星角色: 'pool.c4',
  五星武器: 'pool.w5',
  四星武器: 'pool.w4',
  随机卡池: 'pool.random',
  转生间隔: 'gacha.relifeCD',
  违禁词: 'word.listen',
  屏蔽词: 'word.listen'
}

let sysCfgReg = `^#抽卡设置\\s*(${lodash.keys(cfgMap).join('|')})?\\s*(.*)$`
let timer
export class admin extends plugin {
  constructor () {
    super({
      name: '抽卡插件管理',
      dsc: '管理抽卡插件',
      event: 'message',
      priority: 1679,
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
    this._path = _path
    this.resPath = pluginResources
    this.model = 'sysCfg'

    /** 默认设置 */
    this.defSetPath = './plugins/flower-plugin/defSet/'

    /** 用户设置 */
    this.configPath = './plugins/flower-plugin/config/'
  }
  getValMath (val, min, max) {
    return Math.min(max, Math.max(min, val * 1))
  }
  async sysCfg (e) {
    if (!e.isMaster) { return true }
    let cfgReg = new RegExp(sysCfgReg)
    let regRet = cfgReg.exec(e.msg)
    if (!regRet) { return true }

    let configPool = pool.getPool()

    // 设置模式
    if (regRet[1]) {
      let val = regRet[2] || ''
      let arr = []
      let cfgKey = cfgMap[regRet[1]]

      switch (cfgKey) {
        case 'gacha.chance5':
        case 'gacha.chance4':
        case 'gacha.chanceW5':
        case 'gacha.chanceW4':
          val = this.getValMath(val, 0, 10000)
          break
        case 'gacha.wai':
          val = this.getValMath(val, 0, 100)
          break
        case 'gacha.setchance':
          let allConfig = setting.merge()
          lodash.set(allConfig, 'gacha.chance5', '60')
          lodash.set(allConfig, 'gacha.chanceW5', '70')
          lodash.set(allConfig, 'gacha.chance4', '510')
          lodash.set(allConfig, 'gacha.chanceW4', '600')
          lodash.set(allConfig, 'gacha.wai', '50')
          setting.analysis(allConfig)
          cfgKey = false// 取消独立验证
          break
        case 'pool.c5':
          arr = val.replaceAll('，', ',').split(',')
          if (!arr) {
            this.reply('请设置角色！')
            return true
          }
          val = await gsCfg.getRole(arr[0])
          configPool.up5 = [val.name]
          if (arr.length === 1) {
            configPool.up5_2 = configPool.up5
          } else {
            val = await gsCfg.getRole(arr[1])
            configPool.up5_2 = [val.name]
          }
          setting.setConfig('pool',configPool)
          cfgKey = false// 取消独立验证
          break
        case 'pool.w5':
          arr = val.replaceAll('，', ',').split(',')
          if (arr.length !== 2) {
            e.reply('设置格式有误，再试一试吧！')
            return true
          }
          configPool.weapon5 = arr
          setting.setConfig('pool',configPool)
          cfgKey = false// 取消独立验证
          break
        case 'pool.w4':
          arr = val.replaceAll('，', ',').split(',')
          if (arr.length === 0) {
            e.reply('设置格式有误，再试一试吧！')
            return true
          }
          configPool.weapon4 = arr
          setting.setConfig('pool',configPool)
          cfgKey = false// 取消独立验证
          break
        case 'pool.c4':
          let up4 = []
          arr = val.replaceAll('，', ',').split(',')
          await arr.forEach((value) => { up4.push(gsCfg.getRole(value)) })
          configPool.up4 = up4
          setting.setConfig('pool',configPool)
          cfgKey = false// 取消独立验证
          break
        case 'pool.random':
          let wea5 = []; let wea4 = []; let r4 = [];
          let allw5 = pool.getList('weapon',5)
          let allw4 = pool.getList('weapon',4)
          let allr5 = pool.getList('role',5)
          let allr4 = pool.getList('role',4)
          for (let i = 0; i < 3; i++) { r4.push(lodash.sample(allr4)) }
          wea5.push(lodash.sample(allw5))
          wea5.push(lodash.sample(lodash.difference(allw5, wea5)))
          for (let i = 0; i < 5; i++) { wea4.push(lodash.sample(lodash.difference(allw4, wea4))) }
          configPool.up5 = [lodash.sample(allr5)]
          configPool.up5_2 = [lodash.sample(allr5)]
          configPool.up4 = r4
          configPool.weapon5 = wea5
          configPool.weapon4 = wea4
          setting.setConfig('pool',configPool)
          cfgKey = false// 取消独立验证
          break
        case 'gacha.sync':
          val = !/关闭/.test(val)
          if (val) { setting.setConfig('pool',setting.getConfig('pool'))}
          break
        case 'gacha.relifeCD':
          val = Math.min(1440, Math.max(1, val * 1))
          break
        case 'word.listen':
          val = !/关闭/.test(val)
          let config = pluginSetting.getConfig('wordListener')
          config.enable = val
          pluginSetting.setConfig('wordListener',config)
          cfgKey = false// 取消独立验证
          break
        default:
          val = !/关闭/.test(val)
          break
      }
      if (cfgKey) {
        setting.setConfigByKey(cfgKey,val)
      }
    }

    // 延迟一下
    await Common.sleep(500)
    let probability = setting.getConfig('gacha')
    let cfg = {
      genshincharact5: configPool.up5 + ',' + configPool.up5_2,
      genshincharact4: configPool.up4.join(),
      genshinweapon5: configPool.weapon5.join(),
      genshinweapon4: configPool.weapon4.join(),
      gachadiy: getStatus('gacha.enable', true, false),
      gachaget: getStatus('gacha.sync', true, false),
      gachawai: probability.wai,
      gachacharact5: probability.chance5,
      gachacharact4: probability.chance4,
      gachaweapon5: probability.chanceW5,
      gachaweapon4: probability.chanceW4,
      relifetime: probability.relifeCD,
      word: getStatus('wordListener.enable', false, true)
    }

    let gachaconfigchance = (probability.wai === 50 && probability.chance5 === 60 && probability.chance4 === 510 && probability.chanceW5 === 70 && probability.chanceW4 === 600) ? '无需复位' : '可复位'

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
        copyright: `Created By Yunzai-Bot & Flower-Plugin<span class="version">${currentVersion}</span>`
      },
      gachaconfigchance,
      ...cfg
    })

    await e.reply(base64)
    return true
  }

  async updateGachaPlugin (e) {
    if (!e.isMaster) { return true }
    let isForce = e.msg.includes('强制')
    let command = 'git  pull'
    if (isForce) {
      command = 'git reset --hard && git pull'
      e.reply('正在执行强制更新操作，请稍等')
    } else { e.reply('正在执行更新操作，请稍等') }
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
      redis.set('flower:restart-msg', JSON.stringify({
        msg: '重启成功，新版抽卡插件已经生效',
        qq: e.user_id
      }), { EX: 30 })
      timer = setTimeout(function () {
        let command = 'npm run start'
        if (process.argv[1].includes('pm2')) { command = 'npm run restart' }
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

const getStatus = function (rote, def = true, plugin = false) {
  if (setting.getConfigByKey(rote,def,plugin)) {
    return '<div class="cfg-status" >已开启</div>'
  } else {
    return '<div class="cfg-status status-off">已关闭</div>'
  }
}
