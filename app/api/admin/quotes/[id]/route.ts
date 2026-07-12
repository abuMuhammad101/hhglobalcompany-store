import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

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
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.status === "string") patch.status = body.status;
  if (typeof body.notes === "string") patch.notes = body.notes;

  const { error } = await supabase.from("quote_requests").update(patch).eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
