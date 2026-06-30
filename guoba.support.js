import genshinSetting from './GachaMOD/Genshin/model/setting.js'
import pluginSetting from './model/setting.js'
import lodash from "lodash";
import { pluginResources, pluginRoot } from "./model/path.js";
import path from 'path'
import fs from 'fs'

// 检查星铁模块是否存在
const hasStarRail = fs.existsSync(`${pluginRoot}/GachaMOD/StarRail`)

// 动态加载星铁 setting
let starrailSetting = null
if (hasStarRail) {
  starrailSetting = (await import('./GachaMOD/StarRail/model/setting.js')).default
}

export function supportGuoba () {

  
  // ===== 插件配置 (apps/ → defSet/) =====
  const pluginSchemas = [
    {
      label: '插件配置',
      component: 'SOFT_GROUP_BEGIN'
    },
    {
      label: '违禁词监听',
      component: 'Divider'
    },
    {
      field: 'wordListener.enable',
      label: '违禁词开关',
      bottomHelpMessage: '开启违禁词监听',
      component: 'Switch'
    },
    {
      field: 'wordListener.time',
      label: '违禁词禁言时长',
      bottomHelpMessage: '禁言时长，秒',
      component: 'InputNumber',
      required: false,
      componentProps: {
        min: 1,
        max: 86400,
        placeholder: '请设置时长'
      }
    },
    {
      label: '隐形拉黑',
      component: 'Divider'
    },
    {
      field: 'block.enable',
      label: '隐形拉黑开关',
      bottomHelpMessage: '开启隐形拉黑，降低拉黑用户的抽卡概率、且请求喵喵面板时总是失败',
      component: 'Switch'
    }
  ]

  // ===== 原神配置 (GachaMOD/Genshin/ → Genshin/def/) =====
  const genshinSchemas = [
    {
      label: '原神配置',
      component: 'SOFT_GROUP_BEGIN'
    },
    {
      label: '功能开关',
      component: 'Divider'
    },
    {
      field: 'Genshin.gacha.enable',
      label: '自定义抽卡',
      bottomHelpMessage: '使用原神抽卡服务',
      component: 'Switch'
    },
    {
      field: 'Genshin.gacha.more',
      label: '百连开关',
      bottomHelpMessage: '关闭后，无法使用二十连、三十连以及百连',
      component: 'Switch'
    },
    {
      field: 'Genshin.gacha.sync',
      label: '卡池自动同步',
      bottomHelpMessage: '抽卡前检查卡池是否正确',
      component: 'Switch'
    },
    {
      field: 'Genshin.gacha.relifeCD',
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
      field: 'Genshin.coin.default.pink',
      label: '每日纠缠之缘',
      bottomHelpMessage: '全局通用，每日粉球数量',
      component: 'InputNumber',
      required: true,
      componentProps: {
        min: 0,
        max: 10000,
        placeholder: '请输入数量'
      }
    },
    {
      field: 'Genshin.coin.default.blue',
      label: '每日相遇之缘',
      bottomHelpMessage: '全局通用，每日蓝球数量',
      component: 'InputNumber',
      required: true,
      componentProps: {
        min: 0,
        max: 10000,
        placeholder: '请输入数量'
      }
    },
    {
      label: '概率设置',
      component: 'Divider'
    },
    {
      field: 'Genshin.gacha.wai',
      label: '小保底概率',
      bottomHelpMessage: '小保底不歪概率，百分比（0-100）',
      component: 'InputNumber',
      required: true,
      componentProps: {
        min: 0,
        max: 100,
        placeholder: '请输入概率'
      }
    },
    {
      field: 'Genshin.gacha.chance5',
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
      field: 'Genshin.gacha.chance4',
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
      field: 'Genshin.gacha.chanceW5',
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
      field: 'Genshin.gacha.chanceW4',
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
      field: 'Genshin.gacha.setchance',
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
    }
  ]

  // ===== 星铁配置 (GachaMOD/StarRail/ → StarRail/def/) =====
  const starrailSchemas = hasStarRail ? [
    {
      label: '星铁配置',
      component: 'SOFT_GROUP_BEGIN'
    },
    {
      label: '功能开关',
      component: 'Divider'
    },
    {
      field: 'StarRail.gacha.enable',
      label: '自定义抽卡',
      bottomHelpMessage: '使用星铁抽卡服务',
      component: 'Switch'
    },
    {
      field: 'StarRail.gacha.more',
      label: '百连开关',
      bottomHelpMessage: '关闭后，无法使用二十连、三十连以及百连',
      component: 'Switch'
    },
    {
      field: 'StarRail.gacha.sync',
      label: '卡池自动同步',
      bottomHelpMessage: '抽卡前检查卡池是否正确',
      component: 'Switch'
    },
    {
      field: 'StarRail.gacha.relifeCD',
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
      field: 'StarRail.coin.default.pink',
      label: '每日星轨专票',
      bottomHelpMessage: '全局通用，每日专票数',
      component: 'InputNumber',
      required: true,
      componentProps: {
        min: 0,
        max: 10000,
        placeholder: '请输入数量'
      }
    },
    {
      field: 'StarRail.coin.default.blue',
      label: '每日星轨通票',
      bottomHelpMessage: '全局通用，每日通票数',
      component: 'InputNumber',
      required: true,
      componentProps: {
        min: 0,
        max: 10000,
        placeholder: '请输入数量'
      }
    },
    {
      label: '概率设置',
      component: 'Divider'
    },
    {
      field: 'StarRail.gacha.wai',
      label: '小保底概率',
      bottomHelpMessage: '小保底不歪概率，百分比（0-100）',
      component: 'InputNumber',
      required: true,
      componentProps: {
        min: 0,
        max: 100,
        placeholder: '请输入概率'
      }
    },
    {
      field: 'StarRail.gacha.chance5',
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
      field: 'StarRail.gacha.chance4',
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
      field: 'StarRail.gacha.chanceW5',
      label: '五星光锥概率',
      bottomHelpMessage: '光锥池5星的出货概率，0-10000',
      component: 'InputNumber',
      required: true,
      componentProps: {
        min: 0,
        max: 10000,
        placeholder: '请输入概率'
      }
    },
    {
      field: 'StarRail.gacha.chanceW4',
      label: '四星光锥概率',
      bottomHelpMessage: '光锥池4星的出货概率，0-10000',
      component: 'InputNumber',
      required: true,
      componentProps: {
        min: 0,
        max: 10000,
        placeholder: '请输入概率'
      }
    },
    {
      field: 'StarRail.gacha.setchance',
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
    }
  ] : []

  return {
    pluginInfo: {
      name: 'flower-plugin',
      title: '抽卡插件',
      author: '@听语惊花',
      authorLink: 'https://github.com/Nwflower',
      link: 'https://github.com/Nwflower/flower-plugin',
      isV3: true,
      isV2: false,
      description: '集百连与单抽于一体的综合性模拟抽卡插件',
      icon: 'iconoir:3d-three-pts-box',
      iconColor: '#d19f56',
      iconPath: path.join(pluginResources, 'img/logo_flower_plugin.png'),
    },
    configInfo: {
      schemas: [
        ...pluginSchemas,
        ...genshinSchemas,
        ...starrailSchemas
      ],

      getConfigData () {
        // 插件配置（defSet/）
        let pluginConfig = pluginSetting.merge()
        // 原神配置（Genshin/def/）
        let genshinConfig = genshinSetting.merge()
        let data = { ...pluginConfig, Genshin: genshinConfig }

        // 星铁配置（StarRail/def/）
        if (hasStarRail && starrailSetting) {
          let srConfig = starrailSetting.merge()
          data.StarRail = srConfig
        }

        return data
      },

      setConfigData (data, { Result }) {
        let pluginConfig = pluginSetting.merge()
        let genshinConfig = genshinSetting.merge()
        let srConfig = hasStarRail && starrailSetting ? starrailSetting.merge() : null

        for (let [keyPath, value] of Object.entries(data)) {
          // ===== 插件配置 =====
          if (keyPath === 'wordListener.enable') {
            let config = pluginSetting.getConfig('wordListener')
            config.enable = value
            pluginSetting.setConfig('wordListener', config)
            continue
          }
          if (keyPath === 'wordListener.time') {
            let config = pluginSetting.getConfig('wordListener')
            config.time = value
            pluginSetting.setConfig('wordListener', config)
            continue
          }
          if (keyPath === 'block.enable') {
            let config = pluginSetting.getConfig('block')
            config.enable = value
            pluginSetting.setConfig('block', config)
            continue
          }

          // ===== 原神配置 =====
          if (keyPath.startsWith('Genshin.')) {
            let realKey = keyPath.replace('Genshin.', '')
            if (realKey === 'gacha.setchance' && value === 100) {
              lodash.set(genshinConfig, 'gacha.chance5', 60)
              lodash.set(genshinConfig, 'gacha.chanceW5', 70)
              lodash.set(genshinConfig, 'gacha.chance4', 510)
              lodash.set(genshinConfig, 'gacha.chanceW4', 600)
              lodash.set(genshinConfig, 'gacha.wai', 50)
            } else {
              lodash.set(genshinConfig, realKey, value)
            }
            continue
          }

          // ===== 星铁配置 =====
          if (keyPath.startsWith('StarRail.') && srConfig) {
            let realKey = keyPath.replace('StarRail.', '')
            if (realKey === 'gacha.setchance' && value === 100) {
              lodash.set(srConfig, 'gacha.chance5', 60)
              lodash.set(srConfig, 'gacha.chanceW5', 80)
              lodash.set(srConfig, 'gacha.chance4', 510)
              lodash.set(srConfig, 'gacha.chanceW4', 660)
              lodash.set(srConfig, 'gacha.wai', 50)
            } else {
              lodash.set(srConfig, realKey, value)
            }
            continue
          }

          // 其他插件配置
          lodash.set(pluginConfig, keyPath, value)
        }

        if (srConfig) starrailSetting.analysis(srConfig)
        genshinSetting.analysis(genshinConfig)
        pluginSetting.analysis(pluginConfig)

        return Result.ok({}, '设置成功~')
      }
    }
  }
}
