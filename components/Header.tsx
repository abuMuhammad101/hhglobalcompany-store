"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
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
            <li><Link href="/garments" className="text-sm hover:text-ink-muted">Garments</Link></li>
            <li><Link href="/leather" className="text-sm hover:text-ink-muted">Leather Products</Link></li>
            <li><Link href="/quote" className="text-sm border-b-[1.5px] border-ink pb-[3px]">Request Quote</Link></li>
          </ul>
        </nav>

        <div className="hidden lg:flex items-center gap-6">
          <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted">
            Status: In Production
          </span>
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
          <Link href="/garments" className="block py-3 border-b border-line font-medium" onClick={() => setMenuOpen(false)}>Garments</Link>
          <Link href="/leather" className="block py-3 border-b border-line font-medium" onClick={() => setMenuOpen(false)}>Leather Products</Link>
          <Link href="/quote" className="block py-3 border-b border-line font-medium" onClick={() => setMenuOpen(false)}>Request Quote</Link>
          <Link href="/quote" className="mt-5 inline-flex items-center justify-center w-full h-[52px] rounded-full bg-ink text-on-dark font-medium">
            Enquire
          </Link>
        </div>
      )}
    </header>
  );
}
