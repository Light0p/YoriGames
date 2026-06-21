# YoriGames — Technical Architecture Documentation

**Last Verified:** 2024-05-22

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

## SECTION 6: Rules for Future Development

**NEVER DO:**
- Add `api/` routes that require a Node.js runtime.
- Use `next/image` without `unoptimized: true` (Export requirement).
- Use `cookies()` or `headers()` in any component.

**ALWAYS DO:**
- Use `force-static` on new routes.
- Wrap `useSearchParams()` in `<Suspense>`.
- Scope `localStorage` to the current `uid`.