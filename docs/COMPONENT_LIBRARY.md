# COMPONENT LIBRARY

> The reusable UI patterns of `usual us`. There is no component framework — "components" are
> CSS classes plus the HTML/JS conventions that produce them. This doc is how you reuse them
> correctly instead of inventing parallel ones.

Related: [DESIGN_SYSTEM](./DESIGN_SYSTEM.md) · [UI_UX_BIBLE](./UI_UX_BIBLE.md) · [ANIMATION_BIBLE](./ANIMATION_BIBLE.md)

> **How to read "Props":** these are vanilla patterns, so "props" means the HTML
> attributes/structure and the JS state that drive each component.

---

## Buttons

### `.btn-primary`
- **Purpose:** the single most important action on a surface (login, add expense, settle, set budget).
- **Structure:** `<button class="btn-primary">Label</button>`.
- **Styling:** pink gradient, dark text, radius 14px, pink glow shadow; `:active{scale(.98)}`.
- **Events:** plain `click`; emit `ui:button` if it's a toggle/option (for the click sound).
- **Mistakes:** don't place two primary buttons in one view; pair with `.btn-secondary` for cancel.

### `.btn-secondary`, `.btn-small` (`.btn-small.edit` / `.delete`)
- Secondary/cancel actions and inline row actions (edit/delete on expense rows).
- `:active{scale(.98)}`. Delete variants are red; confirm before destructive use.

### `.num-key` (numeric keypad)
- **Purpose:** PIN entry for the returning-user login (`index.html:87-100`).
- **Structure:** twelve `<button class="num-key" data-num="…">`; one switch-user, one delete.
- **Behaviour:** `js/ui.js:136-165` fills `.pin-dot`s, auto-submits at 4 digits, shakes on error.
- **Mistakes:** keep keys ≥44px touch targets; don't add haptics that fight the calm feel.

---

## Cards

### `.balance-card`
- Home-tab hero showing balance + who-owes-whom; gradient bg, text-gradient amount, gloss sweep
  (`shimmerCard`). Rendered by `renderBalance()` (`js/expenses.js:334`).

### `.budget-progress-card`
- Monthly budget with progress fill (pink → amber/red ≥80%). Rendered by `showBudgetCard()` /
  `updateBudgetProgress()` (`js/budget.js`). Hidden if no budget set for the month.

### `.ritual-card`
- Us-tab daily quote card; translucent glass, `ritualBreatheIn` entrance, decorative quote marks.

### `.milestone-card`
- Relationship milestones (50/100/…/500 days, 1 year) + quarterly anniversary card; staggered
  `fadeInUp`. Rendered by `renderMilestones()` (`js/us-tab.js:357`), cached by `_lastMilestonesDay`.

**Card rules:** radius 16–20px, soft shadow, `:active{scale(.975)}` for the tactile press; never
animate their width/height.

---

## Polaroid (memory) & photo stack

- **Purpose:** the emotional centrepiece — memories on the Us-tab timeline.
- **Single photo** → `.polaroid`; **multi-photo memory** → a `.photo-stack` (album).
- **Details:** white card, 4px radius, handwriting caption/date, **stable** random tilt derived
  from the memory id (`getStableTilt`, `js/memories.js:375`) so it doesn't jump between renders;
  anniversary memories get a golden border + badge.
- **Media:** rendered via `renderMediaElement()` (`js/memories.js:780`); timeline videos are
  lazy (`preload="metadata"`, played/paused by IntersectionObserver). See [MEDIA_SYSTEM](./MEDIA_SYSTEM.md).
- **Performance:** the whole timeline is rebuilt with `innerHTML` on `renderMemoriesTimeline()`;
  acceptable at two-user data volumes (see [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md)).

---

## Sticky note

- **Purpose:** "little things I noticed" notes on the Us tab.
- **Styling:** pastel background, slight stable rotation (`getStableNoteRotation`, `js/notes.js:206`).
- **Interaction:** **long-press (1s) to delete** via inline `ontouchstart/end/move` handlers
  (`handleNoteTouchStart/End/Move`, `js/notes.js:87-110`, exported to `window`).
- **Mistakes:** these use inline handlers (a known minor smell — see
  [TECHNICAL_DEBT](./TECHNICAL_DEBT.md)); keep new notes consistent rather than mixing patterns.

---

## Mood selector

- Five circular `.mood-option[data-mood]` buttons (happy/love/neutral/sad/sleepy) on the Us tab.
- `setMood()` (`js/mood.js:5`) saves to localStorage + Firestore and bounces the selection
  (`moodBounce`). Partner's mood appears in `#partner-mood-display` when set.

---

## Inputs

- **Text/number/date:** `--bg-secondary` bg, 12px radius, 16px font (prevents iOS zoom); focus →
  accent border + 3px pink ring.
- **Currency (amount hero):** large 36px centred, bottom-border only (`index.html` add-expense form).
- **Radio groups:** paid-by / split-type / category — styled selectable chips with `selectPop`
  on check; emit `ui:button` on change.
- **Validation:** done in the submit handlers (e.g. `handleExpenseSubmit` `js/expenses.js:30`),
  with `showError()` toasts.

---

## Modal shell

- **Pattern:** markup in `index.html`; show by removing `.hidden`, hide by adding it.
- **Open animation:** `animateModalIn(content)`; **backdrop click closes** (`js/ui.js:91`);
  **back button closes** top overlay (`closeTopOverlay`, `js/app.js:146`).
- **To add a modal:** add it to `index.html`, register its id in `MODAL_IDS`
  (`js/app.js:127-138`) so the back button manages it, and wire open/close in
  `setupEventListeners()`.
- **Mistakes:** don't trap focus by skipping the backdrop/back handling; don't `innerHTML`-rebuild
  a modal on every open if a targeted update suffices.

---

## Toasts (`showError` / `showSuccess`, `js/ui.js:20-50`)

- **Purpose:** brief, calm feedback. Error = red (3s), success = green (2s).
- **Behaviour:** appended to `body`, fade in (100ms) → hold → fade out (300ms) → removed.
- **Mistakes:** keep messages short and warm; never stack many toasts.

---

## Bottom navigation

- Five `.nav-item[data-tab]` (`index.html:412-433`); fixed, blur+saturate, safe-area padding.
- Active item shows a 3px accent bar (`::before`) and (for Us) a one-time `heartbeat`.
- The **Us item is hidden until revealed** (first stats visit → `.revealed`, `js/us-tab.js:171`).
- The floating **music toggle** (`#music-player-toggle`) is visible only on the Us tab.

---

## Floating decorations (hearts / stars / sparkles)

- Created programmatically on the Us tab (`createFloatingHearts`, `createUsTabStars`,
  `showMomentCreatedSparkles`). Guarded against duplicate creation; hearts **pause off-tab**.
- **Mistakes:** never create these on a `scroll`/`timeupdate` hot path; create once, animate with
  CSS transform/opacity only.

---

### Related documents
[DESIGN_SYSTEM](./DESIGN_SYSTEM.md) · [UI_UX_BIBLE](./UI_UX_BIBLE.md) · [MEDIA_SYSTEM](./MEDIA_SYSTEM.md) · [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md)
