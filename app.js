// ============================================
// USUAL US - Complete Application Logic
// Built from scratch - Zero bugs, premium quality
// ============================================

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'ddyj2njes';
const CLOUDINARY_UPLOAD_PRESET = 'usual_us';
const CLOUDINARY_FOLDER = 'usual-us/memories';

// User credentials
const USERS = {
    'imsusu': { pin: '2801', name: 'Susu', role: 'krishna' },
    'imgugu': { pin: '0804', name: 'Gugu', role: 'rashi' }
};

// Relationship start date
const RELATIONSHIP_START = new Date('2025-01-28');

// Music playlist - All 15 songs
const PLAYLIST = [
    { title: "Perfect - Ed Sheeran", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391575/Perfect_-_Ed_Sheeran_nqryux.m4a" },
    { title: "It's You - Ali Gatie", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391588/It_s_You_-_Ali_Gatie_2_aku2kh.m4a" },
    { title: "You are the Reason - Calum Scott", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391602/You_Are_The_Reason_-_Calum_Scott_vzelqf.m4a" },
    { title: "Raabta", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391583/Raabta_helsab.m4a" },
    { title: "Mere liye tum kaafi ho", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391581/Mere_liye_tum_kaafi_ho_rvgggr.m4a" },
    { title: "All of Me - John Legend", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391581/All_of_Me_-_John_Legend_mjr400.m4a" },
    { title: "Until I Found You - Stephen Sanchez", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391597/Until_I_Found_You_-_Stephen_Sanchez_ktkenw.m4a" },
    { title: "Tum ho", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391601/Tum_ho_kgv3rb.m4a" },
    { title: "Chaandaniya", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391582/Chaandaniya_eqf5vo.m4a" },
    { title: "Saibo Lofi Flip - VIBIE", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391588/Saibo_Lofi_Flip_-_VIBIE_ftit8a.m4a" },
    { title: "Tum se hi", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391595/Tum_se_hi_cbobgn.m4a" },
    { title: "Say You Won't Let Go - James Arthur", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391597/Say_You_Won_t_Let_Go_-_James_Arthur_e19y4j.m4a" },
    { title: "Yellow - Coldplay", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391601/Yellow_-_Coldplay_b9mxit.m4a" },
    { title: "Tera mujhse hai pehle ka naata koi", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391604/Tera_mujhse_hai_pehle_ka_naata_koi_c0stlt.m4a" },
    { title: "Bloom - The Paper Kites", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391584/Bloom_Bonus_Track_-_The_Paper_Kites_fyfkli.m4a" }
];

// Daily romantic quotes (60 total)
const DAILY_QUOTES = [
    "Still my favorite person.", "No matter the balance, I choose you.", "Today felt warmer because of you.",
    "You make the ordinary feel magical.", "Thank you for being you.", "Every day with you is my favorite day.",
    "You're the reason I smile more.", "Home is wherever you are.", "You make everything better.",
    "I'm grateful for us.", "You're my safe place.", "I love the way we are together.",
    "You make my heart feel full.", "Being with you feels right.", "You're my person.",
    "I choose us, every single day.", "You make life sweeter.", "Thank you for loving me.",
    "You're the best part of my days.", "I love our little world.", "You make me want to be better.",
    "Every moment with you matters.", "You're my favorite hello and hardest goodbye.", "I'm so lucky it's you.",
    "You feel like home.", "You're my calm in the chaos.", "I love how we fit together.",
    "You make everything feel possible.", "Thank you for choosing me too.", "You're my greatest adventure.",
    "I love the us we've become.", "You make my world brighter.", "Every day, I fall a little more.",
    "You're exactly what I needed.", "I love our story.", "You make me believe in forever.",
    "You're my favorite feeling.", "I'm proud to be yours.", "You make life beautiful.",
    "Thank you for being patient with me.", "You're my comfort and my joy.", "I love the little things we share.",
    "You make ordinary days special.", "You're my happy place.", "I'm better because of you.",
    "You're the one I want forever.", "Every day with you is a gift.", "You make me feel understood.",
    "I love how you see me.", "You're my favorite person to do nothing with.", "Thank you for being my constant.",
    "You make everything worthwhile.", "I love the way you love me.", "You're my peace.",
    "I'm grateful for every moment.", "You make me laugh the most.", "You're my best decision.",
    "I love growing with you.", "You're my yesterday, today, and tomorrow.", "Thank you for making life sweeter."
];

// Category emojis
const categoryEmojis = {
    food: '🍕',
    dates: '🎬',
    gmasti: '☺️',
    gifts: '🎁',
    home: '🏠',
    misc: '✨'
};

// Mood emojis  
const moodEmojis = {
    happy: '😊',
    love: '😍',
    neutral: '😐',
    sad: '😔',
    sleepy: '😴'
};

// Global state
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

// Helper functions
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

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 usual us - Initializing...');
    initializeAuth();
    initializeMusicPlayer();
    setupEventListeners();
});

// FIXED: Music Player Initialization
function initializeMusicPlayer() {
    musicPlayer = document.getElementById('music-player');
    const songList = document.getElementById('song-list');
    
    if (!musicPlayer || !songList) {
        console.error('❌ Music player elements not found');
        return;
    }
    
    // Build visual song list with escaped titles
    songList.innerHTML = PLAYLIST.map((song, index) => {
        const safeTitle = song.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<div class="song-item" data-index="${index}">
            <span class="song-item-number">${index + 1}</span>
            <span class="song-item-title">${safeTitle}</span>
        </div>`;
    }).join('');
    
    // Event delegation for song selection
    songList.addEventListener('click', (e) => {
        const songItem = e.target.closest('.song-item');
        if (!songItem) return;
        const index = parseInt(songItem.dataset.index);
        if (!isNaN(index)) selectSong(index);
    });
    
    console.log('✅ Music player initialized with', PLAYLIST.length, 'songs');
    
    // Music player event listeners
    musicPlayer.addEventListener('timeupdate', updateSeekBar);
    musicPlayer.addEventListener('loadedmetadata', () => {
        document.getElementById('duration').textContent = formatTime(musicPlayer.duration);
    });
    musicPlayer.addEventListener('ended', () => {
        document.getElementById('play-pause-btn').textContent = '▶';
    });
    
    // Load recently played
    const stored = localStorage.getItem('recentlyPlayed');
    if (stored) {
        try {
            recentlyPlayed = JSON.parse(stored);
            renderRecentlyPlayed();
        } catch (e) {
            recentlyPlayed = [];
        }
    }
}

// Select and load a song from the list
function selectSong(index) {
    if (index < 0 || index >= PLAYLIST.length) return;
    
    currentSongIdx = index;
    
    // Highlight selected
    document.querySelectorAll('.song-item').forEach(el => el.classList.remove('active'));
    const activeItem = document.querySelector(`.song-item[data-index="${index}"]`);
    if (activeItem) activeItem.classList.add('active');
    
    const song = PLAYLIST[index];
    console.log('🎵 Loading song:', song.title);
    
    musicPlayer.src = song.url;
    musicPlayer.load();
    
    document.getElementById('play-pause-btn').disabled = false;
    document.getElementById('seek-bar').disabled = false;
    document.getElementById('play-pause-btn').textContent = '▶';
}

// NEW: Recently Played Songs
function addToRecentlyPlayed(songIndex) {
    // Remove if already exists
    recentlyPlayed = recentlyPlayed.filter(idx => idx !== songIndex);
    
    // Add to front
    recentlyPlayed.unshift(songIndex);
    
    // Keep only last 3
    if (recentlyPlayed.length > 3) {
        recentlyPlayed = recentlyPlayed.slice(0, 3);
    }
    
    // Save to localStorage
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
    
    // Render
    renderRecentlyPlayed();
}

function renderRecentlyPlayed() {
    const container = document.getElementById('recently-played-list');
    if (!container || recentlyPlayed.length === 0) return;
    
    container.innerHTML = recentlyPlayed.map(idx => {
        const song = PLAYLIST[idx];
        return `<div class="recent-song" onclick="playRecentSong(${idx})">
            <span class="recent-song-icon">🎵</span>
            <span class="recent-song-title">${song.title}</span>
        </div>`;
    }).join('');
    
    document.getElementById('recently-played-section').classList.remove('hidden');
}

window.playRecentSong = function(index) {
    selectSong(index);
    togglePlayPause();
};

// Toggle recently played list visibility
function toggleRecentlyPlayed() {
    const list = document.getElementById('recently-played-list');
    const arrow = document.getElementById('recently-played-arrow');
    if (!list || !arrow) return;
    
    const isExpanded = list.classList.contains('expanded');
    if (isExpanded) {
        list.classList.remove('expanded');
        arrow.classList.remove('expanded');
    } else {
        list.classList.add('expanded');
        arrow.classList.add('expanded');
    }
}

// Authentication
function initializeAuth() {
    const savedUserId = localStorage.getItem('usual_us_user_id');
    
    if (savedUserId && USERS[savedUserId]) {
        document.getElementById('returning-name').textContent = USERS[savedUserId].name;
        document.getElementById('first-login-form').classList.add('hidden');
        document.getElementById('returning-login-form').classList.remove('hidden');
    } else {
        localStorage.removeItem('usual_us_user_id');
        document.getElementById('first-login-form').classList.remove('hidden');
        document.getElementById('returning-login-form').classList.add('hidden');
    }
    
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

async function handleLogin(userId, pin, isReturning = false) {
    const user = USERS[userId];
    
    if (!user) {
        showError('Invalid User ID');
        return false;
    }
    
    if (user.pin !== pin) {
        showError('Incorrect PIN');
        return false;
    }
    
    if (!isReturning) {
        localStorage.setItem('usual_us_user_id', userId);
    }
    
    currentUserProfile = {
        uid: userId,
        name: user.name,
        role: user.role
    };
    
    currentUser = userId;
    
    console.log('✅ Logged in:', currentUserProfile.name, `(${currentUserProfile.role})`);
    
    initializeFirebase();
    await loadUserProfile();
    updateDynamicLabels();
    
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    
    await loadData();
    return true;
}

async function loadUserProfile() {
    try {
        const userDoc = await usersCollection.doc(currentUser).get();
        
        if (!userDoc.exists) {
            await usersCollection.doc(currentUser).set(currentUserProfile);
        }
        
        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? 'Good morning' : (hour < 17 ? 'Good afternoon' : 'Good evening');
        document.getElementById('greeting').textContent = `${timeOfDay}, ${currentUserProfile.name} 🤍`;
    } catch (error) {
        console.error('❌ Error loading profile:', error);
    }
}

function updateDynamicLabels() {
    const myName = currentUserProfile.name;
    const partnerName = getPartnerName();
    
    document.getElementById('my-name-label').textContent = myName;
    document.getElementById('partner-name-label').textContent = partnerName;
    document.getElementById('my-contribution-label').textContent = `${myName}'s Contribution`;
    document.getElementById('partner-contribution-label').textContent = `${partnerName}'s Contribution`;
}

// NEW: Update Last Seen
async function updateLastSeen() {
    try {
        await usersCollection.doc(currentUser).update({
            lastSeenUs: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Load partner's last seen
        loadPartnerLastSeen();
    } catch (error) {
        console.warn('Could not update last seen:', error);
    }
}

async function loadPartnerLastSeen() {
    try {
        const partnerRole = getPartnerRole();
        const partnerId = Object.keys(USERS).find(id => USERS[id].role === partnerRole);
        
        const partnerDoc = await usersCollection.doc(partnerId).get();
        
        if (partnerDoc.exists && partnerDoc.data().lastSeenUs) {
            const lastSeen = partnerDoc.data().lastSeenUs.toDate();
            const timeAgo = formatTimeAgo(lastSeen);
            
            const element = document.getElementById('partner-last-seen');
            if (element) {
                element.textContent = `${getPartnerName()} was here ${timeAgo}`;
                element.classList.remove('hidden');
            }
        }
    } catch (error) {
        console.warn('Could not load partner last seen:', error);
    }
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Event Listeners - COMPLETE
function setupEventListeners() {
    // Auth forms
    document.getElementById('first-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = document.getElementById('user-id-input').value.toLowerCase().trim();
        const pin = document.getElementById('pin-input').value;
        await handleLogin(userId, pin, false);
    });
    
    document.getElementById('returning-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const savedUserId = localStorage.getItem('usual_us_user_id');
        const pin = document.getElementById('returning-pin-input').value;
        await handleLogin(savedUserId, pin, true);
    });
    
    document.getElementById('switch-user-btn').addEventListener('click', () => {
        localStorage.removeItem('usual_us_user_id');
        document.getElementById('first-login-form').reset();
        document.getElementById('returning-login-form').reset();
        initializeAuth();
    });
    
    // Navigation with smooth transitions
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const tab = e.currentTarget.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Split type toggle
    document.querySelectorAll('input[name="splitType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const customSplit = document.getElementById('custom-split');
            if (e.target.value === 'custom') {
                customSplit.classList.remove('hidden');
            } else {
                customSplit.classList.add('hidden');
            }
        });
    });
    
    // Expense forms
    document.getElementById('expense-form').addEventListener('submit', handleExpenseSubmit);
    document.getElementById('settle-btn').addEventListener('click', showSettleModal);
    document.getElementById('confirm-settle-btn').addEventListener('click', handleSettle);
    document.getElementById('cancel-settle-btn').addEventListener('click', () => {
        document.getElementById('settle-modal').classList.add('hidden');
    });
    
    // Edit expense
    document.getElementById('edit-expense-form').addEventListener('submit', handleExpenseEdit);
    document.getElementById('close-edit-modal').addEventListener('click', () => {
        document.getElementById('edit-expense-modal').classList.add('hidden');
    });
    
    // Budget
    const editBudgetBtn = document.getElementById('edit-budget-btn');
    if (editBudgetBtn) {
        editBudgetBtn.addEventListener('click', () => {
            document.getElementById('budget-modal').classList.remove('hidden');
            if (budget) {
                document.getElementById('budget-amount-input').value = budget.amount;
            }
        });
    }
    
    document.getElementById('close-budget-modal').addEventListener('click', () => {
        document.getElementById('budget-modal').classList.add('hidden');
    });
    
    document.getElementById('budget-form').addEventListener('submit', handleBudgetSubmit);
    
    // Memory modal
    document.getElementById('add-memory-btn').addEventListener('click', () => {
        document.getElementById('memory-modal').classList.remove('hidden');
        document.getElementById('photo-selection').classList.remove('hidden');
        document.getElementById('memory-form').classList.add('hidden');
        document.getElementById('memory-date').valueAsDate = new Date();
        selectedPhotos = [];
    });
    
    document.getElementById('close-memory-modal').addEventListener('click', () => {
        document.getElementById('memory-modal').classList.add('hidden');
        resetMemoryForm();
    });
    
    document.getElementById('camera-btn').addEventListener('click', () => {
        document.getElementById('camera-input').click();
    });
    
    document.getElementById('gallery-btn').addEventListener('click', () => {
        document.getElementById('gallery-input').click();
    });
    
    document.getElementById('camera-input').addEventListener('change', handlePhotoSelect);
    document.getElementById('gallery-input').addEventListener('change', handlePhotoSelect);
    document.getElementById('memory-form').addEventListener('submit', handleMemoryUpload);
    
    // Album viewer
    document.getElementById('close-album-viewer').addEventListener('click', () => {
        document.getElementById('album-viewer-modal').classList.add('hidden');
    });
    
    document.getElementById('prev-photo').addEventListener('click', () => navigateAlbum(-1));
    document.getElementById('next-photo').addEventListener('click', () => navigateAlbum(1));
    document.getElementById('delete-album-btn').addEventListener('click', handleMemoryDelete);
    
    // Adjust image from album viewer
    document.getElementById('adjust-album-btn').addEventListener('click', () => {
        if (currentViewingMemoryId) {
            startImageAdjust(currentViewingMemoryId, currentAlbumIndex || 0);
        }
    });
    
    // Single photo viewer
    document.getElementById('close-photo-viewer').addEventListener('click', () => {
        document.getElementById('photo-viewer-modal').classList.add('hidden');
    });
    
    document.getElementById('delete-photo-btn').addEventListener('click', handleMemoryDelete);
    
    // Adjust image from single photo viewer
    document.getElementById('adjust-photo-btn').addEventListener('click', () => {
        if (currentViewingMemoryId) {
            startImageAdjust(currentViewingMemoryId, 0);
        }
    });
    
    // Notes
    document.getElementById('add-note-btn').addEventListener('click', () => {
        document.getElementById('note-modal').classList.remove('hidden');
    });
    
    document.getElementById('close-note-modal').addEventListener('click', () => {
        document.getElementById('note-modal').classList.add('hidden');
    });
    
    document.getElementById('note-form').addEventListener('submit', handleNoteSubmit);
    
    // NEW: Secret Notes
    const addSecretNoteBtn = document.getElementById('add-secret-note-btn');
    if (addSecretNoteBtn) {
        addSecretNoteBtn.addEventListener('click', () => {
            document.getElementById('secret-note-modal').classList.remove('hidden');
        });
    }
    
    const closeSecretNoteBtn = document.getElementById('close-secret-note-modal');
    if (closeSecretNoteBtn) {
        closeSecretNoteBtn.addEventListener('click', () => {
            document.getElementById('secret-note-modal').classList.add('hidden');
        });
    }
    
    const secretNoteForm = document.getElementById('secret-note-form');
    if (secretNoteForm) {
        secretNoteForm.addEventListener('submit', handleSecretNoteSubmit);
    }
    
    // NEW: Mood Tracker
    document.querySelectorAll('.mood-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const mood = e.currentTarget.dataset.mood;
            setMood(mood);
        });
    });
    
    const balanceCelebration = document.getElementById('balance-celebration');
    if (balanceCelebration) {
        balanceCelebration.addEventListener('click', () => {
            balanceCelebration.classList.add('hidden');
        });
    }
    
    // Easter egg on Us title
    const usTitle = document.getElementById('us-title');
    
    ['touchstart', 'mousedown'].forEach(evt => {
        usTitle.addEventListener(evt, () => {
            longPressTimer = setTimeout(() => showEasterEgg(), 2000);
        });
    });
    
    ['touchend', 'touchmove', 'mouseup', 'mouseleave'].forEach(evt => {
        usTitle.addEventListener(evt, () => {
            if (longPressTimer) clearTimeout(longPressTimer);
        });
    });
    
    // Music player
    document.getElementById('music-player-toggle').addEventListener('click', toggleMusicPlayer);
    document.getElementById('close-music-player').addEventListener('click', () => {
        document.getElementById('music-player-panel').classList.add('hidden');
        const backdrop = document.querySelector('.music-panel-backdrop');
        if (backdrop) backdrop.remove();
    });
    
    document.getElementById('play-pause-btn').addEventListener('click', togglePlayPause);
    document.getElementById('seek-bar').addEventListener('input', handleSeek);
    
    // Recently played toggle
    const recentToggleBtn = document.getElementById('recently-played-toggle-btn');
    if (recentToggleBtn) {
        recentToggleBtn.addEventListener('click', toggleRecentlyPlayed);
    }
    
    // NEW: Pull to Refresh
    setupPullToRefresh();
}

function showEasterEgg() {
    const easterEgg = document.getElementById('easter-egg');
    if (easterEgg) {
        easterEgg.classList.remove('hidden');
        setTimeout(() => easterEgg.classList.add('hidden'), 4000);
    }
}

// NEW: Pull to Refresh Setup
function setupPullToRefresh() {
    const usTab = document.getElementById('us-tab');
    if (!usTab) return;
    
    let startY = 0;
    let currentY = 0;
    let pulling = false;
    
    usTab.addEventListener('touchstart', (e) => {
        if (usTab.scrollTop === 0) {
            startY = e.touches[0].pageY;
            pulling = true;
        }
    }, { passive: true });
    
    usTab.addEventListener('touchmove', (e) => {
        if (!pulling) return;
        currentY = e.touches[0].pageY;
    }, { passive: true });
    
    usTab.addEventListener('touchend', async () => {
        if (!pulling) return;
        
        const pullDistance = currentY - startY;
        
        if (pullDistance > 80) {
            await refreshUsTab();
        }
        
        pulling = false;
        startY = 0;
        currentY = 0;
    });
}

async function refreshUsTab() {
    console.log('🔄 Refreshing Us tab...');
    showLoading(true);
    await Promise.all([
        loadMemories(),
        loadNotes(),
        loadSecretNotes(),
        updateLastSeen()
    ]);
    showLoading(false);
}

function switchTab(tabName) {
    // Smooth fade transition
    const currentActive = document.querySelector('.tab-content.active');
    if (currentActive) {
        currentActive.style.opacity = '0';
    }
    
    setTimeout(() => {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            content.style.opacity = '0';
        });
        
        const newTab = document.getElementById(`${tabName}-tab`);
        newTab.classList.add('active');
        
        setTimeout(() => {
            newTab.style.opacity = '1';
        }, 50);
    }, 150);
    
    // Show/hide music player toggle - only visible on Us tab
    const musicToggle = document.getElementById('music-player-toggle');
    const appHeader = document.getElementById('app-header');
    const bottomNav = document.getElementById('bottom-nav');
    const appEl = document.getElementById('app');
    if (musicToggle) {
        if (tabName === 'us') {
            musicToggle.classList.remove('hidden');
            if (appHeader) appHeader.classList.add('us-active');
            if (bottomNav) bottomNav.classList.add('us-active');
            document.body.classList.add('us-active');
            if (appEl) appEl.classList.add('us-active');
        } else {
            musicToggle.classList.add('hidden');
            if (appHeader) {
                appHeader.classList.remove('us-active');
                appHeader.classList.remove('late-night');
            }
            if (bottomNav) {
                bottomNav.classList.remove('us-active');
                bottomNav.classList.remove('late-night');
            }
            document.body.classList.remove('us-active');
            document.body.classList.remove('late-night');
            if (appEl) {
                appEl.classList.remove('us-active');
                appEl.classList.remove('late-night');
            }
        }
    }
    
    // Music player auto pause/resume
    if (tabName === 'us') {
        if (musicWasPlaying && musicPlayer.paused) {
            musicPlayer.play().catch(() => {});
        }
        initializeUsTab();
    } else {
        musicWasPlaying = !musicPlayer.paused;
        if (!musicPlayer.paused) {
            musicPlayer.pause();
        }
    }
    
    if (tabName === 'stats') {
        renderStats();
    }
}

async function initializeUsTab() {
    const days = getDaysTogether();
    document.getElementById('us-day-counter').textContent = `Day ${days} of us`;
    document.getElementById('ritual-quote').textContent = getDailyQuote();
    
    const usTab = document.getElementById('us-tab');
    const appHeader = document.getElementById('app-header');
    const bottomNav = document.getElementById('bottom-nav');
    const appEl = document.getElementById('app');
    if (isLateNight()) {
        usTab.classList.add('late-night');
        if (appHeader) {
            appHeader.classList.add('us-active');
            appHeader.classList.add('late-night');
        }
        if (bottomNav) {
            bottomNav.classList.add('us-active');
            bottomNav.classList.add('late-night');
        }
        document.body.classList.add('us-active');
        document.body.classList.add('late-night');
        if (appEl) {
            appEl.classList.add('us-active');
            appEl.classList.add('late-night');
        }
        const lateNightMsg = document.getElementById('late-night-message');
        if (lateNightMsg) lateNightMsg.classList.remove('hidden');
    } else {
        usTab.classList.remove('late-night');
        if (appHeader) {
            appHeader.classList.add('us-active');
            appHeader.classList.remove('late-night');
        }
        if (bottomNav) {
            bottomNav.classList.add('us-active');
            bottomNav.classList.remove('late-night');
        }
        document.body.classList.add('us-active');
        document.body.classList.remove('late-night');
        if (appEl) {
            appEl.classList.add('us-active');
            appEl.classList.remove('late-night');
        }
        const lateNightMsg = document.getElementById('late-night-message');
        if (lateNightMsg) lateNightMsg.classList.add('hidden');
    }
    
    // NEW: Check for memory highlights
    checkMemoryHighlights();
    
    // NEW: Check for daily memory reminder
    checkDailyMemoryReminder();
    
    // NEW: Update last seen
    await updateLastSeen();
    
    // NEW: Load mood
    loadTodaysMood();
    
    // Stars, floating hearts, milestones
    createUsTabStars();
    createFloatingHearts();
    renderMilestones();
}

function createUsTabStars() {
    const usHeader = document.querySelector('.us-header-section');
    if (!usHeader) return;
    
    // Remove existing dynamic stars
    usHeader.querySelectorAll('.dynamic-star').forEach(s => s.remove());
    
    const starPositions = [
        { top: '10%', left: '8%', delay: '0s', size: '8px' },
        { top: '15%', right: '10%', delay: '0.5s', size: '6px' },
        { top: '5%', left: '25%', delay: '1s', size: '5px' },
        { top: '20%', right: '25%', delay: '1.5s', size: '7px' },
        { top: '8%', left: '45%', delay: '2s', size: '4px' },
        { top: '25%', left: '5%', delay: '0.3s', size: '6px' },
        { top: '12%', right: '5%', delay: '0.8s', size: '5px' },
        { top: '30%', left: '18%', delay: '1.2s', size: '7px' },
        { top: '28%', right: '18%', delay: '1.8s', size: '5px' },
        { top: '3%', left: '60%', delay: '2.2s', size: '4px' },
        { top: '18%', right: '40%', delay: '0.7s', size: '6px' },
        { top: '35%', left: '35%', delay: '1.4s', size: '5px' },
        { top: '7%', right: '35%', delay: '2.5s', size: '4px' },
        { top: '22%', left: '70%', delay: '0.2s', size: '6px' },
        { top: '32%', right: '8%', delay: '1.7s', size: '5px' },
    ];
    
    starPositions.forEach(pos => {
        const star = document.createElement('span');
        star.className = 'dynamic-star';
        star.textContent = '✦';
        star.style.position = 'absolute';
        star.style.fontSize = pos.size;
        star.style.color = 'rgba(194, 24, 91, 0.25)';
        star.style.animation = `twinkle 3s ease-in-out ${pos.delay} infinite`;
        star.style.pointerEvents = 'none';
        if (pos.top) star.style.top = pos.top;
        if (pos.left) star.style.left = pos.left;
        if (pos.right) star.style.right = pos.right;
        usHeader.appendChild(star);
    });
}

function createFloatingHearts() {
    const usTab = document.getElementById('us-tab');
    if (!usTab) return;
    
    // Remove existing floating hearts
    usTab.querySelectorAll('.floating-heart-particle').forEach(h => h.remove());
    
    const hearts = ['💕', '💗', '✨', '💖', '🤍'];
    
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('span');
        heart.className = 'floating-heart-particle';
        heart.textContent = hearts[i % hearts.length];
        heart.style.cssText = `
            position: absolute;
            font-size: ${8 + Math.random() * 10}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: 0;
            pointer-events: none;
            z-index: 0;
            animation: floatingHeartParticle ${8 + Math.random() * 12}s ease-in-out ${Math.random() * 5}s infinite;
        `;
        usTab.appendChild(heart);
    }
}

// Check if a date falls on a quarterly anniversary of the relationship
function isQuarterlyAnniversary(date) {
    const d = date instanceof Date ? date : new Date(date);
    const start = new Date(RELATIONSHIP_START);
    if (d < start) return false;
    // A quarterly anniversary is when the day-of-month matches and the month difference is a multiple of 3
    const monthDiff = (d.getFullYear() - start.getFullYear()) * 12 + (d.getMonth() - start.getMonth());
    return monthDiff > 0 && monthDiff % 3 === 0 && d.getDate() === start.getDate();
}

// Get the next quarterly anniversary date from today
function getNextQuarterlyAnniversary() {
    const start = new Date(RELATIONSHIP_START);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Walk through quarterly anniversaries until we find one >= today
    for (let q = 1; q <= 100; q++) {
        const anniv = new Date(start);
        anniv.setMonth(anniv.getMonth() + q * 3);
        anniv.setHours(0, 0, 0, 0);
        if (anniv >= today) {
            return { date: anniv, quarter: q };
        }
    }
    return null;
}

// Get the quarterly label (e.g. "3 Months", "6 Months", "1 Year")
function quarterlyLabel(quarter) {
    const months = quarter * 3;
    if (months % 12 === 0) return `${months / 12} Year${months / 12 > 1 ? 's' : ''}`;
    return `${months} Months`;
}

function renderMilestones() {
    const container = document.getElementById('milestones-section');
    if (!container) return;
    
    const days = getDaysTogether();
    const startDate = new Date(RELATIONSHIP_START);
    
    const milestones = [
        { days: 50, emoji: '🌟', title: '50 Days Together' },
        { days: 100, emoji: '💯', title: '100 Days Together' },
        { days: 150, emoji: '🌸', title: '150 Days Together' },
        { days: 200, emoji: '🎉', title: '200 Days Together' },
        { days: 250, emoji: '💎', title: '250 Days Together' },
        { days: 300, emoji: '🌈', title: '300 Days Together' },
        { days: 365, emoji: '🎂', title: '1 Year Together!' },
        { days: 500, emoji: '🏆', title: '500 Days Together' },
    ];
    
    // Find next upcoming milestone and last achieved
    const upcoming = milestones.filter(m => m.days > days).slice(0, 1);
    const achieved = milestones.filter(m => m.days <= days).slice(-1);
    const toShow = [...achieved, ...upcoming];
    
    // Quarterly anniversary card
    const nextQ = getNextQuarterlyAnniversary();
    let quarterlyHTML = '';
    if (nextQ) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const qDaysLeft = Math.ceil((nextQ.date - today) / (1000 * 60 * 60 * 24));
        const qDateStr = nextQ.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const label = quarterlyLabel(nextQ.quarter);
        const isToday = qDaysLeft === 0;
        const prompts = [
            "Plan something unforgettable today ✨",
            "Make today a memory you'll never forget 💫",
            "Today deserves something special, just like us 💖",
            "Go create a beautiful moment together 🌹",
            "Celebrate this day — it's ours 💕",
        ];
        const prompt = prompts[nextQ.quarter % prompts.length];

        if (isToday) {
            quarterlyHTML = `
            <div class="milestone-card quarterly-anniversary today">
                <div class="milestone-emoji">💝</div>
                <div class="milestone-info">
                    <div class="milestone-title">Happy ${label} Anniversary!</div>
                    <div class="milestone-date">${qDateStr}</div>
                    <div class="milestone-prompt">${prompt}</div>
                </div>
                <div class="milestone-badge anniversary-badge">🎉 Today!</div>
            </div>`;
        } else {
            quarterlyHTML = `
            <div class="milestone-card quarterly-anniversary upcoming">
                <div class="milestone-emoji">💕</div>
                <div class="milestone-info">
                    <div class="milestone-title">${label} Anniversary</div>
                    <div class="milestone-date">${qDateStr}</div>
                    ${qDaysLeft <= 7 ? `<div class="milestone-prompt">Start planning something special! 🌟</div>` : ''}
                </div>
                <div class="milestone-badge">${qDaysLeft} days to go</div>
            </div>`;
        }
    }
    
    let milestonesHTML = toShow.map(m => {
        const milestoneDate = new Date(startDate);
        milestoneDate.setDate(milestoneDate.getDate() + m.days);
        const dateStr = milestoneDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const isUpcoming = m.days > days;
        const daysLeft = m.days - days;
        
        return `
        <div class="milestone-card ${isUpcoming ? 'upcoming' : ''}">
            <div class="milestone-emoji">${m.emoji}</div>
            <div class="milestone-info">
                <div class="milestone-title">${m.title}</div>
                <div class="milestone-date">${dateStr}</div>
            </div>
            <div class="milestone-badge">${isUpcoming ? `${daysLeft} days to go` : '✓ achieved'}</div>
        </div>`;
    }).join('');
    
    container.innerHTML = quarterlyHTML + milestonesHTML;
}

// NEW: Memory Highlights - "On This Day"
function checkMemoryHighlights() {
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    const todayYear = today.getFullYear();
    
    const highlights = memories.filter(memory => {
        if (!memory.memoryDate) return false;
        const memDate = memory.memoryDate.toDate();
        return memDate.getMonth() === todayMonth && 
               memDate.getDate() === todayDay &&
               memDate.getFullYear() < todayYear;
    });
    
    if (highlights.length > 0) {
        const memory = highlights[0];
        const yearsAgo = todayYear - memory.memoryDate.toDate().getFullYear();
        showMemoryHighlight(memory, yearsAgo);
    }
}

function showMemoryHighlight(memory, yearsAgo) {
    const container = document.getElementById('memory-highlight');
    if (!container) return;
    
    container.innerHTML = `
        <div class="highlight-banner">
            <p class="highlight-text">✨ ${yearsAgo} ${yearsAgo === 1 ? 'year' : 'years'} ago today</p>
            <div class="highlight-preview" onclick="viewSinglePhoto('${memory.id}')">
                <img src="${memory.images[0]}" alt="Memory">
            </div>
        </div>
    `;
    container.classList.remove('hidden');
}

// NEW: Daily Memory Reminder
function checkDailyMemoryReminder() {
    const today = new Date().toDateString();
    const todayMemories = memories.filter(m => {
        if (!m.memoryDate) return false;
        return m.memoryDate.toDate().toDateString() === today;
    });
    
    if (todayMemories.length === 0) {
        const reminder = document.getElementById('daily-reminder');
        if (reminder) {
            reminder.textContent = "💭 Haven't captured today yet";
            reminder.classList.remove('hidden');
        }
    } else {
        const reminder = document.getElementById('daily-reminder');
        if (reminder) {
            reminder.classList.add('hidden');
        }
    }
}

// NEW: Mood Tracker
async function setMood(mood) {
    currentMood = mood;
    
    try {
        const today = new Date().toISOString().split('T')[0];
        await firebase.firestore()
            .collection('moods')
            .doc(today)
            .set({
                [currentUserProfile.role]: mood,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        
        console.log('✅ Mood set:', mood);
        renderMoodIndicator();
        
        // Visual feedback
        document.querySelectorAll('.mood-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
    } catch (error) {
        console.error('Could not save mood:', error);
    }
}

async function loadTodaysMood() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const doc = await firebase.firestore()
            .collection('moods')
            .doc(today)
            .get();
        
        if (doc.exists) {
            const data = doc.data();
            // Load own mood
            if (data[currentUserProfile.role]) {
                currentMood = data[currentUserProfile.role];
                renderMoodIndicator();
                
                const moodOption = document.querySelector(`[data-mood="${currentMood}"]`);
                if (moodOption) {
                    moodOption.classList.add('selected');
                }
            }
            
            // Load partner mood
            const partnerRole = currentUserProfile.role === 'krishna' ? 'rashi' : 'krishna';
            const partnerName = currentUserProfile.role === 'krishna' ? 'Gugu' : 'Susu';
            if (data[partnerRole]) {
                const partnerMoodDisplay = document.getElementById('partner-mood-display');
                if (partnerMoodDisplay) {
                    partnerMoodDisplay.innerHTML = `${partnerName} is feeling ${moodEmojis[data[partnerRole]]} today`;
                    partnerMoodDisplay.classList.remove('hidden');
                }
            }
        }
    } catch (error) {
        console.warn('Could not load mood:', error);
    }
}

function renderMoodIndicator() {
    const indicator = document.getElementById('current-mood-display');
    if (!indicator || !currentMood) return;
    
    indicator.innerHTML = `Today: ${moodEmojis[currentMood]}`;
    indicator.classList.remove('hidden');
}

// Music Player Functions
function toggleMusicPlayer() {
    const panel = document.getElementById('music-player-panel');
    const isHidden = panel.classList.contains('hidden');
    
    if (isHidden) {
        // Show backdrop and panel
        let backdrop = document.querySelector('.music-panel-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'music-panel-backdrop';
            backdrop.addEventListener('click', toggleMusicPlayer);
            document.body.appendChild(backdrop);
        }
        panel.classList.remove('hidden');
    } else {
        // Hide backdrop and panel
        const backdrop = document.querySelector('.music-panel-backdrop');
        if (backdrop) backdrop.remove();
        panel.classList.add('hidden');
    }
}

function togglePlayPause() {
    if (musicPlayer.paused) {
        musicPlayer.play();
        document.getElementById('play-pause-btn').textContent = '⏸';
        
        // Add to recently played
        if (currentSongIdx >= 0) {
            addToRecentlyPlayed(currentSongIdx);
        }
    } else {
        musicPlayer.pause();
        document.getElementById('play-pause-btn').textContent = '▶';
    }
}

function handleSeek(e) {
    if (musicPlayer.duration) {
        const seekTime = (e.target.value / 100) * musicPlayer.duration;
        musicPlayer.currentTime = seekTime;
    }
}

function updateSeekBar() {
    if (musicPlayer.duration) {
        const progress = (musicPlayer.currentTime / musicPlayer.duration) * 100;
        document.getElementById('seek-bar').value = progress || 0;
        document.getElementById('current-time').textContent = formatTime(musicPlayer.currentTime);
    }
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Continuing in next file due to length...

// Data Loading Functions
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

async function loadExpenses() {
    try {
        const snapshot = await expensesCollection.orderBy('createdAt', 'desc').get();
        expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('📊 Loaded', expenses.length, 'expenses');
        
        renderBalance();
        renderRecentExpenses();
        renderAllExpenses();
        updateBudgetProgress();
        renderStats(); // Always refresh stats when expenses change
    } catch (error) {
        console.error('❌ Error loading expenses:', error);
    }
}

async function loadMemories() {
    try {
        const snapshot = await memoriesCollection.orderBy('memoryDate', 'desc').get();
        memories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('📸 Loaded', memories.length, 'memories');
        
        renderMemoriesTimeline();
    } catch (error) {
        console.error('❌ Error loading memories:', error);
    }
}

async function loadNotes() {
    try {
        const snapshot = await notesCollection.orderBy('createdAt', 'desc').limit(20).get();
        notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('📝 Loaded', notes.length, 'notes');
        
        renderNotes();
    } catch (error) {
        console.error('❌ Error loading notes:', error);
    }
}

// NEW: Load Secret Notes
async function loadSecretNotes() {
    try {
        const snapshot = await firebase.firestore()
            .collection('secret_notes')
            .orderBy('unlockDate', 'asc')
            .get();
        
        secretNotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('💝 Loaded', secretNotes.length, 'secret notes');
        
        renderSecretNotes();
    } catch (error) {
        console.warn('Could not load secret notes:', error);
    }
}

function renderSecretNotes() {
    const container = document.getElementById('secret-notes-container');
    if (!container) return;
    
    const now = new Date();
    
    if (secretNotes.length === 0) {
        container.innerHTML = '<p class="empty-secret-notes">No secret notes yet</p>';
        return;
    }
    
    container.innerHTML = secretNotes.map(note => {
        const unlockDate = note.unlockDate.toDate();
        const isUnlocked = now >= unlockDate;
        const daysUntil = Math.ceil((unlockDate - now) / (1000 * 60 * 60 * 24));
        
        if (isUnlocked) {
            return `
                <div class="secret-note unlocked">
                    <div class="secret-note-icon">💝</div>
                    <div class="secret-note-content">${note.content}</div>
                    <div class="secret-note-date">Unlocked ${formatDate(unlockDate)}</div>
                </div>
            `;
        } else {
            return `
                <div class="secret-note locked">
                    <div class="secret-note-icon">🔒</div>
                    <div class="secret-note-title">${note.title || 'Secret Note'}</div>
                    <div class="secret-note-countdown">Unlocks in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}</div>
                </div>
            `;
        }
    }).join('');
}

async function handleSecretNoteSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('secret-note-title').value.trim();
    const content = document.getElementById('secret-note-content').value.trim();
    const unlockDateInput = document.getElementById('secret-note-unlock-date').value;
    
    if (!title || !content || !unlockDateInput) {
        showError('Please fill all fields');
        return;
    }
    
    const [year, month, day] = unlockDateInput.split('-').map(Number);
    const unlockDate = new Date(year, month - 1, day, 0, 0, 0);
    
    const secretNote = {
        title: title,
        content: content,
        unlockDate: firebase.firestore.Timestamp.fromDate(unlockDate),
        createdBy: currentUserProfile.role,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    showLoading(true);
    
    try {
        await firebase.firestore()
            .collection('secret_notes')
            .add(secretNote);
        
        console.log('✅ Secret note created');
        document.getElementById('secret-note-modal').classList.add('hidden');
        document.getElementById('secret-note-form').reset();
        await loadSecretNotes();
    } catch (error) {
        console.error('❌ Secret note error:', error);
        showError('Failed to create secret note');
    }
    
    showLoading(false);
}

// Budget Functions
async function loadBudget() {
    try {
        const now = new Date();
        const budgetDoc = await budgetCollection.doc('current').get();
        
        if (budgetDoc.exists) {
            budget = budgetDoc.data();
            
            if (budget.month !== now.getMonth() || budget.year !== now.getFullYear()) {
                console.log('🔄 Resetting budget for new month');
                await budgetCollection.doc('current').delete();
                budget = null;
                showBudgetPrompt();
            } else {
                console.log('💰 Budget loaded:', budget.amount);
                showBudgetCard();
                updateBudgetProgress();
            }
        } else {
            budget = null;
            showBudgetPrompt();
        }
    } catch (error) {
        console.error('❌ Error loading budget:', error);
        budget = null;
        showBudgetPrompt();
    }
}

function showBudgetCard() {
    const card = document.getElementById('budget-progress-card');
    card.classList.remove('hidden');
    
    if (!card.querySelector('.budget-progress-bar')) {
        card.innerHTML = `
            <div class="budget-header">
                <span class="budget-label">Monthly Budget</span>
                <button id="edit-budget-btn" class="btn-edit-budget">⚙️</button>
            </div>
            <div class="budget-amount-display">
                <span id="budget-spent">₹0</span>
                <span class="budget-separator">/</span>
                <span id="budget-total">₹0</span>
            </div>
            <div class="budget-progress-bar">
                <div id="budget-progress-fill" class="budget-progress-fill" style="width: 0%"></div>
            </div>
            <div id="budget-warning" class="budget-warning hidden">⚠️ Over 80% of budget used!</div>
        `;
        
        document.getElementById('edit-budget-btn').addEventListener('click', () => {
            document.getElementById('budget-modal').classList.remove('hidden');
            if (budget) {
                document.getElementById('budget-amount-input').value = budget.amount;
            }
        });
    }
}

function showBudgetPrompt() {
    const card = document.getElementById('budget-progress-card');
    card.classList.remove('hidden');
    card.innerHTML = `
        <div class="budget-prompt">
            <p class="budget-prompt-text">💰 Set a monthly budget to track spending</p>
            <button id="set-budget-btn" class="btn-set-budget">Set Budget</button>
        </div>
    `;
    
    setTimeout(() => {
        const btn = document.getElementById('set-budget-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                document.getElementById('budget-modal').classList.remove('hidden');
            });
        }
    }, 100);
}

async function handleBudgetSubmit(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('budget-amount-input').value);
    if (!amount || amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }
    
    const now = new Date();
    budget = {
        amount: amount,
        month: now.getMonth(),
        year: now.getFullYear(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    showLoading(true);
    
    try {
        await budgetCollection.doc('current').set(budget);
        document.getElementById('budget-modal').classList.add('hidden');
        console.log('✅ Budget saved:', amount);
        await loadBudget();
    } catch (error) {
        console.error('❌ Budget save error:', error);
        showError('Failed to save budget');
    }
    
    showLoading(false);
}

function updateBudgetProgress() {
    if (!budget) return;
    
    const now = new Date();
    const budgetExpenses = expenses.filter(e => {
        if (!e.createdAt || !e.countTowardsBudget) return false;
        const expenseDate = e.createdAt.toDate();
        return expenseDate.getMonth() === now.getMonth() && 
               expenseDate.getFullYear() === now.getFullYear();
    });
    
    const spent = budgetExpenses.reduce((sum, e) => sum + e.amount, 0);
    const percentage = (spent / budget.amount) * 100;
    
    document.getElementById('budget-spent').textContent = `₹${spent.toFixed(0)}`;
    document.getElementById('budget-total').textContent = `₹${budget.amount.toFixed(0)}`;
    document.getElementById('budget-progress-fill').style.width = `${Math.min(percentage, 100)}%`;
    
    const warning = document.getElementById('budget-warning');
    const fill = document.getElementById('budget-progress-fill');
    
    if (percentage >= 80) {
        warning.classList.remove('hidden');
        fill.classList.add('warning');
    } else {
        warning.classList.add('hidden');
        fill.classList.remove('warning');
    }
}

// Balance Calculation - FIXED with absolute shares
function calculateCurrentBalance() {
    let balance = 0;
    const myRole = currentUserProfile.role;
    const partnerRole = getPartnerRole();
    
    expenses.forEach(expense => {
        if (expense.shares) {
            if (expense.paidBy === myRole) {
                const partnerOwes = expense.shares[partnerRole] || 0;
                balance += partnerOwes;
            } else {
                const iOwe = expense.shares[myRole] || 0;
                balance -= iOwe;
            }
        } else if (expense.myShare !== undefined) {
            if (expense.paidBy === myRole) {
                balance += (expense.partnerShare || 0);
            } else {
                balance -= (expense.myShare || 0);
            }
        }
    });
    
    return balance;
}

// Expense Handling - FIXED error handling
async function handleExpenseSubmit(e) {
    e.preventDefault();
    
    if (isSubmitting) {
        console.log('⏳ Already submitting...');
        return;
    }
    
    isSubmitting = true;
    balanceBeforeAction = calculateCurrentBalance();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const paidByValue = document.querySelector('input[name="paidBy"]:checked').value;
    const splitType = document.querySelector('input[name="splitType"]:checked').value;
    const category = document.querySelector('input[name="category"]:checked').value;
    const note = document.getElementById('note').value.trim();
    const countTowardsBudget = document.getElementById('count-towards-budget').checked;
    
    const paidBy = paidByValue === 'me' ? currentUserProfile.role : getPartnerRole();
    
    let krishnaShare, rashiShare;
    
    if (splitType === 'equal') {
        krishnaShare = amount / 2;
        rashiShare = amount / 2;
    } else {
        const myShare = parseFloat(document.getElementById('my-share').value);
        if (currentUserProfile.role === 'krishna') {
            krishnaShare = myShare;
            rashiShare = amount - myShare;
        } else {
            rashiShare = myShare;
            krishnaShare = amount - myShare;
        }
    }
    
    const expense = {
        amount: amount,
        paidBy: paidBy,
        shares: { krishna: krishnaShare, rashi: rashiShare },
        category: category,
        note: note,
        countTowardsBudget: countTowardsBudget,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUserProfile.role
    };
    
    showLoading(true);
    
    try {
        const docRef = await expensesCollection.add(expense);
        console.log('✅ Expense added successfully:', docRef.id);
        
        // Reset form IMMEDIATELY after successful save
        document.getElementById('expense-form').reset();
        document.getElementById('custom-split').classList.add('hidden');
        document.getElementById('count-towards-budget').checked = true;
        
        // Switch tab right away — user sees success
        switchTab('home');
        
    } catch (error) {
        console.error('❌ Failed to add expense:', error);
        showError('Failed to add expense. Please try again.');
    } finally {
        isSubmitting = false;
        showLoading(false);
    }
    
    // Reload data separately — don't let this trigger the error alert
    try {
        await loadExpenses();
    } catch (reloadError) {
        console.warn('⚠️ Reload failed but expense was saved:', reloadError);
    }
}

async function handleExpenseEdit(e) {
    e.preventDefault();
    
    const expenseId = document.getElementById('edit-expense-id').value;
    const amount = parseFloat(document.getElementById('edit-amount').value);
    const note = document.getElementById('edit-note').value.trim();
    
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense || !expense.shares) return;
    
    const ratio = amount / expense.amount;
    const newShares = {
        krishna: expense.shares.krishna * ratio,
        rashi: expense.shares.rashi * ratio
    };
    
    showLoading(true);
    
    try {
        await expensesCollection.doc(expenseId).update({
            amount: amount,
            shares: newShares,
            note: note
        });
        
        console.log('✅ Expense updated:', expenseId);
        document.getElementById('edit-expense-modal').classList.add('hidden');
        await loadExpenses();
    } catch (error) {
        console.error('❌ Update failed:', error);
        showError('Failed to update expense');
    }
    
    showLoading(false);
}

function showEditExpense(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;
    
    document.getElementById('edit-expense-id').value = expenseId;
    document.getElementById('edit-amount').value = expense.amount;
    document.getElementById('edit-note').value = expense.note || '';
    document.getElementById('edit-expense-modal').classList.remove('hidden');
}

async function deleteExpense(expenseId) {
    if (!confirm('Delete this expense?')) return;
    
    balanceBeforeAction = null;
    
    showLoading(true);
    try {
        await expensesCollection.doc(expenseId).delete();
        console.log('✅ Expense deleted');
        await loadExpenses();
    } catch (error) {
        console.error('❌ Delete failed:', error);
        showError('Failed to delete expense');
    }
    showLoading(false);
}

// Settlement
function showSettleModal() {
    const balance = calculateCurrentBalance();
    const partnerName = getPartnerName();
    
    if (balance === 0) {
        showError('Already settled! Balance is ₹0');
        return;
    }
    
    const settleAmountInput = document.getElementById('settle-amount');
    settleAmountInput.value = Math.abs(balance).toFixed(2);
    
    if (balance > 0) {
        document.getElementById('settle-message').textContent = `${partnerName} owes you ₹${balance.toFixed(2)}`;
        document.getElementById('settle-submessage').textContent = `Enter amount to settle`;
    } else {
        document.getElementById('settle-message').textContent = `You owe ${partnerName} ₹${Math.abs(balance).toFixed(2)}`;
        document.getElementById('settle-submessage').textContent = `Enter amount to settle`;
    }
    
    document.getElementById('settle-modal').classList.remove('hidden');
}

async function handleSettle() {
    const currentBalance = calculateCurrentBalance();
    
    if (currentBalance === 0) {
        document.getElementById('settle-modal').classList.add('hidden');
        return;
    }
    
    const settleAmountInput = document.getElementById('settle-amount');
    let settleAmount = parseFloat(settleAmountInput.value) || Math.abs(currentBalance);
    
    if (settleAmount > Math.abs(currentBalance)) {
        settleAmount = Math.abs(currentBalance);
    }
    
    const partnerName = getPartnerName();
    const partnerRole = getPartnerRole();
    
    const settlingPerson = currentBalance > 0 ? partnerRole : currentUserProfile.role;
    
    const settlementNote = currentBalance > 0 
        ? `Settlement - ${partnerName} paid ₹${settleAmount.toFixed(2)}`
        : `Settlement - ${currentUserProfile.name} paid ₹${settleAmount.toFixed(2)}`;
    
    const settlement = {
        amount: settleAmount,
        paidBy: settlingPerson,
        shares: { krishna: settleAmount, rashi: settleAmount },
        category: 'misc',
        note: settlementNote,
        isSettlement: true,
        countTowardsBudget: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUserProfile.role
    };
    
    balanceBeforeAction = currentBalance;
    
    showLoading(true);
    
    try {
        await expensesCollection.add(settlement);
        console.log('✅ Settlement completed');
        document.getElementById('settle-modal').classList.add('hidden');
        settleAmountInput.value = '';
        await loadExpenses();
    } catch (error) {
        console.error('❌ Settlement failed:', error);
        showError('Settlement failed');
    }
    
    showLoading(false);
}

// Rendering Functions
function renderBalance() {
    const balance = calculateCurrentBalance();
    const balanceAmount = document.getElementById('balance-amount');
    const balanceStatus = document.getElementById('balance-status');
    const whoPayIndicator = document.getElementById('who-pays-indicator');
    const partnerName = getPartnerName();
    
    if (balance > 0) {
        balanceAmount.textContent = `₹${balance.toFixed(2)}`;
        balanceStatus.textContent = `${partnerName} owes you`;
        whoPayIndicator.textContent = currentUserProfile.role === 'krishna' ? '👩' : '👨';
    } else if (balance < 0) {
        balanceAmount.textContent = `₹${Math.abs(balance).toFixed(2)}`;
        balanceStatus.textContent = `You owe ${partnerName}`;
        whoPayIndicator.textContent = '🙋';
    } else {
        balanceAmount.textContent = '₹0';
        balanceStatus.textContent = 'All settled';
        whoPayIndicator.textContent = '✨';
        
        if (balanceBeforeAction !== null && balanceBeforeAction !== 0) {
            showBalanceCelebration();
            showFloatingHearts(); // NEW
        }
    }
    
    balanceBeforeAction = null;
}

// NEW: Floating Hearts Animation
function showFloatingHearts() {
    const container = document.createElement('div');
    container.className = 'floating-hearts-container';
    document.body.appendChild(container);
    
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = '💝';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(heart);
    }
    
    setTimeout(() => {
        container.remove();
    }, 5000);
}

function renderRecentExpenses() {
    const container = document.getElementById('recent-expenses');
    const recentExpenses = expenses.slice(0, 5);
    
    if (recentExpenses.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💸</div><p>No expenses yet</p></div>';
        return;
    }
    
    container.innerHTML = recentExpenses.map(expense => {
        const date = expense.createdAt ? expense.createdAt.toDate() : new Date();
        const formattedDate = formatDate(date);
        const paidByText = expense.paidBy === currentUserProfile.role ? 'you' : getPartnerName();
        
        return `
            <div class="expense-item">
                <div class="expense-details">
                    <div class="expense-category">${categoryEmojis[expense.category]}</div>
                    ${expense.note ? `<div class="expense-note">${expense.note}</div>` : ''}
                    <div class="expense-meta">${formattedDate} • Paid by ${paidByText}</div>
                </div>
                <div class="expense-amount">₹${expense.amount.toFixed(2)}</div>
            </div>
        `;
    }).join('');
}

function renderAllExpenses() {
    const container = document.getElementById('expenses-list');
    
    if (expenses.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><p>No expenses yet</p></div>';
        return;
    }
    
    const partnerName = getPartnerName();
    
    container.innerHTML = expenses.map(expense => {
        const date = expense.createdAt ? expense.createdAt.toDate() : new Date();
        const formattedDate = formatDate(date);
        const paidByText = expense.paidBy === currentUserProfile.role ? 'you' : partnerName;
        
        let myShare, partnerShare;
        
        if (expense.shares) {
            myShare = expense.shares[currentUserProfile.role] || 0;
            partnerShare = expense.shares[getPartnerRole()] || 0;
        } else if (expense.myShare !== undefined) {
            myShare = expense.myShare;
            partnerShare = expense.partnerShare;
        } else {
            return '';
        }
        
        return `
            <div class="expense-item-full">
                <div class="expense-header">
                    <div class="expense-info">
                        <div class="expense-title">${categoryEmojis[expense.category]} ${expense.note || expense.category}</div>
                        <div class="expense-subtitle">${formattedDate}</div>
                    </div>
                    <div class="expense-price">₹${expense.amount.toFixed(2)}</div>
                </div>
                <div class="expense-split-info">
                    Paid by ${paidByText} • 
                    Your share: ₹${myShare.toFixed(2)} • 
                    ${partnerName}'s share: ₹${partnerShare.toFixed(2)}
                </div>
                <div class="expense-budget-tag ${expense.countTowardsBudget ? 'in-budget' : 'not-in-budget'}">
                    ${expense.countTowardsBudget ? '📊 Counted in budget' : '── Not in budget'}
                </div>
                <div class="expense-actions">
                    <button class="btn-small edit" onclick="showEditExpense('${expense.id}')">Edit</button>
                    <button class="btn-small delete" onclick="deleteExpense('${expense.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderStats() {
    const now = new Date();
    const thisMonth = expenses.filter(expense => {
        if (!expense.createdAt) return false;
        try {
            const expenseDate = expense.createdAt.toDate ? expense.createdAt.toDate() : new Date(expense.createdAt);
            return expenseDate.getMonth() === now.getMonth() && 
                   expenseDate.getFullYear() === now.getFullYear();
        } catch (e) {
            return false;
        }
    });
    
    const totalSpent = thisMonth.reduce((sum, e) => sum + e.amount, 0);
    const myContribution = thisMonth.reduce((sum, e) => 
        sum + (e.paidBy === currentUserProfile.role ? e.amount : 0), 0);
    const partnerContribution = thisMonth.reduce((sum, e) => 
        sum + (e.paidBy !== currentUserProfile.role ? e.amount : 0), 0);
    
    document.getElementById('total-spent').textContent = `₹${totalSpent.toFixed(2)}`;
    document.getElementById('my-contribution').textContent = `₹${myContribution.toFixed(2)}`;
    document.getElementById('partner-contribution').textContent = `₹${partnerContribution.toFixed(2)}`;
    
    const categoryTotals = {};
    thisMonth.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    const breakdownContainer = document.getElementById('category-breakdown');
    const pieChartContainer = document.getElementById('pie-chart-container');
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    
    if (sortedCategories.length === 0) {
        breakdownContainer.innerHTML = '<div class="empty-state"><p>No expenses this month</p></div>';
        if (pieChartContainer) pieChartContainer.innerHTML = '';
        return;
    }
    
    // Render pie chart
    if (pieChartContainer && totalSpent > 0) {
        const pieColors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#00bcd4', '#ff9800'];
        let cumulativePercent = 0;
        
        const slices = sortedCategories.map(([category, amount], index) => {
            const percent = amount / totalSpent;
            const startAngle = cumulativePercent * 2 * Math.PI;
            cumulativePercent += percent;
            const endAngle = cumulativePercent * 2 * Math.PI;
            const color = pieColors[index % pieColors.length];
            
            const x1 = 100 + 90 * Math.cos(startAngle);
            const y1 = 100 + 90 * Math.sin(startAngle);
            const x2 = 100 + 90 * Math.cos(endAngle);
            const y2 = 100 + 90 * Math.sin(endAngle);
            const largeArc = percent > 0.5 ? 1 : 0;
            
            if (sortedCategories.length === 1) {
                return `<circle cx="100" cy="100" r="90" fill="${color}" opacity="0.85"/>`;
            }
            
            return `<path d="M100,100 L${x1},${y1} A90,90 0 ${largeArc},1 ${x2},${y2} Z" fill="${color}" opacity="0.85" class="pie-slice"/>`;
        }).join('');
        
        const legendItems = sortedCategories.map(([category, amount], index) => {
            const color = pieColors[index % pieColors.length];
            const percent = ((amount / totalSpent) * 100).toFixed(0);
            return `<div class="legend-item">
                <div class="legend-color" style="background:${color}"></div>
                <span>${categoryEmojis[category] || '📦'} ${category} ${percent}%</span>
            </div>`;
        }).join('');
        
        pieChartContainer.innerHTML = `
            <svg class="pie-chart-svg" viewBox="0 0 200 200">
                ${slices}
                <circle cx="100" cy="100" r="50" class="pie-chart-center"/>
                <text x="100" y="95" text-anchor="middle" fill="var(--text-primary)" font-size="16" font-weight="700" transform="rotate(90, 100, 100)">₹${totalSpent.toFixed(0)}</text>
                <text x="100" y="112" text-anchor="middle" fill="var(--text-secondary)" font-size="10" transform="rotate(90, 100, 100)">total</text>
            </svg>
            <div class="pie-chart-legend">${legendItems}</div>
        `;
    }
    
    breakdownContainer.innerHTML = sortedCategories.map(([category, amount]) => {
        const percent = ((amount / totalSpent) * 100).toFixed(0);
        return `
        <div class="category-stat">
            <div class="category-info">
                <div class="category-emoji">${categoryEmojis[category]}</div>
                <div class="category-name">${category}</div>
            </div>
            <div class="category-amount-group">
                <div class="category-amount">₹${amount.toFixed(2)}</div>
                <div class="category-percent">${percent}%</div>
            </div>
        </div>
    `}).join('');
}

// Continuing with memory functions in the final section...

// Memory Handling
function handlePhotoSelect(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    selectedPhotos = files;
    
    document.getElementById('photo-selection').classList.add('hidden');
    document.getElementById('memory-form').classList.remove('hidden');
    
    const previewContainer = document.getElementById('photos-preview');
    previewContainer.innerHTML = '';
    
    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('div');
            preview.className = 'photo-preview-item';
            preview.dataset.zoom = '1';
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}">
                <button type="button" class="btn-remove-photo" onclick="removePhoto(${index})">×</button>
                <div class="photo-preview-zoom-slider">
                    <span>−</span>
                    <input type="range" min="1" max="3" step="0.1" value="1" oninput="zoomPreviewSlider(this)">
                    <span>+</span>
                </div>
            `;
            previewContainer.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });
}

function removePhoto(index) {
    selectedPhotos.splice(index, 1);
    
    if (selectedPhotos.length === 0) {
        resetMemoryForm();
        return;
    }
    
    const previewContainer = document.getElementById('photos-preview');
    previewContainer.children[index].remove();
}

// Zoom in/out on photo preview when adding memories
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.2;

window.zoomPreview = function(btn, delta) {
    const item = btn.closest('.photo-preview-item');
    if (!item) return;
    const img = item.querySelector('img');
    if (!img) return;
    
    let currentZoom = parseFloat(item.dataset.zoom) || ZOOM_MIN;
    currentZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, currentZoom + delta));
    item.dataset.zoom = currentZoom.toString();
    img.style.transform = `scale(${currentZoom})`;
};

window.zoomPreviewSlider = function(slider) {
    const item = slider.closest('.photo-preview-item');
    if (!item) return;
    const img = item.querySelector('img');
    if (!img) return;
    
    const zoom = parseFloat(slider.value) || 1;
    item.dataset.zoom = zoom.toString();
    img.style.transform = `scale(${zoom})`;
};

async function handleMemoryUpload(e) {
    e.preventDefault();
    
    if (selectedPhotos.length === 0) return;
    
    const caption = document.getElementById('memory-caption').value.trim();
    const memoryDateInput = document.getElementById('memory-date').value;
    
    const [year, month, day] = memoryDateInput.split('-').map(Number);
    const memoryDate = new Date(year, month - 1, day, 12, 0, 0);
    
    showLoading(true);
    
    try {
        const imageUrls = [];
        
        for (const photo of selectedPhotos) {
            const formData = new FormData();
            formData.append('file', photo);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', CLOUDINARY_FOLDER);
            
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) throw new Error('Upload failed');
            
            const data = await response.json();
            imageUrls.push(data.secure_url);
        }
        
        const memory = {
            images: imageUrls,
            caption: caption,
            memoryDate: firebase.firestore.Timestamp.fromDate(memoryDate),
            uploadedBy: currentUserProfile.role,
            imagePosition: { x: 50, y: 50 }, // NEW: Default center position
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await memoriesCollection.add(memory);
        
        console.log('✅ Memory uploaded');
        resetMemoryForm();
        document.getElementById('memory-modal').classList.add('hidden');
        await loadMemories();
        switchTab('us');
    } catch (error) {
        console.error('❌ Upload error:', error);
        showError('Failed to upload memory');
    }
    
    showLoading(false);
}

function resetMemoryForm() {
    selectedPhotos = [];
    document.getElementById('memory-form').reset();
    document.getElementById('photos-preview').innerHTML = '';
    document.getElementById('photo-selection').classList.remove('hidden');
    document.getElementById('memory-form').classList.add('hidden');
}

function getRandomTilt() {
    return (Math.random() * 6 - 3).toFixed(2);
}

function renderMemoriesTimeline() {
    const container = document.getElementById('memories-timeline');
    
    if (memories.length === 0) {
        container.innerHTML = `
            <div class="empty-memories">
                <p>No memories yet.</p>
                <p class="empty-memories-sub">Start capturing your moments together</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = memories.map((memory, index) => {
        const date = memory.memoryDate ? memory.memoryDate.toDate() : new Date();
        const formattedDate = formatMemoryDate(date);
        const imageCount = memory.images.length;
        const tilt = getRandomTilt();
        const isAnniversaryMemory = isQuarterlyAnniversary(date);
        const anniversaryClass = isAnniversaryMemory ? ' anniversary-polaroid' : '';
        const anniversaryBadge = isAnniversaryMemory ? '<div class="anniversary-memory-badge">💝 Anniversary</div>' : '';
        
        // Timeline string logic - show string between consecutive dates
        let showString = false;
        if (index < memories.length - 1) {
            const nextMemory = memories[index + 1];
            const nextDate = nextMemory.memoryDate ? nextMemory.memoryDate.toDate() : new Date();
            if (nextDate < date) {
                showString = true;
            }
        }
        
        const stringHTML = showString ? '<div class="polaroid-string"></div>' : '';
        
        const imgStyle = getImageStyle(memory);
        
        if (imageCount === 1) {
            return `
                <div class="polaroid-wrapper">
                    ${stringHTML}
                    <div class="polaroid${anniversaryClass}" style="transform: rotate(${tilt}deg)" onclick="viewSinglePhoto('${memory.id}')">
                        <div class="polaroid-photo">
                            <img src="${memory.images[0]}" 
                                 alt="${memory.caption || 'Memory'}" 
                                 loading="lazy"
                                 style="${imgStyle}">
                        </div>
                        <div class="polaroid-caption-area">
                            <p class="polaroid-date">${formattedDate}</p>
                            ${memory.caption ? `<p class="polaroid-caption">${memory.caption}</p>` : ''}
                        </div>
                        ${anniversaryBadge}
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="polaroid-wrapper">
                    ${stringHTML}
                    <div class="photo-stack" style="transform: rotate(${tilt}deg)" onclick="viewAlbum('${memory.id}')">
                        <div class="stack-card stack-back-2"></div>
                        <div class="stack-card stack-back-1"></div>
                        <div class="polaroid${anniversaryClass}">
                            <div class="polaroid-photo">
                                <img src="${memory.images[0]}" 
                                     alt="${memory.caption || 'Album'}" 
                                     loading="lazy"
                                     style="${imgStyle}">
                            </div>
                            <div class="polaroid-caption-area">
                                <p class="polaroid-date">${formattedDate}</p>
                                ${memory.caption ? `<p class="polaroid-caption">${memory.caption}</p>` : ''}
                            </div>
                            <div class="album-count-badge">${imageCount} photos</div>
                            ${anniversaryBadge}
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');
}

// NEW: Image Adjustment Feature
window.startImageAdjust = function(memoryId, imageIndex) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory) return;
    
    const currentPos = memory.imagePosition || { x: 50, y: 50 };
    const currentZoom = memory.imageZoom || 1;
    
    const modal = document.createElement('div');
    modal.className = 'image-adjust-modal';
    modal.innerHTML = `
        <div class="image-adjust-content">
            <h3>Adjust Image Position</h3>
            <div class="image-adjust-preview">
                <img src="${memory.images[imageIndex]}" id="adjust-preview-img" style="object-fit: cover; object-position: ${currentPos.x}% ${currentPos.y}%; transform: scale(${currentZoom});">
            </div>
            <div class="adjust-controls">
                <label>
                    <span>Horizontal</span>
                    <input type="range" id="adjust-x" min="0" max="100" value="${currentPos.x}">
                </label>
                <label>
                    <span>Vertical</span>
                    <input type="range" id="adjust-y" min="0" max="100" value="${currentPos.y}">
                </label>
                <label>
                    <span>Zoom</span>
                    <input type="range" id="adjust-zoom" min="1" max="2.5" step="0.05" value="${currentZoom}">
                </label>
            </div>
            <div class="adjust-buttons">
                <button class="btn-save-adjust" onclick="saveImagePosition('${memoryId}')">Save</button>
                <button class="btn-cancel-adjust" onclick="closeImageAdjust()">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const img = document.getElementById('adjust-preview-img');
    const xSlider = document.getElementById('adjust-x');
    const ySlider = document.getElementById('adjust-y');
    const zoomSlider = document.getElementById('adjust-zoom');
    
    xSlider.addEventListener('input', (e) => {
        img.style.objectPosition = `${e.target.value}% ${ySlider.value}%`;
    });
    
    ySlider.addEventListener('input', (e) => {
        img.style.objectPosition = `${xSlider.value}% ${e.target.value}%`;
    });
    
    zoomSlider.addEventListener('input', (e) => {
        img.style.transform = `scale(${e.target.value})`;
    });
};

window.saveImagePosition = async function(memoryId) {
    const xValue = parseInt(document.getElementById('adjust-x').value);
    const yValue = parseInt(document.getElementById('adjust-y').value);
    const zoomValue = parseFloat(document.getElementById('adjust-zoom').value);
    
    showLoading(true);
    
    try {
        await memoriesCollection.doc(memoryId).update({
            imagePosition: { x: xValue, y: yValue },
            imageZoom: zoomValue
        });
        
        console.log('✅ Image position saved');
        closeImageAdjust();
        await loadMemories();
    } catch (error) {
        console.error('❌ Failed to save position:', error);
        showError('Failed to save position');
    }
    
    showLoading(false);
};

window.closeImageAdjust = function() {
    const modal = document.querySelector('.image-adjust-modal');
    if (modal) modal.remove();
};

function viewSinglePhoto(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory || memory.images.length === 0) return;
    
    currentViewingMemoryId = memoryId;
    
    const date = memory.memoryDate ? memory.memoryDate.toDate() : new Date();
    const formattedDate = formatMemoryDate(date);
    
    const imgStyle = getImageStyle(memory);
    
    const container = document.getElementById('single-photo-container');
    container.innerHTML = `
        <div class="viewer-polaroid">
            <div class="viewer-polaroid-photo">
                <img src="${memory.images[0]}" alt="Memory" style="${imgStyle}">
            </div>
            <div class="viewer-polaroid-caption">
                <p class="viewer-date">${formattedDate}</p>
                ${memory.caption ? `<p class="viewer-caption-text">${memory.caption}</p>` : ''}
            </div>
        </div>
    `;
    
    document.getElementById('photo-viewer-modal').classList.remove('hidden');
}

function viewAlbum(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory || memory.images.length === 0) return;
    
    currentViewingMemoryId = memoryId;
    currentAlbumIndex = 0;
    
    renderAlbumPhoto(memory);
    updatePhotoCounter(memory.images.length);
    
    const date = memory.memoryDate ? memory.memoryDate.toDate() : new Date();
    const formattedDate = formatMemoryDate(date);
    
    const infoContainer = document.getElementById('album-viewer-info');
    infoContainer.innerHTML = `
        <p class="viewer-date">${formattedDate}</p>
        ${memory.caption ? `<p class="viewer-caption-text">${memory.caption}</p>` : ''}
    `;
    
    document.getElementById('album-viewer-modal').classList.remove('hidden');
    
    // Setup swipe
    setupAlbumSwipe();
}

function renderAlbumPhoto(memory) {
    const container = document.getElementById('album-photos-container');
    const currentImage = memory.images[currentAlbumIndex];
    
    const imgStyle = getImageStyle(memory);
    
    container.innerHTML = `
        <div class="viewer-polaroid swipeable-polaroid">
            <div class="viewer-polaroid-photo">
                <img src="${currentImage}" alt="Photo ${currentAlbumIndex + 1}" style="${imgStyle}">
            </div>
        </div>
    `;
}

function setupAlbumSwipe() {
    const container = document.getElementById('album-photos-container');
    let startX = 0;
    
    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                navigateAlbum(1); // Swipe left - next
            } else {
                navigateAlbum(-1); // Swipe right - previous
            }
        }
    });
}

function navigateAlbum(direction) {
    const memory = memories.find(m => m.id === currentViewingMemoryId);
    if (!memory) return;
    
    currentAlbumIndex += direction;
    
    if (currentAlbumIndex < 0) {
        currentAlbumIndex = memory.images.length - 1;
    } else if (currentAlbumIndex >= memory.images.length) {
        currentAlbumIndex = 0;
    }
    
    renderAlbumPhoto(memory);
    updatePhotoCounter(memory.images.length);
}

function updatePhotoCounter(total) {
    document.getElementById('photo-counter').textContent = `${currentAlbumIndex + 1} / ${total}`;
}

async function handleMemoryDelete() {
    if (!currentViewingMemoryId) return;
    if (!confirm('Delete this memory forever?')) return;
    
    showLoading(true);
    try {
        await memoriesCollection.doc(currentViewingMemoryId).delete();
        console.log('✅ Memory deleted');
        document.getElementById('album-viewer-modal').classList.add('hidden');
        document.getElementById('photo-viewer-modal').classList.add('hidden');
        currentViewingMemoryId = null;
        await loadMemories();
    } catch (error) {
        console.error('❌ Delete failed:', error);
        showError('Failed to delete memory');
    }
    showLoading(false);
}

function formatMemoryDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getImageStyle(memory) {
    const posX = memory.imagePosition ? memory.imagePosition.x : 50;
    const posY = memory.imagePosition ? memory.imagePosition.y : 50;
    const zoom = memory.imageZoom || 1;
    return `object-fit: cover; object-position: ${posX}% ${posY}%${zoom !== 1 ? `; transform: scale(${zoom})` : ''}`;
}

// Notes Handling
async function handleNoteSubmit(e) {
    e.preventDefault();
    
    const noteText = document.getElementById('note-text').value.trim();
    if (!noteText) return;
    
    const note = {
        text: noteText,
        createdBy: currentUserProfile.role,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    showLoading(true);
    
    try {
        await notesCollection.add(note);
        console.log('✅ Note added');
        document.getElementById('note-modal').classList.add('hidden');
        document.getElementById('note-form').reset();
        await loadNotes();
    } catch (error) {
        console.error('❌ Note save error:', error);
        showError('Failed to save note');
    }
    
    showLoading(false);
}

async function deleteNote(noteId) {
    if (!confirm('Delete this note?')) return;
    
    showLoading(true);
    try {
        await notesCollection.doc(noteId).delete();
        console.log('✅ Note deleted');
        await loadNotes();
    } catch (error) {
        console.error('❌ Note delete error:', error);
        showError('Failed to delete note');
    }
    showLoading(false);
}

function renderNotes() {
    const container = document.getElementById('notes-container');
    
    if (notes.length === 0) {
        container.innerHTML = '<p class="notes-empty">No notes yet. Share what you noticed today.</p>';
        return;
    }
    
    const pastelColors = ['#fef5e7', '#ffe4e4', '#e8f5e8', '#f0e7f5'];
    
    container.innerHTML = notes.map((note, index) => {
        const color = pastelColors[index % pastelColors.length];
        const rotation = (Math.random() * 4 - 2).toFixed(2);
        
        return `
            <div class="sticky-note" 
                 style="background: ${color}; transform: rotate(${rotation}deg)" 
                 data-note-id="${note.id}"
                 ontouchstart="handleNoteTouchStart(event, '${note.id}')"
                 ontouchend="handleNoteTouchEnd()"
                 ontouchmove="handleNoteTouchMove()">
                <p>${note.text}</p>
            </div>
        `;
    }).join('');
}

function handleNoteTouchStart(event, noteId) {
    currentNoteLongPress = noteId;
    longPressNoteTimer = setTimeout(() => {
        if (currentNoteLongPress === noteId) {
            deleteNote(noteId);
        }
    }, 1000);
}

function handleNoteTouchEnd() {
    if (longPressNoteTimer) {
        clearTimeout(longPressNoteTimer);
        longPressNoteTimer = null;
    }
    currentNoteLongPress = null;
}

function handleNoteTouchMove() {
    if (longPressNoteTimer) {
        clearTimeout(longPressNoteTimer);
        longPressNoteTimer = null;
    }
    currentNoteLongPress = null;
}

// Utility Functions
function formatDate(date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (inputDate.getTime() === today.getTime()) {
        return 'Today';
    } else if (inputDate.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    } else {
        const options = { month: 'short', day: 'numeric' };
        if (date.getFullYear() !== now.getFullYear()) {
            options.year = 'numeric';
        }
        return date.toLocaleDateString('en-US', options);
    }
}

function showBalanceCelebration() {
    const celebration = document.getElementById('balance-celebration');
    if (celebration) {
        celebration.classList.remove('hidden');
        setTimeout(() => celebration.classList.add('hidden'), 3000);
    }
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }
}

function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Global Function Exports
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
