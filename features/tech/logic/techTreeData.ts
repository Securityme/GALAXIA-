import { CouncilPoleId } from '@/types/config';
import { TechnologyItem, TechCost, TechEffects } from '@/types/tech';

export const TECH_TREE_CATALOG: TechnologyItem[] = [
  // ================= 1. MILITAIRE =================
  {
    id: 'mil_gauss_cannons',
    name: 'Canons à Accélération Gauss Mk-I',
    poleId: 'military',
    tier: 1,
    prerequisites: [],
    baseCost: { minerals: 120, credits: 80, sciencePoints: 50 },
    description: 'Projectiles cinétiques lourds propulsés à 0.15c par des bobines supraconductrices.',
    lore: "Conçus à l'origine pour détruire les astéroïdes barrant la route de l'ASTRA, ces canons transpercent facilement le blindage des pillards du Secteur Zéro.",
    iconName: 'Crosshair',
    effects: {
      combatSquadrons: 1,
      securityBonus: 12,
      specialPerk: 'Efficacité offensive des escadres accrue face aux raids'
    },
    superphaseEligible: true
  },
  {
    id: 'mil_polarized_shields',
    name: 'Boucliers Polarisés à Dispersion de Plasma',
    poleId: 'military',
    tier: 2,
    prerequisites: ['mil_gauss_cannons'],
    baseCost: { energy: 150, minerals: 180, credits: 120, sciencePoints: 120 },
    description: 'Champs déflecteurs magnétiques inversant la charge des tirs d’énergie entrants.',
    lore: "Une innovation militaire née de l'analyse des rayonnements coronaux des étoiles naines bleues.",
    iconName: 'Shield',
    effects: {
      structuralShields: 20,
      hullMax: 100,
      specialPerk: 'Régénération passive des boucliers de l’ASTRA +5% par cycle'
    }
  },
  {
    id: 'mil_micro_singularities',
    name: 'Torpilles à Micro-Singularités Gravitiques',
    poleId: 'military',
    tier: 3,
    prerequisites: ['mil_polarized_shields'],
    baseCost: { energy: 250, minerals: 300, credits: 200, sciencePoints: 250 },
    description: 'Munitions d’artillerie lourde provoquant un effondrement dimensionnel localisé.',
    lore: "L'arme suprême de dissuasion stratégique. Capable de vaporiser une station orbitale corsaire en une fraction de seconde.",
    iconName: 'Bomb',
    effects: {
      combatSquadrons: 2,
      securityBonus: 25,
      specialPerk: 'Immunité contre les blocus corsaires et réduction des dégâts de crise'
    }
  },

  // ================= 2. SCIENTIFIQUE =================
  {
    id: 'sci_tachyon_sensors',
    name: 'Réseaux de Capteurs Tachyoniques',
    poleId: 'scientific',
    tier: 1,
    prerequisites: [],
    baseCost: { energy: 90, credits: 70, sciencePoints: 40 },
    description: 'Balises sub-spatiales détectant les ondulations gravitationnelles supraluminiques.',
    lore: "Permet de sonder l'espace profond avant même que les rayonnements électromagnétiques n'atteignent nos télescopes.",
    iconName: 'Radio',
    effects: {
      energyBonus: 15,
      specialPerk: 'Anticipation des alertes de crise et détection anticipée des anomalies'
    },
    superphaseEligible: true
  },
  {
    id: 'sci_antimatter_containment',
    name: 'Champs de Confinement d’Anti-Matière',
    poleId: 'scientific',
    tier: 2,
    prerequisites: ['sci_tachyon_sensors'],
    baseCost: { energy: 200, minerals: 160, credits: 150, sciencePoints: 140 },
    description: 'Pièges magnétiques à gradient stabilisant des positrons et antiprotons pour la production d’énergie pure.',
    lore: "Déverrouille le véritable potentiel du cœur de fusion de l'ASTRA, quadruplant le rendement par gramme de combustible.",
    iconName: 'Zap',
    effects: {
      energyBonus: 45,
      ftlEfficiency: 15,
      specialPerk: 'Rendement des réacteurs de fusion +35%'
    }
  },
  {
    id: 'sci_quantum_computing',
    name: 'Matrices Quantiques Auto-Évolutives',
    poleId: 'scientific',
    tier: 3,
    prerequisites: ['sci_antimatter_containment'],
    baseCost: { credits: 240, minerals: 220, energy: 220, sciencePoints: 260 },
    description: 'Systèmes décisionnels heuristiques fonctionnant en superposition d’états infinis.',
    lore: "L'apogée du calcul cybernétique. L'IA Gemini 3.8 Flash de bord peut simuler des milliers de trajectoires d'avenir simultanées.",
    iconName: 'Cpu',
    effects: {
      stabilityBonus: 15,
      specialPerk: 'Réduction de 20% du coût de toutes les technologies futures'
    }
  },

  // ================= 3. CIVILISATIONNEL =================
  {
    id: 'civ_biophilic_domes',
    name: 'Cités-Dômes Biophiliques d’Arche',
    poleId: 'civilization',
    tier: 1,
    prerequisites: [],
    baseCost: { minerals: 110, food: 70, credits: 60, sciencePoints: 45 },
    description: 'Habitats pressurisés intégrant une flore terrestre cryo-régénérée et une filtration lumineuse solaire.',
    lore: "Rend la vie dans le vide supportable en recréant les cycles circadiens, le parfum des forêts et la brise marine de l'ancien monde.",
    iconName: 'Heart',
    effects: {
      foodBonus: 25,
      moraleBonus: 12,
      specialPerk: 'Augmentation du moral civique et tolérance accrue aux rationnements'
    },
    superphaseEligible: true
  },
  {
    id: 'civ_neural_cohesion',
    name: 'Protocoles de Cohésion Neurale Citoyenne',
    poleId: 'civilization',
    tier: 2,
    prerequisites: ['civ_biophilic_domes'],
    baseCost: { credits: 140, energy: 130, sciencePoints: 110 },
    description: 'Réseau de communication sub-corticale volontaire favorisant l’empathie et la concertation démocratique.',
    lore: "Élimine l'isolement psychologique causé par l'exil spatial et prévient les épidémies de panique lors des dépressurisations.",
    iconName: 'Users',
    effects: {
      stabilityBonus: 20,
      moraleBonus: 10,
      specialPerk: 'Immunité contre les émeutes civiles et réduction des tensions politiques'
    }
  },
  {
    id: 'civ_transhuman_sanctuary',
    name: 'Sanctuaires Mémoriels Transhumanistes',
    poleId: 'civilization',
    tier: 3,
    prerequisites: ['civ_neural_cohesion'],
    baseCost: { credits: 260, minerals: 200, energy: 200, sciencePoints: 240 },
    description: 'Monolithes mémoriels numérisant la conscience et les mémoires des vétérans pour guider les générations futures.',
    lore: "La mort n'est plus une rupture : la sagesse accumulée par les bâtisseurs de l'Union reste vivante au sein du collectif stellaire.",
    iconName: 'Sparkles',
    effects: {
      stabilityBonus: 25,
      moraleBonus: 20,
      specialPerk: 'Résilience totale face aux pertes démographiques et bonus d’honneur permanent'
    }
  },

  // ================= 4. ÉCONOMIQUE =================
  {
    id: 'eco_subspace_credit',
    name: 'Réseaux de Crédit Décentralisés Sub-Spatiaux',
    poleId: 'economic',
    tier: 1,
    prerequisites: [],
    baseCost: { credits: 100, energy: 70, sciencePoints: 40 },
    description: 'Registre infalsifiable de micro-transactions par intrication quantique entre colonies et ASTRA.',
    lore: "Évite l'effondrement monétaire entre systèmes planétaires distants où la lumière met des heures à transmettre les données.",
    iconName: 'Coins',
    effects: {
      creditsBonus: 30,
      specialPerk: 'Revenus en crédits accrus de +25 par cycle'
    },
    superphaseEligible: true
  },
  {
    id: 'eco_nano_foundries',
    name: 'Fonderies Orbitales à Nanorobots Auto-Réplicatifs',
    poleId: 'economic',
    tier: 2,
    prerequisites: ['eco_subspace_credit'],
    baseCost: { minerals: 200, energy: 150, credits: 130, sciencePoints: 130 },
    description: 'Essaims de nanites désassemblant les minerais bruts au niveau moléculaire pour produire des alliages purs.',
    lore: "Transforme les astéroïdes silicatés ordinaires en métaux supraconducteurs en quelques minutes d'exposition.",
    iconName: 'Factory',
    effects: {
      mineralsBonus: 40,
      specialPerk: 'Coût en minéraux de toutes les constructions réduit de 20%'
    }
  },
  {
    id: 'eco_speculative_markets',
    name: 'Marchés Galactiques Spéculatifs Automatisés',
    poleId: 'economic',
    tier: 3,
    prerequisites: ['eco_nano_foundries'],
    baseCost: { credits: 300, energy: 180, minerals: 180, sciencePoints: 230 },
    description: 'Algorithmes financiers à haute fréquence exploitant les différentiels d’arbitrage entre les routes commerciales.',
    lore: "Le trésor de l'Union s'auto-alimente en continu, attirant les marchands indépendants de tout le secteur.",
    iconName: 'TrendingUp',
    effects: {
      creditsBonus: 60,
      stabilityBonus: 10,
      specialPerk: 'Multiplicateur de trésorerie suprême (+60 crédits/cycle)'
    }
  },

  // ================= 5. DIPLOMATIQUE =================
  {
    id: 'dip_first_contact',
    name: 'Protocoles de Premier Contact Émergent',
    poleId: 'diplomatic',
    tier: 1,
    prerequisites: [],
    baseCost: { credits: 80, energy: 60, sciencePoints: 45 },
    description: 'Codex heuristique d’interprétation des signaux radio et balises xénobiologiques inconnues.',
    lore: "Permet d'éviter les tirs réflexes lors de la rencontre de vaisseaux de faction corsaire ou de sondes extraterrestres.",
    iconName: 'MessageSquare',
    effects: {
      stabilityBonus: 10,
      specialPerk: 'Fidélité de base du Conseil augmentée de +10'
    },
    superphaseEligible: true
  },
  {
    id: 'dip_xeno_linguistics',
    name: 'Transducteurs Linguistiques Xéno-Cognitifs',
    poleId: 'diplomatic',
    tier: 2,
    prerequisites: ['dip_first_contact'],
    baseCost: { credits: 160, energy: 120, sciencePoints: 120 },
    description: 'Synthétiseurs vocaux et mathématiques traduisant en direct les dialectes des clans pirates et factions aliens.',
    lore: "Même la faction pirate la plus hostile accepte de négocier si la proposition est formulée dans sa syntaxe d'honneur.",
    iconName: 'Globe',
    effects: {
      securityBonus: 15,
      specialPerk: 'Possibilité de négocier des trêves et tributs lors des crises de Phase 3'
    }
  },
  {
    id: 'dip_interstellar_senate',
    name: 'Chambre du Sénat Interstellaire Unifié',
    poleId: 'diplomatic',
    tier: 3,
    prerequisites: ['dip_xeno_linguistics'],
    baseCost: { credits: 280, minerals: 160, energy: 180, sciencePoints: 240 },
    description: 'Structure fédérale conférant un droit de vote et de représentation à toutes les colonies et enclaves du secteur.',
    lore: "L'Union passe du statut de flotte de réfugiés à celui de superpuissance reconnue dans tout le quadrant.",
    iconName: 'Crown',
    effects: {
      stabilityBonus: 25,
      moraleBonus: 15,
      specialPerk: 'Droit de veto sur les événements de mutinerie et allégeance totale des colonies'
    }
  },

  // ================= 6. LOGISTIQUE =================
  {
    id: 'log_freight_convoys',
    name: 'Convois Automatisés de Fret Ionique',
    poleId: 'logistics',
    tier: 1,
    prerequisites: [],
    baseCost: { minerals: 90, energy: 70, credits: 60, sciencePoints: 40 },
    description: 'Barges de transport sans équipage ravitaillant en circuit continu l’ASTRA depuis les mines planétaires.',
    lore: "Garantit que la nourriture produite dans les agro-dômes et les métaux extraits des carrières parviennent aux cales centrales.",
    iconName: 'Truck',
    effects: {
      foodBonus: 15,
      mineralsBonus: 15,
      specialPerk: 'Ravitaillement automatique régulier entre l’ASTRA et Nova Paris'
    },
    superphaseEligible: true
  },
  {
    id: 'log_ftl_superchargers',
    name: 'Condensateurs FTL Hyper-Propulsion Mk-II',
    poleId: 'logistics',
    tier: 2,
    prerequisites: ['log_freight_convoys'],
    baseCost: { energy: 180, minerals: 160, credits: 120, sciencePoints: 130 },
    description: 'Bobines de distorsion spatiotemporelle réduisant le temps de recharge du moteur de saut de l’ASTRA.',
    lore: "Permet de repositionner le vaisseau-monde hors de portée des super-orages stellaires en quelques minutes.",
    iconName: 'FastForward',
    effects: {
      ftlEfficiency: 30,
      specialPerk: 'Temps de recharge du saut FTL divisé par deux'
    }
  },
  {
    id: 'log_frictionless_nexus',
    name: 'Nexus Logistique Stellaire Sans Friction',
    poleId: 'logistics',
    tier: 3,
    prerequisites: ['log_ftl_superchargers'],
    baseCost: { minerals: 240, credits: 240, energy: 240, sciencePoints: 250 },
    description: 'Gares de téléportation de matière par intrication quantique pour les pièces critiques et denrées d’urgence.',
    lore: "Plus aucun citoyen ne souffrira de faim ni de froid à cause d'une avarie de navette : la matière circule instantanément.",
    iconName: 'Boxes',
    effects: {
      foodBonus: 30,
      mineralsBonus: 30,
      energyBonus: 30,
      specialPerk: 'Invariant L0 protégé : réserves minimales automatiquement réapprovisionnées'
    }
  },

  // ================= BRANCHE SECRÈTE / DÉCOUVERTE XÉNO =================
  {
    id: 'xeno_relic_converters',
    name: 'Convertisseurs à Résonance Xéno-Relique',
    poleId: 'scientific',
    tier: 2,
    prerequisites: ['sci_tachyon_sensors'],
    baseCost: { minerals: 150, energy: 150, sciencePoints: 100 },
    description: 'Technologie rétro-conçue à partir d’une épave alien découverte en bordure de nébuleuse.',
    lore: "Exploite des fréquences dimensionnelles inconnues pour transmuter directement la matière cosmique en énergie pure.",
    iconName: 'Sparkle',
    effects: {
      energyBonus: 35,
      structuralShields: 15,
      specialPerk: 'Génération spontanée de ressources lors de l’exploration'
    },
    isSecretBranch: true,
    discoveryCondition: 'Découverte d’une anomalie xéno-technologique dans le Secteur Zéro'
  }
];

export function calculateDynamicTechCost(
  tech: TechnologyItem,
  leaderTraits: { id: string; category?: string }[],
  councilLoyalty: number, // 0 - 100 for the corresponding pole
  difficulty: 'normal' | 'tactical' | 'hardcore'
): TechCost {
  let costMultiplier = 1.0;

  // 1. Leader trait impact
  const traitIds = leaderTraits.map(t => t.id);
  if (tech.poleId === 'scientific' && traitIds.includes('vis_stellaire')) {
    costMultiplier *= 0.8; // -20%
  }
  if (tech.poleId === 'military' && traitIds.includes('strat_implacable')) {
    costMultiplier *= 0.8; // -20%
  }
  if (tech.poleId === 'economic' && traitIds.includes('negoc_commercial')) {
    costMultiplier *= 0.8; // -20%
  }
  if (tech.poleId === 'diplomatic' && traitIds.includes('paci_diplo')) {
    costMultiplier *= 0.75; // -25%
  }
  if (tech.poleId === 'logistics' && traitIds.includes('techno_zele')) {
    costMultiplier *= 0.8; // -20%
  }

  // 2. Council Loyalty impact
  if (councilLoyalty >= 80) {
    costMultiplier *= 0.85; // Pôle zélé et coopératif : -15%
  } else if (councilLoyalty <= 40) {
    costMultiplier *= 1.25; // Réticence bureaucratique et sabotage : +25%
  }

  // 3. Difficulty impact
  if (difficulty === 'hardcore') {
    costMultiplier *= 1.2;
  } else if (difficulty === 'normal') {
    costMultiplier *= 0.9;
  }

  const base = tech.baseCost;
  return {
    credits: base.credits ? Math.max(10, Math.round(base.credits * costMultiplier)) : undefined,
    minerals: base.minerals ? Math.max(10, Math.round(base.minerals * costMultiplier)) : undefined,
    energy: base.energy ? Math.max(10, Math.round(base.energy * costMultiplier)) : undefined,
    sciencePoints: base.sciencePoints ? Math.max(10, Math.round(base.sciencePoints * costMultiplier)) : undefined,
  };
}
