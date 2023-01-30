import setting, {setting as pluginSetting} from './GachaMOD/Genshin/model/setting.js'
import lodash from "lodash";


export function supportGuoba () {
  return {
    pluginInfo: {
      name: 'flower-plugin',
      title: '抽卡插件',
      author: '@西北一枝花',
      authorLink: 'https://github.com/Nwflower',
      link: 'https://github.com/Nwflower/flower-plugin',
      isV3: true,
      isV2: false,
      description: '集百连与单抽于一体的综合性模拟抽卡插件',
      icon: 'iconoir:3d-three-pts-box',
      iconColor: '#d19f56'
    },
    configInfo: {
      schemas: [
        {
          field: 'gacha.enable',
          label: '自定义抽卡',
          bottomHelpMessage: '使用抽卡插件的抽卡服务',
          component: 'Switch'
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
          field: 'coin.default.pink',
          label: '每日纠缠之缘',
          bottomHelpMessage: '全局通用',
          component: 'InputNumber',
          required: true,
          componentProps: {
            min: 0,
            max: 10000,
            placeholder: '请输入数量'
          }
        },
        {
          field: 'coin.default.blue',
          label: '每日相遇之缘',
          bottomHelpMessage: '全局通用',
          component: 'InputNumber',
          required: true,
          componentProps: {
            min: 0,
            max: 10000,
            placeholder: '请输入数量'
          }
        },
        {
          field: 'gacha.relifeCD',
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
          field: 'gacha.wai',
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
          field: 'gacha.chance5',
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
          field: 'gacha.chance4',
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
          field: 'gacha.chanceW5',
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
          field: 'gacha.chanceW4',
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
          field: 'gacha.sync',
          label: '卡池自动同步',
          bottomHelpMessage: '抽卡前检查卡池是否正确',
          component: 'Switch'
        }
      ],

      getConfigData () {
        let pluginConfig = pluginSetting.merge()
        return lodash.merge(setting.merge(),pluginConfig)
      },

      setConfigData (data, { Result }) {
        let allConfig = setting.merge()
        for (let [keyPath, value] of Object.entries(data)) {
          if (keyPath === 'wordListener.enable') {
            let config = pluginSetting.getConfig('wordListener')
            config.enable = value
            pluginSetting.setConfig('wordListener',config)
            continue
          }
          if (keyPath === 'wordListener.time') {
            let config = pluginSetting.getConfig('wordListener')
            config.time = value
            pluginSetting.setConfig('wordListener',config)
            continue
          }
          switch (keyPath) {
            case 'gacha.setchance':
              if (value === 100) {
                lodash.set(allConfig, 'gacha.chance5', '60')
                lodash.set(allConfig, 'gacha.chanceW5', '70')
                lodash.set(allConfig, 'gacha.chance4', '510')
                lodash.set(allConfig, 'gacha.chanceW4', '600')
                lodash.set(allConfig, 'gacha.wai', '50')
              }
              break
            default:
              lodash.set(allConfig, keyPath, value)
          }
        }
        setting.analysis(allConfig)
        return Result.ok({}, '设置成功~')
      }
    }
  }
}
