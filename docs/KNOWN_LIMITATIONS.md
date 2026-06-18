# KNOWN LIMITATIONS

> Current limitations of `usual us`, each with **why it exists**, **impact**, a **possible
> solution**, and a **priority**. Many are deliberate trade-offs that fit a private two-user app —
> they are limitations, not mistakes.

Related: [TECHNICAL_DEBT](./TECHNICAL_DEBT.md) · [SECURITY_REVIEW](./SECURITY_REVIEW.md) · [ROADMAP](./ROADMAP.md)

| # | Limitation | Why it exists | Impact | Possible solution | Priority |
|---|-----------|---------------|--------|-------------------|----------|
| 1 | **No real-time updates** — partner's changes appear on next load, not live | No `onSnapshot`; explicit `load*()` after writes (simpler) | Minor lag in seeing each other's edits | Swap `load*()` for `onSnapshot` per collection (keep render fns) | Medium |
| 2 | **No Firebase Auth; PINs are client-side** | Intentional for two trusted people | PIN isn't a real boundary; data safety relies on Firestore rules | Harden rules; optional site password / Firebase Auth | High (rules) |
| 3 | **Cloudinary secret on client** | Client-side signed delete | Outsider could delete media | Server-side delete via Vercel function ([SECURITY_REVIEW](./SECURITY_REVIEW.md)) | Critical |
| 4 | **Media not available offline** | Cloudinary requests bypass the SW (so seeking works) | Unseen photos/videos won't load offline | Optional small thumbnail cache (carefully) | Low |
| 5 | **No `prefers-reduced-motion`** | Not yet added | Motion-sensitive users get full animation | One CSS block (shorten/disable, maybe keep splash) | Medium |
| 6 | **Zoom disabled** (`user-scalable=no`) | App-like feel | Hurts low-vision users | Allow zoom or provide a text-size option | Low–Medium |
| 7 | **Video length capped at 20s** | Keep memories light, fast, cheap | Long clips can't be saved as one memory | Raise/segment limit if desired | Low |
| 8 | **Two fixed users, hardcoded** | This is a private app for two people | Can't add users without code change | None — this is the whole point | N/A (intentional) |
| 9 | **Soft links can dangle** | No referential integrity | A moment may reference a deleted expense/memory | Lookups skip missing ids; optional prune-on-delete | Low |
| 10 | **Lenis smooth-scroll desktop-only** | Phones use native momentum scrolling | Desktop/phone scroll feel differs | Intentional; leave as-is | N/A (intentional) |
| 11 | **Dead PTR CSS** | Feature disabled, styles left behind | None (just unused bytes) | Remove or finish PTR | Low |
| 12 | **Single global stylesheet (~5,400 lines)** | Vanilla, no CSS tooling | Large file to navigate | Fine for one dev; could split by section if it grows | Low |

---

## Reading these honestly
- Items **8** and **10** (and largely **2**'s PIN aspect) are **intentional design**, not debt —
  they exist *because* this is a two-person private space. Don't "solve" them.
- The genuinely worth-doing ones are **3 (Critical)**, **2-rules (High)**, and **5 (Medium)** —
  see [ROADMAP](./ROADMAP.md) for sequencing.

---

### Related documents
[TECHNICAL_DEBT](./TECHNICAL_DEBT.md) · [SECURITY_REVIEW](./SECURITY_REVIEW.md) · [ROADMAP](./ROADMAP.md) · [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md)
