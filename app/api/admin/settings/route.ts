import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const KEY_MAP: Record<string, string> = {
  logoUrl: "logo_url",
  brandName: "brand_name",
};

export async function PATCH(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
  }

  const body = await req.json();
  const rows = Object.entries(KEY_MAP)
    .filter(([bodyKey]) => bodyKey in body)
    .map(([bodyKey, dbKey]) => ({ key: dbKey, value: body[bodyKey] }));

  if (rows.length === 0) {
    return NextResponse.json({ ok: false, error: "No recognized settings provided." }, { status: 400 });
  }

  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
