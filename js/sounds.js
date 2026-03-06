// ============================================
// Sound Feedback System
// ============================================

const SoundFX = (() => {
    const sounds = {};
    const SOUND_FILES = {
        tabSwitch: 'sounds/tabswitching.mp3',
        expAdded: 'sounds/expadded.mp3',
        expDel: 'sounds/expdel.mp3',
        largeMemory: 'sounds/largememories.mp3',
        memoryAdded: 'sounds/memoryadded.mp3',
        button: 'sounds/buttons.mp3'
    };

    // Preload all sounds
    function init() {
        for (const [key, src] of Object.entries(SOUND_FILES)) {
            try {
                const audio = new Audio();
                audio.preload = 'auto';
                audio.src = src;
                sounds[key] = audio;
            } catch (e) {
                // Ignore – sound will simply not play
            }
        }
    }

    // Play a sound by key. Resets playback so rapid taps don't overlap badly.
    function play(key) {
        try {
            const audio = sounds[key];
            if (!audio) return;
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Autoplay may be blocked; silently ignore
            });
        } catch (e) {
            // Sound playback is non-critical – never block UI
        }
    }

    return { init, play };
})();

// Initialise sound system as soon as the script loads
SoundFX.init();

// ---- Event-driven sound playback ----
// Sound reactions are centralized here so feature modules don't call SoundFX directly.
EventBus.on('expense:created',  () => SoundFX.play('expAdded'));
EventBus.on('expense:edited',   () => SoundFX.play('expAdded'));
EventBus.on('expense:deleted',  () => SoundFX.play('expDel'));
EventBus.on('expense:settled',  () => SoundFX.play('expAdded'));
EventBus.on('memory:created',   () => SoundFX.play('memoryAdded'));
EventBus.on('memory:viewed',    () => SoundFX.play('largeMemory'));
EventBus.on('moment:created',   () => SoundFX.play('button'));
EventBus.on('tab:switched',     () => SoundFX.play('tabSwitch'));
EventBus.on('ui:button',        () => SoundFX.play('button'));
