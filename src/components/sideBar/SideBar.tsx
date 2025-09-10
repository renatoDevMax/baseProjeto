"use client";

import { FaCloudDownloadAlt } from "react-icons/fa";
import { categoriasEmpresas } from "../categoriasEmpresas";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useEffect } from "react";

type SideBarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SideBar({ isOpen, onClose }: SideBarProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleNavigateToCategory = (index: number) => {
    const section = document.querySelector(
      ".categorias-section",
    ) as HTMLElement | null;
    if (!section) {
      onClose();
      return;
    }
    const rect = section.getBoundingClientRect();
    const pageTop = (window.scrollY || window.pageYOffset) + rect.top;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const target = Math.round(pageTop + index * vh);
    window.scrollTo({ top: target, behavior: "smooth" });
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 transition-opacity duration-300"
        style={{
          pointerEvents: isOpen ? "auto" : "none",
          opacity: isOpen ? 1 : 0,
        }}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bg-white w-[250px] h-[100dvh] border-l-2 border-gray-300 overflow-scroll shadow-xl"
        style={{
          transform: isOpen ? "translateX(0%)" : "translateX(100%)",
          transition: "transform 320ms ease, box-shadow 320ms ease",
        }}
      >
        <h1 className="text-3xl text-gray-500 p-2 mx-2 flex items-center justify-between border-b-2 border-gray-300">
          Menu
          <IoCloseCircleSharp
            className="text-grey-900 text-4xl cursor-pointer"
            onClick={onClose}
          />
        </h1>
        <div>
          <div className="flex items-center justify-around mx-5 border-b-1 border-gray-200 mt-5">
            <h3 className="text-gray-500 text-xl">Download App</h3>
            <FaCloudDownloadAlt className="text-gray-500 text-4xl" />
          </div>
          <h3 className="text-gray-500 text-xl mx-5 mt-5 mb-2">Categorias:</h3>
          <ul>
            {categoriasEmpresas.map((categoria, index) => (
              <li
                key={index}
                className="text-gray-500 text-md mx-6 p-1 cursor-pointer hover:text-gray-800 transition-colors"
                onClick={() => handleNavigateToCategory(index)}
              >
                {categoria.nomeCategoria}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
