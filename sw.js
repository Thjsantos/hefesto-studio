// Service worker: makes the site installable and lets it open offline.
// Pages, scripts and data are fetched from the network first (so CMS changes show up right away)
// and fall back to the cached copy when offline. Photos are served from cache and refreshed in the background.
const CACHE = "hefesto-v1";
const SHELL = ["./", "index.html", "catalogo.html", "produto.html", "style.css", "products.js",
  "manifest.webmanifest", "assets/logo.png", "assets/icon-192.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return; // YouTube etc. go straight to the network

  const isImage = /\.(png|jpe?g|webp|gif|svg)$/i.test(url.pathname);
  e.respondWith(isImage ? staleWhileRevalidate(req) : networkFirst(req));
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req.url, { cache: "no-cache" });
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    return (await cache.match(req, { ignoreSearch: true })) || Response.error();
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  const fresh = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => cached);
  return cached || fresh;
}
