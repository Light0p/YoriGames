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
**Consequence:** One persistent `playerContainerRef` drives the native Fullscreen API; the `<iframe>` never unmounts on UI state changes. Sizing uses Tailwind (`w-full h-full`, `[&:fullscreen]:…`) — no imperative DOM resize hacks. Portrait orientation locks are not used; portrait-native HTML5 games are supported.

**Decision:** Click-Through Overlay Pattern (Game Player)
**Why:** Absolute-positioned ad and control layers above the iframe were trapping mobile touch events ("hidden wall").
**Consequence:** Outer overlay wrappers use `pointer-events-none`. Only `<button>` elements and `#game-ad-container` (SDK-sized, no forced full dimensions) use `pointer-events-auto`.

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
│   ├── layout/             # Navigation and Backgrounds
│   ├── pixel/              # Pixel-art UI primitives
│   └── sections/           # Homepage layout blocks
├── context/
│   └── GameContext.tsx     # Global game state & library loader
├── firebase/               # Firebase SDK initialization and hooks
├── hooks/                  # useArcadeState (Storage) & useMobile
├── lib/                    # Data utilities & image compression
└── types/                  # TypeScript interfaces for Games/Users
```

## SECTION 4: Complete Tech Stack

- **Next.js 15.5.9**: Uses App Router with `generateStaticParams` for 5,000+ game pages.
- **Firebase 11.9.1**: Handles Auth (Google/Email) and Firestore (Global Stats).
- **Tailwind CSS 3.4.1**: Uses a "Neon Arcade" palette defined in `globals.css`.
- **GameMonetize SDK**: Injected via `next/script` in the root layout.

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

**Flow: Touch / Pointer Hit Testing (Game Player)**
1. Game iframe sits at `z-10` and receives all default touch input.
2. Ad wrapper (`absolute inset-0 z-40`) is `pointer-events-none`; passes touches through to iframe.
3. `#game-ad-container` is `pointer-events-auto` with `inline-block w-auto h-auto` — zero footprint until SDK injects ad UI.
4. Top-right control bar outer shell is `pointer-events-none`; only Fullscreen/Share `<button>` nodes are `pointer-events-auto touch-manipulation`.

## SECTION 6: Rules for Future Development

**NEVER DO:**
- Add `api/` routes that require a Node.js runtime.
- Use `next/image` without `unoptimized: true` (Export requirement).
- Use `cookies()` or `headers()` in any component.
- Conditionally render or re-key the game `<iframe>` on fullscreen, resize, or orientation events.
- Add CSS-forced portrait/landscape locks that block native portrait HTML5 games.
- Put `pointer-events-auto` on full-size absolute wrapper divs above the game iframe.
- Apply `w-full h-full` (or block-level stretch) to empty `#game-ad-container` — it creates an invisible touch wall on mobile.

**ALWAYS DO:**
- Use `force-static` on new routes.
- Wrap `useSearchParams()` in `<Suspense>`.
- Scope `localStorage` to the current `uid`.
- Keep ad mount wrappers as `pointer-events-none`; let SDK-injected nodes handle their own hit targets.
- Place player controls (Fullscreen, Share) in a top-right bar: outer `pointer-events-none`, buttons `pointer-events-auto` only.

## SECTION 7: Bugs Already Fixed (Game Player)

- **Iframe unmount on fullscreen exit**: Resolved by keeping a stable React tree and using the Fullscreen API on a single container ref instead of conditional JSX/layout keys.
- **CSS-forced mobile orientation locks removed**: Portrait HTML5 games (e.g. endless runners) now play naturally without a rotate-device overlay.
- **Mobile touch "hidden wall"**: Resolved by applying `pointer-events-none` to absolute overlay wrappers and `pointer-events-auto` only to interactive buttons and the SDK ad mount point (no forced full-size ad container).
