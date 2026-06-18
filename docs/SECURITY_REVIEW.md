# SECURITY REVIEW

> Honest security assessment for a **private, two-user** app. Risks are real and stated plainly,
> but recommendations are scoped to a one-developer, two-person threat model — **the simplest fix
> that fits**, never enterprise hardening for its own sake (see [PROJECT_BIBLE §1](./PROJECT_BIBLE.md#1-the-ethos)).

Related: [FIREBASE_BIBLE](./FIREBASE_BIBLE.md) · [MEDIA_SYSTEM](./MEDIA_SYSTEM.md) · [KNOWN_LIMITATIONS](./KNOWN_LIMITATIONS.md)

**Threat model:** two trusted users who own the data; a public URL anyone could load; no
sensitive third parties. The real risks are therefore (1) exposed credentials that let an outsider
abuse *our* paid services or data, and (2) an open database. Inter-user attacks are out of scope.

---

## Findings (ranked)

### 🔴 Critical — Cloudinary API secret hardcoded in client code
- **What:** `CLOUDINARY_API_SECRET` (and `API_KEY`) are in `js/config.js:9-10`, shipped to every
  visitor, and used to SHA-1-sign **delete** requests in the browser (`generateCloudinarySignature`,
  `js/memories.js:225`).
- **Root cause:** signed deletion was implemented entirely client-side for convenience.
- **Impact:** anyone who views source can sign Cloudinary admin (delete) calls against the account
  — they could delete the couple's media. Uploads use the *unsigned* preset, so only deletion needs
  the secret.
- **Simplest fix (fits the app):**
  1. **Rotate the secret immediately** in the Cloudinary console (it is currently public in git history).
  2. Remove the secret from the client. Move deletion behind a tiny **Vercel serverless function**
     (`/api/delete-media`) that holds the secret as an environment variable and signs server-side.
     This is one small file — not an architecture change — and Vercel already hosts the app.
  3. Keep unsigned uploads as-is (preset can be locked to the folder).
- **Priority:** Critical. Tracked in [ROADMAP](./ROADMAP.md) and [CODE_AUDIT_REPORT](./CODE_AUDIT_REPORT.md).

### 🟠 High — Firestore security rules not in the repo / unknown
- **What:** there's **no Firebase Auth**; access control depends entirely on Firestore rules set in
  the console, which are not version-controlled here.
- **Root cause:** rules were configured out-of-band.
- **Impact:** if the rules are permissive (e.g. left in test mode), the public Firebase config in
  `firebase.js` lets anyone read/write the couple's data. If they're locked down, fine — but we
  can't verify from the repo.
- **Simplest fix:** export the live rules to `firestore.rules` in the repo and review them. For a
  two-user app a pragmatic posture is a rules check on a shared secret/known doc, or — if more is
  wanted later — adopt Firebase Anonymous/email Auth and gate by `request.auth`. Don't over-build;
  just make access **deny-by-default** and version it.
- **Priority:** High.

### 🟡 Medium — PINs and user identity are client-side
- **What:** `USERS` with plaintext PINs live in `js/config.js:13-16`; "login" is a local string
  compare (`auth.js:24`).
- **Root cause:** intentional simplicity for two people.
- **Impact:** the PIN is not a real security boundary — it's a "which of us is it" selector. Anyone
  with the URL who reads source sees the PINs.
- **Assessment:** **intentional design**, acceptable *if* Firestore rules are the real gate (see
  above). The PIN's job is personalisation, not protection.
- **Simplest improvement (optional):** if the public URL ever feels too exposed, put the whole site
  behind Vercel password protection or move auth to Firebase Auth. Not required for the current model.

### 🟡 Medium — Memory captions not HTML-escaped (stored XSS surface)
- **What:** `escapeHTML()` (`state.js:80`) is applied in `expenses.js`, `notes.js`, `moments.js`
  (verified, 12 call sites) but **not in `memories.js`** when rendering captions into `innerHTML`.
- **Root cause:** an inconsistency — the helper exists but wasn't used for captions.
- **Impact:** a caption containing HTML/script would be injected into the DOM. Because only the two
  trusted users can write captions, real-world risk is low — but it's a genuine gap and a trivial fix.
- **Simplest fix:** wrap caption output in `escapeHTML()` in `renderMemoriesTimeline` /
  viewer rendering, matching the other modules. Low effort.
- **Priority:** Medium (low likelihood, easy fix). Tracked in [TECHNICAL_DEBT](./TECHNICAL_DEBT.md).

### 🟢 Low — Secret-note unlock is client-side only
- **What:** secret notes "unlock" by comparing `unlockDate` to now in the browser (`notes.js`).
- **Impact:** the locked content is still sent to the client (and stored in Firestore in plaintext);
  a determined user could read it early via DevTools/DB.
- **Assessment:** acceptable for a romantic surprise between two people — it's a delightful UX
  convention, not a vault. Document it as such; don't add server-side gating unless the surprise
  actually matters enough to warrant it.

### 🟢 Low — Inline event handlers (`ontouch*`) in notes
- **What:** sticky notes use inline `ontouchstart/end/move` (`notes.js:78-80`) → exposes
  `handleNoteTouch*` on `window`.
- **Impact:** not an injection risk (no user data in the handler beyond the note id, which is a
  Firestore auto-id), but a CSP-unfriendly pattern and a minor smell. See [TECHNICAL_DEBT](./TECHNICAL_DEBT.md).

---

## What's already fine
- **Firebase web config public:** normal and not a secret (security is rules-based).
- **Security headers:** `vercel.json` sets `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`.
- **Unsigned Cloudinary uploads:** correct approach for client uploads.
- **`escapeHTML` exists and is used** in the text-heavy modules.

## Recommended order of action
1. Rotate the Cloudinary secret (now).
2. Move media deletion to a Vercel function; remove the secret from the client.
3. Export + harden + version `firestore.rules` (deny-by-default).
4. Escape memory captions.
5. (Optional) site-level password or Firebase Auth if the public URL ever feels too open.

---

### Related documents
[FIREBASE_BIBLE](./FIREBASE_BIBLE.md) · [MEDIA_SYSTEM](./MEDIA_SYSTEM.md) · [TECHNICAL_DEBT](./TECHNICAL_DEBT.md) · [ROADMAP](./ROADMAP.md)
