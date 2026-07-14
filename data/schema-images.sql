-- Run this once, in Supabase → SQL Editor → New Query → paste all of this → Run.
-- Adds photo support to the Products and Categories admin panels. Safe to run
-- even if you're not sure whether it's been applied before, or if you've
-- already run an earlier version of this file — every statement here can be
-- run more than once without error or duplicating anything.

-- A product's own cover photo (used on the shop pages, and on the product
-- page itself for products that don't have style/finish options).
alter table products add column if not exists image_url text;

-- A category's own cover photo (used on the homepage category cards).
alter table categories add column if not exists image_url text;

-- A public storage bucket to hold every uploaded photo (product photos,
-- style/finish photos, and category photos all live here). "Public" just
-- means anyone with the link can view the photo — nobody can upload or
-- delete without your admin password, since all uploads go through the
-- password-protected admin panel.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;
