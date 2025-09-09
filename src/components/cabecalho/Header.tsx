"use client";
import { useEffect, useRef } from "react";
import { categoriasEmpresas } from "@/components/categoriasEmpresas";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Header() {
  const scrollPointRef = useRef<HTMLDivElement | null>(null);
  const barBackgroundRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const pontodescroll = scrollPointRef.current;
    const barBackground = barBackgroundRef.current;
    const headerEl = headerRef.current;
    if (!pontodescroll) return;

    const getSectionMetrics = () => {
      const section = document.querySelector(
        ".categorias-section",
      ) as HTMLElement | null;
      if (!section) return null;
      const rect = section.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const top = scrollY + rect.top; // absolute page Y of section start
      const height = section.offsetHeight; // total section height in px
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return { top, height, vh };
    };

    const update = () => {
      const metrics = getSectionMetrics();
      if (!metrics) {
        pontodescroll.style.transform = "translateY(0px)";
        if (barBackground) barBackground.style.transform = "rotate(0deg)";
        if (headerEl) {
          headerEl.style.transform = "translateY(-100%)";
          headerEl.style.opacity = "0.3";
        }
        return;
      }
      const { top, height, vh } = metrics;
      const scrollY = window.scrollY || window.pageYOffset;

      // Active range while the section is within viewport
      const start = top;
      const end = top + Math.max(0, height - 1); // inclusive-ish

      if (scrollY + vh <= start || scrollY >= end) {
        // Not within the section's active scrolling window
        pontodescroll.style.transform = "translateY(0px)";
        if (barBackground) barBackground.style.transform = "rotate(0deg)";
        if (headerEl) {
          headerEl.style.transform = "translateY(-100%)";
          headerEl.style.opacity = "0.3";
        }
        return;
      }

      // Progress within the section in viewport-heights (continuous)
      const progressedPx = Math.min(Math.max(0, scrollY - start), height);
      const position = progressedPx / vh; // e.g., 0.0..N progressively
      const translate = Math.max(0, position) * 32; // 32px per 100vh, smooth
      pontodescroll.style.transform = `translateY(-${translate}px)`;

      // Rotate background bar 180deg per 100vh while in section
      if (barBackground) {
        const rotateDeg = Math.max(0, position) * 180;
        barBackground.style.transform = `rotate(${rotateDeg}deg)`;
      }

      // Reveal header smoothly within the section
      if (headerEl) {
        headerEl.style.transform = "translateY(0%)";
        headerEl.style.opacity = "1";
      }
    };

    // Use rAF to throttle
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };
    const onResize = () => update();

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll as any);
      window.removeEventListener("resize", onResize as any);
    };
  }, []);

  return (
    <div
      ref={headerRef}
      className="w-[100dvw] h-[85px] fundoHeader fixed top-0 left-0 flex justify-center items-center overflow-hidden"
      style={{
        transform: "translateY(-100%)",
        opacity: 0.3,
        transition: "transform 360ms ease, opacity 360ms ease",
      }}
    >
      <div className="barrafundoHeader" ref={barBackgroundRef}></div>
      <div className="w-[100dvw] h-[80px] bg-white flex justify-between items-center  absolute top-0 left-0 ">
        <div className="nomesCategorias  h-[40px] w-[250px] mx-2 overflow-hidden ">
          <div className="pontodescroll" ref={scrollPointRef}>
            {categoriasEmpresas.map((categoria, index) => (
              <h1 key={index} className="text-gray-500 text-xl my-1 mx-3">
                {categoria.nomeCategoria}
              </h1>
            ))}
          </div>
        </div>

        <GiHamburgerMenu className="text-gray-800 text-4xl mx-4" />
      </div>
    </div>
  );
}
