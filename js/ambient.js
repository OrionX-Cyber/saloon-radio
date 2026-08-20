/**
 * Deluxe Saloon — Web Audio Ambient Engine
 * Synthesizes FM Radio tuning static, Barber scissors snip,
 * Tamil Filter Coffee tumbler clink, and Street ambience.
 */

(function () {
  class AmbientEngine {
    constructor() {
      this.audioCtx = null;
      this.staticGain = null;
      this.scissorsLoop = null;
      this.coffeeLoop = null;
      this.streetLoop = null;

      this.isScissorsActive = false;
      this.isCoffeeActive = false;
      this.isStreetActive = false;
    }

    initContext() {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.audioCtx = new AudioCtx();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    /**
     * Play realistic FM Radio static burst when switching stations/tracks
     */
    playRadioStatic(duration = 0.4) {
      try {
        this.initContext();
        if (!this.audioCtx) return;

        const bufferSize = this.audioCtx.sampleRate * duration;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = buffer.getChannelData(0);

        // Pink/White noise blend for radio static
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2 + white * 0.23) * 0.12;
        }

        const whiteNoise = this.audioCtx.createBufferSource();
        whiteNoise.buffer = buffer;

        // Bandpass filter to sound like analog FM dial
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
        filter.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);

        whiteNoise.start();
        whiteNoise.stop(this.audioCtx.currentTime + duration);
      } catch (e) {
        console.warn('Radio static audio error:', e);
      }
    }

    /**
     * Synthesize a crisp Barber Scissors Snip ("snip-snip")
     */
    playScissorsSnip() {
      try {
        this.initContext();
        if (!this.audioCtx) return;

        const now = this.audioCtx.currentTime;

        // Double snip timing
        [0, 0.12].forEach(delay => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const filter = this.audioCtx.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(3200, now + delay);
          osc.frequency.exponentialRampToValueAtTime(800, now + delay + 0.05);

          filter.type = 'highpass';
          filter.frequency.setValueAtTime(2000, now + delay);

          gain.gain.setValueAtTime(0.18, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now + delay);
          osc.stop(now + delay + 0.06);
        });
      } catch (e) {
        console.warn('Scissors snip error:', e);
      }
    }

    /**
     * Synthesize Tamil Filter Coffee glass clink & pour sound
     */
    playCoffeeClink() {
      try {
        this.initContext();
        if (!this.audioCtx) return;

        const now = this.audioCtx.currentTime;

        // Glass tumbler resonance
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(2450, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.3);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      } catch (e) {
        console.warn('Coffee clink error:', e);
      }
    }

    toggleScissorsLoop(enable) {
      this.isScissorsActive = enable;
      if (enable) {
        this.playScissorsSnip();
        if (!this.scissorsInterval) {
          this.scissorsInterval = setInterval(() => {
            if (this.isScissorsActive) this.playScissorsSnip();
          }, 3500);
        }
      } else {
        if (this.scissorsInterval) {
          clearInterval(this.scissorsInterval);
          this.scissorsInterval = null;
        }
      }
    }

    toggleCoffeeLoop(enable) {
      this.isCoffeeActive = enable;
      if (enable) {
        this.playCoffeeClink();
        if (!this.coffeeInterval) {
          this.coffeeInterval = setInterval(() => {
            if (this.isCoffeeActive) this.playCoffeeClink();
          }, 5000);
        }
      } else {
        if (this.coffeeInterval) {
          clearInterval(this.coffeeInterval);
          this.coffeeInterval = null;
        }
      }
    }
  }

  window.ambientEngine = new AmbientEngine();
})();
