# YouTube 增强覆写

文件：[youtube.stoverride](../stash/overrides/youtube.stoverride)。依据用户指定的 [kokoryh/Sparkle 模块](https://github.com/kokoryh/Sparkle/blob/290bcbdd2f158cdd8f7db9c996e90fe63490e16f/release/surge/module/youtube.sgmodule) 转换，实际运行 [Maasea](https://github.com/Maasea/sgmodule) 的 YouTube 请求与响应脚本。保留两者来源；这是 AdsKiller 的 Stash 适配，不代表上游官方支持 Stash。

## 使用

1. 使用支持覆写参数表单和 WebKit 脚本引擎的 Stash。本配置以 iOS/macOS 为目标；参数功能官方当前标注为 **Beta iOS/tvOS 3.7+、macOS 4.4+**。
2. 导入并启用覆写，在参数表单中调整选项；安装后可在覆写详情的“参数”中保存并应用修改。
3. 安装并信任 Stash MitM 证书，启用 HTTP 改写与 MitM。沿用原模块的 `*.googlevideo.com`、`youtubei.googleapis.com` 两项域名。
4. 确认两个远程脚本能从 GitHub 下载，停用其他处理相同 YouTube 接口的改写，然后重新启动 YouTube / YouTube Music 验证。若 QUIC 导致 HTTPS 改写未命中，可结合本仓库的 [Block QUIC](../stash/overrides/block-quic.stoverride) 使用。

原项目列出的功能包括去广告、画中画、后台播放和翻译；实际效果受 YouTube 客户端、服务端实验与上游脚本版本影响，不能将参数开关视为所有界面或内容的过滤保证。Stash 尚未实机验证。

## 参数

| 参数 | 默认值 | 传给原脚本的字段 |
| --- | --- | --- |
| 屏蔽上传按钮 | 开启 | `blockUpload: true` |
| 屏蔽选段按钮 | 开启 | `blockImmersive: true` |
| 屏蔽 Shorts 按钮 | 开启 | `blockShorts: true` |
| 字幕翻译语言 | `off`，关闭翻译 | `captionLang`，填写语言代码，例如 `zh-CN` |
| 启用调试模式 | 关闭 | `debug: false` |

默认值严格沿用本次指定的 Sparkle 模块；该模块默认屏蔽 Shorts 按钮，与 Maasea 原模块的默认设置不同。通过 Stash 的 `${args.name|json}` 将选项编码为 JSON，保持布尔类型和字符串转义。`initplayback` 请求脚本按上游配置仅接收字幕语言，`log_event` 请求脚本不接收参数。

## 转换范围与原脚本行为

保留原模块三条请求/响应匹配规则、两个脚本和两项 MitM 域名。`binary-body-mode=1` 转为 Stash 的 `binary-mode: true`，读取响应或请求体；使用 `engine: webkit`，超时设为 10 秒。原模块的无限制体积改为 **4 MiB**，超限时不执行脚本。

原脚本会将 `YouTubeConfig`、`YouTubeAdvertiseInfo` 等配置与广告识别缓存写入 Stash 持久化存储，供请求与响应脚本共享。沿用其 `initplayback` 处理流程：根据缓存状态，部分请求会重定向至原作者的 `https://init-stream.maasea.workers.dev/` Worker，用于处理 UMP 播放数据；该功能依赖 Worker 可访问。

两个远程脚本固定在 Maasea 仓库提交 `65075cdb388fc5e3094afd7e7314c67b243f3525`，未复制、修改或自动跟随 `master`。后续升级需要重新检查匹配范围、参数和脚本兼容性。本覆写不添加分流规则，不受 `AdBlock` 策略组开关控制。

本地检查已覆盖 YAML 解析、三条规则与源模块对照、16 种布尔参数组合、字幕字符串转义，以及三条脚本入口在模拟 Stash 接口下的空消息执行。此项检查未发起网络请求，也未验证真实广告过滤或播放结果。

## 来源与授权

- 模块配置：[kokoryh/Sparkle](https://github.com/kokoryh/Sparkle)，GPL-3.0；转换后的覆写按 GPL-3.0 分发。
- 原始模块与脚本：[Maasea/sgmodule](https://github.com/Maasea/sgmodule)，Apache-2.0，远程脚本保持原作者授权。
- 来源版本与许可证副本：[第三方来源与许可证](../THIRD_PARTY_NOTICES.md)。
- 参数格式：[Stash 官方覆写文档](https://stash.wiki/en/configuration/override#passing-parameters-to-scripts)。
