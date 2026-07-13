"use client";

import { useState } from "react";
import Link from "next/link";
import type { Variant } from "@/lib/types";

const fallbackGradients = [
  "linear-gradient(160deg,#EFEDE6,#D7D3C6)",
  "linear-gradient(160deg,#DDE0DA,#AEB3A8)",
  "linear-gradient(160deg,#E7D9C9,#B98A5C)",
  "linear-gradient(160deg,#F3D9A8,#9DACA6)",
  "linear-gradient(160deg,#D9CBB8,#8C6E4F)",
];

type Props = {
  categoryName: string;
  productName: string;
  productType: string;
  description: string;
  variants: Variant[];
  productImageUrl?: string | null;
  compact?: boolean;
};

/**
 * The whole product detail view. Clicking a style/finish option (like a color
 * swatch on a retail site) swaps the displayed image and carries that choice
 * into the "Request Quote" link — all driven by one shared selection state.
 *
 * `compact` stacks everything in one column — used for the admin live preview,
 * which renders inside a narrow panel rather than the full page width.
 */
export default function ProductView({
  categoryName,
  productName,
  productType,
  description,
  variants,
  productImageUrl,
  compact = false,
}: Props) {
  const [selected, setSelected] = useState(0);
  const hasVariants = variants.length > 0;
  const active = hasVariants ? variants[selected] : undefined;
  const displayImageUrl = active?.imageUrl ?? productImageUrl ?? null;

  const quoteHref = `/quote?type=${encodeURIComponent(productType)}${
    active ? `&variant=${encodeURIComponent(active.name)}` : ""
  }`;

  return (
    <div
      className={
        compact
          ? "grid grid-cols-1 gap-6"
          : "max-w-[1320px] mx-auto px-6 grid lg:grid-cols-2 gap-10"
      }
    >
      <div
        className="aspect-[4/5] flex items-center justify-center font-mono-ui text-[11px] uppercase tracking-wide text-ink-faint"
        style={
          displayImageUrl
            ? { backgroundImage: `url(${displayImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: fallbackGradients[selected % fallbackGradients.length] }
        }
      >
        {!displayImageUrl && `${productName}${active ? " — " + active.name : ""} photo`}
      </div>

      <div>
        <span className="font-mono-ui text-[11.5px] uppercase tracking-wider text-ink-muted mb-3 block">
          {categoryName} / {productType}
        </span>
        <h1 className="text-[clamp(28px,4vw,44px)] mb-4">{productName}</h1>
        <p className="text-ink-muted max-w-[50ch] mb-8">{description}</p>

        {hasVariants && (
          <div className="mb-8">
            <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-2 block">
              Style / Finish — {active!.name}
            </span>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Style or finish">
              {variants.map((v, i) => (
                <button
                  key={v.id ?? v.name}
                  type="button"
                  role="radio"
                  aria-checked={i === selected}
                  onClick={() => setSelected(i)}
                  className={`border px-3.5 py-1.5 text-sm rounded-full transition-colors ${
                    i === selected
                      ? "border-ink bg-ink text-on-dark"
                      : "border-line text-ink hover:border-ink-faint"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <Link
          href={quoteHref}
          className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-ink text-on-dark font-medium"
        >
          {hasVariants ? "Request Quote for This Style" : "Request Quote for This Product"}
        </Link>
      </div>
    </div>
  );
}
