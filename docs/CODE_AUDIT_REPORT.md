# CODE AUDIT REPORT

> A full, re-verified audit of the repository in its **current** state. Every finding was checked
> against the code (earlier exploratory hypotheses were treated as guesses, not facts — the
> disproved ones are listed in [TECHNICAL_DEBT](./TECHNICAL_DEBT.md#disproved-hypotheses-do-not-re-report)).
> Findings are classified and ranked so a future AI can trust this without re-auditing unless the
> code has changed significantly.

Related: [TECHNICAL_DEBT](./TECHNICAL_DEBT.md) · [SECURITY_REVIEW](./SECURITY_REVIEW.md) · [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md)

---

## Rating scale

**Severity:** 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low.
**Class:** 🐛 bug · 🎯 intentional design · ✨ enhancement · 🧹 cleanup.
**Effort:** S (≤1h) · M (a few hours) · L (a day+).

---

## Ranked findings

| # | Finding | Sev | Class | Effort | Root cause | Recommended action |
|---|---------|-----|-------|--------|-----------|--------------------|
| A1 | Cloudinary **API secret in client**, client-signed delete (`config.js:9-10`, `memories.js:225`) | 🔴 | 🐛 | M | convenience client-side signing | rotate secret; delete via Vercel function ([SECURITY_REVIEW](./SECURITY_REVIEW.md)) |
| A2 | **Firestore rules not in repo / unverified** | 🟠 | 🐛 | S–M | configured out-of-band | export, deny-by-default, commit `firestore.rules` |
| A3 | **Memory captions not `escapeHTML`-ed** (`memories.js`) | 🟡 | 🐛 | S | helper not applied there | escape captions on render |
| A4 | **Duplicate preview-build logic** (`memories.js:33` vs `:127`) | 🟡 | 🧹 | S | grew separately | extract shared `buildPreviewItem()` |
| A5 | **No `prefers-reduced-motion`** | 🟡 | ✨ | S | not added | add one reduced-motion block |
| A6 | **Album swipe handlers re-attached per open** (`memories.js:670`) | 🟢 | 🐛 | S | re-setup each `viewAlbum` | ensure prior handlers removed before re-add |
| A7 | **Inline `ontouch*` handlers** on notes (`notes.js:78-80`) | 🟢 | 🧹 | S | quick impl | bind in JS post-render |
| A8 | **Dead PTR CSS** (`.ptr-*`, `ptrSpin`) with no-op JS (`us-tab.js:43`) | 🟢 | 🧹 | S | feature disabled | remove unused CSS or finish feature |
| A9 | **`.replit` obsolete** | 🟢 | 🧹 | S | off Replit now | delete (done in docs pass) |
| A10 | **Icon/emoji buttons lack `aria-label`; zoom disabled** | 🟢 | ✨ | S | app-like choices | add labels; reconsider zoom |
| A11 | **Full-container `innerHTML` re-renders** | 🟢 | 🎯 | — | simplest correct approach | keep; diff only if lists grow |
| A12 | **Dangling soft links** (moment→deleted id) | 🟢 | 🎯 | — | no referential integrity | lookups skip; optional prune |
| A13 | **Inconsistent collection refs** (`secret_notes`/`moods` inline) | 🟢 | 🧹 | S | inconsistency | add cached refs |
| A14 | **Single ~5,400-line `styles.css`** | 🟢 | 🎯 | — | vanilla, no tooling | fine; split only if needed |

---

## By category

### Dead / unused code
- Pull-to-refresh: `.ptr-*` styles + `ptrSpin` keyframe are unused because `setupPullToRefresh()`
  is a no-op (A8). The cleanest resolution is to **remove** the dead CSS (the feature isn't wanted
  right now) — a small, satisfying cleanup.
- `.replit` (A9) — obsolete tooling, removed in this documentation pass.
- No other meaningful dead JS found; the previously-suspected dead/undefined functions were
  **disproved** (see [TECHNICAL_DEBT](./TECHNICAL_DEBT.md#disproved-hypotheses-do-not-re-report)).

### Duplicate logic
- Preview-build duplication (A4) is the one real duplication worth consolidating. Otherwise the
  codebase reuses helpers well (`escapeHTML`, `debounce`, `formatDate`, `EventBus`, the modal
  pattern, `getStableTilt`/`getStableNoteRotation`).

### Performance / rendering / animation
- Strong already (deferred boot, lazy media, render caches, GPU-friendly animation). Watch items:
  full-container re-renders (A11, fine now), `box-shadow` glows, album-swipe re-attach (A6).
  Full analysis in [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md).

### Memory leaks
- Re-verified: preview object URLs revoked, video observer disconnected on tab leave, music timers
  cancelled. Only **A6** (album swipe re-attach) warrants a quick check. No confirmed leaks.

### Touch / scroll / gesture conflicts
- Minimal and well-scoped. Edge-swipe guard is narrow (30px zone, never on Us tab, only when no
  horizontal scroll) and the image-adjust modal is the only other non-passive `touchmove`. No
  conflicts found. (See [PERFORMANCE_BIBLE §5](./PERFORMANCE_BIBLE.md#5-touch-performance).)

### Unused assets
- Icons/SVGs were optimised in a prior pass; no orphaned large assets found. Screenshots are
  referenced by the manifest. (If adding assets, run `npm run optimize:svg`.)

### Accessibility
- Gaps (A5, A10): no reduced-motion, zoom disabled, some unlabeled icon buttons; light Us-theme
  contrast should be spot-checked. All are additive improvements that won't hurt the warm feel.

### Potential bugs
- A1, A3, A6 are the only genuine correctness/security bugs. A3/A6 are low-likelihood given two
  trusted users; A1 is the one to fix promptly.

---

## Risk assessment (overall)
The codebase is **healthy and coherent for its purpose.** The only high-urgency risk is the
exposed Cloudinary secret (A1) plus the unverified Firestore rules (A2) — both are about keeping
the couple's data and paid service safe from outsiders, which matters even for a two-user app.
Everything else is low-severity cleanup or intentional simplicity that should be **left alone**
unless it causes a real problem.

## Suggested sequencing
1. **A1** (rotate + server-side delete) — Critical.
2. **A2** (version + harden rules) — High.
3. **A3** (escape captions), **A5** (reduced-motion) — quick Medium wins.
4. **A4, A6, A7, A8, A13** — cleanups, batch when convenient.
5. Leave **A11, A12, A14** unless symptoms appear.

---

### Related documents
[TECHNICAL_DEBT](./TECHNICAL_DEBT.md) · [SECURITY_REVIEW](./SECURITY_REVIEW.md) · [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md) · [ROADMAP](./ROADMAP.md)
