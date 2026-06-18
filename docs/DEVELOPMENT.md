# DEVELOPMENT

> How to run, build, configure and deploy `usual us` locally. This replaces the old root
> `SETUP-GUIDE.md` (its useful content is folded here and into [PWA_BIBLE](./PWA_BIBLE.md) /
> [DEBUGGING_GUIDE](./DEBUGGING_GUIDE.md)).

Related: [REPOSITORY_ARCHITECTURE](./REPOSITORY_ARCHITECTURE.md) · [PWA_BIBLE](./PWA_BIBLE.md) · [PROJECT_BIBLE](./PROJECT_BIBLE.md)

---

## Prerequisites
- **Node.js** (LTS) and **npm** — the only toolchain you need.
- A code editor (VS Code recommended) and **Git**.
- That's it: no global CLIs, no framework tooling.

## First-time setup
```bash
git clone <repo-url>
cd usual-us
npm install
```

## Everyday commands (`package.json`)
| Command | What it does |
|---------|--------------|
| `npm run dev` | Vite dev server on **port 5000** with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | ESLint over `js/`, `firebase.js`, `service-worker.js` |
| `npm run lint:fix` | ESLint with autofix |
| `npm run format` | Prettier-format all `js/css/html/json` |
| `npm run optimize:svg` | SVGO-optimise SVGs in `icons/` |

**Before committing:** run `npm run lint` and `npm run build` (both should pass). If you changed
any cached asset, **bump `CACHE_NAME`** in `service-worker.js` ([PWA_BIBLE](./PWA_BIBLE.md#2-service-worker-service-workerjs-cache-usual-us-v47)).

## Configuration (`js/config.js`)
All personal/config constants live here:
- `USERS` — the two users (ids, PINs, display names, roles). *(Client-side — see
  [SECURITY_REVIEW](./SECURITY_REVIEW.md).)*
- `RELATIONSHIP_START` — the date the day-counter/milestones count from.
- `PLAYLIST` — the 15-song Cloudinary playlist.
- `DAILY_QUOTES` — the rotating daily quotes.
- `categoryEmojis` / `moodEmojis` — icon maps.
- Cloudinary `CLOUD_NAME` / `UPLOAD_PRESET` / `FOLDER` (and, currently, `API_KEY`/`API_SECRET` —
  **to be moved server-side**, see [SECURITY_REVIEW](./SECURITY_REVIEW.md)).

Firebase config is in `firebase.js` (public web config; access is governed by Firestore rules).

## Running against Firebase
The app talks to the live Firestore project. Offline persistence means it works without a
connection after first load. There is no separate local backend.

## Deployment
Push to the GitHub repo connected to Vercel → automatic deploy (preview for branches, production
for the main branch). Live at **usualus.vercel.app**. Headers come from `vercel.json`. Full detail
in [PWA_BIBLE §6](./PWA_BIBLE.md#6-deployment).

## Installing the app on a phone (for testing the real experience)
- **Android (Chrome):** menu → "Add to Home screen" / "Install app".
- **iPhone (Safari):** Share → "Add to Home Screen".
- Updates arrive automatically via the service-worker update flow.

## Repo conventions
- One domain per file in `js/`; shared globals/helpers in `state.js`; constants in `config.js`.
- Reuse helpers (`escapeHTML`, `debounce`, `formatDate`, `EventBus`, modal pattern) — don't duplicate.
- Match the surrounding style; keep it vanilla (no frameworks/build-time components).
- See [PROJECT_BIBLE §9–10](./PROJECT_BIBLE.md#9-rules-future-developers-and-ais-must-follow) for the hard rules.

---

### Related documents
[REPOSITORY_ARCHITECTURE](./REPOSITORY_ARCHITECTURE.md) · [PWA_BIBLE](./PWA_BIBLE.md) · [DEBUGGING_GUIDE](./DEBUGGING_GUIDE.md) · [TESTING_GUIDE](./TESTING_GUIDE.md)
