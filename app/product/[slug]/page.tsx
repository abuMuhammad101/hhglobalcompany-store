import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProduct } from "@/lib/catalog";
import ProductView from "@/components/ProductView";

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

  return (
    <main className="py-16">
      <ProductView
        categoryName={category.name}
        productName={product.name}
        productType={product.type}
        description={product.description}
        variants={product.variants}
      />

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
