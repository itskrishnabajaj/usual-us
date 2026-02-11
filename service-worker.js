const CACHE_NAME = 'usual-us-v5';

const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/firebase.js',
    '/js/config.js',
    '/js/state.js',
    '/js/ui.js',
    '/js/stats.js',
    '/js/us-tab.js',
    '/js/budget.js',
    '/js/expenses.js',
    '/js/memories.js',
    '/js/notes.js',
    '/js/mood.js',
    '/js/music.js',
    '/js/auth.js',
    '/js/app.js',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Skip service worker for video/audio requests to ensure range requests work properly on mobile
    const reqUrl = new URL(event.request.url);
    if (event.request.destination === 'video' || event.request.destination === 'audio' ||
        reqUrl.hostname === 'res.cloudinary.com') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                return fetch(event.request).then((response) => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                });
            })
    );
});
