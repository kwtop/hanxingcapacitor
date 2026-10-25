# 全站英文文案独立复审：问题清单

日期：2026-10-23。方式：新建不继承对话历史的 subagent，使用 Humanizer 规则，只读检查当前源码与 `http://127.0.0.1:4340/` 的 Satechi 生效分支。主 Agent 复核了以下引文、文件和模板调用。没有修改网站英文文案，也没有部署。

结论：现有英文整体可读，没有大面积夸张营销或堆叠 may / could / potentially 的问题。残留主要是反复套用采购检查指令、通用询价模块没有区分页面目的、内部证据审计腔，以及少数技术措辞和业务边界不够清楚。

## 优先处理：P1（2 项）

### 1. 双联电容的 independent 容易造成误读

页面：CBB65 详情、Single vs dual run 指南。

原文：

- “A dual-run capacitor has two independent sections in one can, each with its own µF value.”
- “The 50+5 µF sample has two independent sections.”
- “Keep the rating as 50+5 µF: it describes two independent sections.”

问题：independent 容易让读者理解为两部分互相电气隔离，超出了“两个容量值分别记录”的含义。当前文案不足以说明所有实物采用何种端子结构。

处理方向：改成两个 capacitance sections、各有自己的 µF 值；保留分别记录、不能相加和按具体型号图纸识别端子的要求。共同端等接线解释以型号资料为依据。

位置：[guides.ts:48](D:/Hangxing/workspace/src/data/guides.ts:48)、[sampleEvidence.ts:28](D:/Hangxing/workspace/src/data/sampleEvidence.ts:28)、[ProductReference.astro:38](D:/Hangxing/workspace/src/components/ProductReference.astro:38)。

### 2. 工厂页没有区分工序的适用构造或系列

页面：`/factory/`。

原文：“Process stages include incoming inspection, winding, metal spraying, heat setting, rolling, oil injection and sealing.”

问题：页面覆盖四个系列，但这一句未区分薄膜产品、注油工序与 CD60 的电解构造，容易被理解为统一流程。现有准确性审计也指出了这一范围问题。

处理方向：依据真实工艺和素材区分适用范围；有证据的工序直接描述。仅添加 may 不解决范围问题，也不能把四系列全部写成同一工艺。

位置：[factory.astro:33](D:/Hangxing/workspace/src/pages/factory.astro:33)。

## 主要润色与口径问题：P2（8 项）

### 3. 在线提交与照片另发的流程没有接完整

页面：Buying & shipping、FAQ、Contact。

原文：“Attach label photos and drawings in your email or WhatsApp app before sending your inquiry.”；“Add the photos to your email or WhatsApp message.”

问题：主入口通往在线表单，但表单没有附件入口；客户不知道应改用邮件，还是先提交再补照片。

处理方向：交代在线表单提交文字要求，照片、图纸通过直接联系方式发送；已提交时附询盘编号。当前在线保存与直接联系的区别是正确的，应继续保留。

位置：[buying-guide.astro:36](D:/Hangxing/workspace/src/pages/buying-guide.astro:36)、[faq.astro:10](D:/Hangxing/workspace/src/pages/faq.astro:10)、[contact.astro:40](D:/Hangxing/workspace/src/pages/contact.astro:40)。

### 4. 文章专属意图被通用询价结尾覆盖

页面：七篇指南；其中技术资料、尺寸和订单运输文章最明显。

原文：“Send your capacitor requirements” / “Share the original label, quantity and destination.” / “Prepare an inquiry”。

问题：通用标题在 20 个路由出现。询问工作制、索取图纸、讨论已有订单的文章都套用同一段结尾。订单文章前面在讲订单编号和条款，末尾又回到原始标签，阅读上像不同模板拼接。

处理方向：把数据中已有的文章专属 inquiry 标题、说明和按钮接入模板；目录类页面保留通用入口。按资料请求、选型或订单讨论区分。

位置：[InquiryCallout.astro:25](D:/Hangxing/workspace/src/components/InquiryCallout.astro:25)、[resources/[slug].astro:37](D:/Hangxing/workspace/src/pages/resources/[slug].astro:37)、[guides.ts:104](D:/Hangxing/workspace/src/data/guides.ts:104)。

### 5. 标签、接线和尺寸要求在同一页反复出现

页面：四产品详情及四应用详情，CBB65 和洗衣机应用较明显。

代表原文：“Record both dual-run µF values.”；“Record both values and verify each terminal-group mapping.”；“Match each terminal-group marking to its connection in the motor and capacitor drawings.”

问题：导语、参数、样品说明、安装检查、资料请求和页尾清单重复表达同一要求。单句大多正确，累积后像持续审查客户，增加阅读负担。

处理方向：将完整要求集中在参数或安装检查区域；样品只补充样品特有信息，页尾保留提交要点。保留必要的接线和安全限制，删掉没有新信息的重复句。

位置：[ProductReference.astro:38](D:/Hangxing/workspace/src/components/ProductReference.astro:38)、[ProductReference.astro:62](D:/Hangxing/workspace/src/components/ProductReference.astro:62)、[ProductReference.astro:77](D:/Hangxing/workspace/src/components/ProductReference.astro:77)、[applicationReference.ts:97](D:/Hangxing/workspace/src/data/applicationReference.ts:97)。

### 6. Supplier identity 入口没有说明身份关系

页面：About 的 `#supplier-records`，及工厂、条款中的相关入口。

原文：“Record the seller, manufacturer and production site in the quotation and contract. Include the documents for the selected model.”

问题：链接叫 Supplier identity，目标段落却要求客户把身份写进合同，没有解释韩兴品牌、商务联系方、合同卖方与制造方的关系，像内部待确认事项直接留在客户页面。

处理方向：有依据的角色直接说明；缺少资料的关系不能靠语气补齐。若暂时只能展示下单提示，应调整入口和段落名称，匹配实际提供的信息。

位置：[AboutStory.astro:13](D:/Hangxing/workspace/src/components/satechi-preview/AboutStory.astro:13)、[AboutStory.astro:34](D:/Hangxing/workspace/src/components/satechi-preview/AboutStory.astro:34)、[factory.astro:25](D:/Hangxing/workspace/src/pages/factory.astro:25)。

### 7. MOQ 数字一致，适用单位不够清楚

页面：产品详情、OEM、FAQ、Terms。

原文：“1,000 pieces. Record the minimum for your configuration in the quotation.”；“1,000 pieces. Ask for the minimum that applies to your model, label and packing.”

问题：没有发现数字互相矛盾，但未说明 1,000 按整单、型号、额定值还是定制配置计算。反复 ask / record 没有回答客户实际问题。

处理方向：保留已有标准数字，按商务规则补充适用单位和定制例外；不能没有依据地加上 per model，也不能删掉真实型号条件。

位置：[ProductOrderDetails.astro:5](D:/Hangxing/workspace/src/components/ProductOrderDetails.astro:5)、[oem.astro:18](D:/Hangxing/workspace/src/pages/oem.astro:18)、[faq.astro:8](D:/Hangxing/workspace/src/pages/faq.astro:8)、[terms.astro:11](D:/Hangxing/workspace/src/pages/terms.astro:11)。

### 8. 样品说明重复字段名，定制 FAQ 跳过问题本身

页面：OEM、FAQ。

原文：“Sample quantity” 对应 “Number of samples needed for the configuration being reviewed.”；“Production lead time” 对应 “The production schedule stated in the written offer.”

FAQ：“Can I order custom labels or connections?” 回答开头为 “Send the artwork, connection drawing, packing requirements and quantity for a configuration quotation.”

问题：样品说明只解释字段名；定制 FAQ 没有先交代按何种配置评估，而是直接要求提交和保留文件，语气机械。

处理方向：将商业条件合并成简短、能指导下一步的说明；FAQ 先说明评估方式，再列所需资料。不能补出免费样品、固定交期或任何接口均可定制等无依据承诺。

位置：[oem.astro:13](D:/Hangxing/workspace/src/pages/oem.astro:13)、[oem.astro:19](D:/Hangxing/workspace/src/pages/oem.astro:19)、[faq.astro:9](D:/Hangxing/workspace/src/pages/faq.astro:9)。

### 9. anonymous 与提交后关联身份的说明不够一致

页面：Privacy notice。

原文：“We use anonymous identifiers…”；“A submitted inquiry may be linked to the same anonymous visitor.”

问题：提交后，访问 ID 可以与姓名、邮箱等询盘资料关联。继续称 anonymous visitor 容易被理解为始终无法关联身份。此项是语言精度问题，不作法律合规结论。

处理方向：使用 visitor identifiers 等清楚措辞，并说明提交后可以关联访问记录；继续保留不在事件中保存表单值等真实边界。

位置：[privacy-policy.astro:12](D:/Hangxing/workspace/src/pages/privacy-policy.astro:12)；实现依据：[inquiries.ts:65](D:/Hangxing/workspace/src/server/inquiries.ts:65)。

### 10. CD60 连接名称生硬，模块间名称不同

页面：CD60 详情、产品比较、泵及 HVAC 应用比较。

原文：“Double-welded sheet terminals or lead output.”；“Sheet terminals / lead output”；样品同时写 “Blade terminals visible”。

问题：sheet terminals / lead output 不方便买方识别接口，double-welded 又像内部制造结构声明。同类连接在不同模块使用不同名字。

处理方向：核对实物或资料后，对外部连接统一使用可识别的名称，如 blade terminals / wire leads；内部焊接结构有依据且对采购有用时才保留。

位置：[site.ts:106](D:/Hangxing/workspace/src/data/site.ts:106)、[productReference.ts:44](D:/Hangxing/workspace/src/data/productReference.ts:44)、[HvacReference.astro:74](D:/Hangxing/workspace/src/components/HvacReference.astro:74)。

## 收尾一致性：P3（2 项）

### 11. 应用分类名称和落地页范围不同

原文：首页 “Appliances & small motors”，落地页为 “Washing machines”；首页 “HVAC & refrigeration”，内页和导航为 “Air conditioners / HVAC”。

问题：第一组首页承诺的类别比正文范围宽；第二组是同一栏目多种叫法，容易显得来自不同版本。

处理方向：按实际内容统一范围和名称；只有扩充了对应内容，才保留更宽类别名称。

位置：[ApplicationsMosaic.astro:7](D:/Hangxing/workspace/src/components/satechi-preview/ApplicationsMosaic.astro:7)、[site.ts:150](D:/Hangxing/workspace/src/data/site.ts:150)、[site.ts:158](D:/Hangxing/workspace/src/data/site.ts:158)。

### 12. CD60 尺寸说明重复限定，却没说明尺寸轴

原文：“Approximately 34 × 60 to 63 × 110 mm (published series envelope)”

问题：published series envelope 像内部来源审计用语，仍没说明两项分别是直径 / 高度，是否包括端子。上层与下方已经说明系列范围，括号没有补充购买信息。

处理方向：核对来源后交代尺寸轴及测量范围，删除重复限定；如果数值本来为近似，继续保留近似含义。

位置：[site.ts:104](D:/Hangxing/workspace/src/data/site.ts:104)、[ProductReference.astro:30](D:/Hangxing/workspace/src/components/ProductReference.astro:30)。

## 覆盖与保留项

共 34 个公开路由：主页；产品列表、四系列详情、图库；应用列表、四应用；OEM & quality 总览、OEM、工厂、包装发运；Resources 总览、技术列表、七篇指南；采购指南、FAQ；About、Contact、Privacy、Terms；request-a-quote、thank-you、404。另展开 11 个 FAQ 答案、采购辅助内容，核对图库 96 张图注和弹窗说明。后台、API、未启用草稿和设计试验未计入。

型号范围、起动工作制、具体接线图、认证的型号和市场范围、样品标签与检测结果的区别，以及预计到达和实际提货的区别，均应保留。产品范围不代表任意组合均可订。当前在线保存与直接邮箱 / WhatsApp 联系的说明基本一致，没有把点击当成收到询盘。

需要事实资料才能解决的项目主要是工序范围、企业角色关系、MOQ 适用单位及 CD60 外形和连接依据。其余可通过合并重复、匹配页面意图和改写生硬句式处理。
