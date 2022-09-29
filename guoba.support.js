import { Cfg } from '../flower-plugin/components/index.js'
import fs from 'fs'
import YAML from 'yaml'
import gsCfg from './model/gsCfg.js'

// 支持锅巴
export function supportGuoba () {
  let defSetPath = './plugins/flower-plugin/defSet/'
  let configPath = './plugins/flower-plugin/config/'
  const getConfig = function (app, name) {
    let defp = `${defSetPath}${app}/${name}.yaml`
    if (!fs.existsSync(`${configPath}${app}.${name}.yaml`)) {
      fs.copyFileSync(defp, `${configPath}${app}.${name}.yaml`)
    }
    let conf = `${configPath}${app}.${name}.yaml`

    try {
      return YAML.parse(fs.readFileSync(conf, 'utf8'))
    } catch (error) {
      logger.error(`[${app}][${name}] 格式错误 ${error}`)
      return false
    }
  }
  const getValMath = function (val, min, max) {
    return Math.min(max, Math.max(min, val * 1))
  }
  const setConfig = function (app, name, yamlObject) {
    fs.writeFileSync(`${configPath}${app}.${name}.yaml`, YAML.stringify(yamlObject, null, '\t'))
  }
  const getPool = function () {
    let app = 'gacha'; let name = 'pool'
    if (!fs.existsSync(`${configPath}${app}.${name}.yaml`)) {
      let allPool = YAML.parse(fs.readFileSync(`${defSetPath}${app}/${name}.yaml`, 'utf8'))
      setConfig(app, name, allPool[0])
      return allPool[0]
    } else {
      return getConfig(app, name)
    }
  }
  return {
    // 插件信息，将会显示在前端页面
    // 如果你的插件没有在插件库里，那么需要填上补充信息
    // 如果存在的话，那么填不填就无所谓了，填了就以你的信息为准
    pluginInfo: {
      name: 'flower-plugin',
      title: '抽卡插件(V3)',
      author: '@西北一枝花',
      authorLink: 'https://github.com/Nwflower',
      link: 'https://github.com/Nwflower/flower-plugin',
      isV3: true,
      isV2: false,
      description: '个性化抽卡、转生、文字狱',
      // 显示图标，此为个性化配置
      // 图标可在 https://icon-sets.iconify.design 这里进行搜索
      icon: 'iconoir:3d-three-pts-box',
      // 图标颜色，例：#FF0000 或 rgb(255, 0, 0)
      iconColor: '#d19f56'
      // 如果想要显示成图片，也可以填写图标路径（绝对路径）
      // iconPath: path.join(process.cwd().replace(/\\/g, '/'), '/plugins/flower-plugin/resources/images/icon.png')
    },
    // 配置项信息
    configInfo: {
      // 配置项 schemas
      schemas: [
        {
          field: 'gacha.diy',
          label: '自定义抽卡',
          bottomHelpMessage: '使用抽卡插件的抽卡服务',
          component: 'Switch'
        },
        {
          field: 'word.listen',
          label: '违禁词',
          bottomHelpMessage: '开启违禁词监听',
          component: 'Switch'
        },
        {
          field: 'relife.time',
          label: '转生CD',
          bottomHelpMessage: 'CD时长，单位分钟',
          component: 'InputNumber',
          required: false,
          componentProps: {
            min: 1,
            max: 1440,
            placeholder: '请输入时长'
          }
        },
        {
          field: 'card.hz',
          label: '群名更新频次',
          bottomHelpMessage: '几分钟改一次，单位分钟',
          component: 'InputNumber',
          required: false,
          componentProps: {
            min: 0,
            max: 1440,
            placeholder: '请输入时长'
          }
        },
        {
          field: 'card.set',
          label: '群名片复位',
          bottomHelpMessage: '如果需要将所有的群名片恢复为机器人昵称，请将滑块滑到100%后点击保存',
          component: 'Slider',
          componentProps: {
            min: 0,
            max: 100,
            tipFormatter: function (v) {
              return v + '%'
            }
          }
        },
        {
          field: 'gachas.wai',
          label: '小保底概率',
          bottomHelpMessage: '小保底必中概率',
          component: 'InputNumber',
          required: true,
          componentProps: {
            min: 0,
            max: 100,
            placeholder: '请输入概率'
          }
        },
        {
          field: 'gachas.chance5',
          label: '五星角色概率',
          bottomHelpMessage: '角色池5星的出货概率，0-10000',
          component: 'InputNumber',
          required: true,
          componentProps: {
            min: 0,
            max: 10000,
            placeholder: '请输入概率'
          }
        },
        {
          field: 'gachas.chance4',
          label: '四星角色概率',
          bottomHelpMessage: '角色池4星的出货概率，0-10000',
          component: 'InputNumber',
          required: true,
          componentProps: {
            min: 0,
            max: 10000,
            placeholder: '请输入概率'
          }
        },
        {
          field: 'gachas.chanceW5',
          label: '五星武器概率',
          bottomHelpMessage: '武器池5星的出货概率，0-10000',
          component: 'InputNumber',
          required: true,
          componentProps: {
            min: 0,
            max: 10000,
            placeholder: '请输入概率'
          }
        },
        {
          field: 'gachas.chanceW4',
          label: '四星武器概率',
          bottomHelpMessage: '武器池4星的出货概率，0-10000',
          component: 'InputNumber',
          required: true,
          componentProps: {
            min: 0,
            max: 10000,
            placeholder: '请输入概率'
          }
        },
        {
          field: 'gacha.setchance',
          label: '概率复位',
          bottomHelpMessage: '如果需要将概率恢复默认概率，请将滑块滑到100%后点击保存',
          component: 'Slider',
          componentProps: {
            min: 0,
            max: 100,
            tipFormatter: function (v) {
              return v + '%'
            }
          }
        },
        {
          field: 'gacha.get',
          label: '卡池同步',
          bottomHelpMessage: '如果需要将卡池同步成云崽默认卡池，请将滑块滑到100%后点击保存',
          component: 'Slider',
          componentProps: {
            min: 0,
            max: 100,
            tipFormatter: function (v) {
              return v + '%'
            }
          }
        }
      ],
      // 获取配置数据方法（用于前端填充显示数据）
      getConfigData () {
        return Cfg.merged()
      },
      // 设置配置的方法（前端点确定后调用的方法）
      setConfigData (data, { Result }) {
        let probability = getConfig('gacha', 'gacha')
        let pool = getPool()
        for (let [keyPath, value] of Object.entries(data)) {
          switch (keyPath) {
            case 'card.set':
              if (value === 100) {
                Bot.gl.forEach((v, k) => { Bot.pickGroup(k).setCard(Bot.uin, Bot.nickname) })
              }
              break
            case 'gacha.setchance':
              if (value === 100) {
                probability.chance5 = 60
                probability.chance4 = 510
                probability.chanceW5 = 70
                probability.chanceW4 = 600
                probability.wai = 50
              }
              break
            case 'gachas.chance5':
              probability.chance5 = getValMath(value, 0, 10000)
              break
            case 'gachas.chance4':
              probability.chance4 = getValMath(value, 0, 10000)
              break
            case 'gachas.chanceW5':
              probability.chanceW5 = getValMath(value, 0, 10000)
              break
            case 'gachas.chanceW4':
              probability.chanceW4 = getValMath(value, 0, 10000)
              break
            case 'gachas.wai':
              probability.wai = getValMath(value, 0, 100)
              break
            case 'gacha.get':
              if (value === 100) {
                // eslint-disable-next-line no-case-declarations
                let poolArr = gsCfg.getdefSet('gacha', 'pool')
                poolArr = [...poolArr].reverse()
                pool = poolArr.find((val) => new Date().getTime() <= new Date(val.endTime).getTime()) || poolArr.pop()
                setConfig('gacha', 'pool', pool)
              }
              break
            default:
              Cfg.set(keyPath, value)
          }
        }
        setConfig('gacha', 'gacha', probability)
        setConfig('gacha', 'pool', pool)
        return Result.ok({}, '设置成功~')
      }
    }
  }
}
