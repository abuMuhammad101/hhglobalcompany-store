import type { Metadata } from "next";
import Link from "next/link";
import { getQuoteContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Quote Request Received",
  robots: { index: false },
};

export default async function ThankYouPage() {
  const content = await getQuoteContent();

  return (
    <main className="py-24 text-center">
      <div className="max-w-[1320px] mx-auto px-6">
        <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-3 block">
          {content.thankYou.eyebrow}
        </span>
        <h1 className="text-[clamp(28px,4vw,44px)] font-medium tracking-tight mb-4">{content.thankYou.heading}</h1>
        <p className="text-ink-muted max-w-[46ch] mx-auto mb-10">
          {content.thankYou.body}
        </p>
        <Link href="/" className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-ink text-on-dark font-medium">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
