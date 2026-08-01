import type { MetadataRoute } from "next";
import { getCatalog, getAllProducts } from "@/lib/catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hhglobalcompany.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/quote", "/about", "/contact", "/terms"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const catalog = await getCatalog();
  const categoryPages = catalog.map((c) => ({
    url: `${siteUrl}/${c.slug}`,
    lastModified: new Date(),
  }));

  const products = await getAllProducts();
  const productPages = products.map(({ product }) => ({
    url: `${siteUrl}/product/${product.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
