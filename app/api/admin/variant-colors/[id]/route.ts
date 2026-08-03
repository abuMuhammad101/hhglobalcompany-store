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
  if ("imageUrl" in body) patch.image_url = body.imageUrl;

  const { error } = await supabase.from("variant_colors").update(patch).eq("id", id);
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

  const { error } = await supabase.from("variant_colors").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  revalidateSite();
  return NextResponse.json({ ok: true });
}
