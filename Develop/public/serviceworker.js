const APP_PREFIX = "Budget Tracker";
const VERSION = "V1.0";
const CACHE_NAME = APP_PREFIX + " " + VERSION;
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./js/index.js",
  "./css/styles.css",
  "./icons/icon-72x72.png",
  "./icons/icon-96x96.png",
  "./icons/icon-128x128.png",
  "./icons/icon-144x144.png",
  "./icons/icon-152x152.png",
  "./icons/icon-192x192.png",
  "./icons/icon-384x384.png",
  "./icons/icon-512x512.png",
  "./js/idb.js",
  "./manifest.json",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Installing cache: " + CACHE_NAME);

      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(keyList => {
      let cacheKeepList = keyList.filter(key => key.indexOf(APP_PREFIX));
      cacheKeepList.push(CACHE_NAME);

      return Promise.all(
        keyList.map((key, i) => {
          if (cacheKeepList.indexOf(key) === -1) {
            console.log("deleting cache: " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  console.log("fetch request: " + event.request.url);
  event.respondWith(
    caches.match(event.request).then(request => {
      return request || fetch(event.request);
    })
  );
});
