"use client";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

type HorizontalParallaxProps = {
  children: ReactNode[] | ReactNode;
  /** Gap between categorias in px */
  gap?: number;
  /** Pixels to scroll vertically to move one full item width horizontally */
  scrollPerItem?: number;
  /** Optional extra class name */
  className?: string;
  /** How many viewport heights to keep the section pinned (>=1). If not provided, uses children length. */
  pinHeights?: number;
  /** Optional overlay rendered fixed within the sticky viewport (e.g., BaseFundo). */
  overlay?: ReactNode;
  /** Optional function to render overlay with progress (0..1) and steps (slides-1). */
  overlayRender?: (progressRatio: number, steps: number) => ReactNode;
  /** Auto-snap to nearest slide when idle and visibility >= threshold */
  snapEnabled?: boolean;
  /** Visibility threshold 0..1 to trigger snap (e.g., 0.7) */
  snapThreshold?: number;
  /** Idle time in ms without scroll before snapping */
  snapIdleMs?: number;
};

export default function HorizontalParallax({
  children,
  gap = 32,
  scrollPerItem = 600,
  className = "",
  pinHeights,
  overlay,
  overlayRender,
  snapEnabled = true,
  snapThreshold = 0.7,
  snapIdleMs = 180,
}: HorizontalParallaxProps) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [ratio, setRatio] = useState(0); // 0..1 scroll progress within pinned area
  const progressedRef = useRef(0); // px progressed within pinned range
  const isSnappingRef = useRef(false);
  const lastProgressedRef = useRef(0);
  const lastDirectionRef = useRef<"up" | "down" | "idle">("idle");

  const childArray = useMemo(() => {
    return Array.isArray(children) ? children : [children];
  }, [children]);

  useEffect(() => {
    const outer = outerRef.current;
    const sticky = stickyRef.current;
    if (!outer || !sticky) return;

    let frameRequested = false;
    let idleTimer: number | undefined;
    const onScroll = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(() => {
        frameRequested = false;
        const outerRect = outer.getBoundingClientRect();
        const winH =
          window.innerHeight || document.documentElement.clientHeight;
        // Exact mapping: each 100dvh (winH) moves one category
        const steps = Math.max(0, childArray.length - 1);
        const scrollable = steps * winH; // N-1 steps of 100dvh
        const progressed = Math.min(scrollable, Math.max(0, -outerRect.top));
        const ratio = scrollable > 0 ? progressed / scrollable : 0;
        setRatio(ratio);
        progressedRef.current = progressed;
        const delta = progressed - lastProgressedRef.current;
        lastDirectionRef.current =
          delta > 0.5 ? "down" : delta < -0.5 ? "up" : "idle";
        lastProgressedRef.current = progressed;

        if (idleTimer) window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => {
          if (!snapEnabled || isSnappingRef.current) return;
          const steps = Math.max(0, childArray.length - 1);
          const position = steps > 0 ? ratio * steps : 0; // in slide units
          const nearest = Math.round(position);
          const deviation = Math.abs(position - nearest); // 0 at center, 0.5 midway
          const approxVisible = 1 - deviation;
          if (approxVisible >= snapThreshold) {
            const winH =
              window.innerHeight || document.documentElement.clientHeight;
            const pageTop = window.scrollY + outer.getBoundingClientRect().top;
            const targetY = Math.round(pageTop + nearest * winH);
            // Prevent trapping user at the start: if aiming first slide while user scrolled up, skip snap
            if (nearest === 0 && lastDirectionRef.current !== "down") {
              return;
            }
            isSnappingRef.current = true;
            window.scrollTo({ top: targetY, behavior: "smooth" });
            const stopCheck = () => {
              const target = nearest * winH;
              const current = progressedRef.current;
              if (Math.abs(current - target) < 2) {
                isSnappingRef.current = false;
                window.removeEventListener("scroll", stopCheck, true);
              }
            };
            window.addEventListener("scroll", stopCheck, true);
          }
        }, snapIdleMs);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (idleTimer) window.clearTimeout(idleTimer);
    };
  }, [
    childArray.length,
    scrollPerItem,
    snapEnabled,
    snapThreshold,
    snapIdleMs,
  ]);

  // Translate from 0 to -(itemWidth + gap) * progress. We assume each child is self-sized.
  // To avoid measuring item widths, we wrap each child in a fixed-size slide: use viewport width.
  const slideWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const totalSlidesOffset =
    Math.max(0, childArray.length - 1) * (slideWidth + gap);
  const translateX = -(ratio * totalSlidesOffset);

  const totalPinHeights = pinHeights ?? Math.max(1, childArray.length);

  return (
    <section
      ref={outerRef}
      className={`w-[100dvw] overflow-visible ${className}`}
      style={{ height: `calc(${totalPinHeights} * 100vh)` }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-[100vh] overflow-hidden flex items-center"
      >
        {overlay ? (
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
            {overlay}
          </div>
        ) : overlayRender ? (
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
            {overlayRender(ratio, Math.max(0, childArray.length - 1))}
          </div>
        ) : null}
        <div
          ref={trackRef}
          className="flex items-center relative z-10"
          style={{
            gap: `${gap}px`,
            transform: `translate3d(${translateX}px, 0, 0)`,
            willChange: "transform",
            transition: "transform 0.06s linear",
            paddingLeft: 0,
          }}
        >
          {childArray.map((child, index) => (
            <div key={index} style={{ width: `100dvw` }}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
