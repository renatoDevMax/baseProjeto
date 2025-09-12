const CACHE_NAME = "acima-pwa-v2";
const STATIC_CACHE_NAME = "acima-static-v2";

// Apenas recursos estáticos que raramente mudam
const urlsToCache = [
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-384x384.png",
  "/logoGeralAcima.png",
  "/logosimbol.jpg",
  "/rotador.png",
  "/rotador2.png",
  "/limpeza.webp",
  "/intro.mp4",
  "/intro2.mp4",
  "/file.svg",
  "/globe.svg",
  "/next.svg",
  "/vercel.svg",
  "/window.svg",
];

// Recursos que devem ser sempre atualizados (não cachear)
const noCacheUrls = ["/", "/_next/", "/api/"];

// Instalar service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log("Cache estático aberto");
      return cache.addAll(urlsToCache);
    }),
  );
});

// Ativar service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== CACHE_NAME) {
            console.log("Removendo cache antigo:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Função para verificar se a URL deve ser cacheada
function shouldCache(url) {
  // Não cachear URLs que estão na lista de exclusão
  if (noCacheUrls.some((noCacheUrl) => url.includes(noCacheUrl))) {
    return false;
  }

  // Cachear apenas recursos estáticos (imagens, ícones, vídeos, etc.)
  const staticExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".webp",
    ".mp4",
    ".webm",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
  ];
  const isStaticResource = staticExtensions.some((ext) => url.includes(ext));

  // Cachear manifest.json
  const isManifest = url.includes("/manifest.json");

  return isStaticResource || isManifest;
}

// Interceptar requisições
self.addEventListener("fetch", (event) => {
  // Ignorar requisições de extensões e outros esquemas
  if (
    event.request.url.startsWith("chrome-extension://") ||
    event.request.url.startsWith("moz-extension://") ||
    event.request.url.startsWith("safari-extension://") ||
    event.request.url.startsWith("ms-browser-extension://")
  ) {
    return;
  }

  const url = new URL(event.request.url);

  // Se não deve ser cacheado, sempre buscar da rede
  if (!shouldCache(event.request.url)) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback para página offline apenas se for uma requisição de documento
        if (event.request.destination === "document") {
          return caches.match("/");
        }
        return new Response("Offline", { status: 503 });
      }),
    );
    return;
  }

  // Para recursos estáticos, usar estratégia Cache First
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - retorna resposta do cache
      if (response) {
        return response;
      }

      // Cache miss - buscar da rede e cachear
      return fetch(event.request).then((response) => {
        // Verifica se recebeu uma resposta válida
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clona a resposta e cacheia
        const responseToCache = response.clone();
        caches.open(STATIC_CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }),
  );
});

// Notificações push (opcional)
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Nova notificação do Acima",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Ver detalhes",
        icon: "/icons/icon-192x192.png",
      },
      {
        action: "close",
        title: "Fechar",
        icon: "/icons/icon-192x192.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("Acima", options));
});

// Clique em notificação
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});
