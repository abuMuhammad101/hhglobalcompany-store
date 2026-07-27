import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/settings";
import { getFooterContent } from "@/lib/content";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ logoUrl, brandName }, footerContent] = await Promise.all([getSiteSettings(), getFooterContent()]);
  return (
    <>
      <Header logoUrl={logoUrl} brandName={brandName} />
      {children}
      <Footer content={footerContent} />
    </>
  );
}
