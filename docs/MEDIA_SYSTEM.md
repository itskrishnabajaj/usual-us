# MEDIA SYSTEM

> How images, video, audio and music work: Cloudinary upload/delete, preview generation,
> image framing, lazy playback, and the music player. Verified against `js/memories.js`,
> `js/music.js`, `js/sounds.js`, `js/config.js`.

Related: [FIREBASE_BIBLE](./FIREBASE_BIBLE.md) · [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md) · [SECURITY_REVIEW](./SECURITY_REVIEW.md)

---

## 1. Cloudinary configuration (`js/config.js:5-10`)

| Setting | Value |
|---------|-------|
| Cloud name | `ddyj2njes` |
| Upload preset | `usual_us` (unsigned) |
| Folder | `usual-us/memories` |
| API key / secret | hardcoded in `config.js` ⚠️ |

> ⚠️ **Security:** the API **secret** is in client code and used to SHA-1-sign delete requests
> in the browser (`generateCloudinarySignature`, `memories.js:225`). This is the single most
> important security issue in the app — see [SECURITY_REVIEW](./SECURITY_REVIEW.md). Uploads use
> the *unsigned* preset (fine); only deletion needs the secret.

---

## 2. Upload flow (`memories.js`)

```mermaid
flowchart LR
    pick[handlePhotoSelect<br/>camera/gallery, multiple] --> val{video ≤ 20s?}
    val -- no --> err[showError, skip]
    val -- yes --> prev[preview via Object URL / FileReader]
    prev --> submit[handleMemoryUpload]
    submit --> up[parallel upload to Cloudinary]
    up --> doc[memories.add: images[], mediaTypes[], publicIds[], caption, memoryDate, ...]
    doc --> reload[loadMemories → renderMemoriesTimeline] --> us[switch to Us tab]
```

- **Selection** (`handlePhotoSelect`, `:33`): accepts `image/*`, `video/*`, `audio/*`, multiple,
  from camera (`capture="environment"`) or gallery. **Videos > 20s are rejected** (validated by
  loading a temp `<video>` and checking `duration`, `:37-59`).
- **Preview:** images via `FileReader` data URL; video/audio via `URL.createObjectURL` with a
  type badge (🎬 / 🎵). All object URLs are tracked in `_previewObjectURLs` (`:17`) and revoked on
  remove/reset (`revokePreviewObjectURLs`, `:19`) to prevent leaks.
- **Upload** (`handleMemoryUpload`, `:294`): `POST` multipart to
  `api.cloudinary.com/v1_1/{cloud}/{type}/upload` with `upload_preset` + `folder`, all files in
  parallel (`Promise.all`). Audio is uploaded as a `video` resource type (Cloudinary convention).
  Stores `secure_url` + `public_id` per file.
- **Persist:** one Firestore `memories` doc per memory (multiple files = an album). See
  [FIREBASE_BIBLE](./FIREBASE_BIBLE.md#memories--auto-id).

---

## 3. Deletion (`memories.js:205-292`)

- `deleteMemoryFromCloudinary(memory)` deletes every asset in parallel
  (`Promise.allSettled`, error-tolerant). For each: SHA-1 signature of `{public_id, timestamp}`
  + secret, `POST` to `/destroy`.
- Backward-compat: if `publicIds` is missing on older docs, the public id is parsed from the URL
  (`extractCloudinaryPublicId`, `:208`).
- Firestore doc is deleted after kicking off the (non-blocking) Cloudinary deletes.

---

## 4. Image framing (position & zoom)

- Stored per memory as `imagePosition {x,y}` (0–100%) and `imageZoom` (1.0–2.5).
- Applied at render via `getImageStyle()` (`:757`): `object-position: x% y%` + optional
  `transform: scale(zoom)` with matching `transform-origin`.
- **Adjust modal** (`startImageAdjust`, `:465`): X/Y/zoom sliders **plus** a Hammer.js pan gesture
  (`attachImageAdjustGestures`, `animations.js:174`) that maps drag delta → percentage. Saved via
  `saveImagePosition` (`:560`) → Firestore update → reload. `touchmove` inside this modal is
  intentionally non-passive (the one sanctioned exception) to prevent background scroll while dragging.

---

## 5. Lazy media on the timeline

- **Images:** native `loading="lazy"`.
- **Videos:** rendered `preload="metadata"`, no autoplay; a single `IntersectionObserver`
  (`observeTimelineVideos`, `:803`, `rootMargin: 200px`) **plays them when on-screen and pauses
  them when off-screen**. The observer is disconnected when leaving the Us tab (`us-tab.js`).
- `renderMediaElement()` (`:780`) decides `img` vs `video` and applies the framing style.
- `isVideoMedia()` (`:769`) checks the `mediaTypes` array first, then falls back to URL extension.

This keeps the timeline smooth even with many memories — only visible videos ever play.

---

## 6. Music player (`js/music.js`)

- **Source:** `PLAYLIST` (15 songs) in `js/config.js:22-38`, each `{title, url}` with the audio
  hosted on Cloudinary (`.m4a` via the `video/upload` path).
- **Init** (`initializeMusicPlayer`, `:9`): builds the song list, wires the `<audio>` element
  (`timeupdate` → seek bar, `loadedmetadata` → duration, `ended` → next random song), loads
  `recentlyPlayed` from localStorage.
- **Controls:** `selectSong`, `togglePlayPause`, `handleSeek`, `updateSeekBar`, `formatTime`.
- **Recently played:** `addToRecentlyPlayed` keeps the last 3 indices in localStorage and renders
  them (`renderRecentlyPlayed`).
- **Autoplay with fade-in:** entering the Us tab schedules (after `MUSIC_AUTOPLAY_DELAY_MS = 12s`,
  `us-tab.js:5`) a random song that fades 0→1 over `MUSIC_FADE_IN_DURATION_MS = 4s` in
  `MUSIC_FADE_IN_STEPS = 40` steps (`playRandomSongWithFadeIn`, `music.js:77`). If music was
  already playing it resumes immediately; leaving the tab pauses and remembers state. Timers
  (`musicDelayTimer`, `musicFadeInterval`) are cancelled on tab switch to avoid overlap.
- **Panel:** `toggleMusicPlayer` (`:152`) opens `#music-player-panel` with a backdrop;
  `removeMusicBackdrop` prevents orphaned backdrops across repeated toggles.

> **Note:** the service worker **bypasses** video/audio and Cloudinary requests so HTTP range
> requests (seeking) work correctly on mobile (`service-worker.js:98-101`). Don't "fix" this by
> caching audio — it would break seeking.

---

## 7. Sound effects (`js/sounds.js`)

- `SoundFX` preloads 6 MP3s from `sounds/` (tab switch, expense added/deleted, memory added,
  large-memory, button) and plays them in response to EventBus events
  (see [STATE_MANAGEMENT §event-catalog](./STATE_MANAGEMENT.md#event-catalog)).
- Playback resets `currentTime` to avoid overlap and silently ignores autoplay blocks — sound is
  a non-critical delight, never allowed to break the UI.

---

## 8. Object-URL & memory hygiene
- Every preview object URL is tracked and revoked (`_previewObjectURLs`) — avoids blob leaks
  during repeated memory composing.
- The timeline video observer is created per render and disconnected on tab leave.
- These are the main media-related leak guards; see [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md)
  for the full memory-hygiene review.

---

### Related documents
[FIREBASE_BIBLE](./FIREBASE_BIBLE.md) · [PERFORMANCE_BIBLE](./PERFORMANCE_BIBLE.md) · [SECURITY_REVIEW](./SECURITY_REVIEW.md) · [PWA_BIBLE](./PWA_BIBLE.md)
