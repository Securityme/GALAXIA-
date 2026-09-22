export type InitMode = 'manual' | 'ai_assisted' | 'random';

export type EraId = 'post_cataclysm' | 'imperial_expansion' | 'nomad_ark' | 'phoenix_awakening';

export interface EraDefinition {
  id: EraId;
  title: string;
  subtitle: string;
  description: string;
  loreModifier: string;
  initialModifiers: {
    hull: number;
    credits: number;
    energy: number;
    morale: number;
    threatBonus: number;
  };
}

export interface LeaderTrait {
  id: string;
  name: string;
  category: 'psychological' | 'political' | 'tactical';
  description: string;
  passiveBonus: string;
  effects: {
    stat: string;
    value: number;
  }[];
}

export type CouncilPoleId = 'military' | 'scientific' | 'civilization' | 'economic' | 'diplomatic' | 'logistics';

export interface CouncilMember {
  poleId: CouncilPoleId;
  name: string;
  title: string;
  specialty: string;
  loyalty: number; // 0 - 100
  influence: number; // 0 - 100
  bonusSummary: string;
  avatarId?: string;
  quote?: string;
  cybernetics?: string;
  loreOrigin?: string;
  neonColor?: string;
}

export type DifficultyLevel = 'normal' | 'tactical' | 'hardcore';
export type ThreatLevel = 'low' | 'moderate' | 'hostile';

export interface WorldShipAstraConfig {
  name: string;
  hullMax: number;
  hullCurrent: number;
  structuralShields: number;
  fusionReactors: number; // In MW / output
  ftlCapacitors: number; // % charge
  combatSquadrons: number;
  miningDrones: number;
}

export interface PlanetaryColony {
  id: string;
  name: string;
  planetType: 'telluric_fertile' | 'oceanic' | 'volcanic_mineral' | 'frozen_tundra';
  orbitZone: 'inner_furnace' | 'goldilocks_habitable' | 'outer_belt';
  population: number;
  buildings: {
    id: string;
    name: string;
    type: 'mine' | 'agrodome' | 'defense_grid' | 'lab';
    level: number;
    outputSummary: string;
  }[];
  localProduction: {
    food: number;
    minerals: number;
    energy: number;
  };
}

export interface GameSetupConfig {
  mode: InitMode;
  superphase: 1 | 2 | 3 | 4;
  // Superphase 1
  eraId: EraId;
  unionName: string;
  loreCustomNotes: string;
  // Superphase 2
  leader: {
    name: string;
    title: string;
    avatarId?: string;
    traits: LeaderTrait[];
  };
  starterTechId?: string;
  astra: WorldShipAstraConfig;
  council: Record<CouncilPoleId, CouncilMember>;
  difficulty: DifficultyLevel;
  sectorZeroThreat: ThreatLevel;
  // Superphase 3
  macroAnchor: {
    quadrant: string;
    nebulaAffinity: string;
    sectorLabel: string;
  };
  microAnchor: {
    hostStarClass: string;
    arrivalOrbit: string;
  };
  initialColonies: PlanetaryColony[];
}
