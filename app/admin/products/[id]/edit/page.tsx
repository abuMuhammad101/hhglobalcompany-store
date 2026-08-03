import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import ProductForm from "@/components/admin/ProductForm";
import VariantManager from "@/components/admin/VariantManager";
import FeaturedImageManager from "@/components/admin/FeaturedImageManager";
import ProductGalleryManager from "@/components/admin/ProductGalleryManager";
import ProductView from "@/components/ProductView";
import Breadcrumb from "@/components/admin/Breadcrumb";

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
    supabase
      .from("categories")
      .select("id, name, product_types(id, name, is_active), colors(id, name, is_active)")
      .order("sort_order"),
    supabase
      .from("products")
      .select(
        "id, category_id, name, slug, type, product_type_id, material, description, image_url, categories(name), product_variants(id, name, slug, image_url, sort_order, variant_colors(id, image_url, sort_order, colors(id, name))), product_images(id, image_url, sort_order)"
      )
      .eq("id", id)
      .single(),
  ]);

  if (!product) notFound();

  const categoryOptions = (categories ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    productTypes: c.product_types ?? [],
  }));

  const categoryColors = (categories ?? []).find((c) => c.id === product.category_id)?.colors ?? [];

  const variants = (product.product_variants ?? [])
    .slice()
    .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
    .map(
      (v: {
        id: string;
        name: string;
        slug: string;
        image_url: string | null;
        sort_order: number;
        variant_colors: {
          id: string;
          image_url: string;
          sort_order: number;
          colors: { id: string; name: string } | { id: string; name: string }[] | null;
        }[];
      }) => ({
        ...v,
        variant_colors: (v.variant_colors ?? []).map((vc) => {
          const color = Array.isArray(vc.colors) ? vc.colors[0] : vc.colors;
          return {
            id: vc.id,
            image_url: vc.image_url,
            sort_order: vc.sort_order,
            colorId: color?.id ?? "",
            colorName: color?.name ?? "",
          };
        }),
      })
    );

  const images = (product.product_images ?? [])
    .slice()
    .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order);

  const categoryName = Array.isArray(product.categories)
    ? product.categories[0]?.name
    : (product.categories as { name: string } | null)?.name ?? "";

  return (
    <main className="py-10 overflow-x-clip">
      <div className="max-w-[1200px] mx-auto px-6">
        <Breadcrumb items={[{ label: "Products", href: "/admin/products" }, { label: product.name }]} />
      </div>
      <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-2 gap-12">
        <div className="min-w-0">
          <h1 className="text-2xl mb-8">Edit Product</h1>
          <ProductForm categories={categoryOptions} initial={product} />

          <div className="border-t border-line mt-10 pt-10">
            <FeaturedImageManager productId={product.id} initialImageUrl={product.image_url} />
          </div>

          <div className="border-t border-line mt-10 pt-10">
            <ProductGalleryManager
              productId={product.id}
              initialImages={images.map((img: { id: string; image_url: string; sort_order: number }) => ({
                id: img.id,
                image_url: img.image_url,
                sort_order: img.sort_order,
              }))}
            />
          </div>

          <div className="border-t border-line mt-10 pt-10">
            <VariantManager
              productId={product.id}
              categoryColors={categoryColors}
              initialVariants={variants}
            />
          </div>
        </div>

        <div className="min-w-0">
          <span className="block text-xs font-medium uppercase tracking-wide text-ink-muted mb-4">
            Live preview — exactly what customers see
          </span>
          <div className="border border-line rounded-lg p-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-x-hidden overflow-y-auto">
            <ProductView
              compact
              categoryName={categoryName}
              productName={product.name}
              productType={product.type}
              description={product.description}
              featuredImage={product.image_url}
              images={images.map((img: { id: string; image_url: string }) => ({
                id: img.id,
                imageUrl: img.image_url,
              }))}
              variants={variants.map(
                (v: {
                  id: string;
                  name: string;
                  slug: string;
                  image_url: string | null;
                  variant_colors: { id: string; image_url: string; colorName: string }[];
                }) => ({
                  id: v.id,
                  name: v.name,
                  slug: v.slug,
                  imageUrl: v.image_url,
                  colors: v.variant_colors.map((vc) => ({ id: vc.id, name: vc.colorName, imageUrl: vc.image_url })),
                })
              )}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
