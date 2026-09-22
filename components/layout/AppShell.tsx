'use client';

import React from 'react';
import { Navbar } from '../ui/Navbar';

export interface AppShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({ children, hideNav = false }) => {
  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-200 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background sci-fi grid overlay */}
      <div className="fixed inset-0 bg-cockpit-grid pointer-events-none opacity-40 z-0" />
      <div className="fixed inset-0 bg-radar-radial pointer-events-none z-0" />

      {/* Persistent Navbar */}
      {!hideNav && <Navbar />}

      {/* Main viewport */}
      <main className="relative z-10 flex-1 flex flex-col">
        {children}
      </main>

      {/* Bottom Global Status Bar */}
      <footer className="relative z-10 w-full bg-[#050914]/95 border-t border-cyan-500/20 px-4 py-1.5 font-mono text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            STATION ASTRA EN LIGNE
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">
            MOTEUR 4X: DETERMINISTE + GEMINI 3.8 FLASH
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">
            INVARIANT: <strong className="text-cyan-300">L₀ ≥ 0.0</strong>
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-500">
            CLOUD FIRESTORE PERSISTENCE ACTIVÉE
          </span>
        </div>
      </footer>
    </div>
  );
};
