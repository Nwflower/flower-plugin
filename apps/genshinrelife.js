import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'oicq'
import { Cfg } from '../components/index.js'

const _path = process.cwd()
const pluginPath = `${_path}/plugins/flower-plugin`
let CD = {}
export class genshinrelife extends plugin {
  constructor () {
    super({
      name: '转生',
      dsc: '转生成原神中的角色',
      event: 'message',
      priority: 1680,
      rule: [
        {
          reg: '^#*转生$',
          fnc: 'relife'
        }
      ]
    })
  }

  async relife (e) {
    let cdtime = Cfg.get('relife.time', 120)
    // let cdtime = 120
    if (CD[e.user_id] && !e.isMaster) {
      e.reply('每' + cdtime + '分钟只能投胎一次哦！')
      return true
    }
    CD[e.user_id] = true
    CD[e.user_id] = setTimeout(() => {
      if (CD[e.user_id]) {
        delete CD[e.user_id]
      }
    }, cdtime * 60 * 1000)
    let file = pluginPath + '/resources/img/GenshinRelife/'
    let number = Math.floor(Math.random() * 58.99 + 1)

    // 发送消息
    e.reply(segment.image(file + number.toString() + '.png'))
    return true // 返回true 阻挡消息不再往下
  }
}
