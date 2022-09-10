import plugin from '../../../lib/plugins/plugin.js'
import fs from 'fs'
import YAML from 'yaml'
import lodash from 'lodash'

let pathk = process.cwd().replace(/\\/g, '/') + '/plugins/flower-plugin/resources/blackword/'
if (!fs.existsSync(pathk)) {
  fs.mkdirSync(pathk)
}
export class wordListener extends plugin {
  constructor () {
    let rule = {
      /** 命令正则匹配 */
      reg: '.*',
      /** 执行方法 */
      fnc: 'wordsListener'
    }
    super({
      name: '违规词监听',
      dsc: '监听群聊中的违规词',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message.group',
      priority: 9876,
      rule: [rule, {
        reg: '#*解除屏蔽(.)+',
        /** 执行方法 */
        fnc: 'delBlackWord'
      }, {
        reg: '#*添加屏蔽(.)+',
        /** 执行方法 */
        fnc: 'addBlackWord'
      }]
    })
    this._path = process.cwd().replace(/\\/g, '/')
    this.islog = false
    Object.defineProperty(rule, 'log', {
      get: () => this.islog
    })
  }

  async wordsListener (e) {
    if (this.e.isMaster) { return false }
    if (!this.e.group.is_admin && !this.e.group.is_owner) { return false }
    let msgdata = ''
    for (let val of e.message) {
      switch (val.type) {
        case 'text':
          msgdata = msgdata + val.text
          break
        default:
          break
      }
    }
    if (msgdata !== '') {
      return this.wordListener(msgdata)
    }
    return false
  }

  async getBlackWords () {
    let wordlist = []
    const worldfiles = fs
      .readdirSync(`${this._path}/plugins/flower-plugin/resources/blackword`)
    for (let file of worldfiles) {
      wordlist = lodash.unionWith(YAML.parse(
        fs.readFileSync(`${this._path}/plugins/flower-plugin/resources/blackword/${file}`, 'utf8')), wordlist)
    }
    return wordlist
  }

  async delBlackWord () {
    if (!this.e.group.is_admin && !this.e.group.is_owner && !this.e.isMaster) { return false }
    let word = this.e.msg.replaceAll(/#*解除屏蔽/g, '').trim()
    const worldfiles = fs
      .readdirSync(`${this._path}/plugins/flower-plugin/resources/blackword`)
    let flag = false
    for (let file of worldfiles) {
      let wordlist = YAML.parse(fs.readFileSync(`${this._path}/plugins/flower-plugin/resources/blackword/${file}`, 'utf8'))
      if (wordlist.includes(word)) {
        flag = true
        wordlist = lodash.remove(wordlist, function (aword) {
          return aword !== word
        })
        fs.writeFileSync(`${this._path}/plugins/flower-plugin/resources/blackword/${file}`, YAML.stringify(wordlist, null, '\t'))
      }
    }
    if (flag) {
      this.reply(`取消屏蔽疑似违规词汇：【${word}】`, true)
    } else {
      this.reply(`没有找到违规词汇：【${word}】`, true, 110)
    }
    return true
  }

  async addBlackWord () {
    if (!this.e.group.is_admin && !this.e.group.is_owner && !this.e.isMaster) { return false }
    let word = this.e.msg.replaceAll(/#*添加屏蔽/g, '').trim()
    if (!word) { return false }
    let exword = []
    let defpath = `${this._path}/plugins/flower-plugin/resources/blackword/def.yaml`
    if (fs.existsSync(defpath)) {
      exword = YAML.parse(fs.readFileSync(defpath, 'utf8'))
    }
    if (exword.includes(word)) {
      this.reply('已经添加过该词!')
      return true
    } else {
      exword.push(word)
      fs.writeFileSync(defpath, YAML.stringify(exword, null, '\t'))
      this.reply(`新增屏蔽违规词汇：【${word}】`, true, 20)
    }
    return true
  }

  async wordListener (msgdata) {
    try {
      let DelReg = /#*解除屏蔽/g
      if (DelReg.test(this.e.msg)) { return false }
      let wordlist = await this.getBlackWords()
      for (let word of wordlist) {
        if (msgdata.includes(word) && word) {
          this.e.group.recallMsg(this.e.message_id)
          await this.e.group.muteMember(this.e.sender.user_id, 1)
          this.reply('检测到违规词汇，已经制裁')
          logger.info(`检测到违禁词：${word}`)
          this.islog = true
          return true
        }
      }
    } catch (e) {
      logger.info('【违规词监听】监听未能正常运行')
    }
    return false
  }
}
