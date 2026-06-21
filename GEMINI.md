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
- **IntersectionObserver lazy grids**: `LazyGrid.tsx` defers mounting game cards until slots enter (or near) the viewport. Used by `GameGrid`, Home strips (`GameStrip`, `YourArcade`), Search, and Category/arcade pages — prevents DOM bloat during fast mobile scrolling.
- **Async image decoding**: All `GameCard` thumbnails use `loading="lazy"` and `decoding="async"` with tight `sizes` hints (`110px`–`180px`) so the main thread is not blocked decoding high-res art for tiny tiles.
- **Chunked library normalization**: `GameProvider` processes `games.json` in 250-item batches via `requestIdleCallback` / `setTimeout` yields (`yieldToMain.ts`) so the Hero UI paints before 5,000+ records finish normalizing.
- **Deferred SDK initialization**: GameMonetize `sdk.js` removed from eager `layout.tsx` `<Script>` load. `DeferredGameMonetizeSDK` loads after first scroll/click/touch/keydown or 5s fallback — improves LCP/FID. AdSense moved to `strategy="lazyOnload"`.

## Bugs Already Fixed
- **Fullscreen iframe remount**: `GameView.tsx` no longer conditionally restructures the player DOM or keys inner wrappers on fullscreen toggles. The iframe stays mounted in a stable React tree; the Fullscreen API targets `playerContainerRef` only, preserving in-game state on exit.
- **ESC fullscreen desync**: A `fullscreenchange` listener syncs React UI state when the browser exits fullscreen natively (e.g. ESC), preventing grey-screen UI drift.
- **Mobile touch "hidden wall"**: Absolute overlay containers (control bar, ad wrapper) use `pointer-events-none` on outer wrappers. `pointer-events-auto` is applied only to interactive `<button>` elements and the `#game-ad-container` mount point. No forced `w-full`/`h-full` on the ad container — the GameMonetize SDK dictates ad size when injected.
- **Portrait orientation lock removed**: CSS-forced mobile rotation prompts were removed to support native portrait HTML5 games (e.g. Subway Surfers). Player sizing relies on Tailwind `w-full h-full` and native `:fullscreen` styles.
- **Dynamic native aspect ratio**: Resolved iframe squishing/leaking UI by removing hardcoded Tailwind aspect classes. `GameView.tsx` parses `game.width` / `game.height` strings for inline `aspectRatio`, with portrait games centered via `h-[70dvh] w-auto` and landscape games using `w-full`.
- **GameMonetize SDK script duplication / memory leak**: `GameView.tsx` queries `script[src*="gamemonetize.com/sdk.js"]` before append; if `window.GameMonetize` exists, the iframe mounts immediately instead of re-injecting or missing a stale `gmSDKReady` event.
- **SEO heading hierarchy**: "Suggested Missions" is no longer an `<h2>` appearing before the page `<h1>` (game title); section labels use styled `<div>` elements to preserve correct H1 → H2 document order.
- **Falsy-zero ratings**: Game rating display uses nullish coalescing (`game.rating ?? 5.0`) so a legitimate `0` rating is not replaced with `5.0`.
- **Empty iframe src guard**: Games missing both `iframe_url` and `url` show a "Game Link Unavailable" fallback instead of rendering an iframe with an empty `src`.

## Known Remaining Bugs
1. **Mobile Rotation**: Game player canvas may still not resize perfectly on some devices during orientation change (no forced lock; relies on natural CSS).
2. **z-index Conflict**: The "Skip Ad" button from GameMonetize is sometimes hidden behind our custom fullscreen button.
3. **Fuse.js cold start**: First search after library load may still spike briefly while the index builds (mitigated by chunked normalization, not eliminated).

## Strict Rules — Never Break
- **No SSR**: Never add server-side API routes, `cookies()`, or `headers()`.
- **Static First**: Always add `export const dynamic = 'force-static'` to new page files.
- **Client Safety**: Always wrap `useSearchParams()` in a `<Suspense>` boundary.
- **Storage Privacy**: `localStorage` keys must be user-scoped: `yori_${uid}_keyname`.
- **Clean Sitemaps**: Keep scripts and providers only in `layout.tsx`; verify `sitemap.xml` remains valid XML.
- **Stable Game Iframe**: Never unmount/remount the game iframe on fullscreen or resize events; use a single stable container ref and native Fullscreen API.
- **Pointer Events on Overlays**: Absolute player overlays must use `pointer-events-none` on wrappers; only buttons and SDK-injected ad UI may use `pointer-events-auto`. Never apply full-size dimensions to empty ad mount containers.
- **Native Player Aspect Ratio**: Derive container `aspectRatio` from parsed `game.width` / `game.height` strings — never hardcode a single Tailwind aspect class for all games.
- **SDK Script Idempotency**: Never append duplicate GameMonetize `sdk.js` tags; query for existing scripts and honor already-loaded SDK state on remount.
- **Heading Order**: Page `<h1>` (game title) must appear before any `<h2>` in the DOM; use non-heading elements for decorative section labels above the fold.
- **Lazy Grid by Default**: All large game grids must use `LazyGrid` — never map-render hundreds of `GameCard` nodes eagerly.
- **Defer Non-Critical Scripts**: Ad/analytics SDKs load after interaction or idle — never block Hero paint.

## What Does NOT Exist (Deleted / Non-Existent)
- `src/app/(main)/`: This folder and its separate layout were removed to fix parallel route conflicts.
- `src/app/api/search-index/route.ts`: This was renamed to `_route.ts` or disabled to prevent static build failures.
- `FirebaseErrorListener.tsx`: Functionality was merged into the provider.
