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
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
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
      
      // 1. Low hum
      const hum = this.ctx.createOscillator();
      const humGain = this.ctx.createGain();
      hum.type = 'sawtooth';
      hum.frequency.value = 50;
      humGain.gain.setValueAtTime(0, t);
      humGain.gain.linearRampToValueAtTime(0.05, t + 0.2);
      humGain.gain.linearRampToValueAtTime(0, t + 1.2);
      hum.connect(humGain);
      humGain.connect(this.ctx.destination);
      hum.start(t);
      hum.stop(t + 1.2);

      // 2. Crackle (white noise)
      const buffer = this.createWhiteNoise(1);
      if (buffer) {
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = buffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 2000;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0, t);
        noiseGain.gain.linearRampToValueAtTime(0.02, t + 0.1);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noiseSrc.start(t);
        noiseSrc.stop(t + 0.5);
      }

      // 3. Diagnostic beeps
      const playBeep = (f, st, dur) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'square';
        o.frequency.value = f;
        g.gain.setValueAtTime(0, st);
        g.gain.linearRampToValueAtTime(0.03, st + 0.01);
        g.gain.setValueAtTime(0.03, st + dur - 0.02);
        g.gain.linearRampToValueAtTime(0, st + dur);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(st);
        o.stop(st + dur);
      };
      
      playBeep(1200, t + 0.6, 0.1);
      playBeep(1200, t + 0.75, 0.1);
      playBeep(1600, t + 0.9, 0.2);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }
}

export const soundEngine = new RetroAudioEngine();
