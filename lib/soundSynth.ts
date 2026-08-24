// Procedural Web Audio API sound synthesizer for authentic vintage cassette player sounds
// Works entirely in-browser with zero external asset dependencies

class NostalgicSoundEngine {
  private ctx: AudioContext | null = null;
  private hissNode: AudioNode | null = null;
  private hissGain: GainNode | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.6;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.hissGain) {
      this.hissGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    }
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.hissGain && this.ctx) {
      this.hissGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume * 0.05, this.ctx.currentTime);
    }
  }

  // Mechanical Piano-key button click (crisp plastic snap + heavy metallic latch)
  public playButtonClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Plastic click burst
    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.setValueAtTime(3, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4 * this.masterVolume, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    // Mechanical clunk tone
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.06);

    gain.gain.setValueAtTime(0.35 * this.masterVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.connect(gain);
    gain.connect(ctx.destination);

    noise.start(t);
    osc.start(t);
    osc.stop(t + 0.07);
  }

  // Cassette deck door insertion clunk (heavy double latch: ka-thunk)
  public playTapeInsert() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // First slide click
    this.createMechanicalThud(ctx, t, 320, 90, 0.04, 0.25);
    // Heavy main compartment latch (ka-CHUNK)
    this.createMechanicalThud(ctx, t + 0.07, 180, 40, 0.12, 0.45);
    this.createPlasticSnap(ctx, t + 0.08, 2200, 0.03, 0.3);
  }

  // Eject spring pop and door swing
  public playTapeEject() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    // Spring pop
    this.createPlasticSnap(ctx, t, 1800, 0.05, 0.4);
    // Door opening damping sound
    this.createMechanicalThud(ctx, t + 0.03, 240, 80, 0.09, 0.35);
  }

  // Head engagement & motor spin-up (magnetic tape head engages: 'chick-hmmm')
  public playTapeStart() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    this.createPlasticSnap(ctx, t, 1200, 0.03, 0.3);
    this.createMechanicalThud(ctx, t + 0.02, 140, 50, 0.08, 0.35);

    // Motor hum up
    const motorOsc = ctx.createOscillator();
    const motorGain = ctx.createGain();
    motorOsc.type = 'sawtooth';
    motorOsc.frequency.setValueAtTime(60, t + 0.02);
    motorOsc.frequency.linearRampToValueAtTime(110, t + 0.2);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, t);

    motorGain.gain.setValueAtTime(0.001, t);
    motorGain.gain.linearRampToValueAtTime(0.06 * this.masterVolume, t + 0.05);
    motorGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    motorOsc.connect(filter);
    filter.connect(motorGain);
    motorGain.connect(ctx.destination);

    motorOsc.start(t + 0.02);
    motorOsc.stop(t + 0.26);
  }

  // Stop button snap (solenoid disengages)
  public playTapeStop() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    this.createPlasticSnap(ctx, t, 900, 0.04, 0.35);
    this.createMechanicalThud(ctx, t + 0.02, 110, 35, 0.09, 0.3);
  }

  // Fast Forward / Rewind spooling whoosh
  public playRewindWhoosh() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.45;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(2800, t + 0.2);
    filter.frequency.exponentialRampToValueAtTime(800, t + 0.45);
    filter.Q.setValueAtTime(4, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.25 * this.masterVolume, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(t);
  }

  // Small knob or switch tick
  public playSwitchClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    this.createPlasticSnap(ctx, t, 2600, 0.02, 0.2);
  }

  // Ambient Vintage Tape Hiss & subtle warm flutter
  public startTapeHiss(volume: number = 0.03) {
    if (typeof window === 'undefined') return;
    if (this.hissNode) return; // Already running

    const ctx = this.initContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    // Pink-ish tape hiss with tiny random crackles
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;

      // Occasional tape pop/crackle
      if (Math.random() < 0.0003) {
        output[i] += (Math.random() - 0.5) * 0.4;
      }
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, ctx.currentTime);

    const highPass = ctx.createBiquadFilter();
    highPass.type = 'highpass';
    highPass.frequency.setValueAtTime(350, ctx.currentTime);

    this.hissGain = ctx.createGain();
    const effectiveVol = this.isMuted ? 0 : volume * this.masterVolume;
    this.hissGain.gain.setValueAtTime(effectiveVol, ctx.currentTime);

    whiteNoise.connect(highPass);
    highPass.connect(filter);
    filter.connect(this.hissGain);
    this.hissGain.connect(ctx.destination);

    whiteNoise.start(0);
    this.hissNode = whiteNoise;
  }

  public stopTapeHiss() {
    if (this.hissNode && this.ctx && this.hissGain) {
      try {
        this.hissGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        setTimeout(() => {
          if (this.hissNode) {
            (this.hissNode as AudioBufferSourceNode).stop();
            this.hissNode.disconnect();
            this.hissNode = null;
          }
        }, 120);
      } catch {
        this.hissNode = null;
      }
    }
  }

  private createPlasticSnap(ctx: AudioContext, time: number, freq: number, duration: number, vol: number) {
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.004));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, time);
    filter.Q.setValueAtTime(5, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * this.masterVolume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(time);
  }

  private createMechanicalThud(ctx: AudioContext, time: number, startFreq: number, endFreq: number, duration: number, vol: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + duration);

    gain.gain.setValueAtTime(vol * this.masterVolume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration + 0.01);
  }
}

export const soundSynth = new NostalgicSoundEngine();
