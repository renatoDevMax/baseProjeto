// Script para limpar cache e forçar atualização do Service Worker
// Execute este script no console do navegador para limpar o cache

if ("serviceWorker" in navigator) {
  // Desregistrar service worker atual
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log("Service Worker desregistrado:", registration.scope);
    }
  });

  // Limpar todos os caches
  if ("caches" in window) {
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            console.log("Removendo cache:", cacheName);
            return caches.delete(cacheName);
          }),
        );
      })
      .then(function () {
        console.log("Todos os caches foram limpos!");
        console.log("Recarregue a página para aplicar as mudanças.");
      });
  }
} else {
  console.log("Service Worker não suportado neste navegador");
}
