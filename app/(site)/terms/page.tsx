import type { Metadata } from "next";
import { getTermsContent, paragraphs } from "@/lib/content";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terms & Policies",
  description:
    "Shipping and lead times, returns and repairs, terms of sale, and our privacy policy for H&H Global LLC wholesale orders.",
};

export default async function TermsPage() {
  const content = await getTermsContent();

  return (
    <main className="py-16">
      <div className="max-w-[1320px] mx-auto px-6">
        <Reveal>
          <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-3 block">{content.eyebrow}</span>
          <h1 className="text-[clamp(32px,5vw,52px)] font-medium tracking-tight mb-4 max-w-[18ch]">
            {content.heading}
          </h1>
          <p className="text-ink-muted max-w-[60ch] mb-14 text-[15px] leading-relaxed">
            {content.intro}
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[220px_1fr] gap-10 lg:gap-16">
          <nav aria-label="Sections" className="hidden lg:block">
            <ul className="sticky top-24 space-y-1 border-l border-line">
              {content.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block pl-4 py-1.5 text-sm text-ink-muted hover:text-ink hover:border-ink border-l-[1.5px] border-transparent -ml-px transition-colors"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-16 max-w-[68ch]">
            {content.sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <Reveal>
                  <h2 className="text-[clamp(22px,3vw,28px)] font-medium tracking-tight mb-6">
                    {s.heading}
                  </h2>
                  {s.factCards.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {s.factCards.map((f) => (
                        <FactCard key={f.label} num={f.num} label={f.label} />
                      ))}
                    </div>
                  )}
                  <div className="text-ink-muted space-y-4 text-[15px] leading-relaxed">
                    {paragraphs(s.body).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </Reveal>
              </section>
            ))}

            <div className="pt-8 border-t border-line">
              <p className="text-ink-muted text-sm mb-5">
                {content.closingNote}
              </p>
              <Button href="/contact" size="md">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FactCard({ num, label }: { num: string; label: string }) {
  return (
    <div className="border border-line rounded-xl p-5">
      <div className="text-2xl font-medium tracking-tight">{num}</div>
      <div className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mt-1.5">{label}</div>
    </div>
  );
}
