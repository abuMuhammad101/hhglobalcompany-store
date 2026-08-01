"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "left" | "right";

const hiddenOffset: Record<Direction, string> = {
  up: "translate-y-6",
  left: "-translate-x-6",
  right: "translate-x-6",
};

/**
 * Wraps content in a slide-in-on-scroll effect: hidden/offset until the
 * element enters the viewport, then transitions to its resting position
 * once and stays there. `.reveal-init` (see globals.css) keeps content
 * visible for reduced-motion users and if JS never loads.
 */
export default function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-init transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${hiddenOffset[direction]}`
      } ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
