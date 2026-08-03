import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { revalidateSite } from "@/lib/revalidate";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
  }

  const body = await req.json();
  const { name, imageUrl } = body;
  if (!name) {
    return NextResponse.json({ ok: false, error: "Variant name is required." }, { status: 400 });
  }

  const { count } = await supabase
    .from("product_variants")
    .select("id", { count: "exact", head: true })
    .eq("product_id", id);

  // A variant's slug becomes its own page's URL segment (/product/[slug]/[variant]),
  // generated once here and never touched again on rename, so a shared link never
  // breaks later. Deduped against this product's existing variant slugs only —
  // slugs aren't unique across the whole site, just within one product.
  const { data: siblings } = await supabase
    .from("product_variants")
    .select("slug")
    .eq("product_id", id);
  const existingSlugs = new Set((siblings ?? []).map((s) => s.slug));
  const baseSlug = slugify(name) || "option";
  let slug = baseSlug;
  let n = 2;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${n}`;
    n += 1;
  }

  const { error } = await supabase.from("product_variants").insert({
    product_id: id,
    name,
    slug,
    image_url: imageUrl || null,
    sort_order: count ?? 0,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  revalidateSite();
  return NextResponse.json({ ok: true });
}
