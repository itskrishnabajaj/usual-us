// ============================================
// USUAL US - Main Application Entry Point
// ============================================

// ---- Splash Screen Controller ----
// The splash animation runs ~1.8s, then a 0.4s exit = ~2.2s total.
// App initialization is delayed until the splash completes.
const SPLASH_DISPLAY_MS = 1800;  // Time before starting exit
const SPLASH_EXIT_MS    = 400;   // Exit animation duration

function dismissSplash() {
    return new Promise(resolve => {
        const splash = document.getElementById('splash-screen');
        if (!splash || splash.classList.contains('splash-done')) {
            resolve();
            return;
        }
        splash.classList.add('splash-exit');
        setTimeout(() => {
            splash.classList.add('splash-done');
            resolve();
        }, SPLASH_EXIT_MS);
    });
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

    // Wait for splash animation before showing any UI
    setTimeout(async () => {
        await dismissSplash();
        initializeAuth();
        setupEventListeners();
        // Defer music player init — only needed on Us tab
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => initializeMusicPlayer());
        } else {
            setTimeout(initializeMusicPlayer, 300);
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
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker registered');
                // Check for updates periodically
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
                                // New version available — reload for the user
                                console.log('🔄 New version available');
                            }
                        });
                    }
                });
            })
            .catch(err => console.log('⚠️ SW registration failed:', err));
    });
}

console.log('✨ usual us - Complete rebuild ready for your love story');
