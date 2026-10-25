# 微博去广告覆写

文件：[weibo.stoverride](../stash/overrides/weibo.stoverride)。依据 [QingRex/LoonKissSurge 的微博模块](https://github.com/QingRex/LoonKissSurge/blob/913ec005f544221e6c56a7d0ecec81c4b3b914bb/Surge/%E5%BE%AE%E5%8D%9A%E5%8E%BB%E5%B9%BF%E5%91%8A.sgmodule) 转换，保留原署名 **RuCu6、zmqcherish**，以及可莉插件中心主页。远程脚本保持原 kelee 地址，不复制进仓库，也不修改脚本实现。

## 使用

1. 在支持 `http.mock` 的 Stash 中导入并启用覆写，安装并信任 Stash MitM 证书，开启 HTTP 改写及 MitM。
2. 在外部资源中更新 `weibo-remove-ads`，然后重新启动微博并刷新页面。停用其他匹配相同微博接口的脚本，避免重复处理。
3. 在请求记录中确认对应接口命中响应脚本，检查首页、评论区、消息页与开屏是否正常。本地模拟不能替代实际页面验证。

原模块没有参数，此覆写不依赖参数表单。原脚本不仅处理广告，也会精简首页和超话标签、个人页、关注弹窗、消息提醒、头像挂件及部分详情菜单；这些行为均保留上游默认逻辑，不添加额外开关。

## 下载请求头

```yaml
script-providers:
  weibo-remove-ads:
    url: https://kelee.one/Resource/JavaScript/Weibo/Weibo_remove_ads.js
    interval: 86400
    headers:
      User-Agent: 'Loon/921 CFNetwork/3860.500.111.2.2 Darwin/25.5.0'
```

该请求头仅用于资源下载和更新，不修改微博 App 的请求头。2026-10-26 使用此值取得 HTTP 200、`application/javascript`、56,702 字节的脚本正文，头部标注对 RuCu6 的 `Loon/main/Scripts/weibo.js` 的引用。远程地址不固定脚本版本，后续更新仍需检查兼容性。

## 转换范围

| 源模块内容 | Stash 实现 |
| --- | --- |
| 3 条分流规则 | `rules`，保留原匹配条件和 DIRECT / REJECT 策略 |
| 18 条静态响应 | `http.mock`，保留 HTTP 200、JSON 响应头与 `{}` 响应体 |
| 19 条响应脚本匹配 | `http.script`，共用一个远程 provider |
| MitM | `*.weibo.cn`、`*.weibo.com`、`weibo.com` |

按源模块保留 `DOMAIN-SUFFIX,uve.weibo.com,DIRECT`，让相关请求进入 HTTP 响应处理；不将其改成整域拒绝。`huodong.weibo.cn` 和 `biz.weibo.com` 的拦截继续使用 REJECT。移除 `extended-matching`、`pre-matching`，不承诺原模块的扩展匹配和连接前拦截行为。

脚本要求响应体，明确设置 1 MiB 体积上限和 10 秒超时；超限时不执行脚本。原脚本对 `sdkad.php` 响应保留其 JSON 后的 `OK` 尾缀，其余匹配接口由原脚本处理 JSON。分流与静态响应不受 `AdBlock` 策略组控制。

## 验证与来源

本地检查包含源模块版本与转换映射核对、YAML 解析、正则编译、远程脚本语法及模拟 Stash 响应样例。尚未在 Stash 中实机验证，也没有覆盖上游脚本的全部数据结构。

- [RuCu6](https://github.com/RuCu6)、[zmqcherish](https://github.com/zmqcherish)：源模块作者署名。
- [QingRex/LoonKissSurge](https://github.com/QingRex/LoonKissSurge)：本次选用模块的转换和分发来源。
- [可莉插件中心](https://hub.kelee.one)：原模块主页和脚本托管方。
- [第三方来源与分发说明](../THIRD_PARTY_NOTICES.md)。
