# AI ENGINEERING GUIDE

> **Read this before touching the repository.** It tells a future AI assistant (or future
> developer) how to work on `usual us` correctly. The rules here are binding; breaking one needs an
> explicit, documented reason approved by the owner.

Related: [PROJECT_BIBLE](./PROJECT_BIBLE.md) · [REPOSITORY_ARCHITECTURE](./REPOSITORY_ARCHITECTURE.md) · [CODE_AUDIT_REPORT](./CODE_AUDIT_REPORT.md)

---

## 1. Internalise the ethos first
`usual us` is a **private app for two people** — a warm, calm digital home, not a product. Optimise
for **emotional experience, reliability, perceived smoothness, simplicity, and one-developer
maintainability**. Reject anything that smells like scale, teams, or engagement metrics. When a
"best practice" conflicts with this, **the ethos wins** ([PROJECT_BIBLE §1](./PROJECT_BIBLE.md#1-the-ethos)).

## 2. Files to read first (in order)
1. [`PROJECT_BIBLE.md`](./PROJECT_BIBLE.md) — philosophy & hard rules.
2. [`REPOSITORY_ARCHITECTURE.md`](./REPOSITORY_ARCHITECTURE.md) — layout, boot, systems.
3. [`STATE_MANAGEMENT.md`](./STATE_MANAGEMENT.md) — data flow & EventBus.
4. The Bible doc for your task area (UI, animation, Firebase, media, PWA…).
5. The actual source files involved — **always verify against code, never assume.**

Key source anchors: `js/state.js` (globals/helpers), `js/event-bus.js` (events),
`js/app.js` (boot/back-button/SW/hardening), `js/config.js` (constants & — currently — secrets),
`firebase.js`, `service-worker.js`, `styles.css`.

## 3. Things you must NEVER do
- ❌ Add a **frontend framework** or build-time component system. Vanilla is permanent.
- ❌ Add a **dependency** for something native browser APIs can do (justify in [TECHNICAL_DEBT](./TECHNICAL_DEBT.md) first).
- ❌ **Animate layout properties** (`top/left/width/height/margin/padding`) for ongoing motion.
- ❌ **Globally intercept touch/scroll** or `preventDefault` on `touchmove`, except the one existing,
  narrowly-scoped place (edge-swipe guard in `app.js`) and the image-adjust modal. **Scrolling always wins.**
- ❌ **Rebuild large DOM trees** with `innerHTML` in hot paths when a targeted update works.
- ❌ Introduce **enterprise patterns** (DI, global-state libs, micro-frontends, heavy modularisation).
- ❌ **Commit new client-side secrets** (some exist — don't add more; help remove them).
- ❌ **Fabricate.** If you state a fact, cite `file:line`; if unsure, say so and go read the code.
- ❌ **Remove animations** to "improve performance." Optimise them instead.

## 4. Things you should always do
- ✅ **Reuse existing helpers/patterns** (`escapeHTML`, `debounce`, `formatDate`, `EventBus`, the
  modal/`MODAL_IDS` pattern, `getStableTilt`). Don't create parallel systems.
- ✅ **Make the smallest change** that fully solves the problem.
- ✅ **Bump `CACHE_NAME`** in `service-worker.js` when changing cached assets.
- ✅ **Run `npm run lint` and `npm run build`** before committing.
- ✅ **Update the relevant Bible doc** when behaviour changes.
- ✅ **Preserve the feeling** — re-check warmth/smoothness on the Us tab, splash, and animations.

## 5. Performance rules
Perceived smoothness > benchmarks. Keep boot deferred (`requestIdleCallback`), media lazy
(IntersectionObserver / `loading="lazy"`), renders cached (`_cachedBalance`, `_lastMilestonesDay`,
`_lastMomentsHash`), and debounce hot inputs. See [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md).

## 6. Animation rules
Animate `transform`/`opacity`/`background-position` only; pause continuous animations off-screen;
keep `box-shadow`/`filter` out of hot loops; honour (and help add) `prefers-reduced-motion`.
Inventory + cost model in [ANIMATION_BIBLE](./ANIMATION_BIBLE.md).

## 7. Scroll & touch rules
Native scrolling on phones (Lenis is desktop-only). Don't add `scroll` handlers in hot paths.
Touch handling stays minimal and passive; gestures must gracefully fall back to native behaviour
and never beat scrolling. The Us tab must always scroll natively.

## 8. Firebase/data rules
Source of truth is Firestore; render from in-memory arrays; reload after writes. No live listeners
today (changing that is optional and adds complexity). Never weaken access — if you touch security,
make rules **deny-by-default** and version them. Schema and exact fields in
[FIREBASE_BIBLE](./FIREBASE_BIBLE.md).

## 9. Testing & deployment rules
No automated tests by design — follow [TESTING_GUIDE](./TESTING_GUIDE.md) manually on a real
Android phone for anything you touch. Lint + build must pass. Deploy = push to the Vercel-connected
repo; verify the service-worker update reload on device. [PWA_BIBLE](./PWA_BIBLE.md),
[DEVELOPMENT](./DEVELOPMENT.md).

## 10. Debugging workflow
1. Reproduce (ideally on the phone / remote-debug).
2. Form a hypothesis from the relevant Bible doc.
3. Verify against the code (`file:line`).
4. Make the minimal fix.
5. Re-test the affected checklist; bump `CACHE_NAME` if needed.
Common issues + probes: [DEBUGGING_GUIDE](./DEBUGGING_GUIDE.md). The classic "change not showing"
is a service-worker cache issue.

## 11. How to add things (quick recipes)
- **New modal:** add markup in `index.html`; register id in `MODAL_IDS` (`app.js`); wire open/close
  in `setupEventListeners()` (`ui.js`); animate with `animateModalIn/Out`.
- **New cross-module reaction:** `emit` a past-tense event; `EventBus.on(...)` where you react
  (update the catalog in [STATE_MANAGEMENT](./STATE_MANAGEMENT.md#event-catalog)).
- **New data field:** add it to the write call, render it, and document it in
  [FIREBASE_BIBLE](./FIREBASE_BIBLE.md). Older docs simply lack it.
- **New icon:** add the SVG, keep it small (`npm run optimize:svg`), reference via the icon classes.

## 12. Expected output format (when proposing/doing work)
1. **Root cause** — what's actually happening, cited to `file:line`.
2. **Why the fix is correct** — and why it fits the two-user ethos (simplest viable).
3. **Side effects / compatibility** — what else it touches.
4. **Verification** — exactly how you tested (commands, manual steps, device).
5. **Docs updated** — which Bible files you changed.
Be honest about uncertainty and failures. Prefer minimal, high-impact changes over refactors.

---

### Related documents
[PROJECT_BIBLE](./PROJECT_BIBLE.md) · [REPOSITORY_ARCHITECTURE](./REPOSITORY_ARCHITECTURE.md) · [CODE_AUDIT_REPORT](./CODE_AUDIT_REPORT.md) · [DEBUGGING_GUIDE](./DEBUGGING_GUIDE.md)
