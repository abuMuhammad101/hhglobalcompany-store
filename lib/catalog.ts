import catalogData from "@/data/catalog.json";

export type Product = {
  slug: string;
  name: string;
  type: string;
  material: string;
  variants: string[];
  description: string;
};

export type Category = {
  slug: string;
  name: string;
  catalogueNumber: string;
  description: string;
  products: Product[];
};

export const catalog: Category[] = catalogData.categories;

export function getCategory(slug: string): Category | undefined {
  return catalog.find((c) => c.slug === slug);
}

export function getAllProducts(): { category: Category; product: Product }[] {
  return catalog.flatMap((category) =>
    category.products.map((product) => ({ category, product }))
  );
}

export function getProduct(
  slug: string
): { category: Category; product: Product } | undefined {
  return getAllProducts().find((p) => p.product.slug === slug);
}
