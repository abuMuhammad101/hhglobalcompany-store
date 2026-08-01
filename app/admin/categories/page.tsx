import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import CategoryManager from "@/components/admin/CategoryManager";

export const metadata: Metadata = { title: "Admin — Categories" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = getSupabase();

  if (!supabase) {
    return (
      <main className="py-16">
        <div className="max-w-[900px] mx-auto px-6">
          <h1 className="text-2xl mb-4">Categories — not connected yet</h1>
          <p className="text-ink-muted text-[15px]">
            Connect Supabase (see <code>data/schema.sql</code>) to add, disable, and edit categories
            and their product types from here.
          </p>
        </div>
      </main>
    );
  }

  const { data: categories } = await supabase
    .from("categories")
    .select(
      "id, slug, name, description, catalogue_number, image_url, sort_order, is_active, product_types(id, name, sort_order, is_active)"
    )
    .order("sort_order");

  return (
    <main className="py-10">
      <div className="max-w-[700px] mx-auto px-6">
        <h1 className="text-2xl mb-2">Categories</h1>
        <p className="text-sm text-ink-muted mb-8">
          Add, disable, reorder, or delete categories, and manage each one&apos;s product types —
          the tags products are grouped under.
        </p>
        <CategoryManager initialCategories={categories ?? []} />
      </div>
    </main>
  );
}
