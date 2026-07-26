import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Tone = "ink" | "accent";
type Size = "sm" | "lg";

type Props = {
  tone?: Tone;
  size?: Size;
  href?: string;
  className?: string;
  "aria-label": string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "aria-label">;

const toneClasses: Record<Tone, string> = {
  ink: "bg-ink text-on-dark",
  accent: "bg-accent text-ink",
};

const sizeClasses: Record<Size, { wrapper: string; icon: number }> = {
  sm: { wrapper: "w-9 h-9", icon: 15 },
  lg: { wrapper: "w-[52px] h-[52px]", icon: 18 },
};

/**
 * The site's signature circular arrow badge, split out of app/page.tsx so the
 * `accent` tone (brass) can be reused for primary CTAs without duplicating
 * the inline SVG everywhere.
 */
export default function ArrowBadge({ tone = "ink", size = "lg", href, className = "", ...rest }: Props) {
  const { icon: iconSize, wrapper } = sizeClasses[size];
  const classes =
    `rounded-full inline-flex items-center justify-center shrink-0 transition-colors ${toneClasses[tone]} ${wrapper} ${className}`.trim();

  const icon = (
    <svg
      viewBox="0 0 24 24"
      width={iconSize}
      height={iconSize}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...(rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className">)}>
        {icon}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {icon}
    </button>
  );
}
