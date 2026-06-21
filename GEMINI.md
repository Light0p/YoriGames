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
- **Flat Route Structure**: All pages are located directly in `src/app/`. No `(main)` route group exists.
- **Data Layer**: Game data is fetched once from `public/games.json` and managed via a Web Worker.
- **Pure XML Sitemap**: `sitemap.ts` uses `MetadataRoute.Sitemap` for native pure XML generation.
- **Ghost Mode SDK**: GameMonetize SDK is deferred until user interaction via `DeferredGameMonetizeSDK.tsx` to maximize site speed and user experience.

## Completed Work (Confirmed via Git Log)
- Implemented **Ghost Mode** SDK optimization: deferred GameMonetize script loading and removed layout-blocking ad containers.
- Fixed service worker chunk-mismatch crash ('e[o] is not a function') by implementing a `controllerchange` reload listener in the root layout.
- Added high-performance fuzzy search with `Fuse.js` and client-side pagination.
- Restored the Profile page with client-side authentication and avatar uploads.
- Implemented `useArcadeState.ts` for UID-scoped `localStorage` (Favorites/Recent).
- Added "Share" and "About Game" actions to the Game View player.
- Configured native Next.js sitemap to prevent HTML injection.
- **Off-Thread Data Pipeline**: Moved `games.json` fetch, parse, and `Fuse.js` indexing to a dedicated Web Worker (`src/workers/gameData.worker.ts`).
- **Stable Background Rendering**: Fixed `GalaxyBackground` re-render bug via stable `useMemo` data and `React.memo`.

## Known Remaining Bugs
1. **Mobile Rotation**: Game player canvas may still not resize perfectly on some devices during orientation change.
2. **z-index Conflict**: The "Skip Ad" button from GameMonetize is sometimes hidden behind our custom fullscreen button.
3. **ESC fullscreen desync**: ESC key exit sometimes results in a grey screen; UI needs a `fullscreenchange` listener sync.

## Strict Rules — Never Break
- **No SSR**: Never add server-side API routes, `cookies()`, or `headers()`.
- **Static First**: Always add `export const dynamic = 'force-static'` to new page files.
- **Client Safety**: Always wrap `useSearchParams()` in `<Suspense>` boundary.
- **Storage Privacy**: `localStorage` keys must be user-scoped: `yori_${uid}_keyname`.
- **Clean Sitemaps**: Use `MetadataRoute.Sitemap` for native pure XML generation.
- **Stable Game Iframe**: Never unmount/remount the game iframe on fullscreen or resize events.
- **Lazy Grid by Default**: All large game grids must use `LazyGrid`.

## What Does NOT Exist (Deleted / Non-Existent)
- `src/app/(main)/`: This folder does not exist in this version.
- `src/app/api/search-index/route.ts`: Renamed to `_route.ts`.
