import Link from "next/link";

type Crumb = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm mb-8">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-ink-faint">/</span>}
            {item.href ? (
              <Link href={item.href} className="text-ink-muted hover:text-ink inline-flex items-center gap-1.5">
                {i === 0 && (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                )}
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-ink font-medium" : "text-ink-muted"}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
