// ============================================
// Global State Variables
// ============================================

let currentUser = null;
let currentUserProfile = null;
let expenses = [];
let memories = [];
let notes = [];
let secretNotes = [];
let budget = null;
let selectedPhotos = [];
let balanceBeforeAction = null;
let currentAlbumIndex = 0;
let currentViewingMemoryId = null;
let longPressTimer = null;
let longPressNoteTimer = null;
let currentNoteLongPress = null;
let musicPlayer = null;
let musicWasPlaying = false;
let isSubmitting = false;
let recentlyPlayed = [];
let currentMood = null;
let isPullingToRefresh = false;
let currentSongIdx = -1;

// ============================================
// Helper Functions
// ============================================

function getPartnerRole() {
    return currentUserProfile.role === 'krishna' ? 'rashi' : 'krishna';
}

function getPartnerName() {
    const partnerRole = getPartnerRole();
    const partnerId = Object.keys(USERS).find(id => USERS[id].role === partnerRole);
    return USERS[partnerId]?.name || 'Partner';
}

function getDaysTogether() {
    const today = new Date();
    const diffTime = Math.abs(today - RELATIONSHIP_START);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function getDailyQuote() {
    const dayNumber = getDaysTogether();
    const quoteIndex = (dayNumber - 1) % DAILY_QUOTES.length;
    return DAILY_QUOTES[quoteIndex];
}

function isLateNight() {
    const hour = new Date().getHours();
    return hour >= 23 || hour < 6;
}
