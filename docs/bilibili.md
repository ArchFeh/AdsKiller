# 哔哩哔哩增强覆写

文件：[bilibili.stoverride](../stash/overrides/bilibili.stoverride)。基于 [kokoryh / Sparkle](https://github.com/kokoryh/Sparkle) 的哔哩哔哩增强模块转换，保留原作者署名与 GPL-3.0 许可，来源见 [第三方说明](../THIRD_PARTY_NOTICES.md)。

## 安装与参数

使用支持覆写参数的 Stash Beta（iOS 3.7+、macOS 4.4+）。导入并启用覆写，安装并信任 Stash MitM 证书，开启 HTTP 改写与 MitM。导入时设置参数，之后可在覆写详情的“参数”中修改，点击“保存并应用”生效；远程更新会保留仍有效的个人参数。

| 参数 | 默认值 | 用法 |
| --- | --- | --- |
| 动态最常访问 | 自动 | 有正在直播的 UP 主时显示；也可始终显示或隐藏 |
| 显示创作中心 | 关闭 | 开启后显示创作中心 |
| 过滤置顶评论广告 | 开启 | 同时控制请求与响应脚本中的评论净化 |
| 空降助手 | 开启 | 关闭后停止弹幕分段请求拦截及相应响应处理 |
| 空降助手策略 | `DIRECT` | 填写主配置中已有的策略名称，同步用于域名规则和脚本请求 |
| 屏蔽 P2P 端口 | 开启 | 拦截所有目的地的 4480、4483、9102 端口 |
| 日志等级 | ERROR | 可选 DEBUG、INFO、WARN、ERROR、OFF |

P2P 开关沿用原模块范围，仅控制上述三个端口；tracker/stun 域名拦截与改写独立生效。规则优先于主配置的放行和兜底规则，不受 `AdBlock` 策略组控制。

## 脚本与兼容性

覆写只保留参数、规则和脚本引用。两个 Protobuf 脚本放在 [stash/scripts/bilibili](../stash/scripts/bilibili)，通过本仓库远程地址加载；其余三个脚本引用固定提交的上游版本。需要能下载 `raw.githubusercontent.com` 上的脚本，更新后可在 Stash 中刷新脚本资源。

保留原模块的 8 条静态响应、4 条 jq 改写、7 条脚本匹配和 6 个 MitM 域名。Protobuf 脚本保留原过滤逻辑，并提供 gzip 解压、合成响应字段适配及空降助手策略选择。脚本使用 WebKit 引擎，响应与解压体积上限为 4 MiB，超时 10 秒。

当前转换使用 Stash 常规规则及 `REJECT`，与原模块的扩展匹配、提前拦截和 `REJECT-NO-DROP` 在拦截时机及丢包行为上可能有差异。停用其他处理相同接口的改写后，重启哔哩哔哩验证。尚未在 Stash 中实机验证，客户端接口变化可能影响效果。

## 验证

```sh
node --test tests/bilibili-override.test.cjs
```

需要 Node.js、带 YAML 标准库的 Ruby、Python 3 和 jq。检查参数展开、P2P 开关、空降助手开关与策略、静态响应、jq，以及模拟 Stash 接口的 Protobuf 请求、响应和 gzip 解压；不替代客户端实测。
