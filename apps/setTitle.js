import plugin from '../../../lib/plugins/plugin.js'
import lodash from 'lodash'

export class setTitle extends plugin {
  constructor () {
    super({
      name: '抽卡插件设置头衔',
      dsc: '简单开发示例',
      event: 'message.group',
      priority: 1710,
      rule: [{
        reg: '#*设置头衔(.*)',
        fnc: 'setTitle'
      }]
    })
  }

  async setTitle () {
    if (!this.e?.group.is_owner) { return false }
    let msg = lodash.trimStart(this.e.msg, '#设置头衔').trim()
    if (!msg) { this.reply('请输入头衔') } else { await Bot.pickMember(this.e.group_id, this.e.user_id).setTitle(msg) }
    return true
  }
}
