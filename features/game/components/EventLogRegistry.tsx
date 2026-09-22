'use client';

import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import { useDataLogger, LogLevel } from '@/lib/dataLogger';
import { Button } from '@/components/ui/Button';
import { 
  FileCode, 
  Copy, 
  Check, 
  Cloud, 
  ShieldCheck, 
  Clock, 
  Download, 
  Trash2, 
  Filter, 
  Activity, 
  AlertTriangle,
  Terminal
} from 'lucide-react';

export const EventLogRegistry: React.FC = () => {
  const { eventLogs, getSealedStateString, resources } = useGameStore();
  const { saveCurrentGame, isSaving, saveSuccessMessage } = useFirebaseSync();
  const { logs, activeFilter, setFilter, clearLogs, exportJSON, exportCSV } = useDataLogger();

  const [activeView, setActiveView] = useState<'decision_ledger' | 'telemetry_stream'>('decision_ledger');
  const [copied, setCopied] = useState(false);

  const sealedJsonString = getSealedStateString();

  const handleCopy = () => {
    navigator.clipboard.writeText(sealedJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const data = exportJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `galaxia_data_logs_cycle_${resources.turn}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const data = exportCSV();
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `galaxia_telemetry_cycle_${resources.turn}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDataLogs = activeFilter === 'ALL' ? logs : logs.filter(l => l.level === activeFilter);

  return (
    <div className="space-y-4 font-mono text-xs">
      
      {/* Sub-view Switcher & Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded bg-[#091126] border border-cyan-500/25">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('decision_ledger')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              activeView === 'decision_ledger'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/30'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 inline mr-1.5" />
            REGISTRE DES DÉCISIONS
          </button>

          <button
            onClick={() => setActiveView('telemetry_stream')}
            className={`px-3 py-1.5 rounded font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'telemetry_stream'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_10px_rgba(0,255,136,0.2)]'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/30'
            }`}
          >
            <Activity className="w-3.5 h-3.5 inline text-emerald-400" />
            DATA LOGGING ({logs.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="text-[11px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copié !' : 'Copier <STATE_JSON>'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            loading={isSaving}
            onClick={() => saveCurrentGame()}
            className="text-[11px]"
          >
            <Cloud className="w-3.5 h-3.5 mr-1" />
            Sauvegarde Cloud
          </Button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          {saveSuccessMessage}
        </div>
      )}

      {/* VIEW 1: REGISTRE DES DÉCISIONS & BLOCS SCELLÉS */}
      {activeView === 'decision_ledger' && (
        <div className="space-y-3">
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {eventLogs.map((log, index) => (
              <div
                key={index}
                className="p-3 rounded bg-[#060c1d] border border-slate-700/50 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    TOUR {log.turn} • {log.eventTitle}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    L₀ INVARIANT CONFORME
                  </span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
                  Action : <span className="text-white font-semibold">{log.choiceMade}</span>
                </p>

                {/* Algebraic Delta Details */}
                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  <span className="text-slate-500">ΔR :</span>
                  {Object.entries(log.deltas || {}).map(([res, val]) => (
                    <span
                      key={res}
                      className={`px-1 rounded ${
                        (val as number) >= 0 ? 'text-emerald-400 bg-emerald-950/40' : 'text-rose-400 bg-rose-950/40'
                      }`}
                    >
                      {res} : {(val as number) >= 0 ? `+${val}` : val}
                    </span>
                  ))}
                  <span className="ml-auto text-[9px] text-slate-500 font-mono">
                    Checksum : {log.sealedStateChecksum}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Sealed JSON Raw Preview */}
          <div className="p-3 rounded bg-[#040712] border border-slate-800">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
              <span>BLOC SCELLÉ ACTUEL &lt;STATE_JSON&gt;</span>
              <span className="text-cyan-400 font-mono">Cycle {resources.turn} - Valide</span>
            </div>
            <pre className="text-[10px] text-cyan-200/90 font-mono bg-[#02040a] p-3 rounded overflow-x-auto max-h-[140px] border border-cyan-950">
              {sealedJsonString}
            </pre>
          </div>
        </div>
      )}

      {/* VIEW 2: DATA LOGGING TÉLÉMÉTRIQUE HAUTE RÉSOLUTION */}
      {activeView === 'telemetry_stream' && (
        <div className="space-y-3">
          {/* Controls Bar: Filters & Export */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded bg-[#050a18] border border-slate-800 text-[11px]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                Filtre :
              </span>
              {(['ALL', 'TACTICAL', 'INVARIANT_AUDIT', 'RESOURCE_DELTA', 'AI_TELEMETRY', 'CRITICAL'] as (LogLevel | 'ALL')[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilter(lvl)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                    activeFilter === lvl
                      ? 'bg-cyan-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadJSON}
                title="Exporter les logs au format JSON"
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center gap-1 border border-slate-700"
              >
                <Download className="w-3 h-3 text-cyan-400" />
                JSON
              </button>
              <button
                onClick={handleDownloadCSV}
                title="Exporter les logs au format CSV"
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center gap-1 border border-slate-700"
              >
                <Download className="w-3 h-3 text-emerald-400" />
                CSV
              </button>
              <button
                onClick={clearLogs}
                title="Effacer le tampon de logs"
                className="p-1 rounded bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Log Stream Output */}
          <div className="space-y-1.5 max-h-[440px] overflow-y-auto pr-1">
            {filteredDataLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-[#040816] rounded border border-slate-800">
                Aucun log enregistré correspondant au filtre sélectionné.
              </div>
            ) : (
              filteredDataLogs.map((item) => {
                const badgeColor = 
                  item.level === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-500/40' :
                  item.level === 'INVARIANT_AUDIT' ? (item.invariantPassed ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-rose-950 text-rose-300 border-rose-500/40') :
                  item.level === 'TACTICAL' ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' :
                  item.level === 'RESOURCE_DELTA' ? 'bg-amber-950 text-amber-300 border-amber-500/40' :
                  item.level === 'AI_TELEMETRY' ? 'bg-purple-950 text-purple-300 border-purple-500/40' :
                  'bg-slate-900 text-slate-400 border-slate-700';

                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded bg-[#040817] border border-slate-800/80 hover:border-cyan-500/30 text-[10px] space-y-1"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.2 rounded uppercase font-bold border text-[9px] ${badgeColor}`}>
                          {item.level}
                        </span>
                        <span className="text-cyan-400 font-semibold">{item.source}</span>
                        <span className="text-slate-500">C:{item.cycle} P:{item.phase}</span>
                      </div>
                      <span className="text-slate-500 font-mono">{item.timestamp.split('T')[1].split('.')[0]}</span>
                    </div>

                    <p className="text-slate-200 leading-relaxed font-sans text-[11px]">
                      {item.message}
                    </p>

                    {item.details && Object.keys(item.details).length > 0 && (
                      <details className="text-[10px] text-slate-400 mt-1 cursor-pointer">
                        <summary className="hover:text-cyan-300 text-slate-500">Détails de charge utile ({Object.keys(item.details).length} champs)</summary>
                        <pre className="mt-1 p-2 rounded bg-[#02050f] text-cyan-300/80 overflow-x-auto border border-slate-900">
                          {JSON.stringify(item.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
