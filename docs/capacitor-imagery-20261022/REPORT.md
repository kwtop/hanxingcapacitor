# 电容资料图片接入记录 · 2026-10-22

已按选定方案完成本地源码、素材和响应式样式接入，入口为 `http://127.0.0.1:4340/`。没有部署、推送或修改生产环境。

实际浏览器验收尚未完成：本轮通过当前 in-app browser 获取 `http://127.0.0.1:4335/` 时，浏览器 URL 安全策略拒绝授予观察权限。没有换浏览器、原始 CDP 或其他通道绕过。因此下面的素材检查、源码检查和构建结果不等同于页面截图或交互验收。

## 已接入的页面

| 页面 | 本轮呈现 |
| --- | --- |
| `/about/` | 完整厂房外观配首屏短文；大厅配公司信息；两张小幅原始展会照片。公司名称、地址、联系方式和 supplier-records 锚点保留 |
| `/products/cbb61-fan-capacitor/` | 桌面为七款完整组合；600px 及以下使用端子式、引线式两个独立画面，可点开查看 |
| `/oem/`、`/oem-quality/` | 四款壳体与连接形式组合；OEM 规格审批表使用完整内容宽度，移除旁边重复的产品组合图 |
| `/products/cbb60-motor-run-capacitor/` | 配置区并列引线式、插片式；700px 及以下纵向排列。原有样品证据表和图库保持 |
| `/products/cbb65-air-conditioner-capacitor/` | 在 Ordering & samples 展示产品与韩兴包装；800px 及以下纵向排列 |
| `/factory/` | 在材料与工序介绍旁加入电容芯照片；三段原视频、测试和文件内容保持 |
| `/factory/packing-and-dispatch/` | 单品包装图与包装要求表相配；保留包装视频、托盘和发运内容 |
| `/resources/`、`/resources/articles/` | 采购栏目、安装连接和订单指南使用对应包装或端子图片 |
| `/resources/dimensions-terminals-mounting/` | 封面换为 CBB60 端子组合，正文原始标签和端子核对图保留 |
| `/resources/motor-capacitor-order-shipment-checklist/` | 封面换为产品与包装组合，正文和清单保留 |
| `/` | Samples & production 的样品侧换为 Products & packaging，保留原来的照片图库链接；主视觉、四系列卡片和工业应用拼版保持 |

三系列对比文章仍使用包含 CBB60、CBB61、CBB65 的现有封面；新的 OEM 四款组合只包含 CBB60、CBB61，不用它代替三系列对比图。CD60 没有新增展示素材。

## 素材清单

10 张不同的资料原图，制作为 12 组网页素材、44 个 WebP 尺寸版本，总计 2,581,734 字节（约 2.46 MiB）。只把精选版本放进 public，没有将整个 301 张图库接入网页。

| 资料编号 | 网页素材 | 处理方式 |
| --- | --- | --- |
| P02-001 | factory-exterior | 原片缩放与 WebP 编码 |
| P02-002 | lobby | 原片缩放与 WebP 编码 |
| P14-023、P14-025 | exhibition-meeting、exhibition-products | 原片，最大展示宽度 320 CSS px，不做虚假清晰化 |
| P04-001 | cbb61-family、cbb61-terminal、cbb61-leads | 内置 ImageGen 重做桌面组合和两张手机构图 |
| P04-004 | oem-formats | 内置 ImageGen 精简构图；P04-001、P04-002 作为韩兴产品结构的补充参考 |
| P03-002 | cbb65-packaging | 内置 ImageGen 重做；已有 `public/images/real/cbb65-4.jpg` 为包装字样和 40 µF 样品标签的高清参考 |
| P04-002、P05-001 | cbb60-terminals、cbb60-leads | 复用已完成的生成版本，保留完整主体 |
| P04-003 | capacitor-cores | 复用已完成的生成版本 |

详细路径、来源哈希、图位、尺寸、字节量和补充参考见 [IMAGE-USAGE.json](IMAGE-USAGE.json)。生成提示词见 [IMAGEGEN-PROMPTS.json](IMAGEGEN-PROMPTS.json)。原始库和生成库均未覆盖。

## 图片检查与纠偏

- 核对了 10 张来源原图和所选网页版本；厂房、大厅、展会没有生成或替换人物、建筑与标识。
- CBB61 旧组合多出的端子已按原片重做为两个单插片；七只产品各自的额定值与参考对应。
- CBB61 引线手机版第一版把两根线画进同一孔，已弃用；修正版保留左右两个独立出线位置。
- 包装图原有的“电容器器”错误没有沿用；新版采用现有清晰实拍的韩兴标志、CBB65 空调电容器、CAPACITOR 字样和 40 µF 样品。
- OEM 组合精简为四款已参考的形式，移除混杂品牌和来源国家信息，未新增数字额定值或认证标记。
- 生成图片保留 illustrative alt 与来源记录，不进入参数数据、原始照片编号或证据表。
- [IMAGE-COMPARISON.webp](IMAGE-COMPARISON.webp) 为素材原图与重做图对照，**不是网页前后截图**。包装图另使用上述高清实拍作为文字校对参考。

## 工程与验证

- 沿用 Astro、现有 SiteImage、字体、按钮和导航。新增 BrochurePhoto 统一响应式图像；技术图可使用原生 dialog 放大，支持 Escape、关闭与焦点返回。
- 新增模块以 64px / 40px 为桌面 / 手机间距，图与短标题间距 20px；完整产品采用 contain，避免切掉引线和端子。
- 标注图片实际 width/height，首屏图 eager/high，后续 lazy/async。放大图到点击时才设置 src。展会图片不放大源像素。
- `npm run check`：0 errors、0 warnings、0 hints。
- `npm run build`：通过。普通构建仍不启用 Satechi 本地预览主题；本次构建成功不代表预览已通过浏览器验收。
- 44 个 WebP 均可解码，尺寸与清单一致，无上采样。19 个受保护的产品数据、参数、图库、视频、导航和询盘文件与本轮开始时的备份一致。
- 来源图与 WebP 的检查记录见 [VALIDATION.json](VALIDATION.json)。只包含本轮变化的差异见 [THIS-TURN.diff](THIS-TURN.diff)。

## 尚未完成的浏览器验收

以下均需在浏览器访问权限恢复后补齐，不能据目前的静态结果标为通过：

| 视口 | 页面前后截图 | 布局、裁切与换行 | 交互 |
| --- | --- | --- | --- |
| 1440 × 900 | 未采集 | 待检 | 待检 |
| 1024 × 768 | 未采集 | 待检 | 待检 |
| 768 × 1024 | 未采集 | 待检 | 待检 |
| 390 × 844 | 未采集 | 待检 | 待检 |

重点检查 About、CBB61、OEM 三种样板，再检查其余改动页；确认无横向溢出、产品边缘完整、手机组合切换清楚，以及放大关闭、原始图库切换、菜单、询盘型号传递。不要提交真实询盘作为测试。

本轮修改前的完整 src 快照保存在 `D:/Hangxing/capacitor-image-presentation-20261022/before-source/src`；可用于恢复相应文件或在权限恢复后采集真正的前后对照。新生成的五张主文件和处理脚本在同一任务目录。

## 本地查看

当前视觉预览使用 `npm run dev:visual`，地址为 `http://127.0.0.1:4340/`。如果进程已结束，在 `D:/Hangxing/workspace` 重新运行即可。没有部署到 Cloudflare。
