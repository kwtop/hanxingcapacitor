# Team Sunday → HAN XING homepage visual specification

Reference: https://teamsunday.com/ · inspected 2026-10-25. Scope: the Hanxing homepage only. Existing navigation labels, destinations, product facts, contact handling and tracking remain authoritative. Initial reference: `D:/jinyi/design-reference/DESIGN.md`, cross-checked against the live page. The prior Satechi site rules continue to apply to other routes.

## Evidence and measurement conditions

Real Chromium browser, CSS pixels, DPR 1, four viewports: 1440×900, 1024×768, 768×1024 and 390×844. Full-page screenshots and computed-style/geometry captures are in `sunday-home-20261025/reference/`. Baseline Hanxing captures are in `before/`. Fonts were awaited and the full document scrolled before capture. Seasonal modal and cookie overlay were dismissed; the seasonal announcement remains in the reference. Hero artwork rotates, so the brand depicted differs between captures. It is not a geometry difference.

The reference's Vimeo embeds do not render playable content in this environment. Their 720px container, overlays and text are observable; video content and playback are unverified. The reference gallery reserves nine desktop tiles, but some were blank at the initial capture; later DOM inspection confirmed nine image resources. We will not reproduce unloaded content or invent testimonials.

## 1. Complete reference structure and business mapping

| Order | Reference visual role | Hanxing mapping |
|---|---|---|
| 1 | Seasonal announcement, 56px desktop / 44px mobile | Omitted: no matching promotion; previously removed by user |
| 2 | Floating translucent pill navigation | Existing Hanxing menu content, same URLs and inquiry CTA |
| 3 | Bold two-line heading, form left; large isolated merch group right | Motor capacitor family; series selector linking into existing inquiry form |
| 4 | Unequal-height photo rail | Four capacitor series; genuine series ranges and detail links |
| 5 | Split introduction; four asymmetric gray feature tiles | Connections, terminal fit, packing and label selection |
| 6 | Centered title and three-column square photo wall | Equipment applications and product details, not customer endorsements |
| 7 | Split introduction and four-step image sequence | Inquiry, sample approval, order confirmation, packing |
| 8 | 720px edge-to-edge video with dark overlay and rounded white edges | Original supplied production image and production link |
| 9 | Split introduction; accordion left / media right | Existing technical and buying guides; image changes with topic |
| 10 | Image/story beside vertical metric rows | Actual company image and four named series / run-start distinction; no invented commercial metrics |
| 11 | Repeated hero CTA, overlapping footer by 60px | Existing model-aware inquiry path; Email and WhatsApp remain contact actions |
| 12 | Dark footer, grouped links and fine separator | Existing footer links and contact details |

## 2. Layout and measured geometry

Measurements below are actual DOM values unless identified as implementation choices.

| Element | 1440 | 1024 | 768 | 390 |
|---|---|---|---|---|
| Main content width | 1372 | 976 | 720 | 342 |
| Main left edge | 34 | 24 | 24 | 24 |
| Header panel | 1392×72 | 976×72 | 720×72 | 342×56 |
| Header top with seasonal bar | 66 | 64 | 64 | 52 |
| Hero minimum height | 900 | 768 | 1024 | 844 |
| Hero actual height | 900 | 768 | 1162 | 855 |
| Isolated hero artwork | 780×780 | 780×780 | 768×512 | 390×260 |
| Hero heading | 54/55.62 | 54/55.62 | 40/41.2 | 30/31.5 |

Content shell: `max-width:1420px; padding-inline:24px; margin-inline:auto`. Header gutter 24px; radius40px. On Hanxing the header begins at 10px/8px because there is no seasonal bar; hero still starts at document top. Preserve the 56/44px offset difference in comparison notes, not as unexplained drift.

Desktop section sequence and measured heights: hero900; stories630; feature section1240; gallery1767; process880; full-width media720; logistics1062; statistics770; closingCTA580; footer~872. Photography and business copy differ, so heights are targets, not forced empty space. Gallery image grid is 1372×1372 at desktop, three columns ~446.7px with16px gaps.

Feature grid: upper row1.4:1,516px high; lower row.66:1,352px high;32px row/column gap. Below870px it becomes a horizontal rail,420px-tall cards and24px gaps. Process cards form four columns at desktop, horizontal scrolling below1240px. Customer rail uses280–320px widths and420–490px heights with32px gaps, bottom alignment. These distinctions must remain visible.

## 3. Typography

Actual reference heading/nav family: `Plus Jakarta Sans, Plus Jakarta Sans Fallback`; body/actions: `Geist, Geist Fallback`. Both are open-source OFL fonts. Hanxing uses the same families, self-hosted Latin variable WOFF2 files from Google Fonts, with licenses saved in `public/fonts/sunday/`. Fallback: Arial, sans-serif. No font imitation is necessary.

| Role | Family / weight | Desktop size / line / tracking | Responsive |
|---|---|---|---|
| H1 | Jakarta800 | 54 /55.62 /−1.3px | 40/41.2 tablet;30/31.5/−1px mobile |
| H2 | Jakarta700 | 48 /48 /−2.4px | 36px below1080;30px below768 |
| Center gallery H2 | Jakarta800 | 44 /48.4 /−1.2px | 36/39.6;30/33 |
| Feature H3 | Jakarta700 | 28 /35 /−.7px | 22/27.5 in narrow cards |
| Step H3 | Jakarta600 | 22 /27.5 /−.55px | same unless wrapping needs more height |
| Hero body | Geist500 | 19 /30.875; max470px | 17/27.625 mobile |
| Body | Geist400 | 16 /24 | same |
| Nav | Jakarta700 | 16 /24 | keep readable; collapse before overlap |
| CTA | Geist500 | 16 /24 | 14/20 mobile |
| Field label | Geist600 | 12 /18 | same |

Headings use sentence case. Preserve meaningful line breaks. Do not add terminal full stops to titles. Gallery and mobile section introductions center; desktop split introductions and technical text align left. One H1 only; closing CTA uses H2 even though the source repeats H1.

## 4. Color tokens

```css
--su-purple:#7c35ff;
--su-ink:#0e0e10;
--su-body:#686c6f;
--su-white:#fff;
--su-veil:#fafafa;
--su-surface:#f0f1f3;
--su-border:#e4e5e7;
--su-border-hover:#c8c9cb;
--su-lilac:#e8e2ff;
```

Reference secondary accents: #3ABEFF blue, #2EE6A9 green, #FFD84D review yellow. They do not imply a need for Hanxing rating stars. Header fill is white60% with16px backdrop blur. Footer background#0E0E10, separators white10%. Hero veil: elliptical radial gradient centered27%50%,46%62% size, #FAFAFA opaque to32%,55%alpha at60%,transparent100%. This is reference-measured, not a new decorative effect. Closing CTA has #F5F5F5→#EBEBEB background.

## 5. Spacing and grids

Tokens:4,8,12,16,24,32,40,48,56,64,80,96,120px. Standard desktop section top120; gallery96; mobile64. Intro-to-bento/process80, intro-to-accordion56, statistics media64. Feature card radius22, image wall16–24, input/button fully round. Body line lengths about470–580px. Header center navigation keeps a separate brand/action zone.

## 6. Image roles and composition

Hero: isolated family on transparent alpha, displayed with `object-fit:contain`; right-side780px image desktop; narrower landscape composition or contained image below copy on mobile. Every product retains leads and terminals; no copy baked into the image. New ImageGen family uses existing Hanxing samples, original model/brand labels, no added certification.

Rail: full product / product plus setting, alternating heights with consistent bottom labels. Bento: lower-right product groups with negative space for HTML headings; one macro detail is deliberately cropped, while whole product presentations retain complete edges. Gallery: square application and detail photographs,9 desktop entries;4 initially on mobile with an explicit expansion button. Production: original source image in full-width720px frame; image cover with a40% dark overlay for white text. Company story: original brochure factory exterior. New generated assets remain product illustrations in alt text and provenance logs.

## 7. Navigation and interactions

Primary CTA:48px pill; padding-left24/right6; gap12; internal39px translucent circular arrow. Mobile40px pill/internal31px circle. Purple hover at90% opacity, arrow rotates45deg over300ms. Source shadow `0 8px 20px -8px rgba(124,53,255,.45)` plus subtle inset white; no unrelated cards/shadows.

Input/selector group: max500px; white rounded enclosure; padding6px; border#E4E5E7; shallow reference shadow. This is a GET transition to `/contact/?series=...&request=quote#inquiry-form`, not a fake successful inquiry.

Desktop Resources hover was observed open; mobile Open menu and Escape tested. Expanded accordion includes plus rotation and purple active circle. Preserve keyboard/focus support, aria-expanded, inert closed panels and reduced-motion behavior. Current Hanxing menus retain all original entries.

## 8. Responsive rules

- 1280+: hero copy allowance1100px; narrower desktop900px; prevent text/art overlap by veil and controlled text width.
- 1170: desktop navigation becomes mobile navigation. Hanxing has six groups rather than four, so actual fitting is checked at1440/1024.
- 1080: introductions stack and center; H2 becomes36px.
- Below1024: hero illustration goes below copy; mobile/tablet artwork retains full product outlines.
- 870: asymmetric feature grid becomes swipeable horizontal rail.
- 820: company story stacks, with compact facts before image.
- 768: header56px, H1=30, H2=30, section64px. Left/right gutter24px.
- No page-wide horizontal overflow. Rails alone scroll, with accessible labels and focusable links.

## 9. Baseline differences and acceptance

The current Hanxing page uses Manrope/Inter-like lighter headings, a full-bleed photographic hero, repeated centered series cards, warm surfaces and a short resource block. Sunday uses much heavier/tighter typography, isolated transparent objects, image rails, cool gray asymmetric panels, long alternating visual rhythms and purple actions.

Acceptance is by four actual browser screenshots per round, measured container/header/hero geometry, no overflow, correct photo boundaries and readable heading wraps. At least three rounds are retained. Different copy, industrial objects, navigation length, absent seasonal bar, no customer claims, and unavailable reference video prevent pixel identity and are explicitly recorded. No numerical “fidelity percentage” is asserted.

## Public-page industrial extension, 2026-10-25

The latest authorized scope extends the homepage system to public inner pages. Shared fonts, navigation, footer and purple actions remain. Inner pages add steel #EDF0F3 and graphite #1D252F, with source-bound product presentations and industrial equipment. The shell remains1420px including24px side padding.

Inner H1 uses54px/1.04/800 and H2 uses40px/1.1/700, reducing for long technical titles at tablet and phone widths. These are implementation choices for Hanxing content, not measurements of uninspected Sunday inner pages. Product galleries and technical records remain; procurement uses steps and ruled information; articles keep a reading column and table of contents. This extension supersedes the earlier homepage-only visual boundary below, while retaining the business and backend constraints.

Implementation: `src/styles/sunday-inner.css`. Evidence and image provenance: `sunday-site-20261025/REVIEW.md` and `ASSETS.md`.

## Initial implementation boundary

Only `/` gets the new design. Other routes, product specifications, menus, the real contact form, D1 persistence and admin backend remain intact. No Cloudflare or GitHub deployment is part of this task. Original assets are retained. Current work and provenance: `sunday-home-20261025/`.


## Final measured implementation

The four H1 font sizes, line heights, weights and letter spacing match the reference values above. Header navigation uses15px rather than16px because Hanxing retains six groups. All four viewport scroll widths equal their viewport widths. At1024, the artwork is reduced to650px and the hero is768px tall; full product edges take precedence over copying the source's780px artwork width.

Completed initial capture plus three correction passes: `round-1` → `round-2` → `round-3` → `final`. Final image decoding was checked; offscreen horizontal lazy images are not treated as broken requests. Reference screenshots were refreshed after images loaded. Geometry, remaining differences and actual functional checks are in `sunday-home-20261025/REVIEW.md` and `final/metrics-comparison.json`. `comparison.html` presents the full pages and matched-viewport hero overlays.

Reference hero emphasis is a rough-notation SVG stroke, measured `#E50914` / `5px` in the final mobile observation (`reference/underline.json`). Hanxing uses a static underline in this measured color/weight; the animated hand-drawn path and rotating customer-brand colors are not reproduced. Header CTA retains the measured circular arrow treatment.
