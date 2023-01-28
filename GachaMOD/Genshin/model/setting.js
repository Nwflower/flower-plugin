import YAML from 'yaml'
import chokidar from 'chokidar'
import fs from 'node:fs'
import { modRoot } from "./MODpath.js";
import lodash from "lodash";
import setting from "../../../model/setting.js";

class Setting {
  constructor () {
    /** 默认设置 */
    this.defSetPath = `${modRoot}/def/`
    this.defSet = {}

    /** 用户设置 */
    this.configPath = `${modRoot}/config/`
    this.config = {}

    this.dataPath = `${modRoot}/data/`
    this.data = {}

    /** 监听文件 */
    this.watcher = { config: {}, defSet: {} }
  }


  // 获取对应模块数据文件
  getData (path, filename) {
    path = `${this.dataPath}${path}/`
    try {
      if (!fs.existsSync(`${path}${filename}.yaml`)){ return false}
      return YAML.parse(fs.readFileSync(`${path}${filename}.yaml`, 'utf8'))
    } catch (error) {
      logger.error(`[抽卡插件][${filename}] 读取失败 ${error}`)
      return false
    }
  }

  // 写入对应模块数据文件
  setData (path, filename, data) {
    path = `${this.dataPath}${path}/`
    try {
      if (!fs.existsSync(path)){
        // 递归创建目录
        fs.mkdirSync(path, { recursive: true });
      }
      fs.writeFileSync(`${path}${filename}.yaml`, YAML.stringify(data),'utf8')
    } catch (error) {
      logger.error(`[抽卡插件]写入文件${path}${filename}.yaml时遇到错误\n${error}`)
      return false
    }
  }

  // 配置对象化 用于抽卡插件设置
  merge () {
    let sets = {}
    let appsConfig = fs.readdirSync(this.defSetPath).filter(file => file.endsWith(".yaml"));
    for (let appConfig of appsConfig) {
      // 依次将每个文本填入键
      let filename = appConfig.replace(/.yaml/g, '').trim()
      sets[filename] = this.getConfig(filename)
    }
    return sets
  }

  // 配置对象分析 用于抽卡插件设置
  analysis(config) {
    for (let key of Object.keys(config)){
      this.setConfig(key, config[key])
    }
  }

  setConfigByKey (key,value){
    let allConfig = this.merge()
    lodash.set(allConfig, key, value)
    this.analysis(allConfig)
    return true
  }

  getConfigByKey (key,defaultValue,plugin = false){
    if (plugin) {
      return setting.getConfigByKey(key,defaultValue)
    }
    let allConfig = this.merge()
    return lodash.get(allConfig, key, defaultValue)
  }

  // 获取对应模块默认配置
  getdefSet (app) {
    return this.getYaml(app,'defSet')
  }

  // 获取对应模块用户配置
  getConfig (app) {
    return { ...this.getdefSet(app), ...this.getYaml(app,'config') }
  }

  // 设置对应模块用户配置
  setConfig (app, Object) {
    return this.setYaml(app,'config', { ...this.getdefSet(app), ...Object})
  }

  // 将对象写入YAML文件
  setYaml (app, type, Object){
    let file = this.getFilePath(app, type)
    try {
      fs.writeFileSync(file, YAML.stringify(Object),'utf8')
    } catch (error) {
      logger.error(`[抽卡插件]写入文件[${file}]时遇到错误\n${error}`)
      return false
    }
  }

  // 读取YAML文件 返回对象
  getYaml (app, type) {
    let file = this.getFilePath(app, type)
    if (this[type][app]) return this[type][app]

    try {
      this[type][app] = YAML.parse(fs.readFileSync(file, 'utf8'))
    } catch (error) {
      logger.error(`[抽卡插件]读取文件${file}时遇到错误\n${error}`)
      return false
    }
    this.watch(file, app, type)
    return this[type][app]
  }

  // 获取YAML文件目录
  getFilePath (app, type) {
    if (type === 'defSet') return `${this.defSetPath}${app}.yaml`
    else {
      try {
        if (!fs.existsSync(`${this.configPath}${app}.yaml`)) {
          fs.copyFileSync(`${this.defSetPath}${app}.yaml`, `${this.configPath}${app}.yaml`)
        }
      } catch (error) {
        logger.error(`[抽卡插件]拷贝默认文件[${app}]时疑似遇到错误\n${error}`)
      }
      return `${this.configPath}${app}.yaml`
    }
  }


  // 监听配置文件
  watch (file, app, type = 'defSet') {
    if (this.watcher[type][app]) return

    const watcher = chokidar.watch(file)
    watcher.on('change', path => {
      delete this[type][app]
      logger.mark(`[抽卡插件][配置文件热更新][${type}][${app}]`)
    })
    this.watcher[type][app] = watcher
  }
}

export default new Setting()
export { setting }