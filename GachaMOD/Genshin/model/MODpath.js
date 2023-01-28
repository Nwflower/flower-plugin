import path from 'path'
import { pluginRoot } from "../../../model/path.js";

// 子插件名
const modName = path.basename(path.join(import.meta.url, '../../'))
// 子插件根目录
const modRoot = path.join(pluginRoot, 'GachaMOD', modName)
// 子插件资源目录
const modResources = path.join(modRoot, 'resources')

export {
  modName,
  modRoot,
  modResources,
}