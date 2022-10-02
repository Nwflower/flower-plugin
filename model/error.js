import fs from 'node:fs'

/** 配置文件 */
class Error {
  constructor () {
    /** 用户数据 */
    this.errorPath = './plugins/flower-plugin/resources/logger/error.json'
  }

  /**
   * @param code 错误代码
   */
  getErrorByCode (code) {
    logger.error(`【抽卡插件】错误代码${code}`)
    let errors = JSON.parse(fs.readFileSync(this.errorPath, 'utf-8'));
    return errors[code]
  }
}

export default new Error()
