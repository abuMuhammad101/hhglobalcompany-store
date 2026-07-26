import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "accent" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  href?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-11 px-6 text-[14px]",
  lg: "h-[52px] px-8 text-base",
};

const variantClasses: Record<Exclude<Variant, "ghost">, string> = {
  primary: "bg-ink text-on-dark hover:opacity-85",
  accent: "bg-accent text-ink hover:brightness-95",
  secondary: "bg-bg-soft border border-line text-ink hover:border-ink-faint",
  outline: "border border-line text-ink hover:border-ink",
};

/**
 * Shared button used across the public storefront. Renders a <Link> when
 * `href` is passed, otherwise a real <button>. `ghost` ignores size/rounding
 * — it's the existing underline text-link look, not a pill.
 */
export default function Button({ variant = "primary", size = "md", className = "", children, href, ...rest }: Props) {
  const classes =
    variant === "ghost"
      ? `font-mono-ui text-[12px] uppercase tracking-wide border-b border-ink pb-[2px] disabled:opacity-60 ${className}`.trim()
      : `inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} {...(rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className">)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
