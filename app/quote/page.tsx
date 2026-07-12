import type { Metadata } from "next";
import { catalog } from "@/lib/catalog";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Tell us your product, quantity and requirements — we reply with a tailored wholesale quote within 24 hours.",
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;

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
          <span className="font-mono-ui text-[11.5px] uppercase tracking-wider text-ink-muted mb-3 block">
            Consultation
          </span>
          <h1 className="text-[clamp(26px,3.6vw,38px)] mb-4 max-w-[14ch]">
            Ready to define your requirements?
          </h1>
          <p className="text-ink-muted max-w-[42ch] text-[15px]">
            Every project begins with a conversation. Detail your necessity below and our
            manufacturing team will provide a tailored estimate within 24 hours.
          </p>
        </div>

        <QuoteForm presetCategory={presetCategory} presetProductType={presetProductType} />
      </div>
    </main>
  );
}
