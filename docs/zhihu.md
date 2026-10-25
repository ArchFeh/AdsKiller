# 知乎去广告覆写

文件：[zhihu.stoverride](../stash/overrides/zhihu.stoverride)。根据 [QingRex/LoonKissSurge 的 Beta 模块](https://github.com/QingRex/LoonKissSurge/blob/913ec005f544221e6c56a7d0ecec81c4b3b914bb/Surge/Beta/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A.beta.sgmodule) 转换，保留原模块署名 **RuCu6、blackmatrix7** 及 `hub.kelee.one` 主页。QingRex 为所选转换模块的分发来源；远程脚本仍引用原模块中的 kelee 地址。

## 使用

1. 在支持 `http.mock` 和 `http.body-rewrite` 的 Stash 中导入并启用，安装并信任 Stash MitM 证书，开启 HTTP 改写和 MitM。原模块没有参数，此覆写不要求参数表单。
2. 覆写仅追加 `*.zhihu.com` 到 MitM 域名。停用其他处理相同知乎接口的改写，避免重复过滤。
3. 在外部资源中更新 `zhihu-remove-ads`。provider 已配置经过下载验证的完整 Loon User-Agent，Stash 下载及更新原地址时会携带该请求头。
4. 检查资源更新成功，再重启知乎、刷新页面，确认脚本匹配与实际过滤效果。尚未在 Stash 中实机验证。

脚本下载配置如下，仅作用于该 provider 的资源请求，不修改知乎 App 请求头：

```yaml
script-providers:
  zhihu-remove-ads:
    url: https://kelee.one/Resource/JavaScript/Zhihu/Zhihu_remove_ads.js
    interval: 86400
    headers:
      User-Agent: 'Loon/921 CFNetwork/3860.500.111.2.2 Darwin/25.5.0'
```

2026-10-26 本环境对同一脚本地址作了对照验证：短值 `Loon` 返回 HTTP 403 和 HTML 拦截页；以上完整值连续两次返回 **HTTP 200、application/javascript、7,623 字节**，两份脚本内容一致。插件中心的实际知乎导入地址 `https://kelee.one/Tool/Loon/Lpx/Zhihu_remove_ads.lpx` 使用该值也返回 HTTP 200（5,638 字节）。这些结果证明该值在本次测试可用，不代表已经确定站点检查的所有条件。

保留原脚本地址且未复制其实现。Stash 的 provider 请求头配置方式见[官方文档](https://stash.wiki/en/script/manage-script)。

## 转换范围

| 源模块内容 | Stash 实现 |
| --- | --- |
| 10 条分流规则 | `rules`，保留域名、IPv4/IPv6 地址、REJECT 和 `no-resolve` |
| 3 条 URL 改写 | `http.url-rewrite`，两条拒绝请求和一条安全中心重定向 |
| 5 条响应体改写 | `http.body-rewrite`：5 条 `response-jq`，其中搜索推荐正则改为按 JSON 字段处理 |
| 22 条本地响应 | `http.mock`，保留匹配、HTTP 200、JSON 响应头和 `{}` 响应体 |
| 10 条脚本匹配 | `http.script`，共用一个远程 `script-provider` |
| MitM | `http.mitm: ['*.zhihu.com']` |

移除原模块中的 `extended-matching`、`pre-matching`，使用普通 Stash 分流；不承诺原模块的扩展匹配与连接前拦截行为。所有响应脚本明确设置 1 MiB 上限、10 秒超时；脚本下载间隔设为 86400 秒。未添加原模块没有提供的可配置参数或脚本适配层。

搜索推荐接口沿用“清空 `recommend_queries` 对象”的意图，将原来的贪婪正则替换为 jq，避免吞掉相邻 JSON 字段或破坏括号；字段缺失、为非对象或顶层不是对象时保留输入。三条会员页 jq 表达式保持原样；回答列表表达式仅将 `?//` 分隔为 `? //`，修正 jq 解析歧义，保留过滤逻辑。

安全中心重定向保持上游 `http://$1` 的目标格式及原正则，不改变为 HTTPS，也不额外解码 `target`。回答列表的 jq 规则除了删除广告字段，还会过滤 `answer_type` 包含 `paid` 的条目；这同样是源模块已有行为。

## 检查与来源

本地检查覆盖 YAML 解析、分流/URL/响应/脚本匹配范围对照、jq 样例和正则编译；下载到的原脚本通过 JavaScript 语法检查，并在模拟 Stash 的 `$request`、`$response`、`$done` 接口下通过 7 个响应样例（关联提问、标签、下一回答、热榜、推荐流等）。检查没有覆盖全部脚本分支或真实页面效果，也不修改上游脚本实现。

- [RuCu6](https://github.com/RuCu6)、[blackmatrix7](https://github.com/blackmatrix7)：保留的源模块作者署名。
- [QingRex/LoonKissSurge](https://github.com/QingRex/LoonKissSurge)：本次所选模块的分发和转换来源。
- [可莉插件中心](https://hub.kelee.one)：原模块主页与远程脚本托管方。
- [第三方来源与分发说明](../THIRD_PARTY_NOTICES.md)。
