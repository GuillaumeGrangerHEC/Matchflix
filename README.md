# Matchflix

"Tinder pour films" pour les couples. Deux utilisateurs rejoignent une session via un code à 4 chiffres, sélectionnent leurs plateformes de streaming, puis swipent indépendamment sur les films disponibles en commun. Un like mutuel déclenche un écran de Match.

## Stack

- **client/** — React + TypeScript (Vite), PWA, mobile-first. Framer Motion pour les animations de swipe, React Router pour la navigation, Firebase (SDK client) pour la session partagée en temps réel.
- **server/** — Node.js + Express + TypeScript. Proxy sécurisé vers l'API TMDB (la clé API n'est jamais exposée au client).
- **firebase/** — Règles de sécurité de la Realtime Database.

Pays supportés : Suisse (CH), France (FR), Belgique (BE).

## Prérequis

- Node.js 18+ (LTS recommandé).
- Un compte TMDB avec une clé API : https://www.themoviedb.org/settings/api
- Un projet Firebase avec Realtime Database activée : https://console.firebase.google.com/

## Configuration

### 1. TMDB

Crée un compte sur themoviedb.org, génère une clé API (v3 auth) dans les paramètres, puis renseigne-la dans `server/.env`.

### 2. Firebase

1. Crée un projet sur la console Firebase.
2. Active **Realtime Database**.
3. Dans Realtime Database > Règles, colle le contenu de `firebase/database.rules.json` et publie.
4. Dans Paramètres du projet > Tes applications, ajoute une application Web et récupère la config (`apiKey`, `databaseURL`, etc.).
5. Renseigne ces valeurs dans `client/.env`.

### 3. Variables d'environnement

```
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Puis remplis les valeurs TMDB et Firebase dans chaque fichier.

## Lancer le projet

```
cd server && npm install && npm run dev   # http://localhost:4000
cd client && npm install && npm run dev   # http://localhost:5173
```

## Limitations connues (MVP)

- Les IDs de fournisseurs TMDB dans `client/src/utils/constants.ts` (Netflix, Prime Video, etc.) sont les valeurs publiques actuelles — à revérifier une fois la clé API en main, TMDB renomme/réassigne ces IDs de temps à autre.
- L'icône PWA (`client/public/favicon.svg`) est un placeholder simple — à remplacer par de vrais visuels (192/512/maskable PNG) avant une installation type App Store / Play Store.
- Pas d'authentification : le code à 4 chiffres est le seul mécanisme d'accès à une session, comme un code partagé verbalement. Pas de nettoyage automatique des sessions inactives dans Firebase pour l'instant.
- Pas de monétisation — prévu pour une version ultérieure.

## Note : Node.js sans droits admin

Si Node.js doit être mis à jour sur une machine sans droits admin, utiliser l'archive ZIP (pas l'installeur `.msi`) depuis nodejs.org, l'extraire dans un dossier utilisateur, et ajouter ce dossier en tête de PATH dans le profil PowerShell (`$PROFILE`).
