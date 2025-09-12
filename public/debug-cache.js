// Script completo para debug do cache - mostra TUDO que está armazenado
// Execute este script no console do navegador

console.log("🔍 INICIANDO DEBUG COMPLETO DO CACHE...\n");

async function debugAllCaches() {
  try {
    // 1. Verificar se Service Worker está ativo
    console.log("📱 SERVICE WORKER STATUS:");
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(`   - Service Workers registrados: ${registrations.length}`);
      registrations.forEach((reg, index) => {
        console.log(`   - SW ${index + 1}: ${reg.scope}`);
        console.log(`   - Estado: ${reg.active ? "Ativo" : "Inativo"}`);
      });
    } else {
      console.log("   - Service Worker não suportado");
    }
    console.log("");

    // 2. Listar todos os caches
    console.log("🗂️ TODOS OS CACHES:");
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      console.log(`   - Total de caches: ${cacheNames.length}`);

      for (const cacheName of cacheNames) {
        console.log(`\n   📦 CACHE: "${cacheName}"`);
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        console.log(`   - Total de itens: ${requests.length}`);

        // Listar cada item no cache
        for (let i = 0; i < requests.length; i++) {
          const request = requests[i];
          const response = await cache.match(request);

          console.log(`\n   ${i + 1}. URL: ${request.url}`);
          console.log(`      - Método: ${request.method}`);
          console.log(`      - Status: ${response ? response.status : "N/A"}`);
          console.log(`      - Tipo: ${response ? response.type : "N/A"}`);
          console.log(
            `      - Headers: ${
              response ? Object.fromEntries(response.headers.entries()) : "N/A"
            }`,
          );

          // Mostrar tamanho se possível
          if (response) {
            const clonedResponse = response.clone();
            try {
              const blob = await clonedResponse.blob();
              console.log(
                `      - Tamanho: ${(blob.size / 1024).toFixed(2)} KB`,
              );
              console.log(`      - Tipo MIME: ${blob.type}`);
            } catch (e) {
              console.log(`      - Tamanho: Não foi possível calcular`);
            }
          }
        }
      }
    } else {
      console.log("   - Cache API não suportada");
    }
    console.log("");

    // 3. Verificar cache do navegador (localStorage, sessionStorage)
    console.log("💾 STORAGE DO NAVEGADOR:");
    console.log(`   - localStorage: ${Object.keys(localStorage).length} itens`);
    Object.keys(localStorage).forEach((key) => {
      console.log(
        `     - ${key}: ${localStorage.getItem(key).substring(0, 100)}...`,
      );
    });

    console.log(
      `   - sessionStorage: ${Object.keys(sessionStorage).length} itens`,
    );
    Object.keys(sessionStorage).forEach((key) => {
      console.log(
        `     - ${key}: ${sessionStorage.getItem(key).substring(0, 100)}...`,
      );
    });
    console.log("");

    // 4. Verificar IndexedDB
    console.log("🗄️ INDEXEDDB:");
    if ("indexedDB" in window) {
      try {
        const databases = await indexedDB.databases();
        console.log(`   - Total de databases: ${databases.length}`);
        databases.forEach((db, index) => {
          console.log(
            `   - DB ${index + 1}: ${db.name} (versão ${db.version})`,
          );
        });
      } catch (e) {
        console.log("   - Não foi possível acessar IndexedDB");
      }
    } else {
      console.log("   - IndexedDB não suportado");
    }
    console.log("");

    // 5. Verificar cookies
    console.log("🍪 COOKIES:");
    const cookies = document.cookie.split(";");
    console.log(`   - Total de cookies: ${cookies.length}`);
    cookies.forEach((cookie) => {
      if (cookie.trim()) {
        console.log(`   - ${cookie.trim()}`);
      }
    });
    console.log("");

    // 6. Verificar recursos em cache do Service Worker
    console.log("⚙️ RECURSOS EM CACHE DO SERVICE WORKER:");
    if ("serviceWorker" in navigator && "caches" in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        if (cacheName.includes("acima")) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();

          console.log(`\n   Cache "${cacheName}":`);
          requests.forEach((request, index) => {
            console.log(`   ${index + 1}. ${request.url}`);
          });
        }
      }
    }

    // 7. Resumo final
    console.log("\n📊 RESUMO FINAL:");
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      let totalItems = 0;
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        totalItems += requests.length;

        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            try {
              const blob = await response.clone().blob();
              totalSize += blob.size;
            } catch (e) {
              // Ignorar erros de tamanho
            }
          }
        }
      }

      console.log(`   - Total de caches: ${cacheNames.length}`);
      console.log(`   - Total de itens cacheados: ${totalItems}`);
      console.log(
        `   - Tamanho total aproximado: ${(totalSize / 1024 / 1024).toFixed(
          2,
        )} MB`,
      );
    }

    console.log("\n✅ DEBUG COMPLETO FINALIZADO!");
  } catch (error) {
    console.error("❌ Erro durante o debug:", error);
  }
}

// Executar o debug
debugAllCaches();
