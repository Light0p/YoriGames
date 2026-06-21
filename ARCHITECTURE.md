# YoriGames — Technical Architecture Documentation

**Last Verified:** 2024-03-22

## SECTION 1: Executive Project Summary
YoriGames is a static, high-performance arcade for indie pixel-art games.
- **Target Journey:** Land on home -> Discovery via AI or Category -> Instant Play in Iframe -> Save to Favorites.
- **Architecture Benefit:** `output: 'export'` ensures zero server costs and instant edge-loading via CDNs.
- **Technical Boundaries:** No Node.js runtime. No Server Actions. No Middleware. No dynamic headers.

## SECTION 2: Architecture Decision Record (ADR)

**Decision:** Static Export (`output: 'export'`)
**Why:** Eliminate operational costs and maximize speed for a catalog of 5,000+ games.

**Decision:** Web Worker Data Pipeline (`gameData.worker.ts`)
**Why:** Parsing a 1.2MB+ JSON file and indexing 5,000 items blocks the main thread.
**Consequence:** UI remains interactive during data load; search does not cause frame drops.

**Decision:** Unitary Root Layout
**Why:** Prevents parallel page conflicts and simplifies route management for static output.

**Decision:** native PWA Sync Logic
**Why:** Resolves Webpack chunk-mismatch errors by forcing a reload when the Service Worker updates.

## SECTION 3: Folder & File Structure

```text
src/
├── ai/                     # Genkit AI flows for game discovery
├── app/
│   ├── layout.tsx          # Root Layout (Providers + Scripts + SW Reg)
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
- **Next.js 15.5.9**: Uses App Router with `generateStaticParams`.
- **Firebase 11.9.1**: Handles Auth and Firestore (Global Stats).
- **Fuse.js 7.0.0**: Fuzzy search running in a Web Worker.
- **GameMonetize SDK**: Deferred via `DeferredGameMonetizeSDK`.

## SECTION 5: Data Flow
**Flow: Game Discovery & Search**
1. `GameProvider` spawns `gameData.worker.ts`.
2. Worker fetches `/games.json` -> `JSON.parse` -> Builds Fuse index.
3. Worker sends `allGames` to main thread.
4. User types -> `searchGames(query)` posts message to worker -> worker returns results.

**Flow: PWA Update**
1. New deploy triggers browser to find new SW version.
2. New SW calls `skipWaiting()`.
3. Client layout listens for `controllerchange` -> calls `window.location.reload()`.
4. Page reloads with new JS bundles, preventing "e[o] is not a function" crash.

## SECTION 6: Rules for Future Development
**NEVER DO:**
- Add `api/` routes that require a Node.js runtime.
- Perform heavy `Fuse.js` operations on the main thread.
- Put `pointer-events-auto` on full-size absolute wrapper divs above the iframe.

**ALWAYS DO:**
- Use `force-static` on new routes.
- Wrap `useSearchParams()` in `<Suspense>`.
- Use `LazyGrid` for any grid listing more than ~12 games.
- Add `decoding="async"` to thumbnails.

## SECTION 7: Bugs Already Fixed
- **GalaxyBackground Jitter**: Memoized random generation to prevent star repositioning.
- **Main Thread Blocking**: Off-loaded JSON parsing and search indexing to a Web Worker.
- **Service Worker Stale Runtime**: Implemented client-side reload on worker activation to sync JS bundles.
