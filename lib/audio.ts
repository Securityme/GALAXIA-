'use client';

export interface RadioStation {
  id: string;
  name: string;
  category: string;
  streamUrl: string;
  description: string;
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'fip_direct',
    name: 'FIP Radio Nationale (Direct)',
    category: 'Éclectique & Cosmique',
    streamUrl: 'https://icecast.radiofrance.fr/fip-midfi.mp3',
    description: 'Flux national sans interruption, sélections musicales stellaires & voyage sonore continu.'
  },
  {
    id: 'fip_electro',
    name: 'FIP Spatiale Électro',
    category: 'Synthwave & Deep Orbit',
    streamUrl: 'https://icecast.radiofrance.fr/fipelectro-midfi.mp3',
    description: 'Rythmiques électroniques pures, ambient spatiale et pulsations hypersoniques.'
  },
  {
    id: 'fip_groove',
    name: 'FIP Groove Cosmique',
    category: 'Funk & Soul Sub-Luminique',
    streamUrl: 'https://icecast.radiofrance.fr/fipgroove-midfi.mp3',
    description: 'Sons chauds, résonances analogiques et vibes décontractées pour le salon des officiers.'
  },
  {
    id: 'fip_jazz',
    name: 'FIP Jazz Astral',
    category: 'Nocturne & Saxophone Stellaire',
    streamUrl: 'https://icecast.radiofrance.fr/fipjazz-midfi.mp3',
    description: 'Harmonies complexes, impros feutrées et contemplation des nébuleuses.'
  }
];

class TacticalAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.7;
  private sfxVolume: number = 0.8;
  private radioVolume: number = 0.6;
  private ambientGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private isAmbientPlaying: boolean = false;
  
  // Radio streaming via native HTMLAudioElement
  private radioAudio: HTMLAudioElement | null = null;
  private currentStationId: string = 'fip_direct';
  private isRadioPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('galaxia_audio_muted');
      this.isMuted = savedMute === 'true';
      const savedVol = localStorage.getItem('galaxia_audio_vol');
      if (savedVol) {
        this.masterVolume = parseFloat(savedVol);
      }
      const savedRadioVol = localStorage.getItem('galaxia_radio_vol');
      if (savedRadioVol) {
        this.radioVolume = parseFloat(savedRadioVol);
      }
      const savedStation = localStorage.getItem('galaxia_radio_station');
      if (savedStation) {
        this.currentStationId = savedStation;
      }
    }
  }

  private initRadioElement() {
    if (typeof window === 'undefined') return;
    if (!this.radioAudio) {
      this.radioAudio = new Audio();
      this.radioAudio.preload = 'none';
      this.radioAudio.crossOrigin = 'anonymous';
      const station = RADIO_STATIONS.find(s => s.id === this.currentStationId) || RADIO_STATIONS[0];
      this.radioAudio.src = station.streamUrl;
      this.radioAudio.volume = this.isMuted ? 0 : this.masterVolume * this.radioVolume;

      this.radioAudio.addEventListener('error', (e) => {
        console.warn('Radio stream warning / network policy:', e);
      });
    }
  }

  public setStation(stationId: string) {
    this.currentStationId = stationId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('galaxia_radio_station', stationId);
    }
    const station = RADIO_STATIONS.find(s => s.id === stationId);
    if (!station) return;

    if (this.radioAudio) {
      const wasPlaying = this.isRadioPlaying;
      this.radioAudio.src = station.streamUrl;
      this.radioAudio.volume = this.isMuted ? 0 : this.masterVolume * this.radioVolume;
      if (wasPlaying) {
        this.radioAudio.play().catch(() => {});
      }
    }
  }

  public getCurrentStationId(): string {
    return this.currentStationId;
  }

  public toggleRadio(): boolean {
    if (this.isRadioPlaying) {
      this.stopRadio();
      return false;
    } else {
      this.startRadio();
      return true;
    }
  }

  public startRadio() {
    this.initRadioElement();
    if (!this.radioAudio) return;
    this.radioAudio.volume = this.isMuted ? 0 : this.masterVolume * this.radioVolume;
    this.radioAudio.play()
      .then(() => {
        this.isRadioPlaying = true;
      })
      .catch((err) => {
        console.warn('Radio autoplay blocked by browser user gesture policy:', err);
        this.isRadioPlaying = false;
      });
  }

  public stopRadio() {
    if (this.radioAudio) {
      this.radioAudio.pause();
    }
    this.isRadioPlaying = false;
  }

  public getIsRadioPlaying(): boolean {
    return this.isRadioPlaying;
  }

  public setRadioVolume(vol: number) {
    this.radioVolume = Math.max(0, Math.min(1, vol));
    if (typeof window !== 'undefined') {
      localStorage.setItem('galaxia_radio_vol', String(this.radioVolume));
    }
    if (this.radioAudio) {
      this.radioAudio.volume = this.isMuted ? 0 : this.masterVolume * this.radioVolume;
    }
  }

  public getRadioVolume(): number {
    return this.radioVolume;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (typeof window !== 'undefined') {
      localStorage.setItem('galaxia_audio_vol', String(this.masterVolume));
    }
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05 * this.masterVolume, this.ctx.currentTime);
    }
    if (this.radioAudio) {
      this.radioAudio.volume = this.isMuted ? 0 : this.masterVolume * this.radioVolume;
    }
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('galaxia_audio_muted', String(this.isMuted));
    }
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05 * this.masterVolume, this.ctx.currentTime);
    }
    if (this.radioAudio) {
      this.radioAudio.volume = this.isMuted ? 0 : this.masterVolume * this.radioVolume;
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Ambient Deep Space & Ship Core Drone
  public toggleAmbient(): boolean {
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  public startAmbient() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || this.isAmbientPlaying) return;

      const now = this.ctx.currentTime;
      // Dual detuned sub-bass oscillators for warm sci-fi ship hum
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc1.type = 'sawtooth';
      this.ambientOsc1.frequency.setValueAtTime(55, now); // A1 note
      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(55.6, now); // Slight detune for pulsing drone

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, now); // Deep muffled engine resonance

      this.ambientGain.gain.setValueAtTime(0, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.04 * this.masterVolume, now + 1.5);

      this.ambientOsc1.connect(filter);
      this.ambientOsc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start(now);
      this.ambientOsc2.start(now);
      this.isAmbientPlaying = true;
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopAmbient() {
    if (!this.isAmbientPlaying || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.ambientGain) {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
      }
      setTimeout(() => {
        try {
          this.ambientOsc1?.stop();
          this.ambientOsc2?.stop();
          this.ambientOsc1?.disconnect();
          this.ambientOsc2?.disconnect();
        } catch {}
        this.isAmbientPlaying = false;
      }, 500);
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  public getIsAmbientPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  // Tactical click / beep
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08 * this.masterVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {}
  }

  // Confirmation / Tech Unlock Fanfare
  public playTechUnlock() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.12 * this.masterVolume, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch {}
  }

  // Construction Servo / Fabrication sound
  public playConstruct() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(440, now + 0.1);
      osc.frequency.linearRampToValueAtTime(330, now + 0.2);

      gain.gain.setValueAtTime(0.07 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  // Phase sequencing transition chime
  public playPhaseTransition() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.18);

      gain.gain.setValueAtTime(0.1 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  // Turn advance sweep
  public playTurnAdvance() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.3);

      gain.gain.setValueAtTime(0.09 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  // Alert / Warning Klaxon
  public playAlert() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.15);
      osc.frequency.linearRampToValueAtTime(400, now + 0.3);

      gain.gain.setValueAtTime(0.1 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  // Warp Jump / FTL Rumble
  public playWarpJump() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.7);

      gain.gain.setValueAtTime(0.15 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.75);
    } catch {}
  }
}

export const soundFx = new TacticalAudioEngine();
