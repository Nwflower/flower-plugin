# 2.34.3

* 适配**新版制造合并转发消息**
* 部分提示优化

# 2.34.2

* 修复了一些已知问题
* 新增隐形拉黑功能
  * 该功能有效暗地里拉黑某个QQ
  * 被隐形拉黑的用户喵喵面板无法请求、体力永远遇到验证码且模拟抽卡必定保底+歪
  * 拉黑命令：`#隐形拉黑+QQ号`
  * 取消拉黑命令：`#取消隐形拉黑+QQ号`
  * 拉黑名单：`#隐形拉黑名单`

# 2.34.1

* 修复了一些已知问题
* 新增锅巴配置粉球蓝球
  * 此功能由 **@Catrong** 进行PR
* 新增查询自己的蓝球粉球
* 转生优化为图片生成
* 移除了一些图片

# 2.34.0

* 修复了一些已知问题
* 优化代码结构，将抽卡相关插件以MOD形式接入
* 取消了CFG.js,使用了自研的setting模块
* 优化了抽数管理，改成蓝球和粉球模式，更直观
* 取消了用户设置自己的卡池，方便管理
* 重构部分代码，提高运行速度，增加代码可读性
* 优化部分字体显示效果
* 优化部分图片生成，如`#抽卡版本`没有背景的问题
* 群抽数设置优化
* admin.js 代码简化
* 移除了部分冗余代码
* 更新README.md
* 加入了部分防内鬼代码

# 2.33.3
* 更新`艾尔海森、瑶瑶`资源
* `转生`同上
* 流浪者转生资源立绘更新

# 2.33.2
* 十连绘制界面指定字体文件
* 卡池更新`流浪者、珐露珊`
* 内存更新群名片插件新增配置文件 更新后需要重新配置

# 2.33.1
* 适配原神3.3版本

# 2.1.2
* 更新`#单抽`，使其更完善
  * 更新了高清资源，可能导致更新过慢
* `#转生`更新`流浪者、珐露珊`
* 更新`流浪者、珐露珊`的抽卡资源
  * **非官方**
  * 使用`#抽卡设置五星角色流浪者`设置
  * 珐露珊同理，**备注：四星必须三个**

# 2.1.1
* 更新`千夜浮梦`的抽卡资源
* 更新`纳西妲、莱依拉`的转生图像
* 修复低版本3.0的yunzai由于引入插件歧义引起的兼容性报错问题
* 更新妮露、阿贝多卡池，请手动发送更新指令
  * 活动期间，限定五星武器「单手剑·圣显之钥」「单手剑·磐岩结绿」的祈愿获取概率将大幅提升！
  * 活动期间，限定四星武器「单手剑·西福斯的月光」「法器·流浪的晚星」、四星武器「双手剑·雨裁」「长柄武器·匣里灭辰」「弓·祭礼弓」的祈愿获取概率将大幅提升
  * 活动期间，限定五星角色「莲光落舞筵·妮露(水)」的祈愿获取概率将大幅提升！
  * 活动期间，限定五星角色「白垩之子·阿贝多(岩)」的祈愿获取概率将大幅提升！
  * 活动期间，四星角色「无冕的龙王·北斗(雷)」「闪耀偶像·芭芭拉(水)」「万民百味·香菱(火)」的祈愿获取概率将大幅提升！
* 预计于下版本修复部分抽卡插件中歪不到阿贝多的问题
* 如有任何问题及时提issue
* 优化单抽功能
  * 单抽功能计入抽卡次数
  * 优化单抽功能逻辑，不会重复调用浏览器截图，减轻服务侧压力
  * 对单抽功能做出撤回设定
* 加入新抽卡资源
* 重写CHANGELOG文档让更新看起来非常多

# 2.1.0
* 加入单抽功能
* 内置`谁是卧底`小游戏
  * 版本1.1.5
* 新增报错系统
* 完善内存更新群名片，新增自我保护机制
* 增加`纳西妲、莱依拉`的抽卡资源
  * 使用`#抽卡设置五星角色纳西妲`设置
  * 莱依拉同理，**备注：四星必须三个**
* 修改抽卡设置样式
* 为锅巴插件适配更多设置
* 监听词语添加开关，默认关闭
* 尝试适配锅巴插件
  * 加入对部分设置的锅巴型配置
* 文字狱管理员调整为无法添加全局违禁词
* 修复`自动更新群名片`可能会漏群的bug
* 新增`文字狱`功能，由于群已锁，使用说明可以加背景图群920929297询问群友如何使用。
  * 加群后发送`文字狱`即可自查
* 新增`批量删除屏蔽词`
* 新增`自动更新群名片`
* 更新卡池，修正资源绘制错误
* 更新‘转生’
* 增加`赛诺、妮露、坎蒂丝`的抽卡资源
* 回退功能`三十连`
* 新增命令`我的卡池`
* 新增命令`设置抽卡`，支持自定义

# 2.0.0
* 重构抽卡插件为`flower-plugin`
* 删除了部分冗余命令
* 调整了百连不再占用十连次数
* 优化截图速度
* 修复小保底概率问题
* 取消V3消息处理输出日志
* 完善`转生`功能资源
    * 修复因为缺失部分图片资源报错的问题
* 插件计划独立支持V3版本，并更名为`无花果插件`，本插件不会删库
* 抽卡设置界面支持设置转生CD
* 摆烂式更新
    * 修正readme文件部分错误
    * 加载界面优化
    * 更新版本号
* 新增功能：`#转生`
* 建立插件Q群`240979646`
* 修复因为直接照搬乐神代码而导致频发性变量未定义的问题
* 更新卡池

# 1.1.0-1.2.0
* 初步兼容云崽3.0
    * bug未知，目前代码改的和屎山一样，重构缓慢咕咕中。。。
* 全员卡池新增愚人众各执行官（5星、角色）
* 说明：如想自定义卡池角色，可自行在`gacha-plugin\resources\gacha\img\character\5`下添加图片,(加入全员卡池)
* 修复十连没有保底紫或者十连全是紫的问题
* 修复无配置文件时，会报错的问题
* 将 `二十连、三十连...九十连、百连` 等命令推广到武器池和全员卡池
    * 在菜单中添加`多连转发`以设置百连是否需要通过转发聊天记录的形式呈现
    * 为显示直观，私聊情况下禁用多连转发
* 增加 `#抽卡更新` 功能
    * 功能copy于miao-plugin
    * 感谢 @喵喵 @碎月 @清秋 的代码
    * 若更新成功会重启Yunzai，需要Yunzai以 npm run start 模式启动
    * 增加`#抽卡版本`命令查询版本信息
* 修复了一些问题
    * 修复了定时撤回报错
    * 修复了频发性的无法加载四星角色图片的问题
* 新增了百连、三十连等命令
* 新增 `卡池自定义` 功能
    * 修正卡池无法自定义的问题，目前修改角色需要输入全名
    * 新增 `概率调整` 功能
* 新增 `#抽卡设置` 命令和 `自定义抽卡管理面板` 界面
    * 可通过 `#抽卡设置覆盖关闭` 命令关闭设置的抽卡覆盖功能
    * * 调整覆盖命令为 `#抽卡设置自定义关闭`
* 将JS插件转化为plugin插件包