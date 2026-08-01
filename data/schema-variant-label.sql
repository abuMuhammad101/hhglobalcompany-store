-- Run this once, in Supabase → SQL Editor → New Query → paste all of this → Run.
-- Lets each product choose what its style/finish options should be called —
-- e.g. "Color" for a garment like a jacket (Black/Grey/Brown/Green), vs.
-- "Style / Finish" for a leather good (Plain/Mild/Plated). Defaults to null,
-- which the app displays as "Style / Finish". Safe to run more than once.

alter table products add column if not exists variant_label text;
