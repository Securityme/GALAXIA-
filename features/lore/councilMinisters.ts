import { CouncilPoleId } from '@/types/config';

export interface CouncilMinisterDetails {
  poleId: CouncilPoleId;
  name: string;
  officialTitle: string;
  superphase1Lore: string; // Origine historique & antécédents
  superphase2Psychology: string; // Traits psychologiques & doctrine politique
  superphase3TechFocus: string; // Axe technologique & priorités R&D
  visualPortraitDescription: string;
  cyberneticsAndAugments: string;
  signatureNeon: string; // Hex color
  bgGradient: string;
  quote: string;
  defaultLoyalty: number;
  defaultInfluence: number;
  bonusSummary: string;
}

export const COUNCIL_MINISTERS_CATALOG: Record<CouncilPoleId, CouncilMinisterDetails> = {
  military: {
    poleId: 'military',
    name: 'Amirale Valéria Cross',
    officialTitle: 'Commandeur de la Flotte Tactique & Défense ASTRA',
    superphase1Lore: "Vétérane de la débâcle du Rubicon Stellaire lors de l'Exode. Elle a mené l'arrière-garde de l'ASTRA à travers une nuée de météores et de corsaires, sacrifiant sa propre frégate amirale pour protéger les navires civils.",
    superphase2Psychology: "Intransigeante, méthodique et animée d'un sens du devoir martial absolu. Elle perçoit toute concession diplomatique comme une brèche dans notre périmètre défensif et exige la sanctuarisation de l'arsenal.",
    superphase3TechFocus: "Développement des Canons à Accélération Magnétique Gauss, Boucliers Polarisés à Dispersion de Plasma et Torpilles à Singularité Micro-Gravifique pour sanctuariser le Secteur Zéro.",
    visualPortraitDescription: "Exosquelette de combat noir mat avec collerette de blindage angulaire. Monocle de ciblage balistique rouge rubis (#f43f5e) sur l'œil droit, cicatrice de décompression cautérisée sur la joue, cheveux argentés coupés court.",
    cyberneticsAndAugments: "Monocle de visée télémétrique Mk-VI, implants d'endurance sous-cutanés en graphène, liaison neurale directe avec les systèmes d'armes de l'ASTRA.",
    signatureNeon: '#f43f5e',
    bgGradient: 'from-rose-500/20 via-slate-900 to-black',
    quote: "La paix n'est qu'un bref intervalle entre deux calibrations de boucliers. Restez vigilants ou soyez réduits en poussière cosmique.",
    defaultLoyalty: 85,
    defaultInfluence: 80,
    bonusSummary: "+10% Défense de Coque & Patrouilles d'interception"
  },
  scientific: {
    poleId: 'scientific',
    name: 'Dr. Théo Vance',
    officialTitle: 'Directeur de la Recherche Quantique & Singularités',
    superphase1Lore: "Ancien doyen de l'Académie Suprême des Hautes Énergies. Architecte clé du réacteur de saut tachyonique de l'ASTRA et pionnier de la manipulation de la matière noire.",
    superphase2Psychology: "Rationaliste absolu frôlant le détachement émotionnel. Guidé par une curiosité intellectuelle intarissable. Pour lui, le risque d'une anomalie quantique est toujours préférable à la stagnation technologique.",
    superphase3TechFocus: "Matrices de Calcul Quantique Auto-Évolutives, Confinement d'Anti-Matière et Sondes Tachyoniques pour cartographier les replis de l'espace-temps et surclasser nos limites physiques.",
    visualPortraitDescription: "Tunique de physicien en composite thermo-isolant blanc arctique et cyan néon (#00f3ff). Crâne rasé révélant des implants synaptiques luminescents pulsant au gré de ses analyses, lunettes holographiques sans monture.",
    cyberneticsAndAugments: "Dôme synaptique en polymère transparent avec processeur neural quantique, lentilles cornéennes spectrales pour la visualisation des flux sub-spatiaux.",
    signatureNeon: '#00f3ff',
    bgGradient: 'from-cyan-500/20 via-slate-900 to-black',
    quote: "L'univers n'est ni bienveillant ni cruel : c'est un ensemble d'équations différentielles qui attendent d'être résolues.",
    defaultLoyalty: 80,
    defaultInfluence: 75,
    bonusSummary: "+15% Efficience énergétique du Noyau & Découvertes"
  },
  civilization: {
    poleId: 'civilization',
    name: 'Archonte Eléna Sol',
    officialTitle: 'Ministre de l’Harmonie Citoyenne & Démographie',
    superphase1Lore: "Héritière de la Grande Arche Biologique, elle a personnellement supervisé la cryoconservation des embryons, semences végétales et trésors culturels de l'ancienne humanité lors de la fuite.",
    superphase2Psychology: "Empathique, résiliente et ardente protectrice du tissu social. Elle s'oppose avec véhémence aux rationnements brutaux et exige que la dignité humaine soit le phare de l'Union.",
    superphase3TechFocus: "Cités-Dômes Biophiliques d'Arche, Protocoles de Cohésion Neurale Citoyenne et Sanctuaires Mémoriels Transhumanistes pour garantir la stabilité psychologique et la croissance harmonieuse.",
    visualPortraitDescription: "Robe cérémonielle drapée en nanofibres ambre et or (#ffb700) infusées de filaments de cuivre. Chevelure brune tressée ornée d'une broche florale vivante cryogénisée, tatouages tribaux dorés le long de la gorge.",
    cyberneticsAndAugments: "Capteurs d'ambiance empathique intégrés dans les lobes temporaux, diffuseur phéromonique d'apaisement pour les assemblées en crise.",
    signatureNeon: '#ffb700',
    bgGradient: 'from-amber-500/20 via-slate-900 to-black',
    quote: "Si nous sacrifions notre âme et notre compassion pour traverser le néant, nous ne serons à l'arrivée que des monstres d'acier.",
    defaultLoyalty: 90,
    defaultInfluence: 70,
    bonusSummary: "+10 Moral de base, Croissance accélérée de la Population"
  },
  economic: {
    poleId: 'economic',
    name: 'Chancelier Marcus Thorne',
    officialTitle: 'Grand Trésorier de l’Union & Maître des Échanges',
    superphase1Lore: "Ancien magnat du Consortium Minier Trans-Kepler. C'est sa fortune et ses contrats logistiques qui ont permis de financer l'assemblage express de la coque de l'ASTRA dans les chantiers lunaires.",
    superphase2Psychology: "Pragmatique, rusé et obsédé par les bilans comptables. Pour Thorne, la loyauté s'achète, la guerre se calcule et l'équilibre budgétaire est la seule loi physique qui compte vraiment.",
    superphase3TechFocus: "Réseaux de Crédit Décentralisés Sub-Spatiaux, Fonderies Orbitales à Nanorobots et Marchés Galactiques Spéculatifs Automatisés pour maximiser le flux de trésorerie de l'Union.",
    visualPortraitDescription: "Costume trois-pièces d'amiral d'entreprise en velours noir d'encre et revers rehaussés d'or ambré (#f59e0b). Monocle quantique sur l'œil gauche affichant les cours des minerais en temps réel, bague chevalière gravée du symbole du Crédit.",
    cyberneticsAndAugments: "Interface palmaire de transaction financière biométrique, processeur d'analyse probabiliste des marchés sub-corticaux.",
    signatureNeon: '#f59e0b',
    bgGradient: 'from-yellow-500/20 via-slate-900 to-black',
    quote: "Donnez-moi suffisamment de crédits et je ferai chanter les soleils ; refusez-moi le budget et vos vaisseaux pourriront à quai.",
    defaultLoyalty: 75,
    defaultInfluence: 85,
    bonusSummary: "+20 Crédits par tour & Baisse des coûts de construction"
  },
  diplomatic: {
    poleId: 'diplomatic',
    name: 'Envoyée Lyra Chen',
    officialTitle: 'Plénipotentiaire du Secteur Zéro & Affaires Étrangères',
    superphase1Lore: "Négociatrice d'exception issue des délégations des mondes extérieurs. A rédigé le traité d'armistice avec les Clans Nomades de la Nébuleuse Sombre au cycle précédant notre arrivée.",
    superphase2Psychology: "Fine stratège politique, subtile et douée d'une patience d'araignée. Elle sait exploiter les rivalités inter-factions et préfère corrompre un ennemi plutôt que de gaspiller une torpille.",
    superphase3TechFocus: "Protocoles de Premier Contact Émergent, Transducteurs Linguistiques Xéno-Cognitifs et Chambre du Sénat Interstellaire Unifié pour neutraliser les menaces avant qu'elles n'ouvrent le feu.",
    visualPortraitDescription: "Tenue diplomatique futuriste fluide en soie de graphène vert émeraude (#00ff88) et noir d'obsidienne. Écharpe holographique projetant des glyphes diplomatiques, regard amande perçant, boucle d'oreille à transmetteur crypté.",
    cyberneticsAndAugments: "Modulateur de cordes vocales capable d'émuler les fréquences ultrasoniques et phéromonales extraterrestres, filtre anti-toxines cérébral.",
    signatureNeon: '#00ff88',
    bgGradient: 'from-emerald-500/20 via-slate-900 to-black',
    quote: "L'art de la guerre commence par la maîtrise du mot juste au moment opportun. Le canon n'est qu'un aveu d'échec du dialogue.",
    defaultLoyalty: 80,
    defaultInfluence: 65,
    bonusSummary: "Délai d'alerte pirate étendu, Tensions inter-pôles modérées"
  },
  logistics: {
    poleId: 'logistics',
    name: 'Intendant Jarek Karr',
    officialTitle: 'Surintendant des Docks, Raffineries & Chaînes de Fret',
    superphase1Lore: "A gravi tous les échelons depuis les ponts de manutention des cales de fusion. Il connaît chaque boulon, chaque conduite de plasma et chaque canal d'aération de l'ASTRA mieux que les architectes eux-mêmes.",
    superphase2Psychology: "Bourru, direct, réfractaire aux flatteries de cour. Ne s'intéresse qu'aux tonnages réels, aux flux de minerais et à la pression hydraulique des sas.",
    superphase3TechFocus: "Convois Automatisés de Fret Ionique, Condensateurs FTL Hyper-Propulsion et Nexus Logistique Stellaire Sans Friction pour éradiquer tout goulot d'étranglement.",
    visualPortraitDescription: "Combinaison d'atelier lourd renforcée en kevlar gris ardoise avec bandes réfléchissantes jaune ambré (#eab308). Bras gauche entièrement bionique avec servos hydrauliques visibles, casque de protection posé sur l'épaule.",
    cyberneticsAndAugments: "Bras bionique industriel en alliage de tungstène avec connecteurs pneumatiques intégrés, implant cochléaire radio résistant aux bruits de chantier.",
    signatureNeon: '#eab308',
    bgGradient: 'from-amber-600/20 via-slate-900 to-black',
    quote: "Vos grands idéaux ne valent pas un boulon de rechange quand une conduite de liquide de refroidissement éclate à 3h du matin.",
    defaultLoyalty: 85,
    defaultInfluence: 70,
    bonusSummary: "+15 Minéraux raffinés par tour & Réduction du temps de transit"
  }
};
