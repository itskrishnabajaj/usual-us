// ============================================
// Music Player
// ============================================

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

function toggleMusicPlayer() {
    const panel = document.getElementById('music-player-panel');
    const isHidden = panel.classList.contains('hidden');
    
    if (isHidden) {
        let backdrop = document.querySelector('.music-panel-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'music-panel-backdrop';
            backdrop.addEventListener('click', toggleMusicPlayer);
            document.body.appendChild(backdrop);
        }
        panel.classList.remove('hidden');
    } else {
        const backdrop = document.querySelector('.music-panel-backdrop');
        if (backdrop) backdrop.remove();
        panel.classList.add('hidden');
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
