"use client";
import { useEffect, useRef, useState } from "react";

export default function Categoria4({
  rotateDeg = 0,
  blurPx = 0,
  onOpen,
}: {
  rotateDeg?: number;
  blurPx?: number;
  onOpen?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const target = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Fully visible
          if (entry.intersectionRatio === 1) {
            setIsVisible(true);
          }
          // Fully out of view
          if (entry.intersectionRatio === 0) {
            setIsVisible(false);
          }
        }
      },
      { threshold: [0, 1] },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-[300px] h-[300px] flex justify-center items-center"
    >
      {/* Img categoria (fade in on visible) */}
      <div
        className={`w-[300px] h-[300px] absolute imgAnimacao transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      ></div>
      {/* Circulo btn categoria */}
      <button
        onClick={onOpen}
        className="w-[200px] h-[200px] rounded-full flex justify-center items-center vidroCategoria"
        type="button"
      >
        <h1>Produtos de Limpeza 4</h1>
      </button>
    </div>
  );
}
