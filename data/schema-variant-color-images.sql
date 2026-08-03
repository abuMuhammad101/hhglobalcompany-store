-- Lets a Style/Finish option's Color (e.g. "Small" -> "Brown") carry more than
-- one photo, the same way a product's Featured Image can have additional
-- Detail Photos alongside it. `variant_colors.image_url` stays the required
-- cover photo set when a color is first added; this table holds any extra
-- photos for that same color. Additive only; existing colors keep working
-- unchanged (a single cover photo, no extras) until more are added.

create table if not exists variant_color_images (
  id uuid primary key default gen_random_uuid(),
  variant_color_id uuid references variant_colors(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0
);
