"use client";
import { useState } from "react";
import ModalEmpresa from "./ModalEmpresa";

type Empresa = {
  nomeEmpresa: string;
  imagemEmpresa: string;
};

export default function ModalCategoria({
  isOpen,
  onClose,
  empresas = [],
}: {
  isOpen: boolean;
  onClose?: () => void;
  empresas?: Empresa[];
}) {
  const [empresaOpen, setEmpresaOpen] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(
    null,
  );
  return (
    <div
      className={`w-[100dvw] h-[100dvh] flex justify-center items-center fixed fundoOverlay top-0 left-0 z-30`}
      style={{
        transform: isOpen ? "translateX(0)" : "translateX(-200vw)",
        transition: "transform 300ms ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (empresaOpen) {
            setEmpresaOpen(false);
          } else {
            onClose?.();
          }
        }
      }}
    >
      <div className="barrafundo">
        <div className="reflexo1"></div>
        <div className="reflexo2"></div>
      </div>
      <div className="painelFundo" onClick={(e) => e.stopPropagation()}>
        <div className="barraInterna"></div>
        <div className="painelEmpresas">
          {empresas.map((emp, idx) => (
            <div
              key={idx}
              className="empresas bg-white border-b-[5px] border-white"
              style={{ backgroundImage: `url('${emp.imagemEmpresa}')` }}
              onClick={() => {
                setEmpresaSelecionada(emp);
                setEmpresaOpen(true);
              }}
            >
              <h1 className="max-w-[300px]">{emp.nomeEmpresa}</h1>
            </div>
          ))}
        </div>
      </div>
      <ModalEmpresa
        isOpen={empresaOpen}
        empresa={empresaSelecionada ?? undefined}
      />
    </div>
  );
}
