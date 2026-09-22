import { CouncilPoleId, CouncilMember, LeaderTrait, WorldShipAstraConfig, PlanetaryColony, EraId, DifficultyLevel } from './config';

export interface GlobalResources {
  credits: number; // Invariant >= 0
  energy: number; // Invariant >= 0
  food: number; // Invariant >= 0
  minerals: number; // Invariant >= 0
  researchPoints: number; // Invariant >= 0 (Flux R&D)
  population: number; // Total souls
  morale: number; // 0 - 100
  stability: number; // 0 - 100
  sectorSecurity: number; // 0 - 100
  turn: number;
}

export type DecisionPhase = 1 | 2 | 3;

export interface TacticalChoice {
  id: string;
  label: string;
  description: string;
  category: 'tactical' | 'diplomatic' | 'economic' | 'defensive';
  deltaResources: {
    credits?: number;
    energy?: number;
    food?: number;
    minerals?: number;
    researchPoints?: number;
    population?: number;
    morale?: number;
    stability?: number;
    hull?: number;
    sectorSecurity?: number;
  };
  councilImpact?: {
    poleId: CouncilPoleId;
    loyaltyDelta: number;
  };
  outcomeNarrative: string;
}

export interface GameEvent {
  id: string;
  phase: DecisionPhase;
  title: string;
  source: string; // e.g. "Conseil Militaire", "IA Navigatrice ASTRA", "Sonde Deep Space"
  narrativeText: string;
  choices: TacticalChoice[];
  resolvedChoiceId?: string;
  resolvedAtTurn?: number;
}

export interface ResourceDeltaRecord {
  turn: number;
  timestamp: string;
  phase: DecisionPhase;
  eventTitle: string;
  choiceMade: string;
  deltas: Record<string, number>;
  invariantVerified: boolean; // L0 >= 0
  sealedStateChecksum: string;
}

export interface ConstructionProject {
  id: string;
  colonyId: string;
  colonyName: string;
  buildingDefId: string;
  buildingName: string;
  category: string;
  turnsRemaining: number;
  totalTurns: number;
  costPaid: {
    minerals: number;
    credits: number;
    energy?: number;
    researchPoints?: number;
  };
  projectedBonus: {
    minerals?: number;
    food?: number;
    energy?: number;
    security?: number;
    research?: number;
  };
  aiSynergyNarrative?: string;
  startedAtTurn: number;
}

export interface TurnLogEntry {
  turn: number;
  timestamp: string;
  era: EraId;
  resourcesSnapshot: GlobalResources;
  netProduction: {
    credits: number;
    energy: number;
    food: number;
    minerals: number;
    research: number;
  };
  decisionsMade: {
    phase: DecisionPhase;
    eventTitle: string;
    choiceLabel: string;
    outcomeSummary: string;
    deltas: Record<string, number>;
  }[];
  constructionsCompleted: {
    colonyName: string;
    buildingName: string;
    bonusSummary: string;
  }[];
  researchesCompleted: string[];
  incidentsAndAlerts: string[];
  invariantPassed: boolean;
  aiDebriefing: string;
}

export interface SealedStateJson {
  version: '1.0';
  sealedAt: string;
  turn: number;
  eraId: EraId;
  difficulty: DifficultyLevel;
  resources: GlobalResources;
  astra: WorldShipAstraConfig;
  council: Record<CouncilPoleId, CouncilMember>;
  colonies: PlanetaryColony[];
  constructionQueue?: ConstructionProject[];
  unlockedTechs: string[];
  leader: {
    name: string;
    title: string;
    avatarId?: string;
    traits: LeaderTrait[];
  };
  activePhase: DecisionPhase;
  phase1Resolved: boolean;
  phase2Resolved: boolean;
  phase3Resolved: boolean;
  turnLogs?: TurnLogEntry[];
}

export interface GameSimulationState {
  gameId: string;
  saveName: string;
  isGameOver: boolean;
  gameOverReason?: string;
  eraId: EraId;
  difficulty: DifficultyLevel;
  // Invariants and resources
  resources: GlobalResources;
  unlockedTechs: string[];
  leader: {
    name: string;
    title: string;
    avatarId?: string;
    traits: LeaderTrait[];
  };
  astra: WorldShipAstraConfig;
  council: Record<CouncilPoleId, CouncilMember>;
  colonies: PlanetaryColony[];
  constructionQueue: ConstructionProject[];
  // Turn sequencer & Multi-events per phase
  currentPhase: DecisionPhase;
  phase1Event: GameEvent | null;
  phase2Event: GameEvent | null;
  phase3Event: GameEvent | null;
  phase1Events: GameEvent[];
  phase2Events: GameEvent[];
  phase3Events: GameEvent[];
  activeEventIndex: number;
  isPhase1Completed: boolean;
  isPhase2Completed: boolean;
  isPhase3Completed: boolean;
  isGeneratingEvent: boolean;
  // History & Sealed Log
  eventLogs: ResourceDeltaRecord[];
  turnLogs: TurnLogEntry[];
  activeLogJson: string | null;
}
