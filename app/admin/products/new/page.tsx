import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import ProductForm from "@/components/admin/ProductForm";
import Breadcrumb from "@/components/admin/Breadcrumb";

export const metadata: Metadata = { title: "Admin — New Product" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
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

  const { data: categories } = await supabase.from("categories").select("id, name").order("sort_order");

  return (
    <main className="py-10">
      <div className="max-w-[700px] mx-auto px-6">
        <Breadcrumb items={[{ label: "Products", href: "/admin/products" }, { label: "Add Product" }]} />
        <h1 className="text-2xl mb-2">Add Product</h1>
        <p className="text-sm text-ink-muted mb-8">
          Fill in the details below, then save — you'll add photos and style/finish options on
          the next screen.
        </p>
        <ProductForm categories={categories ?? []} />
      </div>
    </main>
  );
}
