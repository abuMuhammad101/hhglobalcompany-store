import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { PAGE_KEYS } from "@/lib/content";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;
  if (!PAGE_KEYS.includes(page as (typeof PAGE_KEYS)[number])) {
    return NextResponse.json({ ok: false, error: "Unknown content group." }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
  }

  const content = await req.json();

  const { error } = await supabase
    .from("page_content")
    .upsert({ page_key: page, content, updated_at: new Date().toISOString() }, { onConflict: "page_key" });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
