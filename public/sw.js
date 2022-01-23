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
  'https://fonts.googleapis.com/css?family=Poppins:400,800',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
];

self.addEventListener('install', function (event) {
  // console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function (cache) {
      // console.log('[Service Worker] Precaching App Shell');
      cache.addAll(STATIC_FILES);
    })
  );
});

self.addEventListener('push', async function (event) {
  const payLoad = event.data
    ? JSON.parse(event.data.text())
    : 'sorry no payload';
  // console.log(payLoad);

  const title = 'Finanzen';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: payLoad.msg,
      data: {
        url: payLoad.data.url,
      },
      badge: payLoad.badge,
      icon: payLoad.icon,
      tag: payLoad.tag,
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  var notification = event.notification;
  var action = event.action;

  // console.log(notification);

  if (action === 'confirm') {
    console.log('Confirm was chosen');
    notification.close();
  } else {
    // console.log(action);
    event.waitUntil(
      clients.matchAll().then(function (clis) {
        var client = clis.find(function (c) {
          return c.visibilityState === 'visible';
        });

        if (client !== undefined) {
          client.navigate(notification.data.url);
          client.focus();
        } else {
          clients.openWindow(notification.data.url);
        }
        notification.close();
      })
    );
  }
});

self.addEventListener('notificationclose', function (event) {
  var notification = event.notification;
  notification.close();
  // console.log('Notification was closed', event);
});
