import plugin from '../../../../../lib/plugins/plugin.js'
import Coin from "../model/coin.js";
import setting from "../model/setting.js";

export class coin extends plugin {
  constructor () {
    super({
      name: '抽卡粉蓝球查询',
      dsc: '查看自己的粉蓝球',
      event: 'message',
      priority: 1905,
      rule: [
        {
          reg: '^#?(我的|领取|查询|查看)(纠缠|相遇|粉|蓝)(之缘|球)?$',
          fnc: 'myCoin'
        }
      ]
    })
    this.model = 'myCoin'
  }

  // 获取配置单
  get appconfig() { return setting.getConfig("gacha") }

  async myCoin () {
    // 初始化配置文件
    if (!this.appconfig.enable) { return false; }
    this.Coin = await Coin.init(this.e)
    let coin = await this.Coin.getCoin()
    await this.e.reply(`今日你还有${coin.pink}个纠缠之缘和${coin.blue}个相遇之缘`)
    return true
  }
}