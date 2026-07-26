import type { Metadata } from "next";
import { getContactContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the HH Global Company team for general enquiries.",
};

export default async function ContactPage() {
  const content = await getContactContent();

  return (
    <main className="py-16">
      <div className="max-w-[1320px] mx-auto px-6">
        <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-3 block">{content.eyebrow}</span>
        <h1 className="text-[clamp(28px,4vw,44px)] font-medium tracking-tight mb-6">{content.heading}</h1>
        <div className="max-w-[50ch] text-ink-muted text-[15px] space-y-2">
          <p>For bulk pricing, use the <a href="/quote" className="border-b border-ink text-ink">quote request form</a> — it&apos;s the fastest path to a reply.</p>
          <p>For everything else:</p>
          <p className="text-ink">Email: {content.email}</p>
          <p className="text-ink">Phone: {content.phone}</p>
          <p className="text-ink">{content.address}</p>
        </div>
      </div>
    </main>
  );
}
