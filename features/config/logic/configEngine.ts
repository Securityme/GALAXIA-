import { 
  EraDefinition, 
  EraId, 
  GameSetupConfig, 
  LeaderTrait, 
  CouncilMember, 
  PlanetaryColony 
} from '@/types/config';

export const ERAS_CATALOG: EraDefinition[] = [
  {
    id: 'post_cataclysm',
    title: "L'Exode Post-Cataclysme",
    subtitle: 'Survie, Réfugiés & Reconstruction',
    description: "Après l'effondrement gravitationnel du berceau originel, les rescapés fuient à bord de l'ASTRA. Les cales sont encombrées de réfugiés et les réacteurs sont instables.",
    loreModifier: 'Pression démographique forte, coque sous contrainte, réserves de survie comptées.',
    initialModifiers: {
      hull: 850,
      credits: 300,
      energy: 220,
      morale: 50,
      threatBonus: 10
    }
  },
  {
    id: 'imperial_expansion',
    title: "L'Expansion Impériale Lointaine",
    subtitle: 'Conquête, Technocratie & Ressources',
    description: "Mandaté par l'Union Centrale pour asseoir son hégémonie sur le Secteur Zéro. Flotte disciplinée, crédits abondants, mais tensions politiques vives au sein du Conseil.",
    loreModifier: 'Finances saines, escadres de frappe prêtes au combat, attentes politiques colossales.',
    initialModifiers: {
      hull: 1200,
      credits: 650,
      energy: 350,
      morale: 70,
      threatBonus: 20
    }
  },
  {
    id: 'nomad_ark',
    title: "L'Arche Nomade Autonome",
    subtitle: 'Autarcie Spatiale & Flotte Renforcée',
    description: "Une civilisation qui a renoncé aux ancrages planétaires. L'ASTRA est une cité-flottille autosuffisante, escortée par des meutes de drones miniers et de corvettes d'élite.",
    loreModifier: 'Autarcie totale, modules ASTRA amplifiés, dépendance minimale aux sols planétaires.',
    initialModifiers: {
      hull: 1400,
      credits: 400,
      energy: 400,
      morale: 65,
      threatBonus: 5
    }
  },
  {
    id: 'phoenix_awakening',
    title: 'Le Réveil du Phénix',
    subtitle: 'Renaissance Technologique & Singularité',
    description: "Des millénaires de stase s'achèvent. Le vaisseau-monde se réactive dans un secteur inconnu. Les protocoles anciens promettent des percées scientifiques fulgurantes.",
    loreModifier: 'Potentiel de R&D immense, instabilité des condensateurs FTL, anomalies quantiques.',
    initialModifiers: {
      hull: 950,
      credits: 450,
      energy: 300,
      morale: 60,
      threatBonus: 15
    }
  }
];

export const AVAILABLE_LEADER_TRAITS: LeaderTrait[] = [
  {
    id: 'strat_implacable',
    name: 'Stratège Implacable',
    category: 'tactical',
    description: 'Une rigueur d’airain forgée dans les académies navales impériales.',
    passiveBonus: '+15% Efficacité militaire en combat, +10 Sécurité de secteur.',
    effects: [{ stat: 'combat', value: 15 }, { stat: 'security', value: 10 }]
  },
  {
    id: 'vis_stellaire',
    name: 'Visionnaire Stellaire',
    category: 'psychological',
    description: 'Capacité à anticiper les bifurcations technologiques et naviguer dans le chaos.',
    passiveBonus: '+20% R&D Scientifique, +10 Fidélité du Pôle Scientifique.',
    effects: [{ stat: 'science', value: 20 }, { stat: 'sci_loyalty', value: 10 }]
  },
  {
    id: 'techno_zele',
    name: 'Technocrate Zélé',
    category: 'tactical',
    description: 'Optimisation chirurgicale des flux de plasma et des réacteurs de fusion.',
    passiveBonus: '+25 Énergie par cycle, +10% Rendement des condensateurs FTL.',
    effects: [{ stat: 'energy', value: 25 }]
  },
  {
    id: 'paci_diplo',
    name: 'Pacificateur Diplomate',
    category: 'political',
    description: 'Artiste de la négociation sous haute tension spatiale.',
    passiveBonus: '+15 Fidélité du Pôle Diplomatique, coût des tributs réduit de 30%.',
    effects: [{ stat: 'diplomacy', value: 15 }]
  },
  {
    id: 'stoic_resilient',
    name: 'Stoïque Résilient',
    category: 'psychological',
    description: 'Une volonté inébranlable même face aux décompressions explosives.',
    passiveBonus: '+150 Coque max ASTRA, résistance accrue aux pertes de moral.',
    effects: [{ stat: 'hull', value: 150 }]
  },
  {
    id: 'negoc_commercial',
    name: 'Négociateur Commercial',
    category: 'political',
    description: 'Réseaux de troc et spéculation sur les matières fissiles.',
    passiveBonus: '+20% Gains de crédits planétaires et miniers.',
    effects: [{ stat: 'credits', value: 20 }]
  }
];

export const DEFAULT_COUNCIL: Record<string, CouncilMember> = {
  military: {
    poleId: 'military',
    name: 'Amirale Valéria Cross',
    title: 'Commandeur de la Flotte Tactique',
    specialty: 'Escadres de chasseurs et interception FTL',
    loyalty: 85,
    influence: 80,
    bonusSummary: '+10% Défense de Coque & Patrouilles',
    avatarId: 'military',
    quote: "La paix n'est qu'un bref intervalle entre deux calibrations de boucliers.",
    cybernetics: 'Monocle de visée balistique Mk-VI & liaison neurale avec l’ASTRA',
    neonColor: '#f43f5e'
  },
  scientific: {
    poleId: 'scientific',
    name: 'Dr. Théo Vance',
    title: 'Directeur de la Recherche Quantique',
    specialty: 'Physique des singularités et réacteurs plasma',
    loyalty: 80,
    influence: 75,
    bonusSummary: '+15% Efficience énergétique du Noyau',
    avatarId: 'scientific',
    quote: "L'univers n'est ni bienveillant ni cruel : c'est un ensemble d'équations différentielles.",
    cybernetics: 'Dôme synaptique avec processeur neural quantique cyan',
    neonColor: '#00f3ff'
  },
  civilization: {
    poleId: 'civilization',
    name: 'Archonte Eléna Sol',
    title: 'Ministre de l’Harmonie & Population',
    specialty: 'Bio-dômes agro-alimentaires et moral civique',
    loyalty: 90,
    influence: 70,
    bonusSummary: '+10 Moral de base & Croissance',
    avatarId: 'civilization',
    quote: "Si nous sacrifions notre âme pour traverser le néant, nous ne serons que des monstres d'acier.",
    cybernetics: 'Capteurs d’ambiance empathique et diffuseur phéromonique d’apaisement',
    neonColor: '#ffb700'
  },
  economic: {
    poleId: 'economic',
    name: 'Chancelier Marcus Thorne',
    title: 'Grand Trésorier de l’Union',
    specialty: 'Flux de crédits et marchés miniers',
    loyalty: 75,
    influence: 85,
    bonusSummary: '+20 Crédits par tour',
    avatarId: 'economic',
    quote: "Donnez-moi suffisamment de crédits et je ferai chanter les soleils.",
    cybernetics: 'Interface palmaire de transaction financière biométrique or ambré',
    neonColor: '#f59e0b'
  },
  diplomatic: {
    poleId: 'diplomatic',
    name: 'Envoyée Lyra Chen',
    title: 'Plénipotentiaire du Secteur Zéro',
    specialty: 'Protocoles de premier contact et factions neutres',
    loyalty: 80,
    influence: 65,
    bonusSummary: 'Délai d’alerte pirate étendu',
    avatarId: 'diplomatic',
    quote: "L'art de la guerre commence par la maîtrise du mot juste au moment opportun.",
    cybernetics: 'Modulateur de cordes vocales xéno-cognitif en soie de graphène',
    neonColor: '#00ff88'
  },
  logistics: {
    poleId: 'logistics',
    name: 'Intendant Jarek Karr',
    title: 'Maître des Fours & Drones de Fret',
    specialty: 'Raffineries orbitales et maintenance ASTRA',
    loyalty: 85,
    influence: 70,
    bonusSummary: '+15 Minéraux raffinés par tour',
    avatarId: 'logistics',
    quote: "Vos grands idéaux ne valent pas un boulon de rechange quand une conduite éclate à 3h du matin.",
    cybernetics: 'Bras bionique industriel en tungstène avec connecteurs pneumatiques',
    neonColor: '#eab308'
  }
};

export const DEFAULT_COLONY_NOVA_PARIS: PlanetaryColony = {
  id: 'nova_paris_prime',
  name: 'Nova Paris',
  planetType: 'telluric_fertile',
  orbitZone: 'goldilocks_habitable',
  population: 12000,
  buildings: [
    {
      id: 'bld_1',
      name: 'Complexe Minier Titane-Cobalt',
      type: 'mine',
      level: 1,
      outputSummary: '+45 Minéraux / cycle'
    },
    {
      id: 'bld_2',
      name: 'Bio-Dôme Agro-Hydroponique',
      type: 'agrodome',
      level: 1,
      outputSummary: '+60 Rations Alimentaires / cycle'
    },
    {
      id: 'bld_3',
      name: 'Réseau de Canons Gauss & Dôme Défensif',
      type: 'defense_grid',
      level: 1,
      outputSummary: '+15 Sécurité Locale'
    }
  ],
  localProduction: {
    food: 60,
    minerals: 45,
    energy: 20
  }
};

export function createDefaultConfig(): GameSetupConfig {
  return {
    mode: 'manual',
    superphase: 1,
    eraId: 'post_cataclysm',
    unionName: 'Union Stellaire Kepler',
    loreCustomNotes: "Vaisseau d'évacuation de la troisième vague solaire, fuyant la nova du système d'origine.",
    leader: {
      name: 'Amiral Vaelen Vance',
      title: 'Commandant de Flotte d’Exode',
      avatarId: 'leader_vance',
      traits: [AVAILABLE_LEADER_TRAITS[0], AVAILABLE_LEADER_TRAITS[1]]
    },
    starterTechId: 'mil_gauss_cannons',
    astra: {
      name: 'ASTRA I - L’Éternité',
      hullMax: 1000,
      hullCurrent: 850,
      structuralShields: 80,
      fusionReactors: 350,
      ftlCapacitors: 100,
      combatSquadrons: 4,
      miningDrones: 8
    },
    council: { ...DEFAULT_COUNCIL } as any,
    difficulty: 'tactical',
    sectorZeroThreat: 'moderate',
    macroAnchor: {
      quadrant: 'Quadrant Boréal-3',
      nebulaAffinity: 'Nébuleuse du Voile Sombre',
      sectorLabel: 'Secteur Zéro (Alpha)'
    },
    microAnchor: {
      hostStarClass: 'Étoile Naine Jaune G2V',
      arrivalOrbit: 'Orbite Stable Goldilocks (1.1 UA)'
    },
    initialColonies: [DEFAULT_COLONY_NOVA_PARIS]
  };
}

export function generateRandomConfig(): GameSetupConfig {
  const era = ERAS_CATALOG[Math.floor(Math.random() * ERAS_CATALOG.length)];
  const shuffledTraits = [...AVAILABLE_LEADER_TRAITS].sort(() => 0.5 - Math.random());
  const selectedTraits = [shuffledTraits[0], shuffledTraits[1]];

  return {
    mode: 'random',
    superphase: 3,
    eraId: era.id,
    unionName: `Confédération ${['Orion', 'Centauri', 'Cassiopée', 'Pégase', 'Hyperion'][Math.floor(Math.random() * 5)]}`,
    loreCustomNotes: `Flotte issue du protocole ${era.title}, déployée d'urgence dans le Secteur Zéro.`,
    leader: {
      name: `Amiral ${['Sterling', 'Vander', 'Nakamura', 'O’Connor', 'Volkov'][Math.floor(Math.random() * 5)]}`,
      title: 'Commandant Élu du Conseil',
      traits: selectedTraits
    },
    astra: {
      name: `ASTRA - ${['Souverain', 'Hélios', 'Titan', 'Nemesis', 'Aurore'][Math.floor(Math.random() * 5)]}`,
      hullMax: era.initialModifiers.hull + 200,
      hullCurrent: era.initialModifiers.hull,
      structuralShields: 75,
      fusionReactors: era.initialModifiers.energy + 50,
      ftlCapacitors: 90,
      combatSquadrons: 5,
      miningDrones: 10
    },
    council: { ...DEFAULT_COUNCIL } as any,
    difficulty: 'tactical',
    sectorZeroThreat: 'moderate',
    macroAnchor: {
      quadrant: 'Quadrant Stellaire Gamma-9',
      nebulaAffinity: 'Nuage de Gaz Émeraude',
      sectorLabel: 'Secteur Zéro (Ancrage aléatoire)'
    },
    microAnchor: {
      hostStarClass: 'Étoile Binaire F5/K2',
      arrivalOrbit: 'Zone Tempérée de Ravitaillement'
    },
    initialColonies: [
      {
        ...DEFAULT_COLONY_NOVA_PARIS,
        name: `Nova ${['Terra', 'Elysium', 'Sparta', 'Vanguard'][Math.floor(Math.random() * 4)]}`
      }
    ]
  };
}
