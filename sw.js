// Offline cache. Bump VERSION after each update so iPhones fetch the new files.
const VERSION = 'tap-tempo-v4';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
  'fonts/big-shoulders-display.woff2', 'fonts/ibm-plex-mono-400.woff2', 'fonts/ibm-plex-mono-600.woff2'
];

self.addEventListener('install', e => {
  // cache: 'reload' skips the browser's HTTP cache (GitHub Pages keeps files 10 min),
  // otherwise a new VERSION could be filled with the previous files
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(SHELL.map(url => new Request(url, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => e.request.mode === 'navigate' ? caches.match('index.html') : Response.error()))
  );
});
