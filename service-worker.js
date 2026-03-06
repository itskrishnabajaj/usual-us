const CACHE_NAME = 'usual-us-v8';

const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/firebase.js',
    '/js/config.js',
    '/js/state.js',
    '/js/sounds.js',
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
    '/manifest.json',
    '/sounds/tabswitching.mp3',
    '/sounds/expadded.mp3',
    '/sounds/expdel.mp3',
    '/sounds/largememories.mp3',
    '/sounds/memoryadded.mp3',
    '/sounds/buttons.mp3',
    '/icons/tabs/hometab.svg',
    '/icons/tabs/addtab.svg',
    '/icons/tabs/historytab.svg',
    '/icons/tabs/statstab.svg',
    '/icons/tabs/ustab.svg',
    '/icons/1fhappy.svg',
    '/icons/2flovely.svg',
    '/icons/3fsad.svg',
    '/icons/4fcry.svg',
    '/icons/5ftired.svg',
    '/icons/c1food.svg',
    '/icons/c2dates.svg',
    '/icons/c3g_masti.svg',
    '/icons/c4gifts.svg',
    '/icons/c5home.svg',
    '/icons/c6regrets.svg',
    '/icons/c7misc.svg',
    '/icons/him.svg',
    '/icons/her.svg'
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

    // Network-first for same-origin navigation & script requests (avoids stale cached app)
    if (reqUrl.origin === self.location.origin && 
        (event.request.destination === 'document' || event.request.destination === 'script' || event.request.destination === 'style')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-first for everything else (images, fonts, etc.)
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
