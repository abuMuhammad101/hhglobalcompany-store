"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/garments", label: "Garments" },
  { href: "/leather", label: "Leather Products" },
  { href: "/quote", label: "Request Quote" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("--:--:-- GMT+5");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const pkt = new Date(utc + 5 * 3600000);
      const pad = (n: number) => String(n).padStart(2, "0");
      setTime(`${pad(pkt.getHours())}:${pad(pkt.getMinutes())}:${pad(pkt.getSeconds())} GMT+5`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="border-b border-line sticky top-0 bg-bg/95 backdrop-blur z-50">
      <div className="max-w-[1320px] mx-auto px-6 h-[72px] flex items-center justify-between gap-6">
        <Link href="/" className="font-semibold text-[15px] tracking-tight">
          hhglobalcompany
        </Link>

        <nav className="hidden lg:block" aria-label="Primary">
          <ul className="flex gap-8 items-center">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-sm pb-[3px] ${
                      active
                        ? "border-b-[1.5px] border-ink"
                        : "border-b-[1.5px] border-transparent hover:text-ink-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden lg:flex items-center gap-6">
          <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted">{time}</span>
          <Link href="/quote" className="font-mono-ui text-[11px] uppercase tracking-wider border-b border-ink pb-[2px]">
            Enquire
          </Link>
        </div>

        <button
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-line"
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
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`block py-3 border-b border-line font-medium ${active ? "text-ink" : "text-ink-muted"}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/quote" className="mt-5 inline-flex items-center justify-center w-full h-[52px] rounded-full bg-ink text-on-dark font-medium">
            Enquire
          </Link>
        </div>
      )}
    </header>
  );
}
