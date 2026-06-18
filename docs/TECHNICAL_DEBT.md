# TECHNICAL DEBT

> Re-verified debt only — every item below was checked against the current code, not inherited
> from an old audit. Each has a root cause, the **simplest** fix for a one-dev/two-user app, and a
> priority. Several previously-suspected issues were **disproved** and are listed at the bottom so
> they aren't "rediscovered."

Related: [CODE_AUDIT_REPORT](./CODE_AUDIT_REPORT.md) · [SECURITY_REVIEW](./SECURITY_REVIEW.md) · [KNOWN_LIMITATIONS](./KNOWN_LIMITATIONS.md)

**Priority key:** Critical (do soon) · High · Medium · Low (nice-to-have).
**Type:** 🐛 bug · 🎯 intentional-but-worth-noting · ✨ enhancement · 🧹 cleanup.

---

## Open items

| # | Item | Type | Root cause | Simplest fix | Priority |
|---|------|------|-----------|--------------|----------|
| 1 | Cloudinary **secret in client** (`config.js:9-10`), client-side signed delete (`memories.js:225`) | 🐛/security | deletion built client-side | rotate secret; move delete to a Vercel function; drop secret from client | **Critical** |
| 2 | Firestore **rules not in repo** / unverified | 🐛/security | configured out-of-band | export `firestore.rules`, make deny-by-default, commit | **High** |
| 3 | Memory **captions not escaped** (`memories.js`) | 🐛 | `escapeHTML` not applied there | wrap caption in `escapeHTML()` like other modules | Medium |
| 4 | **Duplicate photo-preview logic** — `handlePhotoSelect` (`memories.js:33`) and `rerenderPhotoPreviews` (`:127`) build near-identical preview markup | 🧹 | grew separately | extract one `buildPreviewItem(file/index)` helper used by both | Medium |
| 5 | **Inline `ontouch*` handlers** on notes (`notes.js:78-80`) | 🧹 | quick implementation | attach listeners in JS after render (like other components); drop `window` exports | Low |
| 6 | **Dead pull-to-refresh** — `setupPullToRefresh()` no-op (`us-tab.js:43`), `isPullingToRefresh` always false, but `.ptr-*` CSS + `ptrSpin` keyframe remain | 🧹 | feature disabled, styles left | remove the unused PTR CSS (and the no-op call) **or** finish the feature; decide one | Low |
| 7 | **`.replit` file** + Replit assumptions | 🧹 | legacy tooling, no longer used | delete `.replit` (handled in this docs pass) | Low |
| 8 | **No `prefers-reduced-motion`** (`styles.css`) | ✨/a11y | not yet added | add one reduced-motion block (see [ANIMATION_BIBLE §7](./ANIMATION_BIBLE.md#7-accessibility--reduced-motion)) | Medium |
| 9 | **Album swipe handlers re-attached** per open (`memories.js:670`) | 🐛(minor) | re-setup on each `viewAlbum` | confirm old handlers removed via stored refs before re-adding | Low |
| 10 | **Missing `aria-label`s** on icon/emoji buttons; zoom disabled (`user-scalable=no`) | ✨/a11y | app-like choices | add labels; reconsider allowing zoom | Low–Medium |
| 11 | **Full-container `innerHTML` re-renders** (`renderAllExpenses`, `renderMemoriesTimeline`, milestones) | 🎯 | simplest correct approach | leave as-is; only diff if a list ever grows large | Low |
| 12 | **Dangling soft links** — a moment can reference a deleted expense/memory id | 🎯 | no referential integrity | lookups already skip missing ids; optionally prune on delete | Low |
| 13 | **`secret_notes`/`moods` use inline collection refs** while others use cached refs (`firebase.js`) | 🧹 | inconsistency | add `secretNotesCollection`/`moodsCollection` refs for consistency | Low |

---

## Notes on the "watch, don't fix" items
Items 11 and 12 are marked 🎯 intentional. For a two-user app they are the *right* level of
simplicity. Don't "fix" them speculatively — that would add complexity against the ethos
([PROJECT_BIBLE §1](./PROJECT_BIBLE.md#1-the-ethos)). Revisit only if real symptoms appear.

---

## Disproved hypotheses (do not re-report)
These were suspected in an earlier exploratory pass and **checked against the current code — they
are false**:

- ❌ "`invalidateBalanceCache` is undefined." — It **is** defined at `expenses.js:555` and called
  from `loadExpenses`.
- ❌ "`.shake` class has no CSS." — The `shake` keyframe and `.pin-dots.shake` rule **exist**
  (`styles.css:4344-4350`).
- ❌ "Pull-to-refresh competes with scrolling." — PTR is **disabled** (no-op); it can't interfere.
- ❌ "Global `touchend` listener is a leak." — It's a passive resilience listener that clears stray
  scroll locks; harmless and intentional (`animations.js:219`).
- ❌ "Memory leak from music init double-binding." — Init is deferred once via
  `requestIdleCallback`; not re-invoked on tab switches.

(If the code changes substantially, re-verify before trusting this list.)

---

### Related documents
[CODE_AUDIT_REPORT](./CODE_AUDIT_REPORT.md) · [SECURITY_REVIEW](./SECURITY_REVIEW.md) · [ROADMAP](./ROADMAP.md) · [KNOWN_LIMITATIONS](./KNOWN_LIMITATIONS.md)
