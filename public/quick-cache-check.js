// Script rápido para ver o que está no cache
// Execute no console do navegador

console.log("🔍 VERIFICAÇÃO RÁPIDA DO CACHE...\n");

async function quickCacheCheck() {
  if (!("caches" in window)) {
    console.log("❌ Cache API não suportada");
    return;
  }

  const cacheNames = await caches.keys();
  console.log(`📦 Total de caches: ${cacheNames.length}\n`);

  for (const cacheName of cacheNames) {
    console.log(`🗂️ CACHE: "${cacheName}"`);
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    console.log(`   Itens: ${requests.length}`);
    requests.forEach((request, index) => {
      console.log(`   ${index + 1}. ${request.url}`);
    });
    console.log("");
  }
}

quickCacheCheck();
