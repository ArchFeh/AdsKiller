# 贴吧去广告参数版

文件：[tieba.stoverride](../stash/overrides/tieba.stoverride)。原作者：[app2smile](https://github.com/app2smile)。以原作者的 Stash 覆写为基础，参照同项目模块的参数定义增加 Stash 参数表单，保留原有脚本、URL 匹配、MitM 域名与更新间隔。

## 使用

1. 使用支持覆写参数的 Stash。官方文档当前标注为 **Beta iOS/tvOS 3.7+、macOS 4.4+**；原脚本标注的 iOS 15 要求仍适用。
2. 导入覆写，在参数表单中选择“推荐页视频贴”，然后启用。已安装后可进入该覆写详情中的“参数”修改，保存并应用。
3. 安装并信任 Stash MitM 证书，启用 HTTP 改写和 MitM。沿用上游设置，仅添加 `tiebac.baidu.com`；正则中的其他主机按现有配置与请求协议处理。
4. 确认两个远程脚本能从 GitHub 下载，重新启动贴吧并刷新推荐页。停用其他匹配相同接口的贴吧改写，避免重复处理。

## 参数

| 参数 | 选项 | 默认 | 作用 |
| --- | --- | --- | --- |
| `per_filter_video` | `0` 保留视频贴、`1` 过滤视频贴 | `0` | 是否过滤推荐页的视频贴，不是广告过滤总开关 |

原模块将 `per_filter_video` 映射为脚本参数 `per_filter_video_thread`。本覆写通过：

```yaml
argument: 'per_filter_video_thread=${args.per_filter_video}'
```

把选择结果传给 Protobuf 响应脚本 `smile_tieba_proto`。原脚本读取的是键值字符串，因此保持 `per_filter_video_thread=0` / `per_filter_video_thread=1` 格式。该参数不传给 JSON 脚本，也不增加原脚本没有提供的过滤范围。

## 来源与验证

- [原始 Stash 覆写](https://github.com/app2smile/rules/blob/df6366a7024e0b3f0aa3510c5b791eea6f3cba89/module/tieba.stoverride)
- [原模块参数说明](https://github.com/app2smile/rules/blob/df6366a7024e0b3f0aa3510c5b791eea6f3cba89/module/tieba.sgmodule)
- [Stash 覆写参数文档](https://stash.wiki/en/configuration/override#override-parameters)
- [第三方来源与 MIT 许可证](../THIRD_PARTY_NOTICES.md)

仅增加参数表单、参数传递和来源信息，未将参考模块中的额外域名规则集加入此覆写。远程脚本 URL 沿用上游的 `master`，继续按原间隔更新；来源链接固定在转换时的提交，便于对照。

本地检查覆盖 YAML 解析、原覆写配置对照，以及两种选项的参数替换和原脚本解析。尚未在 Stash 中验证参数界面与实际过滤效果。
