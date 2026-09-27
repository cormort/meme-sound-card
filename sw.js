/* 迷因音效控制板 Service Worker
   只快取「網頁本身」（index.html、manifest、圖示），讓沒網路時至少能開頁；
   音效檔在 memes.tw／archive.org 的 CDN 上（跨網域），交給瀏覽器的 HTTP 快取處理，
   自己加的音效存在 IndexedDB，離線一定能播。
   改版時把 index.html 的內容改掉即可：index.html 走 network-first，會拿到最新的。 */
const CACHE = 'msc-shell-v4';
const ASSETS = ['./', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('msc-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;      // 音效（跨網域）不介入

  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    e.respondWith((async () => {
      try {
        const res = await fetch(req);
        const c = await caches.open(CACHE); c.put(req, res.clone());
        return res;
      } catch {
        return (await caches.match(req)) || (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
      return res;
    } catch { return Response.error(); }
  })());
});
