"use client";

import { useState } from "react";
import type { ProductImage, Variant } from "@/lib/types";
import { fallbackGradients } from "@/lib/fallbackGradients";
import Button from "@/components/Button";
import ProductBreadcrumb from "@/components/ProductBreadcrumb";
import VariantLinkPill from "@/components/VariantLinkPill";
import PhotoLightbox from "@/components/PhotoLightbox";

type Props = {
  categoryName: string;
  categoryHref: string;
  productSlug: string;
  productName: string;
  productType: string;
  description: string;
  material?: string;
  variants: Variant[];
  images: ProductImage[];
  featuredImage?: string | null;
};

/**
 * The base /product/[slug] page. Shows only the product's own photos
 * (Featured Image + Detail Photos) — never a variant or color photo, so
 * there's nothing here that could read as "this is what Black looks like"
 * when it isn't. Style/Finish options are a plain list of links to their
 * own page (see ProductVariantView), not an in-place photo swap.
 */
export default function ProductOverview({
  categoryName,
  categoryHref,
  productSlug,
  productName,
  productType,
  description,
  material,
  variants,
  images,
  featuredImage,
}: Props) {
  const galleryImages = [featuredImage, ...images.map((img) => img.imageUrl)].filter(Boolean) as string[];
  const hasGallery = galleryImages.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const displayImageUrl = galleryImages[activeIndex] ?? null;

  function goTo(direction: -1 | 1) {
    if (!hasGallery) return;
    setActiveIndex((i) => (i + direction + galleryImages.length) % galleryImages.length);
  }

  const hasVariants = variants.length > 0;
  const quoteHref = `/quote?type=${encodeURIComponent(productType)}`;

  return (
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
            aria-label={`${productName} photo${hasGallery ? ` ${activeIndex + 1} of ${galleryImages.length}` : ""}`}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") goTo(-1);
              if (e.key === "ArrowRight") goTo(1);
            }}
            onClick={() => displayImageUrl && setLightboxOpen(true)}
            className="absolute inset-0 flex items-center justify-center font-mono-ui text-[11px] uppercase tracking-wide text-ink-faint outline-none focus-visible:ring-2 focus-visible:ring-ink"
            style={
              displayImageUrl
                ? { backgroundImage: `url(${displayImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                : { background: fallbackGradients[0] }
            }
          >
            {!displayImageUrl && `${productName} photo`}
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
      </div>

      <div className="min-w-0">
        <ProductBreadcrumb items={[{ label: categoryName, href: categoryHref }, { label: productType }]} />
        <h1 className="text-[clamp(28px,4vw,44px)] font-medium tracking-tight mb-4 break-words">{productName}</h1>
        <p className="text-ink-muted max-w-[50ch] mb-6 break-words">{description}</p>

        {hasVariants && (
          <div className="mb-8">
            <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-3 block">
              Style / Finish
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {variants.map((v, i) => (
                <VariantLinkPill
                  key={v.id ?? v.slug}
                  href={`/product/${productSlug}/${v.slug}`}
                  label={v.name}
                  imageUrl={v.imageUrl}
                  fallbackIndex={i}
                />
              ))}
            </div>
          </div>
        )}

        <div className="border border-line rounded-2xl p-6 mb-8 grid grid-cols-2 gap-x-6 gap-y-4">
          <DetailRow label="Category" value={categoryName} />
          <DetailRow label="Product Type" value={productType} />
          {material && <DetailRow label="Material" value={material} />}
        </div>

        <Button href={quoteHref} variant="accent" size="lg">
          Request Quote for This Product
        </Button>
      </div>

      {lightboxOpen && displayImageUrl && (
        <PhotoLightbox
          images={galleryImages}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setLightboxOpen(false)}
        />
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
