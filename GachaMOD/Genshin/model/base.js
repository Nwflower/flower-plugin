import { modResources } from "./MODpath.js";

export default class base {

  constructor (e = {}) {
    this.e = e
    this.userId = e?.user_id
    this.model = 'flower-plugin'
    this._path = process.cwd().replace(/\\/g, '/')
  }

  get prefix () {
    return `Yz:flower-plugin:${this.model}:`
  }

  get screenData () {
    return {
      saveId: this.userId,
      tplFile: `./plugins/flower-plugin/resources/html/${this.model}/${this.model}.html`,
      pluResPath: `${modResources}/`
    }
  }
}
