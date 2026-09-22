# GUIDE DE CONCEPTION & D'ARCHITECTURE IA — MODULE COMPOSANTS UI & ATOMES

## 1. Vision du Module
Le dossier `/components` regroupe les composants atomiques et moléculaires réutilisables du Design System Dark Sci-Fi de GALAXIA.

## 2. Composants Clés
- **`Tooltip.tsx` (`TacticalTooltip`)** : Primitif Radix UI encapsulé pour les boutons tactiques, affichant les coûts dynamiques, les prévisions de ressources et l'invariant L₀.
- **`CouncilDossierModal.tsx`** : Fiche immersive des Ministres et de l'Amiral, avec historique décisionnel dépliable extrait en direct du store Zustand.
- **`SystemConfigModal.tsx`** : Configuration des thèmes (Iridescent Diamant/Pétrole, Tactical Light, etc.) et contrôle audio Radio FIP.
- **`Button.tsx`** : Bouton haute précision avec rétroactions sonores et cibles tactiles iOS minimales de 44px.
- **`Modal.tsx`** : Conteneur de modale avec flou d'arrière-plan glassmorphic sans scintillement et gestion de la fermeture échappement.
