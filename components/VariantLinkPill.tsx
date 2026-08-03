import Link from "next/link";
import { fallbackGradients } from "@/lib/fallbackGradients";

type Props = {
  href?: string;
  label: string;
  imageUrl?: string | null;
  active?: boolean;
  fallbackIndex?: number;
};

/**
 * A Style/Finish option rendered as a navigational card — clicking it goes to
 * that variant's own page, rather than swapping a photo in place like the
 * old single-page toggle did. Carries a thumbnail of the variant's own photo
 * so a shopper can tell options apart before clicking, not just by name.
 */
export default function VariantLinkPill({ href, label, imageUrl, active = false, fallbackIndex = 0 }: Props) {
  const thumb = (
    <div
      className="w-16 h-16 rounded-xl shrink-0 bg-cover bg-center border border-line/60"
      style={
        imageUrl
          ? { backgroundImage: `url(${imageUrl})` }
          : { background: fallbackGradients[fallbackIndex % fallbackGradients.length] }
      }
    />
  );

  if (!href) {
    return (
      <span className="flex items-center gap-3 rounded-2xl border border-ink bg-ink text-on-dark p-3">
        {thumb}
        <span className="text-sm font-medium">{label}</span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-2xl border p-3 transition-colors ${
        active ? "border-ink" : "border-line hover:border-ink-faint"
      }`}
    >
      {thumb}
      <span className="flex-1 min-w-0 text-sm font-medium truncate">{label}</span>
      <span className="w-8 h-8 rounded-full bg-ink text-on-dark inline-flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-ink transition-colors">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
