# YoriGames — Technical Architecture Documentation

**Last Verified:** 2026-06-21

## SECTION 1: Executive Project Summary
YoriGames is a static, high-performance arcade for indie pixel-art games.
- **Target Journey:** Land on home -> Discovery via AI or Category -> Instant Play in Iframe -> Save to Favorites.
- **Architecture Benefit:** `output: 'export'` ensures zero server costs and instant edge-loading via CDNs (Vercel/Cloudflare).
- **Technical Boundaries:** No Node.js runtime. No Server Actions. No Middleware. No dynamic headers.

## SECTION 2: Architecture Decision Record (ADR)

**Decision:** Static Export (`output: 'export'`)
**Why:** Eliminate operational costs and maximize speed for a catalog of 5,000+ games.
**Consequence:** All dynamic logic must be client-side.
**Alternatives rejected:** SSR (rejected due to latency and cost).

**Decision:** Unitary Root Layout
**Why:** Simplifies route management and prevents parallel page conflicts seen in complex route group attempts.
**Consequence:** Sitemap purity must be maintained via `MetadataRoute.Sitemap`.

**Decision:** Client-Side Library Fetch (`games.json`)
**Why:** Passing 5,000 games as page props exceeds hydration limits.
**Consequence:** Library is fetched once on mount and stored in `GameContext.tsx`.

**Decision:** Stable Game Iframe Shell (`GameView.tsx`)
**Why:** Fullscreen toggles and orientation changes must not restart games or trap pointer/touch events.
**Consequence:** One persistent `playerContainerRef` drives the native Fullscreen API; the `<iframe>` never unmounts on UI state changes. Sizing uses inline `aspectRatio` from parsed game dimensions — no imperative DOM resize hacks. Portrait orientation locks are not used; portrait-native HTML5 games are supported.

**Decision:** Click-Through Overlay Pattern (Game Player)
**Why:** Absolute-positioned ad and control layers above the iframe were trapping mobile touch events ("hidden wall").
**Consequence:** Outer overlay wrappers use `pointer-events-none`. Only `<button>` elements and `#game-ad-container` (SDK-sized, no forced full dimensions) use `pointer-events-auto`.

**Decision:** Dynamic Native Aspect Ratio (Game Player)
**Why:** Hardcoded Tailwind aspect classes forced landscape games into portrait containers (and vice versa), causing iframe squishing and in-game UI leaking outside bounds.
**Consequence:** Parse optional `game.width` / `game.height` strings with `parseInt`; set `style={{ aspectRatio: width/height }}` on `playerContainerRef`. Portrait (`ratio < 1`): `h-[70dvh] w-auto max-w-full`, centered in a flex wrapper. Landscape: `w-full`. Fallback ratio: `16/9` when dimensions are missing or invalid.

**Decision:** Idempotent GameMonetize SDK Loading
**Why:** `GameView` remounts and root layout both load `sdk.js`; duplicate script tags and missed `gmSDKReady` events caused memory leaks and stuck loaders.
**Consequence:** Query `script[src*="gamemonetize.com/sdk.js"]` before append; if `window.GameMonetize` exists, mount iframe immediately. Never render `<iframe src="">` — guard with a fallback UI when both URL fields are absent.

**Decision:** Performance Overhaul — Lazy Grids, Chunked Data, Deferred SDK
**Why:** Mobile scroll felt choppy due to DOM bloat (hundreds of cards mounted at once), main-thread blocks during 5,000-item normalization, and eager ad SDK loading competing with Hero paint.
**Consequence:**
- `LazyGrid.tsx` uses `IntersectionObserver` (`rootMargin: 200px`) to mount cards only when near viewport.
- `GameProvider` normalizes library in 250-item chunks with `yieldToMain()` between batches.
- `DeferredGameMonetizeSDK` loads on first interaction or 5s timeout; dispatches `gmSDKReady` for `GameView` compatibility.
- `GameCard` images use `decoding="async"` and tight `sizes` for thumbnail tiles.

## SECTION 3: Folder & File Structure

```text
src/
├── ai/                     # Genkit AI flows for game discovery
├── app/
│   ├── layout.tsx          # Heavy Root Layout (Providers + Scripts) - Next.js Special
│   ├── page.tsx            # Homepage - Next.js Special
│   ├── games/              # Individual game player and directory
│   ├── profile/            # User profile (Client-side Auth)
│   ├── search/             # Fuzzy search interface
│   ├── sitemap.ts          # XML Generator - Next.js Special
│   └── robots.ts           # Robots.txt - Next.js Special
├── components/
│   ├── ai/                 # AI Search components
│   ├── game/               # Iframe player logic
│   ├── layout/             # Navigation, DeferredGameMonetizeSDK, Backgrounds
│   ├── pixel/              # GameCard, GameGrid, LazyGrid primitives
│   └── sections/           # Homepage layout blocks
├── context/
│   └── GameContext.tsx     # Global game state & chunked library loader
├── firebase/               # Firebase SDK initialization and hooks
├── hooks/                  # useArcadeState (Storage) & useMobile
├── lib/                    # yieldToMain, data utilities & image compression
└── types/                  # TypeScript interfaces for Games/Users
```

## SECTION 4: Complete Tech Stack

- **Next.js 15.5.9**: Uses App Router with `generateStaticParams` for 5,000+ game pages.
- **Firebase 11.9.1**: Handles Auth (Google/Email) and Firestore (Global Stats).
- **Tailwind CSS 3.4.1**: Uses a "Neon Arcade" palette defined in `globals.css`.
- **GameMonetize SDK**: Deferred via `DeferredGameMonetizeSDK` (interaction or 5s fallback).

## SECTION 5: Data Flow

**Flow: Game Play & Persistence**
1. User clicks game -> `src/app/games/[slug]/page.tsx` renders.
2. `GameView.tsx` mounts iframe -> after 5s, `recordPlay()` increments global Firestore count.
3. `addRecent()` writes to `localStorage` using `yori_recent_${uid}`.
4. `Navbar.tsx` reflects the updated history via `useArcadeState` hook.

**Flow: Fullscreen (Client-Only)**
1. User clicks Fullscreen -> `requestFullscreen()` on `playerContainerRef`.
2. Browser applies native `:fullscreen` styling via Tailwind arbitrary variants.
3. `fullscreenchange` listener syncs React control icons; iframe is never remounted.
4. ESC exit clears React state without reloading the game document inside the iframe.
5. On programmatic fullscreen failure, React state syncs via `setIsFullscreen(!!getFullscreenElement())` — never hardcode `false`.

**Flow: Touch / Pointer Hit Testing (Game Player)**
1. Game iframe sits at `z-10` and receives all default touch input.
2. Ad wrapper (`absolute inset-0 z-40`) is `pointer-events-none`; passes touches through to iframe.
3. `#game-ad-container` is `pointer-events-auto` with `inline-block w-auto h-auto` — zero footprint until SDK injects ad UI.
4. Top-right control bar outer shell is `pointer-events-none`; only Fullscreen/Share `<button>` nodes are `pointer-events-auto touch-manipulation`.

**Flow: Dynamic Player Layout**
1. Parse `game.width` / `game.height` (optional strings) via `parseInt(..., 10)`.
2. Compute `numericRatio = width / height`; fallback to `16/9` if invalid.
3. Portrait (`ratio < 1`): container uses `h-[70dvh] md:h-[75dvh] w-auto max-w-full`, centered in `flex justify-center` wrapper.
4. Landscape: container uses `w-full` with inline `aspectRatio`.
5. Inner wrapper: `w-full h-full relative`; iframe: `absolute inset-0 w-full h-full`.
6. Fullscreen: `[&:fullscreen]:!h-[100dvh] !w-[100dvw] !aspect-auto`.

**Flow: Lazy Grid Rendering**
1. Page passes game array to `LazyGrid` (or `GameGrid` wrapper).
2. Each slot renders a lightweight pulse placeholder until `IntersectionObserver` fires.
3. Card + `next/image` mount only when within ~200px of viewport.
4. Observer disconnects after first intersection (no ongoing overhead).

**Flow: Chunked Library Load (`GameProvider`)**
1. Fetch `/games.json` once on mount.
2. Normalize tags/slugs in batches of 250 via `normalizeLibraryInChunks()`.
3. `yieldToMain()` (`requestIdleCallback` or `setTimeout(0)`) between batches.
4. Single `setAllGames()` when complete; Fuse.js index builds on finalized array.

**Flow: Deferred GameMonetize SDK**
1. `layout.tsx` mounts `<DeferredGameMonetizeSDK />` — no eager `<Script>` for GM SDK.
2. Listen for scroll, click, touchstart, keydown (capture, passive).
3. On first event OR 5s timeout: inject `sdk.js` if absent, dispatch `gmSDKReady`.
4. `GameView` listens for `gmSDKReady` or detects existing `window.GameMonetize`.

## SECTION 6: Rules for Future Development

**NEVER DO:**
- Add `api/` routes that require a Node.js runtime.
- Use `next/image` without `unoptimized: true` (Export requirement).
- Use `cookies()` or `headers()` in any component.
- Conditionally render or re-key the game `<iframe>` on fullscreen, resize, or orientation events.
- Add CSS-forced portrait/landscape locks that block native portrait HTML5 games.
- Put `pointer-events-auto` on full-size absolute wrapper divs above the game iframe.
- Apply `w-full h-full` (or block-level stretch) to empty `#game-ad-container` — it creates an invisible touch wall on mobile.
- Hardcode a single Tailwind `aspect-*` class on the player for all games — each HTML5 game has its own native dimensions.
- Append duplicate GameMonetize SDK script tags on component remount.
- Render `<iframe src="">` when game URLs are missing.
- Place `<h2>` (or higher) section headings above the page `<h1>` in the DOM.
- Use `||` for numeric defaults where `0` is a valid value — prefer `??`.
- Eagerly map-render 50+ game cards without `LazyGrid`.
- Load ad SDKs with `afterInteractive` if they are not required for first paint.

**ALWAYS DO:**
- Use `force-static` on new routes.
- Wrap `useSearchParams()` in `<Suspense>`.
- Scope `localStorage` to the current `uid`.
- Keep ad mount wrappers as `pointer-events-none`; let SDK-injected nodes handle their own hit targets.
- Place player controls (Fullscreen, Share) in a top-right bar: outer `pointer-events-none`, buttons `pointer-events-auto` only.
- Derive player `aspectRatio` from parsed `game.width` / `game.height`; portrait vs landscape layout via `isPortrait` boolean.
- Memoize discovery shuffle helpers with `useCallback` and include them in effect dependency arrays.
- Use `LazyGrid` for any grid listing more than ~12 games.
- Add `decoding="async"` and tight `sizes` on thumbnail `next/image` components.
- Chunk heavy client-side data transforms with `yieldToMain()`.

## SECTION 7: Bugs Already Fixed (Game Player)

- **Iframe unmount on fullscreen exit**: Resolved by keeping a stable React tree and using the Fullscreen API on a single container ref instead of conditional JSX/layout keys.
- **CSS-forced mobile orientation locks removed**: Portrait HTML5 games (e.g. endless runners) now play naturally without a rotate-device overlay.
- **Mobile touch "hidden wall"**: Resolved by applying `pointer-events-none` to absolute overlay wrappers and `pointer-events-auto` only to interactive buttons and the SDK ad mount point (no forced full-size ad container).
- **Iframe squishing / leaking UI**: Resolved by dynamic native `aspectRatio` from parsed `game.width` / `game.height` strings, with distinct portrait vs landscape layouts.
- **GameMonetize SDK duplication / memory leak**: Resolved by idempotent script detection and immediate mount when `window.GameMonetize` is already loaded on remount.
- **SEO heading hierarchy (H1/H2 order)**: "Suggested Missions" demoted from `<h2>` to a styled `<div>` so the game title `<h1>` is the first heading in document order.
- **Falsy-zero ratings**: `(game.rating ?? 5.0)` preserves a legitimate zero rating display.

## SECTION 8: Performance Overhaul (Site-Wide)

- **IntersectionObserver lazy grids**: `LazyGrid.tsx` prevents DOM bloat on Home, Search, Category, and Games pages — cards mount only when scrolled into view.
- **Chunked data processing**: `GameProvider` normalizes 5,000+ games in 250-item batches with idle yields — UI stays responsive during library hydration.
- **Deferred SDK initialization**: GameMonetize loads after first user interaction or 5s delay; AdSense uses `lazyOnload` — improves Core Web Vitals (LCP/FID) by prioritizing Hero render.
- **Async thumbnail decoding**: `GameCard` uses `decoding="async"` and pixel-accurate `sizes` to avoid main-thread decode stalls during rapid scroll.
