export interface InterstellarFaction {
  id: string;
  name: string;
  archetype: 'federation' | 'megacorp' | 'pirate_syndicate' | 'hive_mind' | 'fallen_empire' | 'zealots';
  homeworld: string;
  leaderTitle: string;
  ideology: string;
  threatAssessment: 'peaceful' | 'opportunistic' | 'aggressive' | 'existential';
  neonColor: string;
  lore: string;
  tradeGoods: string[];
  diplomaticTraits: string[];
}

export const INTERSTELLAR_FACTIONS_CATALOG: InterstellarFaction[] = [
  {
    id: 'fac_solar_ascendancy',
    name: 'Ascendance Solaire Terrestre',
    archetype: 'federation',
    homeworld: 'Neo-Terra (Système Solis Prime)',
    leaderTitle: 'Archonte Suprême',
    ideology: 'Préservation génétique humaine, république constitutionnelle et diplomatie armée.',
    threatAssessment: 'peaceful',
    neonColor: '#00f3ff',
    lore: 'Héritiers directs des premiers vaisseaux-arches ayant échappé à l’effondrement du Berceau.',
    tradeGoods: ['Alliages légers', 'Archives génétiques', 'Cerveaux cybernétiques'],
    diplomaticTraits: ['Légaliste', 'Marchand d’alliances', 'Défenseur des traités']
  },
  {
    id: 'fac_nexus_cybernetics',
    name: 'Conglomérat Omnicorp Nexus',
    archetype: 'megacorp',
    homeworld: 'Cygnus Foundry (Station Mégastructure)',
    leaderTitle: 'Président Directeur Général Exécutif',
    ideology: 'Capitalisme interstellaire sans entraves, brevets technologiques et mercenaires corporatifs.',
    threatAssessment: 'opportunistic',
    neonColor: '#ffb700',
    lore: 'Contrôle 60% du transit de carburant deutérium et n’hésite pas à asphyxier économiquement ses rivaux.',
    tradeGoods: ['Crédits quantiques', 'Drones miniers automatisés', 'Propulseurs de saut'],
    diplomaticTraits: ['Vénal', 'Pragmatique', 'Sensible aux sanctions']
  },
  {
    id: 'fac_corsair_clans',
    name: 'Pacte des Écorcheurs du Vide',
    archetype: 'pirate_syndicate',
    homeworld: 'Ceinture d’Astéroïdes de Tartarus',
    leaderTitle: 'Seigneur de Guerre du Pacte',
    ideology: 'Loi du plus fort, pillage des convois civils et contrebande d’artéfacts xenos interdits.',
    threatAssessment: 'aggressive',
    neonColor: '#ff3366',
    lore: 'Flotte hétéroclite de frégates furtives harcelant les routes commerciales des mondes périphériques.',
    tradeGoods: ['Munitions sales', 'Cristaux noirs', 'Propulseurs trafiqués'],
    diplomaticTraits: ['Imprévisible', 'Racket de tributs', 'Férocité au combat']
  },
  {
    id: 'fac_chronos_ancients',
    name: 'Gardiens Oubliés de Chronos',
    archetype: 'fallen_empire',
    homeworld: 'Sanctuaire Stellaire Oméga',
    leaderTitle: 'Éveillé Éternel',
    ideology: 'Stase millénaire, dédain des jeunes races et protection jalouse de leurs mondes-sanctuaires.',
    threatAssessment: 'existential',
    neonColor: '#a855f7',
    lore: 'Leurs cuirassés millénaires surpassent technologiquement toute la flotte de l’Union réunie.',
    tradeGoods: ['Composites à matière noire', 'Générateurs à singularité'],
    diplomaticTraits: ['Arrogant', 'Intransigeant', 'Puissance cataclysmique']
  }
];

export interface AstraWorldShipModule {
  id: string;
  name: string;
  category: 'core' | 'propulsion' | 'hangar' | 'habitation' | 'science';
  tier: 1 | 2 | 3;
  description: string;
  statBonus: string;
  installCost: {
    minerals: number;
    credits: number;
    energy?: number;
    researchPoints?: number;
  };
}

export const ASTRA_MODULES_CATALOG: AstraWorldShipModule[] = [
  {
    id: 'mod_tachyon_core',
    name: 'Cœur de Réacteur à Tachyons',
    category: 'core',
    tier: 2,
    description: 'Accélérateur sub-luminique décuplant le flux énergétique total de la station spatiale.',
    statBonus: '+80 Énergie/tour, +15% Boucliers structuraux',
    installCost: { minerals: 180, credits: 160, researchPoints: 40 }
  },
  {
    id: 'mod_fighter_bay',
    name: 'Baie d’Appontage Rapide & Escadrons Vautour',
    category: 'hangar',
    tier: 1,
    description: 'Catapultes électromagnétiques permettant le largage instantané de 12 intercepteurs.',
    statBonus: '+12 Chasseurs en vol, +25 Puissance militaire de flotte',
    installCost: { minerals: 120, credits: 90 }
  },
  {
    id: 'mod_cryo_vault',
    name: 'Cryo-Voûte Haute Capacité d’Origine',
    category: 'habitation',
    tier: 1,
    description: 'Chambres d’hibernation préservant 50 000 embryons et spécialistes en sommeil profond.',
    statBonus: '+10% Croissance coloniale, +5 Bonheur civil',
    installCost: { minerals: 100, credits: 120 }
  },
  {
    id: 'mod_subspace_sensor',
    name: 'Réseau de Capteurs Sub-spatiaux Longue Portée',
    category: 'science',
    tier: 2,
    description: 'Réseau d’antennes tachyoniques anticipant les sauts de flottes corsaires 2 tours à l’avance.',
    statBonus: '+15 R&D/tour, Détection anticipée des crises de secteur',
    installCost: { minerals: 140, credits: 130, researchPoints: 50 }
  }
];
