'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Rocket, 
  Sliders, 
  Terminal, 
  HardDrive, 
  ShieldAlert, 
  User, 
  LogIn, 
  LogOut, 
  Volume2, 
  VolumeX,
  Radio,
  Sun,
  Moon,
  Columns,
  Monitor
} from 'lucide-react';
import { auth, handleFirestoreError, OperationType, db } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from './Button';
import { useThemeStore } from '@/lib/themeStore';
import { useAudioStore } from '@/lib/audioStore';
import { soundFx } from '@/lib/audio';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [signingIn, setSigningIn] = useState(false);

  const { theme, toggleTheme, initTheme } = useThemeStore();
  const { isMuted, toggleMute } = useAudioStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Sync user profile in Firestore
        try {
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              id: user.uid,
              email: user.email || 'commander@galaxia.space',
              displayName: user.displayName || 'Amiral de Flotte',
              title: 'Commandant Suprême',
              level: 1,
              gamesPlayed: 1,
              victories: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.warn('Error syncing user profile:', err);
        }
      }
    });
    return () => unsub();
  }, []);

  const handleSignIn = async () => {
    try {
      setSigningIn(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Sign-in error:', err);
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const navLinks = [
    { href: '/home', label: 'Launchpad', icon: Rocket },
    { href: '/config', label: 'Configuration T_0', icon: Sliders },
    { href: '/game', label: 'Cockpit Dual-Window', icon: Terminal },
    { href: '/hq', label: 'Sauvegardes & QG', icon: HardDrive },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050914]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Telemetry Indicator */}
        <Link href="/home" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded border border-cyan-400/40 bg-cyan-950/30 group-hover:border-cyan-300 transition-colors">
            <Radio className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-amber-300">
                GALAXIA
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                4X CORE
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 tracking-wider">
              SECTEUR ZÉRO • SIMULATION AMIRAL
            </p>
          </div>
        </Link>

        {/* Macro Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#0a1128]/70 px-2 py-1 rounded-sm border border-cyan-500/20">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/home' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm font-mono text-xs tracking-wider transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Cluster: Theme, Audio & Auth */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher Button (Graphisme Clair / Cockpit Dark) */}
          <button
            onClick={() => {
              soundFx.playClick();
              toggleTheme();
            }}
            title={theme === 'tactical-light' ? "Basculer vers le Cockpit Sombre Néon" : "Basculer vers le Graphisme Clair Tactique"}
            className={`px-2 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
              theme === 'tactical-light'
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40'
            }`}
          >
            {theme === 'tactical-light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden lg:inline text-[11px]">Clair</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden lg:inline text-[11px]">Sombre</span>
              </>
            )}
          </button>

          {/* Audio Engine Mute Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              toggleMute();
            }}
            title={isMuted ? "Activer l'audio tactique" : "Désactiver l'audio tactique"}
            className="p-1.5 rounded border border-slate-700/60 bg-slate-900/60 text-slate-400 hover:text-cyan-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2 bg-[#091124] px-2.5 py-1 rounded border border-cyan-500/30">
              <div className="w-6 h-6 rounded-full bg-cyan-800/40 flex items-center justify-center text-cyan-300 text-xs font-mono font-bold border border-cyan-400/30">
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'C'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-mono text-cyan-300 font-semibold leading-none truncate max-w-[120px]">
                  {currentUser.displayName || 'Commandant'}
                </p>
                <p className="text-[10px] font-mono text-slate-400 leading-tight">
                  Connecté Cloud
                </p>
              </div>
              <button
                onClick={handleSignOut}
                title="Déconnexion"
                className="ml-1 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              loading={signingIn}
              onClick={handleSignIn}
              className="border-cyan-500/30 text-xs"
            >
              <LogIn className="w-3.5 h-3.5 mr-1.5" />
              Connexion
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
