"use client";
import SectionCateg from "@/components/categoriaSection/SectionCateg";
import Categoria1 from "@/components/elementosCategoria/Categoria1";
import Categoria2 from "@/components/elementosCategoria/Categoria2";
import Categoria3 from "@/components/elementosCategoria/Categoria3";
import Categoria4 from "@/components/elementosCategoria/Categoria4";
import Categoria5 from "@/components/elementosCategoria/Categoria5";
import SectionIntro from "@/components/introSection/SectionIntro";
import BaseFundo from "@/components/sectionTeste/BaseFundo";
import HorizontalParallax from "@/components/sectionTeste/HorizontalParallax";
export default function Home() {
  return (
    <div className="w-[100dvw]">
      <SectionIntro />
      <HorizontalParallax
        scrollPerItem={700}
        gap={0}
        pinHeights={5}
        overlayRender={(ratio, steps) => (
          <BaseFundo fixedOverlay rotationDeg={28 - ratio * 90 * steps} />
        )}
      >
        <Categoria1 />
        <Categoria2 />
        <Categoria3 />
        <Categoria4 />
        <Categoria5 />
      </HorizontalParallax>
      {/* <BaseFundo /> */}
    </div>
  );
}
