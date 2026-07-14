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
  const { imageUrl } = body;
  if (!imageUrl) {
    return NextResponse.json({ ok: false, error: "Image URL is required." }, { status: 400 });
  }

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", id);

  const { data, error } = await supabase
    .from("product_images")
    .insert({ product_id: id, image_url: imageUrl, sort_order: count ?? 0 })
    .select("id, image_url, sort_order")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, image: data });
}

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
    return NextResponse.json({ ok: false, error: "An image order list is required." }, { status: 400 });
  }

  const results = await Promise.all(
    order.map((imageId, index) =>
      supabase.from("product_images").update({ sort_order: index }).eq("id", imageId).eq("product_id", id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return NextResponse.json({ ok: false, error: failed.error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
