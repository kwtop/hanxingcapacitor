# SEO / GEO / AI Search 技术底座验收

日期：2026-10-12。工作目录：`D:\Hangxing\workspace`。正式域名：`https://www.hanxingcapacitor.com`。

当前只发布英文的方向已由用户确认。此次只修改、构建、验证本地项目，没有部署、切换线上流量、发送询盘、提交 Sitemap 或发送 IndexNow 请求。

## 结论与实测

| 检查 | 最终结果 | 证据 |
| --- | --- | --- |
| 技术栈 | 保持 Astro 7 + Node standalone / SSR；产品、应用、技术资料预渲染 | `package.json`、`astro.config.mjs`、三个 `[slug].astro` |
| 类型检查 | 72 files，0 errors / warnings / hints | `npm run check` |
| 构建 | 预览与正式环境两种构建均通过 | `npm run build`；设置 `PUBLIC_SITE_URL` 后独立正式构建 |
| 正式页面 | 30 个英文可索引页面，全部 HTTP 200；唯一 Title / Description / 自引用 Canonical；无 noindex | `.qa/seo-release-audit.json` |
| 初始 HTML | 30 页都有一个 H1、核心正文、普通可抓取链接；无需 JS 才能读取主体 | 同上，直接读取原始 HTTP HTML，不是仅检查源码或渲染 DOM |
| Meta / Schema | OG、Twitter、JSON-LD 全部有效；无虚构价格、评分、认证、作者、日期或法律卖方 | JSON.parse 验证 + 浏览器 DOM 抽查产品和条款页 |
| 内链与图片 | 119 个独立内部目标和 HTML 图片资源返回 200，0 错误、0 警告 | 最终 `check:release` 输出 |
| Sitemap | XML 解析通过；1 个子 Sitemap、30 个唯一 URL；不包含工具页和旧语言页 | PowerShell XML parser + 发布验收 |
| 旧 URL | 31 条永久重定向验证通过 | 28 条现有西语/阿语 URL + 3 条旧英文 URL |
| 404 | 不存在的路径真实返回 HTTP 404，且 noindex | 正式构建与本地预览分别验证 |
| 预览保护 | robots 全站 Disallow；HTML meta 与 HTTP X-Robots-Tag noindex；Sitemap 空 | `.qa/seo-preview-audit.json`，本地 4325 |
| 手机 | 条款页 390px 无横向溢出 | 浏览器视觉与 DOM 测量 |

30 页包含：首页；产品目录、4 个系列、原图目录；应用目录、4 个应用；OEM & quality、OEM、Factory、Packing；Buying Guide；资源目录、7 篇技术资料；FAQ、About、Contact、Privacy、Terms。

## 已完成

- **路由自动发现**：`src/lib/seoRoutes.ts` 从实际 `.astro` 页面和产品/应用/技术资料集合生成索引。新增静态页面或集合记录后，重新构建即更新。明确排除 noindex、404、预览和询盘状态页；避免第二套手工 URL 清单。
- **文件复用**：保留并完善已有 `/robots.txt`、`/sitemap.xml`；补齐 `/sitemap-index.xml` 和旧 `/sitemap-0.xml` 地址兼容。根域统一使用确认的正式域名。
- **预览与正式分离**：正式构建和运行的 `PUBLIC_SITE_URL` 必须一致。未匹配时保留预览保护，Sitemap 不列 noindex 页面。没有制造 `lastmod`、`priority`、`changefreq`；缺少可信内容修订日期时省略 lastmod。
- **搜索爬虫**：正式 robots 的 `User-agent: *` / `Allow: /` 覆盖 Googlebot、Bingbot、OAI-SearchBot；只限制 API 和内部设计参考目录。工具页允许抓取以读取 noindex，渲染资源、图片和视频不阻止。
- **公共元数据**：Layout 自动输出完整 OG / Twitter、页面主图和 alt、去重品牌 Title、绝对 Canonical。查询参数不进入 Canonical。调整过长的首页、Factory、产品及家电应用元数据。
- **事实一致的 Schema**：Organization（公开商务名与用户确认的联系方式，不声明法律卖方或自有工厂）、WebSite、WebPage / AboutPage / ContactPage / CollectionPage、BreadcrumbList；产品用 ProductGroup 描述系列，资源用 TechArticle，目录用 ItemList。没有 offers、rating、certification、虚构作者或发布日期。
- **AI 内容索引**：`llms.txt` 与同一内容源同步，明确系列范围、实拍/示意图、型号与商务文件待确认边界；不创建 AI 专用虚构标准文件，也不把该文件视为搜索访问授权或排名因素。
- **可信度入口**：现有企业身份、联系信息、质量控制、工序视频、样品、采购指南和技术资料保持真实；新增 `/terms/` 说明报价、MOQ、样品审批与书面订单需要确认的事项，并加入全站页脚。保留隐私说明。
- **可重复验收**：扩展已有 `scripts/check-release.mjs`，验证 XML 类型、唯一性、Meta、JSON-LD、主体 HTML、内链、全部 HTML 图片资源、noindex 工具页、404、3 类爬虫 UA 和 31 条迁移规则。

## 覆盖旧站时的 URL 策略

- `/es/`、`/ar/` 及有对应英文页面的路径 → 对应英文路径，301；保留查询参数。
- 西语/阿语 `/request-a-quote/` → `/contact/`，301。
- `/certificates/` → `/factory/#model-records`，301；提供真实型号文件索取入口，不创建虚构证书目录。
- `/case-studies/` → `/applications/`，301；当前为应用指导，没有冒充真实客户案例。
- `/markets/` 及旧语言同名路径 → `/buying-guide/`，301；保留询价目的地要求，不声称已服务未经确认的国家。
- 其它未知 URL 返回 404，不批量转首页造成 soft 404。
- 英文 `/request-a-quote/` 保留现有路径与功能，继续 noindex。新 Sitemap 和 HTML 不发布不存在的西语/阿语 Hreflang。

## 线上旧版本抽查（不等于本次已上线）

线上目前是 Astro 6，具有英文/西语/阿语。robots 允许所有爬虫；Sitemap Index 指向 `/sitemap-0.xml`，共 45 个 URL（17 英文、28 语言版本），未使用 lastmod。已有 `llms.txt` 和正确联系信息。

发现：`/sitemap.xml` 返回 HTTP 200 首页 HTML；不存在的测试路径也返回 HTTP 200 首页，构成 soft 404 风险。新项目的对应行为已在本机正式构建修复；**线上仍维持旧版本，需部署后再验证**。

Googlebot、bingbot、OAI-SearchBot 字符串抽查产品页均 HTTP 200、无 noindex、无 X-Robots-Tag。此检查只证明当前请求路径未按这些 User-Agent 拦截，不证明真实搜索爬虫 IP 可以穿过全部 Cloudflare 安全规则。没有读取 Cloudflare 规则或真实爬虫日志。

## 尚存问题与优先级

| 优先级 | 事项 | 行动 |
| --- | --- | --- |
| P0 上线条件 | 构建、运行域名与承载模式 | `PUBLIC_SITE_URL` 两处设置为确认的 HTTPS 域名后重新构建；使用 Node standalone 服务或兼容当前 SSR 的运行环境。不能只上传 `dist/client`，也不能把所有未知请求回退到首页。此次 `dist` 是受保护的预览产物，不能直接视为可索引正式包。 |
| P0 发布验收 | 旧站 45 个 URL 和 CDN 行为 | 部署后运行发布检查；复查语言与旧英文重定向、真实 404、robots、XML Content-Type、Canonical 和 noindex。 |
| P1 搜索平台 | 实际收录与爬虫访问 | 在 Google Search Console、Bing Webmaster Tools 提交 Sitemap Index；用 URL Inspection / Live Test 核对抓取 HTML、规范 URL 与索引原因。结合 Cloudflare 日志与官方 IP/反向 DNS 验证真实爬虫，不按可伪造的 UA 全面绕过 WAF。当前只验证可索引性，不能宣称已被 Google/Bing/ChatGPT 收录。 |
| P1 企业证据 | 卖方/制造关系、型号数据表、证书、客户案例、正式商务与隐私规则 | 现有记录仍需企业确认；技术代码不能代替证据。补齐后再发布真实证书、项目案例、型号级数据和经企业确认的商业规则。 |
| P2 图片/视频搜索 | 图片已能由 HTML 直接发现；视频缺少可核实的发布日期等元数据 | 原图较多时可从原图库自动生成图片 Sitemap。先补视频归属、标题、描述、发布日期、时长，再评估视频 Sitemap / VideoObject；本轮不捏造日期或项目背景。 |
| P2 IndexNow | 网站更新频率和部署触发器尚未建立 | 上线后若产品/资料频繁更新，可加入发布时的增量通知；需正式域名 key 文件和成功日志。此次未生成 key、未提交。提交成功仅表示收到 URL，不表示收录。 |
| P2 内容质量 | 文章作者、审核者及实际修订日期尚未确认 | 确认负责人及修订记录后，正文与 Article/lastmod 同步补充。产品系列 Schema 缺少真实价格/评分/可订 SKU 时，不保证商品富结果；不能为通过富结果测试补造数据。 |

## 发布后复现

```powershell
$env:PUBLIC_SITE_URL='https://www.hanxingcapacitor.com'
npm run check
npm run build
# 运行环境也设置相同 PUBLIC_SITE_URL，再启动 Node 服务。
npm run check:release -- https://www.hanxingcapacitor.com https://www.hanxingcapacitor.com --output=.qa/seo-online-audit.json
```

候选环境可将第一个 URL 换为候选地址，第二个仍是正式 origin。只在正式模式验收使用该脚本；本地受保护预览的空 Sitemap 和 noindex 是正确行为。

## 官方依据

- [Google AI features](https://developers.google.com/search/docs/appearance/ai-features)：AI Search 的基础仍为可抓取、可索引、可理解的正文和一致 Schema，无需专用 AI 文件；llms.txt 不保证 Google 排名或 AI 引用。
- [Google Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)：只列规范且希望索引的 URL，lastmod 必须反映真实重要修订。
- [OpenAI Crawlers](https://developers.openai.com/api/docs/bots)：OAI-SearchBot 用于搜索；访问权限与 GPTBot 训练用途独立，还需检查基础设施访问。
- [Schema.org ProductGroup](https://schema.org/ProductGroup)：系列不等于直接销售的单一 SKU。
- [IndexNow](https://www.indexnow.org/documentation)：需要域名验证，200/202 仅为接收/验证状态。

JSON-LD 已在初始 HTML 和浏览器 DOM 验证语法与字段；没有冒充线上 Google Rich Results Test 通过，也没有提交 Search Console 或访问账户后台。
