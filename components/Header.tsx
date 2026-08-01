"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";

function navLinkClass(active: boolean) {
  return [
    "text-[15px] font-medium pb-[3px] border-b-[1.5px] transition-colors",
    active ? "text-ink border-ink" : "text-ink-muted border-transparent hover:text-ink",
  ].join(" ");
}

type NavCategory = { slug: string; name: string };

export default function Header({
  logoUrl,
  brandName,
  categories,
}: {
  logoUrl?: string | null;
  brandName: string;
  categories: NavCategory[];
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const logoSrc = logoUrl || "/logo.jpg";

  const productActive =
    pathname.startsWith("/product") || categories.some((c) => pathname.startsWith(`/${c.slug}`));
  const aboutActive = pathname.startsWith("/about");
  const quoteActive = pathname.startsWith("/quote");

  return (
    <header className="border-b border-line sticky top-0 bg-bg/95 backdrop-blur z-50">
      <div className="max-w-[1320px] mx-auto px-6 h-[76px] flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" className="h-8 w-auto" />
          <span className="font-semibold text-[16px] tracking-tight">{brandName}</span>
        </Link>

        <nav className="hidden lg:block" aria-label="Primary">
          <ul className="flex gap-9 items-center">
            <li
              className="relative"
              onMouseLeave={() => setProductOpen(false)}
            >
              <button
                type="button"
                className={navLinkClass(productActive) + " inline-flex items-center gap-1"}
                aria-expanded={productOpen}
                aria-haspopup="true"
                onClick={() => setProductOpen((v) => !v)}
              >
                Product
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {productOpen && (
                <div className="absolute top-full left-0 pt-3">
                  <div className="bg-bg border border-line rounded-lg shadow-lg py-2 min-w-[200px]">
                    {categories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/${c.slug}`}
                        className="block px-4 py-2.5 text-[15px] font-medium hover:bg-bg-soft"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
            <li><Link href="/about" className={navLinkClass(aboutActive)}>About</Link></li>
            <li><Link href="/quote" className={navLinkClass(quoteActive)}>Request Quote</Link></li>
          </ul>
        </nav>

        <div className="hidden lg:block shrink-0">
          <Button href="/contact" size="md">
            Contact Us
          </Button>
        </div>

        <button
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-line shrink-0"
          aria-expanded={menuOpen}
          aria-label="Open menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-line px-6 py-5">
          <span className="block pt-2 pb-1 font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted">Product</span>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="block py-3 pl-3 border-b border-line font-medium text-[15px]"
              onClick={() => setMenuOpen(false)}
            >
              {c.name}
            </Link>
          ))}
          <Link href="/about" className="block py-3 border-b border-line font-medium text-[15px]" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/quote" className="block py-3 border-b border-line font-medium text-[15px]" onClick={() => setMenuOpen(false)}>Request Quote</Link>
          <Button href="/contact" size="lg" className="mt-5 w-full">
            Contact Us
          </Button>
        </div>
      )}
    </header>
  );
}
