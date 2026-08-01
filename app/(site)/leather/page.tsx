import type { Metadata } from "next";
import { getCategory } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Leather Products — Wallets, Clutches, Card Holders & Belts",
  description:
    "Full-grain leather goods manufactured to order: long wallets, ladies' clutches, card holders, men's wallets and belts, in plain, mild and plated finishes.",
};

export default async function LeatherPage() {
  const category = await getCategory("leather");
  if (!category) return null;

  return (
    <main className="py-16">
      <div className="max-w-[1320px] mx-auto px-6">
        <Reveal>
          <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-3 block">
            Catalogue — {category.catalogueNumber}
          </span>
          <h1 className="text-[clamp(32px,5vw,52px)] font-medium tracking-tight mb-4">{category.name}</h1>
          <p className="text-ink-muted max-w-[50ch] mb-10">{category.description}</p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 border-t border-line pt-8">
          {category.products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 80}>
              <ProductCard product={p} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
