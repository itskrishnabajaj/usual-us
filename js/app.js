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

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 usual us - Initializing...');
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
