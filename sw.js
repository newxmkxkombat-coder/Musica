// "Service worker": un ayudante que el navegador necesita para dejar
// instalar la página como una app.
// Además, cada vez que abres la app pide la página NUEVA a internet
// (sin usar la copia guardada), así siempre ves la última versión.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request, { cache: "no-store" }).catch(() => fetch(e.request)));
  }
});
