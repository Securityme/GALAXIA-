'use client';

import React from 'react';
import { useThemeStore } from '@/lib/themeStore';
import { useAudioStore } from '@/lib/audioStore';
import { 
  Settings, 
  X, 
  Radio, 
  Palette, 
  Volume2, 
  VolumeX, 
  Monitor, 
  Play, 
  Square, 
  Sparkles,
  Shield,
  Sliders,
  Check
} from 'lucide-react';

interface SystemConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemConfigModal: React.FC<SystemConfigModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentPreset, 
    setPreset, 
    presets, 
    scanlinesEnabled, 
    toggleScanlines, 
    radarGridEnabled, 
    toggleRadarGrid 
  } = useThemeStore();

  const {
    masterVolume,
    setMasterVolume,
    soundMuted,
    toggleSoundMute,
    radioPlaying,
    toggleRadio,
    radioStation,
    setRadioStation,
    stations,
    radioVolume,
    setRadioVolume
  } = useAudioStore();

  if (!isOpen) return null;

  return (
    <div 
      id="system-config-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div 
        id="system-config-modal-container"
        className="w-full max-w-2xl bg-slate-950/95 border border-cyan-500/40 rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.15)] overflow-hidden text-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-950 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wider text-cyan-300 uppercase">
                Configuration Système & Télémétrie
              </h2>
              <p className="text-xs text-slate-400">
                Thèmes visuels, flux Radio FIP tactique et calibration audio du cockpit
              </p>
            </div>
          </div>

          <button
            id="close-system-config-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Thèmes Visuels Cockpit */}
          <div>
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Palette & Ambiance Visuelle du Cockpit
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {presets.map((p) => {
                const isActive = currentPreset === p.id;
                return (
                  <button
                    key={p.id}
                    id={`theme-preset-${p.id}`}
                    onClick={() => setPreset(p.id)}
                    className={`p-3 rounded-lg border text-left transition-all flex items-start justify-between ${
                      isActive
                        ? 'bg-cyan-950/50 border-cyan-500 text-cyan-200 shadow-[0_0_15px_rgba(0,243,255,0.15)]'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold flex items-center gap-2">
                        {p.name}
                        {isActive && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {p.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Visual Overlays Toggles */}
            <div className="mt-3 flex flex-wrap gap-4 pt-3 border-t border-slate-800/80">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={scanlinesEnabled}
                  onChange={toggleScanlines}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-slate-900"
                />
                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                Effet Scanlines CRT
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={radarGridEnabled}
                  onChange={toggleRadarGrid}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-slate-900"
                />
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                Grille Radar Vectorielle
              </label>
            </div>
          </div>

          {/* Section 2: Radio FIP Cosmique */}
          <div className="pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4" />
                Liaison Radio FIP en Direct (Diffusion Spatialisée)
              </h3>
              <button
                id="toggle-fip-radio-btn"
                onClick={toggleRadio}
                className={`px-3 py-1 text-xs rounded-full font-bold flex items-center gap-1.5 transition-all ${
                  radioPlaying
                    ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(255,183,0,0.5)]'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {radioPlaying ? (
                  <>
                    <Square className="w-3 h-3 fill-current" /> Arrêter la Radio
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" /> Lancer Radio FIP
                  </>
                )}
              </button>
            </div>

            {/* Station selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {stations.map((st) => {
                const isSelected = radioStation.id === st.id;
                return (
                  <button
                    key={st.id}
                    id={`radio-station-${st.id}`}
                    onClick={() => setRadioStation(st)}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/60 text-amber-300'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">{st.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{st.description}</div>
                  </button>
                );
              })}
            </div>

            {/* Radio Volume Slider */}
            <div className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300 w-28">Volume Radio</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={radioVolume}
                onChange={(e) => setRadioVolume(parseFloat(e.target.value))}
                className="flex-1 accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-10 text-right">
                {Math.round(radioVolume * 100)}%
              </span>
            </div>
          </div>

          {/* Section 3: Audio Général & Effets Sonores */}
          <div className="pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              Effets Tactiques & Audio Master
            </h3>

            <div className="flex items-center justify-between gap-4 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
              <button
                id="toggle-sound-mute-btn"
                onClick={toggleSoundMute}
                className="flex items-center gap-2 px-3 py-1.5 text-xs rounded border border-slate-700 hover:bg-slate-800 text-slate-200 transition-colors"
              >
                {soundMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-red-400" /> Sons Coupés
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400" /> Sons Actifs
                  </>
                )}
              </button>

              <div className="flex-1 flex items-center gap-3">
                <span className="text-xs text-slate-400">Master</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono text-cyan-400 w-10 text-right">
                  {Math.round(masterVolume * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-900/60">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Paramètres enregistrés en temps réel dans le cockpit
          </div>
          <button
            id="close-system-config-footer-btn"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
