import type { Metadata } from "next";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const metadata: Metadata = { title: "Admin — Products" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = getSupabase();

  if (!supabase) {
    return (
      <main className="py-16">
        <div className="max-w-[900px] mx-auto px-6">
          <h1 className="text-2xl mb-4">Products — not connected yet</h1>
          <p className="text-ink-muted text-[15px]">
            The site is currently reading products from <code>data/catalog.json</code>. Connect
            Supabase (see <code>data/schema.sql</code>) to manage products from here instead —
            once connected, this page lets you add, edit and delete products and their style/finish
            variants without touching any code.
          </p>
        </div>
      </main>
    );
  }

  const { data: categories } = await supabase
    .from("categories")
    .select(
      "id, name, slug, sort_order, products(id, name, slug, type, material, sort_order, product_variants(id), product_images(image_url, sort_order))"
    )
    .order("sort_order");

  return (
    <main className="py-10">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl">Products</h1>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-ink text-on-dark text-sm font-medium"
          >
            + Add Product
          </Link>
        </div>

        {(categories ?? []).map((category) => (
          <div key={category.id} className="mb-10">
            <h2 className="text-lg font-medium mb-3">{category.name}</h2>
            <div className="border border-line rounded-md overflow-hidden">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b border-line text-ink-muted uppercase text-xs tracking-wide bg-bg-soft">
                    <th className="py-2.5 px-4">Photo</th>
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Material</th>
                    <th className="py-2.5 px-4">Variants</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(category.products ?? [])
                    .slice()
                    .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
                    .map(
                      (p: {
                        id: string;
                        name: string;
                        slug: string;
                        type: string;
                        material: string;
                        product_variants: unknown[];
                        product_images: { image_url: string; sort_order: number }[];
                      }) => {
                        const coverImageUrl = (p.product_images ?? [])
                          .slice()
                          .sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url;
                        return (
                        <tr key={p.id} className="border-b border-line last:border-b-0">
                          <td className="py-2.5 px-4">
                            <div
                              className="w-10 h-10 rounded bg-bg-soft border border-line bg-cover bg-center"
                              style={coverImageUrl ? { backgroundImage: `url(${coverImageUrl})` } : undefined}
                            />
                          </td>
                          <td className="py-2.5 px-4">{p.name}</td>
                          <td className="py-2.5 px-4 text-ink-muted">{p.type}</td>
                          <td className="py-2.5 px-4 text-ink-muted">{p.material}</td>
                          <td className="py-2.5 px-4 text-ink-muted">{p.product_variants?.length ?? 0}</td>
                          <td className="py-2.5 px-4 text-right whitespace-nowrap">
                            <Link href={`/admin/products/${p.id}/edit`} className="text-xs border-b border-ink mr-4">
                              Edit
                            </Link>
                            <DeleteProductButton productId={p.id} productName={p.name} />
                          </td>
                        </tr>
                        );
                      }
                    )}
                  {(!category.products || category.products.length === 0) && (
                    <tr>
                      <td colSpan={6} className="py-6 px-4 text-ink-muted text-center">
                        No products in this category yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
