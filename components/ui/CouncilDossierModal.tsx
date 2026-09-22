'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { AvatarPortrait } from '@/components/ui/AvatarPortrait';
import { COUNCIL_MINISTERS_CATALOG, CouncilMinisterDetails } from '@/features/lore/councilMinisters';
import { LEADER_AVATARS, LeaderAvatar } from '@/features/lore/leaderAvatars';
import { CouncilPoleId, CouncilMember } from '@/types/config';
import { 
  Shield, 
  Cpu, 
  Users, 
  Coins, 
  Globe, 
  Truck, 
  Quote, 
  Sparkles, 
  Brain, 
  Compass, 
  Award,
  History,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/features/game/store/gameStore';

interface CouncilDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  poleId?: CouncilPoleId;
  isLeader?: boolean;
  leaderAvatarId?: string;
  currentCouncil?: Record<CouncilPoleId, CouncilMember>;
  currentLeader?: {
    name: string;
    title: string;
    avatarId?: string;
    traits?: { name: string; description: string }[];
  };
}

export function CouncilDossierModal({
  isOpen,
  onClose,
  poleId,
  isLeader = false,
  leaderAvatarId,
  currentCouncil,
  currentLeader
}: CouncilDossierModalProps) {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const { eventLogs, turnLogs, resources } = useGameStore();

  if (!isOpen) return null;

  if (isLeader) {
    const targetAvatarId = leaderAvatarId || currentLeader?.avatarId;
    const leaderAvatar = LEADER_AVATARS.find(a => a.id === targetAvatarId) || LEADER_AVATARS[0];
    const neon = leaderAvatar.neonColor;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`DOSSIER DE COMMANDEMENT : ${currentLeader?.name || leaderAvatar.name}`}
        subtitle={`${currentLeader?.title || leaderAvatar.defaultTitle} • ARCHETYPE : ${leaderAvatar.archetype}`}
        maxWidth="2xl"
      >
        <div className="space-y-4 font-mono text-xs text-slate-300">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded bg-[#030612] border border-cyan-500/30">
            <AvatarPortrait
              id={leaderAvatar.id}
              name={currentLeader?.name || leaderAvatar.name}
              neonColor={neon}
              size="xl"
            />
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  {currentLeader?.name || leaderAvatar.name}
                </span>
                <span 
                  className="px-2 py-0.5 rounded text-[10px] font-bold border"
                  style={{ color: neon, borderColor: `${neon}66`, backgroundColor: `${neon}15` }}
                >
                  {leaderAvatar.eraAffinity}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">{currentLeader?.title || leaderAvatar.defaultTitle}</p>
              <div className="pt-2 text-[11px] font-bold text-emerald-400">
                Bonus d&apos;Amiral : {leaderAvatar.statsBonus}
              </div>
            </div>
          </div>

          {/* Quote */}
          <div 
            className="p-3 rounded border italic text-[11px] leading-relaxed relative bg-[#040818]"
            style={{ borderColor: `${neon}40`, color: neon }}
          >
            <Quote className="w-4 h-4 opacity-50 absolute top-2 left-2" />
            <p className="pl-6">&ldquo;{leaderAvatar.quote}&rdquo;</p>
          </div>

          {/* 3 Themes (Lore, Psychology, Tech) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded bg-[#050b1c] border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 block uppercase">
                1. Lore &amp; Origine
              </span>
              <p className="text-[10px] text-slate-300 leading-snug">
                {leaderAvatar.loreOrigin}
              </p>
            </div>

            <div className="p-3 rounded bg-[#050b1c] border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 block uppercase">
                2. Psychologie &amp; Politique
              </span>
              <p className="text-[10px] text-slate-300 leading-snug">
                {leaderAvatar.psychologyAndPolitics}
              </p>
            </div>

            <div className="p-3 rounded bg-[#050b1c] border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 block uppercase">
                3. Axe Technologique
              </span>
              <p className="text-[10px] text-slate-300 leading-snug">
                {leaderAvatar.techOrientation}
              </p>
            </div>
          </div>

          {/* Visual Description */}
          <div className="p-3 rounded bg-[#030612] border border-slate-800 space-y-1 text-[11px]">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">
              Attributs Visuels &amp; Équipement Sci-Fi
            </span>
            <p className="text-slate-300 leading-relaxed">{leaderAvatar.visualDescription}</p>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Fermer le Dossier
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  if (!poleId) return null;
  const minister = COUNCIL_MINISTERS_CATALOG[poleId];
  if (!minister) return null;

  const currentMember = currentCouncil ? currentCouncil[poleId] : null;
  const neon = minister.signatureNeon;

  // Filter all decision logs involving this pole from gameStore
  const poleDecisions = eventLogs.filter((log) => {
    return (
      log.eventTitle?.toLowerCase().includes(poleId) ||
      log.choiceMade?.toLowerCase().includes(poleId) ||
      log.phase === (poleId === 'military' ? 3 : poleId === 'economic' ? 2 : 1)
    );
  });

  // Extract from turnLogs if available
  const turnLogDecisions = turnLogs.flatMap(t => 
    t.decisionsMade.map(d => ({
      turn: t.turn,
      phase: d.phase,
      eventTitle: d.eventTitle,
      choiceLabel: d.choiceLabel,
      outcomeSummary: d.outcomeSummary,
      deltas: d.deltas
    }))
  ).filter(d => {
    return (
      d.eventTitle.toLowerCase().includes(poleId) ||
      (poleId === 'military' && d.phase === 3) ||
      (poleId === 'economic' && d.phase === 2) ||
      (poleId === 'diplomatic' && d.phase === 1)
    );
  });

  const totalPoleRecords = poleDecisions.length + turnLogDecisions.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`DOSSIER MINISTÉRIEL : ${minister.name}`}
      subtitle={`${minister.officialTitle} • PÔLE ${poleId.toUpperCase()}`}
      maxWidth="2xl"
    >
      <div className="space-y-4 font-mono text-xs text-slate-300">
        
        {/* Header with portrait and loyalty metrics */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded bg-[#030612] border border-slate-800">
          <AvatarPortrait
            id={minister.poleId}
            name={minister.name}
            neonColor={neon}
            size="xl"
            poleId={poleId}
          />
          <div className="flex-1 space-y-1.5 text-center sm:text-left w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-sm font-bold text-white tracking-wide">{minister.name}</span>
              <span 
                className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase"
                style={{ color: neon, borderColor: `${neon}66`, backgroundColor: `${neon}15` }}
              >
                Pôle {poleId}
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">{minister.officialTitle}</p>

            {/* Loyalty & Influence Gauges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2 rounded bg-[#070e24] border border-slate-800">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400">FIDÉLITÉ</span>
                  <span className="font-bold" style={{ color: neon }}>
                    {currentMember ? currentMember.loyalty : minister.defaultLoyalty}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${currentMember ? currentMember.loyalty : minister.defaultLoyalty}%`,
                      backgroundColor: neon
                    }}
                  />
                </div>
              </div>

              <div className="p-2 rounded bg-[#070e24] border border-slate-800">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400">INFLUENCE</span>
                  <span className="font-bold text-amber-300">
                    {currentMember ? currentMember.influence : minister.defaultInfluence}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${currentMember ? currentMember.influence : minister.defaultInfluence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div 
          className="p-3 rounded border italic text-[11px] leading-relaxed relative bg-[#040818]"
          style={{ borderColor: `${neon}40`, color: neon }}
        >
          <Quote className="w-4 h-4 opacity-50 absolute top-2 left-2" />
          <p className="pl-6">&ldquo;{minister.quote}&rdquo;</p>
        </div>

        {/* 3 Themes (Lore, Psychology, Tech) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded bg-[#050b1c] border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-cyan-400 block uppercase">
              1. Lore (Superphase 1)
            </span>
            <p className="text-[10px] text-slate-300 leading-snug">
              {minister.superphase1Lore}
            </p>
          </div>

          <div className="p-3 rounded bg-[#050b1c] border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-amber-400 block uppercase">
              2. Traits (Superphase 2)
            </span>
            <p className="text-[10px] text-slate-300 leading-snug">
              {minister.superphase2Psychology}
            </p>
          </div>

          <div className="p-3 rounded bg-[#050b1c] border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 block uppercase">
              3. R&amp;D (Superphase 3)
            </span>
            <p className="text-[10px] text-slate-300 leading-snug">
              {minister.superphase3TechFocus}
            </p>
          </div>
        </div>

        {/* Interactive Expandable Decision History directly from gameStore */}
        <div className="rounded border border-purple-500/30 bg-[#060a1c] overflow-hidden">
          <button
            onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
            className="w-full flex items-center justify-between p-3 bg-[#080d24] hover:bg-[#0c1436] text-left transition-colors font-mono text-xs"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-purple-300 uppercase tracking-wider">
                HISTORIQUE DÉCISIONNEL DU PÔLE ({totalPoleRecords} ACTES ENREGISTRÉS)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-purple-300">
              <span>{isHistoryExpanded ? 'Replier' : 'Déplier les archives'}</span>
              {isHistoryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isHistoryExpanded && (
            <div className="p-3.5 space-y-3 bg-[#040714] border-t border-purple-500/20 max-h-60 overflow-y-auto animate-in fade-in duration-200">
              {totalPoleRecords === 0 ? (
                <div className="text-center py-4 text-slate-400 text-xs">
                  <FileText className="w-6 h-6 mx-auto mb-1 text-slate-600 opacity-60" />
                  <p>Aucune décision spécifique n&apos;a encore été scellée pour le Pôle {poleId.toUpperCase()} au cycle {resources.turn}.</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Les arbitrages du Conseil apparaîtront ici lors des prochaines résolutions de phase.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {poleDecisions.map((record, i) => (
                    <div key={i} className="p-2.5 rounded bg-[#070e24] border border-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300">Cycle {record.turn} • Phase {record.phase}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> L₀ Valide
                        </span>
                      </div>
                      <div className="text-slate-200 font-semibold">{record.eventTitle}</div>
                      <div className="text-purple-300 italic">Choix pris : &ldquo;{record.choiceMade}&rdquo;</div>
                      {record.deltas && Object.keys(record.deltas).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                          {Object.entries(record.deltas).map(([k, v]) => (
                            <span key={k} className="px-1 rounded bg-slate-900 text-slate-300">
                              {k}: {v > 0 ? `+${v}` : v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {turnLogDecisions.map((tRec, idx) => (
                    <div key={`tl-${idx}`} className="p-2.5 rounded bg-[#09102c] border border-purple-500/20 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300">Cycle {tRec.turn} • Archive Globale</span>
                        <span className="text-[9px] text-slate-400">Phase {tRec.phase}</span>
                      </div>
                      <div className="text-slate-200 font-semibold">{tRec.eventTitle}</div>
                      <div className="text-purple-300 italic">{tRec.choiceLabel}</div>
                      <p className="text-[10px] text-slate-400">{tRec.outcomeSummary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cybernetics & Visual details */}
        <div className="p-3 rounded bg-[#030612] border border-slate-800 space-y-2 text-[11px]">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">
              Description Visuelle &amp; Effets Néons
            </span>
            <p className="text-slate-300">{minister.visualPortraitDescription}</p>
          </div>
          <div>
            <span className="text-[10px] text-cyan-400 font-bold block uppercase">
              Implants &amp; Cybernétique
            </span>
            <p className="text-slate-300">{minister.cyberneticsAndAugments}</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Fermer le Dossier
          </Button>
        </div>
      </div>
    </Modal>
  );
}

