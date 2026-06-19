# YoriGames — Technical Architecture Documentation

## SECTION 1: Executive Project Summary
**Product Definition:**
YoriGames is a high-performance, web-native arcade platform specializing in indie pixel-art games. It offers an "instant-play" experience with zero installation, optimized for both desktop and mobile browsers.

**Target Users & Core Journey:**
The platform targets casual gamers and indie enthusiasts. The core journey is:
1. **Landing:** User arrives at the homepage (`src/app/(main)/page.tsx`).
2. **Discovery:** User finds a game via AI search (`ArcadeInsightTool.tsx`) or filtered categories.
3. **Engagement:** User plays via `GameView.tsx` which embeds a GameMonetize iframe.
4. **Persistence:** User saves favorites or views history, managed via `useArcadeState.ts`.

**Architecture Benefits:**
The `output: 'export'` (Static Site Generation) architecture was chosen to ensure:
- **Zero Server Costs:** Hosted entirely on static CDNs (Vercel/Cloudflare).
- **Extreme Speed:** Pages are pre-rendered HTML, served instantly from the edge.
- **Scalability:** Handles 5,000+ games without a database bottleneck on initial render.

**Hard Technical Boundaries:**
Because of the static export, the following are **impossible** to implement directly:
- Node.js API Routes (Serverless functions work, but standard Next.js `api/` routes are excluded from export).
- `cookies()` or `headers()` inside Server Components.
- Middleware (`middleware.ts`).
- Incremental Static Regeneration (ISR) with revalidate timers (requires a running server).

---

## SECTION 2: Architecture Decision Record (ADR)

**Decision:** Static Export (`output: 'export'`)
- **Why:** To eliminate operational costs and maximize load speed for a game-heavy site.
- **Consequence:** All data must be available at build time or fetched via client-side APIs.
- **Alternatives rejected:** SSR (rejected due to server costs and latency).

**Decision:** Route Group `(main)` Isolation
- **Why:** To prevent `next/script` (AdSense, SDKs) from injecting tags into `sitemap.xml`.
- **Consequence:** All UI pages live in `src/app/(main)/`. Root `layout.tsx` is kept "naked".
- **Alternatives rejected:** Putting scripts in Root Layout (caused XML syntax errors in sitemaps).

**Decision:** Client-Side Library Fetch (`games.json`)
- **Why:** Passing 5,000 games as props to a component exceeds safe hydration limits.
- **Consequence:** The library is fetched once as a 1MB+ JSON and stored in `GameContext.tsx`.

**Decision:** UID-Scoped LocalStorage
- **Why:** To provide immediate data persistence without waiting for Firebase Firestore sync.
- **Consequence:** Keys are formatted as `yori_favs_${uid}` to prevent cross-account leakage.

---

## SECTION 3: Complete Folder & File Structure

```text
src/
├── ai/                     # Genkit AI flows for search and recommendations
├── app/
│   ├── layout.tsx          # Minimal Root Shell (HTML/Body only) - Special File
│   ├── sitemap.ts          # Pure XML Sitemap generator - Special File
│   ├── robots.ts           # Robots.txt configuration - Special File
│   └── (main)/             # Route Group: UI and Scripts isolation
│       ├── layout.tsx      # Heavy Layout: Providers, Scripts, Fonts
│       ├── page.tsx        # Homepage
│       ├── games/          # Game library and individual game pages
│       ├── profile/        # User dashboard (Client-side Auth)
│       └── search/         # Fuzzy search and hashtag results
├── components/
│   ├── ai/                 # AI-powered UI components
│   ├── game/               # Iframe player and walkthrough components
│   ├── layout/             # Navbar, Footer, Backgrounds
│   ├── pixel/              # Pixel-art styled buttons and cards
│   └── ui/                 # ShadCN primitive components
├── context/
│   └── GameContext.tsx     # Global game state and library manager
├── firebase/
│   ├── config.ts           # Firebase SDK initialization
│   ├── provider.tsx        # Context for Auth/Firestore access
│   └── auth/               # User state hooks
├── hooks/
│   └── useArcadeState.ts   # LocalStorage & Persistence logic
├── lib/
│   ├── games.ts            # Server-side data processing (Build-time)
│   └── utils.ts            # Tailwind merging and array shufflers
└── types/
    └── game.ts             # Global TypeScript interfaces
```

---

## SECTION 4: Complete Tech Stack

**Next.js 15.5.9 (App Router):**
- **Features Used:** Route Groups `(main)`, `generateStaticParams` for 5,000+ paths, `generateMetadata` for SEO.
- **Intentionally Omitted:** Server Actions (incompatible with full static export).

**Firebase (v11.9.1):**
- **Auth:** Handles Google and Email/Password sessions.
- **Firestore:** Syncs user profiles and global `totalPlays` count.
- **Storage:** Stores user avatars compressed via `image-compression.ts`.

**Tailwind CSS (v3.4.1):**
- **Theme:** Uses HSL variables in `globals.css` with a "Neon Arcade" palette (`#A855F7`, `#EC4899`).
- **Icons:** Exclusively uses `lucide-react`.

**GameMonetize:**
- **SDK:** Injected in `(main)/layout.tsx`.
- **Delivery:** Games render via `iframe` in `GameView.tsx`.

---

## SECTION 5: Data Flow — End to End

**Flow A — Game Discovery:**
`public/games.json` → `fetch()` in `GameContext.tsx` → Normalized via `tags.split()` → `setAllGames` state → `GameGrid.tsx` maps games → `GameCard.tsx` renders.

**Flow B — User Authentication:**
`LoginPage.tsx` → `signInWithPopup` → `onAuthStateChanged` in `use-user.tsx` → UID updated in `FirebaseContext` → `useArcadeState.ts` re-computes `RECENT_KEY` with new UID.

**Flow C — Save a Game:**
`GameCard.tsx` Heart Click → `toggleFavorite()` in `useArcadeState.ts` → `localStorage.setItem('yori_favs_GUEST_OR_UID', ...)` → `window.dispatchEvent('arcade-state-update')`.

---

## SECTION 6: Component Hierarchy

**Main Layout Hierarchy:**
- `FirebaseClientProvider` (Global Auth/DB context)
  - `GameProvider` (Game library and stats)
    - `Navbar` (Consumes User and Search context)
    - `GalaxyBackground` (Static animated layer)
    - `page` (Content)
    - `Footer` (Static links)

**Core Component Responsibilities:**
- `GameView.tsx`: Manages iframe lifecycle, SDK readiness, and fullscreen API.
- `ArcadeInsightTool.tsx`: Interfaces with Genkit flows to perform natural language search.
- `GameCard.tsx`: Memoized card to prevent re-renders during large list filtering.

---

## SECTION 7: Build Pipeline & Deployment

1. **Build:** `npm run build` triggers `next build`.
2. **Path Generation:** `src/app/games/[slug]/page.tsx` calls `generateStaticParams`, creating 5,000+ folders/HTML files.
3. **Export:** Files move to `out/` directory.
4. **Environment Variables:** `NEXT_PUBLIC_FIREBASE_CONFIG` must be present during build for client-side Auth to function.

---

## SECTION 8: SEO Implementation

- **Dynamic Metadata:** `generateMetadata` in `[slug]/page.tsx` generates titles: `Play ${game.title} Online Free - YoriGames`.
- **Structured Data:** `GamePage` injects JSON-LD with `@type: VideoGame`, `aggregateRating`, and `offers`.
- **Canonicalization:** `robots.ts` and `sitemap.ts` point strictly to `yorigamesonline.online`.

---

## SECTION 9: Technical Debt & Risks

**Critical Issues:**
- **Large JSON Size:** `games.json` is approaching 2MB. This may cause a "long task" during React hydration on low-end mobile devices.
- **Search Latency:** `Fuse.js` indexing 5,000 items happens on every page load of `/search`.

**High Priority:**
- `src/components/game/GameView.tsx`: Fullscreen logic uses `(containerRef.current as any).webkitRequestFullscreen` which is non-standard but required for iOS Safari.

---

## SECTION 10: Rules for Future Development

**NEVER DO:**
- Add `cookies()` or `headers()` to any file.
- Use `next/image` without `unoptimized: true` (Export requirement).
- Put scripts in the root `src/app/layout.tsx`.

**ALWAYS DO:**
- Use the `force-static` export const on new pages.
- Wrap `useSearchParams()` in a `<Suspense>` boundary.
- Scope `localStorage` keys using the `uid` from `useArcadeState`.

---

## SECTION 11: Pending Tasks

| Priority | Task | Blocked By | Complexity |
|----------|------|-----------|------------|
| High | Migrate Profile Sync to real-time Firestore | None | Medium |
| Medium | Chunk games.json into category-specific files | Build logic | High |
| Low | Add Achievements/XP system logic | Firestore Rules | Medium |
