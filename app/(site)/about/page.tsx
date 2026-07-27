import type { Metadata } from "next";
import BracketLabel from "@/components/BracketLabel";
import Button from "@/components/Button";
import { getAboutContent, getCompanyStats, paragraphs } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About",
  description:
    "H&H Global LLC is a manufacturer, wholesaler, exporter and brand delivering quality garments and full-grain leather goods, plus custom manufacturing for businesses worldwide.",
};

// Icons stay fixed per offering position — only the title text is admin-editable,
// so a typo/rename can never point at a missing icon key.
const offeringIcons = ["tag", "cog", "layers", "box", "shirt", "package", "shield", "globe"] as const;

export default async function AboutPage() {
  const [content, stats] = await Promise.all([getAboutContent(), getCompanyStats()]);

  return (
    <main>
      {/* HERO */}
      <section className="pt-16 pb-20 sm:pb-24">
        <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-4 block">{content.hero.eyebrow}</span>
            <h1 className="text-[clamp(32px,5vw,52px)] font-medium tracking-tight leading-[1.1] max-w-[16ch] mb-6">
              {content.hero.heading}
            </h1>
            <p className="text-ink-muted text-[15px] leading-relaxed max-w-[52ch]">
              {content.hero.body}
            </p>
            <Button href="/quote" variant="accent" size="lg" className="mt-8">
              Start a Quote
            </Button>
          </div>
          <div
            className="relative aspect-[5/4] sm:aspect-[4/5] lg:aspect-[4/5] max-h-[420px] sm:max-h-[560px] lg:max-h-[620px] rounded-2xl border border-line overflow-hidden flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #EDEAE2 0%, #D9D5C8 35%, #D9B98C 70%, #B98A5C 100%)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="" aria-hidden className="w-2/5 h-2/5 object-contain opacity-90 mix-blend-multiply" />
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-16 sm:py-20 bg-bg-soft border-y border-line">
        <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16">
          <h2 className="text-[clamp(22px,3vw,30px)] font-medium tracking-tight leading-[1.2] max-w-[16ch]">
            {content.story.heading}
          </h2>
          <div className="text-ink-muted space-y-5 text-[15px] leading-relaxed max-w-[68ch]">
            {paragraphs(content.story.body).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="mb-12">
            <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-4 block">{content.offer.eyebrow}</span>
            <h2 className="text-[clamp(26px,3.6vw,38px)] font-medium tracking-tight max-w-[20ch]">
              {content.offer.heading}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.offer.offerings.map((item, i) => (
              <div key={i} className="border border-line rounded-2xl p-6 sm:p-7">
                <OfferIcon name={offeringIcons[i % offeringIcons.length]} />
                <h3 className="text-[15px] font-medium leading-snug mt-5">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 sm:py-24 bg-bg-soft border-y border-line">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard num={stats.years.num} label={stats.years.label} />
            <StatCard num={stats.orders.num} label={stats.orders.label} />
            <StatCard num={stats.minUnits.num} label={stats.minUnits.label} />
            <StatCard num={stats.turnaround.num} label={stats.turnaround.label} />
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="border border-line rounded-2xl p-10 sm:p-16 text-center max-w-[820px] mx-auto">
            <BracketLabel className="text-ink-muted mb-6">
              <span className="font-mono-ui text-[11px] uppercase tracking-wider">{content.closingCta.badge}</span>
            </BracketLabel>
            <h2 className="text-[clamp(24px,3.4vw,34px)] font-medium tracking-tight leading-[1.2] mb-4">
              {content.closingCta.heading}
            </h2>
            <p className="text-ink-muted text-[15px] leading-relaxed max-w-[52ch] mx-auto mb-8">
              {content.closingCta.body}
            </p>
            <Button href="/quote" variant="accent" size="lg">
              Start a Quote
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ num, label }: { num: string; label: string }) {
  return (
    <div className="border border-line rounded-xl p-6 sm:p-7 bg-bg">
      <div className="text-3xl sm:text-4xl font-medium tracking-tight">{num}</div>
      <div className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mt-2">{label}</div>
    </div>
  );
}

const iconPaths: Record<string, string> = {
  tag: "M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24H4a1 1 0 0 0-1 1v5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.83 0l4.59-4.59a2 2 0 0 0 0-2.82ZM7 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z",
  cog: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z",
  layers: "m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5",
  box: "M21 8a1 1 0 0 0-.5-.87l-8-4.5a1 1 0 0 0-1 0l-8 4.5A1 1 0 0 0 3 8v8a1 1 0 0 0 .5.87l8 4.5a1 1 0 0 0 1 0l8-4.5A1 1 0 0 0 21 16ZM3.3 7.3 12 12l8.7-4.7M12 12v9.5",
  shirt: "M8 3 4 6l2 3-1 2v10h14V11l-1-2 2-3-4-3-2 2h-2Z",
  package: "M3 9.5 12 5l9 4.5-9 4.5-9-4.5ZM3 9.5V17l9 4.5M21 9.5V17l-9 4.5M12 14v7.5",
  shield: "M12 2 4 5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V5l-8-3Zm-1.5 12.5L7 11l1.4-1.4 2.1 2.1 4.1-4.1L16 9Z",
  globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 0c2.5 2.5 3.8 5.7 3.8 10s-1.3 7.5-3.8 10c-2.5-2.5-3.8-5.7-3.8-10S9.5 4.5 12 2ZM2.5 9h19M2.5 15h19",
};

function OfferIcon({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-bg-soft">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d={iconPaths[name]} />
      </svg>
    </span>
  );
}
