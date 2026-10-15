# Video placement and delivery — 2026-09-24

- Added three short production-scene videos to /factory/: film-roll handling, winding equipment and the recorded test-area scene. The original video frames remain as posters and the captions limit each clip to what is visibly recorded.
- Added one supplied packing clip to /oem/, beside the packaging specification. Its caption states that one scene does not establish available options, approved artwork, carton quantity or shipment records.
- Published H.264 MP4 transcodes under public/videos/; original aspect ratios are preserved, audio is omitted, and playback is user-initiated with preload="none". Each output remains below Cloudflare Pages' 25 MiB per-asset limit.
- Exact source paths and transformations are recorded in REAL-MEDIA-SOURCES.json. Clips are not presented as model-specific product demonstrations.

# 统一产品目录封面 — 2026-09-24

- 首页系列栏、产品目录卡片和详情页底部的关联系列卡片使用四张统一 3:2 棚拍封面：`cbb60-main.webp`、`cbb61-main.webp`、`cbb65-main.webp`、`cd60-main.webp`。
- 点击封面进入详情后，图库继续使用 `public/images/real/` 对应的原始产品照片；没有替换或改写实拍素材。
- 以下 2026-09-23 的记录保留当时的图片审核背景；目录封面状态以本节为准。

# 实拍优先更新 — 2026-09-23

# 图片居中与细节补充 — 2026-09-23

- 通用内容图片、产品卡片、产品图库缩略图及图片主视窗统一以画面中心为默认焦点；首页横幅和文章中的标签/端子特写继续保留原有构图。
- CD60 图库原第二张与首图重复，改用素材目录中的 `CD60/DSC01169.JPG` 实拍；该图同步用于 CD60 连接细节和选型示例。
- 来源路径已写入 `REAL-MEDIA-SOURCES.json`。当前源码引用的 29 个图片文件均可在 `public/images` 中找到。
- 本轮没有新增 ImageGen 图片：当前图片位均有可用素材；制造、产品证据区继续采用来源明确的实拍，避免生成图被误读为实际生产或检验记录。

---

本轮选入 10 张原始产品照片、5 张新增生产视频截图。四个系列的首页/列表主图、产品详情主图全部使用实拍；详情增加缩略图切换、原图放大与 Esc 关闭。工厂页共展示 8 张真实生产/设备/检验区/包装画面，首页和关于页各展示 4 张。

- 来源逐项记录：REAL-MEDIA-SOURCES.json；照片位于 public/images/real。
- 原图文件未重绘、未改标签或外壳颜色。通过 CSS 调整图片窗口、焦点、主体大小与留白，页面保持中性灰白，让包装蓝色和引线红色自然出现。
- OEM 包装主图换为真实产品与纸盒照片；产品详情的包装区使用真实包装现场。
- 排除素材中的 jimeng AI 美化图、标有 PVC TAPES 的发货照片，以及标值与官网 CD60 范围不一致的样品照片。原文件保留，不擅自更改技术范围。
- 首页氛围主图和应用场景仍为已标注的生成图；产品与制造证据区已转为实拍。
- 核验：39 文件类型检查无错误/警告；构建通过。27 页 × 390/1440px 共 54 项布局检查无横向溢出；25 公开页中的 26 个图片地址及 41 个站内链接正常。相册切换、放大、Esc 关闭已通过浏览器操作验证。

---
以下保留上一轮补图记录。

# 全站图片与制造商呈现检查

日期：2026-09-23

## 本次增加

4 张 ImageGen 图片：端子特写、引线与安装孔特写、样品尺寸核对场景、包装方案。
3 张真实生产视频截图：设备、端盖连接操作、人工包装。
1 张原始 CBB65 产品照片：用于标签识读文章。

素材文件位于 public/images，逐一来源见 CONTENT_SOURCES.md。

## 页面处理

| 页面 | 检查结果与改动 |
| --- | --- |
| 首页 | 已有产品及应用图片，新增真实生产双图及制造页面入口 |
| 产品列表 | 已有四系列图片，保留简洁筛选和对比表 |
| 四个产品详情 | 增加连接/安装信息与包装图文区；按系列使用对应图片 |
| 应用列表及四个详情 | 已有场景和产品照片，保留现有图片，避免无关重复 |
| 工厂 | 新增三张有来源的生产截图及具体画面说明 |
| OEM | 新增生成包装方案和真实包装作业图 |
| 关于我们 | 新增生产设备及连接作业双图 |
| 资源列表 | 六篇文章增加对应主题缩略图 |
| 六篇资源文章 | 新增文章主图，标签文章使用原始产品照片 |
| 选型指南 | 增加样品尺寸核对大图和文章缩略图 |
| 联系 | 增加样品沟通场景与所需资料说明 |
| 询盘 | 侧栏增加参考图，表单保持优先 |
| FAQ、隐私、回执、404 | 保持文字/任务优先，不插入无信息量的装饰图片 |

## 真实性规则

真实生产画面由原视频提取，未用 ImageGen 重绘。生成图明确标注 AI-generated illustration，包装标明 concept，不冒充工厂、实际发货或检验记录。未增加无来源的产能、认证、客户、测试合格率或交期承诺。

## 生成方式和提示词

使用内置 ImageGen，不使用 CLI/API fallback。第一张原始 JPG 参考上传被工具拒绝，随后按已查看的产品形态生成新图；不宣称精确复刻型号。

### detail-terminals.png
Create one premium editorial macro photograph for a motor capacitor manufacturer website, landscape 3:2. Subject: oval brushed aluminum motor-run capacitor with crimped rim and exactly two black insulated terminal groups, each carrying two metal quick-connect tabs. Show tightly framed three-quarter top view of the rim, black insulators and metal tabs. Light warm gray tabletop, soft directional daylight, realistic fine metal texture and subtle handling marks, sharp focus on connectors, background softly out of focus. Minimal restrained industrial product photography, neutral palette, suitable for Atoms-inspired editorial website. No text, labels, logos, certification, diagrams or people. Illustrative detail photography, not a model drawing.

### sample-review.png
Premium industrial editorial photograph, landscape 3:2, a motor capacitor sample-review desk. One unbranded matte black cylindrical motor capacitor with two short blue and brown insulated leads lying horizontally on a light gray technical desk; a stainless steel vernier caliper lies beside it, not gripping anything, a pencil and a blank cream inspection card arranged quietly in background. Natural soft side daylight, realistic injection molded plastic seam, fine steel texture, subtle soft shadows. Composition focuses on physical size and sample review, clean but believable, no staged laboratory, no people, no certificate, no claims, no readable markings or numbers, no logos. Atoms-like premium minimal photography. Illustrative procurement scene, not evidence of a test result.

### packaging-concept.png
Premium industrial product packaging concept photograph for motor capacitor OEM website, wide landscape 3:2. Open small kraft corrugated carton with neatly divided cardboard cells containing three unbranded brushed aluminum cylindrical motor capacitors, tops with insulated spade terminals protected by cardboard clearance. One spare small closed plain individual white box beside it and a blank label artwork card on tabletop. Quiet light gray packing desk, soft directional daylight, realistic paper fibers, metal reflections, considered editorial composition and generous negative space. No people, no factory, no pallet mountain, no logo, no text, no certificate, no approved-test stamps. This is an illustrative packaging planning concept, not a real shipment photo. Restrained premium neutral Atoms-like art direction.

### detail-wire-leads.png
A premium editorial close-up product photograph, landscape 3:2, compact black rectangular motor fan capacitor with small mounting ear, two red insulated lead wires emerging from dark resin top, gently curving on a warm off-white work surface. Focus on wire entry, molded housing texture and mounting hole. Faithful plausible simple motor capacitor form, no terminals on this wire-lead variant. Soft broad daylight and gentle shadows, camera slightly above three-quarter angle, crisp material detail, generous negative space, understated industrial website art direction. No words, no numbers, no labels, no brand, no people, no certification, no explanatory graphic. This is an illustrative wire-lead configuration for buyer review, not a technical drawing.

## 验证记录

- Astro 类型检查：37 个文件，0 errors / 0 warnings / 0 hints。
- 生产构建通过。
- 25 个公开页面及询盘、回执共 27 页，在 390px、1440px 浏览器尺寸下完成 54 项布局检查，无文档级横向溢出。
- 27 页中的 18 个独立图片地址、36 个站内链接均正常；图片均有 alt 属性。
- 人工查看工厂桌面/手机、OEM 桌面、资源列表手机、标签文章手机以及产品详情平板截图。
- 询盘业务逻辑未改动；本次没有发送邮件或部署。

## Order and shipment evidence review — 2026-09-24

- Reviewed 10 still images and 24 video files in `D:\Hangxing\原始素材\发货素材5.6\` using full-resolution stills and sampled video frames.
- The assets show cartons, warehouse/loading areas and vehicles, but do not visibly identify a capacitor model, an order, a buyer, shipment documents or carrier handover. Their authenticity and transaction linkage cannot be established from the supplied files alone, so they were not used as proof of Hanxing shipment history.
- Added a buyer-side order and shipment checklist using the already documented packing-scene still from `原始素材\包装新\1.mp4`. Its caption explicitly limits it to one recorded packing activity and does not present it as an order or delivery record.
- No customer, destination, shipment volume, dispatch frequency, capacity, fixed lead time, delivery duration, warranty period or quality outcome was inferred or added as a company claim.

## Visual authenticity re-review and gallery update — 2026-09-24

- A full-resolution review of the supplied production/packing video frames, shipment photos and event/visit photos found strong synthetic/composite indicators: malformed in-scene lettering, repeated faces, inconsistent product/pack geometry and implausible equipment details. The local source folders alone cannot establish that these are documentary photographs.
- Replaced the factory, homepage, about, OEM and shipment-guide displays that relied on these uncertain scenes with a consistent set of five illustrative images. Galleries identify them as “Illustrative scene” and explicitly say they do not depict Hanxing staff, facility, testing, customer orders or completed exports. Original capacitor sample photos remain separately available on product pages.
- Added `/factory/packing-and-dispatch/` with buyer-side guidance on packout, document reconciliation, handover and what a verifiable export case requires. No customer story or shipping record was invented.
- Suspect source files remain in the user's original-material folders for source review. Their former generated website derivatives are no longer linked from page content; see `REAL-MEDIA-SOURCES.json` for source/transcode history and `IMAGEGEN-NOTES.md` for the new prompt set.

## Expanded review visuals — 2026-09-24

- Added five distinct illustrations for workshop teamwork, a blank-display test setup, warehouse staging, container handover and blank export-form review. Together with the first five, the site now has ten operational reference scenes at 1536×1024 WebP.
- Added image-led guidance to the factory review, OEM page, packing and dispatch guide, About page and shipment checklist. Product detail pages continue to lead with the original model photographs.
- The illustrated people are not Hanxing employees; pallets, cartons and documents do not depict actual orders or exports. The packing guide now lists four useful order-linked photo views and what records should match them.
- Gallery art direction uses a consistent 3:2 crop, pale sage double-bezel frame, diffuse shadow, staggered editorial widths on wide screens and one-column mobile collapse. The existing site navigation and core page structure remain intact.
- This section supersedes earlier gallery counts and placement notes in this file. Extracted source-video stills and transcodes are no longer referenced by current page components; product detail galleries continue to use original capacitor photographs.
