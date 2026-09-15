class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.initialized = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.initialized = true;
  }

  setMuted(muted) {
    this.isMuted = muted;
    // Auto-init on unmute interaction
    if (!muted && !this.initialized) {
      this.init();
    }
  }

  createWhiteNoise(length = 1) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * length;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  playHover() {
    if (this.isMuted || !this.initialized || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.02);
      
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime); // Very quiet
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }

  playTab() {
    if (this.isMuted || !this.initialized || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.03);
      
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }

  playDecrypt() {
    if (this.isMuted || !this.initialized || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const playBeep = (freq, startTime, dur) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.03, startTime + 0.01);
        gain.gain.setValueAtTime(0.03, startTime + dur - 0.02);
        gain.gain.linearRampToValueAtTime(0, startTime + dur);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + dur);
      };
      
      playBeep(800, t, 0.08);
      playBeep(1200, t + 0.1, 0.12);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }

  playBoot() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    
    try {
      const t = this.ctx.currentTime;
      const playNote = (freq, startTime, dur) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.04, startTime + 0.02); // attack
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur); // fade out
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + dur);
      };

      // Classic Game "Start" / Power-up Arpeggio (C Major)
      playNote(523.25, t, 0.15);         // C5
      playNote(659.25, t + 0.08, 0.15);  // E5
      playNote(783.99, t + 0.16, 0.15);  // G5
      playNote(1046.50, t + 0.24, 0.4);  // C6 (held slightly longer)
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }
}

export const soundEngine = new RetroAudioEngine();
