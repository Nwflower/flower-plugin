import YAML from 'yaml'
import chokidar from 'chokidar'
import fs from 'node:fs'
import { Cfg } from "../components/index.js";

/** 配置文件 */
class GsCfg {
  constructor () {
    /** 默认设置 */
    this.defSetPath = './plugins/flower-plugin/defSet/'
    this.defSet = {}

    /** 用户设置 */
    this.configPath = './plugins/flower-plugin/config/'
    this.config = {}

    /** 用户数据 */
    this.dataPath = './plugins/flower-plugin/data/'
    this.data = {}

    /** 监听文件 */
    this.watcher = { config: {}, defSet: {} }

    this.ignore = ['gacha.gacha', 'gacha.set', 'gacha.pool', 'gacha.random', 'group.name']
  }

  /**
   * @param app  功能
   * @param name 配置文件名称
   */
  getdefSet (app, name) {
    return this.getYaml(app, name, 'defSet')
  }

  /** 用户配置 */
  getConfig (app, name) {
    if (this.ignore.includes(`${app}.${name}`)) {
      return this.getYaml(app, name, 'config')
    }
    return { ...this.getdefSet(app, name), ...this.getYaml(app, name, 'config') }
  }

  /**
   * 获取配置yaml
   * @param app 功能
   * @param name 名称
   * @param type 默认跑配置-defSet，用户配置-config
   */
  getYaml (app, name, type) {
    let file = this.getFilePath(app, name, type)
    let key = `${app}.${name}`

    if (this[type][key]) return this[type][key]

    try {
      this[type][key] = YAML.parse(
        fs.readFileSync(file, 'utf8')
      )
    } catch (error) {
      logger.error(`[${app}][${name}] 格式错误 ${error}`)
      return false
    }

    this.watch(file, app, name, type)

    return this[type][key]
  }

  getFilePath (app, name, type) {
    if (type === 'defSet') return `${this.defSetPath}${app}/${name}.yaml`
    else {
      try {
        if (!fs.existsSync(`${this.configPath}${app}.${name}.yaml`) && this.ignore.includes(`${app}.${name}`)) {
          fs.writeFileSync(`${this.configPath}${app}.${name}.yaml`, fs.readFileSync(`${this.defSetPath}${app}/${name}.yaml`, 'utf8'))
        }
      } catch (error) {
        logger.error(`抽卡插件缺失默认文件[${app}][${name}]${error}`)
      }
      return `${this.configPath}${app}.${name}.yaml`
    }
  }

  /** 监听配置文件 */
  watch (file, app, name, type = 'defSet') {
    let key = `${app}.${name}`

    if (this.watcher[type][key]) return

    const watcher = chokidar.watch(file)
    watcher.on('change', path => {
      delete this[type][key]
      logger.mark(`[修改配置文件][${type}][${app}][${name}]`)
      if (this[`change_${app}${name}`]) {
        this[`change_${app}${name}`]()
      }
    })

    this.watcher[type][key] = watcher
  }

  get element () {
    return { ...this.getdefSet('element', 'role'), ...this.getdefSet('element', 'weapon') }
  }

  /**
   * 原神角色武器长名称缩写
   * @param name 名称
   * @param isWeapon 是否武器
   */
  shortName (name, isWeapon = false) {
    let other = {}
    if (isWeapon) {
      other = this.getdefSet('weapon', 'other')
    } else {
      other = this.getdefSet('role', 'other')
    }
    return other.sortName[name] ?? name
  }

  getGachaSet (groupId = '') {
    let config = this.getYaml('gacha', 'set', 'config')
    let def = config.default
    if (config[groupId]) {
      return { ...def, ...config[groupId] }
    }
    return def
  }

  /**
   * 原神角色id转换角色名字
   */
  roleIdToName (id) {
    let name = this.getdefSet('role', 'name')
    if (name[id]) {
      return name[id][0]
    }

    return ''
  }

  /** 原神角色别名转id */
  roleNameToID (keyword) {
    if (!isNaN(keyword)) keyword = Number(keyword)
    this.getAbbr()
    let roelId = this.nameID.get(String(keyword))
    return roelId || false
  }

  /** 获取角色别名 */
  getAbbr () {
    if (this.nameID) return

    this.nameID = new Map()

    let nameArr = this.getdefSet('role', 'name')

    let nameID = {}

    for (let i in nameArr) {
      nameID[nameArr[i][0]] = i
      for (let abbr of nameArr[i]) {
        this.nameID.set(String(abbr), i)
      }
    }
  }

  /** 获取卡池 */
  getPool () {
    let app = 'gacha'; let name = 'pool'
    if (!fs.existsSync(`${this.configPath}${app}.${name}.yaml`)) {
      let allPool = YAML.parse(fs.readFileSync(`${this.defSetPath}${app}/${name}.yaml`, 'utf8'))
      fs.writeFileSync(`${this.configPath}${app}.${name}.yaml`, YAML.stringify(allPool[0], null, '\t'))
      return allPool[0]
    } else {
      let pool = YAML.parse(fs.readFileSync(`${this.configPath}${app}.${name}.yaml`, 'utf8'))
      if (Cfg.get('gacha.get', false)){
        let poolArr = this.getdefSet('gacha', 'pool')
        poolArr = [...poolArr].reverse()
        /** 获取设置卡池 */
        pool = poolArr.find((val) => new Date().getTime() <= new Date(val.endTime).getTime()) || poolArr.pop()
      }
      return pool
    }
  }

  getSetPool (user) {
    if (!fs.existsSync(`${this.dataPath}${user}/pool.yaml`)) {
      return this.getPool()
    } else {
      return YAML.parse(fs.readFileSync(`${this.dataPath}${user}/pool.yaml`, 'utf8'))
    }
  }

  checkarr (arr, num) {
    if (!arr) return false
    while (arr.length > num) {
      arr.pop()
    }
    while (arr.length < num) {
      arr.push(arr[arr.length - 1])
    }
    return arr
  }

  getStar (roleID) {
    let allrole = this.getYaml('role', 'other', 'defSet')
    return !!allrole.five.includes(parseInt(roleID))
  }
}

export default new GsCfg()
