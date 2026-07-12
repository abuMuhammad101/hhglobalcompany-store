import Link from "next/link";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="border-b border-line">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-8 h-[60px]">
          <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted">
            Admin
          </span>
          <nav className="flex gap-6">
            <Link href="/admin/quotes" className="text-sm font-medium hover:text-ink-muted">
              Quotes
            </Link>
            <Link href="/admin/products" className="text-sm font-medium hover:text-ink-muted">
              Products
            </Link>
            <Link href="/admin/categories" className="text-sm font-medium hover:text-ink-muted">
              Categories
            </Link>
          </nav>
          <Link href="/" className="ml-auto text-xs text-ink-muted hover:text-ink">
            &larr; Back to site
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
