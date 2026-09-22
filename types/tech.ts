import { CouncilPoleId } from './config';

export type TechTier = 1 | 2 | 3;

export interface TechCost {
  credits?: number;
  minerals?: number;
  energy?: number;
  food?: number;
  sciencePoints?: number;
}

export interface TechEffects {
  hullMax?: number;
  structuralShields?: number;
  combatSquadrons?: number;
  securityBonus?: number;
  energyBonus?: number;
  foodBonus?: number;
  mineralsBonus?: number;
  creditsBonus?: number;
  moraleBonus?: number;
  stabilityBonus?: number;
  ftlEfficiency?: number;
  specialPerk?: string;
}

export interface TechnologyItem {
  id: string;
  name: string;
  poleId: CouncilPoleId;
  tier: TechTier;
  prerequisites: string[];
  baseCost: TechCost;
  description: string;
  lore: string;
  iconName: string;
  effects: TechEffects;
  isSecretBranch?: boolean;
  discoveryCondition?: string;
  superphaseEligible?: boolean; // Can be chosen in Superphase 2 as initial doctrine
}

export interface UnlockedTechState {
  techId: string;
  unlockedAtTurn: number;
  source: 'superphase_starter' | 'research' | 'xeno_discovery' | 'ai_breakthrough';
}
