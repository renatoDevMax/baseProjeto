"use client";
import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    console.log("usePWAInstall hook inicializado");

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("beforeinstallprompt event disparado!");
      // NÃO interceptar o evento - deixar o navegador lidar com isso
      // e.preventDefault(); // REMOVIDO
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      console.log("deferredPrompt definido, isInstallable = true");
    };

    const handleAppInstalled = () => {
      console.log("appinstalled event disparado!");
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log("PWA foi instalado");
    };

    // Verificar se já está instalado
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;
      console.log("Verificando se está instalado:", isStandalone);
      if (isStandalone) {
        setIsInstalled(true);
        setIsInstallable(false);
        console.log("App já está instalado");
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    checkIfInstalled();

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    console.log("installApp chamado");
    console.log("deferredPrompt:", deferredPrompt);
    console.log("isInstallable:", isInstallable);
    console.log("User Agent:", navigator.userAgent);

    if (!deferredPrompt) {
      console.log("Sem deferredPrompt disponível");

      // Para iOS, mostrar instruções
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        console.log("Dispositivo iOS detectado");
        showIOSInstructions();
        return;
      }

      // Para Android/Desktop, mostrar instruções alternativas
      if (/Android/.test(navigator.userAgent)) {
        alert(
          "Para instalar o app no Android:\n\n" +
            "1. Toque no menu do navegador (três pontos)\n" +
            "2. Selecione 'Instalar app' ou 'Adicionar à tela inicial'\n" +
            "3. Confirme a instalação\n\n" +
            "Se não aparecer a opção, o app pode não ser elegível para instalação ainda.",
        );
        return;
      }

      // Para desktop
      alert(
        "Para instalar o app:\n\n" +
          "1. Procure pelo ícone de instalação na barra de endereços\n" +
          "2. Ou use o menu do navegador para 'Instalar app'\n\n" +
          "Se não aparecer, o app pode não ser elegível para instalação ainda.",
      );
      return;
    }

    try {
      console.log("Chamando deferredPrompt.prompt()");
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("Usuário aceitou a instalação");
      } else {
        console.log("Usuário rejeitou a instalação");
      }

      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error("Erro ao instalar app:", error);
    }
  };

  const showIOSInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;

    if (isIOS && !isInStandaloneMode) {
      alert(
        "Para instalar o app no iPhone:\n\n" +
          "1. Toque no botão de compartilhar (□↑) na barra inferior\n" +
          "2. Role para baixo e toque em 'Adicionar à Tela Inicial'\n" +
          "3. Toque em 'Adicionar' no canto superior direito\n\n" +
          "O app será instalado na sua tela inicial!",
      );
    }
  };

  return {
    installApp,
    isInstallable,
    isInstalled,
    showIOSInstructions,
  };
};
