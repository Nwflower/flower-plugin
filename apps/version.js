/** 导入plugin */
import plugin from '../../../lib/plugins/plugin.js'
import { currentVersion, changelogs } from '../model/Changelog.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'

export class version extends plugin {
  constructor () {
    super({
      name: '抽卡插件版本',
      dsc: '查看抽卡插件版本',
      event: 'message',
      priority: 1705,
      rule: [
        {
          reg: '^#*抽卡(插件)?版本(号)?$',
          fnc: 'version'
        }
      ]
    })
    this._path = process.cwd().replace(/\\/g, '/')
    this.model = 'version'
  }

  async version () {
    let layoutPath = process.cwd() + '/plugins/flower-plugin/resources/html/layout/'

    let versionImg = await puppeteer.screenshot('version', {
      tplFile: `./plugins/flower-plugin/resources/html/${this.model}/${this.model}.html`,
      /** 绝对路径 */
      pluResPath: `${this._path}/plugins/flower-plugin/resources/`,
      saveId: 'version',
      currentVersion,
      changelogs,
      defaultLayout: layoutPath + 'default.html',
      elemLayout: layoutPath + 'elem.html',
      sys: {
        copyright: `Created By Yunzai-Bot & Flower-Plugin<span class="version">${currentVersion}</span>`
      }
    })
    await this.reply(versionImg, false, 110)
  }
}
