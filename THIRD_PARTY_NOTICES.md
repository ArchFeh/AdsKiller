# 第三方来源与许可证

## 哔哩哔哩增强 — kokoryh / Sparkle

- 原作者：[kokoryh](https://github.com/kokoryh)。本仓库的格式转换与兼容适配不改变原作者归属，也不代表上游官方支持 Stash。
- 上游项目：[Sparkle](https://github.com/kokoryh/Sparkle)。
- 转换源：[bilibili.sgmodule](https://github.com/kokoryh/Sparkle/blob/290bcbdd2f158cdd8f7db9c996e90fe63490e16f/release/surge/module/bilibili.sgmodule)。
- 固定版本：`290bcbdd2f158cdd8f7db9c996e90fe63490e16f`。
- 许可证：[上游 GPL-3.0](https://github.com/kokoryh/Sparkle/blob/290bcbdd2f158cdd8f7db9c996e90fe63490e16f/LICENSE)，完整副本见 [LICENSES/Sparkle-GPL-3.0.txt](LICENSES/Sparkle-GPL-3.0.txt)。
- 衍生文件：[bilibili.stoverride](stash/overrides/bilibili.stoverride)、[protobuf-request.js](stash/scripts/bilibili/protobuf-request.js)、[protobuf-response.js](stash/scripts/bilibili/protobuf-response.js)，按 GPL-3.0 分发；修改日期为 2026-10-26。

Stash 适配将分流、静态响应、jq、HTTP 脚本和 MitM 域名转成覆写格式，并提供原有七项选项的参数表单。Protobuf 请求与响应脚本独立存放于本仓库并通过 URL 加载，保留原脚本，外围补充 gzip 解压、响应字段归一化、空降助手策略选择及关闭时跳过弹幕分段请求拦截的逻辑。其余脚本引用固定版本的上游 URL。

原始源代码和构建材料：[固定版本完整源码](https://github.com/kokoryh/Sparkle/tree/290bcbdd2f158cdd8f7db9c996e90fe63490e16f)、[源码归档](https://github.com/kokoryh/Sparkle/archive/290bcbdd2f158cdd8f7db9c996e90fe63490e16f.tar.gz)、[构建脚本](https://github.com/kokoryh/Sparkle/blob/290bcbdd2f158cdd8f7db9c996e90fe63490e16f/build.ts)。本地适配层源码位于上述两个 Protobuf JS 文件中，无需额外构建。

同时保留上游哔哩哔哩说明中对 [app2smile](https://github.com/app2smile/rules)、[BiliUniverse](https://github.com/BiliUniverse/Universe)、[Maasea](https://github.com/Maasea/sgmodule) 的致谢。

## 哔哩哔哩皮肤脚本 — kokoryh / Script

原作者：[kokoryh](https://github.com/kokoryh)。覆写中的皮肤 provider 直接引用 [bili-suit-diy.js](https://github.com/kokoryh/Script/blob/d8afcfab97fbfb3d017cfdc759ac7c9c8d784b0d/js/bili-suit-diy.js)，固定版本 `d8afcfab97fbfb3d017cfdc759ac7c9c8d784b0d`，未复制或修改其源码。

## fflate 0.8.2 — Arjun Barrett

- 项目：[101arrowz/fflate](https://github.com/101arrowz/fflate/tree/v0.8.2)。
- Copyright (c) 2023 Arjun Barrett。
- 用途：为两个 Protobuf 脚本提供同步 gzip 解压。
- 包文件：[fflate@0.8.2/umd/index.js](https://unpkg.com/fflate@0.8.2/umd/index.js)。
- [MIT 许可证副本](LICENSES/fflate-MIT.txt)，也已保留在两个 JS 文件的注释中。

## 贴吧去广告 — app2smile / rules

- 原作者：[app2smile](https://github.com/app2smile)。Copyright (c) 2023 app2smile。
- 上游项目：[app2smile/rules](https://github.com/app2smile/rules)，对照版本为 `df6366a7024e0b3f0aa3510c5b791eea6f3cba89`。
- 原覆写：[tieba.stoverride](https://github.com/app2smile/rules/blob/df6366a7024e0b3f0aa3510c5b791eea6f3cba89/module/tieba.stoverride)。
- 参数参考：[tieba.sgmodule](https://github.com/app2smile/rules/blob/df6366a7024e0b3f0aa3510c5b791eea6f3cba89/module/tieba.sgmodule)。
- 许可证：[上游 MIT](https://github.com/app2smile/rules/blob/df6366a7024e0b3f0aa3510c5b791eea6f3cba89/LICENSE.md)，副本见 [LICENSES/app2smile-MIT.txt](LICENSES/app2smile-MIT.txt)。
- 衍生文件：[stash/overrides/tieba.stoverride](stash/overrides/tieba.stoverride)。AdsKiller 于 2026-10-25 增加 Stash 参数表单，并将 `per_filter_video` 传给 Protobuf 脚本的 `per_filter_video_thread`。保留原脚本 URL、更新间隔、匹配范围和 MitM 域名。

## YouTube 增强 — kokoryh / Sparkle 与 Maasea / sgmodule

- 所选模块：[Sparkle 的 youtube.sgmodule](https://github.com/kokoryh/Sparkle/blob/290bcbdd2f158cdd8f7db9c996e90fe63490e16f/release/surge/module/youtube.sgmodule)，作者/维护者 [kokoryh](https://github.com/kokoryh)。该仓库按 GPL-3.0 授权，副本见 [LICENSES/Sparkle-GPL-3.0.txt](LICENSES/Sparkle-GPL-3.0.txt)。
- 上游原模块：[Maasea 的 YouTube.Enhance.sgmodule](https://github.com/Maasea/sgmodule/blob/65075cdb388fc5e3094afd7e7314c67b243f3525/YouTube.Enhance.sgmodule)。
- 实际脚本作者：[Maasea](https://github.com/Maasea)，项目 [Maasea/sgmodule](https://github.com/Maasea/sgmodule)，固定版本 `65075cdb388fc5e3094afd7e7314c67b243f3525`。两个远程脚本位于 [Script/Youtube](https://github.com/Maasea/sgmodule/tree/65075cdb388fc5e3094afd7e7314c67b243f3525/Script/Youtube)，未在本仓库复制或修改。
- 原始模块与脚本的许可证：[Apache-2.0](https://github.com/Maasea/sgmodule/blob/65075cdb388fc5e3094afd7e7314c67b243f3525/LICENSE)，副本见 [LICENSES/Maasea-Apache-2.0.txt](LICENSES/Maasea-Apache-2.0.txt)。
- 衍生文件：[stash/overrides/youtube.stoverride](stash/overrides/youtube.stoverride)，按 GPL-3.0 分发。AdsKiller 于 2026-10-26 转换 Stash 格式，增加原有五个参数的表单，保留所选 Sparkle 模块的默认值；二进制体积上限设为 4 MiB、引擎设为 WebKit、超时设为 10 秒。

## 知乎去广告 — RuCu6、blackmatrix7；QingRex 转换来源

- 保留的原模块署名：[RuCu6](https://github.com/RuCu6)、[blackmatrix7](https://github.com/blackmatrix7)。
- 选定模块：[QingRex/LoonKissSurge 的知乎去广告 Beta 模块](https://github.com/QingRex/LoonKissSurge/blob/913ec005f544221e6c56a7d0ecec81c4b3b914bb/Surge/Beta/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A.beta.sgmodule)，固定提交 `913ec005f544221e6c56a7d0ecec81c4b3b914bb`。
- 原主页：[hub.kelee.one](https://hub.kelee.one)。远程脚本使用模块提供的 `https://kelee.one/Resource/JavaScript/Zhihu/Zhihu_remove_ads.js`，未复制进仓库、改写或改用第三方镜像。下载请求使用本次实测成功的完整 Loon User-Agent；两次取得的 7,623 字节正文一致，脚本头部保留对 `RuCu6/QuanX` 中 `Scripts/zhihu.js` 的引用。未将下载成功视为公开再分发授权。
- 衍生文件：[stash/overrides/zhihu.stoverride](stash/overrides/zhihu.stoverride)。AdsKiller 于 2026-10-26 转换 Stash 语法，移除不兼容规则参数，添加响应脚本体积上限、超时与资源更新间隔，保留源规则匹配范围。搜索推荐的贪婪正则改为 jq，仅清空相应 JSON 对象；回答列表中的 `?//` 改为 `? //`，修正 jq 语法歧义。
- 所选模块未提供单独许可证，QingRex 仓库也明确表示不主张 `Surge/` 下模块的著作权，并要求遵守原作者的分发要求。因此本项仅按用户的自用需求作本地适配，不将其他文件的 GPL、MIT 或 Apache 授权套用于它；公开再分发前需要确认原权利人的授权。

## 微博去广告 — RuCu6、zmqcherish；QingRex 转换来源

- 保留原模块署名：[RuCu6](https://github.com/RuCu6)、[zmqcherish](https://github.com/zmqcherish)。
- 选定模块：[QingRex/LoonKissSurge 的微博去广告模块](https://github.com/QingRex/LoonKissSurge/blob/913ec005f544221e6c56a7d0ecec81c4b3b914bb/Surge/%E5%BE%AE%E5%8D%9A%E5%8E%BB%E5%B9%BF%E5%91%8A.sgmodule)，固定提交 `913ec005f544221e6c56a7d0ecec81c4b3b914bb`。
- 原主页：[hub.kelee.one](https://hub.kelee.one)。远程脚本引用 `https://kelee.one/Resource/JavaScript/Weibo/Weibo_remove_ads.js`，未复制进仓库或修改。使用完整 Loon User-Agent 成功下载用于检查，脚本头部保留对 `RuCu6/Loon` 中 `Scripts/weibo.js` 的引用。
- 衍生文件：[stash/overrides/weibo.stoverride](stash/overrides/weibo.stoverride)。AdsKiller 于 2026-10-26 转换 Stash 语法，保留分流、静态响应和脚本匹配范围，移除不兼容规则参数，设置响应脚本 1 MiB 上限、10 秒超时及 86400 秒下载间隔，添加下载用 User-Agent。
- 所选模块未声明独立许可证，不将本仓库其他文件的 GPL、MIT 或 Apache 授权套用于此模块。按用户自用需求本地适配；公开再分发需要确认原权利人的授权。

## 小红书去广告 — RuCu6、fmz200；QingRex 转换来源

- 保留原模块署名：[RuCu6](https://github.com/RuCu6)、[fmz200](https://github.com/fmz200)。
- 选定模块：[QingRex/LoonKissSurge 的小红书去广告模块](https://github.com/QingRex/LoonKissSurge/blob/913ec005f544221e6c56a7d0ecec81c4b3b914bb/Surge/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.sgmodule)，固定提交 `913ec005f544221e6c56a7d0ecec81c4b3b914bb`。
- 原主页：[hub.kelee.one](https://hub.kelee.one)。远程脚本引用 `https://kelee.one/Resource/JavaScript/RedPaper/RedPaper_remove_ads.js`，未复制进仓库或修改。下载检查取得 15,186 字节正文，头部保留对 `RuCu6/Loon` 中 `Scripts/xiaohongshu.js` 的引用。
- 衍生文件：[stash/overrides/redpaper.stoverride](stash/overrides/redpaper.stoverride)。AdsKiller 于 2026-10-26 转换 Stash 语法，保留原匹配范围、jq 和脚本默认逻辑，将 `tiny-gif` 转为 Base64 GIF 响应，移除不兼容的 `extended-matching`，设置响应体上限、超时及下载用完整 Loon User-Agent。
- 所选模块未声明独立许可证，未套用本仓库其他文件的授权。按用户自用需求本地适配；公开再分发需要确认原权利人的授权。

以上许可证说明适用于标明来源的第三方内容和相应衍生文件。
