import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { revalidateSite } from "@/lib/revalidate";

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
  }

  const body = await req.json();
  const { label, imageUrl } = body;
  if (!imageUrl) {
    return NextResponse.json({ ok: false, error: "Image is required." }, { status: 400 });
  }

  const { count } = await supabase
    .from("hero_slides")
    .select("id", { count: "exact", head: true });

  const { error } = await supabase.from("hero_slides").insert({
    image_url: imageUrl,
    label: label || null,
    sort_order: count ?? 0,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  revalidateSite();
  return NextResponse.json({ ok: true });
}

// Reorders slides: body is { order: string[] } — an array of slide ids in the
// desired sort_order.
export async function PATCH(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
  }

  const body = await req.json();
  const order: string[] = Array.isArray(body.order) ? body.order : [];
  if (order.length === 0) {
    return NextResponse.json({ ok: false, error: "A slide order list is required." }, { status: 400 });
  }

  const results = await Promise.all(
    order.map((id, index) => supabase.from("hero_slides").update({ sort_order: index }).eq("id", id))
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return NextResponse.json({ ok: false, error: failed.error.message }, { status: 500 });
  }
  revalidateSite();
  return NextResponse.json({ ok: true });
}
