import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fullName, email, phone, category, productType, variant, quantity, details } = body;

  // ---- Basic validation ----
  if (!fullName || !email || !category || !productType || !quantity) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields." },
      { status: 400 }
    );
  }

  // ---- 1. Save to database (if the owner has connected Supabase) ----
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from("quote_requests").insert({
      full_name: fullName,
      email,
      phone: phone || null,
      category,
      product_type: productType,
      variant: variant || null,
      quantity: Number(quantity),
      details: details || null,
      status: "new",
    });
  }

  // ---- 2. Email the store owner (if RESEND_API_KEY is configured) ----
  const resendKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL;

  if (resendKey && ownerEmail) {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: "HH Global Company Quotes <quotes@yourdomain.com>", // update after domain is verified in Resend
      to: ownerEmail,
      replyTo: email,
      subject: `New quote request — ${productType} x${quantity}`,
      html: `
        <h2>New quote request</h2>
        <p><b>Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "—"}</p>
        <p><b>Category:</b> ${category}</p>
        <p><b>Product type:</b> ${productType}</p>
        <p><b>Style/finish:</b> ${variant || "—"}</p>
        <p><b>Quantity:</b> ${quantity}</p>
        <p><b>Details:</b><br/>${(details || "—").replace(/\n/g, "<br/>")}</p>
      `,
    });
  } else {
    // No email configured yet — log so it's visible during local development.
    console.log("New quote request (email not configured):", body);
  }

  return NextResponse.json({ ok: true });
}
