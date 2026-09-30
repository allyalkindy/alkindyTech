// A minimal service worker for the YouTube Listener PWA.
//
// Its only real job is to satisfy the browser's "installable PWA"
// requirement (a registered service worker with a fetch handler) so the
// page can be added to a phone's home screen and keep playing audio more
// reliably while locked. It deliberately does NOT cache anything from
// /api/ — metadata must stay fresh and audio must always stream live,
// never come back as a saved copy.

const CACHE_NAME = "youtube-listener-shell-v1"
const SHELL_URL = "/solutions/youtube-listener"

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.add(SHELL_URL))
      .catch(() => {
        // Offline shell caching is a nice-to-have, not required for the
        // app to work, so a failure here shouldn't block installation.
      }),
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Never intercept the API: not resolving (metadata must be fresh) and
  // not streaming (audio must always come from the network, in real time).
  if (url.pathname.startsWith("/api/")) return

  // Everything else: network first, falling back to the cached page shell
  // so the app still opens if the phone is briefly offline.
  event.respondWith(fetch(event.request).catch(() => caches.match(SHELL_URL)))
})
