import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import { getSiteSettings } from "@/lib/settings";
import LogoManager from "@/components/admin/LogoManager";
import HeroSlideManager from "@/components/admin/HeroSlideManager";

export const metadata: Metadata = { title: "Admin — Media" };
export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const supabase = getSupabase();

  if (!supabase) {
    return (
      <main className="py-16">
        <div className="max-w-[700px] mx-auto px-6">
          <h1 className="text-2xl mb-4">Media — not connected yet</h1>
          <p className="text-ink-muted text-[15px]">
            Connect Supabase (see <code>data/schema.sql</code>) to manage the site logo and homepage
            hero carousel from here.
          </p>
        </div>
      </main>
    );
  }

  const [{ logoUrl }, { data: slides }] = await Promise.all([
    getSiteSettings(),
    supabase.from("hero_slides").select("id, image_url, label, sort_order").order("sort_order"),
  ]);

  return (
    <main className="py-10">
      <div className="max-w-[700px] mx-auto px-6 space-y-10">
        <h1 className="text-2xl">Media</h1>
        <LogoManager initialLogoUrl={logoUrl} />
        <div className="border border-line rounded-lg p-6">
          <HeroSlideManager initialSlides={slides ?? []} />
        </div>
      </div>
    </main>
  );
}
