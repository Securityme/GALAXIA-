'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Radio, 
  ShieldCheck, 
  Terminal, 
  ArrowRight, 
  Activity, 
  UserCheck, 
  Key, 
  Zap, 
  CheckCircle2, 
  Cpu,
  LogIn,
  Sliders,
  Sparkles
} from 'lucide-react';
import { testFirestoreConnection } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/features/game/store/gameStore';
import { soundFx } from '@/lib/audio';

export default function BootloaderPage() {
  const router = useRouter();
  const leader = useGameStore((s) => s.leader);
  
  // Phase 1: Boot animation (0 to 100)
  // Phase 2: Login window (manual or auto)
  const [bootPhase, setBootPhase] = useState<'booting' | 'login_window'>('booting');
  const [bootProgress, setBootProgress] = useState(0);
  const [statusText, setStatusText] = useState('Démarrage des sous-systèmes du Noyau L0...');
  
  const [diagnostics, setDiagnostics] = useState<{
    kernelReady: boolean;
    firebaseConnected: boolean;
    geminiAgentReady: boolean;
  }>({
    kernelReady: false,
    firebaseConnected: false,
    geminiAgentReady: false
  });

  // Login form state
  const [loginMode, setLoginMode] = useState<'auto' | 'manual'>('auto');
  const [commanderCallsign, setCommanderCallsign] = useState(leader.name || 'Amiral Jean-Luc Kaelen');
  const [accessKey, setAccessKey] = useState('ASTRA-SEC-09');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  useEffect(() => {
    // Progress increment simulation
    const interval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setBootPhase('login_window');
          soundFx.playPhaseTransition();
          return 100;
        }
        const next = prev + 12;
        if (next > 30 && !diagnostics.kernelReady) {
          setDiagnostics((d) => ({ ...d, kernelReady: true }));
          setStatusText('Vérification de l’intégrité algébrique L0 >= 0...');
        }
        if (next > 65 && !diagnostics.firebaseConnected) {
          testFirestoreConnection().then((ok) => {
            setDiagnostics((d) => ({ ...d, firebaseConnected: ok }));
          });
          setStatusText('Établissement du canal sécurisé Firestore & Télémétrie...');
        }
        if (next > 85 && !diagnostics.geminiAgentReady) {
          setDiagnostics((d) => ({ ...d, geminiAgentReady: true }));
          setStatusText('Calibrage du Maître de Jeu IA Gemini 3.8 Flash...');
        }
        return next > 100 ? 100 : next;
      });
    }, 140);

    return () => clearInterval(interval);
  }, [diagnostics]);

  const handleEnterLaunchpad = () => {
    soundFx.playClick();
    router.push('/home');
  };

  return (
    <div className="relative min-h-screen bg-[#02050e] text-slate-200 flex flex-col items-center justify-center p-4 font-mono select-none overflow-hidden">
      {/* Background sci-fi grid & radar ambiance */}
      <div className="fixed inset-0 bg-cockpit-grid pointer-events-none opacity-40 z-0" />
      <div className="fixed inset-0 bg-radar-radial pointer-events-none z-0" />

      {/* Main Terminal Window */}
      <div className="relative z-10 w-full max-w-xl p-6 sm:p-8 rounded-xl bg-[#050a18]/95 border border-cyan-500/40 shadow-[0_0_50px_rgba(0,243,255,0.15)] backdrop-blur-md">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black uppercase tracking-widest text-cyan-300">
                GALAXIA • SÉQUENCE D’AMORCE
              </h1>
              <span className="text-[10px] text-slate-400">
                TERMINAL DE COMMANDEMENT NAVAL • SECTEUR ZÉRO
              </span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
            SYSTÈME v3.8
          </span>
        </div>

        {bootPhase === 'booting' ? (
          /* Séquence d'Amorce & Diagnostic Progress */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 animate-spin" />
                  INITIALISATION DU COCKPIT
                </span>
                <span className="text-cyan-300 font-mono font-bold">{bootProgress}%</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-900 border border-cyan-950 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-amber-300 transition-all duration-150 rounded-full"
                  style={{ width: `${bootProgress}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 font-mono tracking-tight">
                {statusText}
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between p-2.5 rounded bg-[#030612] border border-slate-800">
                <span className="text-xs flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Noyau Déterministe & Invariant L₀
                </span>
                <span className={`text-[10px] font-bold ${diagnostics.kernelReady ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {diagnostics.kernelReady ? 'INITIALISÉ' : 'VÉRIFICATION...'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[#030612] border border-slate-800">
                <span className="text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Persistance Cloud Firestore & Auth
                </span>
                <span className={`text-[10px] font-bold ${diagnostics.firebaseConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {diagnostics.firebaseConnected ? 'SYNCHRONISÉ' : 'CONNEXION...'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[#030612] border border-slate-800">
                <span className="text-xs flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Maître de Jeu Gemini 3.8 Flash
                </span>
                <span className={`text-[10px] font-bold ${diagnostics.geminiAgentReady ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {diagnostics.geminiAgentReady ? 'CALIBRÉ' : 'ATTENTE...'}
                </span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                id="skip-boot-btn"
                onClick={() => setBootPhase('login_window')}
                className="text-xs text-slate-500 hover:text-cyan-400 transition-colors underline underline-offset-4"
              >
                Passer la séquence d&apos;amorce vers la connexion
              </button>
            </div>
          </div>
        ) : (
          /* Fenêtre de Connexion (Manuel ou Auto) */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Mode selection tabs */}
            <div className="flex rounded-lg bg-slate-900/80 p-1 border border-slate-800">
              <button
                id="login-mode-auto-btn"
                onClick={() => setLoginMode('auto')}
                className={`flex-1 py-2 text-xs font-bold rounded flex items-center justify-center gap-2 transition-all ${
                  loginMode === 'auto'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Connexion Automatique (Amiral)
              </button>
              <button
                id="login-mode-manual-btn"
                onClick={() => setLoginMode('manual')}
                className={`flex-1 py-2 text-xs font-bold rounded flex items-center justify-center gap-2 transition-all ${
                  loginMode === 'manual'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Connexion Manuelle (Accréditation)
              </button>
            </div>

            {loginMode === 'auto' ? (
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-900/60 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-bold">
                    JK
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase">{commanderCallsign}</h3>
                    <p className="text-[11px] text-cyan-400">Commandant Suprême du Vaisseau-Monde ASTRA I</p>
                  </div>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    AUTORISÉ
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-cyan-950/60 pt-2">
                  Session locale scellée détectée. Vos privilèges de commandement naval sur le Secteur Zéro sont immédiatement reconnus.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Indicatif de l&apos;Officier
                  </label>
                  <input
                    type="text"
                    value={commanderCallsign}
                    onChange={(e) => setCommanderCallsign(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-cyan-200 focus:outline-none focus:border-cyan-500"
                    placeholder="ex: Amiral Vance"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Clé de Déchiffrement / Accréditation
                  </label>
                  <input
                    type="password"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-500"
                    placeholder="Code de sécurité..."
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-400 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSaveEnabled}
                    onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 bg-slate-900"
                  />
                  Mémoriser ces accréditations pour les prochains cycles
                </label>
              </div>
            )}

            {/* Launchpad Entry Button */}
            <div className="pt-2">
              <Button
                id="enter-main-menu-btn"
                variant="primary"
                size="lg"
                glow
                onClick={handleEnterLaunchpad}
                className="w-full justify-center text-xs sm:text-sm font-black tracking-wider uppercase py-3.5"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Accéder au Menu Principal (Launchpad)
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
