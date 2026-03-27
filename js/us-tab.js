// ============================================
// Us Tab - Timeline and Features
// ============================================

const MUSIC_AUTOPLAY_DELAY_MS = 12000;

// Cached DOM references for frequently accessed elements (avoids repeated queries)
let _cachedNavItems = null;
let _cachedTabContents = null;
let _cachedMusicToggle = null;
let _cachedAppHeader = null;
let _cachedBottomNav = null;
let _cachedAppEl = null;

function getCachedElements() {
    if (!_cachedNavItems) {
        _cachedNavItems = document.querySelectorAll('.nav-item');
        _cachedTabContents = document.querySelectorAll('.tab-content');
        _cachedMusicToggle = document.getElementById('music-player-toggle');
        _cachedAppHeader = document.getElementById('app-header');
        _cachedBottomNav = document.getElementById('bottom-nav');
        _cachedAppEl = document.getElementById('app');
    }
    return {
        navItems: _cachedNavItems,
        tabContents: _cachedTabContents,
        musicToggle: _cachedMusicToggle,
        appHeader: _cachedAppHeader,
        bottomNav: _cachedBottomNav,
        appEl: _cachedAppEl
    };
}

// Track last rendered milestones day to avoid unnecessary rebuilds
let _lastMilestonesDay = -1;

let _pullToRefreshSetup = false;
let _ptrRefreshing = false;

function setupPullToRefresh() {
    if (_pullToRefreshSetup) return;
    const usTab = document.getElementById('us-tab');
    const indicator = document.getElementById('ptr-indicator');
    if (!usTab || !indicator) return;
    _pullToRefreshSetup = true;

    const spinner = indicator.firstElementChild;
    const THRESHOLD = 80;      // px to trigger refresh
    const MAX_PULL = 130;      // visual cap for elastic feel
    let startY = 0;
    let pullDistance = 0;
    let pulling = false;

    function isAtTop() {
        const scrollEl = document.scrollingElement || document.documentElement;
        return scrollEl.scrollTop <= 0;
    }

    usTab.addEventListener('touchstart', (e) => {
        if (_ptrRefreshing) return;
        if (isAtTop()) {
            startY = e.touches[0].pageY;
            pullDistance = 0;
            pulling = true;
            // Remove transition during drag for immediate response
            indicator.style.transition = 'none';
        }
    }, { passive: true });

    usTab.addEventListener('touchmove', (e) => {
        if (!pulling || _ptrRefreshing) return;
        // Cancel if user scrolled away from top
        if (!isAtTop()) {
            pulling = false;
            pullDistance = 0;
            indicator.style.transition = '';
            indicator.style.height = '';
            indicator.classList.remove('pulling');
            return;
        }
        const diff = e.touches[0].pageY - startY;
        if (diff <= 0) {
            // Scrolling up — reset
            pullDistance = 0;
            indicator.style.height = '';
            indicator.classList.remove('pulling');
            return;
        }
        // Elastic damping — decelerates as you pull further
        pullDistance = Math.min(diff, MAX_PULL);
        // Quadratic resistance: factor of 3 keeps damping gentle (higher = less resistance)
        const damped = pullDistance * (1 - pullDistance / (MAX_PULL * 3));
        const height = damped * 0.6;
        indicator.style.height = height + 'px';
        indicator.classList.add('pulling');
        // Rotate spinner proportionally to pull distance
        if (spinner) {
            const rotation = (pullDistance / MAX_PULL) * 360;
            const scale = Math.min(pullDistance / THRESHOLD, 1);
            spinner.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        }
    }, { passive: true });

    usTab.addEventListener('touchend', async () => {
        if (!pulling || _ptrRefreshing) { pulling = false; return; }
        // Re-enable transition for smooth snap-back
        indicator.style.transition = '';
        const reachedThreshold = pullDistance >= THRESHOLD;

        if (reachedThreshold) {
            await triggerPtrRefresh(indicator, spinner);
        } else {
            resetPtrIndicator(indicator, spinner);
        }
        pulling = false;
        pullDistance = 0;
    });
}

function resetPtrIndicator(indicator, spinner) {
    indicator.classList.remove('pulling', 'refreshing');
    indicator.classList.add('completing');
    if (spinner) spinner.style.transform = '';
    setTimeout(() => {
        indicator.style.height = '';
        indicator.classList.remove('completing');
    }, 300);
}

async function triggerPtrRefresh(indicator, spinner) {
    _ptrRefreshing = true;
    indicator.classList.remove('pulling');
    indicator.classList.add('refreshing');
    indicator.style.height = '48px';
    if (spinner) spinner.style.transform = '';

    try {
        await refreshUsTab();
    } finally {
        resetPtrIndicator(indicator, spinner);
        _ptrRefreshing = false;
    }
}

async function refreshUsTab() {
    console.log('🔄 Refreshing Us tab...');
    // Notify listeners (extensibility hook for future modules)
    EventBus.emit('us:refresh');
    await Promise.allSettled([
        loadMemories(),
        loadNotes(),
        loadSecretNotes(),
        updateLastSeen()
    ]);
}

function switchTab(tabName) {
    // Emit navigation event so other modules can react
    EventBus.emit('tab:switched', { tab: tabName });

    // Cancel any pending music delay timer and active fade-in when switching tabs
    if (musicDelayTimer) {
        clearTimeout(musicDelayTimer);
        musicDelayTimer = null;
    }
    cancelMusicFade();

    // Smooth fade-out then swap — GSAP enhanced with CSS fallback
    const currentActive = document.querySelector('.tab-content.active');
    const newTab = document.getElementById(`${tabName}-tab`);

    function doSwap() {
        const els = getCachedElements();
        els.navItems.forEach(item => item.classList.remove('active'));
        const activeNavItem = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeNavItem) activeNavItem.classList.add('active');
        
        els.tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.opacity = '';
            content.style.transform = '';
        });
        
        if (newTab) {
            newTab.classList.add('active');
            // Clear inline styles so CSS animation takes over
            newTab.style.opacity = '';
            newTab.style.transform = '';
        }
    }

    if (typeof animateTabSwitch === 'function') {
        animateTabSwitch(currentActive, newTab, doSwap);
    } else {
        requestAnimationFrame(() => { setTimeout(doSwap, 100); });
    }
    
    // Show/hide music player toggle - only visible on Us tab
    const { musicToggle, appHeader, bottomNav, appEl } = getCachedElements();
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
            }
            // Always clean up any stale music backdrops on tab leave
            if (typeof removeMusicBackdrop === 'function') removeMusicBackdrop();
            
            // Disconnect timeline video observer when leaving Us tab
            if (typeof timelineVideoObserver !== 'undefined' && timelineVideoObserver) {
                timelineVideoObserver.disconnect();
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
    
    // Music player: delayed auto-play on Us tab, pause on leave
    if (tabName === 'us') {
        if (musicWasPlaying && musicPlayer && musicPlayer.paused) {
            // Resume immediately if user was already listening
            musicPlayer.play().catch(() => {});
        } else if (musicPlayer && musicPlayer.paused) {
            musicDelayTimer = setTimeout(() => {
                musicDelayTimer = null;
                // Only play if still on Us tab
                const stillOnUs = document.querySelector('.nav-item[data-tab="us"].active');
                if (stillOnUs && musicPlayer && musicPlayer.paused) {
                    playRandomSongWithFadeIn();
                }
            }, MUSIC_AUTOPLAY_DELAY_MS);
        }
        initializeUsTab();
    } else {
        if (musicPlayer) {
            musicWasPlaying = !musicPlayer.paused;
            if (!musicPlayer.paused) {
                musicPlayer.pause();
            }
        }
    }
    
    if (tabName === 'stats') {
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

function initializeUsTab() {
    const days = getDaysTogether();
    document.getElementById('us-day-counter').textContent = `Day ${days} of us`;
    document.getElementById('ritual-quote').textContent = getDailyQuote();
    
    const { appHeader, bottomNav, appEl } = getCachedElements();
    const usTab = document.getElementById('us-tab');
    const lateNight = isLateNight();
    
    if (usTab) usTab.classList.toggle('late-night', lateNight);
    if (appHeader) {
        appHeader.classList.add('us-active');
        appHeader.classList.toggle('late-night', lateNight);
    }
    if (bottomNav) {
        bottomNav.classList.add('us-active');
        bottomNav.classList.toggle('late-night', lateNight);
    }
    document.body.classList.add('us-active');
    document.body.classList.toggle('late-night', lateNight);
    if (appEl) {
        appEl.classList.add('us-active');
        appEl.classList.toggle('late-night', lateNight);
    }
    const lateNightMsg = document.getElementById('late-night-message');
    if (lateNightMsg) lateNightMsg.classList.toggle('hidden', !lateNight);
    
    // Check for memory highlights & daily reminder
    checkMemoryHighlights();
    checkDailyMemoryReminder();
    
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
    
    // Only create once — skip if particles already exist
    if (usTab.querySelector('.floating-heart-particle') || usTab.querySelector('.memory-particle')) return;
    
    // Phase 1: Diverse memory-icon particles (hearts, sparkles, music, photos)
    // Limited to 4 for mobile performance (was 6)
    const particles = ['💕', '✨', '🎵', '📸', '💗', '🤍', '💖', '♪', '🌸', '💞'];
    
    const heartConfigs = [
        { size: 12, left: 15, top: 20, dur: 10, delay: 0 },
        { size: 9,  left: 75, top: 45, dur: 14, delay: 1.5 },
        { size: 16, left: 40, top: 70, dur: 11, delay: 3 },
        { size: 10, left: 85, top: 15, dur: 18, delay: 0.8 },
    ];
    
    for (let i = 0; i < heartConfigs.length; i++) {
        const cfg = heartConfigs[i];
        const heart = document.createElement('span');
        heart.className = 'floating-heart-particle';
        heart.textContent = particles[i % particles.length];
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
    
    // Phase 1: Slow-drifting memory particles — limited to 5 for mobile (was 8)
    const driftIcons = ['♥', '✦', '♫', '📷', '✧'];
    const driftConfigs = [
        { size: 10, left: 5,  top: 35, dur: 22, delay: 2 },
        { size: 8,  left: 92, top: 60, dur: 26, delay: 5 },
        { size: 11, left: 60, top: 10, dur: 20, delay: 0 },
        { size: 9,  left: 30, top: 50, dur: 28, delay: 8 },
        { size: 7,  left: 70, top: 80, dur: 24, delay: 3 },
    ];
    for (let i = 0; i < driftConfigs.length; i++) {
        const cfg = driftConfigs[i];
        const el = document.createElement('span');
        el.className = 'memory-particle';
        el.textContent = driftIcons[i];
        el.style.cssText = `
            font-size: ${cfg.size}px;
            left: ${cfg.left}%;
            top: ${cfg.top}%;
            animation: memoryParticleDrift ${cfg.dur}s ease-in-out ${cfg.delay}s infinite;
        `;
        usTab.appendChild(el);
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

    // Skip rebuild if milestones were already rendered for the same day count
    if (_lastMilestonesDay === days) return;
    _lastMilestonesDay = days;
    
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
        try {
            const memDate = memory.memoryDate.toDate ? memory.memoryDate.toDate() : new Date(memory.memoryDate);
            return memDate.getMonth() === todayMonth && 
                   memDate.getDate() === todayDay &&
                   memDate.getFullYear() < todayYear;
        } catch (e) {
            return false;
        }
    });
    
    if (highlights.length > 0) {
        const memory = highlights[0];
        const memDate = memory.memoryDate.toDate ? memory.memoryDate.toDate() : new Date(memory.memoryDate);
        const yearsAgo = todayYear - memDate.getFullYear();
        showMemoryHighlight(memory, yearsAgo);
    } else {
        const container = document.getElementById('memory-highlight');
        if (container) container.classList.add('hidden');
    }
}

function showMemoryHighlight(memory, yearsAgo) {
    const container = document.getElementById('memory-highlight');
    if (!container) return;
    
    const highlightIsVideo = isVideoMedia(memory, 0);
    const highlightMedia = highlightIsVideo 
        ? `<video src="${memory.images[0]}" autoplay muted loop playsinline preload="auto" style="width:100%;height:200px;object-fit:cover;"></video>`
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
        try {
            const memDate = m.memoryDate.toDate ? m.memoryDate.toDate() : new Date(m.memoryDate);
            return memDate.toDateString() === today;
        } catch (e) {
            return false;
        }
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

// Phase 5: Moment creation sparkle feedback
function showMomentCreatedSparkles() {
    const container = document.createElement('div');
    container.className = 'moment-sparkle-burst';
    const sparks = ['✨', '💖', '✦', '💕', '⭐', '✧', '🌟', '💗'];
    for (let i = 0; i < sparks.length; i++) {
        const s = document.createElement('span');
        s.textContent = sparks[i];
        const angle = (i / sparks.length) * 2 * Math.PI;
        const dist = 40 + Math.random() * 40;
        s.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
        s.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
        s.style.animationDelay = (i * 0.03) + 's';
        container.appendChild(s);
    }
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 500);
}

EventBus.on('moment:created', showMomentCreatedSparkles);

// NEW: Mood Tracker
