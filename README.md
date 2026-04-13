# Parrain_4p

**Parrain_4p** est une application front-end React/Vite centrée sur la présentation d’offres de parrainage, les avis utilisateurs et un calculateur de rentabilité. Cette remise à niveau conserve le **design existant** et le **comportement fonctionnel actuel**, tout en améliorant la structure du code et l’hygiène du dépôt.

## Objectif de cette remise à niveau

L’intervention a été réalisée avec une contrainte forte : **ne pas modifier l’apparence du site ni son fonctionnement actuel**. Les changements portent donc sur la maintenabilité, la fiabilité des contrôles et la qualité du dépôt.

| Axe | Résultat |
|---|---|
| **Design** | Conservé à l’identique dans l’état actuel du projet |
| **Fonctionnalités** | Conservées dans l’état actuel du projet |
| **Structure du code** | Allégée et mieux organisée |
| **Qualité** | Lint, tests et build ajoutés et validés |
| **Automatisation** | Workflow CI GitHub Actions ajouté |

## Stack technique

Le projet repose sur **React 18** et **Vite 4**, avec **pnpm** comme gestionnaire de paquets.

## Scripts disponibles

| Commande | Usage |
|---|---|
| `pnpm install` | Installe les dépendances |
| `pnpm dev` | Lance le serveur de développement |
| `pnpm build` | Génère le build de production |
| `pnpm preview` | Prévisualise le build localement |
| `pnpm lint` | Lance les contrôles statiques |
| `pnpm test` | Exécute les tests unitaires |

## Structure principale

```text
src/
  components/
    LogoOffre.jsx
    Timer.jsx
  data/
    logoDomains.js
  lib/
    calcul.js
    calcul.test.js
    favorites.js
  App.jsx
  main.jsx
```

## Changements apportés

La base a été refactorisée pour mieux séparer les responsabilités. Les éléments réutilisables et la logique métier ont été sortis du fichier principal afin de rendre le projet plus simple à maintenir.

| Changement | Effet |
|---|---|
| **Ajout de `src/main.jsx`** | Point d’entrée React standardisé |
| **Mise à jour de `index.html`** | Chargement propre de l’application via `main.jsx` |
| **Extraction de modules métier** | Logique de calcul et favoris isolée |
| **Externalisation de composants** | `LogoOffre` et `Timer` rendus réutilisables |
| **Ajout de tests** | La logique de calcul est maintenant vérifiable automatiquement |
| **Ajout d’ESLint** | Contrôles de cohérence du code disponibles |
| **Ajout d’une CI GitHub** | Lint, tests et build exécutés automatiquement |
| **Ajout de `.gitignore`** | Nettoyage des artefacts non versionnables |

## Vérifications effectuées

La remise à niveau a été validée localement par les commandes suivantes :

```bash
pnpm lint
pnpm test
pnpm build
```

Les trois contrôles passent sur la version préparée.

## Reprise du projet

Si vous souhaitez poursuivre l’amélioration du dépôt sans toucher au design, la suite logique consiste à :

| Priorité | Suite recommandée |
|---|---|
| **1** | Découper davantage `App.jsx` en pages et sections dédiées |
| **2** | Ajouter des tests supplémentaires sur les interactions clés |
| **3** | Introduire des constantes de style partagées sans toucher au rendu |
| **4** | Préparer une stratégie de données plus maintenable si le contenu grossit |

## Garantie de périmètre

> Cette remise à niveau a été effectuée en conservant le site dans son état visuel et fonctionnel actuel, avec un objectif de **maintenance**, **fiabilité** et **propreté du dépôt**, et non de refonte produit.
