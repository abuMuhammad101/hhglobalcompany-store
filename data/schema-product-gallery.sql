-- Run this once, in Supabase → SQL Editor → New Query → paste all of this → Run.
-- Upgrades products from a single cover photo to a full photo gallery (multiple
-- photos per product, reorderable, shown to customers as a proper gallery with
-- thumbnails). Safe to run more than once — every statement is idempotent, and
-- your existing product photos are automatically carried over as the first
-- gallery photo, so nothing is lost.

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  image_url text not null,
  sort_order int default 0
);

-- Carry over each product's existing single cover photo as the first photo
-- in its new gallery (only runs for products that have a photo and don't
-- already have a gallery entry, so re-running this is harmless).
insert into product_images (product_id, image_url, sort_order)
select id, image_url, 0
from products
where image_url is not null
  and not exists (
    select 1 from product_images pi where pi.product_id = products.id
  );
