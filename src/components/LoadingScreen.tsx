"use client";

import { useEffect, useState } from "react";

type LoadingScreenProps = {
  onComplete: () => void;
};

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Carregando...");

  useEffect(() => {
    const imagesToPreload = [
      "/logoGeralAcima.png",
      "/intro2.mp4", // Video também precisa carregar
      "/logos/logo2irmaos.jpg",
      "/logos/logoArqmax.jpg",
      "/logos/logoCafeMansa.jpg",
      "/logos/logoCaiobaarquitetura.png",
      "/logos/logoCeleiro.png",
      "/logos/logoEcoclean.jpg",
      "/logos/logoLimpamais.jpg",
      "/logos/logoMichelArq.png",
      "/logos/logoPersonalcross.jpg",
      "/prodLimpeza/logoEcoclean.jpg",
      "/prodLimpeza/logoLimpamais.jpg",
      "/rotador.png",
      "/rotador2.png",
    ];

    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    const updateProgress = () => {
      const newProgress = Math.round((loadedCount / totalImages) * 100);
      setProgress(newProgress);

      if (newProgress < 30) {
        setLoadingText("Carregando recursos...");
      } else if (newProgress < 70) {
        setLoadingText("Preparando interface...");
      } else if (newProgress < 100) {
        setLoadingText("Finalizando...");
      } else {
        setLoadingText("Pronto!");
      }
    };

    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (src.endsWith(".mp4")) {
          // Para vídeos, criar elemento video
          const video = document.createElement("video");
          video.oncanplaythrough = () => {
            loadedCount++;
            updateProgress();
            resolve();
          };
          video.onerror = () => {
            loadedCount++;
            updateProgress();
            resolve(); // Continua mesmo se der erro
          };
          video.src = src;
          video.load();
        } else {
          // Para imagens
          const img = new Image();
          img.onload = () => {
            loadedCount++;
            updateProgress();
            resolve();
          };
          img.onerror = () => {
            loadedCount++;
            updateProgress();
            resolve(); // Continua mesmo se der erro
          };
          img.src = src;
        }
      });
    };

    const preloadAll = async () => {
      try {
        await Promise.all(imagesToPreload.map(preloadImage));

        // Aguarda um pouco mais para garantir que tudo está pronto
        setTimeout(() => {
          onComplete();
        }, 500);
      } catch (error) {
        console.warn("Erro no preload:", error);
        // Mesmo com erro, continua após um tempo
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    };

    preloadAll();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
      {/* Logo ou animação de loading */}
      <div className="w-32 h-32 mb-8 flex items-center justify-center">
        <div className="w-24 h-24 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>

      {/* Barra de progresso */}
      <div className="w-64 h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Texto de loading */}
      <p className="text-gray-600 text-lg font-medium mb-2">{loadingText}</p>
      <p className="text-gray-400 text-sm">{progress}%</p>
    </div>
  );
}
