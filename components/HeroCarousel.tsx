"use client";

import { useEffect, useState } from "react";
import type { HeroSlide } from "@/lib/hero";

const fallbackGradients = [
  { gradient: "radial-gradient(120% 90% at 30% 10%, #EDEAE2 0%, #D9D5C8 55%, #B9B3A0 100%)", text: "#121210" },
  { gradient: "radial-gradient(120% 90% at 60% 20%, #2A342F 0%, #16211C 55%, #0E1714 100%)", text: "#F4F3EE" },
];

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-line aspect-[4/3] max-h-[280px] sm:aspect-[16/11] sm:max-h-[380px] lg:aspect-[16/12] lg:max-h-[440px]">
      {slides.map((s, i) => {
        const fallback = fallbackGradients[i % fallbackGradients.length];
        return (
          <div
            key={s.id ?? `${s.label}-${i}`}
            className="absolute inset-0 flex items-end p-6 transition-opacity duration-700 ease-in-out"
            style={
              s.imageUrl
                ? {
                    backgroundImage: `url(${s.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: i === index ? 1 : 0,
                  }
                : { background: fallback.gradient, opacity: i === index ? 1 : 0 }
            }
          >
            {!s.imageUrl && (
              <span
                className="font-mono-ui text-[11px] uppercase tracking-wider"
                style={{ color: fallback.text, opacity: 0.75 }}
              >
                {s.label} photo
              </span>
            )}
          </div>
        );
      })}
      {slides.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id ?? `${s.label}-${i}`}
              type="button"
              aria-label={`Show ${s.label || `slide ${i + 1}`}`}
              onClick={() => setIndex(i)}
              className="w-6 h-1.5 rounded-full transition-colors"
              style={{ background: i === index ? "#F4F3EE" : "rgba(244,243,238,0.4)" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
