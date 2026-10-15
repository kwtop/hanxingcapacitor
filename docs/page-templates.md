# 当前页面模板

日期：2026-10-12；项目：`D:/Hangxing/workspace`。模板ID是提取时的分类标识，除真实组件/布局外不宣称存在同名模板文件。页面实例和URL详见 [website-blueprint.md](website-blueprint.md)，逐M内容详见 [module-inventory.md](module-inventory.md)。

所有33个Astro页面共用S01 BaseLayout/S02 Header/S03 MobileNav/S04 Footer。S05 Breadcrumb、S06 CTA为内联模式，没有独立组件文件。共享结构不重复记成每页固定业务模块。public试验HTML使用S10/S11独立外壳。

## 多页业务模板与实例条件

| 模板 | 覆盖页面 | 固定模块 | 可选 / 条件模块 | 数据驱动内容 | 页面特有 |
| --- | --- | --- | --- | --- | --- |
| T-PRODUCT-CATALOG | /products/ | M01 Hero、M02过滤卡片、M03对比、M04CTA | 用户过滤All/Run/Start改变卡片，不生成新页 | products；function过滤；卡片code/name/tagline/image、表格rating/terminals | 目录专属比较表与Browse 96入口 |
| T-SAMPLE-LIBRARY | /products/photographs/ | M01 Hero、M02图库 | filter、limit、isOpen；Show more仅limit<items.length；series参数的通用逻辑本页未传 | sampleLibrary96条，id/series/label/thumb/src | 此路由全部96与Additional samples |
| T-PRODUCT-REFERENCE | 4个产品详情 | M01 Hero/gallery、M02section-nav、M03specs、M04fit、M05apps、M06purchasing、M07docs、M08RFQ、M09related | CBB65/CD60 Hero scope；CD60 spec note；alternateSamples>0；applicationLinks[index]决定href | products、productReference[code]、sampleConfigurations、productPhotos+sampleLibrary、others | CBB65 single/dual范围、CD60 start-duty/sample-label差异 |
| T-APPLICATION-DIRECTORY | /applications/ | M01 Hero、M02card-directory | 无业务分支；图片lazy loading非可选模块 | applications4条 | 无目录独立CTA band |
| T-APPLICATION-REFERENCE | Pumps、Fans、Appliances3详情 | M01hero、M02comparison、M03inquiry | showDimensions控制M02尺寸行；比较图caption按CBB61分支 | applicationReference[slug] + applications + selected products | Pumps run/start，Fans/Appliances两种run format |
| T-HVAC-REFERENCE | HVAC详情 | M01hero、M02comparison、M03inquiry | 无showDimensions条件；HVAC独立组件 | applicationsHVAC scenarios+image、CBB65/CD60 product.image、CD60capacitance/voltage | 专用lead/summary、single/dual table硬编码、terminaldetail、不提供打开原图anchor |

### 条件渲染与生成矩阵

| 条件 / 项目 | CBB60 | CBB61 | CBB65 | CD60 | 来源 |
| --- | --- | --- | --- | --- | --- |
| M01 code===CBB65 scope | false | false | true | false | src/components/ProductReference.astro:33 |
| M01 code===CD60 scope | false | false | false | true | src/components/ProductReference.astro:34 |
| M03 CD60 sample-label note | false | false | false | true | src/components/ProductReference.astro:45 |
| M04 alternateSamples.length > 0 | false（0） | true（1，cbb61-blades） | true（1，cbb65-single） | false（0） | src/components/ProductReference.astro:13,54 |
| M01 special Hero capacitance/voltage | 产品范围 | 产品范围 | 只显示single范围，dual在M03 | 产品范围 | src/components/ProductReference.astro:15–16,32 |
| M05 applicationLinks truthiness序列 | true,true,true,false | true,true,true,true | true,true,true,true | false,true,true | src/data/productReference.ts:23,37,51,65 |
| gallery总条目 | 26 | 15 | 20 | 12 | src/pages/products/[slug].astro:11–15 |
| gallery排除P001,P002,P003 | true | false | false | false | src/pages/products/[slug].astro:13 |
| M08 Capacitance提示 | Original marking | Original marking | Both values for dual run | Original marking | src/components/ProductReference.astro:63 |

| 条件 / 项目 | HVAC | Pumps | Fans | Appliances | 来源 |
| --- | --- | --- | --- | --- | --- |
| HVAC ternary分支 | HvacReference | ApplicationReference | ApplicationReference | ApplicationReference | applications/[slug].astro:11 |
| showDimensions尺寸行 | 不适用，无该行 | false | true | true | src/components/ApplicationReference.astro:38；src/data/applicationReference.ts:31,56,81 |
| 比较series顺序 | CBB65,CD60 | CBB60,CD60 | CBB61,CBB60 | CBB60,CBB61 | src/data/site.ts:136,143,150,157 |
| CBB61 sample caption条件 | false,false | false,false | true,false | false,true | src/components/ApplicationReference.astro:34 |
| inquiry full-photo anchor | false（只有img） | true | true | true | src/components/HvacReference.astro:55 / src/components/ApplicationReference.astro:50 |

图库的 `opened` / `view`、照片库的 `isOpen` / `filter` / `limit` 属于用户状态分支；这里只验证了实现表达式，未声称操作成功。产品详情gallery初始化 active=0/view=grid/current=0/opened=false；featured=photos.slice(0,4)。当打开grid则渲染全部thumb；photo view插入selected.src，Previous/Next循环，ArrowLeft/Right只在photo view生效；Open original目标selected.src。document全局[data-product-photo]按钮根据照片src定位，找不到时打开grid。


## 资源目录 T-RESOURCE-INDEX

| 固定模块 | 可选模块 | 数据驱动内容 | 当前特有内容与源码 |
|---|---|---|---|
| M01 Hero → M02 Resource shortcuts → M03 Electrical selection → M04 Dimensions & connections → M05 Ordering & delivery → M06 model-record出口 | 没有当前业务条件模块；无封面缩略图 | guideGroups按slugs过滤guides，保留guides数组顺序；article title/summary/href | 索引3组5+1+1文章；5个快捷入口；src/pages/resources/index.astro:4–12 |

## 技术指南 T-GUIDE-ARTICLE

覆盖当前7篇指南。固定结构由同一个动态路由文件生成；各实例的小节、图例与可选字段见条件矩阵。

| 模块角色 | 固定/可选 | 当前生成机制 | 源码 |
|---|---|---|---|
| Hero | 固定、数据驱动 | title→H1，answer→lead，summary仅用于meta；Breadcrumb；inquiry.heading锚点出口 | `src/pages/resources/[slug].astro:17-18` |
| Hero 规格链接 | 可选 | products.filter(title.includes(code))；只有 CBB 比较页命中 3 个 | `src/pages/resources/[slug].astro:10,18`；`src/data/site.ts:39-114` |
| 样例图片 | 固定、数据驱动 | guideExamples[slug].heading、photos；无缺失保护 | `src/pages/resources/[slug].astro:21`；`src/data/guideExamples.ts:52-64` |
| 正文小节 | 固定循环、数量可变 | sections.map；h2、paragraphs；6篇2节、订单5节 | `src/pages/resources/[slug].astro:22` |
| 列表 | 可选 | section.points &&；CBB比较第一节3点，订单5节14点 | `src/pages/resources/[slug].astro:22` |
| Further reading | 可选 | section.links &&；aria-label动态含该节标题 | `src/pages/resources/[slug].astro:22` |
| References | 条件模块，当前全有 | sources.length>0；新标签链接 | `src/pages/resources/[slug].astro:23` |
| 专项询盘 | 固定、数据驱动 | inquiry.heading/note/label/request；联系页guide/request查询；固定RFQ模板链接 | `src/pages/resources/[slug].astro:15,24` |
| On this page | 固定、数据驱动 | examples+sections+条件references+inquiry锚点；native details、响应式开合脚本 | `src/pages/resources/[slug].astro:26,28-35` |
| Related resources | 固定容器、数据驱动 | related数组+All resources固定链接 | `src/pages/resources/[slug].astro:26` |
| guideFormat | 页面条件分支 | sequence / comparison / label / fit | `src/pages/resources/[slug].astro:12-14,19` |
| 插图 provenance | 可选子组件 | src前缀为illustrative才显示提示；只订单页两图命中 | `src/components/PhotoDetail.astro:4-7` |

### 3.1 全部实例条件矩阵

| slug | format | 样例数 | sections | 段落数 | points数 | section links数 | sources数 | Hero规格链接 | request |
|---|---|---:|---:|---:|---:|---:|---:|---|---|
| start-vs-run-capacitors | comparison | 2 | 2 | 4 | 0 | 1 | 3 | 无 | documents |
| cbb60-vs-cbb61-vs-cbb65 | comparison | 3 | 2 | 3 | 3 | 1 | 3 | CBB60, CBB61, CBB65 | quote |
| single-vs-dual-run-capacitors | comparison | 2 | 2 | 4 | 0 | 1 | 2 | 无 | quote |
| read-motor-capacitor-label | label | 2 | 2 | 4 | 0 | 2 | 2 | 无 | quote |
| capacitance-voltage-guide | label | 2 | 2 | 4 | 0 | 1 | 3 | 无 | documents |
| dimensions-terminals-mounting | fit | 2 | 2 | 4 | 0 | 0 | 3 | 无 | documents |
| motor-capacitor-order-shipment-checklist | sequence | 3 | 5 | 0 | 14 | 0 | 2 | 无 | quote |

### 3.2 顺序：DOM、Desktop、手机分别记录

- 本文 M 编号按 DOM：Hero → article 样例 → 每个正文小节 → References → inquiry → aside TOC → Related。Header/Footer/Breadcrumb 不重复编号。
- Desktop 文章与右侧264px guide-navigation 两列并行，TOC/Related 伴随 article，sidebar sticky，不是正文结束后才在视觉中出现。`src/styles/site-porcelain.css:101,106,157`、`src/styles/finesse-redesign.css:131-139`。
- <=800px 当前后加载 `src/styles/site-porcelain.css:193-197`：guide-navigation=display:contents；TOC grid-row:1 → article grid-row:2 → Related grid-row:3。视觉顺序为 Hero → TOC → 整个 article → Related。不要把 src/styles/finesse-redesign.css:309 的旧 order:-1 单独当最终顺序。BaseLayout:8-9 导入顺序证明 porcelain 后加载。
- TOC 初始 details open；客户端 script 把 <=800px 设置 closed、宽屏设置 open，监听断点 change。`src/pages/resources/[slug].astro:28-35`。本轮 start-vs-run 实例已核对1440/390下脚本初始开合；用户点击与其余断点未测。
- comparison 型 3图例3列、正文2列；label/sequence 型图例单列图文行；sequence 小节标题/列表分列；<=800px正文 block，<=570px图例单列。`src/styles/finesse-redesign.css:142-163,317-323,380-386`，porcelain覆盖部分字号。这些规则来自CSS；仅 start-vs-run 的1440/390阅读顺序另有实测，其余布局未逐项测量。


## 当前单页组成规则

下列页面正文直接写在对应.astro文件，并没有共用一个“普通静态页业务模板”。同样的Hero/section class只属于表现模式。


这里“模板”用于记录当前既有页面的组成规则，不声称项目存在对应单独模板文件。除 BaseLayout 外，多数静态页面的业务正文在页面内自写；不同页面有相似 Hero/section/button class 也不能自动断言共用内容模板。

| 模板 ID | 实际页面 | 固定模块 | 可选/条件模块 | 数据驱动内容 | 页面特有/源码 |
|---|---|---|---|---|---|
| T-ST-HOME | `/` | M01 Hero、M02 series、M03 production、M04 apps+guides、M05 inquiry | M02 CBB65 Otherformat行；4产品4应用数目取决数据 | products 与 applications；ProductRail只SSR使用，无 client指令 | porcelainHero/production媒体与首页CTA；`index.astro` / `src/components/ProductRail.tsx` |
| T-ST-ABOUT | `/about/` | M01title、M02story、M03profile、M04supplierrecords | 无条件可选模块 | public company/address/email/WhatsApp/officialsite常量 | 身份关系未确认文本；`src/pages/about.astro` |
| T-ST-CONTACT | `/contact/` | M01title、M02directcontact、M03draftform | M01有效query上下文；M03渠道email/WhatsApp字段互斥；M04校验后draftresult；noscript | configurationNames、photoReferences、guideNames、公共联系信息 | 浏览器草稿生成与复制；`src/pages/contact.astro`，不是QuoteForm |
| T-ST-RFQ | `/buying-guide/` | M01hero、M02template、M03notes | M04 details内SelectionAssistant；copy成功/失败status | requestTemplate数组、SelectionAssistant规则和product链接 | RFQ nine-fieldpre、原dual-runphoto；`src/pages/buying-guide.astro` |
| T-ST-FACTORY | `/factory/` | M01hero、M02threevideos、M03recordtable、M04process、M05CTA | VideoFigure播放/错误/noscript分支 | page-local records数组 | 来源边界、modelrecords；`src/pages/factory.astro` |
| T-ST-PACKING | `/factory/packing-and-dispatch/` | M01hero+video、M02packing、M03records、M04handover、M05inquiry+sources | 播放失败status；reduced-motion滚动差异 | page-local records数组 | 竖屏包装video、dispatchphoto、exportreference；`src/pages/factory/packing-and-dispatch.astro` |
| T-ST-CAPABILITY-HUB | `/oem-quality/` | M01title、M02manufacturingfeature、M03OEM+packing、M04checklist | 无 | 无外置业务数据 | 三个能力详情入口；`src/pages/oem-quality.astro` |
| T-ST-OEM | `/oem/` | M01heroMOQ、M02samplesquotation、M03DefineConfigureApproveOrder | 无 | STANDARD_MOQ_PCS | 样品审批流程、cbb65-4图片；`src/pages/oem.astro` |
| T-ST-FAQ | `/faq/` | M01title、M02selection、M03OEMinquiry、M04orders | 每个details答案/CTA随用户展开；内容预先在DOM内 | questions/nextSteps/questionGroups本地数组（12问、3组） | regroup顺序；`src/pages/faq.astro` |
| T-ST-NOTICE | `/privacy-policy/` | M01title、M02draft、M03information、M04identity、M05questions | 无 | publicbusiness/contact常量 | privacy正文；`src/pages/privacy-policy.astro` |
| T-ST-QUOTE-PREP | `/request-a-quote/` | M01title、M02detailchecklist、M03helpsidebar | CTA可带允许query | guides/applications用于allowed参数校验 | noindex、contact CTA构造、非redirect；`src/pages/request-a-quote.astro` |
| T-ST-STATUS | `/thank-you/` | M01title、M02clientstatus、M03browse | M02无reference/local_preview/emailaccepted/confirmationSent分支 | sessionStorage结果对象 | noindex、client:only；`src/pages/thank-you.astro` / `src/components/ThankYouStatus.tsx` |
| T-ST-ERROR | `/404/`；未知路由回退未确认 | M01errorhero+两出口 | route服务回退行为需要runtime探针 | 无 | noindex；`src/pages/404.astro` |
| T-ST-TYPE-SPECIMEN | `/typography-preview/` | M01说明、M02roles、M03numbers | 无字体切换 | roles14项、examples6项 | 内部样张noindex；`src/pages/typography-preview.astro` |


## public独立设计页组成规则

| 提取模板 | 实例 | 固定模块/外壳 | 条件/可选 | 数据驱动/页面特有 |
|---|---|---|---|---|
| T-PUBLIC-HOME-DEMO | root a/b/c/d/e 与 r2 object/studio/editorial/red-object，共9页 | S10 Header/Footer；各页2–3正文section，顺序详见模块清单 | 单页布局CSS断点；主要CTA为本页锚点；没有JS询盘提交或正式数据绑定 | 每页已经写死的标题/照片/series/proof/inquiry布局；manifest是比较元数据，不是正式产品路由生成器 |
| T-PUBLIC-EXPLORER | 两个style-explorer，共2页 | S11工具栏；M01并排grid；M02单张loupe为互斥状态 | layout、viewport、current、choice、zoom；empty/toast状态；prev/next和复制 | 脚本内嵌候选HTML及manifest数据，srcdoc iframe；不用正式站BaseLayout；同名工具壳物理复制在两文件 |

## 边界与实际顺序补充

- 产品详情图库默认closed dialog，视图切换是状态；M01的图库与M04机械样本按钮相互关联，不产生照片详情新路由。
- 文章模板DOM编号顺序保持Hero→article→aside；桌面两列并行。1440/390实测与最终CSS一致：390下TOC→article→Related；这次测的是start-vs-run实例。
- /contact/ M04是form validation成功后的draft-result；当前默认隐藏。request/query预填在本机已核对，不等于外部发送。
- /thank-you/ M02仅依赖sessionStorage；默认No inquiry reference found；非默认状态未本轮构造。
- /typography-preview/是静态样张，未接入TypographyPreview.tsx；不存在这些样张对应的车辆/认证页面。
- /request-a-quote/非redirect；没有Case/Customer/Certificate/Download页面模板实例。
- guide.sources.length>0在当前7篇都为true；section.points/links与format每篇的真实状态见上表；不把可选能力当成全部页面必有模块。
