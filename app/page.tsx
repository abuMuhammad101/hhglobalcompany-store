import Link from "next/link";
import { catalog } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const garments = catalog.find((c) => c.slug === "garments")!;
  const leather = catalog.find((c) => c.slug === "leather")!;

  return (
    <main>
      {/* HERO */}
      <section className="pt-16 pb-12">
        <div className="max-w-[1320px] mx-auto px-6">
          <span className="text-xl text-ink-faint mb-4 block">*</span>
          <h1 className="text-[clamp(38px,7.2vw,76px)] leading-[1.05] font-normal max-w-[16ch]">
            Precision garments &amp; full-grain leather goods.
          </h1>
          <div className="flex items-center gap-3 mt-8">
            <Link href="#categories" className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-ink text-on-dark font-medium">
              View Collection
            </Link>
            <Link href="#categories" aria-label="Scroll to collection" className="w-[52px] h-[52px] rounded-full bg-ink text-on-dark inline-flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </div>
          <div className="h-px bg-line relative mt-12 hairline-notch" />
        </div>
      </section>

      {/* CATEGORY HERO GRID */}
      <section id="categories" className="pt-0 pb-16">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-4">
            <Link
              href="/garments"
              className="relative aspect-[4/5] flex items-end p-6"
              style={{ background: "radial-gradient(120% 90% at 30% 10%, #EDEAE2 0%, #D9D5C8 55%, #B9B3A0 100%)" }}
            >
              <div className="text-ink">
                <span className="block font-mono-ui text-[11px] uppercase tracking-wider opacity-75 mb-2">Category 01</span>
                <span className="text-2xl">Garments</span>
              </div>
            </Link>
            <Link
              href="/leather"
              className="relative aspect-[4/5] flex items-end p-6"
              style={{ background: "radial-gradient(120% 90% at 60% 20%, #2A342F 0%, #16211C 55%, #0E1714 100%)" }}
            >
              <div className="text-on-dark">
                <span className="block font-mono-ui text-[11px] uppercase tracking-wider opacity-75 mb-2">Category 02</span>
                <span className="text-2xl">Leather Products</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CATALOGUE 01 — GARMENTS PREVIEW */}
      <section id="garments" className="py-16">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
            <div>
              <span className="font-mono-ui text-[11.5px] uppercase tracking-wider text-ink-muted mb-3 block">Catalogue — 01</span>
              <h2 className="text-[clamp(24px,3vw,32px)]">Premium Garments</h2>
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

      {/* CATALOGUE 02 — LEATHER (DARK PANEL) */}
      <section id="leather" className="py-16 bg-panel-dark text-on-dark">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
            <div>
              <span className="font-mono-ui text-[11.5px] uppercase tracking-wider text-on-dark-muted mb-3 block">Catalogue — 02</span>
              <h2 className="text-[clamp(24px,3vw,32px)]">Full Grain Leather</h2>
            </div>
            <Link href="/leather" className="font-mono-ui text-[12px] uppercase tracking-wide border-b border-on-dark self-start">
              View all leather goods
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 pt-8" style={{ borderTop: "1px solid var(--panel-line)" }}>
            {leather.products.map((p) => (
              <article key={p.slug}>
                <div
                  className="aspect-[4/3] mb-4 flex items-center justify-center font-mono-ui text-[11px] uppercase tracking-wide text-on-dark-muted"
                  style={{ background: "radial-gradient(120% 100% at 40% 10%, #2A342F 0%, #16211C 60%, #0E1714 100%)" }}
                >
                  {p.type} photo
                </div>
                <h3 className="text-[17px] font-medium mb-3">{p.type}</h3>
                <ul className="flex flex-col gap-2">
                  {(p.variants.length ? p.variants : ["Mild"]).map((v) => (
                    <li key={v} className="text-[13.5px] text-on-dark-muted pl-4 relative before:content-['•'] before:absolute before:left-0">
                      {v}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-[1320px] mx-auto px-6 text-center">
          <h2 className="text-[clamp(26px,4vw,36px)] mb-3">Have a bulk order in mind?</h2>
          <p className="text-ink-muted mb-8">Skip the browsing and tell us directly what you need.</p>
          <Link href="/quote" className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-ink text-on-dark font-medium">
            Start Your Quote
          </Link>
        </div>
      </section>
    </main>
  );
}
