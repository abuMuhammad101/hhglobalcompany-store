import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { getHeroSlides } from "@/lib/hero";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import BracketLabel from "@/components/BracketLabel";

export const revalidate = 60;

export default async function HomePage() {
  const [catalog, heroSlides] = await Promise.all([getCatalog(), getHeroSlides()]);
  const garments = catalog.find((c) => c.slug === "garments")!;
  const leather = catalog.find((c) => c.slug === "leather")!;

  return (
    <main>
      {/* HERO */}
      <section className="pt-16 pb-12">
        <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <span className="text-xl text-ink-faint mb-4 block">*</span>
            <h1 className="text-[clamp(34px,5.5vw,60px)] leading-[1.08] font-medium tracking-tight max-w-[16ch]">
              Precision garments &amp; full-grain leather goods.
            </h1>
            <p className="text-ink-muted mt-6 max-w-[48ch] text-[15px] leading-relaxed">
              A manufacturer, wholesaler and exporter dedicated to quality craftsmanship —
              from our own premium collections to custom manufacturing for brands worldwide.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <Link href="#categories" className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-ink text-on-dark font-medium">
                View Collection
              </Link>
              <Link href="#categories" aria-label="Scroll to collection" className="w-[52px] h-[52px] rounded-full bg-ink text-on-dark inline-flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </Link>
            </div>
          </div>
          <HeroCarousel slides={heroSlides} />
        </div>
      </section>

      {/* ABOUT US */}
      <section className="py-20 sm:py-24 bg-bg-soft border-y border-line">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-4 block">About Us</span>
              <h2 className="text-[clamp(28px,4vw,42px)] font-medium tracking-tight leading-[1.15] mb-6">
                Built on craftsmanship. Trusted for the long run.
              </h2>
              <p className="text-ink-muted text-[15px] leading-relaxed max-w-[52ch] mb-4">
                H&amp;H Global LLC is a manufacturer, wholesaler and exporter delivering premium
                garments and full-grain leather goods — plus custom manufacturing, private label
                and OEM production for brands worldwide.
              </p>
              <p className="text-ink-muted text-[15px] leading-relaxed max-w-[52ch] mb-8">
                From material selection to sampling, production, quality control and international
                shipping, we stay hands-on through every stage so your product ships exactly to spec.
              </p>
              <Link href="/about">
                <BracketLabel className="text-ink hover:text-ink-muted transition-colors">
                  <span className="font-mono-ui text-[12px] uppercase tracking-wider">Learn More About Us</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="ml-2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </BracketLabel>
              </Link>
            </div>
            <div className="grid grid-cols-2 auto-rows-fr gap-4 lg:self-stretch">
              <StatCard num="12+" label="Years crafting" />
              <StatCard num="1,400+" label="Orders fulfilled" />
              <StatCard num="25" label="Unit minimum" />
              <StatCard num="24 hrs" label="Avg. quote turnaround" />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY HERO GRID */}
      <section id="categories" className="pt-16 pb-16">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-4">
            <Link
              href="/garments"
              className="relative aspect-[4/3] lg:aspect-[16/9] flex items-end p-6 sm:p-8 rounded-2xl overflow-hidden bg-cover bg-center"
              style={{
                background: garments.imageUrl
                  ? `url(${garments.imageUrl}) center/cover`
                  : "radial-gradient(120% 90% at 30% 10%, #EDEAE2 0%, #D9D5C8 55%, #B9B3A0 100%)",
              }}
            >
              {garments.imageUrl && (
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 45%)" }}
                />
              )}
              <span className={`relative text-2xl sm:text-3xl font-medium tracking-tight ${garments.imageUrl ? "text-on-dark" : "text-ink"}`}>
                Garments
              </span>
            </Link>
            <Link
              href="/leather"
              className="relative aspect-[4/3] lg:aspect-[16/9] flex items-end p-6 sm:p-8 rounded-2xl overflow-hidden bg-cover bg-center"
              style={{
                background: leather.imageUrl
                  ? `url(${leather.imageUrl}) center/cover`
                  : "radial-gradient(120% 90% at 60% 20%, #F3E4D0 0%, #D9B98C 55%, #B98A5C 100%)",
              }}
            >
              {leather.imageUrl && (
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 45%)" }}
                />
              )}
              <span className="relative text-2xl sm:text-3xl font-medium tracking-tight text-on-dark">
                Leather Products
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CATALOGUE 01 — GARMENTS PREVIEW */}
      <section id="garments" className="py-16">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
            <div>
              <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-3 block">Catalogue — 01</span>
              <h2 className="text-[clamp(24px,3vw,32px)] font-medium tracking-tight">Premium Garments</h2>
            </div>
            <Link href="/garments" className="font-mono-ui text-[12px] uppercase tracking-wide border-b border-ink self-start">
              View all garments
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 border-t border-line pt-8">
            {garments.products.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION SEPARATOR */}
      <div className="relative py-2">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="h-px bg-line" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <BracketLabel className="bg-bg text-ink-muted">
            <span className="font-mono-ui text-[11px] uppercase tracking-wider">Catalogue — 02</span>
          </BracketLabel>
        </div>
      </div>

      {/* CATALOGUE 02 — LEATHER PREVIEW */}
      <section id="leather" className="py-16 bg-bg-soft">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-[clamp(24px,3vw,32px)] font-medium tracking-tight">Full Grain Leather</h2>
            </div>
            <Link href="/leather" className="font-mono-ui text-[12px] uppercase tracking-wide border-b border-ink self-start">
              View all leather goods
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 pt-8 border-t border-line">
            {leather.products.map((p) => {
              const coverImageUrl = p.images[0]?.imageUrl ?? null;
              return (
                <article key={p.slug}>
                  <div
                    className="aspect-[4/3] mb-4 flex items-center justify-center font-mono-ui text-[11px] uppercase tracking-wide text-ink-faint bg-cover bg-center rounded-xl overflow-hidden"
                    style={
                      coverImageUrl
                        ? { backgroundImage: `url(${coverImageUrl})` }
                        : { background: "radial-gradient(120% 100% at 40% 10%, #F3E4D0 0%, #D9B98C 60%, #B98A5C 100%)" }
                    }
                  >
                    {!coverImageUrl && `${p.type} photo`}
                  </div>
                  <h3 className="text-[17px] font-medium mb-3">{p.type}</h3>
                  <ul className="flex flex-col gap-2">
                    {(p.variants.length ? p.variants : [{ name: "Mild" }]).map((v) => (
                      <li key={v.name} className="text-[13.5px] text-ink-muted pl-4 relative before:content-['•'] before:absolute before:left-0">
                        {v.name}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center max-w-[48ch] mx-auto mb-12">
            <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-4 block">How It Works</span>
            <h2 className="text-[clamp(26px,3.6vw,38px)] font-medium tracking-tight">
              From spec to shipped, in four steps.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processSteps.map((step, i) => (
              <div key={step.title} className="border border-line rounded-2xl p-8">
                <span className="font-mono-ui text-[13px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-[18px] font-medium mt-4 mb-2">{step.title}</h3>
                <p className="text-ink-muted text-[14px] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-[1320px] mx-auto px-6 text-center">
          <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-3 block">Get a Quote</span>
          <h2 className="text-[clamp(26px,4vw,36px)] font-medium tracking-tight mb-8">Have a bulk order in mind?</h2>
          <Link href="/quote" className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-ink text-on-dark font-medium">
            Start Your Quote
          </Link>
        </div>
      </section>
    </main>
  );
}

const processSteps = [
  {
    title: "Share Your Specs",
    description: "Tell us quantity, fabric or leather, finish and timeline through a quick quote request.",
  },
  {
    title: "Sample & Confirm",
    description: "We produce a sample and lock in pricing once you approve the spec.",
  },
  {
    title: "Production & QC",
    description: "Your run goes into production with quality control checks at every stage.",
  },
  {
    title: "Ship & Deliver",
    description: "Finished goods are packed and shipped worldwide, on the timeline we quoted.",
  },
];

function StatCard({ num, label }: { num: string; label: string }) {
  return (
    <div className="border border-line rounded-xl p-6 sm:p-7 bg-bg flex flex-col justify-center">
      <div className="text-3xl sm:text-4xl font-medium tracking-tight">{num}</div>
      <div className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mt-2">{label}</div>
    </div>
  );
}
