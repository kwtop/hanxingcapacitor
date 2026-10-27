# Workshop photo stories · 2026-10-26

The local website now uses 24 new WebP assets (3.46 MiB total): 17 frames extracted from supplied videos, four supplied photographs, and three ImageGen editorial reconstructions based on the extracted frames. The three generated PNG originals are retained in `docs/image-generation-20261026/`. The source-video path and exact extraction time for every frame are recorded in `docs/workshop-photo-stories-20261026.json`.

The galleries appear on the homepage, manufacturing page, packing and dispatch page, company page and OEM page. Three related technical guides also include smaller context strips: start versus run, dimensions and terminals, and the order and shipment checklist. The pictures are intentionally grouped around visible activities rather than used as proof of a specific order, customer result, test outcome or certificate.

The generated film-room, metal-can and loading-lane images are marked in their captions as illustrative. They may alter small equipment, terminal or carton details and must not replace source frames where exact product or process evidence matters. The supplied visit photographs and the other source frames remain unretouched aside from orientation correction, resize and WebP encoding.

Local validation: `npm run check` completed with no diagnostics; `npm run build` completed. All eight routes returned the expected gallery image counts in the local preview and had no horizontal overflow at a 390px mobile viewport. The homepage, manufacturing, packing, company and start-versus-run galleries were visually inspected. No production deployment was made.
