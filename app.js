// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'ddyj2njes';
const CLOUDINARY_UPLOAD_PRESET = 'usual_us';
const CLOUDINARY_FOLDER = 'usual-us/memories';

// User credentials
const USERS = {
    'imsusu': {
        pin: '0804',
        name: 'Krishna',
        role: 'me'
    },
    'imgugu': {
        pin: '2801',
        name: 'Rashi',
        role: 'her'
    }
};

// Relationship start date
const RELATIONSHIP_START = new Date('2025-01-28');

// Daily romantic quotes (60 quotes)
const DAILY_QUOTES = [
    "Still my favorite person.",
    "No matter the balance, I choose you.",
    "Today felt warmer because of you.",
    "You make the ordinary feel magical.",
    "Thank you for being you.",
    "Every day with you is my favorite day.",
    "You're the reason I smile more.",
    "Home is wherever you are.",
    "You make everything better.",
    "I'm grateful for us.",
    "You're my safe place.",
    "I love the way we are together.",
    "You make my heart feel full.",
    "Being with you feels right.",
    "You're my person.",
    "I choose us, every single day.",
    "You make life sweeter.",
    "Thank you for loving me.",
    "You're the best part of my days.",
    "I love our little world.",
    "You make me want to be better.",
    "Every moment with you matters.",
    "You're my favorite hello and hardest goodbye.",
    "I'm so lucky it's you.",
    "You feel like home.",
    "You're my calm in the chaos.",
    "I love how we fit together.",
    "You make everything feel possible.",
    "Thank you for choosing me too.",
    "You're my greatest adventure.",
    "I love the us we've become.",
    "You make my world brighter.",
    "Every day, I fall a little more.",
    "You're exactly what I needed.",
    "I love our story.",
    "You make me believe in forever.",
    "You're my favorite feeling.",
    "I'm proud to be yours.",
    "You make life beautiful.",
    "Thank you for being patient with me.",
    "You're my comfort and my joy.",
    "I love the little things we share.",
    "You make ordinary days special.",
    "You're my happy place.",
    "I'm better because of you.",
    "You're the one I want forever.",
    "Every day with you is a gift.",
    "You make me feel understood.",
    "I love how you see me.",
    "You're my favorite person to do nothing with.",
    "Thank you for being my constant.",
    "You make everything worthwhile.",
    "I love the way you love me.",
    "You're my peace.",
    "I'm grateful for every moment.",
    "You make me laugh the most.",
    "You're my best decision.",
    "I love growing with you.",
    "You're my yesterday, today, and tomorrow.",
    "Thank you for making life sweeter."
];

// Global state
let currentUser = null;
let currentUserProfile = null;
let expenses = [];
let memories = [];
let notes = [];
let selectedPhotos = [];
let lastBalance = null;
let balanceBeforeAction = null;
let currentAlbumIndex = 0;
let currentViewingMemoryId = null;
let longPressTimer = null;

// Category emojis
const categoryEmojis = {
    food: '🍕',
    dates: '🎬',
    gmasti: '☺️',
    gifts: '🎁',
    home: '🏠',
    misc: '✨'
};

// Helper function to get partner pronoun
function getPartnerPronoun() {
    return currentUserProfile.role === 'me' ? 'her' : 'him';
}

function getPartnerName() {
    const partnerId = Object.keys(USERS).find(id => USERS[id].role !== currentUserProfile.role);
    return USERS[partnerId]?.name || 'Partner';
}

// Calculate days together
function getDaysTogether() {
    const today = new Date();
    const diffTime = Math.abs(today - RELATIONSHIP_START);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Get daily quote (rotates based on day number)
function getDailyQuote() {
    const dayNumber = getDaysTogether();
    const quoteIndex = (dayNumber - 1) % DAILY_QUOTES.length;
    return DAILY_QUOTES[quoteIndex];
}

// Check if it's late night (after 11 PM)
function isLateNight() {
    const hour = new Date().getHours();
    return hour >= 23 || hour < 6;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    initializeAuth();
    setupEventListeners();
});

// Authentication
function initializeAuth() {
    const savedUserId = localStorage.getItem('usual_us_user_id');
    console.log('Checking for saved user:', savedUserId);
    
    if (savedUserId) {
        const user = USERS[savedUserId];
        if (user) {
            document.getElementById('returning-name').textContent = user.name;
            document.getElementById('first-login-form').classList.add('hidden');
            document.getElementById('returning-login-form').classList.remove('hidden');
        } else {
            localStorage.removeItem('usual_us_user_id');
            showFirstLogin();
        }
    } else {
        showFirstLogin();
    }
    
    showLogin();
}

function showFirstLogin() {
    document.getElementById('first-login-form').classList.remove('hidden');
    document.getElementById('returning-login-form').classList.add('hidden');
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
    
    // Initialize Firebase
    initializeFirebase();
    
    await loadUserProfile();
    
    // Update dynamic labels
    updateDynamicLabels();
    
    showApp();
    loadData();
    
    return true;
}

async function loadUserProfile() {
    const userDoc = await usersCollection.doc(currentUser).get();
    
    if (!userDoc.exists) {
        await usersCollection.doc(currentUser).set(currentUserProfile);
    }
    
    updateGreeting();
}

function updateGreeting() {
    const hour = new Date().getHours();
    let timeOfDay;
    
    if (hour < 12) timeOfDay = 'Good morning';
    else if (hour < 17) timeOfDay = 'Good afternoon';
    else timeOfDay = 'Good evening';
    
    document.getElementById('greeting').textContent = `${timeOfDay}, ${currentUserProfile.name} 🤍`;
}

function updateDynamicLabels() {
    const partnerPronoun = getPartnerPronoun();
    
    // Update "Paid by" label
    document.getElementById('partner-label').textContent = partnerPronoun === 'her' ? 'Her' : 'Him';
    
    // Update stats label
    document.getElementById('partner-contribution-label').textContent = 
        partnerPronoun === 'her' ? 'Her Contribution' : 'His Contribution';
}

function showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

function showApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
}

// Event Listeners
function setupEventListeners() {
    // First time login
    document.getElementById('first-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = document.getElementById('user-id-input').value.toLowerCase().trim();
        const pin = document.getElementById('pin-input').value;
        await handleLogin(userId, pin, false);
    });
    
    // Returning login
    document.getElementById('returning-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const savedUserId = localStorage.getItem('usual_us_user_id');
        const pin = document.getElementById('returning-pin-input').value;
        await handleLogin(savedUserId, pin, true);
    });
    
    // Switch user
    document.getElementById('switch-user-btn').addEventListener('click', () => {
        localStorage.removeItem('usual_us_user_id');
        document.getElementById('first-login-form').reset();
        document.getElementById('returning-login-form').reset();
        showFirstLogin();
    });
    
    // Bottom navigation
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
    
    // Expense form
    document.getElementById('expense-form').addEventListener('submit', handleExpenseSubmit);
    
    // Settle button
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
    
    // Memory modal
    document.getElementById('add-memory-btn').addEventListener('click', () => {
        document.getElementById('memory-modal').classList.remove('hidden');
        document.getElementById('photo-selection').classList.remove('hidden');
        document.getElementById('memory-form').classList.add('hidden');
        selectedPhotos = [];
    });
    
    document.getElementById('close-memory-modal').addEventListener('click', () => {
        document.getElementById('memory-modal').classList.add('hidden');
        resetMemoryForm();
    });
    
    // Photo selection
    document.getElementById('camera-btn').addEventListener('click', () => {
        document.getElementById('camera-input').click();
    });
    
    document.getElementById('gallery-btn').addEventListener('click', () => {
        document.getElementById('gallery-input').click();
    });
    
    document.getElementById('camera-input').addEventListener('change', handlePhotoSelect);
    document.getElementById('gallery-input').addEventListener('change', handlePhotoSelect);
    document.getElementById('memory-form').addEventListener('submit', handleMemoryUpload);
    
    // Album viewer controls
    document.getElementById('close-album-viewer').addEventListener('click', () => {
        document.getElementById('album-viewer-modal').classList.add('hidden');
    });
    
    document.getElementById('prev-photo').addEventListener('click', () => navigateAlbum(-1));
    document.getElementById('next-photo').addEventListener('click', () => navigateAlbum(1));
    
    document.getElementById('delete-album-btn').addEventListener('click', handleMemoryDelete);
    
    // Single photo viewer
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
    
    // Balance celebration
    document.getElementById('balance-celebration').addEventListener('click', () => {
        document.getElementById('balance-celebration').classList.add('hidden');
    });
    
    // Easter egg - long press on Us title
    const usTitle = document.getElementById('us-title');
    
    usTitle.addEventListener('touchstart', (e) => {
        longPressTimer = setTimeout(() => {
            showEasterEgg();
        }, 2000); // 2 second long press
    });
    
    usTitle.addEventListener('touchend', () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    });
    
    usTitle.addEventListener('touchmove', () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    });
    
    // Desktop fallback for easter egg
    usTitle.addEventListener('mousedown', () => {
        longPressTimer = setTimeout(() => {
            showEasterEgg();
        }, 2000);
    });
    
    usTitle.addEventListener('mouseup', () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    });
    
    usTitle.addEventListener('mouseleave', () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    });
}

function showEasterEgg() {
    const easterEgg = document.getElementById('easter-egg');
    easterEgg.classList.remove('hidden');
    
    setTimeout(() => {
        easterEgg.classList.add('hidden');
    }, 4000);
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    if (tabName === 'stats') {
        renderStats();
    } else if (tabName === 'us') {
        initializeUsTab();
    }
}

// Initialize Us Tab
function initializeUsTab() {
    // Update day counter
    const days = getDaysTogether();
    document.getElementById('us-day-counter').textContent = `Day ${days} of us`;
    
    // Update daily quote
    document.getElementById('ritual-quote').textContent = getDailyQuote();
    
    // Apply late night mode if applicable
    const usTab = document.getElementById('us-tab');
    if (isLateNight()) {
        usTab.classList.add('late-night');
        document.getElementById('late-night-message').classList.remove('hidden');
    } else {
        usTab.classList.remove('late-night');
        document.getElementById('late-night-message').classList.add('hidden');
    }
}

// Data Loading
async function loadData() {
    showLoading(true);
    await Promise.all([
        loadExpenses(),
        loadMemories(),
        loadNotes()
    ]);
    showLoading(false);
}

async function loadExpenses() {
    const snapshot = await expensesCollection
        .orderBy('createdAt', 'desc')
        .get();
    
    expenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    
    renderBalance();
    renderRecentExpenses();
    renderAllExpenses();
}

async function loadMemories() {
    const snapshot = await memoriesCollection
        .orderBy('createdAt', 'desc')
        .get();
    
    memories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    
    renderMemoriesTimeline();
}

async function loadNotes() {
    const snapshot = await notesCollection
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();
    
    notes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    
    renderNotes();
}

// Expense Handling
async function handleExpenseSubmit(e) {
    e.preventDefault();
    
    // Store balance before adding
    balanceBeforeAction = calculateCurrentBalance();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const paidBy = document.querySelector('input[name="paidBy"]:checked').value;
    const splitType = document.querySelector('input[name="splitType"]:checked').value;
    const category = document.querySelector('input[name="category"]:checked').value;
    const note = document.getElementById('note').value.trim();
    
    let myShare, partnerShare;
    
    if (splitType === 'equal') {
        myShare = amount / 2;
        partnerShare = amount / 2;
    } else {
        myShare = parseFloat(document.getElementById('my-share').value);
        partnerShare = amount - myShare;
    }
    
    const expense = {
        amount: amount,
        paidBy: paidBy,
        myShare: myShare,
        partnerShare: partnerShare,
        category: category,
        note: note,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUserProfile.role
    };
    
    showLoading(true);
    
    try {
        await expensesCollection.add(expense);
        document.getElementById('expense-form').reset();
        document.getElementById('custom-split').classList.add('hidden');
        await loadExpenses();
        switchTab('home');
    } catch (error) {
        showError('Failed to add expense. Please try again.');
    }
    
    showLoading(false);
}

async function handleExpenseEdit(e) {
    e.preventDefault();
    
    const expenseId = document.getElementById('edit-expense-id').value;
    const amount = parseFloat(document.getElementById('edit-amount').value);
    const note = document.getElementById('edit-note').value.trim();
    
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;
    
    // Recalculate shares proportionally
    const ratio = amount / expense.amount;
    const myShare = expense.myShare * ratio;
    const partnerShare = expense.partnerShare * ratio;
    
    showLoading(true);
    
    try {
        await expensesCollection.doc(expenseId).update({
            amount: amount,
            myShare: myShare,
            partnerShare: partnerShare,
            note: note
        });
        
        document.getElementById('edit-expense-modal').classList.add('hidden');
        await loadExpenses();
    } catch (error) {
        showError('Failed to update expense.');
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
    
    // Don't trigger celebration on delete
    balanceBeforeAction = null;
    
    showLoading(true);
    try {
        await expensesCollection.doc(expenseId).delete();
        await loadExpenses();
    } catch (error) {
        showError('Failed to delete expense.');
    }
    showLoading(false);
}

// Settle Functionality - With Custom Amount
function showSettleModal() {
    const balance = calculateCurrentBalance();
    const partnerName = getPartnerName();
    
    if (balance === 0) {
        showError('Already settled! Balance is ₹0');
        return;
    }
    
    const settleMsg = document.getElementById('settle-message');
    const settleSubMsg = document.getElementById('settle-submessage');
    const settleAmountInput = document.getElementById('settle-amount');
    
    // Pre-fill with full balance
    settleAmountInput.value = Math.abs(balance).toFixed(2);
    
    if (balance > 0) {
        settleMsg.textContent = `${partnerName} owes you ₹${balance.toFixed(2)}`;
        settleSubMsg.textContent = `Enter amount to settle`;
    } else {
        settleMsg.textContent = `You owe ${partnerName} ₹${Math.abs(balance).toFixed(2)}`;
        settleSubMsg.textContent = `Enter amount to settle`;
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
    
    // Cap at current balance
    if (settleAmount > Math.abs(currentBalance)) {
        settleAmount = Math.abs(currentBalance);
    }
    
    const partnerPronoun = getPartnerPronoun();
    const partnerName = getPartnerName();
    
    const settlementNote = currentBalance > 0 
        ? `Settlement - ${partnerName} paid ₹${settleAmount.toFixed(2)}`
        : `Settlement - I paid ₹${settleAmount.toFixed(2)}`;
    
    const settlement = {
        amount: settleAmount,
        paidBy: currentBalance > 0 ? 'partner' : 'me',
        myShare: settleAmount,
        partnerShare: settleAmount,
        category: 'misc',
        note: settlementNote,
        isSettlement: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUserProfile.role
    };
    
    // Store balance before settlement
    balanceBeforeAction = currentBalance;
    
    showLoading(true);
    
    try {
        await expensesCollection.add(settlement);
        document.getElementById('settle-modal').classList.add('hidden');
        settleAmountInput.value = '';
        await loadExpenses();
    } catch (error) {
        showError('Settlement failed. Please try again.');
    }
    
    showLoading(false);
}

function calculateCurrentBalance() {
    let balance = 0;
    
    expenses.forEach(expense => {
        if (expense.paidBy === 'me') {
            balance += expense.partnerShare;
        } else {
            balance -= expense.myShare;
        }
    });
    
    return balance;
}

// Rendering Functions
function renderBalance() {
    const balance = calculateCurrentBalance();
    
    const balanceAmount = document.getElementById('balance-amount');
    const balanceStatus = document.getElementById('balance-status');
    const whoPayIndicator = document.getElementById('who-pays-indicator');
    const partnerPronoun = getPartnerPronoun();
    const partnerName = getPartnerName();
    
    if (balance > 0) {
        balanceAmount.textContent = `₹${balance.toFixed(2)}`;
        balanceStatus.textContent = `${partnerName} owes you`;
        whoPayIndicator.textContent = partnerPronoun === 'her' ? '👩' : '👨';
    } else if (balance < 0) {
        balanceAmount.textContent = `₹${Math.abs(balance).toFixed(2)}`;
        balanceStatus.textContent = `You owe ${partnerName}`;
        whoPayIndicator.textContent = '🙋';
    } else {
        balanceAmount.textContent = '₹0';
        balanceStatus.textContent = 'All settled';
        whoPayIndicator.textContent = '✨';
        
        // Show celebration only if balance just became zero from adding/settling
        if (balanceBeforeAction !== null && balanceBeforeAction !== 0) {
            showBalanceCelebration();
        }
    }
    
    lastBalance = balance;
    balanceBeforeAction = null;
}

function renderRecentExpenses() {
    const container = document.getElementById('recent-expenses');
    const recentExpenses = expenses.slice(0, 5);
    const partnerPronoun = getPartnerPronoun();
    
    if (recentExpenses.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💸</div><p>No expenses yet</p></div>';
        return;
    }
    
    container.innerHTML = recentExpenses.map(expense => {
        const date = expense.createdAt ? expense.createdAt.toDate() : new Date();
        const formattedDate = formatDate(date);
        const paidByText = expense.paidBy === 'me' ? 'you' : partnerPronoun;
        
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
    const partnerPronoun = getPartnerPronoun();
    
    if (expenses.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><p>No expenses yet</p></div>';
        return;
    }
    
    container.innerHTML = expenses.map(expense => {
        const date = expense.createdAt ? expense.createdAt.toDate() : new Date();
        const formattedDate = formatDate(date);
        const paidByText = expense.paidBy === 'me' ? 'you' : partnerPronoun;
        const partnerShareLabel = partnerPronoun === 'her' ? 'Her share' : 'His share';
        
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
                    Your share: ₹${expense.myShare.toFixed(2)} • 
                    ${partnerShareLabel}: ₹${expense.partnerShare.toFixed(2)}
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
    const myContribution = thisMonth.reduce((sum, e) => sum + (e.paidBy === 'me' ? e.amount : 0), 0);
    const partnerContribution = thisMonth.reduce((sum, e) => sum + (e.paidBy === 'partner' ? e.amount : 0), 0);
    
    document.getElementById('total-spent').textContent = `₹${totalSpent.toFixed(2)}`;
    document.getElementById('my-contribution').textContent = `₹${myContribution.toFixed(2)}`;
    document.getElementById('partner-contribution').textContent = `₹${partnerContribution.toFixed(2)}`;
    
    const categoryTotals = {};
    thisMonth.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    const breakdownContainer = document.getElementById('category-breakdown');
    const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1]);
    
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
    
    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('div');
            preview.className = 'photo-preview-item';
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}">
                <button type="button" class="btn-remove-photo" onclick="removePhoto(${index})">×</button>
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

async function handleMemoryUpload(e) {
    e.preventDefault();
    
    if (selectedPhotos.length === 0) return;
    
    const caption = document.getElementById('memory-caption').value.trim();
    
    showLoading(true);
    
    try {
        const imageUrls = [];
        
        // Upload all photos to Cloudinary
        for (const photo of selectedPhotos) {
            const formData = new FormData();
            formData.append('file', photo);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', CLOUDINARY_FOLDER);
            
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            imageUrls.push(data.secure_url);
        }
        
        // Save to Firestore
        const memory = {
            images: imageUrls,
            caption: caption,
            uploadedBy: currentUserProfile.role,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await memoriesCollection.add(memory);
        
        resetMemoryForm();
        document.getElementById('memory-modal').classList.add('hidden');
        await loadMemories();
        switchTab('us');
    } catch (error) {
        console.error('Upload error:', error);
        showError('Failed to upload memory. Please try again.');
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

// Get random tilt for Polaroid effect (-3 to 3 degrees)
function getRandomTilt() {
    return (Math.random() * 6 - 3).toFixed(2);
}

// Render memories as intimate Polaroid timeline
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
        const date = memory.createdAt ? memory.createdAt.toDate() : new Date();
        const formattedDate = formatMemoryDate(date);
        const imageCount = memory.images.length;
        const tilt = getRandomTilt();
        
        if (imageCount === 1) {
            // Single Polaroid
            return `
                <div class="polaroid-wrapper">
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
            // Photo Stack
            return `
                <div class="polaroid-wrapper">
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

// View single photo in full screen
function viewSinglePhoto(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory || memory.images.length === 0) return;
    
    currentViewingMemoryId = memoryId;
    
    const date = memory.createdAt ? memory.createdAt.toDate() : new Date();
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

// View album with swipeable Polaroids
function viewAlbum(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory || memory.images.length === 0) return;
    
    currentViewingMemoryId = memoryId;
    currentAlbumIndex = 0;
    
    renderAlbumPhoto(memory);
    updatePhotoCounter(memory.images.length);
    
    const date = memory.createdAt ? memory.createdAt.toDate() : new Date();
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
                <img src="${currentImage}" alt="Photo ${currentAlbumIndex + 1}">
            </div>
        </div>
    `;
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
        document.getElementById('album-viewer-modal').classList.add('hidden');
        document.getElementById('photo-viewer-modal').classList.add('hidden');
        currentViewingMemoryId = null;
        await loadMemories();
    } catch (error) {
        showError('Failed to delete memory.');
    }
    showLoading(false);
}

// Format date for memories (handwritten style)
function formatMemoryDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
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
        document.getElementById('note-modal').classList.add('hidden');
        document.getElementById('note-form').reset();
        await loadNotes();
    } catch (error) {
        showError('Failed to save note.');
    }
    
    showLoading(false);
}

function renderNotes() {
    const container = document.getElementById('notes-container');
    
    if (notes.length === 0) {
        container.innerHTML = '<p class="notes-empty">No notes yet. Share what you noticed today.</p>';
        return;
    }
    
    // Pastel colors for sticky notes
    const pastelColors = ['#fef5e7', '#ffe4e4', '#e8f5e8', '#f0e7f5'];
    
    container.innerHTML = notes.map((note, index) => {
        const color = pastelColors[index % pastelColors.length];
        const rotation = (Math.random() * 4 - 2).toFixed(2); // -2 to 2 degrees
        
        return `
            <div class="sticky-note" style="background: ${color}; transform: rotate(${rotation}deg)">
                <p>${note.text}</p>
            </div>
        `;
    }).join('');
}

// Utilities
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
    celebration.classList.remove('hidden');
    
    setTimeout(() => {
        celebration.classList.add('hidden');
    }, 3000);
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
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

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}





