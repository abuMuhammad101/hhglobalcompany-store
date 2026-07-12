import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quote Request Received",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <main className="py-24 text-center">
      <div className="max-w-[1320px] mx-auto px-6">
        <span className="font-mono-ui text-[11.5px] uppercase tracking-wider text-ink-muted mb-3 block">
          Request Received
        </span>
        <h1 className="text-[clamp(28px,4vw,44px)] mb-4">Thanks — we're on it.</h1>
        <p className="text-ink-muted max-w-[46ch] mx-auto mb-10">
          Your quote request has been received. Our manufacturing team will review it and reply
          to your email within 24 hours with pricing, minimum order quantity and lead time.
        </p>
        <Link href="/" className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-ink text-on-dark font-medium">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
