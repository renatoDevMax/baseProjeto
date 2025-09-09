"use client";

import { CgWebsite } from "react-icons/cg";
import { FaInstagram, FaPhoneVolume } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { MdOutlineWhatsapp } from "react-icons/md";

type Empresa = {
  nomeEmpresa: string;
  imagemEmpresa: string;
  endereco?: string | null;
  contato1?: string | null;
  contato2?: string | null;
  email?: string | null;
  site?: string | null;
  linkWhatsapp?: string | null;
  linkTelefone?: string | null;
  linkLocalizacao?: string | null;
  linkSite?: string | null;
  linkInstagram?: string | null;
};

export default function ModalEmpresa({
  isOpen = false,
  empresa,
}: {
  isOpen?: boolean;
  empresa?: Empresa;
}) {
  return (
    <div
      className="painelFundo2"
      style={{ transform: isOpen ? "translateY(0)" : undefined }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="barraInterna"></div>
      <div className="modalEmpresa">
        <div
          className="logoEmpresaModal"
          style={{
            backgroundImage: empresa?.imagemEmpresa
              ? `url('${empresa.imagemEmpresa}')`
              : undefined,
          }}
        ></div>
        <div className="w-[80px] h-[400px]  absolute top-0 right-3 flex flex-col items-center justify-center">
          <a
            href={empresa?.linkWhatsapp ?? undefined}
            style={{ display: empresa?.linkWhatsapp ? undefined : "none" }}
          >
            <MdOutlineWhatsapp className="text-6xl my-2 text-green-500 border-2 rounded-full p-2 sombreamentoLinks linkWhatsapp" />
          </a>
          <a
            href={empresa?.linkTelefone ?? undefined}
            style={{ display: empresa?.linkTelefone ? undefined : "none" }}
          >
            <FaPhoneVolume className="text-6xl my-2 text-teal-500 border-2 rounded-full p-2 sombreamentoLinks linkTelefone" />
          </a>
          <a
            href={empresa?.linkLocalizacao ?? undefined}
            style={{ display: empresa?.linkLocalizacao ? undefined : "none" }}
          >
            <GrMapLocation className="text-6xl my-2 text-red-500 border-2 rounded-full p-2 sombreamentoLinks linkLocalizacao" />
          </a>
          <a
            href={empresa?.linkSite ?? undefined}
            style={{ display: empresa?.linkSite ? undefined : "none" }}
          >
            <CgWebsite className="text-6xl my-2 text-blue-500 border-2 rounded-full p-2 sombreamentoLinks linkSite" />
          </a>
          <a
            href={empresa?.linkInstagram ?? undefined}
            style={{ display: empresa?.linkInstagram ? undefined : "none" }}
          >
            <FaInstagram className="text-6xl my-2 text-violet-500 border-2 rounded-full p-2 sombreamentoLinks linkInstagram" />
          </a>
        </div>
        <h3 className="nomeDaEmpresa">{empresa?.nomeEmpresa ?? ""}</h3>
        <p
          className="max-w-[200px] mx-5 enderecoEmpresa"
          style={{ display: empresa?.endereco ? undefined : "none" }}
        >
          {empresa?.endereco}
        </p>

        <p
          className="max-w-[200px] mx-5 my-3 contato1"
          style={{ display: empresa?.contato1 ? undefined : "none" }}
        >
          {empresa?.contato1}
        </p>

        <p
          className="max-w-[200px] mx-5 my-3 contato2"
          style={{ display: empresa?.contato2 ? undefined : "none" }}
        >
          {empresa?.contato2}
        </p>

        <p
          className="max-w-[200px] mx-5 my-3 email"
          style={{ display: empresa?.email ? undefined : "none" }}
        >
          {empresa?.email}
        </p>

        <p
          className="max-w-[200px] mx-5 my-3 site"
          style={{ display: empresa?.site ? undefined : "none" }}
        >
          {empresa?.site}
        </p>
      </div>
    </div>
  );
}
