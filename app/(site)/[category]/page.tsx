import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalog, getCategory } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export const revalidate = 60;

export async function generateStaticParams() {
  const catalog = await getCatalog();
  return catalog.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

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
