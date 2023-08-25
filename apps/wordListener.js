import plugin from '../../../lib/plugins/plugin.js'
import fs from 'fs'
import YAML from 'yaml'
import lodash from 'lodash'
import setting from "../model/setting.js";

export class wordListener extends plugin {
  constructor () {
    let rule = {
      reg: '.*',
      fnc: 'wordsListener'
    }
    super({
      name: '抽卡插件违规词监听',
      dsc: '监听群聊中的违规词',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message.group',
      priority: 7,
      rule: [rule, {
        reg: '^#*(解除|删除|取消|不)屏蔽(本群|全局)?(.)+',
        fnc: 'delBlackWord'
      }, {
        reg: '^#*屏蔽(本群|全局)?[^(词列表)](.)*',
        fnc: 'addBlackWord'
      }, {
        reg: '^#*屏蔽词列表',
        fnc: 'blackList'
      }]
    })
    this._path = process.cwd().replace(/\\/g, '/')
    this.wordResPath = `${this._path}/plugins/flower-plugin/resources/blackword`
    this.islog = false
    this.config = setting.getConfig('wordListener')
    this.nock = this.config.enable
    Object.defineProperty(rule, 'log', {
      get: () => this.islog
    })
  }

  async init (path = `${this.wordResPath}/`) {
    if (!fs.existsSync(path)) { fs.mkdirSync(path) }
  }

  async blackList () {
    if (!this.nock) { return false }
    let words = []
    let files = []
    let forWordMsg = []
    let globalPath = `${this.wordResPath}/global`
    let groupPath = `${this.wordResPath}/${this.e.group_id}`
    // 获取本群违禁词
    if (fs.existsSync(groupPath)) {
      files = fs.readdirSync(groupPath).filter((file) => file.endsWith('.yaml'))
      for (let file of files) { words = lodash.unionWith(YAML.parse(fs.readFileSync(`${groupPath}/${file}`, 'utf8')), words) }
    }
    forWordMsg.push({
      message: `本群屏蔽词如下，共 ${words.length} 个`,
      nickname: Bot.nickname,
      user_id: Bot.uin
    })
    for (let i = 0; i < words.length; i += 100) {
      let message = []
      for (let j = i; j < i + 100 && j < words.length; j++) {
        message.push(`${j + 1}、【${words[j]}】`)
        if (j !== i + 99) message.push('\n')
      }
      forWordMsg.push({
        message,
        nickname: Bot.nickname,
        user_id: Bot.uin
      })
      if (i > 500) {
        forWordMsg.push({
          message: `本群屏蔽词较多，剩下的${words.length - i}个词语已经省略`,
          nickname: Bot.nickname,
          user_id: Bot.uin
        })
        break
      }
    }
    // 获取全局违禁词
    words = []
    if (fs.existsSync(globalPath)) {
      files = fs.readdirSync(globalPath).filter((file) => file.endsWith('.yaml'))
      for (let file of files) { words =lodash.unionWith(YAML.parse(fs.readFileSync(`${globalPath}/${file}`, 'utf8')), words) }
    }
    forWordMsg.push({
      message: `全局屏蔽词如下，共 ${words.length} 个`,
      nickname: Bot.nickname,
      user_id: Bot.uin
    })
    for (let i = 0; i < words.length; i += 100) {
      let message = []
      for (let j = i; j < i + 100 && j < words.length; j++) {
        message.push(`${j + 1}、【${words[j]}】`)
        if (j !== i + 99) message.push('\n')
      }
      forWordMsg.push(message)
      if (i > 500) {
        let ellipsisWords = words.length - i
        forWordMsg.push(`全局屏蔽词较多，剩下的${ellipsisWords}个词语已经省略`)
        break
      }
    }
    let sed = await common.makeForwardMsg(this.e, forWordMsg, `点我查看屏蔽词列表`)
    await this.reply(sed, false, 100)
  }

  async wordsListener () {
    if (!this.nock) { return false }
    if (this.e.isMaster) { return false }
    if (!this.e.group.is_admin && !this.e.group.is_owner) { return false }
    let receivedMsg = ''
    for (let val of this.e.message) {
      switch (val.type) {
        case 'text':
          receivedMsg = receivedMsg + val.text
          break
        default:
          break
      }
    }
    if (receivedMsg !== '') {
      let DelReg = /#*(解除|删除|取消|不)屏蔽(本群|全局)?/g
      if (DelReg.test(this.e.msg)) { return false }
      let wordlist = await this.getBlackWords()
      try {
        for (let word of wordlist) {
          if (receivedMsg.includes(word) && word) {
            this.e.group.recallMsg(this.e.message_id)
            await this.e.group.muteMember(this.e.sender.user_id, Number(this.config.time))
            await this.reply(this.config['replyText'])
            logger.info(`检测到违禁词：${word}`)
            this.islog = true
            return this.islog
          }
        }
      } catch (e) {
        logger.mark('违规词监听报错')
      }
    }
    return false
  }

  // 检查权限
  async CheckAuth () {
    if (!this.nock) { return false }
    let qq = this.e.group.pickMember(this.e.sender.user_id)
    return (qq.is_owner || qq.is_admin || this.e.isMaster)
  }

  // 获得违禁词
  async getBlackWords () {
    let words = []
    let globalPath = `${this.wordResPath}/global`
    let groupPath = `${this.wordResPath}/${this.e.group_id}`
    // 获取全局违禁词
    await this.init(`${globalPath}/`)
    let files = fs.readdirSync(globalPath).filter((file) => file.endsWith('.yaml'))
    for (let file of files) { words = lodash.unionWith(YAML.parse(fs.readFileSync(`${globalPath}/${file}`, 'utf8')), words) }
    // 获取本群违禁词
    if (fs.existsSync(groupPath)) {
      files = fs.readdirSync(groupPath).filter((file) => file.endsWith('.yaml'))
      for (let file of files) { words = lodash.unionWith(YAML.parse(fs.readFileSync(`${groupPath}/${file}`, 'utf8')), words) }
    }
    return words
  }

  async delBlackWord () {
    if (!this.e.group.is_admin && !this.e.group.is_owner) { return false }
    if (!await this.CheckAuth()) { return true }
    let handleSentence = this.e.msg.replaceAll(/#*(解除|删除|取消|不)屏蔽(本群|全局)?/g, '').trim()
    if (!handleSentence) { return false }
    let handleWords = handleSentence.replaceAll('，', ',').split(',')
    let indexWords = []
    let existWord = []

    let folderPath = `${this.wordResPath}/global`
    let isLocal = /^#*(解除|删除|取消|不)屏蔽本群/g.test(this.e.msg)
    if (!this.e.isMaster) { isLocal = true }
    if (isLocal) { folderPath = `${this.wordResPath}/${this.e.group_id}` }
    const files = fs.readdirSync(folderPath).filter((file) => file.endsWith('.yaml'))

    for (let handleWord of handleWords) {
      for (let file of files) {
        let wordlist = YAML.parse(fs.readFileSync(`${folderPath}/${file}`, 'utf8'))
        if (wordlist.includes(handleWord)) {
          indexWords.push(handleWord)
          wordlist = lodash.remove(wordlist, (thisWord) => thisWord !== handleWord)
          if (!wordlist) {
            fs.unlinkSync(`${folderPath}/${file}`)
            continue
          }
          fs.writeFileSync(`${folderPath}/${file}`, YAML.stringify(wordlist, null, '\t'))
        }
      }
    }
    existWord = lodash.difference(handleWords, indexWords)
    let reMsg = ''
    if (indexWords.length) {
      reMsg = reMsg + `删除了${(isLocal) ? '本群' : '全局'}屏蔽词：【${indexWords.join('】【')}】${(existWord.length) ? '\n' : ''}`
    }
    if (existWord.length) {
      reMsg = reMsg + `下列词没有被${(isLocal) ? '本群' : '全局'}屏蔽：【${existWord.join('】【')}】`
    }
    this.reply(reMsg, true)
    return true
  }

  async addBlackWord () {
    if (!this.e.group.is_admin && !this.e.group.is_owner) { return false }
    if (!await this.CheckAuth()) { return true }
    let handleSentence = this.e.msg.replaceAll(/#*屏蔽(本群|全局)?/g, '').trim()
    if (!handleSentence) { return false }
    let handleWords = handleSentence.replaceAll('，', ',').split(',')
    let indexWords = []
    let existWord = []
    let folderPath = `${this.wordResPath}/global/`
    let isLocal = /^#*屏蔽本群/g.test(this.e.msg)
    if (!this.e.isMaster) { isLocal = true }
    if (isLocal) { folderPath = `${this.wordResPath}/${this.e.group_id}/` }
    await this.init(folderPath)
    let wordPath = `${folderPath}${await this.getData()}.yaml`

    if (fs.existsSync(wordPath)) { indexWords = YAML.parse(fs.readFileSync(wordPath, 'utf8')) }
    for (let handleWord of handleWords) { if (indexWords.includes(handleWord)) { existWord.push(handleWord) } else { indexWords.push(handleWord) } }
    fs.writeFileSync(wordPath, YAML.stringify(indexWords, null, '\t'))
    let reMsg = (isLocal) ? `新增本群屏蔽词：【${handleWords.join('、')}】` : `新增全局屏蔽词：【${handleWords.join('】【')}】`
    if (existWord.length) {
      reMsg = reMsg + `\n词语【${existWord.join('】【')}】已经被屏蔽`
    }
    this.reply(reMsg, true, 20)
    return true
  }

  async getData () {
    let today = new Date()
    let month = today.getMonth() + 1
    month = (month > 9) ? month : ('0' + month)
    return `${today.getFullYear()}-${month}`
  }
}
