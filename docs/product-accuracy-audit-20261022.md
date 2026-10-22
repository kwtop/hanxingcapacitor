# 产品信息准确性与真实性核查

核查日期：2026-10-22。对象：`D:/Hangxing/workspace` 当前本地版本。

## 结论

四个系列的产品分类、运行／起动用途和多数基本描述有依据。CBB60、CBB65、CD60 的主要系列参数，以及 CBB61 的容量、尺寸，可以追溯到用户提供的画册。网站已经保留了原始样品照片，也明确区分了系列范围与样品标签。

但目前资料尚未把“系列介绍—具体型号—对应图片—规格书—认证／检验记录”逐项对应起来。现状适合作为系列介绍和询价目录，不能视为每个展示型号、每组参数组合、每张图片标签均已完成技术验证。

最需要处理的是：CBB60 生成图的认证文字重绘；CD60 样品与系列参数不一致；CBB60／CBB61 的温度等级对应关系；CBB65 原画册内部的范围差异；品牌、销售主体与制造商身份的对应关系。这些问题不能靠把文案语气改得更肯定来解决。

本轮只核查和记录，未修改网页、图片或部署。核查依据为当前源码、实际引用的本地图片、原画册整页及公开技术资料；没有完成本地页面的实时浏览器渲染验收，也没有实物测量、工厂验厂或证书数据库的型号级认证核验。

## 核查依据与证明能力

| 资料 | 本轮用途 | 能证明什么 | 不能直接证明什么 |
|---|---|---|---|
| 用户提供的 [Zebang Refrigeration.pdf](<D:/Wechat/xwechat_files/wxid_p2dby6pcghl922_647d/msg/file/2026-10/Zebang Refrigeration.pdf>)，重点核查印刷第 3–8 页 | 核对四系列参数、尺寸表、品牌和连接形式 | 这些产品与参数出现在所提供的画册中 | 每种组合均可订购；所有数值经过测试；证书覆盖全部型号 |
| `public/images/real/` 中的原始样品照片 | 核对可读标签、端子、引线和品牌 | 照片上可见的标注和外形 | 实测电性能、寿命、批次质量、品牌授权 |
| `docs/capacitor-imagery-20261022/IMAGE-USAGE.json` 与 `src/data/brochureMedia.generated.json` | 核对生成图来源与用途 | 图片是原片处理还是生成展示图 | 生成后重绘文字、尺寸和内部结构的准确性 |
| TDK、Oriental Motor、TEMCo、IEC 等原始资料 | 交叉核对运行／起动、选型、气候类别与端子原理 | 行业技术原则和这些厂商自己的产品情况 | 韩兴具体型号具备其他厂商的性能或认证 |
| hanxingcapacitor.com 现有公开页面 | 比对参数历史来源、公开证书和公司名称 | 公开站点如何介绍自己 | 独立认证；不能把同一网站重复的说法当成多方验证 |

## 四个系列逐项判断

| 系列 | 当前说明与来源相符的部分 | 仍有差异或缺口 | 判断 |
|---|---|---|---|
| **CBB60** | 圆柱形薄膜运行电容；引线／插片；2–100 µF、110–450 VAC、50/60 Hz、±5%／±10%、−40～+85°C、直径 30–60 mm／高度 60–125 mm，均可在画册印刷第 7 页对应找到。原始韩兴样品为 35 µF、450 VAC、±5%。 | 35 µF 原片标 `40/70/21`，不能据系列表把这只样品直接写成 85°C 型号。新引线组合图的认证文字不能完整回溯到低清原图。 | **系列介绍基本准确；具体温度等级和生成图标签需要处理。** |
| **CBB61** | 矩形薄膜运行电容、风机等匹配的单相电机用途合理。画册印刷第 5 页列有 0.5–35 µF，尺寸外包络 L 37–73 × W 12–40 × H 24–53 mm 与网站一致。新七只组合图的 2／3.5／2.5 µF 插片和 4／5／6／8 µF 引线配置、韩兴标识，在原画册有对应来源。 | 画册尺寸表只列 250–370 VAC、350–450 VAC 两档；网站的 110 VAC 下限没有在这一页找到对应型号。85°C 和 ±10% 在目前核对的原画册 CBB61 页也缺少对应规格说明；可读样品显示 ±5%、`40/70/21`。这些数值可追溯到旧公开产品页，但这不是独立验证。 | **品类、外形和主要容量范围可靠；110V、85°C、±10% 的具体型号依据不足。** |
| **CBB65** | 金属罐薄膜运行电容，单联／双联用于匹配的 HVAC 电机。2–100 µF 单联、1+15～15+80 µF 双联及其电压、温度范围与画册摘要表一致。20 µF／450 VAC 和 50+5 µF／450 VAC 的原片都有可读韩兴标注。 | 原画册单联摘要写 2–100 µF，尺寸矩阵却还有 110、120 µF；双联摘要上限写 15+80，但详细矩阵的小容量一侧只列到 10 µF。网站单联尺寸上限 D65／H135 来自超出摘要 100 µF 上限的行。还需改善“两个独立部分”的表述。 | **样品依据较清楚；系列上限和尺寸范围需要统一。** |
| **CD60** | 铝电解起动电容、启动后断开、不能代替连续运行电容的说明正确。20–1500 µF、110–330 VAC、±10%／±20%、−20～+65°C 和尺寸外包络与画册印刷第 8 页摘要一致。 | 当前灰色样品却标 500 µF、300 VAC、±5%、`−40°C/70°C/21`。网站已提示差异，但还没有对应型号规格书解决差异。原画册 CD60 页本身还混入薄膜电容特征描述，并有表格疑似笔误。 | **用途说明正确；四系列中，型号参数一致性最需要优先确认。** |

基础用途与选型逻辑可参照 [TDK 电机电容目录](https://www.tdk-electronics.tdk.com/en/3192232/products/product-catalog/film-capacitors/motor-run-and-motor-start-capacitors)、[Oriental Motor 对电机电容替换的说明](https://faq.orientalmotor.com/can-i-use-capacitors-other-than-the-one-that-comes-with-the-ac-motor) 和 [IEC 60252-2 起动电容标准范围](https://webstore.iec.ch/en/publication/1156)。这些来源用于核对原理，不为韩兴具体供货型号背书。

## 发现 1：CBB60 生成图的清晰标签不能作为技术证据

**优先级：高。**

当前 [CBB60 引线组合生成图](D:/Hangxing/workspace/public/images/brochure/20261022/cbb60-leads-1600.webp) 把四只产品统一绘成 60 µF／450 VAC，清晰出现 CQC 重复字符串、CCC、CE 及编号。对应 [画册提取原图](D:/Hangxing/Zebang-Refrigeration-images-20261022/02_Extracted-originals-webp/03_Capacitors/ZB-P05-001-cbb60-wire-samples.webp) 只有 651 × 382 px，不能逐只确认这些文字和编号全部一致。

因此已确认的是“生成图重绘了标签”，不是“这些认证编号已验证为真”，也不能据此断定实物没有认证。图片变清楚不会增加原资料中不存在或不可读的信息。

生成版目前出现在连接形式模块，见 [ConnectionFormats.astro](D:/Hangxing/workspace/src/components/satechi-preview/ConnectionFormats.astro:5)。建议优先换用标签可核对的原片；需要展示完整构图时，使用经确认的型号与标签素材制作展示图。认证标志、编号、容量和温度不能交给生成模型补全。

其他图片的核对结果：

- CBB61 七只组合图的品牌、容量组合和连接类型有原画册对应，不应误判为全部凭空添加；它仍是重新生成的展示图，不能量测尺寸或证明认证。
- CBB60 四只插片组合图的 50／40／30／25 µF、450 VAC 标注能在原画册中找到对应。
- 四系列首屏生成单品图的主要容量、电压与所参照样品基本对应；几何比例、标识细节仍不作为图纸。
- CBB65 新包装图中的产品为 40 µF，包装图案有 50 µF 字样。原始包装照片也存在产品与盒面示例值不一致的情况。可以表达包装形式，但不能把画面当成某一具体型号的装箱确认记录。
- 部分原片本来就无品牌或混有别的品牌。例如 CBB61 P018 未显示品牌；CBB60 P003 含 D&L 标识的另一个部件。当前样品备注已有说明。不能把图库每个部件都归为已验证的韩兴型号。

## 发现 2：CD60 的样品与系列数据没有统一到具体型号

**优先级：高。**

| 字段 | 当前灰色样品标签 | 网站系列表／画册摘要 |
|---|---|---|
| 容量／电压 | 500 µF、300 VAC | 20–1500 µF、110–330 VAC |
| 容差 | ±5% | ±10%／±20% |
| 温度标记 | −40°C/70°C/21 | −20～+65°C |
| 起动时间与重复起动限制 | 照片不能确定 | 当前没有该型号的具体限值 |

原片见 [cd60-25.jpg](D:/Hangxing/workspace/public/images/real/cd60-25.jpg)，当前网站已在 [sampleEvidence.ts](D:/Hangxing/workspace/src/data/sampleEvidence.ts:29) 明确写出差异。这不是未披露的问题，但“提示有差异”尚未解决技术一致性。

建议取得 500 µF／300 VAC 这一具体型号的规格书，确认容差、气候／工作温度类别、起动时间、起动间隔及尺寸。不能为使页面看起来一致，直接把样品的 ±5% 改成 ±20%，或把整个系列温度改成该样品值。

此外，画册印刷第 8 页的 CD60 顶部特征栏出现 ZnAl 金属膜等描述，与同页铝电解构造说明不一致；尺寸表在 600 与 800 µF 之间写成 `7000`，疑似排版错误。同页蓝色产品还出现与摘要不同的电压／容差标注。**画册是来源，但不能整体照抄为已核验技术数据。** 当前网站没有照搬那段金属膜特征，这是正确处理。

## 发现 3：70°C 样品不能自动继承系列的 85°C

**优先级：高。**

[CBB60 原始 35 µF 样品](D:/Hangxing/workspace/public/images/real/cbb60-hanxing-wired.jpg) 与 [CBB61 三只原始样品](D:/Hangxing/workspace/public/images/real/cbb61-13.jpg) 的标签均显示 `40/70/21`。新 CBB61 组合图所依据的画册样品也标这一类别。

按气候类别的通常格式，70 对应上限类别温度；末尾 21 是湿热试验天数，不是寿命。TDK 的实际规格书明确将 `25/085/21` 分解为下限 −25°C、上限 +85°C、湿热 21 天，可用于核对这一标记的读取方式。[TDK B32320/B32322 规格书，第 3 页](https://product.tdk.com/system/files/dam/doc/product/capacitor/film/ac-motor/data_sheet/b32320_b32322.pdf)

这并不能推翻整个系列存在 85°C 版本；它说明不能把 85°C 写成图中这只样品已被验证的温度。CBB60 画册摘要有 85°C 支持，插片样品也有 `40/85/21`；CBB61 需要补充该等级的具体型号资料。

建议让参数表注明其范围依据，并在型号信息中给出对应温度等级；避免继续使用一个温度值覆盖所有样品。

## 发现 4：CBB65 原资料的范围摘要与详细表格不完全相符

**优先级：中高。**

画册印刷第 3–4 页可直接看到：

1. 单联摘要为 2–100 µF，尺寸矩阵列至 120 µF。网站使用了摘要容量上限，却使用了包含 110／120 µF 行的尺寸外包络。
2. 双联摘要为 1+15～15+80 µF，详细矩阵依次写 1+15～10+15、1+20～10+20，直至 1+80～10+80。小容量部分能否到 15 µF，当前表格没有统一答案。

这不能通过查其他厂商做得到多少来解决。需要供应商确认可供组合矩阵；在确认前，不应擅自扩大到 120 µF，也不应自行把所有双联上限改成 10 µF。

当前引用位置：[site.ts](D:/Hangxing/workspace/src/data/site.ts:83)、[ProductReference.astro](D:/Hangxing/workspace/src/components/ProductReference.astro:77)。

## 发现 5：双联电容的“独立”用词容易误导

**优先级：中。**

当前产品详情和技术指南多次使用 `two independent sections`。两个容量值需要分开记录、不能相加，这一点正确；但常见 HVAC 双联电容有共同端，不能让人理解成电气上完全隔离的两只器件。[TEMCo 双联电容指南](https://temcoindustrial.com/dual-run-capacitor-selection-guide/)

更准确的表述建议：

> A typical dual-run capacitor has two capacitance sections sharing a common terminal. Record both µF values and follow the model’s wiring diagram.

待核对位置：[productReference.ts](D:/Hangxing/workspace/src/data/productReference.ts:100)、[guides.ts](D:/Hangxing/workspace/src/data/guides.ts:48)、[sampleEvidence.ts](D:/Hangxing/workspace/src/data/sampleEvidence.ts:28)、[ProductReference.astro](D:/Hangxing/workspace/src/components/ProductReference.astro:38)。

## 发现 6：供应商、品牌和制造商的身份还没有形成清楚的对应关系

**优先级：中高，影响买方信任。**

- 当前本地网站和画册使用 `Hangzhou Zebang Refrigeration Equipment Co., Ltd.`。
- 真实 CBB65 样品标签出现 `Guang zhou Hanxing`。
- 现有公开站点的隐私页展示另一营业执照主体“邢台市威钻电子科技有限公司”，并使用 `Hanxing Electronic Technology Co., Ltd.` 作为英文沟通名称。[公开隐私页的公司信息](https://www.hanxingcapacitor.com/privacy-policy/)

这些可能对应销售、品牌与制造等不同角色，或者新旧版本的信息变化。现有资料不足以确认它们之间的关系，也不足以据此认定造假。

建议用已确认的资料说明：谁是网站经营／合同卖方，谁拥有或授权品牌，谁是具体产品制造商，生产地点在哪里。公司环境照片能说明画册里展示了这些场所，不能单独证明产权、产能或制造责任。

当前 About 已要求在报价及合同中记录卖方、制造商和工厂；应进一步把已知关系写清楚，而不是长期用一句“下单时确认”代替公司信息。

## 发现 7：认证与质量目前只能判定为“尚未核实”

公开证书页没有给出可逐型号核对的证书扫描件、有效期和覆盖清单，页面仍要求索取对应文件。[公开证书页](https://www.hanxingcapacitor.com/certificates/)

原片上出现 CQC、CE 或标准编号，可以记录为“标签可见”；不能直接扩展为四系列全型号获得认证。生成图中的标志更不能承担这项证明。

本轮没有找到足以给当前全部型号作质量背书的、能与具体型号对应的检验及寿命记录。因此不能仅凭网页判断成品合格率、实际耐压、损耗、寿命或批次稳定性。这是证据缺口，不等于判定产品不合格。

网站当前没有把别家厂商的寿命数据直接作为自身保证，也没有为每个系列造出价格／库存／评分，这些处理应保留。

## 其他表述与呈现建议

| 位置 | 当前情况 | 建议 |
|---|---|---|
| CD60 连接描述，`site.ts:106` | `Double-welded sheet terminals or lead output` 是生硬直译，不能帮助买方识别连接 | 对已核对样品使用 `Blade terminals or wire leads, depending on the model`，不要靠措辞推断焊接结构 |
| 制造页，`factory.astro:33` | 一段工序清单包括注油，没有区分适用构造／系列 | 分别描述适用产品；避免让读者误以为每种 CBB61／CD60 都采用同一套薄膜浸油工序 |
| 应用页与生成设备图 | 页面已强调单相电机、运行／起动区分，方向合理 | 设备图仅表示应用类别。具体泵、风机或空调能否使用某型号，仍取决于电机线路和额定值，不能从外观推断 |
| 全站系列范围 | 已写明按所选型号确认，优于把范围写成任意组合均可供 | 增加已核对型号矩阵。专业度来自具体可核对资料，不来自不断重复“confirm / may / depending” |

## 建议处理顺序

1. **先处理能直接避免误导的内容。** 替换无法核对标签的 CBB60 生成图；纠正双联电容措辞；保持原图和生成图用途区分。当前已确认的外形、用途和参数不随意改动。
2. **集中向供应商核对四组问题。** CBB61 的 110 VAC／85°C／±10% 对应型号；CBB60 的 70°C 与 85°C 型号区分；CBB65 的单／双联上限及尺寸表；CD60 500 µF／300 VAC 的容差、温度与起动工作制。
3. **补齐可直接用于采购的型号资料。** 每个主推型号至少对应清晰实物标签、规格书、尺寸及接线图；声称认证时再关联覆盖该型号的文件。系列代号不直接当成完整订货型号。
4. **统一公司角色。** 依据确认材料统一 About、页脚、隐私页和报价主体，解释销售方与制造商的实际关系。

## 关键核对文件

- 参数与产品描述：[site.ts](D:/Hangxing/workspace/src/data/site.ts:40)
- 产品页面结构与技术表：[ProductReference.astro](D:/Hangxing/workspace/src/components/ProductReference.astro:23)
- 七条原始样品标签记录：[sampleEvidence.ts](D:/Hangxing/workspace/src/data/sampleEvidence.ts:16)
- 产品适配说明：[productReference.ts](D:/Hangxing/workspace/src/data/productReference.ts:43)
- 技术指南：[guides.ts](D:/Hangxing/workspace/src/data/guides.ts:26)
- 图片原始来源与处理记录：[IMAGE-USAGE.json](D:/Hangxing/workspace/docs/capacitor-imagery-20261022/IMAGE-USAGE.json)
- 图片类型映射：[brochureMedia.generated.json](D:/Hangxing/workspace/src/data/brochureMedia.generated.json)
- 画册整页核对图：[CBB65 第 3–4 页](D:/Hangxing/Zebang-Refrigeration-images-20261022/01_PDF-pages-webp/page-03.webp)、[CBB61／CBB60 第 5–6 页](D:/Hangxing/Zebang-Refrigeration-images-20261022/01_PDF-pages-webp/page-04.webp)、[CBB60／CD60 第 7–8 页](D:/Hangxing/Zebang-Refrigeration-images-20261022/01_PDF-pages-webp/page-05.webp)

旧核查记录中“缺少原始系列参数资料”的判断，需要结合本次新增画册更新：目前已有系列表和尺寸矩阵，仍缺的是与具体供货型号逐项一致、能解决上述冲突的技术文件和证明。
