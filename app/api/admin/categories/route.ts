import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { revalidateSite } from "@/lib/revalidate";

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
  }

  const body = await req.json();
  const { slug, name, catalogueNumber } = body;
  if (!slug || !name || !catalogueNumber) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  const { count } = await supabase.from("categories").select("id", { count: "exact", head: true });

  const { data, error } = await supabase
    .from("categories")
    .insert({
      slug,
      name,
      catalogue_number: catalogueNumber,
      sort_order: count ?? 0,
    })
    .select("id, slug, name, catalogue_number, description, image_url, sort_order, is_active")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  revalidateSite();
  return NextResponse.json({ ok: true, category: data });
}

// Reorders categories: body is { order: string[] } -- an array of category ids in
// the desired sort_order.
export async function PATCH(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
  }

  const body = await req.json();
  const order: string[] = Array.isArray(body.order) ? body.order : [];
  if (order.length === 0) {
    return NextResponse.json({ ok: false, error: "A category order list is required." }, { status: 400 });
  }

  const results = await Promise.all(
    order.map((id, index) => supabase.from("categories").update({ sort_order: index }).eq("id", id))
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return NextResponse.json({ ok: false, error: failed.error.message }, { status: 500 });
  }
  revalidateSite();
  return NextResponse.json({ ok: true });
}
