import plugin from '../../../lib/plugins/plugin.js'
import os from 'os'

// 命令规则
let allGroup = []
let nowGroup = 0
let fix = 2 // 数据保留几位小数
/**
 * 使用说明：本V3插件为自动更新群名片插件
 * 命令：#系统占用 查看目前系统占用
 * #更新群名片 手动更新机器人群名片，默认每分钟自动执行一次
====== * **/
export class osmem extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '系统占用',
      /** 功能描述 */
      dsc: '检测系统占用',
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 1709,
      rule: [{
        /** 命令正则匹配 */
        reg: '^#*系统占用$',
        /** 执行方法 */
        fnc: 'SI'
      }, {
        reg: '^#*更新群名片',
        fnc: 'setGroupCard'
      }]
    })
    this.task = {
      cron: '30 * * * * ?',
      name: '自动群名片',
      fnc: () => this.minTask()
    }
    this.islog = false
    Object.defineProperty(this.task, 'log', {
      get: () => this.islog
    })
  }

  mapToArr (map) {
    allGroup = [] // 置空群组
    map.forEach((v, k) => {
      allGroup.push(k)
    })
    return allGroup
  }

  async init () {
    logger.info('抽卡插件-更新群名片模组载入了以下群~')
    logger.info(this.mapToArr(Bot.gl))
  }

  async minTask () {
    let nowPerMem = await this.getPerMem()
    if (allGroup.length) {
      if (nowGroup < allGroup.length - 1) {
        nowGroup++
      } else {
        nowGroup = 0
      }
      await this.setGroupCard(allGroup[nowGroup], nowPerMem, true)
    }
    return true
  }

  async setGroupCard (groupId = this.e.group_id, percentNum = this.getPerMem(), isTask = false) {
    await Bot.pickGroup(groupId).setCard(Bot.uin, `${Bot.nickname}|当前内存占用${percentNum}%`)
    if (!isTask) {
      logger.info(`【更新群名片】更新了群${groupId}的群名片`)
    }
  }

  async getPerMem () {
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    return ((1 - freeMem / totalMem) * 100).toFixed(fix).toString()
  }

  async SI () {
    if (!this.e.isMaster) {
      this.e.reply('w(ﾟДﾟ)w你没有权限哦！')
      return true
    }
    let dealMem = (mem) => {
      let G = 0
      let M = 0
      let KB = 0;
      (mem > (1 << 30)) && (G = (mem / (1 << 30)).toFixed(2));
      (mem > (1 << 20)) && (mem < (1 << 30)) && (M = (mem / (1 << 20)).toFixed(2));
      (mem > (1 << 10)) && (mem > (1 << 20)) && (KB = (mem / (1 << 10)).toFixed(2))
      return G > 0 ? G + 'G' : M > 0 ? M + 'M' : KB > 0 ? KB + 'KB' : mem + 'B'
    }
    // cpu架构
    const arch = os.arch()
    // 操作系统内核
    const kernel = os.type()
    // 操作系统平台
    const pf = os.platform()
    // 内存
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    let memoryUsePer = ((process.memoryUsage().rss / totalMem) * 100).toFixed(fix).toString()
    // cpu占用及信息
    const cpu = os.cpus()
    let CpuNumber = cpu.length
    let AllHz = 0
    let AllCpu = 0
    let CpuSerialnNumber = 0
    let times
    while (CpuNumber--) {
      times = cpu[CpuSerialnNumber].times
      AllCpu += cpu[CpuSerialnNumber].speed * ((1 - times.idle / (times.idle + times.user + times.nice + times.sys + times.irq)))
      AllHz += cpu[CpuSerialnNumber].speed
      CpuSerialnNumber++
    }
    let msg = [
      '-----操作系统信息-----',
      '\n系统内核：' + kernel,
      '\n平台：' + pf,
      '\n--------内存信息--------',
      '\n内存大小：' + dealMem(totalMem) + '\n空闲内存：' + dealMem(freeMem),
      `\n内存使用：${dealMem(process.memoryUsage().rss)}`,
      `\n内存使用率：${memoryUsePer}%`,
      '\n------处理器信息------',
    `\n共有${CpuSerialnNumber}个cpu核心,架构为${arch}\n`,
    `CPU综合占用率${(AllCpu / AllHz * 100).toFixed(fix).toString()}%`
    ]
    // 发送消息
    this.reply(msg, true)
    return true // 返回true 阻挡消息不再往下
  }
}
