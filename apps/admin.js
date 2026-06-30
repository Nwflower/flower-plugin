import plugin from '../../../lib/plugins/plugin.js'
import fs from 'node:fs'
import path from 'node:path'
import { exec } from 'child_process'
import { pluginRoot } from '../model/path.js'
import { list, getRepoInfo } from '../model/moreLib.js'

const gameReg = list.join('|')
const downloadReg = new RegExp(`^#*(${gameReg})(抽卡|抽卡扩展|抽卡MOD|抽卡mod|MOD|mod)下载$`)

export class admin extends plugin {
  constructor () {
    super({
      name: '抽卡扩展管理',
      dsc: '下载抽卡扩展到 GachaMOD 目录',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: `^#*(${gameReg})(抽卡|抽卡扩展|抽卡MOD|抽卡mod|MOD|mod)下载$`,
          fnc: 'download'
        }
      ]
    })
  }

  get modRoot () {
    return path.join(pluginRoot, 'GachaMOD')
  }

  async download () {
    if (!this.e.isMaster) return false

    const match = this.e.msg.match(downloadReg)
    if (!match) return false

    const gameName = match[1]
    const repoInfo = getRepoInfo(gameName)

    if (!repoInfo) {
      await this.reply(`暂未找到 ${gameName} 对应的抽卡扩展仓库配置`)
      return true
    }

    const targetPath = path.join(this.modRoot, repoInfo.dir)
    if (fs.existsSync(targetPath)) {
      await this.reply(`GachaMOD/${repoInfo.dir} 已存在，本次未重复下载`)
      return true
    }

    await this.reply(`开始下载 ${gameName} 抽卡扩展到 GachaMOD/${repoInfo.dir}，这可能需要一点时间`)

    const command = `git clone --depth=1 ${repoInfo.repo} "${targetPath.replace(/"/g, '\\"')}"`
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        await this.reply(`下载失败\n${stderr || error.stack || error.message}`)
        return
      }
      await this.reply(`下载完成：GachaMOD/${repoInfo.dir}`)
    })

    return true
  }
}
