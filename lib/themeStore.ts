'use client';

import { create } from 'zustand';

export type TacticalTheme = 
  | 'iridescent-diamond'
  | 'cockpit-dark' 
  | 'tactical-light' 
  | 'amber-military' 
  | 'emerald-matrix' 
  | 'void-monochrome';

export interface ThemePreset {
  id: TacticalTheme;
  name: string;
  category: string;
  description: string;
  neonColor: string;
  accentBg: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'iridescent-diamond',
    name: 'Diamant & Pétrole Iridescent',
    category: 'Reflets Minéraux & Sci-Fi Cosmique',
    description: 'Palette raffinée aux reflets pourpres, magenta, saphir et émeraude sur obsidienne.',
    neonColor: '#c084fc',
    accentBg: '#0b1434'
  },
  {
    id: 'cockpit-dark',
    name: 'Cockpit Néon Cyan',
    category: 'Dark Sci-Fi Cybernétique',
    description: 'Esthétique standard de commandement ASTRA avec lueurs spectrales cyan #00f3ff.',
    neonColor: '#00f3ff',
    accentBg: '#070d1e'
  },
  {
    id: 'tactical-light',
    name: 'Graphisme Clair Tactique',
    category: 'Haute Lisibilité Diurne',
    description: 'Fond clair haute netteté, idéal pour l’analyse dense des bilans et des flux de données.',
    neonColor: '#0284c7',
    accentBg: '#f8fafc'
  },
  {
    id: 'amber-military',
    name: 'Ambre Solaire Militaire',
    category: 'Alerte Flotte & Défense',
    description: 'Ambiance de pont d’envol en alerte rouge avec reflets cuivrés et ambre solaire #ffb700.',
    neonColor: '#ffb700',
    accentBg: '#181206'
  },
  {
    id: 'emerald-matrix',
    name: 'Biosphère Émeraude Xéno',
    category: 'Recherche & Terraformation',
    description: 'Palette bio-luminescente émeraude #00ff88 inspirée des laboratoires de synthèse.',
    neonColor: '#00ff88',
    accentBg: '#061810'
  },
  {
    id: 'void-monochrome',
    name: 'Deep Void Furtif',
    category: 'Minimaliste & Éther',
    description: 'Nuances d’ardoise et de platine pour minimiser la signature thermique et visuelle.',
    neonColor: '#94a3b8',
    accentBg: '#0f172a'
  }
];

export interface ThemeState {
  theme: TacticalTheme;
  currentPreset: TacticalTheme;
  presets: ThemePreset[];
  scanlinesEnabled: boolean;
  radarGridEnabled: boolean;
  setTheme: (theme: TacticalTheme) => void;
  setPreset: (preset: TacticalTheme) => void;
  toggleScanlines: () => void;
  toggleRadarGrid: () => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'iridescent-diamond',
  currentPreset: 'iridescent-diamond',
  presets: THEME_PRESETS,
  scanlinesEnabled: false,
  radarGridEnabled: true,

  setTheme: (theme) => {
    set({ theme, currentPreset: theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('galaxia_tactical_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      
      const themeClasses = [
        'theme-iridescent-diamond',
        'theme-cockpit-dark',
        'theme-tactical-light',
        'theme-amber-military',
        'theme-emerald-matrix',
        'theme-void-monochrome'
      ];
      themeClasses.forEach(cls => document.documentElement.classList.remove(cls));
      document.documentElement.classList.add(`theme-${theme}`);
    }
  },

  setPreset: (preset) => {
    get().setTheme(preset);
  },

  toggleScanlines: () => {
    const next = !get().scanlinesEnabled;
    set({ scanlinesEnabled: next });
    if (typeof window !== 'undefined') {
      localStorage.setItem('galaxia_scanlines', String(next));
    }
  },

  toggleRadarGrid: () => {
    const next = !get().radarGridEnabled;
    set({ radarGridEnabled: next });
    if (typeof window !== 'undefined') {
      localStorage.setItem('galaxia_radar_grid', String(next));
    }
  },

  toggleTheme: () => {
    const current = get().theme;
    const next: TacticalTheme = current === 'tactical-light' ? 'iridescent-diamond' : 'tactical-light';
    get().setTheme(next);
  },

  initTheme: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('galaxia_tactical_theme') as TacticalTheme | null;
      const themeToSet = saved || 'iridescent-diamond';
      get().setTheme(themeToSet);

      const savedScan = localStorage.getItem('galaxia_scanlines');
      if (savedScan) {
        set({ scanlinesEnabled: savedScan === 'true' });
      }

      const savedGrid = localStorage.getItem('galaxia_radar_grid');
      if (savedGrid) {
        set({ radarGridEnabled: savedGrid !== 'false' });
      }
    }
  }
}));
