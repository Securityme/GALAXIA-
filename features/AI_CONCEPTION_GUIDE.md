# GUIDE DE CONCEPTION & D'ARCHITECTURE IA — MODULE FEATURES (DOMAINES FONCTIONNELS)

## 1. Organisation Fonctionnelle
L'architecture de GALAXIA divise les domaines métier en 5 sous-modules :
1. `/features/config` : Arbre de configuration T_0, 4 superphases, presets et validation.
2. `/features/database` : Catalogues encyclopédiques immuables (Bâtiments, Biomes, Factions, Modules ASTRA).
3. `/features/game` : Moteur de simulation spatiale, DualWindowLayout, store Zustand & Immer, boucle séquentielle en 3 phases, file de chantiers planétaires.
4. `/features/lore` : Ministres du Conseil, Avatars d'amiraux, récits et citations.
5. `/features/tech` : Matrice R&D 18 perçées, arbre technologique et multiplicateurs d'effets.
