import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
  }

  const body = await req.json();
  if (!("logoUrl" in body)) {
    return NextResponse.json({ ok: false, error: "Missing logoUrl." }, { status: 400 });
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "logo_url", value: body.logoUrl }, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
