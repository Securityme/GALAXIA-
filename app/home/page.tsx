'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { 
  Rocket, 
  Terminal, 
  HardDrive, 
  Sliders, 
  Compass, 
  ShieldAlert, 
  Users, 
  Radio, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Settings,
  History
} from 'lucide-react';
import { ERAS_CATALOG } from '@/features/config/logic/configEngine';
import { useGameStore } from '@/features/game/store/gameStore';
import { SystemConfigModal } from '@/components/ui/SystemConfigModal';
import { TurnLogModal } from '@/features/game/components/TurnLogModal';

export default function HomePage() {
  const { resources, saveName, eraId } = useGameStore();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isTurnLogOpen, setIsTurnLogOpen] = useState(false);

  return (
    <AppShell>
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 lg:py-12 space-y-8 font-mono">
        
        {/* Cockpit Amiral Hero Section */}
        <div className="p-6 lg:p-10 rounded-md bg-[#050b1a]/95 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,243,255,0.08)] relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              DIRECTOIRE DE L’UNION STELLAIRE • SECTEUR ZÉRO
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-slate-100">
              COMMANDEMENT NAVAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-amber-300">GALAXIA</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Prenez les commandes de l&apos;arche métropolitaine <strong className="text-cyan-300">ASTRA</strong>. Administrez l&apos;Union Galactique, arbitrez les tensions du Conseil Exécutif à 6 pôles, colonisez des mondes telluriques et survivez aux menaces cosmiques orchestrées par l&apos;IA <strong className="text-amber-300">Gemini 3.8 Flash</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link href="/config">
                <Button variant="primary" size="lg" glow className="text-sm font-bold">
                  <Sliders className="w-4 h-4 mr-2" />
                  Nouvelle Campagne T_0
                </Button>
              </Link>

              <Link href="/game">
                <Button variant="emerald" size="lg" className="text-sm font-bold">
                  <Terminal className="w-4 h-4 mr-2" />
                  Reprendre la Simulation (Cycle {resources.turn})
                </Button>
              </Link>

              <Link href="/hq">
                <Button variant="secondary" size="lg" className="text-sm">
                  <HardDrive className="w-4 h-4 mr-2" />
                  Sauvegardes Cloud
                </Button>
              </Link>

              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => setIsConfigOpen(true)}
                className="text-sm border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/40"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configuration Système
              </Button>

              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => setIsTurnLogOpen(true)}
                className="text-sm border-amber-500/30 text-amber-300 hover:bg-amber-950/40"
              >
                <History className="w-4 h-4 mr-2" />
                Turn Log ({resources.turn})
              </Button>
            </div>
          </div>
        </div>

        {/* 3 Core Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded bg-[#060c1e] border border-cyan-500/20 hover:border-cyan-400/50 transition-colors">
            <div className="w-9 h-9 rounded bg-cyan-950/60 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-3">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-2">
              Architecture Dual-Window
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Télémétrie universelle en lecture seule (Gouvernance, ASTRA, Colonies) synchronisée avec le Moteur Décisionnel à choix discrets. Zéro saisie libre, 100% tactique.
            </p>
          </div>

          <div className="p-5 rounded bg-[#060c1e] border border-amber-500/20 hover:border-amber-400/50 transition-colors">
            <div className="w-9 h-9 rounded bg-amber-950/60 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-2">
              MJ Procédural Gemini 3.8
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Génération d’événements narratifs riches sous contraintes déterministes. Chaque décision applique des variations algébriques $\Delta R$ certifiant l’invariant $L_0 \ge 0.0$.
            </p>
          </div>

          <div className="p-5 rounded bg-[#060c1e] border border-emerald-500/20 hover:border-emerald-400/50 transition-colors">
            <div className="w-9 h-9 rounded bg-emerald-950/60 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-3">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider mb-2">
              Persistance &lt;STATE_JSON&gt;
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              États de partie intègres scellés à chaque tour. Synchronisation Cloud Firestore et export immédiat pour assurer la continuité de la chaîne de commandement.
            </p>
          </div>
        </div>

        {/* 4 Eras Catalog Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              ÉPOQUES HISTORIQUES DE SIMULATION (SUPERPHASE 1)
            </h2>
            <Link href="/config" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Configurer une amorce <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ERAS_CATALOG.map((era) => (
              <div key={era.id} className="p-4 rounded bg-[#070e24] border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-200 mb-0.5">{era.title}</h3>
                  <p className="text-[10px] text-cyan-400 mb-2">{era.subtitle}</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-3">{era.description}</p>
                </div>
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                  <span className="text-emerald-400">Coque : {era.initialModifiers.hull} HP</span> •{' '}
                  <span className="text-amber-400">Crédits : {era.initialModifiers.credits} ₢</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modals */}
        <SystemConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
        <TurnLogModal isOpen={isTurnLogOpen} onClose={() => setIsTurnLogOpen(false)} />
      </div>
    </AppShell>
  );
}
