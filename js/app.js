// ============================================
// USUAL US - Main Application Entry Point
// ============================================

async function loadData() {
    showLoading(true);
    try {
        await Promise.all([
            loadExpenses(),
            loadMemories(),
            loadNotes(),
            loadSecretNotes(),
            loadBudget(),
            loadTodaysMood()
        ]);
    } catch (error) {
        console.error('❌ Error loading data:', error);
    }
    showLoading(false);
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
    'secret-note-modal'
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
        const backdrop = document.querySelector('.music-panel-backdrop');
        if (backdrop) {
            backdrop.classList.remove('active');
            setTimeout(() => backdrop.remove(), 300);
        }
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

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 usual us - Initializing...');
    // Seed the history stack so back button doesn't immediately exit
    history.replaceState({ app: true }, '');
    pushBackState();

    initializeAuth();
    initializeMusicPlayer();
    setupEventListeners();
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
            .then(registration => console.log('✅ Service Worker registered'))
            .catch(err => console.log('⚠️ SW registration failed:', err));
    });
}

console.log('✨ usual us - Complete rebuild ready for your love story');
