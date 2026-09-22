'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/features/game/store/gameStore';
import { TECH_TREE_CATALOG, calculateDynamicTechCost } from '@/features/tech/logic/techTreeData';
import { TechnologyItem, TechCost } from '@/types/tech';
import { CouncilPoleId } from '@/types/config';
import { 
  Shield, 
  Cpu, 
  Users, 
  Coins, 
  Globe, 
  Truck, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  Zap, 
  Radio, 
  Bomb, 
  Heart, 
  Factory, 
  TrendingUp, 
  MessageSquare, 
  Crown, 
  FastForward, 
  Boxes 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { soundFx } from '@/lib/audio';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

const POLE_METADATA: Record<CouncilPoleId, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  military: {
    label: 'Militaire',
    icon: <Shield className="w-4 h-4" />,
    color: '#f43f5e',
    bg: 'border-rose-500/30 text-rose-400'
  },
  scientific: {
    label: 'Scientifique',
    icon: <Cpu className="w-4 h-4" />,
    color: '#00f3ff',
    bg: 'border-cyan-500/30 text-cyan-400'
  },
  civilization: {
    label: 'Civilisationnel',
    icon: <Users className="w-4 h-4" />,
    color: '#ffb700',
    bg: 'border-amber-500/30 text-amber-400'
  },
  economic: {
    label: 'Économique',
    icon: <Coins className="w-4 h-4" />,
    color: '#f59e0b',
    bg: 'border-yellow-500/30 text-yellow-400'
  },
  diplomatic: {
    label: 'Diplomatique',
    icon: <Globe className="w-4 h-4" />,
    color: '#00ff88',
    bg: 'border-emerald-500/30 text-emerald-400'
  },
  logistics: {
    label: 'Logistique',
    icon: <Truck className="w-4 h-4" />,
    color: '#eab308',
    bg: 'border-amber-600/30 text-amber-400'
  }
};

export function TechTreeMatrix() {
  const { 
    unlockedTechs, 
    resources, 
    leader, 
    council, 
    difficulty, 
    unlockTechnology 
  } = useGameStore();

  const [selectedPole, setSelectedPole] = useState<CouncilPoleId | 'all'>('all');
  const [inspectingTech, setInspectingTech] = useState<TechnologyItem | null>(null);

  const polesList: CouncilPoleId[] = ['military', 'scientific', 'civilization', 'economic', 'diplomatic', 'logistics'];

  // Check if player has enough resources
  const canAfford = (cost: TechCost): boolean => {
    if (cost.credits && resources.credits < cost.credits) return false;
    if (cost.minerals && resources.minerals < cost.minerals) return false;
    if (cost.energy && resources.energy < cost.energy) return false;
    if (cost.sciencePoints && resources.researchPoints < cost.sciencePoints) return false;
    return true;
  };

  const handleResearch = (tech: TechnologyItem, dynamicCost: TechCost) => {
    if (unlockedTechs.includes(tech.id)) return;
    if (!canAfford(dynamicCost)) {
      soundFx.playAlert();
      toast.error("Ressources insuffisantes pour cette technologie !");
      return;
    }

    // Deduct and unlock
    unlockTechnology(tech.id, dynamicCost, tech.effects);

    soundFx.playTechUnlock();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    toast.success(`Technologie débloquée : ${tech.name}`, {
      description: tech.effects.specialPerk || 'Amélioration opérationnelle active'
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#02040b] text-slate-200 font-mono select-none">
      
      {/* Filter bar by Pole */}
      <div className="flex items-center gap-2 p-3 bg-[#030612] border-b border-slate-800 overflow-x-auto">
        <button
          onClick={() => {
            soundFx.playClick();
            setSelectedPole('all');
          }}
          className={`px-3 py-1.5 rounded text-xs font-bold transition-all border whitespace-nowrap ${
            selectedPole === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_8px_rgba(0,243,255,0.3)]'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          Tous les Pôles
        </button>

        {polesList.map((pole) => {
          const meta = POLE_METADATA[pole];
          const isSelected = selectedPole === pole;
          return (
            <button
              key={pole}
              onClick={() => {
                soundFx.playClick();
                setSelectedPole(pole);
              }}
              style={{
                borderColor: isSelected ? meta.color : undefined,
                color: isSelected ? meta.color : undefined,
                boxShadow: isSelected ? `0 0 8px ${meta.color}44` : undefined
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all border whitespace-nowrap ${
                isSelected
                  ? 'bg-slate-900/80'
                  : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {meta.icon}
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {polesList
          .filter((pole) => selectedPole === 'all' || selectedPole === pole)
          .map((pole) => {
            const meta = POLE_METADATA[pole];
            const poleTechs = TECH_TREE_CATALOG.filter((t) => t.poleId === pole);
            const poleLoyalty = council[pole]?.loyalty ?? 75;

            return (
              <div 
                key={pole} 
                className="p-3.5 rounded-lg bg-[#040818] border border-slate-800/80 relative"
              >
                {/* Pole Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span 
                      className="p-1.5 rounded"
                      style={{ color: meta.color, backgroundColor: `${meta.color}15` }}
                    >
                      {meta.icon}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold tracking-wider uppercase text-white">
                        Pôle {meta.label}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Conseiller : {council[pole]?.name || 'Non assigné'} • Fidélité : {poleLoyalty}%
                        {poleLoyalty >= 80 ? (
                          <span className="text-emerald-400 ml-1.5 font-bold">(-15% Coût R&amp;D)</span>
                        ) : poleLoyalty <= 40 ? (
                          <span className="text-rose-400 ml-1.5 font-bold">(+25% Frottement)</span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tech Cards by Tier (1, 2, 3) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[1, 2, 3].map((tier) => {
                    const tech = poleTechs.find((t) => t.tier === tier);
                    if (!tech) return null;

                    const isUnlocked = unlockedTechs.includes(tech.id);
                    const prereqsMet = tech.prerequisites.every((p) => unlockedTechs.includes(p));
                    const dynamicCost = calculateDynamicTechCost(
                      tech,
                      leader.traits,
                      poleLoyalty,
                      difficulty
                    );
                    const affordable = canAfford(dynamicCost);

                    return (
                      <div
                        key={tech.id}
                        className={`p-3 rounded border flex flex-col justify-between transition-all ${
                          isUnlocked
                            ? 'bg-emerald-950/20 border-emerald-500/40'
                            : prereqsMet
                            ? 'bg-[#060c20] border-slate-700 hover:border-cyan-500/50'
                            : 'bg-black/40 border-slate-900 opacity-60'
                        }`}
                      >
                        <div className="space-y-1.5">
                          {/* Header tag */}
                          <div className="flex items-center justify-between text-[10px]">
                            <span 
                              className="px-1.5 py-0.5 rounded font-bold uppercase"
                              style={{
                                color: isUnlocked ? '#00ff88' : meta.color,
                                backgroundColor: isUnlocked ? '#00ff8815' : `${meta.color}15`
                              }}
                            >
                              Palier {tier}
                            </span>
                            {isUnlocked ? (
                              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                                <CheckCircle2 className="w-3 h-3" />
                                Débloqué
                              </span>
                            ) : !prereqsMet ? (
                              <span className="flex items-center gap-1 text-slate-500">
                                <Lock className="w-3 h-3" />
                                Prérequis requis
                              </span>
                            ) : (
                              <span className="text-cyan-400 font-bold">Disponible</span>
                            )}
                          </div>

                          {/* Tech Name */}
                          <h5 className="text-xs font-bold text-white leading-tight">
                            {tech.name}
                          </h5>

                          {/* Description */}
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                            {tech.description}
                          </p>

                          {/* Perks */}
                          {tech.effects.specialPerk && (
                            <div className="p-1.5 rounded bg-black/40 border border-slate-800/80 text-[10px] text-amber-300/90 leading-tight">
                              ★ {tech.effects.specialPerk}
                            </div>
                          )}
                        </div>

                        {/* Cost & Action Footer */}
                        <div className="pt-3 mt-2 border-t border-slate-800/50 space-y-2">
                          {!isUnlocked && (
                            <div className="flex flex-wrap gap-2 text-[10px]">
                              {dynamicCost.credits !== undefined && (
                                <span className={resources.credits >= dynamicCost.credits ? 'text-slate-300' : 'text-rose-400 font-bold'}>
                                  Crédits: {dynamicCost.credits}
                                </span>
                              )}
                              {dynamicCost.minerals !== undefined && (
                                <span className={resources.minerals >= dynamicCost.minerals ? 'text-slate-300' : 'text-rose-400 font-bold'}>
                                  Minerais: {dynamicCost.minerals}
                                </span>
                              )}
                              {dynamicCost.energy !== undefined && (
                                <span className={resources.energy >= dynamicCost.energy ? 'text-slate-300' : 'text-rose-400 font-bold'}>
                                  Énergie: {dynamicCost.energy}
                                </span>
                              )}
                              {dynamicCost.sciencePoints !== undefined && (
                                <span className={resources.researchPoints >= dynamicCost.sciencePoints ? 'text-cyan-300' : 'text-rose-400 font-bold'}>
                                  Flux R&amp;D: {dynamicCost.sciencePoints}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setInspectingTech(tech)}
                              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                              title="Consulter le dossier d'archives"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>

                            {!isUnlocked && (
                              <Button
                                size="sm"
                                variant={affordable && prereqsMet ? 'primary' : 'secondary'}
                                disabled={!prereqsMet || !affordable}
                                onClick={() => handleResearch(tech, dynamicCost)}
                                className="w-full text-xs py-1 h-7"
                              >
                                Lancer la R&amp;D
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Tech Inspect Modal */}
      {inspectingTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-5 rounded-lg bg-[#030612] border border-cyan-500/40 text-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  Archive R&amp;D • Palier {inspectingTech.tier}
                </span>
                <h3 className="text-sm font-bold text-white">{inspectingTech.name}</h3>
              </div>
              <button 
                onClick={() => setInspectingTech(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded bg-[#050b1c] border border-slate-800 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase">Contexte Scientifique &amp; Lore</span>
              <p className="text-xs text-slate-300 leading-relaxed">{inspectingTech.lore}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Impact Opérationnel</span>
              <p className="text-xs text-slate-300">{inspectingTech.description}</p>
              {inspectingTech.effects.specialPerk && (
                <div className="p-2 mt-2 rounded bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 font-bold">
                  ★ {inspectingTech.effects.specialPerk}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="secondary" onClick={() => setInspectingTech(null)}>
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
