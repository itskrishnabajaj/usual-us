# DESIGN SYSTEM

> The visual language of `usual us`: tokens, themes, type, and component styling.
> All values are from `styles.css` (and `index.html` inline sizes); line numbers cited.

Related: [COMPONENT_LIBRARY](./COMPONENT_LIBRARY.md) · [ANIMATION_BIBLE](./ANIMATION_BIBLE.md) · [UI_UX_BIBLE](./UI_UX_BIBLE.md)

---

## 1. Design tokens (`:root`, `styles.css:6-28`)

```css
--bg-primary:#0a0a0a; --bg-secondary:#1a1a1a; --bg-tertiary:#2a2a2a;
--text-primary:#ffffff; --text-secondary:#a0a0a0; --text-tertiary:#707070;
--accent:#ffc6d9; --accent-soft:#ffb3cc; --accent-hover:#ffd9e6;
--success:#4ade80; --warning:#fbbf24; --error:#ef4444;
--border-color:rgba(255,255,255,0.1);
--shadow-sm:0 2px 8px rgba(0,0,0,.3); --shadow-md:0 4px 16px rgba(0,0,0,.4); --shadow-lg:0 8px 32px rgba(0,0,0,.5);
--ease:cubic-bezier(0.4,0,0.2,1); --ease-bounce:cubic-bezier(0.34,1.56,0.64,1);
--transition-fast:0.15s var(--ease); --transition-normal:0.3s var(--ease); --transition-slow:0.5s var(--ease);
```

These are the **only** global tokens. Everything else is literal values, so when extending,
prefer reusing a token; introduce a new `--var` only if it will be reused.

---

## 2. Themes

The app has **three coordinated themes**, an intentional emotional contrast (utility vs. intimacy).

### 2a. Default dark theme (financial tabs)
Near-black backgrounds (`--bg-*`), white/grey text, light-pink accent. Calm and utilitarian.

### 2b. Us-tab light theme (`styles.css:1736-1742`, applied via `.us-tab`)
A warm, "breathing" light world — scoped CSS variables override the dark ones inside the Us tab:
```css
--us-text:#3a2e2e; --us-text-secondary:#6b5b5b; --us-text-muted:#8b7b7b;
--us-card-bg:rgba(255,255,255,0.55); --us-card-border:rgba(194,24,91,0.15);
--us-accent:#c2185b; --us-tab-bg:#fdf2f0;
```
Background is an animated pastel gradient (beige→pink→cream, `styles.css:1727`, see
[ANIMATION_BIBLE](./ANIMATION_BIBLE.md#us-tab) `usBreathingGradient`).

### 2c. Late-night mode (`styles.css:2922-2931`, `.us-tab.late-night`)
After 23:00 (or before 06:00) the Us tab inverts to a deep-indigo night theme with
purple/blue title gradient — toggled by `isLateNight()` (`js/state.js:74`) in
`initializeUsTab()`:
```css
--us-text:#fff; --us-tab-bg:#0f0f1e; --us-card-bg:rgba(26,26,26,0.8);
--us-card-border:rgba(255,255,255,0.1); --us-accent:#ffc6d9;
```
Title gradient becomes `#a78bfa → #60a5fa` (`styles.css:2946`).

---

## 3. Colour palette (roles)

| Role | Value(s) |
|------|----------|
| Backgrounds (dark) | `#0a0a0a`, `#1a1a1a`, `#2a2a2a` |
| Text (dark) | `#ffffff`, `#a0a0a0`, `#707070` |
| Accent pinks | `#ffc6d9` (primary), `#ffb3cc` (soft), `#ffd9e6` (hover), `#c2185b` (Us deep), `#e91e63` (hot pink in gradients) |
| Status | `#4ade80` success, `#fbbf24` warning, `#ef4444` error |
| Us light theme | bg `#fdf2f0`/pastels, text browns `#3a2e2e`/`#6b5b5b`/`#8b7b7b` |
| Late-night | bg `#0f0f1e`/`#1a1a2e`, accents `#a78bfa`/`#60a5fa` |
| Borders/overlays | `rgba(255,255,255,0.05–0.15)`, `rgba(194,24,91,0.05–0.25)` |

---

## 4. Typography (`index.html:14-16` imports)

| Family | Role | Examples |
|--------|------|----------|
| **Playfair Display** (serif, often italic) | Emotional headings | Splash title 30px/600 (`:340`), login title 38px italic (`:632`), Us title 64px italic (`:2181`), ritual quote 20px italic (`:2302`) |
| **Homemade Apple** (handwriting) | Captions / dates | Polaroid caption 13px (`:2656`), polaroid date 11px (`:2650`), viewer caption 15px (`:2529`) |
| **Inter** (sans, 300–700) | All functional UI | Body 1.6 line-height (`:543-546`), balance 48px/700 (`:1470`), buttons 16px/600, labels 14px/500 |

Letter-spacing is used for atmosphere on the splash (subtitle 4px `:328`, skip hint 1.5px `:400`).

---

## 5. Spacing, radius, elevation

- **Spacing rhythm:** 4 / 8 / 10–12 / 14–16 / 20 / 24–28 / 32–36 px. Card padding ~20px;
  modal content `28px 24px` (`:3050`, tablet `36px 32px`).
- **Border-radius:** 4px polaroids (vintage) · 8–12px inputs/small buttons · 14–16px primary
  buttons/mood buttons · 16–20px cards · 20–24px modals/login · 32px music panel (`:1868`) ·
  50% circular (nav indicators, mood buttons, hearts).
- **Elevation:** `--shadow-sm/md/lg`; bespoke deeper shadows for polaroids (`:2568`), the music
  panel (multi-layer glass `:1871-1875`) and the login container (`:623`).

---

## 6. Glassmorphism & gradients

- **Backdrop blur:** light 4–6px (music backdrop, image-adjust); medium 8–12px (cards, modal
  backdrop, toasts); heavy 20–40px + `saturate(180%)` (login container, music panel `:1866`,
  bottom nav `:2776`).
- **Signature gradients:** primary button `linear-gradient(135deg,var(--accent),var(--accent-soft))`;
  Us breathing gradient (`:1727`); balance card (`:1453`); budget progress fill pink→soft, and
  warning amber→red at ≥80% (`:1400/:1409`); text gradients with `background-clip:text` for the
  balance amount, login name, and Us title (animated shimmer). Splash uses radial gradients
  (`:57`, `:168`, `:201`). Full list captured during audit; extend by reusing these patterns.

---

## 7. Component styling (summary; see [COMPONENT_LIBRARY](./COMPONENT_LIBRARY.md))

| Component | Key rules |
|-----------|-----------|
| Primary button | pink gradient, dark text, radius 14px, `:active{scale(.98)}`, pink glow shadow |
| Secondary button | `--bg-secondary` + border, radius 12px, `:active` → tertiary |
| Card (ritual/budget/balance) | translucent or gradient bg, radius 16–20px, soft shadow, `:active{scale(.975)}` |
| Polaroid | white, radius 4px, 68px caption space, stable random tilt, press scale .965 |
| Input | `--bg-secondary`, border, radius 12px, 16px font; focus → accent border + 3px pink ring |
| Num-keypad key | 76×52px, radius 16px, faint white bg, `:active{scale(.9)}` |
| Bottom nav | fixed, blur+saturate, safe-area bottom padding, 3px active bar via `::before` |
| Toast | fixed bottom-centre, blur, green/red bg, slides up on `.show` |
| Modal | fixed overlay `rgba(0,0,0,.85)` + blur, centred content radius 20px, slide/scale in |

---

## 8. Mobile, safe-area & responsive

- Content column `max-width:600px`, padding 20px (`:935-936`), 32px on tablet.
- Bottom nav respects the notch: `padding-bottom: calc(8px + env(safe-area-inset-bottom))` (`:3781`).
- Viewport locked against zoom: `user-scalable=no, maximum-scale=1` (`index.html:5`) — intentional
  for an app-like feel (noted as an a11y trade-off in [KNOWN_LIMITATIONS](./KNOWN_LIMITATIONS.md)).
- Breakpoints: `@media (max-width:480px)` (`:3930`) shrinks titles/amounts/polaroids;
  `@media (min-width:768px)` (`:3969`) increases padding and timeline gap.

---

## 9. Iconography

- Category & mood icons are SVG `<img>` defined as HTML strings in `js/config.js:65-82`
  (`categoryEmojis`, `moodEmojis`), sized by `.icon-category` (24–30px) and `.icon-mood`
  (20–36px). Tab icons in `icons/tabs/` sized by `.icon-tab` (28px). The who-pays indicator
  (`him.svg`/`her.svg`/`allsettled.svg`) renders at 130px (`.icon-whopays`).
- All `icons/` SVGs were optimised (embedded rasters downscaled) — see [CHANGELOG](./CHANGELOG.md);
  keep them lightweight when adding new ones (`npm run optimize:svg`).

---

### Related documents
[COMPONENT_LIBRARY](./COMPONENT_LIBRARY.md) · [ANIMATION_BIBLE](./ANIMATION_BIBLE.md) · [UI_UX_BIBLE](./UI_UX_BIBLE.md)
