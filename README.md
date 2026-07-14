# HH Global Company — Phase 1 Wholesale Quote Store

This is the actual codebase for the site. You don't need to understand all of it —
here's what matters:

## The one file you'll edit most (until Supabase is connected): `data/catalog.json`
Every product, category, and style/finish variant lives in this single file.
Once you connect Supabase (see below), you manage all of this from `/admin/products`
instead — the file becomes a fallback that keeps the site working if Supabase
is ever disconnected.

## Admin panel (`/admin`)
Password-protected (set `ADMIN_USER` / `ADMIN_PASSWORD` in your environment variables).
Three sections:
- **Quotes** — every incoming quote request, with a status pipeline (New → Contacted →
  Quoted → Won/Lost), filterable, with per-request notes that autosave.
- **Products** — add, edit, delete products, manage a full photo gallery per product
  (upload, reorder, remove — first photo is the cover shown everywhere else), and
  manage its styles/finishes (each with its own photo too), with a live preview of
  exactly what customers see.
- **Categories** — edit the Garments / Leather Products names and descriptions.

Requires Supabase to be connected (see `data/schema.sql` — run it once in Supabase's
SQL Editor to create every table and pre-fill it with your current catalog).

### Product photos
Run `data/schema-images.sql` once in Supabase's SQL Editor (same place you ran
`data/schema.sql`) to enable photo uploads — it adds the photo column to products
and creates the storage bucket that uploaded photos are kept in.

### Product photo galleries
Run `data/schema-product-gallery.sql` once too (same place) — it upgrades products
from one cover photo to a full gallery (multiple photos, reorderable), automatically
carrying over each product's existing photo as the first gallery photo. After that,
`/admin/products` lets you add as many photos as you want per product, and customers
see a real gallery on the product page — thumbnails, prev/next arrows, and click to
zoom.

## Pages (in `app/`)
- `page.tsx` — homepage
- `garments/page.tsx`, `leather/page.tsx` — category pages
- `product/[slug]/page.tsx` — one page per product, with a clickable style/finish
  switcher (like color swatches on a retail site) that swaps the photo shown
- `quote/page.tsx` — the quote request form
- `admin/` — the panel described above
- `api/quote/route.ts` — backend logic for the public quote form
- `api/admin/` — backend logic for the admin panel

## Environment variables (`.env.example`)
Copy `.env.example` to `.env.local` for local testing. In production these are
set inside Vercel's dashboard (Settings → Environment Variables), never
committed to GitHub.

## Running it locally (optional — only if you want to preview before deploying)
```
npm install
npm run dev
```
Then open http://localhost:3000

## Deploying
See the step-by-step deployment guide provided separately — it covers pushing
to GitHub, connecting Vercel, and pointing your domain at it.
