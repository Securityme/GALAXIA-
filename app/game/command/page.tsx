'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { DecisionEngine } from '@/features/game/components/DecisionEngine';
import { TechTreeMatrix } from '@/features/tech/components/TechTreeMatrix';
import { EventLogRegistry } from '@/features/game/components/EventLogRegistry';
import { CouncilDossierModal } from '@/components/ui/CouncilDossierModal';
import { useGameStore } from '@/features/game/store/gameStore';
import { CouncilPoleId } from '@/types/config';
import { soundFx } from '@/lib/audio';
import { 
  ArrowLeftRight, 
  Columns, 
  Terminal, 
  FlaskConical, 
  FileCode, 
  Layers, 
  HelpCircle,
  Users
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export default function CommandWindowPage() {
  const [window2Tab, setWindow2Tab] = useState<'decision' | 'tech' | 'logs'>('decision');
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [inspectingDossier, setInspectingDossier] = useState<{
    isOpen: boolean;
    poleId?: CouncilPoleId;
    isLeader?: boolean;
  }>({ isOpen: false });

  const { saveName, eraId, leader, unlockedTechs } = useGameStore();

  return (
    <AppShell>
      <div className="flex-1 flex flex-col p-3 lg:p-6 max-w-[1600px] w-full mx-auto space-y-4">
        
        {/* Navigation & Window Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded bg-[#070d1e] border border-amber-500/30 font-mono text-xs shadow-[0_0_15px_rgba(255,183,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(255,183,0,0.8)]" />
              <span className="font-bold text-amber-300 uppercase tracking-wider">
                FENÊTRE 2 : MOTEUR DÉCISIONNEL & COMMANDEMENT (PLEIN ÉCRAN)
              </span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">PARTIE : <strong className="text-slate-200">{saveName}</strong></span>
          </div>

          {/* Window Switchers */}
          <div className="flex items-center gap-2">
            <Link
              href="/game"
              onClick={() => soundFx.playClick()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
              title="Afficher la vue double 50/50"
            >
              <Columns className="w-3.5 h-3.5 text-cyan-400" />
              <span>Vue Double (Dual)</span>
            </Link>

            <Link
              href="/game/telemetry"
              onClick={() => soundFx.playClick()}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-cyan-500/20 border border-cyan-400 text-cyan-300 hover:bg-cyan-500/30 transition-all font-bold shadow-[0_0_12px_rgba(0,243,255,0.2)]"
              title="Basculer instantanément sur la Fenêtre 1"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
              <span>Switch vers Fenêtre 1 (Télémétrie)</span>
            </Link>
          </div>
        </div>

        {/* Full-Window 2 Content Container */}
        <section className="flex-1 min-h-[820px] flex flex-col bg-[#060b18]/90 border border-amber-500/30 rounded-md overflow-hidden shadow-[0_0_20px_rgba(255,183,0,0.06)]">
          
          {/* Header with Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#050914] border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 border border-amber-300 shadow-[0_0_8px_rgba(255,183,0,0.8)]" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                CONSOLE DE COMMANDE TACTIQUE
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowRulesModal(true);
                }}
                className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                Règles 4X
              </button>
            </div>
          </div>

          {/* 3 Tabs */}
          <div className="flex items-center border-b border-amber-500/20 bg-[#070d1e] px-3 font-mono text-xs overflow-x-auto">
            <button
              onClick={() => {
                soundFx.playClick();
                setWindow2Tab('decision');
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-bold tracking-wider transition-all whitespace-nowrap ${
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
              className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-bold tracking-wider transition-all whitespace-nowrap ${
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
              className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-bold tracking-wider transition-all whitespace-nowrap ${
                window2Tab === 'logs'
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-emerald-300'
              }`}
            >
              <FileCode className="w-4 h-4" />
              3. REGISTRE D&apos;HISTORIQUE &amp; DATA LOGS
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {window2Tab === 'decision' && <DecisionEngine />}
            {window2Tab === 'tech' && <TechTreeMatrix />}
            {window2Tab === 'logs' && <EventLogRegistry />}
          </div>
        </section>

        {/* Council and Leader Dossier Modal */}
        <CouncilDossierModal
          isOpen={inspectingDossier.isOpen}
          onClose={() => setInspectingDossier({ isOpen: false })}
          poleId={inspectingDossier.poleId}
          isLeader={inspectingDossier.isLeader}
          leaderAvatarId={leader.avatarId || 'leader_vance'}
        />

        {/* Rules & Invariant Modal */}
        <Modal
          isOpen={showRulesModal}
          onClose={() => setShowRulesModal(false)}
          title="DOCTRINE SPATIALE & INVARIANT MATHÉMATIQUE L₀"
          maxWidth="lg"
        >
          <div className="space-y-3 font-mono text-xs text-slate-300">
            <p>
              Le moteur de GALAXIA repose sur la séparation duale et la conservation des flux :
            </p>
            <div className="p-3 rounded bg-[#040816] border border-cyan-500/30 text-cyan-300">
              <span className="font-bold">L₀ = (Énergie + Vivres + Minéraux) - Consommation_Flotte ≥ 0.0</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Si une ressource vitale franchit le seuil critique de rupture d&apos;approvisionnement, une crise systémique est déclarée.
            </p>
            <div className="pt-2 flex justify-end">
              <Button variant="primary" onClick={() => setShowRulesModal(false)}>
                Compris
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
