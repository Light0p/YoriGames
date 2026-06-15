import { getSearchableGames } from '@/lib/games';

export const revalidate = 3600;

export async function GET() {
  const games = await getSearchableGames(5000);
  
  const index = games.map(g => ({
    slug: g.slug,
    title: g.title,
    category: g.category,
    thumb: g.thumb || g.thumbnail || '',
  }));

  return Response.json(index, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
