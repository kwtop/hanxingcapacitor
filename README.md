# Hanxing independent site

An Astro 7 + React 19 B2B motor capacitor website, with a Chinese admin, Cloudflare Pages Functions and D1 inquiry storage. The backend is implemented and tested locally; this revision has **not been published**.

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

### Website with real local inquiries and admin

```bash
npm run setup:admin
npm run dev:admin
```

Open `http://127.0.0.1:4342/` and `http://127.0.0.1:4342/admin/`. Setup creates a private local administrator in `.admin-local/access.txt` and migrates a persistent local D1 database under `.wrangler/state`. These files are ignored by Git. All local visits and inquiries are internal test records; select **包含内部测试** to inspect them in the admin. The existing visual-only preview at port 4340 remains separate.

Cloudflare bindings, authentication, Turnstile, metric definitions and release prerequisites: [ADMIN-SETUP.md](docs/ADMIN-SETUP.md).

## Site structure

- Products: CBB60, CBB61, CBB65, CD60, plus comparison and duty filter.
- Applications: HVAC, pumps, fans and small appliances.
- OEM & Quality: requirements and evidence to request for an exact model.
- Resources: six technical guides, a buying and shipping guide with quotation and order checklists, and buyer FAQ.
- Inquiry: a server-saved form with product, sample and guide references, plus direct email and WhatsApp options.
- Admin: inquiry follow-up, CSV export, anonymous visitor journeys, and filtered traffic / conversion trends.

Content is in `src/data/site.ts`, `src/data/guides.ts` and `src/data/guideLayouts.ts`. Page templates live in `src/pages`. Shared styles are imported in `src/layouts/BaseLayout.astro`; the confirmed porcelain direction and content review are implemented in `src/styles/review-*.css`. The approved content and layout plan is `docs/整站内容与布局修改方案-20261012.md`.

## Inquiry behavior

The `/contact/` form posts to Pages Functions. A successful D1 transaction saves the inquiry and one server-generated success event, then returns a reference. Retrying the same submission does not create another inquiry. Production submissions require real Turnstile validation; only loopback requests with `APP_ENV=local` use the local proof flow.

Authorised admins can search inquiries, mark them read / unread, change status, add notes and export CSV. Password sessions are stored as hashed opaque tokens; Cloudflare Access JWT authentication is also supported. Direct email and WhatsApp clicks are contact events, not received inquiries. This version does not send email notifications or support file attachments. Labels and drawings can still be sent through the existing direct contact options.

Anonymous activity records contain paths and interaction metadata, not keystrokes or form values. Bot traffic is excluded, internal traffic is excluded by default, and unknown geography stays unknown. Analytics errors do not block form submissions.

## Publication status

The confirmed canonical target is `https://www.hanxingcapacitor.com`. Existing Cloudflare previews use `hanxing-capacitor-preview`. The current backend has not been uploaded to that project, and a dedicated Hanxing D1 must be created and bound before publication. No other business database is reused.

`npm run build:cloudflare` exports the current Satechi presentation to `.cloudflare-site`; `functions/` supplies its backend at deployment. The isolated export keeps noindex headers and existing migration redirects. It does not deploy anything. The ordinary `npm run build` remains a Node standalone baseline build; it does not supply a production D1 backend. See the admin setup document before choosing a deployment command. Public legal identity, certificates and model records retain the existing business review boundary.

Technical SEO/GEO results, priorities and release commands: [SEO-GEO-AUDIT-20261012.md](docs/SEO-GEO-AUDIT-20261012.md). Existing robots and sitemap routes share an automatic route/content index with `llms.txt`; no fabricated modification dates are generated. `npm run check:release -- <candidate> https://www.hanxingcapacitor.com` performs read-only initial-HTML, Meta, Schema, asset, utility-page and migration checks.

Images now combine labelled ImageGen illustrations with supplied photographs and production video stills. Generated images are not model drawings or factory evidence. See MEDIA-AUDIT.md and CONTENT_SOURCES.md for coverage and provenance.

## Validation

```bash
npm run check
npm run build
npm run test:backend
npm run build:cloudflare
npm run test:pages
```

Backend tests use isolated real local D1 databases and Cloudflare runtimes. They cover saved inquiries, concurrent retries, authentication, CSRF, CSV, event order, metrics, filters, notes and persistence after restart. The Pages smoke test checks the actual Pages Functions routing against the static export. Browser QA includes a real form submission, product-source transfer, Chinese inbox, follow-up, visitor linkage, CSV download and responsive layouts. See [ADMIN-VERIFICATION-20261022.md](docs/ADMIN-VERIFICATION-20261022.md) for the current results and `CONTENT_SOURCES.md` for product evidence boundaries.

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
