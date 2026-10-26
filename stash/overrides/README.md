# Stash 覆写

在此存放可选的 `.stoverride` 文件。在已安装 Stash 的设备上，用 Safari 点击各覆写后的“导入 Stash”按钮打开导入页，安装后按需启用。按钮使用本仓库 `main` 分支的公开文件，推送后生效。

导入方式采用 [Stash 官方的一键安装链接](https://stash.wiki/faq/url-schema#导入远程覆写)。

第三方模块优先使用原生 Stash 版本或 [Script Hub 自动转换](../../docs/script-hub.md)。[安装官方 Script Hub 覆写](https://link.stash.ws/install-override/raw.githubusercontent.com/Script-Hub-Org/Script-Hub/main/modules/script-hub.stash.stoverride) 后，可从说明页打开已有来源的转换表单；同一应用仅启用一个版本。本目录继续保留原生覆写、参数版及额外适配。

## Block QUIC

文件：[block-quic.stoverride](block-quic.stoverride) [![导入 Stash](../../assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/block-quic.stoverride)。

采用 [Stash 官方文档中的 Script Shortcuts 方法](https://stash.wiki/faq/effective-stash)：

```yaml
script:
  shortcuts:
    quic: network == 'udp' and dst_port == 443

rules:
  - SCRIPT,quic,REJECT
```

以 UDP 且目标端口为 443 作为拦截条件，包括原本会直连的目的地。此方法会拦截所有 UDP/443 流量，也可能包含非 QUIC 流量；不覆盖其他端口上的 QUIC。支持回退的应用可改用 TCP；仅支持 QUIC 的服务可能无法连接。

1. 在 Stash 的覆写功能中导入 `block-quic.stoverride`，然后启用。
2. 使用规则模式。此覆写的 `rules` 默认插入主配置规则列表开头，保留原有规则。
3. 多个覆写会从上到下依次合并。如果其他覆写也修改 `rules`，将 Block QUIC 放在它们之后，并在最终配置中确认拦截规则位于放行和兜底规则之前。
4. 在请求记录中检查 UDP/443 连接是否命中 `SCRIPT,quic` 并使用 `REJECT`；停用此覆写可撤销本项拦截。主配置和其他覆写的拦截仍按各自设置生效。

此覆写定义 `script.shortcuts.quic`，通过 `SCRIPT` 规则调用；若主配置已有同名快捷规则，该表达式会被覆写。不依赖主配置中的策略组、远程脚本或 MitM 证书，也不受 `AdBlock` 策略组开关控制。

## Reddit 信息流去广告

文件：[reddit-feed.stoverride](reddit-feed.stoverride) [![导入 Stash](../../assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/reddit-feed.stoverride)，沿用之前编写的 v1.0.0 过滤逻辑，JavaScript 内置于覆写，无远程脚本依赖。需要 Stash iOS 3.2.5+。

1. 在 Stash 中导入并启用覆写，安装并信任 Stash 自己的 MitM 证书，确认 HTTP 改写和 MitM 功能已启用。覆写仅将 `gql-fed.reddit.com` 加入 MitM 域名。
2. 停用其他处理同一接口的 Reddit 响应脚本，避免重复改写；此覆写可与 Block QUIC 同时使用，两者无特定顺序要求。
3. 重新启动 Reddit 并刷新信息流。已缓存的广告卡片不会在原页面上立即消失。
4. 在 Stash 请求记录中确认 `https://gql-fed.reddit.com/` 命中 `reddit-feed-ads-v1`，脚本日志中的 `[Reddit Feed] removed … ad entries` 表示本次响应已过滤广告。

基于此前捕获的 Reddit iOS **2026.41.0 / 669361** 结构，处理 `HomeFeedSdui` 信息流和 `FeedPostDetailsByIds` 帖子详情。删除数组中带有 `AdMetadataCell`、`isAdPost: true`、对象形式 `adPayload` 或 `__typename: AdPost` 标记的完整广告条目，保留普通帖子、分页游标和内容分级字段。

仅匹配 `gql-fed.reddit.com` 的根路径（允许查询参数），不处理 `/v2p`、`/ec/ekc1`、媒体文件或其他域名。响应体上限为 1 MiB；非法 JSON、multipart 增量响应和脚本异常透传。后续 Reddit 数据结构变化时可能需要更新，不保证覆盖 Android、网页或所有广告实验。Stash 尚未实机验证。

此覆写合并 `http.mitm`、`http.script` 和 `script-providers`，不包含个人证书或密码，也不受 `AdBlock` 策略组开关控制；停用该覆写可撤销本项响应过滤。

参考：[Stash 脚本管理](https://stash.wiki/script/manage-script)、[Stash HTTP 改写](https://stash.wiki/script/rewrite-requests)。

## 哔哩哔哩增强

文件：[bilibili.stoverride](bilibili.stoverride) [![导入 Stash](../../assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/bilibili.stoverride)。原作者：[kokoryh](https://github.com/kokoryh)，来源：[Sparkle](https://github.com/kokoryh/Sparkle)，衍生文件保留 GPL-3.0 许可。

保留原模块功能，提供动态常访问、创作中心、评论净化、空降助手及策略、P2P 端口和日志等级七项参数。脚本独立托管，覆写仅保留配置与引用。

需要支持覆写参数的 Stash Beta（iOS 3.7+、macOS 4.4+）、受信任的 MitM 证书和可访问的远程脚本。默认开启 P2P 端口拦截和空降助手，在覆写详情的“参数”中调整。详见 [使用说明](../../docs/bilibili.md)；尚未在 Stash 中实机验证。

## 贴吧去广告参数版

文件：[tieba.stoverride](tieba.stoverride) [![导入 Stash](../../assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/tieba.stoverride)。原作者：[app2smile](https://github.com/app2smile)，许可证为 MIT。

在原覆写上增加 `per_filter_video` 参数表单：默认 `0` 保留推荐页视频贴，选择 `1` 过滤视频贴。结果以 `per_filter_video_thread=0/1` 传给原 Protobuf 脚本，原有广告过滤继续生效。

需要支持覆写参数的 Stash Beta（iOS/tvOS 3.7+、macOS 4.4+）和受信任的 MitM 证书。导入时设置参数，或在覆写详情的“参数”中修改。具体范围与版本要求见 [贴吧使用说明](../../docs/tieba.md)。尚未在 Stash 中实机验证。

## Google 搜索重定向

文件：[google-rewrite.stoverride](google-rewrite.stoverride) [![导入 Stash](../../assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/google-rewrite.stoverride)。将 `g.cn`、`google.cn` 及其 `www` 域名通过 302 重定向到 `https://www.google.com`，保留原路径和查询参数，例如 `/search?q=stash`。

在 Stash 中导入并启用；HTTPS 请求需要安装并信任 Stash MitM 证书。覆写仅追加四个对应的 MitM 域名和两条 URL 改写规则，无远程脚本依赖。尚未在 Stash 中实机验证。

## YouTube 增强

文件：[youtube.stoverride](youtube.stoverride) [![导入 Stash](../../assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/youtube.stoverride)。模块配置来源为 [kokoryh/Sparkle](https://github.com/kokoryh/Sparkle)，原始模块与实际运行脚本由 [Maasea](https://github.com/Maasea/sgmodule) 提供。

提供上传、选段、Shorts 按钮屏蔽、字幕翻译语言和调试模式五项参数，沿用所选模块的默认值。需要支持覆写参数的 Stash Beta、受信任的 MitM 证书及可访问的远程脚本。保留上游部分播放请求转向原作者 Worker 的行为。

具体参数、脚本来源、播放处理依赖和转换范围见 [YouTube 使用说明](../../docs/youtube.md)。尚未在 Stash 中实机验证。

## 知乎去广告

文件：[zhihu.stoverride](zhihu.stoverride) [![导入 Stash](../../assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/zhihu.stoverride)。源模块署名为 RuCu6、blackmatrix7，所选模块由 QingRex/LoonKissSurge 分发，脚本沿用 kelee 原地址。

转换了 10 条分流、3 条 URL 改写、5 条响应体改写、22 条静态响应和 10 条脚本匹配。需要 Stash MitM 证书，无参数表单。

脚本 provider 已配置完整的 `Loon/921 CFNetwork/3860.500.111.2.2 Darwin/25.5.0` User-Agent。原脚本连续两次下载返回 HTTP 200，JavaScript 语法和 7 个模拟响应样例检查通过；尚未在 Stash 中实机验证。详情见 [知乎说明](../../docs/zhihu.md)。

## 微博去广告

文件：[weibo.stoverride](weibo.stoverride) [![导入 Stash](../../assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/weibo.stoverride)。保留源模块署名 RuCu6、zmqcherish，所选模块来自 QingRex/LoonKissSurge，脚本沿用 kelee 原地址。

包含 3 条分流、18 条静态响应和 19 条响应脚本匹配，无参数表单。provider 携带已验证可下载微博脚本的完整 Loon User-Agent，需要受信任的 Stash MitM 证书。

保留上游的标签、菜单、消息页和信息流精简行为，以及 `uve.weibo.com` 直连规则。详见 [微博使用说明](../../docs/weibo.md)；尚未在 Stash 中实机验证。

## 小红书去广告

文件：[redpaper.stoverride](redpaper.stoverride) [![导入 Stash](../../assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/redpaper.stoverride)。保留原署名 RuCu6、fmz200，所选模块来自 QingRex/LoonKissSurge，远程脚本沿用 kelee 原地址及完整 Loon 下载请求头。

包含双域名 QUIC 拦截、5 条 jq 改写、5 条静态响应和 12 条响应脚本匹配，无参数表单。覆盖 `xiaohongshu.com` 与 `rnote.com`，图片笔记支持 `edith`、`rec`、`www` 主机；保留信息流广告过滤及图片、视频、实况照片水印处理，需要受信任的 Stash MitM 证书。

原脚本下载返回 HTTP 200，详情与媒体链接缓存要求见 [小红书使用说明](../../docs/redpaper.md)；尚未在 Stash 中实机验证。

## 维护

新增覆写时说明用途、覆盖字段和启用顺序。数组默认前置合并；使用 `#!replace` 会替换对应字段，修改后需检查最终配置。

含订阅 URL、令牌或证书的个人覆写放在被忽略的 `private/` 中。

参考：[Stash 规则类型](https://stash.wiki/en/rules/rule-types)、[Stash 覆写](https://stash.wiki/en/configuration/override)。
