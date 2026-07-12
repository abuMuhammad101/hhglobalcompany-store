import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProducts, getProduct } from "@/lib/catalog";

export function generateStaticParams() {
  return getAllProducts().map(({ product }) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = getProduct(slug);
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
  const found = getProduct(slug);
  if (!found) notFound();

  const { category, product } = found;

  return (
    <main className="py-16">
      <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-2 gap-10">
        <div
          className="aspect-[4/5] flex items-center justify-center font-mono-ui text-[11px] uppercase tracking-wide text-ink-faint"
          style={{ background: "linear-gradient(160deg,#EFEDE6,#D7D3C6)" }}
        >
          {product.name} photo
        </div>

        <div>
          <span className="font-mono-ui text-[11.5px] uppercase tracking-wider text-ink-muted mb-3 block">
            {category.name} / {product.type}
          </span>
          <h1 className="text-[clamp(28px,4vw,44px)] mb-4">{product.name}</h1>
          <p className="text-ink-muted max-w-[50ch] mb-8">{product.description}</p>

          {product.variants.length > 0 && (
            <div className="mb-8">
              <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-2 block">
                Available styles / finishes
              </span>
              <ul className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <li key={v} className="border border-line px-3 py-1.5 text-sm rounded-full">
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href={`/quote?type=${encodeURIComponent(product.type)}`}
            className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-ink text-on-dark font-medium"
          >
            Request Quote for This Product
          </Link>
        </div>
      </div>

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
