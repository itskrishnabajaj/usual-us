// ============================================
// Us Tab - Timeline and Features
// ============================================

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
            musicToggle.classList.add('visible');
            if (appHeader) appHeader.classList.add('us-active');
            if (bottomNav) bottomNav.classList.add('us-active');
            document.body.classList.add('us-active');
            if (appEl) appEl.classList.add('us-active');
        } else {
            musicToggle.classList.remove('visible');
            // Close music panel when leaving Us tab
            const musicPanel = document.getElementById('music-player-panel');
            if (musicPanel && musicPanel.classList.contains('active')) {
                musicPanel.classList.remove('active');
                const backdrop = document.querySelector('.music-panel-backdrop');
                if (backdrop) {
                    backdrop.classList.remove('active');
                    setTimeout(() => backdrop.remove(), 300);
                }
            }
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
        revealUsTab();
    }
}

function revealUsTab() {
    const usNavItem = document.querySelector('.nav-item[data-tab="us"]');
    if (usNavItem && !usNavItem.classList.contains('revealed')) {
        requestAnimationFrame(() => {
            usNavItem.classList.add('revealed');
        });
        sessionStorage.setItem('usTabRevealed', 'true');
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
    
    // Only create once — skip if stars already exist
    if (usHeader.querySelector('.dynamic-star')) return;
    
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
    
    // Only create once — skip if hearts already exist
    if (usTab.querySelector('.floating-heart-particle')) return;
    
    const hearts = ['💕', '💗', '✨', '💖', '🤍', '💞', '♥️'];
    
    // Stable positions and timing based on index (seeded pseudo-random)
    const heartConfigs = [
        { size: 12, left: 15, top: 20, dur: 10, delay: 0 },
        { size: 9,  left: 75, top: 45, dur: 14, delay: 1.5 },
        { size: 16, left: 40, top: 70, dur: 11, delay: 3 },
        { size: 10, left: 85, top: 15, dur: 18, delay: 0.8 },
        { size: 14, left: 25, top: 85, dur: 12, delay: 2.5 },
        { size: 11, left: 50, top: 55, dur: 9,  delay: 1 },
    ];
    
    for (let i = 0; i < heartConfigs.length; i++) {
        const cfg = heartConfigs[i];
        const heart = document.createElement('span');
        heart.className = 'floating-heart-particle';
        heart.textContent = hearts[i % hearts.length];
        heart.style.cssText = `
            position: absolute;
            font-size: ${cfg.size}px;
            left: ${cfg.left}%;
            top: ${cfg.top}%;
            opacity: 0;
            pointer-events: none;
            z-index: 0;
            animation: floatingHeartParticle ${cfg.dur}s ease-in-out ${cfg.delay}s infinite;
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
    
    const highlightIsVideo = isVideoMedia(memory, 0);
    const highlightMedia = highlightIsVideo 
        ? `<video src="${memory.images[0]}" autoplay muted loop playsinline style="width:100%;height:200px;object-fit:cover;"></video>`
        : `<img src="${memory.images[0]}" alt="Memory">`;
    
    container.innerHTML = `
        <div class="highlight-banner">
            <p class="highlight-text">✨ ${yearsAgo} ${yearsAgo === 1 ? 'year' : 'years'} ago today</p>
            <div class="highlight-preview" onclick="viewSinglePhoto('${memory.id}')">
                ${highlightMedia}
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
