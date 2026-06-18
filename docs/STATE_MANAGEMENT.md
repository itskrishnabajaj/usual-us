# STATE MANAGEMENT

> How data lives and moves in `usual us`. Deliberately simple: global variables, one EventBus,
> Firestore as the source of truth, and a little browser storage. No state library — and none is
> wanted (see [PROJECT_BIBLE §6](./PROJECT_BIBLE.md#6-technical-philosophy)).

Related: [REPOSITORY_ARCHITECTURE](./REPOSITORY_ARCHITECTURE.md) · [FIREBASE_BIBLE](./FIREBASE_BIBLE.md) · [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md)

---

## 1. The four layers

```mermaid
flowchart TD
    FS[(Firestore — source of truth)] -->|load*()| MEM[Global arrays in state.js]
    MEM -->|render*()| DOM[DOM]
    DOM -->|user action / submit| W[write to Firestore]
    W --> FS
    W -->|then| MEM
    LS[(localStorage / sessionStorage)] <--> MEM
```

1. **Firestore** — canonical data ([FIREBASE_BIBLE](./FIREBASE_BIBLE.md)).
2. **Global in-memory state** — `js/state.js` arrays/vars, the working copy the UI renders from.
3. **DOM** — rendered output.
4. **Browser storage** — small convenience/persistence (login, today's mood, recently played, Us reveal).

The cycle is always **load → store → render**, and **write → reload** after mutations.

---

## 2. Global state (`js/state.js:5-34`)

| Variable | Meaning |
|----------|---------|
| `currentUser` | logged-in user id (`imsusu`/`imgugu`) |
| `currentUserProfile` | `{ uid, name, role }` (`role`: `krishna`/`rashi`) |
| `expenses`, `memories`, `notes`, `secretNotes`, `moments` | loaded collection arrays *(moments array lives in `moments.js`)* |
| `budget` | current monthly budget object or `null` |
| `currentMood` | today's mood for the current user |
| `selectedPhotos` | `File[]` staged for a memory upload |
| `balanceBeforeAction` | balance snapshot to detect the ₹0 celebration |
| `currentAlbumIndex`, `currentViewingMemoryId` | album/photo viewer state |
| `musicPlayer`, `musicWasPlaying`, `currentSongIdx`, `recentlyPlayed`, `musicDelayTimer`, `musicFadeInterval` | music player state |
| `longPressTimer`, `longPressNoteTimer`, `currentNoteLongPress` | touch long-press timers |
| `isSubmitting` | duplicate-submit guard |
| `isPullingToRefresh` | always `false` (PTR disabled) |
| `expenseFilters` | `{ search, paidBy, month }` for history filtering |

**Why globals?** Files are `<script>`-loaded into one namespace (no bundler). Globals are the
intended, simplest interface for a one-developer app. Treat them as shared module state, not a
free-for-all: mutate through the owning module's functions.

### Helper functions (`js/state.js:41-96`)
| Helper | Purpose |
|--------|---------|
| `getExpenseDate(expense)` | effective date (prefers `expenseDate` over `createdAt`; handles Firestore Timestamp) |
| `getPartnerRole()` / `getPartnerName()` | the *other* person |
| `getDaysTogether()` | days since `RELATIONSHIP_START` |
| `getDailyQuote()` | today's quote, `(day-1) % DAILY_QUOTES.length` |
| `isLateNight()` | hour ≥ 23 or < 6 (drives late-night theme) |
| `escapeHTML(str)` | escape user content before `innerHTML` |
| `debounce(fn, wait)` | used for the 200ms search debounce |

Reuse these instead of reimplementing.

---

## 3. The EventBus

`EventBus` (`js/event-bus.js:8-86`) is a tiny synchronous pub/sub: `on/once/off/emit/clear`.
Listeners run in registration order, are error-isolated (a throwing listener won't break others),
and `on/once` return an unsubscribe function. It is the **only** decoupling abstraction in the app.

### Event catalog {#event-catalog}

| Event | Emitted by | Listened by | Payload |
|-------|-----------|-------------|---------|
| `expenses:loaded` | `expenses.js` (after load) | `stats.js`, `budget.js` | — |
| `expense:created` | `expenses.js` | `sounds.js` | `{id}` |
| `expense:edited` | `expenses.js` | `sounds.js` | `{id}` |
| `expense:deleted` | `expenses.js` | `sounds.js` | `{id}` |
| `expense:settled` | `expenses.js` | `sounds.js` | — |
| `memory:created` | `memories.js` | `sounds.js` | — |
| `memory:viewed` | `memories.js` | `sounds.js` | `{id}` |
| `memory:deleted` | `memories.js` | — | `{id}` |
| `moment:created` | `moments.js` | `sounds.js`, `us-tab.js` (sparkles) | — |
| `tab:switched` | `us-tab.js` (`switchTab`) | `auth.js`, `mood.js`, `stats.js`, `moments.js`, `sounds.js` | `{tab}` |
| `ui:button` | `ui.js` (radio/toggle changes) | `sounds.js` | — |
| `us:refresh` | `us-tab.js` (`refreshUsTab`) | — (reserved) | — |

**Pattern to follow:** when something happens, `emit` a past-tense event; let interested modules
react. Don't reach across modules with direct calls when an event already exists.

---

## 4. Browser storage

| Key | Where | Set by | Purpose |
|-----|-------|--------|---------|
| `usual_us_user_id` | localStorage | `auth.js` | remember which person is logged in |
| `usual_us_mood` | localStorage | `mood.js` | `{mood, date}` — today's mood for instant display |
| `recentlyPlayed` | localStorage | `music.js` | last song indices (max 3) |
| Us-tab "revealed" | sessionStorage | `us-tab.js` | keep the Us tab visible after first reveal |

localStorage holds **convenience/session data only** — never the source of truth. Mood and
recently-played also persist to Firestore where relevant.

---

## 5. Firestore sync & offline

- **Load model:** explicit `load*()` per collection on login (`loadData` → critical expenses/
  budget; `loadDeferredModules` → the rest via `requestIdleCallback`).
- **Write model:** write to Firestore, then re-run the relevant `load*()` to refresh array + DOM.
  There are **no real-time `onSnapshot` listeners** — updates from the other person appear on the
  next load/refresh, not live. This is intentional simplicity (see [KNOWN_LIMITATIONS](./KNOWN_LIMITATIONS.md)).
- **Offline:** `enablePersistence({ synchronizeTabs: true })` (`firebase.js:27`) caches reads and
  queues writes; multi-tab/unsupported-browser cases are caught and warned, not fatal.

## 6. State restoration & session persistence
- On launch the app shows the splash, then login. If `usual_us_user_id` exists, the returning-user
  form is shown pre-filled with the name; the user still enters the PIN (no auto-login without PIN).
- The Us-tab reveal survives within a session (sessionStorage) but resets on a fresh session —
  the "discovery" can happen again, which is acceptable.
- Today's mood is restored instantly from localStorage, then reconciled with Firestore.

## 7. Conflict resolution
With two users and no live listeners, conflicts are rare and handled pragmatically:
- **Last write wins** at the document level (Firestore default); each domain reloads after its own
  writes.
- **Moods** use `{merge:true}` on a per-day doc keyed by date, with separate `krishna`/`rashi`
  fields, so the two people never overwrite each other's mood.
- **Expenses/memories/notes/moments** are append-mostly; simultaneous edits to the *same* document
  are extremely unlikely for two people and are not specially handled (intentional — not worth the
  complexity for this app).

---

### Related documents
[FIREBASE_BIBLE](./FIREBASE_BIBLE.md) · [REPOSITORY_ARCHITECTURE](./REPOSITORY_ARCHITECTURE.md) · [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md)
