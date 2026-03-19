# 🛠️ Usual Us — Complete Setup Guide

## Written for someone who has never touched code before

This guide explains **every single step** to set up, run, and update the "Usual Us" app on your Windows PC. Nothing is assumed. Every click, every command, every concept is explained.

Your app is already live at **usual-us.vercel.app**. This guide is for when you want to make changes to it from your computer.

---

## 📋 What's in this guide

| # | Section | What you'll learn |
|---|---------|-------------------|
| 1 | [What is this project?](#1-what-is-this-project) | What files do, how the app works |
| 2 | [What you need to install](#2-what-you-need-to-install) | 3 free programs your PC needs |
| 3 | [Install Node.js](#3-install-nodejs) | The engine behind all dev tools |
| 4 | [Install Git](#4-install-git) | The save system for your files |
| 5 | [Install VS Code](#5-install-vs-code) | The editor where you change code |
| 6 | [Download the project to your PC](#6-download-the-project-to-your-pc) | Getting the files from GitHub |
| 7 | [Install project dependencies](#7-install-project-dependencies) | Downloading the helper tools the app needs |
| 8 | [Run the app on your computer](#8-run-the-app-on-your-computer) | Seeing the app in your browser locally |
| 9 | [How to make changes](#9-how-to-make-changes) | Editing files and seeing results live |
| 10 | [How to push changes to the live site](#10-how-to-push-changes-to-the-live-site) | Uploading your changes so the real app updates |
| 11 | [Understanding the project files](#11-understanding-the-project-files) | What each file and folder does |
| 12 | [How the splash screen works](#12-how-the-splash-screen-works) | The animation that plays when the app opens |
| 13 | [How to change common things](#13-how-to-change-common-things) | Names, colors, timing, icons |
| 14 | [How to check your code for errors](#14-how-to-check-your-code-for-errors) | Finding and fixing mistakes |
| 15 | [How to deploy to Vercel](#15-how-to-deploy-to-vercel) | How the live site gets updated |
| 16 | [How to make an Android app (TWA)](#16-how-to-make-an-android-app-twa) | Turning the website into a phone app |
| 17 | [Quick reference commands](#17-quick-reference-commands) | Copy-paste commands for everyday use |
| 18 | [Troubleshooting](#18-troubleshooting) | Fixing common problems |
| 19 | [Glossary](#19-glossary) | What all the technical words mean |

---

## 1. What is this project?

"Usual Us" is a **private couple dashboard** — an app just for you and your partner. It tracks your expenses together, saves photo memories, plays your shared music playlist, shows mood trackers, milestones, and more.

It is a **website** that works like a phone app. This kind of app is called a **PWA** (Progressive Web App). That means:

- You open it in a browser (Chrome, Safari, etc.)
- On Android, you can "install" it so it appears on your home screen like a regular app
- It works offline (once loaded, it saves itself on your phone)
- It remembers your data using **Firebase** (a free database from Google that stores everything in the cloud)

The app is currently live and working at: **usual-us.vercel.app**

All the code lives on **GitHub** (a website that stores code). When you push changes to GitHub, Vercel automatically picks them up and updates the live site.

---

## 2. What you need to install

Before you can make any changes, you need **3 free programs** on your Windows PC:

| Program | What it does | Think of it as... |
|---------|-------------|-------------------|
| **Node.js** | Runs development tools on your PC | The engine under the hood |
| **Git** | Tracks every change you make, and connects to GitHub | A "save game" system with unlimited undo |
| **VS Code** | Where you view and edit the code files | A very smart notepad |

You only need to install these **once**. After that, you're set forever.

---

## 3. Install Node.js

**What is Node.js?** It's a program that lets your computer run JavaScript tools (like the dev server, the code checker, etc.). You won't use it directly — other tools use it behind the scenes.

### What to do:

1. Open your browser and go to: **https://nodejs.org**
2. You'll see two big green buttons. Click the one that says **"LTS"** (this is the stable version — the other one is experimental, don't use it)
3. A file will download — it will be named something like `node-v22.15.0-x64.msi`
4. Find that file in your Downloads folder and **double-click** it
5. An installer window will open. Just click:
   - **Next**
   - **Next** (accept the license)
   - **Next** (don't change the install location)
   - **Next** (don't change any checkboxes)
   - **Install**
   - **Finish**
6. That's it. Node.js is installed.

### How to verify it worked:

1. Press the **Windows key** on your keyboard (the key with the Windows logo, bottom left)
2. Type **cmd** and press **Enter** — a black window opens (this is called the Command Prompt or Terminal)
3. In that black window, type exactly this and press **Enter**:
   ```
   node --version
   ```
4. You should see a version number like `v22.15.0` — the exact number doesn't matter, as long as something appears
5. Now type this and press **Enter**:
   ```
   npm --version
   ```
6. You should see another number like `10.9.2`

> ✅ **Both commands showed numbers?** Node.js is installed correctly.
> ❌ **It says "not recognized"?** Close the Command Prompt, **restart your PC**, then try again.

---

## 4. Install Git

**What is Git?** It's a tool that tracks every change you make to your files. Think of it like unlimited undo — you can always go back to any previous version. It also lets you upload your changes to GitHub (where the code lives online).

### What to do:

1. Go to: **https://git-scm.com**
2. Click the **"Download for Windows"** button
3. A file will download. Double-click it.
4. An installer with many screens will appear — **just keep clicking "Next" for everything**. Don't change any settings.
5. When you reach the end, click **Install**, then **Finish**

### How to verify it worked:

1. Open the Command Prompt again (Windows key → type **cmd** → Enter)
2. Type:
   ```
   git --version
   ```
3. You should see something like `git version 2.45.1`

> ✅ **You see a version number?** Git is installed.
> ❌ **"Not recognized"?** Restart your PC and try again.

---

## 5. Install VS Code

**What is VS Code?** It's where you'll open and edit the project files. It looks like a text editor, but it's much smarter — it highlights code in colors, shows errors, and has a built-in terminal so you don't need to open the Command Prompt separately.

### What to do:

1. Go to: **https://code.visualstudio.com**
2. Click the big **"Download for Windows"** button
3. Double-click the downloaded file
4. During installation, make sure to **check these boxes** when you see them:
   - ✅ "Add **Open with Code** action to Windows Explorer file context menu"
   - ✅ "Add **Open with Code** action to Windows Explorer directory context menu"
   - ✅ "Add to PATH"
5. Click **Install**, then **Finish**

### Recommended: Install helpful extensions

After opening VS Code for the first time:

1. Look at the left sidebar — there's an icon that looks like **four small squares** (one slightly detached). Click it. This is the Extensions panel.
2. In the search box at the top, search for **ESLint** and click **Install** on the first result
3. Search for **Prettier - Code formatter** and click **Install**
4. These will automatically highlight errors and format your code as you type

---

## 6. Download the project to your PC

**What does this mean?** The project's code lives on GitHub (online). You need to download a copy to your PC so you can edit it. This process is called **"cloning"**.

### What to do:

1. First, create a folder where you want to keep the project. For example:
   - Open **File Explorer** (the folder icon on your taskbar)
   - Go to your **C: drive**
   - Right-click in empty space → **New** → **Folder**
   - Name it **Projects**
   - Now you have `C:\Projects\`

2. Open the **Command Prompt** (Windows key → type **cmd** → Enter)

3. Navigate to your Projects folder by typing:
   ```
   cd C:\Projects
   ```
   and pressing **Enter**

4. Now download the project by typing:
   ```
   git clone https://github.com/itskrishnabajaj/usual-us.git
   ```
   and pressing **Enter**. Wait for it to finish (takes a few seconds).

5. Enter the project folder:
   ```
   cd usual-us
   ```

6. Open it in VS Code:
   ```
   code .
   ```
   (That's the word "code", a space, and a dot. The dot means "open the current folder".)

VS Code will open with all your project files in the left sidebar!

> 💡 **Alternative way:** Open VS Code first, then click **File** in the top menu → **Open Folder** → navigate to `C:\Projects\usual-us` → click **Select Folder**

---

## 7. Install project dependencies

**What are dependencies?** Your project uses helper tools (for animations, for the dev server, for checking code, etc.). These tools aren't in your project folder yet — you need to download them.

Think of it like this: `package.json` is a shopping list, and `npm install` goes to the store and buys everything on that list.

### What to do:

1. In VS Code, open the terminal:
   - Click **Terminal** in the top menu → **New Terminal**
   - OR press **Ctrl + `** (the backtick key — it's above the Tab key, to the left of the number 1)
2. A panel appears at the bottom of VS Code with a blinking cursor
3. Type this and press **Enter**:
   ```
   npm install
   ```
4. Wait. It will download everything. This takes 1–3 minutes the first time.
5. When it finishes, you'll see a message like "added 150 packages" (the exact number varies)

> ✅ **You should see a new folder called `node_modules` in the left sidebar.** This is where all the downloaded tools live. Never edit anything inside it.
>
> ❌ **Error about "npm is not recognized"?** Node.js didn't install properly. Go back to step 3 and reinstall it. Then restart VS Code.

---

## 8. Run the app on your computer

**What does this mean?** You'll start a local web server on your PC. This lets you see the app in your browser, exactly like it looks on the real site — but only on your computer. No one else can see it.

### What to do:

1. In the VS Code terminal (the panel at the bottom), type:
   ```
   npm run dev
   ```
   and press **Enter**

2. After a moment, you'll see something like:
   ```
   VITE v7.x.x  ready in 200 ms

   ➜  Local:   http://localhost:3000/
   ```

3. **Hold down the Ctrl key on your keyboard and click** on `http://localhost:3000/` — your browser will open and you'll see the app!

4. You should see the **splash screen** (a dark screen with a heart emoji that fades in, then the app name), followed by the login screen.

### How to stop the server:

- Go back to the VS Code terminal and press **Ctrl + C** (this stops the server)
- The browser tab will stop working until you run `npm run dev` again

> 💡 The app needs internet to fully work because your data is stored in Firebase (online database). The local server just shows you the interface.

---

## 9. How to make changes

When the dev server is running (`npm run dev`), any file you edit and save will **automatically update in the browser** within a second. You don't need to refresh. This is called "hot reload."

### Try it — change something and see it update:

1. Make sure `npm run dev` is running and the app is open in your browser
2. In VS Code, click on **styles.css** in the left sidebar to open it
3. Near the top (around line 7), find this line:
   ```css
   --bg-primary: #0a0a0a;
   ```
4. Change `#0a0a0a` to `#1a1a2e`
5. Press **Ctrl + S** to save
6. Look at your browser — the background color changed immediately!
7. **Change it back** to `#0a0a0a` and save again (so you don't break anything)

### How saving works:

- **Ctrl + S** — saves the current file
- **Ctrl + K, then S** — saves all open files (press Ctrl+K first, release, then press S)
- The browser updates automatically whenever you save

---

## 10. How to push changes to the live site

When you've made changes you're happy with, you need to **upload them to GitHub**. Vercel watches your GitHub repository, so it will automatically update the live site within about a minute.

### First-time only — tell Git who you are:

The very first time you push changes, Git needs your name and email. In the VS Code terminal:

```
git config --global user.name "Krishna Bajaj"
git config --global user.email "your-email@example.com"
```

Replace with your actual name and GitHub email. You only do this once, ever.

### Every time you want to push changes:

There are 3 commands you run, one at a time. Think of it like:
1. **Pack your bags** (tell Git which files changed)
2. **Label the suitcase** (write a description of what you changed)
3. **Ship it** (upload to GitHub)

Here are the actual commands:

**Step 1 — Pack your bags:**
```
git add .
```
(The dot means "everything that changed")

**Step 2 — Label the suitcase:**
```
git commit -m "what I changed goes here"
```
Replace the text in quotes with a short description of what you changed. Examples:
- `"Fixed button color"`
- `"Updated splash screen names"`
- `"Added new expense category"`

**Step 3 — Ship it:**
```
git push
```

That's it! Within 1-2 minutes, your live site at **usual-us.vercel.app** will update with your changes.

### Example — the full workflow in one go:

```
git add .
git commit -m "Changed the splash screen background color"
git push
```

> 💡 **If `git push` asks for a password:** You need a Personal Access Token from GitHub. Go to github.com → click your profile picture → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token. Copy the token and paste it as your password.

---

## 11. Understanding the project files

Here's what every file and folder in the project does:

### Files you'll edit most often:

| File | What it does |
|------|-------------|
| `index.html` | The main page structure — all the buttons, forms, sections, modals. The skeleton of the app. |
| `styles.css` | All the visual styling — colors, spacing, fonts, animations, layout. How things look. |
| `js/app.js` | The main starting point — splash screen, app initialization, back button handling. |
| `js/config.js` | **Settings you'll change most** — user names, PINs, relationship start date, music playlist, daily quotes. |

### Other JavaScript files (in the `js/` folder):

| File | What it does |
|------|-------------|
| `js/auth.js` | Login/logout — PIN entry, user switching |
| `js/expenses.js` | Adding, editing, deleting expenses |
| `js/budget.js` | Monthly budget tracking |
| `js/memories.js` | Photo/video memories — upload, view, adjust images |
| `js/notes.js` | Shared sticky notes + secret notes |
| `js/mood.js` | Daily mood tracker |
| `js/moments.js` | Planned moments/events calendar |
| `js/music.js` | Music player — playlist, play/pause, fade-in |
| `js/stats.js` | Statistics — pie charts, spending breakdown |
| `js/us-tab.js` | The "Us" tab — milestones, stars, hearts, day counter, tab switching |
| `js/ui.js` | UI helpers — event listeners for all buttons, toasts, loading spinner |
| `js/state.js` | Global variables and helper functions shared across all modules |
| `js/event-bus.js` | Event system — lets modules talk to each other without being tangled |
| `js/sounds.js` | Sound effects when you tap buttons, add expenses, etc. |
| `js/animations.js` | Smooth animation helpers (uses GSAP library) |

### Other important files:

| File/Folder | What it does |
|-------------|-------------|
| `firebase.js` | Connects the app to Firebase (your database). Contains your project keys. |
| `service-worker.js` | Makes the app work offline. Caches files so the app loads fast on repeat visits. |
| `manifest.json` | Tells the phone how to "install" the app — name, icon, colors, orientation. |
| `package.json` | Lists all the tools and libraries the project needs (the "shopping list"). |
| `vite.config.js` | Settings for the dev server (port number, build output folder). |
| `eslint.config.js` | Settings for the code error checker. |
| `.prettierrc` | Settings for the code formatter (tab size, quote style). |
| `icons/` | All the SVG icons — mood faces, expense categories, tab icons, who-pays indicators. |
| `sounds/` | Sound effect MP3 files. |
| `lib/` | Third-party libraries (GSAP, Lenis, Hammer.js) — copied here so they work offline. |
| `icon-192.svg` | App icon (SVG — scales to any size, used for browser tabs and PWA). |
| `icon-512.svg` | App icon (SVG — used for install splash and maskable icon). |

### Files and folders you should **never** edit:

| File/Folder | Why not |
|-------------|---------|
| `node_modules/` | Auto-generated by `npm install`. Will be re-downloaded if deleted. |
| `dist/` | Auto-generated by `npm run build`. This is the production build output. |
| `package-lock.json` | Auto-generated. Tracks exact versions of dependencies. |
| `.git/` | Hidden folder — Git's internal files. Editing this breaks everything. |

---

## 12. How the splash screen works

When the app opens (in a browser or as an installed app), you see a cinematic splash animation for about **2.2 seconds** before the login screen appears.

### What you see, in order:

| Time | What happens |
|------|-------------|
| 0.0 – 0.6s | A dark screen appears with a soft **pinkish gradient glow** fading in |
| 0.3 – 0.9s | A **heart emoji** (💖) appears in the center and scales up with a bounce |
| 0.7 – 1.2s | The **names** ("Krishna & Rashi") fade in below the heart |
| 0.9 – 1.4s | The heart does a gentle **pulse** (grows slightly, then shrinks back) |
| 1.0 – 1.7s | **"usual us"** (the app name) fades in and slides up |
| 1.8 – 2.2s | Everything **dissolves upward** and disappears |
| 2.2s | The **login screen** appears |

### Where the code lives:

- **The splash HTML** is in `index.html`, near the top (around lines 24–29):
  ```html
  <div id="splash-screen" class="splash-screen">
      <div class="splash-bg"></div>
      <div class="splash-glow"></div>
      <div class="splash-heart">💖</div>
      <div class="splash-names">Krishna &amp; Rashi</div>
      <div class="splash-title">usual us</div>
  </div>
  ```

- **The animations** are in `styles.css` (around lines 33–148) — these define how each element fades in, scales up, and slides.

- **The timing control** is in `js/app.js` (lines 8–9):
  ```javascript
  const SPLASH_DISPLAY_MS = 1800;  // Animation plays for 1.8 seconds
  const SPLASH_EXIT_MS    = 400;   // Then fades out over 0.4 seconds
  ```

---

## 13. How to change common things

### Change the names on the splash screen

1. Open `index.html` in VS Code
2. Find this line (around line 28):
   ```html
   <div class="splash-names">Krishna &amp; Rashi</div>
   ```
3. Replace `Krishna &amp; Rashi` with your names
   - **Keep the `&amp;`** — that's how you write the `&` symbol in HTML
   - Example: `Arjun &amp; Priya`
4. Save the file (Ctrl + S)

### Change the user names and PINs for login

1. Open `js/config.js`
2. Find the `USERS` section (around line 13):
   ```javascript
   const USERS = {
       'imsusu': { pin: '2801', name: 'Susu', role: 'krishna' },
       'imgugu': { pin: '0804', name: 'Gugu', role: 'rashi' }
   };
   ```
3. Change the user IDs (`imsusu`, `imgugu`), PINs (`2801`, `0804`), and names (`Susu`, `Gugu`)
4. **Don't change the `role` values** (`krishna`, `rashi`) — the app uses these internally
5. Save the file

### Change the relationship start date

1. Open `js/config.js`
2. Find this line (around line 19):
   ```javascript
   const RELATIONSHIP_START = new Date('2025-01-28');
   ```
3. Change `2025-01-28` to your actual start date (format: `YYYY-MM-DD`)
4. This affects the day counter ("Day X of us") and milestone calculations

### Change the splash screen timing

1. Open `js/app.js`
2. Find the top of the file (lines 8–9):
   ```javascript
   const SPLASH_DISPLAY_MS = 1800;
   const SPLASH_EXIT_MS    = 400;
   ```
3. To make it faster: lower `SPLASH_DISPLAY_MS` (e.g., `1200`)
4. To make it slower: raise it (e.g., `2500`)
5. The total time = `SPLASH_DISPLAY_MS` + `SPLASH_EXIT_MS` (currently 1800 + 400 = 2200ms = 2.2 seconds)

### Change the splash screen colors

1. Open `styles.css`
2. Press **Ctrl + F** (Find) and search for `.splash-bg`
3. You'll see the gradient:
   ```css
   background: radial-gradient(ellipse at 50% 40%, #2d1520 0%, #1a0a12 40%, #0a0a0a 100%);
   ```
4. The color codes:
   - `#2d1520` = the pinkish-dark color in the center
   - `#1a0a12` = the darker surrounding area
   - `#0a0a0a` = the very dark edges
5. Change these to any colors you want. Use https://htmlcolorcodes.com to pick colors.

### Add or change music in the playlist

1. Open `js/config.js`
2. Find the `PLAYLIST` array (around line 22)
3. Each song has a `title` and a `url` (a direct link to an audio file)
4. To add a song, add a new line like:
   ```javascript
   { title: 'Song Name - Artist', url: 'https://direct-link-to-mp3-file.mp3' },
   ```
5. The URL must be a direct link to an audio file (not a YouTube or Spotify link)

### Change the daily quotes

1. Open `js/config.js`
2. Find the `DAILY_QUOTES` array (around line 41)
3. Add, remove, or change quotes — they're just text strings in a list
4. One quote shows per day (it cycles through them based on the day number)

---

## 14. How to check your code for errors

Before you push changes, it's good to check for mistakes.

### Check for JavaScript errors:

In the VS Code terminal, type:
```
npm run lint
```

- If everything is fine, you'll see **nothing** (no output = no errors)
- If there are errors, it will tell you the file name, line number, and what's wrong

### Auto-fix simple errors:

```
npm run lint:fix
```

This fixes minor issues automatically (like inconsistent spacing).

### Format all files to look neat:

```
npm run format
```

This makes your code consistently formatted — same indentation, same quote style, etc.

---

## 15. How to deploy to Vercel

Your app is hosted on **Vercel** at **usual-us.vercel.app**. Vercel is connected to your GitHub repository. This means:

> **When you push changes to GitHub, Vercel automatically picks them up and updates the live site.**

You don't need to do anything special for deployment. Just:

1. Make your changes
2. Push to GitHub (see [step 10](#10-how-to-push-changes-to-the-live-site))
3. Wait 1–2 minutes
4. Open **usual-us.vercel.app** — your changes are live!

### Important: Update the service worker version

Every time you change any file (JS, CSS, HTML), you should **bump the service worker version** so that users get the updated files instead of old cached ones.

1. Open `service-worker.js`
2. At the very top, find this line:
   ```javascript
   const CACHE_NAME = 'usual-us-v22';
   ```
3. Change the number to the next version (e.g., `v23`, then `v24`, etc.)
4. Save and push

**Why?** The service worker caches files on the user's phone for offline use. If you don't change the version number, their phone might keep showing the old version of the app even after you've made changes.

### If the site still shows old content after updating:

- Open the site on your phone
- **Hard refresh:** pull down to refresh, or clear the browser cache
- On a computer: press **Ctrl + Shift + R** to force a fresh load
- If using the installed PWA on Android: open the app, wait 30 seconds, close it, and reopen

---

## 16. How to make an Android app (TWA)

You can turn your website into a real Android app that appears in the app drawer, using something called a **Trusted Web Activity (TWA)**. The easiest method doesn't require any Android development tools.

### Easiest method — use PWABuilder (recommended):

1. Go to **https://www.pwabuilder.com** in your browser
2. In the text box, type your live site URL: `usual-us.vercel.app`
3. Click **"Start"**
4. It will analyze your app and show a score (you should score well since manifest + service worker are set up)
5. Click **"Package for stores"**
6. Choose **"Android"**
7. Fill in:
   - **Package ID:** `us.usual.twa`
   - **App name:** `usual us`
   - Leave everything else as default
8. Click **"Generate"**
9. Download the ZIP file
10. Inside the ZIP you'll find an APK file
11. Transfer the APK to your Android phone (via email, Google Drive, USB cable, etc.)
12. On your phone, open the APK file and tap **Install**
    - If your phone says "Install from unknown sources is blocked", go to Settings → search for "Install unknown apps" → allow your file manager or browser

> 💡 That's it! No Android Studio, no Java, no complicated setup.

### Setting up Digital Asset Links (so the browser bar doesn't show):

When you open a TWA, Android may show a browser address bar at the top. To remove it, you need to "prove" that you own the website.

1. When PWABuilder generates your APK, it will show you a **SHA-256 fingerprint** (a long string of letters and numbers). Copy it.
2. In your project, open `.well-known/assetlinks.json`
3. Replace `TODO:REPLACE_WITH_YOUR_SIGNING_KEY_SHA256_FINGERPRINT` with the fingerprint you copied
4. Save, push to GitHub, wait for Vercel to deploy
5. Now Android knows the website and the app are from the same person, and the browser bar will disappear

---

## 17. Quick reference commands

### Terminal commands (VS Code terminal):

| What you want | Command |
|--------------|---------|
| Start the dev server | `npm run dev` |
| Stop the dev server | Press `Ctrl + C` |
| Check code for errors | `npm run lint` |
| Auto-fix code errors | `npm run lint:fix` |
| Format all code neatly | `npm run format` |
| Build for production | `npm run build` |
| Preview the built version | `npm run preview` |

### Git commands (VS Code terminal):

| What you want | Command |
|--------------|---------|
| See what files you changed | `git status` |
| See the actual changes line by line | `git diff` |
| Stage all changes | `git add .` |
| Save changes with a description | `git commit -m "your message"` |
| Upload to GitHub (triggers Vercel deploy) | `git push` |
| Download latest changes from GitHub | `git pull` |

### VS Code shortcuts:

| Shortcut | What it does |
|----------|-------------|
| **Ctrl + S** | Save the current file |
| **Ctrl + `` ` ``** | Open/close the terminal |
| **Ctrl + P** | Quick-open any file by typing its name |
| **Ctrl + Shift + F** | Search across all files in the project |
| **Ctrl + Z** | Undo |
| **Ctrl + Shift + Z** | Redo |
| **Ctrl + F** | Find text in the current file |

---

## 18. Troubleshooting

### "npm is not recognized"
**What it means:** Your PC doesn't know what `npm` is.
**How to fix:** Node.js didn't install properly. Uninstall it (Control Panel → Programs → Uninstall), then reinstall from https://nodejs.org. After installing, **restart your PC**.

### "git is not recognized"
**What it means:** Your PC doesn't know what `git` is.
**How to fix:** Reinstall Git from https://git-scm.com. **Restart your PC** after installing.

### "npm install" shows red errors
**What it means:** Something went wrong downloading the tools.
**How to fix:** Try these commands one at a time:
```
npm cache clean --force
npm install
```

### "npm run dev" says port already in use
**What it means:** You already have a dev server running somewhere.
**How to fix:** Close any other VS Code terminal that shows `npm run dev` running (press Ctrl + C in that terminal). Then try again.

### The app loads but doesn't show any data
**What it means:** Firebase (the database) isn't connecting.
**How to fix:** Make sure you have internet. If it still doesn't work, check that `localhost` is in your Firebase authorized domains: go to https://console.firebase.google.com → your project → Authentication → Settings → Authorized domains → add `localhost`.

### "git push" says "rejected"
**What it means:** GitHub has changes you don't have on your PC (maybe you edited something on the GitHub website).
**How to fix:** Download those changes first, then push:
```
git pull
git push
```

### Changes don't appear on the live site
**What it means:** The old version is cached.
**How to fix:**
1. Make sure you bumped the service worker version in `service-worker.js` (see [step 15](#15-how-to-deploy-to-vercel))
2. Wait 2 minutes after pushing
3. Hard-refresh: **Ctrl + Shift + R** on desktop, or clear app cache on Android
4. Check your Vercel dashboard to see if the deploy succeeded

### The installed PWA on Android shows old content
**What it means:** The service worker is serving cached files.
**How to fix:** Bump the service worker version (change `v22` to `v23` in `service-worker.js`), push, then on your phone: open the app → wait 30 seconds → force-close the app → reopen it.

---

## 19. Glossary

Every technical word used in this guide, explained in plain English:

| Word | What it means |
|------|--------------|
| **Node.js** | A program that runs JavaScript tools on your PC |
| **npm** | "Node Package Manager" — downloads and manages tools. It comes with Node.js. |
| **Git** | A system that tracks all changes to your files (unlimited undo/redo for your whole project) |
| **GitHub** | A website that stores your project online. Like Google Drive, but for code. |
| **Clone** | Downloading a copy of a project from GitHub to your PC |
| **Commit** | Saving a snapshot of your changes with a description |
| **Push** | Uploading your committed changes from your PC to GitHub |
| **Pull** | Downloading the latest changes from GitHub to your PC |
| **Repository (Repo)** | Your project folder, with all its history tracked by Git |
| **Branch** | A separate copy of your code you can experiment on without affecting the main version |
| **Terminal** | The text window where you type commands (the black box) |
| **VS Code** | Visual Studio Code — the program where you edit code |
| **Dependencies** | Helper tools and libraries your project needs |
| **package.json** | The "shopping list" file that says what tools the project needs |
| **node_modules** | The folder where downloaded tools go. Never edit this. |
| **Vite** | A dev server that shows your app in the browser and auto-refreshes when you save |
| **ESLint** | A tool that finds errors and problems in your JavaScript code |
| **Prettier** | A tool that makes your code look neat and consistent |
| **Firebase** | Google's online database that stores your app's data (expenses, memories, notes, etc.) |
| **Firestore** | The specific type of database inside Firebase that your app uses |
| **PWA** | "Progressive Web App" — a website that can be installed on a phone like a real app |
| **TWA** | "Trusted Web Activity" — wrapping a PWA as an Android app |
| **Service Worker** | A script that runs in the background, making the app work offline by caching files |
| **Manifest** | `manifest.json` — tells the phone how to install the app (name, icon, colors) |
| **Cache** | Saved copies of files so the app loads faster next time |
| **HTTPS** | Secure web connection (required for PWA features). Vercel provides this automatically. |
| **Localhost** | Your own PC acting as a temporary web server. Only you can see it. |
| **Deploy** | Putting your app live on the internet |
| **Vercel** | The hosting service where your app lives (usual-us.vercel.app) |
| **GSAP** | A library that makes animations smooth and fast |
| **Lenis** | A library that makes scrolling feel smooth |
| **Hammer.js** | A library that handles touch gestures (swipe, pinch, drag) |
| **API Key** | A password that lets your app talk to Firebase |
| **Hot Reload** | When you save a file, the browser updates automatically without you pressing refresh |

---

## 🎉 You're all set!

Your everyday workflow is:

1. **Open VS Code** and open your project folder
2. **Open the terminal** (Ctrl + `)
3. **Start the dev server:** type `npm run dev`
4. **Make changes** to any file and save (Ctrl + S)
5. **See changes live** in your browser (auto-refreshes)
6. **Check for errors:** type `npm run lint`
7. **Push to the live site:**
   ```
   git add .
   git commit -m "what I changed"
   git push
   ```
8. **Wait 1–2 minutes** — your live site updates automatically!

> 💖 **You can't break anything permanently.** Git saves every version of your files. If you mess something up, you can always go back. Don't be afraid to experiment!
