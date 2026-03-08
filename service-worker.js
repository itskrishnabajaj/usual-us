const CACHE_NAME = 'usual-us-v36';

const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/firebase.js',
    '/lib/gsap.min.js',
    '/lib/lenis.min.js',
    '/lib/hammer.min.js',
    '/js/config.js',
    '/js/state.js',
    '/js/event-bus.js',
    '/js/sounds.js',
    '/js/animations.js',
    '/js/ui.js',
    '/js/stats.js',
    '/js/us-tab.js',
    '/js/budget.js',
    '/js/expenses.js',
    '/js/memories.js',
    '/js/notes.js',
    '/js/mood.js',
    '/js/moments.js',
    '/js/music.js',
    '/js/auth.js',
    '/js/app.js',
    '/manifest.json',
    '/icon-192.svg?v=2',
    '/icon-512.svg?v=2',
    '/icon-192.png?v=2',
    '/icon-512.png?v=2',
    '/screenshots/home.png',
    '/screenshots/expenses.png',
    '/screenshots/memories.png',
    '/screenshots/moments.png',
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
    '/icons/her.svg',
    '/icons/allsettled.svg',
    '/icons/welcomeback.svg',
    '/icons/splashheart.svg'
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
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        })
    );
    self.clients.claim();
});

// Notify all clients when a new version is activated
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', (event) => {
    // Skip service worker for video/audio requests to ensure range requests work properly on mobile
    const reqUrl = new URL(event.request.url);
    if (event.request.destination === 'video' || event.request.destination === 'audio' ||
        reqUrl.hostname === 'res.cloudinary.com') {
        return;
    }

    // Network-first for same-origin navigation, scripts, styles, and manifest (avoids stale cached app)
    const isManifest = reqUrl.pathname.endsWith('/manifest.json');
    if (reqUrl.origin === self.location.origin && 
        (event.request.destination === 'document' || event.request.destination === 'script' || event.request.destination === 'style' || isManifest)) {
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
