export type BuildingCategory = 'extraction' | 'energy' | 'habitat' | 'research' | 'defense' | 'megastructure';

export interface PlanetaryBuildingDefinition {
  id: string;
  name: string;
  category: BuildingCategory;
  tier: 1 | 2 | 3 | 4;
  description: string;
  lore: string;
  iconName: string;
  cost: {
    minerals: number;
    credits: number;
    energy?: number;
    researchPoints?: number;
  };
  maintenance: {
    energy?: number;
    credits?: number;
  };
  production: {
    food?: number;
    minerals?: number;
    energy?: number;
    credits?: number;
    researchPoints?: number;
    moraleBonus?: number;
    defenseRating?: number;
  };
  districtSlotsRequired: number;
  unlockedByDefault?: boolean;
  requiredTechId?: string;
  planetAffinity?: string[];
  aiTags: string[]; // For Gemini AI Game Master and automatic recommendations
}

export const PLANETARY_BUILDINGS_CATALOG: PlanetaryBuildingDefinition[] = [
  // ================= TIER 1 : INFRASTRUCTURE PRIMAIRE =================
  {
    id: 'bld_mine_surface',
    name: 'Excavatrice Minérale de Surface',
    category: 'extraction',
    tier: 1,
    description: 'Foreuses et convoyeurs pour l’extraction des minerais ferreux et alliages légers de surface.',
    lore: 'Déployée dès les premières heures de l’implantation coloniale pour alimenter les imprimantes orbitales.',
    iconName: 'Pickaxe',
    cost: { minerals: 60, credits: 40 },
    maintenance: { energy: 5 },
    production: { minerals: 22 },
    districtSlotsRequired: 1,
    unlockedByDefault: true,
    aiTags: ['minerals', 'starter', 'economy']
  },
  {
    id: 'bld_agrodome_hydro',
    name: 'Agro-Dôme Hydroponique Standard',
    category: 'habitat',
    tier: 1,
    description: 'Cultures synthétiques verticales et recyclage d’eau sous atmosphère contrôlée.',
    lore: 'Produit les rations de base et synthétise les protéines nécessaires à la survie des pionniers.',
    iconName: 'Sprout',
    cost: { minerals: 50, credits: 45 },
    maintenance: { energy: 4 },
    production: { food: 20, moraleBonus: 2 },
    districtSlotsRequired: 1,
    unlockedByDefault: true,
    aiTags: ['food', 'starter', 'morale']
  },
  {
    id: 'bld_solar_array',
    name: 'Champ de Panneaux Photovoltaïques',
    category: 'energy',
    tier: 1,
    description: 'Capteurs solaires haute efficacité et accumulateurs ioniques au sol.',
    lore: 'Une source d’énergie simple mais vitale, dépendante de l’ensoleillement de l’orbite planétaire.',
    iconName: 'Sun',
    cost: { minerals: 45, credits: 35 },
    maintenance: { credits: 2 },
    production: { energy: 24 },
    districtSlotsRequired: 1,
    unlockedByDefault: true,
    aiTags: ['energy', 'starter']
  },
  {
    id: 'bld_hab_block',
    name: 'Bloc Résidentiel Pressurisé',
    category: 'habitat',
    tier: 1,
    description: 'Modules de logement d’urgence scellés pour 10 000 colons avec filtrage d’air.',
    lore: 'L’abri indispensable contre les poussières abrasives et les tempêtes de méthane des mondes hostiles.',
    iconName: 'Home',
    cost: { minerals: 55, credits: 50 },
    maintenance: { energy: 3 },
    production: { credits: 12, moraleBonus: 3 },
    districtSlotsRequired: 1,
    unlockedByDefault: true,
    aiTags: ['housing', 'morale', 'credits']
  },
  {
    id: 'bld_comm_outpost',
    name: 'Poste de Commandement & Télécom',
    category: 'research',
    tier: 1,
    description: 'Antenne sub-spatiale reliant la colonie au réseau neural du Vaisseau-Monde ASTRA.',
    lore: 'Coordination tactique et transmission en temps réel des données géologiques locales.',
    iconName: 'Radio',
    cost: { minerals: 50, credits: 60 },
    maintenance: { energy: 4 },
    production: { researchPoints: 8, credits: 8 },
    districtSlotsRequired: 1,
    unlockedByDefault: true,
    aiTags: ['research', 'governance']
  },
  {
    id: 'bld_perimeter_turret',
    name: 'Tourelle Gauss de Défense Coloniale',
    category: 'defense',
    tier: 1,
    description: 'Affût automatisé de canons cinétiques protégeant le périmètre contre la faune et les pillards.',
    lore: 'Première ligne de dissuasion face aux incursions de corsaires stellaires.',
    iconName: 'Shield',
    cost: { minerals: 70, credits: 50 },
    maintenance: { energy: 4, credits: 3 },
    production: { defenseRating: 15 },
    districtSlotsRequired: 1,
    unlockedByDefault: true,
    aiTags: ['defense', 'security']
  },

  // ================= TIER 2 : EXPANSION INDUSTRIELLE =================
  {
    id: 'bld_deep_mantle_bore',
    name: 'Puits de Forage Mantellique',
    category: 'extraction',
    tier: 2,
    description: 'Forage géothermique profond extrayant des minerais rares et cristaux photoniques.',
    lore: 'Atteint les strates profondes là où la pression planétaire condense les métaux les plus précieux.',
    iconName: 'Flame',
    cost: { minerals: 140, credits: 110, energy: 15 },
    maintenance: { energy: 12 },
    production: { minerals: 55, energy: 10 },
    districtSlotsRequired: 2,
    requiredTechId: 'tech_eco_1',
    aiTags: ['minerals', 'industrial']
  },
  {
    id: 'bld_fusion_reactor_ground',
    name: 'Centrale Tokamak à Fusion de Deutérium',
    category: 'energy',
    tier: 2,
    description: 'Réacteur de fusion propre produisant une abondance d’énergie stable pour la mégapole.',
    lore: 'Stabilise le réseau électrique continental même lors des hivers cosmiques ou éclipses prolongées.',
    iconName: 'Zap',
    cost: { minerals: 130, credits: 120 },
    maintenance: { credits: 8 },
    production: { energy: 65 },
    districtSlotsRequired: 2,
    requiredTechId: 'tech_sci_1',
    aiTags: ['energy', 'high_output']
  },
  {
    id: 'bld_bio_synth_vat',
    name: 'Complexe Génétique & Synthétiseur Bio',
    category: 'habitat',
    tier: 2,
    description: 'Cuves de bio-croissance accélérée produisant des aliments enrichis et antibiotiques.',
    lore: 'Éradique la malnutrition et immunise les colons contre les agents pathogènes extraterrestres.',
    iconName: 'HeartPulse',
    cost: { minerals: 110, credits: 130 },
    maintenance: { energy: 10 },
    production: { food: 50, moraleBonus: 6 },
    districtSlotsRequired: 2,
    requiredTechId: 'tech_civ_1',
    aiTags: ['food', 'morale', 'health']
  },
  {
    id: 'bld_quantum_lab',
    name: 'Laboratoire de Physique Sub-atomique',
    category: 'research',
    tier: 2,
    description: 'Salles blanches et chambres à vide pour la recherche théorique et xénologique.',
    lore: 'Décode les artéfacts stellaires et accélère les découvertes de l’arbre technologique.',
    iconName: 'FlaskConical',
    cost: { minerals: 125, credits: 150 },
    maintenance: { energy: 14, credits: 10 },
    production: { researchPoints: 26 },
    districtSlotsRequired: 2,
    requiredTechId: 'tech_sci_2',
    aiTags: ['research', 'fast_unlock']
  },
  {
    id: 'bld_ion_shield_dome',
    name: 'Générateur de Dôme de Bouclier Ionique',
    category: 'defense',
    tier: 2,
    description: 'Projecteur plasmique couvrant l’ensemble de la métropole contre les bombardements orbitaux.',
    lore: 'Les tirs d’ogives ennemies s’écrasent sur une voûte d’énergie bleutée impénétrable.',
    iconName: 'ShieldAlert',
    cost: { minerals: 160, credits: 140 },
    maintenance: { energy: 18, credits: 8 },
    production: { defenseRating: 45, moraleBonus: 4 },
    districtSlotsRequired: 2,
    requiredTechId: 'tech_mil_1',
    aiTags: ['defense', 'fortress']
  },
  {
    id: 'bld_commercial_concourse',
    name: 'Halle Commerciale & Bourse Franche',
    category: 'habitat',
    tier: 2,
    description: 'Centre d’échanges pour marchands indépendants, comptoirs de fret et corporations locales.',
    lore: 'Favorise le flux de crédits solaires et stimule la consommation des citoyens libres.',
    iconName: 'Coins',
    cost: { minerals: 100, credits: 160 },
    maintenance: { energy: 8 },
    production: { credits: 40, moraleBonus: 5 },
    districtSlotsRequired: 2,
    requiredTechId: 'tech_eco_2',
    aiTags: ['credits', 'economy']
  },

  // ================= TIER 3 : HAUTE TECHNOLOGIE & SUPRÉMATIE =================
  {
    id: 'bld_antimatter_tap',
    name: 'Puits de Confinement Antimatière',
    category: 'energy',
    tier: 3,
    description: 'Piège électromagnétique captant les micro-fluctuations d’énergie du vide spatial.',
    lore: 'L’apogée de l’ingénierie énergétique humaine, fournissant une puissance quasi illimitée.',
    iconName: 'Atom',
    cost: { minerals: 320, credits: 280, researchPoints: 80 },
    maintenance: { credits: 25 },
    production: { energy: 160, researchPoints: 12 },
    districtSlotsRequired: 3,
    requiredTechId: 'tech_sci_3',
    aiTags: ['energy', 'endgame']
  },
  {
    id: 'bld_nanite_forge',
    name: 'Complexe de Fonderie Moléculaire Nanite',
    category: 'extraction',
    tier: 3,
    description: 'Brouillards d’essaims nanotechnologiques restructurant la roche brute en composites purs.',
    lore: 'Transforme n’importe quelle croûte minérale en alliages de qualité cuirassé spatial à haut rendement.',
    iconName: 'Cpu',
    cost: { minerals: 350, credits: 300, researchPoints: 90 },
    maintenance: { energy: 30 },
    production: { minerals: 140, credits: 30 },
    districtSlotsRequired: 3,
    requiredTechId: 'tech_eco_3',
    aiTags: ['minerals', 'production_boom']
  },
  {
    id: 'bld_xeno_institute',
    name: 'Sanctuaire de Télépathie & Xéno-Archives',
    category: 'research',
    tier: 3,
    description: 'Archives neurales et centre de décryptage des balises des Précurseurs de la Galaxie.',
    lore: 'Permet de percer les secrets du Grand Vide et de guider les décisions du Conseil Suprême.',
    iconName: 'Sparkles',
    cost: { minerals: 280, credits: 340, researchPoints: 100 },
    maintenance: { energy: 24, credits: 15 },
    production: { researchPoints: 65, moraleBonus: 8 },
    districtSlotsRequired: 3,
    requiredTechId: 'tech_dip_3',
    aiTags: ['research', 'lore', 'endgame']
  },
  {
    id: 'bld_orbital_defense_grid',
    name: 'Batterie de Canons Tachyon Sol-Orbite',
    category: 'defense',
    tier: 3,
    description: 'Batteries massives capables d’abattre une flotte ennemie avant même son insertion orbitale.',
    lore: 'Garantit l’invulnérabilité spatiale du monde colonisé face aux flottes d’invasion corsaires.',
    iconName: 'Target',
    cost: { minerals: 400, credits: 350, researchPoints: 85 },
    maintenance: { energy: 35, credits: 20 },
    production: { defenseRating: 120 },
    districtSlotsRequired: 3,
    requiredTechId: 'tech_mil_3',
    aiTags: ['defense', 'impenetrable']
  },

  // ================= TIER 4 : MÉGASTRUCTURES PLANÉTAIRES =================
  {
    id: 'bld_orbital_elevator',
    name: 'Élévateur Orbital Trans-Atmosphérique',
    category: 'megastructure',
    tier: 4,
    description: 'Câble en nanotubes de carbone reliant la métropole au spacioport synchrone en orbite géostationnaire.',
    lore: 'Réduit à néant les coûts logistiques de mise en orbite et multiplie par dix la vitesse d’amarrage.',
    iconName: 'Layers',
    cost: { minerals: 800, credits: 750, researchPoints: 200 },
    maintenance: { energy: 50, credits: 30 },
    production: { minerals: 100, energy: 80, credits: 120, moraleBonus: 15 },
    districtSlotsRequired: 4,
    requiredTechId: 'tech_log_3',
    aiTags: ['megastructure', 'ultimate_logistics']
  },
  {
    id: 'bld_gaia_weather_spire',
    name: 'Flèche de Géo-Ingénierie Atmosphérique',
    category: 'megastructure',
    tier: 4,
    description: 'Tour troposphérique modulant le climat planétaire pour en faire un paradis d’abondance biologique.',
    lore: 'Même sur un monde de cendres volcaniques, la Flèche fait renaître des océans limpides et des cieux d’azur.',
    iconName: 'Globe',
    cost: { minerals: 750, credits: 800, researchPoints: 220 },
    maintenance: { energy: 60 },
    production: { food: 200, moraleBonus: 25, credits: 80 },
    districtSlotsRequired: 4,
    requiredTechId: 'tech_civ_3',
    aiTags: ['megastructure', 'terraforming_mastery']
  }
];

export function getBuildingById(id: string): PlanetaryBuildingDefinition | undefined {
  return PLANETARY_BUILDINGS_CATALOG.find(b => b.id === id);
}

export function getBuildingsByCategory(cat: BuildingCategory): PlanetaryBuildingDefinition[] {
  return PLANETARY_BUILDINGS_CATALOG.filter(b => b.category === cat);
}

export function getBuildingsByTier(tier: 1 | 2 | 3 | 4): PlanetaryBuildingDefinition[] {
  return PLANETARY_BUILDINGS_CATALOG.filter(b => b.tier === tier);
}

/**
 * Calculates dynamic resource costs and construction duration in turns.
 * Cost scales as more buildings of the same category or type exist,
 * and modulates based on planetary biome affinities and difficulty.
 */
export function calculateDynamicBuildingCost(
  building: PlanetaryBuildingDefinition,
  existingCountOnColony: number,
  totalEmpireBuildingsOfCategory: number,
  planetType: 'telluric_fertile' | 'oceanic' | 'volcanic_mineral' | 'frozen_tundra' | string,
  difficulty: 'normal' | 'tactical' | 'hardcore' = 'tactical'
): {
  minerals: number;
  credits: number;
  energy: number;
  researchPoints: number;
  constructionTurns: number;
  biomeSynergyFactor: number;
  biomeSynergyLabel: string;
} {
  // Density escalation factor (logistical friction on the colony)
  const densityMultiplier = 1 + (existingCountOnColony * 0.15) + (totalEmpireBuildingsOfCategory * 0.05);

  // Biome affinity modifier
  let biomeFactor = 1.0;
  let synergyLabel = 'Rendement standard';

  if (building.category === 'extraction') {
    if (planetType === 'volcanic_mineral') {
      biomeFactor = 0.85; // 15% discount on mineral-rich volcanic worlds!
      synergyLabel = 'Biome Volcanique : Gisements de métaux affleurants (-15% coût minier)';
    } else if (planetType === 'oceanic') {
      biomeFactor = 1.2;
      synergyLabel = 'Biome Océanique : Forage sous-marin complexe (+20% coût minier)';
    }
  } else if (building.category === 'habitat') {
    if (planetType === 'telluric_fertile') {
      biomeFactor = 0.8;
      synergyLabel = 'Biome Tellurique Fertile : Climat hospitalier pour les biodômes (-20% coût)';
    } else if (planetType === 'frozen_tundra') {
      biomeFactor = 1.25;
      synergyLabel = 'Biome Toundra Glacée : Isolation cryogénique requise (+25% coût)';
    }
  } else if (building.category === 'energy') {
    if (planetType === 'volcanic_mineral') {
      biomeFactor = 0.85;
      synergyLabel = 'Gradient géothermique extrême : centrales optimisées';
    }
  }

  // Difficulty scale
  const diffMultiplier = difficulty === 'hardcore' ? 1.2 : difficulty === 'tactical' ? 1.0 : 0.9;
  const netScale = densityMultiplier * biomeFactor * diffMultiplier;

  // Base construction turns
  const baseTurns = building.tier === 1 ? 1 : building.tier === 2 ? 2 : building.tier === 3 ? 3 : 4;
  const turns = difficulty === 'hardcore' && building.tier >= 3 ? baseTurns + 1 : baseTurns;

  return {
    minerals: Math.round(building.cost.minerals * netScale),
    credits: Math.round(building.cost.credits * netScale),
    energy: building.cost.energy ? Math.round(building.cost.energy * netScale) : 0,
    researchPoints: building.cost.researchPoints ? Math.round(building.cost.researchPoints * diffMultiplier) : 0,
    constructionTurns: turns,
    biomeSynergyFactor: biomeFactor,
    biomeSynergyLabel: synergyLabel
  };
}

/**
 * Calculates AI-driven dynamic production outputs and bonuses for a building,
 * taking into account planetary synergies and AI tags.
 */
export function calculateDynamicBuildingOutput(
  building: PlanetaryBuildingDefinition,
  planetType: string,
  colonyMorale: number = 70
): {
  minerals: number;
  food: number;
  energy: number;
  credits: number;
  researchPoints: number;
  defenseRating: number;
  moraleBonus: number;
  aiSynergyText: string;
} {
  const prod = building.production;
  const moraleFactor = colonyMorale >= 80 ? 1.15 : colonyMorale < 40 ? 0.75 : 1.0;

  let min = (prod.minerals || 0);
  let food = (prod.food || 0);
  let nrg = (prod.energy || 0);
  let crd = (prod.credits || 0);
  let res = (prod.researchPoints || 0);
  let def = (prod.defenseRating || 0);
  let mor = (prod.moraleBonus || 0);

  let synergyText = '';

  if (building.category === 'extraction' && planetType === 'volcanic_mineral') {
    min = Math.round(min * 1.3);
    synergyText = 'Bonus Géologique Volcanique : Production minérale +30%';
  } else if (building.category === 'habitat' && planetType === 'telluric_fertile') {
    food = Math.round(food * 1.25);
    synergyText = 'Bonus Biosphérique : Synthèse agricole +25%';
  } else if (building.category === 'defense') {
    def = Math.round(def * (colonyMorale > 60 ? 1.1 : 1.0));
    synergyText = 'Réseau de Guet Actif : Verrouillage sectoriel certifié';
  }

  return {
    minerals: Math.round(min * moraleFactor),
    food: Math.round(food * moraleFactor),
    energy: Math.round(nrg * moraleFactor),
    credits: Math.round(crd * moraleFactor),
    researchPoints: Math.round(res * moraleFactor),
    defenseRating: def,
    moraleBonus: mor,
    aiSynergyText: synergyText || 'Rendement nominal certifié par le Directoire'
  };
}
