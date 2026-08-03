import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { revalidateSite } from "@/lib/revalidate";

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
  const { colorId, imageUrl } = body;
  if (!colorId || !imageUrl) {
    return NextResponse.json({ ok: false, error: "A color and photo are both required." }, { status: 400 });
  }

  const { count } = await supabase
    .from("variant_colors")
    .select("id", { count: "exact", head: true })
    .eq("variant_id", id);

  const { data, error } = await supabase
    .from("variant_colors")
    .insert({ variant_id: id, color_id: colorId, image_url: imageUrl, sort_order: count ?? 0 })
    .select("id, image_url, sort_order, colors(id, name)")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  revalidateSite();
  return NextResponse.json({ ok: true, variantColor: data });
}

// Reorders colors within one variant: body is { order: string[] } -- an array
// of variant_color ids in the desired sort_order.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
  }

  const body = await req.json();
  const order: string[] = Array.isArray(body.order) ? body.order : [];
  if (order.length === 0) {
    return NextResponse.json({ ok: false, error: "A color order list is required." }, { status: 400 });
  }

  const results = await Promise.all(
    order.map((vcId, index) =>
      supabase.from("variant_colors").update({ sort_order: index }).eq("id", vcId).eq("variant_id", id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return NextResponse.json({ ok: false, error: failed.error.message }, { status: 500 });
  }
  revalidateSite();
  return NextResponse.json({ ok: true });
}
