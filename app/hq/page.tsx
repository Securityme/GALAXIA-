'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { useFirebaseSync, CloudSaveMetadata } from '@/features/game/hooks/useFirebaseSync';
import { useGameStore } from '@/features/game/store/gameStore';
import { 
  HardDrive, 
  Cloud, 
  Play, 
  Trash2, 
  FileCode, 
  Trophy, 
  AlertCircle, 
  Check, 
  Clock, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function HQPage() {
  const router = useRouter();
  const { cloudSaves, loadingSaves, fetchSaves, deleteSave } = useFirebaseSync();
  const { loadFromSealedJson, resources } = useGameStore();

  const [importJsonModal, setImportJsonModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    fetchSaves();
    async function loadLeaderboard() {
      setLoadingLeaderboard(true);
      try {
        const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(10));
        const snap = await getDocs(q);
        const records: any[] = [];
        snap.forEach((d) => records.push(d.data()));
        setLeaderboard(records);
      } catch (e) {
        console.warn('Leaderboard fetch note:', e);
      } finally {
        setLoadingLeaderboard(false);
      }
    }
    loadLeaderboard();
  }, [fetchSaves]);

  const handleRestoreSave = (save: CloudSaveMetadata) => {
    const success = loadFromSealedJson(save.stateJson);
    if (success) {
      router.push('/game');
    } else {
      alert("Erreur lors de la désérialisation du bloc d'état scellé.");
    }
  };

  const handleImportJson = () => {
    setImportError(null);
    if (!jsonInput.trim()) {
      setImportError('Veuillez coller un bloc JSON valide.');
      return;
    }
    const success = loadFromSealedJson(jsonInput.trim());
    if (success) {
      setImportJsonModal(false);
      router.push('/game');
    } else {
      setImportError("Format JSON non conforme à la spécification <STATE_JSON> de GALAXIA.");
    }
  };

  return (
    <AppShell>
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 lg:py-8 space-y-6 font-mono text-xs">
        
        {/* HQ Header */}
        <div className="p-4 rounded-md bg-[#050b1a] border border-cyan-500/25 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-cyan-400" />
              QUARTIER GÉNÉRAL : SAUVEGARDES &amp; PERSISTANCE CLOUD
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Gestionnaire des blocs d&apos;état scellés &lt;STATE_JSON&gt; et archives de commandement.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setImportJsonModal(true)}
            >
              <FileCode className="w-3.5 h-3.5 mr-1.5" />
              Importer &lt;STATE_JSON&gt;
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/game')}
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Rejoindre Cockpit
            </Button>
          </div>
        </div>

        {/* Saves Grid & Leaderboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Saved Games List (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Cloud className="w-4 h-4 text-cyan-400" />
                ARCHIVES SCELLÉES DISPONIBLES ({cloudSaves.length})
              </h2>
              <button
                onClick={() => fetchSaves()}
                className="text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                Rafraîchir
              </button>
            </div>

            {loadingSaves ? (
              <div className="p-8 text-center text-slate-400">
                Interrogation des collections Firestore...
              </div>
            ) : cloudSaves.length === 0 ? (
              <div className="p-8 rounded bg-[#060c1e] border border-slate-800 text-center space-y-3">
                <HardDrive className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-slate-400">Aucune archive scellée enregistrée pour le moment.</p>
                <p className="text-[10px] text-slate-500">
                  Lancez une partie dans la configuration T_0 pour générer votre première sauvegarde.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push('/config')}
                >
                  Configurer une Partie
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {cloudSaves.map((save) => (
                  <div
                    key={save.id}
                    className="p-3.5 rounded bg-[#060c1e] border border-cyan-500/20 hover:border-cyan-400/40 transition-colors flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-cyan-300 text-xs">{save.saveName}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                          {save.eraId}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-3">
                        <span>Cycle {save.turn}</span>
                        <span>•</span>
                        <span>Amiral : {save.leaderName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(save.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="emerald"
                        size="sm"
                        onClick={() => handleRestoreSave(save)}
                        className="text-xs font-bold"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Charger
                      </Button>

                      <button
                        onClick={() => deleteSave(save.id)}
                        title="Supprimer la sauvegarde"
                        className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leaderboard / High Scores (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="border-b border-cyan-500/20 pb-2">
              <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                CLASSEMENT GALACTIQUE MONDIAL
              </h2>
            </div>

            <div className="p-3.5 rounded bg-[#060c1e] border border-amber-500/20 space-y-2">
              {loadingLeaderboard ? (
                <p className="text-slate-400 text-center py-4">Chargement du panthéon...</p>
              ) : leaderboard.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-[11px] space-y-1">
                  <p>Aucun record scellé encore validé.</p>
                  <p className="text-[10px] text-slate-500">
                    Complétez des cycles en mode Tactique pour y inscrire votre nom.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry, idx) => (
                    <div
                      key={entry.id || idx}
                      className="p-2 rounded bg-[#030612] border border-slate-800 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400 w-4">#{idx + 1}</span>
                        <div>
                          <div className="text-slate-200 font-semibold">{entry.commanderName}</div>
                          <div className="text-[9px] text-slate-500">{entry.eraTitle}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-cyan-300">{entry.score} pts</div>
                        <div className="text-[9px] text-slate-500">{entry.turnsSurvived} cycles</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal: Import Raw JSON */}
        <Modal
          isOpen={importJsonModal}
          onClose={() => setImportJsonModal(false)}
          title="RESTAURATION DIRECTE <STATE_JSON>"
          subtitle="Injection d'une charge utile scellée de simulation"
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Collez ci-dessous le bloc d&apos;état scellé au format JSON exporté depuis la Fenêtre 2 du Cockpit.
            </p>

            <textarea
              rows={10}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{ "version": "1.0", "turn": 5, "resources": { ... } }'
              className="w-full bg-[#030612] border border-cyan-500/30 rounded p-3 text-cyan-300 font-mono text-[11px] focus:outline-none focus:border-cyan-400"
            />

            {importError && (
              <div className="p-2 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                {importError}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <Button variant="ghost" onClick={() => setImportJsonModal(false)}>
                Annuler
              </Button>
              <Button variant="emerald" onClick={handleImportJson}>
                <Check className="w-3.5 h-3.5 mr-1" />
                Valider &amp; Lancer la Simulation
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    </AppShell>
  );
}
