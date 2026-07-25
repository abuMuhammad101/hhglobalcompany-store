import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Policies",
  description:
    "Shipping and lead times, returns and repairs, terms of sale, and our privacy policy for H&H Global LLC wholesale orders.",
};

const sections = [
  { id: "shipping", label: "Shipping & Lead Times" },
  { id: "returns", label: "Returns & Repairs" },
  { id: "terms-of-sale", label: "Terms of Sale" },
  { id: "privacy", label: "Privacy Policy" },
];

export default function TermsPage() {
  return (
    <main className="py-16">
      <div className="max-w-[1320px] mx-auto px-6">
        <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-3 block">Legal</span>
        <h1 className="text-[clamp(32px,5vw,52px)] font-medium tracking-tight mb-4 max-w-[18ch]">
          Terms &amp; Policies
        </h1>
        <p className="text-ink-muted max-w-[60ch] mb-14 text-[15px] leading-relaxed">
          Shipping and lead times, returns and repairs, terms of sale, and how we handle your
          information — everything that governs a wholesale order with H&amp;H Global LLC.
        </p>

        <div className="grid lg:grid-cols-[220px_1fr] gap-10 lg:gap-16">
          <nav aria-label="Sections" className="hidden lg:block">
            <ul className="sticky top-24 space-y-1 border-l border-line">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block pl-4 py-1.5 text-sm text-ink-muted hover:text-ink hover:border-ink border-l-[1.5px] border-transparent -ml-px transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-16 max-w-[68ch]">
            <section id="shipping" className="scroll-mt-24">
              <h2 className="text-[clamp(22px,3vw,28px)] font-medium tracking-tight mb-6">
                Shipping &amp; Lead Times
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <FactCard num="50 pcs" label="Minimum order quantity" />
                <FactCard num="3–6 wks" label="Standard lead time at MOQ" />
              </div>
              <div className="text-ink-muted space-y-4 text-[15px] leading-relaxed">
                <p>
                  We currently supply wholesale orders only, with a Minimum Order Quantity (MOQ)
                  of 50 pieces for both custom-made products and our in-house branded products
                  intended for resale.
                </p>
                <p>
                  Standard production lead times for MOQ orders range from 3 to 6 weeks. Lead
                  times for quantities exceeding the MOQ may vary depending on order size,
                  production requirements, and shipping carrier availability.
                </p>
              </div>
            </section>

            <section id="returns" className="scroll-mt-24">
              <h2 className="text-[clamp(22px,3vw,28px)] font-medium tracking-tight mb-6">
                Returns &amp; Repairs
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <FactCard num="14 days" label="Window to report defects" />
                <FactCard num="100 pcs" label="Threshold for buyer-side freight" />
              </div>
              <div className="text-ink-muted space-y-4 text-[15px] leading-relaxed">
                <p>
                  All custom-made and made-to-order products are considered final sale and are
                  not eligible for return or exchange.
                </p>
                <p>
                  Customers must inspect all goods upon receipt. Any claim for workmanship
                  defects must be submitted in writing, along with clear photographs of the
                  issue, within 14 days of delivery.
                </p>
                <p>
                  If products are found to have workmanship defects, we will repair or replace
                  the defective items at our discretion.
                </p>
                <p>
                  For defective quantities of up to 100 pieces, all replacement and shipping
                  costs will be borne by us.
                </p>
                <p>
                  For defective quantities exceeding 100 pieces, replacement items will be
                  provided; however, applicable freight and shipping charges may be the
                  responsibility of the buyer, subject to mutual agreement and the selected
                  shipping method.
                </p>
                <p>
                  Claims submitted after the 14-day inspection period may not be eligible for
                  repair, replacement, or compensation.
                </p>
              </div>
            </section>

            <section id="terms-of-sale" className="scroll-mt-24">
              <h2 className="text-[clamp(22px,3vw,28px)] font-medium tracking-tight mb-6">
                Terms of Sale
              </h2>
              <div className="text-ink-muted space-y-4 text-[15px] leading-relaxed">
                <p>
                  Pricing for custom products is quoted based on the customer&rsquo;s
                  specifications, materials, and order requirements.
                </p>
                <p>
                  Payments can be made securely through Stripe Checkout or via bank transfer.
                  Full payment terms will be provided with the quotation.
                </p>
                <p>
                  Applicable taxes, customs duties, import fees, and other government charges
                  are the responsibility of the buyer unless otherwise stated in writing.
                </p>
              </div>
            </section>

            <section id="privacy" className="scroll-mt-24">
              <h2 className="text-[clamp(22px,3vw,28px)] font-medium tracking-tight mb-6">
                Privacy Policy
              </h2>
              <div className="text-ink-muted space-y-4 text-[15px] leading-relaxed">
                <p>
                  We collect and use customer information solely for order processing, customer
                  support, and business communications.
                </p>
                <p>
                  We do not sell, rent, or share personal information with third parties for
                  marketing purposes. Customer information is handled with appropriate security
                  measures and used only as necessary to provide our products and services.
                </p>
              </div>
            </section>

            <div className="pt-8 border-t border-line">
              <p className="text-ink-muted text-sm mb-5">
                Questions about any of the above? We&rsquo;re happy to walk through it before you order.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-ink text-on-dark text-sm font-medium"
              >
                Contact Us
              </Link>
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
