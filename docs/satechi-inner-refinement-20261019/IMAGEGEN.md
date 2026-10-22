# 分类宽幅产品图

工具：宿主内置 ImageGen，经 draw-ui 流程确定图位后生成。用既有四系列构图作为编辑输入，未生成工厂、客户、交付或认证证据。

- 输入：`public/images/previews/satechi-fidelity-20261018/hero-desktop.webp`
- 生成原图：`.qa/satechi-inner-refinement-20261019/collection-original.png`，2103×748。
- 桌面：`public/images/previews/satechi-inner-20261019/collection-wide.webp`，2100×747，106922 bytes。
- 手机：`public/images/previews/satechi-inner-20261019/collection-mobile.webp`，约942×747，61576 bytes；从原图右侧产品组裁切，未重绘产品。
- 用途：产品分类页展示横幅。产品详细规格以正文和模型资料为准，不能从生成图印字推导产品认证。
- 其余页面沿用此前的韩兴产品展示、应用、指南与有来源的工厂润色图。原始样品图库和生产录像保持不变。

## 提示词

Use case: product-mockup / precise composition edit. Edit target: supplied Hanxing product composition. Create ONE very wide panoramic collection-header photograph, approximately 3.8:1 aspect ratio (about 2280 x 600). It is for a 1440px x 320px webpage banner. Keep the four capacitor products faithful to the supplied reference: white CBB60 with black wire leads, black rectangular CBB61 with two blade terminals, silver aluminum CBB65 with two terminal groups, grey CD60 with two blade terminals. Preserve each sample's Hanxing logo, type code, visible original print and markings, physical structures and proportions; do not invent new certifications or change values. Entire products INCLUDING the leads and terminals must fit in the right 45 percent of the panorama with comfortable breathing room, bodies occupy about 50 percent of image height, bottoms at 80 percent. Left 50 percent must be quiet open space for website text, no objects and no typography added. Refined realistic product photography on a long warm oak sample desk, muted slate-blue wall, soft natural side lighting, matching the reference image. Widen the room and zoom out considerably; do not merely crop or stretch the supplied image. A clean photographic background across the entire panorama; no borders, no frames, no UI, no promotional labels, no extra captions, no gradients or flares. This is illustrative product display, never a factory or documentary scene.

## 验收与适配

原生输出比例约2.81:1，未达到提示中3.8:1，因此没有声称完全满足该尺寸。实施将桌面横幅改为430px并校准object-position，确保标志、引线、端子和罐身在1440/1024/768下均有完整展示空间。手机采用独立裁切；对应浏览器截图在 `after/`。格式优化使用Sharp，未再次改写印字或品牌。
