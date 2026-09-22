export interface PlanetaryBiomeDefinition {
  id: string;
  name: string;
  classification: 'telluric_fertile' | 'oceanic' | 'volcanic_mineral' | 'frozen_tundra' | 'arid_desert' | 'ecumenopolis' | 'toxic_world';
  description: string;
  lore: string;
  colorNeon: string;
  defaultDistrictSlots: number;
  baseModifiers: {
    foodMultiplier: number;
    mineralsMultiplier: number;
    energyMultiplier: number;
    researchMultiplier: number;
    habitabilityPercent: number;
  };
  nativeHazards: string[];
  recommendedBuildings: string[]; // Building IDs from catalog
}

export const PLANETARY_BIOMES_CATALOG: PlanetaryBiomeDefinition[] = [
  {
    id: 'biome_telluric_gaia',
    name: 'Monde Tellurique Gaïa',
    classification: 'telluric_fertile',
    description: 'Biosphère luxuriante avec cycle d’eau complet, forêts denses et atmosphère respirable.',
    lore: 'Le graal des colons de l’Union, rappelant la Terre primordiale avant le Grand Cataclysme.',
    colorNeon: '#00ff88',
    defaultDistrictSlots: 8,
    baseModifiers: {
      foodMultiplier: 1.35,
      mineralsMultiplier: 1.0,
      energyMultiplier: 1.1,
      researchMultiplier: 1.15,
      habitabilityPercent: 95
    },
    nativeHazards: ['Orages magnétiques légers'],
    recommendedBuildings: ['bld_agrodome_hydro', 'bld_hab_block', 'bld_bio_synth_vat']
  },
  {
    id: 'biome_oceanic_deep',
    name: 'Planète Océanique Profonde',
    classification: 'oceanic',
    description: '98% de la surface couverte d’eaux salines tièdes avec cités flottantes et récifs bioluminescents.',
    lore: 'L’énergie marémotrice et l’aquaculture intensive compensent la rareté des terres émergées.',
    colorNeon: '#00f3ff',
    defaultDistrictSlots: 7,
    baseModifiers: {
      foodMultiplier: 1.25,
      mineralsMultiplier: 0.75,
      energyMultiplier: 1.3,
      researchMultiplier: 1.1,
      habitabilityPercent: 85
    },
    nativeHazards: ['Mégatsunamis hydrodynamiques', 'Pressions abyssales'],
    recommendedBuildings: ['bld_agrodome_hydro', 'bld_comm_outpost', 'bld_quantum_lab']
  },
  {
    id: 'biome_volcanic_rich',
    name: 'Monde Volcanique & Magmatique',
    classification: 'volcanic_mineral',
    description: 'Plaques tectoniques instables, rivières de lave et gisements colossaux de métaux lourds.',
    lore: 'Un enfer d’acide et de soufre, mais une mine d’or infinie pour l’industrie sidérurgique de la flotte.',
    colorNeon: '#ff3366',
    defaultDistrictSlots: 6,
    baseModifiers: {
      foodMultiplier: 0.4,
      mineralsMultiplier: 1.6,
      energyMultiplier: 1.4,
      researchMultiplier: 0.9,
      habitabilityPercent: 50
    },
    nativeHazards: ['Éruptions basaltiques', 'Pluies acides corrosives'],
    recommendedBuildings: ['bld_mine_surface', 'bld_deep_mantle_bore', 'bld_nanite_forge']
  },
  {
    id: 'biome_cryo_tundra',
    name: 'Planète Cryogénique Glaciaire',
    classification: 'frozen_tundra',
    description: 'Glaces éternelles, températures descendant à -140°C et gisements d’Hélium-3 sous calotte.',
    lore: 'Exige des dômes thermiques pressurisés continuellement alimentés par les réacteurs de la colonie.',
    colorNeon: '#7dd3fc',
    defaultDistrictSlots: 6,
    baseModifiers: {
      foodMultiplier: 0.5,
      mineralsMultiplier: 1.1,
      energyMultiplier: 0.8,
      researchMultiplier: 1.3,
      habitabilityPercent: 60
    },
    nativeHazards: ['Blizzards cryogéniques', 'Congélation subite'],
    recommendedBuildings: ['bld_hab_block', 'bld_fusion_reactor_ground', 'bld_quantum_lab']
  },
  {
    id: 'biome_arid_desert',
    name: 'Monde Désertique & Dunes Radieuses',
    classification: 'arid_desert',
    description: 'Mers de sable siliceux, rayonnement solaire intense et vestiges de civilisations éteintes.',
    lore: 'Idéal pour le déploiement de vastes fermes solaires et la fouille d’artéfacts anciens dans les dunes.',
    colorNeon: '#ffb700',
    defaultDistrictSlots: 7,
    baseModifiers: {
      foodMultiplier: 0.65,
      mineralsMultiplier: 1.2,
      energyMultiplier: 1.5,
      researchMultiplier: 1.2,
      habitabilityPercent: 70
    },
    nativeHazards: ['Tempêtes de sable ionisé', 'Écarts thermiques extrêmes'],
    recommendedBuildings: ['bld_solar_array', 'bld_perimeter_turret', 'bld_commercial_concourse']
  },
  {
    id: 'biome_ecumenopolis',
    name: 'Cité-Monde Écuménopole',
    classification: 'ecumenopolis',
    description: 'Planète entièrement urbanisée, recouverte de tours kilométriques et de circuits cybernétiques.',
    lore: 'Une merveille d’ingénierie où des milliards d’âmes cohabitent sous les néons de l’hyper-métropole.',
    colorNeon: '#c084fc',
    defaultDistrictSlots: 10,
    baseModifiers: {
      foodMultiplier: 0.3,
      mineralsMultiplier: 0.6,
      energyMultiplier: 1.2,
      researchMultiplier: 1.5,
      habitabilityPercent: 80
    },
    nativeHazards: ['Saturation du réseau thermique', 'Criminalité des bas-fonds'],
    recommendedBuildings: ['bld_commercial_concourse', 'bld_quantum_lab', 'bld_orbital_elevator']
  }
];

export function getBiomeById(id: string): PlanetaryBiomeDefinition | undefined {
  return PLANETARY_BIOMES_CATALOG.find(b => b.id === id);
}
