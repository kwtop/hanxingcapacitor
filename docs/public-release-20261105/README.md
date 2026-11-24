# 正式站发布与开放访问 · 2026-11-05

用户指定的最终正式域名为 **https://www.hanxingcapacitor.com**。后续内容工作默认发布到该正式站；明确要求本地、草稿或仅预览时除外。

## 已完成

- 正式发布到原 Cloudflare Pages 项目 hanxing-capacitor-preview 的 main 分支，沿用现有域名与 D1，没有建立新站或新数据库。
- 最终生产部署：660f4331-afb3-4d73-bdea-5a06e6772659。Cloudflare 状态 success，正式域名均绑定该生产部署。先前不带 www 的构建已被此最终版本取代。
- 本轮 Technical Guides、6 张样品修复图、红色 CBB61 原图选择、原图入口删除均已同步至正式站。
- 正式页面无 noindex 响应头，页面 robots 为 index,follow；canonical、OG、Schema 和 sitemap 使用带 www 的正式域名。
- robots.txt 对 User-agent: * 使用 Allow: /，公布 sitemap-index.xml；索引包含页面 sitemap 和图片 sitemap。
- 保留 Pages 预览域名的 noindex；后台、API 和工具页保持各自的访问与索引边界。
- 新增 npm run build:public / npm run deploy:public；发布命令固定正式域名、既有项目与 main 分支，包含检查、正式构建、隔离的 Pages/D1 验收、上传、线上 SEO/健康及私有接口保护检查。
- 发布规则保存于 workspace/AGENTS.md 与 README.md；未修改 Codex memories。

## 验证结果

| 范围 | 结果 |
| --- | --- |
| Astro 检查 | 211 文件，0 errors / 0 warnings / 0 hints |
| 正式静态构建 | 50 个页面产物，完成 |
| Pages Functions + 本地 D1 | 静态页、认证、询盘幂等与受保护导出验收通过；未写远程询盘 |
| 正式页面 | sitemap 中 40 个公开页面，全部检查通过 |
| 链接与图片 | 248 个目标，无错误 |
| 迁移跳转 | 31 项通过；4 个旧语言入口经过两次永久跳转，作为提示保留 |
| 搜索与 AI 请求探针 | 普通浏览器、Googlebot、bingbot、OAI-SearchBot、ChatGPT-User、GPTBot、ClaudeBot、PerplexityBot 均 HTTP 200，无 noindex/challenge 响应头 |
| 后台健康 | /api/health 返回 ready: true |
| 私有数据 | 匿名询盘列表及 CSV 接口均 HTTP 401 |
| 指南发布内容 | 原图按钮已删除；红色引线款的两处仍使用原始 JPG；CBB65 新样品图正常加载并可点击放大 |

User-Agent 探针证明的是这些请求的返回行为，不冒充真实搜索引擎索引或所有地区的网络测试。原图和生成来源记录保留在项目内。

## Cloudflare 控制台核对

CLI 的 OAuth token 能发布 Pages，但不能读取区域 Bot Management / WAF 设置，因此使用已登录 Chrome 只读核对了 hanxingcapacitor.com 的控制台。

- AI Crawl Control 的 32 类已列出爬虫，其“阻止爬网程序”开关全部关闭。
- AI 爬网程序和代理访问策略中，搜索、训练、代理，以及当前列出的个人代理均为“允许（不阻止）”。
- Bot Fight、Under Attack、Precursor 均处于关闭状态。自动程序偏好同步为开启。
- 上述状态原本即符合公开访问需求，未切换这些安全控件，未取消后台认证或表单验证，也未停用基础防护。

## 记录

- [deployment.json](./deployment.json)：Cloudflare 最终生产部署与域名绑定。
- [release-audit.json](./release-audit.json)：40 页面、248 目标和 31 跳转的正式站检查；errors 为空。非阻断提示为产品图片图库的发现路径及 4 条旧语言跳转链。
- [live-access-checks.json](./live-access-checks.json)：正式 robots/sitemap、8 类 User-Agent 探针、健康、私有接口、内容与预览边界。
- [Cloudflare Pages headers](https://developers.cloudflare.com/pages/configuration/headers/) 支持按主机名限制预览域名索引；[redirects 文档](https://developers.cloudflare.com/pages/configuration/redirects/) 明确 _redirects 不支持域名级 source，已移除原来无效的域名级条目。正式站别名继续通过 canonical 指向 www。
