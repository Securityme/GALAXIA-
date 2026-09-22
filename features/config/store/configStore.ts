import { create } from 'zustand';
import { 
  GameSetupConfig, 
  InitMode, 
  EraId, 
  LeaderTrait, 
  DifficultyLevel, 
  ThreatLevel 
} from '@/types/config';
import { 
  createDefaultConfig, 
  generateRandomConfig, 
  ERAS_CATALOG 
} from '../logic/configEngine';

interface ConfigStoreState {
  config: GameSetupConfig;
  isAiLoading: boolean;
  aiSuggestion: any | null;
  // Actions
  setMode: (mode: InitMode) => void;
  setSuperphase: (superphase: 1 | 2 | 3 | 4) => void;
  setEra: (eraId: EraId) => void;
  setUnionName: (name: string) => void;
  setLoreNotes: (notes: string) => void;
  setLeaderName: (name: string) => void;
  setLeaderTitle: (title: string) => void;
  setLeaderAvatar: (avatarId: string) => void;
  setStarterTech: (techId: string) => void;
  toggleLeaderTrait: (trait: LeaderTrait) => void;
  updateAstra: (partial: Partial<GameSetupConfig['astra']>) => void;
  updateCouncilLoyalty: (poleId: string, delta: number) => void;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  setThreatLevel: (threat: ThreatLevel) => void;
  setMacroAnchor: (quadrant: string, nebula: string) => void;
  setMicroAnchor: (star: string, orbit: string) => void;
  applyRandomSetup: () => void;
  setAiSuggestion: (data: any) => void;
  setIsAiLoading: (loading: boolean) => void;
  applyAiAssistedSetup: (aiData: any) => void;
  resetConfig: () => void;
}

export const useConfigStore = create<ConfigStoreState>((set) => ({
  config: createDefaultConfig(),
  isAiLoading: false,
  aiSuggestion: null,

  setMode: (mode) => set((state) => ({ config: { ...state.config, mode } })),
  setSuperphase: (superphase) => set((state) => ({ config: { ...state.config, superphase } })),
  
  setEra: (eraId) => set((state) => {
    const eraDef = ERAS_CATALOG.find((e) => e.id === eraId);
    if (!eraDef) return state;
    return {
      config: {
        ...state.config,
        eraId,
        astra: {
          ...state.config.astra,
          hullMax: eraDef.initialModifiers.hull + 200,
          hullCurrent: eraDef.initialModifiers.hull,
          fusionReactors: eraDef.initialModifiers.energy + 80
        }
      }
    };
  }),

  setUnionName: (unionName) => set((state) => ({ config: { ...state.config, unionName } })),
  setLoreNotes: (loreCustomNotes) => set((state) => ({ config: { ...state.config, loreCustomNotes } })),
  setLeaderName: (name) => set((state) => ({
    config: { ...state.config, leader: { ...state.config.leader, name } }
  })),
  setLeaderTitle: (title) => set((state) => ({
    config: { ...state.config, leader: { ...state.config.leader, title } }
  })),
  setLeaderAvatar: (avatarId) => set((state) => ({
    config: { ...state.config, leader: { ...state.config.leader, avatarId } }
  })),
  setStarterTech: (starterTechId) => set((state) => ({
    config: { ...state.config, starterTechId }
  })),

  toggleLeaderTrait: (trait) => set((state) => {
    const currentTraits = state.config.leader.traits;
    const exists = currentTraits.some((t) => t.id === trait.id);
    let updated: LeaderTrait[];
    if (exists) {
      if (currentTraits.length <= 1) return state; // Keep at least one trait
      updated = currentTraits.filter((t) => t.id !== trait.id);
    } else {
      if (currentTraits.length >= 3) {
        updated = [...currentTraits.slice(1), trait]; // Max 3 traits
      } else {
        updated = [...currentTraits, trait];
      }
    }
    return {
      config: {
        ...state.config,
        leader: {
          ...state.config.leader,
          traits: updated
        }
      }
    };
  }),

  updateAstra: (partial) => set((state) => ({
    config: {
      ...state.config,
      astra: { ...state.config.astra, ...partial }
    }
  })),

  updateCouncilLoyalty: (poleId, delta) => set((state) => {
    const member = (state.config.council as any)[poleId];
    if (!member) return state;
    const newLoyalty = Math.max(10, Math.min(100, member.loyalty + delta));
    return {
      config: {
        ...state.config,
        council: {
          ...state.config.council,
          [poleId]: { ...member, loyalty: newLoyalty }
        }
      }
    };
  }),

  setDifficulty: (difficulty) => set((state) => ({ config: { ...state.config, difficulty } })),
  setThreatLevel: (sectorZeroThreat) => set((state) => ({ config: { ...state.config, sectorZeroThreat } })),

  setMacroAnchor: (quadrant, nebulaAffinity) => set((state) => ({
    config: {
      ...state.config,
      macroAnchor: { ...state.config.macroAnchor, quadrant, nebulaAffinity }
    }
  })),

  setMicroAnchor: (hostStarClass, arrivalOrbit) => set((state) => ({
    config: {
      ...state.config,
      microAnchor: { ...state.config.microAnchor, hostStarClass, arrivalOrbit }
    }
  })),

  applyRandomSetup: () => set(() => ({
    config: generateRandomConfig()
  })),

  setAiSuggestion: (aiSuggestion) => set({ aiSuggestion }),
  setIsAiLoading: (isAiLoading) => set({ isAiLoading }),

  applyAiAssistedSetup: (aiData) => set((state) => {
    if (!aiData) return state;
    return {
      config: {
        ...state.config,
        unionName: aiData.recommendedUnionName || state.config.unionName,
        loreCustomNotes: aiData.recommendedLoreNotes || state.config.loreCustomNotes,
        macroAnchor: {
          ...state.config.macroAnchor,
          sectorLabel: aiData.recommendedSector || state.config.macroAnchor.sectorLabel
        }
      }
    };
  }),

  resetConfig: () => set(() => ({
    config: createDefaultConfig(),
    aiSuggestion: null
  }))
}));
