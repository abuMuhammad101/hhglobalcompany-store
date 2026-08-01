import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { revalidateSite } from "@/lib/revalidate";

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
  const { categoryId, name, slug, productTypeId, material, description } = body;

  const patch: Record<string, unknown> = {
    category_id: categoryId,
    name,
    slug,
    material: material || null,
    description: description || null,
  };

  if (productTypeId) {
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

    patch.product_type_id = productType.id;
    patch.type = productType.name;
  }

  const { error } = await supabase.from("products").update(patch).eq("id", id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  revalidateSite();
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  revalidateSite();
  return NextResponse.json({ ok: true });
}
