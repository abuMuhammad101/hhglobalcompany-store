import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "HH Global Company manufactures garments and full-grain leather goods to wholesale specification, based in Karachi, Pakistan.",
};

export default function AboutPage() {
  return (
    <main className="py-16">
      <div className="max-w-[1320px] mx-auto px-6">
        <span className="font-mono-ui text-[11.5px] uppercase tracking-wider text-ink-muted mb-3 block">About</span>
        <h1 className="text-[clamp(30px,4.5vw,48px)] mb-6 max-w-[18ch]">
          A workshop built around exact specification.
        </h1>
        <div className="max-w-[62ch] text-ink-muted space-y-5 text-[15px] leading-relaxed">
          <p>
            HH Global Company manufactures garments and full-grain leather goods for wholesale buyers,
            from single-run boutique orders to recurring bulk contracts. Every piece is produced
            in-house, which means garments and leather goods can be quoted, adjusted and shipped
            together, on one timeline.
          </p>
          <p>
            We work in two disciplines under one roof: cut-and-sew garments (T-shirts,
            sweatshirts, sweatpants and hoodies), and hand-finished leather goods (wallets,
            clutches, card holders and belts) across plain, mild and plated finishes.
          </p>
          <p>
            Every quote reflects your exact quantity, material and finish — there is no fixed
            catalogue price. Minimum order quantity is 25 units per style.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-12 border-t border-line max-w-[720px]">
          <Stat num="12+" label="Years crafting" />
          <Stat num="1,400+" label="Orders fulfilled" />
          <Stat num="25" label="Unit minimum" />
          <Stat num="24 hrs" label="Avg. quote turnaround" />
        </div>
        <Link href="/quote" className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-ink text-on-dark font-medium mt-12">
          Start a Quote
        </Link>
      </div>
    </main>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-medium">{num}</div>
      <div className="text-xs text-ink-muted mt-1">{label}</div>
    </div>
  );
}
