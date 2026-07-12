import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-bg-soft border-t border-line">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-8 py-16">
          <div>
            <span className="block text-base mb-3">hhglobalcompany</span>
            <p className="text-ink-muted text-sm max-w-[34ch]">
              We prioritize durability and ethical sourcing above all. Every piece is a
              testament to functional longevity.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-4">Follow</h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li><Link href="/">Instagram</Link></li>
                <li><Link href="/">LinkedIn</Link></li>
                <li><Link href="/">Behance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-4">Legal</h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li><Link href="/about">Privacy Policy</Link></li>
                <li><Link href="/about">Terms of Service</Link></li>
                <li><Link href="/contact">Shipping Details</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-line py-5 flex flex-col lg:flex-row lg:justify-between gap-2 font-mono-ui text-[11px] uppercase tracking-wide text-ink-faint">
          <span>&copy; 2026 HH Global Company Workshop. All rights reserved.</span>
          <span>Karachi, Pakistan — Lat: 24.8607&deg; N, Lon: 67.0011&deg; E</span>
        </div>
      </div>
    </footer>
  );
}
