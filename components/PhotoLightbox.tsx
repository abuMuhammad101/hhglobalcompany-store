"use client";

import { useEffect, useState } from "react";

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.5;

type Props = {
  images: string[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /** Extra controls rendered in the footer below the thumbnail strip — e.g. a
   * variant or color pill row, so a shopper can switch either without closing
   * the viewer. */
  extraControls?: React.ReactNode;
};

/**
 * Full-screen photo viewer shared by every image gallery on the product
 * pages — zoom in/out, keyboard arrow nav, a thumbnail strip, and an
 * optional footer slot for picker rows. Each gallery on the page (the
 * variant/color viewer, the separate Product Details Gallery) opens its own
 * instance scoped to just its own `images` array, so browsing one never
 * wraps into the other's photos.
 */
export default function PhotoLightbox({ images, activeIndex, onIndexChange, onClose, extraControls }: Props) {
  const [zoom, setZoom] = useState(1);
  const hasGallery = images.length > 1;
  const displayImageUrl = images[activeIndex] ?? null;

  function zoomIn() {
    setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(1)));
  }
  function zoomOut() {
    setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(1)));
  }

  function goTo(direction: -1 | 1) {
    if (!hasGallery) return;
    onIndexChange((activeIndex + direction + images.length) % images.length);
  }

  useEffect(() => {
    setZoom(1);
  }, [activeIndex]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, images.length]);

  if (!displayImageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
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
            <LightboxArrow direction="prev" onClick={(e) => { e.stopPropagation(); goTo(-1); }} />
            <LightboxArrow direction="next" onClick={(e) => { e.stopPropagation(); goTo(1); }} />
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

      {(hasGallery || extraControls) && (
        <div className="w-full max-w-[1100px] shrink-0 pt-4" onClick={(e) => e.stopPropagation()}>
          {hasGallery && (
            <div className="flex gap-2.5 justify-center overflow-x-auto mb-3">
              {images.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onIndexChange(i)}
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
          {extraControls}
        </div>
      )}
    </div>
  );
}

function LightboxArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous photo" : "Next photo"}
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-white/10 text-white hover:bg-white/20 ${
        direction === "prev" ? "left-3" : "right-3"
      }`}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={direction === "prev" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );
}
