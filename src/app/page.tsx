"use client";
import { useState } from "react";
import SectionCateg from "@/components/categoriaSection/SectionCateg";
import Categorizando from "@/components/elementosCategoria/Categorizando";
import SectionIntro from "@/components/introSection/SectionIntro";
import BaseFundo from "@/components/sectionTeste/BaseFundo";
import HorizontalParallax from "@/components/sectionTeste/HorizontalParallax";
import ModalCategoria from "@/components/ModalCategoria";
import { categoriasEmpresas } from "@/components/categoriasEmpresas";
import Header from "@/components/cabecalho/Header";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [empresasModal, setEmpresasModal] = useState<any[]>([]);
  const openModal = (categoria?: { empresas?: any[] }) => {
    if (categoria?.empresas) setEmpresasModal(categoria.empresas);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  return (
    <div className="w-[100dvw]">
      <SectionIntro />
      <HorizontalParallax
        scrollPerItem={700}
        gap={0}
        pinHeights={5}
        className="categorias-section"
        overlayRender={(ratio, steps) => (
          <BaseFundo fixedOverlay rotationDeg={28 - ratio * 90 * steps} />
        )}
      >
        {categoriasEmpresas.slice(0, 5).map((cat, idx) => (
          <Categorizando key={idx} data={cat} onOpen={openModal} />
        ))}
      </HorizontalParallax>
      {/* <BaseFundo /> */}
      <ModalCategoria
        isOpen={isModalOpen}
        onClose={closeModal}
        empresas={empresasModal}
      />
      <Header />
    </div>
  );
}
