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
  const patch: Record<string, unknown> = {};
  if (typeof body.name === "string") patch.name = body.name;
  if (typeof body.isActive === "boolean") patch.is_active = body.isActive;

  const { data, error } = await supabase
    .from("product_types")
    .update(patch)
    .eq("id", id)
    .select("id, category_id, name")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Keep every product's flat `type` display column in sync with a rename, so
  // every existing read path (product cards, quote form, breadcrumbs) that
  // reads products.type directly stays correct without needing the join.
  if (typeof body.name === "string" && data) {
    await supabase.from("products").update({ type: data.name }).eq("product_type_id", id);
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

  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("product_type_id", id);

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { ok: false, error: `This product type still has ${count} product${count === 1 ? "" : "s"} — move or delete them first.` },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("product_types").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  revalidateSite();
  return NextResponse.json({ ok: true });
}
