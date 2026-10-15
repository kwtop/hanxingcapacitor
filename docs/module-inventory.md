# 当前模块清单

日期：2026-10-12；项目：`D:/Hangxing/workspace`。此文按当前真实页面逐项登记：模块名、实际标题、核心内容、媒体、交互/CTA、源码。M编号每页重置；引用共享实现Sxx，页面→模板→源码总表见 [website-blueprint.md](website-blueprint.md)，模板/条件矩阵见 [page-templates.md](page-templates.md)。

**验证：**44页初始DOM均已读取；源码、数据、媒体路径另作追溯；主动交互/非默认状态仅按已读源码说明，除合法参数预填与一个指南1440/390重排实例外不声称实测。下面媒体“真实/原图/illustrative”的字样保留项目的路径与标注，不进行影像真实性鉴定。

## 全站共享外壳与复用组件

本节只登记一次共享实现。各页面的 M 编号仅用于正文业务模块。相同 CSS class 或相同按钮外观不构成独立共享组件；页面自己的询盘段落保留在其真实模块位置。

| ID | 共享实现/模式 | 实际内容与行为 | 接入与条件 | 源码 |
|---|---|---|---|---|
| S01 | BaseLayout | English HTML；Inter Variable；title 后加 Hanxing Capacitor；description/canonical/OG/favicon；head 插槽；Skip to content → #main；Header → main slot → Footer | 全部 33 个 Astro 页；noindex props 或 previewOnly 时输出 noindex,follow。public HTML 不使用此壳 | src/layouts/BaseLayout.astro:1–43；src/lib/publicSite.ts:1–13 |
| S02 | Header | HAN XING logo → /；5 个一级菜单及其 children；Contact → /contact/；当前页与当前分区状态；首页 home-header；scrollY>24 添加 is-scrolled | 所有 S01 页。desktop 下拉 pointerenter/leave、ArrowDown、Escape、focusout、外部点击；这些处理函数已读，未逐项点击验证 | src/components/Header.astro:1–62；src/data/site.ts:164–170 |
| S03 | MobileNav | Open/Close menu；每个一级分组 native details；二级链接；当前分组展开、aria-current | Header client:load；<=800px 移动导航、>=801px 收起；失焦只关闭；Escape 关闭并将焦点还给开关 | src/components/MobileNav.tsx:1–25；src/components/Header.astro:12–13 |
| S04 | Footer | 品牌及 Company & supplier records；Products & applications 6 链接；Buying & technical support 7 链接；公司 email/WhatsApp/name/address；当年 copyright；Privacy policy | 所有 S01 页。两组 details 桌面 open/禁止summary点击，<=800px closed/允许展开，监听断点；copyright 是运行日期年份 | src/components/Footer.astro:1–27；src/data/site.ts:1–9,39–113 |
| S05 | Breadcrumb 内联模式 | Home / section / current 等路径文字与上级链接 | 不是独立 Breadcrumb.astro。当前各页、ProductReference、HvacReference、ApplicationReference 和 packing 页面内分别写 p/nav；首页、404、thank-you、typography 无此模式。页面 M01 只引用此角色 | src/pages/*.astro；src/pages/products/index.astro:7；src/pages/resources/[slug].astro:18；src/components/ProductReference.astro:29；src/components/HvacReference.astro:20；src/components/ApplicationReference.astro:15；src/pages/factory/packing-and-dispatch.astro:16 |
| S06 | CTA 表现模式 | button/card-link/pdr-button/hvr-button 等链接样式；Header 的 Contact 为共享动作；正文 Prepare RFQ、请求资料等实际 label/href 由页面/数据决定 | 不存在 CTA.astro 或公共 CTA 内容函数。只有外观复用；不把同 class 当成同一内容模块。每页特有询盘模块仍按实际源码记录 | src/components/Header.astro:11；src/components/ProductReference.astro:63；src/pages/index.astro:39–41；各页对应 CTA 行 |
| S07 | PhotoDetail | lazy/async 图片包在新标签原图链接；complete/focus/zoom props；/images/illustrative/ 增加 Illustration · not an actual order or shipment record. | 7 篇指南图例共 16 个实例；当前传 complete=true；guideExamples 的 focus/zoom 字段未传给组件 | src/components/PhotoDetail.astro:1–7；src/pages/resources/[slug].astro:21 |
| S08 | VideoFigure | video/source/poster；Play footage 覆盖按钮；点击启用 controls 并 play；失败恢复按钮；noscript Open footage；默认16:9，可选9:16 | /factory/ 3 个实例；packing 1 个9:16实例。源码无 autoplay/loop；本次确认 DOM src/poster，未播放视频 | src/components/VideoFigure.astro:1–56；src/pages/factory.astro:41,46,51；src/pages/factory/packing-and-dispatch.astro:18 |
| S09 | 产品图库交互 | 初始主图+前4缩略图+All photos；关闭的 dialog；grid/photo 两种内容、原图出口、前后循环、左右键、body scroll 锁；data-product-photo 与图库定位联动 | ProductReferenceGallery 实际由全部4产品详情复用。条件弹层不是初始可见的页面独立模块 | src/components/ProductReferenceGallery.tsx:1–59；src/components/ProductReference.astro:2,37,48–54 |
| S10 | 独立设计预览外壳 | public 下9个设计页自带 HAN XING Header、页内锚点导航、简短 Footer | 两组重复 HTML/CSS 实现，未引用 S01–S04：第一组 Products/Selection/Inquiry + Contact us；r2组 Products/Manufacturing/Contact + Get in touch。所有目标留在各自文档的锚点 | public/home-directions-20261010/{a,b,c,d,e}.html；public/home-directions-20261010/r2/{object,studio,editorial,red-object}.html |
| S11 | 风格对比工具栏 | Oil UI Pro 链接、项目名称、并排/单张、桌面1280/手机390；由脚本显示 | 两个 public style-explorer.html，工具页独立外壳；不使用正式站 Header/Footer。工具栏不在两个工具页重复记为业务 M 模块 | public/home-directions-20261010/style-explorer.html:102–108；r2/style-explorer.html:102–108 |

S01 的样式加载顺序为 src/styles/legacy.css → src/styles/system.css → src/styles/homepage.css → site-src/styles/editorial.css → src/styles/site-upgrade.css → src/styles/finesse-redesign.css → src/styles/site-porcelain.css。首页另引入 src/styles/home-porcelain.css；其余页面的产品/应用/包装局部样式来自对应页面或组件的 import。该顺序只用于解释当前可见模块的最终布局，不表示每个旧 CSS 规则都生效。

publicSiteReady 要求 build/runtime 的 PUBLIC_SITE_URL 都存在、同源且与 Astro.site 相同、https、build pathname=/、不是本机主机；本轮没有读取部署环境，不能确认生产索引条件成立。package/astro 配置为 server output、node standalone、React integration、trailingSlash=always；产品/应用/指南三组详情明确 prerender=true。

## src/components 完整接入清单

按当前所有 src/pages → import 依赖链核对，24 个组件文件中 15 个接入页面，9 个未接入。类型 import 仅用于追溯数据类型，不意味着该数据被渲染。

| 组件 | 接入位置/模块 | 状态与源码 |
|---|---|---|
| src/components/Header.astro | 全33 Astro页 S02 | 接入；src/layouts/BaseLayout.astro:10,38 |
| src/components/Footer.astro | 全33 Astro页 S04 | 接入；src/layouts/BaseLayout.astro:11,40 |
| src/components/MobileNav.tsx | S02 → S03 | 接入；src/components/Header.astro:3,12 |
| src/components/ProductRail.tsx | 首页 M02 | 接入；src/pages/index.astro:3,21；无 client 指令，只SSR，不是JS轮播 |
| src/components/ProductFilter.tsx | /products/ M02 | 接入；src/pages/products/index.astro:3,8；client:load |
| src/components/SamplePhotoLibrary.tsx | /products/photographs/ M02 | 接入；src/pages/products/photographs.astro:3,7；client:load；6系列过滤、96照片 |
| src/components/ProductReference.astro | 4产品详情 M01–M09 | 接入；src/pages/products/[slug].astro:2,18 |
| src/components/ProductReferenceGallery.tsx | ProductReference M01/S09，机械样本按钮联动 | 接入；src/components/ProductReference.astro:6,37；client:load |
| src/components/ApplicationCard.astro | /applications/ M02 | 接入；src/pages/applications/index.astro:3,8 |
| src/components/HvacReference.astro | HVAC M01–M03 | 接入；src/pages/applications/[slug].astro:3,11；仅 HVAC 分支 |
| src/components/ApplicationReference.astro | 其余3应用 M01–M03 | 接入；applications/[slug].astro:4,11 |
| src/components/PhotoDetail.astro | 7指南 M02/S07 | 接入；resources/[slug].astro:2,21 |
| src/components/SelectionAssistant.tsx | /buying-guide/ M04 的 details 内 compact 分支 | 接入；src/pages/buying-guide.astro:3,48；client:load。field-guide 分支未由页面调用 |
| src/components/ThankYouStatus.tsx | /thank-you/ M02 | 接入；src/pages/thank-you.astro:3,5；client:only=react |
| src/components/VideoFigure.astro | factory M02、packing M01/S08 | 接入；src/pages/factory.astro:2；src/pages/factory/packing-and-dispatch.astro:3 |
| src/components/GuideThumbnail.astro | 无页面调用；仅此文件导入 guideCovers | 未接入；不能记为资源目录的缩略图 |
| src/components/IllustrativeGallery.astro | 仅被未接入的 ManufacturingGallery 引用 | 未接入页面；heading/scenes/compact 的组件库存 |
| src/components/ManufacturingGallery.astro | 无页面调用 | 未接入；固定传场景数据给 IllustrativeGallery，不是当前 factory 页 |
| src/components/MediaFigure.astro | 无页面调用 | 未接入；caption prop 有定义但实现不输出 caption |
| src/components/ProductCard.astro | 无页面调用 | 未接入；目录实际使用 ProductFilter |
| src/components/QuoteForm.tsx | 无页面调用；组件内有 POST /api/inquiries/ | 未接入；不是当前 contact 表单。多规格/文件上传/跳thank-you属于库存逻辑 |
| src/components/RealProductGallery.tsx | 无页面调用 | 未接入；详情实际使用 ProductReferenceGallery |
| src/components/SampleConfigurations.astro | 无页面调用 | 未接入组件；sampleConfigurations 数据由 ProductReference 直接消费 |
| src/components/TypographyPreview.tsx | 无页面调用 | 未接入；/typography-preview/ 是静态 Astro 字体样张 |

没有独立 Case、Customer、Certificate、Download 页面组件被当前路由调用。此句只说明当前项目路由/组件链，不对外部原站内容作判断。

## Astro静态正文页面

### `/` · T-ST-HOME

共享外壳：BaseLayout；无页面 Breadcrumb。固定顺序 `M01 → M02 → M03 → M04 → M05`。

| ID | 模块名称与实际标题 | 核心内容/媒体 | 交互与 CTA | 源码与条件 |
|---|---|---|---|---|
| M01 | 首页 Hero；H1 `Capacitor supply for equipment manufacturers.` | 说明 `Motor run and start capacitors for pumps, fans, HVAC and appliance motors.`；Hero 图 `/images/illustrative/home-porcelain-family.webp`，alt 明确为基于四系列样本照片的 illustrative studio arrangement；标识 `CBB60 / CBB61 / CBB65 / CD60`；来源文字 `Illustrative product visual · CBB65 samples · original photograph` | `Find your capacitor` → `/products/`；`CBB65 samples · original photograph` → `/images/real/batch-products.jpg`；`View sample photographs` → `/products/photographs/`；`See production videos` → `/factory/` | `src/pages/index.astro:9–20`；静态模块，无条件隐藏；Hero 图片高优先级 |
| M02 | 系列产品轨道；H2 `Find your capacitor` | 按 `products` 数据顺序 CBB60、CBB61、CBB65、CD60；每卡显示原图、代码、shortName、µF/VAC；CBB65 单路参数固定为 `2–100 µF (single)` 和 `110–450 VAC (single)`，另显示 `Other format / Dual-run: see details` | 每张图片及代码都是详情页链接；无 ProductRail 自身 JS 状态或轮播按钮 | 页面 `src/pages/index.astro:21` → `src/components/ProductRail.tsx:3–19` → `src/data/site.ts:39–113`；CBB65 特有行条件 `p.code === 'CBB65'` 在组件 15 行；产品图片 lazy |
| M03 | 生产与样本；H2 `Products & production` | Intro `Explore our production equipment and capacitor samples.`；第一图 `/images/real/film-rolls.jpg`：source `Production video still`、H3 `Film handling equipment`、说明 `A still from the supplied production footage.`；第二图 `/images/illustrative/home-production-capacitor-studio-v3.webp`：source `Illustrative product visual`、H3 `Capacitor samples`、说明 `Review original photographs for the model you need.` | `View manufacturing & quality` → `/factory/`；`View sample photographs` → `/products/photographs/`；这里是两张图片，不是嵌入视频播放器 | `src/pages/index.astro:22–29`；两图 lazy；无条件模块 |
| M04 | 应用选择；H2 `Choose by application`；H3 `Before you choose` | Intro `Compare capacitor series for your equipment.`；4 个应用卡依次 HVAC & refrigeration（CBB65 / CD60）、Pumps & water systems（CBB60 / CD60）、Fans & ventilation（CBB61 / CBB60）、Appliances & small motors（CBB60 / CBB61）；使用 `applications` 中对应 illustrative 图；末尾 `Application illustrations. Select the capacitor against the original motor specification.` | 各应用卡 → `applicationHref(app)` 对应 4 个 `/applications/{slug}/`；`Read the capacitor label` → `/resources/read-motor-capacitor-label/`；`Check dimensions & connections` → `/resources/dimensions-terminals-mounting/` | `src/pages/index.astro:30–38`；数据 `src/data/site.ts:131–160`；4 卡 `map`；图片 lazy；`#application-selection` |
| M05 | 首页询盘引导；H2 `Send us the capacitor specification.` | `Include a photo of the original label or a drawing. Add the quantity and destination so we can review your request.`；无图片、无表单 | `Prepare an inquiry` → `/contact/` | `src/pages/index.astro:39–41`；无条件 |

M02 当前实际数据（源码已验证）：

| 系列/shortName | 电容/额定电压（页面输出） | 图片 | 详情 URL | 数据源 |
|---|---|---|---|---|
| CBB60 / Motor run | 2–100 µF / 110–450 VAC | `/images/real/cbb60-hanxing-wired.jpg` | `/products/cbb60-motor-run-capacitor/` | `src/data/site.ts:41–56` |
| CBB61 / Fan run | 0.5–35 µF / 110–450 VAC | `/images/real/cbb61-13.jpg` | `/products/cbb61-fan-capacitor/` | `src/data/site.ts:59–74` |
| CBB65 / HVAC run | 2–100 µF (single) / 110–450 VAC (single)；Dual-run: see details | `/images/real/cbb65-2.jpg` | `/products/cbb65-air-conditioner-capacitor/` | `src/data/site.ts:77–93`；显示值被 `src/components/ProductRail.tsx:15` 限定为 single |
| CD60 / Motor start | 20–1500 µF / 110–330 VAC | `/images/real/cd60-25.jpg` | `/products/cd60-start-capacitor/` | `src/data/site.ts:96–111` |

### `/about/` · T-ST-ABOUT

共享外壳：BaseLayout；Breadcrumb `Home / About`。正文顺序如下，其中 M02 与 M03 位于同一个 `company-intro` section 内，源码先 story 后 profile。

| ID | 模块名称与实际标题 | 核心内容/媒体 | 交互与 CTA | 源码与条件 |
|---|---|---|---|---|
| M01 | 页面标题；H1 `About HAN XING` | 无主视觉 | `Supplier records` → `#supplier-records`；`Contact the business` → `/contact/` | `src/pages/about.astro:6` |
| M02 | 公司业务简介；H2 `Motor capacitor supply` | `/images/real/batch-products.jpg` 原样本图；文本说明供应 CBB60/CBB61/CBB65 run 和 CD60 start，面向 pumps、fans、refrigeration、指定 single-phase motors | `Explore the capacitor series` → `/products/` | `src/pages/about.astro:7–8`；图 lazy |
| M03 | 公司身份；H2 `Company information` | DL：English business name = `Hanxing Electronic Technology Co., Ltd.`；Brand = `Hanxing Capacitor / HAN XING`；Address = `Jiegu Village, Jiegu Township, Pingxiang County, Xingtai, Hebei, China`；Company email = `ManuelaMusio570@gmail.com`；WhatsApp = `+86 153 3339 4111` | email → `mailto:ManuelaMusio570@gmail.com`；WhatsApp → `https://wa.me/8615333394111`（新标签） | `src/pages/about.astro:9` → `src/data/site.ts:2,4,5,7,8` |
| M04 | 供应商记录；H2 `Supplier records`；H3 `Business and manufacturing relationship` | 说明业务英文名与 Xingtai 地址来自原站，业务名/品牌/法律卖方/生产场地关系在本站未确认，报价/合同需确认法律卖方和制造者；不能由该段推断自有工厂 | `Business information on the original site` → `https://www.hanxingcapacitor.com/privacy-policy/`（新标签）；`Model and quality records` → `/factory/#model-records`；`OEM terms and approval` → `/oem/` | `src/pages/about.astro:11`；`#supplier-records`；外部引用仅确认链接存在，未再次核验外站内容 |

### `/contact/` · T-ST-CONTACT

共享外壳：BaseLayout；Breadcrumb `Home / Contact`。这是 **当前已接入路由的原生草稿表单**，不是 `src/components/QuoteForm.tsx`。模块 M02/M03 同在 `.contact-form-layout` 内，DOM 顺序先公司联系后 form。

| ID | 模块名称与实际标题 | 核心内容/媒体 | 交互与 CTA | 源码与条件 |
|---|---|---|---|---|
| M01 | 标题与上下文；H1 `Discuss your motor capacitor requirements` | `#contact-context` 起始 hidden，没有固定二级标题；根据有效参数显示 Sample reference / Photo reference / Series / Application / Guide / Request，连接成 ` · ` | 无 CTA；参数预填详见下表 | `src/pages/contact.astro:12,38–56`；有效 contextParts 非空才显示 |
| M02 | 公司直接联系；实际小标题 `Hanxing company contact` | 公司名、地址、email、WhatsApp；没有图片或附件上传 | email/WhatsApp 初始为公司联系链接；JS 将其更新为带上下文和空白规格提示的 mailto/wa.me 草稿 | `src/pages/contact.astro:14,57–60` → `src/data/site.ts:2,4,5,7,8` |
| M03 | 消息草稿表单；无 H2；form aria-label 在 section 为 `Product inquiry form` | 提示 `The form creates a message draft. Review it, then press Send in your email or WhatsApp app.`；先渠道选择，再 Name*、Email* 或 WhatsApp*、Product type*、I would like to discuss、Quantity by model、Destination market、Requirements*；最后 Company 可选与 MOQ 提示；无文件 input。标准 MOQ 文本 `1,000 pieces` 为此页硬编码，不是 STANDARD_MOQ_PCS 插值 | 默认 Email；切换 WhatsApp 隐藏/禁用 email 并将 phone 设 required；submit 按钮 `Prepare email draft` / `Prepare WhatsApp draft`；浏览器校验与字段 trim 校验；只有 `event.preventDefault()` + 字符串生成，无 fetch/POST。输入或 change 隐藏旧结果 | `src/pages/contact.astro:15–30,61–73`；`#inquiry-form`；WhatsApp 去除非数字后需至少 7 位；Name、Requirements 非空；form.reportValidity() |
| M04 | 草稿结果（可选状态） | `#draft-result` 默认 hidden；成功准备显示状态 `Your draft is ready. Open it and attach any files before pressing Send in your app. The website has not sent or submitted your message.`；details `Review the message` 中只读 textarea；copy-status aria-live | `Open email draft` → `mailto:ManuelaMusio570@gmail.com?subject=...&body=...` 或 `Open WhatsApp draft` → `https://wa.me/8615333394111?text=...`；`Copy message` 写 clipboard，失败展开 details、聚焦并选择文本；不自动外发、不跳转 thank-you | `src/pages/contact.astro:31,69–74`；表单校验通过后才显示；email 不开新标签，WhatsApp 新标签；JS 不可用时 32 行 noscript 提示走直接联系链接 |

M03 的选项与上下文：

| 项目 | 精确实现 |
|---|---|
| 产品选项 | Select a product；CBB60 · Motor run；CBB61 · Fan run；CBB65 · HVAC run；CD60 · Motor start；OEM / private label；Not sure yet；Other motor capacitor（`src/pages/contact.astro:22`） |
| Request 选项 | A quotation；Model documents；Sample terms；OEM / private label；Packing and delivery；An existing order（values quote/documents/samples/oem/packing/after-sales；23、47 行） |
| `series` | 只接受 CBB60/CBB61/CBB65/CD60，自动选相应产品（39、52 行） |
| `configuration` | 来自 `sampleConfigurations` ID 字典，且该样本 series 必须等于有效 series；配置文本 = `name — rating; connection`，显示上下文并预填 Requirements（1–5、40–41、55 行） |
| `photo` | 来自 `src/data/sampleLibrary.json` ID 字典；匹配有效 series，或 URL 完全未带 series 且该图为 `Additional samples`；显示 `id · label` 并预填 Requirements（3–4、42–43、56 行） |
| `application` | hvac/hvac-refrigeration → HVAC and refrigeration；pump/pumps-water-systems → Pumps and water systems；fan/fans-ventilation → Fans and ventilation；appliances-small-motors → Appliances and small motors；other → Other single-phase motor（44–45 行） |
| `guide` | 只接受 `guides` 中存在的 slug，显示该真实 guide.title（6–7、46 行） |
| `request` | 只接受上列 6 value，否则 quote；request=oem 且 series 无效时将产品设 OEM / private label（47–54 行） |
| 上下文优先级 | Requirements 优先 configuration，其次 photo；无这两者不自动填 Requirement。ContextParts 保留所有有效上下文；正式草稿加入 photo/application/guide 等，但 configuration 通过 Requirements 文本进入草稿（49、55–56、70 行） |
| 无 JS | 原生表单没有 action 属性，草稿逻辑不可用；实际 noscript 指示使用上方 email/WhatsApp 联系链接手动发送（32 行）。未测试禁用 JS 提交行为 |

### `/buying-guide/` · T-ST-RFQ

共享外壳：BaseLayout；Breadcrumb `Home / Resources / RFQ Checklist`。

| ID | 模块名称与实际标题 | 核心内容/媒体 | 交互与 CTA | 源码与条件 |
|---|---|---|---|---|
| M01 | RFQ Hero；H1 `Prepare a capacitor RFQ` | `Copy the checklist and add the original rating, dimensions and quantity you need.`；原图 `/images/real/cbb65-dual-run-7.jpg`，caption `Original sample reference` | `Use the RFQ template` → `#rfq-template` | `src/pages/buying-guide.astro:19–31`；图高优先级 |
| M02 | 可复制询盘清单；H2 `Capacitor RFQ template`；H3 `Prepare your inquiry` | 9 行预格式文本：Equipment / motor model；Original capacitor model；Circuit function: run / start / dual-run / unknown；Original rating: ___ µF · ___ VAC；Tolerance / frequency / duty markings；Body, mounting and installed dimensions；Lead or terminal arrangement；Quantity and destination market；Documents required。说明发送时附 label photo/drawing；右侧说明从自己的 app 发送草稿 | `Copy checklist` → clipboard；失败选中 pre 内容并提示；`Prepare inquiry` → `/contact/#inquiry-form` | `src/pages/buying-guide.astro:5–15,33–39,51–58`；`#rfq-template`；copy status aria-live |
| M03 | 清单字段说明；H2 `Complete the checklist` | 三行 H3 依次 `Motor, circuit and electrical values`（马达/电路/run-start/µF/VAC/tolerance/frequency/duty、dual 双值）、`Dimensions and connections`（机身、安装全尺寸、引线/端子）、`Quantity and model approval`（数量/预测、市场、标签/文件、样品/图纸/datasheet/证书范围需确认） | `Read a label` → `/resources/read-motor-capacitor-label/`；`Identify run or start duty` → `/resources/start-vs-run-capacitors/`；`Measure the installed part` → `/resources/dimensions-terminals-mounting/` | `src/pages/buying-guide.astro:41–47`；标题锚点 `rfq-label-title`、`rfq-fit-title`、`rfq-order-title` |
| M04 | 折叠应用选型助手；summary `Not sure which series to discuss?`；助手 H3 `Which equipment needs the capacitor?` | `SelectionAssistant client:load variant="compact"`；默认 HVAC，4 个设备按钮和对应说明/series。compact **没有助手样本照片**。助手完整分支见组件登记 | 原生 details 展开/折叠；选设备切换 result；系列链接 → 产品详情或 contact；`Contact about this application` → `/contact/?application={choice}`；`Browse all applications` → `/applications/` | 页面 `src/pages/buying-guide.astro:48` → `src/components/SelectionAssistant.tsx:14–32`；M04 嵌在 M03 所在 section 的后方，details 默认闭合；图片只存在 field-guide 分支，当前路由没有引用该分支 |

### `/factory/` · T-ST-FACTORY

共享外壳：BaseLayout；Breadcrumb `Home / OEM & Quality / Manufacturing`。

| ID | 模块名称与实际标题 | 核心内容/媒体 | 交互与 CTA | 源码与条件 |
|---|---|---|---|---|
| M01 | 工厂信息 Hero；H1 `Manufacturing and quality` | `See the equipment and process in operation.`；边界：视频展示设备/活动，不验证工厂所有权或报价模型测试结果 | `Request model documents` → `/contact/?request=documents#inquiry-form`；`Company and supplier records` → `/about/#supplier-records` | `src/pages/factory.astro:17–32`；CTA 常量 5–6 行 |
| M02 | 生产视频；H2 `Inside production` | Intro `Original videos supplied with the factory materials.`；3 article：H3 `Production equipment`（设备及操作面板）→ winding 视频/poster；`Testing area`（工人与设备）→ test-area 视频/poster；`Film handling`（膜卷过设备）→ film-roll 视频/poster | 每个 `VideoFigure` 覆盖按钮 `Play footage`；开启 native controls，尝试 video.play，失败恢复按钮；noscript `Open footage` | `src/pages/factory.astro:35–57` → `src/components/VideoFigure.astro:12–35`；视频映射见媒体表；preload none、不自动播放 |
| M03 | 模型记录清单；H2 `Documents for your model` | Intro `Use this checklist to request the records your order needs.`；表头 Document category / Published here / To confirm for your model；5 类：Product samples、Datasheets and drawings、Test and inspection records、Certificates、Marking and packing；状态明确当前未发布 model matrix/test report/certificates，label/packing 需报价确认 | 无表单/下载 CTA；表格本身无排序或筛选 | `src/pages/factory.astro:7–13,59–74`；`#model-records`；records.map |
| M04 | 来源工序概述；H2 `From material to finished product` | H3 `Material and process`：incoming inspection、winding、metal spraying、heat setting/rolling、oil injection/sealing；`Electrical and product testing`：电容/成品测试需 model dated results；`Packing and warehouse handling`：packing/warehouse、label/inner pack/carton marks | `Published factory description` → `https://www.hanxingcapacitor.com/factory/`（新标签）；只确认当前源码该引用与原文概述存在，未核外站事实 | `src/pages/factory.astro:76–87` |
| M05 | 模型文件请求；H2 `Request model records` | 要求给 model、destination market、所需 records | `Request model documents` → `/contact/?request=documents#inquiry-form` | `src/pages/factory.astro:89–94` |

M03 records 完整数据（`src/pages/factory.astro:8–12`）：

| 类别 | Published here | To confirm for your model |
|---|---|---|
| Product samples | Photos show sample configurations and markings. They do not establish approved dimensions or stock availability. | Use the photos to identify the configuration you want to discuss. |
| Datasheets and drawings | An approved model matrix is not published on this site. | Ask for the proposed model’s current datasheet and dimensioned drawing, including the revision or date. |
| Test and inspection records | Model-specific reports are not published on this site. | Request the test method, acceptance limits and dated results. Include sample approval and batch identification if your order requires them. |
| Certificates | Model-specific certificates are not published on this site. | Check the issuer, certificate number and covered models, along with the destination scope and expiry. |
| Marking and packing | To be agreed with the quotation for your model and order. | Approve the label and packaging artwork against the quoted order. |

### `/factory/packing-and-dispatch/` · T-ST-PACKING

共享外壳：BaseLayout；Breadcrumb 是 `nav.packing-breadcrumb`，文字 `Home / OEM & Quality / Packing & Dispatch`，不是根据真实 URL 字面自动计算。

| ID | 模块名称与实际标题 | 核心内容/媒体 | 交互与 CTA | 源码与条件 |
|---|---|---|---|---|
| M01 | 包装 Hero 与视频；H1 `Packing and dispatch for your order` | lead `Agree protection and package counts before pickup. Match the packing and shipping records to your order.`；竖向 VideoFigure `/videos/packing-scene.mp4`，poster `/images/real/packing-scene.jpg`，label 明确 worktable 小产品盒处理 | `Watch packing footage` 按钮启用 controls、隐藏 overlay、滚到视频、聚焦并播放；reduced-motion 时 instant，否则 smooth；播放失败显示 `Use the video controls to play the footage.`；`Open the order checklist` → `/resources/motor-capacitor-order-shipment-checklist/`；VideoFigure 自身也有 `Play footage` | `src/pages/factory/packing-and-dispatch.astro:15–19,26–40` → `src/components/VideoFigure.astro`；`#packing-clip`；ratio=9/16；状态 aria-live role=status |
| M02 | 包装协定；H2 `Agree the packing` | H3 `Product & label`：型号/标签/图纸/端子线；H3 `Inner protection`：保护/隔板/内包装数量。说明素材只显示小盒处理，应另行同意订单配置 | 无 CTA | `src/pages/factory/packing-and-dispatch.astro:20` |
| M03 | 发运记录；H2 `Check shipping records` | 2 列 Record type / Points to check；4 行 `Invoice & packing list`（型号、数量、package count、shipping marks）、`Transport record`（B/L、AWB 或 courier 与方式/收货方）、`Conditional documents`（按需求 origin/inspection/compliance）、`Inspection & sample records`（订单/型号引用） | 无表格交互 | `src/pages/factory/packing-and-dispatch.astro:6–11,21`；records.map |
| M04 | 承运交接；H2 `Record carrier handover` | 原图 `/images/real/dispatch-pallets.jpg`；caption `Supplied dispatch-area photograph. It does not establish a specific order or destination.`；H3 `Cartons & pallets`（shipping marks、计数与packinglist）和 `Carrier handover`（pickup/date/count/transport record；照片不证明到达） | 无 CTA | `src/pages/factory/packing-and-dispatch.astro:22`；图片 lazy |
| M05 | 包装询盘与参考；H2 `Discuss your packing requirements`；aside H3 `Export document references` | 说明共享型号、数量、目的地、包装需求；参考 International Trade Administration（common export documents）、ICC Incoterms guidance（delivery term/named place）；末尾提醒公开材料遮去客户名称/地址/价格/追踪信息 | `Prepare a packing inquiry` → `/contact/?request=packing#inquiry-form`；`International Trade Administration` → `https://www.trade.gov/common-export-documents`；`ICC Incoterms guidance` → `https://library.iccwbo.org/clp/clp-incoterms-qa-2020.htm?AGENT=ICC_HQ`（两者新标签） | `src/pages/factory/packing-and-dispatch.astro:23`；引用外站未经本稿重新核验 |

### `/oem-quality/` · T-ST-CAPABILITY-HUB

共享外壳：BaseLayout；Breadcrumb `Home / OEM & Quality`。

| ID | 模块名称与实际标题 | 核心内容/媒体 | 交互与 CTA | 源码与条件 |
|---|---|---|---|---|
| M01 | 能力索引标题；H1 `OEM and quality` | 无主视觉 | 无独立 CTA | `src/pages/oem-quality.astro:6` |
| M02 | 生产质量入口；H2 `Manufacturing & quality` | `/images/real/inspection-station.jpg`；说明膜处理/设备/测试区视频，model drawing/test records 按拟订模型请求 | `View production footage` → `/factory/` | `src/pages/oem-quality.astro:8–9`；图片 lazy |
| M03 | OEM 与包装入口；H2 `OEM & private label`；H2 `Packing & dispatch` | OEM：rating/case/connection/label/packaging/approval sample；packing：protection/carton marks/shipping records 与订单匹配 | `Plan an OEM configuration` → `/oem/`；`Review packing and dispatch` → `/factory/packing-and-dispatch/` | `src/pages/oem-quality.astro:10–11`；两个 article，顺序 OEM 后 packing |
| M04 | 订单清单入口；无 H2 | 只有 contextual link | `Use the order and shipment checklist` → `/resources/motor-capacitor-order-shipment-checklist/` | `src/pages/oem-quality.astro:13` |

### `/oem/` · T-ST-OEM

共享外壳：BaseLayout；Breadcrumb `Home / OEM & Quality / OEM`。

| ID | 模块名称与实际标题 | 核心内容/媒体 | 交互与 CTA | 源码与条件 |
|---|---|---|---|---|
| M01 | OEM Hero；H1 `OEM motor capacitors` | `Standard MOQ: 1,000 pieces. The offer should state the minimum for your model, label and packing.`；MOQ 数据来自 `STANDARD_MOQ_PCS.toLocaleString('en-US')`；原图 `/images/real/cbb65-4.jpg`，alt 声明样本纸盒和 OEM artwork 需单独审批 | `Discuss an OEM requirement` → `/contact/?request=oem#inquiry-form` | `src/pages/oem.astro:6` → `src/data/site.ts:6`；图片高优先级 |
| M02 | 商务条件；H2 `Samples and quotation` | 样品数量、费用、运费、准备时间、model MOQ 和生产周期需书面报价确认；无图 | 无独立 CTA | `src/pages/oem.astro:7` 前半段 |
| M03 | 配置审批流程；H2 `From specification to approval` | ordered flow 4 阶段：H3 `Define`（原件/图纸、duty、µF/VAC/tolerance、文件、数量、目的地）；`Configure`（case、mounting、lead、connectors、label artwork、packing）；`Approve`（drawing revision、sample、label/packing revision/records）；`Order`（approved revision/quotation、price/currency/payment/delivery） | `Model and inspection records` → `/factory/#model-records`；`Delivery, documents and order support` → `/resources/motor-capacitor-order-shipment-checklist/` | `src/pages/oem.astro:7` 后半段；M02/M03 同一个 section 内、按 H2 顺序拆分 |

### `/faq/` · T-ST-FAQ

共享外壳：BaseLayout；Breadcrumb `Home / Resources / FAQ`。`questions` 为 12 组问答；`nextSteps` 12 个 CTA 按同索引取值；`questionGroups` 改变输出顺序，**不是按原 questions 0–11 顺序平铺**。

| ID | 模块名称与实际标题 | 核心内容/媒体 | 交互与 CTA | 源码与条件 |
|---|---|---|---|---|
| M01 | FAQ 标题；H1 `Motor capacitor buying questions` | 无媒体 | 无独立 CTA | `src/pages/faq.astro:37` |
| M02 | 选型问答组；H2 `Selection & model records` | question indices `[0,1,2,3,6]`；5 个 details，完整下表 | 原生 summary 展开答案及 CTA；默认都未 open | `src/pages/faq.astro:3–16,17–30,31–35,37`；`#faq-selection` |
| M03 | OEM/询盘问答组；H2 `OEM & inquiry` | indices `[4,5,7]`；3 details | 同上 | `src/pages/faq.astro:33,37`；`#faq-inquiry` |
| M04 | 订单/发运问答组；H2 `Orders & dispatch` | indices `[8,9,10,11]`；4 details | 同上 | `src/pages/faq.astro:34,37`；`#faq-orders` |

FAQ 实际输出顺序与完整 next step：

| 模块/数据索引 | 实际 summary | 答案核心内容 | 实际 CTA → href |
|---|---|---|---|
| M02 / 0 | Which capacitor series should I choose? | 从马达电路辨别 run CBB60/61/65 和 start CD60，标签/马达型号用于缩小范围 | Compare the product series → `/products/` |
| M02 / 1 | Does a series range include every possible model? | 系列范围不是所有 rating/case组合，需 drawing/quotation | Check a specific model → `/buying-guide/` |
| M02 / 2 | Can a start capacitor replace a run capacitor? | 电路不同，应匹配原 motor duty，外形相似不能替代 | Read start versus run → `/resources/start-vs-run-capacitors/` |
| M02 / 3 | What should an HVAC dual-run inquiry include? | 双 µF、VAC、设备型号、can dimensions、terminal photo/drawing、quantity | Review CBB65 dual-run → `/products/cbb65-air-conditioner-capacitor/` |
| M02 / 6 | Does a certificate cover every model? | 按 covered model/目的地/有效期；本站未发布 model certificates | Review model document requirements → `/factory/` |
| M03 / 4 | Can you provide custom labels or connections? | artwork/connection/packing/volume；可行性、minimum、revision 在 offer确认 | Prepare an OEM request → `/oem/` |
| M03 / 5 | What is the standard minimum order quantity? | 标准1,000，具体model/configuration以quotation为准 | Ask about your model and quantity → `/contact/` |
| M03 / 7 | What photos should I attach? | 清楚label、terminal近照、带尺寸侧视、motorplate | Prepare an RFQ → `/buying-guide/` |
| M04 / 8 | What should I check before dispatch? | revision、quantity、label、packout、inspection、delivery term、draftshippingdocs | Open the order and shipment checklist → `/resources/motor-capacitor-order-shipment-checklist/` |
| M04 / 9 | Which shipping documents will be included? | route/destination/contract决定，商定invoice/packing/transport/origin/inspection/compliance责任 | Review packing and dispatch → `/factory/packing-and-dispatch/` |
| M04 / 10 | Can I see records of previous capacitor shipments? | 本站无 completed customer shipment case，按model/qty请求inspection和handover records，隐去其他客户机密 | Check shipment evidence → `/factory/packing-and-dispatch/` |
| M04 / 11 | How do I agree lead time and delivery dates? | readiness、inspectionrelease、pickup、arrivalestimate分开确认 | Prepare your order questions → `/resources/motor-capacitor-order-shipment-checklist/` |

### `/privacy-policy/` · T-ST-NOTICE

共享外壳：BaseLayout；Breadcrumb `Home / Privacy`。M02–M05 在一个 `.editorial` 容器内按 H2 顺序拆分；无媒体。

| ID | 模块名称与实际标题 | 核心内容 | 交互与 CTA | 源码与条件 |
|---|---|---|---|---|
| M01 | Notice 标题；H1 `Privacy notice` | 无简介 | 无 CTA | `src/pages/privacy-policy.astro:6` |
| M02 | 草稿机制；H2 `Email and WhatsApp drafts` | contactform在浏览器创建draft；用户所选app处理，按Send后provider负责delivery；文案称网站不接收formsubmissions/files（这是当前页面文案，不是全站 API能力结论） | `contact form` → `/contact/#inquiry-form`；email → `mailto:ManuelaMusio570@gmail.com` | `src/pages/privacy-policy.astro:8–9` |
| M03 | 消息信息；H2 `Information in a message` | 用户选择信息：姓名/公司/email/phone、原label/model/drawing、quantity/destination；外部provider/recipient处理；原站policy讲业务使用 | `Hanxing privacy policy on the original site` → `https://www.hanxingcapacitor.com/privacy-policy/`（新标签） | `src/pages/privacy-policy.astro:10–11` |
| M04 | 公开身份；H2 `Public business identity` | Brand、英文businessname、address 从 site常量输出；提醒quotation/shippingdocuments legal seller | `company information page on the original site` → 同原站privacyURL（新标签） | `src/pages/privacy-policy.astro:12–14` → `src/data/site.ts:2,4` |
| M05 | 信息问题；H2 `Questions about your information` | 询问使用/更正/删除、停止followup、retentionperiod | email → `mailto:ManuelaMusio570@gmail.com` | `src/pages/privacy-policy.astro:15–16` |

### `/request-a-quote/` · T-ST-QUOTE-PREP

共享外壳：BaseLayout；Breadcrumb `Home / Request a Quote`；显式 noindex。**当前源码未调用 Astro.redirect，也未出现 meta refresh 或 location.assign；必须登记为实际页面，不能归为重定向。**

| ID | 模块名称与实际标题 | 核心内容/媒体 | 交互与 CTA | 源码与条件 |
|---|---|---|---|---|
| M01 | Quote 准备标题；H1 `Request a motor capacitor quote` | 无图 | 无独立 CTA | `src/pages/request-a-quote.astro:19` |
| M02 | 报价准备；H2 `Details for your quotation` | 4 项：原 capacitorlabel/partnumber；equipmentmodel/runstart；capacitance/voltage/terminallead；quantity/destination/documents | `Prepare an inquiry draft` → `/contact/{allowed query}#inquiry-form` | `src/pages/request-a-quote.astro:20–21`；contactUrl构造 5–16 行 |
| M03 | 帮助侧栏；H3 `Need help identifying a part?` | 无媒体/状态 | `Compare capacitor series` → `/products/`；`Read a capacitor label` → `/resources/read-motor-capacitor-label/`；`Check run versus start duty` → `/resources/start-vs-run-capacitors/` | `src/pages/request-a-quote.astro:22–23` |

传递条件（源码已验证，生产query处理运行时未验证）：`request` 仅六个允许值；`guide` 必须在 guides；`series` 必须CBB60/61/65/CD60；`application` 必须在 applications.slug 或 hvac/pump/fan/other；**configuration/photo 不在此页转发逻辑**。它在 Astro frontmatter 读取 `Astro.url.searchParams`；若运行于 prerender/static 模式，最终 HTML 对运行时 query 是否保留必须看实际站点构建/响应，不能仅凭源码称已预填。

### `/thank-you/` · T-ST-STATUS

共享外壳：BaseLayout；没有 Breadcrumb；显式 noindex。`ThankYouStatus client:only="react"`，服务器初始内容不能当成组件已hydrated；本次浏览器 DOM 确认 hydrated 后默认无 reference 分支，非默认结果分支未测试。

| ID | 模块名称与实际标题 | 核心内容/媒体 | 交互与 CTA | 源码与条件 |
|---|---|---|---|---|
| M01 | 状态页标题；H1 `Inquiry status` | 无图 | 无 CTA | `src/pages/thank-you.astro:5` |
| M02 | 客户端询盘状态 | 只读 **sessionStorage** key `hanxing-inquiry-result`；无result时H2 `No inquiry reference found`、说明打开此页不提交，去contact准备appmessage；有result时H2 `Inquiry reference {id}`；status=local_preview时说保存在localpreview，未发salesemail；其他status时文案说系统保存且emailserviceaccepted Hanxingnotification，confirmationSent真假决定确认通知文案 | 无result显示 `Open contact options` → `/contact/`；组件不请求API、不从URL读取、不读localStorage、不发送消息 | `src/pages/thank-you.astro:3,5` → `src/components/ThankYouStatus.tsx:1–3`；useEffect读取，try/catch忽略parse错误；**只确认分支代码，不确认真实有提交/服务接受邮件** |
| M03 | 浏览产品出口；无 H2 | M02 后固定按钮组 | `Browse products` → `/products/` | `src/pages/thank-you.astro:5` |

当前 `/contact/` 不设置该 sessionStorage，也不导航到 `/thank-you/`。写入该key并跳转的 `src/components/QuoteForm.tsx:23` 当前未接入任何路由。即使手动有sessionStorage，状态文案仅据客户端对象输出，不能作为真实服务器提交或邮箱收件证据。

### `/404/`（未知路由回退未确认） · T-ST-ERROR

共享外壳：BaseLayout；无 Breadcrumb；显式 noindex。

| ID | 模块名称与实际标题 | 核心内容/媒体 | 交互与 CTA | 源码与条件 |
|---|---|---|---|---|
| M01 | 找不到页面；H1 `Page not found` | 无说明图或动态错误详情 | `Go home` → `/`；`Browse products` → `/products/` | `src/pages/404.astro:4`；仅一个Hero业务section；实际URL/state码由主稿运行时探针另证 |

### `/typography-preview/` · T-ST-TYPE-SPECIMEN

共享外壳：BaseLayout；无 Breadcrumb；显式 noindex。**本路由只用静态 Astro roles数组，没有使用 src/components/TypographyPreview.tsx 字体切换器。**

| ID | 模块名称与实际标题 | 核心内容/媒体 | 交互与 CTA | 源码与条件 |
|---|---|---|---|---|
| M01 | 字体系统说明；H1 `Typography system` | `Self-hosted Inter Variable. Size / weight / line height / tracking / max-width. Specimens only—not product or certification claims.` | 无 CTA | `src/pages/typography-preview.astro:21–24` |
| M02 | 角色样张；article H2 为每个 role name | 14条：Display、H1、H2、H3、H4、Body Large、Body、Small、Caption、Navigation、Button、Label、Data、Specification；每条显示settings与sample；仅样例文字，不是14个真实页面模块或产品规格证据 | 无可点切换控件；Navigation/Button样例是普通文本 | `src/pages/typography-preview.astro:3–18,25`；roles.map数据 |
| M03 | 数字符号样张；H2 `Numbers, units and symbols` | 示例 `18,000 kg`、`220 HP`、`4×2`、`Euro VI`、`-18°C`、`ISO 9001`；页面明确 specimens only，不能记为产品/认证事实 | 无 CTA | `src/pages/typography-preview.astro:19,26`；`#numeric-title` |


## 产品与应用页面

所有页面的外壳顺序：`S01` → Skip link / `S02` → `<main id="main">` 下列模块 → `S04`。Breadcrumb 插在各 M01 内，属于共享角色引用；当前并无单独 Breadcrumb.astro 文件，源码是各页面内的 nav/p 标记。

### /products/ · T-PRODUCT-CATALOG

| 模块 | 名称 / 实际标题 | 核心内容 | 图片 / 视频 | 交互 / CTA | 源码 |
| --- | --- | --- | --- | --- | --- |
| M01 | 目录 Hero / H1 Motor capacitor series | S05: Home / Products | 无 | Browse 96 sample photographs → /products/photographs/ | src/pages/products/index.astro:7 |
| M02 | 产品筛选与卡片 / 没有模块总标题；卡片 H2为 code + shortName + capacitor | 默认 All series，4条产品：每卡 code、shortName capacitor、tagline；资料见A1。范围字段capacitance/voltage传入但此卡片未显示 | 4个 product.image（A1）；无视频 | All series / Run duty / Start duty 按 function 筛选；卡片主图、H2、View {code} details → /products/{slug}/；aria-pressed与隐藏状态播报 | src/pages/products/index.astro:8 → src/components/ProductFilter.tsx:2–7 |
| M03 | 系列对比 / H2 Series comparison | Swipe horizontally to compare all fields. + series-range提示；表头 Series / Circuit duty / Capacitance range / AC voltage range / Connection options；4条产品循环，字段见A1 | 无 | 表格容器可键盘聚焦/横向滚动；每行 series链接 → 产品详情 | src/pages/products/index.astro:9 |
| M04 | 询问适配CTA / H2 Check a capacitor for your motor | CTA band | 无 | Contact Hanxing → /contact/ | src/pages/products/index.astro:10 |

### /products/photographs/ · T-SAMPLE-LIBRARY

| 模块 | 名称 / 实际标题 | 核心内容 | 图片 / 视频 | 交互 / CTA | 源码 |
| --- | --- | --- | --- | --- | --- |
| M01 | 样本库 Hero / H1 Product sample photographs | S05: Home / Products / Photographs；Include the photo reference and required rating in your inquiry. | 无 | Home → /；Products → /products/ | src/pages/products/photographs.astro:6 |
| M02 | 样本照片库 / 无可见总标题 | 6个筛选：All 96 / CBB60 25 / CBB61 12 / CBB65 17 / CD60 10 / Additional samples 32；默认8张P001–P008；caption为ID+label；Showing 8 of 96 photographs | 96张所有src+thumb精确见A3；默认网格8个thumb；isOpen真时才插入全尺寸src；无视频 | 过滤重置limit=8,selected=0；Show more photographs每次+12；点击图片开dialog；Close ×、背景点击、Esc（原生dialog）、Previous/Next及左右方向键循环；Ask about this sample → /contact/?photo={id}[&series={CBB60/CBB61/CBB65/CD60}]&request=samples#inquiry-form；Additional samples不带series | src/pages/products/photographs.astro:7 → src/components/SamplePhotoLibrary.tsx:4–33 |

M02 的dialog虽然在组件 DOM 树内，初始关闭不可见；不计作默认页面独立模块。`SamplePhotoLibrary` 在这一路由未传 `series`，因此 `!series` 筛选控件为 true，CBB60 的 P001/P002/P003 排除条件为 false，照片库仍含全部96张。

### /products/cbb60-motor-run-capacitor/ · T-PRODUCT-REFERENCE · CBB60

数据边界：产品 `src/data/site.ts` 40–57；展陈正文 `src/data/productReference.ts` 14–27；图库拼装 `src/pages/products/[slug].astro:11–15`。

| 模块 | 名称 / 实际标题 | 核心内容 | 图片 / 视频 | 交互 / CTA | 源码 |
| --- | --- | --- | --- | --- | --- |
| M01 | 产品 Hero / H1 CBB60 motor run capacitors | S05: Home / Products / CBB60；Run capacitors for pumps and other single-phase motors with matching specifications.；关键事实 2–100 µF，110–450 VAC，Run duty；For compatible single-phase motors | 图库 26 条（A2）：初始主图 /images/real/cbb60-hanxing-wired.jpg；先4条缩略图 /images/real/cbb60-hanxing-wired.jpg, /images/real/cbb60-17.jpg, /images/real/cbb60-16.jpg, /images/real/cbb60-18.jpg；无视频 | Prepare CBB60 RFQ → /contact/?series=CBB60&request=quote#inquiry-form；缩略图替换主图；主图放大；All photos → dialog网格。dialog H2 CBB60 sample photographs（默认不可见） | src/components/ProductReference.astro:27–38 → src/components/ProductReferenceGallery.tsx:4–59 |
| M02 | 页内导航 / 无标题 | Specifications / Samples & fit / Applications / OEM & purchasing / Documents | 无 | 依次 → #specifications / #sample-configurations / #pdr-applications / #pdr-purchasing / #model-documents；IntersectionObserver更新 aria-current=location | src/components/ProductReference.astro:39,68–76 |
| M03 | 规格 / H2 Technical specifications | Hanxing lists the CBB60 metallized polypropylene film series for water pumps, washing machines, smoke exhaust equipment and other single-phase motor systems. Use the motor specification to identify the required rating and connection.；10个规格字段见A1；series范围提示及型号drawing；无特有子注释。 | 无 | Original series listing → https://www.hanxingcapacitor.com/products/cbb60-motor-run-capacitor/（target=_blank） | src/components/ProductReference.astro:17–23,41–46 |
| M04 | 适配 / H2 Samples and mechanical fit | 主样本 Lead-wire sample with base stud；rating=25 µF ±5% · 450 VAC on the horizontal sample；note=Availability of this sample as an orderable model needs confirmation. The photograph has no dimension scale.；H3 Original rating / Body and mounting stud / Space for the leads。正文精确见A4；alternate 无 | 主 /images/real/cbb60-18.jpg；无视频 | View larger →图库photo；View all 26 sample photographs →图库grid；Ask about this sample → /contact/?series=CBB60&configuration=cbb60-stud&request=quote#inquiry-form；alternate链接同式替换id | src/components/ProductReference.astro:48–55；src/data/sampleConfigurations.ts:2–9 |
| M05 | 应用 / H2 Applications | CBB60 is listed for the following single-phase motor applications where the motor calls for run duty.；列表 Water pumps / Washing machines / Smoke exhaust equipment / Compatible single-phase motors；与 motor specification核对说明 | 无 | Water pumps → /applications/pumps-water-systems/；Washing machines → /applications/appliances-small-motors/；Smoke exhaust equipment → /applications/fans-ventilation/；Compatible single-phase motors → 普通文本，无href；Check run versus start duty → /resources/start-vs-run-capacitors/ | src/components/ProductReference.astro:57 |
| M06 | 采购 / H2 OEM and purchasing | Standard MOQ: 1,000 pieces, subject to model；label artwork/connection/packing；样本数量/时间、生产/交期以quotation确认 | 无 | Review OEM requirements → /oem/；Order & shipment checklist → /resources/motor-capacitor-order-shipment-checklist/ | src/components/ProductReference.astro:59；src/data/site.ts:6 |
| M07 | 型号资料 / H2 Documents for your CBB60 model | Request model-level records；4条：Model number, revision, µF, VAC and tolerance.；Body dimensions, base stud and installed clearance.；Lead length, connector and fixing details.；Model-specific life class and application requirements. | 无 | Request a datasheet and drawing → /contact/?series=CBB60&request=documents#inquiry-form；Review model-record checks → /factory/#model-records | src/components/ProductReference.astro:61 |
| M08 | 询价 / H2 Request a CBB60 quotation | Include these details so the quotation refers to the model you need.；5字段Capacitance (µF): Original marking；Rated voltage (VAC): Original marking；Dimensions / connection: Drawing or clear photos；Quantity: Pieces by model；Destination: Country / market；draft后自行从email/WhatsApp发送说明 | 无 | Prepare CBB60 RFQ → /contact/?series=CBB60&request=quote#inquiry-form | src/components/ProductReference.astro:63 |
| M09 | 关联系列 / H2 Other capacitor series | Explore formats for different motor requirements.；CBB61 H3，Run duty；CBB65 H3，Run duty；CD60 H3，Start duty | 依序 /images/real/cbb61-13.jpg, /images/real/cbb65-2.jpg, /images/real/cd60-25.jpg；无视频 | Compare all series → /products/；3张整卡 → /products/cbb61-fan-capacitor/, /products/cbb65-air-conditioner-capacitor/, /products/cd60-start-capacitor/ | src/components/ProductReference.astro:65；src/pages/products/[slug].astro:10 |

### /products/cbb61-fan-capacitor/ · T-PRODUCT-REFERENCE · CBB61

数据边界：产品 `src/data/site.ts` 58–75；展陈正文 `src/data/productReference.ts` 28–41；图库拼装 `src/pages/products/[slug].astro:11–15`。

| 模块 | 名称 / 实际标题 | 核心内容 | 图片 / 视频 | 交互 / CTA | 源码 |
| --- | --- | --- | --- | --- | --- |
| M01 | 产品 Hero / H1 CBB61 fan capacitors | S05: Home / Products / CBB61；Compact run capacitors for fans, blowers and appliance motors with matching specifications.；关键事实 0.5–35 µF，110–450 VAC，Run duty；For compatible fan and appliance motors | 图库 15 条（A2）：初始主图 /images/real/cbb61-13.jpg；先4条缩略图 /images/real/cbb61-13.jpg, /images/real/cbb61-14.jpg, /images/real/cbb61-leads-10.jpg, /images/product-samples/sample-17-thumb.webp；无视频 | Prepare CBB61 RFQ → /contact/?series=CBB61&request=quote#inquiry-form；缩略图替换主图；主图放大；All photos → dialog网格。dialog H2 CBB61 sample photographs（默认不可见） | src/components/ProductReference.astro:27–38 → src/components/ProductReferenceGallery.tsx:4–59 |
| M02 | 页内导航 / 无标题 | Specifications / Samples & fit / Applications / OEM & purchasing / Documents | 无 | 依次 → #specifications / #sample-configurations / #pdr-applications / #pdr-purchasing / #model-documents；IntersectionObserver更新 aria-current=location | src/components/ProductReference.astro:39,68–76 |
| M03 | 规格 / H2 Technical specifications | CBB61 has a rectangular case and metallized polypropylene film construction. Hanxing lists it for fans, blowers, selected air conditioners and washing machines, and small single-phase motors. Check case size and lead arrangement alongside the electrical rating.；10个规格字段见A1；series范围提示及型号drawing；无特有子注释。 | 无 | Original series listing → https://www.hanxingcapacitor.com/products/cbb61-fan-capacitor/（target=_blank） | src/components/ProductReference.astro:17–23,41–46 |
| M04 | 适配 / H2 Samples and mechanical fit | 主样本 Wire-lead samples；rating=Rating to be specified；note=Lead length and wiring must be established by a drawing.；H3 Original rating / Case and fixing points / Wiring and terminals。正文精确见A4；alternate Blade-terminal samples | 主 /images/real/cbb61-leads-10.jpg；alternate /images/real/cbb61-13.jpg；无视频 | View larger →图库photo；View all 15 sample photographs →图库grid；Ask about this sample → /contact/?series=CBB61&configuration=cbb61-leads&request=quote#inquiry-form；alternate链接同式替换id | src/components/ProductReference.astro:48–55；src/data/sampleConfigurations.ts:2–9 |
| M05 | 应用 / H2 Applications | The CBB61 series is listed for fans and selected appliance motors that use a run capacitor.；列表 Fans / Blowers / Selected air conditioners / Selected washing machines；与 motor specification核对说明 | 无 | Fans → /applications/fans-ventilation/；Blowers → /applications/fans-ventilation/；Selected air conditioners → /applications/hvac-refrigeration/；Selected washing machines → /applications/appliances-small-motors/；Review dimensions and terminal fit → /resources/dimensions-terminals-mounting/ | src/components/ProductReference.astro:57 |
| M06 | 采购 / H2 OEM and purchasing | Standard MOQ: 1,000 pieces, subject to model；label artwork/connection/packing；样本数量/时间、生产/交期以quotation确认 | 无 | Review OEM requirements → /oem/；Order & shipment checklist → /resources/motor-capacitor-order-shipment-checklist/ | src/components/ProductReference.astro:59；src/data/site.ts:6 |
| M07 | 型号资料 / H2 Documents for your CBB61 model | Request model-level records；4条：Model number, revision, µF, VAC and tolerance.；Case length, width, height and mounting-tab dimensions.；Lead exit, length, connector and blade-terminal spacing.；Model-specific run duty and application requirements. | 无 | Request a datasheet and drawing → /contact/?series=CBB61&request=documents#inquiry-form；Review model-record checks → /factory/#model-records | src/components/ProductReference.astro:61 |
| M08 | 询价 / H2 Request a CBB61 quotation | Include these details so the quotation refers to the model you need.；5字段Capacitance (µF): Original marking；Rated voltage (VAC): Original marking；Dimensions / connection: Drawing or clear photos；Quantity: Pieces by model；Destination: Country / market；draft后自行从email/WhatsApp发送说明 | 无 | Prepare CBB61 RFQ → /contact/?series=CBB61&request=quote#inquiry-form | src/components/ProductReference.astro:63 |
| M09 | 关联系列 / H2 Other capacitor series | Explore formats for different motor requirements.；CBB60 H3，Run duty；CBB65 H3，Run duty；CD60 H3，Start duty | 依序 /images/real/cbb60-hanxing-wired.jpg, /images/real/cbb65-2.jpg, /images/real/cd60-25.jpg；无视频 | Compare all series → /products/；3张整卡 → /products/cbb60-motor-run-capacitor/, /products/cbb65-air-conditioner-capacitor/, /products/cd60-start-capacitor/ | src/components/ProductReference.astro:65；src/pages/products/[slug].astro:10 |

### /products/cbb65-air-conditioner-capacitor/ · T-PRODUCT-REFERENCE · CBB65

数据边界：产品 `src/data/site.ts` 76–94；展陈正文 `src/data/productReference.ts` 42–55；图库拼装 `src/pages/products/[slug].astro:11–15`。

| 模块 | 名称 / 实际标题 | 核心内容 | 图片 / 视频 | 交互 / CTA | 源码 |
| --- | --- | --- | --- | --- | --- |
| M01 | 产品 Hero / H1 CBB65 HVAC capacitors | S05: Home / Products / CBB65；Metal-can run capacitors for HVAC motors, in single and dual configurations.；关键事实 2–100 µF，110–450 VAC，Run duty；Single and dual-run configurations；特有 Dual-run ratings are listed separately in the specifications. Record both µF values. | 图库 20 条（A2）：初始主图 /images/real/cbb65-2.jpg；先4条缩略图 /images/real/cbb65-2.jpg, /images/real/cbb65-4.jpg, /images/real/cbb65-dual-run-7.jpg, /images/product-samples/sample-28-thumb.webp；无视频 | Prepare CBB65 RFQ → /contact/?series=CBB65&request=quote#inquiry-form；缩略图替换主图；主图放大；All photos → dialog网格。dialog H2 CBB65 sample photographs（默认不可见） | src/components/ProductReference.astro:27–38 → src/components/ProductReferenceGallery.tsx:4–59 |
| M02 | 页内导航 / 无标题 | Specifications / Samples & fit / Applications / OEM & purchasing / Documents | 无 | 依次 → #specifications / #sample-configurations / #pdr-applications / #pdr-purchasing / #model-documents；IntersectionObserver更新 aria-current=location | src/components/ProductReference.astro:39,68–76 |
| M03 | 规格 / H2 Technical specifications | Hanxing lists CBB65 metal-can motor-run capacitors for air conditioners, compressors, cold dryers and related HVAC equipment. Single and dual-run versions differ in rating and terminal layout. Include the arrangement shown on the original part in your inquiry.；10个规格字段见A1；series范围提示及型号drawing；无特有子注释。 | 无 | Original series listing → https://www.hanxingcapacitor.com/products/cbb65-air-conditioner-capacitor/（target=_blank） | src/components/ProductReference.astro:17–23,41–46 |
| M04 | 适配 / H2 Samples and mechanical fit | 主样本 Dual-run sample；rating=50+5 µF ±5% · 450 VAC；note=Retain both capacitance values when preparing the requirement.；H3 Single or dual run / Terminal groups / Can and mounting。正文精确见A4；alternate Single-run sample | 主 /images/real/cbb65-dual-run-7.jpg；alternate /images/real/cbb65-2.jpg；无视频 | View larger →图库photo；View all 20 sample photographs →图库grid；Ask about this sample → /contact/?series=CBB65&configuration=cbb65-dual&request=quote#inquiry-form；alternate链接同式替换id | src/components/ProductReference.astro:48–55；src/data/sampleConfigurations.ts:2–9 |
| M05 | 应用 / H2 Applications | CBB65 is listed for HVAC and refrigeration motors whose specifications call for run duty.；列表 Air conditioners / Compressors / Cold dryers / HVAC motor systems；与 motor specification核对说明 | 无 | Air conditioners → /applications/hvac-refrigeration/；Compressors → /applications/hvac-refrigeration/；Cold dryers → /applications/hvac-refrigeration/；HVAC motor systems → /applications/hvac-refrigeration/；Compare single and dual run → /resources/single-vs-dual-run-capacitors/ | src/components/ProductReference.astro:57 |
| M06 | 采购 / H2 OEM and purchasing | Standard MOQ: 1,000 pieces, subject to model；label artwork/connection/packing；样本数量/时间、生产/交期以quotation确认 | 无 | Review OEM requirements → /oem/；Order & shipment checklist → /resources/motor-capacitor-order-shipment-checklist/ | src/components/ProductReference.astro:59；src/data/site.ts:6 |
| M07 | 型号资料 / H2 Documents for your CBB65 model | Request model-level records；4条：Model number, revision, µF, VAC and tolerance.；Can diameter, height, fixing and installed terminal clearance.；Single or dual-run configuration; both values and terminal-group mapping where applicable.；Model-specific run duty and equipment requirements. | 无 | Request a datasheet and drawing → /contact/?series=CBB65&request=documents#inquiry-form；Review model-record checks → /factory/#model-records | src/components/ProductReference.astro:61 |
| M08 | 询价 / H2 Request a CBB65 quotation | Include these details so the quotation refers to the model you need.；5字段Capacitance (µF): Both values for dual run；Rated voltage (VAC): Original marking；Dimensions / connection: Drawing or clear photos；Quantity: Pieces by model；Destination: Country / market；draft后自行从email/WhatsApp发送说明 | 无 | Prepare CBB65 RFQ → /contact/?series=CBB65&request=quote#inquiry-form | src/components/ProductReference.astro:63 |
| M09 | 关联系列 / H2 Other capacitor series | Explore formats for different motor requirements.；CBB60 H3，Run duty；CBB61 H3，Run duty；CD60 H3，Start duty | 依序 /images/real/cbb60-hanxing-wired.jpg, /images/real/cbb61-13.jpg, /images/real/cd60-25.jpg；无视频 | Compare all series → /products/；3张整卡 → /products/cbb60-motor-run-capacitor/, /products/cbb61-fan-capacitor/, /products/cd60-start-capacitor/ | src/components/ProductReference.astro:65；src/pages/products/[slug].astro:10 |

### /products/cd60-start-capacitor/ · T-PRODUCT-REFERENCE · CD60

数据边界：产品 `src/data/site.ts` 95–112；展陈正文 `src/data/productReference.ts` 56–69；图库拼装 `src/pages/products/[slug].astro:11–15`。

| 模块 | 名称 / 实际标题 | 核心内容 | 图片 / 视频 | 交互 / CTA | 源码 |
| --- | --- | --- | --- | --- | --- |
| M01 | 产品 Hero / H1 CD60 motor start capacitors | S05: Home / Products / CD60；Start capacitors for single-phase AC motors with a switched starting circuit.；关键事实 20–1500 µF，110–330 VAC，Start duty；For a switched motor-start circuit；特有 CD60 is not specified for continuous run duty. Request duty and time limits for the model you need. | 图库 12 条（A2）：初始主图 /images/real/cd60-25.jpg；先4条缩略图 /images/real/cd60-25.jpg, /images/real/cd60-detail-69.jpg, /images/product-samples/sample-37-thumb.webp, /images/product-samples/sample-38-thumb.webp；无视频 | Prepare CD60 RFQ → /contact/?series=CD60&request=quote#inquiry-form；缩略图替换主图；主图放大；All photos → dialog网格。dialog H2 CD60 sample photographs（默认不可见） | src/components/ProductReference.astro:27–38 → src/components/ProductReferenceGallery.tsx:4–59 |
| M02 | 页内导航 / 无标题 | Specifications / Samples & fit / Applications / OEM & purchasing / Documents | 无 | 依次 → #specifications / #sample-configurations / #pdr-applications / #pdr-purchasing / #model-documents；IntersectionObserver更新 aria-current=location | src/components/ProductReference.astro:39,68–76 |
| M03 | 规格 / H2 Technical specifications | CD60 is Hanxing's aluminium electrolytic motor-start series. Use it only in a circuit designed to switch a start capacitor. The motor documentation determines the required rating and duty.；10个规格字段见A1；series范围提示及型号drawing；特有H3 Sample label and series data：500 µF ±5%,300 VAC样本与系列容差不同、climatic category不等于operating temperature。 | 无 | Original series listing → https://www.hanxingcapacitor.com/products/cd60-start-capacitor/（target=_blank） | src/components/ProductReference.astro:17–23,41–46 |
| M04 | 适配 / H2 Samples and mechanical fit | 主样本 Motor-start sample；rating=500 µF ±5% · 300 VAC；note=The sample tolerance differs from the published series table. Request the duty limits and datasheet for the exact model.；H3 Starting circuit / Rating and duty markings / Case and terminals。正文精确见A4；alternate 无 | 主 /images/real/cd60-25.jpg；无视频 | View larger →图库photo；View all 12 sample photographs →图库grid；Ask about this sample → /contact/?series=CD60&configuration=cd60-start&request=quote#inquiry-form；alternate链接同式替换id | src/components/ProductReference.astro:48–55；src/data/sampleConfigurations.ts:2–9 |
| M05 | 应用 / H2 Applications | CD60 requires a circuit designed to switch a start capacitor. Use the motor documentation to establish the required duty for the applications below.；列表 Compatible single-phase AC motor starting / Selected pumps / Selected compressors；与 motor specification核对说明 | 无 | Compatible single-phase AC motor starting → 普通文本，无href；Selected pumps → /applications/pumps-water-systems/；Selected compressors → /applications/hvac-refrigeration/；Check start versus run duty → /resources/start-vs-run-capacitors/ | src/components/ProductReference.astro:57 |
| M06 | 采购 / H2 OEM and purchasing | Standard MOQ: 1,000 pieces, subject to model；label artwork/connection/packing；样本数量/时间、生产/交期以quotation确认 | 无 | Review OEM requirements → /oem/；Order & shipment checklist → /resources/motor-capacitor-order-shipment-checklist/ | src/components/ProductReference.astro:59；src/data/site.ts:6 |
| M07 | 型号资料 / H2 Documents for your CD60 model | Request model-level records；4条：Model number, revision, µF, VAC and tolerance.；Body dimensions, terminal configuration and installed clearance.；Starting circuit and switching arrangement.；Model-specific starting duty, time limits and approved tolerance. | 无 | Request a datasheet and drawing → /contact/?series=CD60&request=documents#inquiry-form；Review model-record checks → /factory/#model-records | src/components/ProductReference.astro:61 |
| M08 | 询价 / H2 Request a CD60 quotation | Include these details so the quotation refers to the model you need.；5字段Capacitance (µF): Original marking；Rated voltage (VAC): Original marking；Dimensions / connection: Drawing or clear photos；Quantity: Pieces by model；Destination: Country / market；draft后自行从email/WhatsApp发送说明 | 无 | Prepare CD60 RFQ → /contact/?series=CD60&request=quote#inquiry-form | src/components/ProductReference.astro:63 |
| M09 | 关联系列 / H2 Other capacitor series | Explore formats for different motor requirements.；CBB60 H3，Run duty；CBB61 H3，Run duty；CBB65 H3，Run duty | 依序 /images/real/cbb60-hanxing-wired.jpg, /images/real/cbb61-13.jpg, /images/real/cbb65-2.jpg；无视频 | Compare all series → /products/；3张整卡 → /products/cbb60-motor-run-capacitor/, /products/cbb61-fan-capacitor/, /products/cbb65-air-conditioner-capacitor/ | src/components/ProductReference.astro:65；src/pages/products/[slug].astro:10 |

### /applications/ · T-APPLICATION-DIRECTORY

| 模块 | 名称 / 实际标题 | 核心内容 | 图片 / 视频 | 交互 / CTA | 源码 |
| --- | --- | --- | --- | --- | --- |
| M01 | 应用目录 Hero / H1 Motor capacitors by application | S05: Home / Applications | 无 | Home → / | src/pages/applications/index.astro:7 |
| M02 | 应用卡片目录 / 无模块总标题 | 4卡依序H2 HVAC & refrigeration / Pumps & water systems / Fans & ventilation / Appliances & small motors；每卡series.join(" / ")+question（见A5） | 4个application.image（A5）；每幅figcaption Application illustration；无视频 | 每卡主图链接和H2链接 → /applications/hvac-refrigeration/, /applications/pumps-water-systems/, /applications/fans-ventilation/, /applications/appliances-small-motors/ | src/pages/applications/index.astro:8 → src/components/ApplicationCard.astro:7 |

### /applications/hvac-refrigeration/ · T-HVAC-REFERENCE

| 模块 | 名称 / 实际标题 | 核心内容 | 图片 / 视频 | 交互 / CTA | 源码 |
| --- | --- | --- | --- | --- | --- |
| M01 | 应用 Hero / H1 HVAC & refrigeration | S05: Home / Applications / HVAC & refrigeration；lead Match the capacitor to the original motor circuit.；summary An HVAC unit may have separate compressor and fan motor circuits. Identify the original circuit and capacitor before comparing options; the equipment name alone does not establish the requirement.；Common equipment: Air conditioning, Cold dryers, Compressor systems, Ventilation motors.；decision Which circuit needs the capacitor: compressor run, fan run or a separate start circuit? Review CD60 only where the motor design calls for a switched start capacitor. | /images/illustrative/application-hvac-v1.webp；figcaption Application illustration；无视频 | Review circuit requirements → #review；Prepare inquiry → #quote-details | src/components/HvacReference.astro:18–29 |
| M02 | 系列比较 / H2 Run and start capacitors for HVAC applications | CBB65 and CD60 serve different circuit functions. Use the original motor documentation to identify the capacitor specification you need.；列为 CBB65 Run duty · HVAC run / CD60 Start duty · Motor start；行：Product sample、Function、Capacitance range、Rated voltage range、Compare with the original circuit、Series page；各数据值A1/A6；Swipe hint及series-range核对提示 | /images/real/cbb65-2.jpg, /images/real/cd60-25.jpg；caption Series sample / Series sample；无视频 | 横向滚动对比表(role=region, tabindex=0)；View CBB65 → /products/cbb65-air-conditioner-capacitor/；View CD60 → /products/cd60-start-capacitor/ | src/components/HvacReference.astro:31–50 |
| M03 | 核对询盘 / H2 Check and prepare your inquiry | Check these details against the original part and motor documentation, then include them in your inquiry.；5个H3及正文：Equipment, motor and circuit: Provide the equipment and motor model with the original motor documentation. Identify compressor run, fan run or a separate switched start circuit, and record the original single or dual-run configuration.；Original label and values: Include a clear label photograph and record each µF value and rated VAC. For dual run, provide both independent capacitance values.；Terminal groups: Include terminal-group labels and a clear connection photograph or drawing. Check the connections against the original motor documentation.；Can and mounting space: Measure the can dimensions, mounting details and available installation space. Include the fixing or mounting drawing.；Quantity, destination and documents: Provide the order quantity or forecast, destination country or market and required documents. | /images/real/cbb65-2.jpg；caption Single-run series sample · terminal detail；无视频 | Compare single and dual-run capacitors → /resources/single-vs-dual-run-capacitors/；Prepare an HVAC inquiry → /contact/?application=hvac-refrigeration；Oriental Motor → https://faq.orientalmotor.com/can-i-use-capacitors-other-than-the-one-that-comes-with-the-ac-motor（target=_blank） | src/components/HvacReference.astro:52–60；checks:8–14 |

### /applications/pumps-water-systems/ · T-APPLICATION-REFERENCE

| 模块 | 名称 / 实际标题 | 核心内容 | 图片 / 视频 | 交互 / CTA | 源码 |
| --- | --- | --- | --- | --- | --- |
| M01 | 应用 Hero / H1 Pumps & water systems | S05: Home / Applications / Pumps & water systems；lead Identify run or start duty before comparing parts.；summary Pump motors may use a run capacitor, a start capacitor, both or another arrangement. The motor drawing identifies the circuit; CBB60 and CD60 serve different functions.；Common equipment: Water pumps, Booster systems, Single-phase pumping motors.；decision Does the motor use a run capacitor, a switched start capacitor or separate parts for both? Run and start capacitors are not interchangeable. | /images/illustrative/application-pumps-v3.webp；figcaption Application illustration；无视频 | Review motor requirements → #review；Prepare inquiry → #quote-details | src/components/ApplicationReference.astro:13–24 |
| M02 | 系列比较 / H2 Run and start capacitors for pump motors | Use the motor drawing to identify the circuit, then compare the original rating and installed space.；列为 CBB60 Run duty · Motor run / CD60 Start duty · Motor start；行：Product sample、Function、Capacitance range、Rated voltage range、Compare with the original part、Series page；各数据值A1/A6；Swipe hint及series-range核对提示 | /images/real/cbb60-hanxing-wired.jpg, /images/real/cd60-25.jpg；caption Series sample / Series sample；无视频 | 横向滚动对比表(role=region, tabindex=0)；View CBB60 → /products/cbb60-motor-run-capacitor/；View CD60 → /products/cd60-start-capacitor/ | src/components/ApplicationReference.astro:26–45 |
| M03 | 核对询盘 / H2 Check and prepare your inquiry | Check these details against the original part and motor documentation, then include them in your inquiry.；5个H3及正文：Pump, motor and circuit: Provide the equipment and motor model with its diagram or specification. Identify run duty, switched start duty or both; list each part separately and request start-duty and time limits where needed.；Original rating: Include a clear capacitor-label photograph showing the original µF, VAC and any duty marking for each part.；Body and fixing: Measure diameter, height, mounting stud and fixing details. Compare them with the drawing and the available enclosure space.；Connections and clearance: Include a connection photograph or drawing, lead exit, wire length and connector or terminal format. Allow room for the connections inside the housing.；Quantity and destination: Provide the order quantity by model and destination country or market. | /images/real/cbb60-18.jpg；caption CBB60 samples · base stud visible on the horizontal sample；无视频 | Check start versus run duty → /resources/start-vs-run-capacitors/；Prepare a pump inquiry → /contact/?application=pumps-water-systems；View full photograph → /images/real/cbb60-18.jpg（target=_blank）；Oriental Motor → https://faq.orientalmotor.com/can-i-use-capacitors-other-than-the-one-that-comes-with-the-ac-motor（target=_blank） | src/components/ApplicationReference.astro:47–55 |

### /applications/fans-ventilation/ · T-APPLICATION-REFERENCE

| 模块 | 名称 / 实际标题 | 核心内容 | 图片 / 视频 | 交互 / CTA | 源码 |
| --- | --- | --- | --- | --- | --- |
| M01 | 应用 Hero / H1 Fans & ventilation | S05: Home / Applications / Fans & ventilation；lead Check the electrical rating and the fit inside the fan housing.；summary A fan capacitor needs to match the motor circuit and fit the housing. CBB61 has a compact rectangular case; CBB60 has a cylindrical format for motors that specify it.；Common equipment: Fans, Blowers, Exhaust equipment.；decision Which case and connection format fits the fan housing? Compare the required electrical rating and installed fit together. | /images/illustrative/application-fans-v1.webp；figcaption Application illustration；无视频 | Review motor requirements → #review；Prepare inquiry → #quote-details | src/components/ApplicationReference.astro:13–24 |
| M02 | 系列比较 / H2 Run-capacitor formats for fan motors | CBB61 and CBB60 are run-capacitor series. Compare the required electrical values and mechanical format together.；列为 CBB61 Run duty · Fan run / CBB60 Run duty · Motor run；行：Product sample、Function、Capacitance range、Rated voltage range、Case dimensions、Compare with the original part、Series page；各数据值A1/A6；Swipe hint及series-range核对提示 | /images/real/cbb61-13.jpg, /images/real/cbb60-hanxing-wired.jpg；caption Blade-terminal series samples / Series sample；无视频 | 横向滚动对比表(role=region, tabindex=0)；View CBB61 → /products/cbb61-fan-capacitor/；View CBB60 → /products/cbb60-motor-run-capacitor/ | src/components/ApplicationReference.astro:26–45 |
| M03 | 核对询盘 / H2 Check and prepare your inquiry | Check these details against the original part and motor documentation, then include them in your inquiry.；5个H3及正文：Fan, motor and rating: Provide the equipment and motor model with the original motor specification. Include the capacitor label showing µF and VAC, and confirm that the motor calls for run duty.；Case and mounting: Measure case length, width and height or body diameter and height, fixing positions and available space inside the fan housing.；Leads or terminals: For wired parts, record lead count, exit direction, length and connector. For blade terminals, include the terminal pattern. Compare with the original sample or drawing; matching wire counts alone do not establish compatibility.；Original sample or drawing: Include clear label, side and connection photographs, or the original drawing.；Quantity and destination: Provide the order quantity by model and destination country or market. | /images/real/cbb61-leads-10.jpg；caption CBB61 samples · lead exit and mounting tabs；无视频 | Review dimensions and terminal fit → /resources/dimensions-terminals-mounting/；Prepare a fan inquiry → /contact/?application=fans-ventilation；View full photograph → /images/real/cbb61-leads-10.jpg（target=_blank）；Oriental Motor → https://faq.orientalmotor.com/can-i-use-capacitors-other-than-the-one-that-comes-with-the-ac-motor（target=_blank） | src/components/ApplicationReference.astro:47–55 |

### /applications/appliances-small-motors/ · T-APPLICATION-REFERENCE

| 模块 | 名称 / 实际标题 | 核心内容 | 图片 / 视频 | 交互 / CTA | 源码 |
| --- | --- | --- | --- | --- | --- |
| M01 | 应用 Hero / H1 Appliances & small motors | S05: Home / Applications / Appliances & small motors；lead Start with the original motor and capacitor label.；summary The appliance name alone rarely identifies the capacitor. Start with the motor model and original part, including its wiring. Then compare the electrical rating and connections with the available mounting space.；Common equipment: Selected washing machines, Compact single-phase motors, Appliance assemblies.；decision Which motor circuit does the capacitor serve? The appliance name alone cannot establish its duty. | /images/illustrative/application-appliances-v2.webp；figcaption Application illustration；无视频 | Review motor requirements → #review；Prepare inquiry → #quote-details | src/components/ApplicationReference.astro:13–24 |
| M02 | 系列比较 / H2 Run-capacitor formats for appliance motors | CBB60 and CBB61 are run-capacitor series. The original motor must specify run duty, and the proposed case and connections must fit.；列为 CBB60 Run duty · Motor run / CBB61 Run duty · Fan run；行：Product sample、Function、Capacitance range、Rated voltage range、Case dimensions、Compare with the original part、Series page；各数据值A1/A6；Swipe hint及series-range核对提示 | /images/real/cbb60-hanxing-wired.jpg, /images/real/cbb61-13.jpg；caption Series sample / Blade-terminal series samples；无视频 | 横向滚动对比表(role=region, tabindex=0)；View CBB60 → /products/cbb60-motor-run-capacitor/；View CBB61 → /products/cbb61-fan-capacitor/ | src/components/ApplicationReference.astro:26–45 |
| M03 | 核对询盘 / H2 Check and prepare your inquiry | Check these details against the original part and motor documentation, then include them in your inquiry.；5个H3及正文：Equipment, motor and rating: Identify the appliance and specific motor served. Provide its specification or diagram and record the original duty, capacitance and rated voltage.；Original part record: Include clear capacitor-label, side and connection photographs, or the original drawing.；Wiring and connector: Compare the lead or blade arrangement with the original part and motor drawing, even when the wire counts match.；Case and fixing: Include cylindrical or rectangular case dimensions, fixing details and installed clearance within the appliance.；Quantity, destination and documents: Provide the initial order or annual forecast quantity, destination country or market and required documents. | /images/real/cbb61-leads-10.jpg；caption CBB61 samples · wire leads and mounting tabs；无视频 | Read the original capacitor label → /resources/read-motor-capacitor-label/；Prepare an appliance inquiry → /contact/?application=appliances-small-motors；View full photograph → /images/real/cbb61-leads-10.jpg（target=_blank）；Oriental Motor → https://faq.orientalmotor.com/can-i-use-capacitors-other-than-the-one-that-comes-with-the-ac-motor（target=_blank） | src/components/ApplicationReference.astro:47–55 |


## 资源目录

### `/resources/` · T-RESOURCE-INDEX

Header/Footer/BaseLayout 只引用共享壳，不新增每页 M 模块。Breadcrumb 为 Hero 内联 `.breadcrumbs` 模式，当前不存在 Breadcrumb.astro 导入。

| 模块 | 实际标题 / 核心内容 | 媒体 | 交互与 CTA | 源码 |
|---|---|---|---|---|
| M01 Hero | H1 **Motor capacitor resources**；Home / Resources | 无 | Home → `/` | `src/pages/resources/index.astro:11` |
| M02 捷径导航 | 无可见标题；aria-label=Resource shortcuts | 无 | RFQ checklist → `/buying-guide/`；Compare products → `/products/`；Supplier records → `/about/#supplier-records`；Order & dispatch → `/resources/motor-capacitor-order-shipment-checklist/`；Buyer FAQ → `/faq/` | `src/pages/resources/index.astro:12` |
| M03 文章组 | H2 **Electrical selection**；5 篇标题与 summary | 无 | 每篇标题链接 → guideHref | `src/pages/resources/index.astro:5,12`；`src/data/guides.ts:20-77` |
| M04 文章组 | H2 **Dimensions & connections**；1 篇标题与 summary | 无 | `/resources/dimensions-terminals-mounting/` | `src/pages/resources/index.astro:6,12`；`src/data/guides.ts:80-89` |
| M05 文章组 | H2 **Ordering & delivery**；1 篇标题与 summary | 无 | `/resources/motor-capacitor-order-shipment-checklist/` | `src/pages/resources/index.astro:7,12`；`src/data/guides.ts:92-107` |
| M06 记录出口 | **Model and quality record requirements**；单链接无标题 | 无 | `/factory/#model-records` | `src/pages/resources/index.astro:12` |

组顺序来自 guideGroups；组内 guides.filter 保留 guides 数据顺序，并不按 slugs 数组重排。guide.category 不参与当前分组，也没有 category 页面。GuideThumbnail 未在当前索引调用，索引没有缩略图。

- **Start capacitor vs run capacitor** → `/resources/start-vs-run-capacitors/`
  - 显示 summary：The motor circuit determines whether it needs a run capacitor, a start capacitor, or both.

- **CBB60 vs CBB61 vs CBB65** → `/resources/cbb60-vs-cbb61-vs-cbb65/`
  - 显示 summary：Compare case styles and typical applications across Hanxing’s three film motor-run series.

- **Single-run vs dual-run capacitors** → `/resources/single-vs-dual-run-capacitors/`
  - 显示 summary：A dual-run capacitor has two capacitance values and a terminal layout that must match the circuit.

- **Reading a motor capacitor label** → `/resources/read-motor-capacitor-label/`
  - 显示 summary：Use the sample’s electrical ratings and model details to prepare a purchasing specification.

- **Motor capacitor capacitance and voltage** → `/resources/capacitance-voltage-guide/`
  - 显示 summary：Read µF and VAC as separate ratings and match each one to the motor specification.

- **Motor capacitor dimensions, terminals and mounting** → `/resources/dimensions-terminals-mounting/`
  - 显示 summary：Measure the full installed part, including its terminals, wires and fixing hardware.

- **Motor capacitor order and shipment checklist** → `/resources/motor-capacitor-order-shipment-checklist/`
  - 显示 summary：Use the same order reference for the approved product, packing plan and shipping records.

索引 head title 是 **Motor capacitor buyer resources**；description 是 **Read capacitor labels and compare Hanxing series. Prepare the model details and shipment requirements for your inquiry.**（src/pages/resources/index.astro:10），和可见 H1 分别记录。


## 七篇技术指南

每篇使用 T-GUIDE-ARTICLE；PhotoDetail 打开原文件新标签，不是 lightbox；没有正文 video、table、评论、搜索、分页或文章内form。

### 4.1 `/resources/start-vs-run-capacitors/`

- 页面 → T-GUIDE-ARTICLE (comparison) → 下列模块 → `src/pages/resources/[slug].astro:17-27` + `src/data/guides.ts:20` + `src/data/guideExamples.ts:53`。
- 目录summary/meta description：The motor circuit determines whether it needs a run capacitor, a start capacitor, or both.
- category=Understand capacitors（当前不直接显示）。

#### M01 Hero · Start capacitor vs run capacitor

- H1：**Start capacitor vs run capacitor**
- answer：A run capacitor stays in the motor’s running circuit. A start capacitor operates in the starting circuit as specified by the motor design. The two are not interchangeable, even if their cases and µF markings look alike.
- 无Hero媒体。Home / Resources / title 内联Breadcrumb引用共享模式。
- **Confirm the required duty** → `#details-to-send`。
- 无额外产品规格出口；title.includes(code)未命中。
- 源码：`src/pages/resources/[slug].astro:10,18`；`src/data/guides.ts:20-22`。

#### M02 图例 · Start and run capacitor samples

- H2：**Start and run capacitor samples**；id=sample-examples。
- 来源：`src/pages/resources/[slug].astro:21`；`src/data/guideExamples.ts:53`；`src/components/PhotoDetail.astro:2-7`。
- 调用只传 src、alt、complete=true，数据focus/zoom未传入。complete样式 object-fit:contain/transform:none（src/styles/finesse-redesign.css:144-145）。

**样例1：CBB65 label: capacitance, voltage and frequency**

- src：`/images/real/cbb65-2.jpg`；public文件已存在。
- alt：CBB65 sample label showing 20 µF ±5%, 450 VAC and 50/60 Hz.
- 说明：This sample is marked 20 µF ±5%, 450 VAC and 50/60 Hz. Base the final specification on the label or datasheet for the model you intend to order.
- 类型：real路径的样品/供应照片；只确认当前来源文本与文件，不外推商业证明。
- 图片链接 aria-label=**Open larger image: CBB65 sample label showing 20 µF ±5%, 450 VAC and 50/60 Hz.**；正文链接 **Open full photograph**；均 → `/images/real/cbb65-2.jpg`，target=_blank、rel=noopener noreferrer。

**样例2：CD60 sample: rating, series and duty**

- src：`/images/real/cd60-25.jpg`；public文件已存在。
- alt：CD60 sample marked 500 µF and 300 VAC, with its blade terminals visible.
- 说明：The CD60 sample is marked 500 µF and 300 VAC. Match the series and motor circuit as well as the electrical rating.
- 类型：real路径的样品/供应照片；只确认当前来源文本与文件，不外推商业证明。
- 图片链接 aria-label=**Open larger image: CD60 sample marked 500 µF and 300 VAC, with its blade terminals visible.**；正文链接 **Open full photograph**；均 → `/images/real/cd60-25.jpg`，target=_blank、rel=noopener noreferrer。

#### M03 正文小节 · Read the motor circuit first

- H2：**Read the motor circuit first**；id=`read-the-motor-circuit-first`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:24`。
- 无本节媒体或专用控件。

实际段落：

> Identify the motor model and circuit from the wiring diagram and original capacitor label. Some single-phase motors use both start and run capacitors; others use only one. The equipment name alone is not enough.

> Hanxing’s CBB60, CBB61 and CBB65 are film motor-run series; CD60 is an aluminium electrolytic motor-start series. Check an individual model against the motor specification.

该节没有section.links。

#### M04 正文小节 · Information needed for a replacement

- H2：**Information needed for a replacement**；id=`information-needed-for-a-replacement`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:25`。
- 无本节媒体或专用控件。

实际段落：

> Record the original µF, rated VAC and frequency, plus case size, mounting and connections. For a start capacitor, also record the starting-circuit arrangement and duty rating.

> If duty or motor information is missing, request the proposed model’s datasheet. A series range does not specify permitted starting time or cycle.

Further reading：

- **Measure dimensions and connections** → `/resources/dimensions-terminals-mounting/`

#### M05 References

- H2：**References**；id=references；sources.length>0，本页3条。
- 外部链接target=_blank，rel=noopener noreferrer；未验证外部页面正文。

- **Oriental Motor · AC motor capacitor guidance** → `https://www.orientalmotor.com/products/pdfs/F_TecRef/TecAc.pdf`
- **Hanxing · CD60 series** → `https://www.hanxingcapacitor.com/products/cd60-start-capacitor/`
- **TDK Electronics · Motor run and start capacitor catalog** → `https://www.tdk-electronics.tdk.com/en/3192232`

- 源码：`src/pages/resources/[slug].astro:23` + guide.sources。

#### M06 询盘 · Confirm the required duty

- H2：**Confirm the required duty**；id=details-to-send。
- note：Include the motor diagram and any missing duty marking so the proposed model can be checked.
- **Request a duty datasheet** → `/contact/?guide=start-vs-run-capacitors&request=documents#inquiry-form`。这里只导航，不提交、不确认真实邮件发送。
- **Use the complete RFQ template** → `/buying-guide/#rfq-template`。
- 无媒体或表单控件。源码：`src/pages/resources/[slug].astro:15,24` + guide.inquiry。

#### M07 TOC · On this page

- summary：**On this page**；native details；桌面右侧，手机视觉前置。
- 锚点顺序：

- **Start and run capacitor samples** → `#sample-examples`
- **Read the motor circuit first** → `#read-the-motor-circuit-first`
- **Information needed for a replacement** → `#information-needed-for-a-replacement`
- **References** → `#references`
- **Confirm the required duty** → `#details-to-send`

- 源码：`src/pages/resources/[slug].astro:26,28-35`。

#### M08 Related resources

- H2：**Related resources**；桌面右侧，手机在article之后。
- 出口顺序：

- **CD60 start capacitors** → `/products/cd60-start-capacitor/`
- **RFQ checklist** → `/buying-guide/`
- **All resources** → `/resources/`

- 源码：`src/pages/resources/[slug].astro:26` + guide.related。

### 4.2 `/resources/cbb60-vs-cbb61-vs-cbb65/`

- 页面 → T-GUIDE-ARTICLE (comparison) → 下列模块 → `src/pages/resources/[slug].astro:17-27` + `src/data/guides.ts:32` + `src/data/guideExamples.ts:54`。
- 目录summary/meta description：Compare case styles and typical applications across Hanxing’s three film motor-run series.
- category=Compare & select（当前不直接显示）。

#### M01 Hero · CBB60 vs CBB61 vs CBB65

- H1：**CBB60 vs CBB61 vs CBB65**
- answer：CBB60, CBB61 and CBB65 are film motor-run series with different case and connection formats. Match the motor’s ratings, wiring and installation space to an exact model; a series name does not define a replacement.
- 无Hero媒体。Home / Resources / title 内联Breadcrumb引用共享模式。
- **Find a model within the series** → `#details-to-send`。
- **CBB60 specifications** → `/products/cbb60-motor-run-capacitor/`
- **CBB61 specifications** → `/products/cbb61-fan-capacitor/`
- **CBB65 specifications** → `/products/cbb65-air-conditioner-capacitor/`
- 源码：`src/pages/resources/[slug].astro:10,18`；`src/data/guides.ts:32-34`。

#### M02 图例 · Compare the physical formats

- H2：**Compare the physical formats**；id=sample-examples。
- 来源：`src/pages/resources/[slug].astro:21`；`src/data/guideExamples.ts:54`；`src/components/PhotoDetail.astro:2-7`。
- 调用只传 src、alt、complete=true，数据focus/zoom未传入。complete样式 object-fit:contain/transform:none（src/styles/finesse-redesign.css:144-145）。

**样例1：CBB60: leads and stud mounting**

- src：`/images/real/cbb60-18.jpg`；public文件已存在。
- alt：Two CBB60 samples showing lead exits and a threaded mounting stud.
- 说明：The different sample orientations show the insulated leads and threaded base stud. Allow room for both the fixing and the lead exit.
- 类型：real路径的样品/供应照片；只确认当前来源文本与文件，不外推商业证明。
- 图片链接 aria-label=**Open larger image: Two CBB60 samples showing lead exits and a threaded mounting stud.**；正文链接 **Open full photograph**；均 → `/images/real/cbb60-18.jpg`，target=_blank、rel=noopener noreferrer。

**样例2：CBB61: similar housings, different ratings**

- src：`/images/real/cbb61-13.jpg`；public文件已存在。
- alt：Three CBB61 samples marked 4.5 µF, 5 µF and 6 µF.
- 说明：The CBB61 cases look similar, but their labels show 4.5 µF, 5 µF and 6 µF. Check the rating before comparing the fit.
- 类型：real路径的样品/供应照片；只确认当前来源文本与文件，不外推商业证明。
- 图片链接 aria-label=**Open larger image: Three CBB61 samples marked 4.5 µF, 5 µF and 6 µF.**；正文链接 **Open full photograph**；均 → `/images/real/cbb61-13.jpg`，target=_blank、rel=noopener noreferrer。

**样例3：CBB65: metal can and terminal groups**

- src：`/images/real/cbb65-2.jpg`；public文件已存在。
- alt：CBB65 sample with two insulated terminal groups visible at the top.
- 说明：Each of the two insulated terminal bases has several metal tabs. Use the proposed model’s drawing to check its connection layout.
- 类型：real路径的样品/供应照片；只确认当前来源文本与文件，不外推商业证明。
- 图片链接 aria-label=**Open larger image: CBB65 sample with two insulated terminal groups visible at the top.**；正文链接 **Open full photograph**；均 → `/images/real/cbb65-2.jpg`，target=_blank、rel=noopener noreferrer。

#### M03 正文小节 · Three different case formats

- H2：**Three different case formats**；id=`three-different-case-formats`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:36`。
- 无本节媒体或专用控件。

实际段落：

> Series pages give overall capacitance and voltage ranges. A specific rating, case size and connection combination still requires a model number and drawing.

实际列表（顺序原样）：

- CBB60: cylindrical case, considered for suitable pumps and single-phase motors.
- CBB61: compact rectangular case for fans and similar motors, where space and wire routing can be tight.
- CBB65: metal can, with single and dual-run configurations for HVAC.

该节没有section.links。

#### M04 正文小节 · Compare the installed part

- H2：**Compare the installed part**；id=`compare-the-installed-part`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:37`。
- 无本节媒体或专用控件。

实际段落：

> Confirm run duty and read the original µF and VAC. Compare body and fixing dimensions, lead or terminal photos, and the motor drawing with the proposed model documentation.

> For CBB65 dual-run, include both µF values and terminal groups. A CBB61 with the same case size can still have a different wire arrangement.

Further reading：

- **Check the physical measurements** → `/resources/dimensions-terminals-mounting/`

#### M05 References

- H2：**References**；id=references；sources.length>0，本页3条。
- 外部链接target=_blank，rel=noopener noreferrer；未验证外部页面正文。

- **Hanxing · CBB60** → `https://www.hanxingcapacitor.com/products/cbb60-motor-run-capacitor/`
- **Hanxing · CBB61** → `https://www.hanxingcapacitor.com/products/cbb61-fan-capacitor/`
- **Hanxing · CBB65** → `https://www.hanxingcapacitor.com/products/cbb65-air-conditioner-capacitor/`

- 源码：`src/pages/resources/[slug].astro:23` + guide.sources。

#### M06 询盘 · Find a model within the series

- H2：**Find a model within the series**；id=details-to-send。
- note：Use the original part and motor drawing to explain the required case and connection format.
- **Ask about a matching model** → `/contact/?guide=cbb60-vs-cbb61-vs-cbb65&request=quote#inquiry-form`。这里只导航，不提交、不确认真实邮件发送。
- **Use the complete RFQ template** → `/buying-guide/#rfq-template`。
- 无媒体或表单控件。源码：`src/pages/resources/[slug].astro:15,24` + guide.inquiry。

#### M07 TOC · On this page

- summary：**On this page**；native details；桌面右侧，手机视觉前置。
- 锚点顺序：

- **Compare the physical formats** → `#sample-examples`
- **Three different case formats** → `#three-different-case-formats`
- **Compare the installed part** → `#compare-the-installed-part`
- **References** → `#references`
- **Find a model within the series** → `#details-to-send`

- 源码：`src/pages/resources/[slug].astro:26,28-35`。

#### M08 Related resources

- H2：**Related resources**；桌面右侧，手机在article之后。
- 出口顺序：

- **Compare product series** → `/products/`
- **Read the original label** → `/resources/read-motor-capacitor-label/`
- **All resources** → `/resources/`

- 源码：`src/pages/resources/[slug].astro:26` + guide.related。

### 4.3 `/resources/single-vs-dual-run-capacitors/`

- 页面 → T-GUIDE-ARTICLE (comparison) → 下列模块 → `src/pages/resources/[slug].astro:17-27` + `src/data/guides.ts:44` + `src/data/guideExamples.ts:55`。
- 目录summary/meta description：A dual-run capacitor has two capacitance values and a terminal layout that must match the circuit.
- category=Compare & select（当前不直接显示）。

#### M01 Hero · Single-run vs dual-run capacitors

- H1：**Single-run vs dual-run capacitors**
- answer：A single-run capacitor has one capacitance section. A dual-run can has two, for circuits designed for that arrangement. Specify both µF values as a pair when requesting a quote, along with the rated VAC and terminal-group layout.
- 无Hero媒体。Home / Resources / title 内联Breadcrumb引用共享模式。
- **Specify the run-capacitor arrangement** → `#details-to-send`。
- 无额外产品规格出口；title.includes(code)未命中。
- 源码：`src/pages/resources/[slug].astro:10,18`；`src/data/guides.ts:44-46`。

#### M02 图例 · Read the label and terminal end together

- H2：**Read the label and terminal end together**；id=sample-examples。
- 来源：`src/pages/resources/[slug].astro:21`；`src/data/guideExamples.ts:55`；`src/components/PhotoDetail.astro:2-7`。
- 调用只传 src、alt、complete=true，数据focus/zoom未传入。complete样式 object-fit:contain/transform:none（src/styles/finesse-redesign.css:144-145）。

**样例1：One value on a single-run sample**

- src：`/images/real/cbb65-2.jpg`；public文件已存在。
- alt：CBB65 sample label showing 20 µF ±5%, 450 VAC and 50/60 Hz.
- 说明：The CBB65 sample is marked 20 µF, with one capacitance value on the label.
- 类型：real路径的样品/供应照片；只确认当前来源文本与文件，不外推商业证明。
- 图片链接 aria-label=**Open larger image: CBB65 sample label showing 20 µF ±5%, 450 VAC and 50/60 Hz.**；正文链接 **Open full photograph**；均 → `/images/real/cbb65-2.jpg`，target=_blank、rel=noopener noreferrer。

**样例2：Two capacitance values on a dual-run sample**

- src：`/images/real/cbb65-dual-run-7.jpg`；public文件已存在。
- alt：Photograph of a CBB65 dual-run sample marked 50+5 µF and 450 VAC, with several terminal groups visible.
- 说明：This CBB65 sample is marked 50+5 µF ±5% and 450 VAC. A replacement needs to match both capacitance values and the original terminal mapping.
- 类型：real路径的样品/供应照片；只确认当前来源文本与文件，不外推商业证明。
- 图片链接 aria-label=**Open larger image: Photograph of a CBB65 dual-run sample marked 50+5 µF and 450 VAC, with several terminal groups visible.**；正文链接 **Open full photograph**；均 → `/images/real/cbb65-dual-run-7.jpg`，target=_blank、rel=noopener noreferrer。

#### M03 正文小节 · Keep the two values separate

- H2：**Keep the two values separate**；id=`keep-the-two-values-separate`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:48`。
- 无本节媒体或专用控件。

实际段落：

> Record single or dual-run function. A dual-run label usually separates the capacitances with a plus sign: copy both µF values exactly, without adding them. Use the equipment model and documentation for the required pair and rated VAC.

> Hanxing lists separate CBB65 single-run and R2 dual-capacitance ranges. Check the required pair against an actual model before treating it as available.

该节没有section.links。

#### M04 正文小节 · Match the connections

- H2：**Match the connections**；id=`match-the-connections`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:49`。
- 无本节媒体或专用控件。

实际段落：

> Photograph the terminal end from above, including group labels and blade count, and send the original wiring diagram. Compare the proposed layout, can size and mounting with the original part.

> Qualified personnel must install the capacitor according to the equipment maker’s instructions. Product images are not connection diagrams.

Further reading：

- **Measure the can and mounting** → `/resources/dimensions-terminals-mounting/`

#### M05 References

- H2：**References**；id=references；sources.length>0，本页2条。
- 外部链接target=_blank，rel=noopener noreferrer；未验证外部页面正文。

- **Hanxing · CBB65 product page** → `https://www.hanxingcapacitor.com/products/cbb65-air-conditioner-capacitor/`
- **TDK Electronics · Motor run and start capacitor catalog** → `https://www.tdk-electronics.tdk.com/en/3192232`

- 源码：`src/pages/resources/[slug].astro:23` + guide.sources。

#### M06 询盘 · Specify the run-capacitor arrangement

- H2：**Specify the run-capacitor arrangement**；id=details-to-send。
- note：For dual-run, send the two values as a pair with the terminal mapping.
- **Request a run-capacitor quotation** → `/contact/?guide=single-vs-dual-run-capacitors&request=quote#inquiry-form`。这里只导航，不提交、不确认真实邮件发送。
- **Use the complete RFQ template** → `/buying-guide/#rfq-template`。
- 无媒体或表单控件。源码：`src/pages/resources/[slug].astro:15,24` + guide.inquiry。

#### M07 TOC · On this page

- summary：**On this page**；native details；桌面右侧，手机视觉前置。
- 锚点顺序：

- **Read the label and terminal end together** → `#sample-examples`
- **Keep the two values separate** → `#keep-the-two-values-separate`
- **Match the connections** → `#match-the-connections`
- **References** → `#references`
- **Specify the run-capacitor arrangement** → `#details-to-send`

- 源码：`src/pages/resources/[slug].astro:26,28-35`。

#### M08 Related resources

- H2：**Related resources**；桌面右侧，手机在article之后。
- 出口顺序：

- **CBB65 HVAC capacitors** → `/products/cbb65-air-conditioner-capacitor/`
- **HVAC application** → `/applications/hvac-refrigeration/`
- **All resources** → `/resources/`

- 源码：`src/pages/resources/[slug].astro:26` + guide.related。

### 4.4 `/resources/read-motor-capacitor-label/`

- 页面 → T-GUIDE-ARTICLE (label) → 下列模块 → `src/pages/resources/[slug].astro:17-27` + `src/data/guides.ts:56` + `src/data/guideExamples.ts:56`。
- 目录summary/meta description：Use the sample’s electrical ratings and model details to prepare a purchasing specification.
- category=Understand capacitors（当前不直接显示）。

#### M01 Hero · Reading a motor capacitor label

- H1：**Reading a motor capacitor label**
- answer：Photograph the full label and record the µF, rated VAC, tolerance, frequency, duty marking and model identifier exactly as printed. Add case and terminal measurements separately; these may not appear on the label.
- 无Hero媒体。Home / Resources / title 内联Breadcrumb引用共享模式。
- **Ask about the original part** → `#details-to-send`。
- 无额外产品规格出口；title.includes(code)未命中。
- 源码：`src/pages/resources/[slug].astro:10,18`；`src/data/guides.ts:56-58`。

#### M02 图例 · Electrical ratings on sample labels

- H2：**Electrical ratings on sample labels**；id=sample-examples。
- 来源：`src/pages/resources/[slug].astro:21`；`src/data/guideExamples.ts:56`；`src/components/PhotoDetail.astro:2-7`。
- 调用只传 src、alt、complete=true，数据focus/zoom未传入。complete样式 object-fit:contain/transform:none（src/styles/finesse-redesign.css:144-145）。

**样例1：CBB65 label: capacitance, voltage and frequency**

- src：`/images/real/cbb65-2.jpg`；public文件已存在。
- alt：CBB65 sample label showing 20 µF ±5%, 450 VAC and 50/60 Hz.
- 说明：This sample is marked 20 µF ±5%, 450 VAC and 50/60 Hz. Base the final specification on the label or datasheet for the model you intend to order.
- 类型：real路径的样品/供应照片；只确认当前来源文本与文件，不外推商业证明。
- 图片链接 aria-label=**Open larger image: CBB65 sample label showing 20 µF ±5%, 450 VAC and 50/60 Hz.**；正文链接 **Open full photograph**；均 → `/images/real/cbb65-2.jpg`，target=_blank、rel=noopener noreferrer。

**样例2：Same series, different capacitances**

- src：`/images/real/cbb61-13.jpg`；public文件已存在。
- alt：Three CBB61 samples marked 4.5 µF, 5 µF and 6 µF.
- 说明：The CBB61 cases look similar, but their labels show 4.5 µF, 5 µF and 6 µF. Check the rating before comparing the fit.
- 类型：real路径的样品/供应照片；只确认当前来源文本与文件，不外推商业证明。
- 图片链接 aria-label=**Open larger image: Three CBB61 samples marked 4.5 µF, 5 µF and 6 µF.**；正文链接 **Open full photograph**；均 → `/images/real/cbb61-13.jpg`，target=_blank、rel=noopener noreferrer。

#### M03 正文小节 · Electrical markings

- H2：**Electrical markings**；id=`electrical-markings`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:60`。
- 无本节媒体或专用控件。

实际段落：

> Read capacitance in microfarads (µF) and rated voltage in VAC. Tolerance is the permitted capacitance variation; it does not change the motor maker’s target value. Also record frequency, temperature and duty markings where present.

> Photograph the full label, including the model or batch code and both µF values on a dual-run part. Keep the exact text and all markings in the same frame, and identify the equipment model.

该节没有section.links。

#### M04 正文小节 · Dimensions and connections

- H2：**Dimensions and connections**；id=`dimensions-and-connections`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:61`。
- 无本节媒体或专用控件。

实际段落：

> Add a terminal photo and record body and full installed height, mounting, connector shape and wire length separately. An original sample or dimensioned drawing helps check the fit; use the measurement guide below.

> A sample’s compliance mark does not establish coverage for related models or markets. Check the corresponding certificate for the proposed model and destination.

Further reading：

- **Measure dimensions, terminals and mounting** → `/resources/dimensions-terminals-mounting/`
- **Check model records and certificate scope** → `/factory/#model-records`

#### M05 References

- H2：**References**；id=references；sources.length>0，本页2条。
- 外部链接target=_blank，rel=noopener noreferrer；未验证外部页面正文。

- **Hanxing · CBB65 technical specifications** → `https://www.hanxingcapacitor.com/products/cbb65-air-conditioner-capacitor/`
- **Oriental Motor · AC motor capacitor guidance** → `https://www.orientalmotor.com/products/pdfs/F_TecRef/TecAc.pdf`

- 源码：`src/pages/resources/[slug].astro:23` + guide.sources。

#### M06 询盘 · Ask about the original part

- H2：**Ask about the original part**；id=details-to-send。
- note：Attach the complete label photo, keeping uncertain or unreadable markings visible.
- **Ask about the original part** → `/contact/?guide=read-motor-capacitor-label&request=quote#inquiry-form`。这里只导航，不提交、不确认真实邮件发送。
- **Use the complete RFQ template** → `/buying-guide/#rfq-template`。
- 无媒体或表单控件。源码：`src/pages/resources/[slug].astro:15,24` + guide.inquiry。

#### M07 TOC · On this page

- summary：**On this page**；native details；桌面右侧，手机视觉前置。
- 锚点顺序：

- **Electrical ratings on sample labels** → `#sample-examples`
- **Electrical markings** → `#electrical-markings`
- **Dimensions and connections** → `#dimensions-and-connections`
- **References** → `#references`
- **Ask about the original part** → `#details-to-send`

- 源码：`src/pages/resources/[slug].astro:26,28-35`。

#### M08 Related resources

- H2：**Related resources**；桌面右侧，手机在article之后。
- 出口顺序：

- **Capacitance and voltage guide** → `/resources/capacitance-voltage-guide/`
- **Start versus run duty** → `/resources/start-vs-run-capacitors/`
- **All resources** → `/resources/`

- 源码：`src/pages/resources/[slug].astro:26` + guide.related。

### 4.5 `/resources/capacitance-voltage-guide/`

- 页面 → T-GUIDE-ARTICLE (label) → 下列模块 → `src/pages/resources/[slug].astro:17-27` + `src/data/guides.ts:68` + `src/data/guideExamples.ts:57`。
- 目录summary/meta description：Read µF and VAC as separate ratings and match each one to the motor specification.
- category=Understand capacitors（当前不直接显示）。

#### M01 Hero · Motor capacitor capacitance and voltage

- H1：**Motor capacitor capacitance and voltage**
- answer：Capacitance, measured in µF, and rated AC voltage, shown in VAC, describe different properties. Both must match the motor maker’s requirements. The supply voltage printed on a motor plate does not by itself specify the capacitor rating.
- 无Hero媒体。Home / Resources / title 内联Breadcrumb引用共享模式。
- **Check the model’s ratings** → `#details-to-send`。
- 无额外产品规格出口；title.includes(code)未命中。
- 源码：`src/pages/resources/[slug].astro:10,18`；`src/data/guides.ts:68-70`。

#### M02 图例 · Capacitance and voltage on sample labels

- H2：**Capacitance and voltage on sample labels**；id=sample-examples。
- 来源：`src/pages/resources/[slug].astro:21`；`src/data/guideExamples.ts:57`；`src/components/PhotoDetail.astro:2-7`。
- 调用只传 src、alt、complete=true，数据focus/zoom未传入。complete样式 object-fit:contain/transform:none（src/styles/finesse-redesign.css:144-145）。

**样例1：20 µF is the capacitance**

- src：`/images/real/cbb65-2.jpg`；public文件已存在。
- alt：CBB65 sample label showing 20 µF ±5%, 450 VAC and 50/60 Hz.
- 说明：On this CBB65 label, 20 µF ±5% gives the capacitance and tolerance. The voltage rating is 450 VAC.
- 类型：real路径的样品/供应照片；只确认当前来源文本与文件，不外推商业证明。
- 图片链接 aria-label=**Open larger image: CBB65 sample label showing 20 µF ±5%, 450 VAC and 50/60 Hz.**；正文链接 **Open full photograph**；均 → `/images/real/cbb65-2.jpg`，target=_blank、rel=noopener noreferrer。

**样例2：One voltage rating, three capacitances**

- src：`/images/real/cbb61-13.jpg`；public文件已存在。
- alt：Three CBB61 samples marked 4.5 µF, 5 µF and 6 µF.
- 说明：All three CBB61 samples show 450 VAC. Their capacitances are 4.5 µF, 5 µF and 6 µF.
- 类型：real路径的样品/供应照片；只确认当前来源文本与文件，不外推商业证明。
- 图片链接 aria-label=**Open larger image: Three CBB61 samples marked 4.5 µF, 5 µF and 6 µF.**；正文链接 **Open full photograph**；均 → `/images/real/cbb61-13.jpg`，target=_blank、rel=noopener noreferrer。

#### M03 正文小节 · Match the specified capacitance

- H2：**Match the specified capacitance**；id=`match-the-specified-capacitance`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:72`。
- 无本节媒体或专用控件。

实际段落：

> In a capacitor-run single-phase motor, capacitance contributes to the phase relationship chosen by the motor maker. Increasing µF is not an upgrade. Oriental Motor advises matching its motor’s specified capacitance and rated voltage.

> Start capacitors also require the correct duty rating. Equal µF markings do not make start and run parts interchangeable.

Further reading：

- **Check start versus run duty** → `/resources/start-vs-run-capacitors/`

#### M04 正文小节 · Check the capacitor’s voltage rating

- H2：**Check the capacitor’s voltage rating**；id=`check-the-capacitor-s-voltage-rating`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:73`。
- 无本节媒体或专用控件。

实际段落：

> Compare the original capacitor’s VAC marking with the equipment specification. The motor plate’s line voltage alone cannot specify the capacitor rating, which also depends on circuit conditions.

> Hanxing’s series ranges are an overview. Check the exact model and datasheet for the required capacitance, voltage and case size.

该节没有section.links。

#### M05 References

- H2：**References**；id=references；sources.length>0，本页3条。
- 外部链接target=_blank，rel=noopener noreferrer；未验证外部页面正文。

- **Oriental Motor · AC motor capacitor guidance** → `https://www.orientalmotor.com/products/pdfs/F_TecRef/TecAc.pdf`
- **Oriental Motor · replacement guidance** → `https://faq.orientalmotor.com/can-i-use-capacitors-other-than-the-one-that-comes-with-the-ac-motor`
- **TDK Electronics · Motor run and start capacitor catalog** → `https://www.tdk-electronics.tdk.com/en/3192232`

- 源码：`src/pages/resources/[slug].astro:23` + guide.sources。

#### M06 询盘 · Check the model’s ratings

- H2：**Check the model’s ratings**；id=details-to-send。
- note：Provide the motor specification and original capacitor ratings when requesting the model datasheet.
- **Request a model datasheet** → `/contact/?guide=capacitance-voltage-guide&request=documents#inquiry-form`。这里只导航，不提交、不确认真实邮件发送。
- **Use the complete RFQ template** → `/buying-guide/#rfq-template`。
- 无媒体或表单控件。源码：`src/pages/resources/[slug].astro:15,24` + guide.inquiry。

#### M07 TOC · On this page

- summary：**On this page**；native details；桌面右侧，手机视觉前置。
- 锚点顺序：

- **Capacitance and voltage on sample labels** → `#sample-examples`
- **Match the specified capacitance** → `#match-the-specified-capacitance`
- **Check the capacitor’s voltage rating** → `#check-the-capacitor-s-voltage-rating`
- **References** → `#references`
- **Check the model’s ratings** → `#details-to-send`

- 源码：`src/pages/resources/[slug].astro:26,28-35`。

#### M08 Related resources

- H2：**Related resources**；桌面右侧，手机在article之后。
- 出口顺序：

- **Product series** → `/products/`
- **RFQ checklist** → `/buying-guide/`
- **All resources** → `/resources/`

- 源码：`src/pages/resources/[slug].astro:26` + guide.related。

### 4.6 `/resources/dimensions-terminals-mounting/`

- 页面 → T-GUIDE-ARTICLE (fit) → 下列模块 → `src/pages/resources/[slug].astro:17-27` + `src/data/guides.ts:80` + `src/data/guideExamples.ts:58`。
- 目录summary/meta description：Measure the full installed part, including its terminals, wires and fixing hardware.
- category=Prepare your RFQ（当前不直接显示）。

#### M01 Hero · Motor capacitor dimensions, terminals and mounting

- H1：**Motor capacitor dimensions, terminals and mounting**
- answer：Matching µF and VAC does not guarantee a physical fit. Measure the body and allow room for the mounting stud, terminals, wires and connector.
- 无Hero媒体。Home / Resources / title 内联Breadcrumb引用共享模式。
- **Check the proposed drawing** → `#details-to-send`。
- 无额外产品规格出口；title.includes(code)未命中。
- 源码：`src/pages/resources/[slug].astro:10,18`；`src/data/guides.ts:80-82`。

#### M02 图例 · Mechanical details visible in the samples

- H2：**Mechanical details visible in the samples**；id=sample-examples。
- 来源：`src/pages/resources/[slug].astro:21`；`src/data/guideExamples.ts:58`；`src/components/PhotoDetail.astro:2-7`。
- 调用只传 src、alt、complete=true，数据focus/zoom未传入。complete样式 object-fit:contain/transform:none（src/styles/finesse-redesign.css:144-145）。

**样例1：Allow space for the fixing stud**

- src：`/images/real/cbb60-18.jpg`；public文件已存在。
- alt：Two CBB60 samples showing lead exits and a threaded mounting stud.
- 说明：The CBB60 base stud extends beyond the case. Include the stud, leads and connector clearance when measuring the installed space; the photograph has no dimension scale.
- 类型：real路径的样品/供应照片；只确认当前来源文本与文件，不外推商业证明。
- 图片链接 aria-label=**Open larger image: Two CBB60 samples showing lead exits and a threaded mounting stud.**；正文链接 **Open full photograph**；均 → `/images/real/cbb60-18.jpg`，target=_blank、rel=noopener noreferrer。

**样例2：Check access above the can**

- src：`/images/real/cbb65-2.jpg`；public文件已存在。
- alt：CBB65 sample with two insulated terminal groups visible at the top.
- 说明：Each of the two insulated terminal bases has several metal tabs. Use the proposed model’s drawing to check its connection layout.
- 类型：real路径的样品/供应照片；只确认当前来源文本与文件，不外推商业证明。
- 图片链接 aria-label=**Open larger image: CBB65 sample with two insulated terminal groups visible at the top.**；正文链接 **Open full photograph**；均 → `/images/real/cbb65-2.jpg`，target=_blank、rel=noopener noreferrer。

#### M03 正文小节 · Measure the space available

- H2：**Measure the space available**；id=`measure-the-space-available`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:84`。
- 无本节媒体或专用控件。

实际段落：

> For a cylindrical case, measure diameter, body height and full height with terminals. For a rectangular case, measure length, width and height. A dimensioned sketch should show the mounting position and clearance for fixing hardware, wires and connectors.

> Hanxing’s CBB60, CBB61, CBB65 and CD60 pages give series dimensional ranges. Check the fit against the individual model’s approved drawing.

该节没有section.links。

#### M04 正文小节 · Show the connection end

- H2：**Show the connection end**；id=`show-the-connection-end`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:85`。
- 无本节媒体或专用控件。

实际段落：

> Take direct terminal-end and side photos. For blades, record terminal groups and use the drawing to check blade width, orientation and spacing. For wires, record count, specified colors, length and connector.

> A front view can hide connections. Include the mating connector information; send the original sample or drawing if the connector or bracket is unusual.

该节没有section.links。

#### M05 References

- H2：**References**；id=references；sources.length>0，本页3条。
- 外部链接target=_blank，rel=noopener noreferrer；未验证外部页面正文。

- **Hanxing · CBB60 dimensions and terminals** → `https://www.hanxingcapacitor.com/products/cbb60-motor-run-capacitor/`
- **Hanxing · CBB61 dimensions and terminals** → `https://www.hanxingcapacitor.com/products/cbb61-fan-capacitor/`
- **Hanxing · CBB65 dimensions and terminals** → `https://www.hanxingcapacitor.com/products/cbb65-air-conditioner-capacitor/`

- 源码：`src/pages/resources/[slug].astro:23` + guide.sources。

#### M06 询盘 · Check the proposed drawing

- H2：**Check the proposed drawing**；id=details-to-send。
- note：Send the dimensioned sketch and connection views to compare the full installed fit.
- **Request a model drawing** → `/contact/?guide=dimensions-terminals-mounting&request=documents#inquiry-form`。这里只导航，不提交、不确认真实邮件发送。
- **Use the complete RFQ template** → `/buying-guide/#rfq-template`。
- 无媒体或表单控件。源码：`src/pages/resources/[slug].astro:15,24` + guide.inquiry。

#### M07 TOC · On this page

- summary：**On this page**；native details；桌面右侧，手机视觉前置。
- 锚点顺序：

- **Mechanical details visible in the samples** → `#sample-examples`
- **Measure the space available** → `#measure-the-space-available`
- **Show the connection end** → `#show-the-connection-end`
- **References** → `#references`
- **Check the proposed drawing** → `#details-to-send`

- 源码：`src/pages/resources/[slug].astro:26,28-35`。

#### M08 Related resources

- H2：**Related resources**；桌面右侧，手机在article之后。
- 出口顺序：

- **OEM & Private Label** → `/oem/`
- **Model records** → `/factory/#model-records`
- **All resources** → `/resources/`

- 源码：`src/pages/resources/[slug].astro:26` + guide.related。

### 4.7 `/resources/motor-capacitor-order-shipment-checklist/`

- 页面 → T-GUIDE-ARTICLE (sequence) → 下列模块 → `src/pages/resources/[slug].astro:17-27` + `src/data/guides.ts:92` + `src/data/guideExamples.ts:59`。
- 目录summary/meta description：Use the same order reference for the approved product, packing plan and shipping records.
- category=Prepare your RFQ（当前不直接显示）。

#### M01 Hero · Motor capacitor order and shipment checklist

- H1：**Motor capacitor order and shipment checklist**
- answer：Before production and dispatch, the purchase order should identify the model, drawing revision, quantity, packaging and delivery term. Agree on the inspection and transport records for that order, then check the final documents before carrier pickup.
- 无Hero媒体。Home / Resources / title 内联Breadcrumb引用共享模式。
- **Discuss the order requirements** → `#details-to-send`。
- 无额外产品规格出口；title.includes(code)未命中。
- 源码：`src/pages/resources/[slug].astro:10,18`；`src/data/guides.ts:92-94`。

#### M02 图例 · Packing and shipment checks

- H2：**Packing and shipment checks**；id=sample-examples。
- 来源：`src/pages/resources/[slug].astro:21`；`src/data/guideExamples.ts:59`；`src/components/PhotoDetail.astro:2-7`。
- 调用只传 src、alt、complete=true，数据focus/zoom未传入。complete样式 object-fit:contain/transform:none（src/styles/finesse-redesign.css:144-145）。

**样例1：Supplied packing photograph**

- src：`/images/real/packing-scene.jpg`；public文件已存在。
- alt：Supplied photograph of capacitor boxes and packing work at Hanxing.
- 说明：This source photo shows a packing arrangement. For your order, compare dated packout photos with the approved protection, dividers and units per carton.
- 类型：real路径的样品/供应照片；只确认当前来源文本与文件，不外推商业证明。
- 图片链接 aria-label=**Open larger image: Supplied photograph of capacitor boxes and packing work at Hanxing.**；正文链接 **Open full photograph**；均 → `/images/real/packing-scene.jpg`，target=_blank、rel=noopener noreferrer。

**样例2：Carton count and marks**

- src：`/images/illustrative/warehouse-staging.webp`；public文件已存在。
- alt：Illustration of cartons grouped on pallets in a warehouse staging area.
- 说明：This illustration is not an order record. Use dated photos of the packed order to compare carton count and marks with the packing list.
- 类型：插图；组件显示 Illustration · not an actual order or shipment record.
- 图片链接 aria-label=**Open larger image: Illustration of cartons grouped on pallets in a warehouse staging area.**；正文链接 **Open illustration**；均 → `/images/illustrative/warehouse-staging.webp`，target=_blank、rel=noopener noreferrer。

**样例3：Order references on shipping documents**

- src：`/images/illustrative/export-document-review.webp`；public文件已存在。
- alt：Illustration of shipping forms being checked beside a carton.
- 说明：This illustration is not a shipping document. Check the actual invoice, packing list and transport record for the same order reference and quantities.
- 类型：插图；组件显示 Illustration · not an actual order or shipment record.
- 图片链接 aria-label=**Open larger image: Illustration of shipping forms being checked beside a carton.**；正文链接 **Open illustration**；均 → `/images/illustrative/export-document-review.webp`，target=_blank、rel=noopener noreferrer。

#### M03 正文小节 · 1. Set the product and order details

- H2：**1. Set the product and order details**；id=`1-set-the-product-and-order-details`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:96`。
- 无本节媒体或专用控件。

paragraphs=[]，不生成p。

实际列表（顺序原样）：

- Match the quotation and purchase order: series, exact model, electrical ratings, drawing revision, connection layout and quantity by model. Record written approval of alternatives; attach sample approval, label artwork and the packing specification for private-label work.
- Write down price, currency, payment schedule, quotation validity, sample or tooling charges and the basis for lead time.
- Agree the delivery term and named place, shipping method and freight responsibility. A series page or sample photo does not settle these order terms.

该节没有section.links。

#### M04 正文小节 · 2. Approve the packout

- H2：**2. Approve the packout**；id=`2-approve-the-packout`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:97`。
- 无本节媒体或专用控件。

paragraphs=[]，不生成p。

实际列表（顺序原样）：

- Specify individual protection, clearance around terminals or leads, units per inner pack and carton, carton marks and language, plus any pallet or handling requirements.
- Retain approved artwork and the packing specification for checking changes. Record carton count, dimensions and gross and net weights for the buyer and forwarder.

该节没有section.links。

#### M05 正文小节 · 3. Record dispatch dates and checks

- H2：**3. Record dispatch dates and checks**；id=`3-record-dispatch-dates-and-checks`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:98`。
- 无本节媒体或专用控件。

paragraphs=[]，不生成p。

实际列表（顺序原样）：

- Record production-ready, inspection-release, carrier-pickup, departure and estimated-arrival dates separately. Mark which are confirmed and name the person reporting delays or partial shipments. Agree how partial shipments are approved.
- Agree inspection scope, acceptance criteria and record format, including required sample testing, lot or sample identification and packing photos.
- Packing photos show visible condition; they do not establish electrical results or the contents of every carton.

该节没有section.links。

#### M06 正文小节 · 4. Check documents against the shipping route

- H2：**4. Check documents against the shipping route**；id=`4-check-documents-against-the-shipping-route`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:99`。
- 无本节媒体或专用控件。

paragraphs=[]，不生成p。

实际列表（顺序原样）：

- Review draft invoice and packing list before dispatch. Match seller and buyer names, description, model, quantities, package count, weights, declared values, currency and delivery term to the approved order.
- Check the route-specific bill of lading, air waybill or courier waybill for consignee and shipment reference.
- Agree the issuer and scope for origin, inspection, export or compliance documents required by the destination and contract.

该节没有section.links。

#### M07 正文小节 · 5. Agree a route for discrepancies

- H2：**5. Agree a route for discrepancies**；id=`5-agree-a-route-for-discrepancies`。
- 源码：`src/pages/resources/[slug].astro:22`；`src/data/guides.ts:100`。
- 无本节媒体或专用控件。

paragraphs=[]，不生成p。

实际列表（顺序原样）：

- Name the contact and reporting method for specification, packing or quantity mismatches. Agree how changes, shortages, transit damage and nonconforming goods will be handled.
- Put any warranty period, claim deadline and responsible party in the written terms.
- File drawing and sample approval, quotation, purchase order, inspection record and final shipping documents under one order reference.

该节没有section.links。

#### M08 References

- H2：**References**；id=references；sources.length>0，本页2条。
- 外部链接target=_blank，rel=noopener noreferrer；未验证外部页面正文。

- **International Trade Administration · Common Export Documents** → `https://www.trade.gov/common-export-documents`
- **ICC · Incoterms 2020 named place and delivery** → `https://library.iccwbo.org/clp/clp-incoterms-qa-2020.htm?AGENT=ICC_HQ`

- 源码：`src/pages/resources/[slug].astro:23` + guide.sources。

#### M09 询盘 · Discuss the order requirements

- H2：**Discuss the order requirements**；id=details-to-send。
- note：Use the five checks above under a single order reference, and identify what still needs agreement.
- **Discuss an order requirement** → `/contact/?guide=motor-capacitor-order-shipment-checklist&request=quote#inquiry-form`。这里只导航，不提交、不确认真实邮件发送。
- **Use the complete RFQ template** → `/buying-guide/#rfq-template`。
- 无媒体或表单控件。源码：`src/pages/resources/[slug].astro:15,24` + guide.inquiry。

#### M10 TOC · On this page

- summary：**On this page**；native details；桌面右侧，手机视觉前置。
- 锚点顺序：

- **Packing and shipment checks** → `#sample-examples`
- **1. Set the product and order details** → `#1-set-the-product-and-order-details`
- **2. Approve the packout** → `#2-approve-the-packout`
- **3. Record dispatch dates and checks** → `#3-record-dispatch-dates-and-checks`
- **4. Check documents against the shipping route** → `#4-check-documents-against-the-shipping-route`
- **5. Agree a route for discrepancies** → `#5-agree-a-route-for-discrepancies`
- **References** → `#references`
- **Discuss the order requirements** → `#details-to-send`

- 源码：`src/pages/resources/[slug].astro:26,28-35`。

#### M11 Related resources

- H2：**Related resources**；桌面右侧，手机在article之后。
- 出口顺序：

- **OEM and private-label requirements** → `/oem/`
- **Model documents and quality review** → `/factory/#model-records`
- **Packing and dispatch guide** → `/factory/packing-and-dispatch/`
- **All resources** → `/resources/`

- 源码：`src/pages/resources/[slug].astro:26` + guide.related。


## public独立页面业务模块

### `/home-directions-20261010/a.html` · T-PUBLIC-HOME-DEMO

共享引用：S10。独立 HTML 中没有正式站 BaseLayout、Footer 联系资料或后台接入。下表包含当前真实内容，不能用正式首页内容补齐该试验页。

| ID | 名称/实际标题 | 核心内容 | 图片/视频 | 交互/CTA | 源码 |
|---|---|---|---|---|---|
| M01 | Motor capacitors. Clearly matched. / CBB60 / CBB61 / CBB65 / CD60 | Motor capacitors. Clearly matched. Motor run and start capacitors for pumps, fans, HVAC and appliance motors. Find your capacitor ↗ CBB60 Motor run · Pumps Review this series ↗ CBB61 Fan run · Fans & blowers Review this series ↗ CBB65 HVAC run · Single & dual Review this series ↗ CD60 Motor start · Start duty Review this series ↗ Original sample photographs. Confirm the rating, connections and dimensions for your model. | assets/cbb60-hanxing-wired.jpg — Original CBB60 capacitor sample photograph；assets/cbb61-13.jpg — Original CBB61 capacitor sample photograph；assets/cbb65-2.jpg — Original CBB65 capacitor sample photograph；assets/cd60-25.jpg — Original CD60 capacitor sample photograph；无视频 | Find your capacitor ↗ → #series；Review this series ↗ → #inquiry；Review this series ↗ → #inquiry；Review this series ↗ → #inquiry；Review this series ↗ → #inquiry | public/home-directions-20261010/a.html:4 |
| M02 | 无可见标题；strip | Run duty · CBB60 / CBB61 / CBB65 Start duty · CD60 Match the label, dimensions & connections | 无；无视频 | 无 | public/home-directions-20261010/a.html:4 |
| M03 | A closer look at production. | Film handling equipment · supplied production video still A closer look at production. Explore the supplied manufacturing footage. Request drawings and model-specific records for the capacitor you need. Request model records ↗ | assets/film-rolls.jpg — Film handling equipment from supplied production footage；无视频 | Request model records ↗ → #inquiry | public/home-directions-20261010/a.html:4 |

### `/home-directions-20261010/b.html` · T-PUBLIC-HOME-DEMO

共享引用：S10。独立 HTML 中没有正式站 BaseLayout、Footer 联系资料或后台接入。下表包含当前真实内容，不能用正式首页内容补齐该试验页。

| ID | 名称/实际标题 | 核心内容 | 图片/视频 | 交互/CTA | 源码 |
|---|---|---|---|---|---|
| M01 | The right capacitor. A considered choice. | The right capacitor. A considered choice. Motor run and start capacitors for pumps, fans, HVAC and appliance motors. Explore the series ↗ CBB60 / CBB61 / CBB65 / CD60 Match the original motor specification. CBB65 · original sample photograph | assets/cbb65-2.jpg — Original Hanxing CBB65 20 microfarad sample；无视频 | Explore the series ↗ → #series | public/home-directions-20261010/b.html:4 |
| M02 | A series for your application. / CBB60 / CBB61 / CBB65 / CD60 | A series for your application. Four families, organised by circuit duty and equipment. CBB60 Motor run · Pumps CBB61 Fan run · Fans & blowers CBB65 HVAC run · Single & dual CD60 Motor start · Start duty | assets/cbb60-hanxing-wired.jpg — Original CBB60 sample；assets/cbb61-13.jpg — Original CBB61 sample；assets/cbb65-2.jpg — Original CBB65 sample；assets/cd60-25.jpg — Original CD60 sample；无视频 | 无 | public/home-directions-20261010/b.html:4 |
| M03 | Send us the capacitor specification. | Send us the capacitor specification. Include the original label or drawing, quantity and destination. Prepare an inquiry ↗ | 无；无视频 | Prepare an inquiry ↗ → #top | public/home-directions-20261010/b.html:4 |

### `/home-directions-20261010/c.html` · T-PUBLIC-HOME-DEMO

共享引用：S10。独立 HTML 中没有正式站 BaseLayout、Footer 联系资料或后台接入。下表包含当前真实内容，不能用正式首页内容补齐该试验页。

| ID | 名称/实际标题 | 核心内容 | 图片/视频 | 交互/CTA | 源码 |
|---|---|---|---|---|---|
| M01 | Match the motor. Specify the capacitor. | Match the motor. Specify the capacitor. Motor run and start capacitors for pumps, fans, HVAC and appliance motors. Compare the series ↗ Prepare a specification Electrical rating Capacitance · AC voltage · Duty Mechanical fit Dimensions · Terminals · Mounting CBB60 / Motor run / Original sample | assets/cbb60-hanxing-wired.jpg — Original wired CBB60 capacitor；无视频 | Compare the series ↗ → #series；Prepare a specification → #inquiry | public/home-directions-20261010/c.html:4 |
| M02 | Compare by duty & application. | Compare by duty & application. CBB60 Run duty Pumps ↗ CBB61 Run duty Fans & blowers ↗ CBB65 Run duty Single & dual ↗ CD60 Start duty Start duty ↗ Confirm each model against the original label and motor drawing. | assets/cbb60-hanxing-wired.jpg — CBB60 original sample；assets/cbb61-13.jpg — CBB61 original sample；assets/cbb65-2.jpg — CBB65 original sample；assets/cd60-25.jpg — CD60 original sample；无视频 | ↗ → #inquiry；↗ → #inquiry；↗ → #inquiry；↗ → #inquiry | public/home-directions-20261010/c.html:4 |
| M03 | Send us the capacitor specification. | Send us the capacitor specification. Include the original label or drawing, quantity and destination. Prepare an inquiry ↗ | 无；无视频 | Prepare an inquiry ↗ → #top | public/home-directions-20261010/c.html:4 |

### `/home-directions-20261010/d.html` · T-PUBLIC-HOME-DEMO

共享引用：S10。独立 HTML 中没有正式站 BaseLayout、Footer 联系资料或后台接入。下表包含当前真实内容，不能用正式首页内容补齐该试验页。

| ID | 名称/实际标题 | 核心内容 | 图片/视频 | 交互/CTA | 源码 |
|---|---|---|---|---|---|
| M01 | Capacitor supply for equipment manufacturers. | Capacitor supply for equipment manufacturers. Motor run and start capacitors for pumps, fans, HVAC and appliance motors. Find your capacitor ↗ CBB60 / CBB61 / CBB65 / CD60 CBB65 samples · original photograph | assets/batch-products.jpg — Original photograph of CBB65 metal-can capacitor samples；无视频 | Find your capacitor ↗ → #series | public/home-directions-20261010/d.html:4 |
| M02 | See the series. Check the fit. / CBB60 / CBB61 / CBB65 / CD60 | See the series. Check the fit. Start with the motor specification. Compare your requirements ↗ CBB60 Motor run · Pumps Review this series ↗ CBB61 Fan run · Fans & blowers Review this series ↗ CBB65 HVAC run · Single & dual Review this series ↗ CD60 Motor start · Start duty Review this series ↗ Original sample photographs. Confirm the rating, connections and dimensions for your model. | assets/cbb60-hanxing-wired.jpg — Original CBB60 capacitor sample photograph；assets/cbb61-13.jpg — Original CBB61 capacitor sample photograph；assets/cbb65-2.jpg — Original CBB65 capacitor sample photograph；assets/cd60-25.jpg — Original CD60 capacitor sample photograph；无视频 | Compare your requirements ↗ → #inquiry；Review this series ↗ → #inquiry；Review this series ↗ → #inquiry；Review this series ↗ → #inquiry；Review this series ↗ → #inquiry | public/home-directions-20261010/d.html:4 |
| M03 | A closer look at production. | Film handling equipment · supplied production video still A closer look at production. Explore the supplied manufacturing footage. Request drawings and model-specific records for the capacitor you need. Request model records ↗ | assets/film-rolls.jpg — Film handling equipment from supplied production footage；无视频 | Request model records ↗ → #inquiry | public/home-directions-20261010/d.html:4 |

### `/home-directions-20261010/e.html` · T-PUBLIC-HOME-DEMO

共享引用：S10。独立 HTML 中没有正式站 BaseLayout、Footer 联系资料或后台接入。下表包含当前真实内容，不能用正式首页内容补齐该试验页。

| ID | 名称/实际标题 | 核心内容 | 图片/视频 | 交互/CTA | 源码 |
|---|---|---|---|---|---|
| M01 | Find the capacitor for your equipment. | Find the capacitor for your equipment. Motor run and start capacitors for pumps, fans, HVAC and appliance motors. CBB61 fan capacitors · original sample photographs Pumps CBB60 · Motor run ↗ Fans & blowers CBB61 · Fan run ↗ Single & dual CBB65 · HVAC run ↗ Start duty CD60 · Motor start ↗ | assets/cbb61-13.jpg — Three original rectangular CBB61 capacitor samples；无视频 | Pumps CBB60 · Motor run ↗ → #inquiry；Fans & blowers CBB61 · Fan run ↗ → #inquiry；Single & dual CBB65 · HVAC run ↗ → #inquiry；Start duty CD60 · Motor start ↗ → #inquiry | public/home-directions-20261010/e.html:4 |
| M02 | Look inside the process. / A clearer specification. A better starting point. | Look inside the process. Supplied production footage, Request model-specific drawings and records for your selection. Film handling equipment · supplied video still A clearer specification. A better starting point. Original label or drawing Rating, dimensions & connections Quantity & destination Prepare an inquiry ↗ | assets/film-rolls.jpg — Film roll on production equipment；无视频 | Prepare an inquiry ↗ → #top | public/home-directions-20261010/e.html:4 |

### `/home-directions-20261010/r2/editorial.html` · T-PUBLIC-HOME-DEMO

共享引用：S10。独立 HTML 中没有正式站 BaseLayout、Footer 联系资料或后台接入。下表包含当前真实内容，不能用正式首页内容补齐该试验页。

| ID | 名称/实际标题 | 核心内容 | 图片/视频 | 交互/CTA | 源码 |
|---|---|---|---|---|---|
| M01 | A small component. A precise choice. | CBB60 · Motor run Original sample A small component. A precise choice. Motor run and start capacitors for pumps, fans, HVAC and appliance motors. Explore the series → CBB60 / CBB61 / CBB65 / CD60 | assets/cbb60-hanxing-wired.jpg — Original white CBB60 capacitor with insulated leads（CSS背景）；无视频 | Explore the series → → #series | public/home-directions-20261010/r2/editorial.html:5 |
| M02 | Motor run. / Motor start. | Motor run. CBB60, CBB61 and CBB65. For a matching run circuit. Run series → Motor start. CD60. For a switched starting circuit. Explore CD60 → | assets/cbb65-2.jpg — Original CBB65 run-capacitor sample（CSS背景）；assets/cd60-25.jpg — Original CD60 start-capacitor sample（CSS背景）；无视频 | Run series → → #inquiry；Explore CD60 → → #inquiry | public/home-directions-20261010/r2/editorial.html:5 |
| M03 | Start with your specification. | Start with your specification. Send the original capacitor label or drawing, quantity and destination. Prepare an inquiry → | 无；无视频 | Prepare an inquiry → → #top | public/home-directions-20261010/r2/editorial.html:5 |

### `/home-directions-20261010/r2/object.html` · T-PUBLIC-HOME-DEMO

共享引用：S10。独立 HTML 中没有正式站 BaseLayout、Footer 联系资料或后台接入。下表包含当前真实内容，不能用正式首页内容补齐该试验页。

| ID | 名称/实际标题 | 核心内容 | 图片/视频 | 交互/CTA | 源码 |
|---|---|---|---|---|---|
| M01 | Motor capacitors. Run & start. | Motor capacitors. Run & start. For pumps, fans, HVAC and appliance motors. Explore the products → CBB60 · CBB61 · CBB65 · CD60 CBB65 · HVAC run Original sample | assets/cbb65-2.jpg — Original Hanxing CBB65 sample, marked 20 microfarads and 450 VAC（CSS背景）；无视频 | Explore the products → → #series | public/home-directions-20261010/r2/object.html:5 |
| M02 | Four series. A clear starting point. / CBB60 / CBB61 / CBB65 / CD60 | Four series. A clear starting point. Run or start duty. The original motor specification comes first. CBB60 Motor run · Pumps & motor systems CBB61 Fan run · Fans & blowers CBB65 HVAC run · Single & dual configurations CD60 Motor start · Switched starting circuits Original sample photographs. Match the rating, dimensions and connections to your motor specification. | assets/cbb60-hanxing-wired.jpg — Original CBB60 capacitor sample photograph（CSS背景）；assets/cbb61-13.jpg — Original CBB61 capacitor sample photograph（CSS背景）；assets/cbb65-2.jpg — Original CBB65 capacitor sample photograph（CSS背景）；assets/cd60-25.jpg — Original CD60 capacitor sample photograph（CSS背景）；无视频 | CBB60 Motor run · Pumps & motor systems → #inquiry；CBB61 Fan run · Fans & blowers → #inquiry；CBB65 HVAC run · Single & dual configurations → #inquiry；CD60 Motor start · Switched starting circuits → #inquiry | public/home-directions-20261010/r2/object.html:5 |
| M03 | The product. The process behind it. | Film handling · supplied production video still The product. The process behind it. Explore the supplied production footage and request records for the model you need. Request model records → | assets/film-rolls.jpg — Film handling equipment from supplied production footage；无视频 | Request model records → → #inquiry | public/home-directions-20261010/r2/object.html:5 |

### `/home-directions-20261010/r2/red-object.html` · T-PUBLIC-HOME-DEMO

共享引用：S10。独立 HTML 中没有正式站 BaseLayout、Footer 联系资料或后台接入。下表包含当前真实内容，不能用正式首页内容补齐该试验页。

| ID | 名称/实际标题 | 核心内容 | 图片/视频 | 交互/CTA | 源码 |
|---|---|---|---|---|---|
| M01 | Fan capacitors. In focus. / CBB61 · Fan run | Fan capacitors. In focus. CBB61 · Fan run Original sample photographs Compact motor-run formats for fans, blowers and appliance motors. See all series → | assets/cbb61-leads-10.jpg — Two original red CBB61 fan-capacitor samples（CSS背景）；无视频 | See all series → → #series | public/home-directions-20261010/r2/red-object.html:5 |
| M02 | Other forms. Other applications. / CBB60 / CBB65 / CD60 | Other forms. Other applications. Explore CBB60, CBB65 and CD60. Match the original motor specification. CBB60 Motor run · Pumps & motor systems CBB65 HVAC run · Single & dual configurations CD60 Motor start · Switched starting circuits Original sample photographs | assets/cbb60-hanxing-wired.jpg — Original CBB60 sample photograph（CSS背景）；assets/cbb65-2.jpg — Original CBB65 sample photograph（CSS背景）；assets/cd60-25.jpg — Original CD60 sample photograph（CSS背景）；无视频 | CBB60 Motor run · Pumps & motor systems → #inquiry；CBB65 HVAC run · Single & dual configurations → #inquiry；CD60 Motor start · Switched starting circuits → #inquiry | public/home-directions-20261010/r2/red-object.html:5 |
| M03 | Start with your specification. | Start with your specification. Send the original capacitor label or drawing, quantity and destination. Prepare an inquiry → | 无；无视频 | Prepare an inquiry → → #top | public/home-directions-20261010/r2/red-object.html:5 |

### `/home-directions-20261010/r2/studio.html` · T-PUBLIC-HOME-DEMO

共享引用：S10。独立 HTML 中没有正式站 BaseLayout、Footer 联系资料或后台接入。下表包含当前真实内容，不能用正式首页内容补齐该试验页。

| ID | 名称/实际标题 | 核心内容 | 图片/视频 | 交互/CTA | 源码 |
|---|---|---|---|---|---|
| M01 | Motor run. Motor start. | Motor run. Motor start. Four capacitor series for your equipment. Find your series → CBB60 Motor run CBB65 HVAC run CBB61 Fan run Original capacitor samples | assets/cbb60-hanxing-wired.jpg — Original wired CBB60 sample（CSS背景）；assets/cbb65-2.jpg — Original CBB65 metal-can sample（CSS背景）；assets/cbb61-leads-10.jpg — Original red CBB61 fan-capacitor samples（CSS背景）；无视频 | Find your series → → #series；CBB60 Motor run → #inquiry；CBB65 HVAC run → #inquiry；CBB61 Fan run → #inquiry | public/home-directions-20261010/r2/studio.html:5 |
| M02 | CD60 | CD60 Motor start · Switched starting circuits Match run or start duty to your original motor specification. Prepare your specification → | assets/cd60-25.jpg — Original CD60 start-capacitor sample（CSS背景）；无视频 | Prepare your specification → → #inquiry | public/home-directions-20261010/r2/studio.html:5 |
| M03 | The product. The process behind it. | Film handling · supplied production video still The product. The process behind it. Explore the supplied production footage and request records for the model you need. Request model records → | assets/film-rolls.jpg — Film handling equipment from supplied production footage；无视频 | Request model records → → #inquiry | public/home-directions-20261010/r2/studio.html:5 |

### `/home-directions-20261010/r2/style-explorer.html` · T-PUBLIC-EXPLORER

共享引用：S11。以下两个 main 是互斥视图，不是同时可见的两个纵向区块。初始脚本默认并排；候选内容在 sandbox iframe 中，不作为本站新增业务路由重复计数。

| ID | 名称/实际标题 | 核心内容与媒体 | 交互/CTA | 源码 |
|---|---|---|---|---|
| M01 | 并排候选；无 H1 | 4 个候选：银色单品；白色产品工作室 · 推荐；产品杂志对页；红色单品焦点。每项标题、概念、色板和选择按钮，iframe 的 srcdoc 为生成时嵌入的候选HTML | 单张查看、选择并复制给 Agent；桌面1280/手机390由S11切换；工具内本地选择不修改正式站 | public/home-directions-20261010/r2/style-explorer.html:109–112；脚本 renderGrid/renderCard/choose/copy |
| M02 | 单张详情；候选 name 动态为标题 | 当前候选iframe；信息区 palette/typography/traits/concept；默认 hidden | Previous/Next、左右键、滚动/缩放、选择、复制；该状态及 toast/empty 分支仅源码确认，未逐项操作 | public/home-directions-20261010/r2/style-explorer.html:113–122；脚本 render/renderInfo/go/step/toggleZoom |

### `/home-directions-20261010/style-explorer.html` · T-PUBLIC-EXPLORER

共享引用：S11。以下两个 main 是互斥视图，不是同时可见的两个纵向区块。初始脚本默认并排；候选内容在 sandbox iframe 中，不作为本站新增业务路由重复计数。

| ID | 名称/实际标题 | 核心内容与媒体 | 交互/CTA | 源码 |
|---|---|---|---|---|
| M01 | 并排候选；无 H1 | 5 个候选：白色产品画廊 · 推荐；暖白技术杂志；蓝色工程目录；石墨工业影像；鼠尾草选型工作台。每项标题、概念、色板和选择按钮，iframe 的 srcdoc 为生成时嵌入的候选HTML | 单张查看、选择并复制给 Agent；桌面1280/手机390由S11切换；工具内本地选择不修改正式站 | public/home-directions-20261010/style-explorer.html:109–112；脚本 renderGrid/renderCard/choose/copy |
| M02 | 单张详情；候选 name 动态为标题 | 当前候选iframe；信息区 palette/typography/traits/concept；默认 hidden | Previous/Next、左右键、滚动/缩放、选择、复制；该状态及 toast/empty 分支仅源码确认，未逐项操作 | public/home-directions-20261010/style-explorer.html:113–122；脚本 render/renderInfo/go/step/toggleZoom |

## public独立页面导航实际目标

以下是S10每个实例的实际导航，均为页内锚点；不是正式站一级/二级primaryNav。

| 页面 | 标签 | href | 源码 |
|---|---|---|---|
| `/home-directions-20261010/a.html` | HAN XING | `#top` | public/home-directions-20261010/a.html:4 |
| `/home-directions-20261010/a.html` | Products | `#series` | public/home-directions-20261010/a.html:4 |
| `/home-directions-20261010/a.html` | Selection | `#series` | public/home-directions-20261010/a.html:4 |
| `/home-directions-20261010/a.html` | Inquiry | `#inquiry` | public/home-directions-20261010/a.html:4 |
| `/home-directions-20261010/a.html` | Contact us ↗ | `#inquiry` | public/home-directions-20261010/a.html:4 |
| `/home-directions-20261010/b.html` | HAN XING | `#top` | public/home-directions-20261010/b.html:4 |
| `/home-directions-20261010/b.html` | Products | `#series` | public/home-directions-20261010/b.html:4 |
| `/home-directions-20261010/b.html` | Selection | `#series` | public/home-directions-20261010/b.html:4 |
| `/home-directions-20261010/b.html` | Inquiry | `#inquiry` | public/home-directions-20261010/b.html:4 |
| `/home-directions-20261010/b.html` | Contact us ↗ | `#inquiry` | public/home-directions-20261010/b.html:4 |
| `/home-directions-20261010/c.html` | HAN XING | `#top` | public/home-directions-20261010/c.html:4 |
| `/home-directions-20261010/c.html` | Products | `#series` | public/home-directions-20261010/c.html:4 |
| `/home-directions-20261010/c.html` | Selection | `#series` | public/home-directions-20261010/c.html:4 |
| `/home-directions-20261010/c.html` | Inquiry | `#inquiry` | public/home-directions-20261010/c.html:4 |
| `/home-directions-20261010/c.html` | Contact us ↗ | `#inquiry` | public/home-directions-20261010/c.html:4 |
| `/home-directions-20261010/d.html` | HAN XING | `#top` | public/home-directions-20261010/d.html:4 |
| `/home-directions-20261010/d.html` | Products | `#series` | public/home-directions-20261010/d.html:4 |
| `/home-directions-20261010/d.html` | Selection | `#series` | public/home-directions-20261010/d.html:4 |
| `/home-directions-20261010/d.html` | Inquiry | `#inquiry` | public/home-directions-20261010/d.html:4 |
| `/home-directions-20261010/d.html` | Contact us ↗ | `#inquiry` | public/home-directions-20261010/d.html:4 |
| `/home-directions-20261010/e.html` | HAN XING | `#top` | public/home-directions-20261010/e.html:4 |
| `/home-directions-20261010/e.html` | Products | `#series` | public/home-directions-20261010/e.html:4 |
| `/home-directions-20261010/e.html` | Selection | `#series` | public/home-directions-20261010/e.html:4 |
| `/home-directions-20261010/e.html` | Inquiry | `#inquiry` | public/home-directions-20261010/e.html:4 |
| `/home-directions-20261010/e.html` | Contact us ↗ | `#inquiry` | public/home-directions-20261010/e.html:4 |
| `/home-directions-20261010/r2/editorial.html` | HAN XING | `#top` | public/home-directions-20261010/r2/editorial.html:5 |
| `/home-directions-20261010/r2/editorial.html` | Products | `#series` | public/home-directions-20261010/r2/editorial.html:5 |
| `/home-directions-20261010/r2/editorial.html` | Manufacturing | `#production` | public/home-directions-20261010/r2/editorial.html:5 |
| `/home-directions-20261010/r2/editorial.html` | Contact | `#inquiry` | public/home-directions-20261010/r2/editorial.html:5 |
| `/home-directions-20261010/r2/editorial.html` | Get in touch → | `#inquiry` | public/home-directions-20261010/r2/editorial.html:5 |
| `/home-directions-20261010/r2/object.html` | HAN XING | `#top` | public/home-directions-20261010/r2/object.html:5 |
| `/home-directions-20261010/r2/object.html` | Products | `#series` | public/home-directions-20261010/r2/object.html:5 |
| `/home-directions-20261010/r2/object.html` | Manufacturing | `#production` | public/home-directions-20261010/r2/object.html:5 |
| `/home-directions-20261010/r2/object.html` | Contact | `#inquiry` | public/home-directions-20261010/r2/object.html:5 |
| `/home-directions-20261010/r2/object.html` | Get in touch → | `#inquiry` | public/home-directions-20261010/r2/object.html:5 |
| `/home-directions-20261010/r2/red-object.html` | HAN XING | `#top` | public/home-directions-20261010/r2/red-object.html:5 |
| `/home-directions-20261010/r2/red-object.html` | Products | `#series` | public/home-directions-20261010/r2/red-object.html:5 |
| `/home-directions-20261010/r2/red-object.html` | Manufacturing | `#production` | public/home-directions-20261010/r2/red-object.html:5 |
| `/home-directions-20261010/r2/red-object.html` | Contact | `#inquiry` | public/home-directions-20261010/r2/red-object.html:5 |
| `/home-directions-20261010/r2/red-object.html` | Get in touch → | `#inquiry` | public/home-directions-20261010/r2/red-object.html:5 |
| `/home-directions-20261010/r2/studio.html` | HAN XING | `#top` | public/home-directions-20261010/r2/studio.html:5 |
| `/home-directions-20261010/r2/studio.html` | Products | `#series` | public/home-directions-20261010/r2/studio.html:5 |
| `/home-directions-20261010/r2/studio.html` | Manufacturing | `#production` | public/home-directions-20261010/r2/studio.html:5 |
| `/home-directions-20261010/r2/studio.html` | Contact | `#inquiry` | public/home-directions-20261010/r2/studio.html:5 |
| `/home-directions-20261010/r2/studio.html` | Get in touch → | `#inquiry` | public/home-directions-20261010/r2/studio.html:5 |

## 数据、图库与实例媒体附录

这些字段是源数据库存，不一定全部出现在页面；是否渲染以各M模块和模板条件为准。特别是catalogImage/procurement/notes/decisionChecks/application.checks当前未直接渲染，详见蓝图数据边界。


### CBB60

| 字段 / 显示位置 | 当前数据值 | 源 |
| --- | --- | --- |
| code | CBB60 | src/data/site.ts:40–57 |
| slug | cbb60-motor-run-capacitor | src/data/site.ts:40–57 |
| title | CBB60 motor run capacitors | src/data/site.ts:40–57 |
| shortName | Motor run | src/data/site.ts:40–57 |
| function | Run | src/data/site.ts:40–57 |
| tagline | Run capacitors for pumps and other single-phase motors with matching specifications. | src/data/site.ts:40–57 |
| intro | Hanxing lists the CBB60 metallized polypropylene film series for water pumps, washing machines, smoke exhaust equipment and other single-phase motor systems. Use the motor specification to identify the required rating and connection. | src/data/site.ts:40–57 |
| image | /images/real/cbb60-hanxing-wired.jpg | src/data/site.ts:40–57 |
| imageAlt | Photograph of a Hanxing-marked white CBB60 capacitor sample with two insulated leads. | src/data/site.ts:40–57 |
| catalogImage | /images/generated/site/cbb60-main.webp | src/data/site.ts:40–57 |
| catalogImageAlt | Cylindrical motor-run capacitor with two insulated leads and a threaded mounting stud. | src/data/site.ts:40–57 |
| capacitance | 2–100 µF | src/data/site.ts:40–57 |
| voltage | 110–450 VAC | src/data/site.ts:40–57 |
| tolerance | ±5% (J), ±10% (K) | src/data/site.ts:40–57 |
| frequency | 50/60 Hz | src/data/site.ts:40–57 |
| temperature | −40 to +85 °C | src/data/site.ts:40–57 |
| dimensions | Diameter 30–60 mm; height 60–125 mm (series range) | src/data/site.ts:40–57 |
| construction | Metallized polypropylene film in an insulated plastic case. | src/data/site.ts:40–57 |
| terminals | Lead wire or quick-connect terminal; verify the format for the requested model. | src/data/site.ts:40–57 |
| applications | Water pumps；Washing machines；Smoke exhaust equipment；Compatible single-phase motors | src/data/site.ts:40–57 |
| procurement | Original motor or capacitor label；Capacitance and rated voltage；Body size and mounting space；Wire or terminal format；Quantity and destination | src/data/site.ts:40–57 |
| notes | The series ranges do not establish availability for every rating and case size. Ask about the combination you need.；Check wire length, life class and certificate coverage for the proposed model. | src/data/site.ts:40–57 |
| decisionChecks | Check that the motor drawing calls for run duty.；Record the original µF, VAC and frequency markings.；Measure the body, fixing stud and installed lead clearance. | src/data/site.ts:40–57 |
| decisionGuide | {"label":"Check run versus start duty","href":"/resources/start-vs-run-capacitors/"} | src/data/site.ts:40–57 |
| source | https://www.hanxingcapacitor.com/products/cbb60-motor-run-capacitor/ | src/data/site.ts:40–57 |

### CBB61

| 字段 / 显示位置 | 当前数据值 | 源 |
| --- | --- | --- |
| code | CBB61 | src/data/site.ts:58–75 |
| slug | cbb61-fan-capacitor | src/data/site.ts:58–75 |
| title | CBB61 fan capacitors | src/data/site.ts:58–75 |
| shortName | Fan run | src/data/site.ts:58–75 |
| function | Run | src/data/site.ts:58–75 |
| tagline | A compact motor-run format for fans, blowers and appliance motors. | src/data/site.ts:58–75 |
| intro | CBB61 has a rectangular case and metallized polypropylene film construction. Hanxing lists it for fans, blowers, selected air conditioners and washing machines, and small single-phase motors. Check case size and lead arrangement alongside the electrical rating. | src/data/site.ts:58–75 |
| image | /images/real/cbb61-13.jpg | src/data/site.ts:58–75 |
| imageAlt | Photograph of three rectangular CBB61 samples with blade terminals. | src/data/site.ts:58–75 |
| catalogImage | /images/generated/site/cbb61-main.webp | src/data/site.ts:58–75 |
| catalogImageAlt | Rectangular motor capacitor housing with blade terminals. | src/data/site.ts:58–75 |
| capacitance | 0.5–35 µF | src/data/site.ts:58–75 |
| voltage | 110–450 VAC | src/data/site.ts:58–75 |
| tolerance | ±5% (J), ±10% (K) | src/data/site.ts:58–75 |
| frequency | 50/60 Hz | src/data/site.ts:58–75 |
| temperature | −40 to +85 °C | src/data/site.ts:58–75 |
| dimensions | L 37–73 × W 12–40 × H 24–53 mm (series range) | src/data/site.ts:58–75 |
| construction | Metallized polypropylene film in an insulated plastic shell. | src/data/site.ts:58–75 |
| terminals | Lead wire or quick-connect terminal; verify the format for the requested model. | src/data/site.ts:58–75 |
| applications | Fans；Blowers；Selected air conditioners；Selected washing machines | src/data/site.ts:58–75 |
| procurement | Equipment and motor model；Original capacitor label；Length, width, height and fixing method；Lead count, length or connector；Quantity and destination | src/data/site.ts:58–75 |
| notes | The same number of wires does not establish a matching connection.；Check the connector, lead exit and mounting against a drawing or approved sample. | src/data/site.ts:58–75 |
| decisionChecks | Record µF and VAC from the original label.；Compare case dimensions, fixing points and lead or blade geometry.；Check the wiring connection even when the wire count matches. | src/data/site.ts:58–75 |
| decisionGuide | {"label":"Review dimensions and terminal fit","href":"/resources/dimensions-terminals-mounting/"} | src/data/site.ts:58–75 |
| source | https://www.hanxingcapacitor.com/products/cbb61-fan-capacitor/ | src/data/site.ts:58–75 |

### CBB65

| 字段 / 显示位置 | 当前数据值 | 源 |
| --- | --- | --- |
| code | CBB65 | src/data/site.ts:76–94 |
| slug | cbb65-air-conditioner-capacitor | src/data/site.ts:76–94 |
| title | CBB65 HVAC capacitors | src/data/site.ts:76–94 |
| shortName | HVAC run | src/data/site.ts:76–94 |
| function | Run | src/data/site.ts:76–94 |
| tagline | Metal-can run capacitors for HVAC motors, in single and dual configurations. | src/data/site.ts:76–94 |
| intro | Hanxing lists CBB65 metal-can motor-run capacitors for air conditioners, compressors, cold dryers and related HVAC equipment. Single and dual-run versions differ in rating and terminal layout. Include the arrangement shown on the original part in your inquiry. | src/data/site.ts:76–94 |
| image | /images/real/cbb65-2.jpg | src/data/site.ts:76–94 |
| imageAlt | Photograph of a CBB65 metal-can capacitor sample marked 20 µF and 450 VAC. | src/data/site.ts:76–94 |
| catalogImage | /images/generated/site/cbb65-main.webp | src/data/site.ts:76–94 |
| catalogImageAlt | Metal-can motor-run capacitor with two terminal groups. | src/data/site.ts:76–94 |
| capacitance | Single: 2–100 µF; dual: published range 1+15 to 15+80 µF | src/data/site.ts:76–94 |
| voltage | Single: 110–450 VAC; dual: 370–450 VAC | src/data/site.ts:76–94 |
| tolerance | ±5% (J), ±10% (K) | src/data/site.ts:76–94 |
| frequency | 50/60 Hz | src/data/site.ts:76–94 |
| temperature | −40 to +85 °C | src/data/site.ts:76–94 |
| dimensions | Single: D 30–65 × H 55–135 mm; dual: D 50–65 × H 75–125 mm | src/data/site.ts:76–94 |
| construction | Metallized polypropylene film in a metal can. | src/data/site.ts:76–94 |
| terminals | Several terminal-group layouts are shown. Use the model drawing to verify the arrangement. | src/data/site.ts:76–94 |
| applications | Air conditioners；Compressors；Cold dryers；HVAC motor systems | src/data/site.ts:76–94 |
| procurement | Single or dual-run function；Each µF value and rated VAC；Original terminal-group layout；Diameter, height and mounting；Equipment model, quantity and destination | src/data/site.ts:76–94 |
| notes | A dual-run marking gives two separate capacitance values. Record both values as printed.；Match the terminal groups to the drawing for the model you need. | src/data/site.ts:76–94 |
| decisionChecks | Identify single-run or dual-run from the motor documentation.；For dual-run, record both µF values and the rated VAC.；Send a clear terminal-group photo or the drawing for the proposed model. | src/data/site.ts:76–94 |
| decisionGuide | {"label":"Compare single and dual run","href":"/resources/single-vs-dual-run-capacitors/"} | src/data/site.ts:76–94 |
| source | https://www.hanxingcapacitor.com/products/cbb65-air-conditioner-capacitor/ | src/data/site.ts:76–94 |

### CD60

| 字段 / 显示位置 | 当前数据值 | 源 |
| --- | --- | --- |
| code | CD60 | src/data/site.ts:95–112 |
| slug | cd60-start-capacitor | src/data/site.ts:95–112 |
| title | CD60 motor start capacitors | src/data/site.ts:95–112 |
| shortName | Motor start | src/data/site.ts:95–112 |
| function | Start | src/data/site.ts:95–112 |
| tagline | Start capacitors for single-phase AC motors with a switched starting circuit. | src/data/site.ts:95–112 |
| intro | CD60 is Hanxing's aluminium electrolytic motor-start series. Use it only in a circuit designed to switch a start capacitor. The motor documentation determines the required rating and duty. | src/data/site.ts:95–112 |
| image | /images/real/cd60-25.jpg | src/data/site.ts:95–112 |
| imageAlt | Photograph of a CD60 cylindrical motor-start capacitor sample. | src/data/site.ts:95–112 |
| catalogImage | /images/generated/site/cd60-main.webp | src/data/site.ts:95–112 |
| catalogImageAlt | Cylindrical motor-start capacitor with two blade terminals. | src/data/site.ts:95–112 |
| capacitance | 20–1500 µF | src/data/site.ts:95–112 |
| voltage | 110–330 VAC | src/data/site.ts:95–112 |
| tolerance | ±10% (K), ±20% (M) | src/data/site.ts:95–112 |
| frequency | 50/60 Hz | src/data/site.ts:95–112 |
| temperature | −20 to +65 °C | src/data/site.ts:95–112 |
| dimensions | Approximately 34 × 60 to 63 × 110 mm (published series envelope) | src/data/site.ts:95–112 |
| construction | Aluminium electrolytic start-capacitor construction. | src/data/site.ts:95–112 |
| terminals | Double-welded sheet or lead-type output is listed; check the configuration for the requested model. | src/data/site.ts:95–112 |
| applications | Compatible single-phase AC motor starting；Selected pumps；Selected compressors | src/data/site.ts:95–112 |
| procurement | Original start-capacitor label and motor model；Capacitance and rated VAC；Starting circuit / duty details；Body size and terminal configuration；Quantity and destination | src/data/site.ts:95–112 |
| notes | Matching case size and capacitance does not make CD60 a run-capacitor replacement.；Request starting-duty and time-rating documentation for the proposed model. | src/data/site.ts:95–112 |
| decisionChecks | Verify the motor uses a start capacitor and check its starting circuit.；Record the original µF, VAC, frequency and any duty marking.；Ask for model-specific duty and time data; do not infer it from the series range. | src/data/site.ts:95–112 |
| decisionGuide | {"label":"Check start versus run duty","href":"/resources/start-vs-run-capacitors/"} | src/data/site.ts:95–112 |
| source | https://www.hanxingcapacitor.com/products/cd60-start-capacitor/ | src/data/site.ts:95–112 |

规格M03顺序为 Function → Operating temperature → Capacitance range → Typical dimensions → Rated voltage → Construction → Frequency → Connection → Capacitance tolerance → Model selection；详见 src/components/ProductReference.astro:17–23。最后Model selection：CD60为 “Check the starting circuit and switching arrangement. Request duty and time limits for the model.”，其余为 “Use the original motor rating and model drawing to check compatibility.”。

## A2. 产品详情完整图库选择与条目

以下列表顺序就是 `photos` 数组顺序，先 productPhotos[code]，再 sampleLibrary 同series（CBB60排除P001–P003）。重复呈现同一物体或相似视角不作去重，正如当前实现。

### CBB60 · 26 条

| 顺序 | label | src | thumb（为空则src） | 源码 |
| --- | --- | --- | --- | --- |
| 1 | 35 µF · 450 VAC wired sample | /images/real/cbb60-hanxing-wired.jpg | /images/real/cbb60-hanxing-wired.jpg | src/data/productPhotos.ts:4–9 |
| 2 | Wired sample | /images/real/cbb60-17.jpg | /images/real/cbb60-17.jpg | src/data/productPhotos.ts:4–9 |
| 3 | Cylindrical body and lead exit | /images/real/cbb60-16.jpg | /images/real/cbb60-16.jpg | src/data/productPhotos.ts:4–9 |
| 4 | Base stud and lead clearance | /images/real/cbb60-18.jpg | /images/real/cbb60-18.jpg | src/data/productPhotos.ts:4–9 |
| 5 | P004 · Paired wired samples | /images/product-samples/sample-3.webp | /images/product-samples/sample-3-thumb.webp | src/data/sampleLibrary.json:24 |
| 6 | P005 · Case colours and markings | /images/product-samples/sample-4.webp | /images/product-samples/sample-4-thumb.webp | src/data/sampleLibrary.json:31 |
| 7 | P006 · Yellow end-cap detail | /images/product-samples/sample-5.webp | /images/product-samples/sample-5-thumb.webp | src/data/sampleLibrary.json:38 |
| 8 | P007 · White end-cap detail | /images/product-samples/sample-6.webp | /images/product-samples/sample-6-thumb.webp | src/data/sampleLibrary.json:45 |
| 9 | P008 · Yellow wired sample | /images/product-samples/sample-7.webp | /images/product-samples/sample-7-thumb.webp | src/data/sampleLibrary.json:52 |
| 10 | P009 · White terminal sample | /images/product-samples/sample-8.webp | /images/product-samples/sample-8-thumb.webp | src/data/sampleLibrary.json:59 |
| 11 | P010 · White wired housing | /images/product-samples/sample-9.webp | /images/product-samples/sample-9-thumb.webp | src/data/sampleLibrary.json:66 |
| 12 | P011 · White case and blade terminals | /images/product-samples/sample-10.webp | /images/product-samples/sample-10-thumb.webp | src/data/sampleLibrary.json:73 |
| 13 | P012 · Black lead-wire arrangement | /images/product-samples/sample-11.webp | /images/product-samples/sample-11-thumb.webp | src/data/sampleLibrary.json:80 |
| 14 | P015 · White case, wider view | /images/product-samples/sample-14.webp | /images/product-samples/sample-14-thumb.webp | src/data/sampleLibrary.json:101 |
| 15 | P016 · Yellow case, wider view | /images/product-samples/sample-15.webp | /images/product-samples/sample-15-thumb.webp | src/data/sampleLibrary.json:108 |
| 16 | P017 · Black case, wider view | /images/product-samples/sample-16.webp | /images/product-samples/sample-16-thumb.webp | src/data/sampleLibrary.json:115 |
| 17 | P070 · White wired case, wider view | /images/product-samples/sample-69.webp | /images/product-samples/sample-69-thumb.webp | src/data/sampleLibrary.json:486 |
| 18 | P075 · White terminal case, wider view | /images/product-samples/sample-74.webp | /images/product-samples/sample-74-thumb.webp | src/data/sampleLibrary.json:521 |
| 19 | P076 · White lead-wire case, wider view | /images/product-samples/sample-75.webp | /images/product-samples/sample-75-thumb.webp | src/data/sampleLibrary.json:528 |
| 20 | P080 · White marked case, wider view | /images/product-samples/sample-79.webp | /images/product-samples/sample-79-thumb.webp | src/data/sampleLibrary.json:556 |
| 21 | P081 · White end cap, wider view | /images/product-samples/sample-80.webp | /images/product-samples/sample-80-thumb.webp | src/data/sampleLibrary.json:563 |
| 22 | P082 · Yellow end cap, wider view | /images/product-samples/sample-81.webp | /images/product-samples/sample-81-thumb.webp | src/data/sampleLibrary.json:570 |
| 23 | P083 · Case colour lineup, wider view | /images/product-samples/sample-82.webp | /images/product-samples/sample-82-thumb.webp | src/data/sampleLibrary.json:577 |
| 24 | P084 · Paired wired cases, wider view | /images/product-samples/sample-83.webp | /images/product-samples/sample-83-thumb.webp | src/data/sampleLibrary.json:584 |
| 25 | P085 · Base-stud samples, wider view | /images/product-samples/sample-84.webp | /images/product-samples/sample-84-thumb.webp | src/data/sampleLibrary.json:591 |
| 26 | P086 · Coloured leads, wider view | /images/product-samples/sample-85.webp | /images/product-samples/sample-85-thumb.webp | src/data/sampleLibrary.json:598 |

### CBB61 · 15 条

| 顺序 | label | src | thumb（为空则src） | 源码 |
| --- | --- | --- | --- | --- |
| 1 | 4.5 / 5 / 6 µF · 450 VAC samples | /images/real/cbb61-13.jpg | /images/real/cbb61-13.jpg | src/data/productPhotos.ts:10–14 |
| 2 | Different case and rating examples | /images/real/cbb61-14.jpg | /images/real/cbb61-14.jpg | src/data/productPhotos.ts:10–14 |
| 3 | Wire-lead housings | /images/real/cbb61-leads-10.jpg | /images/real/cbb61-leads-10.jpg | src/data/productPhotos.ts:10–14 |
| 4 | P018 · Three blade-terminal samples | /images/product-samples/sample-17.webp | /images/product-samples/sample-17-thumb.webp | src/data/sampleLibrary.json:122 |
| 5 | P019 · Blade-terminal case sizes | /images/product-samples/sample-18.webp | /images/product-samples/sample-18-thumb.webp | src/data/sampleLibrary.json:129 |
| 6 | P020 · Blade-terminal sample lineup | /images/product-samples/sample-19.webp | /images/product-samples/sample-19-thumb.webp | src/data/sampleLibrary.json:136 |
| 7 | P021 · Terminal lineup, wider view | /images/product-samples/sample-20.webp | /images/product-samples/sample-20-thumb.webp | src/data/sampleLibrary.json:143 |
| 8 | P022 · Case lineup, wider view | /images/product-samples/sample-21.webp | /images/product-samples/sample-21-thumb.webp | src/data/sampleLibrary.json:150 |
| 9 | P023 · Red wire-lead housings | /images/product-samples/sample-22.webp | /images/product-samples/sample-22-thumb.webp | src/data/sampleLibrary.json:157 |
| 10 | P024 · Black wire-lead lineup | /images/product-samples/sample-23.webp | /images/product-samples/sample-23-thumb.webp | src/data/sampleLibrary.json:164 |
| 11 | P025 · Single wire-lead sample | /images/product-samples/sample-24.webp | /images/product-samples/sample-24-thumb.webp | src/data/sampleLibrary.json:171 |
| 12 | P026 · Single sample, wider view | /images/product-samples/sample-25.webp | /images/product-samples/sample-25-thumb.webp | src/data/sampleLibrary.json:178 |
| 13 | P027 · Wired lineup, wider view | /images/product-samples/sample-26.webp | /images/product-samples/sample-26-thumb.webp | src/data/sampleLibrary.json:185 |
| 14 | P028 · Red cases, wider view | /images/product-samples/sample-27.webp | /images/product-samples/sample-27-thumb.webp | src/data/sampleLibrary.json:192 |
| 15 | P087 · Three rectangular samples, wider view | /images/product-samples/sample-86.webp | /images/product-samples/sample-86-thumb.webp | src/data/sampleLibrary.json:605 |

### CBB65 · 20 条

| 顺序 | label | src | thumb（为空则src） | 源码 |
| --- | --- | --- | --- | --- |
| 1 | 20 µF · 450 VAC sample | /images/real/cbb65-2.jpg | /images/real/cbb65-2.jpg | src/data/productPhotos.ts:15–19 |
| 2 | Sample and carton | /images/real/cbb65-4.jpg | /images/real/cbb65-4.jpg | src/data/productPhotos.ts:15–19 |
| 3 | Dual-run 50+5 µF sample | /images/real/cbb65-dual-run-7.jpg | /images/real/cbb65-dual-run-7.jpg | src/data/productPhotos.ts:15–19 |
| 4 | P029 · Metal-can sample | /images/product-samples/sample-28.webp | /images/product-samples/sample-28-thumb.webp | src/data/sampleLibrary.json:199 |
| 5 | P030 · Sample and printed carton | /images/product-samples/sample-29.webp | /images/product-samples/sample-29-thumb.webp | src/data/sampleLibrary.json:206 |
| 6 | P031 · Carton and terminal view | /images/product-samples/sample-30.webp | /images/product-samples/sample-30-thumb.webp | src/data/sampleLibrary.json:213 |
| 7 | P032 · Metal can beside carton | /images/product-samples/sample-31.webp | /images/product-samples/sample-31-thumb.webp | src/data/sampleLibrary.json:220 |
| 8 | P033 · Terminal end with protective wrapping | /images/product-samples/sample-32.webp | /images/product-samples/sample-32-thumb.webp | src/data/sampleLibrary.json:227 |
| 9 | P034 · Dual-run sample and carton | /images/product-samples/sample-33.webp | /images/product-samples/sample-33-thumb.webp | src/data/sampleLibrary.json:234 |
| 10 | P035 · Alternate sample and carton | /images/product-samples/sample-34.webp | /images/product-samples/sample-34-thumb.webp | src/data/sampleLibrary.json:241 |
| 11 | P036 · Three metal-can samples | /images/product-samples/sample-35.webp | /images/product-samples/sample-35-thumb.webp | src/data/sampleLibrary.json:248 |
| 12 | P037 · Small metal-can sample | /images/product-samples/sample-36.webp | /images/product-samples/sample-36-thumb.webp | src/data/sampleLibrary.json:255 |
| 13 | P088 · Metal-can group, wider view | /images/product-samples/sample-87.webp | /images/product-samples/sample-87-thumb.webp | src/data/sampleLibrary.json:612 |
| 14 | P089 · Carton beside sample, wider view | /images/product-samples/sample-88.webp | /images/product-samples/sample-88-thumb.webp | src/data/sampleLibrary.json:619 |
| 15 | P090 · Sample beside carton, wider view | /images/product-samples/sample-89.webp | /images/product-samples/sample-89-thumb.webp | src/data/sampleLibrary.json:626 |
| 16 | P091 · Wrapped terminal detail, wider view | /images/product-samples/sample-90.webp | /images/product-samples/sample-90-thumb.webp | src/data/sampleLibrary.json:633 |
| 17 | P092 · Metal can and carton, wider view | /images/product-samples/sample-91.webp | /images/product-samples/sample-91-thumb.webp | src/data/sampleLibrary.json:640 |
| 18 | P093 · Printed carton and sample, wider view | /images/product-samples/sample-92.webp | /images/product-samples/sample-92-thumb.webp | src/data/sampleLibrary.json:647 |
| 19 | P094 · Alternate carton view | /images/product-samples/sample-93.webp | /images/product-samples/sample-93-thumb.webp | src/data/sampleLibrary.json:654 |
| 20 | P095 · Metal-can label, wider view | /images/product-samples/sample-94.webp | /images/product-samples/sample-94-thumb.webp | src/data/sampleLibrary.json:661 |

### CD60 · 12 条

| 顺序 | label | src | thumb（为空则src） | 源码 |
| --- | --- | --- | --- | --- |
| 1 | 500 µF · 300 VAC sample | /images/real/cd60-25.jpg | /images/real/cd60-25.jpg | src/data/productPhotos.ts:20–23 |
| 2 | Rating and terminal view | /images/real/cd60-detail-69.jpg | /images/real/cd60-detail-69.jpg | src/data/productPhotos.ts:20–23 |
| 3 | P038 · Grey start-capacitor sample | /images/product-samples/sample-37.webp | /images/product-samples/sample-37-thumb.webp | src/data/sampleLibrary.json:262 |
| 4 | P039 · Blue case and blade terminals | /images/product-samples/sample-38.webp | /images/product-samples/sample-38-thumb.webp | src/data/sampleLibrary.json:269 |
| 5 | P040 · Blue case with cable loop | /images/product-samples/sample-39.webp | /images/product-samples/sample-39-thumb.webp | src/data/sampleLibrary.json:276 |
| 6 | P041 · Compact blue terminal sample | /images/product-samples/sample-40.webp | /images/product-samples/sample-40-thumb.webp | src/data/sampleLibrary.json:283 |
| 7 | P042 · Blue wired sample | /images/product-samples/sample-41.webp | /images/product-samples/sample-41-thumb.webp | src/data/sampleLibrary.json:290 |
| 8 | P043 · Blue terminal sample, wider view | /images/product-samples/sample-42.webp | /images/product-samples/sample-42-thumb.webp | src/data/sampleLibrary.json:297 |
| 9 | P044 · Cable-loop sample, wider view | /images/product-samples/sample-43.webp | /images/product-samples/sample-43-thumb.webp | src/data/sampleLibrary.json:304 |
| 10 | P045 · Blue case, wider view | /images/product-samples/sample-44.webp | /images/product-samples/sample-44-thumb.webp | src/data/sampleLibrary.json:311 |
| 11 | P046 · Grey sample, wider view | /images/product-samples/sample-45.webp | /images/product-samples/sample-45-thumb.webp | src/data/sampleLibrary.json:318 |
| 12 | P074 · Blue wired case, wider view | /images/product-samples/sample-73.webp | /images/product-samples/sample-73-thumb.webp | src/data/sampleLibrary.json:514 |

## A3. 照片库全部96条（src/thumbnail精确映射）

| ID | 分组 | 实际 label | src | thumb | 源码行 |
| --- | --- | --- | --- | --- | --- |
| P001 | CBB60 | Black cylindrical sample | /images/product-samples/sample-0.webp | /images/product-samples/sample-0-thumb.webp | src/data/sampleLibrary.json:3 |
| P002 | CBB60 | Multicolour wire leads | /images/product-samples/sample-1.webp | /images/product-samples/sample-1-thumb.webp | src/data/sampleLibrary.json:10 |
| P003 | CBB60 | Lead wires and base stud | /images/product-samples/sample-2.webp | /images/product-samples/sample-2-thumb.webp | src/data/sampleLibrary.json:17 |
| P004 | CBB60 | Paired wired samples | /images/product-samples/sample-3.webp | /images/product-samples/sample-3-thumb.webp | src/data/sampleLibrary.json:24 |
| P005 | CBB60 | Case colours and markings | /images/product-samples/sample-4.webp | /images/product-samples/sample-4-thumb.webp | src/data/sampleLibrary.json:31 |
| P006 | CBB60 | Yellow end-cap detail | /images/product-samples/sample-5.webp | /images/product-samples/sample-5-thumb.webp | src/data/sampleLibrary.json:38 |
| P007 | CBB60 | White end-cap detail | /images/product-samples/sample-6.webp | /images/product-samples/sample-6-thumb.webp | src/data/sampleLibrary.json:45 |
| P008 | CBB60 | Yellow wired sample | /images/product-samples/sample-7.webp | /images/product-samples/sample-7-thumb.webp | src/data/sampleLibrary.json:52 |
| P009 | CBB60 | White terminal sample | /images/product-samples/sample-8.webp | /images/product-samples/sample-8-thumb.webp | src/data/sampleLibrary.json:59 |
| P010 | CBB60 | White wired housing | /images/product-samples/sample-9.webp | /images/product-samples/sample-9-thumb.webp | src/data/sampleLibrary.json:66 |
| P011 | CBB60 | White case and blade terminals | /images/product-samples/sample-10.webp | /images/product-samples/sample-10-thumb.webp | src/data/sampleLibrary.json:73 |
| P012 | CBB60 | Black lead-wire arrangement | /images/product-samples/sample-11.webp | /images/product-samples/sample-11-thumb.webp | src/data/sampleLibrary.json:80 |
| P013 | Additional samples | Black cylindrical wired sample | /images/product-samples/sample-12.webp | /images/product-samples/sample-12-thumb.webp | src/data/sampleLibrary.json:87 |
| P014 | Additional samples | Multicolour lead arrangement | /images/product-samples/sample-13.webp | /images/product-samples/sample-13-thumb.webp | src/data/sampleLibrary.json:94 |
| P015 | CBB60 | White case, wider view | /images/product-samples/sample-14.webp | /images/product-samples/sample-14-thumb.webp | src/data/sampleLibrary.json:101 |
| P016 | CBB60 | Yellow case, wider view | /images/product-samples/sample-15.webp | /images/product-samples/sample-15-thumb.webp | src/data/sampleLibrary.json:108 |
| P017 | CBB60 | Black case, wider view | /images/product-samples/sample-16.webp | /images/product-samples/sample-16-thumb.webp | src/data/sampleLibrary.json:115 |
| P018 | CBB61 | Three blade-terminal samples | /images/product-samples/sample-17.webp | /images/product-samples/sample-17-thumb.webp | src/data/sampleLibrary.json:122 |
| P019 | CBB61 | Blade-terminal case sizes | /images/product-samples/sample-18.webp | /images/product-samples/sample-18-thumb.webp | src/data/sampleLibrary.json:129 |
| P020 | CBB61 | Blade-terminal sample lineup | /images/product-samples/sample-19.webp | /images/product-samples/sample-19-thumb.webp | src/data/sampleLibrary.json:136 |
| P021 | CBB61 | Terminal lineup, wider view | /images/product-samples/sample-20.webp | /images/product-samples/sample-20-thumb.webp | src/data/sampleLibrary.json:143 |
| P022 | CBB61 | Case lineup, wider view | /images/product-samples/sample-21.webp | /images/product-samples/sample-21-thumb.webp | src/data/sampleLibrary.json:150 |
| P023 | CBB61 | Red wire-lead housings | /images/product-samples/sample-22.webp | /images/product-samples/sample-22-thumb.webp | src/data/sampleLibrary.json:157 |
| P024 | CBB61 | Black wire-lead lineup | /images/product-samples/sample-23.webp | /images/product-samples/sample-23-thumb.webp | src/data/sampleLibrary.json:164 |
| P025 | CBB61 | Single wire-lead sample | /images/product-samples/sample-24.webp | /images/product-samples/sample-24-thumb.webp | src/data/sampleLibrary.json:171 |
| P026 | CBB61 | Single sample, wider view | /images/product-samples/sample-25.webp | /images/product-samples/sample-25-thumb.webp | src/data/sampleLibrary.json:178 |
| P027 | CBB61 | Wired lineup, wider view | /images/product-samples/sample-26.webp | /images/product-samples/sample-26-thumb.webp | src/data/sampleLibrary.json:185 |
| P028 | CBB61 | Red cases, wider view | /images/product-samples/sample-27.webp | /images/product-samples/sample-27-thumb.webp | src/data/sampleLibrary.json:192 |
| P029 | CBB65 | Metal-can sample | /images/product-samples/sample-28.webp | /images/product-samples/sample-28-thumb.webp | src/data/sampleLibrary.json:199 |
| P030 | CBB65 | Sample and printed carton | /images/product-samples/sample-29.webp | /images/product-samples/sample-29-thumb.webp | src/data/sampleLibrary.json:206 |
| P031 | CBB65 | Carton and terminal view | /images/product-samples/sample-30.webp | /images/product-samples/sample-30-thumb.webp | src/data/sampleLibrary.json:213 |
| P032 | CBB65 | Metal can beside carton | /images/product-samples/sample-31.webp | /images/product-samples/sample-31-thumb.webp | src/data/sampleLibrary.json:220 |
| P033 | CBB65 | Terminal end with protective wrapping | /images/product-samples/sample-32.webp | /images/product-samples/sample-32-thumb.webp | src/data/sampleLibrary.json:227 |
| P034 | CBB65 | Dual-run sample and carton | /images/product-samples/sample-33.webp | /images/product-samples/sample-33-thumb.webp | src/data/sampleLibrary.json:234 |
| P035 | CBB65 | Alternate sample and carton | /images/product-samples/sample-34.webp | /images/product-samples/sample-34-thumb.webp | src/data/sampleLibrary.json:241 |
| P036 | CBB65 | Three metal-can samples | /images/product-samples/sample-35.webp | /images/product-samples/sample-35-thumb.webp | src/data/sampleLibrary.json:248 |
| P037 | CBB65 | Small metal-can sample | /images/product-samples/sample-36.webp | /images/product-samples/sample-36-thumb.webp | src/data/sampleLibrary.json:255 |
| P038 | CD60 | Grey start-capacitor sample | /images/product-samples/sample-37.webp | /images/product-samples/sample-37-thumb.webp | src/data/sampleLibrary.json:262 |
| P039 | CD60 | Blue case and blade terminals | /images/product-samples/sample-38.webp | /images/product-samples/sample-38-thumb.webp | src/data/sampleLibrary.json:269 |
| P040 | CD60 | Blue case with cable loop | /images/product-samples/sample-39.webp | /images/product-samples/sample-39-thumb.webp | src/data/sampleLibrary.json:276 |
| P041 | CD60 | Compact blue terminal sample | /images/product-samples/sample-40.webp | /images/product-samples/sample-40-thumb.webp | src/data/sampleLibrary.json:283 |
| P042 | CD60 | Blue wired sample | /images/product-samples/sample-41.webp | /images/product-samples/sample-41-thumb.webp | src/data/sampleLibrary.json:290 |
| P043 | CD60 | Blue terminal sample, wider view | /images/product-samples/sample-42.webp | /images/product-samples/sample-42-thumb.webp | src/data/sampleLibrary.json:297 |
| P044 | CD60 | Cable-loop sample, wider view | /images/product-samples/sample-43.webp | /images/product-samples/sample-43-thumb.webp | src/data/sampleLibrary.json:304 |
| P045 | CD60 | Blue case, wider view | /images/product-samples/sample-44.webp | /images/product-samples/sample-44-thumb.webp | src/data/sampleLibrary.json:311 |
| P046 | CD60 | Grey sample, wider view | /images/product-samples/sample-45.webp | /images/product-samples/sample-45-thumb.webp | src/data/sampleLibrary.json:318 |
| P047 | Additional samples | Mixed product collection | /images/product-samples/sample-46.webp | /images/product-samples/sample-46-thumb.webp | src/data/sampleLibrary.json:325 |
| P048 | Additional samples | White housing with black top | /images/product-samples/sample-47.webp | /images/product-samples/sample-47-thumb.webp | src/data/sampleLibrary.json:332 |
| P049 | Additional samples | White cylindrical sample | /images/product-samples/sample-48.webp | /images/product-samples/sample-48-thumb.webp | src/data/sampleLibrary.json:339 |
| P050 | Additional samples | White case markings | /images/product-samples/sample-49.webp | /images/product-samples/sample-49-thumb.webp | src/data/sampleLibrary.json:346 |
| P051 | Additional samples | Wound elements and materials | /images/product-samples/sample-50.webp | /images/product-samples/sample-50-thumb.webp | src/data/sampleLibrary.json:353 |
| P052 | Additional samples | Small labelled metal can | /images/product-samples/sample-51.webp | /images/product-samples/sample-51-thumb.webp | src/data/sampleLibrary.json:360 |
| P053 | Additional samples | Metal housings | /images/product-samples/sample-52.webp | /images/product-samples/sample-52-thumb.webp | src/data/sampleLibrary.json:367 |
| P054 | Additional samples | Gold-coloured terminal sample | /images/product-samples/sample-53.webp | /images/product-samples/sample-53-thumb.webp | src/data/sampleLibrary.json:374 |
| P055 | Additional samples | Gold-coloured case | /images/product-samples/sample-54.webp | /images/product-samples/sample-54-thumb.webp | src/data/sampleLibrary.json:381 |
| P056 | Additional samples | White case and terminals | /images/product-samples/sample-55.webp | /images/product-samples/sample-55-thumb.webp | src/data/sampleLibrary.json:388 |
| P057 | Additional samples | Black open-top housing | /images/product-samples/sample-56.webp | /images/product-samples/sample-56-thumb.webp | src/data/sampleLibrary.json:395 |
| P058 | Additional samples | Wrapped labelled sample | /images/product-samples/sample-57.webp | /images/product-samples/sample-57-thumb.webp | src/data/sampleLibrary.json:402 |
| P059 | Additional samples | Gold-coloured cylindrical sample | /images/product-samples/sample-58.webp | /images/product-samples/sample-58-thumb.webp | src/data/sampleLibrary.json:409 |
| P060 | Additional samples | Purple cylindrical sample | /images/product-samples/sample-59.webp | /images/product-samples/sample-59-thumb.webp | src/data/sampleLibrary.json:416 |
| P061 | Additional samples | Blue cylindrical sample | /images/product-samples/sample-60.webp | /images/product-samples/sample-60-thumb.webp | src/data/sampleLibrary.json:423 |
| P062 | Additional samples | Blue sample, wider view | /images/product-samples/sample-61.webp | /images/product-samples/sample-61-thumb.webp | src/data/sampleLibrary.json:430 |
| P063 | Additional samples | Purple sample, wider view | /images/product-samples/sample-62.webp | /images/product-samples/sample-62-thumb.webp | src/data/sampleLibrary.json:437 |
| P064 | Additional samples | Gold sample, wider view | /images/product-samples/sample-63.webp | /images/product-samples/sample-63-thumb.webp | src/data/sampleLibrary.json:444 |
| P065 | Additional samples | Wrapped sample, wider view | /images/product-samples/sample-64.webp | /images/product-samples/sample-64-thumb.webp | src/data/sampleLibrary.json:451 |
| P066 | Additional samples | Black housing, wider view | /images/product-samples/sample-65.webp | /images/product-samples/sample-65-thumb.webp | src/data/sampleLibrary.json:458 |
| P067 | Additional samples | White sample, wider view | /images/product-samples/sample-66.webp | /images/product-samples/sample-66-thumb.webp | src/data/sampleLibrary.json:465 |
| P068 | Additional samples | Multicolour leads, wider view | /images/product-samples/sample-67.webp | /images/product-samples/sample-67-thumb.webp | src/data/sampleLibrary.json:472 |
| P069 | Additional samples | Black wired case, wider view | /images/product-samples/sample-68.webp | /images/product-samples/sample-68-thumb.webp | src/data/sampleLibrary.json:479 |
| P070 | CBB60 | White wired case, wider view | /images/product-samples/sample-69.webp | /images/product-samples/sample-69-thumb.webp | src/data/sampleLibrary.json:486 |
| P071 | Additional samples | Gold case detail | /images/product-samples/sample-70.webp | /images/product-samples/sample-70-thumb.webp | src/data/sampleLibrary.json:493 |
| P072 | Additional samples | Gold case alternate view | /images/product-samples/sample-71.webp | /images/product-samples/sample-71-thumb.webp | src/data/sampleLibrary.json:500 |
| P073 | Additional samples | Metal housings, wider view | /images/product-samples/sample-72.webp | /images/product-samples/sample-72-thumb.webp | src/data/sampleLibrary.json:507 |
| P074 | CD60 | Blue wired case, wider view | /images/product-samples/sample-73.webp | /images/product-samples/sample-73-thumb.webp | src/data/sampleLibrary.json:514 |
| P075 | CBB60 | White terminal case, wider view | /images/product-samples/sample-74.webp | /images/product-samples/sample-74-thumb.webp | src/data/sampleLibrary.json:521 |
| P076 | CBB60 | White lead-wire case, wider view | /images/product-samples/sample-75.webp | /images/product-samples/sample-75-thumb.webp | src/data/sampleLibrary.json:528 |
| P077 | Additional samples | Wound elements, wider view | /images/product-samples/sample-76.webp | /images/product-samples/sample-76-thumb.webp | src/data/sampleLibrary.json:535 |
| P078 | Additional samples | White cylindrical case, wider view | /images/product-samples/sample-77.webp | /images/product-samples/sample-77-thumb.webp | src/data/sampleLibrary.json:542 |
| P079 | Additional samples | Black-top housing, wider view | /images/product-samples/sample-78.webp | /images/product-samples/sample-78-thumb.webp | src/data/sampleLibrary.json:549 |
| P080 | CBB60 | White marked case, wider view | /images/product-samples/sample-79.webp | /images/product-samples/sample-79-thumb.webp | src/data/sampleLibrary.json:556 |
| P081 | CBB60 | White end cap, wider view | /images/product-samples/sample-80.webp | /images/product-samples/sample-80-thumb.webp | src/data/sampleLibrary.json:563 |
| P082 | CBB60 | Yellow end cap, wider view | /images/product-samples/sample-81.webp | /images/product-samples/sample-81-thumb.webp | src/data/sampleLibrary.json:570 |
| P083 | CBB60 | Case colour lineup, wider view | /images/product-samples/sample-82.webp | /images/product-samples/sample-82-thumb.webp | src/data/sampleLibrary.json:577 |
| P084 | CBB60 | Paired wired cases, wider view | /images/product-samples/sample-83.webp | /images/product-samples/sample-83-thumb.webp | src/data/sampleLibrary.json:584 |
| P085 | CBB60 | Base-stud samples, wider view | /images/product-samples/sample-84.webp | /images/product-samples/sample-84-thumb.webp | src/data/sampleLibrary.json:591 |
| P086 | CBB60 | Coloured leads, wider view | /images/product-samples/sample-85.webp | /images/product-samples/sample-85-thumb.webp | src/data/sampleLibrary.json:598 |
| P087 | CBB61 | Three rectangular samples, wider view | /images/product-samples/sample-86.webp | /images/product-samples/sample-86-thumb.webp | src/data/sampleLibrary.json:605 |
| P088 | CBB65 | Metal-can group, wider view | /images/product-samples/sample-87.webp | /images/product-samples/sample-87-thumb.webp | src/data/sampleLibrary.json:612 |
| P089 | CBB65 | Carton beside sample, wider view | /images/product-samples/sample-88.webp | /images/product-samples/sample-88-thumb.webp | src/data/sampleLibrary.json:619 |
| P090 | CBB65 | Sample beside carton, wider view | /images/product-samples/sample-89.webp | /images/product-samples/sample-89-thumb.webp | src/data/sampleLibrary.json:626 |
| P091 | CBB65 | Wrapped terminal detail, wider view | /images/product-samples/sample-90.webp | /images/product-samples/sample-90-thumb.webp | src/data/sampleLibrary.json:633 |
| P092 | CBB65 | Metal can and carton, wider view | /images/product-samples/sample-91.webp | /images/product-samples/sample-91-thumb.webp | src/data/sampleLibrary.json:640 |
| P093 | CBB65 | Printed carton and sample, wider view | /images/product-samples/sample-92.webp | /images/product-samples/sample-92-thumb.webp | src/data/sampleLibrary.json:647 |
| P094 | CBB65 | Alternate carton view | /images/product-samples/sample-93.webp | /images/product-samples/sample-93-thumb.webp | src/data/sampleLibrary.json:654 |
| P095 | CBB65 | Metal-can label, wider view | /images/product-samples/sample-94.webp | /images/product-samples/sample-94-thumb.webp | src/data/sampleLibrary.json:661 |
| P096 | Additional samples | Full product collection | /images/product-samples/sample-95.webp | /images/product-samples/sample-95-thumb.webp | src/data/sampleLibrary.json:668 |

## A4. 产品参考正文、机械样本与型号文档数据

### CBB60

| 内容字段 | 当前值 | 源 |
| --- | --- | --- |
| intro | Run capacitors for pumps and other single-phase motors with matching specifications. | src/data/productReference.ts:14–27 |
| dutyContext | For compatible single-phase motors | src/data/productReference.ts:14–27 |
| detailId | cbb60-stud | src/data/productReference.ts:14–27 |
| fit | {"title":"Original rating","text":"Record the original µF, VAC and frequency markings. The photograph shows a 25 µF sample; its configuration does not represent every model in the series."}；{"title":"Body and mounting stud","text":"The horizontal sample has a visible threaded base stud. Compare its body and fixing dimensions with the model drawing and the available mounting space."}；{"title":"Space for the leads","text":"Allow room for the leads and access to the connector. Check lead length and connection type when measuring the full installation space."} | src/data/productReference.ts:14–27 |
| applicationIntro | CBB60 is listed for the following single-phase motor applications where the motor calls for run duty. | src/data/productReference.ts:14–27 |
| applicationLinks | /applications/pumps-water-systems/；/applications/appliances-small-motors/；/applications/fans-ventilation/；null | src/data/productReference.ts:14–27 |
| documentDimensions | Body dimensions, base stud and installed clearance. | src/data/productReference.ts:14–27 |
| documentConnections | Lead length, connector and fixing details. | src/data/productReference.ts:14–27 |
| documentDuty | Model-specific life class and application requirements. | src/data/productReference.ts:14–27 |

### CBB61

| 内容字段 | 当前值 | 源 |
| --- | --- | --- |
| intro | Compact run capacitors for fans, blowers and appliance motors with matching specifications. | src/data/productReference.ts:28–41 |
| dutyContext | For compatible fan and appliance motors | src/data/productReference.ts:28–41 |
| detailId | cbb61-leads | src/data/productReference.ts:28–41 |
| fit | {"title":"Original rating","text":"Record the original µF, VAC and frequency. The blade-terminal photograph shows separate 4.5, 5 and 6 µF samples at 450 VAC. These are individual samples, not a selectable range for one model."}；{"title":"Case and fixing points","text":"Measure the rectangular case length, width and height. Compare mounting tabs and fixing positions with the drawing to check the installed fit."}；{"title":"Wiring and terminals","text":"Check the lead exit and length, then compare the connector or blade spacing. A matching wire count alone does not establish the correct connection."} | src/data/productReference.ts:28–41 |
| applicationIntro | The CBB61 series is listed for fans and selected appliance motors that use a run capacitor. | src/data/productReference.ts:28–41 |
| applicationLinks | /applications/fans-ventilation/；/applications/fans-ventilation/；/applications/hvac-refrigeration/；/applications/appliances-small-motors/ | src/data/productReference.ts:28–41 |
| documentDimensions | Case length, width, height and mounting-tab dimensions. | src/data/productReference.ts:28–41 |
| documentConnections | Lead exit, length, connector and blade-terminal spacing. | src/data/productReference.ts:28–41 |
| documentDuty | Model-specific run duty and application requirements. | src/data/productReference.ts:28–41 |

### CBB65

| 内容字段 | 当前值 | 源 |
| --- | --- | --- |
| intro | Metal-can run capacitors for HVAC motors, in single and dual configurations. | src/data/productReference.ts:42–55 |
| dutyContext | Single and dual-run configurations | src/data/productReference.ts:42–55 |
| detailId | cbb65-dual | src/data/productReference.ts:42–55 |
| fit | {"title":"Single or dual run","text":"The 20 µF photograph shows a single-run sample. The 50+5 µF sample has two separate capacitance values; adding them does not give an equivalent rating."}；{"title":"Terminal groups","text":"For dual run, record both µF values and rated VAC. Include a clear terminal-group photograph or connection drawing so the marked connections can be checked."}；{"title":"Can and mounting","text":"Compare the can diameter and height with the model drawing. Check fixing and terminal clearance, and ensure that the proposed configuration and any applicable certificate refer to the same model number."} | src/data/productReference.ts:42–55 |
| applicationIntro | CBB65 is listed for HVAC and refrigeration motors whose specifications call for run duty. | src/data/productReference.ts:42–55 |
| applicationLinks | /applications/hvac-refrigeration/；/applications/hvac-refrigeration/；/applications/hvac-refrigeration/；/applications/hvac-refrigeration/ | src/data/productReference.ts:42–55 |
| documentDimensions | Can diameter, height, fixing and installed terminal clearance. | src/data/productReference.ts:42–55 |
| documentConnections | Single or dual-run configuration; both values and terminal-group mapping where applicable. | src/data/productReference.ts:42–55 |
| documentDuty | Model-specific run duty and equipment requirements. | src/data/productReference.ts:42–55 |

### CD60

| 内容字段 | 当前值 | 源 |
| --- | --- | --- |
| intro | Start capacitors for single-phase AC motors with a switched starting circuit. | src/data/productReference.ts:56–69 |
| dutyContext | For a switched motor-start circuit | src/data/productReference.ts:56–69 |
| detailId | cd60-start | src/data/productReference.ts:56–69 |
| fit | {"title":"Starting circuit","text":"Check that the motor uses a start capacitor and provide its switching arrangement. CD60 is not specified for continuous run duty."}；{"title":"Rating and duty markings","text":"Record the original µF, VAC and frequency, along with any duty marking. The sample shown reads 500 µF ±5%, 300 VAC; its tolerance differs from the published series table."}；{"title":"Case and terminals","text":"Compare case size and the blade or lead arrangement, allowing for installed clearance. Matching size and capacitance does not qualify this as a run-capacitor replacement."} | src/data/productReference.ts:56–69 |
| applicationIntro | CD60 requires a circuit designed to switch a start capacitor. Use the motor documentation to establish the required duty for the applications below. | src/data/productReference.ts:56–69 |
| applicationLinks | null；/applications/pumps-water-systems/；/applications/hvac-refrigeration/ | src/data/productReference.ts:56–69 |
| documentDimensions | Body dimensions, terminal configuration and installed clearance. | src/data/productReference.ts:56–69 |
| documentConnections | Starting circuit and switching arrangement. | src/data/productReference.ts:56–69 |
| documentDuty | Model-specific starting duty, time limits and approved tolerance. | src/data/productReference.ts:56–69 |

| sample ID | series | name | rating | connection | image | note | 源 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| cbb60-stud | CBB60 | Lead-wire sample with base stud | 25 µF ±5% · 450 VAC on the horizontal sample | Insulated leads; threaded base stud visible | /images/real/cbb60-18.jpg | Availability of this sample as an orderable model needs confirmation. The photograph has no dimension scale. | src/data/sampleConfigurations.ts:3 |
| cbb61-blades | CBB61 | Blade-terminal samples | 4.5 / 5 / 6 µF · 450 VAC | Rectangular cases with blade terminals | /images/real/cbb61-13.jpg | Each sample has its own rating. These values are not a selectable range for one model. | src/data/sampleConfigurations.ts:4 |
| cbb61-leads | CBB61 | Wire-lead samples | Rating to be specified | Red leads and mounting tabs visible | /images/real/cbb61-leads-10.jpg | Lead length and wiring must be established by a drawing. | src/data/sampleConfigurations.ts:5 |
| cbb65-single | CBB65 | Single-run sample | 20 µF ±5% · 450 VAC | Two insulated terminal groups visible | /images/real/cbb65-2.jpg | The label reads 50/60 Hz. Use a drawing to establish case dimensions; the photograph does not provide them. | src/data/sampleConfigurations.ts:6 |
| cbb65-dual | CBB65 | Dual-run sample | 50+5 µF ±5% · 450 VAC | Multiple terminal groups; mapping requires a drawing | /images/real/cbb65-dual-run-7.jpg | Retain both capacitance values when preparing the requirement. | src/data/sampleConfigurations.ts:7 |
| cd60-start | CD60 | Motor-start sample | 500 µF ±5% · 300 VAC | Blade terminals visible | /images/real/cd60-25.jpg | The sample tolerance differs from the published series table. Request the duty limits and datasheet for the exact model. | src/data/sampleConfigurations.ts:8 |

## A5. 应用目录与详情共用数据

### hvac-refrigeration

| 字段 | 当前值 | 源 |
| --- | --- | --- |
| slug | hvac-refrigeration | src/data/site.ts:132–138 |
| title | Motor capacitors for HVAC & refrigeration | src/data/site.ts:132–138 |
| shortName | HVAC & refrigeration | src/data/site.ts:132–138 |
| intro | An HVAC unit may have separate compressor and fan motor circuits. Identify the original circuit and its capacitor before comparing CBB65 single or dual-run options, or a separate CD60 start capacitor. | src/data/site.ts:132–138 |
| image | /images/illustrative/application-hvac-v1.webp | src/data/site.ts:132–138 |
| imageAlt | Illustration of a closed air-conditioning condenser unit, not a photograph of a Hanxing project. | src/data/site.ts:132–138 |
| question | Is the capacitor for a compressor, fan or another circuit? | src/data/site.ts:132–138 |
| series | CBB65；CD60 | src/data/site.ts:132–138 |
| scenarios | Air conditioning；Cold dryers；Compressor systems；Ventilation motors | src/data/site.ts:132–138 |
| checks | Original capacitor label and equipment model；Single or dual-run function；Each capacitance value and rated voltage；Terminal group and mounting space；Quantity, market and document requirements | src/data/site.ts:132–138 |

### pumps-water-systems

| 字段 | 当前值 | 源 |
| --- | --- | --- |
| slug | pumps-water-systems | src/data/site.ts:139–145 |
| title | Motor capacitors for pumps & water systems | src/data/site.ts:139–145 |
| shortName | Pumps & water systems | src/data/site.ts:139–145 |
| intro | Pump motors may use a run capacitor, a start capacitor, both or another arrangement. The motor drawing identifies the circuit; CBB60 and CD60 serve different functions. | src/data/site.ts:139–145 |
| image | /images/illustrative/application-pumps-v3.webp | src/data/site.ts:139–145 |
| imageAlt | Illustration of a closed water-pump motor assembly on a workbench. It does not show a Hanxing installation or establish a capacitor configuration. | src/data/site.ts:139–145 |
| question | Does the pump circuit call for a run capacitor, a start capacitor or both? | src/data/site.ts:139–145 |
| series | CBB60；CD60 | src/data/site.ts:139–145 |
| scenarios | Water pumps；Booster systems；Single-phase pumping motors | src/data/site.ts:139–145 |
| checks | Pump and motor model；Original capacitor label；Run versus start function；Body size and mounting；Lead/terminal format and quantity | src/data/site.ts:139–145 |

### fans-ventilation

| 字段 | 当前值 | 源 |
| --- | --- | --- |
| slug | fans-ventilation | src/data/site.ts:146–152 |
| title | Motor capacitors for fans & ventilation | src/data/site.ts:146–152 |
| shortName | Fans & ventilation | src/data/site.ts:146–152 |
| intro | A fan capacitor needs to match the motor circuit and fit the housing. CBB61 has a compact rectangular case; CBB60 has a cylindrical format for motors that specify it. | src/data/site.ts:146–152 |
| image | /images/illustrative/application-fans-v1.webp | src/data/site.ts:146–152 |
| imageAlt | Illustration of a compact ventilation fan assembly, not a photograph of a Hanxing project. | src/data/site.ts:146–152 |
| question | What rating and connection does the fan motor specify? | src/data/site.ts:146–152 |
| series | CBB61；CBB60 | src/data/site.ts:146–152 |
| scenarios | Fans；Blowers；Exhaust equipment | src/data/site.ts:146–152 |
| checks | Fan or motor model；Capacitance and voltage；Lead length and connector；Mounting or fixing detail；Original sample or drawing | src/data/site.ts:146–152 |

### appliances-small-motors

| 字段 | 当前值 | 源 |
| --- | --- | --- |
| slug | appliances-small-motors | src/data/site.ts:153–159 |
| title | Capacitors for appliances & small motors | src/data/site.ts:153–159 |
| shortName | Appliances & small motors | src/data/site.ts:153–159 |
| intro | The appliance name alone rarely identifies the capacitor. Start with the motor model and original part, including its wiring. Then compare the electrical rating and connections with the available mounting space. | src/data/site.ts:153–159 |
| image | /images/illustrative/application-appliances-v2.webp | src/data/site.ts:153–159 |
| imageAlt | Illustration of a closed washing machine in a service room. It does not show a Hanxing project or establish the motor circuit. | src/data/site.ts:153–159 |
| question | Which motor and original capacitor does the appliance use? | src/data/site.ts:153–159 |
| series | CBB60；CBB61 | src/data/site.ts:153–159 |
| scenarios | Selected washing machines；Compact single-phase motors；Appliance assemblies | src/data/site.ts:153–159 |
| checks | Equipment and motor model；Original capacitor photo or label；Electrical values；Wiring and fixing details；Annual or forecast quantity | src/data/site.ts:153–159 |

## A6. 通用应用详情数据（HVAC单独源码已在逐页模块中列出）

### pumps-water-systems

| 字段 | 当前值 | 源 |
| --- | --- | --- |
| lead | Identify run or start duty before comparing parts. | src/data/applicationReference.ts:18–42 |
| decision | Does the motor use a run capacitor, a switched start capacitor or separate parts for both? Run and start capacitors are not interchangeable. | src/data/applicationReference.ts:18–42 |
| comparisonTitle | Run and start capacitors for pump motors | src/data/applicationReference.ts:18–42 |
| comparisonIntro | Use the motor drawing to identify the circuit, then compare the original rating and installed space. | src/data/applicationReference.ts:18–42 |
| functions | {"CBB60":"Run capacitor for a pump motor whose specification calls for run duty.","CD60":"Start capacitor for a separately switched starting circuit, where the motor specifies one."} | src/data/applicationReference.ts:18–42 |
| confirmations | {"CBB60":"Run duty; verify the cylindrical body, fixing and lead clearance.","CD60":"Switched start duty; request the model-specific duty and time limits."} | src/data/applicationReference.ts:18–42 |
| showDimensions | false | src/data/applicationReference.ts:18–42 |
| checks | [["Pump, motor and circuit","Provide the equipment and motor model with its diagram or specification. Identify run duty, switched start duty or both; list each part separately and request start-duty and time limits where needed."],["Original rating","Include a clear capacitor-label photograph showing the original µF, VAC and any duty marking for each part."],["Body and fixing","Measure diameter, height, mounting stud and fixing details. Compare them with the drawing and the available enclosure space."],["Connections and clearance","Include a connection photograph or drawing, lead exit, wire length and connector or terminal format. Allow room for the connections inside the housing."],["Quantity and destination","Provide the order quantity by model and destination country or market."]] | src/data/applicationReference.ts:18–42 |
| detail | {"image":"/images/real/cbb60-18.jpg","alt":"Two photographed CBB60 samples; the horizontal sample shows a threaded base stud.","caption":"CBB60 samples · base stud visible on the horizontal sample","focus":"50% 55%"} | src/data/applicationReference.ts:18–42 |
| guide | {"label":"Check start versus run duty","href":"/resources/start-vs-run-capacitors/"} | src/data/applicationReference.ts:18–42 |
| inquiryLabel | Prepare a pump inquiry | src/data/applicationReference.ts:18–42 |

### fans-ventilation

| 字段 | 当前值 | 源 |
| --- | --- | --- |
| lead | Check the electrical rating and the fit inside the fan housing. | src/data/applicationReference.ts:43–67 |
| decision | Which case and connection format fits the fan housing? Compare the required electrical rating and installed fit together. | src/data/applicationReference.ts:43–67 |
| comparisonTitle | Run-capacitor formats for fan motors | src/data/applicationReference.ts:43–67 |
| comparisonIntro | CBB61 and CBB60 are run-capacitor series. Compare the required electrical values and mechanical format together. | src/data/applicationReference.ts:43–67 |
| functions | {"CBB61":"Compact rectangular run capacitor for fan and blower motors with matching specifications.","CBB60":"Cylindrical run capacitor where the motor specification and installation space call for this format."} | src/data/applicationReference.ts:43–67 |
| confirmations | {"CBB61":"Rectangular case; verify mounting tabs and the lead or blade-terminal arrangement.","CBB60":"Cylindrical body; verify fixing and lead clearance."} | src/data/applicationReference.ts:43–67 |
| showDimensions | true | src/data/applicationReference.ts:43–67 |
| checks | [["Fan, motor and rating","Provide the equipment and motor model with the original motor specification. Include the capacitor label showing µF and VAC, and confirm that the motor calls for run duty."],["Case and mounting","Measure case length, width and height or body diameter and height, fixing positions and available space inside the fan housing."],["Leads or terminals","For wired parts, record lead count, exit direction, length and connector. For blade terminals, include the terminal pattern. Compare with the original sample or drawing; matching wire counts alone do not establish compatibility."],["Original sample or drawing","Include clear label, side and connection photographs, or the original drawing."],["Quantity and destination","Provide the order quantity by model and destination country or market."]] | src/data/applicationReference.ts:43–67 |
| detail | {"image":"/images/real/cbb61-leads-10.jpg","alt":"Two real CBB61 samples with red leads and visible mounting tabs.","caption":"CBB61 samples · lead exit and mounting tabs","focus":"50% 78%"} | src/data/applicationReference.ts:43–67 |
| guide | {"label":"Review dimensions and terminal fit","href":"/resources/dimensions-terminals-mounting/"} | src/data/applicationReference.ts:43–67 |
| inquiryLabel | Prepare a fan inquiry | src/data/applicationReference.ts:43–67 |

### appliances-small-motors

| 字段 | 当前值 | 源 |
| --- | --- | --- |
| lead | Start with the original motor and capacitor label. | src/data/applicationReference.ts:68–92 |
| decision | Which motor circuit does the capacitor serve? The appliance name alone cannot establish its duty. | src/data/applicationReference.ts:68–92 |
| comparisonTitle | Run-capacitor formats for appliance motors | src/data/applicationReference.ts:68–92 |
| comparisonIntro | CBB60 and CBB61 are run-capacitor series. The original motor must specify run duty, and the proposed case and connections must fit. | src/data/applicationReference.ts:68–92 |
| functions | {"CBB60":"Cylindrical run-capacitor format for single-phase appliance motors with matching specifications.","CBB61":"Compact rectangular run-capacitor format for appliance assemblies with matching specifications."} | src/data/applicationReference.ts:68–92 |
| confirmations | {"CBB60":"Cylindrical body; verify fixing and lead clearance.","CBB61":"Rectangular case; verify fixing and the lead or blade arrangement."} | src/data/applicationReference.ts:68–92 |
| showDimensions | true | src/data/applicationReference.ts:68–92 |
| checks | [["Equipment, motor and rating","Identify the appliance and specific motor served. Provide its specification or diagram and record the original duty, capacitance and rated voltage."],["Original part record","Include clear capacitor-label, side and connection photographs, or the original drawing."],["Wiring and connector","Compare the lead or blade arrangement with the original part and motor drawing, even when the wire counts match."],["Case and fixing","Include cylindrical or rectangular case dimensions, fixing details and installed clearance within the appliance."],["Quantity, destination and documents","Provide the initial order or annual forecast quantity, destination country or market and required documents."]] | src/data/applicationReference.ts:68–92 |
| detail | {"image":"/images/real/cbb61-leads-10.jpg","alt":"Photograph of rectangular CBB61 samples with separate wire leads and mounting tabs.","caption":"CBB61 samples · wire leads and mounting tabs","focus":"50% 78%"} | src/data/applicationReference.ts:68–92 |
| guide | {"label":"Read the original capacitor label","href":"/resources/read-motor-capacitor-label/"} | src/data/applicationReference.ts:68–92 |
| inquiryLabel | Prepare an appliance inquiry | src/data/applicationReference.ts:68–92 |

## A7. 媒体文件存在性与未确认内容

208 个实际引用的唯一图片路径已对 `public` 进行本地文件存在性核对；缺失 0 个。

尚未确认：CSS断点下视觉顺序、React交互、图片像素内容、外部原系列/Oriental Motor链接可达性、实际询盘发送结果。只提取目标与代码，不执行询盘、外部发送或生产发布。


## A8. 浏览器初始 DOM证据核对

浏览器提取 heading.textContent 不会为 `<br>` 和相邻 span插入空格，因此产品详情H1如 `CBB60motor run capacitors`、目录卡片如 `CBB60Motor run capacitor` 是原始DOM文本；上文用产品title和分行语义记录实际标题内容，没有重写。产品图库 H2虽在 heading列表中，但属于默认关闭的dialog，不能当作默认可见独立Section。产品Section列表有8项，加上中间section-nav形成9个M编号。

| URL | 实际 document.title | 初始heading序列 | section个数 | 初始image节点 | video节点 |
| --- | --- | --- | --- | --- | --- |
| /applications/ | Motor capacitors by application \| Hanxing Capacitor | H1: Motor capacitors by application → H2: HVAC & refrigeration → H2: Pumps & water systems → H2: Fans & ventilation → H2: Appliances & small motors | 2 | 4 | 0 |
| /products/ | Motor capacitor series \| Hanxing Capacitor | H1: Motor capacitor series → H2: CBB60Motor run capacitor → H2: CBB61Fan run capacitor → H2: CBB65HVAC run capacitor → H2: CD60Motor start capacitor → H2: Series comparison → H2: Check a capacitor for your motor | 4 | 4 | 0 |
| /products/photographs/ | Product sample photographs \| Hanxing \| Hanxing Capacitor | H1: Product sample photographs | 2 | 8 | 0 |
| /products/cbb60-motor-run-capacitor/ | CBB60 motor run capacitors \| Hanxing Capacitor | H1: CBB60motor run capacitors → H2: CBB60 sample photographs → H2: Technical specifications → H2: Samples and mechanical fit → H3: Original rating → H3: Body and mounting stud → H3: Space for the leads → H2: Applications → H2: OEM and purchasing → H2: Documents for your CBB60 model → H2: Request a CBB60 quotation → H2: Other capacitor series → H3: CBB61 → H3: CBB65 → H3: CD60 | 8 | 9 | 0 |
| /products/cbb61-fan-capacitor/ | CBB61 fan capacitors \| Hanxing Capacitor | H1: CBB61fan capacitors → H2: CBB61 sample photographs → H2: Technical specifications → H2: Samples and mechanical fit → H3: Original rating → H3: Case and fixing points → H3: Wiring and terminals → H3: Blade-terminal samples → H2: Applications → H2: OEM and purchasing → H2: Documents for your CBB61 model → H2: Request a CBB61 quotation → H2: Other capacitor series → H3: CBB60 → H3: CBB65 → H3: CD60 | 8 | 10 | 0 |
| /products/cbb65-air-conditioner-capacitor/ | CBB65 HVAC capacitors \| Hanxing Capacitor | H1: CBB65HVAC capacitors → H2: CBB65 sample photographs → H2: Technical specifications → H2: Samples and mechanical fit → H3: Single or dual run → H3: Terminal groups → H3: Can and mounting → H3: Single-run sample → H2: Applications → H2: OEM and purchasing → H2: Documents for your CBB65 model → H2: Request a CBB65 quotation → H2: Other capacitor series → H3: CBB60 → H3: CBB61 → H3: CD60 | 8 | 10 | 0 |
| /products/cd60-start-capacitor/ | CD60 motor start capacitors \| Hanxing Capacitor | H1: CD60motor start capacitors → H2: CD60 sample photographs → H2: Technical specifications → H3: Sample label and series data → H2: Samples and mechanical fit → H3: Starting circuit → H3: Rating and duty markings → H3: Case and terminals → H2: Applications → H2: OEM and purchasing → H2: Documents for your CD60 model → H2: Request a CD60 quotation → H2: Other capacitor series → H3: CBB60 → H3: CBB61 → H3: CBB65 | 8 | 9 | 0 |
| /applications/hvac-refrigeration/ | Motor capacitors for HVAC & refrigeration \| Hanxing Capacitor | H1: HVAC & refrigeration → H2: Run and start capacitors for HVAC applications → H2: Check and prepare your inquiry → H3: Equipment, motor and circuit → H3: Original label and values → H3: Terminal groups → H3: Can and mounting space → H3: Quantity, destination and documents | 3 | 4 | 0 |
| /applications/pumps-water-systems/ | Motor capacitors for pumps & water systems \| Hanxing Capacitor | H1: Pumps & water systems → H2: Run and start capacitors for pump motors → H2: Check and prepare your inquiry → H3: Pump, motor and circuit → H3: Original rating → H3: Body and fixing → H3: Connections and clearance → H3: Quantity and destination | 3 | 4 | 0 |
| /applications/fans-ventilation/ | Motor capacitors for fans & ventilation \| Hanxing Capacitor | H1: Fans & ventilation → H2: Run-capacitor formats for fan motors → H2: Check and prepare your inquiry → H3: Fan, motor and rating → H3: Case and mounting → H3: Leads or terminals → H3: Original sample or drawing → H3: Quantity and destination | 3 | 4 | 0 |
| /applications/appliances-small-motors/ | Capacitors for appliances & small motors \| Hanxing Capacitor | H1: Appliances & small motors → H2: Run-capacitor formats for appliance motors → H2: Check and prepare your inquiry → H3: Equipment, motor and rating → H3: Original part record → H3: Wiring and connector → H3: Case and fixing → H3: Quantity, destination and documents | 3 | 4 | 0 |

## 静态模块媒体依赖

全部下面 23 个 URL 对应 `public{url}` 文件于提取时存在（文件已验证），浏览器视觉与解码/视频播放未由本稿验证。真实/illustrative 的区分采用当前路径、alt和正文出处标记，未独立鉴定影像真实性。

| 媒体 URL | 实际接入位置 | 源码 |
|---|---|---|
| `/images/illustrative/home-porcelain-family.webp` | 首页M01 illustrativeHero | `index.astro:11` |
| `/images/real/batch-products.jpg` | 首页M01来源原图链接；aboutM02样本图 | `index.astro:19`；`src/pages/about.astro:8` |
| `/images/real/film-rolls.jpg` | 首页M03video still；factoryM02filmvideo poster | `index.astro:25`；`src/pages/factory.astro:51` |
| `/images/illustrative/home-production-capacitor-studio-v3.webp` | 首页M03illustrativesamples | `index.astro:26` |
| `/images/real/cbb60-hanxing-wired.jpg` | 首页M02CBB60 | `src/data/site.ts:45`→`src/components/ProductRail.tsx:11` |
| `/images/real/cbb61-13.jpg` | 首页M02CBB61 | `src/data/site.ts:63`→`src/components/ProductRail.tsx:11` |
| `/images/real/cbb65-2.jpg` | 首页M02CBB65 | `src/data/site.ts:81`→`src/components/ProductRail.tsx:11` |
| `/images/real/cd60-25.jpg` | 首页M02CD60 | `src/data/site.ts:100`→`src/components/ProductRail.tsx:11` |
| `/images/illustrative/application-hvac-v1.webp` | 首页M04HVAC应用 | `src/data/site.ts:135`→`index.astro:32` |
| `/images/illustrative/application-pumps-v3.webp` | 首页M04pumps应用 | `src/data/site.ts:142`→`index.astro:32` |
| `/images/illustrative/application-fans-v1.webp` | 首页M04fans应用 | `src/data/site.ts:149`→`index.astro:32` |
| `/images/illustrative/application-appliances-v2.webp` | 首页M04appliances应用 | `src/data/site.ts:156`→`index.astro:32` |
| `/images/real/cbb65-dual-run-7.jpg` | RFQM01原图；SelectionAssistant未接入fieldguide分支 | `src/pages/buying-guide.astro:28`；`src/components/SelectionAssistant.tsx:10` |
| `/videos/winding-equipment.mp4` | factoryM02Productionequipment | `src/pages/factory.astro:41` |
| `/images/real/winding-equipment.jpg` | 该视频poster | `src/pages/factory.astro:41` |
| `/videos/test-area-equipment.mp4` | factoryM02Testingarea | `src/pages/factory.astro:46` |
| `/images/real/test-area.jpg` | 该视频poster | `src/pages/factory.astro:46` |
| `/videos/film-roll-equipment.mp4` | factoryM02Filmhandling | `src/pages/factory.astro:51` |
| `/videos/packing-scene.mp4` | packingM01portraitvideo | `src/pages/factory/packing-and-dispatch.astro:18` |
| `/images/real/packing-scene.jpg` | 该视频poster | `src/pages/factory/packing-and-dispatch.astro:18` |
| `/images/real/dispatch-pallets.jpg` | packingM04dispatcharea照片 | `src/pages/factory/packing-and-dispatch.astro:22` |
| `/images/real/inspection-station.jpg` | oemqualityM02feature | `src/pages/oem-quality.astro:9` |
| `/images/real/cbb65-4.jpg` | oemM01packagingsample | `src/pages/oem.astro:6` |

未接入 `SelectionAssistant field-guide` 额外媒体 `/images/real/cbb61-leads-10.jpg` 仅记录库存，未计入 23 个当前静态页依赖。contact/buying/company/faq/quote/status/legal/type页没有凭空的case/customerlogo/certificate/download文件模块。


## 接入状态分支与未接入代码库存

### C-ST-RAIL · ProductRail（接入首页）

- 接入位置 `src/pages/index.astro:21`，无 hydration 指令。
- 固定标题 `Find your capacitor`，数据产品 `map`；图片/代码均到 `products/{slug}`；显示shortName、capacitance、voltage。
- CBB65显示single范围与dual detail提示，为当前真实特有条件；原data中的dual完整range不是此首页卡的输出。
- 实现 `src/components/ProductRail.tsx:3–19`；它无 useState/useEffect，无 Next/Previous 按钮。移动/横向滚动样式不等于JS轮播。

### C-ST-SELECTION · SelectionAssistant（仅 compact 接入 buying-guide）

- 当前全局引用搜索：`src/pages/buying-guide.astro:3,48`；`variant="compact"`。
- 实现 `src/components/SelectionAssistant.tsx:14–32`：默认choice=hvac；group按钮 `HVAC / Refrigeration`、`Pump / Water`、`Fan / Ventilation`、`Other motor`；aria-pressed随choice；结果aria-live。
- 规则 `src/components/SelectionAssistant.tsx:3–8`：

| choice | 结果 H3 | 内容摘要 | series及链接 |
|---|---|---|---|
| hvac | Check the HVAC motor circuit | single/dualrun；separatestart检查CD60；发motordiagram/µF/terminal | CBB65 → `/products/cbb65-air-conditioner-capacitor/`；CD60 → `/products/cd60-start-capacitor/` |
| pump | Identify run or start duty | CBB60running/CD60starting；按wiringduty | CBB60 → `/products/cbb60-motor-run-capacitor/`；CD60同上 |
| fan | Check the rating and fit | CBB61rectangularfans；matchlabel/wiring/size/leads | CBB61 → `/products/cbb61-fan-capacitor/`；CBB60同上 |
| other | Start with the original component | motor/model/label/drawing/dimensions/quantity用于review | Technical review → `/contact/#inquiry-form` |

- 每个状态的CTA `Contact about this application` → `/contact/?application=hvac|pump|fan|other`（28行，无inquiryformfragment）。
- **未接入分支**：`variant="field-guide"` 会用H2、箭头与samplefigure：hvac cbb65-dual-run-7；pump cbb60-hanxing-wired；fan cbb61-leads-10；other无sample。相关source 9–13、17–19、21、27–30行。不能把这些图片写成buying-guide当前显示媒体。

### C-ST-STATUS · ThankYouStatus（接入 thank-you）

- 唯一接入：`src/pages/thank-you.astro:3,5`；client:only=react。
- 字段型 `Result={id,status,confirmationSent?,message?}`；`message`没有在当前UI输出。
- `sessionStorage`真实条件与文案详见上面thank-you M02，源码 `src/components/ThankYouStatus.tsx:1–3`。无result时初始null且effect读取后可能替换。
- `JSON.parse`失败被忽略；未校验对象结构，只以result truthiness输出reference/status；不在此请求行为或真实交付上作额外推断。

### C-UNUSED-QUOTE · QuoteForm（存在，当前未接入页面）

全 `src` 搜索 `QuoteForm` 仅命中自身定义，未发现路由import/use。因此下列是**未接入组件代码库存**，不是 `/contact/` 或 `/request-a-quote/` 当前模块。

- 实现 `src/components/QuoteForm.tsx:1–73`；React state，URL series/application预设（6–15行）；最多5个spec items（55行），添加/删除（53–55行）；每项series、µF、VAC、description，折叠function/dimensions/terminals（39–56行）。
- Contact details H2：Full name*、Work email*、Company*、Country/region*（29–37行）。
- Order details H2：estimatedquantity、requirements*、附件；允许PDF/JPG/JPEG/PNG/WebP、最多4文件、每5MB；附加折叠application/destination/phone/documents（57–70行）；hiddenhoneypotwebsite/context（27–28行）。
- Submit privacynotice、busy/button、error alert（71行）。
- 提交代码（17–24行）构造FormData/specifications/application/attachments，`fetch('/api/inquiries/', {method:'POST',body:form})`；response成功写 `sessionStorage['hanxing-inquiry-result']`，跳转 `/thank-you/`；失败error包含返回ID时Reference。不在本稿调用或实测；API由主稿单列。
- 不能把未接入的上传、多规格、POST功能写成当前contactform已具有。

### C-UNUSED-TYPOGRAPHY · TypographyPreview（存在，当前未接入页面）

全 `src` 搜索 `TypographyPreview` 仅命中自身定义，未发现路由引用。下列为组件库存，**不是 `/typography-preview/` 当前DOM**。

- `src/components/TypographyPreview.tsx:12–24` 有11字体方案（8single：Inter/Manrope/Geist/DMSans/PlusJakarta/IBMPlex/SourceSans3/SpaceGrotesk；3pair：Manrope+Inter、Geist+SourceSans、Space+SourceSans）。
- React selectedId默认inter（39–48行），effect将previewfontvars写到documentbody（50–63），卸载清理；previous/next/select/左右键切换（65–75、89–108行）。
- 当前组件内模块顺序：heading（80–87）、selector（89–108）、specimen（110–209，含mocknav、vehicleHero、hierarchy/weight、RefrigeratedTruckcard/vehicledata、numbers、case/CJK、quote）、tokens（211–227）、previouscomparisons（229–243）、footernote（244）。
- 这些 vehicle/Projects/ISO/etc 为早期字体样例而非本网站存在的车辆页面/项目/认证；当前Astro路由已声明样例仅用作字体展示。不得把此未接入样张内容并入真实业务网站结构。


## 图例复用源码定位

| guideExamples复用对象 | 数据源码 |
|---|---|
| cbb65Label | `src/data/guideExamples.ts:3-10` |
| cbb65Terminals | `src/data/guideExamples.ts:11-18` |
| cbb65Dual | `src/data/guideExamples.ts:19-26` |
| cbb60Stud | `src/data/guideExamples.ts:27-34` |
| cbb61Samples | `src/data/guideExamples.ts:35-42` |
| cd60Sample | `src/data/guideExamples.ts:43-50` |

各页对应组及覆盖title/text位于53–63行；图例展开顺序和最终覆盖文本已在每页M02记录。
