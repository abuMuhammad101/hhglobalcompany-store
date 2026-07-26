import type { Metadata } from "next";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export const metadata: Metadata = { title: "Admin — Content" };
export const dynamic = "force-dynamic";

const GROUPS = [
  { key: "home", title: "Home Page", description: "Hero, About Us section, How It Works, and the bottom call-to-action." },
  { key: "about", title: "About Page", description: "Hero, our story, the What We Offer list, and the closing call-to-action." },
  { key: "contact", title: "Contact Page", description: "Heading, email, phone and address." },
  { key: "footer", title: "Footer", description: "Tagline, social links, copyright and location line." },
  { key: "quote", title: "Quote Page", description: "The quote form intro and the thank-you page shown after submitting." },
  { key: "terms", title: "Terms & Policies", description: "Shipping, returns, terms of sale and privacy policy." },
];

export default function AdminContentIndexPage() {
  const supabase = getSupabase();

  if (!supabase) {
    return (
      <main className="py-16">
        <div className="max-w-[900px] mx-auto px-6">
          <h1 className="text-2xl mb-4">Content — not connected yet</h1>
          <p className="text-ink-muted text-[15px]">
            Connect Supabase (see <code>data/schema-page-content.sql</code>) to edit the site&apos;s
            copy from here.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="py-10">
      <div className="max-w-[900px] mx-auto px-6">
        <h1 className="text-2xl mb-2">Content</h1>
        <p className="text-sm text-ink-muted mb-8">
          Edit the text on every page of the site. The company stats shown on both the Home and
          About pages are edited from the Home page.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {GROUPS.map((g) => (
            <Link
              key={g.key}
              href={`/admin/content/${g.key}`}
              className="border border-line rounded-lg p-5 hover:border-ink-faint transition-colors"
            >
              <h2 className="text-base font-medium mb-1.5">{g.title}</h2>
              <p className="text-sm text-ink-muted">{g.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
