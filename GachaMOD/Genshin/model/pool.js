import fs from "node:fs";
import YAML from "yaml";
import setting from "./setting.js";
import { modResources, modRoot } from "./MODpath.js";

class Pool {
  constructor () {
    this.dataPath = `${modRoot}/data/`
  }

  getPool (uin = '10000') {
    if (!fs.existsSync(`${this.dataPath}${uin}/pool.yaml`)) {
      let config = setting.getConfig('gacha')
      if (!config.sync) {
        return this.getConfigPool()
      } else {
        return this.getDefPool()
      }
    } else {
      return YAML.parse(fs.readFileSync(`${this.dataPath}${uin}/pool.yaml`, 'utf8'))
    }
  }

  setPool (uin, obj) {
    if (!fs.existsSync(`${this.dataPath}${uin}/`)) {
      fs.mkdirSync(`${this.dataPath}${uin}/`,{ recursive: true })
    }
    fs.writeFileSync(`${this.dataPath}${uin}/pool.yaml`, YAML.stringify(obj, null, '\t'))
  }

  delPool (uin) {
    if (fs.existsSync(`${this.dataPath}${uin}/pool.yaml`)) {
      fs.unlink(`${this.dataPath}${uin}/pool.yaml`, function (err) {
        if (err) logger.error(err)
        else logger.info('删除成功')
      })
    }
  }

  getDefPool() {
    return setting.getdefSet('pool')
  }

  getConfigPool() {
    return setting.getConfig('pool')
  }

  getList (type = 'role', star = 5){
    let list = []
    fs.readdirSync(`${modResources}/img/single/${type}/${star.toString()}`)
      .filter((file) => file.endsWith('.png'))
      .forEach((value) => {list.push(value.replace('.png', '').trim())} )
    return list
  }
}

export default new Pool()
