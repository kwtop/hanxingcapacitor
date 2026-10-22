# Applications 工业场景图片更新

日期：2026-10-21。仅本地实施，没有上传 Cloudflare、推送 GitHub 或切换生产域名。

## 本次结果

将 Applications 目录的家居场景改为灰蓝色工业设备检查环境，保留现有暖白页面、字体、导航、卡片文字、技术参数、URL 与询盘功能。同步更新首页对应拼版和四个应用详情的首图。

使用 draw-ui 组织图位、参考图、提示词和验收，使用宿主内置 ImageGen 编辑和生成。新增 6 张素材：四类设备各一张、目录专用宽横幅一张、首页空调浅横图一张。原始图片没有覆盖或删除。

## 图片内容核对

TDK 的厂家资料将泵、风机、洗衣机、空调等列为电机运行及启动电容的典型应用：[Motor Run and Motor Start Capacitors](https://product.tdk.com/en/products/capacitor/film/motor-run/index.html)。该资料支持应用类别，不用于证明 HAN XING 某一型号已经安装在图中设备内，也不转用 TDK 的认证或性能声明。

| 类别 | 原图的问题 | 本次处理与准确性边界 |
| --- | --- | --- |
| Water pumps | 设备放在家居石台上；仅凭外观不能确认电机相数或电容配置 | 保留离心泵识别度，按紧凑单相感应电机水泵方向生成，移到工业设备检查台。没有补造内部接线或运行中的管路。 |
| Fans and blowers | 厨房台面、植物与暖光不符合应用采购语境 | 改为工业通风设备检查场景，按常规电容电机离心风机方向生成；完整保留壳体、护网、出风口和安装脚。 |
| Washing machines | 现代滚筒机外观不能作为运行电容电机的明确代表 | 改为传统双缸、机械旋钮洗衣机，设备类型与常规电容电机应用更贴近。没有添加拆机接线或虚构电容标签。 |
| Air conditioners / HVAC | 花园与住宅背景偏生活方式；外形不能确认是否为变频机 | 按传统定速、单相冷凝机组方向生成工业服务区场景，不加 inverter、EC 或虚构型号标识。 |

以上为通用设备应用示意，外观不能核验实际电机绕组、相数、电路或电容型号。真实选型继续依据设备资料、原电容标签、接线和尺寸。没有把生成画面描述为实际工厂、客户安装或测试记录。

没有给水泵、风机、洗衣机和空调整机添加 HAN XING 标志，因为本网站销售电容器，不能暗示品牌制造这些整机。现有电容产品图和品牌标识保持原样。

## 视觉与响应式处理

- 四类场景统一使用低饱和灰蓝、金属、混凝土和柔和中性光，删除家居台面、绿植、布艺与住宅花园。
- 目录和详情使用 3:2 图片；首页大屏保留原来的不对称拼版。
- 目录横幅单独生成宽构图，左侧供标题、右侧展示设备。仅对这个新增工业横幅降低原遮罩浓度，保留透明导航的可读性。
- 手机目录横幅使用单台水泵图，避免把宽幅的两台设备硬裁进竖向容器。
- 首页空调浅横图单独生成，在大于 1200px 时使用；其他视口使用完整的普通空调图。
- 首页 701–1200px 的应用拼版使用两列方形图，修复 1024px 时水泵、风机两侧被切掉的问题。
- 生成图提供响应式 WebP、明确宽高和 srcset。首屏优先加载，其他图沿用懒加载。

## 素材位置与尺寸

交付目录：`public/images/applications/industrial-20261021/`。

| 文件前缀 | 交付宽度 | 最大交付图 | 最大图字节数 |
| --- | --- | --- | --- |
| pump | 600、960、1536 | 1536 × 1024 | 120,820 |
| fan | 600、960、1536 | 1536 × 1024 | 129,992 |
| washing | 600、960、1536 | 1536 × 1024 | 71,198 |
| hvac | 600、960、1536 | 1536 × 1024 | 123,830 |
| cover | 600、960、1440、2172 | 2172 × 724 | 102,704 |
| hvac-wide | 600、960、1536 | 1536 × 614 | 73,720 |

共 19 个 WebP 文件，合计 1,068,266 字节。四张普通设备图的 600px 文件约 14–30KB。格式转换与缩放没有改变生成图中的设备或背景内容。

实际生成提示词与每张图的输入、输出、尺寸和字节数保存在同目录的 `PROMPTS.json`、`ASSET-SOURCES.json`、`IMAGE-RECORD.json`。

ImageGen 原始 PNG 和本轮修改前文件保留在 `D:/Hangxing/application-industrial-20261021/`：`original-outputs/`、`before/`。

## 实现文件

- `src/data/industrialApplications.ts`：新素材、准确的示意性 alt、宽高及 srcset。
- `src/data/satechiSite.ts`：现有主题的应用图片映射。
- `src/components/ApplicationCard.astro`：目录图片与响应式资源。
- `src/components/ApplicationReference.astro`、`HvacReference.astro`：应用详情首图。
- `src/components/satechi-preview/ApplicationsMosaic.astro`：首页四类应用与空调图的艺术指导切换。
- `src/components/satechi-preview/SiteImage.astro`、`CollectionCover.astro`：识别新图片元数据，保留其他页面的既有行为。
- `src/pages/applications/index.astro`：目录专用横幅。
- `src/styles/satechi-home-a.css`：仅扩展应用拼版的中屏断点。

原数据、询盘处理、菜单链接和生产主题开关未改动。

## 验证

- `npm run check`：124 个文件，0 errors、0 warnings、0 hints。
- 最终 `npm run build`：通过。
- 首页、应用目录、四类应用详情在 1440、768、390px 共 18 组渲染检查：无横向溢出、单一 H1、页内锚点有效。
- 首页另在 1440、1024、768、390px 复核实际裁切。1024px 发现两侧裁切后已改为两列方形图，并重新截图确认。
- 6 个页面和 19 个图片资源共 25 个本地 HTTP 检查均为 200。
- 目录水泵图片入口进入正确详情页，新首图实际加载。
- 手机端选择 CBB61 后，询盘按钮正确进入 `/contact/?series=CBB61&request=quote#inquiry-form`；没有发送真实 Email 或 WhatsApp。
- 本轮检查标签页未记录 console error。

## 截图与本地预览

- 本地页面：http://127.0.0.1:4340/applications/
- 修改前：`D:/Hangxing/application-industrial-20261021/screenshots/before-applications-1440.png`
- 修改后目录：`D:/Hangxing/application-industrial-20261021/screenshots/after-applications-1440.png`
- 修改后卡片：`D:/Hangxing/application-industrial-20261021/screenshots/after-cards-1440.png`
- 手机目录：`D:/Hangxing/application-industrial-20261021/screenshots/after-applications-390.png`
- 首页拼版：`D:/Hangxing/application-industrial-20261021/screenshots/after-home-applications-{1440,1024,768,390}.png`

没有待补的本地实施项。真实设备型号及内部电容配置需要相应设备资料，本轮没有据生成图推定这些事实。
