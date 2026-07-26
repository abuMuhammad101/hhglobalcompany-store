import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { getQuoteContent } from "@/lib/content";
import QuoteForm from "@/components/QuoteForm";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Tell us your product, quantity and requirements — we reply with a tailored wholesale quote within 24 hours.",
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; variant?: string }>;
}) {
  const { type, variant } = await searchParams;
  const [catalog, content] = await Promise.all([getCatalog(), getQuoteContent()]);

  let presetCategory: string | undefined;
  let presetProductType: string | undefined;

  if (type) {
    for (const category of catalog) {
      const match = category.products.find((p) => p.type === type);
      if (match) {
        presetCategory = category.slug;
        presetProductType = match.type;
        break;
      }
    }
  }

  return (
    <main className="py-16">
      <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
        <div>
          <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-3 block">
            {content.intro.eyebrow}
          </span>
          <h1 className="text-[clamp(26px,3.6vw,38px)] font-medium tracking-tight mb-4 max-w-[14ch]">
            {content.intro.heading}
          </h1>
          <p className="text-ink-muted max-w-[42ch] text-[15px]">
            {content.intro.body}
          </p>
        </div>

        <QuoteForm
          catalog={catalog}
          presetCategory={presetCategory}
          presetProductType={presetProductType}
          presetVariant={variant}
        />
      </div>
    </main>
  );
}
