# HH Global Company — Project Context

## Business
Wholesale garments + leather goods manufacturer. Phase 1 (current): quote-request
model only — no cart, no payments. Phase 2 (future): full retail e-commerce added
on top of the same codebase — cart, checkout (Stripe), delivery tracking, accounts.
Domain: hhglobalcompany.com. Owner is a UI/UX designer, not a developer — all
code changes should be made by Claude, explained in plain language, no jargon
assumed.

## Product catalog
- **Garments**: T-Shirt, Sweat Shirt, Sweat Pants, Hoodies (no style/finish variants)
- **Leather Products**: Long Wallets (Plain/Mild/Unisex Mild/Plated), Ladies
  Clutches (Small/Regular/Zipper), Card Holder (Plated/Mild/Plain), Men's Wallet
  (5 styles), Men's Belt (Mild)

## Design language
Editorial/manufacturing-studio aesthetic (reference: an "essentialgoods" studio site).
- Fonts: Archivo (display/UI), Space Mono (technical readouts — eyebrow labels,
  mono-caps tags)
- Monochrome palette (warm white / near-black ink) **plus one deliberate accent
  color**: warm brass/gold (`--accent` / `--accent-soft` in `app/globals.css`),
  added during the storefront design audit. Used sparingly — only for the single
  primary conversion action per page (quote form submit, product page "Request
  Quote", homepage/about "Start Your Quote" CTAs) and the arrow badge that
  accompanies it. Everything else (nav, secondary actions, toggles) stays
  monochrome — don't reach for the accent color casually, it only reads as an
  accent because it's rare. The Leather catalogue section used to be a dark
  panel — it's now light like the rest of the site, since having two catalogue
  sections in different themes read as inconsistent. Category/product photo
  fallback gradients differ by tone (cool neutrals for garments, warm
  tan/leather tones for leather) so there's still visual variety without a theme
  switch.
- Signature elements: asterisk mark above the homepage hero headline, pill buttons
  paired with a circular arrow icon, a bracket/crop-mark tag motif
  (`components/BracketLabel.tsx` — four corner marks around a small mono-caps
  label, used for "Learn More About Us" and similar accents), rounded-2xl cards
  throughout (category tiles, product cards, process cards, stat cards) — the
  original "sharp corners everywhere except pills" rule from the first design pass
  was superseded by this rounded treatment during the storefront redesign.
- Live GMT+5 clock and "Status: In Production" header readout were removed —
  replaced with a logo+brand-name lockup, a "Product" nav dropdown (Garments/
  Leather), and a single "Contact Us" pill button on the right.
- Design tokens live in `app/globals.css` as CSS variables — always reuse these,
  never introduce ad hoc colors
- `components/ProductCard.tsx` is the **one** card component for every product
  grid (homepage previews, `/garments`, `/leather`, and product-page "related
  products") — don't build a one-off card for a new listing; extend this one.
  It owns its own `<Link>`, a shared fallback gradient palette, a style-count
  badge, and a hover state (image zoom + circular arrow badge).
- `components/Button.tsx` is the **one** button component for the public
  storefront (`primary`/`accent`/`secondary`/`outline`/`ghost` variants,
  `sm`/`md`/`lg` sizes; renders a `<Link>` when given `href`, otherwise a real
  `<button>`) — reuse it for any new CTA rather than hand-typing pill classes.
  `components/ArrowBadge.tsx` is the matching circular arrow-icon badge
  (`ink`/`accent` tone). Admin panel buttons (`components/admin/**`) are a
  separate, intentionally untouched surface — not part of this system.

## Tech stack
- Next.js 16 (App Router), Tailwind CSS v4
- Supabase (Postgres) for products/categories/variants/quotes/site content — with
  automatic fallback to static JSON files (`data/*.json`) if Supabase isn't
  connected, so the site never breaks. Every `lib/*.ts` data-access function
  follows this exact pattern; keep new ones consistent with it.
- Resend for email notifications (not yet configured — pending)
- Hosted on Vercel, auto-deploys on every push to `main`
- GitHub repo: https://github.com/abuMuhammad101/hhglobalcompany-store

## Architecture
- `data/schema.sql` — base one-time Supabase setup script (tables + seed data).
  **Additive migrations since then are separate files, not edits to this one**
  (the DB is already live in production): `schema-images.sql` (product/category
  cover photos + storage bucket), `schema-product-gallery.sql` (multi-photo
  galleries), `schema-site-media.sql` (`site_settings` key/value table for
  logo/brand name, `hero_slides`), `schema-page-content.sql` (`page_content`
  JSONB-per-group table for site copy), `schema-quote-items.sql` (`quote_items`
  table for multi-product quotes + a second, public `quote-uploads` storage
  bucket). Follow this pattern for future schema changes too.
- Every product has **three independent photo surfaces**, each with its own
  admin manager component: a single **Featured Image** (`products.image_url`,
  `components/admin/FeaturedImageManager.tsx` → `PATCH /api/admin/products/[id]/image`)
  used as the cover on shop pages/listings and the main product-page photo; a
  **Detail Photos** gallery (`product_images` table, `ProductGalleryManager.tsx`)
  of additional spec/detail shots; and **Style/Finish variants**
  (`product_variants` table, `VariantManager.tsx`) — one photo per named
  option (e.g. Plain/Mild/Plated) that swaps the main photo when clicked, like
  a color swatch. `ProductView.tsx` composes the customer-facing gallery as
  `[active variant photo, ...detail photos]` when the product has variants, or
  `[featured image, ...detail photos]` when it doesn't.
- `lib/catalog.ts`, `lib/settings.ts`, `lib/hero.ts`, `lib/content.ts` — async data
  getters, each: try Supabase, fall back to a JSON file in `data/` on no
  connection or query error. `lib/content.ts` also exports `paragraphs()`, a
  helper that splits a blank-line-separated "body" string into `<p>` tags — used
  everywhere multi-paragraph copy is stored as one textarea field.
- `lib/supabase.ts` — Supabase client, reads `SUPABASE_URL` +
  `SUPABASE_SERVICE_KEY` (falls back to `SUPABASE_SECRET_KEY`, which is what
  Vercel's official Supabase integration names it)
- `components/ProductView.tsx` — product detail view: framed main photo
  (`rounded-2xl border border-line`, matching `ProductCard`/`HeroCarousel`), a
  real photo gallery (thumbnails, prev/next arrows, click-to-zoom lightbox),
  breadcrumb, and a Details card (category/type/style/material). Reused (in
  `compact` mode) for the admin live preview. The product page itself
  (`app/product/[slug]/page.tsx`) additionally renders a "More from
  [Category]" related-products section below it, using `ProductCard`.
- `components/QuoteForm.tsx` — the quote request form. Supports **multiple
  products per submission** (add/remove line items), each with its own
  Category → Product Type → Style/Finish cascade (from `catalog`), a free-text
  preferred-color field, quantity, an optional reference photo
  (`components/QuoteImageUploader.tsx`, posts to the public
  `app/api/quote/upload/route.ts`, unauthenticated — separate from the admin
  upload path), and per-item notes. There's no real color catalog yet, hence the
  free-text field rather than a picker.
- Two independent image-upload pipelines, deliberately not shared: the **admin**
  one (`components/admin/ImageUploader.tsx` → `/api/admin/upload` → Basic-Auth
  gated → `product-images` bucket) for Products/Categories/Media, and the
  **public** one (`components/QuoteImageUploader.tsx` → `/api/quote/upload` →
  unauthenticated → `quote-uploads` bucket) for quote-form reference photos. If
  a new upload surface is needed, decide which of these two auth/bucket contexts
  it belongs to rather than building a third.
- `app/admin/` — password-protected (HTTP Basic Auth via `proxy.ts`, using
  `ADMIN_USER` / `ADMIN_PASSWORD` env vars), five tabs:
  - **Quotes** — CRM with status pipeline (new/contacted/quoted/won/lost),
    filters, autosaving notes. Each request can list several products; shown
    stacked with a thumbnail per attached reference photo. Pre-migration
    single-product quotes still display via a legacy-column fallback.
  - **Products** — full CRUD, a featured image, a full reorderable detail-photo
    gallery per product (`components/admin/ProductGalleryManager.tsx`), variants
    (styles/finishes) each with their own photo, live preview.
  - **Categories** — name/description + a cover photo.
  - **Media** — site logo + brand name (`components/admin/LogoManager.tsx`,
    writes to `site_settings`), and the homepage hero carousel — unlimited
    photos (`components/admin/HeroSlideManager.tsx`, `hero_slides` table).
  - **Content** (`/admin/content`) — editable copy for Home, About, Contact,
    Footer, Quote (+ thank-you), and Terms, via `page_content`. One form
    component per page under `components/admin/content/`, built on the shared
    `components/admin/FormKit.tsx` (`Section`/`Field`/`SaveBar`/`inputClass` —
    reuse this for any new admin form). Deliberately bounded scope for a
    non-developer owner: nav labels and button microcopy stay hardcoded, the
    About page's offering icons are fixed per array position (only titles are
    editable), and list lengths (process steps, offerings, terms sections) are
    fixed rather than exposing add/remove-item controls. The four company
    stats shown on both Home and About are one shared `company_stats` row,
    edited once from the Home content form.
- Pages revalidate every 60 seconds (`export const revalidate = 60`) so admin
  edits appear on the live site without a redeploy — add this export to any new
  page that reads Supabase-backed content.

## Environment variables (set in Vercel, never committed)
`NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (or
`SUPABASE_SECRET_KEY`), `ADMIN_USER`, `ADMIN_PASSWORD`, `RESEND_API_KEY`
(pending), `OWNER_NOTIFICATION_EMAIL` (pending)

## Current status (update this section as things change)
- ✅ Live at hhglobalcompany.com, deployed via Vercel, connected to GitHub
- ✅ Supabase connected, catalog + quotes database-backed
- ✅ Admin panel live and password-protected, five tabs (Quotes/Products/
  Categories/Media/Content)
- ✅ Full storefront redesign shipped: new header, hero, About Us + process
  sections, unified product cards, redesigned About page, `/terms` page, and a
  site-wide Content CMS covering all page copy
- ✅ Quote form rebuilt: multiple products per request, reference photo upload,
  color preference, phone field
- ✅ Storefront design audit shipped: one warm-brass accent color introduced
  (used sparingly on primary CTAs), a shared `Button`/`ArrowBadge` component
  system replacing ~20+ duplicated pill buttons, a redesigned quote form (card
  panel, numbered items, restyled inputs, upload icon/preview), and a
  redesigned product detail page (fixed the unframed/"bleeding" main photo,
  added a Details card and related-products section)
- ✅ Product photos split into three explicit admin sections: Featured Image
  (single cover photo), Detail Photos (reorderable gallery), and Style/Finish
  variants (one photo per option) — previously the gallery's first photo
  implicitly served as the cover; now there's a dedicated field for it
- ✅ Detail Photos and Hero Slides admin uploaders support selecting multiple
  photos at once; admin nav bar and product live-preview panel no longer
  overflow horizontally on narrow screens; Hero Slide Manager now shows newly
  added slides immediately instead of requiring a page reload
- ✅ Fixed large phone photos (routinely 5-12MB) failing to upload with a
  generic "Upload failed." message — they were silently hitting the hosting
  platform's ~4.5MB request-size limit before ever reaching our own code. Both
  upload pipelines (admin `ImageUploader`, quote-form `QuoteImageUploader`) now
  resize/compress oversized photos client-side before upload, and show a clear
  message if a file is still rejected as too large
- ⬜ Resend email notifications not yet configured — quotes only visible in
  `/admin/quotes`, no email alert yet
- ⬜ Terms page numbers (MOQ, lead times, thresholds) were entered from a
  client-provided doc — worth a one-time check by the owner that they're
  current, then editable going forward from `/admin/content/terms`
- ⬜ No real color catalog — quote form uses a free-text "preferred color"
  field; upgrading to a real per-style picker is a separate future task
- ⬜ Phase 2 (cart/checkout/payments/tracking) not started

## Workflow rules
- Two workstations (home + office) both clone from the same GitHub repo — always
  `git fetch`/`git pull` **and check `git log origin/main`** at the start of a
  session, and after committing but before pushing. This bit us once: a session
  built a whole feature set without re-checking the remote, another workstation
  had pushed a different, overlapping feature set in the meantime, and
  reconciling the two took significant extra work. Cheap to check, expensive to
  skip.
- User prefers autonomous execution: hand off requirements, get finished results,
  without being stopped for routine confirmations. Still flag before anything
  hard to undo (force-push, deleting branches, `git reset --hard`, deploying).
- For genuinely large/ambiguous asks (new architecture, a new content type, a
  new data model) — plan first (Plan Mode), present the design, then build.
  Several features this project needed real planning before code: the Media CMS,
  the site-wide Content CMS, and the multi-item quote form all went through this.
- Small tweaks (copy changes, adding a product, styling fixes) → handle directly
  in Claude Code
- Larger new features → typically planned/built in a Claude.ai chat first, then
  handed over as a diff or fresh code for Claude Code to commit
- Never commit `.env.local` or any real secret values
