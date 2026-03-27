# Usual Us

A private, cinematic Progressive Web App (PWA) designed as a "couple dashboard." It provides a shared space to track joint expenses, save memories, manage a shared playlist, track moods, and note down "little things."

## Tech Stack

- **Frontend:** Vanilla JavaScript (ES Modules), HTML5, CSS3
- **Build Tool:** Vite
- **Database:** Firebase (Firestore)
- **Animation:** GSAP, Lenis (smooth scroll), Hammer.js (touch gestures)
- **Package Manager:** npm

## Project Structure

```
.
├── index.html          # Main entry point
├── styles.css          # Global styles
├── firebase.js         # Firebase config/initialization
├── vite.config.js      # Vite build config
├── service-worker.js   # PWA offline support
├── manifest.json       # PWA metadata
├── js/                 # App logic (modular)
│   ├── app.js          # Main entry, splash screen, init
│   ├── config.js       # User settings (names, PINs, dates)
│   ├── auth.js         # PIN-based login
│   ├── expenses.js     # Expense tracking
│   ├── budget.js       # Monthly budget calculations
│   ├── memories.js     # Photo/memory timeline
│   ├── moments.js      # Calendar/events
│   ├── mood.js         # Mood tracker
│   ├── notes.js        # Sticky notes
│   ├── music.js        # Audio player
│   ├── stats.js        # Financial analytics
│   ├── ui.js           # UI helpers
│   └── sounds.js       # Sound effects
├── icons/              # SVG icons
├── lib/                # Local 3rd-party libraries (GSAP, Hammer, Lenis)
└── sounds/             # MP3 sound effects
```

## Development

- **Run dev server:** `npm run dev` (starts on port 5000)
- **Build for production:** `npm run build`
- **Lint:** `npm run lint`

## Configuration

Customize user settings in `js/config.js`:
- Partner names
- PIN codes
- Relationship start date
- Shared playlist

Firebase credentials are in `firebase.js`.

## Deployment

Configured as a static site deployment. Build command: `npm run build`, public directory: `dist`.
