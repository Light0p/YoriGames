import { getSearchableGames } from '@/lib/games';

/**
 * Search Index API
 * (Renamed to _route.ts to exclude from static export)
 */
export async function GET() {
  const games = await getSearchableGames(5000);
  
  const index = games.map(g => ({
    slug: g.slug,
    title: g.title,
    category: g.category,
    thumb: g.thumb || g.thumbnail || '',
  }));

  return Response.json(index);
}
