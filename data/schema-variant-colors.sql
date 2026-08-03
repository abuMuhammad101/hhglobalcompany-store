-- Adds a second variant layer under the existing Style/Finish variant:
-- Product -> Variant (e.g. Small/Regular/Large) -> Color (e.g. Black/Brown/Blue),
-- each color with its own photo. Colors are a category-managed vocabulary
-- (mirrors product_types) since they're genuinely shared across a category's
-- products, while the top-level Variant stays product-scoped free text as it
-- is today. Additive only; existing single-level variants keep working
-- unchanged via their own image_url as a fallback. Safe to re-run.

create table if not exists colors (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  unique (category_id, name)
);

create table if not exists variant_colors (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid references product_variants(id) on delete cascade,
  color_id uuid references colors(id),
  image_url text not null,
  sort_order int not null default 0,
  unique (variant_id, color_id)
);
