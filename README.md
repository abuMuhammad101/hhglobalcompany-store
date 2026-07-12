# HH Global Company — Phase 1 Wholesale Quote Store

This is the actual codebase for the site. You don't need to understand all of it —
here's what matters:

## The one file you'll edit most: `data/catalog.json`
Every product, category, and style/finish variant lives in this single file.
Add a product here and it automatically appears on the homepage, its category
page, gets its own product page, and becomes selectable in the quote form —
no other file needs to change.

## Pages (in `app/`)
- `page.tsx` — homepage
- `garments/page.tsx`, `leather/page.tsx` — category pages
- `product/[slug]/page.tsx` — one page per product, auto-generated from catalog.json
- `quote/page.tsx` — the quote request form
- `admin/page.tsx` — password-protected list of incoming quote requests
- `api/quote/route.ts` — the backend logic that runs when someone submits the form

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
