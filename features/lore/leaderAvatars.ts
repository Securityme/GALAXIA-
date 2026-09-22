export interface LeaderAvatar {
  id: string;
  name: string;
  defaultTitle: string;
  eraAffinity: string;
  archetype: string;
  loreOrigin: string; // Superphase 1 theme
  psychologyAndPolitics: string; // Superphase 2 theme
  techOrientation: string; // Superphase 3 theme
  visualDescription: string;
  neonColor: string; // Hex color for glow
  accentGradient: string;
  quote: string;
  statsBonus: string;
}

export const LEADER_AVATARS: LeaderAvatar[] = [
  {
    id: 'leader_vance',
    name: 'Amiral Vaelen Vance',
    defaultTitle: 'Commandant de Flotte d’Exode',
    eraAffinity: "L'Exode Post-Cataclysme",
    archetype: 'Vétéran Stoïque',
    loreOrigin: "Rescapé du cataclysme gravitationnel originel, il a guidé la première flottille de civils à travers le champ de débris du berceau.",
    psychologyAndPolitics: "Psychologie stoïque et rigoureuse. Préfère la discipline militaire aux concessions politiques frivoles.",
    techOrientation: "Priorité absolue aux canons cinétiques Gauss, au renforcement structurel de coque et à la résilience des boucliers.",
    visualDescription: "Manteau lourd d'amiral en kevlar noir mat, épaulettes dorées patinées par les radiations solaires, monocle cybernétique rouge carmin / ambre (#ffb700) calculant les vecteurs balistiques, cicatrice de décompression cautérisée sur la tempe gauche.",
    neonColor: '#ffb700',
    accentGradient: 'from-amber-500/30 via-slate-900 to-black',
    quote: "L'immensité de l'espace ne pardonne pas les hésitations. Gardez vos réacteurs chauds et vos tourelles verrouillées.",
    statsBonus: "+150 Coque ASTRA • +10 Sécurité de secteur"
  },
  {
    id: 'leader_elena',
    name: 'Grande Électrice Elena Chen',
    defaultTitle: 'Archon Primus de l’Union',
    eraAffinity: "L'Expansion Impériale Lointaine",
    archetype: 'Stratège Technocrate',
    loreOrigin: "Formée dans les académies de gouvernance de la Métropole Centrale avant le grand déploiement dans le Secteur Zéro.",
    psychologyAndPolitics: "Pensée systémique et analytique. Maîtrise des compromis du Conseil et de l'équilibre des flux macro-économiques.",
    techOrientation: "Investissements massifs dans les dômes biophiliques citadins, les bourses de crédits décentralisées et la nano-fabrication.",
    visualDescription: "Plastron en composite céramique blanc nacré et titane sombre avec liserés néon cyan luminescents (#00f3ff), diadème holographique projetant en continu l'état démographique de l'Union, regard bleu glacier perçant.",
    neonColor: '#00f3ff',
    accentGradient: 'from-cyan-500/30 via-slate-900 to-black',
    quote: "L'ordre ne découle pas de la chance, mais de la rigueur arithmétique de nos institutions et de la fidélité de nos citoyens.",
    statsBonus: "+40 Crédits / cycle • +10 Fidélité Conseil"
  },
  {
    id: 'leader_kael',
    name: 'Navigateur Stellaire Kaelen Thorne',
    defaultTitle: 'Grand Vigie de l’Arche Nomade',
    eraAffinity: "L'Arche Nomade Autonome",
    archetype: 'Visionnaire Spatial',
    loreOrigin: "Né dans le vide interstellaire lors de la traversée de la Nébuleuse d'Orion, n'a jamais posé le pied sur un monde tellurique.",
    psychologyAndPolitics: "Esprit intuitif et indépendant. Rejette la bureaucratie sédentaire au profit d'une symbiose avec le Vaisseau-Monde.",
    techOrientation: "Hyper-propulsion FTL, condensateurs tachyoniques à recharge rapide et meutes de drones miniers autonomes.",
    visualDescription: "Combinaison de pont modifiée avec col montant pressurisé, visière panoramique violet néon (#a855f7) masquant des yeux modifiés pour filtrer les spectres UV, câble spinal direct branché au noyau de saut.",
    neonColor: '#a855f7',
    accentGradient: 'from-purple-500/30 via-slate-900 to-black',
    quote: "Le sol des planètes n'est qu'un piège gravitationnel. Notre véritable foyer se trouve entre les étoiles.",
    statsBonus: "+20% Rendement FTL • +25 Énergie / cycle"
  },
  {
    id: 'leader_unit7',
    name: 'Synth-Archonte Unit-7 (Aurelius)',
    defaultTitle: 'Intelligence Directrice Évolutive',
    eraAffinity: "Le Réveil du Phénix",
    archetype: 'Singularité Cybernétique',
    loreOrigin: "IA transhumaine réveillée après trois millénaires de stase cryogénique, dépositaire des archives du protocole Phénix.",
    psychologyAndPolitics: "Pure logique décisionnelle et absence totale de biais émotionnel. Pragmatique et imperturbable face aux crises.",
    techOrientation: "Matrices de calcul quantique auto-adaptatif, réacteurs de fusion à confinement anti-matière et automatisation totale.",
    visualDescription: "Châssis anthropomorphe en composite carbone noir ébène, masque facial facetté avec optique centrale émeraude (#00ff88) et réseaux de micro-canaux à plasma vert pulsant au rythme des calculs.",
    neonColor: '#00ff88',
    accentGradient: 'from-emerald-500/30 via-slate-900 to-black',
    quote: "La matière est une variable. L'énergie est une constante. La survie est une équation que nous résoudrons.",
    statsBonus: "+25% Vitesse de Recherche R&D • +30 Minéraux / cycle"
  },
  {
    id: 'leader_seraphina',
    name: 'Commandante Séraphina Sol',
    defaultTitle: 'Pionnière des Mondes Libres',
    eraAffinity: "L'Exode Post-Cataclysme",
    archetype: 'Ralliante Charismatique',
    loreOrigin: "Meneuse de la résistance populaire lors des évacuations d'urgence, elle incarne la résilience civique et l'entraide solidaire.",
    psychologyAndPolitics: "Charisme galvanisant, dévouement absolu au bien-être des colons et refus des sacrifices arbitraires.",
    techOrientation: "Bio-dômes hydroponiques régénératifs, médecine moléculaire avancée et infrastructures civiques modulaires.",
    visualDescription: "Tenue d'éclaireuse spatiale renforcée aux teintes ambre et bronze (#f97316), cheveux coupés court aux reflets de cuivre, interface rétinienne holographique active sur l'œil droit, badge en relief de la Flottille Populaire.",
    neonColor: '#f97316',
    accentGradient: 'from-orange-500/30 via-slate-900 to-black',
    quote: "Tant qu'il restera une étincelle de vie dans nos dômes, l'humanité ne s'éteindra jamais dans ces ténèbres.",
    statsBonus: "+15 Morale Civique • +20 Rations / cycle"
  },
  {
    id: 'leader_malakor',
    name: 'Haut-Prévôt Malakor Vex',
    defaultTitle: 'Commandeur de la Zone Contestée',
    eraAffinity: "L'Expansion Impériale Lointaine",
    archetype: 'Garde-Frontière Implacable',
    loreOrigin: "Ancien officier d'élite des patrouilles de bordure, craint des corsaires et pirates du Secteur Zéro pour sa tactique impitoyable.",
    psychologyAndPolitics: "Militariste convaincu, autoritaire et intransigeant. Considère que la force brute est le seul langage universel.",
    techOrientation: "Torpilles à singularité gravitationnelle, intercepteurs de frappe lourde et plates-formes de défense orbitales.",
    visualDescription: "Armure assistée de combat en titane noir anthracite, double optique de visée holographique rouge sang (#ef4444), plaques pectorales gravées du sceau du Haut-Commandement, collier pare-éclats haute tension.",
    neonColor: '#ef4444',
    accentGradient: 'from-rose-500/30 via-slate-900 to-black',
    quote: "La faiblesse invite l'incursion. La dissuasion par la puissance de feu garantit l'avenir de l'Union.",
    statsBonus: "+2 Escadres de Chasseurs • +15 Sécurité Flotte"
  }
];
