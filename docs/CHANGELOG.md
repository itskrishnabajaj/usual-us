# CHANGELOG

> Notable changes to `usual us`. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).
> This is a personal project, so entries are grouped by theme rather than strict semver releases.
> Initial entries were reconstructed from git history; keep it updated going forward.

Related: [ROADMAP](./ROADMAP.md) · [README](./README.md)

---

## [Unreleased]

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
- Service-worker cache bumped to **`usual-us-v47`**.
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
