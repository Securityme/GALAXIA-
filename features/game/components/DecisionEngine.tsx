'use client';

import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useGameSimulation } from '../hooks/useGameSimulation';
import { Button } from '@/components/ui/Button';
import { TacticalTooltip } from '@/components/ui/Tooltip';
import { Modal } from '@/components/ui/Modal';
import { 
  Terminal, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Cpu, 
  ShieldCheck, 
  RotateCw,
  Sliders,
  Radio,
  Zap,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Skull,
  Maximize2,
  Minimize2,
  BookOpen,
  Scale,
  Shield,
  Coins,
  Activity,
  Award
} from 'lucide-react';

export const DecisionEngine: React.FC = () => {
  const {
    currentPhase,
    activeEvent,
    isPhaseResolved,
    isGeneratingEvent,
    resolveChoice,
    advanceToNextPhase,
    refreshCurrentEvent
  } = useGameSimulation();

  const { isGameOver, gameOverReason, resources, council } = useGameStore();
  const [isFullscreenNarrative, setIsFullscreenNarrative] = useState(false);
  const [readingFontSize, setReadingFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  const phaseNames = {
    1: 'Phase 1 : Scénario Principal & Événements Aléatoires',
    2: 'Phase 2 : Gestion de l’Union, Colonies & Villes',
    3: 'Phase 3 : Crises, Alertes, Militaire & Diplomatie'
  };

  const phaseBadges = {
    1: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
    2: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
    3: 'bg-rose-950/80 text-rose-300 border-rose-500/40'
  };

  if (isGameOver) {
    return (
      <div className="p-6 rounded bg-[#13070b] border border-rose-500/40 text-center font-mono flex flex-col items-center justify-center min-h-[320px]">
        <Skull className="w-12 h-12 text-rose-500 animate-pulse mb-3" />
        <h3 className="text-lg font-bold text-rose-300 uppercase tracking-widest">
          SIMULATION INTERROMPUE : DÉFAITE CRITIQUE
        </h3>
        <p className="text-sm text-slate-300 max-w-md mt-2">
          {gameOverReason || "L'Union Galactique s'est effondrée dans les ténèbres du Secteur Zéro."}
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Vous avez survécu {resources.turn} cycles solaires.
        </p>
        <Button
          variant="primary"
          className="mt-6"
          onClick={() => window.location.href = '/config'}
        >
          Réinitialiser une Simulation T_0
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono text-xs">
      
      {/* 3-Phases Progress Stepper */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((p) => {
          const isCurrent = currentPhase === p;
          const isDone = currentPhase > p;
          return (
            <TacticalTooltip
              key={p}
              title={`Séquenceur Événementiel : Phase ${p}`}
              content={
                p === 1
                  ? "Narratif galactique et opportunités diplomatiques pilotées par le LLM."
                  : p === 2
                  ? "Gestion des infrastructures d'Union, équilibre logistique et biomes planétaires."
                  : "Résolution des alertes rouges, incursions pirates et crises de survie L₀."
              }
            >
              <div
                className={`p-2.5 rounded border text-center transition-all cursor-help ${
                  isCurrent
                    ? 'bg-gradient-to-br from-purple-950/60 via-[#0a1533] to-cyan-950/60 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                    : isDone
                    ? 'bg-[#060b18] border-emerald-500/40 text-emerald-400 opacity-80'
                    : 'bg-[#040814] border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold">
                  {isDone ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span>PHASE {p}</span>
                  )}
                </div>
                <div className="text-[10px] truncate mt-0.5">
                  {p === 1 ? 'Scénario LLM' : p === 2 ? 'Union & Villes' : 'Crises & Militaire'}
                </div>
              </div>
            </TacticalTooltip>
          );
        })}
      </div>

      {/* Active Phase Card */}
      <div className="p-4 rounded bg-[#070c1e]/95 border border-purple-500/25 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/20 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${phaseBadges[currentPhase]}`}>
              {phaseNames[currentPhase]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              MJ PROCÉDURAL : GEMINI 3.8 FLASH
            </span>

            <TacticalTooltip
              title="Régénération de l'Événement"
              content="Demande une nouvelle synthèse procédurale au Maître de Jeu IA en recalculant les paramètres contextuels de l'Union."
            >
              <button
                onClick={refreshCurrentEvent}
                disabled={isGeneratingEvent || isPhaseResolved}
                title="Régénérer l'événement"
                className="p-1.5 rounded bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-purple-300 hover:border-purple-400 disabled:opacity-30 transition-all"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isGeneratingEvent ? 'animate-spin text-purple-400' : ''}`} />
              </button>
            </TacticalTooltip>
          </div>
        </div>

        {/* Loading State */}
        {isGeneratingEvent && (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-purple-400/40 bg-purple-950/40">
              <Radio className="w-5 h-5 text-purple-400 animate-spin" />
            </div>
            <p className="text-xs text-purple-300 font-semibold">
              Interrogation des balises stellaires et du Maître de Jeu IA...
            </p>
            <p className="text-[10px] text-slate-400">
              Calcul des équilibres déterministes et invariants L₀...
            </p>
          </div>
        )}

        {/* Event Narrative Display */}
        {!isGeneratingEvent && activeEvent && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Narrative Box with Fullscreen Toggle */}
            <div className="bg-[#050818] p-4 rounded border border-purple-500/20 relative group">
              <div className="flex items-center justify-between text-[11px] text-purple-300 font-bold mb-2">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  {activeEvent.title}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-normal">
                    Source : {activeEvent.source}
                  </span>
                  
                  <TacticalTooltip
                    title="Plein Écran & Confort de Lecture"
                    content="Agrandit la zone de texte du rapport dans un visualiseur grand angle haute lisibilité."
                  >
                    <button
                      onClick={() => setIsFullscreenNarrative(true)}
                      className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors flex items-center gap-1 text-[10px]"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Plein Écran</span>
                    </button>
                  </TacticalTooltip>
                </div>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed italic border-l-2 border-purple-500/40 pl-3 py-1 bg-purple-950/10 rounded-r">
                &ldquo;{activeEvent.narrativeText}&rdquo;
              </div>
            </div>

            {/* Tactical Choice Selection with Radix Tooltips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Ordres d&apos;Amiral &amp; Choix Décisionnels :
                </span>
                <span className="text-[10px] text-slate-400">
                  Survolez les boutons pour voir les impacts précis
                </span>
              </div>

              <div className="space-y-2.5">
                {activeEvent.choices.map((choice, idx) => {
                  const isResolved = isPhaseResolved;
                  const deltaEntries = Object.entries(choice.deltaResources || {});
                  
                  // Compute preview metrics for tooltip
                  const costItems = deltaEntries
                    .filter(([_, val]) => (val as number) < 0)
                    .map(([k, val]) => `${k}: ${val}`);
                  const gainItems = deltaEntries
                    .filter(([_, val]) => (val as number) > 0)
                    .map(([k, val]) => `${k}: +${val}`);

                  const tooltipTitle = `Ordre Stratégique : ${choice.label}`;
                  const tooltipContent = (
                    <div className="space-y-1.5 font-mono">
                      <p className="text-[11px] text-slate-200">{choice.description}</p>
                      
                      <div className="pt-1 border-t border-purple-500/20 space-y-1 text-[10px]">
                        {costItems.length > 0 && (
                          <div className="text-rose-400">
                            <strong>Coût / Prélèvement :</strong> {costItems.join(', ')}
                          </div>
                        )}
                        {gainItems.length > 0 && (
                          <div className="text-emerald-400">
                            <strong>Gains Prévisionnels :</strong> {gainItems.join(', ')}
                          </div>
                        )}
                        {choice.councilImpact && (
                          <div className="text-cyan-300">
                            <strong>Impact Conseil ({choice.councilImpact.poleId}) :</strong> {choice.councilImpact.loyaltyDelta >= 0 ? `+${choice.councilImpact.loyaltyDelta}` : choice.councilImpact.loyaltyDelta}% fidélité
                          </div>
                        )}
                        <div className="text-amber-300 text-[9px] pt-0.5">
                          Invariant L₀ : Vérifié compatible avec les réserves actuelles
                        </div>
                      </div>
                    </div>
                  );

                  return (
                    <TacticalTooltip
                      key={choice.id}
                      title={tooltipTitle}
                      content={tooltipContent}
                      side="top"
                    >
                      <button
                        disabled={isResolved}
                        onClick={() => resolveChoice(currentPhase, choice)}
                        className={`w-full text-left p-3.5 rounded border transition-all duration-200 ${
                          isResolved
                            ? 'opacity-60 cursor-default bg-[#050914] border-slate-800'
                            : 'bg-[#080e22] hover:bg-[#0d1738] border-purple-500/30 hover:border-cyan-400 group shadow-sm hover:shadow-[0_0_16px_rgba(0,243,255,0.18)] min-h-[44px]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-bold text-slate-200 group-hover:text-cyan-300 text-xs">
                            {idx + 1}. {choice.label}
                          </span>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                            {choice.category}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-snug">
                          {choice.description}
                        </p>

                        {/* Resource Impact Preview */}
                        <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[10px]">
                          <span className="text-slate-400">Impact ΔR :</span>
                          {deltaEntries.map(([key, val]) => (
                            <span
                              key={key}
                              className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                                (val as number) >= 0 
                                  ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30' 
                                  : 'text-rose-300 bg-rose-950/60 border border-rose-500/30'
                              }`}
                            >
                              {key} : {(val as number) >= 0 ? `+${val}` : val}
                            </span>
                          ))}
                          {choice.councilImpact && (
                            <span className="text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded font-bold">
                              Conseil ({choice.councilImpact.poleId}) : {choice.councilImpact.loyaltyDelta >= 0 ? `+${choice.councilImpact.loyaltyDelta}` : choice.councilImpact.loyaltyDelta}%
                            </span>
                          )}
                        </div>
                      </button>
                    </TacticalTooltip>
                  );
                })}
              </div>
            </div>

            {/* Next Phase or End of Turn Transition Button with Tooltip */}
            {isPhaseResolved && (
              <div className="p-3 rounded bg-[#06141a] border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  Ordre exécuté avec succès. Invariant L₀ vérifié.
                </div>
                
                <TacticalTooltip
                  title={currentPhase === 3 ? "Clôture du Cycle & Bilan 4X" : "Transition de Phase"}
                  content={
                    currentPhase === 3
                      ? "Calcule la production nette des colonies, récolte les minéraux et scelle l'état dans l'historique du tour."
                      : "Valide les choix de la phase active et génère la situation tactique suivante."
                  }
                >
                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={advanceToNextPhase}
                    className="font-bold w-full sm:w-auto min-h-[40px]"
                  >
                    {currentPhase === 3 ? 'Clôturer le Tour & Récolter 4X' : 'Passer à la Phase Suivante'}
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </TacticalTooltip>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Narrative Reading Modal */}
      <Modal
        isOpen={isFullscreenNarrative}
        onClose={() => setIsFullscreenNarrative(false)}
        title={`DISPATCH DU HAUT COMMANDEMENT : ${activeEvent?.title || 'RAPPORT OPÉRATIONNEL'}`}
        subtitle={`Source : ${activeEvent?.source || 'Secteur Zéro'} • Cycle ${resources.turn} • Phase ${currentPhase}`}
        maxWidth="3xl"
      >
        <div className="space-y-4 font-mono">
          {/* Font size and visual controls */}
          <div className="flex items-center justify-between p-2 rounded bg-[#040816] border border-purple-500/20 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              Mode Lecture Confort Amiral
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 mr-1">Taille texte :</span>
              <button
                onClick={() => setReadingFontSize('sm')}
                className={`px-2 py-0.5 rounded text-xs ${readingFontSize === 'sm' ? 'bg-purple-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
              >
                A-
              </button>
              <button
                onClick={() => setReadingFontSize('base')}
                className={`px-2 py-0.5 rounded text-xs ${readingFontSize === 'base' ? 'bg-purple-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
              >
                A
              </button>
              <button
                onClick={() => setReadingFontSize('lg')}
                className={`px-2 py-0.5 rounded text-xs ${readingFontSize === 'lg' ? 'bg-purple-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
              >
                A+
              </button>
            </div>
          </div>

          {/* Full Narrative Text */}
          <div className="p-5 rounded bg-[#030612] border border-purple-500/30 text-slate-100 leading-relaxed space-y-3">
            <p className={
              readingFontSize === 'sm' ? 'text-xs leading-relaxed' :
              readingFontSize === 'lg' ? 'text-base leading-loose' :
              'text-sm leading-relaxed'
            }>
              {activeEvent?.narrativeText}
            </p>
          </div>

          {/* Quick Choice Actions inside Modal */}
          {activeEvent && !isPhaseResolved && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-cyan-300 uppercase block">
                Prendre une décision immédiate depuis ce terminal :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeEvent.choices.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      resolveChoice(currentPhase, c);
                      setIsFullscreenNarrative(false);
                    }}
                    className="p-2.5 rounded bg-[#070e24] hover:bg-[#0b1738] border border-slate-700 hover:border-cyan-400 text-left text-xs transition-colors"
                  >
                    <div className="font-bold text-white">{i + 1}. {c.label}</div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{c.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={() => setIsFullscreenNarrative(false)}>
              Quitter le Plein Écran
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
