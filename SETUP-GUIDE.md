# 🛠️ Usual Us — Complete Setup & Deployment Guide

## For Total Beginners (No Coding Experience Required)

This guide will walk you through **every single step** to set up and run the "Usual Us" app on your Windows PC. Written in plain English. No coding knowledge needed — just follow each step exactly.

---

## 📋 Table of Contents

1. [What You Need to Install](#1-what-you-need-to-install)
2. [Step 1: Install Node.js](#2-step-1-install-nodejs)
3. [Step 2: Install Git](#3-step-2-install-git)
4. [Step 3: Install VS Code (Code Editor)](#4-step-3-install-vs-code)
5. [Step 4: Download Your Project](#5-step-4-download-your-project)
6. [Step 5: Install Project Dependencies](#6-step-5-install-project-dependencies)
7. [Step 6: Run the App Locally](#7-step-6-run-the-app-locally)
8. [Step 7: Make Changes and See Them Live](#8-step-7-make-changes-and-see-them-live)
9. [Step 8: Check Your Code for Errors](#9-step-8-check-your-code-for-errors)
10. [Step 9: Build for Production](#10-step-9-build-for-production)
11. [Step 10: Deploy to GitHub Pages](#11-step-10-deploy-to-github-pages)
12. [Step 11: Generate an Android APK (TWA)](#12-step-11-generate-an-android-apk-twa)
13. [Everyday Commands Cheat Sheet](#13-everyday-commands-cheat-sheet)
14. [Troubleshooting Common Problems](#14-troubleshooting-common-problems)
15. [Glossary (What These Words Mean)](#15-glossary)

---

## 1. What You Need to Install

Before touching any code, you need **3 free programs** on your PC:

| Program | What It Does | Download Link |
|---------|-------------|---------------|
| **Node.js** | Runs JavaScript tools on your PC | https://nodejs.org |
| **Git** | Tracks changes and connects to GitHub | https://git-scm.com |
| **VS Code** | The app where you edit code files | https://code.visualstudio.com |

> 💡 **Think of it like this:**
> - **Node.js** = the engine that powers your tools
> - **Git** = the save system (like saving game progress)
> - **VS Code** = the notepad where you edit files (but much smarter)

---

## 2. Step 1: Install Node.js

Node.js lets you run all the development tools on your PC.

### Instructions:

1. Go to **https://nodejs.org**
2. Click the big green button that says **"LTS"** (this means the stable version)
3. A file will download (something like `node-v22.x.x-x64.msi`)
4. **Double-click** the downloaded file to start the installer
5. Click **Next → Next → Next → Install → Finish** (accept all defaults)

### Verify It Worked:

1. Press **`Windows Key + R`** on your keyboard
2. Type **`cmd`** and press **Enter** (this opens the black Command Prompt window)
3. Type this and press Enter:
   ```
   node --version
   ```
4. You should see something like `v22.15.0` — any number is fine
5. Now type this and press Enter:
   ```
   npm --version
   ```
6. You should see something like `10.9.2`

> ✅ If both commands show version numbers, Node.js is installed correctly!
> ❌ If you see "not recognized", restart your PC and try again.

---

## 3. Step 2: Install Git

Git is how you download the project and push changes to GitHub.

### Instructions:

1. Go to **https://git-scm.com**
2. Click **"Download for Windows"**
3. Double-click the downloaded file
4. The installer has many screens — **just keep clicking Next with all the defaults**
5. On the screen that asks about the editor, you can leave it as "Use Vim" or change to "Use Visual Studio Code" if you want
6. Click **Install → Finish**

### Verify It Worked:

1. Open **cmd** (Windows Key + R → type `cmd` → Enter)
2. Type:
   ```
   git --version
   ```
3. You should see something like `git version 2.45.1`

> ✅ If you see a version number, Git is installed!

---

## 4. Step 3: Install VS Code

VS Code is the program where you'll view and edit your app's files.

### Instructions:

1. Go to **https://code.visualstudio.com**
2. Click the big **"Download for Windows"** button
3. Double-click the downloaded file
4. Check these boxes during install:
   - ✅ Add "Open with Code" action to Windows Explorer context menu
   - ✅ Add to PATH
5. Click **Install → Finish**

### Helpful VS Code Extensions (Optional but Recommended):

After installing VS Code, open it and:
1. Click the **square icon** on the left sidebar (Extensions)
2. Search for and install these:
   - **ESLint** — highlights code errors
   - **Prettier** — auto-formats your code
   - **Live Server** — quick preview of your app (alternative to Vite)

---

## 5. Step 4: Download Your Project

Now you'll download ("clone") your project from GitHub to your PC.

### Instructions:

1. Create a folder on your PC where you want to keep the project
   - Example: `C:\Projects\` (create this folder in File Explorer)
2. Open **cmd** (Windows Key + R → type `cmd` → Enter)
3. Navigate to your folder by typing:
   ```
   cd C:\Projects
   ```
4. Now download the project:
   ```
   git clone https://github.com/itskrishnabajaj/usual-us.git
   ```
5. Wait for it to finish downloading
6. Enter the project folder:
   ```
   cd usual-us
   ```

### Open It in VS Code:

While still in cmd, inside the project folder, type:
```
code .
```

This opens the entire project in VS Code! (The dot `.` means "current folder")

> 💡 You can also open VS Code first, then go to **File → Open Folder** and select `C:\Projects\usual-us`

---

## 6. Step 5: Install Project Dependencies

Your project uses some helper tools (like GSAP for animations, Vite for the dev server, etc.). You need to download them.

### Instructions:

1. In VS Code, open the **Terminal**:
   - Click **Terminal** in the top menu → **New Terminal**
   - OR press **Ctrl + `** (the key above Tab)
2. A terminal panel appears at the bottom of VS Code
3. Make sure you're in the right folder (it should show `usual-us`)
4. Type this command and press Enter:
   ```
   npm install
   ```
5. **Wait.** This will download all the required tools. It may take 1-3 minutes.
6. When it finishes, you'll see something like "added 100 packages"

> ✅ You should now see a `node_modules` folder appear in the left sidebar
> ❌ If you see errors about "npm is not recognized", go back and reinstall Node.js

### What Just Happened?

The `npm install` command read the `package.json` file (like a shopping list) and downloaded everything on that list into a `node_modules` folder. You never need to edit or look inside `node_modules` — it's managed automatically.

---

## 7. Step 6: Run the App Locally

This starts a local version of your app that you can view in your browser.

### Instructions:

1. In the VS Code terminal, type:
   ```
   npm run dev
   ```
2. You'll see something like:
   ```
   VITE v7.x.x  ready in 200 ms
   
   ➜  Local:   http://localhost:3000/
   ```
3. **Hold Ctrl and click** on `http://localhost:3000/` — it opens in your browser!
4. You should see your app running!

### How to Stop the Server:

- Press **Ctrl + C** in the terminal (this stops it)
- Or just close the terminal

> 💡 **Important:** The app needs Firebase (your database) to fully work. The local server just lets you see the interface and test changes. Since your Firebase config is already in the code, it should connect automatically if you have internet.

---

## 8. Step 7: Make Changes and See Them Live

When the dev server is running (`npm run dev`), any changes you make to files will **automatically** appear in the browser! This is called "hot reload."

### Example — Change Something:

1. Make sure `npm run dev` is running
2. In VS Code, open `styles.css`
3. Find line 7: `--bg-primary: #0a0a0a;`
4. Change it to: `--bg-primary: #1a1a2e;` (this changes the background color)
5. **Save the file** (Ctrl + S)
6. Look at your browser — the background color changes instantly!
7. Change it back to `#0a0a0a` and save again

### Editing JavaScript Files:

- The JS files are in the `js/` folder
- `js/app.js` — the main app startup
- `js/memories.js` — the memories/photos feature
- `js/expenses.js` — the expense tracking feature
- `styles.css` — all the visual styling
- `index.html` — the page structure

---

## 9. Step 8: Check Your Code for Errors

Before deploying, you should check for problems.

### Check for Code Errors (Linting):

```
npm run lint
```

This scans all JavaScript files for mistakes. If everything is fine, you'll see no errors. If there are problems, it tells you which file and line number.

### Auto-Fix Simple Errors:

```
npm run lint:fix
```

This automatically fixes minor issues like missing semicolons.

### Format Your Code Nicely:

```
npm run format
```

This makes all your code look consistently formatted (proper indentation, spacing, etc.).

### Optimize SVG Icons:

```
npm run optimize:svg
```

This makes your icon files smaller (faster loading).

---

## 10. Step 9: Build for Production

When you're ready to deploy, you create an optimized version of your app.

### Instructions:

1. In the terminal, type:
   ```
   npm run build
   ```
2. This creates a `dist/` folder with optimized files
3. To preview the built version:
   ```
   npm run preview
   ```

> 💡 The `dist` folder is what you upload to your hosting (like GitHub Pages). It's a compressed, fast version of your app.

---

## 11. Step 10: Deploy to GitHub Pages

Your app is already set up to deploy via GitHub Pages. Here's how to push changes:

### First-Time Setup — Connect Git to GitHub:

1. In the VS Code terminal:
   ```
   git config --global user.name "Your Name"
   git config --global user.email "your-email@example.com"
   ```
   (Use the same email as your GitHub account)

### Every Time You Make Changes:

1. **Save all files** in VS Code (Ctrl + S on each, or Ctrl + K then S for all)
2. In the terminal, run these commands one at a time:
   ```
   git add .
   ```
   _(This stages all your changes — the dot means "everything")_
   
   ```
   git commit -m "describe what you changed"
   ```
   _(This saves a snapshot with a message — replace the text in quotes with your description)_
   
   ```
   git push
   ```
   _(This uploads your changes to GitHub)_

3. GitHub Pages will automatically update your live site within a few minutes!

### Example — Full Push Workflow:

```
git add .
git commit -m "Fixed button color and added new feature"
git push
```

> 💡 If `git push` asks for a username/password, you may need to set up a Personal Access Token. Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token. Use that token as your password.

---

## 12. Step 11: Generate an Android APK (TWA)

This turns your web app into an Android app using Trusted Web Activity (TWA).

### Prerequisites:

1. **Java JDK** — Download from https://adoptium.net (choose the LTS version)
   - Run the installer, click Next through everything
2. **Android Studio** — Download from https://developer.android.com/studio
   - Run the installer (this is a big download, ~1 GB)
   - During install, make sure **Android SDK** is checked
   - After install, open Android Studio once and let it download SDK components

### ✅ Easiest Method — Use PWA Builder Website (RECOMMENDED):

Since you're a beginner, the **easiest** way to make an Android APK is:

1. Go to **https://www.pwabuilder.com**
2. Enter your live website URL (your GitHub Pages URL)
3. Click **"Start"**
4. It will analyze your PWA and show a score
5. Click **"Package for stores"**
6. Select **"Android"**
7. Fill in:
   - **Package ID:** `us.usual.twa`
   - **App name:** `usual us`
   - Leave other settings as default
8. Click **"Generate"**
9. It downloads a ZIP file containing your APK!
10. Transfer that APK to your Android phone and install it

> 💡 This is by far the easiest method. No Android Studio or Java needed!

### For Advanced Users — Bubblewrap CLI:

If you want more control, you can use Google's **Bubblewrap** CLI tool.

1. Search online for **"Google Bubblewrap CLI"** to find the official GitHub repository with installation instructions
2. It requires **Java JDK** and **Android SDK** (see prerequisites above)
3. Basic workflow:
   ```
   bubblewrap init --manifest https://your-site-url/manifest.json
   bubblewrap build
   ```
4. Replace the URL with your actual GitHub Pages URL

### Setting Up Digital Asset Links:

For TWA to work properly (no browser bar showing), you need to verify your domain:

1. The file `.well-known/assetlinks.json` is already in your project
2. You need to replace `TODO:REPLACE_WITH_YOUR_SIGNING_KEY_SHA256_FINGERPRINT` with your actual signing key
3. To get your signing key fingerprint:
   - When you sign your APK, Android Studio will show you the SHA256 fingerprint
   - OR use: `keytool -list -v -keystore your-keystore.jks`
4. Put that fingerprint in the `assetlinks.json` file
5. Push to GitHub so it's live on your site

---

## 13. Everyday Commands Cheat Sheet

Copy-paste these whenever you need them:

| What You Want to Do | Command to Type |
|---------------------|----------------|
| **Start the dev server** | `npm run dev` |
| **Stop the dev server** | Press `Ctrl + C` |
| **Check code for errors** | `npm run lint` |
| **Auto-fix code errors** | `npm run lint:fix` |
| **Format all code nicely** | `npm run format` |
| **Optimize icon files** | `npm run optimize:svg` |
| **Build for production** | `npm run build` |
| **Preview production build** | `npm run preview` |
| **Save changes to Git** | `git add .` then `git commit -m "message"` |
| **Upload changes to GitHub** | `git push` |
| **Download latest changes** | `git pull` |
| **Install new dependency** | `npm install package-name` |
| **See which files changed** | `git status` |
| **See what you changed** | `git diff` |

### Keyboard Shortcuts for VS Code:

| Shortcut | What It Does |
|----------|-------------|
| `Ctrl + S` | Save current file |
| `Ctrl + Shift + S` | Save all files |
| `` Ctrl + ` `` | Open/close terminal |
| `Ctrl + P` | Quick open any file (type the name) |
| `Ctrl + Shift + F` | Search across all files |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |

---

## 14. Troubleshooting Common Problems

### "npm is not recognized"
- **Cause:** Node.js isn't installed properly or PATH wasn't set
- **Fix:** Reinstall Node.js, making sure to check "Add to PATH" during install. Then restart your PC.

### "git is not recognized"
- **Cause:** Git isn't installed or PATH wasn't set
- **Fix:** Reinstall Git. Restart your PC.

### "npm install" shows errors
- **Cause:** Usually a network issue or corrupted cache
- **Fix:** Try:
  ```
  npm cache clean --force
  npm install
  ```

### "npm run dev" shows port already in use
- **Cause:** Another server is already running
- **Fix:** Close any other terminal that's running `npm run dev`, or change the port in `vite.config.js`

### The app doesn't connect to Firebase
- **Cause:** Firebase might be blocking your domain
- **Fix:** Go to Firebase Console → Authentication → Settings → Authorized domains → Add `localhost`

### "git push" is rejected
- **Cause:** Someone else pushed changes (or you did from GitHub web)
- **Fix:** Pull first, then push:
  ```
  git pull
  git push
  ```

### Changes don't show on the live site
- **Cause:** GitHub Pages takes a few minutes to update, and browsers cache aggressively
- **Fix:** 
  - Wait 2-3 minutes after pushing
  - Hard-refresh the browser: `Ctrl + Shift + R`
  - Check GitHub → Actions tab to see if deployment is running

### The PWA doesn't install on Android
- **Cause:** Missing requirements for PWA installability
- **Fix:** Make sure:
  - Site is served over HTTPS (GitHub Pages does this automatically)
  - `manifest.json` has all required fields (it does in this project)
  - Service worker is registered (it is in this project)
  - Open the site in Chrome on Android → wait a moment → you should see "Add to Home screen" prompt

---

## 15. Glossary

| Term | What It Means |
|------|--------------|
| **Node.js** | A program that lets you run JavaScript tools on your PC (not just in a browser) |
| **npm** | "Node Package Manager" — installs tools and libraries. Comes with Node.js |
| **Git** | A system that tracks all changes to your files (like unlimited undo) |
| **GitHub** | A website that stores your Git repositories (your project's files + history) online |
| **Repository (Repo)** | Your project folder, tracked by Git |
| **Clone** | Downloading a copy of a repository from GitHub to your PC |
| **Commit** | Saving a snapshot of your changes (with a description message) |
| **Push** | Uploading your committed changes from your PC to GitHub |
| **Pull** | Downloading the latest changes from GitHub to your PC |
| **Branch** | A separate version of your code (like a parallel universe of your project) |
| **Terminal / CMD** | The black window where you type commands |
| **Dependencies** | Helper tools and libraries your project needs to work |
| **package.json** | A file that lists all the tools your project needs (like a shopping list) |
| **node_modules** | The folder where all downloaded tools are stored (never edit this!) |
| **Vite** | A fast development server that shows your app in the browser |
| **ESLint** | A tool that checks your JavaScript code for errors |
| **Prettier** | A tool that formats your code to look consistent and neat |
| **GSAP** | A library for smooth, high-performance animations |
| **Lenis** | A library that makes scrolling feel smooth and natural |
| **Hammer.js** | A library that handles touch gestures (swipe, drag, pinch) |
| **PWA** | "Progressive Web App" — a website that can be installed like a phone app |
| **TWA** | "Trusted Web Activity" — a way to wrap a PWA as an Android app |
| **Service Worker** | A background script that makes your app work offline and caches files |
| **Manifest** | `manifest.json` — tells the phone how to install your app (name, icon, colors) |
| **Firebase** | Google's cloud database service that stores your app's data |
| **Firestore** | The specific database type inside Firebase that your app uses |
| **HTTPS** | Secure web connection (required for PWA features) |
| **Localhost** | Your own PC acting as a temporary web server (only you can see it) |
| **Build** | Converting your code into an optimized version for deployment |
| **Deploy** | Putting your app live on the internet for everyone to see |
| **Cache** | Stored copies of files so the app loads faster next time |
| **API Key** | A password that lets your app talk to Firebase |

---

## 🎉 You're All Set!

Here's your typical workflow going forward:

1. Open VS Code
2. Open the terminal (Ctrl + `)
3. Run `npm run dev` to start the local server
4. Make your changes to files
5. See changes live in the browser
6. When happy, run `npm run lint` to check for errors
7. Save to Git: `git add .` → `git commit -m "what I changed"` → `git push`
8. Your live site updates automatically!

> 💖 Remember: You can't break anything permanently. Git saves every version, so you can always go back. If you mess up, just ask for help!
