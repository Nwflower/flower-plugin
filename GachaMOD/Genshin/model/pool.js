import fs from "node:fs";
import YAML from "yaml";
import setting from "./setting.js";
import { modResources, modRoot } from "./MODpath.js";
import lodash from "lodash";

class Pool {
  constructor () {
    this.dataPath = `${modRoot}/data/`
  }

  // 获取运行时卡池
  getUpPool (uin, def, type, role2=false) {
    let NowPool = this.getPool(uin)
    let pool = {}
    if (type === 'weapon') {
      let weapon4 = lodash.difference(def.weapon4, NowPool.weapon4)
      let weapon5 = lodash.difference(def.weapon5, NowPool.weapon5)
      pool = {
        up4: NowPool.weapon4,
        role4: def.role4,
        weapon4,
        up5: NowPool.weapon5,
        five: weapon5
      }
    }

    if (type === 'role') {
      let role4 = lodash.difference(def.role4, NowPool.up4)
      let role5 = lodash.difference(def.role5, NowPool.up5)

      let up5 = NowPool.up5

      if (role2) up5 = NowPool['up5_2']

      pool = {
        up4: NowPool.up4,
        role4,
        weapon4: def.weapon4,
        up5,
        five: role5
      }
    }

    if (type === 'permanent') {
      pool = {
        up4: [],
        role4: def.role4,
        weapon4: def.weapon4,
        up5: [],
        five: def.role5,
        fiveW: def.weapon5
      }
    }

    pool.weapon3 = def.weapon3
    return pool
  }

  // 获取配置卡池
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

  // 根据QQ号设置卡池
  setPool (uin, obj) {
    if (!fs.existsSync(`${this.dataPath}${uin}/`)) {
      fs.mkdirSync(`${this.dataPath}${uin}/`,{ recursive: true })
    }
    fs.writeFileSync(`${this.dataPath}${uin}/pool.yaml`, YAML.stringify(obj, null, '\t'))
  }

  // 删除某QQ号的卡池
  delPool (uin) {
    if (fs.existsSync(`${this.dataPath}${uin}/pool.yaml`)) {
      fs.unlink(`${this.dataPath}${uin}/pool.yaml`, function (err) {
        if (err) logger.error(err)
        else logger.info('删除成功')
      })
    }
  }

  // 获取同步的卡池
  getDefPool() {
    return setting.getdefSet('pool')
  }

  // 获取配置的卡池
  getConfigPool() {
    return setting.getConfig('pool')
  }

  // 获取资源文件列表
  getList (type = 'role', star = 5){
    let list = []
    fs.readdirSync(`${modResources}/img/single/${type}/${star.toString()}`)
      .filter((file) => file.endsWith('.png'))
      .forEach((value) => {list.push(value.replace('.png', '').trim())} )
    return list
  }
}

export default new Pool()
