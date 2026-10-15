# Reference application images — 2026-10-12

本批图片使用原生 `image_gen.imagegen` 工具分别新生成，共四张独立图片。实际查看用户参考图后，统一采用白灰环境、自然柔光、紧凑设备主体和低饱和工业材质。未使用 CLI/API fallback，未修改已有真实产品照片、生产视频截图或来源记录。

## 文件与用途

| 图片 | 当前网页引用 | 替代的旧展示图 | 原始/交付尺寸 | 交付文件大小 |
|---|---|---|---|---|
| HVAC & refrigeration | `/images/reference-20261012/hvac.webp` | `/images/illustrative/application-hvac-v1.webp` | 1254 × 1254 / 1200 × 1200 | 160,262 bytes |
| Pumps & water systems | `/images/reference-20261012/pumps.webp` | `/images/illustrative/application-pumps-v3.webp` | 1254 × 1254 / 1200 × 1200 | 159,922 bytes |
| Fans & ventilation | `/images/reference-20261012/fans.webp` | `/images/illustrative/application-fans-v1.webp` | 1254 × 1254 / 1200 × 1200 | 154,182 bytes |
| Appliances & small motors | `/images/reference-20261012/appliances.webp` | `/images/illustrative/application-appliances-v2.webp` | 1254 × 1254 / 1200 × 1200 | 67,032 bytes |

交付位置为 `D:/Hangxing/workspace/public/images/reference-20261012/`。生成的原始 PNG 已分别复制到项目内 `.qa/reference-monochrome-20261012/application-image-sources/{hvac,pumps,fans,appliances}.png`，便于来源追溯。Sharp 仅用于保留完整构图的等比缩放和 WebP 编码（1200 × 1200，quality 86），未手工重绘、合成或改变图像内容。旧展示图仍保留。

## 网页使用与裁切

- 首页四列应用入口、应用目录和四个应用详情共用同一组图像与 alt 文本，由 `src/data/site.ts` 分发。
- 优先以 1:1 显示，保持设备全体和安装脚可见。移动端无需另外裁切；两列或单列时保留方形构图。
- 若详情页采用宽画框，应使用 `object-fit: contain` 并让画框背景保持浅中性色；不要用宽幅 `cover` 裁去泵底座、风机脚或洗衣机底部。
- 标题、适用系列和技术判断使用网页文本，不烧入图片。
- 应用展示图继续可见标注 `Illustrative application visual`；原有产品参数、选型条件和业务文案未改。

## 来源与事实边界

四张均为新生成的通用应用示意，不能用作客户安装、企业生产能力、认证或履约证据，也不表示画中设备实际使用某一特定电容配置。机壳保持闭合，没有示意电容安装位置或电路。图片内无品牌名称、认证标识或可读参数；选型仍以原电机规格、原件标签和具体接线为准。

## 检查结果

四张生成结果均已实际查看：主体容易识别，设备没有明显被方形边缘截断，柔和白灰环境与参考统一；水泵保留参考方向允许的局部蓝色和铜管实物色。所有交付文件为 1200 × 1200，设备主结构和轮廓清楚。生成图不改变任何产品规格或型号。

## 每张实际生成提示词与默认保存位置

### HVAC & refrigeration

默认生成 PNG：`C:/Users/Administrator/.codex/generated_images/01a12e81-9f02-7230-9f7a-d430da9755e2/exec-28b26b95-0663-495d-806d-6ee8d686643c.png`

```text
Use case: photorealistic-natural. Asset type: square application illustration for a compact four-column industrial B2B website grid, white black minimalist editorial design. Generate a single square realistic photograph-style illustrative image of a closed outdoor HVAC air-conditioning condenser, rectangular muted gray metal enclosure with credible horizontal protective grille and fan hidden inside, on a light concrete plinth beside a very pale neutral masonry wall. Show the whole appliance in a three-quarter front view, device fills about 75 percent of the square, leave 8 percent clear safety margin so compact square/mobile crops retain all outer edges. A couple of plausible insulated connections discreetly behind, no installation internals exposed. Soft natural daylight, realistic brushed metal, restrained desaturated neutral palette and pale gray ground, gently shallow background. Clean ordinary functional equipment, premium calm studio-editorial quality without showroom theatrics. No text, no logo, no labels, no people, no badges, no watermark, no visible capacitor or invented capacitor installation. This is a generic illustrative application visual, not a customer project or a certification photograph. Square composition, not a collage.
```

### Pumps & water systems

默认生成 PNG：`C:/Users/Administrator/.codex/generated_images/01a12e81-9f02-7230-9f7a-d430da9755e2/exec-fa9338ff-9eef-4fd9-bd22-2529b6f7d12f.png`

```text
Use case: photorealistic-natural. Asset type: square application illustration for a compact four-column industrial B2B website grid with minimalist white black editorial styling. Generate one square photograph-style illustrative image of a closed compact centrifugal water pump with a blue-painted ribbed electric motor and black top connection box, believable cast-metal pump volute connected to a simple copper inlet elbow and one copper vertical outlet. Pump shown in three-quarter side view, complete closed equipment with motor/pump casing and the pipe joints clearly recognizable. On a clean light gray concrete utility-room floor against a softly textured pale gray wall, no clutter. Device fills about 75 percent of frame with 8 percent clear safety margin, pipes fit entirely within the square except a discreet continuation at left edge. Soft daylight from upper left, realistic metal with mild manufacturing texture, calm desaturated cool neutral environment, restrained industrial blue device is the only strong color. No text, no brand logo, no labels, no person, no badges, no water spray, no schematic overlay, no visible capacitor or imagined wiring/installations. Generic illustrative application scene only, not a real customer project and does not establish capacitor configuration. Square composition, not collage.
```

### Fans & ventilation

默认生成 PNG：`C:/Users/Administrator/.codex/generated_images/01a12e81-9f02-7230-9f7a-d430da9755e2/exec-4b5ed7c2-e42c-4c77-bd6d-eb1c717dd0d7.png`

```text
Use case: photorealistic-natural. Asset type: square generic application illustration for a compact four-column industrial B2B website grid, minimalist white black editorial style. Generate one square realistic photograph-style scene of a standalone compact industrial gray axial ventilation fan, cylindrical circular housing, protective fine circular metal grille at front with a few visibly plausible blades behind it, short closed motor assembly partly visible at rear. Show complete fan three-quarter view resting on two small solid mounting feet, fan circular face points toward viewer slightly from left. Entire housing and feet safely inside square, subject occupies about 75 percent frame with 8 percent margins. Clean pale gray concrete floor and light neutral wall of an uncluttered equipment room. Soft natural daylight, restrained desaturated gray metal, subtle realistic wear and believable fabrication, no theatrical lighting. No text, logos, labels, people, watermark, badges, no visible capacitor and no illustrated capacitor installation or imaginary circuit. This must read instantly as a ventilation fan in a small product thumbnail, not an air conditioner. Generic illustrative application scene, no claim of actual customer installation. Square composition, not collage.
```

### Appliances & small motors

默认生成 PNG：`C:/Users/Administrator/.codex/generated_images/01a12e81-9f02-7230-9f7a-d430da9755e2/exec-eefaf296-c1c5-450b-aa8e-0202532f29b2.png`

```text
Use case: photorealistic-natural. Asset type: square generic appliance application illustration for a compact four-column industrial B2B website grid with minimalist white black editorial styling. Generate one square realistic photograph-style illustrative image of a closed white front-loading washing machine, clearly recognizable single circular smoked-gray glass door in front, plain quiet rectangular white enclosure, physically plausible small simple dark upper control panel with no readable text or logo. Show the entire washer in a slight three-quarter front view occupying about 75 percent of square frame with 8 percent clear safety margins. Clean uncluttered bright service/laundry room: light neutral painted wall and pale gray tiled floor with gentle real texture, no décor props needed. Soft natural daylight from the left, white body highlights held so edges remain visible, restrained desaturated gray palette, subtle real shadows, calm professional editorial quality. No visible laundry, no person, no brand name, no numbers or readable text, no badges, no certification marks, no watermark, no opened casing, no shown capacitor or made-up electrical installation. Generic illustrative application visual, not a Hanxing customer project and not a depiction of a particular motor circuit. Square composition, not collage.
```

