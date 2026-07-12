-- Run this once, in Supabase → SQL Editor → New Query → paste all of this → Run.
-- It creates every table the site needs and pre-fills it with your current catalog,
-- so nothing changes on the live site the moment you connect Supabase.

create extension if not exists pgcrypto;

-- ========== CATALOG ==========

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  catalogue_number text not null,
  description text,
  sort_order int default 0
);

create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  slug text unique not null,
  name text not null,
  type text not null,
  material text,
  description text,
  sort_order int default 0
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  name text not null,
  image_url text,
  sort_order int default 0
);

-- ========== QUOTES CRM ==========

create table quote_requests (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  full_name text not null,
  email text not null,
  phone text,
  category text,
  product_type text,
  variant text,
  quantity int,
  details text,
  status text default 'new', -- new | contacted | quoted | won | lost
  notes text
);

-- ========== SEED DATA (matches the site's current catalog) ==========

insert into categories (slug, name, catalogue_number, description, sort_order) values
  ('garments', 'Garments', '01', 'Everyday essentials in your choice of fabric, weight and print.', 1),
  ('leather', 'Leather Products', '02', 'Full-grain leather goods, hand-finished with plain, mild or plated styles.', 2);

insert into products (category_id, slug, name, type, material, description, sort_order)
select id, 'classic-heavyweight-tee', 'Classic Heavyweight Tee', 'T-Shirt', 'Jersey',
  'A heavyweight cotton jersey tee built for print and embroidery work. Available in bulk with custom fabric weight and color.', 1
from categories where slug = 'garments';

insert into products (category_id, slug, name, type, material, description, sort_order)
select id, 'core-sweat-shirt', 'Core Sweat Shirt', 'Sweat Shirt', 'Rib',
  'Ribbed crewneck sweatshirt, mid-weight fleece, suited for both blank and branded bulk orders.', 2
from categories where slug = 'garments';

insert into products (category_id, slug, name, type, material, description, sort_order)
select id, 'tapered-sweat-pants', 'Tapered Sweat Pants', 'Sweat Pants', 'Knit',
  'Tapered-fit knit sweatpants with reinforced waistband, built for comfort and durability at scale.', 3
from categories where slug = 'garments';

insert into products (category_id, slug, name, type, material, description, sort_order)
select id, 'boxy-pullover-hoodie', 'Boxy Pullover Hoodie', 'Hoodies', 'Fleece',
  'Boxy-fit pullover hoodie in brushed fleece, available in a range of weights and finishes.', 4
from categories where slug = 'garments';

insert into products (category_id, slug, name, type, material, description, sort_order)
select id, 'long-wallet', 'Long Wallet', 'Long Wallets', 'Full-grain leather',
  'Full-length bifold wallet with multiple card slots and a bill compartment.', 1
from categories where slug = 'leather';

insert into products (category_id, slug, name, type, material, description, sort_order)
select id, 'ladies-clutch', 'Ladies'' Clutch', 'Ladies Clutches', 'Full-grain leather',
  'Hand-finished leather clutch, available in three carry sizes.', 2
from categories where slug = 'leather';

insert into products (category_id, slug, name, type, material, description, sort_order)
select id, 'card-holder', 'Card Holder', 'Card Holder', 'Full-grain leather',
  'Slim leather card holder, available with plated hardware or plain finish.', 3
from categories where slug = 'leather';

insert into products (category_id, slug, name, type, material, description, sort_order)
select id, 'mens-wallet', 'Men''s Wallet', 'Mens Wallet', 'Full-grain leather',
  'Our most requested wallet line, available in five distinct styles and finishes.', 4
from categories where slug = 'leather';

insert into products (category_id, slug, name, type, material, description, sort_order)
select id, 'mens-belt', 'Men''s Belt', 'Mens Belt', 'Full-grain leather',
  'Full-grain leather belt with a mild finish and reinforced stitching.', 5
from categories where slug = 'leather';

-- Variants (styles/finishes) for the leather line
insert into product_variants (product_id, name, sort_order)
select id, v.name, v.ord from products, (values
  ('Plain', 1), ('Mild', 2), ('Unisex Mild', 3), ('Plated', 4)
) as v(name, ord)
where products.slug = 'long-wallet';

insert into product_variants (product_id, name, sort_order)
select id, v.name, v.ord from products, (values
  ('Small', 1), ('Regular', 2), ('Zipper', 3)
) as v(name, ord)
where products.slug = 'ladies-clutch';

insert into product_variants (product_id, name, sort_order)
select id, v.name, v.ord from products, (values
  ('Plated', 1), ('Mild', 2), ('Plain', 3)
) as v(name, ord)
where products.slug = 'card-holder';

insert into product_variants (product_id, name, sort_order)
select id, v.name, v.ord from products, (values
  ('3" Dollarsize plain', 1), ('4" Center Card', 2), ('Plated', 3), ('Texture', 4), ('Flap Mild', 5)
) as v(name, ord)
where products.slug = 'mens-wallet';

insert into product_variants (product_id, name, sort_order)
select id, 'Mild', 1
from products where products.slug = 'mens-belt';
