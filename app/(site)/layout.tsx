import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/settings";
import { getFooterContent } from "@/lib/content";
import { getCatalog } from "@/lib/catalog";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ logoUrl, brandName }, footerContent, catalog] = await Promise.all([
    getSiteSettings(),
    getFooterContent(),
    getCatalog(),
  ]);
  const categories = catalog.map((c) => ({ slug: c.slug, name: c.name }));
  return (
    <>
      <Header logoUrl={logoUrl} brandName={brandName} categories={categories} />
      {children}
      <Footer content={footerContent} />
    </>
  );
}
