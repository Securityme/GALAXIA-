'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UniverseTelemetry } from './UniverseTelemetry';
import { DecisionEngine } from './DecisionEngine';
import { EventLogRegistry } from './EventLogRegistry';
import { TechTreeMatrix } from '@/features/tech/components/TechTreeMatrix';
import { CouncilDossierModal } from '@/components/ui/CouncilDossierModal';
import { SystemConfigModal } from '@/components/ui/SystemConfigModal';
import { TurnLogModal } from './TurnLogModal';
import { useGameStore } from '../store/gameStore';
import { soundFx } from '@/lib/audio';
import { CouncilPoleId } from '@/types/config';
import { 
  Terminal, 
  Layers, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  Save, 
  FileCode,
  ShieldAlert,
  Flame,
  HelpCircle,
  FlaskConical,
  Users,
  ArrowLeftRight,
  ExternalLink,
  Settings,
  History,
  Activity,
  Globe,
  Radio
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TacticalTooltip } from '@/components/ui/Tooltip';

export const DualWindowLayout: React.FC = () => {
  const [window2Tab, setWindow2Tab] = useState<'decision' | 'tech' | 'logs'>('decision');
  // Single active view at a time (no dual view)
  const [layoutMode, setLayoutMode] = useState<'win1' | 'win2'>('win1');
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showTurnLogModal, setShowTurnLogModal] = useState(false);
  const [inspectingDossier, setInspectingDossier] = useState<{
    isOpen: boolean;
    poleId?: CouncilPoleId;
    isLeader?: boolean;
  }>({ isOpen: false });

  const { resources, saveName, eraId, unlockedTechs, leader } = useGameStore();

  const handleSwitchWindows = () => {
    soundFx.playClick();
    setLayoutMode(prev => (prev === 'win1' ? 'win2' : 'win1'));
  };

  return (
    <div className="flex-1 flex flex-col p-2.5 sm:p-4 lg:p-6 max-w-[1600px] w-full mx-auto space-y-4 pb-28 md:pb-20">
      
      {/* Top Cockpit Operational Bar (Ergonomique Mobile & Safari) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 sm:px-4 py-2 rounded-lg bg-[#070c1e]/90 border border-purple-500/25 font-mono text-xs shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md">
        
        {/* Left: Save name, Era, Admiral dossier trigger */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(0,255,136,0.8)]" />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-cyan-300 to-rose-300 uppercase tracking-wider text-xs">
              {saveName}
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 text-[11px]">
            ÉPOQUE : <strong className="text-slate-200">{eraId.toUpperCase()}</strong>
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          
          <button
            onClick={() => {
              soundFx.playClick();
              setInspectingDossier({ isOpen: true, isLeader: true });
            }}
            className="text-purple-300 hover:text-cyan-200 hover:underline flex items-center gap-1 font-bold min-h-[36px]"
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>AMIRAL &amp; CONSEIL</span>
          </button>
        </div>

        {/* Right: Quick shortcuts & window indicator */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Active Window Mode Indicator Pill */}
          <div className="flex items-center bg-[#050914] rounded-md border border-slate-800 p-0.5 font-mono text-[11px]">
            <button
              onClick={() => {
                soundFx.playClick();
                setLayoutMode('win1');
              }}
              className={`px-3 py-1 rounded transition-all font-bold min-h-[36px] ${
                layoutMode === 'win1'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-slate-950 font-black shadow-[0_0_12px_rgba(0,243,255,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              F1 : Télémétrie 4X
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setLayoutMode('win2');
              }}
              className={`px-3 py-1 rounded transition-all font-bold min-h-[36px] ${
                layoutMode === 'win2'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black shadow-[0_0_12px_rgba(255,183,0,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              F2 : Commandement
            </button>
          </div>

          {/* Tech Matrix Launcher */}
          <button
            onClick={() => {
              soundFx.playClick();
              setLayoutMode('win2');
              setWindow2Tab('tech');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border transition-colors min-h-[36px] ${
              window2Tab === 'tech' && layoutMode === 'win2'
                ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">R&amp;D :</span>
            <strong>{unlockedTechs.length}/18</strong>
          </button>

          {/* Turn Log Launcher */}
          <button
            onClick={() => {
              soundFx.playClick();
              setShowTurnLogModal(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-950/30 border border-amber-500/30 text-amber-300 hover:bg-amber-900/50 hover:text-amber-200 transition-colors min-h-[36px]"
            title="Consulter les archives et l'historique complet des cycles"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Tour {resources.turn}</span>
          </button>

          {/* System Config Launcher */}
          <button
            onClick={() => {
              soundFx.playClick();
              setShowConfigModal(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-purple-300 hover:border-purple-500/40 transition-colors min-h-[36px]"
            title="Paramètres de thème, audio et Radio FIP"
          >
            <Settings className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Système</span>
          </button>

          {/* Rules Launcher */}
          <button
            onClick={() => {
              soundFx.playClick();
              setShowRulesModal(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors min-h-[36px]"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Doctrine</span>
          </button>
        </div>
      </div>

      {/* Main Single-Window Display (100% width, No side-by-side split) */}
      <main className="w-full flex-1 transition-all duration-300">
        
        {/* ================= FENÊTRE 1 : TÉLÉMÉTRIE & BASES DE DONNÉES ================= */}
        {layoutMode === 'win1' && (
          <section className="w-full min-h-[720px] animate-in fade-in duration-200">
            <UniverseTelemetry 
              onInspectLeader={() => {
                soundFx.playClick();
                setInspectingDossier({ isOpen: true, isLeader: true });
              }}
              onInspectCouncilMember={(poleId) => {
                soundFx.playClick();
                setInspectingDossier({ isOpen: true, poleId });
              }}
              onOpenTechMatrix={() => {
                soundFx.playClick();
                setLayoutMode('win2');
                setWindow2Tab('tech');
              }}
            />
          </section>
        )}

        {/* ================= FENÊTRE 2 : MOTEUR DÉCISIONNEL, R&D & EVENT LOG ================= */}
        {layoutMode === 'win2' && (
          <section className="w-full min-h-[720px] bg-[#060a1a]/95 border border-purple-500/30 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.08)] animate-in fade-in duration-200">
            
            {/* Window 2 Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#040816] border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 border border-amber-300 shadow-[0_0_8px_rgba(255,183,0,0.8)]" />
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                  FENÊTRE 2 : MOTEUR DÉCISIONNEL, R&amp;D &amp; REGISTRE SÉQUENTIEL
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 font-semibold">
                  CHOIX DISCRETS &amp; L₀
                </span>
              </div>
            </div>

            {/* Window 2 Navigation Tabs (3 Tabs) */}
            <div className="flex items-center border-b border-purple-500/20 bg-[#070c1e] px-3 font-mono text-xs overflow-x-auto">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setWindow2Tab('decision');
                }}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold tracking-wider transition-all whitespace-nowrap min-h-[44px] ${
                  window2Tab === 'decision'
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-amber-300'
                }`}
              >
                <Terminal className="w-4 h-4" />
                1. DÉCISIONS &amp; ÉVÉNEMENTS
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setWindow2Tab('tech');
                }}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold tracking-wider transition-all whitespace-nowrap min-h-[44px] ${
                  window2Tab === 'tech'
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                    : 'border-transparent text-slate-400 hover:text-cyan-300'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                2. MATRICE R&amp;D ({unlockedTechs.length}/18)
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setWindow2Tab('logs');
                }}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold tracking-wider transition-all whitespace-nowrap min-h-[44px] ${
                  window2Tab === 'logs'
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                    : 'border-transparent text-slate-400 hover:text-emerald-300'
                }`}
              >
                <FileCode className="w-4 h-4" />
                3. REGISTRE D&apos;HISTORIQUE &amp; DATA LOGS
              </button>
            </div>

            {/* Window 2 Active Viewport */}
            <div className="p-4 sm:p-6 overflow-y-auto">
              {window2Tab === 'decision' && <DecisionEngine />}
              {window2Tab === 'tech' && <TechTreeMatrix />}
              {window2Tab === 'logs' && <EventLogRegistry />}
            </div>
          </section>
        )}

      </main>

      {/* Floating Bottom-Right Action Button for Instant Window 1 <-> Window 2 Switch */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleSwitchWindows}
          id="btn-floating-switch-window"
          title={layoutMode === 'win1' ? 'Basculer vers Fenêtre 2 (Moteur Décisionnel)' : 'Basculer vers Fenêtre 1 (Télémétrie 4X)'}
          className={`flex items-center gap-3 px-4 py-3 rounded-full font-mono font-bold text-xs shadow-[0_12px_36px_rgba(0,0,0,0.7)] backdrop-blur-xl border transition-all duration-300 min-h-[48px] group active:scale-95 ${
            layoutMode === 'win1'
              ? 'bg-gradient-to-r from-purple-950/95 via-[#0c102a]/95 to-amber-950/95 border-purple-400/60 text-purple-200 hover:border-amber-300 hover:shadow-[0_0_24px_rgba(255,183,0,0.35)]'
              : 'bg-gradient-to-r from-cyan-950/95 via-[#0c102a]/95 to-purple-950/95 border-cyan-400/60 text-cyan-200 hover:border-purple-300 hover:shadow-[0_0_24px_rgba(0,243,255,0.35)]'
          }`}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-950/90 border border-current shadow-inner shrink-0">
            <ArrowLeftRight className="w-4 h-4 text-cyan-300 group-hover:rotate-180 transition-transform duration-300" />
          </div>
          <div className="text-left pr-1">
            <div className="text-[9px] text-slate-400 uppercase tracking-widest leading-none">
              {layoutMode === 'win1' ? 'Vue Télémétrie Active' : 'Vue Commandement Active'}
            </div>
            <div className="text-xs font-black tracking-wide flex items-center gap-1.5 mt-0.5">
              <span>{layoutMode === 'win1' ? 'Ouvrir Fenêtre 2 ➔' : 'Ouvrir Fenêtre 1 ➔'}</span>
            </div>
          </div>
        </button>
      </div>

      {/* Council & Leader Dossier Modal */}
      <CouncilDossierModal
        isOpen={inspectingDossier.isOpen}
        onClose={() => setInspectingDossier({ isOpen: false })}
        poleId={inspectingDossier.poleId}
        isLeader={inspectingDossier.isLeader}
        leaderAvatarId={leader.avatarId || 'leader_vance'}
      />

      {/* 4X Rules & Invariant Modal */}
      <Modal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        title="DOCTRINE SPATIALE & INVARIANT MATHÉMATIQUE L₀"
        maxWidth="lg"
      >
        <div className="space-y-4 font-mono text-xs text-slate-300">
          <div className="p-3 rounded bg-[#070d1e] border border-purple-500/30">
            <h4 className="font-bold text-purple-300 text-sm mb-1">ARCHITECTURE MONO-VUE &amp; SWITCH DE GALAXIA</h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              La simulation spatiale propose deux grands terminaux complémentaires alternables via le bouton flottant en bas à droite : la Fenêtre 1 affiche la Télémétrie, la gouvernance, les flottes et les colonies planétaires. La Fenêtre 2 traite les choix discrets, la R&amp;D et la cryptographie du registre.
            </p>
          </div>

          <div className="p-3 rounded bg-[#040816] border border-purple-500/20">
            <h5 className="font-bold text-amber-300 mb-1">INVARIANT DETERMINISTE DE SURVIE</h5>
            <div className="font-bold text-cyan-300 my-1 p-2 bg-[#02040c] rounded border border-cyan-900">
              L₀ = (Ressources_Actuelles + Production_Colonies) - Consommation_Flotte ≥ 0.0
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Chaque cycle, le moteur vérifie que les équilibres vitaux restent strictement positifs. En cas de rupture, des alertes rouges sont émises au Conseil Exécutif.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={() => setShowRulesModal(false)}>
              Compris, Amiral
            </Button>
          </div>
        </div>
      </Modal>

      {/* System Config & Theme / Radio Modal */}
      <SystemConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />

      {/* Persistent Turn Log Modal */}
      <TurnLogModal
        isOpen={showTurnLogModal}
        onClose={() => setShowTurnLogModal(false)}
      />

    </div>
  );
};
