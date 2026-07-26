-- Run this once, in Supabase → SQL Editor → New Query → paste all of this → Run.
-- Upgrades the quote form from one product per submission to multiple products
-- (line items) per submission, each with its own category/type/style, a
-- preferred-color note, quantity, an optional reference photo, and notes.
-- Safe to run more than once — every statement is idempotent, and your
-- existing quote requests are automatically carried over as their own first
-- item, so nothing is lost and the admin panel keeps showing them correctly.

create table if not exists quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id bigint references quote_requests(id) on delete cascade,
  category text,
  product_type text,
  variant text,
  color_preference text,
  quantity int,
  image_url text,
  item_notes text,
  sort_order int default 0
);

insert into quote_items (quote_id, category, product_type, variant, quantity, item_notes, sort_order)
select id, category, product_type, variant, quantity, details, 0
from quote_requests
where not exists (
  select 1 from quote_items qi where qi.quote_id = quote_requests.id
);

-- A public bucket for customer-uploaded reference photos on the quote form.
-- Kept separate from the admin "product-images" bucket since uploads here
-- are unauthenticated (anyone submitting the quote form can add a photo).
insert into storage.buckets (id, name, public)
values ('quote-uploads', 'quote-uploads', true)
on conflict (id) do update set public = true;
