'use client';

import { create } from 'zustand';
import { soundFx, RADIO_STATIONS, RadioStation } from './audio';

export interface AudioState {
  isMuted: boolean;
  soundMuted: boolean;
  volume: number; // 0 to 1
  masterVolume: number;
  radioVolume: number;
  sfxVolume: number;
  isAmbientPlaying: boolean;
  isRadioPlaying: boolean;
  radioPlaying: boolean;
  currentStationId: string;
  radioStation: RadioStation;
  stations: RadioStation[];
  toggleMute: () => void;
  toggleSoundMute: () => void;
  setVolume: (vol: number) => void;
  setMasterVolume: (vol: number) => void;
  setRadioVolume: (vol: number) => void;
  setSfxVolume: (vol: number) => void;
  toggleAmbient: () => void;
  toggleRadio: () => void;
  setStation: (stationId: string) => void;
  setRadioStation: (station: RadioStation | string) => void;
  initAudio: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  isMuted: false,
  soundMuted: false,
  volume: 0.7,
  masterVolume: 0.7,
  radioVolume: 0.6,
  sfxVolume: 0.8,
  isAmbientPlaying: false,
  isRadioPlaying: false,
  radioPlaying: false,
  currentStationId: 'fip_direct',
  radioStation: RADIO_STATIONS[0],
  stations: RADIO_STATIONS,

  toggleMute: () => {
    const muted = soundFx.toggleMute();
    set({ isMuted: muted, soundMuted: muted });
  },

  toggleSoundMute: () => {
    get().toggleMute();
  },

  setVolume: (vol: number) => {
    soundFx.setMasterVolume(vol);
    set({ volume: vol, masterVolume: vol });
  },

  setMasterVolume: (vol: number) => {
    get().setVolume(vol);
  },

  setRadioVolume: (vol: number) => {
    soundFx.setRadioVolume(vol);
    set({ radioVolume: vol });
  },

  setSfxVolume: (vol: number) => {
    soundFx.setSfxVolume(vol);
    set({ sfxVolume: vol });
  },

  toggleAmbient: () => {
    const playing = soundFx.toggleAmbient();
    set({ isAmbientPlaying: playing });
  },

  toggleRadio: () => {
    const playing = soundFx.toggleRadio();
    set({ isRadioPlaying: playing, radioPlaying: playing });
  },

  setStation: (stationId: string) => {
    soundFx.setStation(stationId);
    const station = RADIO_STATIONS.find(s => s.id === stationId) || RADIO_STATIONS[0];
    set({ currentStationId: stationId, radioStation: station });
  },

  setRadioStation: (stationOrId: RadioStation | string) => {
    const stationId = typeof stationOrId === 'string' ? stationOrId : stationOrId.id;
    get().setStation(stationId);
  },

  initAudio: () => {
    const isMuted = soundFx.getIsMuted();
    const volume = soundFx.getMasterVolume();
    const isRadioPlaying = soundFx.getIsRadioPlaying();
    const currentStationId = soundFx.getCurrentStationId();
    const radioStation = RADIO_STATIONS.find(s => s.id === currentStationId) || RADIO_STATIONS[0];

    set({
      isMuted,
      soundMuted: isMuted,
      volume,
      masterVolume: volume,
      radioVolume: soundFx.getRadioVolume(),
      sfxVolume: soundFx.getSfxVolume(),
      isAmbientPlaying: soundFx.getIsAmbientPlaying(),
      isRadioPlaying,
      radioPlaying: isRadioPlaying,
      currentStationId,
      radioStation
    });
  }
}));
