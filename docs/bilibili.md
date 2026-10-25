# 哔哩哔哩增强覆写

文件：[bilibili.stoverride](../stash/overrides/bilibili.stoverride)。原作者为 [kokoryh](https://github.com/kokoryh)，基于 [Sparkle](https://github.com/kokoryh/Sparkle) 的哔哩哔哩增强模块转换。原规则、脚本与上游贡献者的归属见 [第三方来源与许可证](../THIRD_PARTY_NOTICES.md)。

## 安装

1. 使用支持 `engine: webkit` 的 Stash（iOS 3.6+、macOS 4.3+），导入并启用覆写。此转换以 iOS/macOS 的 WebKit 接口为目标。
2. 安装并信任 Stash 自己的 MitM 证书，确认 HTTP 改写与 MitM 功能已启用。覆写仅添加原模块的六个 MitM 域名，不包含个人证书。
3. 确认 Stash 能下载 `raw.githubusercontent.com` 上的三个远程 provider。两个 Protobuf provider 的兼容脚本内置于覆写，无需额外导入本地文件。
4. 停用其他处理相同哔哩哔哩接口的响应改写，然后重启哔哩哔哩、刷新首页并打开视频验证。此覆写可与 Reddit、Block QUIC 同时使用。

包含首页与动态净化、直播与评论广告处理、开屏静态响应、部分 gRPC 静态响应、P2P 拦截、空降助手和原皮肤脚本。实际覆盖范围依赖客户端与上游接口，尚未在 Stash 中实机验证。

## 默认参数

为兼容不支持参数表单的 Stash 版本，参数直接写在 `http.script[].argument` 的 JSON 中，默认值沿用原模块。

| 参数 | 默认值 | 修改方式 |
| --- | --- | --- |
| 动态最常访问 | `auto` | 响应脚本 `displayUpList`，可选 `auto` / `show` / `hide` |
| 创作中心 | `0` | JSON 响应脚本 `showCreatorHub`，`1` 为显示 |
| 过滤置顶评论广告 | `1` | 请求与响应脚本的 `purifyComment` 同时改为 `0` 可关闭 |
| 空降助手 | 开启 | 关闭时删除 `DmSegMobile` 请求脚本，并将 Protobuf 响应脚本的 `sponsorBlock` 改为 `"#"` |
| 空降助手策略 | `DIRECT` | 同时修改 `DOMAIN,bsbsb.top,DIRECT` 的策略和 `DmSegMobile` 参数 `airbornePolicy`，填写主配置中已存在的策略名称 |
| 屏蔽 P2P | 开启 | 关闭端口拦截时删除三条 `DST-PORT`；tracker/stun 域名拦截仍独立生效，与原模块开关范围一致 |
| 日志等级 | `4` | 修改各 `logLevel`：`1` DEBUG、`2` INFO、`3` WARN、`4` ERROR、`5` OFF |

端口拦截按原模块默认行为作用于所有目的地的 4480、4483、9102 端口。覆写的 `rules` 前置合并，优先于主配置的直连、放行和兜底规则；这些拦截不受 `AdBlock` 策略组控制。

## 转换与兼容性

| 原模块内容 | Stash 实现 |
| --- | --- |
| 分流规则（9 条） | `rules`；`DEST-PORT` 转为 `DST-PORT`，`REJECT-NO-DROP` 转为 `REJECT` |
| 静态响应（8 条） | `http.mock`；保留原 JSON 文本、gRPC Base64 字节及响应头 |
| jq 改写（4 条） | `http.body-rewrite` 的 `response-jq`，保留原表达式 |
| HTTP 脚本（7 条） | `http.script` + 五个 `script-providers`，保留原匹配范围和默认参数 |
| 二进制脚本 | `binary-mode: true`；内置上游脚本、fflate 解压与 Stash 返回值适配 |
| MitM（6 个主机） | `http.mitm`，追加合并 |

移除了原模块专用的 `extended-matching` 与 `pre-matching` 参数，采用 Stash 常规规则匹配。域名规则不承诺等同原模块的扩展匹配和连接前拦截；`REJECT` 也不保证与原来的 `REJECT-NO-DROP` 在自动丢包行为上完全一致。

原模块的 `engine=webview` 改为 Stash 的 `engine: webkit`；`max-size=-1` 改为 4 MiB，超限请求或响应不执行脚本，解压后的 gRPC 消息也限制为 4 MiB。保留请求脚本 10 秒超时，并为其他脚本统一设置 10 秒。

gRPC 兼容层通过同步解压支持压缩帧，并将合成响应中的 HTTP/2 trailers 合并进响应头，默认补齐 HTTP 200，避免传入未文档化的返回字段。未改变原脚本的消息过滤逻辑；上游对多帧等协议结构的限制仍适用。

远程 provider 固定在转换时的上游提交，不会自动追随 `master` 的逻辑变化。升级需重新对照源模块、脚本及兼容层。可调整参数直接保存在覆写文件中，重新导入更新时请保留个人修改。

## 验证

本地检查包括 YAML 解析、上游规则/响应/脚本匹配范围对照、gRPC Base64 帧与 jq 表达式，以及使用 Stash 接口模拟的 Protobuf 请求、响应和 gzip 解压。运行：

```sh
node --test tests/bilibili-override.test.cjs
```

本地检查需要 Node.js、带 YAML 标准库的 Ruby，以及 jq。

这些检查验证转换逻辑，不能替代 Stash 实机加载、证书信任和真实接口测试。脚本是否命中、页面与弹幕是否正常，需要在客户端请求记录和实际使用中确认。
