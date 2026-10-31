// "Service worker": un ayudante que vive en el navegador, entre la app e internet.
//
// ⚡ ABRIR AL INSTANTE: guardamos una COPIA de la app en el móvil.
//   1) Cuando abres la app, te damos la copia guardada → abre al momento (incluso sin señal).
//   2) A la vez, por detrás, pedimos la versión nueva a internet y la guardamos.
//   3) La app compara su versión con la guardada: si hay una nueva, te avisa
//      "Hay una versión nueva" con un botón para actualizar.
const CAJA = "mi-musica";   // nombre de la "caja" donde guardamos la copia

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CAJA).then(c => c.addAll(["./", "./manifest.json"])).catch(() => {}));
});
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (e) => {
  const pedido = e.request;
  if (pedido.method !== "GET") return;
  const url = new URL(pedido.url);
  if (url.origin !== location.origin) return;   // YouTube, portadas, etc.: no los tocamos

  // La página (index.html): copia guardada YA, y la nueva por detrás
  if (pedido.mode === "navigate") {
    e.respondWith((async () => {
      const caja = await caches.open(CAJA);
      const guardada = await caja.match("./");
      const deInternet = fetch(pedido, { cache: "no-store" }).then(async (r) => {
        if (r.ok) await caja.put("./", r.clone());
        return r;
      });
      if (guardada) {
        e.waitUntil(deInternet.catch(() => {}));   // que termine de guardarse aunque ya respondimos
        return guardada;
      }
      return deInternet;   // primera vez: no hay copia todavía
    })());
    return;
  }

  // Iconos y manifest: la copia si existe; si no, de internet (y la guardamos)
  e.respondWith((async () => {
    const caja = await caches.open(CAJA);
    const guardada = await caja.match(pedido);
    const deInternet = fetch(pedido).then(async (r) => { if (r.ok) await caja.put(pedido, r.clone()); return r; });
    if (guardada) { e.waitUntil(deInternet.catch(() => {})); return guardada; }
    return deInternet;
  })());
});
