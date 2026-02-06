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

// Music playlist
const PLAYLIST = [
    { title: "Perfect", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391575/Perfect_-_Ed_Sheeran_nqryux.m4a" },
    { title: "It's You", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391588/It_s_You_-_Ali_Gatie_2_aku2kh.m4a" },
    { title: "You are the Reason", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391602/You_Are_The_Reason_-_Calum_Scott_vzelqf.m4a" },
    { title: "Raabta", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391583/Raabta_helsab.m4a" },
    { title: "Mere liye", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391581/Mere_liye_tum_kaafi_ho_rvgggr.m4a" },
    { title: "All of Me", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391581/All_of_Me_-_John_Legend_mjr400.m4a" },
    { title: "Until I found You", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391597/Until_I_Found_You_-_Stephen_Sanchez_ktkenw.m4a" },
    { title: "Tum ho", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391601/Tum_ho_kgv3rb.m4a" },
    { title: "Chaandaniya", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391582/Chaandaniya_eqf5vo.m4a" },
    { title: "Saibo", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391588/Saibo_Lofi_Flip_-_VIBIE_ftit8a.m4a" },
    { title: "Tum se hi", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391595/Tum_se_hi_cbobgn.m4a" },
    { title: "Say You won't let me go", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391597/Say_You_Won_t_Let_Go_-_James_Arthur_e19y4j.m4a" },
    { title: "Yellow", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391601/Yellow_-_Coldplay_b9mxit.m4a" },
    { title: "Tera mujhse", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391604/Tera_mujhse_hai_pehle_ka_naata_koi_c0stlt.m4a" },
    { title: "Bloom", url: "https://res.cloudinary.com/ddyj2njes/video/upload/v1770391584/Bloom_Bonus_Track_-_The_Paper_Kites_fyfkli.m4a" }
];

// Daily romantic quotes
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

// Global state
let currentUser = null, currentUserProfile = null;
let expenses = [], memories = [], notes = [], budget = null;
let selectedPhotos = [], balanceBeforeAction = null;
let currentAlbumIndex = 0, currentViewingMemoryId = null;
let longPressTimer = null, longPressNoteTimer = null, currentNoteLongPress = null;
let musicPlayer = null, musicWasPlaying = false, isSubmitting = false;

const categoryEmojis = { food: '🍕', dates: '🎬', gmasti: '☺️', gifts: '🎁', home: '🏠', misc: '✨' };

// Helper functions
const getPartnerRole = () => currentUserProfile.role === 'krishna' ? 'rashi' : 'krishna';
const getPartnerName = () => {
    const partnerRole = getPartnerRole();
    const partnerId = Object.keys(USERS).find(id => USERS[id].role === partnerRole);
    return USERS[partnerId]?.name || 'Partner';
};
const getDaysTogether = () => Math.ceil(Math.abs(new Date() - RELATIONSHIP_START) / (1000 * 60 * 60 * 24));
const getDailyQuote = () => DAILY_QUOTES[(getDaysTogether() - 1) % DAILY_QUOTES.length];
const isLateNight = () => { const h = new Date().getHours(); return h >= 23 || h < 6; };

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 App initializing...');
    initializeAuth();
    setupEventListeners();
    initializeMusicPlayer();
});

function initializeMusicPlayer() {
    musicPlayer = document.getElementById('music-player');
    const songSelector = document.getElementById('song-selector');
    
    PLAYLIST.forEach((song, idx) => {
        const option = document.createElement('option');
        option.value = idx;
        option.textContent = song.title;
        songSelector.appendChild(option);
    });
    console.log('🎵 Loaded', PLAYLIST.length, 'songs');
}

// Auth
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
    if (!user) { showError('Invalid User ID'); return false; }
    if (user.pin !== pin) { showError('Incorrect PIN'); return false; }
    
    if (!isReturning) localStorage.setItem('usual_us_user_id', userId);
    
    currentUserProfile = { uid: userId, name: user.name, role: user.role };
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
        if (!userDoc.exists) await usersCollection.doc(currentUser).set(currentUserProfile);
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

// Event Listeners - COMPLETE
function setupEventListeners() {
    // Auth
    document.getElementById('first-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin(
            document.getElementById('user-id-input').value.toLowerCase().trim(),
            document.getElementById('pin-input').value,
            false
        );
    });
    
    document.getElementById('returning-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin(
            localStorage.getItem('usual_us_user_id'),
            document.getElementById('returning-pin-input').value,
            true
        );
    });
    
    document.getElementById('switch-user-btn').addEventListener('click', () => {
        localStorage.removeItem('usual_us_user_id');
        document.getElementById('first-login-form').reset();
        document.getElementById('returning-login-form').reset();
        initializeAuth();
    });
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => switchTab(e.currentTarget.dataset.tab));
    });
    
    // Split type
    document.querySelectorAll('input[name="splitType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('custom-split').classList.toggle('hidden', e.target.value !== 'custom');
        });
    });
    
    // Expense
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
    document.getElementById('edit-budget-btn').addEventListener('click', () => {
        document.getElementById('budget-modal').classList.remove('hidden');
        if (budget) document.getElementById('budget-amount-input').value = budget.amount;
    });
    document.getElementById('close-budget-modal').addEventListener('click', () => {
        document.getElementById('budget-modal').classList.add('hidden');
    });
    document.getElementById('budget-form').addEventListener('submit', handleBudgetSubmit);
    
    // Memory
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
    document.getElementById('camera-btn').addEventListener('click', () => document.getElementById('camera-input').click());
    document.getElementById('gallery-btn').addEventListener('click', () => document.getElementById('gallery-input').click());
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
    
    // Photo viewer
    document.getElementById('close-photo-viewer').addEventListener('click', () => {
        document.getElementById('photo-viewer-modal').classList.add('hidden');
    });
    document.getElementById('delete-photo-btn').addEventListener('click', handleMemoryDelete);
    
    // Notes
    document.getElementById('add-note-btn').addEventListener('click', () => {
        document.getElementById('note-modal').classList.remove('hidden');
    });
    document.getElementById('close-note-modal').addEventListener('click', () => {
        document.getElementById('note-modal').classList.add('hidden');
    });
    document.getElementById('note-form').addEventListener('submit', handleNoteSubmit);
    
    document.getElementById('balance-celebration').addEventListener('click', () => {
        document.getElementById('balance-celebration').classList.add('hidden');
    });
    
    // Easter egg
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
    
    // Music
    document.getElementById('music-player-toggle').addEventListener('click', toggleMusicPlayer);
    document.getElementById('close-music-player').addEventListener('click', () => {
        document.getElementById('music-player-panel').classList.add('hidden');
    });
    document.getElementById('song-selector').addEventListener('change', handleSongSelect);
    document.getElementById('play-pause-btn').addEventListener('click', togglePlayPause);
    document.getElementById('seek-bar').addEventListener('input', handleSeek);
    
    musicPlayer.addEventListener('timeupdate', updateSeekBar);
    musicPlayer.addEventListener('loadedmetadata', () => {
        document.getElementById('duration').textContent = formatTime(musicPlayer.duration);
    });
    musicPlayer.addEventListener('ended', () => {
        document.getElementById('play-pause-btn').textContent = '▶';
    });
}

function showEasterEgg() {
    const egg = document.getElementById('easter-egg');
    egg.classList.remove('hidden');
    setTimeout(() => egg.classList.add('hidden'), 4000);
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Music auto pause/resume
    if (tabName === 'us') {
        if (musicWasPlaying && musicPlayer.paused) musicPlayer.play().catch(() => {});
        initializeUsTab();
    } else {
        musicWasPlaying = !musicPlayer.paused;
        if (!musicPlayer.paused) musicPlayer.pause();
    }
    
    if (tabName === 'stats') renderStats();
}

function initializeUsTab() {
    document.getElementById('us-day-counter').textContent = `Day ${getDaysTogether()} of us`;
    document.getElementById('ritual-quote').textContent = getDailyQuote();
    
    const usTab = document.getElementById('us-tab');
    if (isLateNight()) {
        usTab.classList.add('late-night');
        document.getElementById('late-night-message').classList.remove('hidden');
    } else {
        usTab.classList.remove('late-night');
        document.getElementById('late-night-message').classList.add('hidden');
    }
}

// Music player
function toggleMusicPlayer() {
    document.getElementById('music-player-panel').classList.toggle('hidden');
}

function handleSongSelect(e) {
    const idx = parseInt(e.target.value);
    if (idx >= 0 && idx < PLAYLIST.length) {
        musicPlayer.src = PLAYLIST[idx].url;
        musicPlayer.load();
        document.getElementById('play-pause-btn').disabled = false;
        document.getElementById('seek-bar').disabled = false;
        document.getElementById('play-pause-btn').textContent = '▶';
        console.log('🎵 Selected:', PLAYLIST[idx].title);
    }
}

function togglePlayPause() {
    if (musicPlayer.paused) {
        musicPlayer.play();
        document.getElementById('play-pause-btn').textContent = '⏸';
    } else {
        musicPlayer.pause();
        document.getElementById('play-pause-btn').textContent = '▶';
    }
}

function handleSeek(e) {
    if (musicPlayer.duration) {
        musicPlayer.currentTime = (e.target.value / 100) * musicPlayer.duration;
    }
}

function updateSeekBar() {
    if (musicPlayer.duration) {
        const progress = (musicPlayer.currentTime / musicPlayer.duration) * 100;
        document.getElementById('seek-bar').value = progress;
        document.getElementById('current-time').textContent = formatTime(musicPlayer.currentTime);
    }
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Data Loading
async function loadData() {
    showLoading(true);
    try {
        await Promise.all([loadExpenses(), loadMemories(), loadNotes(), loadBudget()]);
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

// FIXED: Budget with proper display
async function loadBudget() {
    try {
        const now = new Date();
        const budgetDoc = await budgetCollection.doc('current').get();
        
        if (budgetDoc.exists) {
            budget = budgetDoc.data();
            // Check if needs reset
            if (budget.month !== now.getMonth() || budget.year !== now.getFullYear()) {
                console.log('🔄 Resetting budget for new month');
                await budgetCollection.doc('current').delete();
                budget = null;
                showBudgetPrompt();
            } else {
                console.log('💰 Budget:', budget.amount);
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
    // Ensure structure exists
    if (!card.querySelector('.budget-progress-bar')) {
        location.reload(); // Reload if structure missing
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
        await loadBudget(); // Reload
    } catch (error) {
        console.error('❌ Budget error:', error);
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

// CRITICAL FIX: Balance Calculation with ABSOLUTE shares
function calculateCurrentBalance() {
    let balance = 0;
    const myRole = currentUserProfile.role;
    const partnerRole = getPartnerRole();
    
    console.log('💵 Calculating balance for:', myRole);
    
    expenses.forEach(expense => {
        // NEW FORMAT: Using absolute shares
        if (expense.shares) {
            if (expense.paidBy === myRole) {
                // I paid, partner owes me their share
                const partnerOwes = expense.shares[partnerRole] || 0;
                balance += partnerOwes;
                console.log(`  ✓ I paid ${expense.amount}, partner owes ${partnerOwes}`);
            } else {
                // Partner paid, I owe them my share
                const iOwe = expense.shares[myRole] || 0;
                balance -= iOwe;
                console.log(`  ✓ Partner paid ${expense.amount}, I owe ${iOwe}`);
            }
        } 
        // OLD FORMAT: Fallback for existing expenses (will be migrated)
        else if (expense.myShare !== undefined) {
            console.warn('⚠️ Old format expense:', expense.id);
            if (expense.paidBy === myRole) {
                balance += (expense.partnerShare || 0);
            } else {
                balance -= (expense.myShare || 0);
            }
        }
    });
    
    console.log('💵 Final balance:', balance);
    return balance;
}

// FIXED: Expense Submission with absolute shares
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
    
    // Absolute paidBy
    const paidBy = paidByValue === 'me' ? currentUserProfile.role : getPartnerRole();
    
    // Calculate ABSOLUTE shares for both krishna and rashi
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
        shares: {
            krishna: krishnaShare,
            rashi: rashiShare
        },
        category: category,
        note: note,
        countTowardsBudget: countTowardsBudget,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUserProfile.role
    };
    
    console.log('💸 Submitting expense:', expense);
    
    showLoading(true);
    
    try {
        // Add expense
        const docRef = await expensesCollection.add(expense);
        console.log('✅ Expense added:', docRef.id);
        
        // Reset form
        document.getElementById('expense-form').reset();
        document.getElementById('custom-split').classList.add('hidden');
        document.getElementById('count-towards-budget').checked = true;
        
        // Reload (if fails, expense is still saved)
        try {
            await loadExpenses();
        } catch (reloadError) {
            console.warn('⚠️ Reload failed, but expense saved:', reloadError);
        }
        
        switchTab('home');
        
    } catch (error) {
        console.error('❌ Failed to add expense:', error);
        showError('Failed to add expense. Please try again.');
    } finally {
        isSubmitting = false;
        showLoading(false);
    }
}

async function handleExpenseEdit(e) {
    e.preventDefault();
    
    const expenseId = document.getElementById('edit-expense-id').value;
    const amount = parseFloat(document.getElementById('edit-amount').value);
    const note = document.getElementById('edit-note').value.trim();
    
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense || !expense.shares) return;
    
    // Recalculate shares proportionally
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

// FIXED: Settlement
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
        shares: {
            krishna: settleAmount,
            rashi: settleAmount
        },
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
        }
    }
    
    balanceBeforeAction = null;
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
        if (!expense.shares) return ''; // Skip old format
        
        const date = expense.createdAt ? expense.createdAt.toDate() : new Date();
        const formattedDate = formatDate(date);
        const paidByText = expense.paidBy === currentUserProfile.role ? 'you' : partnerName;
        
        const myShare = expense.shares[currentUserProfile.role] || 0;
        const partnerShare = expense.shares[getPartnerRole()] || 0;
        
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
        const expenseDate = expense.createdAt.toDate();
        return expenseDate.getMonth() === now.getMonth() && 
               expenseDate.getFullYear() === now.getFullYear();
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
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    
    if (sortedCategories.length === 0) {
        breakdownContainer.innerHTML = '<div class="empty-state"><p>No expenses this month</p></div>';
        return;
    }
    
    breakdownContainer.innerHTML = sortedCategories.map(([category, amount]) => `
        <div class="category-stat">
            <div class="category-info">
                <div class="category-emoji">${categoryEmojis[category]}</div>
                <div class="category-name">${category}</div>
            </div>
            <div class="category-amount">₹${amount.toFixed(2)}</div>
        </div>
    `).join('');
}

// Memory Handling
function handlePhotoSelect(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    selectedPhotos = files;
    
    document.getElementById('photo-selection').classList.add('hidden');
    document.getElementById('memory-form').classList.remove('hidden');
    
    const previewContainer = document.getElementById('photos-preview');
    previewContainer.innerHTML = '';
    
    files.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('div');
            preview.className = 'photo-preview-item';
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="btn-remove-photo" onclick="removePhoto(${idx})">×</button>
            `;
            previewContainer.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });
}

function removePhoto(idx) {
    selectedPhotos.splice(idx, 1);
    if (selectedPhotos.length === 0) {
        resetMemoryForm();
    } else {
        document.getElementById('photos-preview').children[idx].remove();
    }
}

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
    
    container.innerHTML = memories.map(memory => {
        const date = memory.memoryDate ? memory.memoryDate.toDate() : new Date();
        const formattedDate = formatMemoryDate(date);
        const imageCount = memory.images.length;
        const tilt = getRandomTilt();
        
        if (imageCount === 1) {
            return `
                <div class="polaroid-wrapper">
                    <div class="polaroid-string"></div>
                    <div class="polaroid" style="transform: rotate(${tilt}deg)" onclick="viewSinglePhoto('${memory.id}')">
                        <div class="polaroid-photo">
                            <img src="${memory.images[0]}" alt="${memory.caption || 'Memory'}" loading="lazy">
                        </div>
                        <div class="polaroid-caption-area">
                            <p class="polaroid-date">${formattedDate}</p>
                            ${memory.caption ? `<p class="polaroid-caption">${memory.caption}</p>` : ''}
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="polaroid-wrapper">
                    <div class="polaroid-string"></div>
                    <div class="photo-stack" style="transform: rotate(${tilt}deg)" onclick="viewAlbum('${memory.id}')">
                        <div class="stack-card stack-back-2"></div>
                        <div class="stack-card stack-back-1"></div>
                        <div class="polaroid">
                            <div class="polaroid-photo">
                                <img src="${memory.images[0]}" alt="${memory.caption || 'Album'}" loading="lazy">
                            </div>
                            <div class="polaroid-caption-area">
                                <p class="polaroid-date">${formattedDate}</p>
                                ${memory.caption ? `<p class="polaroid-caption">${memory.caption}</p>` : ''}
                            </div>
                            <div class="album-count-badge">${imageCount} photos</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');
}

function viewSinglePhoto(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory || memory.images.length === 0) return;
    
    currentViewingMemoryId = memoryId;
    
    const date = memory.memoryDate ? memory.memoryDate.toDate() : new Date();
    const formattedDate = formatMemoryDate(date);
    
    const container = document.getElementById('single-photo-container');
    container.innerHTML = `
        <div class="viewer-polaroid">
            <div class="viewer-polaroid-photo">
                <img src="${memory.images[0]}" alt="Memory">
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
}

function renderAlbumPhoto(memory) {
    const container = document.getElementById('album-photos-container');
    const currentImage = memory.images[currentAlbumIndex];
    
    container.innerHTML = `
        <div class="viewer-polaroid swipeable-polaroid">
            <div class="viewer-polaroid-photo">
                <img src="${currentImage}" alt="Photo">
            </div>
        </div>
    `;
}

function navigateAlbum(direction) {
    const memory = memories.find(m => m.id === currentViewingMemoryId);
    if (!memory) return;
    
    currentAlbumIndex += direction;
    
    if (currentAlbumIndex < 0) currentAlbumIndex = memory.images.length - 1;
    else if (currentAlbumIndex >= memory.images.length) currentAlbumIndex = 0;
    
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
        console.error('❌ Note failed:', error);
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
        console.error('❌ Delete failed:', error);
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
    
    container.innerHTML = notes.map((note, idx) => {
        const color = pastelColors[idx % pastelColors.length];
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
        if (currentNoteLongPress === noteId) deleteNote(noteId);
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

// Utilities
function formatDate(date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (inputDate.getTime() === today.getTime()) return 'Today';
    else if (inputDate.getTime() === yesterday.getTime()) return 'Yesterday';
    else {
        const options = { month: 'short', day: 'numeric' };
        if (date.getFullYear() !== now.getFullYear()) options.year = 'numeric';
        return date.toLocaleDateString('en-US', options);
    }
}

function showBalanceCelebration() {
    const celebration = document.getElementById('balance-celebration');
    celebration.classList.remove('hidden');
    setTimeout(() => celebration.classList.add('hidden'), 3000);
}

function showLoading(show) {
    document.getElementById('loading').classList.toggle('hidden', !show);
}

function showError(message) {
    alert(message);
}

// Global functions
window.deleteExpense = deleteExpense;
window.showEditExpense = showEditExpense;
window.viewAlbum = viewAlbum;
window.viewSinglePhoto = viewSinglePhoto;
window.removePhoto = removePhoto;
window.handleNoteTouchStart = handleNoteTouchStart;
window.handleNoteTouchEnd = handleNoteTouchEnd;
window.handleNoteTouchMove = handleNoteTouchMove;

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('✅ Service Worker registered'))
            .catch(err => console.log('⚠️ SW registration failed:', err));
    });
}

console.log('✨ usual us - Loaded successfully');
