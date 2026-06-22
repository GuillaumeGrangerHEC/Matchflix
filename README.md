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

## Déploiement

L'app est déployée et accessible publiquement (via une URL), mais **toujours en mode développement/usage personnel** — voir "Statut actuel" ci-dessous avant de la partager largement ou d'en faire la promotion.

- **Client** : [Vercel](https://vercel.com), projet `matchflix`, déployé depuis ce dépôt GitHub. URL : `https://matchflix-seven.vercel.app`. Auto-déploiement à chaque `git push` sur `main`.
- **Serveur** : [Render](https://render.com), service web `matchflix-api`, racine `server/`, build `npm install && npm run build`, démarrage `npm run start`. URL : `https://matchflix-c4qc.onrender.com`. Auto-déploiement à chaque `git push` sur `main`.
- **Code source** : [github.com/GuillaumeGrangerHEC/Matchflix](https://github.com/GuillaumeGrangerHEC/Matchflix).

### Pour modifier le code et republier

```
git add -A
git commit -m "description du changement"
git push
```

Render et Vercel redéploient automatiquement (1-2 min) après chaque push sur `main`. Aucune autre action nécessaire.

### Variables d'environnement en production

Configurées directement dans les interfaces Vercel et Render (pas dans des fichiers `.env` commités) :
- **Vercel** (`client`) : les 8 variables `VITE_*` de `client/.env.example`, avec `VITE_API_BASE_URL` pointant vers l'URL Render ci-dessus.
- **Render** (`server`) : `TMDB_API_KEY`, `TMDB_BASE_URL`, et `CLIENT_ORIGIN` (doit correspondre exactement à l'URL Vercel, sans `/` final).

### Statut actuel : usage personnel, pas encore public

Ce déploiement existe pour pouvoir tester l'app sur un vrai téléphone pendant le développement — **ce n'est pas un lancement public**. Plusieurs choses sont volontairement laissées telles quelles tant que l'app reste à usage personnel/test, et **devront être revues avant une vraie mise en public ou une version monétisée** :

- **TMDB** : la clé API a été demandée en "Personal use" (usage non commercial), conforme aux conditions TMDB tant qu'il n'y a pas de monétisation. À revoir avec TMDB (et potentiellement passer à un usage commercial) dès qu'une monétisation est ajoutée — voir les conditions d'utilisation TMDB.
- **Plans gratuits Render/Vercel** : suffisants pour un usage perso/test (faible trafic), mais Render "Free" met le service en veille après inactivité (premier chargement après veille plus lent) — à surveiller ou upgrader si l'usage augmente.
- **Pas d'authentification, pas de nettoyage des sessions Firebase** (voir ci-dessous) — acceptable pour un usage entre proches, à revoir pour un public plus large.
- **Pas de monétisation** — prévu pour une version ultérieure, voir le point TMDB ci-dessus quand ce sera le cas.

## Limitations connues (MVP)

- L'icône PWA (`client/public/favicon.svg`) est un placeholder simple — à remplacer par de vrais visuels (192/512/maskable PNG) avant une installation type App Store / Play Store.
- Pas d'authentification : le code à 4 chiffres est le seul mécanisme d'accès à une session, comme un code partagé verbalement. Pas de nettoyage automatique des sessions inactives dans Firebase pour l'instant.
- Pas de monétisation — prévu pour une version ultérieure.

## Note : Node.js sans droits admin

Si Node.js doit être mis à jour sur une machine sans droits admin, utiliser l'archive ZIP (pas l'installeur `.msi`) depuis nodejs.org, l'extraire dans un dossier utilisateur, et ajouter ce dossier en tête de PATH dans le profil PowerShell (`$PROFILE`).
