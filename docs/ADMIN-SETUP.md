# 网站后台：本地使用与 Cloudflare 配置

2026-11-16 本地调整（尚未发布）：询盘管理独立显示全部历史记录，按提交时间、询盘 ID 倒序分页，导出使用相同范围与排序。访问概览和访客列表仍按日期查询；后台不再区分内部测试，旧标记不参与筛选，新记录不再根据登录、IP 或测试 Cookie 分类。

2026-11-16 更新：访问来源明细、WhatsApp/邮箱/微信点击位置和访客轨迹详情已合并发布至正式站，沿用 Cloudflare Access 邮箱验证码登录。正式库已完成 `0004_attribution_contact_details.sql` 迁移并核对数据保留，发布记录见 [cloudflare-release-20261116.md](cloudflare-release-20261116.md)。下方“本地更新”和旧日期段落保留为历史记录。

2026-11-15 本地更新：来源/自然搜索明细、WhatsApp/邮箱/微信点击位置和访客轨迹联动已完成。默认今日，支持按小时对比。此批尚未发布，正式发布前必须应用 `0004_attribution_contact_details.sql`；详见 [功能口径与迁移要求](ADMIN-ATTRIBUTION.md)。当前生产域名和 Access 授权以 `AGENTS.md` 为准，下方旧日期段落是历史部署记录。

2026-11-05 更新：当前内容已发布到正式地址 <https://www.hanxingcapacitor.com/>，沿用现有 Pages 项目、D1 和线上登录凭据。Turnstile 已加入根域名与 `www`，Pages 预览域名继续保持 `noindex`。线上页面与匿名接口保护已通过；当前自动化浏览器的验证码失败，真人提交入库仍需实际验收。正式构建命令和证据见 [正式域名发布记录](CLOUDFLARE-PRODUCTION-20261105.md)。

同日已发布公开抓取配置与图片 sitemap，robots.txt 对所有 User-Agent 允许抓取；后台认证保持不变。见 [SEO 文件与抓取验收记录](SEO-CRAWL-ACCESS-20261105.md)。

2026-10-30 更新：当前版本已发布到现有 Pages 项目 `hanxing-capacitor-preview` 的 `main` 分支，并配置专属 D1、独立线上凭据和真实 Turnstile。页面、登录、导出权限与退出已在线验证；真人验证码后的实际询盘入库仍待人工验收。详情见 [部署记录](CLOUDFLARE-DEPLOYMENT-20261030.md)。下文保留本地使用与后续部署说明。

## 本地打开

在 `D:\Hangxing\workspace` 运行：

```powershell
npm ci
npm run setup:admin
npm run dev:backend
# 在另一个终端运行：
npm run dev -- --port 4340
```

- 网站：`http://127.0.0.1:4340/`
- 中文后台：`http://127.0.0.1:4340/admin/`
- 本地登录信息：`.admin-local/access.txt`。不要提交或上传这个文件。
- 后端监听 `127.0.0.1:8796`，仅供本地开发；数据保存在 `.wrangler/state`。
- `setup:admin` 首次生成独立凭据，再次运行保留现有凭据并应用后续数据库迁移。
- 4340 使用当前网站布局，API 代理到 8796；不依赖其他项目的端口或数据。旧的 dev:admin 脚本使用 4342，本次直接使用上述两条命令。

本地数据正常显示，不再标记或隐藏内部测试。自动化验收使用独立临时 D1，不向现有本地客户库或远程数据库写入验收数据，也不发送邮件或 WhatsApp 消息。

## 已实现的内容

询盘表单提交到 Pages Functions，D1 事务同时保存询盘及一条服务端成功事件。只有事务成功才返回 `saved: true` 和 `HX-…` 编号。连接中断后的重试使用相同提交编号；同内容在 15 分钟内也会去重。

后台包含询盘管理、访问概览、访客轨迹三个入口。询盘可搜索、组合筛选、标记已读 / 未读、修改四种状态、追加跟进备注、导出 CSV。列表每页 25 条，CSV 单次最多 2,000 条，超限时提示缩小筛选范围；详情显示最近 200 条备注，CSV 包含所有备注。访客轨迹每次加载 100 条并支持继续加载。

本版不发送邮件通知、不接收附件，不含 AI 分析、聊天、评分或 Search Console 接入。直接邮箱与 WhatsApp 联系方式保留。网页表单入库就是后台收到询盘，不能由邮件点击或页面跳转代替。

## Cloudflare 资源

| 项目 | 配置要求 | 当前状态 |
| --- | --- | --- |
| Pages | 沿用 `hanxing-capacitor-preview`，部署目录 `.cloudflare-site`，连同仓库根目录的 `functions/` 编译 | `main` 已部署并在线验证 |
| D1 | 专属 `hanxing-site`，绑定名称为 `DB`；新增部署环境时需单独确认绑定 | 已创建并应用两项迁移；绑定到此预览项目的 production 环境 |
| 登录 | 正式站使用 Cloudflare Access 邮箱验证码；本地隔离测试继续使用邮箱 + 密码 | 2026-11-06 按用户确认切换，详见 `access-login-20261106/README.md` |
| Turnstile | 当前预览主机名使用真实 widget，表单 action 固定为 `inquiry` | 已配置；人工验证码后的入库仍待验收 |
| R2 / KV / SMTP | 当前文本询盘、备注和匿名行为均由 D1 保存 | 本版不需要 |

不能把其他业务的数据库绑定到本站。`wrangler.jsonc` 已写入专属远程 D1 的 UUID；`wrangler.backend.jsonc` 保留本地开发占位配置。

## 运行时环境变量

在 Pages 项目的 Settings / Variables and Secrets 中设置。`.dev.vars` 只用于本地开发，不会自动上传为 Pages secrets。敏感值不要放入 `PUBLIC_*` 变量、Git、前端源码或构建输出。

| 变量 | 用途与要求 |
| --- | --- |
| `APP_ENV` | 线上设为 `production`。本地为 `local`，且只有 loopback 主机名才允许本地验证流程 |
| `APP_SECRET` | 至少 32 字符的高强度随机密钥，用于匿名 ID 签名、表单证明和限流哈希；线上独立生成并设为 secret |
| `ADMIN_AUTH_MODE` | `password` 或 `access`，未配置时拒绝后台访问 |
| `ADMIN_EMAIL` | `password` 模式的管理员邮箱 |
| `ADMIN_PASSWORD_HASH` | `password` 模式使用的加盐 PBKDF2 哈希，设为 secret。运行 `npm run admin:password` 在本地生成；不要填明文密码 |
| `TURNSTILE_SITE_KEY` | 真实 widget 的公开 site key，登记实际预览 / 正式主机名 |
| `TURNSTILE_SECRET_KEY` | widget 对应的 secret。服务器校验 success、hostname、action，不接受前端自行声明通过 |
| `ALLOWED_ORIGINS` | 可留空，默认只接受请求自身的 origin；有明确跨 origin 需求时才填写逗号分隔的完整 origin，不支持 `*` |
| `INTERNAL_IPS` | 已停用；保留既有环境变量不会改变记录显示或统计 |
| `ACCESS_TEAM_DOMAIN` | `access` 模式：`your-team.cloudflareaccess.com` |
| `ACCESS_AUD` | `access` 模式：应用 Audience 标识 |
| `ACCESS_ALLOWED_EMAILS` | `access` 模式：逗号分隔的管理员邮箱白名单 |

密码模式的会话使用 HttpOnly cookie，HTTPS 下设置 Secure，SameSite=Strict，有效期 8 小时；数据库只保存会话 token 的哈希。管理写操作同时校验来源及 CSRF，CSV、详情、统计和轨迹接口都要求已登录。

如使用 Cloudflare Access，需要把 `/admin`、`/admin/*` 和 `/api/admin/*` 纳入同一个受保护应用，允许指定管理员邮箱。后端验证 JWT 的签名、issuer、audience、有效期及邮箱白名单，不只检查请求头是否存在。公开询盘和埋点接口不要套用后台登录策略。

部署前，在发布副本的本地 `wrangler.jsonc` 填写已获批准的 `ACCESS_ALLOWED_EMAILS`。公开仓库中的邮箱白名单是空模板，正式环境密钥由 Cloudflare 管理。本地开发使用 `npm run setup:admin` 生成的测试账号。

## 构建与发布步骤

本次已按用户的上传请求部署到现有预览项目的 `main` 分支。以下说明用于后续部署；复用当前数据库时不要重新创建。

1. 当前专属 D1 的 UUID 已写入 `wrangler.jsonc`。只有新增独立环境且需要新库时才创建 D1；保留 `DB` 和 `migrations_dir`，不要改为其他业务数据库。
2. 配置 Pages 的登录、密钥、Turnstile 与 D1 绑定，区分预览和正式环境。预览也不能使用本地 Turnstile 绕过。
3. 将 `migrations/` 中的全部迁移应用到选定远程 D1。
4. 构建并发布到用户确认的 Pages 分支，随后在该 URL 复验提交、后台、导出、去重和未登录访问。

```powershell
# 当前 hanxing-site 已存在，不要重复创建。
# 新建独立环境时，先创建专属 D1 并写入该环境的配置。
npx wrangler d1 migrations apply DB --remote --config wrangler.jsonc

npm run build:cloudflare
# <approved-branch> 必须替换为用户确认的分支
npx wrangler pages deploy .cloudflare-site --project-name hanxing-capacitor-preview --branch <approved-branch>
```

`build:cloudflare` 在独立临时目录构建，沿用当前选定的 Sunday 页面呈现，不影响运行中的本地站点；只生成静态页面与配置，不执行部署。Pages Functions 源码在 `functions/`，不能只把 HTML 目录当静态网站上传，否则没有真实后台。

Wrangler 发布会以 `wrangler.jsonc` 为非敏感配置的来源。`APP_ENV`、`ADMIN_AUTH_MODE`、`ADMIN_EMAIL` 和公开的 `TURNSTILE_SITE_KEY` 已放入其中；`APP_SECRET`、`ADMIN_PASSWORD_HASH` 和 `TURNSTILE_SECRET_KEY` 保留为 Cloudflare secrets，不能写入前端或仓库。

默认导出保持 `noindex` 和既有迁移重定向。正式域名发布须同时设置 `HANXING_PUBLIC_RELEASE=1` 与 `PUBLIC_SITE_URL=https://www.hanxingcapacitor.com`；该模式仅开放正式域名索引，Pages 预览域名继续保持 `noindex`。普通 `npm run build` 仍是 Node 基线构建，不能替代这个 Pages 后端发布流程。

密码首次上线时使用独立的线上凭据。若以后修改 `ADMIN_PASSWORD_HASH`，需同时撤销旧 `admin_sessions`，避免旧会话一直有效到过期。密钥与 D1 数据均应只向授权维护人员开放。

## 统计口径

访问概览和访客列表的日期统一为北京时间 UTC+8，默认今日，可切换昨日、最近 7 天、最近 30 天或自定义，单次范围最多 93 天。询盘管理不受该日期范围影响，始终查询全部历史；产品、来源、国家、语言、状态、未读和关键词仍可筛选，切换到询盘时不会带入访问统计的筛选。上一周期是紧邻当前范围、同样天数的日期范围。单日趋势按 0—24 小时展示：今日实线对比昨日虚线，昨日对比前日；未来小时留空。多日趋势按天。周期总 UV 按访客去重，不把每天 UV 相加。

| 指标 | 口径 |
| --- | --- |
| 访客数 | 筛选范围内有已记录操作的不同匿名访客 ID 数 |
| 访问次数 | 不同访问会话数，30 分钟无活动后重新建立会话 |
| 页面浏览量 | 唯一 `page_view` 事件数量；同一事件重传不加一，主动刷新页面是新浏览 |
| 回访访客 | 首次记录早于所选周期，或周期内有两个以上不同访问会话的访客 |
| 联系按钮点击 | 询价、WhatsApp、邮箱、微信四个事件类型的合计，不算收到询盘 |
| WhatsApp / 邮箱 / 微信点击数 | 三类联系入口的点击合计；可分入口查看页面、位置和访客轨迹；微信记录打开二维码 |
| 开始填写人数 | 聚焦表单字段后触发 `form_start`，按访客去重，不采集输入内容 |
| 成功询盘 | 服务器实际保存、且未标记为垃圾的询盘数量；客户端无权上报这个事件 |
| 询盘访客转化率（兼容接口） | 有有效询盘的去重访客 / 当前去重访客；同一访客多次询盘不会超过 100%；概览主卡已改为联系入口点击数 |
| 产品关注 | 对应产品详情页的 `product_view` 次数；带型号进入联系页不额外算产品查看 |

询盘的“国家”是客户提交的国家。访问概览的“国家”来自 Cloudflare 地理信息，无法获取时为“未知”；两者不混用。来源按会话入口的 source / medium 或 referrer hostname 识别，不能识别的直接访问与无来源访问合并为“直接 / 未识别”。UTM 是访问方提供的标签，不是第三方验证的来源证明。

来源和联系入口均可点击查看完整分页记录，再进入访客轨迹定位操作；自然搜索按搜索引擎展示，保存可获得的引荐域名、去掉查询参数后的路径、落地页及 UTM 媒介/活动。历史缺失字段保持未知。接口、统计边界及正式发布前的数据库迁移要求见 [ADMIN-ATTRIBUTION.md](ADMIN-ATTRIBUTION.md)。

每条行为保存事件 ID、操作时间、服务端接收时间、匿名访客 / 会话、页面路径、产品、语言、位置及有限的失败类型。延迟上报仍按操作时间排列；设备时间偏差明显时回退到接收时间。服务器生成的询盘成功时间始终为事务保存时间。

埋点只接受固定事件类型，字段白名单入库；不记录键盘输入、字段变化、未提交的文字、完整 referrer、搜索词、原始 IP 或完整 User-Agent。限流只保存带密钥的哈希。原始 IP 仅在验证请求时交给 Turnstile，不落入本站数据库。

## 记录范围、机器人与边界

- 不区分内部测试和普通访问。旧 `is_internal` 字段保留用于数据库兼容，历史标记不再排除数据；新记录统一写入 0，不依据管理员登录、出口 IP 或 `hx_internal` Cookie 分类。旧 `include_internal` 参数不影响结果，无需迁移或删除历史数据。
- 询盘列表与 CSV 都按 `created_at DESC,id DESC` 排列，25 条/页；翻页超出范围时返回最后一页。CSV 沿用 2000 条单次上限，超限明确提示按产品、来源、状态或关键词缩小范围，不静默截断。
- 根据 Cloudflare 可用的机器人信息及已知 User-Agent 排除机器人；不能保证识别所有伪装流量。
- 匿名 ID 保存 180 天，会话空闲 30 分钟结束；清除存储、隐私模式和换设备会产生不同访客。只在能够关联时连接询盘，不推断真实身份。
- 埋点重传保留同一个 ID，D1 主键去重。埋点请求失败会有限重试，且不影响浏览或询盘；未收到的行为不会伪造补数。
- 数据目前持续保留在 D1，没有自动清空任务。实际保留期限、数据导出备份和删除请求由业务负责人按需要执行；不要把本地测试数据库作为线上客户库。

## 复验命令与尚需线上验证的项目

```powershell
npm run check
npm run build
npm run test:backend
npm run build:cloudflare
npm run test:pages
```

`test:backend` 在 8797 创建隔离的本地 D1，完成后清理自己的测试状态；`test:pages` 在 8798 运行实际 Pages Functions 并使用另一套隔离 D1。它们不访问远程客户数据库，不依赖其他业务的 8788 端口。先运行 `setup:admin`，并在 Pages 测试前完成 Cloudflare 构建。

当前已核验线上 D1 绑定、真实 Turnstile 配置接口、HTTPS cookie、后台登录、CSV 权限与退出。真人验证码后的实际询盘提交、后台读取该记录和重复提交仍待人工参与验收；本地入库测试不能替代这项线上验证。如以后切换 Access，还需用真实有效和失效 JWT 各验一次。

Cloudflare 官方说明：[D1 本地开发](https://developers.cloudflare.com/d1/best-practices/local-development/)、[Pages 绑定](https://developers.cloudflare.com/pages/functions/bindings/)、[Pages 本地开发](https://developers.cloudflare.com/pages/functions/local-development/)、[Turnstile 服务端验证](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)、[Access JWT](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/application-token/)。
