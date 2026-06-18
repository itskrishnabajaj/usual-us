# CHANGELOG

> Notable changes to `usual us`. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).
> This is a personal project, so entries are grouped by theme rather than strict semver releases.
> Initial entries were reconstructed from git history; keep it updated going forward.

Related: [ROADMAP](./ROADMAP.md) · [README](./README.md)

---

## [Unreleased]

### Fixed
- **Release blocker: stuck splash + "shortcut instead of Install" on Vercel.** Root cause was the
  hosting migration, not app code: Vercel auto-detected Vite and served the `vite build` `dist/`
  output, which omits the loose `service-worker.js`, `manifest.json` and `js/*.js` (no `public/`
  dir) — so those 404'd (`_startApp` never ran → splash forever; no SW → no install prompt).
  Netlify had served the repo root verbatim (`publish = "."`). Fix: `vercel.json` now sets
  `"framework": null`, `"buildCommand": ""`, `"outputDirectory": "."` to serve the root with **no
  build**, restoring Netlify-equivalent behaviour. Configuration-only; no application code changed.

- **Us-tab scroll smoothness on weaker GPUs (e.g. Moto Edge 50 Fusion).** Removed the
  counter-productive `will-change: background-position` on `.us-tab` (a paint property was being
  forced onto a constantly re-rasterised full-screen layer, starving scroll compositing); added
  `100dvh` (with `100vh` fallback) to `.us-tab`/`#app` to stop address-bar layout jumps; reduced
  the always-visible bottom-nav `backdrop-filter` blur 30px→12px (with a slightly more opaque
  background to keep legibility). The breathing gradient still animates. Cache bumped to `v48`.
  *(Pending on-device confirmation on the Moto; see audit report.)*

### Added
- **`/docs` engineering Bible** — this full documentation system: project philosophy,
  architecture, UI/UX, design system, animations, state, Firebase, media, PWA, performance,
  debugging, testing, security review, technical debt, known limitations, roadmap, AI guide, and a
  re-verified code audit. `/docs` is now the single source of truth.

### Changed
- Consolidated docs: migrated the generic `replit.md` content into the Bible; folded
  `SETUP-GUIDE.md` into `docs/DEVELOPMENT.md` (+ PWA/Debugging docs) and reduced the root file to a
  pointer; expanded the root `README.md` to point at `/docs`.

### Removed
- `replit.md` and `.replit` — obsolete Replit tooling (no longer used).

---

## Icon & hosting cleanup

### Changed
- **App icons optimised ~90%** — `icon-192.svg` / `icon-512.svg` were SVG wrappers around a
  3375 px master raster rendered at ≤512 px; downscaled the embedded image to 1024 px (visually
  identical), ~4.7 MB → ~0.47 MB each. Bumped icon cache-buster `?v=2` → `?v=3`.
- **`icons/` folder optimised ~95%** — 18 raster-wrapped SVGs (tab/category/mood/who-pays/splash)
  downscaled to display-appropriate caps (256–512 px), ~36 MB → ~1.9 MB. Combined precache media
  dropped from ~45 MB to ~2.8 MB.
- Service-worker cache bumped to **`usual-us-v48`**.
- Setup guide updated to the real Vercel URL (usualus.vercel.app).

### Added
- **`vercel.json`** — `Cache-Control: no-cache` for `service-worker.js` & `manifest.json` + global
  security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).

### Removed
- **Netlify config** (`netlify.toml`) and **TWA artifacts** (`.well-known/assetlinks.json`,
  `"twa"` package keyword) — the app is now a pure PWA on Vercel. Kept the Android gesture-hardening
  in `app.js` (still benefits the installed PWA); reworded its "TWA" comments.

---

## Earlier history (from git log, condensed)
- Migrated hosting **Netlify → Vercel**; PWA performance & scroll stabilisation work.
- **Us-tab scroll** reliability: removed pull-to-refresh gestures, restored native scrolling, fixed
  bounce, hardened the edge-swipe guard so it never blocks Us-tab scrolling.
- Various smooth-scroll and service-worker cache-version updates.

---

## How to add an entry
On each meaningful change, add a bullet under `[Unreleased]` in the right group
(Added / Changed / Fixed / Removed / Security). When you "release" (deploy a notable milestone),
rename `[Unreleased]` to a dated heading and start a fresh `[Unreleased]`. Always note a
`CACHE_NAME` bump if assets changed.

---

### Related documents
[ROADMAP](./ROADMAP.md) · [PWA_BIBLE](./PWA_BIBLE.md) · [README](./README.md)
