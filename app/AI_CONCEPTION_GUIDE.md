# GUIDE DE CONCEPTION & D'ARCHITECTURE IA — MODULE APP & ROUTAGE MACRO

## 1. Vision du Module
Le dossier `/app` héberge le routage Next.js (App Router), les layouts de base et les pages macroscopiques de l'application GALAXIA.

## 2. Invariants & Règles de Routage
- **Bootloader (`/app/page.tsx`)** : Point d'entrée initial avec séquence de diagnostic (Kernel, Firebase, Agent IA) et authentification à double mode (Auto / Manuel).
- **Launchpad (`/app/home/page.tsx`)** : Tableau de bord principal, accès aux sauvegardes Firestore, R&D et lancement de partie.
- **Configuration des Superphases (`/app/config/page.tsx`)** : 3 superphases obligatoires (Genèse, Amiral, Vaisseau-Monde ASTRA) + superphase 4 de récapitulatif décisionnel.
- **Cockpit de Jeu (`/app/game/page.tsx`)** : Vue unique active alternable via le bouton flottant inférieur droit (Fenêtre 1 Télémétrie 4X ou Fenêtre 2 Commandement).

## 3. Ergonomie Mobile & Safari iOS
- Les layouts doivent toujours exporter une configuration `Viewport` avec `viewportFit: 'cover'`.
- Respecter les zones de sécurité (`env(safe-area-inset-bottom)`) pour ne jamais superposer de contrôles avec la barre d'accueil iOS.
