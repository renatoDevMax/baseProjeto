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
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log("PWA foi instalado");
    };

    // Verificar se já está instalado
    const checkIfInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
        setIsInstallable(false);
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
    if (!deferredPrompt) {
      // Para iOS, mostrar instruções
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        showIOSInstructions();
        return;
      }
      return;
    }

    try {
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
