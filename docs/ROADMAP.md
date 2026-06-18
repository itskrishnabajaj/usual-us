# ROADMAP

> A realistic, single-developer roadmap grounded in [CODE_AUDIT_REPORT](./CODE_AUDIT_REPORT.md),
> [SECURITY_REVIEW](./SECURITY_REVIEW.md) and [KNOWN_LIMITATIONS](./KNOWN_LIMITATIONS.md). Ordered
> by priority, not ambition. The guiding question is always: *does this make the shared experience
> warmer, calmer, or more reliable for the two of us?* If not, it doesn't belong here.

Related: [CODE_AUDIT_REPORT](./CODE_AUDIT_REPORT.md) · [KNOWN_LIMITATIONS](./KNOWN_LIMITATIONS.md) · [PROJECT_BIBLE](./PROJECT_BIBLE.md)

---

## 🔴 Critical (do soon — protects the couple's data/account)
- **Move Cloudinary deletion server-side** and **rotate the exposed secret.** A single Vercel
  serverless function holding the secret as an env var; remove it from `js/config.js`.
  (Audit A1 / [SECURITY_REVIEW](./SECURITY_REVIEW.md).)
- **Version and harden Firestore rules.** Export `firestore.rules`, make access deny-by-default,
  commit it. (Audit A2.)

## 🟠 High
- **Decide the access model.** Either keep the public URL with strict Firestore rules, or add a
  light gate (Vercel password / Firebase Auth). Keep it proportional — this is for two people.
- **Escape memory captions** (`escapeHTML`) to close the small stored-XSS gap. (Audit A3.)

## 🟡 Medium
- **Add `prefers-reduced-motion`** support (calm or shorten animations; maybe keep the splash).
  Accessibility + respect for motion sensitivity. (Audit A5.)
- **Consolidate the duplicate preview-build logic** in `memories.js`. (Audit A4.)
- **(Optional) Real-time sync** via `onSnapshot` so each person sees the other's changes live —
  *only* if the lag actually bothers you; it adds complexity. (Limitation #1.)

## 🟢 Low (cleanups & small delights)
- Remove dead pull-to-refresh CSS (or finish the feature). (Audit A8.)
- Replace inline `ontouch*` note handlers with JS-bound listeners. (Audit A7.)
- Verify album-swipe handlers don't accumulate. (Audit A6.)
- Add `aria-label`s to icon buttons; reconsider disabling zoom. (Audit A10.)
- Add cached `secretNotesCollection`/`moodsCollection` refs for consistency. (Audit A13.)

## 💭 Future ideas (only if they serve the feeling)
- A gentle "on this day" surfacing improvement (the memory-highlight system already exists).
- Optional small offline thumbnail cache for recently-viewed memories (without breaking video seeking).
- Export/backup of memories & notes (a private keepsake archive).
- Per-person theme accents, or seasonal Us-tab moods.
- A re-wrapped native app (TWA) **only** if an installable home-screen icon ever stops being enough.

## 🌅 Long-term vision
Keep `usual us` a **calm, durable, personal home** — not a growing product. Success is that, years
from now, it still opens instantly, still feels warm, and is still simple enough for one person to
maintain. Prefer deleting complexity over adding features. Every addition should make the space
feel more *theirs*, never busier.

---

### Related documents
[CODE_AUDIT_REPORT](./CODE_AUDIT_REPORT.md) · [SECURITY_REVIEW](./SECURITY_REVIEW.md) · [KNOWN_LIMITATIONS](./KNOWN_LIMITATIONS.md) · [CHANGELOG](./CHANGELOG.md)
