// Script para debug específico do Service Worker
// Execute no console do navegador

console.log("⚙️ DEBUG DO SERVICE WORKER...\n");

async function debugServiceWorker() {
  // 1. Status do Service Worker
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log("📱 SERVICE WORKER STATUS:");
    console.log(`   - Registros ativos: ${registrations.length}`);

    registrations.forEach((reg, index) => {
      console.log(`\n   SW ${index + 1}:`);
      console.log(`   - Scope: ${reg.scope}`);
      console.log(`   - Ativo: ${reg.active ? "Sim" : "Não"}`);
      console.log(`   - Instalando: ${reg.installing ? "Sim" : "Não"}`);
      console.log(`   - Aguardando: ${reg.waiting ? "Sim" : "Não"}`);

      if (reg.active) {
        console.log(`   - Script URL: ${reg.active.scriptURL}`);
        console.log(`   - Estado: ${reg.active.state}`);
      }
    });
  }

  // 2. Caches específicos do Acima
  console.log("\n🗂️ CACHES DO ACIMA:");
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    const acimaCaches = cacheNames.filter((name) => name.includes("acima"));

    console.log(`   - Caches do Acima: ${acimaCaches.length}`);

    for (const cacheName of acimaCaches) {
      console.log(`\n   📦 "${cacheName}":`);
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();

      console.log(`   - Total de itens: ${requests.length}`);

      // Agrupar por tipo
      const byType = {};
      requests.forEach((request) => {
        const url = request.url;
        const extension = url.split(".").pop()?.toLowerCase() || "unknown";
        if (!byType[extension]) byType[extension] = [];
        byType[extension].push(url);
      });

      Object.keys(byType).forEach((type) => {
        console.log(`   - .${type}: ${byType[type].length} arquivos`);
        byType[type].forEach((url) => {
          console.log(`     * ${url}`);
        });
      });
    }
  }

  // 3. Testar interceptação de requests
  console.log("\n🔄 TESTANDO INTERCEPTAÇÃO:");
  console.log("   Fazendo requests de teste...");

  const testUrls = [
    "/",
    "/manifest.json",
    "/icons/icon-192x192.png",
    "/logoGeralAcima.png",
  ];

  for (const url of testUrls) {
    try {
      const response = await fetch(url);
      console.log(`   ${url}: ${response.status} (${response.type})`);
    } catch (error) {
      console.log(`   ${url}: Erro - ${error.message}`);
    }
  }

  console.log("\n✅ Debug do Service Worker concluído!");
}

debugServiceWorker();
