"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ProductImage, Variant } from "@/lib/types";

const fallbackGradients = [
  "linear-gradient(160deg,#EFEDE6,#D7D3C6)",
  "linear-gradient(160deg,#DDE0DA,#AEB3A8)",
  "linear-gradient(160deg,#E7D9C9,#B98A5C)",
  "linear-gradient(160deg,#F3D9A8,#9DACA6)",
  "linear-gradient(160deg,#D9CBB8,#8C6E4F)",
];

type Props = {
  categoryName: string;
  categoryHref?: string;
  productName: string;
  productType: string;
  description: string;
  variants: Variant[];
  images: ProductImage[];
  compact?: boolean;
};

/**
 * The whole product detail view. Clicking a style/finish option (like a color
 * swatch on a retail site) swaps the displayed image and carries that choice
 * into the "Request Quote" link — all driven by one shared selection state.
 * The gallery (thumbnails, arrows, zoom) is driven by a separate index so a
 * product can have several photos regardless of which style/finish is active.
 *
 * `compact` stacks everything in one column — used for the admin live preview,
 * which renders inside a narrow panel rather than the full page width.
 */
export default function ProductView({
  categoryName,
  categoryHref,
  productName,
  productType,
  description,
  variants,
  images,
  compact = false,
}: Props) {
  const [selected, setSelected] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasVariants = variants.length > 0;
  const active = hasVariants ? variants[selected] : undefined;

  const galleryImages: string[] = active?.imageUrl
    ? [active.imageUrl, ...images.map((img) => img.imageUrl)]
    : images.map((img) => img.imageUrl);
  const hasGallery = galleryImages.length > 1;
  const displayImageUrl = galleryImages[activeIndex] ?? null;

  useEffect(() => {
    setActiveIndex(0);
  }, [selected]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, galleryImages.length]);

  function goTo(direction: -1 | 1) {
    if (!hasGallery) return;
    setActiveIndex((i) => (i + direction + galleryImages.length) % galleryImages.length);
  }

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
      <div>
        <div
          tabIndex={0}
          role="img"
          aria-label={`${productName}${active ? " — " + active.name : ""} photo${
            hasGallery ? ` ${activeIndex + 1} of ${galleryImages.length}` : ""
          }`}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") goTo(-1);
            if (e.key === "ArrowRight") goTo(1);
          }}
          onClick={() => !compact && displayImageUrl && setLightboxOpen(true)}
          className={`relative aspect-[4/5] flex items-center justify-center font-mono-ui text-[11px] uppercase tracking-wide text-ink-faint outline-none focus-visible:ring-2 focus-visible:ring-ink ${
            !compact && displayImageUrl ? "cursor-zoom-in" : ""
          }`}
          style={
            displayImageUrl
              ? { backgroundImage: `url(${displayImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: fallbackGradients[selected % fallbackGradients.length] }
          }
        >
          {!displayImageUrl && `${productName}${active ? " — " + active.name : ""} photo`}

          {hasGallery && (
            <>
              <GalleryArrow direction="prev" onClick={(e) => { e.stopPropagation(); goTo(-1); }} />
              <GalleryArrow direction="next" onClick={(e) => { e.stopPropagation(); goTo(1); }} />
            </>
          )}
        </div>

        {hasGallery && (
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {galleryImages.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`View photo ${i + 1}`}
                aria-current={i === activeIndex}
                className={`w-14 h-14 shrink-0 rounded border bg-cover bg-center transition-opacity ${
                  i === activeIndex ? "border-ink" : "border-line opacity-60 hover:opacity-100"
                }`}
                style={{ backgroundImage: `url(${url})` }}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        {!compact && categoryHref ? (
          <nav aria-label="Breadcrumb" className="font-mono-ui text-[11.5px] uppercase tracking-wider text-ink-muted mb-3 flex items-center gap-2">
            <Link href={categoryHref} className="inline-flex items-center gap-1.5 hover:text-ink">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              {categoryName}
            </Link>
            <span>/</span>
            <span>{productType}</span>
          </nav>
        ) : (
          <span className="font-mono-ui text-[11.5px] uppercase tracking-wider text-ink-muted mb-3 block">
            {categoryName} / {productType}
          </span>
        )}
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

      {lightboxOpen && displayImageUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {hasGallery && (
            <>
              <GalleryArrow direction="prev" light onClick={(e) => { e.stopPropagation(); goTo(-1); }} />
              <GalleryArrow direction="next" light onClick={(e) => { e.stopPropagation(); goTo(1); }} />
            </>
          )}

          <div
            className="w-full h-full max-w-[1100px]"
            style={{
              backgroundImage: `url(${displayImageUrl})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function GalleryArrow({
  direction,
  onClick,
  light = false,
}: {
  direction: "prev" | "next";
  onClick: (e: React.MouseEvent) => void;
  light?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous photo" : "Next photo"}
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
        direction === "prev" ? "left-3" : "right-3"
      } ${
        light
          ? "bg-white/10 text-white hover:bg-white/20"
          : "bg-bg/85 border border-line text-ink hover:bg-bg"
      }`}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={direction === "prev" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );
}
