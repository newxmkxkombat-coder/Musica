// "Service worker": un ayudante que el navegador necesita para dejar
// instalar la página como una app. Aquí solo deja pasar las peticiones.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
