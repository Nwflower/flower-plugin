import plugin from '../../../lib/plugins/plugin.js'
import os from 'os'

export class Memory extends plugin {
  constructor () {
    super({
      name: '抽卡插件系统占用',
      dsc: '检测系统占用',
      event: 'message',
      priority: 1709,
      rule: [{
        reg: '^#*系统占用$',
        fnc: 'SI'
      }]
    })
  }

  async SI () {
    if (!this.e.isMaster) { return this.e.reply('w(ﾟДﾟ)w你没有权限哦！') }
    let dealMem = (mem) => {
      let G = 0; let M = 0; let KB = 0;
      (mem > (1 << 30)) && (G = (mem / (1 << 30)).toFixed(2));
      (mem > (1 << 20)) && (mem < (1 << 30)) && (M = (mem / (1 << 20)).toFixed(2));
      (mem > (1 << 10)) && (mem > (1 << 20)) && (KB = (mem / (1 << 10)).toFixed(2))
      return G > 0 ? G + 'G' : M > 0 ? M + 'M' : KB > 0 ? KB + 'KB' : mem + 'B'
    }
    const arch = os.arch(); const kernel = os.type(); const pf = os.platform(); const totalMem = os.totalmem(); const freeMem = os.freemem(); const cpu = os.cpus()
    let memoryUsePer = ((process.memoryUsage().rss / totalMem) * 100).toFixed(2).toString()
    let CpuNumber = cpu.length; let AllHz = 0; let AllCpu = 0; let CpuSerialnNumber = 0; let times
    while (CpuNumber--) {
      times = cpu[CpuSerialnNumber].times
      AllCpu += cpu[CpuSerialnNumber].speed * ((1 - times.idle / (times.idle + times.user + times.nice + times.sys + times.irq)))
      AllHz += cpu[CpuSerialnNumber++].speed
    }
    let msg = ['-----操作系统信息-----',
      '\n系统内核：' + kernel,
      '\n平台：' + pf,
      '\n--------内存信息--------',
      '\n内存大小：' + dealMem(totalMem) + '\n空闲内存：' + dealMem(freeMem),
      `\n内存使用：${dealMem(process.memoryUsage().rss)}` + `\n内存使用率：${memoryUsePer}%`,
      '\n------处理器信息------',
      `\n共有${CpuSerialnNumber}个cpu核心,架构为${arch}\n`,
      `CPU综合占用率${(AllCpu / AllHz * 100).toFixed(2).toString()}%`]
    return this.reply(msg, true)
  }
}
