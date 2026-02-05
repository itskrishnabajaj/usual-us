// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dqpqm0xqg';
const CLOUDINARY_UPLOAD_PRESET = 'usual_us';
const CLOUDINARY_FOLDER = 'usual-us/food';

// User credentials (EXACTLY TWO USERS)
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

// Global state
let currentUser = null;
let currentUserProfile = null;
let expenses = [];
let foodMemories = [];
let selectedPhoto = null;
let lastBalance = null;

// Category emojis
const categoryEmojis = {
    food: '🍕',
    dates: '🎬',
    travel: '🚆',
    gifts: '🎁',
    home: '☺️',
    misc: '✨'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    setupEventListeners();
});

// Authentication
function initializeAuth() {
    const savedUserId = localStorage.getItem('usual_us_user_id');
    
    if (savedUserId) {
        // Returning user - show PIN only
        const user = USERS[savedUserId];
        if (user) {
            document.getElementById('returning-name').textContent = user.name;
            document.getElementById('first-login').classList.add('hidden');
            document.getElementById('returning-login').classList.remove('hidden');
        } else {
            // Invalid saved user, clear storage
            localStorage.removeItem('usual_us_user_id');
            showFirstLogin();
        }
    } else {
        // First time user
        showFirstLogin();
    }
    
    showLogin();
}

function showFirstLogin() {
    document.getElementById('first-login').classList.remove('hidden');
    document.getElementById('returning-login').classList.add('hidden');
}

async function handleLogin(userId, pin, isReturning = false) {
    console.log('handleLogin called with:', { userId, pin, isReturning });
    console.log('Available users:', Object.keys(USERS));
    
    const user = USERS[userId];
    
    if (!user) {
        console.error('User not found:', userId);
        showError('Invalid User ID');
        return false;
    }
    
    console.log('User found:', user);
    
    if (user.pin !== pin) {
        console.error('PIN mismatch');
        showError('Incorrect PIN');
        return false;
    }
    
    console.log('PIN correct, logging in...');
    
    // Save user ID for future logins
    if (!isReturning) {
        localStorage.setItem('usual_us_user_id', userId);
    }
    
    // Set current user
    currentUserProfile = {
        uid: userId,
        name: user.name,
        role: user.role
    };
    
    currentUser = userId;
    
    // Load or create user profile in Firestore
    await loadUserProfile();
    
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
    // Login form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        
        const savedUserId = localStorage.getItem('usual_us_user_id');
        console.log('Saved user ID:', savedUserId);
        
        if (savedUserId) {
            // Returning user - verify PIN
            const pin = document.getElementById('returning-pin-input').value;
            console.log('Attempting returning login');
            await handleLogin(savedUserId, pin, true);
        } else {
            // First time - get both User ID and PIN
            const userId = document.getElementById('user-id-input').value.toLowerCase().trim();
            const pin = document.getElementById('pin-input').value;
            console.log('Attempting first login with userId:', userId);
            await handleLogin(userId, pin, false);
        }
    });
    
    // Switch user button
    document.getElementById('switch-user-btn').addEventListener('click', () => {
        localStorage.removeItem('usual_us_user_id');
        document.getElementById('login-form').reset();
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
    
    // Food modal
    document.getElementById('add-food-btn').addEventListener('click', () => {
        document.getElementById('food-modal').classList.remove('hidden');
    });
    
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('food-modal').classList.add('hidden');
        resetFoodForm();
    });
    
    // Photo upload
    document.getElementById('photo-upload-area').addEventListener('click', () => {
        document.getElementById('photo-input').click();
    });
    
    document.getElementById('photo-input').addEventListener('change', handlePhotoSelect);
    document.getElementById('food-form').addEventListener('submit', handleFoodUpload);
    
    // Photo viewer
    document.getElementById('close-viewer').addEventListener('click', () => {
        document.getElementById('photo-viewer').classList.add('hidden');
    });
    
    // Balance celebration
    document.getElementById('balance-celebration').addEventListener('click', () => {
        document.getElementById('balance-celebration').classList.add('hidden');
    });
}

function switchTab(tabName) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Reload data if needed
    if (tabName === 'stats') {
        renderStats();
    }
}

// Data Loading
async function loadData() {
    showLoading(true);
    await Promise.all([
        loadExpenses(),
        loadFoodMemories()
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

async function loadFoodMemories() {
    const snapshot = await foodMemoriesCollection
        .orderBy('createdAt', 'desc')
        .get();
    
    foodMemories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    
    renderFoodTimeline();
}

// Expense Handling
async function handleExpenseSubmit(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const paidBy = document.querySelector('input[name="paidBy"]:checked').value;
    const splitType = document.querySelector('input[name="splitType"]:checked').value;
    const category = document.querySelector('input[name="category"]:checked').value;
    const note = document.getElementById('note').value.trim();
    
    let myShare, herShare;
    
    if (splitType === 'equal') {
        myShare = amount / 2;
        herShare = amount / 2;
    } else {
        myShare = parseFloat(document.getElementById('my-share').value);
        herShare = amount - myShare;
    }
    
    const expense = {
        amount: amount,
        paidBy: paidBy,
        myShare: myShare,
        herShare: herShare,
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

async function deleteExpense(expenseId) {
    if (!confirm('Delete this expense?')) return;
    
    showLoading(true);
    try {
        await expensesCollection.doc(expenseId).delete();
        await loadExpenses();
    } catch (error) {
        showError('Failed to delete expense.');
    }
    showLoading(false);
}

// Rendering
function renderBalance() {
    let balance = 0;
    
    expenses.forEach(expense => {
        if (expense.paidBy === 'me') {
            balance += expense.herShare;
        } else {
            balance -= expense.myShare;
        }
    });
    
    const balanceAmount = document.getElementById('balance-amount');
    const balanceStatus = document.getElementById('balance-status');
    const whoPayIndicator = document.getElementById('who-pays-indicator');
    
    if (balance > 0) {
        balanceAmount.textContent = `₹${balance.toFixed(2)}`;
        balanceStatus.textContent = 'She owes you';
        whoPayIndicator.textContent = '👩';
    } else if (balance < 0) {
        balanceAmount.textContent = `₹${Math.abs(balance).toFixed(2)}`;
        balanceStatus.textContent = 'You owe her';
        whoPayIndicator.textContent = '👨';
    } else {
        balanceAmount.textContent = '₹0';
        balanceStatus.textContent = 'All settled';
        whoPayIndicator.textContent = '✨';
        
        // Show celebration if balance just became zero
        if (lastBalance !== null && lastBalance !== 0) {
            showBalanceCelebration();
        }
    }
    
    lastBalance = balance;
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
        
        return `
            <div class="expense-item">
                <div class="expense-details">
                    <div class="expense-category">${categoryEmojis[expense.category]}</div>
                    ${expense.note ? `<div class="expense-note">${expense.note}</div>` : ''}
                    <div class="expense-meta">${formattedDate} • Paid by ${expense.paidBy === 'me' ? 'you' : 'her'}</div>
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
    
    container.innerHTML = expenses.map(expense => {
        const date = expense.createdAt ? expense.createdAt.toDate() : new Date();
        const formattedDate = formatDate(date);
        
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
                    Paid by ${expense.paidBy === 'me' ? 'you' : 'her'} • 
                    Your share: ₹${expense.myShare.toFixed(2)} • 
                    Her share: ₹${expense.herShare.toFixed(2)}
                </div>
                <div class="expense-actions">
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
    const herContribution = thisMonth.reduce((sum, e) => sum + (e.paidBy === 'her' ? e.amount : 0), 0);
    
    document.getElementById('total-spent').textContent = `₹${totalSpent.toFixed(2)}`;
    document.getElementById('my-contribution').textContent = `₹${myContribution.toFixed(2)}`;
    document.getElementById('her-contribution').textContent = `₹${herContribution.toFixed(2)}`;
    
    // Category breakdown
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

// Food Memory Handling
function handlePhotoSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    selectedPhoto = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('photo-preview').src = e.target.result;
        document.getElementById('preview-container').classList.remove('hidden');
        document.getElementById('upload-placeholder').classList.add('hidden');
        document.getElementById('upload-btn').disabled = false;
    };
    reader.readAsDataURL(file);
}

async function handleFoodUpload(e) {
    e.preventDefault();
    
    if (!selectedPhoto) return;
    
    const caption = document.getElementById('food-caption').value.trim();
    
    showLoading(true);
    
    try {
        // Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', selectedPhoto);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', CLOUDINARY_FOLDER);
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        // Save to Firestore
        const foodMemory = {
            imageUrl: data.secure_url,
            caption: caption,
            uploadedBy: currentUserProfile.role,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await foodMemoriesCollection.add(foodMemory);
        
        // Reset and reload
        resetFoodForm();
        document.getElementById('food-modal').classList.add('hidden');
        await loadFoodMemories();
        switchTab('food');
    } catch (error) {
        showError('Failed to upload photo. Please try again.');
    }
    
    showLoading(false);
}

function resetFoodForm() {
    selectedPhoto = null;
    document.getElementById('food-form').reset();
    document.getElementById('preview-container').classList.add('hidden');
    document.getElementById('upload-placeholder').classList.remove('hidden');
    document.getElementById('upload-btn').disabled = true;
}

function renderFoodTimeline() {
    const container = document.getElementById('food-timeline');
    
    if (foodMemories.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🍽️</div><p>No food memories yet.<br>Start capturing your meals together.</p></div>';
        return;
    }
    
    container.innerHTML = foodMemories.map((memory, index) => {
        const date = memory.createdAt ? memory.createdAt.toDate() : new Date();
        const formattedDate = formatDate(date);
        
        return `
            <div class="food-memory">
                ${index > 0 ? '<div class="photo-string"></div>' : ''}
                <div class="photo-frame" onclick="viewPhoto('${memory.id}')">
                    <img src="${memory.imageUrl}" alt="${memory.caption || 'Food memory'}" loading="lazy">
                </div>
                <div class="memory-info">
                    ${memory.caption ? `<div class="memory-caption">${memory.caption}</div>` : ''}
                    <div class="memory-date">${formattedDate}</div>
                </div>
                <button class="btn-delete-photo" onclick="deleteFood('${memory.id}')">Delete</button>
            </div>
        `;
    }).join('');
}

function viewPhoto(memoryId) {
    const memory = foodMemories.find(m => m.id === memoryId);
    if (!memory) return;
    
    const date = memory.createdAt ? memory.createdAt.toDate() : new Date();
    const formattedDate = formatDate(date);
    
    document.getElementById('viewer-image').src = memory.imageUrl;
    document.getElementById('viewer-caption').textContent = memory.caption || '';
    document.getElementById('viewer-date').textContent = formattedDate;
    document.getElementById('photo-viewer').classList.remove('hidden');
}

async function deleteFood(memoryId) {
    if (!confirm('Delete this memory?')) return;
    
    showLoading(true);
    try {
        await foodMemoriesCollection.doc(memoryId).delete();
        await loadFoodMemories();
    } catch (error) {
        showError('Failed to delete memory.');
    }
    showLoading(false);
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

// Make functions globally accessible for onclick handlers
window.deleteExpense = deleteExpense;
window.viewPhoto = viewPhoto;
window.deleteFood = deleteFood;

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}
