import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { revalidateSite } from "@/lib/revalidate";

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
  }

  const body = await req.json();
  const { categoryId, name, slug, productTypeId, material, description } = body;

  if (!categoryId || !name || !slug || !productTypeId) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  const { data: productType, error: productTypeError } = await supabase
    .from("product_types")
    .select("id, name, category_id")
    .eq("id", productTypeId)
    .single();

  if (productTypeError || !productType || productType.category_id !== categoryId) {
    return NextResponse.json(
      { ok: false, error: "Selected product type doesn't belong to this category." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      category_id: categoryId,
      name,
      slug,
      type: productType.name,
      product_type_id: productType.id,
      material: material || null,
      description: description || null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  revalidateSite();
  return NextResponse.json({ ok: true, id: data.id });
}
