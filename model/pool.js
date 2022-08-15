import gsCfg from './gsCfg.js'
import fs from 'node:fs'
import YAML from 'yaml'

class Pool {
  constructor () {
    /** 卡池 */
    this.configPath = './plugins/flower-plugin/config/'

    this.defSetPath = './plugins/flower-plugin/defSet/'

    this.dataPath = './plugins/flower-plugin/data/'
    this.defSet = {}
    /** 默认设置 */
    this.def = gsCfg.getPool()
  }

  getPool (uin) {
    this.init()
    return gsCfg.getSetPool(uin)
  }

  init () {
    if (!fs.existsSync('./plugins/flower-plugin/config/gacha.pool.yaml')) {
      let allPool = YAML.parse(fs.readFileSync('./plugins/flower-plugin/defSet/gacha/pool.yaml', 'utf8'))
      fs.writeFileSync('./plugins/flower-plugin/config/gacha.pool.yaml', YAML.stringify(allPool[0], null, '\t'))
    }
  }

  setPool (uin, objec) {
    this.init()
    if (!fs.existsSync(`${this.dataPath}`)) {
      fs.mkdirSync(`${this.dataPath}`)
    }
    if (!fs.existsSync(`${this.dataPath}${uin}/`)) {
      fs.mkdirSync(`${this.dataPath}${uin}/`)
    }
    fs.writeFileSync(`${this.dataPath}${uin}/pool.yaml`, YAML.stringify(objec, null, '\t'))
  }

  delPool (uin) {
    this.init()
    if (fs.existsSync(`${this.dataPath}${uin}/pool.yaml`)) {
      fs.rmdirSync(`${this.dataPath}${uin}/pool.yaml`)
      fs.rmdirSync(`${this.dataPath}${uin}/`)
    }
  }
}

export default new Pool()
