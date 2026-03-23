// ============================================
// USUAL US - Main Application Entry Point
// ============================================

// ---- Splash Screen Controller ----
// 10-second cinematic animation with 5 stages:
// Cosmic Awakening → Two Lights → Heart Morph → Orbit → Universe Reveal
// Stage 5 dissolves into a bridge glow that expands into the login screen
// Supports triple-tap skip (3 taps within 700ms)
const SPLASH_DISPLAY_MS = 9400;  // Time before starting normal exit
const SPLASH_EXIT_MS    = 1000;  // Normal exit animation duration (cinematic bridge)
const SPLASH_SKIP_MS    = 400;   // Skip exit animation duration (fast bridge)
const SPLASH_REVEAL_MS  = 300;   // Delay before login screen fades in (normal)
const SPLASH_REVEAL_SKIP_MS = 100; // Delay before login screen fades in (skip)
const TAP_WINDOW_MS     = 700;   // Triple-tap detection window

let _splashResolved = false;
let _tapCount = 0;
let _tapTimer = null;

function dismissSplash(quick) {
    return new Promise(resolve => {
        const splash = document.getElementById('splash-screen');
        if (!splash || splash.classList.contains('splash-done')) {
            resolve();
            return;
        }
        splash.removeEventListener('click', _handleSplashTap);

        // Start bridge glow + exit animation
        splash.classList.add(quick ? 'splash-skip' : 'splash-exit');

        // Reveal login screen mid-transition so backgrounds overlap seamlessly
        const revealDelay = quick ? SPLASH_REVEAL_SKIP_MS : SPLASH_REVEAL_MS;
        setTimeout(() => {
            const loginScreen = document.getElementById('login-screen');
            if (loginScreen && loginScreen.classList.contains('hidden')) {
                // initializeAuth will remove hidden; add reveal class preemptively
                loginScreen.classList.add('splash-reveal');
            }
        }, revealDelay);

        setTimeout(() => {
            splash.classList.add('splash-done');
            resolve();
        }, quick ? SPLASH_SKIP_MS : SPLASH_EXIT_MS);
    });
}

function _handleSplashTap() {
    if (_splashResolved) return;
    _tapCount++;
    if (_tapCount >= 3) {
        _splashResolved = true;
        _tapCount = 0;
        clearTimeout(_tapTimer);
        _startApp(true);
        return;
    }
    clearTimeout(_tapTimer);
    _tapTimer = setTimeout(() => { _tapCount = 0; }, TAP_WINDOW_MS);
}

async function _startApp(skipped) {
    if (_startApp._ran) return;
    _startApp._ran = true;
    await dismissSplash(!!skipped);
    initializeAuth();
    // Ensure the login screen reveal animation plays
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen && !loginScreen.classList.contains('splash-reveal')) {
        loginScreen.classList.add('splash-reveal');
    }
    setupEventListeners();
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initializeMusicPlayer());
    } else {
        setTimeout(initializeMusicPlayer, 300);
    }
}

async function loadData() {
    showLoading(true);
    try {
        // Load critical data for the home tab first
        await Promise.all([
            loadExpenses(),
            loadBudget()
        ]);
        // Defer non-critical modules until idle or tab switch
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                loadDeferredModules();
            });
        } else {
            setTimeout(loadDeferredModules, 200);
        }
    } catch (error) {
        console.error('❌ Error loading data:', error);
    }
    showLoading(false);
}

let _deferredLoaded = false;
async function loadDeferredModules() {
    if (_deferredLoaded) return;
    _deferredLoaded = true;
    try {
        await Promise.all([
            loadMemories(),
            loadNotes(),
            loadSecretNotes(),
            loadTodaysMood(),
            loadMoments()
        ]);
    } catch (err) {
        _deferredLoaded = false;
        console.warn('⚠️ Background data load error:', err);
    }
}

// ============================================
// Mobile Back Button Handler (History API)
// ============================================

// All modal IDs that can be open (checked in priority order)
const MODAL_IDS = [
    'photo-viewer-modal',
    'album-viewer-modal',
    'memory-modal',
    'settle-modal',
    'edit-expense-modal',
    'budget-modal',
    'note-modal',
    'secret-note-modal',
    'moments-modal',
    'moment-form-modal'
];

// Push a history entry so the back button has something to pop instead of exiting
function pushBackState() {
    history.pushState({ app: true }, '');
}

// Try to close the topmost open overlay; returns true if something was closed
function closeTopOverlay() {
    // 1. Image adjust modal (dynamically created)
    const adjustModal = document.querySelector('.image-adjust-modal');
    if (adjustModal) {
        adjustModal.remove();
        return true;
    }

    // 2. Any open modal (hidden class toggles visibility)
    for (const id of MODAL_IDS) {
        const modal = document.getElementById(id);
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            // Reset memory form when closing memory modal
            if (id === 'memory-modal' && typeof resetMemoryForm === 'function') {
                resetMemoryForm();
            }
            return true;
        }
    }

    // 3. Music player panel
    const musicPanel = document.getElementById('music-player-panel');
    if (musicPanel && musicPanel.classList.contains('active')) {
        musicPanel.classList.remove('active');
        if (typeof removeMusicBackdrop === 'function') removeMusicBackdrop();
        return true;
    }

    // 4. If not on home tab, switch back to home
    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav && activeNav.dataset.tab !== 'home') {
        switchTab('home');
        return true;
    }

    return false;
}

window.addEventListener('popstate', () => {
    closeTopOverlay();
    // Always re-push so there's a state to pop next time (prevents app exit)
    pushBackState();
});

// Initialize app — waits for splash to finish first
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 usual us - Initializing...');
    // Seed the history stack so back button doesn't immediately exit
    history.replaceState({ app: true }, '');
    pushBackState();

    // Set up triple-tap skip on splash
    const splash = document.getElementById('splash-screen');
    if (splash) {
        splash.addEventListener('click', _handleSplashTap);
    }

    // Wait for splash animation before showing any UI
    setTimeout(() => {
        if (!_splashResolved) {
            _splashResolved = true;
            _startApp(false);
        }
    }, SPLASH_DISPLAY_MS);
});

// Global Function Exports - Required for HTML onclick handlers
window.deleteExpense = deleteExpense;
window.showEditExpense = showEditExpense;
window.viewAlbum = viewAlbum;
window.viewSinglePhoto = viewSinglePhoto;
window.removePhoto = removePhoto;
window.handleNoteTouchStart = handleNoteTouchStart;
window.handleNoteTouchEnd = handleNoteTouchEnd;
window.handleNoteTouchMove = handleNoteTouchMove;

// Service Worker Registration
if ('serviceWorker' in navigator) {
    // Auto-reload when a new service worker takes control (critical for TWA
    // where users cannot manually refresh the page)
    let _swRefreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (_swRefreshing) return;
        _swRefreshing = true;
        window.location.reload();
    });

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker registered');
                // Detect waiting/installing workers and prompt activation
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                console.log('🔄 New version available — activating');
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                            }
                        });
                    }
                });
            })
            .catch(err => console.log('⚠️ SW registration failed:', err));
    });
}

// ============================================
// TWA Native-App Behavior Hardening
// ============================================
// Ensures the PWA feels indistinguishable from a native Android app
// when running inside a Trusted Web Activity.

// 1. Prevent Chrome scroll restoration artifacts during navigation
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// 2. Block Chrome horizontal overscroll navigation (edge-swipe)
// CSS overscroll-behavior: none handles most cases; this JS guard adds
// defense-in-depth by intercepting horizontal touch moves from screen edges.
(function blockEdgeSwipe() {
    const EDGE_ZONE = 30; // px from screen edge that triggers Chrome gesture
    let _edgeTouch = false;
    let _startX = 0;
    let _startY = 0;
    let _decided = false;
    let _blocking = false;

    document.addEventListener('touchstart', (e) => {
        const x = e.touches[0].clientX;
        _edgeTouch = x < EDGE_ZONE || x > window.innerWidth - EDGE_ZONE;
        _startX = x;
        _startY = e.touches[0].clientY;
        _decided = false;
        _blocking = false;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!_edgeTouch || !e.cancelable) return;
        // Never interfere with vertical scrolling inside the Us tab (PTR/native scroll)
        const inUsTab = e.target.closest && e.target.closest('#us-tab');
        if (inUsTab) return;
        // Determine swipe direction once after enough movement
        if (!_decided) {
            const touch = e.touches[0];
            const dxAbs = Math.abs(touch.clientX - _startX);
            const dyAbs = Math.abs(touch.clientY - _startY);
            const isHorizontal = dxAbs > dyAbs;
            // Only block when gesture starts at edge and nearest scrollable container
            // cannot continue in that horizontal direction.
            if (isHorizontal) {
                const dx = touch.clientX - _startX;
                const canScrollHorizontally = canScrollFromTarget(e.target, dx);
                _decided = true;
                _blocking = !canScrollHorizontally;
                return;
            }
            if (dxAbs + dyAbs < 10) return; // wait for meaningful movement
            _decided = true;
            _blocking = false;
        }
        if (_blocking) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', () => {
        _edgeTouch = false;
        _decided = false;
        _blocking = false;
    }, { passive: true });

    function canScrollFromTarget(target, deltaX) {
        if (!target || !target.closest) return false;
        const scroller = target.closest('.image-adjust-preview, .adjust-controls input[type="range"]');
        if (!scroller) return false;
        if (scroller.matches('input[type="range"]')) return true;
        const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
        if (maxScrollLeft <= 0) return false;
        if (deltaX < 0) return scroller.scrollLeft < maxScrollLeft;
        if (deltaX > 0) return scroller.scrollLeft > 0;
        return false;
    }
})();

console.log('✨ usual us - Complete rebuild ready for your love story');
