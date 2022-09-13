import path from 'path'
import { Cfg } from '../flower-plugin/components/index.js'

// 支持锅巴
export function supportGuoba () {
  return {
    // 插件信息，将会显示在前端页面
    // 如果你的插件没有在插件库里，那么需要填上补充信息
    // 如果存在的话，那么填不填就无所谓了，填了就以你的信息为准
    pluginInfo: {
      name: '抽卡插件(V3)',
      title: 'Flower-Plugin',
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
      iconColor: '#d19f56',
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
          field: 'relife.time',
          label: '转生CD',
          helpMessage: 'CD时长，单位分钟',
          bottomHelpMessage: '',
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
          helpMessage: '几分钟改一个群，单位分钟',
          bottomHelpMessage: '',
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
          bottomHelpMessage: '将所有的群名片恢复为机器人昵称，请将滑块滑到100%后点击保存',
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
          field: 'gacha.wai',
          label: '小保底概率',
          helpMessage: '小保底必中概率',
          bottomHelpMessage: '',
          component: 'InputNumber',
          required: false,
          componentProps: {
            min: 0,
            max: 100,
            placeholder: '请输入概率'
          }
        }
      ],
      // 获取配置数据方法（用于前端填充显示数据）
      getConfigData () {
        return Cfg.merged()
      },
      // 设置配置的方法（前端点确定后调用的方法）
      setConfigData (data, { Result }) {
        for (let [keyPath, value] of Object.entries(data)) {
          switch (keyPath) {
            case 'card.set':
              if (value === 100) {
                Bot.gl.forEach((v, k) => { Bot.pickGroup(k).setCard(Bot.uin, Bot.nickname) })
              }
              break
            default:
              Cfg.set(keyPath, value)
          }
        }
        return Result.ok({}, '设置成功~')
      }
    }
  }
}
