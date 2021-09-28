var CACHE_STATIC_NAME = 'static-v25';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';
var STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/src/js/app.js',
  '/src/js/feed.js',
  '/src/js/idb.js',
  '/src/js/promise.js',
  '/src/js/fetch.js',
  '/src/js/material.min.js',
  '/src/assets/css/black-dashboard-pro-react.css',
  '/src/assets/css/bootstraps.min.css',
  '/static/media/icomoon.b65c7204.ttf',
  // 'https://maps.googleapis.com/maps-api-v3/api/js/46/6/common.js',
  'https://fonts.googleapis.com/css?family=Poppins:400,800',
  // 'https://maps.googleapis.com/maps-api-v3/api/js/46/6/util.js',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
];

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function (cache) {
      console.log('[Service Worker] Precaching App Shell');
      cache.addAll(STATIC_FILES);
    })
  );
});

self.addEventListener('push', function (event) {
  const payLoad = event.data
    ? JSON.parse(event.data.text())
    : 'sorry no payload';
  const title = 'Finanzen';
  console.log(payLoad);
  // if (payLoad.type === 'register') {
  event.waitUntil(
    self.registration.showNotification(title, {
      body: payLoad.msg,
      url: payLoad.url,
      icon: payLoad.icon,
    })
  );
  // }
});
