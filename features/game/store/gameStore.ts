import { create } from 'zustand';
import { produce } from 'immer';
import { 
  GameSimulationState, 
  DecisionPhase, 
  GameEvent, 
  TacticalChoice, 
  ResourceDeltaRecord, 
  SealedStateJson,
  ConstructionProject,
  TurnLogEntry
} from '@/types/game';
import { GameSetupConfig } from '@/types/config';
import { TechCost, TechEffects } from '@/types/tech';
import { ERAS_CATALOG } from '@/features/config/logic/configEngine';
import { 
  getBuildingById, 
  calculateDynamicBuildingCost, 
  calculateDynamicBuildingOutput 
} from '@/features/database/planetaryBuildingsCatalog';
import { logger } from '@/lib/dataLogger';
import { soundFx } from '@/lib/audio';

interface GameStoreState extends GameSimulationState {
  // Initialization & Load
  initFromConfig: (config: GameSetupConfig) => void;
  loadFromSealedJson: (sealedStr: string) => boolean;
  
  // Phase and multi-events
  setEvent: (phase: DecisionPhase, event: GameEvent) => void;
  setPhaseEvents: (phase: DecisionPhase, events: GameEvent[]) => void;
  nextEventInPhase: () => void;
  setIsGeneratingEvent: (generating: boolean) => void;
  resolveChoice: (phase: DecisionPhase, choice: TacticalChoice) => void;
  advanceToNextPhase: () => void;
  advanceTurn: () => void;
  
  // Technology & Research
  unlockTechnology: (techId: string, cost: TechCost, effects: TechEffects) => void;

  // Direct tactical adjustments & Colony Management from Database
  adjustAstraPower: (subsystem: 'shields' | 'reactors' | 'ftl', amount: number) => void;
  upgradeColonyBuilding: (colonyId: string, buildingId: string) => void;
  constructBuildingOnColony: (colonyId: string, buildingDefId: string) => boolean;
  cancelConstructionProject: (projectId: string) => void;
  
  // Data extraction & Turn Logs
  getSealedStateJson: () => SealedStateJson;
  getSealedStateString: () => string;
}

const initialGameState: GameSimulationState = {
  gameId: 'galaxia-session-1',
  saveName: 'Partie Alpha - Secteur Zéro',
  isGameOver: false,
  gameOverReason: undefined,
  eraId: 'post_cataclysm',
  difficulty: 'tactical',
  resources: {
    credits: 300,
    energy: 220,
    food: 180,
    minerals: 240,
    researchPoints: 80,
    population: 14500,
    morale: 65,
    stability: 75,
    sectorSecurity: 60,
    turn: 1
  },
  unlockedTechs: ['mil_gauss_cannons'],
  leader: {
    name: 'Amiral Jean-Luc Kaelen',
    title: 'Commandant Suprême',
    avatarId: 'leader_vance',
    traits: []
  },
  astra: {
    name: 'ASTRA I - L’Éternité',
    hullMax: 1000,
    hullCurrent: 850,
    structuralShields: 80,
    fusionReactors: 350,
    ftlCapacitors: 95,
    combatSquadrons: 4,
    miningDrones: 8
  },
  council: {} as any,
  colonies: [],
  constructionQueue: [],
  currentPhase: 1,
  phase1Event: null,
  phase2Event: null,
  phase3Event: null,
  phase1Events: [],
  phase2Events: [],
  phase3Events: [],
  activeEventIndex: 0,
  isPhase1Completed: false,
  isPhase2Completed: false,
  isPhase3Completed: false,
  isGeneratingEvent: false,
  eventLogs: [],
  turnLogs: [],
  activeLogJson: null
};

export const useGameStore = create<GameStoreState>((set, get) => ({
  ...initialGameState,

  initFromConfig: (config: GameSetupConfig) => {
    const eraDef = ERAS_CATALOG.find((e) => e.id === config.eraId);
    const initialModifiers = eraDef?.initialModifiers || {
      hull: 850,
      credits: 300,
      energy: 220,
      morale: 60,
      threatBonus: 10
    };

    const initialRes = {
      credits: initialModifiers.credits,
      energy: initialModifiers.energy,
      food: 150,
      minerals: 200,
      researchPoints: 80,
      population: 12000,
      morale: initialModifiers.morale,
      stability: 70,
      sectorSecurity: 70 - initialModifiers.threatBonus,
      turn: 1
    };

    const newLogs: ResourceDeltaRecord[] = [
      {
        turn: 1,
        timestamp: new Date().toISOString(),
        phase: 1,
        eventTitle: `Amorce de la Simulation T_0 (${eraDef?.title || 'Exode'})`,
        choiceMade: `Déploiement de l'ASTRA dans le ${config.macroAnchor.sectorLabel}`,
        deltas: {
          credits: initialRes.credits,
          energy: initialRes.energy,
          food: initialRes.food,
          minerals: initialRes.minerals
        },
        invariantVerified: true,
        sealedStateChecksum: `SEAL-${Date.now().toString(36).toUpperCase()}`
      }
    ];

    // Log initialization to dataLogger
    logger.tactical(
      'SystemInit',
      `Exode initialisé pour l'Union [${config.unionName}]. Époque : ${config.eraId}, Difficulté : ${config.difficulty}`,
      { initialRes, leader: config.leader.name }
    );

    set(
      produce((draft: GameStoreState) => {
        draft.gameId = `galaxia-${Date.now()}`;
        draft.saveName = `${config.unionName} - Cycle 1`;
        draft.eraId = config.eraId;
        draft.difficulty = config.difficulty;
        draft.resources = initialRes;
        draft.unlockedTechs = config.starterTechId ? [config.starterTechId] : ['mil_gauss_cannons'];
        draft.leader = config.leader;
        draft.astra = config.astra;
        draft.council = config.council;
        draft.colonies = config.initialColonies;
        draft.currentPhase = 1;
        draft.isPhase1Completed = false;
        draft.isPhase2Completed = false;
        draft.isPhase3Completed = false;
        draft.phase1Event = null;
        draft.phase2Event = null;
        draft.phase3Event = null;
        draft.eventLogs = newLogs;
      })
    );
  },

  loadFromSealedJson: (sealedStr: string): boolean => {
    try {
      const parsed = JSON.parse(sealedStr) as SealedStateJson;
      if (!parsed.resources || !parsed.astra || !parsed.turn) {
        return false;
      }

      set(
        produce((draft: GameStoreState) => {
          draft.resources = parsed.resources;
          draft.astra = parsed.astra;
          draft.council = parsed.council;
          draft.colonies = parsed.colonies;
          draft.leader = parsed.leader;
          draft.unlockedTechs = parsed.unlockedTechs || ['mil_gauss_cannons'];
          draft.currentPhase = parsed.activePhase || 1;
          draft.isPhase1Completed = parsed.phase1Resolved || false;
          draft.isPhase2Completed = parsed.phase2Resolved || false;
          draft.isPhase3Completed = parsed.phase3Resolved || false;
          draft.eraId = parsed.eraId || 'post_cataclysm';
          draft.difficulty = parsed.difficulty || 'tactical';
        })
      );

      logger.tactical('StateLoad', `Restauration de l'état scellé avec succès. Cycle ${parsed.turn}`);
      return true;
    } catch {
      logger.critical('StateLoad', 'Échec du parsing JSON du bloc scellé');
      return false;
    }
  },

  setEvent: (phase, event) => {
    set(
      produce((draft: GameStoreState) => {
        if (phase === 1) {
          draft.phase1Event = event;
          draft.phase1Events = [event];
        } else if (phase === 2) {
          draft.phase2Event = event;
          draft.phase2Events = [event];
        } else if (phase === 3) {
          draft.phase3Event = event;
          draft.phase3Events = [event];
        }
        draft.activeEventIndex = 0;
      })
    );
  },

  setPhaseEvents: (phase, events) => {
    set(
      produce((draft: GameStoreState) => {
        if (phase === 1) {
          draft.phase1Events = events;
          draft.phase1Event = events[0] || null;
        } else if (phase === 2) {
          draft.phase2Events = events;
          draft.phase2Event = events[0] || null;
        } else if (phase === 3) {
          draft.phase3Events = events;
          draft.phase3Event = events[0] || null;
        }
        draft.activeEventIndex = 0;
      })
    );
  },

  nextEventInPhase: () => {
    set(
      produce((draft: GameStoreState) => {
        const p = draft.currentPhase;
        const currentEvents = p === 1 ? draft.phase1Events : p === 2 ? draft.phase2Events : draft.phase3Events;
        const nextIdx = draft.activeEventIndex + 1;
        if (nextIdx < currentEvents.length) {
          draft.activeEventIndex = nextIdx;
          if (p === 1) draft.phase1Event = currentEvents[nextIdx];
          else if (p === 2) draft.phase2Event = currentEvents[nextIdx];
          else if (p === 3) draft.phase3Event = currentEvents[nextIdx];
        } else {
          // All events in this phase resolved
          if (p === 1) draft.isPhase1Completed = true;
          if (p === 2) draft.isPhase2Completed = true;
          if (p === 3) draft.isPhase3Completed = true;
        }
      })
    );
  },

  setIsGeneratingEvent: (generating) => {
    set({ isGeneratingEvent: generating });
  },

  resolveChoice: (phase, choice) => {
    const state = get();
    const currentRes = { ...state.resources };
    const currentAstra = { ...state.astra };

    // Apply delta resources respecting L0 >= 0 invariant
    if (choice.deltaResources) {
      const deltas = choice.deltaResources;
      if (deltas.credits) currentRes.credits = Math.max(0, currentRes.credits + deltas.credits);
      if (deltas.energy) currentRes.energy = Math.max(0, currentRes.energy + deltas.energy);
      if (deltas.food) currentRes.food = Math.max(0, currentRes.food + deltas.food);
      if (deltas.minerals) currentRes.minerals = Math.max(0, currentRes.minerals + deltas.minerals);
      if (deltas.researchPoints) currentRes.researchPoints = Math.max(0, currentRes.researchPoints + deltas.researchPoints);
      if (deltas.population) currentRes.population = Math.max(100, currentRes.population + deltas.population);
      if (deltas.morale) currentRes.morale = Math.max(0, Math.min(100, currentRes.morale + deltas.morale));
      if (deltas.stability) currentRes.stability = Math.max(0, Math.min(100, currentRes.stability + deltas.stability));
      if (deltas.sectorSecurity) currentRes.sectorSecurity = Math.max(0, Math.min(100, currentRes.sectorSecurity + deltas.sectorSecurity));
      if (deltas.hull) currentAstra.hullCurrent = Math.max(0, Math.min(currentAstra.hullMax, currentAstra.hullCurrent + deltas.hull));
    }

    const activeEvent = phase === 1 ? state.phase1Event : phase === 2 ? state.phase2Event : state.phase3Event;
    const isL0Passed = currentRes.credits >= 0 && currentRes.energy >= 0 && currentRes.food >= 0 && currentRes.minerals >= 0;

    const logRecord: ResourceDeltaRecord = {
      turn: currentRes.turn,
      timestamp: new Date().toISOString(),
      phase,
      eventTitle: activeEvent?.title || `Phase ${phase} Action`,
      choiceMade: choice.label,
      deltas: choice.deltaResources as any,
      invariantVerified: isL0Passed,
      sealedStateChecksum: `L0-VALID-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    // Check if more events remain in this phase
    const phaseEvents = phase === 1 ? state.phase1Events : phase === 2 ? state.phase2Events : state.phase3Events;
    const hasMoreEvents = phaseEvents.length > 1 && state.activeEventIndex + 1 < phaseEvents.length;

    // Immer-based state mutation
    set(
      produce((draft: GameStoreState) => {
        draft.resources = currentRes;
        draft.astra = currentAstra;
        if (hasMoreEvents) {
          const nextIdx = draft.activeEventIndex + 1;
          draft.activeEventIndex = nextIdx;
          if (phase === 1) draft.phase1Event = phaseEvents[nextIdx];
          else if (phase === 2) draft.phase2Event = phaseEvents[nextIdx];
          else if (phase === 3) draft.phase3Event = phaseEvents[nextIdx];
        } else {
          if (phase === 1) draft.isPhase1Completed = true;
          if (phase === 2) draft.isPhase2Completed = true;
          if (phase === 3) draft.isPhase3Completed = true;
        }
        draft.eventLogs = [logRecord, ...draft.eventLogs];
      })
    );

    // Audio & Data Logger
    soundFx.playClick();
    logger.tactical(
      'DecisionEngine',
      `Choix validé en Phase ${phase} : "${choice.label}"`,
      { eventTitle: activeEvent?.title, deltas: choice.deltaResources, invariantPassed: isL0Passed }
    );
    logger.invariantAudit('L0_Invariant', `Audit L0 >= 0 : ${isL0Passed ? 'CONFORME' : 'VIOLATION'}`, isL0Passed, {
      credits: currentRes.credits,
      energy: currentRes.energy,
      food: currentRes.food,
      minerals: currentRes.minerals
    });
  },

  advanceToNextPhase: () => {
    const { currentPhase } = get();
    soundFx.playPhaseTransition();
    if (currentPhase === 1) {
      set({ currentPhase: 2, activeEventIndex: 0 });
      logger.info('PhaseSequencer', 'Transition Phase 1 (Récit) vers Phase 2 (Équilibres ASTRA & Colonies)');
    } else if (currentPhase === 2) {
      set({ currentPhase: 3, activeEventIndex: 0 });
      logger.info('PhaseSequencer', 'Transition Phase 2 (Systèmes) vers Phase 3 (Crises de Secteur & Diplomatie)');
    } else {
      get().advanceTurn();
    }
  },

  advanceTurn: () => {
    const state = get();
    const currentTurn = state.resources.turn;
    const nextTurn = currentTurn + 1;

    // 1. Process Construction Queue (Planetary Buildings Database)
    const completedProjects: { colonyName: string; buildingName: string; bonusSummary: string }[] = [];
    const remainingQueue: ConstructionProject[] = [];
    const updatedColonies = state.colonies.map(col => ({
      ...col,
      buildings: [...col.buildings],
      localProduction: { ...col.localProduction }
    }));

    state.constructionQueue.forEach(proj => {
      const turnsLeft = proj.turnsRemaining - 1;
      if (turnsLeft <= 0) {
        // Project finished!
        const targetColony = updatedColonies.find(c => c.id === proj.colonyId);
        if (targetColony) {
          const buildingDef = getBuildingById(proj.buildingDefId);
          const dynamicOutput = buildingDef 
            ? calculateDynamicBuildingOutput(buildingDef, targetColony.planetType, state.resources.morale)
            : { minerals: 20, food: 15, energy: 10, credits: 5, researchPoints: 5, defenseRating: 10, moraleBonus: 2, aiSynergyText: '' };

          targetColony.buildings.push({
            id: `bld_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: proj.buildingName,
            type: proj.category === 'habitat' ? 'agrodome' : proj.category === 'research' ? 'lab' : proj.category === 'defense' ? 'defense_grid' : 'mine',
            level: 1,
            outputSummary: `+${dynamicOutput.minerals} Min, +${dynamicOutput.food} Nourr, +${dynamicOutput.energy} Énerg, +${dynamicOutput.defenseRating} Déf`
          });

          targetColony.localProduction.food += dynamicOutput.food;
          targetColony.localProduction.minerals += dynamicOutput.minerals;
          targetColony.localProduction.energy += dynamicOutput.energy;

          completedProjects.push({
            colonyName: proj.colonyName,
            buildingName: proj.buildingName,
            bonusSummary: `+${dynamicOutput.minerals} Min, +${dynamicOutput.food} Nourr, +${dynamicOutput.energy} Énerg`
          });

          logger.tactical(
            'ChantierTermine',
            `Chantier achevé sur ${proj.colonyName} : [${proj.buildingName}] opérationnel !`,
            { bonus: dynamicOutput }
          );
        }
      } else {
        remainingQueue.push({
          ...proj,
          turnsRemaining: turnsLeft
        });
      }
    });

    // 2. Calculate planetary yields
    let netFood = 0;
    let netMinerals = 0;
    let netEnergy = 0;

    updatedColonies.forEach((c) => {
      netFood += c.localProduction.food;
      netMinerals += c.localProduction.minerals;
      netEnergy += c.localProduction.energy;
    });

    // Astra baseline upkeep
    const astraEnergyDrain = 40;
    const populationConsumption = Math.floor(state.resources.population / 200);

    // Research flux generation
    const baseResearchYield = 25;
    const researchTechBonus = state.unlockedTechs.includes('sci_tachyon_sensors') ? 20 : 0;
    const netResearch = baseResearchYield + researchTechBonus;

    const netCreditGrowth = 45 + (state.unlockedTechs.includes('eco_free_markets') ? 25 : 0);
    const updatedResources = {
      ...state.resources,
      turn: nextTurn,
      credits: state.resources.credits + netCreditGrowth,
      energy: Math.max(0, state.resources.energy + netEnergy - astraEnergyDrain),
      food: Math.max(0, state.resources.food + netFood - populationConsumption),
      minerals: state.resources.minerals + netMinerals,
      researchPoints: state.resources.researchPoints + netResearch,
      population: state.resources.population + (state.resources.food > 50 ? 150 : -50)
    };

    const updatedAstra = { ...state.astra };
    if (updatedResources.energy > 50 && updatedAstra.structuralShields < 100) {
      updatedAstra.structuralShields = Math.min(100, updatedAstra.structuralShields + 10);
    }

    // 3. Collect Turn Decisions for Turn Log
    const turnDecisions = state.eventLogs
      .filter(l => l.turn === currentTurn)
      .map(l => ({
        phase: l.phase,
        eventTitle: l.eventTitle,
        choiceLabel: l.choiceMade,
        outcomeSummary: `Impacts : ${Object.entries(l.deltas || {}).map(([k, v]) => `${k} ${v >= 0 ? '+' : ''}${v}`).join(', ') || 'Neutre'}`,
        deltas: l.deltas || {}
      }));

    // 4. Build Complete TurnLogEntry
    const isL0Passed = updatedResources.credits >= 0 && updatedResources.energy >= 0 && updatedResources.food >= 0 && updatedResources.minerals >= 0;
    const turnLogEntry: TurnLogEntry = {
      turn: currentTurn,
      timestamp: new Date().toISOString(),
      era: state.eraId,
      resourcesSnapshot: { ...updatedResources },
      netProduction: {
        credits: netCreditGrowth,
        energy: netEnergy - astraEnergyDrain,
        food: netFood - populationConsumption,
        minerals: netMinerals,
        research: netResearch
      },
      decisionsMade: turnDecisions,
      constructionsCompleted: completedProjects,
      researchesCompleted: [],
      incidentsAndAlerts: updatedResources.energy <= 20 
        ? ['Alerte Énergie Critique sur les sous-systèmes ASTRA'] 
        : updatedResources.food <= 20 
        ? ['Alerte Ravitaillement : Pénurie alimentaire imminente'] 
        : ['Secteur Zéro stable sous la surveillance de la flotte'],
      invariantPassed: isL0Passed,
      aiDebriefing: `Rapport de Cycle ${currentTurn} : Rendement Minéraux +${netMinerals}, Énergie net ${netEnergy - astraEnergyDrain >= 0 ? '+' : ''}${netEnergy - astraEnergyDrain}. ${completedProjects.length > 0 ? `${completedProjects.length} infrastructure(s) mise(s) en service.` : 'Chantiers en progression.'}`
    };

    const endOfTurnLog: ResourceDeltaRecord = {
      turn: nextTurn,
      timestamp: new Date().toISOString(),
      phase: 1,
      eventTitle: `Transition de Cycle (Tour ${currentTurn} → Tour ${nextTurn})`,
      choiceMade: `Clôture de la séquence décisionnelle & Récolte des rendements 4X`,
      deltas: {
        credits: netCreditGrowth,
        energy: netEnergy - astraEnergyDrain,
        food: netFood - populationConsumption,
        minerals: netMinerals
      },
      invariantVerified: true,
      sealedStateChecksum: `SEAL-${Date.now().toString(36).toUpperCase()}`
    };

    set(
      produce((draft: GameStoreState) => {
        draft.resources = updatedResources;
        draft.astra = updatedAstra;
        draft.colonies = updatedColonies;
        draft.constructionQueue = remainingQueue;
        draft.currentPhase = 1;
        draft.activeEventIndex = 0;
        draft.isPhase1Completed = false;
        draft.isPhase2Completed = false;
        draft.isPhase3Completed = false;
        draft.phase1Event = null;
        draft.phase2Event = null;
        draft.phase3Event = null;
        draft.phase1Events = [];
        draft.phase2Events = [];
        draft.phase3Events = [];
        draft.eventLogs = [endOfTurnLog, ...draft.eventLogs];
        draft.turnLogs = [turnLogEntry, ...draft.turnLogs];
      })
    );

    if (completedProjects.length > 0) {
      soundFx.playConstruct();
    } else {
      soundFx.playTurnAdvance();
    }

    logger.tactical(
      'TurnAdvance',
      `Séquence de cycle achevée. Début du Tour ${nextTurn}. Rendement net : Minéraux +${netMinerals}, Énergie ${netEnergy - astraEnergyDrain >= 0 ? '+' : ''}${netEnergy - astraEnergyDrain}, R&D +${netResearch}`,
      { nextTurn, updatedResources }
    );
  },

  unlockTechnology: (techId, cost, effects) => {
    const state = get();
    if (state.unlockedTechs.includes(techId)) return;

    const currentRes = { ...state.resources };
    const currentAstra = { ...state.astra };

    // Deduct costs respecting L0 >= 0
    if (cost.credits) currentRes.credits = Math.max(0, currentRes.credits - cost.credits);
    if (cost.minerals) currentRes.minerals = Math.max(0, currentRes.minerals - cost.minerals);
    if (cost.energy) currentRes.energy = Math.max(0, currentRes.energy - cost.energy);
    if (cost.food) currentRes.food = Math.max(0, currentRes.food - cost.food);
    if (cost.sciencePoints) currentRes.researchPoints = Math.max(0, currentRes.researchPoints - cost.sciencePoints);

    // Apply effects
    if (effects.hullMax) currentAstra.hullMax += effects.hullMax;
    if (effects.structuralShields) currentAstra.structuralShields = Math.min(100, currentAstra.structuralShields + effects.structuralShields);
    if (effects.combatSquadrons) currentAstra.combatSquadrons += effects.combatSquadrons;
    if (effects.securityBonus) currentRes.sectorSecurity = Math.min(100, currentRes.sectorSecurity + effects.securityBonus);
    if (effects.moraleBonus) currentRes.morale = Math.min(100, currentRes.morale + effects.moraleBonus);
    if (effects.stabilityBonus) currentRes.stability = Math.min(100, currentRes.stability + effects.stabilityBonus);

    const logRecord: ResourceDeltaRecord = {
      turn: currentRes.turn,
      timestamp: new Date().toISOString(),
      phase: state.currentPhase,
      eventTitle: `Percée R&D Technologique`,
      choiceMade: `Déblocage de la technologie [${techId}]`,
      deltas: {
        credits: -(cost.credits || 0),
        minerals: -(cost.minerals || 0),
        energy: -(cost.energy || 0)
      },
      invariantVerified: currentRes.credits >= 0 && currentRes.energy >= 0 && currentRes.minerals >= 0,
      sealedStateChecksum: `TECH-${Date.now().toString(36).toUpperCase()}`
    };

    set(
      produce((draft: GameStoreState) => {
        draft.resources = currentRes;
        draft.astra = currentAstra;
        draft.unlockedTechs.push(techId);
        draft.eventLogs = [logRecord, ...draft.eventLogs];
      })
    );

    soundFx.playTechUnlock();
    logger.tactical('TechTree', `Nouvelle découverte technologique confirmée : [${techId}]`, { cost, effects });
  },

  adjustAstraPower: (subsystem, amount) => {
    set(
      produce((draft: GameStoreState) => {
        if (subsystem === 'shields') {
          draft.astra.structuralShields = Math.max(0, Math.min(100, draft.astra.structuralShields + amount));
        } else if (subsystem === 'reactors') {
          draft.astra.fusionReactors = Math.max(100, Math.min(800, draft.astra.fusionReactors + amount));
        } else if (subsystem === 'ftl') {
          draft.astra.ftlCapacitors = Math.max(0, Math.min(100, draft.astra.ftlCapacitors + amount));
        }
      })
    );
    soundFx.playClick();
  },

  upgradeColonyBuilding: (colonyId, buildingId) => {
    set(
      produce((draft: GameStoreState) => {
        const col = draft.colonies.find((c) => c.id === colonyId);
        if (!col) return;
        const bld = col.buildings.find((b) => b.id === buildingId);
        if (!bld) return;
        bld.level += 1;
        col.localProduction.food += 20;
        col.localProduction.minerals += 15;
        col.localProduction.energy += 10;
      })
    );
    soundFx.playConstruct();
    logger.tactical('ColonyManager', `Bâtiment ${buildingId} amélioré sur la colonie ${colonyId}`);
  },

  constructBuildingOnColony: (colonyId, buildingDefId) => {
    const state = get();
    const buildingDef = getBuildingById(buildingDefId);
    if (!buildingDef) return false;

    const colony = state.colonies.find((c) => c.id === colonyId);
    if (!colony) return false;

    // Count existing buildings of same category on colony & empire
    const existingOnColony = colony.buildings.filter(b => {
      const def = getBuildingById(b.id);
      return def?.category === buildingDef.category;
    }).length;

    let totalInEmpire = 0;
    state.colonies.forEach(c => {
      totalInEmpire += c.buildings.filter(b => {
        const def = getBuildingById(b.id);
        return def?.category === buildingDef.category;
      }).length;
    });

    // Dynamic cost calculated according to colony biome, difficulty, and empire scaling
    const dynamicCost = calculateDynamicBuildingCost(
      buildingDef,
      existingOnColony,
      totalInEmpire,
      colony.planetType,
      state.difficulty
    );

    const res = state.resources;

    // Check affordability respecting invariant L0 >= 0
    if (
      res.minerals < dynamicCost.minerals || 
      res.credits < dynamicCost.credits || 
      (dynamicCost.energy > 0 && res.energy < dynamicCost.energy) ||
      (dynamicCost.researchPoints > 0 && res.researchPoints < dynamicCost.researchPoints)
    ) {
      soundFx.playAlert();
      logger.warn('ChantierRefuse', `Ressources insuffisantes pour lancer le chantier [${buildingDef.name}] sur ${colony.name}`);
      return false;
    }

    const dynamicOutput = calculateDynamicBuildingOutput(buildingDef, colony.planetType, res.morale);

    // If construction takes > 1 turn, add to constructionQueue!
    const newProject: ConstructionProject = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      colonyId: colony.id,
      colonyName: colony.name,
      buildingDefId: buildingDef.id,
      buildingName: buildingDef.name,
      category: buildingDef.category,
      turnsRemaining: dynamicCost.constructionTurns,
      totalTurns: dynamicCost.constructionTurns,
      costPaid: {
        minerals: dynamicCost.minerals,
        credits: dynamicCost.credits,
        energy: dynamicCost.energy,
        researchPoints: dynamicCost.researchPoints
      },
      projectedBonus: {
        minerals: dynamicOutput.minerals,
        food: dynamicOutput.food,
        energy: dynamicOutput.energy,
        security: dynamicOutput.defenseRating,
        research: dynamicOutput.researchPoints
      },
      aiSynergyNarrative: dynamicCost.biomeSynergyLabel + ' — ' + dynamicOutput.aiSynergyText,
      startedAtTurn: res.turn
    };

    set(
      produce((draft: GameStoreState) => {
        // Deduct resources
        draft.resources.minerals -= dynamicCost.minerals;
        draft.resources.credits -= dynamicCost.credits;
        if (dynamicCost.energy > 0) draft.resources.energy -= dynamicCost.energy;
        if (dynamicCost.researchPoints > 0) {
          draft.resources.researchPoints = Math.max(0, draft.resources.researchPoints - dynamicCost.researchPoints);
        }

        draft.constructionQueue.push(newProject);
      })
    );

    soundFx.playConstruct();
    logger.tactical(
      'ChantierLance',
      `Chantier planétaire engagé sur ${colony.name} : [${buildingDef.name}] (${dynamicCost.constructionTurns} tour(s))`,
      { dynamicCost, dynamicOutput }
    );
    return true;
  },

  cancelConstructionProject: (projectId: string) => {
    const state = get();
    const project = state.constructionQueue.find(p => p.id === projectId);
    if (!project) return;

    // Refund 75% of paid resources
    const refundMinerals = Math.round(project.costPaid.minerals * 0.75);
    const refundCredits = Math.round(project.costPaid.credits * 0.75);

    set(
      produce((draft: GameStoreState) => {
        draft.resources.minerals += refundMinerals;
        draft.resources.credits += refundCredits;
        draft.constructionQueue = draft.constructionQueue.filter(p => p.id !== projectId);
      })
    );

    soundFx.playClick();
    logger.info('ChantierAnnule', `Chantier ${project.buildingName} annulé sur ${project.colonyName}. Remboursement partiel : +${refundMinerals} Min, +${refundCredits} Crédits.`);
  },

  getSealedStateJson: (): SealedStateJson => {
    const state = get();
    return {
      version: '1.0',
      sealedAt: new Date().toISOString(),
      turn: state.resources.turn,
      eraId: state.eraId,
      difficulty: state.difficulty,
      resources: state.resources,
      unlockedTechs: state.unlockedTechs,
      astra: state.astra,
      council: state.council,
      colonies: state.colonies,
      constructionQueue: state.constructionQueue,
      leader: state.leader,
      activePhase: state.currentPhase,
      phase1Resolved: state.isPhase1Completed,
      phase2Resolved: state.isPhase2Completed,
      phase3Resolved: state.isPhase3Completed,
      turnLogs: state.turnLogs
    };
  },

  getSealedStateString: (): string => {
    return JSON.stringify(get().getSealedStateJson(), null, 2);
  }
}));
