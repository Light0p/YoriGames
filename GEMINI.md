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

## Performance Overhaul
- **Off-Thread Data Pipeline**: Moved `games.json` fetch, parse, and `Fuse.js` indexing to a dedicated Web Worker (`src/workers/gameData.worker.ts`). This eliminates synchronous `JSON.parse` blocking and main-thread indexing spikes for the 5,000+ item library.
- **Stable Background Rendering**: Fixed `GalaxyBackground` re-render bug where elements would jump to new random positions on parent state changes. Memoized generation with `useMemo` and wrapped the component in `React.memo`.
- **IntersectionObserver lazy grids**: `LazyGrid.tsx` defers mounting game cards until slots enter (or near) the viewport. Used by `GameGrid`, Home strips (`GameStrip`, `YourArcade`), Search, and Category/arcade pages — prevents DOM bloat during fast mobile scrolling.
- **Async image decoding**: All `GameCard` thumbnails use `loading="lazy"` and `decoding="async"` with tight `sizes` hints (`110px`–`180px`) so the main thread is not blocked decoding high-res art for tiny tiles.
- **Deferred SDK initialization**: GameMonetize `sdk.js` initialization is gated behind first user interaction or a 5s fallback in `DeferredGameMonetizeSDK.tsx`, keeping the critical path clear for Hero paint.

## Bugs Already Fixed
- **GalaxyBackground Jitter**: Fixed star/spiral arm repositioning on every re-render via stable `useMemo` data and `React.memo`.
- **Main-Thread Blocking**: Eliminated `JSON.parse` and search indexing stalls on the UI thread by implementing a Web Worker for all heavy data operations.
- **Fullscreen iframe remount**: `GameView.tsx` no longer conditionally restructures the player DOM or keys inner wrappers on fullscreen toggles. The iframe stays mounted in a stable React tree; the Fullscreen API targets `playerContainerRef` only, preserving in-game state on exit.
- **ESC fullscreen desync**: A `fullscreenchange` listener syncs React UI state when the browser exits fullscreen natively (e.g. ESC), preventing grey-screen UI drift.
- **Mobile touch "hidden wall"**: Absolute overlay containers (control bar, ad wrapper) use `pointer-events-none` on outer wrappers. `pointer-events-auto` is applied only to interactive `<button>` elements and the `#game-ad-container` mount point.
- **Native Player Aspect Ratio**: Resolved iframe squishing/leaking UI by deriving container `aspectRatio` from parsed `game.width` / `game.height` strings.
- **GameMonetize SDK duplication**: Query for existing scripts and honor already-loaded SDK state on remount to avoid memory leaks or missed events.

## Known Remaining Bugs
1. **Mobile Rotation**: Game player canvas may still not resize perfectly on some devices during orientation change.
2. **z-index Conflict**: The "Skip Ad" button from GameMonetize is sometimes hidden behind our custom fullscreen button.

## Strict Rules — Never Break
- **No SSR**: Never add server-side API routes, `cookies()`, or `headers()`.
- **Static First**: Always add `export const dynamic = 'force-static'` to new page files.
- **Client Safety**: Always wrap `useSearchParams()` in a `<Suspense>` boundary.
- **Storage Privacy**: `localStorage` keys must be user-scoped: `yori_${uid}_keyname`.
- **Clean Sitemaps**: Use `MetadataRoute.Sitemap` for native pure XML generation.
- **Stable Game Iframe**: Never unmount/remount the game iframe on fullscreen or resize events; use a single stable container ref.
- **Lazy Grid by Default**: All large game grids must use `LazyGrid`.

## What Does NOT Exist (Deleted / Non-Existent)
- `src/app/(main)/`: This folder and its separate layout were removed to fix parallel route conflicts.
- `src/app/api/search-index/route.ts`: Renamed to `_route.ts` to prevent build failures.
- Virtualization Libraries: Code audit confirmed `react-window` is unnecessary as all grids are capped at 50 items per page.
