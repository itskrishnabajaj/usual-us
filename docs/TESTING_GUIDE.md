# TESTING GUIDE

> There is no automated test suite (intentional for a tiny personal app). Quality is protected by
> linting, a production build, and **disciplined manual testing** on a real Android phone. This is
> the checklist.

Related: [DEBUGGING_GUIDE](./DEBUGGING_GUIDE.md) · [DEVELOPMENT](./DEVELOPMENT.md) · [PWA_BIBLE](./PWA_BIBLE.md)

---

## Pre-flight (every change)
- [ ] `npm run lint` passes.
- [ ] `npm run build` succeeds.
- [ ] If a cached asset changed, `CACHE_NAME` bumped in `service-worker.js`.
- [ ] Docs updated if behaviour changed.

## Per-feature manual checklist

### Auth
- [ ] First-time login with each user id + correct PIN works.
- [ ] Wrong PIN shakes the dots / shows error; correct PIN proceeds.
- [ ] Returning-user form pre-fills the saved name; "switch user" clears it.

### Expenses
- [ ] Add expense (equal & custom split, each category, with/without note, count-toward-budget on/off).
- [ ] Balance + who-pays icon update correctly; settling to ₹0 triggers the celebration + hearts.
- [ ] Edit and delete an expense (with confirm); recent list and history update.
- [ ] History search (debounced), paid-by filter, month filter all work.

### Budget
- [ ] Set/edit budget; progress bar fills; warning appears ≥80%; resets on a new month.

### Stats
- [ ] Totals/contributions, pie chart, and 6-month trend render for the current month.
- [ ] First Stats visit **reveals the Us tab**.

### Memories
- [ ] Upload single + multiple (image/video/audio) from camera and gallery.
- [ ] Video > 20s is rejected; previews show; remove-from-preview works (no leaked object URLs).
- [ ] Timeline renders polaroids/stacks; tilt is stable across reloads; anniversary badge shows.
- [ ] Single + album viewers open; album swipe (prev/next, wraps); image adjust (sliders + drag) saves.
- [ ] Delete memory removes it (and its Cloudinary assets).

### Notes / secret notes
- [ ] Add note; long-press (1s) deletes; empty state shows when none.
- [ ] Create secret note; locked shows countdown; unlocks on/after date.

### Mood
- [ ] Set each mood; selection bounces; persists (reload shows it); partner mood shows when set.

### Moments
- [ ] Create/edit/delete moment; upcoming vs past split correct; preview shows top upcoming.
- [ ] Creating a moment triggers the sparkle burst.

### Music
- [ ] Panel opens (Us tab only); play/pause/seek; recently-played updates (max 3).
- [ ] Entering Us tab autoplays after ~12s with fade-in (or resumes if already playing); leaving pauses.
- [ ] Seeking works (range requests not broken by the SW).

### Navigation & overlays
- [ ] All five tabs switch with the cross-fade; Us late-night theme after 23:00.
- [ ] Back button closes the top overlay/modal in priority order, then returns to Home.
- [ ] Splash plays; triple-tap skips.

---

## Cross-device matrix (target: Android phones)
Test the installed PWA on a representative spread:

| Device / engine | Focus |
|-----------------|-------|
| Pixel (Chrome) | baseline |
| Samsung (Samsung Internet) | gesture/scroll quirks, edge-swipe |
| Xiaomi / Realme / OnePlus / Motorola (Chrome) | varied Android skins & refresh rates |
| iPhone (Safari) | install + basic flows (secondary) |
| Desktop Chrome | Lenis smooth-scroll path, dev sanity |

Check: native scrolling feels smooth; edge-swipe doesn't hijack horizontal UI but back-gesture
still works; animations smooth at the device refresh rate; no layout shift; safe-area respected.

## Offline / PWA testing
- [ ] Load online once, go offline: app shell + cached data still work; writes queue and sync on reconnect.
- [ ] Update test: deploy a change with a bumped `CACHE_NAME`; confirm the installed app reloads to the new version.
- [ ] Old caches are cleared (only `usual-us-vNN` present).

## Performance sanity (perceived, not benchmarks)
- [ ] Startup feels fast; splash skippable.
- [ ] Scrolling the Us tab (with many memories) stays smooth; only visible videos play.
- [ ] No jank during tab switches/animations.

## Accessibility spot-checks
- [ ] (After adding it) reduced-motion calms animations.
- [ ] Icon buttons have labels; light-theme contrast is legible.

## Release checklist
1. Lint + build pass.
2. Manual checklist for touched areas.
3. `CACHE_NAME` bumped if assets changed.
4. Update [CHANGELOG](./CHANGELOG.md).
5. Push → verify Vercel deploy → smoke-test on the phone (incl. the SW update reload).

---

### Related documents
[DEBUGGING_GUIDE](./DEBUGGING_GUIDE.md) · [PWA_BIBLE](./PWA_BIBLE.md) · [CHANGELOG](./CHANGELOG.md)
