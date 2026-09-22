'use client';

import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { TurnLogEntry } from '@/types/game';
import { 
  History, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  TrendingUp, 
  Hammer, 
  CheckCircle2, 
  AlertTriangle, 
  Download,
  Search,
  Sparkles,
  Zap,
  Wheat,
  Coins,
  Cpu
} from 'lucide-react';

interface TurnLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TurnLogModal: React.FC<TurnLogModalProps> = ({ isOpen, onClose }) => {
  const turnLogs = useGameStore((s) => s.turnLogs);
  const currentTurn = useGameStore((s) => s.resources.turn);
  const [selectedTurn, setSelectedTurn] = useState<number | null>(turnLogs[0]?.turn ?? null);
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredLogs = turnLogs.filter((log) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      log.turn.toString().includes(q) ||
      log.aiDebriefing.toLowerCase().includes(q) ||
      log.decisionsMade.some(d => d.choiceLabel.toLowerCase().includes(q) || d.eventTitle.toLowerCase().includes(q)) ||
      log.constructionsCompleted.some(c => c.buildingName.toLowerCase().includes(q))
    );
  });

  const activeEntry: TurnLogEntry | undefined = turnLogs.find(
    (l) => l.turn === (selectedTurn ?? turnLogs[0]?.turn)
  ) || turnLogs[0];

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(turnLogs, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `GALAXIA_TURN_LOGS_CYCLE_${currentTurn}.json`);
    dlAnchorElem.click();
  };

  return (
    <div 
      id="turn-log-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div 
        id="turn-log-modal-container"
        className="w-full max-w-5xl h-[85vh] flex flex-col bg-slate-950/95 border border-cyan-500/40 rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.15)] overflow-hidden text-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-950 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wider text-cyan-300 uppercase flex items-center gap-2">
                Archives Stratégiques & Turn Log
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                  Cycle Actuel : {currentTurn}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Journalisation chronologique des décisions, débits de production et chantiers achevés
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="export-turn-logs-btn"
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-cyan-500/30 hover:bg-cyan-950/40 text-cyan-300 transition-colors"
              title="Exporter les journaux de cycle en JSON"
            >
              <Download className="w-3.5 h-3.5" />
              Exporter JSON
            </button>
            <button
              id="close-turn-log-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body (Split view: Left list of turns, Right detailed review) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Turn Index */}
          <div className="w-72 border-r border-slate-800/80 flex flex-col bg-slate-950/50">
            <div className="p-3 border-b border-slate-800/60">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filtrer les cycles..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded px-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  {turnLogs.length === 0 
                    ? "Aucun cycle précédent clôturé. Avancez le tour pour générer les archives."
                    : "Aucun cycle ne correspond à ce filtre."}
                </div>
              ) : (
                filteredLogs.map((log) => {
                  const isSelected = (selectedTurn ?? turnLogs[0]?.turn) === log.turn;
                  return (
                    <button
                      key={log.turn}
                      id={`turn-log-selector-${log.turn}`}
                      onClick={() => setSelectedTurn(log.turn)}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200' 
                          : 'bg-slate-900/30 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-cyan-400">CYCLE {log.turn}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                            L0 OK
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {log.decisionsMade.length} décision(s) • {log.constructionsCompleted.length} chantier(s)
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'}`} />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Turn Detailed View */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeEntry ? (
              <>
                {/* Turn Header Card */}
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900/40 to-slate-950 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white tracking-wide">
                        COMPTE RENDU DU CYCLE #{activeEntry.turn}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono">
                        {new Date(activeEntry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Statut de conformité thermodynamique : <span className="text-emerald-400 font-semibold">L0 invariant certifié</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      L0 &gt;= 0 CONFORME
                    </span>
                  </div>
                </div>

                {/* Net Yields Snapshot */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                    Rendements Nets Enregistrés au Changement de Tour
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-amber-400 mb-1">
                        <Coins className="w-3.5 h-3.5" /> Crédits
                      </div>
                      <span className="text-sm font-bold text-slate-100 font-mono">
                        +{activeEntry.netProduction.credits}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-cyan-400 mb-1">
                        <Zap className="w-3.5 h-3.5" /> Énergie
                      </div>
                      <span className={`text-sm font-bold font-mono ${activeEntry.netProduction.energy >= 0 ? 'text-cyan-300' : 'text-crimson-400'}`}>
                        {activeEntry.netProduction.energy >= 0 ? '+' : ''}{activeEntry.netProduction.energy}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-emerald-400 mb-1">
                        <Wheat className="w-3.5 h-3.5" /> Vivres
                      </div>
                      <span className={`text-sm font-bold font-mono ${activeEntry.netProduction.food >= 0 ? 'text-emerald-300' : 'text-crimson-400'}`}>
                        {activeEntry.netProduction.food >= 0 ? '+' : ''}{activeEntry.netProduction.food}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-amber-300 mb-1">
                        <Hammer className="w-3.5 h-3.5" /> Minéraux
                      </div>
                      <span className="text-sm font-bold text-slate-100 font-mono">
                        +{activeEntry.netProduction.minerals}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-purple-400 mb-1">
                        <Cpu className="w-3.5 h-3.5" /> R&D Flux
                      </div>
                      <span className="text-sm font-bold text-slate-100 font-mono">
                        +{activeEntry.netProduction.research}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Tactical Debriefing */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Débriefing de l&apos;IA Navigatrice ASTRA
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {activeEntry.aiDebriefing}
                  </p>
                </div>

                {/* Tactical Decisions Taken */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Arbitrages Tactiques & Politiques Exécutés ({activeEntry.decisionsMade.length})
                  </h4>
                  {activeEntry.decisionsMade.length === 0 ? (
                    <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-800 text-xs text-slate-500 text-center">
                      Aucune décision interactive majeure enregistrée au cours de ce cycle.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeEntry.decisionsMade.map((dec, i) => (
                        <div key={i} className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">
                                Phase {dec.phase}
                              </span>
                              <span className="text-xs font-bold text-slate-200">{dec.eventTitle}</span>
                            </div>
                            <div className="text-xs text-cyan-300 font-medium mt-1">
                              Choix : « {dec.choiceLabel} »
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                              {dec.outcomeSummary}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Planetary Constructions Completed */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Hammer className="w-3.5 h-3.5 text-amber-400" />
                    Chantiers & Bâtiments Livrés ce Cycle ({activeEntry.constructionsCompleted.length})
                  </h4>
                  {activeEntry.constructionsCompleted.length === 0 ? (
                    <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-800 text-xs text-slate-500 text-center">
                      Aucun chantier n&apos;a atteint son achèvement lors de ce cycle.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeEntry.constructionsCompleted.map((con, i) => (
                        <div key={i} className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-amber-300">
                              {con.buildingName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Colonie : <span className="text-slate-200">{con.colonyName}</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/40">
                            {con.bonusSummary}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Alerts / Incidents */}
                {activeEntry.incidentsAndAlerts.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-crimson-400" />
                      Alertes & Rapports d’Incident
                    </h4>
                    <div className="space-y-1.5">
                      {activeEntry.incidentsAndAlerts.map((inc, i) => (
                        <div key={i} className="p-2.5 rounded bg-red-950/20 border border-red-900/40 text-xs text-red-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {inc}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 text-slate-500 text-sm">
                Sélectionnez un cycle dans la colonne de gauche pour consulter son archive tactique.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
