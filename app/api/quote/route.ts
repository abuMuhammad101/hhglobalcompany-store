import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";

type QuoteItemInput = {
  category: string;
  productType: string;
  variant?: string;
  colorPreference?: string;
  quantity: number;
  imageUrl?: string | null;
  itemNotes?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fullName, email, phone, notes, items } = body as {
    fullName?: string;
    email?: string;
    phone?: string;
    notes?: string;
    items?: QuoteItemInput[];
  };

  // ---- Basic validation ----
  const validItems = Array.isArray(items)
    ? items.filter((it) => it && it.category && it.productType && Number(it.quantity) > 0)
    : [];

  if (!fullName || !email || validItems.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields." },
      { status: 400 }
    );
  }

  const firstItem = validItems[0];

  // ---- 1. Save to database (if the owner has connected Supabase) ----
  const supabase = getSupabase();
  if (supabase) {
    const { data: quote } = await supabase
      .from("quote_requests")
      .insert({
        full_name: fullName,
        email,
        phone: phone || null,
        category: firstItem.category,
        product_type: firstItem.productType,
        variant: firstItem.variant || null,
        quantity: Number(firstItem.quantity),
        details: notes || null,
        status: "new",
      })
      .select("id")
      .single();

    if (quote) {
      await supabase.from("quote_items").insert(
        validItems.map((it, i) => ({
          quote_id: quote.id,
          category: it.category,
          product_type: it.productType,
          variant: it.variant || null,
          color_preference: it.colorPreference || null,
          quantity: Number(it.quantity),
          image_url: it.imageUrl || null,
          item_notes: it.itemNotes || null,
          sort_order: i,
        }))
      );
    }
  }

  // ---- 2. Email the store owner (if RESEND_API_KEY is configured) ----
  const resendKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL;

  if (resendKey && ownerEmail) {
    const resend = new Resend(resendKey);
    const itemsHtml = validItems
      .map(
        (it, i) => `
        <div style="margin:16px 0;padding:12px;border:1px solid #ddd;">
          <p><b>Product ${i + 1}:</b> ${escapeHtml(it.category)} / ${escapeHtml(it.productType)}</p>
          <p><b>Style/finish:</b> ${it.variant ? escapeHtml(it.variant) : "—"}</p>
          <p><b>Preferred color(s):</b> ${it.colorPreference ? escapeHtml(it.colorPreference) : "—"}</p>
          <p><b>Quantity:</b> ${it.quantity}</p>
          ${it.imageUrl ? `<p><b>Reference photo:</b> <a href="${it.imageUrl}">${it.imageUrl}</a></p>` : ""}
          <p><b>Notes:</b> ${it.itemNotes ? escapeHtml(it.itemNotes) : "—"}</p>
        </div>`
      )
      .join("");

    await resend.emails.send({
      from: "HH Global Company Quotes <quotes@yourdomain.com>", // update after domain is verified in Resend
      to: ownerEmail,
      replyTo: email,
      subject: `New quote request — ${validItems.length} product${validItems.length > 1 ? "s" : ""}`,
      html: `
        <h2>New quote request</h2>
        <p><b>Name:</b> ${escapeHtml(fullName)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Phone:</b> ${phone ? escapeHtml(phone) : "—"}</p>
        ${itemsHtml}
        <p><b>Anything else:</b><br/>${notes ? escapeHtml(notes).replace(/\n/g, "<br/>") : "—"}</p>
      `,
    });
  } else {
    // No email configured yet — log so it's visible during local development.
    console.log("New quote request (email not configured):", body);
  }

  return NextResponse.json({ ok: true });
}
