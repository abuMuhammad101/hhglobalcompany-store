import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Public, unauthenticated endpoint — visitors attach a reference photo to a
// quote request before an account or admin session exists. Writes to the
// "quote-uploads" bucket, kept separate from admin-curated product photos.
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not connected." }, { status: 503 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: "Please upload a JPG, PNG, WEBP or GIF image." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Image must be smaller than 4MB." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("quote-uploads")
    .upload(path, file, { contentType: file.type });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("quote-uploads").getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}
