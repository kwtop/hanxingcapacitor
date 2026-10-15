# Content sources and review boundaries

## Primary inputs

1. `D:\Hangxing\原始素材` — local product and process material used to understand the CBB60, CBB61, CBB65 and CD60 visual forms. This update adds three supplied production/packing video stills and one original product photograph, documented in the manifest below.
2. [Hanxing official website](https://www.hanxingcapacitor.com/) — company-facing descriptions, current product-series pages, applications and public contact channel.
3. The supplied Chinese information-architecture document in the Codex attachment — navigation, page plan, technical guide topics and RFQ requirements. It is a planning input, not evidence of company capabilities.
4. [`D:\Hangxing\DESIGN.md`](../DESIGN.md) — Atoms visual-language extraction. The implementation adapts its spacious editorial hierarchy, monochrome palette and media-led composition to a technical procurement context; it does not copy Atoms branding.

## Product facts used

| Series | Official page | This site's treatment |
| --- | --- | --- |
| CBB60 | [Motor run capacitor](https://www.hanxingcapacitor.com/products/cbb60-motor-run-capacitor/) | Series-level published range; model-specific availability open |
| CBB61 | [Fan capacitor](https://www.hanxingcapacitor.com/products/cbb61-fan-capacitor/) | Series-level published range; connection and box size open |
| CBB65 | [Air conditioner capacitor](https://www.hanxingcapacitor.com/products/cbb65-air-conditioner-capacitor/) | Single and dual-run ranges kept distinct |
| CD60 | [Start capacitor](https://www.hanxingcapacitor.com/products/cd60-start-capacitor/) | Start duty stated; not presented as run replacement |

Additional official pages: [factory](https://www.hanxingcapacitor.com/factory/), [certificates](https://www.hanxingcapacitor.com/certificates/), [contact](https://www.hanxingcapacitor.com/contact/), [privacy policy](https://www.hanxingcapacitor.com/privacy-policy/).

### Official company information reviewed — 2026-09-24

- [About](https://www.hanxingcapacitor.com/about/) currently presents Hanxing Capacitor / HAN XING as the public export brand of Hanxing Electronic Technology Co., Ltd.
- [Contact](https://www.hanxingcapacitor.com/contact/) lists the business location used on the local About, Contact and footer pages. The local copy labels it as a published business address; it is not described as a registered office or independently certified factory address.
- [Factory](https://www.hanxingcapacitor.com/factory/) describes incoming inspection, capacitance testing, metal spraying, heat setting, rolling, oil injection, sealing, product testing, packing and warehouse handling. The local copy attributes this as the published process overview and asks buyers to confirm model-specific coverage and records.
- [Homepage](https://www.hanxingcapacitor.com/) states a standard MOQ of 1,000 pieces. The local copy repeats it as a public standard and directs buyers to confirm whether it applies to the exact series and configuration.
- [Case studies](https://www.hanxingcapacitor.com/case-studies/) says trade-show and customer-meeting photos are available for public use, but asks for buyer permission and order details before naming a country, model, quantity or delivery result. No such case outcome was added to the local site.

Technical educational references: [TDK Electronics motor capacitors](https://www.tdk-electronics.tdk.com/en/3192232), [Oriental Motor AC motor technical reference](https://www.orientalmotor.com/products/pdfs/F_TecRef/TecAc.pdf) and [Oriental Motor replacement guidance](https://faq.orientalmotor.com/can-i-use-capacitors-other-than-the-one-that-comes-with-the-ac-motor). The resource articles link their supporting sources individually where applicable.

## Open before public launch

- Verify the contracting/export entity against commercial documents and confirm factory ownership and the exact status of the published address with Hanxing. The public email is now linked from the official contact page, but inbox delivery has not been tested by this website. The local site links to the public business-license information rather than treating the export name as the legal seller.
- Match every certificate, drawing, test claim and download to the exact model and destination market before publication. The prototype has no certificate/download section that implies blanket coverage.
- Confirm which product combinations actually exist or can be custom quoted; a range endpoint does not imply a full matrix of stocked SKUs.
- Approve the generated images as illustration or replace with licensed, verified product/factory photography when evidence of real operations is needed.
- Approve the final privacy notice, retention policy and email delivery before configuring production RFQ reception.

The user-supplied `anji-ceramic.com.cn` reference was checked and appears to be a ceramic site unrelated to motor capacitors. No Hanxing company or product fact was borrowed from it.

### New campaign image — 2026-09-23

`public/images/hero-editorial.png` was generated with ImageGen using the earlier generated capacitor-family image as reference. It is an illustrative industrial still life, not documentary evidence of the factory, product geometry or installation.

## Manufacturing imagery update — 2026-09-23

| Published file | Original source | Treatment |
| --- | --- | --- |
| production-equipment.jpg | 原始素材/生产视频/6A1A7119.MOV, 00:02 | Unretouched extracted frame |
| production-connections.jpg | 原始素材/生产视频1/6A1A7131.MOV, 00:02 | Unretouched extracted frame |
| production-packing.jpg | 原始素材/包装新/1.mp4, 00:02 | Unretouched extracted frame |
| source-cbb65.jpg | 原始素材/全系电容照片/CBB65/DSC01159.JPG | Original file copied without alteration |
| detail-terminals.png | Built-in ImageGen | Illustrative connector detail |
| detail-wire-leads.png | Built-in ImageGen | Illustrative wire-lead configuration |
| sample-review.png | Built-in ImageGen | Sample/size review scene, not an actual test |
| packaging-concept.png | Built-in ImageGen | Packaging concept, not a shipment record |

Supplied footage demonstrates only what is visible in the frame. It does not establish factory ownership, production capacity, certification, inspection coverage or performance. No such claims were added. These sources supplement the previously documented official-site content.


## Real-photography expansion

The latest update adds ten original product photographs and five unretouched video frames. See REAL-MEDIA-SOURCES.json for exact original paths and frame timestamps. Product listings and detail galleries now use these photographs. CSS controls framing without changing labels or product colour. AI-stylized source files and unrelated PVC-tape shipment photos were excluded; conflicting CD60 label examples were not promoted into product claims. The home page uses four supplied production stills. The factory page now combines three recorded video clips with two additional supplied still images.

## Replacement checklist and video content — 2026-09-24

- The existing /buying-guide/ now serves as the Motor Capacitor Replacement Checklist. The URL is preserved; the Resources hub, product detail pages, header menu and footer link to it. The inquiry outline is based on existing purchasing fields and does not invent model availability.
- Production clips on /factory/ use 6A1A7121.MOV, 6A1A7125.MOV and 6A1A7128.MOV from 原始素材/生产视频/. The OEM packaging clip on /oem/ uses 包装新/1.mp4.
- Video outputs are silent H.264 transcodes with original aspect ratios; the listed scenes are not represented as factory-capacity, model-certification or order-fulfillment proof. The packing poster is an unretouched frame from the supplied clip.
- Added `/resources/motor-capacitor-order-shipment-checklist/` as a buyer-side order and dispatch checklist. It explains what to confirm in writing for model/revision, packaging, inspection scope, delivery milestones, route-specific documents and discrepancy handling; it does not claim Hanxing has promised these services or terms.
- Reviewed the 34 files under `原始素材/发货素材5.6/`. The images and clips show packaging/loading-like scenes, but do not identify an exact capacitor model, order, customer, shipment documents or carrier handover that could substantiate a company shipment claim. They are not published as shipment proof. No export destinations, order volumes, dispatch frequency or lead-time claims were inferred from them.

## Packing, dispatch and export-record guide — 2026-09-24

- Added `/factory/packing-and-dispatch/` under OEM & Quality, linked from the desktop/mobile navigation, footer, factory page, OEM page and shipment checklist. The page covers packout approval, carton marks, carrier handover, route-specific documents and evidence required before publishing an export case.
- Added five scene illustrations under `public/images/illustrative/`. These are not company photographs. Their provenance and evidence boundary remain recorded here, in `REAL-MEDIA-SOURCES.json` and in `IMAGEGEN-NOTES.md`.
- A visual re-review found malformed text and implausible/repeated geometry in the supplied production, packing, shipment and event material. Those materials are not used as proof of Hanxing operations, team identity, customers or deliveries. No identifiable buyer, destination, shipment, customer outcome or staff portrait was added.
- The new guide states that no independently reviewable public shipment case is currently published. A future case requires order-linked evidence and written customer permission before public details are added.

## Expanded operational visual references — 2026-09-24

- Added five further ImageGen illustrations to the existing set: anonymous team-at-work scene, generic inspection setup with blank display, plain-carton warehouse staging, pallet-to-container handling and blank export-form review. Dimensions are 1536×1024; converted to WebP quality 86.
- The photo-led views are distributed across the homepage/About, manufacturing review, OEM, packing and dispatch guide, and order/shipment checklist. The dedicated dispatch guide also explains four real order-linked photos to request from a supplier.
- These are explanatory scenes only. They do not depict Hanxing personnel, equipment, approved packaging, an actual customer, purchase order, carrier or delivery. No export case or customer outcome has been added without evidence and permission.
- This section describes the current page state and supersedes earlier factory-gallery/video placement notes above. Product pages retain their original capacitor photographs; the extracted factory stills and video transcodes are not referenced by current page components.

## Buyer-content remediation — 2026-09-25

This section supersedes the previous statement that the supplied video transcodes are unused. The homepage now previews three source-mapped video frames, `/factory/` shows the corresponding film, equipment and test-area clips, and `/factory/packing-and-dispatch/` shows the source-mapped packing clip. The clips document only their visible scenes. `REAL-MEDIA-SOURCES.json` identifies each original and treatment.

| Public statement or guide | Source and boundary |
| --- | --- |
| Hanxing Capacitor / HAN XING, English company name and four product series | [Official About](https://www.hanxingcapacitor.com/about/); public brand and English name, not a substitute for the legal seller on an order |
| Business license entity `邢台市威钻电子科技有限公司` and published business address | [Official privacy and business identity page](https://www.hanxingcapacitor.com/privacy-policy/); the site presents the Chinese license entity and English export name separately |
| Public email `ManuelaMusio570@gmail.com`, WhatsApp `+86 153 3339 4111`, and business address | User-confirmed contact details on 2026-10-12; supersedes the previous WhatsApp number. Links open an external message draft; inbox delivery has not been tested by this website. |
| Published CBB60, CBB61, CBB65 and CD60 series ranges | Individual official product pages linked in the product table above; no complete capacitance × voltage × size availability matrix is inferred |
| Motor replacement and selection principles | [Oriental Motor](https://faq.orientalmotor.com/can-i-use-capacitors-other-than-the-one-that-comes-with-the-ac-motor) and [TDK motor capacitor catalog](https://www.tdk-electronics.tdk.com/en/3192232); these do not certify any Hanxing model |
| Packing list, invoice and named delivery-term checks | [International Trade Administration](https://www.trade.gov/common-export-documents) and [ICC Incoterms guidance](https://library.iccwbo.org/clp/clp-incoterms-qa-2020.htm?AGENT=ICC_HQ); the actual document set depends on the order and route |

The [official certificates page](https://www.hanxingcapacitor.com/certificates/) still has no model-linked public scans, and the [official case studies page](https://www.hanxingcapacitor.com/case-studies/) still has no order-level delivery outcomes. No model certification, export destination, order quantity or customer result has been inferred from those pages or generated scenes. The contact page now has an in-page draft form at the user's request. It prepares a WhatsApp or email message locally; direct website submission and file attachment delivery remain unconfigured.

## Presentation cleanup — 2026-09-25

- Removed decorative eyebrow labels, illustration badges and the long illustration notice from public page layouts at the user's request. The scenes remain examples for buyer review questions; page copy still asks for current model- or order-specific evidence before making a purchasing decision.
- Removed the homepage technical-guide list while preserving the Resources menu and `/resources/` hub. Application-card headings are centered. Removed the four decorative line icons from the homepage sourcing strip.
- Generated product/catalog artwork and operational scenes have not become documentary photographs through this layout change. The original product photos, supplied video frames and generated-file provenance remain recorded in this file and `REAL-MEDIA-SOURCES.json`.
- Removed repeated title subtitles and chapter-intro blurbs across the public pages. Buyer checklists, model ranges, source boundaries and contact actions remain in the page body or metadata.
