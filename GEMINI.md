# YoriGames — Project Context for Gemini

## Project Overview
- **What this project is**: A high-performance web-based arcade platform for indie pixel-art games, designed for instant browser play with zero installations.
- **Live URL**: https://yorigamesonline.online
- **Tech Stack**: Next.js 15.5.9 (App Router), Firebase 11.9.1 (Auth, Firestore, Storage), Tailwind CSS 3.4.1, ShadCN UI, Lucide Icons, and Genkit for AI features.

## Architecture Decisions (CRITICAL)
- **output: 'export'**: The application is configured for a static export. This means **ZERO** server-side features are supported. No API routes (except during build), no `cookies()`, no `headers()`, and no middleware.
- **Client-Side Data Strategy**: Since the app is static, the entire game library (5,000+ games) is fetched once as a JSON file from `/games.json` and managed in a client-side React Context (`GameContext.tsx`) for instant searching and filtering.
- **Route Group (main)**: User-facing UI and "heavy" scripts are isolated inside the `(main)` route group. This ensures that global scripts (AdSense, GameMonetize) and Providers (Firebase, GameStore) only inject HTML into the website pages, leaving system files like `sitemap.xml` clean and valid.
- **Persistence**: User data (Recently Played, Favorites) is stored in `localStorage` using UID-scoped keys to ensure cross-device consistency via Firebase synchronization.

## Current File Structure (Key Files Only)
- `src/app/layout.tsx`: Minimal root shell for system-wide compatibility.
- `src/app/(main)/layout.tsx`: The primary UI wrapper containing fonts, analytics, scripts, and context providers.
- `src/context/GameContext.tsx`: The engine that loads the library and handles global game stats.
- `src/lib/games.ts`: Server-side logic for generating static paths and sitemaps during build.
- `src/hooks/useArcadeState.ts`: Manages `localStorage` with strict authentication isolation.
- `src/components/game/GameView.tsx`: The core game player component with fullscreen and orientation logic.
- `public/games.json`: The static database generated from the GameMonetize uplink.

## Bugs Already Fixed (Do Not Redo These)
- **Tags Runtime Error**: Fixed `g.tags.some is not a function` by normalizing tags into arrays during the library fetch in `GameContext.tsx`.
- **Sitemap Corruption**: Resolved XML syntax errors by moving scripts out of the root layout and into the `(main)` route group.
- **Fullscreen Distortion**: Fixed game stretching in landscape mode by using `aspect-video` containers and `max-h-full` constraints.
- **Walkthrough UI Conflict**: Removed custom overlay shields that were blocking clicks on the walkthrough video iframe.
- **Pagination Performance**: Implemented client-side pagination on the search results to prevent UI lag when viewing large categories.

## Bugs Still Pending (In Priority Order)
1. **Parallel Route Conflict**: Need to ensure all root-level folders (`games/`, `search/`) are fully migrated to `(main)/` to clear Next.js build warnings.
2. **Profile Sync Delay**: Investigating a race condition where avatar updates take a few seconds to reflect in the navigation bar.

## Rules — Never Break These
- **No SSR**: Never add server-side features (API routes, `cookies()`, `headers()`, `middleware`).
- **Static Config**: Always add `export const dynamic = 'force-static'` to new page files to ensure they are included in the export.
- **Error Transparency**: Never set `ignoreBuildErrors: true` in `next.config.ts`.
- **Search Hooks**: Always wrap `useSearchParams()` in a `<Suspense>` boundary to prevent hydration mismatches during static generation.
- **Storage Privacy**: Always use user-specific localStorage keys: `yori_${uid}_keyname`.
- **Icon Integrity**: Use Lucide icons only. Do not hallucinate icons like `Tooth` or `Asteroid`; use SVGs if not available.

## What Has Been Deployed vs What Is Local Only
- **Deployed**: Core arcade engine, mobile-responsive layout, and Firebase authentication.
- **Local/Pending Push**: Finalized Route Group structure and high-performance fuzzy search pagination improvements.
