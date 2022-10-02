import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'oicq'

// 内置版本:1.1.5
let ciku = ['老佛爷', '魔术师', '鸭舌帽', '双胞胎', '情人节', '丑小鸭', '土豆粉', '蜘蛛侠', '口香糖', '酸菜鱼', '小笼包', '薰衣草', '富二代', '生活费', '麦克风', '图书馆', '男朋友', '洗衣粉', '牛肉干', '泡泡糖', '小沈阳', '张韶涵', '刘诗诗', '甄嬛传', '甄子丹', '包青天', '大白兔', '果粒橙', '沐浴露', '洗发露', '自行车', '班主任', '过山车', '铁观音', '丑小鸭', '十面埋伏', '成吉思汗', '谢娜张杰', '福尔摩斯', '贵妃醉酒', '流星花园', '神雕侠侣', '天天向上', '勇往直前', '可口可乐', '加多宝', '蒙牛', '枕头', '原神', '作文', '老婆', '童话', '水盆', '保安', '烤肉', '唇膏', '白菜', '熊出没', '北京', '橘子', 'QQ', 'QQ音乐', '男人', 'QQ飞车', 'QQ炫舞', '大佬', '七喜', '乒乓球', '篮球', '本科', '好人', '凳子', '台式电脑', '眉毛', '面膜', '护摩之杖', '神里绫华', '安柏', '黎明神剑', '史莱姆', '磐岩结绿', '龙脊长枪', '黑岩长剑', '丽莎', '雷泽', '雷电将军', '尘世之锁', '匣里灭辰', '祸津御建鸣神命', '若坨龙王', '荧', '风晶碟', '原神', '若水', '水晶矿'] // 平民词库

let wdciku = ['老天爷', '魔法师', '遮阳帽', '龙凤胎', '光棍节', '灰姑娘', '酸辣粉', '蝙蝠侠', '木糖醇', '水煮鱼', '灌汤包', '满天星', '高富帅', '零花钱', '扩音器', '图书店', '前男友', '皂角粉', '猪肉脯', '棒棒糖', '宋小宝', '王心凌', '刘亦菲', '红楼梦', '李连杰', '狄仁杰', '金丝猴', '鲜橙多', '沐浴皂', '护发素', '电动车', '辅导员', '碰碰车', '碧螺春', '灰姑娘', '四面楚歌', '努尔哈赤', '邓超孙俪', '工藤新一', '黛玉葬花', '花样男子', '天龙八部', '非诚勿扰', '全力以赴', '百事可乐', '王老吉', '伊利', '抱枕', '原魔', '论文', '媳妇', '神话', '水桶', '保镖', '烤串', '口红', '生菜', '喜羊羊', '东京', '橙子', '微信', '网易云音乐', '女人', '跑跑卡丁车', '劲舞团', '萌新', '雪碧', '羽毛球', '足球', '大专', '坏人', '椅子', '笔记本电脑', '胡须', '面具', '雾切之回光', '神里绫人', '宵宫', '白缨枪', '飘浮灵', '护摩之杖', '雪葬的星银', '黑岩斩刀', '八重神子', '优菈', '刻晴', '贯虹之槊', '匣里龙吟', '雷电将军', '风魔龙', '空', '岩晶碟', '派蒙', '赤角石溃杵', '魔晶矿']// 卧底词库

//= ==================
// 配置
let isMute = false // 被投票出局是否禁言  true为禁言  false为不禁言
let mutetime = 1 //  禁言时间 单位：分钟
let isFaci = 1 // 0为群临时会话发词,1为群机器人好友私聊版发词
//= ==================
let gamewjName = []
let wj = []
let wd = []
let bx = []
let bxname = []
let wdname = []
let groupName = []
let cikunum
let bxnum
let wdnum
let miaosus = []
let i = 0
let piaoshu = []
let tpcs = []
let toupiaohj = false
let msgs = []
let group = null
let suijikq = false
let numstart = null
let suofang = false
let zbzt = false

export class WhoIsGay extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '谁是卧底',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 1699,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^(发起谁是卧底|解锁)$',
          /** 执行方法 */
          fnc: 'WhoIsGay'
        },
        {
          /** 命令正则匹配 */
          reg: '^(加入谁是卧底|锁房)$',
          /** 执行方法 */
          fnc: 'joingame'
        },
        {
          /** 命令正则匹配 */
          reg: '^退出谁是卧底$',
          /** 执行方法 */
          fnc: 'exitgame'
        },
        {
          /** 命令正则匹配 */
          reg: '^(发词|换词)$',
          /** 执行方法 */
          fnc: 'faci'
        },
        {
          /** 命令正则匹配 */
          reg: '^开始谁是卧底$',
          /** 执行方法 */
          fnc: 'start'
        },
        {
          /** 命令正则匹配 */
          reg: '^结束谁是卧底$',
          /** 执行方法 */
          fnc: 'EndCheck'
        },
        {
          /** 命令正则匹配 */
          reg: '^描述.*$',
          /** 执行方法 */
          fnc: 'miaosu'
        },
        {
          /** 命令正则匹配 */
          reg: '^(我投.*号|弃票)$',
          /** 执行方法 */
          fnc: 'toupiao'
        },
        {
          /** 命令正则匹配 */
          reg: '^踢出玩家$',
          /** 执行方法 */
          fnc: 'getout'
        },
        {
          /** 命令正则匹配 */
          reg: '^(自爆|我猜.*)$',
          /** 执行方法 */
          fnc: 'wdzb'
        },
        {
          /** 命令正则匹配 */
          reg: '^谁是卧底规则$',
          /** 执行方法 */
          fnc: 'wdgz'
        }
      ]
    })
  }

  async wdzb (e) {
    let guessConfig = getGuessConfig(e)
    if (guessConfig.gameing && guessConfig.current) {
      if (wj[i] === e.user_id) {
        let zbms = ''
        if (toupiaohj) {
          e.reply('投票环节不能自爆', true)
          return true
        }

        if (i === numstart) {
          e.reply('第一个描述的人不允许自爆', true)
          return true
        }

        if (e.msg === '自爆') {
          if (wd === e.user_id) {
            e.reply('卧底开始自爆,请发【我猜平民词是 xx】【我猜帮凶是X号】猜出平民词语或帮凶号数,四人之后才能猜帮凶,猜对胜利,猜错失败', true)
            for (let i = 0; i < gamewjName.length; i++) {
              zbms = zbms + `${i + 1}号玩家:` + `${gamewjName[i]}` + '\n'
            }
            await sleep(1000)
            e.reply(zbms)

            zbzt = true
            return true
          } else {
            e.reply('由于你不是卧底,自爆失败了,你出局了，游戏继续', true)
            groupName.splice(i, 1)
            wj.splice(i, 1)

            if (wj.length === 3) {
              if (wj.includes(wd) && wj.includes(bx)) {
                e.reply([`游戏结束，卧底和帮凶胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`])
                init(e)
                return true
              }
            }
            if (wj.length <= 2) {
              if (wj.includes(wd)) {
                e.reply([`游戏结束，卧底和帮凶胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`])
                init(e)
                return true
              } else {
                e.reply(`游戏结束，平民们胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`)
                init(e)
                return true
              }
            }

            if (i === wj.length) {
              if (suijikq) {
                i = numstart
                miaosus = []
                e.reply('因有人在末置位自爆且失败,所以开始新一轮的描述.....')
                setTimeout(() => {
                  e.reply([segment.at(wj[i]), `\n请${i + 1}号玩家接着描述`])
                }, 2000)
                return true
              }

              e.reply('因有人在末置位自爆且失败,所以开始新一轮的描述.....')
              i = 0
              miaosus = []
              setTimeout(() => {
                e.reply([segment.at(wj[i]), `\n请${i + 1}号玩家接着描述`])
              }, 2000)
              return true
            }

            setTimeout(() => {
              e.reply([segment.at(wj[i]), `\n请${i + 1}号玩家接着描述`])
            }, 2000)
          }
        }

        if (e.msg.includes('我猜')) {
          if (wd === e.user_id) {
            if (zbzt) {
              let wdcc = e.msg.replace(/[我猜平民词帮凶是号]/g, '').trim()
              console.log(wdcc)
              if (wj.length <= 4) { //
                if (gamewjName[Number(wdcc - 1)] === bxname) {
                  e.reply(`恭喜卧底猜中帮凶,游戏结束,卧底和帮凶胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`)
                  init(e)
                  return true
                }
              } //

              if (wdcc === ciku[cikunum]) {
                e.reply(`恭喜卧底猜中平民词语,游戏结束,卧底和帮凶胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`)
                init(e)
                return true
              } else {
                e.reply(`很遗憾,猜错了,自爆失败,游戏结束,平民们胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`)
                init(e)
                return true
              }
            }
          }
          return true
        }
      }

      return true // 返回true 阻挡消息不再往下
    }
    return true
  }

  async wdgz (e) {
    e.reply('谁是卧底游戏规则:\n1.游戏开始后,机器人会私聊发给玩家们本局词语,平民们拿到同一词语，剩下1人卧底拿到与之相关的另一词语。\n2、每人每轮用一句话描述自己拿到的词语，既不能让卧底察觉，也要给同伴以暗示。不能直接说出拿到的词语,不然直接出局。\n3、每轮描述完毕，所有在场的人投票选出怀疑的卧底，得票最多的人出局。若没有人的得票超过半数（50%），则没有人出局。若卧底出局，则游戏结束。若卧底未出局，游戏继续\n4、反复2—3流程。若卧底撑到最后一轮（场上剩2人时），则卧底获胜，反之，则大部队胜利。\n新增规则:增加帮凶身份,帮凶没有词语,只知道谁是卧底,胜利条件是帮卧底取得胜利。描述阶段到自己的发言回合时卧底可以自爆,猜中平民词则直接胜利,猜错则输,存活人数四人以下卧底可以猜帮凶,猜对胜利,猜错输,平民自爆直接出局,请确定自己是卧底再进行自爆,描述阶段第一个描述的人不能自爆。场上剩三人时,卧底和帮凶都在场的话,则卧底方胜利', true)

    return true // 返回true 阻挡消息不再往下
  }

  async WhoIsGay (e) {
    let guessConfig = getGuessConfig(e)
    if (guessConfig.gameing) {
      if (guessConfig.current) {
        e.reply('谁是卧底已经开始,无法再发起,请玩家们继续游戏')
        return true
      }

      if (e.msg === '解锁') {
        if (e.user_id === wj[0]) {
          suofang = false
          e.reply('已成功解锁房间，可加入新玩家', true)
          return true
        }
        e.reply('房主才能解锁')
        return true
      }

      e.reply('谁是卧底正在发起噢!请玩家们快点加入游戏')
      return true
    }

    if (group != null) {
      e.reply(`别群正在玩,无法发起,正在玩的群号是:【${group}】,房主是【${wj[0]}】`)
      return true
    }

    e.reply('谁是卧底已发起,请玩家们输入【加入谁是卧底】加入游戏，五人以上房主才能【锁房】【发词】,还没开始时玩家可以发送【退出谁是卧底】退出房间,请参与的玩家设置允许接受群临时对话消息,避免机器人无法发词语给你\n不懂规则的可以发【谁是卧底规则】进行查看', true)
    wj[0] = e.user_id
    groupName[0] = e.member?.card ? e.member.card : e.member?.nickname
    guessConfig.gameing = true
    group = e.group_id

    return true // 返回true 阻挡消息不再往下
  }

  // 加入谁是卧底
  async joingame (e) {
    console.log(groupName)

    let guessConfig = getGuessConfig(e)
    if (guessConfig.gameing) {
      if (guessConfig.current) {
        e.reply('谁是卧底已经开始,无法再加入游戏,请玩家们继续游戏')
        return true
      }

      if (suofang) {
        e.reply('谁是卧底已经锁定房间,无法再加入,请房主开始【发词】', true)
        return true
      }

      if (e.msg === '锁房') {
        if (wj[0] === e.user_id) {
          suofang = true
          e.reply('已成功锁定房间,无法再加入新玩家,请房主开始【发词】', true)
          return true
        }
        e.reply('发起者才能锁房', true)
        return true
      }

      if (wj.indexOf(e.user_id) === -1) {
        wj[wj.length] = e.user_id

        groupName[wj.length - 1] = e.member?.card ? e.member.card : e.member?.nickname

        e.reply(`已成功加入游戏,目前玩家人数为${wj.length}人,您是${wj.length}号玩家`, true)

        await sleep(1000)

        if (wj.length === 5) {
          e.reply([segment.at(wj[0]), '\n玩家人数已经够了,房主可以开始【锁房】【发词】了噢'])
          return true
        }

        return true
      } else {
        e.reply('你已经加入游戏了,请不要重复加入', true)
        //   console.log(e.user_id)
        return true
      }
    }
    e.reply('谁是卧底未发起')
    return true
  }

  // 退出谁是卧底
  async exitgame (e) {
    let guessConfig = getGuessConfig(e)
    let sy = wj.indexOf(e.user_id)
    if (guessConfig.gameing) {
      if (guessConfig.current) {
        e.reply('谁是卧底已经开始,无法再退出游戏,请玩家们继续游戏')
        return true
      }
      if (wj.indexOf(e.user_id) !== -1) {
        if (wj[0] === e.user_id) {
          e.reply('房主无法退出游戏', true)
          return true
        }

        wj.splice(sy, 1)
        groupName.splice(sy, 1)
        e.reply(`已成功退出游戏,目前玩家人数为${wj.length}人`, true)
        return true
      } else {
        e.reply('你都没加入,你退出锤子呢?', true)

        return true
      }
    }
    e.reply('谁是卧底未发起')
    return true
  }

  async faci (e) {
    console.log(groupName)
    let guessConfig = getGuessConfig(e)
    if (guessConfig.gameing) {
      if (guessConfig.current) {
        e.reply('谁是卧底已经开始,无法发词,请玩家们继续游戏')
        return true
      }

      if (wj[0] === e.user_id) {
        if (wj.length < 5) {
          e.reply(`人数不够,无法发词,目前人数:${wj.length}`)
          return true
        }

        cikunum = Math.round(Math.random() * (ciku.length - 1))
        wdnum = Math.round(Math.random() * (wj.length - 1))
        wd = wj[wdnum]

        console.log('卧底num', wdnum)

        while (true) {
          bxnum = Math.round(Math.random() * (wj.length - 1))
          if (bxnum !== wdnum) {
            break
          }
        }
        console.log('帮凶num', bxnum)
        bx = wj[bxnum]
        bxname = groupName[bxnum]
        wdname = groupName[wdnum]

        if (e.msg === '发词') {
          e.reply('正在发词中.....')
        } else {
          e.reply('正在换词中.....')
        }

        for (let j = 0; j < wj.length; j++) {
          if (wd === wj[j]) {
            if (isFaci === 0) { await Bot.pickMember(e.group_id, wd).sendMsg(wdciku[cikunum]) }
            if (isFaci === 1) { await Bot.pickUser(wd).sendMsg(wdciku[cikunum]) }
          } else if (bx === wj[j]) {
            if (isFaci === 0) { await Bot.pickMember(e.group_id, bx).sendMsg(`你的身份是帮凶,没有词语,你不会第一个进行描述,请根据前号玩家的描述浑水摸鱼\n卧底是${groupName[wdnum]}(${wd})\n胜利条件:卧底存活到最后,请帮卧底扫平障碍`) }
            if (isFaci === 1) { await Bot.pickUser(bx).sendMsg(`你的身份是帮凶,没有词语,你不会第一个进行描述,请根据前号玩家的描述浑水摸鱼\n卧底是${groupName[wdnum]}(${wd})\n胜利条件:卧底存活到最后,请帮卧底扫平障碍`) }
          } else {
            if (isFaci === 0) { await Bot.pickMember(e.group_id, wj[j]).sendMsg(ciku[cikunum]) }
            if (isFaci === 1) { await Bot.pickUser(wj[j]).sendMsg(ciku[cikunum]) }
          }
          await sleep(3000)
        }

        if (e.msg === '发词') {
          e.reply('发词完毕,如对词语不满意,房主可发送【换词】来更换词语和卧底,满意的话请发送【开始谁是卧底】')
        } else {
          e.reply('换词完毕,如对词语不满意,房主可发送【换词】来更换词语和卧底,满意的话请发送【开始谁是卧底】')
        }
        return true
      } else {
        e.reply('发起者才能发词或换词噢!')
        return true
      }
    }
    e.reply('谁是卧底未发起')
    return true // 返回true 阻挡消息不再往下
  }

  async start (e) {
    console.log(bxnum)
    let guessConfig = getGuessConfig(e)
    let num
    while (true) {
      num = Math.round(Math.random() * (wj.length - 1))
      if (num !== bxnum) {
        break
      }
    }
    console.log(num)
    if (guessConfig.gameing) {
      if (guessConfig.current) {
        e.reply('谁是卧底已经开始,请玩家们继续游戏')
        return true
      }

      if (e.user_id === wj[0]) {
        guessConfig.current = true
        gamewjName = groupName
        guessConfig.timer = setTimeout(() => {
          if (guessConfig.gameing && guessConfig.current) {
            e.reply(`谁是卧底已结束\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`)
            init(e)
            return true
          }
        }, 3600000)// 毫秒数
        if (num > 0 || bxnum === 0) {
          numstart = num
          i = num
        }

        e.reply('谁是卧底开始,时限一个钟', true)

        setTimeout(() => {
          e.reply([segment.at(wj[i]), '\n请开始【描述 xxx】机器人私聊发的词语'])
          return true
        }, 2000)
      } else {
        e.reply('发起者才能开始谁是卧底噢,快叫他开始吧!')
        return true
      }

      return true
    }
    e.reply('谁是卧底未发起')
    return true // 返回true 阻挡消息不再往下
  }

  async miaosu (e) {
    let guessConfig = getGuessConfig(e)
    let index = wj.indexOf(e.user_id)
    let msg = e.msg.replace(/描述/, '').trim()
    console.log('随机开启状态:' + suijikq + '起始位置:' + numstart)

    if (guessConfig.gameing) {
      if (guessConfig.current && wj.indexOf(e.user_id) !== -1) {
        if (toupiaohj) {
          e.reply('现在是投票环节,无法描述')
          return true
        }

        if (wj[i] === e.user_id) {
          if (wd === e.user_id) {
            if (msg.includes(wdciku[cikunum])) {
              e.reply(`由于你说出了你的词语,所以你出局了,且你是卧底,游戏结束,平民们胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】,帮凶是【${bxname}】`, true)
              init(e)
              return true
            }

            miaosus[i] = `${i + 1}号玩家【${groupName[i]}】描述:${msg}\n`

            i++

            if (i === wj.length || i === numstart) {
              if (suijikq) {
                if (miaosus[numstart - 1] == null) {
                  i = 0

                  setTimeout(() => {
                    e.reply([segment.at(wj[i]), '\n请描述'])
                  }, 2000)

                  return true
                }

                e.reply(miaosus)

                i = 0
                suijikq = false
                numstart = null

                for (let z = 0; z < wj.length; z++) {
                  piaoshu[z] = 0
                  tpcs[z] = 0
                  msgs[z] = `${z + 1}号玩家【${groupName[z]}】票数:${piaoshu[z]}\n`
                }

                let msnum = Math.round(Math.random() * (wj.length - 1))
                if (msnum > 0) {
                  suijikq = true
                  numstart = msnum
                  i = msnum
                }

                setTimeout(() => {
                  e.reply([segment.at(wj[i]), '\n请开始投票,为了游戏的乐趣,请不要投自己,谢谢配合\n指令【我投1号】【弃票】'])
                }, 1000)

                toupiaohj = true

                return true
              } // 随机逻辑处理

              e.reply(miaosus)

              i = 0

              for (let z = 0; z < wj.length; z++) {
                piaoshu[z] = 0
                tpcs[z] = 0
                msgs[z] = `${z + 1}号玩家【${groupName[z]}】票数:${piaoshu[z]}\n`
              }

              let msnum = Math.round(Math.random() * (wj.length - 1))
              if (msnum > 0) {
                suijikq = true
                numstart = msnum
                i = msnum
              }

              setTimeout(() => {
                e.reply([segment.at(wj[i]), '\n请开始投票,为了游戏的乐趣,请不要投自己,谢谢配合\n指令【我投1号】【弃票】'])
              }, 2000)

              toupiaohj = true

              return true
            }

            setTimeout(() => {
              e.reply([segment.at(wj[i]), '\n请描述'])
            }, 2000)

            return true
          } else {
            if (msg.includes(ciku[cikunum])) {
              groupName.splice(index, 1)
              wj.splice(index, 1)

              e.reply(`由于你说出了你的词语,所以你出局了,因你不是卧底,所以游戏继续,目前存活人数${wj.length}人,下号玩家继承此号玩家`, true)

              if (wj.length === 4) {
                e.reply('在场人数为四人,卧底可以自爆猜帮凶了')
              }

              if (wj.length <= 2) {
                if (wj.includes(wd)) {
                  e.reply([`游戏结束，卧底和帮凶胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】,帮凶是【${bxname}】`])
                  init(e)
                  return true
                }
                return true
              }

              if (i === wj.length) {
                if (suijikq) {
                  suijikq = false
                  numstart = null
                }

                i = 0
                miaosus = []
              }

              setTimeout(() => {
                e.reply([segment.at(wj[i]), '\n请描述'])
              }, 2000)

              return true
            }

            miaosus[i] = `${i + 1}号玩家【${groupName[i]}】描述:${msg}\n`

            i++

            if (i === wj.length || i === numstart) {
              if (suijikq) {
                if (miaosus[numstart - 1] == null) {
                  i = 0
                  setTimeout(() => {
                    e.reply([segment.at(wj[i]), '\n请描述'])
                  }, 2000)
                  return true
                }
                e.reply(miaosus)
                i = 0
                suijikq = false
                numstart = null

                for (let ztmp = 0; ztmp < wj.length; ztmp++) {
                  piaoshu[ztmp] = 0
                  tpcs[ztmp] = 0
                  msgs[ztmp] = `${ztmp + 1}号玩家【${groupName[ztmp]}】票数:${piaoshu[ztmp]}\n`
                }

                let msnum = Math.round(Math.random() * (wj.length - 1))
                if (msnum > 0) {
                  suijikq = true
                  numstart = msnum
                  i = msnum
                }

                setTimeout(() => {
                  e.reply([segment.at(wj[i]), '\n请开始投票,为了游戏的乐趣,请不要投自己,谢谢配合\n指令【我投1号】【弃票】'])
                }, 2000)

                toupiaohj = true

                return true
              } // 随机逻辑处理

              e.reply(miaosus)

              for (let z = 0; z < wj.length; z++) {
                piaoshu[z] = 0
                tpcs[z] = 0
                msgs[z] = `${z + 1}号玩家【${groupName[z]}】票数:${piaoshu[z]}\n`
              }

              i = 0

              let msnum = Math.round(Math.random() * (wj.length - 1))
              if (msnum > 0) {
                suijikq = true
                numstart = msnum
                i = msnum
              }

              setTimeout(() => {
                e.reply([segment.at(wj[i]), '\n请开始投票,为了游戏的乐趣,请不要投自己,谢谢配合\n指令【我投1号】【弃票】'])
              }, 2000)

              toupiaohj = true

              return true
            }

            setTimeout(() => {
              e.reply([segment.at(wj[i]), '\n请描述'])
            }, 2000)

            return true
          }
        } else {
          e.reply('现在还不是你的回合', true)
          return true
        }
      } else {
        e.reply('房主还未开始谁是卧底或你不是加入的玩家或你是玩家已经被票出去了,无法描述', true)
        return true
      }
    }
    return true
  }

  async EndCheck (e) {
    let guessConfig = getGuessConfig(e)

    if (guessConfig.gameing) {
      if (wj.indexOf(e.user_id) === -1) {
        e.reply('你再捣乱信不信我打你', true)
        return true
      }
      e.reply(`谁是卧底已结束\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是:【${wdname}】\n帮凶是:【${bxname}】`)
      init(e)
      return true
    }
    e.reply('谁是卧底未发起')
    return true
  }

  async toupiao (e) {
    // console.log(miaosus)
    let guessConfig = getGuessConfig(e)
    let msg = e.msg.replace(/我投|号/g, '').trim()
    let emsg = msg
    console.log('随机开启状态:' + suijikq + '起始位置:' + numstart)
    msg = Number(msg)

    if (guessConfig.gameing) {
      if (guessConfig.current && toupiaohj && wj.indexOf(e.user_id) !== -1) {
        if (wj[i] === e.user_id) {
          if (e.msg === '弃票') {
            e.reply('弃票成功', true)

            tpcs[i]++
            i++

            if (i === wj.length || i === numstart) {
              if (suijikq) {
                if (tpcs[numstart - 1] === 0) {
                  i = 0

                  e.reply([segment.at(wj[i]), `\n请${i + 1}号玩家接着投票`])
                  return true
                }
              }

              let maxs = 0
              let max = 0

              for (let u = 0; u < wj.length; u++) {
                let wz = msgs[u].lastIndexOf(':')
                msgs[u] = msgs[u].slice(wz + 1)
                msgs[u] = Number(msgs[u])
                if (msgs[u] > max) {
                  max = msgs[u]
                }
              }

              for (let b = 0; b < wj.length; b++) {
                if (msgs[b] === max) {
                  maxs++
                }
              }

              if (maxs > 1) {
                await sleep(1000)

                e.reply('平票无人出局,游戏继续,开始新一轮描述')

                let num = Math.round(Math.random() * (wj.length - 1))

                if (num > 0) {
                  i = num
                  numstart = num
                  suijikq = true
                  miaosus = []
                  msgs = []
                  tpcs = []
                } else {
                  i = 0
                  numstart = null
                  suijikq = false
                  miaosus = []
                  msgs = []
                  tpcs = []
                }

                setTimeout(() => {
                  e.reply([segment.at(wj[i]), '\n请开始新一轮的描述'])
                }, 2000)

                toupiaohj = false

                return true
              }

              let sw = msgs.indexOf(max)

              await sleep(1000)

              e.reply([segment.at(wj[sw]), '\n由于你票数最多,所以你出局了'])

              if (isMute) {
                await e.group.muteMember(wj[sw], mutetime * 60) // 禁言
              }
              groupName.splice(sw, 1)
              wj.splice(sw, 1)

              if (wj.length === 4) {
                e.reply('在场人数为四人,卧底可以自爆猜帮凶了')
              }

              if (wj.length === 3) {
                if (wj.includes(wd) && wj.includes(bx)) {
                  e.reply([`游戏结束，卧底和帮凶胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`])
                  init(e)
                  return true
                }
              }
              if (wj.length <= 2) {
                if (wj.includes(wd)) {
                  e.reply([`游戏结束，卧底和帮凶胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`])
                  init(e)
                  return true
                } else {
                  e.reply(`游戏结束，平民们胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`)
                  init(e)
                  return true
                }
              }

              if (wj.includes(wd)) {
                setTimeout(() => {
                  e.reply('很遗憾,出局的并不是卧底,游戏继续')
                }, 2000)

                let num = Math.round(Math.random() * (wj.length - 1))

                if (num > 0) {
                  i = num
                  numstart = num
                  suijikq = true
                  miaosus = []
                  msgs = []
                  tpcs = []
                } else {
                  i = 0
                  numstart = null
                  suijikq = false
                  msgs = []
                  miaosus = []
                  tpcs = []
                }

                setTimeout(() => {
                  e.reply([segment.at(wj[i]), '\n请开始新一轮的描述'])
                }, 2000)

                toupiaohj = false

                return true
              } else {
                await sleep(2000)

                e.reply(`卧底出局,游戏结束，平民们胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`)

                init(e)
                return true
              }
            }

            setTimeout(() => {
              e.reply([segment.at(wj[i]), `\n请${i + 1}号玩家接着投票`])
            }, 2000)

            return true
          }

          if (miaosus[msg - 1].includes(emsg)) {
            piaoshu[msg - 1] = piaoshu[msg - 1] + 1
            msgs[msg - 1] = `${msg}号玩家【${groupName[msg - 1]}】票数:${piaoshu[msg - 1]}\n`

            let tpms = msgs + '\n\n' + miaosus
            tpms = tpms.replace(/,/g, '')
            e.reply(tpms)

            tpcs[i]++
            i++

            if (i === wj.length || i === numstart) {
              if (suijikq) {
                if (tpcs[numstart - 1] === 0) {
                  i = 0

                  e.reply([segment.at(wj[i]), `\n请${i + 1}号玩家接着投票`])
                  return true
                }
              }

              let maxs = 0
              let max = 0

              for (let u = 0; u < wj.length; u++) {
                let wz = msgs[u].lastIndexOf(':')
                msgs[u] = msgs[u].slice(wz + 1)
                msgs[u] = Number(msgs[u])
                if (msgs[u] > max) {
                  max = msgs[u]
                }
              }

              for (let b = 0; b < wj.length; b++) {
                if (msgs[b] === max) {
                  maxs++
                }
              }

              if (maxs > 1) {
                await sleep(1000)

                e.reply('平票无人出局,游戏继续,开始新一轮描述')

                let num = Math.round(Math.random() * (wj.length - 1))

                if (num > 0) {
                  i = num
                  numstart = num
                  suijikq = true
                  miaosus = []
                  msgs = []
                  tpcs = []
                } else {
                  i = 0
                  numstart = null
                  suijikq = false
                  msgs = []
                  miaosus = []
                  tpcs = []
                }

                setTimeout(() => {
                  e.reply([segment.at(wj[i]), '\n请开始新一轮的描述'])
                }, 2000)

                toupiaohj = false

                return true
              }

              let sw = msgs.indexOf(max)

              await sleep(1000)

              e.reply([segment.at(wj[sw]), '\n由于你票数最多,所以你出局了'])

              if (isMute) {
                await e.group.muteMember(wj[sw], mutetime * 60) // 禁言
              }
              groupName.splice(sw, 1)
              wj.splice(sw, 1)

              if (wj.length === 3) {
                if (wj.includes(wd) && wj.includes(bx)) {
                  e.reply([`游戏结束，卧底和帮凶胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`])
                  init(e)
                  return true
                }
              }

              if (wj.length <= 2) {
                if (wj.includes(wd)) {
                  e.reply([`游戏结束，卧底和帮凶胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`])
                  init(e)
                  return true
                } else {
                  e.reply(`游戏结束，卧底出局,平民们胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`)
                  init(e)
                  return true
                }
              }

              if (wj.includes(wd)) {
                e.reply('很遗憾,出局的并不是卧底,游戏继续')

                let num = Math.round(Math.random() * (wj.length - 1))

                if (num > 0) {
                  i = num
                  numstart = num
                  suijikq = true
                  miaosus = []
                  msgs = []
                  tpcs = []
                } else {
                  i = 0
                  msgs = []
                  miaosus = []
                  tpcs = []
                  numstart = null
                  suijikq = false
                }

                setTimeout(() => {
                  e.reply([segment.at(wj[i]), '\n请开始新一轮的描述'])
                }, 2000)

                toupiaohj = false

                return true
              } else {
                e.reply(`卧底出局,游戏结束,平民们胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`)

                init(e)
                return true
              }
            }

            setTimeout(() => {
              e.reply([segment.at(wj[i]), `\n请${i + 1}号玩家接着投票`])
            }, 2000)

            return true
          }
          e.reply('请输入正确的玩家序号')
          return true
        } else {
          e.reply('现在还不是你的回合', true)
          return true
        }
      } else {
        e.reply('现在不是投票环节或你不是游戏存活的玩家，无法投票', true)
        return true
      }
    }
    return true // 返回true 阻挡消息不再往下
  }

  async getout (e) {
    let guessConfig = getGuessConfig(e)
    let num = Math.round(Math.random() * (wj.length - 1))
    let qq
    let indexs
    console.log(num, '随机开启状态:' + suijikq + '起始位置:' + numstart)

    if (e.message[0].type === 'at') {
      qq = e.message[0].qq
    } else if (e.message[1].type === 'at') {
      qq = e.message[1].qq
    } else {
      e.reply('未识别成功,请艾特玩家')
      return true
    }

    indexs = wj.indexOf(qq)

    if (guessConfig.gameing && guessConfig.current) {
      if (wj.indexOf(e.user_id) !== -1) {
        if (indexs === -1) {
          e.reply('他不是参与游戏的玩家,无法踢出', true)
          return true
        }

        wj.splice(indexs, 1)

        if (wj.indexOf(wd) === -1) {
          e.reply(`由于踢出的是卧底,游戏结束\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`)
          init(e)
          return true
        }

        e.reply(`成功踢出玩家,目前玩家人数为${wj.length}人`, true)

        if (wj.length === 4) {
          e.reply('在场玩家人数四人，卧底可以自爆猜帮凶了！')
        }

        if (wj.length === 3) {
          if (wj.includes(wd) && wj.includes(bx)) {
            e.reply([`游戏结束，卧底和帮凶胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`])
            init(e)
            return true
          }
        }

        if (wj.length <= 2) {
          if (wj.includes(wd)) {
            e.reply([`游戏结束，卧底和帮凶胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`])
            init(e)
            return true
          } else {
            e.reply(`游戏结束，卧底出局,平民们胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`)
            init(e)
            return true
          }
        }

        if (i === wj.length || i === numstart) {
          if (toupiaohj) {
            if (suijikq) {
              if (tpcs[numstart - 1] === 0) {
                i = 0
                e.reply(segment.at(wj[i], `请${i + 1}号玩家接着投票,指令【我投x号】【弃票】`))
                return true
              }
            }

            let maxs = 0
            let max = 0

            for (let u = 0; u < wj.length; u++) {
              let wz = msgs[u].lastIndexOf(':')
              msgs[u] = msgs[u].slice(wz + 1)
              msgs[u] = Number(msgs[u])
              if (msgs[u] > max) {
                max = msgs[u]
              }
            }

            for (let b = 0; b < wj.length; b++) {
              if (msgs[b] === max) {
                maxs++
              }
            }

            if (maxs > 1) {
              await sleep(1000)

              e.reply('平票无人出局,游戏继续,开始新一轮描述')

              if (num > 0) {
                i = num
                numstart = num
                suijikq = true
                miaosus = []
                msgs = []
                tpcs = []
              } else {
                i = 0
                miaosus = []
                msgs = []
                tpcs = []
                numstart = null
                suijikq = false
              }

              setTimeout(() => {
                e.reply([segment.at(wj[i]), '\n请开始新一轮的描述'])
              }, 2000)
              toupiaohj = false
              return true
            }

            let sw = msgs.indexOf(max)

            await sleep(1000)

            e.reply([segment.at(wj[sw]), '\n由于你票数最多,所以你出局了'])

            if (isMute) {
              await e.group.muteMember(wj[sw], mutetime * 60) // 禁言
            }
            groupName.splice(sw, 1)
            wj.splice(sw, 1)

            if (wj.length === 4) {
              e.reply('在场玩家人数为四人，卧底可以自爆猜帮凶了！')
            }

            if (wj.length === 3) {
              if (wj.includes(wd) && wj.includes(bx)) {
                e.reply([`游戏结束，卧底和帮凶胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`])
                init(e)
                return true
              }
            }

            if (wj.length <= 2) {
              if (wj.includes(wd)) {
                e.reply([`游戏结束，卧底和帮凶胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`])
                init(e)
                return true
              } else {
                e.reply(`游戏结束，卧底出局,平民们胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`)
                init(e)
                return true
              }
            }

            if (wj.includes(wd)) {
              setTimeout(() => {
                e.reply('很遗憾,出局的并不是卧底,游戏继续')
              }, 2000)

              if (num > 0) {
                i = num
                numstart = num
                suijikq = true
                miaosus = []
                msgs = []
                tpcs = []
              } else {
                i = 0
                msgs = []
                miaosus = []
                tpcs = []
                numstart = null
                suijikq = false
              }

              setTimeout(() => {
                e.reply([segment.at(wj[i]), '\n请开始新一轮的描述'])
              }, 2000)

              toupiaohj = false

              return true
            } else {
              e.reply(`游戏结束，卧底出局,平民们胜利\n平民词语:${ciku[cikunum]}\n卧底词语:${wdciku[cikunum]}\n卧底是【${wdname}】\n帮凶是【${bxname}】`)

              init(e)
              return true
            }
          } else {
            if (suijikq) {
              if (miaosus[numstart] == null) {
                setTimeout(() => {
                  e.reply([segment.at(wj[i]), '\n请描述'])
                }, 2000)

                return true
              }

              if (miaosus[numstart - 1] == null) {
                i = 0

                setTimeout(() => {
                  e.reply([segment.at(wj[i]), '\n请描述'])
                }, 2000)

                return true
              }

              e.reply(miaosus)

              i = 0

              for (let z = 0; z < wj.length; z++) {
                piaoshu[z] = 0
                tpcs[z] = 0
                msgs[z] = `${z + 1}号玩家${groupName[z]}票数:${piaoshu[z]}\n`
              }

              let msnum = Math.round(Math.random() * (wj.length - 1))
              if (msnum > 0) {
                suijikq = true
                numstart = msnum
                i = msnum
              }

              setTimeout(() => {
                e.reply([segment.at(wj[i]), '\n请开始投票,为了游戏的乐趣,请不要投自己,谢谢配合\n指令【我投1号】【弃票】'])
              }, 2000)

              toupiaohj = true

              return true
            }

            e.reply(miaosus)

            i = 0

            for (let z = 0; z < wj.length; z++) {
              piaoshu[z] = 0
              tpcs[z] = 0
              msgs[z] = `${z + 1}号【${groupName[z]}】玩家票数:${piaoshu[z]}\n`
            }

            let msnum = Math.round(Math.random() * (wj.length - 1))
            if (msnum > 0) {
              suijikq = true
              numstart = msnum
              i = msnum
            }

            setTimeout(() => {
              e.reply([segment.at(wj[i]), '\n请开始投票,为了游戏的乐趣,请不要投自己,谢谢配合\n指令【我投1号】【弃票】'])
            }, 2000)

            toupiaohj = true

            return true
          }
        }

        groupName.splice(indexs, 1)

        if (toupiaohj) {
          setTimeout(() => {
            e.reply([segment.at(wj[i]), `\n请${i + 1}号玩家接着投票`])
          }, 2000)

          return true
        } else {
          setTimeout(() => {
            e.reply([segment.at(wj[i]), `\n请${i + 1}号玩家接着描述`])
          }, 2000)
          return true
        }
      }
      e.reply('只有正在参加谁是卧底游戏的玩家才能踢人噢', true)
      return true
    }
    e.reply('谁是卧底未开始,无法踢人')
    return true
  }
}

function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function init (e) {
  let guessConfig = getGuessConfig(e)
  guessConfig.gameing = false
  guessConfig.current = false
  toupiaohj = false
  suofang = false
  zbzt = false
  group = null
  clearTimeout(guessConfig.timer)
  wd = []
  wj = []
  bx = []
  groupName = []
  piaoshu = []
  miaosus = []
  msgs = []
  bxname = []
  wdname = []
  tpcs = []
  gamewjName = []
  i = 0
}

const guessConfigMap = new Map()

function getGuessConfig (e) {
  let key = e.message_type + e[e.isGroup ? 'group_id' : 'user_id']
  let config = guessConfigMap.get(key)
  if (config == null) {
    config = {
      gameing: false,
      current: false,
      timer: null
    }
    guessConfigMap.set(key, config)
  }
  return config
}
