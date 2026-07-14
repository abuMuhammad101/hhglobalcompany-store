import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import CategoryEditForm from "@/components/admin/CategoryEditForm";

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
            Connect Supabase (see <code>data/schema.sql</code>) to edit category names and
            descriptions from here.
          </p>
        </div>
      </main>
    );
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, description, catalogue_number, image_url")
    .order("sort_order");

  return (
    <main className="py-10">
      <div className="max-w-[700px] mx-auto px-6">
        <h1 className="text-2xl mb-8">Categories</h1>
        <div className="space-y-10">
          {(categories ?? []).map((c) => (
            <CategoryEditForm key={c.id} category={c} />
          ))}
        </div>
      </div>
    </main>
  );
}
