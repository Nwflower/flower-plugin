/** 导入plugin */
import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import gsCfg from '../model/gsCfg.js'
import fs from 'fs'
export class singlegacha extends plugin {
  constructor () {
    super({
      name: '单抽',
      dsc: '模拟抽卡，单抽一次，必出四星及以上角色',
      event: 'message',
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
    const files = fs
      .readdirSync(`${this._path}/plugins/flower-plugin/resources/gacha/single/role`)
      .filter((file) => file.endsWith('.png'))
    let k = Math.ceil(Math.random() * files.length)
    for (let file of files) {
      if (k-- === 0) {
        file = file.replaceAll('.png', '').trim()
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
        await this.reply(base64)
      }
    }

    return true
  }
}
