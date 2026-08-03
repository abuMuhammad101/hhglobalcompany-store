import Link from "next/link";

/**
 * A Style/Finish option rendered as a navigational pill — clicking it goes to
 * that variant's own page, rather than swapping a photo in place like the
 * old single-page toggle did. The small arrow badge signals "this goes
 * somewhere" (reusing the site's circular-arrow motif) instead of looking
 * like the old select-in-place pill.
 */
export default function VariantLinkPill({ href, label, active = false }: { href?: string; label: string; active?: boolean }) {
  const content = (
    <>
      <span>{label}</span>
      {href && (
        <span className="w-6 h-6 rounded-full bg-ink text-on-dark inline-flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-ink transition-colors">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      )}
    </>
  );

  if (!href) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-ink bg-ink text-on-dark pl-3.5 pr-3.5 py-1.5 text-sm">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full border pl-3.5 pr-1.5 py-1.5 text-sm transition-colors ${
        active ? "border-ink" : "border-line hover:border-ink-faint"
      }`}
    >
      {content}
    </Link>
  );
}
