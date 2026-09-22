# GUIDE DE CONCEPTION IA — MOTEUR DE JEU & ÉTAT DE SIMULATION

## 1. Store Zustand (`gameStore.ts`)
- Utilise **Immer** via `produce` pour des mutations immuables fiables.
- **Ressources Globales** : Invariant $L_0 \ge 0$ vérifié à chaque tour.
- **File de Chantiers (`constructionQueue`)** : Projets de construction planétaires gérés en tours/cycles avec progression en pourcentage et bonus locaux/globaux.
- **Historique & Registre (`turnLogs`, `eventLogs`)** : Horodatage, deltas algébriques et hachages d'état scellés (`<STATE_JSON>`).

## 2. Fenêtres Opérationnelles
- **Fenêtre 1 (`UniverseTelemetry.tsx`)** : Télémétrie 4X, Topologie Multi-Échelles (Macro-Galactique, Méso-Système, Micro-Planétaire), Chantiers en cours et Colonies.
- **Fenêtre 2 (`DecisionEngine.tsx`)** : Moteur Décisionnel, 3 Phases événementielles (Scénario LLM, Union & Villes, Crises & Militaire), Tooltips Radix UI et Mode Plein Écran pour les textes de briefing.
- **Switch Flottant (`DualWindowLayout.tsx`)** : Bouton unique en bas à droite pour basculer sans vue scindée 50/50.
