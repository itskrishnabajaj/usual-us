// ============================================
// Music Player
// ============================================

const MUSIC_FADE_IN_DURATION_MS = 4000;
const MUSIC_FADE_IN_STEPS = 40;
const MUSIC_TARGET_VOLUME = 1.0;

function initializeMusicPlayer() {
    musicPlayer = document.getElementById('music-player');
    const songList = document.getElementById('song-list');
    
    if (!musicPlayer || !songList) {
        console.error('❌ Music player elements not found');
        return;
    }
    
    songList.innerHTML = PLAYLIST.map((song, index) => {
        const safeTitle = song.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<div class="song-item" data-index="${index}">
            <span class="song-item-number">${index + 1}</span>
            <span class="song-item-title">${safeTitle}</span>
        </div>`;
    }).join('');
    
    songList.addEventListener('click', (e) => {
        const songItem = e.target.closest('.song-item');
        if (!songItem) return;
        const index = parseInt(songItem.dataset.index);
        if (!isNaN(index)) selectSong(index);
    });
    
    console.log('✅ Music player initialized with', PLAYLIST.length, 'songs');
    
    musicPlayer.addEventListener('timeupdate', updateSeekBar);
    musicPlayer.addEventListener('loadedmetadata', () => {
        document.getElementById('duration').textContent = formatTime(musicPlayer.duration);
    });
    musicPlayer.addEventListener('ended', () => {
        document.getElementById('play-pause-btn').textContent = '▶';
        // Auto-advance to next random song
        playRandomSong(true);
    });
    
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

function playRandomSong(forcePlay) {
    if (!musicPlayer || PLAYLIST.length === 0) return;
    
    // If already playing, don't restart (unless forced e.g. after song ends)
    if (!forcePlay && !musicPlayer.paused && currentSongIdx >= 0) return;
    
    // Pick a random index different from current if possible
    let idx = Math.floor(Math.random() * PLAYLIST.length);
    if (PLAYLIST.length > 1 && idx === currentSongIdx) {
        idx = (idx + 1) % PLAYLIST.length;
    }
    
    selectSong(idx);
    musicPlayer.play().then(() => {
        document.getElementById('play-pause-btn').textContent = '⏸';
        addToRecentlyPlayed(idx);
    }).catch(err => {
        console.warn('Auto-play blocked by browser:', err.message);
    });
}

function playRandomSongWithFadeIn() {
    if (!musicPlayer || PLAYLIST.length === 0) return;
    if (!musicPlayer.paused && currentSongIdx >= 0) return;

    cancelMusicFade();

    let idx = Math.floor(Math.random() * PLAYLIST.length);
    if (PLAYLIST.length > 1 && idx === currentSongIdx) {
        idx = (idx + 1) % PLAYLIST.length;
    }

    selectSong(idx);
    musicPlayer.volume = 0;
    musicPlayer.play().then(() => {
        document.getElementById('play-pause-btn').textContent = '⏸';
        addToRecentlyPlayed(idx);

        const stepInterval = MUSIC_FADE_IN_DURATION_MS / MUSIC_FADE_IN_STEPS;
        const volumeStep = MUSIC_TARGET_VOLUME / MUSIC_FADE_IN_STEPS;
        let currentStep = 0;

        // Store interval ID locally so we can verify it hasn't been replaced
        const intervalId = setInterval(() => {
            currentStep++;
            if (currentStep >= MUSIC_FADE_IN_STEPS || !musicPlayer || musicPlayer.paused) {
                if (musicPlayer) musicPlayer.volume = MUSIC_TARGET_VOLUME;
                clearInterval(intervalId);
                // Only null out the global if it still points to this interval
                if (musicFadeInterval === intervalId) musicFadeInterval = null;
                return;
            }
            musicPlayer.volume = Math.min(volumeStep * currentStep, MUSIC_TARGET_VOLUME);
        }, stepInterval);
        musicFadeInterval = intervalId;
    }).catch(err => {
        console.warn('Auto-play blocked by browser:', err.message);
        musicPlayer.volume = MUSIC_TARGET_VOLUME;
    });
}

function cancelMusicFade() {
    if (musicFadeInterval) {
        clearInterval(musicFadeInterval);
        musicFadeInterval = null;
    }
    if (musicPlayer) {
        musicPlayer.volume = MUSIC_TARGET_VOLUME;
    }
}

function selectSong(index) {
    if (index < 0 || index >= PLAYLIST.length) return;
    
    currentSongIdx = index;
    
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

function removeMusicBackdrop() {
    // Remove ALL music-panel-backdrop elements to prevent orphaned nodes
    document.querySelectorAll('.music-panel-backdrop').forEach(el => el.remove());
}

function toggleMusicPlayer() {
    const panel = document.getElementById('music-player-panel');
    const isOpen = panel.classList.contains('active');
    
    if (!isOpen) {
        // Clean up any stale backdrops before creating a new one
        removeMusicBackdrop();
        const backdrop = document.createElement('div');
        backdrop.className = 'music-panel-backdrop';
        backdrop.addEventListener('click', toggleMusicPlayer);
        document.body.appendChild(backdrop);
        // Force reflow before adding active class so the transition animates
        void backdrop.offsetWidth;
        backdrop.classList.add('active');
        panel.classList.add('active');
    } else {
        const backdrop = document.querySelector('.music-panel-backdrop');
        if (backdrop) {
            backdrop.classList.remove('active');
            setTimeout(() => removeMusicBackdrop(), 300);
        }
        panel.classList.remove('active');
    }
}

function togglePlayPause() {
    if (musicPlayer.paused) {
        musicPlayer.play();
        document.getElementById('play-pause-btn').textContent = '⏸';
        
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

function addToRecentlyPlayed(songIndex) {
    recentlyPlayed = recentlyPlayed.filter(idx => idx !== songIndex);
    recentlyPlayed.unshift(songIndex);
    
    if (recentlyPlayed.length > 3) {
        recentlyPlayed = recentlyPlayed.slice(0, 3);
    }
    
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
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

window.playRecentSong = function(index) {
    selectSong(index);
    togglePlayPause();
};
