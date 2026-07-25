import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

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
  return NextResponse.json({ ok: true });
}
