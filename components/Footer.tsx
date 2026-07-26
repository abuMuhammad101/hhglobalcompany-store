import Link from "next/link";
import type { FooterContent } from "@/lib/content";

export default function Footer({ content }: { content: FooterContent }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-soft border-t border-line">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-8 py-16">
          <div>
            <span className="block text-base mb-3">H&amp;H Global</span>
            <p className="text-ink-muted text-sm max-w-[34ch]">
              {content.tagline}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-4">Follow</h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li><Link href={content.social.instagram}>Instagram</Link></li>
                <li><Link href={content.social.linkedin}>LinkedIn</Link></li>
                <li><Link href={content.social.behance}>Behance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-4">Legal</h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li><Link href="/terms#privacy">Privacy Policy</Link></li>
                <li><Link href="/terms#terms-of-sale">Terms of Service</Link></li>
                <li><Link href="/terms#shipping">Shipping Details</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-line py-5 flex flex-col lg:flex-row lg:justify-between gap-2 font-mono-ui text-[11px] uppercase tracking-wide text-ink-faint">
          <span>&copy; {year} {content.copyrightLine}</span>
          <span>{content.geoLine}</span>
        </div>
      </div>
    </footer>
  );
}
