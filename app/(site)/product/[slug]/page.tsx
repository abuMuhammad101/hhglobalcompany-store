import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProduct } from "@/lib/catalog";
import ProductView from "@/components/ProductView";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map(({ product }) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await getProduct(slug);
  if (!found) return {};
  return {
    title: found.product.name,
    description: found.product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getProduct(slug);
  if (!found) notFound();

  const { category, product } = found;
  const related = category.products.filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <main className="py-16">
      <ProductView
        categoryName={category.name}
        categoryHref={`/${category.slug}`}
        productName={product.name}
        productType={product.type}
        description={product.description}
        material={product.material}
        variants={product.variants}
        images={product.images}
        variantLabel={product.variantLabel}
      />

      {related.length > 0 && (
        <section className="max-w-[1320px] mx-auto px-6 mt-20 pt-12 border-t border-line">
          <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-6 block">
            More from {category.name}
          </span>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
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
            name: product.name,
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
