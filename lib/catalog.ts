import catalogFallback from "@/data/catalog.json";
import { getSupabase } from "./supabase";
import type { Category, Product } from "./types";

// Re-exported for convenience so other files can `import { Category, Product } from "@/lib/catalog"`
export type { Category, Product, Variant } from "./types";

function fallbackCatalog(): Category[] {
  const categories = catalogFallback.categories as Category[];
  return categories.map((c) => ({
    ...c,
    products: c.products.map((p) => ({ ...p, images: p.images ?? [] })),
  }));
}

export async function getCatalog(): Promise<Category[]> {
  const supabase = getSupabase();
  if (!supabase) return fallbackCatalog();

  const { data, error } = await supabase
    .from("categories")
    .select(
      "id, slug, name, catalogue_number, description, image_url, sort_order, is_active, products(id, slug, name, type, material, description, image_url, sort_order, product_types(is_active), product_variants(id, name, slug, image_url, sort_order, variant_colors(id, image_url, sort_order, colors(name, is_active), variant_color_images(id, image_url, sort_order))), product_images(id, image_url, sort_order))"
    )
    .eq("is_active", true)
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
    isActive: c.is_active,
    products: (c.products ?? [])
      .slice()
      // A disabled product type hides its products from the public site, same
      // as a disabled category — but a product with no linked type yet (not
      // backfilled) stays visible rather than silently disappearing.
      .filter((p: { product_types: { is_active: boolean } | { is_active: boolean }[] | null }) => {
        const productType = Array.isArray(p.product_types) ? p.product_types[0] : p.product_types;
        return productType?.is_active !== false;
      })
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
          product_variants: {
            id: string;
            name: string;
            slug: string;
            image_url: string | null;
            sort_order: number;
            variant_colors: {
              id: string;
              image_url: string;
              sort_order: number;
              colors: { name: string; is_active: boolean } | { name: string; is_active: boolean }[] | null;
              variant_color_images: { id: string; image_url: string; sort_order: number }[];
            }[];
          }[];
          product_images: { id: string; image_url: string; sort_order: number }[];
        }) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          type: p.type,
          material: p.material ?? "",
          description: p.description ?? "",
          imageUrl: p.image_url ?? null,
          images: (p.product_images ?? [])
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((img) => ({ id: img.id, imageUrl: img.image_url })),
          variants: (p.product_variants ?? [])
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((v) => ({
              id: v.id,
              name: v.name,
              slug: v.slug,
              imageUrl: v.image_url,
              colors: (v.variant_colors ?? [])
                .slice()
                .filter((vc) => {
                  const color = Array.isArray(vc.colors) ? vc.colors[0] : vc.colors;
                  return color?.is_active !== false;
                })
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((vc) => {
                  const color = Array.isArray(vc.colors) ? vc.colors[0] : vc.colors;
                  return {
                    id: vc.id,
                    name: color?.name ?? "",
                    imageUrl: vc.image_url,
                    images: (vc.variant_color_images ?? [])
                      .slice()
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((img) => ({ id: img.id, imageUrl: img.image_url })),
                  };
                }),
            })),
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

export async function getProductVariant(productSlug: string, variantSlug: string) {
  const found = await getProduct(productSlug);
  const variant = found?.product.variants.find((v) => v.slug === variantSlug);
  if (!found || !variant) return undefined;
  return { ...found, variant };
}
