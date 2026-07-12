import type { Metadata } from "next";
import Link from "next/link";
import { getCategory } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Garments — T-Shirts, Sweatshirts, Sweatpants & Hoodies",
  description:
    "Wholesale garments manufactured to your quantity and fabric spec: T-shirts, sweatshirts, sweatpants and hoodies.",
};

export default async function GarmentsPage() {
  const category = await getCategory("garments");
  if (!category) return null;

  return (
    <main className="py-16">
      <div className="max-w-[1320px] mx-auto px-6">
        <span className="font-mono-ui text-[11.5px] uppercase tracking-wider text-ink-muted mb-3 block">
          Catalogue — {category.catalogueNumber}
        </span>
        <h1 className="text-[clamp(32px,5vw,52px)] mb-4">{category.name}</h1>
        <p className="text-ink-muted max-w-[50ch] mb-10">{category.description}</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 border-t border-line pt-8">
          {category.products.map((p, i) => (
            <Link key={p.slug} href={`/product/${p.slug}`}>
              <ProductCard product={p} index={i} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
