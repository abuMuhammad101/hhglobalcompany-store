import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

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

  const { error } = await supabase.from("product_variants").insert({
    product_id: id,
    name,
    image_url: imageUrl || null,
    sort_order: count ?? 0,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
