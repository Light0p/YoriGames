# YoriGames — Project Memory

## What This Project Is
A high-performance web-native arcade platform specializing in indie pixel-art games. It offers an "instant-play" experience with zero installation, optimized for desktop and mobile browsers.

## Tech Stack (Verified)
- **Framework**: Next.js 15.5.9 (App Router)
- **Deployment**: Static Export (`output: 'export'`)
- **Database/Auth**: Firebase 11.9.1 (Auth, Firestore, Storage)
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React
- **AI**: Genkit 1.28.0

## Current Architecture
- **Static Export**: The app is configured for full static generation. No server-side features (`cookies()`, `headers()`) are allowed.
- **Flat Route Structure**: All pages are located directly in `src/app/`. The `(main)` route group does NOT exist in this version.
- **Data Layer**: Game data is fetched once from `public/games.json` and managed via `GameContext.tsx`.
- **Pure XML Sitemap**: `sitemap.ts` uses `MetadataRoute.Sitemap` to ensure script-free XML generation.

## Completed Work (Confirmed via Git Log)
- Added high-performance fuzzy search with `Fuse.js` and client-side pagination.
- Restored the Profile page with client-side authentication and avatar uploads.
- Implemented `useArcadeState.ts` for UID-scoped `localStorage` (Favorites/Recent).
- Added "Share" and "About Game" actions to the Game View player.
- Configured native Next.js sitemap to prevent HTML injection.

## Bugs Already Fixed
- **Fullscreen iframe remount**: `GameView.tsx` no longer conditionally restructures the player DOM or keys inner wrappers on fullscreen toggles. The iframe stays mounted in a stable React tree; the Fullscreen API targets `playerContainerRef` only, preserving in-game state on exit.
- **ESC fullscreen desync**: A `fullscreenchange` listener syncs React UI state when the browser exits fullscreen natively (e.g. ESC), preventing grey-screen UI drift.
- **Mobile touch "hidden wall"**: Absolute overlay containers (control bar, ad wrapper) use `pointer-events-none` on outer wrappers. `pointer-events-auto` is applied only to interactive `<button>` elements and the `#game-ad-container` mount point. No forced `w-full`/`h-full` on the ad container — the GameMonetize SDK dictates ad size when injected.
- **Portrait orientation lock removed**: CSS-forced mobile rotation prompts were removed to support native portrait HTML5 games (e.g. Subway Surfers). Player sizing relies on Tailwind `w-full h-full` and native `:fullscreen` styles.

## Known Remaining Bugs
1. **Mobile Rotation**: Game player canvas may still not resize perfectly on some devices during orientation change (no forced lock; relies on natural CSS).
2. **z-index Conflict**: The "Skip Ad" button from GameMonetize is sometimes hidden behind our custom fullscreen button.
3. **Search Latency**: Initializing the 5,000+ game index on the search page can cause a minor main-thread block on low-end mobile devices.

## Strict Rules — Never Break
- **No SSR**: Never add server-side API routes, `cookies()`, or `headers()`.
- **Static First**: Always add `export const dynamic = 'force-static'` to new page files.
- **Client Safety**: Always wrap `useSearchParams()` in a `<Suspense>` boundary.
- **Storage Privacy**: `localStorage` keys must be user-scoped: `yori_${uid}_keyname`.
- **Clean Sitemaps**: Keep scripts and providers only in `layout.tsx`; verify `sitemap.xml` remains valid XML.
- **Stable Game Iframe**: Never unmount/remount the game iframe on fullscreen or resize events; use a single stable container ref and native Fullscreen API.
- **Pointer Events on Overlays**: Absolute player overlays must use `pointer-events-none` on wrappers; only buttons and SDK-injected ad UI may use `pointer-events-auto`. Never apply full-size dimensions to empty ad mount containers.

## What Does NOT Exist (Deleted / Non-Existent)
- `src/app/(main)/`: This folder and its separate layout were removed to fix parallel route conflicts.
- `src/app/api/search-index/route.ts`: This was renamed to `_route.ts` or disabled to prevent static build failures.
- `FirebaseErrorListener.tsx`: Functionality was merged into the provider.
