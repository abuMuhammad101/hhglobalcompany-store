"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ProductImage, Variant } from "@/lib/types";
import Button from "@/components/Button";

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
  material?: string;
  variants: Variant[];
  images: ProductImage[];
  featuredImage?: string | null;
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
  material,
  variants,
  images,
  featuredImage,
  compact = false,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const ZOOM_MIN = 1;
  const ZOOM_MAX = 3;
  const ZOOM_STEP = 0.5;
  function zoomIn() {
    setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(1)));
  }
  function zoomOut() {
    setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(1)));
  }

  const hasVariants = variants.length > 0;
  // No style/finish is pre-selected — the page opens on the plain Featured
  // Image, and only swaps to a variant's own photo once the shopper actually
  // picks one, the same way a color swatch works.
  const active = hasVariants && selected !== null ? variants[selected] : undefined;

  const detailImages = images.map((img) => img.imageUrl);
  const galleryImages: string[] = active?.imageUrl
    ? [active.imageUrl, ...detailImages]
    : ([featuredImage, ...detailImages].filter(Boolean) as string[]);
  const hasGallery = galleryImages.length > 1;
  const displayImageUrl = galleryImages[activeIndex] ?? null;

  function goTo(direction: -1 | 1) {
    if (!hasGallery) return;
    setActiveIndex((i) => (i + direction + galleryImages.length) % galleryImages.length);
  }

  useEffect(() => {
    setActiveIndex(0);
  }, [selected]);

  // Reset zoom whenever the lightbox opens or the photo changes, so a shopper
  // never lands on the next/prev photo still zoomed in from the last one.
  useEffect(() => {
    setZoom(1);
  }, [activeIndex, lightboxOpen]);

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

  const quoteHref = `/quote?type=${encodeURIComponent(productType)}${
    active ? `&variant=${encodeURIComponent(active.name)}` : ""
  }`;

  return (
    <div
      className={
        compact
          ? "grid grid-cols-1 gap-6 min-w-0"
          : "max-w-[1320px] mx-auto px-6 grid lg:grid-cols-2 gap-10"
      }
    >
      <div className="min-w-0">
        <div
          className={`relative aspect-[4/5] w-full max-h-[55vh] overflow-hidden rounded-2xl border border-line ${
            !compact && displayImageUrl ? "cursor-zoom-in" : ""
          }`}
        >
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
            className="absolute inset-0 flex items-center justify-center font-mono-ui text-[11px] uppercase tracking-wide text-ink-faint outline-none focus-visible:ring-2 focus-visible:ring-ink"
            style={
              displayImageUrl
                ? { backgroundImage: `url(${displayImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                : { background: fallbackGradients[(selected ?? 0) % fallbackGradients.length] }
            }
          >
            {!displayImageUrl && `${productName}${active ? " — " + active.name : ""} photo`}
          </div>

          {hasGallery && (
            <>
              <GalleryArrow direction="prev" onClick={(e) => { e.stopPropagation(); goTo(-1); }} />
              <GalleryArrow direction="next" onClick={(e) => { e.stopPropagation(); goTo(1); }} />
            </>
          )}
        </div>

        {hasGallery && (
          <div className="flex gap-2.5 mt-3 overflow-x-auto">
            {galleryImages.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`View photo ${i + 1}`}
                aria-current={i === activeIndex}
                className={`w-16 h-16 shrink-0 rounded-xl border-2 bg-cover bg-center transition-all ${
                  i === activeIndex ? "border-accent" : "border-line opacity-60 hover:opacity-100"
                }`}
                style={{ backgroundImage: `url(${url})` }}
              />
            ))}
          </div>
        )}

        {hasVariants && (
          <div className="mt-5">
            <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-2 block">
              Style / Finish{active ? ` — ${active.name}` : ""}
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
      </div>

      <div className="min-w-0">
        {!compact && categoryHref ? (
          <nav aria-label="Breadcrumb" className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-3 flex items-center gap-2">
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
          <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-3 block">
            {categoryName} / {productType}
          </span>
        )}
        <h1 className="text-[clamp(28px,4vw,44px)] font-medium tracking-tight mb-4 break-words">{productName}</h1>
        <p className="text-ink-muted max-w-[50ch] mb-8 break-words">{description}</p>

        <div className="border border-line rounded-2xl p-6 mb-8 grid grid-cols-2 gap-x-6 gap-y-4">
          <DetailRow label="Category" value={categoryName} />
          <DetailRow label="Product Type" value={productType} />
          {active && <DetailRow label="Style / Finish" value={active.name} />}
          {material && <DetailRow label="Material" value={material} />}
        </div>

        <Button href={quoteHref} variant="accent" size="lg">
          {hasVariants ? "Request Quote for This Style" : "Request Quote for This Product"}
        </Button>
      </div>

      {lightboxOpen && displayImageUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div
            className="absolute top-5 left-5 z-10 flex items-center gap-1 bg-white/10 rounded-full p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Zoom out"
              onClick={zoomOut}
              disabled={zoom <= ZOOM_MIN}
              className="w-8 h-8 rounded-full text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-30"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14" /></svg>
            </button>
            <span className="text-white text-xs font-mono-ui w-10 text-center select-none">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              aria-label="Zoom in"
              onClick={zoomIn}
              disabled={zoom >= ZOOM_MAX}
              className="w-8 h-8 rounded-full text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-30"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            </button>
          </div>

          <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
            {hasGallery && (
              <>
                <GalleryArrow direction="prev" light onClick={(e) => { e.stopPropagation(); goTo(-1); }} />
                <GalleryArrow direction="next" light onClick={(e) => { e.stopPropagation(); goTo(1); }} />
              </>
            )}

            <div
              className="w-full h-full max-w-[1100px] overflow-auto flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImageUrl}
                alt=""
                draggable={false}
                onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
                className={`max-w-full max-h-full object-contain transition-transform duration-200 select-none ${
                  zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
          </div>

          {(hasGallery || hasVariants) && (
            <div
              className="w-full max-w-[1100px] shrink-0 pt-4"
              onClick={(e) => e.stopPropagation()}
            >
              {hasGallery && (
                <div className="flex gap-2.5 justify-center overflow-x-auto mb-3">
                  {galleryImages.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-label={`View photo ${i + 1}`}
                      aria-current={i === activeIndex}
                      className={`w-14 h-14 shrink-0 rounded-lg border-2 bg-cover bg-center transition-all ${
                        i === activeIndex ? "border-accent" : "border-white/30 opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundImage: `url(${url})` }}
                    />
                  ))}
                </div>
              )}

              {hasVariants && (
                <div className="flex flex-wrap gap-2 justify-center" role="radiogroup" aria-label="Style or finish">
                  {variants.map((v, i) => (
                    <button
                      key={v.id ?? v.name}
                      type="button"
                      role="radio"
                      aria-checked={i === selected}
                      onClick={() => setSelected(i)}
                      className={`border px-3.5 py-1.5 text-sm rounded-full transition-colors ${
                        i === selected
                          ? "border-white bg-white text-ink"
                          : "border-white/30 text-white hover:border-white/60"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-faint mb-1">{label}</div>
      <div className="text-[14px] text-ink font-medium break-words">{value}</div>
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
