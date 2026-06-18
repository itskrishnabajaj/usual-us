# DEBUGGING GUIDE

> A symptom → root-cause → fix playbook for the most likely issues, tuned to this codebase.
> When debugging, reproduce on a real Android phone where possible — that's the target device.

Related: [PWA_BIBLE](./PWA_BIBLE.md) · [FIREBASE_BIBLE](./FIREBASE_BIBLE.md) · [STATE_MANAGEMENT](./STATE_MANAGEMENT.md)

---

## 0. First moves
- Open DevTools (desktop) or `chrome://inspect` (remote-debug the phone).
- Check the **Console** for the boot logs (`app.js` logs startup; `firebase.js` logs
  `✅ Firebase initialized` / `❌ Firebase error`).
- Check **Application → Service Workers** and **Cache Storage** (look for `usual-us-v50`).
- Reproduce with the network throttled / offline to separate sync issues from UI issues.

---

## 1. "My change isn't showing up" (the #1 issue)
**Root cause:** the service worker served a cached version, or `CACHE_NAME` wasn't bumped.
**Fix:**
1. Bump `CACHE_NAME` in `service-worker.js:1` (e.g. `usual-us-v50` → `v48`) for any cached-asset change.
2. Redeploy (push → Vercel). `vercel.json` keeps `service-worker.js`/`manifest.json` `no-cache`.
3. On device: reopen the installed app, wait ~30s for the new worker, then it auto-reloads once
   (`app.js` update flow). Or DevTools → Application → Service Workers → "Update"/"Unregister".
See [PWA_BIBLE §2](./PWA_BIBLE.md#2-service-worker-service-workerjs-cache-usual-us-v50).

## 2. Data not loading / not updating
- **Symptom: nothing loads after login.** Check Console for a Firebase error; confirm
  `initializeFirebase()` ran (it runs inside `handleLogin`). Verify the Firestore **security
  rules** allow the read (rules aren't in-repo — see [FIREBASE_BIBLE §7](./FIREBASE_BIBLE.md#7-security-rules-dependency-important)).
- **Symptom: partner's change isn't visible.** Expected — there are **no live listeners**; data
  refreshes on the next `load*()`/tab action. Re-open the tab or trigger a refresh.
- **Symptom: works offline then "loses" a write.** Offline writes are queued by persistence and
  sync on reconnect; if it was a different tab, persistence may be limited (warned in console).

## 3. Balance looks wrong
- Balance is computed in `calculateCurrentBalance()` (`expenses.js:525`) and **cached**
  (`_cachedBalance`, invalidated by `invalidateBalanceCache`, `expenses.js:555`). If a manual data
  edit doesn't reflect, ensure the cache was invalidated (it is, inside `loadExpenses`).
- Check `shares`, `paidBy`, and `isSettlement` on the offending expense doc in the Firestore console.

## 4. Rendering glitches
- **Duplicated/stale list items:** a `render*()` rebuilds via `innerHTML`; make sure you called the
  matching `load*()` after a write so the array and DOM agree.
- **Polaroid tilt jumping:** tilt is derived from the memory id (`getStableTilt`) — stable by
  design; if it jumps, the id changed (new doc).
- **Us tab not appearing in nav:** it's revealed only after the first Stats visit (`revealUsTab`);
  the flag lives in sessionStorage.

## 5. Touch / scroll / gesture issues
- **Can't scroll horizontally inside something on a screen edge:** the edge-swipe guard
  (`app.js`) blocks horizontal gestures in the 30px edge zone. It is disabled inside `.us-tab` and
  only blocks when the target has no horizontal scroll — if a new horizontally-scrollable element
  near the edge feels stuck, verify `canScrollFromTarget` sees its overflow.
- **Background scrolls while dragging the image-adjust slider:** expected to be prevented; that
  modal's `touchmove` is non-passive on purpose. If you add new drag UIs, don't globally
  `preventDefault` — scope it like this one.
- **Pull-to-refresh does nothing:** intentional — `setupPullToRefresh()` is a no-op
  (`us-tab.js:43`). The spinner CSS (`ptrSpin`) is currently dead.

## 6. Animation issues
- **Janky animation:** confirm it animates `transform`/`opacity`, not layout props
  ([ANIMATION_BIBLE](./ANIMATION_BIBLE.md#1-cost-model-read-first)).
- **Animation keeps running off-screen:** ensure continuous effects pause (the floating hearts use
  `animation-play-state: paused` off-tab) — don't leave new infinite animations running on hidden tabs.
- **Splash won't dismiss:** the 9.4s timeout always fires `_startApp`; check `_splashResolved`
  logic in `app.js` if a skip tap left it stuck.

## 7. Media issues
- **Video won't play on the timeline:** it's lazy — only plays when in view (IntersectionObserver,
  200px margin). Autoplay can also be blocked until a user interaction; the code catches this.
- **Audio won't seek:** make sure video/audio/Cloudinary requests still **bypass** the service
  worker (`service-worker.js:98-101`); caching them breaks range requests.
- **Upload fails:** check the Cloudinary unsigned preset `usual_us` and the network call to
  `/{type}/upload`. Videos > 20s are rejected by design.
- **Delete fails:** deletion uses the in-browser SHA-1 signature with the API secret; if the secret
  is rotated/removed (recommended — see [SECURITY_REVIEW](./SECURITY_REVIEW.md)), deletion must
  move server-side.

## 8. Deployment issues
- **Deploy didn't update the site:** check the Vercel dashboard build; confirm the push reached the
  production branch. Remember the service-worker cache step (§1).
- **Headers missing:** they come from `vercel.json` (not `netlify.toml`, which is gone).

## 9. Cache debugging quick reference
| Want to… | Do |
|----------|----|
| Force the newest code | Bump `CACHE_NAME`, redeploy |
| Inspect what's cached | DevTools → Application → Cache Storage → `usual-us-v50` |
| Nuke local state | DevTools → Application → Clear storage (clears SW, caches, localStorage) |
| Verify SW is active | Application → Service Workers (should show activated `usual-us-v50`) |

## 10. Useful console probes
```js
currentUser; currentUserProfile;     // who's logged in
expenses.length; memories.length;    // loaded data sizes
calculateCurrentBalance();           // recompute balance
EventBus.emit('tab:switched',{tab:'us'}); // simulate a tab switch reaction
caches.keys().then(console.log);     // list SW caches
```

---

### Related documents
[PWA_BIBLE](./PWA_BIBLE.md) · [FIREBASE_BIBLE](./FIREBASE_BIBLE.md) · [TESTING_GUIDE](./TESTING_GUIDE.md) · [CODE_AUDIT_REPORT](./CODE_AUDIT_REPORT.md)
