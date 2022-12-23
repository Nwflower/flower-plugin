# 抽卡插件flower-plugin
flower-plugin是一个适用于V3版本Yunzai-Bot的原神图鉴插件包，主要提供拓展抽卡功能，意在不修改本体抽卡卡池信息的情况下提供自定义卡池的拓展

## 功能一览列表
| 命令| 说明|
|:--------|------------|
| 百连 | 一次性进行多次十连，可能会对服务器产生较大负载。小型服务器建议卸载本插件。设置的抽数上限不足可能无法使用该命令。 |
| 单抽 | 单抽一次指定卡池。占用一次抽卡次数。 |
| 转生 | 转生为任意角色。不会消耗任何生成图片的负载，也不会占用抽卡次数。 |
| 更新群名片 | 功能已升级并独立成另一插件：自动化插件[auto-plugin](https://gitee.com/Nwflower/auto-plugin)。 |
| 设置头衔xxx | 给群友设置头衔；只在机器人是群主时生效|
| 谁是卧底 | 请发送`谁是卧底规则查看`|
| #抽卡设置   | 设置抽卡的参数，如卡池角色，四星五星概率。 |
| #设置抽卡   | 管理某群抽卡时的次数等等，私聊时为全局设置。 |
| #我的卡池   | 自己自定义自己的卡池。 |
| 文字狱 | 只在机器人为管理员的时候生效。提供违禁词管控，命令有`#屏蔽(本群)xxx`、`#取消屏蔽(本群)xxx`、`#屏蔽词列表`。词库文件在`flower-plugin\resources\blackword`对应群号目录下，可以一键导入词库文件也可以一键删库。需要先开启该功能 |

## 反馈

如果你需要提出issue或者PR，请前往github的相关页面。

[提出issue](https://github.com/Nwflower/flower-plugin/issues)

[发起PR](https://github.com/Nwflower/flower-plugin/pulls)

当然，你也可以使用QQ群组功能反馈。**点击加入[FLOWER插件交流群](https://qm.qq.com/cgi-bin/qm/qr?k=XOTZhBWpv68F1sfsMIzKJpg28NBPKJgg&jump_from=webapi&authKey=/XagQoLiUhOi+t67MCkWOSRLlXe+ywVmrkCHdoD3CjwqNzAUYspTrqYklkwb3W0R)**。

如果你觉得本插件还行，不妨给个star或者[爱发电](https://afdian.net/a/Nwflower)，你的支持不会获得额外内容，但会提高本项目的更新积极性

### 鸣谢

| 名单     | 联系方式     | 主要贡献     |
| -------- | ------------ | ------------ |
| SunRy曉K | QQ1509293009 | 更新维护支持 |
| ZDPLM    | QQ2895699730 | 提供资源图片 |
| Pluto    | QQ717157592  | 谁是卧底.js  |

### 发电榜

| NickName   | RMB Contribution |
| :--------- | ---------------: |
| 杨花洛尽   |             23.3 |
| 归来？汐去 |               20 |
| 寮青       |               15 |
| 溯流光     |               15 |
| 薛皮皮     |                5 |

## 获取说明

使用github源获取插件

在Yunzai-Bot根目录下，运行cmd，输入以下指令

```
git clone --depth=1 https://github.com/Nwflower/flower-plugin.git ./plugins/flower-plugin/
```
如果运行失败，可以使用gitee镜像源，指令如下
```
git clone --depth=1 https://gitee.com/Nwflower/flower-plugin.git ./plugins/flower-plugin/
```

## 其他
### Nwflower插件全家桶

| 插件名                | 插件地址                                                  |
| --------------------- | --------------------------------------------------------- |
| 抽卡插件Flower-plugin | [flower-plugin](https://gitee.com/Nwflower/flower-plugin) |
| Atlas原神图鉴         | [Atlas](https://gitee.com/Nwflower/atlas)                 |
| 自动化插件auto-plugin | [auto-plugin](https://gitee.com/Nwflower/auto-plugin)     |

### 友情链接

* Yunzai-Bot插件库：[☞Github](https://github.com/yhArcadia/Yunzai-Bot-plugins-index)/[☞Gitee](https://gitee.com/yhArcadia/Yunzai-Bot-plugins-index)
* Yunzai-Bot（V3）：[☞Github](https://github.com/Le-niao/Yunzai-Bot)/[☞Gitee](https://gitee.com/Le-niao/Yunzai-Bot) 
* 严禁用于任何商业用途和非法行为