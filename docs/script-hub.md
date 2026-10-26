# Script Hub 转换入口

后续新增第三方模块时，优先使用作者提供的原生 Stash 覆写；没有原生版本时，使用 [Script Hub](https://github.com/Script-Hub-Org/Script-Hub) 自动转换。仓库只维护需要额外适配的版本。

## 首次安装

1. [安装 Script Hub 官方 Stash 覆写](https://link.stash.ws/install-override/raw.githubusercontent.com/Script-Hub-Org/Script-Hub/main/modules/script-hub.stash.stoverride)，启用并更新其全部脚本资源。
2. 安装并信任 Stash MitM 证书，开启 HTTP 改写和 MitM，保持 Stash 运行。
3. 在 Safari 打开 [Script Hub](https://script.hub/)。能看到转换页面后，即可使用下方入口。

`script.hub` 的转换请求由本机 Stash 中的 Script Hub 脚本处理。[官方网页前端](https://scripthub.vercel.app/)也可生成链接，实际使用这些链接仍需要上述覆写。

## 已有来源

“打开转换”已选好来源和目标类型。在页面检查选项后生成链接，预览结果，再点击“导入 Stash”。导入转换链接后，更新时会重新拉取上游并转换。每个应用只启用一个版本，切换前停用对应的本仓库覆写。

| 模块 | 转换入口 | 使用说明 |
| --- | --- | --- |
| 哔哩哔哩增强 | [打开转换](https://script.hub/edit/_start_/https%3A%2F%2Fraw.githubusercontent.com%2Fkokoryh%2FSparkle%2Fmaster%2Frelease%2Fsurge%2Fmodule%2Fbilibili.sgmodule/_end_/bilibili.stoverride?type=surge-module&target=stash-stoverride&jqEnabled=true&keepHeader=true) · [原来源](https://raw.githubusercontent.com/kokoryh/Sparkle/master/release/surge/module/bilibili.sgmodule) | 需要本仓库的二进制兼容处理；继续使用本仓库参数版。 |
| YouTube 增强 | [打开转换](https://script.hub/edit/_start_/https%3A%2F%2Fraw.githubusercontent.com%2Fkokoryh%2FSparkle%2Fmaster%2Frelease%2Fsurge%2Fmodule%2Fyoutube.sgmodule/_end_/youtube.stoverride?type=surge-module&target=stash-stoverride&jqEnabled=true&keepHeader=true) · [原来源](https://raw.githubusercontent.com/kokoryh/Sparkle/master/release/surge/module/youtube.sgmodule) | 可自动转换；本仓库另有 Stash 参数表单。 |
| 知乎去广告 | [打开转换](https://script.hub/edit/_start_/https%3A%2F%2Fraw.githubusercontent.com%2FQingRex%2FLoonKissSurge%2Fmain%2FSurge%2FBeta%2F%25E7%259F%25A5%25E4%25B9%258E%25E5%258E%25BB%25E5%25B9%25BF%25E5%2591%258A.beta.sgmodule/_end_/zhihu.stoverride?type=surge-module&target=stash-stoverride&jqEnabled=true&keepHeader=true&headers=User-Agent%3ALoon%2F921%20CFNetwork%2F3860.500.111.2.2%20Darwin%2F25.5.0&jsc=.&compatibilityOnly=true) · [原来源](https://raw.githubusercontent.com/QingRex/LoonKissSurge/main/Surge/Beta/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A.beta.sgmodule) | 已预填 Loon 下载请求头和脚本兼容转换。 |
| 微博去广告 | [打开转换](https://script.hub/edit/_start_/https%3A%2F%2Fraw.githubusercontent.com%2FQingRex%2FLoonKissSurge%2Fmain%2FSurge%2F%25E5%25BE%25AE%25E5%258D%259A%25E5%258E%25BB%25E5%25B9%25BF%25E5%2591%258A.sgmodule/_end_/weibo.stoverride?type=surge-module&target=stash-stoverride&jqEnabled=true&keepHeader=true&headers=User-Agent%3ALoon%2F921%20CFNetwork%2F3860.500.111.2.2%20Darwin%2F25.5.0&jsc=.&compatibilityOnly=true) · [原来源](https://raw.githubusercontent.com/QingRex/LoonKissSurge/main/Surge/%E5%BE%AE%E5%8D%9A%E5%8E%BB%E5%B9%BF%E5%91%8A.sgmodule) | 已预填 Loon 下载请求头和脚本兼容转换。 |
| 小红书去广告 | [打开转换](https://script.hub/edit/_start_/https%3A%2F%2Fraw.githubusercontent.com%2FQingRex%2FLoonKissSurge%2Fmain%2FSurge%2F%25E5%25B0%258F%25E7%25BA%25A2%25E4%25B9%25A6%25E5%258E%25BB%25E5%25B9%25BF%25E5%2591%258A.sgmodule/_end_/redpaper.stoverride?type=surge-module&target=stash-stoverride&jqEnabled=true&keepHeader=true&headers=User-Agent%3ALoon%2F921%20CFNetwork%2F3860.500.111.2.2%20Darwin%2F25.5.0&jsc=.&compatibilityOnly=true) · [原来源](https://raw.githubusercontent.com/QingRex/LoonKissSurge/main/Surge/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.sgmodule) | 原来源未包含本仓库的域名修正；当前优先使用本仓库修正版。 |
| 贴吧去广告 | [作者原生 Stash 覆写](https://raw.githubusercontent.com/app2smile/rules/master/module/tieba.stoverride) | 可直接导入；本仓库参数版继续保留。 |

## 参数与下载

当前官方转换器把模块参数替换为默认值，不会生成 Stash 的“参数”表单。需要表单时继续使用本仓库参数版；临时调整可在 Script Hub 的高级选项修改脚本参数，再生成新链接。

知乎、微博、小红书的转换入口已预填实测可用的完整 Loon User-Agent，并启用“脚本转换 1 / 仅进行兼容性转换”，让脚本下载也经过 Script Hub 携带该请求头。转换链接与脚本资源更新都依赖 Script Hub 覆写保持启用；这个请求头不会应用到 App 的业务请求。

自动转换负责配置格式和支持范围内的接口兼容；上游域名遗漏、App 接口变化和去水印逻辑失效仍需针对性修正。转换前预览提示，导入后检查脚本资源下载和实际请求命中。这里的入口已经核对官方链接格式，尚未在 Stash 中实机验证。

Block QUIC、Reddit 信息流过滤和 Google 重定向是本仓库的原生 Stash 覆写，继续直接使用。

参考：[官方安装说明](https://github.com/Script-Hub-Org/Script-Hub/wiki/安装)、[官方使用说明](https://github.com/Script-Hub-Org/Script-Hub/wiki/使用)、[转换器源码](https://github.com/Script-Hub-Org/Script-Hub/blob/main/Rewrite-Parser.js)。原模块作者及致谢见 [第三方说明](../THIRD_PARTY_NOTICES.md)。
