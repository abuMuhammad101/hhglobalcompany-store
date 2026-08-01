-- Adds category enable/disable control and promotes "product type" (e.g. "T-Shirt",
-- "Long Wallets") from a free-text tag into a managed hierarchy level with its own
-- admin CRUD, sort order, and active/inactive toggle -- Category -> Product Type ->
-- Product -> Variant. Additive only; existing products.type stays in place and in
-- sync (see backfill below and the admin write path), so nothing that reads it
-- needs to change. Safe to re-run.

alter table categories add column if not exists is_active boolean not null default true;

create table if not exists product_types (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  unique (category_id, name)
);

alter table products add column if not exists product_type_id uuid references product_types(id);

-- Backfill: one product_type row per distinct (category_id, type) pair already in
-- use, then point every existing product at it.
insert into product_types (category_id, name, sort_order)
select distinct category_id, type, 0
from products
where type is not null
on conflict (category_id, name) do nothing;

update products
set product_type_id = product_types.id
from product_types
where products.category_id = product_types.category_id
  and products.type = product_types.name
  and products.product_type_id is null;
