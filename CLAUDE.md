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
- Fonts: Archivo (display/UI), Space Mono (technical readouts — status bar, clock,
  coordinates)
- Monochrome palette (warm white / near-black ink) + one deep near-black-green
  panel for the Leather catalogue section
- Signature elements: asterisk mark above the hero headline, pill buttons paired
  with a circular arrow icon, sharp corners everywhere except those pills/circles,
  a hairline divider with a bold "notch" under the hero, bullet-list variant
  breakdowns
- Live GMT+5 clock and "Status: In Production" readout in the header (Karachi-based)
- Design tokens live in `app/globals.css` as CSS variables — always reuse these,
  never introduce ad hoc colors

## Tech stack
- Next.js 15 (App Router), Tailwind CSS v4
- Supabase (Postgres) for products/categories/variants/quotes — with automatic
  fallback to `data/catalog.json` if Supabase isn't connected, so the site never
  breaks
- Resend for email notifications (not yet configured — pending)
- Hosted on Vercel, auto-deploys on every push to `main`
- GitHub repo: https://github.com/abuMuhammad101/hhglobalcompany-store

## Architecture
- `data/catalog.json` — fallback product data (objects, not strings, for variants)
- `data/schema.sql` — one-time Supabase setup script (tables + seed data)
- `lib/catalog.ts` — async data layer, tries Supabase first, falls back to JSON
- `lib/supabase.ts` — Supabase client, reads `SUPABASE_URL` +
  `SUPABASE_SERVICE_KEY` (falls back to `SUPABASE_SECRET_KEY`, which is what
  Vercel's official Supabase integration names it)
- `components/ProductView.tsx` — the clickable variant swatch widget (client
  component), reused identically in both the public product page and the admin
  live preview
- `components/QuoteForm.tsx` — cascading Category → Product Type → Style/Finish
  quote form, takes catalog as a prop (not a static import)
- `app/admin/` — password-protected (HTTP Basic Auth via `proxy.ts`, using
  `ADMIN_USER` / `ADMIN_PASSWORD` env vars), three tabs:
  - **Quotes** — CRM with status pipeline (new/contacted/quoted/won/lost),
    filters, autosaving notes
  - **Products** — full CRUD, variants managed per-product with live preview
  - **Categories** — edit name/description
- Pages revalidate every 60 seconds (`export const revalidate = 60`) so admin
  edits appear on the live site without a redeploy

## Environment variables (set in Vercel, never committed)
`NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (or
`SUPABASE_SECRET_KEY`), `ADMIN_USER`, `ADMIN_PASSWORD`, `RESEND_API_KEY`
(pending), `OWNER_NOTIFICATION_EMAIL` (pending)

## Current status (update this section as things change)
- ✅ Live at hhglobalcompany.com, deployed via Vercel, connected to GitHub
- ✅ Supabase connected, catalog + quotes database-backed
- ✅ Admin panel live and password-protected
- ⬜ Resend email notifications not yet configured — quotes only visible in
  `/admin/quotes`, no email alert yet
- ⬜ Phase 2 (cart/checkout/payments/tracking) not started

## Workflow rules
- Two workstations (home + office) both clone from the same GitHub repo — always
  `git pull` at the start of a session and `git push` at the end
- Small tweaks (copy changes, adding a product, styling fixes) → handle directly
  in Claude Code
- Larger new features → typically planned/built in a Claude.ai chat first, then
  handed over as a diff or fresh code for Claude Code to commit
- Never commit `.env.local` or any real secret values
