# usual us — Engineering Bible 📖

> The single source of truth for the `usual us` application. If you are a future
> version of the developer, or an AI assistant asked to work on this repository,
> **read this index first**, then the document most relevant to your task.

`usual us` is a private Progressive Web App built by one developer for two people.
It is a shared expense tracker, photo-memory timeline, mood journal, milestone
calendar, music player and "little things" notebook — wrapped in a deliberately
cinematic, warm, calm interface. It is **not** a product. There are no other users,
no growth goals, and no roadmap toward scale. See [`PROJECT_BIBLE.md`](./PROJECT_BIBLE.md)
for the philosophy that governs every decision here.

---

## How to use this Bible

These documents are meant to be **trustworthy enough that you never need a fresh
full-repository audit** unless the code has changed significantly. Every factual claim
cites a `file:line` reference. Anything inferred rather than verified is explicitly
marked *(speculative)*.

### Reading order for a newcomer
1. [`PROJECT_BIBLE.md`](./PROJECT_BIBLE.md) — the constitution: vision, philosophy, rules.
2. [`REPOSITORY_ARCHITECTURE.md`](./REPOSITORY_ARCHITECTURE.md) — how the code is laid out and boots.
3. [`DEVELOPMENT.md`](./DEVELOPMENT.md) — run it locally, build it, deploy it.
4. [`STATE_MANAGEMENT.md`](./STATE_MANAGEMENT.md) — how data flows.
5. Then whichever "Bible" matches your task.

### If you are an AI assistant
Read [`AI_ENGINEERING_GUIDE.md`](./AI_ENGINEERING_GUIDE.md) **before touching anything**.
It encodes the non-negotiable rules (no frameworks, no layout-property animations, no
global touch interception, no fabrication) and the expected working style.

---

## Document map

| # | Document | What it covers |
|---|----------|----------------|
| — | [README.md](./README.md) | This index |
| — | [DEVELOPMENT.md](./DEVELOPMENT.md) | Local setup, npm scripts, config, conventions |
| 1 | [PROJECT_BIBLE.md](./PROJECT_BIBLE.md) | Vision, purpose, philosophy, principles, rules — the constitution |
| 2 | [REPOSITORY_ARCHITECTURE.md](./REPOSITORY_ARCHITECTURE.md) | Files, boot sequence, systems, dependency graph |
| 3 | [UI_UX_BIBLE.md](./UI_UX_BIBLE.md) | Every screen & modal: journey, states, edge cases |
| 4 | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Colours, type, spacing, themes, components |
| 5 | [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md) | Reusable UI patterns |
| 6 | [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) | Global state, EventBus, storage, sync |
| 7 | [PERFORMANCE_BIBLE.md](./PERFORMANCE_BIBLE.md) | Rendering, scrolling, memory, media, future work |
| 8 | [ANIMATION_BIBLE.md](./ANIMATION_BIBLE.md) | Every animation: purpose, cost, trigger |
| 9 | [FIREBASE_BIBLE.md](./FIREBASE_BIBLE.md) | Firestore collections, schema, sync, offline |
| 10 | [MEDIA_SYSTEM.md](./MEDIA_SYSTEM.md) | Cloudinary, images, audio, lazy loading |
| 11 | [PWA_BIBLE.md](./PWA_BIBLE.md) | Manifest, service worker, install, Vercel deploy |
| 12 | [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md) | Symptom → cause → fix playbook |
| 13 | [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) | Prioritised, re-verified debt |
| 14 | [SECURITY_REVIEW.md](./SECURITY_REVIEW.md) | Secrets, auth, XSS, Firestore rules |
| 15 | [TESTING_GUIDE.md](./TESTING_GUIDE.md) | Manual checklists, device matrix, release checklist |
| 16 | [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md) | Current limits with why/impact/priority |
| 17 | [ROADMAP.md](./ROADMAP.md) | Realistic single-developer roadmap |
| 18 | [CHANGELOG.md](./CHANGELOG.md) | History + going-forward template |
| 19 | [AI_ENGINEERING_GUIDE.md](./AI_ENGINEERING_GUIDE.md) | Rules & workflow for future AI/human contributors |
| 20 | [CODE_AUDIT_REPORT.md](./CODE_AUDIT_REPORT.md) | Full re-verified audit, ranked |

---

## Conventions used across these docs

- **Code references** look like `js/expenses.js:334` and point at a file and line in the repo.
- **Verification status:** plain statements are verified against the code; *(speculative)*
  marks an inference; *(intentional)* marks a deliberate design choice that may look like a bug.
- **Priority labels:** `Critical` / `High` / `Medium` / `Low`, defined in
  [CODE_AUDIT_REPORT.md](./CODE_AUDIT_REPORT.md).
- **The ethos wins.** Where an "industry best practice" conflicts with the
  [project ethos](./PROJECT_BIBLE.md#1-the-ethos), the ethos wins and the doc says why.

---

## Fast facts (verified)

| Thing | Value | Source |
|-------|-------|--------|
| Stack | Vanilla HTML/CSS/JS, no framework | `index.html`, `js/` |
| Build | Vite | `package.json:6-13`, `vite.config.js` |
| Hosting | Vercel — usualus.vercel.app | `vercel.json` |
| Database | Firebase Firestore (offline persistence) | `firebase.js` |
| Media | Cloudinary | `js/config.js:6-10` |
| Animation libs | GSAP, Lenis, Hammer.js (local copies in `lib/`) | `index.html` |
| Users | Exactly two: `imsusu` (Susu/krishna), `imgugu` (Gugu/rashi) | `js/config.js:13-16` |
| Service worker cache | `usual-us-v50` | `service-worker.js:1` |
| Relationship start | 2025-01-28 | `js/config.js:19` |

_Last reviewed against the codebase: see the latest commit on
`claude/repository-audit-directive-1il9wj`._
