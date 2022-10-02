import plugin from '../../../lib/plugins/plugin.js'
import lodash from 'lodash'
import pool from '../model/pool.js'
import fs from 'node:fs'
import gsCfg from '../model/gsCfg.js'

let cfgMap = {
  角色列表: 'pool.all',
  五星: 'pool.c5',
  四星: 'pool.c4',
  武器池五星: 'pool.w5',
  武器池四星: 'pool.w4',
  重置: 'pool.refresh'
}

let sysCfgReg = `^#*我的卡池\\s*(${lodash.keys(cfgMap).join('|')})?\\s*(.*)$`
export class Mypool extends plugin {
  constructor () {
    super({
      name: '我的卡池',
      dsc: '修改卡池',
      event: 'message',
      priority: 1681,
      rule: [{
        reg: sysCfgReg,
        fnc: 'sysCfg'
      }]
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
    let cfgReg = new RegExp(sysCfgReg)
    let regRet = cfgReg.exec(e.msg)

    if (!regRet) {
      return true
    }
    let mypo = pool.getPool(this.e.user_id)

    let msgs = []
    let tmpmsg = ''
    let i = 1
    let call
    let xuhaoarr = []
    let tmparr; let j = 0; let namearr = []
    msgs.push(await this.pool2str(mypo))
    if (regRet[1]) {
      let val = regRet[2] || ''
      let cfgKey = cfgMap[regRet[1]]
      if (!cfgKey) cfgKey = 'pool.all'
      switch (cfgKey) {
        case 'pool.c5' :
          // eslint-disable-next-line no-case-declarations
          xuhaoarr = val.replaceAll('，', ',').split(',').map(Number)
          tmparr = xuhaoarr.sort(function (a, b) {
            return a - b
          })
          call = await this.getpng('role', '5')
          for (let file of call) {
            if ((i++) === tmparr[j]) {
              namearr.push(file.replace('.png', ''))
              j++
              if (j >= tmparr.length) break
            }
          }
          if (!namearr) {
            await this.reply('设置失败')
            break
          }
          namearr = gsCfg.checkarr(namearr, 2)
          // eslint-disable-next-line no-case-declarations
          let tpmarr1 = []; let tmparr2 = []
          tpmarr1.push(namearr[0])
          mypo.up5 = tpmarr1
          tmparr2.push(namearr[1])
          mypo.up5_2 = tmparr2
          msgs.pop()
          msgs.push(await this.pool2str(mypo))
          await pool.setPool(this.e.user_id, mypo)
          break
        case 'pool.c4' :
          // eslint-disable-next-line no-case-declarations
          xuhaoarr = val.replaceAll('，', ',').split(',').map(Number)
          tmparr = xuhaoarr.sort(function (a, b) {
            return a - b
          })
          call = await this.getpng('role', '4')
          for (let file of call) {
            if ((i++) === tmparr[j]) {
              namearr.push(file.replace('.png', ''))
              j++
              if (j >= tmparr.length) break
            }
          }
          if (!namearr) {
            await this.reply('设置失败')
            break
          }
          mypo.up4 = gsCfg.checkarr(namearr, 3)
          logger.info(mypo)
          await pool.setPool(this.e.user_id, mypo)
          break
        case 'pool.w5' :
          // eslint-disable-next-line no-case-declarations
          xuhaoarr = val.replaceAll('，', ',').split(',').map(Number)
          tmparr = xuhaoarr.sort(function (a, b) {
            return a - b
          })
          call = await this.getpng('weapon', '5')
          for (let file of call) {
            if ((i++) === tmparr[j]) {
              namearr.push(file.replace('.png', ''))
              j++
              if (j >= tmparr.length) break
            }
          }
          if (namearr.length !== 2) {
            await this.reply('设置失败')
            break
          }
          mypo.weapon5 = namearr
          msgs.pop()
          msgs.push(await this.pool2str(mypo))
          await pool.setPool(this.e.user_id, mypo)
          break
        case 'pool.w4' :
          xuhaoarr = val.replaceAll('，', ',').split(',').map(Number)
          tmparr = xuhaoarr.sort(function (a, b) {
            return a - b
          })
          call = await this.getpng('weapon', '4')
          for (let file of call) {
            if ((i++) === tmparr[j]) {
              namearr.push(file.replace('.png', ''))
              j++
              if (j >= tmparr.length) break
            }
          }
          if (!namearr) {
            break
          }
          mypo.weapon4 = gsCfg.checkarr(namearr, 5)
          msgs.pop()
          msgs.push(await this.pool2str(mypo))
          await pool.setPool(this.e.user_id, mypo)
          break
        case 'pool.refresh':
          await pool.delPool(this.e.user_id)
          break
        default:
          msgs.push('以下为UP五星角色列表，使用命令#我的卡池五星+序号即可更改对应卡池，序号最少一个，多个序号请用逗号隔开')
          call = await this.getpng('role', '5')
          for (let file of call) {
            let name = file.replace('.png', '')
            tmpmsg = tmpmsg + (i++).toString() + ':' + name + '\n'
          }
          msgs.push(tmpmsg)
          tmpmsg = ''
          i = 1
          msgs.push('以下为UP四星角色列表，使用命令#我的卡池四星+序号即可更改对应卡池，序号最少三个，多个序号请用逗号隔开')
          call = await this.getpng('role', '4')
          for (let file of call) {
            let name = file.replace('.png', '')
            tmpmsg = tmpmsg + (i++).toString() + ':' + name + '\n'
          }
          msgs.push(tmpmsg)
          tmpmsg = ''
          i = 1
          msgs.push('以下为武器池五星列表，使用命令#我的卡池武器池五星+序号即可更改对应卡池，序号只能为两个，请用逗号隔开')
          call = await this.getpng('weapon', '5')
          for (let file of call) {
            let name = file.replace('.png', '')
            tmpmsg = tmpmsg + (i++).toString() + ':' + name + '\n'
          }
          msgs.push(tmpmsg)
          tmpmsg = ''
          i = 1
          msgs.push('以下为武器池四星列表，使用命令#我的卡池武器池四星+序号即可更改对应卡池，序号至少为多个，请用逗号隔开')
          call = await this.getpng('weapon', '4')
          for (let file of call) {
            let name = file.replace('.png', '')
            tmpmsg = tmpmsg + (i++).toString() + ':' + name + '\n'
          }
          msgs.push(tmpmsg)
          i = 1
          tmpmsg = ''
          msgs.push('重置卡池请发送#我的卡池重置')
          break
      }
    }

    let msg = []
    for (let i = 0; i < msgs.length; i++) {
      let m = msgs[i]
      msg.push({
        message: m,
        nickname: Bot.nickname,
        user_id: Bot.uin
      })
    }

    let sed = await Bot.pickFriend(this.e.sender).makeForwardMsg(msg)
    await this.reply(sed)
  }

  async pool2str (pY) {
    let c5 = '当前UP池五星角色' + pY.up5.join() + '和' + pY.up5_2.join()
    let c4 = '\n当前UP四星角色' + pY.up4.join()
    let w5 = '\n当前武器池UP武器' + pY.weapon5.join()
    let w4 = '\n当前武器池UP武器' + pY.weapon4.join()
    let addi = '\n-------\n快速更改角色请使用命令#我的卡池角色列表、重置请使用#我的卡池重置'
    return c5 + c4 + w5 + w4 + addi
  }

  async getpng (type, star) {
    return fs
      .readdirSync(`${this.resPath}/gacha/default/${type}/${star}/`)
  }
}
