"use client";
import { ReactNode, useEffect, useRef, useState } from "react";

type ParallaxSectionProps = {
  children: ReactNode;
  /** Positive moves from right->left while scrolling down. Negative reverses. */
  intensity?: number; // pixels of horizontal shift across viewport height
  /** Optional additional className on outer section */
  className?: string;
};

export default function ParallaxSection({
  children,
  intensity = 200,
  className = "",
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0); // 0..1 how much the section has passed through the viewport

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    let frameRequested = false;

    const handleScroll = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(() => {
        frameRequested = false;
        const rect = element.getBoundingClientRect();
        const viewportHeight =
          window.innerHeight || document.documentElement.clientHeight;
        // Calculate how much of the section journey through viewport has progressed
        const total = rect.height + viewportHeight;
        const passed = viewportHeight - rect.top; // when top hits viewport top -> increases
        const raw = passed / total;
        const clamped = Math.max(0, Math.min(1, raw));
        setProgress(clamped);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Enter from right (positive) and exit to left (negative) as user scrolls down
  const translateX = (0.5 - progress) * 2 * intensity; // +intensity..-intensity

  return (
    <section
      ref={sectionRef}
      className={`w-[100dvw] h-[100dvh] overflow-hidden flex items-center justify-center ${className}`}
    >
      <div
        style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
        className="will-change-transform"
      >
        {children}
      </div>
    </section>
  );
}
