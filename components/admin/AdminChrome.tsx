"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/quotes", label: "Quotes" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/content", label: "Content" },
];

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-line">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-8 h-[60px] overflow-x-auto">
          <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted shrink-0">
            Admin
          </span>
          <nav className="flex gap-6 shrink-0">
            {NAV.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    active ? "text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-5 shrink-0">
            <Link href="/" className="text-xs text-ink-muted hover:text-ink whitespace-nowrap">
              &larr; Back to site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-ink-muted hover:text-red-700 whitespace-nowrap"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
