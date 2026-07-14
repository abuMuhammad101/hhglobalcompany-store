import catalogFallback from "@/data/catalog.json";
import { getSupabase } from "./supabase";
import type { Category, Product } from "./types";

// Re-exported for convenience so other files can `import { Category, Product } from "@/lib/catalog"`
export type { Category, Product, Variant } from "./types";

function fallbackCatalog(): Category[] {
  return catalogFallback.categories as Category[];
}

export async function getCatalog(): Promise<Category[]> {
  const supabase = getSupabase();
  if (!supabase) return fallbackCatalog();

  const { data, error } = await supabase
    .from("categories")
    .select(
      "id, slug, name, catalogue_number, description, image_url, sort_order, products(id, slug, name, type, material, description, image_url, sort_order, product_variants(id, name, image_url, sort_order))"
    )
    .order("sort_order");

  if (error || !data || data.length === 0) {
    return fallbackCatalog();
  }

  return data.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    catalogueNumber: c.catalogue_number,
    description: c.description ?? "",
    imageUrl: c.image_url ?? null,
    products: (c.products ?? [])
      .slice()
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
      .map(
        (p: {
          id: string;
          slug: string;
          name: string;
          type: string;
          material: string | null;
          description: string | null;
          image_url: string | null;
          product_variants: { id: string; name: string; image_url: string | null; sort_order: number }[];
        }) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          type: p.type,
          material: p.material ?? "",
          description: p.description ?? "",
          imageUrl: p.image_url ?? null,
          variants: (p.product_variants ?? [])
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((v) => ({ id: v.id, name: v.name, imageUrl: v.image_url })),
        })
      ),
  })) as Category[];
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const catalog = await getCatalog();
  return catalog.find((c) => c.slug === slug);
}

export async function getAllProducts(): Promise<{ category: Category; product: Product }[]> {
  const catalog = await getCatalog();
  return catalog.flatMap((category) =>
    category.products.map((product) => ({ category, product }))
  );
}

export async function getProduct(
  slug: string
): Promise<{ category: Category; product: Product } | undefined> {
  const all = await getAllProducts();
  return all.find((p) => p.product.slug === slug);
}
