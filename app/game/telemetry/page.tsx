'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { UniverseTelemetry } from '@/features/game/components/UniverseTelemetry';
import { CouncilDossierModal } from '@/components/ui/CouncilDossierModal';
import { useGameStore } from '@/features/game/store/gameStore';
import { CouncilPoleId } from '@/types/config';
import { soundFx } from '@/lib/audio';
import { 
  ArrowLeftRight, 
  Columns, 
  Terminal, 
  Radio, 
  Users, 
  Globe, 
  Maximize2 
} from 'lucide-react';

export default function TelemetryWindowPage() {
  const [inspectingDossier, setInspectingDossier] = useState<{
    isOpen: boolean;
    poleId?: CouncilPoleId;
    isLeader?: boolean;
  }>({ isOpen: false });

  const { saveName, eraId, leader } = useGameStore();

  return (
    <AppShell>
      <div className="flex-1 flex flex-col p-3 lg:p-6 max-w-[1600px] w-full mx-auto space-y-4">
        
        {/* Navigation & Window Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded bg-[#070d1e] border border-cyan-500/30 font-mono text-xs shadow-[0_0_15px_rgba(0,243,255,0.08)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
              <span className="font-bold text-cyan-300 uppercase tracking-wider">
                FENÊTRE 1 : TÉLÉMÉTRIE DÉDIÉE (PLEIN ÉCRAN)
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
              href="/game/command"
              onClick={() => soundFx.playClick()}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-amber-500/20 border border-amber-400 text-amber-300 hover:bg-amber-500/30 transition-all font-bold shadow-[0_0_12px_rgba(255,183,0,0.2)]"
              title="Basculer instantanément sur la Fenêtre 2"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
              <span>Switch vers Fenêtre 2 (Commandement)</span>
            </Link>
          </div>
        </div>

        {/* Full-Window 1 Content Container */}
        <div className="flex-1 min-h-[820px] flex flex-col">
          <UniverseTelemetry
            onInspectLeader={() => {
              soundFx.playClick();
              setInspectingDossier({ isOpen: true, isLeader: true });
            }}
            onInspectCouncilMember={(poleId) => {
              soundFx.playClick();
              setInspectingDossier({ isOpen: true, poleId });
            }}
          />
        </div>

        {/* Council and Leader Dossier Modal */}
        <CouncilDossierModal
          isOpen={inspectingDossier.isOpen}
          onClose={() => setInspectingDossier({ isOpen: false })}
          poleId={inspectingDossier.poleId}
          isLeader={inspectingDossier.isLeader}
          leaderAvatarId={leader.avatarId || 'leader_vance'}
        />
      </div>
    </AppShell>
  );
}
