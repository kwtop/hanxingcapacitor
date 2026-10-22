# Hanxing independent site

An Astro 7 + React 19 B2B motor capacitor website. This is a **local working prototype**, not a published Hanxing service.

## Run locally

```bash
git clone https://github.com/kwtop/hanxingcapacitor.git
cd hanxingcapacitor
npm ci
npm run dev
```

Open the local URL printed by Astro. `npm run check` validates Astro/TypeScript and `npm run build` creates a Node standalone build. `npm run start` runs that build.

### Current visual preview

To open the current Satechi-inspired version, including the updated navigation, product pages and brochure imagery:

```bash
npm run dev:visual
```

Open `http://127.0.0.1:4340/`. This command sets `HANXING_VISUAL_PREVIEW=satechi` for the local development server. The visual variant is intentionally gated to development; `npm run dev` and the standard production build retain the baseline presentation. Pushing this repository does not promote the visual preview to production.

The latest product accuracy review is in [product-accuracy-audit-20261022.md](docs/product-accuracy-audit-20261022.md). It records unresolved model, label and source discrepancies; uploading the current code does not mean those items have been corrected or independently verified.

## Site structure

- Products: CBB60, CBB61, CBB65, CD60, plus comparison and duty filter.
- Applications: HVAC, pumps, fans and small appliances.
- OEM & Quality: requirements and evidence to request for an exact model.
- Resources: six technical guides, a buying and shipping guide with quotation and order checklists, and buyer FAQ.
- Inquiry: an email or WhatsApp message draft, with product, sample, application and guide references retained.

Content is in `src/data/site.ts`, `src/data/guides.ts` and `src/data/guideLayouts.ts`. Page templates live in `src/pages`. Shared styles are imported in `src/layouts/BaseLayout.astro`; the confirmed porcelain direction and content review are implemented in `src/styles/review-*.css`. The approved content and layout plan is `docs/整站内容与布局修改方案-20261012.md`.

## Inquiry behavior

The current `/contact/` form prepares a message in the browser. The customer reviews or copies it and sends it from their own email or WhatsApp app. Attachments are added in that app. The form does not submit a request to the site's API or send email. Purpose changes preserve entered requirements and valid references; changing series removes incompatible sample references.

A retained API and legacy inquiry-status page exist for compatibility. They are not used by the current draft form. Activating that API would be separate work; its settings are:

| Setting | Purpose |
| --- | --- |
| `PUBLIC_SITE_URL` | The final domain for canonical URLs, sitemap and indexing |
| `INQUIRY_STORE_DIR` | Absolute, persistent, private directory outside public assets |
| `SALES_NOTIFY_EMAIL` | Verified receiving mailbox |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Mail transport |

The server saves the record before attempting notification. If sales notification fails, the response includes the saved reference and reports a delivery failure. The browser then retains the entered form, rather than claiming a successful sale inquiry. Customer acknowledgement failure is reported separately. Deployment requires an operator to define access control, retention, backups, spam protection, monitoring and a final privacy policy. No live SMTP was configured or exercised during this build.

## Publication status

The confirmed canonical target is `https://www.hanxingcapacitor.com`. Local previews keep robots blocking, noindex HTML/headers and an empty sitemap until `PUBLIC_SITE_URL` is set consistently at build and runtime. Set that value **before building** so prerendered product, application and article pages receive the correct indexing directives; rebuilding is required after any origin change. The English relaunch includes 301 redirects for the retired Spanish/Arabic URLs and three legacy English sections. Use the Node standalone runtime, not an HTML fallback for unknown URLs or a client-only directory upload. Public legal identity, certificates and model records still require business review. The project has not been deployed or connected to a live mailbox.

Technical SEO/GEO results, priorities and release commands: [SEO-GEO-AUDIT-20261012.md](docs/SEO-GEO-AUDIT-20261012.md). Existing robots and sitemap routes share an automatic route/content index with `llms.txt`; no fabricated modification dates are generated. `npm run check:release -- <candidate> https://www.hanxingcapacitor.com` performs read-only initial-HTML, Meta, Schema, asset, utility-page and migration checks.

Images now combine labelled ImageGen illustrations with supplied photographs and production video stills. Generated images are not model drawings or factory evidence. See MEDIA-AUDIT.md and CONTENT_SOURCES.md for coverage and provenance.

## Validation

```bash
npm run check
npm run build
```

The local browser QA includes desktop, tablet and mobile layouts, page navigation, product filter and an end-to-end preview inquiry. See `CONTENT_SOURCES.md` for the source and uncertainty boundary.

## Save changes to GitHub

Run these commands from the project directory after reviewing your changes:

```bash
git status
git add <changed-files>
git commit -m "Describe the change"
git push origin main
```

The repository excludes dependencies, build output, environment secrets, local inquiry records and review archives. The `.env.example` file contains configuration names and safe defaults. Pushing to GitHub saves the project; publishing the website requires a separate deployment.

Generated PNG, JPEG, WebP and SVG review captures, plus saved patch snapshots, under `docs/` stay local to avoid committing the large screenshot archive. Written review records, image provenance and the actual website assets under `public/` are versioned. Screenshot links in review records require the original local review files.

## Visual redesign — 2026-09-23

The Atoms-inspired revision uses a white/charcoal palette, DM Sans with selective Instrument Serif, a generated industrial campaign image, pill actions, a responsive product rail and editorial sections. Implementation details are in DESIGN.md. Key pages were checked at 390, 768 and 1440px; navigation, rail, filtering, disclosures and the local inquiry flow were exercised. No live email was sent.
