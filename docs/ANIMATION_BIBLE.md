# ANIMATION BIBLE

> Every animation in `usual us`: what it's for, how it's tuned, what it costs, and how it's
> triggered. Motion is part of the app's identity — **optimise it, don't remove it**
> (see [PROJECT_BIBLE §5](./PROJECT_BIBLE.md#5-motion-philosophy)).

Related: [DESIGN_SYSTEM](./DESIGN_SYSTEM.md) · [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md) · [UI_UX_BIBLE](./UI_UX_BIBLE.md)

All `@keyframes` and transitions live in `styles.css`. Line numbers are cited; where a class is
toggled by JS, the trigger is named.

---

## 1. Cost model (read first)

| Animated property | Cost | Use? |
|-------------------|------|------|
| `transform`, `opacity` | Cheap (GPU compositing, no layout) | ✅ default |
| `background-position` | Cheap (paint only, used for gradient/shimmer) | ✅ |
| `box-shadow` | Moderate (repaint) | ⚠️ sparingly, not in hot loops |
| `filter: blur()` | Expensive | ⚠️ one-shot only (splash) |
| `top/left/width/height/margin/padding` | Expensive (layout/reflow) | ❌ never for ongoing motion |

Continuous animations are **paused when off-screen** where it matters (e.g. `.floating-heart`
`animation-play-state: paused` when not on the Us tab).

---

## 2. Splash screen — the 10-second cinematic sequence

A choreographed five-stage story (`index.html:28-52`, `styles.css:31-519`), controlled by JS
classes `splash-exit` / `splash-skip` / `splash-done` (`js/app.js:21-62`). Triple-tap skips it.

| Stage (time) | Animation(s) | Props | Cost |
|--------------|--------------|-------|------|
| 1 — Awakening (0–2s) | `splashBgIn` (2s, opacity), `splashAmbIn` + looping `splashAmbA/B/C` ambient particles | opacity, transform | Cheap |
| 2 — Converge (2–4s) | `splashP1` (2s@2s), `splashP2` (1.8s@2.2s) two lights translate+scale to centre | opacity, transform | Cheap |
| 3 — Heart (4–6s) | `splashGlowIn/Pulse/Out`, `splashHeartMorph` (1s@4s, `--ease-bounce`, scale+rotate+**blur**), `splashHeartPulse` (×2) | opacity, transform, filter | Moderate (one-shot blur) |
| 4 — Orbit (6–8s) | `splashOrbit0/90/180/270` four icons orbit (2.5s, staggered 6–6.45s) | opacity, transform | Cheap |
| 5 — Reveal (8–10s) | `splashFadeUp` subtitle, `splashTitleIn` title, `splashScatter` 8 dissolve particles (`--dx/--dy`) | opacity, transform | Cheap |
| Exit | `splashBridgeExpand` (1s; 0.4s on skip), `splashElementFade`, `splashContainerExit`, `splashSkipOut`; then `loginReveal`/`loginContainerReveal` (`--ease-bounce`) | opacity, transform | Moderate |
| Skip hint | `splashHintShow` (4s@3s, fades a "tap three times to skip" line) | opacity | Cheap |

The blur in `splashHeartMorph`/`splashHeartDissolve` is the only expensive effect; it runs once
per launch and is an accepted trade-off for the emotional payoff.

---

## 3. Us-tab ambient & emotional animations {#us-tab}

| Animation | `styles.css` | Duration / easing | Trigger | Props / cost |
|-----------|--------------|-------------------|---------|--------------|
| `usBreathingGradient` | 4063-4069 | 25s (30s late-night) ease-in-out, infinite | `.us-tab` bg | `background-position`, cheap |
| `shimmer` (Us title) | 4008-4015 | 3s linear infinite | `.us-title` gradient text | `background-position`, cheap |
| `twinkle` (header sparkles) | 2174-2177 | 3s ease-in-out infinite (0 / 1.5s delay) | `.us-header-section::before/::after` | opacity+scale, cheap |
| `floatParticles` | 4042-4049 | 20s ease-in-out infinite | `.us-tab::before` | opacity, cheap |
| `ritualBreatheIn` | 4027-4031 | 1.2s `--ease`, once | ritual card entrance | opacity+scale, cheap |
| `floatHeart` | 4667-4684 | 5s ease-in-out | celebration / Us hearts | transform+opacity; **paused off-tab** |
| `lastSeenPulse` | 2234-2237 | 2s infinite | partner online dot | opacity, cheap |
| `memoryParticleDrift` | 4078-4084 | drift | memory ambience | transform+opacity, cheap |
| `momentSparkle` | 4087-4090 | 0.45s | moment created (`showMomentCreatedSparkles`, `us-tab.js:528`) | transform+opacity, cheap |
| `glow` / `memoryTimelineGlow` | 4051-4075 | varies | milestone/memory accents | scale / **box-shadow (watch repaint)** |

Stars and floating hearts are created once per Us-tab init and guarded against duplication
(`createUsTabStars` `us-tab.js:222`, `createFloatingHearts` `us-tab.js:263`).

---

## 4. Interaction & feedback animations

| Animation | `styles.css` | Duration / easing | Trigger | Props |
|-----------|--------------|-------------------|---------|-------|
| `tabSlideIn` | 956-965 | 0.2s `--ease` | `.tab-content.active` | opacity+translateY |
| `modalSlideIn` | 4465-4474 | 0.35s `--ease-bounce` | modal open | opacity+translateY+scale |
| `slideUp` | 3987-3996 | 0.3–0.35s | modal/overlay content | opacity+translateY |
| `heartbeat` | 4337-4342 | 0.6s `--ease-bounce` | Us nav icon on activate | scale |
| `moodBounce` | 4542-4546 | 0.4s `--ease-bounce` | mood selected | scale |
| `selectPop` | 4605-4609 | 0.25s `--ease-bounce` | radio/category selected | scale |
| `pinDotFill` | 4678-4681 | 0.2s `--ease-bounce` | PIN digit entered | scale |
| `shake` | 4344-4350 | 0.5s custom bezier | wrong PIN (`.pin-dots.shake`) | translateX |
| `celebrationBounce`/`celebrationPop` | 3622/4562 | 0.5s | balance hits ₹0 | opacity+scale |
| `bounceDown` | 2477-2480 | 1.5s ×3 | scroll-to-oldest hint | translateY |
| `ptrSpin` | 1799-1801 | 0.7s linear infinite | pull-to-refresh spinner CSS (**PTR is disabled in JS** — see note) | transform |
| `shimmerCard` | 4415-4418 | 4s infinite | balance card gloss sweep | transform |
| `shimmerText` | 4361-4364 | 4s infinite | login/name/Us gradient text | background-position |
| `fadeInUp` / `fadeIn` / `scaleIn` | 4092 / 967 / 4332 | 0.3–0.7s | generic entrances (staggered) | opacity+transform |
| `slideInLeft` | (used `:4422`) | 0.4s | category-stat cascade | opacity+transform |

**Staggered cascades** (via `nth-child` delays): expense items (`:4612`), stat items (`:4504`),
milestone cards (`:4550`), sticky notes (`:4652`), category stats (`:4422`).

> **Note on `ptrSpin`:** the pull-to-refresh CSS exists, but the JS hook `setupPullToRefresh()`
> is intentionally a **no-op** (`js/us-tab.js:43`) and `isPullingToRefresh` stays `false`. The
> spinner styles are currently dead CSS — tracked in [TECHNICAL_DEBT](./TECHNICAL_DEBT.md).

---

## 5. JS-driven animation helpers (`js/animations.js`)

GSAP wrappers (with graceful no-op fallback if GSAP is absent):
- `animateModalIn(el)` — 0.4s opacity 0→1, scale .94→1, y 20→0, `power3.out` (`:50`).
- `animateModalOut(el, cb)` — 0.3s reverse, `power2.in` (`:72`).
- `animateTabSwitch(out, in, onSwap)` — fade out 0.18s → swap → fade in 0.3s (`:118`).
- `animateCardsIn(selector, parent)` — staggered list entrance, 0.45s/0.07s (`:94`).
- `animateEntrance(el, opts)` — flexible single-element entrance (`:157`).

Lenis smooth-scroll (`initSmoothScroll`, `:13`) runs **only on non-touch devices**; phones use
native scroll. Hammer pan powers the image-adjust drag (`attachImageAdjustGestures`, `:174`).

---

## 6. Easings & timing

`--ease` `cubic-bezier(0.4,0,0.2,1)` (default), `--ease-bounce` `cubic-bezier(0.34,1.56,0.64,1)`
(delight), plus `linear` (rotations), `ease-in/out` (loops/exits), and a custom shake bezier
`cubic-bezier(0.36,0.07,0.19,0.97)` (`:4353`). Transition tokens: `--transition-fast` 0.15s,
`--transition-normal` 0.3s, `--transition-slow` 0.5s.

## 7. Accessibility — reduced motion

There is **no `prefers-reduced-motion` handling** in `styles.css` (verified). For an
animation-heavy app this is the main motion-accessibility gap. Recommended minimal fix (fits the
ethos — one small block, no redesign):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; }
}
```
Tracked in [KNOWN_LIMITATIONS](./KNOWN_LIMITATIONS.md) and [TECHNICAL_DEBT](./TECHNICAL_DEBT.md).
Consider exempting the splash (or shortening it) so the brand moment survives.

---

### Related documents
[DESIGN_SYSTEM](./DESIGN_SYSTEM.md) · [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md) · [UI_UX_BIBLE](./UI_UX_BIBLE.md)
