# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Matchflix — a "Tinder for movies" mobile-first PWA for couples. Two users join a shared session via a 4-digit code, pick their streaming platforms, then swipe independently on movies available on the platforms they have in common. A mutual like triggers a Match screen.

Two independent npm projects, no workspace/monorepo tooling linking them:
- `client/` — React + TypeScript (Vite), PWA, mobile-first.
- `server/` — Node.js + Express + TypeScript.
- `firebase/database.rules.json` — Realtime Database security rules (pasted manually into the Firebase console's Rules tab; not auto-deployed by any script in this repo).

Supported countries are hardcoded: Switzerland (CH), France (FR), Belgium (BE) — see `SUPPORTED_COUNTRIES` in `client/src/utils/constants.ts` and the `country` enum check in the Firebase rules. A session is also either `movie` or `tv` (`mediaType`, chosen at creation) — see the Movie/TV section below.

There's a `start.bat` at the repo root that launches both dev servers and opens the app, and a `DEMARRER.txt` with French end-user instructions (written for the project owner, not for Claude) — keep both in sync with reality if the dev workflow changes (ports, URLs, etc.).

## Commands

Run from `client/` or `server/` respectively — there is no root-level package.json.

```
# client
npm run dev       # Vite dev server (http://localhost:5173), host: true so it's reachable on the LAN/phone too.
                   # Prints a QR code (vite-plugin-qrcode) pointing at the Network URL for phone testing.
npm run build     # tsc -b && vite build (also generates the PWA service worker)
npm run lint      # eslint .
npm run preview   # serve the production build locally

# server
npm run dev       # tsx watch src/server.ts (http://localhost:4000)
npm run build     # tsc -> dist/
npm run start     # node dist/server.js (run build first)
```

No test framework is configured in either project yet.

**Node version note (this machine specifically):** the system `node` resolves to an outdated v16 install. The working Node (v24 LTS) lives in `%USERPROFILE%\nodejs-lts` (installed without admin rights via the zip distribution, not the .msi). Prepend it before running any node/npm command in a fresh shell:
```
$env:PATH = "$env:USERPROFILE\nodejs-lts;$env:PATH"
```

**Repo location history:** this project originally lived on `S:` (a mapped network drive), where Windows' native file-watch API didn't work (`fs.watch` crashed with `Error: UNKNOWN: unknown error, watch`), forcing `usePolling` in Vite and a non-watching server `dev` script. It was moved to `C:\Guillaume` on 2026-06-22 specifically to fix this — both now use native watching again. If file-watching ever breaks mysteriously again, check whether the repo is back on a network-mapped drive.

## Deployment

- **Source**: pushed to GitHub at `https://github.com/GuillaumeGrangerHEC/Matchflix` (git was initialized fresh for this project — no prior history).
- **Client**: deployed on Vercel (`https://matchflix-seven.vercel.app`), auto-deploys on push to `main`. Env vars (the 8 `VITE_*` ones) are set directly in the Vercel project's Settings > Environment Variables — **not** read from a committed file. Changing them requires a manual redeploy (Deployments tab > "..." > Redeploy) to take effect; just saving the variable does not trigger one.
- **Server**: deployed on Render (`https://matchflix-c4qc.onrender.com`, Node web service, root directory `server`, build `npm install && npm run build`, start `npm run start`), auto-deploys on push to `main`. Render injects its own `PORT` env var — `server/src/config/env.ts` already reads `process.env.PORT` with a `4000` fallback, so this works without changes. `CLIENT_ORIGIN` on Render is set to the exact Vercel URL above (no trailing slash) — `env.ts`'s `clientOrigins` splits on commas if it ever needs to allow more than one origin alongside it.
- Reason this exists at all: the dev machine has no admin rights, no WiFi adapter (Ethernet only), and its corporate network blocks tunnel tools (`localtunnel` hangs indefinitely; `ngrok` itself was inaccessible) — a real deployment was the only reliable way to test the mobile-first UI on an actual phone.
- **To ship a code change**: `git add -A && git commit -m "..." && git push` from the repo root — both platforms auto-deploy from `main`, usually live within 1-2 minutes. No separate deploy step needed unless only env vars changed (see Vercel note above).
- **`client/vercel.json` rewrites every path to `/index.html`.** Without it, refreshing (or deep-linking) on any client-routed path other than `/` (e.g. `/platforms`, `/swipe`) 404s, because Vercel looks for a static file at that path instead of letting React Router handle it. If new client-side routes ever 404 specifically on refresh/direct-load but work fine via in-app navigation, check this file hasn't been removed.

### Still personal/dev-mode, not a public launch

The app is live at a real URL, but treat it as a development/personal-testing deployment, not a public product, until told otherwise:
- TMDB's API key was requested under **"Personal use"** — valid while unmonetized, but must be revisited (likely requiring a commercial agreement with TMDB) before any monetization ships, regardless of how the app is distributed. Don't lose track of this when monetization work starts.
- Render's free tier spins the service down after inactivity (first request after idle is slow) and Vercel/Render free tiers generally assume low traffic — fine for personal testing, worth flagging to the user if real usage grows.
- No auth, no stale-session cleanup in Firebase (see "No authentication" below) — an accepted tradeoff for personal/close-friends use, not yet vetted for a wider audience.

## Architecture

### The client/server split is by data source, not by feature

This is the one thing to internalize before changing either side:

- **All session state (creating/joining a session, platform selection, likes, match detection) is handled entirely client-side, talking directly to Firebase Realtime Database.** The server has no involvement and no Firebase Admin SDK — `server/` only exists to proxy TMDB. There is intentionally no `session.*` controller/route/service on the server: a candidate 4-digit code is generated and uniqueness-checked directly against Firebase from the browser (`client/src/services/sessionService.ts`), because the server has no DB connection that could do that check usefully.
- **The server's only job is `GET /api/movies`** (`server/src/controllers/movies.controller.ts` → `server/src/services/tmdb.service.ts`): it hides the TMDB API key and queries TMDB's `/discover/movie` for a given `country` + comma-separated `providers`.

### Session data model (Firebase Realtime Database)

```
sessions/{4-digit code}/
  country: "CH" | "FR" | "BE"
  mediaType: "movie" | "tv"        # chosen once at session creation, shared by all participants
  groupSize: number                # 2-8, chosen once at session creation (MIN/MAX_GROUP_SIZE in constants.ts)
  createdAt: number
  users/{userId}/                  # userId = crypto.randomUUID(), persisted in sessionStorage
    platforms: string[]            # ids from PLATFORMS, e.g. "netflix"
    genres: number[]               # TMDB genre ids, optional per-user preference (see below)
    likedMovieIds/{movieId}/
      title: string
      posterPath: string | null
    joinedAt: number
  match?/                          # present once a majority of the group liked the same movie
    movieId, title, posterPath, matchedAt
```

**Sessions support 2-8 participants, not just couples** (`groupSize`, set at creation via a stepper on `CreateSessionCard`). This was a generalization from an original 2-person-only design — three places had to move from "exactly 2 users" to "N users, compared against `session.groupSize`":
- `SwipePage.tsx`'s platform/genre intersection: was destructuring `[a, b] = users`, now `users.map(...).reduce((acc, list) => acc.filter(...))` to intersect across however many joined.
- `PlatformsPage.tsx`'s ready-check: was `users.length === 2`, now `users.length === session.groupSize`, with a "X/Y prêts" progress readout instead of a binary spinner.
- `useSession.ts`'s match detection: was comparing exactly `userEntries[0]` vs `userEntries[1]`'s likes, now tallies likes per movie across *all* participants and fires on a **majority** threshold (`Math.floor(groupSize / 2) + 1` — for `groupSize=2` this is still 2, i.e. both, so the original couple behavior is the groupSize=2 special case of this same formula, not a separate code path).

**⚠️ `firebase/database.rules.json` is not auto-deployed.** Whenever this file changes, the live rules in the Firebase console (Realtime Database > Rules tab) must be manually re-pasted and published, or every write that touches the new/changed field gets rejected with `PERMISSION_DENIED` (happened once already when `mediaType`/`genres` were added to the schema but the console rules weren't updated to match). Always call this out explicitly to the user after editing this file.

`likedMovieIds` stores the movie's title/poster inline rather than just a boolean flag. This is deliberate: the two clients paginate the TMDB discover results independently and can be on different pages at any time, so the client that detects a match can't assume the matched movie is still in its own in-memory deck. Storing the title/poster on like makes match detection self-contained from the session data alone.

Firebase Realtime Database silently drops empty arrays/objects on write (`{platforms: []}` persists as if `platforms` were never set). Code that reads `session.users[id].platforms` always defaults it (`?? []`), and the security rules' per-user validation accounts for a user node that only has `joinedAt` and nothing else yet.

### Match detection is reactive and client-side, in `useSession`

`client/src/hooks/useSession.ts` subscribes to the session node and, on every update, checks whether the two users' `likedMovieIds` intersect. If so and no `match` exists yet, it writes the `match` node itself. Both clients run this same check independently and may race to write the same data — that's fine, the write is idempotent (same payload either way), so there's no transaction/locking around it.

### Common-platform / movie-fetch flow

`client/src/pages/SwipePage.tsx` computes the intersection of both users' `platforms` arrays, maps the surviving platform ids to TMDB provider ids via `PLATFORMS` (`client/src/utils/constants.ts`), and passes that to `useMovieDeck` (`client/src/hooks/useMovieDeck.ts`), which paginates `GET /api/movies` against the server.

Genre filtering follows the same "agree if you want to" pattern, computed in the same page: `null` = neither user picked a genre (no filter), a non-empty array = the genres both picked in common, an empty-but-non-null array = both picked genres but share none (real disagreement — `SwipePage` shows a dedicated message instead of calling `useMovieDeck` with zero meaningful filter). Don't collapse "no preference" and "disagreement" into the same empty-array representation — they need different UI outcomes.

On the server side, `tmdb.service.ts` builds the TMDB query against `/discover/movie` or `/discover/tv` depending on the session's `mediaType`, with `with_watch_providers` and `with_genres` both joined by `|` (OR — "available on/matches at least one of these"), **not** `,` (which TMDB treats as AND). It also sets `with_watch_monetization_types: 'flatrate'` so rent/buy titles aren't included — only subscription-included content counts as "available." TV results come back with `name`/`first_air_date` instead of `title`/`release_date`; `toMovie()` normalizes both shapes into the same client-facing `Movie` type so the client never branches on media type for field names.

TMDB provider IDs in `constants.ts` were re-verified live on 2026-06-22 against `/watch/providers/movie` — HBO Max's id had silently changed from 384 to **1899** since this project started, which caused empty results with no error (TMDB just returns zero matches for an unrecognized/inactive provider id, it doesn't error). Re-verify against the live endpoint if a platform's deck is suspiciously always empty. Movie and TV genres are also separate TMDB taxonomies (`MOVIE_GENRES` vs `TV_GENRES` in `constants.ts`) — don't assume an id means the same thing in both.

### Internationalization (FR/EN)

Custom lightweight i18n, not a library (no react-i18next etc.) — deliberate, since needs are simple (no pluralization rules).
- `client/src/i18n/translations.ts`: flat `{ fr: {...}, en: {...} }` dictionaries, both with the exact same keys (typed via `TranslationKey = keyof typeof translations.fr`, so a missing English key is a compile error). Supports `{varName}` interpolation.
- `client/src/context/LanguageContext.tsx`: `useLanguage()` exposes `language`, `setLanguage`, `t(key, vars?)`, and `tError(err)`. Initial language is read from `localStorage`, falling back to `navigator.language` (French if the browser is French, English otherwise — not just defaulting to French).
- **Errors are translated via a code, not a message.** `sessionService.ts` throws `Error('session_full')` etc. (a stable code), never a human sentence — `tError(err)` maps `code` → `error_<code>` in the current language, falling back to `error_generic` for anything unrecognized. Don't go back to throwing literal French sentences from services; the UI layer is what knows the language.
- **Movie/show data itself is translated too, not just UI chrome.** The server has no hardcoded `language` anymore — `client/src/hooks/useMovieDeck.ts` passes the current `language` ('fr'/'en') through to `GET /api/movies`, and `server/src/services/tmdb.service.ts` maps it to TMDB's locale codes (`fr` → `fr-FR`, `en` → `en-US`) before querying `/discover/{mediaType}`. This is why TMDB genre names in `constants.ts` carry both `name` (French) and `nameEn`, and `SUPPORTED_COUNTRIES`/`MEDIA_TYPES` carry both `label`/`labelEn` — these are TMDB/product data, not simple UI copy, so they live in `constants.ts` next to the rest of that data rather than in `translations.ts`.
- Platform/provider brand names (Netflix, Disney+...) are never translated — brand names don't change across languages, so `PLATFORMS` only has one `name`.
- The language toggle lives in `Header.tsx` (top-right, shows the language you'd switch *to*, not the current one) — visible on every screen, including mid-session, since switching is harmless (just re-renders text and refetches the movie deck in the new language).

### No authentication

There's no login/auth system. Identity is just a client-generated UUID in `sessionStorage`. The 4-digit code is the only access control, enforced entirely by the Firebase rules in `firebase/database.rules.json` (regex-validated path access + a closed schema via `$other: { ".validate": false }` at each level). This is an accepted trust model (same as sharing a PIN verbally), not an oversight — don't add app-level auth without checking with the user first.

### Client conventions

- Path alias `@/` → `client/src/*`, configured in both `vite.config.ts` (resolve.alias) and `tsconfig.app.json` (paths). `tsconfig.app.json` also sets `"ignoreDeprecations": "6.0"` because TypeScript 6 deprecated bare `baseUrl` usage.
- The server deliberately does **not** use a path alias — it stays on relative imports so `tsx` (dev) and the plain `node dist/...` (prod, after `tsc`) resolve modules identically without extra runtime tooling.
- Styling is CSS Modules (`*.module.css` next to each component) plus global CSS custom properties defined in `client/src/index.css` (color tokens, radii, shadows). The same color values are duplicated as plain JS constants in `client/src/styles/theme.ts` for any code that needs raw values instead of class names. No Tailwind, no styled-components.
- PWA config (manifest, icons, service worker generation) lives inline in `client/vite.config.ts` via `vite-plugin-pwa` — there's no separate `manifest.json`. The app icon (`client/public/favicon.svg`) is a simple placeholder SVG, not final branding.
- Swipe gesture and fly-off-screen animation (`client/src/components/swipe/SwipeCard.tsx`) are driven by a single Framer Motion `animate()` call shared between drag-release and the like/pass buttons (via a `trigger` prop), so both input methods produce identical motion — don't add a second animation path for the buttons.

### Planned native distribution (not yet implemented)

The end goal is App Store + Google Play distribution via **Capacitor wrapping the existing React client as-is** — not a React Native rewrite. This is intentionally deferred until the web app works end-to-end with real TMDB/Firebase credentials; don't add `android/`/`ios/` Capacitor projects or native tooling unless asked. iOS builds require Xcode (Mac-only); the user has Mac access for that step when it comes.

## Required external setup (not committed)

Both `client/.env` and `server/.env` (gitignored, copy from the matching `.env.example`) must be filled with a TMDB API key and a Firebase Web app config before the app does anything beyond render its static shell — there's no mock/offline mode. See `README.md` for the step-by-step account setup.
