# 小红书去广告覆写

文件：[redpaper.stoverride](../stash/overrides/redpaper.stoverride)。根据 [QingRex/LoonKissSurge 的小红书模块](https://github.com/QingRex/LoonKissSurge/blob/913ec005f544221e6c56a7d0ecec81c4b3b914bb/Surge/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.sgmodule) 转换，保留原作者署名 **RuCu6、fmz200** 和可莉插件中心主页。

## 使用

1. 在支持 `PROTOCOL,QUIC`、`http.mock` 和 jq 响应改写的 Stash 中导入并启用，安装并信任 Stash MitM 证书，开启 HTTP 改写与 MitM。
2. 更新覆写至 `2026.10.26.1` 或更新版本，在外部资源中更新 `redpaper-remove-ads`。停用其他处理相同小红书接口的脚本，避免重复改写。
3. 在请求记录中检查脚本匹配，并验证首页、搜索、笔记和媒体保存功能。原模块没有参数，不依赖参数表单；尚未在 Stash 中实机验证。

沿用上游的广告过滤与水印处理，包括图片、视频、实况照片和评论区实况照片的相关保存接口。原脚本还会处理直播推广、商品卡片、热搜推荐、页面小部件和关注推荐，保留这些默认行为。

## 保存图片仍有水印

本次修正对照 [fmz200 的规则](https://github.com/fmz200/wool_scripts/blob/c3f8128dd03c6b3cb35821c347968282cc45b34f/Loon/plugin/blockAds.plugin)，补齐 `rnote.com` 的 MitM 与改写，并将图片笔记接口扩展到 `edith`、`rec`、`www`。旧版只匹配 `edith.xiaohongshu.com`，其他主机上的图片笔记不会执行去水印脚本。

图片笔记的 `imagefeed`、`v2/note/feed` 所在两组脚本体积上限从 1 MiB 调整为 4 MiB，避免较大响应被 Stash 跳过；其他脚本仍为 1 MiB。远程脚本、正文结构与媒体 URL 未作替换。

更新后先清除小红书应用缓存，完全退出应用，再重新打开笔记保存图片。已有笔记数据、水印配置和已保存到相册的图片不会因更新覆写自动改变。请在 Stash 请求记录确认图片接口命中脚本、水印配置接口命中透明 GIF 响应。

如果仍有水印，需要提供小红书与 Stash 版本、相应请求的 URL（隐去查询参数）及脚本执行状态。当前未取得问题设备的响应样本，不能确认此次匹配与体积修正覆盖所有失效原因。

## 下载与缓存

```yaml
script-providers:
  redpaper-remove-ads:
    url: https://kelee.one/Resource/JavaScript/RedPaper/RedPaper_remove_ads.js
    interval: 86400
    headers:
      User-Agent: 'Loon/921 CFNetwork/3860.500.111.2.2 Darwin/25.5.0'
```

2026-10-26 使用该请求头取得 HTTP 200、`application/javascript`、15,186 字节的脚本正文，脚本头部保留对 RuCu6 的 `Loon/main/Scripts/xiaohongshu.js` 的引用。请求头仅用于 provider 下载和更新，不修改小红书 App 的请求头；地址不固定脚本版本。

原脚本使用 Stash 的 `$persistentStore` 缓存媒体链接，供后续视频与实况照片保存请求读取。若部分保存结果尚未处理，需先让相应笔记或评论列表请求经过脚本，以生成所需缓存。缓存键和处理逻辑保留上游实现，未在本仓库复制或修改脚本。

## 转换范围

| 源模块内容 | Stash 实现 |
| --- | --- |
| QUIC 规则 | 分别拦截 `xiaohongshu.com` 与 `rnote.com` 的 QUIC |
| 5 条 jq 改写 | `http.body-rewrite` 的 `response-jq`，保留原表达式 |
| 5 条本地响应 | `http.mock`：4 条 JSON `{}` 和 1 条 1×1 GIF 占位响应，均返回 HTTP 200 |
| 12 条脚本匹配 | `http.script`，共用一个远程 provider |
| MitM 主机 | `ci`、`edith`、`rec`、`so`、`www` 的 `xiaohongshu.com` 与 `rnote.com` 域名 |

QUIC 拦截沿用源模块的方式，补齐 `rnote.com`，移除 `extended-matching`。水印配置接口的 `tiny-gif` 改为内置 Base64 GIF 响应。响应脚本设置上述体积上限、10 秒超时，超限时不执行脚本。分流和静态响应不受 `AdBlock` 策略组开关控制。

## 验证与来源

本地检查包括固定版本与转换映射核对、YAML 解析、正则编译、五条 jq 样例、GIF 尺寸及脚本响应样例。检查不能保证覆盖全部上游数据结构或小红书服务端实验，实际页面与下载结果仍需实机确认。

`node --test tests/redpaper-override.test.cjs` 检查图片接口匹配、体积限制和透明 GIF。设置 `ADSKILLER_REDPAPER_SCRIPT` 为已下载的原脚本路径后，还会模拟执行原脚本，验证双域名各图片接口及超过 1 MiB 的响应能正确设置 `disable_watermark`；未设置时跳过这两项执行检查。原脚本未复制进仓库。

- [RuCu6](https://github.com/RuCu6)、[fmz200](https://github.com/fmz200)：原模块署名作者。
- [QingRex/LoonKissSurge](https://github.com/QingRex/LoonKissSurge)：所选模块的转换和分发来源。
- [可莉插件中心](https://hub.kelee.one)：原模块主页与脚本托管方。
- [第三方来源与分发说明](../THIRD_PARTY_NOTICES.md)。
