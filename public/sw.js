const CACHE_NAME = "acima-pwa-v1";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/logoGeralAcima.png",
];

// Instalar service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache aberto");
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
          if (cacheName !== CACHE_NAME) {
            console.log("Removendo cache antigo:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

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

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Cache hit - retorna resposta do cache
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Verifica se recebeu uma resposta válida
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clona a resposta
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // Fallback para página offline
        if (event.request.destination === "document") {
          return caches.match("/");
        }
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
