import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
  }

  const body = await req.json();
  const { categoryId, name, slug, type, material, description } = body;

  if (!categoryId || !name || !slug || !type) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      category_id: categoryId,
      name,
      slug,
      type,
      material: material || null,
      description: description || null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
