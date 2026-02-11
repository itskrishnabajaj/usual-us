// ============================================
// UI Utilities
// ============================================

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        const usTabActive = document.querySelector('#us-tab.active');
        if (show && usTabActive) {
            return;
        }
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

function showBalanceCelebration() {
    const celebration = document.getElementById('balance-celebration');
    if (celebration) {
        celebration.classList.remove('hidden');
        setTimeout(() => celebration.classList.add('hidden'), 3000);
    }
}

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

function showEasterEgg() {
    const easterEgg = document.getElementById('easter-egg');
    if (easterEgg) {
        easterEgg.classList.remove('hidden');
        setTimeout(() => easterEgg.classList.add('hidden'), 4000);
    }
}

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
        const success = await handleLogin(savedUserId, pin, true);
        if (!success) {
            const dotsContainer = document.querySelector('.pin-dots');
            dotsContainer.classList.add('shake');
            setTimeout(() => dotsContainer.classList.remove('shake'), 500);
            document.getElementById('returning-pin-input').value = '';
            document.querySelectorAll('.pin-dot').forEach(dot => dot.classList.remove('filled'));
        }
    });
    
    document.getElementById('switch-user-btn').addEventListener('click', () => {
        localStorage.removeItem('usual_us_user_id');
        document.getElementById('first-login-form').reset();
        document.getElementById('returning-login-form').reset();
        document.getElementById('returning-pin-input').value = '';
        document.querySelectorAll('.pin-dot').forEach(dot => dot.classList.remove('filled'));
        initializeAuth();
    });
    
    // Numeric keypad for returning user PIN
    function updatePinDots() {
        const pinInput = document.getElementById('returning-pin-input');
        const dots = document.querySelectorAll('.pin-dot');
        dots.forEach((dot, i) => {
            if (i < pinInput.value.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    document.querySelectorAll('.num-key[data-num]').forEach(key => {
        key.addEventListener('click', () => {
            const pinInput = document.getElementById('returning-pin-input');
            if (pinInput.value.length < 4) {
                pinInput.value += key.dataset.num;
                updatePinDots();
                if (pinInput.value.length === 4) {
                    document.getElementById('returning-login-form').requestSubmit();
                }
            }
        });
    });
    
    document.getElementById('num-key-del').addEventListener('click', () => {
        const pinInput = document.getElementById('returning-pin-input');
        pinInput.value = pinInput.value.slice(0, -1);
        updatePinDots();
    });
    
    // Navigation with smooth transitions
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const tab = e.currentTarget.dataset.tab;
            switchTab(tab);
        });
    });

    // Restore Us tab visibility if previously revealed this session
    if (sessionStorage.getItem('usTabRevealed') === 'true') {
        const usNavItem = document.querySelector('.nav-item[data-tab="us"]');
        if (usNavItem) usNavItem.classList.add('revealed');
    }
    
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
    
    // Scroll to oldest memory button
    document.getElementById('scroll-to-oldest-btn').addEventListener('click', () => {
        const timeline = document.getElementById('memories-timeline');
        if (timeline && timeline.lastElementChild) {
            timeline.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
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

