import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { revalidateSite } from "@/lib/revalidate";

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
  }

  const body = await req.json();
  const { categoryId, name } = body;
  if (!categoryId || !name) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  const { count } = await supabase
    .from("colors")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);

  const { data, error } = await supabase
    .from("colors")
    .insert({ category_id: categoryId, name, sort_order: count ?? 0 })
    .select("id, name, sort_order, is_active")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  revalidateSite();
  return NextResponse.json({ ok: true, color: data });
}

// Reorders colors within one category: body is { order: string[] } -- an array
// of color ids in the desired sort_order.
export async function PATCH(req: NextRequest) {
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
    order.map((id, index) => supabase.from("colors").update({ sort_order: index }).eq("id", id))
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return NextResponse.json({ ok: false, error: failed.error.message }, { status: 500 });
  }
  revalidateSite();
  return NextResponse.json({ ok: true });
}
