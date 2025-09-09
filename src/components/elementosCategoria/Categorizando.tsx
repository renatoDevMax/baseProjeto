"use client";
import { useEffect, useRef, useState } from "react";

type CategoriaData = {
  nomeCategoria: string;
  empresas: any[];
};

export default function Categorizando({
  data,
  onOpen,
}: {
  data: CategoriaData;
  onOpen?: (categoria: CategoriaData) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const target = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio === 1) {
            setIsVisible(true);
          }
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
        onClick={() => onOpen?.(data)}
        className="w-[200px] h-[200px] rounded-full flex justify-center items-center vidroCategoria"
        type="button"
      >
        <h1>{data.nomeCategoria}</h1>
      </button>
    </div>
  );
}
