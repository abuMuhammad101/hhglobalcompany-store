"use client";

import { useEffect, useState } from "react";
import type { Variant } from "@/lib/types";
import { fallbackGradients } from "@/lib/fallbackGradients";
import Button from "@/components/Button";
import ProductBreadcrumb from "@/components/ProductBreadcrumb";
import VariantLinkPill from "@/components/VariantLinkPill";
import PhotoLightbox from "@/components/PhotoLightbox";
import Reveal from "@/components/Reveal";

type Props = {
  categoryName: string;
  categoryHref: string;
  productSlug: string;
  productName: string;
  productType: string;
  description: string;
  material?: string;
  variants: Variant[];
  activeVariant: Variant;
};

/**
 * The /product/[slug]/[variant] page — scoped entirely to one Style/Finish
 * option. The top viewer shows only the *currently selected* photo set: the
 * variant's own default photo until a color is picked, then that color's own
 * photos only (its cover photo plus any extra photos added for it) — never
 * another color's photos. Further down, "Product Details Gallery" collects
 * every photo across *all* of this variant's colors in one place (each
 * color's cover + its extras) — a browse-everything view, independent of
 * whichever color is currently selected up top, with its own lightbox so
 * browsing one set never wraps into the other's. The product's generic
 * Detail Photos (spec/detail shots not tied to any color) live on the base
 * product page instead, not duplicated here.
 */
export default function ProductVariantView({
  categoryName,
  categoryHref,
  productSlug,
  productName,
  productType,
  description,
  material,
  variants,
  activeVariant,
}: Props) {
  const hasColors = Boolean(activeVariant.colors && activeVariant.colors.length > 0);
  const [selectedColorName, setSelectedColorName] = useState<string | null>(null);
  const activeColor = activeVariant.colors?.find((c) => c.name === selectedColorName);

  const currentPhotos: string[] = activeColor
    ? [activeColor.imageUrl, ...(activeColor.images ?? []).map((img) => img.imageUrl)]
    : activeVariant.imageUrl
      ? [activeVariant.imageUrl]
      : [];
  const hasVariantGallery = currentPhotos.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const displayImageUrl = currentPhotos[activeIndex] ?? null;

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedColorName]);

  function goTo(direction: -1 | 1) {
    if (!hasVariantGallery) return;
    setActiveIndex((i) => (i + direction + currentPhotos.length) % currentPhotos.length);
  }

  const detailImages = (activeVariant.colors ?? []).flatMap((c) => [
    c.imageUrl,
    ...(c.images ?? []).map((img) => img.imageUrl),
  ]);
  const [detailIndex, setDetailIndex] = useState(0);
  const [detailLightboxOpen, setDetailLightboxOpen] = useState(false);

  const quoteHref = `/quote?type=${encodeURIComponent(productType)}&variant=${encodeURIComponent(activeVariant.name)}${
    selectedColorName ? `&color=${encodeURIComponent(selectedColorName)}` : ""
  }`;

  return (
    <>
      <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-2 gap-10">
        <div className="min-w-0">
          <div
            className={`relative aspect-[4/5] w-full max-h-[55vh] overflow-hidden rounded-2xl border border-line ${
              displayImageUrl ? "cursor-zoom-in" : ""
            }`}
          >
            <div
              tabIndex={0}
              role="img"
              aria-label={`${productName} — ${activeVariant.name}${selectedColorName ? ` — ${selectedColorName}` : ""} photo`}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") goTo(-1);
                if (e.key === "ArrowRight") goTo(1);
              }}
              onClick={() => displayImageUrl && setLightboxOpen(true)}
              className="absolute inset-0 flex items-center justify-center font-mono-ui text-[11px] uppercase tracking-wide text-ink-faint outline-none focus-visible:ring-2 focus-visible:ring-ink"
              style={
                displayImageUrl
                  ? { backgroundImage: `url(${displayImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : { background: fallbackGradients[1] }
              }
            >
              {!displayImageUrl && `${productName} — ${activeVariant.name} photo`}
            </div>

            {hasVariantGallery && (
              <>
                <GalleryArrow direction="prev" onClick={(e) => { e.stopPropagation(); goTo(-1); }} />
                <GalleryArrow direction="next" onClick={(e) => { e.stopPropagation(); goTo(1); }} />
              </>
            )}
          </div>

          {hasVariantGallery && (
            <div className="flex gap-2.5 mt-3 overflow-x-auto">
              {currentPhotos.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={selectedColorName ? `View ${selectedColorName} photo ${i + 1}` : `View photo ${i + 1}`}
                  aria-current={i === activeIndex}
                  className={`w-16 h-16 shrink-0 rounded-xl border-2 bg-cover bg-center transition-all ${
                    i === activeIndex ? "border-accent" : "border-line opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundImage: `url(${url})` }}
                />
              ))}
            </div>
          )}

          {hasColors && (
            <div className="mt-5">
              <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-2 block">
                Color{selectedColorName ? ` — ${selectedColorName}` : ""}
              </span>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color">
                {activeVariant.colors!.map((c) => (
                  <button
                    key={c.id ?? c.name}
                    type="button"
                    role="radio"
                    aria-checked={c.name === selectedColorName}
                    onClick={() => setSelectedColorName(c.name)}
                    className={`border px-3.5 py-1.5 text-sm rounded-full transition-colors ${
                      c.name === selectedColorName
                        ? "border-ink bg-ink text-on-dark"
                        : "border-line text-ink hover:border-ink-faint"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <ProductBreadcrumb
            items={[
              { label: categoryName, href: categoryHref },
              { label: productType, href: `/product/${productSlug}` },
              { label: activeVariant.name },
            ]}
          />
          <h1 className="text-[clamp(28px,4vw,44px)] font-medium tracking-tight mb-4 break-words">{productName}</h1>
          <p className="text-ink-muted max-w-[50ch] mb-6 break-words">{description}</p>

          {variants.length > 1 && (
            <div className="mb-8">
              <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-2 block">
                Style / Finish — {activeVariant.name}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {variants.map((v, i) =>
                  v.slug === activeVariant.slug ? (
                    <VariantLinkPill key={v.id ?? v.slug} label={v.name} imageUrl={v.imageUrl} fallbackIndex={i} active />
                  ) : (
                    <VariantLinkPill
                      key={v.id ?? v.slug}
                      href={`/product/${productSlug}/${v.slug}`}
                      label={v.name}
                      imageUrl={v.imageUrl}
                      fallbackIndex={i}
                    />
                  )
                )}
              </div>
            </div>
          )}

          <div className="border border-line rounded-2xl p-6 mb-8 grid grid-cols-2 gap-x-6 gap-y-4">
            <DetailRow label="Category" value={categoryName} />
            <DetailRow label="Product Type" value={productType} />
            <DetailRow label="Style / Finish" value={activeVariant.name} />
            {selectedColorName && <DetailRow label="Color" value={selectedColorName} />}
            {material && <DetailRow label="Material" value={material} />}
          </div>

          <Button href={quoteHref} variant="accent" size="lg">
            Request Quote for This Style
          </Button>
        </div>

        {lightboxOpen && displayImageUrl && (
          <PhotoLightbox
            images={currentPhotos}
            activeIndex={activeIndex}
            onIndexChange={setActiveIndex}
            onClose={() => setLightboxOpen(false)}
            extraControls={
              hasColors ? (
                <div className="flex flex-wrap gap-2 justify-center" role="radiogroup" aria-label="Color">
                  {activeVariant.colors!.map((c) => (
                    <button
                      key={c.id ?? c.name}
                      type="button"
                      role="radio"
                      aria-checked={c.name === selectedColorName}
                      onClick={() => setSelectedColorName(c.name)}
                      className={`border px-3.5 py-1.5 text-sm rounded-full transition-colors ${
                        c.name === selectedColorName
                          ? "border-white bg-white text-ink"
                          : "border-white/30 text-white hover:border-white/60"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              ) : undefined
            }
          />
        )}
      </div>

      {detailImages.length > 0 && (
        <section className="max-w-[1320px] mx-auto px-6 mt-20 pt-12 border-t border-line">
          <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-6 block">
            Product Details Gallery
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {detailImages.map((url, i) => (
              <Reveal key={i} delay={(i % 5) * 60}>
                <button
                  type="button"
                  onClick={() => {
                    setDetailIndex(i);
                    setDetailLightboxOpen(true);
                  }}
                  aria-label={`View detail photo ${i + 1}`}
                  className="w-full aspect-square rounded-2xl border border-line bg-cover bg-center hover:opacity-90 transition-opacity"
                  style={{ backgroundImage: `url(${url})` }}
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {detailLightboxOpen && (
        <PhotoLightbox
          images={detailImages}
          activeIndex={detailIndex}
          onIndexChange={setDetailIndex}
          onClose={() => setDetailLightboxOpen(false)}
        />
      )}
    </>
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

function GalleryArrow({ direction, onClick }: { direction: "prev" | "next"; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous photo" : "Next photo"}
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-bg/85 border border-line text-ink hover:bg-bg ${
        direction === "prev" ? "left-3" : "right-3"
      }`}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={direction === "prev" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );
}
