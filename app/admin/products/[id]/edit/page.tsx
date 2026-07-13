import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import ProductForm from "@/components/admin/ProductForm";
import VariantManager from "@/components/admin/VariantManager";
import ProductView from "@/components/ProductView";

export const metadata: Metadata = { title: "Admin — Edit Product" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabase();
  if (!supabase) {
    return (
      <main className="py-16">
        <div className="max-w-[700px] mx-auto px-6">
          <p className="text-ink-muted">Connect Supabase first — see Products page for details.</p>
        </div>
      </main>
    );
  }

  const [{ data: categories }, { data: product }] = await Promise.all([
    supabase.from("categories").select("id, name").order("sort_order"),
    supabase
      .from("products")
      .select(
        "id, category_id, name, slug, type, material, description, image_url, categories(name), product_variants(id, name, image_url, sort_order)"
      )
      .eq("id", id)
      .single(),
  ]);

  if (!product) notFound();

  const variants = (product.product_variants ?? [])
    .slice()
    .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order);

  const categoryName = Array.isArray(product.categories)
    ? product.categories[0]?.name
    : (product.categories as { name: string } | null)?.name ?? "";

  return (
    <main className="py-10">
      <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-2 gap-12">
        <div>
          <h1 className="text-2xl mb-8">Edit Product</h1>
          <ProductForm categories={categories ?? []} initial={product} />

          <div className="border-t border-line mt-10 pt-10">
            <VariantManager
              productId={product.id}
              initialVariants={variants.map((v: { id: string; name: string; image_url: string | null; sort_order: number }) => ({
                id: v.id,
                name: v.name,
                image_url: v.image_url,
                sort_order: v.sort_order,
              }))}
            />
          </div>
        </div>

        <div>
          <span className="block text-xs font-medium uppercase tracking-wide text-ink-muted mb-4">
            Live preview — exactly what customers see
          </span>
          <div className="border border-line rounded-lg p-6 sticky top-24">
            <ProductView
              compact
              categoryName={categoryName}
              productName={product.name}
              productType={product.type}
              description={product.description}
              productImageUrl={product.image_url}
              variants={variants.map((v: { id: string; name: string; image_url: string | null }) => ({
                id: v.id,
                name: v.name,
                imageUrl: v.image_url,
              }))}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
