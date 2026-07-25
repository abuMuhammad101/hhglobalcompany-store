-- Run this once, in Supabase → SQL Editor → New Query → paste all of this → Run.
-- Adds the "Media" tab to the admin panel: a site-wide logo and a homepage
-- hero photo carousel. Safe to run more than once — every statement here is
-- idempotent. Uses the same `product-images` storage bucket created by
-- `data/schema-images.sql`, so run that one first if you haven't already.

create table if not exists site_settings (
  key text primary key,
  value text
);

create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  label text,
  sort_order int default 0
);
