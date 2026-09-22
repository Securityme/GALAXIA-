export type DimensionScale = 'macro_galactic' | 'meso_stellar' | 'micro_planetary';
export type MultiScaleDimension = DimensionScale;

export interface MacroGalacticSector {
  id: string;
  name: string;
  quadrant: string;
  threatCoefficient: number; // 0.0 to 1.0
  stellarDensity: 'sparse' | 'normal' | 'dense' | 'nebular_cluster';
  cosmicPhenomenon: string;
  loreAnchor: string;
  hyperspaceRoutes: string[];
}

export interface MesoStellarOrbit {
  orbitIndex: number;
  zone: 'inner_furnace' | 'goldilocks_habitable' | 'outer_belt';
  zoneName: string;
  solarFlux: number; // W/m2 normalized
  radiationHazard: 'low' | 'moderate' | 'extreme';
  dominantResources: string[];
  astraDocked: boolean;
  orbitalDefenseGridActive: boolean;
}

export interface MicroPlanetaryDistrict {
  id: string;
  name: string;
  topographyType: 'volcanic_plateau' | 'alluvial_basin' | 'crystalline_crags' | 'methane_ocean_shelf' | 'tundra_shield';
  description: string;
  buildableSlots: number;
  allocatedBuildingId?: string;
  geologicalPurityFactor: number; // 1.0 to 2.0
  soilAffinity: 'minerals' | 'food' | 'energy' | 'science';
}

export interface MultiDimensionalTopology {
  currentScale: DimensionScale;
  macroSectors: MacroGalacticSector[];
  mesoOrbits: MesoStellarOrbit[];
  microDistricts: Record<string, MicroPlanetaryDistrict[]>; // keyed by colonyId
}

export const INITIAL_MULTI_SCALE_TOPOLOGY: MultiDimensionalTopology = {
  currentScale: 'meso_stellar',
  macroSectors: [
    {
      id: 'sec_zero',
      name: 'Secteur Zéro : Le Tombeau des Mondes',
      quadrant: 'Quadrant Thêta-Prime',
      threatCoefficient: 0.35,
      stellarDensity: 'dense',
      cosmicPhenomenon: 'Pulsar à résonance gravitationnelle instable',
      loreAnchor: 'Point de ralliement originel de la flotte humaine après l’effondrement du réseau galactique.',
      hyperspaceRoutes: ['Vecteur Orion-Bêta', 'Ligne Franche Cygnus']
    },
    {
      id: 'sec_astraea',
      name: 'Nébuleuse d’Astrée',
      quadrant: 'Quadrant Émeraude',
      threatCoefficient: 0.65,
      stellarDensity: 'nebular_cluster',
      cosmicPhenomenon: 'Nuage de poussières ionisées et de cristaux métastables',
      loreAnchor: 'Zone riche en gaz rares où les pirates et les IA renégates tendent des embuscades.',
      hyperspaceRoutes: ['Sillon d’Astrée', 'Couloir Obscur']
    },
    {
      id: 'sec_kalyx',
      name: 'Le Grand Abîme de Kalyx',
      quadrant: 'Bordure Extérieure',
      threatCoefficient: 0.85,
      stellarDensity: 'sparse',
      cosmicPhenomenon: 'Horizon des événements d’un trou noir supermassif dormant',
      loreAnchor: 'Les ruines des Précurseurs y émettent un murmure radio constant et hypnotique.',
      hyperspaceRoutes: ['Passage du Néant']
    }
  ],
  mesoOrbits: [
    {
      orbitIndex: 1,
      zone: 'inner_furnace',
      zoneName: 'Orbite I : La Fournaise Solaire',
      solarFlux: 2.8,
      radiationHazard: 'extreme',
      dominantResources: ['Énergie Solaire Intense', 'Métaux Lourds Électro-Raffinés'],
      astraDocked: false,
      orbitalDefenseGridActive: false
    },
    {
      orbitIndex: 2,
      zone: 'goldilocks_habitable',
      zoneName: 'Orbite II : Boucle d’Or (Zone Tempérée Primaire)',
      solarFlux: 1.0,
      radiationHazard: 'low',
      dominantResources: ['Eau Liquide', 'Biomasse Vivrière', 'Atmosphère Azotée'],
      astraDocked: true,
      orbitalDefenseGridActive: true
    },
    {
      orbitIndex: 3,
      zone: 'outer_belt',
      zoneName: 'Orbite III : Ceinture Froide d’Astéroïdes',
      solarFlux: 0.25,
      radiationHazard: 'moderate',
      dominantResources: ['Silicates Purs', 'Glace de Méthane', 'Titanium Spongieux'],
      astraDocked: false,
      orbitalDefenseGridActive: false
    }
  ],
  microDistricts: {
    'col_alpha': [
      {
        id: 'dist_alpha_1',
        name: 'Plaine Centrale d’Astra-Colony',
        topographyType: 'alluvial_basin',
        description: 'Bassin sédimentaire riche en azote propice à l’implantation des agro-dômes et complexes urbains.',
        buildableSlots: 3,
        geologicalPurityFactor: 1.25,
        soilAffinity: 'food'
      },
      {
        id: 'dist_alpha_2',
        name: 'Plateau Minéral des Fissures Pourpres',
        topographyType: 'volcanic_plateau',
        description: 'Roches magmatiques refroidies saturées en pyrites et composés ferro-magnétiques.',
        buildableSlots: 3,
        geologicalPurityFactor: 1.4,
        soilAffinity: 'minerals'
      },
      {
        id: 'dist_alpha_3',
        name: 'Crêtes Cristallines du Boréal',
        topographyType: 'crystalline_crags',
        description: 'Aiguilles de quartz supraconducteur permettant la résonance des antennes et laboratoires quantiques.',
        buildableSlots: 2,
        geologicalPurityFactor: 1.6,
        soilAffinity: 'science'
      }
    ]
  }
};
