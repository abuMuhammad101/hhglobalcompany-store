import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hhglobalcompany.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/garments", "/leather", "/quote", "/about", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const productPages = getAllProducts().map(({ product }) => ({
    url: `${siteUrl}/product/${product.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...productPages];
}
