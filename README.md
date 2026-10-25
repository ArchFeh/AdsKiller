# AdsKiller

自用 Stash 配置库，用于维护分流配置、广告拦截规则和覆写。

主配置为初始化模板：默认直连，未接入代理节点、订阅或第三方规则，也不包含真实广告域名库。示例拦截域名为 `ads.example.com` 及其子域名。可选覆写单独导入、按需启用。

## 目录

```text
AdsKiller/
├── stash/
│   ├── AdsKiller.yaml      # Stash 基础配置
│   ├── rules/reject.yaml   # Stash classical 规则集示例
│   ├── overrides/          # 按需启用的 Stash 功能覆写
│   └── scripts/bilibili/   # 哔哩哔哩独立脚本
├── docs/                  # 维护与各覆写使用说明
├── LICENSES/              # 第三方许可证副本
└── THIRD_PARTY_NOTICES.md  # 第三方来源与授权说明
```

## 使用

1. 在 Stash 中导入 `stash/AdsKiller.yaml`，切换到规则模式。
2. 主配置可独立导入。`AdBlock` 默认选择 `REJECT`；切换为 `DIRECT` 可临时放行示例广告域名。
3. `Proxy` 当前仅包含 `DIRECT`。需要代理时，在个人配置中添加节点或订阅，并将节点加入 `Proxy` 策略组，然后在客户端选择节点。
4. 编辑主配置中“个人放行规则”和“广告拦截规则”位置，添加自己的规则。规则自上而下匹配，首次命中即生效。

### 可选覆写

在已安装 Stash 的设备上，用 Safari 点击“导入 Stash”按钮打开覆写导入页，安装后按需启用。按钮引用本仓库 `main` 分支的公开文件，需先将对应文件推送到该分支。

- [Block QUIC](stash/overrides/block-quic.stoverride)：通过 Script Shortcuts 拦截 UDP/443 流量，以阻止常见的 HTTP/3 / QUIC 连接。 [![导入 Stash](assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/block-quic.stoverride)
- [Reddit 信息流去广告](stash/overrides/reddit-feed.stoverride)：内置响应过滤脚本，移除 Reddit iOS 信息流广告卡片，需要安装并信任 Stash MitM 证书。 [![导入 Stash](assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/reddit-feed.stoverride)
- [哔哩哔哩增强](stash/overrides/bilibili.stoverride)：基于 kokoryh / Sparkle 模块转换，保留广告净化、P2P 拦截和空降助手等功能，提供七项参数表单；需要 Stash Beta（iOS 3.7+、macOS 4.4+）及 MitM 证书，详见 [使用与参数说明](docs/bilibili.md)。 [![导入 Stash](assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/bilibili.stoverride)
- [贴吧去广告参数版](stash/overrides/tieba.stoverride)：基于 app2smile 原覆写增加“保留／过滤推荐页视频贴”参数，需要支持覆写参数的 Stash Beta 和 MitM 证书；详见 [使用说明](docs/tieba.md)。 [![导入 Stash](assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/tieba.stoverride)
- [Google 搜索重定向](stash/overrides/google-rewrite.stoverride)：将 `g.cn`、`google.cn` 及其 `www` 域名重定向到 Google，保留搜索参数；HTTPS 请求需要 Stash MitM 证书。 [![导入 Stash](assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/google-rewrite.stoverride)
- [YouTube 增强](stash/overrides/youtube.stoverride)：基于 kokoryh / Sparkle 配置与 Maasea 脚本转换，提供按钮屏蔽、字幕翻译等五项参数，需要支持覆写参数的 Stash Beta 和 MitM 证书；详见 [使用说明](docs/youtube.md)。 [![导入 Stash](assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/youtube.stoverride)
- [知乎去广告](stash/overrides/zhihu.stoverride)：由 QingRex 分发的 Beta 模块转换，保留 RuCu6、blackmatrix7 署名；已配置并验证可下载原脚本的完整 Loon 请求头，尚未实机验证，详见 [使用与验证说明](docs/zhihu.md)。 [![导入 Stash](assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/zhihu.stoverride)
- [微博去广告](stash/overrides/weibo.stoverride)：由 QingRex 分发的模块转换，保留 RuCu6、zmqcherish 署名，使用完整 Loon 请求头下载原脚本；详见 [使用说明](docs/weibo.md)。 [![导入 Stash](assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/weibo.stoverride)
- [小红书去广告](stash/overrides/redpaper.stoverride)：由 QingRex 分发的模块转换，保留 RuCu6、fmz200 署名，沿用信息流广告过滤和图片、视频水印处理；详见 [使用说明](docs/redpaper.md)。 [![导入 Stash](assets/import-stash.svg)](https://link.stash.ws/install-override/raw.githubusercontent.com/ArchFeh/AdsKiller/main/stash/overrides/redpaper.stoverride)

适用范围、启用顺序和验证方式见 [覆写说明](stash/overrides/README.md)。

### 使用独立规则集

主配置内置了示例拦截规则，`stash/rules/` 下的文件用于演示独立规则集格式，**目前没有被主配置加载**。仅修改规则集文件不会改变主配置行为。

托管仓库后，将以下 `YOUR_ACCOUNT` 和 `YOUR_BRANCH` 替换为真实值，确认原始文件 URL 可以直接访问，再按以下方式接入规则集。GitHub 私有仓库的原始链接通常需要鉴权，不适合直接作为公开订阅地址；请使用 Stash 可访问的托管方式。

添加顶层 `rule-providers`，并将现有 `rules` 中的示例拦截规则替换为 `RULE-SET,ads,AdBlock`（放在 `MATCH` 之前）：

```yaml
rule-providers:
  ads:
    behavior: classical
    url: https://raw.githubusercontent.com/YOUR_ACCOUNT/AdsKiller/YOUR_BRANCH/stash/rules/reject.yaml
    interval: 86400

# 加入现有 rules 列表，不要替换整段 rules：
# - RULE-SET,ads,AdBlock
```

## 个人配置

将含节点、订阅 URL、令牌或证书的内容保存在 `private/` 目录，或使用 `*.local.yaml` / `*.local.yml` 文件名。这些路径已被 Git 忽略；不要将真实凭据写入版本化模板。可在 `private/` 中保存一份完整个人配置再导入 Stash。

详细维护方式见 [维护约定](docs/maintenance.md)。

## 官方文档

- [Stash 配置样例](https://stash.wiki/configuration/example-config)
- [Stash 规则集](https://stash.wiki/en/rules/rule-set)

## 致谢与第三方授权

感谢 [kokoryh](https://github.com/kokoryh) 开发和维护 [Sparkle](https://github.com/kokoryh/Sparkle)。本仓库的 [哔哩哔哩增强覆写](stash/overrides/bilibili.stoverride) 由其 [原模块](https://github.com/kokoryh/Sparkle/blob/master/release/surge/module/bilibili.sgmodule) 转换，保留原作者署名，衍生文件沿用上游 GPL-3.0 许可证。皮肤脚本同样由 kokoryh 提供。

同时感谢上游致谢的 [app2smile](https://github.com/app2smile/rules)、[BiliUniverse](https://github.com/BiliUniverse/Universe)、[Maasea](https://github.com/Maasea/sgmodule)，以及提供 gzip 解压库 [fflate](https://github.com/101arrowz/fflate) 的 Arjun Barrett。

感谢 [app2smile](https://github.com/app2smile) 提供 [贴吧去广告覆写及脚本](https://github.com/app2smile/rules)。本仓库的参数版保留其署名及 MIT 许可证，参照原模块的参数语义增加 Stash 表单。

感谢 [Maasea](https://github.com/Maasea/sgmodule) 提供 YouTube 增强原始模块及脚本，以及 [kokoryh/Sparkle](https://github.com/kokoryh/Sparkle) 提供本次转换所依据的模块配置。两者署名及许可证信息均已保留。

感谢知乎模块署名作者 [RuCu6](https://github.com/RuCu6)、[blackmatrix7](https://github.com/blackmatrix7)，以及提供所选转换模块的 [QingRex/LoonKissSurge](https://github.com/QingRex/LoonKissSurge) 和原资源托管方[可莉插件中心](https://hub.kelee.one)。

感谢微博模块署名作者 [RuCu6](https://github.com/RuCu6)、[zmqcherish](https://github.com/zmqcherish)，以及提供转换模块和脚本托管的 QingRex 与可莉插件中心。

感谢小红书模块署名作者 [RuCu6](https://github.com/RuCu6)、[fmz200](https://github.com/fmz200)，以及提供所选模块和资源的 QingRex 与可莉插件中心。

来源版本、改动和许可证副本见 [第三方来源与许可证](THIRD_PARTY_NOTICES.md)。
