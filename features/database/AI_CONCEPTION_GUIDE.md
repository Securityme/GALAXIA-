# GUIDE DE CONCEPTION IA — CATALOGUES & BASES DE DONNÉES ENCYCLOPÉDIQUES

## 1. Catalogues Définis
1. **`planetaryBuildingsCatalog.ts`** :
   - Contient la définition des bâtiments par tiers (T1 à T4).
   - `calculateDynamicBuildingCost(building, planetType, existingCount, empireTotalCount)` : Formule de coût progressif basée sur l'infrastructure existante et le biome planétaire.
   - `calculateDynamicBuildingOutput(building, planetType, level)` : Calcul du rendement local et impérial.
2. **`planetaryBiomesCatalog.ts`** : 8 biomes planétaires avec multiplicateurs de fertilité, minéralogie et habitabilité.
3. **`factionsCatalog.ts`** : Factions stellaires, syndicats d'extraction et modules ASTRA.
