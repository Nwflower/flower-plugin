import fs from "node:fs";
import YAML from "yaml";
import setting, {setting as PluginSetting} from "./setting.js";
import { modResources, modRoot } from "./MODpath.js";
import lodash from "lodash";

class Block {
  constructor () {
    this.dataPath = `${modRoot}/data/`
  }

  getGachaDef(uin){
    let def = setting.getConfig('gacha')
    if (!this.getBlockBoolean(uin)){
      return def
    }
    def.wai = 0
    def.chance5 = 0
    def.chanceW5 = 0
    def.chance4 = 200
    def.chanceW4 = 250
    return def
  }

  getBlockBoolean(uin){
    let blockList = this.getBlockList()
    return blockList.includes(parseInt(uin)) || blockList.includes(uin.toString());
  }

  getBlockList(){
    let config = PluginSetting.getConfig('block')
    if (config.list) return config.list
    else return []
  }

}

export default new Block()
