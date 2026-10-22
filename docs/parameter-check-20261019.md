# 参数核查与本地实现结果

核查日期：2026-10-19。已更新本地网站，未部署。网页核对不能代替厂家型号批准、实测或认证。

## 联网核查

| 范围 | 结论 | 页面处理 |
| --- | --- | --- |
| CBB60 | 原站列 2–100 µF、110–450 VAC，尺寸为系列包络 | 保留系列范围，另列 P003 横放样品 25 µF / 450 VAC；同图其他品牌标记不解释为 HAN XING 自有型号 |
| CBB61 | 原站列 0.5–35 µF、110–450 VAC | P018 的 4.5、5、6 µF 分成三条记录；不合成一个多容量部件 |
| CBB65 | 原站列单运行 2–100 µF、110–450 VAC；双容量 1+15 至 15+80 µF、370–450 VAC | P029 的 20 µF 和 P034 的 50+5 µF 单独记录，两组容量保持原标法；没有从端子数推断功能 |
| CD60 | 原站列 20–1500 µF、110–330 VAC，公差 ±10%/±20%，温度 −20 至 +65 °C | 样品 P038 的 ±5% 与气候标记单独显示差异，要求确切型号文件；不修改成“已确认 500 µF 型号参数” |
| 气候类别 | TDK 数据表分别定义温度类别和湿热试验，说明气候代码不能仅当作普通温度范围 | 四系列表将温度与公差标为 series listing，样品标签另列 |
| 起动用途 | IEC 60252-2 和 KEMET 型号资料支持区分起动电容及其间歇工作条件 | CD60 保留型号起动时长、周期与切断方式的确认要求；不套用 KEMET 的数值 |

原站和本地资料是同源信息，只能确认转录一致，不能形成独立检验或型号供应证明。其他厂商文件仅用于解释与交叉检查；其尺寸、寿命、测试限值和认证没有转移为 HAN XING 产品主张。

## 本地完成

- 四系列共 7 条样品标签记录，附原图、参考号、容量、电压、公差、频率和可见接线形态。
- 配置询问携带指定样品及参数到已有联系草稿，保持手动邮件/WhatsApp 发送。
- 标签指南增加 20 µF ±5% 的 19–21 µF 算例，以及双容量各自的名义公差区间。明确这些是计算，不是测量结果。
- 尺寸指南增加 D/H、L/W/H 测量示意，无虚构毫米尺寸或厂家图纸。
- 工厂页补充型号关联检验记录应有的字段；没有发布不存在的检验报告、样例通过结果或下载文件。
- About、JSON-LD 和公开模式 llms 文本区分 HAN XING Brand 与 Zebang Organization；未主张注册商标权利人或将公司自动设为制造商。

## 验证

- Astro 检查：107 文件，0 errors / warnings / hints；构建成功。
- 四系列 HTTP 200；7 条记录、原图、联系映射和 Brand / Organization / ProductGroup 关系检查通过。
- 浏览器实测：P034 带入 50+5 µF / 450 VAC，能生成含完整参数的草稿；P018 中间样品只带入 5 µF。使用虚构测试信息，未点击发送渠道。
- 桌面及手机检查未发现横向溢出、坏图或控制台错误。已有顶栏 12px 提示和原文长行属于本轮前的样式，未扩大改造。
- 证据：`workspace/.qa/product-evidence-20261019/content-check.json`；截图目录 `D:\Hangxing\.qa\product-evidence-20261019`，页面截图 `workspace/.qa/product-evidence-20261019/sample-configurations.png`。

## 来源

- https://www.hanxingcapacitor.com/products/cbb60-motor-run-capacitor/
- https://www.hanxingcapacitor.com/products/cbb61-fan-capacitor/
- https://www.hanxingcapacitor.com/products/cbb65-air-conditioner-capacitor/
- https://www.hanxingcapacitor.com/products/cd60-start-capacitor/
- https://www.tdk-electronics.tdk.com/inf/20/25/ds/B32350_B32352.pdf （第 3 页气候类别及第 6–7 页独立订货号/尺寸）
- https://content.kemet.com/datasheets/kem_a4041_ms_md.pdf （型号与 duty-cycle 条件）
- https://webstore.iec.ch/en/publication/1157 （起动电容标准范围）
- https://faq.orientalmotor.com/can-i-use-capacitors-other-than-the-one-that-comes-with-the-ac-motor （电机配套电容选择）
