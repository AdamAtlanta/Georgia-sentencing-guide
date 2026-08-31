/* global caches, fetch, Request, Response, self, URL */
/* Georgia Sentencing Guide offline service worker. */
const CACHE_VERSION = "2026-08-31-1";
const CACHE_PREFIX = "ga-sentencing-guide";
const APP_CACHE = `${CACHE_PREFIX}-app-${CACHE_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-${CACHE_VERSION}`;
const APP_SHELL_URLS = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
  "/favicon.ico",
];

function isCacheable(response) {
  return response && response.ok && response.type === "basic";
}

async function fetchAndCache(cache, url) {
  const request = new Request(url, { cache: "reload" });
  const response = await fetch(request);

  if (isCacheable(response)) {
    await cache.put(request, response.clone());
  }

  return response;
}

function extractStaticAssets(html) {
  const assets = new Set();
  const attributePattern = /(?:src|href)=["']([^"'#]+)["']/g;

  for (const match of html.matchAll(attributePattern)) {
    try {
      const url = new URL(match[1], self.location.origin);

      if (
        url.origin === self.location.origin &&
        url.pathname.startsWith("/_next/static/")
      ) {
        assets.add(url.href);
      }
    } catch {
      // Ignore malformed or unsupported asset URLs in the generated HTML.
    }
  }

  return [...assets];
}

async function warmAppShell() {
  const cache = await caches.open(APP_CACHE);

  await Promise.allSettled(
    APP_SHELL_URLS.slice(1).map((url) => fetchAndCache(cache, url)),
  );

  try {
    const response = await fetch(new Request("/", { cache: "reload" }));

    if (!isCacheable(response)) {
      return;
    }

    const html = await response.clone().text();
    await cache.put("/", response);

    await Promise.allSettled(
      extractStaticAssets(html).map((url) => fetchAndCache(cache, url)),
    );
  } catch {
    // Installation remains valid even if the first shell warm-up is interrupted.
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(warmAppShell());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const currentCaches = new Set([APP_CACHE, RUNTIME_CACHE]);

      await Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName.startsWith(`${CACHE_PREFIX}-`) &&
              !currentCaches.has(cacheName),
          )
          .map((cacheName) => caches.delete(cacheName)),
      );

      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request);

  if (isCacheable(response)) {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response.clone());
  }

  return response;
}

async function networkFirstPage(request) {
  try {
    const response = await fetch(request);

    if (isCacheable(response)) {
      const cache = await caches.open(APP_CACHE);
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    return (
      (await caches.match(request, { ignoreSearch: true })) ||
      (await caches.match("/")) ||
      Response.error()
    );
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname === "/data-version.json") {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    APP_SHELL_URLS.includes(url.pathname)
  ) {
    event.respondWith(cacheFirst(request));
  }
});
