import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProductVariant } from "@/lib/catalog";
import ProductVariantView from "@/components/ProductVariantView";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.flatMap(({ product }) =>
    product.variants.map((v) => ({ slug: product.slug, variant: v.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; variant: string }>;
}): Promise<Metadata> {
  const { slug, variant } = await params;
  const found = await getProductVariant(slug, variant);
  if (!found) return {};
  return {
    title: `${found.variant.name} — ${found.product.name}`,
    description: found.product.description,
  };
}

export default async function ProductVariantPage({
  params,
}: {
  params: Promise<{ slug: string; variant: string }>;
}) {
  const { slug, variant } = await params;
  const found = await getProductVariant(slug, variant);
  if (!found) notFound();

  const { category, product, variant: activeVariant } = found;
  const related = category.products.filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <main className="py-16">
      <Reveal>
        <ProductVariantView
          categoryName={category.name}
          categoryHref={`/${category.slug}`}
          productSlug={product.slug}
          productName={product.name}
          productType={product.type}
          description={product.description}
          material={product.material}
          variants={product.variants}
          activeVariant={activeVariant}
          images={product.images}
        />
      </Reveal>

      {related.length > 0 && (
        <section className="max-w-[1320px] mx-auto px-6 mt-20 pt-12 border-t border-line">
          <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-6 block">
            More from {category.name}
          </span>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 80}>
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Product structured data — helps LLMs and search engines cite this exact item */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${activeVariant.name} — ${product.name}`,
            description: product.description,
            category: category.name,
            material: product.material,
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              priceSpecification: {
                "@type": "PriceSpecification",
                description: "Custom wholesale pricing available on request",
              },
            },
          }),
        }}
      />
    </main>
  );
}
