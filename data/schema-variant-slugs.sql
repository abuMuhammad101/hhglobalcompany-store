-- Adds a URL-safe slug to each Style/Finish variant so it can have its own
-- page (/product/[slug]/[variant]) instead of only ever being a client-side
-- toggle on the main product page. Variants previously had no unique,
-- URL-friendly identifier — only a uuid id and a free-text name (not unique
-- per product). Auto-generated once per variant (from its name, deduped per
-- product) and never regenerated on rename, so a shared variant link never
-- breaks later. Additive only; safe to re-run.

alter table product_variants add column if not exists slug text;

with base as (
  select
    id,
    regexp_replace(lower(trim(name)), '[^a-z0-9]+', '-', 'g') as base_slug,
    row_number() over (
      partition by product_id, regexp_replace(lower(trim(name)), '[^a-z0-9]+', '-', 'g')
      order by sort_order, id
    ) as rn
  from product_variants
  where slug is null
)
update product_variants pv
set slug = trim(both '-' from base.base_slug)
  || case when base.rn = 1 then '' else '-' || base.rn::text end
from base
where pv.id = base.id;

alter table product_variants alter column slug set not null;
create unique index if not exists product_variants_product_id_slug_idx
  on product_variants(product_id, slug);
