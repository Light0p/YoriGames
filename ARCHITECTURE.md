# YoriGames — Technical Architecture Documentation

**Last Verified:** 2026-06-22

## SECTION 1: Executive Project Summary
YoriGames is a static, high-performance arcade for indie pixel-art games.
- **Target Journey:** Land on home -> Discovery via AI or Category -> Instant Play in Iframe -> Save to Favorites.
- **Architecture Benefit:** `output: 'export'` ensures zero server costs and instant edge-loading via CDNs (Vercel/Cloudflare).
- **Technical Boundaries:** No Node.js runtime. No Server Actions. No Middleware. No dynamic headers.

## SECTION 2: Architecture Decision Record (ADR)

**Decision:** Static Export (`output: 'export'`)
**Why:** Eliminate operational costs and maximize speed for a catalog of 5,000+ games.

**Decision:** Web Worker Data Pipeline (`gameData.worker.ts`)
**Why:** Parsing a 1.2MB+ JSON file and building a Fuse.js index for 5,000 items is a synchronous task that blocks the main thread.
**Consequence:** UI remains interactive during data load; fuzzy search does not cause frame drops.

**Decision:** Unitary Root Layout
**Why:** Simplifies route management and prevents parallel page conflicts.
**Consequence:** Sitemap purity must be maintained via `MetadataRoute.Sitemap`.

**Decision:** Stable Game Iframe Shell (`GameView.tsx`)
**Why:** Fullscreen toggles and orientation changes must not restart games.
**Consequence:** One persistent `playerContainerRef` drives the native Fullscreen API; the `<iframe>` never unmounts.

**Decision:** Memoized Visual Background (`GalaxyBackground.tsx`)
**Why:** The complex star field uses `Math.random()` and trig logic. Without memoization, elements "jump" on parent re-renders.
**Consequence:** Background is computationally cheap after initial mount; visual stability is preserved.

## SECTION 3: Folder & File Structure

```text
src/
├── ai/                     # Genkit AI flows for game discovery
├── app/
│   ├── layout.tsx          # Heavy Root Layout (Providers + Scripts)
│   ├── sitemap.ts          # XML Generator (MetadataRoute.Sitemap)
│   ├── games/              # Individual game player and directory
│   ├── search/             # Off-thread fuzzy search interface
│   └── ...                 # Other static routes
├── components/
│   ├── ai/                 # AI Search components
│   ├── game/               # Iframe player logic
│   ├── layout/             # Navigation, Backgrounds, SDK deferral
│   ├── pixel/              # GameCard, GameGrid, LazyGrid primitives
├── context/
│   └── GameContext.tsx     # Worker integration & global state
├── hooks/                  # useArcadeState & useGameDataWorker
├── lib/                    # Data utilities & image compression
├── workers/                # gameData.worker.ts (Search/Parse logic)
└── types/                  # TypeScript interfaces
```

## SECTION 4: Complete Tech Stack

- **Next.js 15.5.9**: Uses App Router with `generateStaticParams` for 5,000+ game pages.
- **Firebase 11.9.1**: Handles Auth (Google/Email) and Firestore (Global Stats).
- **Fuse.js 7.0.0**: High-performance fuzzy search running in a Web Worker.
- **GameMonetize SDK**: Deferred via `DeferredGameMonetizeSDK` (interaction or 5s fallback).

## SECTION 5: Data Flow

**Flow: Game Discovery & Search**
1. `GameProvider` spawns `gameData.worker.ts`.
2. Worker fetches `/games.json` -> `JSON.parse` -> Normalize -> Builds Fuse index.
3. Worker sends `allGames` back to `GameContext` (Main thread).
4. User types in `SearchContent.tsx` -> `searchGames(query)` called via context.
5. `useGameDataWorker` hook debounces query and sends `postMessage` to worker.
6. Worker executes Fuse search -> returns `results` via `id`-tracked message.
7. UI renders `results` without ever blocking the main thread for indexing or heavy filtering.

**Flow: Fullscreen (Client-Only)**
1. User clicks Fullscreen -> `requestFullscreen()` on `playerContainerRef`.
2. Browser applies native `:fullscreen` styling via Tailwind arbitrary variants.
3. `fullscreenchange` listener syncs React state; iframe is never remounted.

## SECTION 6: Rules for Future Development

**NEVER DO:**
- Add `api/` routes that require a Node.js runtime.
- Perform `JSON.parse` or heavy `Fuse.js` operations on the main thread for datasets >1MB.
- Put `pointer-events-auto` on full-size absolute wrapper divs above the game iframe.
- Re-generate `GalaxyBackground` elements on re-render (use stable memoized data).

**ALWAYS DO:**
- Use `force-static` on new routes.
- Wrap `useSearchParams()` in `<Suspense>`.
- Use `LazyGrid` for any grid listing more than ~12 games.
- Add `decoding="async"` and tight `sizes` on thumbnail `next/image` components.

## SECTION 7: Bugs Already Fixed (Performance)

- **Main Thread Blocking**: Off-loaded JSON parsing and search indexing to a Web Worker.
- **Visual Jitter**: Memoized `GalaxyBackground` to prevent star repositioning during normalization yields.
- **DOM Bloat**: Implemented `IntersectionObserver` lazy-mounting for cards, while keeping pagination slices small (≤50 items).
