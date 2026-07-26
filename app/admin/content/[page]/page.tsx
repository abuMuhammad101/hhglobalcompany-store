import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import {
  getHomeContent,
  getCompanyStats,
  getAboutContent,
  getContactContent,
  getFooterContent,
  getQuoteContent,
  getTermsContent,
} from "@/lib/content";
import HomeContentForm from "@/components/admin/content/HomeContentForm";
import CompanyStatsForm from "@/components/admin/content/CompanyStatsForm";
import AboutContentForm from "@/components/admin/content/AboutContentForm";
import ContactContentForm from "@/components/admin/content/ContactContentForm";
import FooterContentForm from "@/components/admin/content/FooterContentForm";
import QuoteContentForm from "@/components/admin/content/QuoteContentForm";
import TermsContentForm from "@/components/admin/content/TermsContentForm";

export const dynamic = "force-dynamic";

const TITLES: Record<string, string> = {
  home: "Home Page",
  about: "About Page",
  contact: "Contact Page",
  footer: "Footer",
  quote: "Quote Page",
  terms: "Terms & Policies",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return { title: `Admin — ${TITLES[page] ?? "Content"}` };
}

export default async function AdminContentPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;

  if (!(page in TITLES)) notFound();

  const supabase = getSupabase();
  if (!supabase) {
    return (
      <main className="py-16">
        <div className="max-w-[700px] mx-auto px-6">
          <p className="text-ink-muted">Connect Supabase first — see the Content page for details.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="py-10">
      <div className="max-w-[700px] mx-auto px-6">
        <h1 className="text-2xl mb-8">{TITLES[page]}</h1>
        {await renderForm(page)}
      </div>
    </main>
  );
}

async function renderForm(page: string) {
  switch (page) {
    case "home": {
      const [content, stats] = await Promise.all([getHomeContent(), getCompanyStats()]);
      return (
        <div className="space-y-14">
          <HomeContentForm initial={content} />
          <div className="border-t border-line pt-10">
            <CompanyStatsForm initial={stats} />
          </div>
        </div>
      );
    }
    case "about":
      return <AboutContentForm initial={await getAboutContent()} />;
    case "contact":
      return <ContactContentForm initial={await getContactContent()} />;
    case "footer":
      return <FooterContentForm initial={await getFooterContent()} />;
    case "quote":
      return <QuoteContentForm initial={await getQuoteContent()} />;
    case "terms":
      return <TermsContentForm initial={await getTermsContent()} />;
    default:
      return null;
  }
}
