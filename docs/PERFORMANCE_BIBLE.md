# PERFORMANCE BIBLE

> Performance here means **perceived smoothness, responsiveness and delight** for two people on
> Android phones — not benchmark scores (see [PROJECT_BIBLE §11](./PROJECT_BIBLE.md#11-performance-philosophy)).
> This documents what's already done well, what to watch, and where future wins are.

Related: [ANIMATION_BIBLE](./ANIMATION_BIBLE.md) · [MEDIA_SYSTEM](./MEDIA_SYSTEM.md) · [CODE_AUDIT_REPORT](./CODE_AUDIT_REPORT.md)

---

## 1. Startup performance
- **Deferred boot:** critical data (`loadExpenses`, `loadBudget`) loads first; memories/notes/
  secret-notes/mood/moments load via `requestIdleCallback` (`loadDeferredModules`, `js/app.js:105`).
  Music init is also idle-deferred. This keeps first interaction fast.
- **Light precache:** the app shell + icons + sounds are precached; the icon assets were optimised
  from ~45 MB to ~2.8 MB total (app icons 9.4→~0.9 MB, `icons/` 36→~1.9 MB — see [CHANGELOG](./CHANGELOG.md)),
  dramatically cutting first-install download and storage.
- **Splash overlaps work:** the 10s splash hides initial setup; skippable via triple-tap.

## 2. Rendering
- **Pattern:** load → in-memory array → `render*()` → `innerHTML`. At two-user data volumes this
  is comfortably fast.
- **Cheap-render guards** prevent redundant rebuilds:
  - `_cachedBalance` (`expenses.js:523`) — balance recomputed only when invalidated.
  - `_lastMilestonesDay` (`us-tab.js:35`) — milestones re-render at most once per day.
  - `_lastMomentsHash` (`moments.js:205`) — moments full-view skips identical re-renders.
- **Watch item:** several renders rebuild a whole container via `innerHTML`
  (`renderAllExpenses`, `renderMemoriesTimeline`, milestones). Fine now; if a list ever grows
  large, switch to targeted node updates. The search box is **debounced 200ms** to avoid
  re-rendering on every keystroke.

## 3. Scrolling
- **Native scroll on phones.** Lenis smooth-scroll initialises **only on non-touch devices**
  (`initSmoothScroll`, `animations.js:13`), so mobile uses the browser's own momentum scrolling.
- **No scroll-driven JS** in hot paths; ambient effects are CSS, not `scroll` handlers.
- A global `touchend` listener clears any stray `overflow:hidden` lock as a resilience measure
  (`animations.js:219`).

## 4. Animations & GPU
- Animations use `transform`/`opacity`/`background-position` (compositor-friendly); layout
  properties are avoided for motion. Continuous effects (floating hearts) **pause when off the Us
  tab**. The only expensive effect (`filter: blur` in the splash heart) is a one-shot.
  Full cost table in [ANIMATION_BIBLE](./ANIMATION_BIBLE.md#1-cost-model-read-first).
- **Watch item:** `box-shadow`-based glows (`memoryTimelineGlow`) repaint; keep them off hot loops.

## 5. Touch performance
- Touch handling is minimal. The only non-passive `touchmove` listeners are (a) the Android
  edge-swipe guard (`app.js`, scoped to screen edges, never on the Us tab) and (b) the
  image-adjust modal drag. Everything else is passive or native. Scrolling always takes priority.

## 6. Media performance
- **Lazy everything:** images `loading="lazy"`; timeline videos play/pause via one
  `IntersectionObserver` (200px margin) and are `preload="metadata"` only.
- **Object URLs revoked** after previews to avoid blob leaks.
- **Audio/video bypass the service worker** so range-request seeking works (don't cache them).
- See [MEDIA_SYSTEM](./MEDIA_SYSTEM.md).

## 7. Memory hygiene (leak review — re-verified)
- ✅ Preview object URLs tracked + revoked (`_previewObjectURLs`).
- ✅ Timeline video observer disconnected on Us-tab leave.
- ✅ Music autoplay/fade timers (`musicDelayTimer`, `musicFadeInterval`) cancelled on tab switch.
- ⚠️ **Album swipe handlers** (`setupAlbumSwipe`, `memories.js:670`) are re-attached each time an
  album opens; verify old handlers are removed (they use stored references) so they don't
  accumulate across many opens. *(Low impact at this usage; flagged in
  [CODE_AUDIT_REPORT](./CODE_AUDIT_REPORT.md).)*
- ⚠️ Continuous ambient timers/animations are fine because they're CSS and pause off-tab.

## 8. Network usage
- Firestore offline persistence avoids redundant reads; writes are followed by a single reload of
  the affected collection (not the whole dataset).
- Media is fetched on demand from Cloudinary (not precached).

## 9. Known bottlenecks / watch list
| Area | Note | Severity |
|------|------|----------|
| Full-container `innerHTML` re-renders | Fine at current volumes; revisit if lists grow | Low |
| `box-shadow` glow animations | Repaint cost; keep out of hot loops | Low |
| Album swipe listener re-attach | Verify no accumulation | Low |
| Dead PTR CSS (`ptrSpin`) | No perf cost, just unused | Low |
| No `prefers-reduced-motion` | Accessibility/perf for sensitive users | Medium |

## 10. Future optimisation opportunities (only if a real need appears)
- Targeted DOM diffing for the expense/memory lists **iff** they ever get large.
- A tiny optional offline cache for *recently viewed* memory thumbnails (carefully, without
  breaking video seeking).
- Add the reduced-motion block (also an a11y win).
- None of these are urgent — the app already feels smooth for its two users. Prefer leaving
  working code alone (see ethos) over speculative optimisation.

---

### Related documents
[ANIMATION_BIBLE](./ANIMATION_BIBLE.md) · [MEDIA_SYSTEM](./MEDIA_SYSTEM.md) · [CODE_AUDIT_REPORT](./CODE_AUDIT_REPORT.md) · [TECHNICAL_DEBT](./TECHNICAL_DEBT.md)
