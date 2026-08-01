import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { getHeroSlides } from "@/lib/hero";
import { getHomeContent, getCompanyStats, paragraphs } from "@/lib/content";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import BracketLabel from "@/components/BracketLabel";
import Button from "@/components/Button";
import ArrowBadge from "@/components/ArrowBadge";
import Reveal from "@/components/Reveal";

export const revalidate = 60;

export default async function HomePage() {
  const [catalog, heroSlides, content, stats] = await Promise.all([
    getCatalog(),
    getHeroSlides(),
    getHomeContent(),
    getCompanyStats(),
  ]);
  const garments = catalog.find((c) => c.slug === "garments")!;
  const leather = catalog.find((c) => c.slug === "leather")!;
  const aboutParagraphs = paragraphs(content.about.body);

  return (
    <main>
      {/* HERO */}
      <section className="pt-16 pb-12">
        <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <Reveal>
            <span className="text-xl text-ink-faint mb-4 block">*</span>
            <h1 className="text-[clamp(34px,5.5vw,60px)] leading-[1.08] font-medium tracking-tight max-w-[16ch]">
              {content.hero.heading}
            </h1>
            <p className="text-ink-muted mt-6 max-w-[48ch] text-[15px] leading-relaxed">
              {content.hero.subcopy}
            </p>
            <div className="flex items-center gap-3 mt-8">
              <Button href="#categories" size="lg">
                View Collection
              </Button>
              <ArrowBadge href="#categories" tone="accent" size="lg" aria-label="Scroll to collection" />
            </div>
          </Reveal>
          <Reveal direction="right" delay={150}>
            <HeroCarousel slides={heroSlides} />
          </Reveal>
        </div>
      </section>

      {/* ABOUT US */}
      <section className="py-20 sm:py-24 bg-bg-soft border-y border-line">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <Reveal direction="left">
              <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-4 block">{content.about.eyebrow}</span>
              <h2 className="text-[clamp(28px,4vw,42px)] font-medium tracking-tight leading-[1.15] mb-6">
                {content.about.heading}
              </h2>
              {aboutParagraphs.map((p, i) => (
                <p key={i} className={`text-ink-muted text-[15px] leading-relaxed max-w-[52ch] ${i === aboutParagraphs.length - 1 ? "mb-8" : "mb-4"}`}>
                  {p}
                </p>
              ))}
              <Link href="/about">
                <BracketLabel className="text-ink hover:text-ink-muted transition-colors">
                  <span className="font-mono-ui text-[12px] uppercase tracking-wider">Learn More About Us</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="ml-2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </BracketLabel>
              </Link>
            </Reveal>
            <div className="grid grid-cols-2 auto-rows-fr gap-4 lg:self-stretch">
              <Reveal direction="right" className="h-full"><StatCard num={stats.years.num} label={stats.years.label} /></Reveal>
              <Reveal direction="right" delay={80} className="h-full"><StatCard num={stats.orders.num} label={stats.orders.label} /></Reveal>
              <Reveal direction="right" delay={160} className="h-full"><StatCard num={stats.minUnits.num} label={stats.minUnits.label} /></Reveal>
              <Reveal direction="right" delay={240} className="h-full"><StatCard num={stats.turnaround.num} label={stats.turnaround.label} /></Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY HERO GRID */}
      <section id="categories" className="pt-16 pb-16">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-4">
            <Reveal direction="left">
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
            </Reveal>
            <Reveal direction="right" delay={100}>
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
            </Reveal>
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
            <Button href="/garments" variant="ghost" className="self-start">
              View all garments
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 border-t border-line pt-8">
            {garments.products.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 80}>
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOGUE 02 — LEATHER PREVIEW */}
      <section id="leather" className="py-16 bg-bg-soft">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-[clamp(24px,3vw,32px)] font-medium tracking-tight">Full Grain Leather</h2>
            </div>
            <Button href="/leather" variant="ghost" className="self-start">
              View all leather goods
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 pt-8 border-t border-line">
            {leather.products.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 80}>
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <Reveal className="text-center max-w-[48ch] mx-auto mb-12">
            <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-4 block">{content.process.eyebrow}</span>
            <h2 className="text-[clamp(26px,3.6vw,38px)] font-medium tracking-tight">
              {content.process.heading}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.process.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 80} className="h-full">
                <div className="h-full border border-line rounded-2xl p-8">
                  <span className="font-mono-ui text-[13px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-[18px] font-medium mt-4 mb-2">{step.title}</h3>
                  <p className="text-ink-muted text-[14px] leading-relaxed">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Reveal className="max-w-[1320px] mx-auto px-6 text-center">
          <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-3 block">{content.cta.eyebrow}</span>
          <h2 className="text-[clamp(26px,4vw,36px)] font-medium tracking-tight mb-8">{content.cta.heading}</h2>
          <Button href="/quote" variant="accent" size="lg">
            Start Your Quote
          </Button>
        </Reveal>
      </section>
    </main>
  );
}

function StatCard({ num, label }: { num: string; label: string }) {
  return (
    <div className="h-full border border-line rounded-xl p-6 sm:p-7 bg-bg flex flex-col justify-center">
      <div className="text-3xl sm:text-4xl font-medium tracking-tight">{num}</div>
      <div className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mt-2">{label}</div>
    </div>
  );
}
