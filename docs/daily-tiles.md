# 每日小面板

三个可独立导入、同时启用的 Stash 首页 Tile 面板，每个内置 32 条原创文案。

| 面板 | 内容 | 文件 |
| --- | --- | --- |
| 今日宜忌 | 一组轻松的生活宜忌，陶土色卡片 | [daily-almanac.stoverride](../stash/overrides/daily-almanac.stoverride) |
| 宇宙来信 | 以星空与旅行为意象的一封短笺，星空紫卡片 | [cosmic-letter.stoverride](../stash/overrides/cosmic-letter.stoverride) |
| 猫猫神谕 | 猫口吻的小建议，鼠尾草绿卡片 | [cat-oracle.stoverride](../stash/overrides/cat-oracle.stoverride) |

## 安装

将需要的 `.stoverride` 文件导入 Stash 的覆写页面并启用，重新加载配置后回到首页查看。三个面板可同时启用，没有特定先后顺序。停用对应覆写即可移除该面板。

在安装了 Stash 的设备上用 Safari 点击以下按钮即可打开导入页，安装后启用对应覆写。

- 今日宜忌：[![导入 Stash](../assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/daily-almanac.stoverride)
- 宇宙来信：[![导入 Stash](../assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/cosmic-letter.stoverride)
- 猫猫神谕：[![导入 Stash](../assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/cat-oracle.stoverride)

使用内置 `payload` 脚本，Stash 官方标注该能力需要 iOS/tvOS 3.2.5+；macOS 请使用支持 Tile 与内置脚本的版本。

## 每日轮换

- 按**设备本地日历日期**选取内容，同一天重复刷新、重启或重新导入不会重新抽取。修改文案库后结果可能改变。
- 每个面板设置为每 900 秒（15 分钟）执行一次。跨过本地午夜后，在下一次实际执行时换成新一天的内容；后台调度和界面刷新受客户端影响，不保证零点准时变化。
- 每个面板轮换周期为 32 天，同一周期内不重复；不调用随机接口，也不保存历史数据。切换设备时区可能改变当日内容。
- 宜忌是娱乐文案；宇宙来信是原创想象短笺，不是实时天文资讯；猫猫神谕不涉及真实宠物照护建议。

## 配置范围与验证

三个覆写分别增加一个 `tiles` 条目和一个带独立名称的 `script-providers`。不使用 `#!replace`，沿用 Stash 默认合并规则；不包含分流或 HTTP 改写字段。脚本不发起网络请求、不使用账号或密钥，也不需要 MitM 证书。更新远程覆写本身仍需联网。

本地验证覆盖 YAML 解析、内置脚本执行、同日稳定、本地午夜切换、跨月／跨年／闰日及夏令时边界，并检查三个面板同时存在时脚本名称无冲突。尚未在 Stash 客户端实机验证卡片布局和后台刷新。

参考：[Stash Tile](https://stash.wiki/script/tile)、[内置脚本管理](https://stash.wiki/script/manage-script)、[覆写合并规则](https://stash.wiki/configuration/override)。
