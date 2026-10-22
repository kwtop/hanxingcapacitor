# Homepage and resource-link refinement — 2026-10-20

Preview: https://candidate-20261019-satechi.hanxing-capacitor-preview.pages.dev/

Immutable deployment: https://fd6390d6.hanxing-capacitor-preview.pages.dev/

## Changes

- Removed the red HAN XING CAPACITORS eyebrow from the homepage Hero.
- Replaced fixed 780/760/700px Hero heights with 100vh / 100svh. The following section starts at the viewport boundary. Existing first scene, navigation and Compare series link remain.
- Adjusted the Hero's left inset at 1021–1200px, and its top inset on phones with a viewport height of 650px or less, to keep text and the button clear of the products.
- Rebuilt the blue-grey resource image through built-in ImageGen using the real CBB65 sample. The whole terminal assembly and bottom rim are visible. Five WebP sizes keep the largest image under 57KB. See IMAGEGEN-PROMPT.md and image-manifest.json.
- Removed 27 rendered outbound reference anchors across product pages, manufacturing, packing and seven guides. The only remaining HTTP(S) anchor destination is the supplied WhatsApp contact. Email links remain. Canonicals, structured-data citations and internal source records were not treated as visitor navigation links.
- Retained the internal Datasheet and drawing requirements anchor. Retained the old #references target as an invisible compatibility anchor on guides; removed its obsolete navigation item and outbound reference list.

## Checks

- Main workspace: npm run check — 123 files, 0 errors, 0 warnings, 0 hints.
- Isolated static preview: npm run check — 115 files, 0 errors, 0 warnings, 0 hints.
- Isolated static build — 35 HTML pages, successful.
- Artifact validation — 539 files, 174 referenced assets, 31 internal route targets, 73 redirects, no errors.
- Compared the four product pages before and after: published electrical/mechanical data, key facts, description, canonical and robots tags unchanged.
- Examined every built HTML page and fetched all 35 deployed pages: no outbound reference anchors remain; contact links are preserved.
- Online smoke test — 215 checks (35 built pages, unknown-path 404, 174 assets and 5 utility files), no failures. Preview noindex policy retained.
- Rendered viewport checks: 1600×1000, 1440×900, 1024×768, 768×1024, 390×844 and 320×568. Hero height equals viewport height and no document-level horizontal overflow was found.
- Native image and desktop/tablet/mobile resource-banner screenshots inspected for complete terminals and bottom rim, focal position and text clearance.
- Mobile menu opens and closes. Selecting CBB65 from the homepage reaches /contact/?series=CBB65&request=quote#inquiry-form and displays Series: CBB65. No email or WhatsApp message was sent.
- Browser error log: empty during local and deployed checks.

Evidence directory: D:/Hangxing/home-refinement-20261020/ — changed-file list, before copies, original generated image, deploy log, outbound audits, product baseline, responsive measurements, functional checks, online results and screenshots.

This updates the existing noindex Cloudflare preview branch. The main workspace's development-only visual gate is unchanged. No production domain, DNS, GitHub push or real inquiry delivery was changed.
