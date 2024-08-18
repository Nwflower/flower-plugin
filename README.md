<img decoding="async" align=right src="resources/img/logo_flower_plugin.png" width="25%">

# 抽卡插件flower-plugin For Yunzai-Bot V3

Yunzai-Bot V3插件包，主要提供拓展抽卡功能，意在不修改本体抽卡卡池信息的情况下提供自定义卡池的拓展

# 前排提示

感谢您访问该插件！值得一提的是，该插件已停止功能的维护与更新，非必要请勿发起issue，目前仅做卡池更新维护，感谢您的理解！

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

## 功能一览列表

| 命令| 说明|
|:--------|------------|
| 百连 | 一次性进行多次十连，可能会对服务器产生较大负载。小型服务器建议卸载本插件。设置的抽数上限不足可能无法使用该命令。可以使用`#抽卡设置百连关闭`来关闭该功能 |
| 单抽 | 单抽一次指定卡池。消耗一个对应球。 |
| 转生 | 转生为任意角色。不会占用抽卡次数。 |
| 设置头衔xxx | 给群友设置头衔；只在机器人是群主时生效|
| #抽卡设置   | 设置抽卡的参数，如卡池角色，四星五星概率，建议使用锅巴插件设置。 |
| #设置抽卡   | 管理某群抽卡时的抽数等等，私聊时为全局设置。 |
| #我的纠缠之缘 | 查看自己的剩余蓝粉球 |
| 文字狱 | 只在机器人为管理员的时候生效。提供违禁词管控，命令请加入交流群后发送`文字狱`查看 |
| 隐形拉黑 | 命令#隐形拉黑XXX，#取消隐形拉黑XXX，被隐形拉黑的用户喵喵面板无法更新、体力永远遇到验证码且模拟抽卡必定保底+歪 |

## 已移除的功能

| 功能名     | 移除原因                                                     |
| ---------- | ------------------------------------------------------------ |
| 更新群名片 | 功能已升级并独立成另一插件：自动化插件[auto-plugin](https://gitee.com/Nwflower/auto-plugin)。 |
| 谁是卧底   | 建议使用[Saury](https://gitee.com/Saury-loser/Saury)         |

## 反馈

如果你需要提出issue或者PR，请前往github的相关页面。

[提出issue](https://github.com/Nwflower/flower-plugin/issues)

[发起PR](https://github.com/Nwflower/flower-plugin/pulls)

当然，你也可以使用QQ群组功能反馈。**点击加入[FLOWER插件交流群](https://qm.qq.com/cgi-bin/qm/qr?k=XOTZhBWpv68F1sfsMIzKJpg28NBPKJgg&jump_from=webapi&authKey=/XagQoLiUhOi+t67MCkWOSRLlXe+ywVmrkCHdoD3CjwqNzAUYspTrqYklkwb3W0R)**。

如果你觉得本插件还行，不妨给个star或者[爱发电](https://afdian.net/a/Nwflower)，你的支持不会获得额外内容，但会提高本项目的更新积极性

### 鸣谢

| 名单     | 联系方式     | 主要贡献     |
| -------- | ------------ | ------------ |
| 其实雨很好 | QQ257800180 | 更新维护支持|
| SunRyK曉K | QQ1509293009 | `转生`功能的灵感来源，早期的维护支持 |
| ZDPLM    | QQ2895699730 | 提供资源图片 |
| Pluto    | QQ717157592  | 谁是卧底.js  |

## 其他

### Nwflower插件全家桶

| 插件名                | 插件地址                                                  |
| --------------------- | --------------------------------------------------------- |
| 抽卡插件Flower-plugin | [flower-plugin](https://gitee.com/Nwflower/flower-plugin) |
| Atlas图鉴             | [Atlas](https://gitee.com/Nwflower/atlas)                 |
| 自动化插件auto-plugin | [auto-plugin](https://gitee.com/Nwflower/auto-plugin)     |

### 友情链接

* Yunzai-Bot插件库：[☞Github](https://github.com/yhArcadia/Yunzai-Bot-plugins-index)/[☞Gitee](https://gitee.com/yhArcadia/Yunzai-Bot-plugins-index)
* Yunzai-Bot（V3）：[☞Github](https://github.com/Le-niao/Yunzai-Bot)/[☞Gitee](https://gitee.com/Le-niao/Yunzai-Bot) 
* 严禁用于任何商业用途和非法行为
