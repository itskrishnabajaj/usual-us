# PROJECT BIBLE 🤍

> The constitution of `usual us`. Every other document, and every future change, must
> be consistent with this one. When in doubt, come back here.

Related: [README](./README.md) · [REPOSITORY_ARCHITECTURE](./REPOSITORY_ARCHITECTURE.md) · [AI_ENGINEERING_GUIDE](./AI_ENGINEERING_GUIDE.md)

---

## 1. The ethos

`usual us` is **a deeply personal digital space, not a product.** It was built by one
developer for exactly two permanent users — himself and his girlfriend. No one else is
ever expected to use it. There is no growth, no monetisation, no team, and no public
release on the horizon.

This single fact governs every engineering decision. The app should feel like a
**premium digital scrapbook, a relationship journal, a shared memory vault, and a private
emotional home** — calm, warm, intimate, elegant — and never like a commercial social
network optimised for engagement.

Concretely, we optimise for, in priority order:

1. **Emotional experience** — warmth, intimacy, calm, delight, storytelling.
2. **Reliability** — it must always work for the two people who depend on it.
3. **Perceived smoothness** — it should *feel* instant and fluid, more than it should win benchmarks.
4. **Simplicity & clarity** — code one developer can still understand in two years.
5. **Long-term personal maintainability** — boring, obvious, durable choices.

We explicitly **de-prioritise** (and usually reject): scalability, multi-user
generality, engagement metrics, feature quantity, and "best practices" that exist only
to coordinate large teams.

### What this means in practice
- The two-user assumption is a **design constraint, not a bug.** Hardcoded users, PINs in
  `js/config.js`, and manual data refresh are acceptable because the threat model and user
  count are tiny and fixed. Where these carry real risk we document it honestly (see
  [SECURITY_REVIEW](./SECURITY_REVIEW.md)) and recommend the *smallest fix that fits a
  two-person private app* — never enterprise hardening for its own sake.
- We document **why**, not just **how**. A future maintainer should understand the feeling a
  feature is meant to create, so they can preserve it.

---

## 2. Vision & purpose

A single, private place where two people can:

- **Track shared money** without it feeling transactional — balances, who-owes-whom,
  settle-ups, monthly budget, and gentle spending stats.
- **Keep memories** — a polaroid-style photo/video/audio timeline with captions and dates.
- **Stay emotionally close** — daily mood check-ins (visible to each other), a rotating
  daily love quote, relationship milestones, "little things I noticed" sticky notes, and
  time-locked secret notes that unlock on future dates.
- **Plan and remember moments** — a small calendar of dates, trips and anniversaries.
- **Share a soundtrack** — a curated playlist that can softly autoplay on the "Us" tab.

The emotional centre of the app is the **Us tab**: a warm, light-themed, animated space
distinct from the darker "utility" tabs (home/add/history/stats). See
[UI_UX_BIBLE](./UI_UX_BIBLE.md).

---

## 3. Design philosophy

- **Two worlds, one app.** The financial tabs are a calm dark theme; the Us tab is a warm,
  breathing light theme (with a "late-night" variant after 23:00). This contrast is
  intentional — utility vs. intimacy. See [DESIGN_SYSTEM](./DESIGN_SYSTEM.md).
- **Cinematic, not flashy.** The 10-second splash, the breathing gradients, the floating
  hearts and twinkling stars exist to set a *mood*, not to impress. They should feel like
  the opening of something personal.
- **Tactile.** Every interactive element responds to touch (scale-down on `:active`,
  soft shadows). The app should feel physical and responsive in the hand.
- **Quiet typography.** Playfair Display (serif, romantic) for emotional headings,
  Homemade Apple (handwriting) for captions, Inter for everything functional.

## 4. UX philosophy

- **Intimacy over engagement.** No notifications-for-the-sake-of-it, no streaks, no
  dark patterns. Nothing that nudges "usage."
- **Calm defaults.** Empty states are gentle invitations ("Start capturing your moments
  together"), never error-like.
- **Forgiving.** Destructive actions confirm; toasts are soft and brief; the back button
  always does the least surprising thing (close the top overlay).
- **Personal language.** Copy is written for two people who know each other — first-person,
  warm, specific ("You smiled differently today…").

## 5. Motion philosophy

Motion is part of the app's identity, not decoration to be stripped for performance.
The rule is **optimise motion, don't remove it**. See [ANIMATION_BIBLE](./ANIMATION_BIBLE.md).

- Animate **`transform` and `opacity`** (and `background-position` for gradients). These are
  GPU-friendly and don't trigger layout.
- **Never animate** `top`/`left`/`width`/`height`/`margin`/`padding` for ongoing motion.
- Pause continuous animations when off-screen (e.g. floating hearts pause when not on the Us
  tab — `styles.css` `.floating-heart` `animation-play-state: paused`).
- Use `cubic-bezier(0.4,0,0.2,1)` (`--ease`) as the default and the bouncy
  `cubic-bezier(0.34,1.56,0.64,1)` (`--ease-bounce`) for moments of delight.

## 6. Technical philosophy

- **Vanilla, on purpose.** No framework, no dependency sprawl. The whole app is
  plain HTML/CSS/JS plus three small local libraries (GSAP, Lenis, Hammer) and the Firebase
  CDN SDK. This is a feature: it will still run, and still be understandable, years from now.
- **Scripts are loaded in order, sharing a global namespace.** There is no module bundler
  graph to reason about — files are `<script>`-included in a deliberate sequence
  (see [REPOSITORY_ARCHITECTURE](./REPOSITORY_ARCHITECTURE.md#script-load-order)). Globals are
  the intended interface between files.
- **One lightweight EventBus** (`js/event-bus.js`) decouples modules. This is the *only*
  abstraction we needed; resist adding more.
- **Firestore is the source of truth; render from in-memory arrays.** Load → store in a
  global array → render. Reloads are explicit after writes. See [STATE_MANAGEMENT](./STATE_MANAGEMENT.md).
- **Graceful degradation everywhere.** If GSAP/Lenis/Hammer/Firebase are missing, the app
  still works (CSS fallbacks, native scroll, etc.).

## 7. Mobile-first philosophy

The app is used almost exclusively on Android phones, installed as a PWA.

- Designed at phone width first; `max-width: 600px` content column, larger paddings on tablet.
- Respects safe-area insets (notch / home indicator) on the bottom nav.
- Scrolling stays native; gesture handling is minimal and always yields to scrolling
  (see [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md) and the Android edge-swipe hardening in
  `js/app.js`).
- Touch targets are generous; feedback is immediate.

---

## 8. Development principles

1. **Understand before changing.** Trace the data flow, events, and DOM before editing.
2. **Reuse before you add.** There is almost always an existing helper
   (`escapeHTML`, `debounce`, `formatDate`, `EventBus`, the modal pattern). Use it.
3. **Smallest change that fully solves the problem.** Prefer 10 correct lines to a refactor.
4. **Preserve the feeling.** If a change touches the Us tab, splash, or any animation,
   verify it still feels warm and smooth — not just that it "works."
5. **Leave it cleaner.** Each change should reduce, not grow, long-term maintenance burden.

## 9. Rules future developers (and AIs) must follow

These are hard rules. Breaking one requires an explicit, documented reason.

- ❌ **Do not introduce a frontend framework** (React/Vue/Svelte/etc.) or a build-time
  component system. The vanilla stack is intentional and permanent.
- ❌ **Do not add a dependency** for something a native browser API can do. Justify any new
  dependency in [TECHNICAL_DEBT](./TECHNICAL_DEBT.md) first.
- ❌ **Do not animate layout properties** for ongoing motion (see §5).
- ❌ **Do not globally intercept touch/scroll** or call `preventDefault()` on touchmove
  except in the one verified, narrowly-scoped place that already does (`js/app.js` edge-swipe
  hardening). Scrolling always wins.
- ❌ **Do not rebuild large DOM trees** when a small update will do; avoid `innerHTML` churn
  in hot paths.
- ❌ **Do not add enterprise patterns** (DI, global-state libraries, micro-frontends,
  excessive modularisation). They do not fit a one-dev, two-user app.
- ❌ **Do not commit new secrets** to the client. (Some already exist — see
  [SECURITY_REVIEW](./SECURITY_REVIEW.md) — don't add more.)
- ✅ **Do bump `CACHE_NAME`** in `service-worker.js` whenever you change cached assets.
- ✅ **Do run `npm run lint` and `npm run build`** before committing.
- ✅ **Do keep the docs true.** If you change behaviour, update the relevant Bible doc.

## 10. Coding standards

- **Language:** modern browser JS (ES2017+), no transpilation assumed beyond what Vite does.
- **Style:** Prettier-formatted (`npm run format`); ESLint-clean (`npm run lint`). Config in
  `.prettierrc` and `eslint.config.js`.
- **Naming:** descriptive camelCase functions; internal/global caches prefixed `_`
  (e.g. `_cachedBalance`, `_lastMilestonesDay`).
- **Files:** one domain per file in `js/` (expenses, memories, notes, mood, moments, music,
  budget, stats, us-tab, auth, ui, animations, sounds) + the cross-cutting core
  (`config.js`, `state.js`, `event-bus.js`, `app.js`).
- **DOM access:** by `id` for singletons, by class for collections; cache hot references
  (see `getCachedElements()` in `js/us-tab.js:15`).
- **User content into HTML:** escape it with `escapeHTML()` from `js/state.js:80`.
  (Note the one current gap in `js/memories.js` captions — see [SECURITY_REVIEW](./SECURITY_REVIEW.md).)
- **Comments:** explain *why*, especially for timing, gesture, and animation code.

## 11. Performance philosophy

Performance here means **perceived smoothness and delight**, not benchmark scores.
See [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md).

- Fast, deferred startup: load critical data (expenses, budget) first; defer the rest with
  `requestIdleCallback` (`js/app.js`).
- Lazy media: videos play/pause via `IntersectionObserver`; images use native `loading="lazy"`.
- Cheap re-renders: cache renders (`_lastMilestonesDay`, `_lastMomentsHash`) and the balance
  (`_cachedBalance`) so we don't recompute or rebuild needlessly.
- Light assets: the app icons and `icons/` SVGs were optimised from ~45 MB to ~2.8 MB of
  precached media (see [CHANGELOG](./CHANGELOG.md)).

## 12. Animation philosophy

See §5 and the full inventory in [ANIMATION_BIBLE](./ANIMATION_BIBLE.md). Summary: animations
are first-class, GPU-friendly, paused when off-screen, and tuned for warmth. The one
outstanding accessibility gap is the absence of a `prefers-reduced-motion` fallback
(tracked in [KNOWN_LIMITATIONS](./KNOWN_LIMITATIONS.md) and [TECHNICAL_DEBT](./TECHNICAL_DEBT.md)).

## 13. Repository architecture overview

A flat, readable layout. Full detail in [REPOSITORY_ARCHITECTURE](./REPOSITORY_ARCHITECTURE.md).

```
index.html          Single HTML entry: all screens, modals, and ordered <script> tags
styles.css          One global stylesheet (themes, components, animations)
firebase.js         Firebase config + Firestore init + collection references
service-worker.js   PWA cache + offline strategy (cache: usual-us-v47)
manifest.json       PWA manifest
vercel.json         Hosting headers (no-cache for SW/manifest + security headers)
js/                 App logic, one domain per file + core (config/state/event-bus/app)
lib/                Local GSAP, Lenis, Hammer
icons/  sounds/     Optimised SVG icons and MP3 sound effects
docs/               This Bible
```

## 14. High-level application overview

1. **Boot:** `index.html` loads libraries, then config/state/event-bus, then domain modules,
   then `app.js`. On `DOMContentLoaded` a 10-second splash plays (triple-tap to skip).
2. **Login:** PIN-based, against the two hardcoded users in `js/config.js`. The chosen user is
   remembered in `localStorage`. Login initialises Firebase and loads data.
3. **Data load:** expenses + budget load immediately; memories, notes, secret notes, mood and
   moments are deferred via `requestIdleCallback`.
4. **Use:** five tabs (home, add, history, stats, us) switch with a GSAP cross-fade. The Us tab
   is revealed after the first visit to stats and becomes the emotional heart of the app.
5. **Sync:** all writes go to Firestore and the app reloads the relevant array; offline
   persistence keeps it working without a connection.

---

### Related documents
[REPOSITORY_ARCHITECTURE](./REPOSITORY_ARCHITECTURE.md) ·
[UI_UX_BIBLE](./UI_UX_BIBLE.md) ·
[AI_ENGINEERING_GUIDE](./AI_ENGINEERING_GUIDE.md) ·
[SECURITY_REVIEW](./SECURITY_REVIEW.md)
