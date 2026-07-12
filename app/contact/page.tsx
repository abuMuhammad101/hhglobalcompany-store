import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the HH Global Company team for general enquiries.",
};

export default function ContactPage() {
  return (
    <main className="py-16">
      <div className="max-w-[1320px] mx-auto px-6">
        <span className="font-mono-ui text-[11.5px] uppercase tracking-wider text-ink-muted mb-3 block">Contact</span>
        <h1 className="text-[clamp(28px,4vw,44px)] mb-6">Get in touch</h1>
        <div className="max-w-[50ch] text-ink-muted text-[15px] space-y-2">
          <p>For bulk pricing, use the <a href="/quote" className="border-b border-ink text-ink">quote request form</a> — it's the fastest path to a reply.</p>
          <p>For everything else:</p>
          <p className="text-ink">Email: hello@hhglobalcompany.com</p>
          <p className="text-ink">Phone: +92 300 0000000</p>
          <p className="text-ink">Karachi, Pakistan</p>
        </div>
      </div>
    </main>
  );
}
