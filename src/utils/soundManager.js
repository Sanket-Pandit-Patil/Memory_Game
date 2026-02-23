/**
 * Simple Sound Manager for preloading and playing game audio.
 */
class SoundManager {
    constructor() {
        this.sounds = {};
        this.isMuted = false;
        this.isInitialized = false;
    }

    /**
     * Preload sounds. Note: Some browsers require interaction before playing.
     */
    init() {
        if (this.isInitialized) return;

        this.sounds = {
            flip: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'), // Short click
            match: new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'), // Pleasant chime
            mismatch: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'), // Subtle thud
            win: new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'), // Success fanfare
            fail: new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3'), // Out of time/moves
        };

        // Pre-config
        Object.values(this.sounds).forEach(audio => {
            audio.volume = 0.3;
        });

        this.isInitialized = true;
    }

    play(soundName) {
        if (this.isMuted || !this.sounds[soundName]) return;

        const audio = this.sounds[soundName];
        audio.currentTime = 0;
        audio.play().catch(e => console.warn('Audio play blocked until user interaction'));
    }

    setMute(mute) {
        this.isMuted = mute;
    }
}

export const soundManager = new SoundManager();
